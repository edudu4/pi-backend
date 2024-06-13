const jwt = require("jsonwebtoken");

const autenticar = (req, res, next) => {
    const token = req.headers["authorization"];

    if (token) {
        try {
            jwt.verify(token, process.env.SEGREDO);
            next();
        } catch (err) {
            res.status(401).json({ msg: "Token inválido" });
        }
    }
    res.status(400).json({ msg: "Token não encontrado" });

}

const login = async (req, res) => {
    const usuario = await Usuario.findOne({ email: req.body.email });
    if (usuario) {
        const senhaCifrada = cifrarSenha(req.body.senha, usuario.salt);
        if (senhaCifrada === usuario.senha) {
            res.json({
                token: jwt.sign({ email: usuario.email }, process.env.SEGREDO, {
                    expiresIn: "5m",
                }),
            });
        } else {
            res.status(401).json({ msg: "Acesso negado" });
        }
    }
    res.status(400).json({ msg: "Credenciais invalidas" });
}


const refreshToken = (req, res) => {
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
    }
    res.status(400).json({ msg: "Token não encontrado" });
}

module.exports = { autenticar, login, refreshToken };