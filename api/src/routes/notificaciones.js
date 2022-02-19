const express = require('express');
const router = express();
const { Cliente, Precio } = require('../db');
const { Client } = require('whatsapp-web.js');
const fs = require('fs')
const SESSION_FILE_PATH = './src/session.json'
var qrcode = require('qrcode-terminal');
const uuid4 = require('uuid4')

let client
let sessionData;
let whatsappOn = false

const withSession = () => {
    // Si exsite cargamos el archivo con las credenciales
    console.log('Validando session con Whatsapp...')
    sessionData = require('../session.json');
    client = new Client({
        puppeteer: {
            args: [
                '--no-sandbox',
            ],
        },
        session: sessionData
    });

    client.on('ready', () => {
        console.log('Client is ready!');
        whatsappOn = true
    });

    client.on('auth_failure', () => {
        console.log('** Error de autentificacion vuelve a generar el QRCODE (Borrar el archivo session.json) **');
    })

    client.initialize();
}

const withOutSession = () => {
    console.log('No hay sesion guardada')
    client = new Client({
        puppeteer: {
            args: [
                '--no-sandbox',
            ],
        }
    });

    client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
        codigo = { qr }
    })

    client.on('authenticated', (session) => {
        //guardamos credenciales de session
        sessionData = session
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
            if (err) {
                console.log(err)
            }
        })
    })

    client.on('ready', () => {
        console.log('Client is ready!');
        whatsappOn = true
    });

    client.initialize()
}

(fs.existsSync(SESSION_FILE_PATH)) ? withSession() : withOutSession()

function acomodarFecha(date) {
    let dia = date.split('-')[0]
    let mes = date.split('-')[1] - 1
    let anio = "" + 20 + date.split('-')[2]
    let nuevaFecha = new Date(anio, mes, dia)
    return nuevaFecha
}

function devolverFecha(date) {
    const fecha = date.getDate()
    const mes = date.getMonth() + 1
    const anio = date.getFullYear()
    return fecha + "-" + mes + "-" + anio
}

router.post("/newClient", async (req, res) => {
    var { dia, tienePromo } = req.body
    const { id, nombre, telefono, turno } = req.body
    let calculoFecha = acomodarFecha(dia)
    calculoFecha.setDate(calculoFecha.getDate() + 21)
    const diaPromo = devolverFecha(calculoFecha)
    const diaCompleto = devolverFecha(acomodarFecha(dia))
    try {
        const cantidadRegistros = await Cliente.findAll({
            where: {
                idCliente: id
            }
        })

        if (cantidadRegistros.length === 0) {
            tienePromo = true
        }

        await Cliente.create({
            id: uuid4(),
            nombre,
            telefono,
            tienePromo,
            dia: diaCompleto,
            diaPromo: diaPromo,
            turno,
            idCliente: id,
        });
        res.status(200).send({ msg: 'created' })
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
    try {
        if (whatsappOn) {
            client.isRegisteredUser(`549${telefono}@c.us`).then(function (isRegistered) {
                if (isRegistered) {
                    client.sendMessage(`549${telefono}@c.us`, `*ARIEL LUQUE PELUQUERIA DE CABALLEROS* Agradece tu reserva el día ${dia} a las ${turno} Hs. Te espero ${nombre}.`);
                }
            })
        }
    } catch (e) {
        console.log('wsp error connection')
    }
})

const agregarGuiones = (date) => {
    return date.split("/")[0] + "-" + date.split("/")[1] + "-" + "20" + date.split("/")[2]
}

router.get('/promocion/:cantidadDias', async (req, res) => {
    const { cantidadDias } = req.params
    let diaPromo = new Date()
    diaPromo.setDate(diaPromo.getDate() + Number(cantidadDias))
    diaPromo = diaPromo.toLocaleString('es-AR', { dateStyle: 'short' })
    diaPromo = agregarGuiones(diaPromo)
    try {
        const clientes = await Cliente.findAll({
            where: {
                diaPromo,
                tienePromo: true
            }
        })
        res.status(200).json(clientes)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.post('/enviarPromo', async (req, res) => {
    const clientes = req.body

    let findPrice = await Precio.findAll()
    let precio = findPrice.pop().precio

    try {
        if (whatsappOn) {
            clientes.forEach(cliente =>
                client.isRegisteredUser(`549${cliente.telefono}@c.us`).then(function (isRegistered) {
                    if (isRegistered) {
                        client.sendMessage(`549${cliente.telefono}@c.us`,
                            `*ARIEL LUQUE PELUQUERIA DE CABALLEROS INFORMA*
Tienes disponible una promoción para tu siguiente corte por un valor de $${precio / 2}.
Reserva a través de nuestra sitio
https://peluqueria-ariel.vercel.app/
antes del ${cliente.diaPromo.replace("-", "/").replace("-", "/")}.
Te espero ${cliente.nombre}!`);
                    }
                })
            )
        }
        res.status(200).send("mensajes enviados")
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
})

module.exports = router;