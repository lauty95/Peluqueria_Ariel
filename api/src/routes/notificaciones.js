const express = require('express');
const router = express();
const { Cliente, Push } = require('../db');
const uuid4 = require('uuid4');
const nodemailer = require("nodemailer")
const { EMAIL_PASSWORD, EMAIL_FROM, EMAIL_TO } = process.env;

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

router.post("/newClient", async (req, res) => {
    var { dia, tienePromo, diaPromo } = req.body
    const { id, nombre, telefono, turno } = req.body
    const diaCompleto = devolverFecha(acomodarFecha(dia));
    try {
        const cantidadRegistros = await Cliente.findAll({
            where: {
                idCliente: id
            }
        })

        if (cantidadRegistros.length === 0) {
            tienePromo = true;
            let calculoFecha = acomodarFecha(dia)
            calculoFecha.setDate(calculoFecha.getDate() + 21)
            diaPromo = devolverFecha(calculoFecha)
            await Cliente.create({
                id: uuid4(),
                nombre,
                telefono,
                tienePromo,
                dia: diaCompleto,
                diaPromo,
                turno,
                idCliente: id,
            });
        } else {
            await Cliente.create({
                id: uuid4(),
                nombre,
                telefono,
                tienePromo,
                dia: diaCompleto,
                diaPromo,
                turno,
                idCliente: id,
            });
        }

        if (cantidadRegistros.length > 0 && acomodarFechaCon20(diaPromo) > acomodarFechaCon20(dia)) {
            diaCompleto = devolverFecha(acomodarFecha(dia))
        } else {
            let calculoFecha = acomodarFecha(dia)
            calculoFecha.setDate(calculoFecha.getDate() + 21)
            diaPromo = devolverFecha(calculoFecha)
            diaCompleto = devolverFecha(acomodarFecha(dia))
            tienePromo = true;
        }



        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            post: 465,
            secure: true,
            auth: {
                user: EMAIL_FROM,
                pass: EMAIL_PASSWORD
            }
        })

        const mailOptions = {
            from: EMAIL_FROM,
            to: EMAIL_TO,
            subject: `Nuevo cliente | ${nombre}`,
            html: `
                <h1>Nuevo cliente</h1>
                <hr />
                <b>${nombre} ha sacado turno el día ${diaCompleto} a las ${turno}</b>
                <hr />
                <hr />
                <a href="https://wa.me/549${telefono}?text=*ARIEL LUQUE PELUQUERIA DE CABALLEROS* Agradece tu reserva el día ${diaCompleto} a las ${turno} Hs. Te espero ${nombre}.">
                    <img src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" width="300px" heigth="300px"></img>
                </a>
            `
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
            } else {
                console.log("Email enviado")
            }
        })

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
