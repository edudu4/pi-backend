const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const Produto = require("../models/produto_model");
const Usuario = require("../models/usuario_model");

function cifrarSenha(senha, salt) {
  console.log(senha, salt);
  const hash = crypto.createHmac("sha256", salt);
  hash.update(senha);
  return hash.digest("hex");
}

async function criar(req, res) {
  const salt = crypto.randomBytes(16).toString("hex");
  const senhaCifrada = cifrarSenha(req.body.senha, salt);
  const novoUsuario = {
    email: req.body.email,
    senha: senhaCifrada,
    salt,
  };

  await Usuario.create(novoUsuario);
  res.status(201).json(novoUsuario);
}

async function entrar(req, res) {
  const usuario = await Usuario.findOne({ email: req.body.email });
  if (usuario) {
    const senhaCifrada = cifrarSenha(req.body.senha, usuario.salt);
    if (senhaCifrada === usuario.senha) {
      res.json({
        token: jwt.sign({ email: usuario.email }, process.env.SEGREDO, {
          expiresIn: "2m",
        }),
      });
    } else {
      res.status(401).json({ msg: "acesso negado" });
    }
  } else {
    res.status(400).json({ msg: "credenciais invalidas" });
  }
}

function renovar(req, res) {
  const token = req.headers["authorization"];
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.SEGREDO);
      res.json({
        token: jwt.sign({ email: payload.email }, process.env.SEGREDO, {
          expiresIn: "2m",
        }),
      });
    } catch (err) {
      res.status(401).json({ msg: "token invalido" });
    }
  } else {
    res.status(400).json({ msg: "Token não encontrado" });
  }
}

module.exports = { criar, entrar, renovar };