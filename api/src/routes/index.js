const express = require('express');
const router = express();

const clientes = require("./clientes")
const usuario = require("./usuario")
const notificaciones = require("./notificaciones")
router.use("/", clientes);
router.use("/", usuario);
router.use("/", notificaciones);

module.exports = router;