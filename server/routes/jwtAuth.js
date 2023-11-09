const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../middleware/validInfo');
const authorization = require('../middleware/authorization');

// -> Rota de registro
router.post('/registro', validInfo, async(req, res) => {
    try {
        
        //1. destruturar o req.body (name, email, password)

        const { nome, email, senha } = req.body;

        //2. checar se usuário existe (se sim, então jogar erro)

        const usuario = await pool.query('SELECT * FROM usuarios WHERE email_usuario = $1', [email]);

        if (usuario.rows.length !== 0) {
            return res.status(401).send('Usuário já existe');
        }

        //3. criptografar senha do usuário com 'bcrypt'

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptSenha = await bcrypt.hash(senha, salt);

        //4. inserir o novo usuário dentro do banco de dados

        const novoUsuario = await pool.query('INSERT INTO usuarios(nome_usuario, email_usuario, senha_usuario) VALUES ($1, $2, $3) RETURNING *', [nome, email, bcryptSenha]);

        //5. gerar jwt token

        const token = jwtGenerator(novoUsuario.rows[0].id_usuario);

        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro do servidor')
    }
});

// -> Rota de login

router.post('/login', validInfo, async (req, res) => {
    try {
        
        //1. destruturar req.body
        
        const { email, senha } = req.body;

        //2. checar se usuário não existe (caso não, jogar um erro)

        const usuario = await pool.query('SELECT * FROM usuarios WHERE email_usuario = $1', [email]);

        if (usuario.rows.length === 0) {
            return res.status(404).json('Senha ou Email incorreto');
        }
        
        //3. verificar se a senha é a mesma senha salva no banco de dados
        
        const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha_usuario);

        if(!senhaValida) {
            return res.status(401).json('Senha ou Email incorreto');
        }

        //4. dar um jwt token ao completar todas as etapas

        const token = jwtGenerator(usuario.rows[0].id_usuario);

        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro do servidor')
    }
});

router.get('/eh-verificado', authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro do servidor')        
    }
});

module.exports = router;