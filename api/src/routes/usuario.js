const { Cliente, Usuario } = require('../db');
const express = require('express');
const router = express();
const { Op } = require('sequelize');

function acomodarFecha(date) {
    let dia = date.split('-')[0]
    let mes = date.split('-')[1] - 1
    let anio = "" + date.split('-')[2]
    let nuevaFecha = new Date(anio, mes, dia)
    return nuevaFecha
}

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
        res.status(500).send(e);
    }
})

router.get('/usuario/:id', async (req, res) => {
    const { id } = req.params
    let registros = []

    try {
        registros = await Cliente.findAll({
            where: {
                idCliente: id
            }
        })
        registros = registros.map(item => {
            return {
                id: item.id,
                nombre: item.nombre,
                telefono: item.telefono,
                tienePromo: item.tienePromo,
                dia: item.dia,
                diaPromo: item.diaPromo,
                turno: item.turno,
                idCliente: item.idCliente,
                ocupado: item.ocupado,
                ultimoRegistro: item.dia
            }
        })
        res.status(200).json(registros)
    } catch {
        console.log('No se registran clientes con la id ', id)
        res.status(400).json({ error: 'No se registran clientes con esa id' })
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

router.get('/cantUsers', async (req, res) => {
    try {
        const cantidad = await Usuario.count()
        res.status(200).json(cantidad)
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

router.get('/actualizarPromos', async (req, res) => {
	console.log("ActualizarPromos");
    try {
        registros = await Cliente.update({ diaPromo: '30-11-2022' },
            {
                where: {
                    [Op.or]: [
                        { diaPromo: "1-12-2022" },
                        { diaPromo: "2-12-2022" },
                        { diaPromo: "3-12-2022" },
                        { diaPromo: "4-12-2022" },
                        { diaPromo: "5-12-2022" },
                        { diaPromo: "6-12-2022" },
                        { diaPromo: "7-12-2022" },
                        { diaPromo: "8-12-2022" },
                        { diaPromo: "9-12-2022" },
                        { diaPromo: "10-12-2022" },
                        { diaPromo: "11-12-2022" },
                        { diaPromo: "12-12-2022" },
                        { diaPromo: "13-12-2022" },
                        { diaPromo: "14-12-2022" },
                        { diaPromo: "15-12-2022" },
                        { diaPromo: "16-12-2022" },
                        { diaPromo: "17-12-2022" },
                        { diaPromo: "18-12-2022" },
                        { diaPromo: "19-12-2022" },
                        { diaPromo: "20-12-2022" },
                        { diaPromo: "21-12-2022" },
                        { diaPromo: "22-12-2022" },
                    ]
                }
            })
        res.status(200).json(registros)
    } catch (err) {
	console.log(err);
        res.status(500).send(err)
    }
})

module.exports = router;
