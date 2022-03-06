const express = require('express');
const router = express();
const { Cliente, Precio, Push } = require('../db');
const uuid4 = require('uuid4');
const { PUBLIC_KEY, PRIVATE_KEY } = process.env;
const webpush = require('web-push');
let push;
webpush.setVapidDetails('mailto:lautaroJ95@gmail.com', PUBLIC_KEY, PRIVATE_KEY)

function acomodarFecha(date) {
    let dia = date.split('-')[0]
    let mes = date.split('-')[1] - 1
    let anio = "" + 20 + date.split('-')[2]
    let nuevaFecha = new Date(anio, mes, dia)
    return nuevaFecha
}
function acomodarFechaCon20(date) {
    let dia = date.split('-')[0]
    let mes = date.split('-')[1] - 1
    let anio = "" + date.split('-')[2]
    let nuevaFecha = new Date(anio, mes, dia)
    return nuevaFecha
}

function devolverFecha(date) {
    const fecha = date.getDate()
    const mes = date.getMonth() + 1
    const anio = date.getFullYear()
    return fecha + "-" + mes + "-" + anio
}

router.post('/subscription', async (req, res) => {
    const { endpoint, expirationTime, keys } = req.body

    try {
        await Push.destroy({
            where: {},
            truncate: true
        })
        await Push.create({
            endpoint,
            expirationTime,
            p256dh: keys.p256dh,
            auth: keys.auth
        })
            .then(() => res.status(200).send({ msg: 'Precio guardado' }))
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Error al guardar el precio' })
    }

    res.status(200).json();
})

router.post("/newClient", async (req, res) => {
    var { dia, tienePromo, diaPromo } = req.body
    const { id, nombre, telefono, turno } = req.body
    let calculoFecha = acomodarFecha(dia)
    calculoFecha.setDate(calculoFecha.getDate() + 21)
    if (diaPromo.length === 0 || acomodarFechaCon20(diaPromo) < new Date()) diaPromo = devolverFecha(calculoFecha)
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
        const payload = JSON.stringify({
            title: 'Nuevo cliente',
            message: `${nombre} ha sacadco turno para el ${dia} a las ${turno}hs`
        })

        const noti = await Push.findAll()

        const point = {
            endpoint: noti[0].endpoint,
            expirationTime: noti[0].expirationTime,
            keys: {
                p256dh: noti[0].p256dh,
                auth: noti[0].auth
            }
        }
        
        try {
            await webpush.sendNotification(point, payload);
        } catch (err) {
            console.log(err)
        }
        res.status(200).send({ msg: 'created' })
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
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

// router.post('/enviarPromo', async (req, res) => {
//     const clientes = req.body

//     let findPrice = await Precio.findAll()
//     let precio = findPrice.pop().precio

//     try {
//         if (whatsappOn) {
//             clientes.forEach(cliente =>
//                 client.isRegisteredUser(`549${cliente.telefono}@c.us`).then(function (isRegistered) {
//                     if (isRegistered) {
//                         client.sendMessage(`549${cliente.telefono}@c.us`,
//                             `*ARIEL LUQUE PELUQUERIA DE CABALLEROS INFORMA*
// Tienes disponible una promoción para tu siguiente corte por un valor de $${precio / 2}.
// Reserva a través de nuestra sitio
// https://peluqueria-ariel.vercel.app/
// antes del ${cliente.diaPromo.replace("-", "/").replace("-", "/")}.
// Te espero ${cliente.nombre}!`);
//                     }
//                 })
//             )
//         }
//         res.status(200).send("mensajes enviados")
//     } catch (e) {
//         console.log(e)
//         res.status(500).json(e)
//     }
// })

module.exports = router;