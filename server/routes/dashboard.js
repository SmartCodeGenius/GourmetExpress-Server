const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.get('/', authorization, async (req, res) => {
    try {
        // req.usuario them o 'payload'
        let query = "SELECT * FROM usuarios WHERE id_usuario = $1";

        const usuario = await pool.query(query, [req.usuario]);
        
        res.json(usuario.rows[0]);
        // console.log(usuario);
 
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Erro no servidor');
    }
});


module.exports = router;