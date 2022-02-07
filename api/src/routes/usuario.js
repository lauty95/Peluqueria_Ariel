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
    try {
        const registros = await Cliente.findAll({
            where: {
                idCliente: id
            }
        })

        let registrosOrdenados = registros.reduce((a, b) => mayorFecha(a.diaPromo, b.diaPromo), 0)
        let ultimoRegistro = registros.reduce((a, b) => mayorFecha(a.dia, b.dia), 0)
        let ultimoTurno = await Cliente.findAll({
            where: {
                idCliente: id,
                dia: ultimoRegistro
            }
        })
        
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
            diaPromo: registrosOrdenados === 0 ? '' : registrosOrdenados,
            ultimoRegistro,
            turno: ultimoTurno[0].turno,
        }
        res.json(resultado)
    } catch (err) {
        res.json(err)
    }
})

module.exports = router;