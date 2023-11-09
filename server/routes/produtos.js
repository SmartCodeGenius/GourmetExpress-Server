const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.get('/', authorization, async(req, res) => {
    try {
        const estabelecimentoId = req.headers['estabelecimento-id'];
        let query = "SELECT * FROM produtos WHERE id_estabelecimento = $1";
        const produtos = await pool.query(query, [estabelecimentoId]);

        res.json(produtos.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro do servidor')
    }
});

router.post('/criaProduto', authorization, async(req, res) => {
    try {
        const estabelecimentoId = req.headers['estabelecimento-id'];
        const { nome, preco, ingredientes } = req.body;

        const dadosProduto = await pool.query('SELECT * FROM produtos WHERE nome_produto = $1', [nome]);

        if(dadosProduto.rows.length !== 0) {
            return res.status(401).send('Estabelecimento já existe');
        }

        const novoProduto = await pool.query('INSERT INTO produtos(id_estabelecimento, nome_produto, preco_produto, ingredientes_produto) VALUES ($1, $2, $3, $4) RETURNING *', [estabelecimentoId, nome, preco, ingredientes]);

        res.json(novoProduto.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro do servidor')

    }
});

router.delete('/deletaProduto', authorization, async(req, res) => {
    try {
        const produtoId = req.headers['produto-id'];
        const estabelecimentoId = req.headers['estabelecimento-id'];

        let queryUm = "DELETE FROM produtos WHERE id_produto = $1";
        const produtoDeletado = await pool.query(queryUm, [produtoId]);
        let queryDois = "SELECT * FROM produtos WHERE id_estabelecimento = $1";
        const novaListaProdutos = await pool.query(queryDois, [estabelecimentoId]);

        res.json(novaListaProdutos.rows);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Erro no servidor');
    }
});

module.exports = router;