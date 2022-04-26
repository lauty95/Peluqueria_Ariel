import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Form, Table } from 'react-bootstrap'

function Searcher(props) {
    const [data, setData] = useState([])
    const [busqueda, setBusqueda] = useState('')
    useEffect(() => {
        axios.get(`/allClients`)
            .then(r => setData(r.data))
    }, [])

    const searching = (e) => {
        setBusqueda(e)
    }
    return (
        <div className='promotion mt-1'>
            <div className="botones">
                <Form.Control
                    value={busqueda}
                    onChange={(e) => searching(e.target.value)}
                    type="text"
                    placeholder="Buscar..."
                />
                <Button variant="primary" onClick={() => props.history.push("/admin")}>
                    Volver
                </Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Dia Promo</th>
                        <th>Dia Turno</th>
                        <th>Turno</th>
                        <th>DNI</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        busqueda.length >= 3 ?
                            data.map(item => {
                                let nombre = item.nombre.toLowerCase()
                                if (nombre.includes(busqueda.toLowerCase())) {
                                    return (
                                        <tr key={item.id}>
                                            <td>{item.nombre}</td>
                                            <td>{item.diaPromo}</td>
                                            <td>{item.dia}</td>
                                            <td>{item.turno}</td>
                                            <td>{item.idCliente}</td>
                                        </tr>
                                    )
                                }
                            })
                            :
                            <tr></tr>
                    }

                </tbody>
            </Table>
        </div>
    )
}

export default Searcher
