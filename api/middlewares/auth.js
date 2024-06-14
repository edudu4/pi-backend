const jwt = require("jsonwebtoken");
const Usuario = require('../models/usuario');

const autenticar = (req, res, next) => {
    const token = req.headers["authorization"];

    if (token) {
        try {
            const token = jwt.verify(token, process.env.SEGREDO);
            req.usuarioAtualId = token.id;
            return next();
        } catch (err) {
            return res.status(401).json({ msg: "Acesso negado" });
        }
    }
    return res.status(400).json({ msg: "Token inválido" });

}

const login = async (req, res) => {
    const usuario = await Usuario.findOne({ email: req.body.email });
    if (usuario) {
        const senhaCifrada = cifrarSenha(req.body.senha, usuario.salt);
        if (senhaCifrada === usuario.senha) {
            return res.json({
                token: jwt.sign({ id: usuario._id }, process.env.SEGREDO, {
                    expiresIn: "5m",
                }),
            });
        } else {
            return res.status(401).json({ msg: "Acesso negado" });
        }
    }
    res.status(400).json({ msg: "Credenciais invalidas" });
}


const refreshToken = (req, res) => {
    const token = req.headers["authorization"];
    if (token) {
        try {
            const payload = jwt.verify(token, process.env.SEGREDO);
            return res.json({
                token: jwt.sign({ email: payload.email }, process.env.SEGREDO, {
                    expiresIn: "2m",
                }),
            });
        } catch (err) {
            return res.status(401).json({ msg: "token invalido" });
        }
    }
    res.status(400).json({ msg: "Token não encontrado" });
}

module.exports = { autenticar, login, refreshToken };