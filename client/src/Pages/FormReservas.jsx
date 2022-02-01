import React, { useState, useEffect } from 'react'
import { KeyboardDatePicker } from '@material-ui/pickers'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import { useSnackbar } from 'notistack';
import Slide from '@material-ui/core/Slide';
import imgWsp from './../assets/wsp.png'
import * as actionCreators from '../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
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

function FormReservas(props) {
  const initialDate = new Date().toLocaleString('es-AR', { dateStyle: 'short' }).replaceAll('/', '-')
  const fechaActual = new Date()
  const initialState = { nombre: '', telefono: '', dia: initialDate, turno: '' }
  const [dateToShow, setDateToShow] = useState(fechaActual)
  const [data, setData] = useState(initialState)
  const [registrado, setRegistrado] = useState(false)
  const [pickerStatus, setPickerStatus] = useState(false)


  const classes = useStyle();
  const { enqueueSnackbar } = useSnackbar();

  const registroOk = () => {
    setRegistrado(true)
    enqueueSnackbar('Registramos su reserva con éxito!', {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'left',
      },
      TransitionComponent: Slide,
      variant: 'success',
    })
  }

  const registroFail = (msg) => {
    if (!msg) {
      msg = 'Hubo un error con nuestros servidores'
    }
    enqueueSnackbar(msg, {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'left',
      },
      TransitionComponent: Slide,
      variant: 'error',
    })
  }

  useEffect(() => {
    if (data.dia === initialDate) {
      props.getHoursToday(data.dia)
    } else {
      props.getFreeHours(data.dia)
    }
  }, [dateToShow, data.dia, initialDate])

  const handleChange = (e) => {
    setData((prevData) => {
      const state = { ...prevData, [e.target.name]: e.target.value }
      return state;
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (data.turno !== '' && data.turno !== 'sin horario para hoy' && data.turno !== 'Elige el horario') {
      if (data.telefono.length === 10) {
        setRegistrado(true)
        axios.post('/newClient', data)
          .then(() => registroOk())
          .catch(() => registroFail())
      } else {
        registroFail("Revise su número de whatsapp, debe tener 10 dítigots")
      }
    } else {
      registroFail("Debes elegir un horario")
    }
  }

  return (
    <>
      {props.freeHours.length !== 0 ?
        <div className="contenedorFormulario">
          <center><h3>Haz tu reserva!</h3></center>
          <form className="formularioReservas" onSubmit={handleSubmit}>
            <div className="filaFormulario">
              <span>NOMBRE</span>
              <input disabled={registrado} type="text" name="nombre" placeholder="Ingrese su nombre" onChange={handleChange} required />
            </div>
            <div className="filaFormulario">
              <span>CELULAR (con característica | sin 0, sin 15)</span>
              <input disabled={registrado} type="tel" name="telefono" placeholder="3492505050" onChange={handleChange} required />
            </div>
            <div className="filaFormulario">
              <span>ELIGE EL DÍA</span>
              {
                <KeyboardDatePicker
                  onClick={() => setPickerStatus(true)}
                  onClose={() => setPickerStatus(false)}
                  open={pickerStatus}
                  InputProps={{ readOnly: true }}
                  disabled={registrado}
                  name='dia'
                  autoOk
                  className={classes.inputFecha}
                  minDate={fechaActual}
                  shouldDisableDate={date => date.getDay() === 0}
                  format="dd/MM/yyyy"
                  value={dateToShow}
                  InputAdornmentProps={{ position: "start" }}
                  onChange={date => {
                    const fechaelegida = new Date(date.toString().slice(4, 15)).toLocaleString('es-AR', { dateStyle: 'short' }).replaceAll('/', '-')
                    setData((currentData) => {
                      setDateToShow(date)
                      return { ...currentData, dia: fechaelegida }
                    })
                  }}
                />
              }
            </div>
            <div className="filaFormulario">
              <span>ELIGE EL HORARIO</span>
              <select disabled={registrado} className="form-input select-filter" name="turno" onChange={handleChange} required>
                <option>Elige el horario</option>
                {
                  props.freeHours.length === 0 ?
                    <option key="loading">Cargando horas...</option>
                    :
                    props.freeHours.map(el => <option key={el} name={el}>{el}</option>)
                }
              </select>
            </div>
            <button disabled={registrado} className="reservar" type="submit">Reservar</button>
          </form>
          <button className="reservar" onClick={() => props.contactMe(null, null, data.nombre)}>Contactar <img width="40px" src={imgWsp} alt="Contacto por Whatsapp" /></button>
        </div>
        :
        <Spinner />
      }
    </>
  )
}

const mapStateToProps = function (state) {
  return {
    freeHours: state.freeHours,
  }
}

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FormReservas);
