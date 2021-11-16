const express = require('express');
const { Cliente } = require('../db');
const router = express();

const clientes = require("./clientes")
router.use("/", clientes);

module.exports = router;