import React, { useState, useEffect } from 'react'
import { KeyboardDatePicker } from '@material-ui/pickers'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import { useSnackbar } from 'notistack';
import Slide from '@material-ui/core/Slide';
import imgWsp from './../assets/wsp.png'
import { Button, Modal, Table, Offcanvas } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions'
import Spinner from '../Components/Spinner';

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

function AdminClients(props) {
    const [fechaActual, setFechaActual] = useState(new Date().toLocaleString('es-AR', { dateStyle: 'short' }).replaceAll('/', '-'))
    const [dateToShow, setDateToShow] = useState(new Date())
    const [registrados, setRegistrados] = useState([])
    const [render, setRender] = useState(false)
    const [show, setShow] = useState(false);
    const [showTomarseElDia, setShowTomarseElDia] = useState(false);
    const [selectId, setSelectId] = useState()
    const [showCanva, setShowCanva] = useState(false);
    const [precio, setPrecio] = useState();
    const [mostrar, setMostrar] = useState(true)
    const [pickerStatus, setPickerStatus] = useState(false)

    const handleCloseCanva = () => setShowCanva(false);
    const handleShowCanva = () => setShowCanva(true);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseTomarseElDia = () => setShowTomarseElDia(false);
    const handleShowTomarseElDia = () => setShowTomarseElDia(true);

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
    console.log(props);
    useEffect(() => {
        axios.get(`/getClients/${fechaActual}`)
            .then(r => setRegistrados(r.data))
        props.getWspMessage()
        axios.get(`/precio`)
            .then(r => setPrecio(r.data.precio))
    }, [render, fechaActual])

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
    const transformarFecha = (input, turno) => {
        const fecha = input.split('-')
        if (!turno) return new Date("" + 20 + fecha[2], fecha[1] - 1, fecha[0])
        const hora = turno.split(':')
        return new Date("" + 20 + fecha[2], fecha[1] - 1, fecha[0], hora[0], hora[1])
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

    const guardarMensaje = () => {
        props.saveWspMessage(props.wspMessage)
        handleCloseCanva()
    }
    const guardarPrecio = () => {
        axios.post('/setearPrecio', { precio })
            .then(r => registroOk(r.data.msg))
        handleCloseCanva()
    }

    const tomarseElDia = () => {
        handleShowTomarseElDia()
    }

    const mostrarTodos = () => {
        axios.get(`/allClients`)
            .then(r => {
                let filtrados = r.data.filter(el => transformarFecha(el.dia) >= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))
                filtrados = filtrados.sort((a, b) => transformarFecha(a.dia, a.turno) - transformarFecha(b.dia, b.turno))
                setRegistrados(filtrados)
            })
        setMostrar(!mostrar)
    }

    const reset = () => {
        setRender(!render)
        setMostrar(!mostrar)
    }

    return (
        registrados.length > 0 ?
            <div>
                <div className="contenedorFormulario">
                    <div className="cabecera">
                        <h3>Administración</h3> <h4>{fechaActual}</h4>
                    </div>
                    <form className="formularioReservas">
                        <div className="botonesFiltrado">
                            <Button variant="primary" onClick={handleShowCanva}>
                                Opciones
                            </Button>
                            <Button variant="primary" onClick={() => props.history.push("/statistics")}>
                                Estadisticas
                            </Button>
                            <Button variant="info" onClick={tomarseElDia}>
                                Tomarse el día
                            </Button>
                        </div>
                        {
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
                                            !user.ocupado ?
                                                <tr>
                                                    <td>Libre</td>
                                                    <td>{user} hs</td>
                                                    <td></td>
                                                    <td>{<button name={user} onClick={(e) => ocuparHorario(e, user)}>Ocupar</button>}</td>
                                                </tr>
                                                :
                                                user.ocupado === 'Cliente' ?
                                                    <tr className="cliente">
                                                        <td onClick={() => props.contactMe(user.telefono)}><b>{user.nombre}</b></td>
                                                        <td>{hoy(user.dia)} {user.turno} hs</td>
                                                        <td>{
                                                            <img
                                                                name={user.telefono}
                                                                onClick={() =>
                                                                    props.wspMessage ?
                                                                        props.sendMessage(props.wspMessage, user.telefono, user.turno)
                                                                        :
                                                                        registroOk("Debes setear un mensaje antes de enviar algo")}
                                                                className='imagenWsp' src={imgWsp} alt="boton de whatsapp"
                                                            />
                                                        }</td>
                                                        <td>{<button name={user.id} onClick={(e) => {
                                                            e.preventDefault()
                                                            setSelectId(user.id)
                                                            handleShow()
                                                        }
                                                        }>Eliminar</button>}</td>
                                                    </tr>
                                                    :
                                                    <tr className="ocupado">
                                                        <td>Ocupado</td>
                                                        <td>{user.turno}hs</td>
                                                        <td></td>
                                                        <td><button onClick={(e) => liberarHorario(e, user.turno)}>Liberar</button></td>
                                                    </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>

                        }
                        <div className="filaFormulario">

                        </div>

                    </form>
                </div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Advertencia!</Modal.Title>
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
                <Modal show={showTomarseElDia} onHide={handleCloseTomarseElDia}>
                    <Modal.Header closeButton>
                        <Modal.Title>Advertencia!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Está seguro que quieres tomarte este día?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseTomarseElDia}>
                            No
                        </Button>
                        <Button variant="danger" onClick={() => {
                            axios.get(`/hoursFree/${fechaActual}`)
                                .then(r => {
                                    r.data.forEach(horario => {
                                        axios.post(`/ocuparHorario/${fechaActual}/${horario}`)
                                            .then(r => console.log(r.data.msg))
                                    })
                                })
                                .then(() => {
                                    setRender(!render)
                                    registroOk('Dia ocupado')
                                })
                            handleCloseTomarseElDia()
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
                            onClick={() => setPickerStatus(true)}
                            onClose={() => setPickerStatus(false)}
                            open={pickerStatus}
                            InputProps={{ readOnly: true }}
                            name='dia'
                            autoOk
                            className={classes.inputFecha}
                            format="dd/MM/yyyy"
                            value={dateToShow}
                            InputAdornmentProps={{ position: "start" }}
                            onChange={date => {
                                const fechaelegida = new Date(date.toString().slice(4, 15)).toLocaleString('es-AR', { dateStyle: 'short' }).replaceAll('/', '-')
                                setDateToShow(date)
                                handleCloseCanva()
                                return setFechaActual(fechaelegida)
                            }}
                        />}
                        <div className="botonesFiltrado">
                            {
                                mostrar ?
                                    <Button onClick={mostrarTodos}>Mostrar Todos</Button>
                                    :
                                    <Button onClick={reset}>Reset</Button>
                            }
                        </div>

                        <hr />

                        <textarea value={props.wspMessage} name="mensajewsp" className="mensajeWsp" onChange={e => props.editWspMessage(e.target.value)} />
                        <div className="botonesFiltrado">
                            <Button onClick={guardarMensaje}>Setear Mensaje</Button>
                        </div>

                        <hr />
                        <div className='setearPrecio'>
                            <input type="number" value={precio} name="precio" className="precio" onChange={e => setPrecio(e.target.value)} />
                            <div className="botonesFiltrado">
                                <Button onClick={guardarPrecio}>Setear Precio</Button>
                            </div>
                        </div>

                    </Offcanvas.Body>
                </Offcanvas>
            </div>
            :
            <Spinner />
    )
}


const mapStateToProps = function (state) {
    return {
        freeHours: state.freeHours,
        wspMessage: state.wspMessage,
    }
}

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminClients);
