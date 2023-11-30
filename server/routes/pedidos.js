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

router.post('/realizarPedido', async(req, res) => {
    try {
        const { idProduto, adicional, quantia } = req.body;

        const novoPedido = await pool.query('INSERT INTO pedidos(id_produto, adicional, quantia) VALUES ($1, $2, $3) RETURNING *', [idProduto, adicional, quantia]);

        console.log("Pedido: ", novoPedido.rows[0]);

        res.json('Pedido criado com sucesso');

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro do servidor')
    }
});

module.exports = router;