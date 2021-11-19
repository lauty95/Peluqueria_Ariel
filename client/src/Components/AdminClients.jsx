import React, { useState, useEffect } from 'react'
import { KeyboardDatePicker } from '@material-ui/pickers'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import { useSnackbar } from 'notistack';
import Slide from '@material-ui/core/Slide';
import imgWsp from './../assets/wsp.png'
import { Button, Modal, Table, Offcanvas } from 'react-bootstrap';

const useStyle = makeStyles({
    inputFecha: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'white',
        height: '50px',
        overflow: 'hidden',
    }
})

const diaActual = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())

function AdminClients() {
    const [fechaActual, setFechaActual] = useState(new Date().toLocaleString('es-AR', { dateStyle: 'short' }).replaceAll('/', '-'))
    const [dateToShow, setDateToShow] = useState(new Date())
    const [registrados, setRegistrados] = useState([])
    const [render, setRender] = useState(false)
    const [show, setShow] = useState(false);
    const [selectId, setSelectId] = useState()
    const [showCanva, setShowCanva] = useState(false);
    const [backUp, setBackUp] = useState(false);
    const [filtrado, setFiltrado] = useState(true);

    const handleCloseCanva = () => setShowCanva(false);
    const handleShowCanva = () => setShowCanva(true);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const classes = useStyle();

    const { enqueueSnackbar } = useSnackbar();

    const registroOk = (msg) => {
        enqueueSnackbar(msg, {
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'left',
            },
            TransitionComponent: Slide,
            variant: 'info',
        })
    }

    useEffect(() => {
        axios.get(`/getAllClients/`)
            .then(r => {
                setBackUp(r.data)
                setRegistrados(r.data.filter(el => transformarFecha(el.dia) >= diaActual))
            })
    }, [])

    const mostrarTodos = () => {
        setRegistrados(backUp)
    }
    const reset = () => {
        window.location.href = "/admin"
    }
    const mostrarHorariosLibres = () => {
        return
    }

    const handleSubmitWrite = (e, tel) => {
        e.preventDefault()
        window.open(
            `https://wa.me/549${tel}`,
            '_blank'
        );
    }

    const deleteRegister = (id) => {
        axios.post(`/deleteClient/${id}`)
            .then((r) => {
                registroOk(r.data.msg)
                setRender(!render)
            })
            .catch(() => {
                registroOk('Hubo un error')
            })
    }

    const ocuparHorario = (e, horario) => {
        e.preventDefault()
        axios.post(`/ocuparHorario/${fechaActual}/${horario}`)
            .then((r) => {
                registroOk(r.data.msg)
                setRender(!render)
            })
            .catch(() => {
                registroOk('Hubo un error')
            })
    }

    const transformarFecha = (input) => {
        const fecha = input.split('-')
        return new Date("" + 20 + fecha[2], fecha[1] - 1, fecha[0])
    }

    const hoy = (dia) => {
        if (transformarFecha(dia).getTime() === diaActual.getTime()) return "Hoy"
        return dia
    }

    const liberarHorario = (e, horario) => {
        e.preventDefault()
        axios.post(`/liberarHorario/${fechaActual}/${horario}`)
            .then((r) => {
                registroOk(r.data.msg)
                setRender(!render)
            })
            .catch(() => {
                registroOk('Hubo un error')
            })
    }

    const filtrarPorFecha = () => {
        let res = backUp.filter(el => el.dia >= fechaActual)
        if (res.length === 0) {
            setRegistrados([{}])
            setFiltrado(false)
        } else {
            setFiltrado(true)
            setRegistrados(res)
        }
        handleCloseCanva()
    }
    const filtrarPorFechaExacta = () => {
        let res = backUp.filter(el => el.dia === fechaActual)
        if (res.length === 0) {
            setRegistrados([{}])
            setFiltrado(false)
        } else {
            setFiltrado(true)
            setRegistrados(res)
        }
        handleCloseCanva()
    }

    //ordenar por fecha
    registrados.sort((a, b) => transformarFecha(a.dia) - transformarFecha(b.dia))
    return (
        registrados.length > 0 ?
            <div>
                <div className="contenedorFormulario">
                    <h3>Reservas realizadas</h3>
                    <form className="formularioReservas">
                        <div className="botonesFiltrado">
                            <Button variant="primary" onClick={handleShowCanva}>
                                Filtrar
                            </Button>
                            <Button variant="primary" onClick={mostrarTodos}>
                                Todos
                            </Button>
                            <Button variant="primary" onClick={mostrarHorariosLibres}>
                                Libres
                            </Button>
                            <Button variant="secondary" onClick={reset}>
                                Reset
                            </Button>
                        </div>
                        {
                            filtrado ?
                                <div className="filaFormulario">
                                    <Table responsive="sm">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Fecha/Turno</th>
                                                <th>Escribir</th>
                                                <th>Admin</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {registrados.map(user =>
                                                // transformarFecha(user.dia) >= diaActual ?
                                                !user.ocupado ?
                                                    <div className="registrado">
                                                        <div>
                                                            {user}hs
                                                        </div>
                                                        <div>
                                                            <button name={user} onClick={(e) => ocuparHorario(e, user)}>Ocupar</button>
                                                        </div>
                                                    </div>
                                                    :
                                                    user.ocupado === 'Cliente' ?
                                                        <tr>
                                                            <td><b>{user.nombre}</b></td>
                                                            <td>{hoy(user.dia)} {user.turno} hs</td>
                                                            <td>{<img name={user.telefono} onClick={(e) => handleSubmitWrite(e, user.telefono)} className='imagenWsp' src={imgWsp} alt="boton de whatsapp" />}</td>
                                                            <td>{<button name={user.id} onClick={(e) => {
                                                                e.preventDefault()
                                                                setSelectId(user.id)
                                                                handleShow()
                                                            }
                                                            }>Eliminar</button>}</td>
                                                        </tr>
                                                        :
                                                        <tr>
                                                            <td>Ocupado</td>
                                                            <td>{hoy(user.dia)} {user.turno} hs</td>
                                                            <td></td>
                                                            <td><button onClick={(e) => liberarHorario(e, user.turno)}>Liberar</button></td>
                                                        </tr>
                                                // :
                                                // <></>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                                :
                                <p>No se encontraron resultados</p>
                        }
                        <div className="filaFormulario">

                        </div>

                    </form>
                </div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Borrar cliente</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Está seguro que quieres borrar este cliente?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            No
                        </Button>
                        <Button variant="danger" onClick={() => {
                            handleClose()
                            deleteRegister(selectId)
                        }}>
                            Si
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Offcanvas show={showCanva} onHide={handleCloseCanva}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Filtrado</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <span>Filtrar por día</span>
                        {<KeyboardDatePicker
                            name='dia'
                            autoOk
                            className={classes.inputFecha}
                            format="dd/MM/yyyy"
                            value={dateToShow}
                            InputAdornmentProps={{ position: "start" }}
                            onChange={date => {
                                const fechaelegida = new Date(date.toString().slice(4, 15)).toLocaleString('es-AR', { dateStyle: 'short' }).replaceAll('/', '-')
                                setDateToShow(date)
                                // filtrarPorFecha(fechaelegida)
                                return setFechaActual(fechaelegida)
                            }}
                        />}
                        <div className="botonesFiltrado">
                            <Button onClick={filtrarPorFechaExacta}>Exacto</Button>
                            <Button onClick={filtrarPorFecha}>A partir de</Button>
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
            :
            <div>
                loading
            </div>
    )
}

export default AdminClients
