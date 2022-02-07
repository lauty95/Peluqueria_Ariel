const { Cliente, Usuario } = require('../db');
const express = require('express');
const router = express();

const mayorFecha = (a, b) => a = a > b ? a : b

router.post('/newUser', async (req, res) => {
    const { id, nombre, telefono } = req.body
    try {
        await Usuario.create({
            id,
            nombre,
            telefono,
        });
        res.status(200).send({ msg: 'created' })
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
})

router.get('/usuario/:id', async (req, res) => {
    const { id } = req.params
    let registros = []
    let registrosOrdenados = []
    let ultimoTurno = []
    try {
        registros = await Cliente.findAll({
            where: {
                idCliente: id
            }
        })

        registrosOrdenados = registros.reduce((a, b) => mayorFecha(a.diaPromo, b.diaPromo), 0)
        ultimoRegistro = registros.reduce((a, b) => mayorFecha(a.dia, b.dia), 0)
        ultimoTurno = await Cliente.findAll({
            where: {
                idCliente: id,
                dia: ultimoRegistro
            }
        })
    } catch {
        console.log('No se registran clientes con la id ', id)
    }
    try {
        let boolPromo = registros.length % 2 === 1
        const user = await Usuario.findAll({
            where: {
                id
            }
        })
        const resultado = {
            id: user[0].id,
            nombre: user[0].nombre,
            telefono: user[0].telefono,
            tienePromo: boolPromo,
            diaPromo: registrosOrdenados.length > 0 ? registrosOrdenados === 0 ? '' : registrosOrdenados : '',
            ultimoRegistro,
            turno: ultimoTurno.length > 0 ? ultimoTurno[0].turno : '',
        }
        res.json(resultado)
    } catch (err) {
        res.json(err)
    }
})

module.exports = router;