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

    const buscarUsuario = async (info) => {
        const user = await Usuario.findAll({
            where: {
                id
            }
        })

        let resultado
        if (info) {
            resultado = {
                id: user[0].id,
                nombre: user[0].nombre,
                telefono: user[0].telefono,
                tienePromo: ultimoTurno.length > 0 && ultimoTurno[0].tienePromo,
                diaPromo: registrosOrdenados.length > 0 ? registrosOrdenados === 0 ? '' : registrosOrdenados : '',
                ultimoRegistro,
                turno: ultimoTurno.length > 0 ? ultimoTurno[0].turno : '',
            }
        } else {
            resultado = {
                id: user.length > 0 ? user[0].id : '',
                nombre: user.length > 0 ? user[0].nombre : '',
                telefono: user.length > 0 ? user[0].telefono : '',
                tienePromo: true,
                diaPromo: '',
                ultimoRegistro: '',
                turno: '',
            }
        }
        res.status(200).json(resultado)
    }

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
        buscarUsuario(true)
    } catch {
        console.log('No se registran clientes con la id ', id)
        buscarUsuario(false)
    }
})

router.get('/allUsers', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll()
        res.status(200).json(usuarios)
    } catch (err) {
        res.json(err)
    }
})

router.post('/deleteUser/:id', async (req, res) => {
    const { id } = req.params
    try {
        await Usuario.destroy({
            where: {
                id: id
            }
        })
            .then(() => res.status(200).send({ msg: 'El usuario fué removido' }))
    } catch (err) {
        res.json(err)
    }
})

router.put('/updateUser', async (req, res) => {
    const data = req.body
    try {
        await Usuario.update({ nombre: data.nombre, telefono: data.telefono }, {
            where: {
                id: data.id
            }
        })

        res.status(200).json({ msg: 'user edited' })
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;