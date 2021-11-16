import React, { useState, useEffect } from 'react'
import { KeyboardDatePicker } from '@material-ui/pickers'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import { useSnackbar } from 'notistack';
import Slide from '@material-ui/core/Slide';

const useStyle = makeStyles({
    inputFecha: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'white',
        height: '50px',
        overflow: 'hidden',
    }
})


function AdminClients() {
    const [fechaActual, setFechaActual] = useState(new Date().toLocaleString('es-AR', { dateStyle: 'short' }).replaceAll('/', '-'))
    const [dateToShow, setDateToShow] = useState(new Date())
    const [registrados, setRegistrados] = useState([])
    const [render, setRender] = useState(false)
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
        axios.get(`/adminHours/${fechaActual}`)
            .then(r => setRegistrados(r.data))
    }, [dateToShow, render])

    const handleSubmitWrite = (e, tel) => {
        e.preventDefault()
        window.open(
            `https://wa.me/549${tel}`,
            '_blank'
        );
    }

    const deleteRegister = (e, id) => {
        e.preventDefault()
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

    return (
        registrados.length > 0 ?
            <div>
                <div className="contenedorFormulario">
                    <h3>Reservas realizadas</h3>
                    <form className="formularioReservas">
                        <div className="filaFormulario">
                            <span>ELIGE EL DÍA</span>
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
                                    return setFechaActual(fechaelegida)
                                }}
                            />}
                        </div>
                        <div className="filaFormulario">
                            <span>USUARIOS INSCRIPTOS</span>
                            {registrados.map(user =>
                                !user.ocupado ?
                                    <div className="registrado">
                                        <div>
                                            {user}hs
                                        </div>
                                        <div>
                                            <button name={user} onClick={(e) => ocuparHorario(e, user)}>Ocupar</button>
                                        </div>
                                    </div>
                                    : user.ocupado === 'Cliente' ?
                                        <div className="registrado">
                                            <div>
                                                {user.nombre} - {user.turno}hs
                                            </div>
                                            <div>
                                                <button name={user.telefono} onClick={(e) => handleSubmitWrite(e, user.telefono)}>Escribir</button>
                                                <button name={user.id} onClick={(e) => deleteRegister(e, user.id)}>Eliminar</button>
                                            </div>
                                        </div>
                                        :
                                        <div className="registrado">
                                            <div>{user.turno}hs - Ocupado</div>
                                            <div>
                                                <button onClick={(e) => liberarHorario(e, user.turno)}>Liberar</button>
                                            </div>
                                        </div>

                            )}
                        </div>
                        <div className="filaFormulario">

                        </div>

                    </form>
                </div>
            </div>
            :
            <div>
                loading
            </div>
    )
}

export default AdminClients
