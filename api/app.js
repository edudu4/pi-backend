var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL);

const routerApidocs = require('./routes/apidocs_router');

var usuarioRouter = require('./routes/usuario_router');
var produtoRouter = require('./routes/produto_router');
var authRouter = require('./routes/auth_router');
var authMiddleware = require('./middlewares/auth');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api-docs', routerApidocs);

app.use('/auth', authRouter);
app.use('/usuarios', authMiddleware.autenticar, usuarioRouter);
app.use('/produtos', authMiddleware.autenticar, produtoRouter);

module.exports = app;