const express = require('express');
const router = express();
const { Cliente } = require('../db');
const uuid4 = require('uuid4');
const nodemailer = require("nodemailer")
const { EMAIL_PASSWORD, EMAIL_FROM, EMAIL_TO } = process.env;
const { Client, LocalAuth } = require('whatsapp-web.js');
const { Op } = require('sequelize');
const qrcode = require('qrcode-terminal');

/*let client;

client = new Client({
    /*puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ],
        authStrategy: new LocalAuth()
    }
    puppeteer: { headless: true, args: [ '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--single-process', '--disable-gpu', ], },
})
    */

router.get('/qr', async (req, res) => {
    /*	client.on('qr', (qr) => {
            //qrcode.generate(qr, {small: true});
            res.send(qr)
        });		
    
        client.on('ready', () => {
                console.log('Client is ready!');
        });
    
        client.initialize();*/
    res.send("qr")
})

const horarios = [
    '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00'
]


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
    let nuevaFecha = new Date(mes + "/" + dia + "/" + anio)
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
        let diaSplit = dia.split("-")
        let newDia = diaSplit[0] + "-" + diaSplit[1] + "-" + "20" + diaSplit[2]
        const turnosLibres = await Cliente.findAll({
            where: {
                dia: {
                    [Op.eq]: newDia
                }
            }
        })
        let horariosDeTurnos = []
        turnosLibres.forEach(el => horariosDeTurnos.push(el.turno))
        let respuestaTurnos = horarios.filter(el => !horariosDeTurnos.includes(el))
        if (respuestaTurnos.includes(turno)) {
            if (cantidadRegistros.length === 0 || acomodarFechaCon20(dia) > acomodarFechaCon20(diaPromo)) {
                let calculoFecha = acomodarFecha(dia)
                calculoFecha.setDate(calculoFecha.getDate() + 21)
                diaPromo = devolverFecha(calculoFecha)
                await Cliente.create(
                    {
                        id: uuid4(),
                        nombre,
                        telefono,
                        tienePromo: false,
                        dia: diaCompleto,
                        diaPromo,
                        turno,
                        idCliente: id,
                    }
                );
            } else {
                await Cliente.create(
                    {
                        id: uuid4(),
                        nombre,
                        telefono,
                        tienePromo,
                        dia: diaCompleto,
                        diaPromo,
                        turno,
                        idCliente: id,
                    }
                );
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
                <a href="https://wa.me/549${telefono}?text=*ARIEL LUQUE PELUQUERIA DE CABALLEROS* Agradece tu reserva el día ${diaCompleto} a las ${turno} Hs.
                Recordá el *valor del corte es de $1000*, el *corte de promoción es de $400*, *barba $400* y *dibujos-lineas $200* Te espero ${nombre}.">
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
        } else {
            res.status(500).send({ msg: "ese turno está reservado" })
        }
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
            }
        })
        res.status(200).json(clientes)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/reviewPromo', async (_, res) => {
    const response = [];
    const buscar = async () => {
        // let diaPromo = new Date()
        // diaPromo.setDate(diaPromo.getDate() + Number(cantidadDias))
        // diaPromo = diaPromo.toLocaleString('es-AR', { dateStyle: 'short' })
        // diaPromo = agregarGuiones(diaPromo)
        // console.log(diaPromo)
        try {
            const clientes = await Cliente.update({ diaPromo: "24-2-2023" }, {
                where: {
                    diaPromo: "24-02-2023",
                }
            })
            // const clientes = await Cliente.findAll({
            //     where: {
            //         diaPromo: "24-02-2023",
            //     }
            // })
            return clientes
        } catch (err) {
            // res.status(500).json(err)
            return [];
        }
    }
    // for (let i = 0; i < 20; i++) {
    const s = await buscar()
    response.push(s)
    // }
    res.status(200).json(response);
})

router.put('/quitarPromo/:id', async (req, res) => {
    const { id } = req.params
    let diaPromo = new Date()
    diaPromo.setDate(diaPromo.getDate() - 30)
    diaPromo = diaPromo.toLocaleString('es-AR', { dateStyle: 'short' })
    diaPromo = agregarGuiones(diaPromo)
    try {
        const data = await Cliente.findOne({ where: { id } })
        await Cliente.update({ ...data, diaPromo, tienePromo: false }, {
            where: {
                id: id
            }
        })
        res.status(200).send({ msg: 'Promo quitada' })
    } catch (e) {
        res.status(404).send({ msg: 'Cliente no encontrado' })
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
