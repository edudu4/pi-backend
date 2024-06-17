const express = require('express');
const produtoController = require('../controllers/produto_controller');
const usuarioController = require('../controllers/usuario_controller');

const router = express.Router();

router.get('/', produtoController.listar);
router.get('/:id', produtoController.buscarPorId, produtoController.buscar);
router.post('/comprar', usuarioController.comprarProdutos);
router.post('/', produtoController.validar, produtoController.criar);
router.put('/:id', produtoController.buscarPorId, produtoController.atualizar);
router.delete('/:id', produtoController.buscarPorId, produtoController.remover);

module.exports = router;