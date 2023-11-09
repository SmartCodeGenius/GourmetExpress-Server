const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.get('/', authorization, async(req, res) => {
    try {
        const pedidos = await pool.query('SELECT * FROM pedidos');

        res.json(pedidos.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro do servidor')
    }
});
