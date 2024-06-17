const crypto = require("crypto");
const mongoose = require("mongoose");

const Usuario = require("../models/usuario");
const Produto = require('../models/produto');

const cifrarSenha = (senha, salt) => {
    const hash = crypto.createHmac("sha256", salt);
    hash.update(senha);
    return hash.digest("hex");
}
const validar = async (req, res, next) => {
    try {
        const usuario = new Usuario(req.body);
        await usuario.validate(req.body);
        return next();
    } catch (err) {
        return res.status(422).json({ msg: "Usuário inválido" });
    }
}

const comprarProdutos = async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.usuarioAtualId);
    const usuario = await Usuario.findOne({ _id: id });

    if (!req.body || !Array.isArray(req.body)) return res.status(422).json({ msg: 'É necessário uma lista de produtos' });


    for (let produtoDto of req.body) {
        const id = new mongoose.Types.ObjectId(produtoDto._id);
        const produto = await Produto.findOne({ _id: id });
        if (!produto) return res.status(404).json({ msg: 'Produto não encontrado' });
        console.log(produto);
        usuario.produtos.push(produto);
    }

    await usuario.validate();
    await usuario.save();

    return res.status(201).json({ msg: 'Produto comprado com sucesso.' });
}


const buscarPorId = async (req, res, next) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const usuario = await Usuario.findOne({ _id: id });
        if (usuario) return next();
        return res.status(404).json({ msg: 'Usuário não encontrado' });
    } catch (err) {
        return res.status(400).json({ msg: 'Id inválido' });
    }
};

const listar = async (req, res) => {
    const usuarios = await Usuario.find().lean();
    const usuariosSemSenha = usuarios.map(({ __v, senha, salt, ...usuarioSemSenha }) => usuarioSemSenha);
    return res.status(200).json(usuariosSemSenha);
}

const buscar = async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const usuario = await Usuario.findOne({ _id: id });
    const usuarioSemSenha = usuario.toObject();
    delete usuarioSemSenha.salt;
    delete usuarioSemSenha.senha;
    return res.json(usuarioSemSenha);
}

const criar = async (req, res) => {
    let senha = req.body.senha;
    const salt = crypto.randomBytes(16).toString("hex");
    const senhaCifrada = cifrarSenha(senha, salt, res);
    const novoUsuario = {
        email: req.body.email,
        senha: senhaCifrada,
        nome: req.body.nome,
        idade: req.body.idade,
        salt,
    };

    try {
        const usuarioSalvo = await Usuario.create(novoUsuario);
        const usuarioSemSenha = usuarioSalvo.toObject();
        delete usuarioSemSenha.salt;
        delete usuarioSemSenha.senha;
        return res.status(201).json(usuarioSemSenha);
    } catch (err) {
        return res.status(422).json({ msg: "Usuário já cadastrado" });
    }
}

const atualizar = async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const usuario = await Usuario.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true });
        return res.json(usuario);
    } catch (err) {
        return res.status(422).json({ msg: `Campo ${err.path} inválido` });
    }
}

const remover = async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id);
    await Usuario.findOneAndDelete({ _id: id });
    return res.status(204).end();
}

module.exports = { validar, cifrarSenha, comprarProdutos, buscarPorId, listar, buscar, criar, atualizar, remover };