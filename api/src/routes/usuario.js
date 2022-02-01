const { Cliente, Usuario } = require('../db');
const express = require('express');
const router = express();
const { Op } = require('sequelize');

router.post('/newUser', async (req, res) => {
    const { id, nombre, telefono } = req.body
    console.log(id, nombre, telefono);
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

router.get('/usuario', async (req, res) => {
    const { id } = req.body
    try {
        const user = await Usuario.findAll({
            where: {
                id
            }
        })
        res.json(user)
    } catch (err) {
        res.json(err)
    }
})

router.get("/mixin", async (req, res) => {
    const { idCountry } = req.query;
    const actividad = await Actividad.findAll({
        where: {
            idPais: idCountry
        }
    })
    res.json(actividad)
})

module.exports = router;