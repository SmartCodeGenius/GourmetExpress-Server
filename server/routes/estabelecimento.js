const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.get('/', authorization, async(req, res) => {
    try {
        let query = "SELECT * FROM estabelecimentos WHERE id_usuario = $1";
        const estabelecimentos = await pool.query(query, [req.usuario]);

        res.json(estabelecimentos.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Erro no servidor');
    }
});

router.get('/getAllEstabelecimentos', authorization, async(req, res) => {
    try {
        let query = "SELECT * FROM estabelecimentos";
        const estabelecimentos = await pool.query(query);

        res.json(estabelecimentos.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Erro no servidor');
    }
});

router.get('/:id', authorization, async(req, res) => {
    try {
        let query = "SELECT * FROM estabelecimentos WHERE id_estabelecimento = $1";
        const estabelecimentos = await pool.query(query, [req.params.id]);

        res.json(estabelecimentos.rows[0]);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Erro no servidor');
    }
});

router.post('/registro', authorization, async(req, res) => {
    try {

        const { nome, endereco, descricao } = req.body;

        const dadosEstabelecimento = await pool.query('SELECT * FROM estabelecimentos WHERE nome_estabelecimento = $1', [nome]);

        if(dadosEstabelecimento.rows.length !== 0) {
            return res.status(401).send('Estabelecimento já existe');
        }

        const novoEstabelecimento = await pool.query('INSERT INTO estabelecimentos(nome_estabelecimento, endereco_estabelecimento, descricao_estabelecimento, id_usuario) VALUES ($1, $2, $3, $4) RETURNING *', [nome, endereco, descricao, req.usuario]);

        res.json(novoEstabelecimento.rows);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Erro no servidor');
    }
});

module.exports = router;