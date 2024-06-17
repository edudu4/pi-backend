const mongoose = require("mongoose");

const Produto = require("../models/produto");

const validar = async (req, res, next) => {
    try {
        if (Array.isArray(req.body)) {
            for (let produtoDto of req.body) {
                const produto = new Produto(produtoDto);
                await produto.validate();
            }
            return next();
        }
        const produto = new Produto(req.body);
        await produto.validate();
        return next();
    } catch (err) {
        return res.status(422).json({ msg: "Produto inválido" });
    }
}

const buscarPorId = async (req, res, next) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const produto = await Produto.findOne({ _id: id });
        if (produto) return next();
        return res.status(404).json({ msg: 'Produto não encontrado' });
    } catch (err) {
        return res.status(400).json({ msg: 'Id inválido' });
    }
};

const listar = async (req, res) => {
    const produtos = await Produto.find({});
    return res.status(200).json(produtos);
}

const buscar = async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const produto = await Produto.findOne({ _id: id });
    return res.json(produto);
}

const criar = async (req, res) => {
    const produto = new Produto(req.body);
    await Produto.create(produto);
    return res.status(201).json(produto);
}

const atualizar = async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const produto = await Produto.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true });
        return res.json(produto);
    }
    catch (err) {
        return res.status(422).json({ msg: `Campo ${err.path} inválido` });
    }
}

const remover = async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id);
    await Produto.findOneAndDelete({ _id: id });
    return res.status(204).end();
}

module.exports = { validar, buscarPorId, listar, buscar, criar, atualizar, remover };