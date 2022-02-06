const express = require('express');
const { Cliente } = require('../db');
const router = express();

const clientes = require("./clientes")
const usuario = require("./usuario")
router.use("/", clientes);
router.use("/", usuario);

module.exports = router;