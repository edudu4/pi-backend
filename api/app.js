var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL);

var usuarioRouter = require('./routes/usuario_router');
var produtoRouter = require('./routes/produto_router');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/usuarios', usuarioRouter);
app.use('/produtos', produtoRouter);

module.exports = app;