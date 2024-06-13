const mongoose = require("mongoose");

const produtoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Nome do produto é obrigatório'],
        minlength: [3, 'Nome do produto precisa ter pelo menos 3 caracteres'],
    },
    preco: {
        type: Number,
        required: [true, 'Preco do produto é obrigatório'],
        min: [0, 'Preço do produto inválido'],
    },
    emEstoque: {
        type: Boolean,
        default: true,
    }
});

module.exports = mongoose.model("Produto", produtoSchema);