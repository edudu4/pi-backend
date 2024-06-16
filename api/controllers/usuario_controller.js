const crypto = require("crypto");

const Usuario = require("../models/usuario");
const Produto = require('../models/produto');

const cifrarSenha = (senha, salt) => {
    const hash = crypto.createHmac("sha256", salt);
    hash.update(senha);
    return hash.digest("hex");
}
const validar = async (req, res) => {
    try {
        console.log("validou")
        const usuario = new Usuario(req.body);
        await usuario.validate();
        return next();
    } catch (err) {
        return res.status(422).json({ msg: "Usuário inválido" });
    }
}

const comprarProdutos = async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.usuarioAtualId);
    const usuario = await Usuario.findOne({ _id: id });

    if (!Array.isArray(req.body)) res.status(400).json({ msg: 'É necessário uma lista de produtos' });

    for (let produtoDto of req.body) {
        const produto = new Produto(produtoDto);
        await produto.validate();
        usuario.produtos.push(produto);
    }

    await usuario.validate();
    await usuario.save();

    return res.status(201).json({ msg: 'Produto comprado com sucesso.' })
}


const buscarPorId = async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const usuario = await Usuario.findOne({ _id: id });
        if (usuario) next();
        return res.status(404).json({ msg: 'Usuário não encontrado' });
    } catch (err) {
        return res.status(400).json({ msg: 'Id inválido' });
    }
};

const listar = async (req, res) => {
    const usuarios = await Usuario.find({});
    const usuariosSemSenha = usuarios.map(({ senha, salt, ...usuarioSemSenha }) => usuarioSemSenha);
    return res.status(200).json(usuariosSemSenha);
}

const buscar = async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const usuario = await Usuario.findOne({ _id: id });
    return res.json(usuario);
}

const criar = async (req, res) => {
    let senha = req.body.senha;
    if (!senha) return res.status(400).json({ msg: 'Senha inválida' });
    const salt = crypto.randomBytes(16).toString("hex");
    const senhaCifrada = cifrarSenha(senha, salt, res);
    const novoUsuario = {
        email: req.body.email,
        senha: senhaCifrada,
        nome: req.body.nome,
        idade: req.body.idade,
        salt,
    };

    await Usuario.create(novoUsuario);
    return res.status(201).json(novoUsuario);
}

const atualizar = async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const usuario = await Usuario.findOneAndUpdate({ _id: id });
    return res.json(usuario);
}

const remover = async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id);
    await Usuario.findOneAndDelete({ _id: id });
    return res.status(204).end();
}

module.exports = { validar, comprarProdutos, buscarPorId, listar, buscar, criar, atualizar, remover };