const { Cliente, Mensaje } = require('../db');
const express = require('express');
const router = express();
const { Op } = require('sequelize');

var idActividad = 10
const horarios = [
    '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00'
]

router.post("/newClient", async (req, res) => {
    var { nombre, telefono, dia, turno } = req.body
    const turnoSplited = turno.split(':')
    const diaSplited = dia.split('-')
    const telSplited = telefono.toString().slice(6, 10)
    const id = Number(diaSplited[0]) + Number(diaSplited[1]) + Number(diaSplited[2]) + Number(turnoSplited[0]) + Number(turnoSplited[1] + Number(telSplited))
    try {
        await Cliente.create({
            id: id,
            nombre,
            telefono,
            dia,
            turno
        });
        res.status(200).send({ msg: 'created' })
    } catch (e) {
        res.send(e);
    }
})

router.get("/hoursFree/:dia", async (req, res) => {
    const dia = req.params.dia
    try {
        const turnosLibres = await Cliente.findAll({
            where: {
                dia: {
                    [Op.eq]: dia
                }
            }
        })
        let horariosDeTurnos = []
        turnosLibres.forEach(el => horariosDeTurnos.push(el.turno))
        let respuestaTurnos = horarios.filter(el => !horariosDeTurnos.includes(el))
        res.status(200).send(respuestaTurnos)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/getHours", async (req, res) => {
    res.send(horarios)
})

router.get('/getClients/:fecha', async (req, res) => {
    const { fecha } = req.params
    var clientes = await Cliente.findAll({
        where: {
            dia: {
                [Op.eq]: fecha
            }
        }
    })

    let horariosAAgregar = []

    for (let i = 0; i < horarios.length; i++)
        horariosAAgregar[i] = horarios[i]

    for (let i = 0; i < horarios.length; i++) {
        for (let j = 0; j < clientes.length; j++) {
            if (clientes[j].turno === horarios[i]) {
                horariosAAgregar[i] = clientes[j]
            }
        }
    }

    res.status(200).send(horariosAAgregar)
})

router.post('/deleteClient/:id', async (req, res) => {
    const { id } = req.params
    try {
        await Cliente.destroy({
            where: {
                id: id
            }
        })
            .then(() => res.status(200).send({ msg: 'El cliente fué removido' }))
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/adminHours/:fecha', async (req, res) => {
    const { fecha } = req.params
    const clientes = await Cliente.findAll({
        where: {
            dia: {
                [Op.eq]: fecha
            }
        }
    })
    let results = horarios.filter(el => !clientes.some((d => d.turno === el)))
    clientes.forEach(el => {
        results.unshift(el.dataValues)
    })
    res.status(200).send(results)
})

router.post('/ocuparHorario/:dia/:horario', async (req, res) => {
    const { dia, horario } = req.params

    const turnoSplited = horario.split(':')
    const diaSplited = dia.split('-')
    const id = Number(diaSplited[0]) + Number(diaSplited[1]) + Number(diaSplited[2]) + Number(turnoSplited[0]) + Number(turnoSplited[1]) + Math.floor(Math.random() * 1000)

    try {
        await Cliente.create({
            id: id,
            nombre: '',
            telefono: '',
            dia: dia,
            turno: horario,
            ocupado: "Ocupado"
        });
        res.status(200).send({ msg: `El turno de las ${horario} fue ocupado` })
    } catch (e) {
        res.status(400).send(e);
    }
})

router.post('/liberarHorario/:dia/:horario', async (req, res) => {
    const { dia, horario } = req.params
    try {
        await Cliente.destroy({
            where: {
                dia: dia,
                turno: horario
            }
        })
            .then(() => res.status(200).send({ msg: `El turno de las ${horario} fue liberado` }))
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/setearMensaje', async (req, res) => {
    const { mensaje } = req.body
    try {
        await Mensaje.create({
            mensaje
        })
            .then(() => res.status(200).send({ msg: 'Mensaje guardado' }))
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Error al guardar el mensaje' })
    }
})

router.get('/mensajeWsp', async (req, res) => {
    try {
        let mensaje = await Mensaje.findAll()
        let respuesta = mensaje.pop()
        res.status(200).json(respuesta)
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Error al obtener el mensaje' })
    }
})

module.exports = router;