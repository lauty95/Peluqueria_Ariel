import { Checkbox } from '@mui/material'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Button, Table } from 'react-bootstrap'
import './../style.css'

const Promotions = (props) => {
    const [cantidadDias, setCantidadDias] = useState(3)
    const [usuarios, setUsuarios] = useState(null)
    const [enviando, setEnviando] = useState(false)
    const [enviado, setEnviado] = useState(false)

    useEffect(() => {
        buscarUsuarios()
    }, [])

    const buscarUsuarios = () => {
        let arr = []
        axios.get(`/promocion/${cantidadDias}`)
            .then(data => {
                data.data.forEach(user => {
                    arr.push({ id: user.id, nombre: user.nombre, diaPromo: user.diaPromo, telefono: user.telefono, value: true })
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
                        <tr>
                            <td>{user.nombre}</td>
                            <td>{user.dia}</td>
                            <td>{user.diaPromo}</td>
                            <td className='chk-promotion'><Checkbox checked={user.value} onChange={() => handleChange(user.id)} /></td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Button disabled={enviado} variant="info" onClick={enviarMensajes}>
                {
                    enviado ?
                        "Mensajes enviados"
                        :
                        enviando ?
                            <div className="spinner-border" role="status"></div>
                            :
                            "Enviar Aviso"
                }
            </Button>
        </div>
    )
}

export default Promotions