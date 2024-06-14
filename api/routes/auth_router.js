const express = require('express');
const authMiddleware = require('../middlewares/auth');
const usuarioController = require('../controllers/usuario_controller');

const router = express.Router();

router.post('/', authMiddleware.login);
router.post('/refresh', authMiddleware.refreshToken);
router.post('/cadastrar', usuarioController.criar);

module.exports = router;