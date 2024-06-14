const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        match: [/.+\@.+\..+/, 'Por favor informe um email válido'],
    },
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        minlength: [3, 'Nome precisa ter pelo menos 3 caracteres'],
    },
    idade: {
        type: Number,
        required: [true, 'Idade é obrigatório']
    },
    senha: {
        type: String,
        required: [true, 'Senha é obrigatória'],
        minlength: [8, 'Senha precisa ter pelo menos 8 caracteres']
    },
    salt: {
        type: String,
        required: [true, 'Salt é obrigatório']
    },
    produtos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto'
    }],
});

module.exports = mongoose.model("Usuario", userSchema);

