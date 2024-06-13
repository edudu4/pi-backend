const crypto = require("crypto");

const Usuario = require("../models/usuario_model");

const cifrarSenha = (senha, salt) => {
    const hash = crypto.createHmac("sha256", salt);
    hash.update(senha);
    return hash.digest("hex");
}

const criar = async (req, res) => {
    const salt = crypto.randomBytes(16).toString("hex");
    const senhaCifrada = cifrarSenha(req.body.senha, salt);
    const novoUsuario = {
        email: req.body.email,
        senha: senhaCifrada,
        nome: req.body.nome,
        idade: req.body.idade,
        salt,
    };

    await Usuario.create(novoUsuario);
    res.status(201).json(novoUsuario);
}

module.exports = { criar  };