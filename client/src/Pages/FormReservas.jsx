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
import Login from '../Components/Login';
import MessagePromo from '../Components/MessagePromo'
import MessageBooked from '../Components/MessageBooked';
import Footer from '../Components/Footer';

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
  const [dateToShow, setDateToShow] = useState(fechaActual)
  const [registrado, setRegistrado] = useState(false)
  const [pickerStatus, setPickerStatus] = useState(false)
  const [login, setLogin] = useState(false)

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
    if (props.user.dia === initialDate) {
      props.getHoursToday(props.user.dia)
    } else {
      props.getFreeHours(props.user.dia)
    }
    props.getPrice()
  }, [dateToShow, props.user])

  const handleChange = (e) => {
    props.saveInfo('HANDLE_CHANGE', { nombre: e.target.name, data: e.target.value })
  }

  const registrarCliente = () => {
    let conservaPromo = !(props.user.tienePromo && props.compararFecha(props.user.dia, props.user.diaPromo))
    let data = { ...props.user, tienePromo: conservaPromo }
    axios.post('/newClient', data)
      .then(() => registroOk())
      .catch(() => registroFail())
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (props.user.turno && props.user.turno !== '' && props.user.turno !== 'sin horario para hoy' && props.user.turno !== 'Elige el horario') {
      if (props.user.telefono.length === 10) {
        setRegistrado(true)
        if (props.user.newUser) {
          axios.post('/newUser', props.user)
            .then(() => registrarCliente())
            .catch(() => console.log('faló crear un nuevo usuario'))
        } else {
          registrarCliente()
        }
      } else {
        registroFail("Revise su número de whatsapp, debe tener 10 dítigots")
      }
    } else {
      registroFail("Debes elegir un horario")
    }
  }

  const handleLogin = () => {
    props.getUser(props.user.id)
    setLogin(true)
  }

  return (
    <>
      {props.freeHours.length !== 0 ?
        <>
          <div className="contenedorFormulario">
            <center><h3>Haz tu reserva!</h3></center>
            <Login value={props.user.id} onClick={handleLogin} onChange={handleChange} className={login ? 'visible' : ''} />
          </div>
          <Footer precio={props.price} className={login ? 'visible' : 'footer'} />
          <div className="contenedorFormulario">
            {props.user.ultimoRegistro && !props.compararFecha(props.user.ultimoRegistro, initialDate) && login ?
              <>
                <MessageBooked fecha={props.user.ultimoRegistro} nombre={props.user.nombre} hora={props.user.turno} precio={props.price} />
                <button className="boton" onClick={() => props.contactMe(null, null, props.user.nombre)}>Contactar <img width="40px" src={imgWsp} alt="Contacto por Whatsapp" /></button>
              </>
              :
              <>
                <form className={`formularioReservas ${!login && 'visible'}`} onSubmit={handleSubmit}>
                  <div className="filaFormulario">
                    <span>NOMBRE</span>
                    <input value={props.user.nombre} disabled={registrado} type="text" name="nombre" placeholder="Ingrese su nombre" onChange={handleChange} required />
                  </div>
                  <div className="filaFormulario">
                    <span>CELULAR (con característica | sin 0, sin 15)</span>
                    <input value={props.user.telefono} disabled={registrado} type="tel" name="telefono" placeholder="3492505050" onChange={handleChange} required />
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
                          props.saveInfo('HANDLE_CHANGE', { nombre: 'dia', data: fechaelegida })
                          setDateToShow(date)
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
                  {
                    props.user.tienePromo && props.compararFecha(initialDate, props.user.diaPromo) &&
                    <MessagePromo diaActual={props.user.dia} diaPromo={props.user.diaPromo} compararFecha={props.compararFecha} precio={props.price} />
                  }
                  <button disabled={registrado} className="boton" type="submit">Reservar</button>
                </form>
              </>}
          </div>
        </>
        :
        <Spinner />
      }
    </>
  )
}

const mapStateToProps = function (state) {
  return {
    freeHours: state.freeHours,
    user: state.user,
    price: state.price
  }
}

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FormReservas);
