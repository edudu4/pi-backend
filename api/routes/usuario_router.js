const express = require('express');
const usuarioController = require('../controllers/usuario_controller');

const router = express.Router();

router.get('/', usuarioController.listar);
router.get('/:id', usuarioController.buscarPorId, usuarioController.buscar);
router.put('/:id', usuarioController.buscarPorId, usuarioController.atualizar);
router.delete('/:id', usuarioController.buscarPorId, usuarioController.remover);

module.exports = router;