import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Form, Table } from 'react-bootstrap'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions'

function Searcher(props) {
    const [data, setData] = useState([])
    const [busqueda, setBusqueda] = useState('')

    const transformarFecha = (date) => {
        const dia = date.split("-")[0]
        const mes = date.split("-")[1] - 1
        let anio = date.split("-")[2]
        if (anio < 2000) anio = "" + 20 + anio
        return new Date(anio, mes, dia)
    }

    function compare(a, b) {
        if (transformarFecha(a) > transformarFecha(b)) {
            return -1;
        }
        if (transformarFecha(a) < transformarFecha(b)) {
            return 1;
        }
        return 0;
    }

    useEffect(() => {
        axios.get(`/allClients`)
            .then(r => {
                let res = r.data.sort((a, b) => compare(a.dia, b.dia))
                setData(res)
            })
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
                                let nombre = item.nombre ? item.nombre.toLowerCase() : ''
                                if (nombre.includes(busqueda.toLowerCase())) {
                                    return (
                                        <tr key={item.id} onClick={() => props.contactMe(item.telefono)}>
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

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators(actionCreators, dispatch)
}

export default connect(null, mapDispatchToProps)(Searcher);
