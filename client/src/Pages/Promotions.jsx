import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Button, Table } from 'react-bootstrap'

const Promotions = (props) => {
    const [cantidadDias, setCantidadDias] = useState(3)
    const [usuarios, setUsuarios] = useState(null)

    useEffect(() => {
        buscarUsuarios()
    }, [])

    const buscarUsuarios = () => {
        axios.get(`/promocion/${cantidadDias}`)
            .then(data => setUsuarios(data.data))
            .catch(err => console.log(err))
    }

    const enviarMensajes = () => {
        axios.post('/enviarPromo', usuarios)
            .then(() => console.log('mensajes enviados'))
            .catch(() => console.log('mensajes NO enviados'))
    }

    console.log(usuarios)

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
                        <th>Día Promocións</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios && usuarios.map(user =>
                        <tr>
                            <td>{user.nombre}</td>
                            <td>{user.dia}</td>
                            <td>{user.diaPromo}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Button variant="info" onClick={enviarMensajes}>
                Enviar Aviso
            </Button>
        </div>
    )
}

export default Promotions