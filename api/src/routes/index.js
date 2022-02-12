const express = require('express');
const { Cliente } = require('../db');
const router = express();

const clientes = require("./clientes")
const usuario = require("./usuario")
const promocion = require("./promocion")
router.use("/", clientes);
router.use("/", usuario);
router.use("/", promocion);

module.exports = router;