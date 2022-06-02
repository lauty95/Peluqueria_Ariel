import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Button, Table } from 'react-bootstrap'
import './../style.css'
import imgWsp from './../assets/wsp.png'
import * as actionCreators from '../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

const Promotions = (props) => {
    const [cantidadDias, setCantidadDias] = useState(3)
    const [usuarios, setUsuarios] = useState(null)
    const [enviando, setEnviando] = useState(false)
    const [enviado, setEnviado] = useState(false)

    useEffect(() => {
        buscarUsuarios()
        props.getPrice()
    }, [])

    const buscarUsuarios = () => {
        let arr = []
        axios.get(`/promocion/${cantidadDias}`)
            .then(res => {
                res.data.forEach(user => {
                    if (!arr.find((el) => el.idCliente === user.idCliente))
                        arr.push({ id: user.id, dia: user.dia, nombre: user.nombre, diaPromo: user.diaPromo, telefono: user.telefono, value: true })
                })
                setUsuarios(arr)
            })
            .catch(err => console.log(err))
    }

    const enviarMensajes = () => {
        setEnviando(true)
        let data = usuarios.filter(user => user.value === true)
        axios.post('/enviarPromo', data)
            .then(() => {
                setEnviando(false)
                setEnviado(true)
            })
            .catch(() => {
                setEnviando(false)
                setEnviado(true)
            })
    }

    const handleChange = (id) => {
        setUsuarios(usuarios.map(user => {
            if (user.id === id) return { ...user, value: !user.value }
            return user
        }))
    }

    const mensaje = (nombre, diaPromo) => {
        return (`*ARIEL LUQUE PELUQUERIA DE CABALLEROS INFORMA* Tienes disponible una promoción para tu siguiente corte por un valor de $300. Reserva a través de nuestra sitio https://peluqueria-ariel.vercel.app/ antes del ${diaPromo.replace("-", "/").replace("-", "/")}. Te espero ${nombre}!`)
    }

    return (
        <div className="promotion">
            <div className="botones">
                <Button variant="primary" onClick={() => props.history.push("/admin")}>
                    Volver
                </Button>
                <span>Cantidad de días</span>
                <input type="number" value={cantidadDias} onChange={(e) => setCantidadDias(e.target.value)} className="dias" />
                <Button variant="primary" onClick={buscarUsuarios}>
                    Buscar
                </Button>
            </div>
            <Table responsive="sm">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Fecha</th>
                        <th>Día Promoción</th>
                        <th>Enviar</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios && usuarios.map(user =>
                        props.compararFecha(user.dia, user.diaPromo) &&
                        <tr>
                            <td onClick={() => props.contactMe(user.telefono)}>{user.nombre}</td>
                            <td>{user.dia}</td>
                            <td>{user.diaPromo}</td>
                            <td>{
                                <img
                                    name={user.telefono}
                                    onClick={() => props.contactMe(user.telefono, mensaje(user.nombre, user.diaPromo))}
                                    className='imagenWsp' src={imgWsp} alt="boton de whatsapp"
                                />
                            }</td>
                            {/* <td className='chk-promotion'><Checkbox checked={user.value} onChange={() => handleChange(user.id)} /></td> */}
                        </tr>
                    )}
                </tbody>
            </Table>
            {/* <Button disabled={enviado} variant="info" onClick={enviarMensajes}>
                {
                    enviado ?
                        "Mensajes enviados"
                        :
                        enviando ?
                            <div className="spinner-border" role="status"></div>
                            :
                            "Enviar Aviso"
                }
            </Button> */}
        </div>
    )
}

const mapStateToProps = function (state) {
    return {
        price: state.price
    }
}

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Promotions)