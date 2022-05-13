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
import { Button, Modal } from 'react-bootstrap';

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
  let initialDate = new Date().toLocaleString('es-AR', { dateStyle: 'short' }).replaceAll('/', '-')
  initialDate = initialDate.split("-")[0] + "-" + initialDate.split("-")[1] + "-20" + initialDate.split("-")[2]
  const fechaActual = new Date()
  const [dateToShow, setDateToShow] = useState(fechaActual)
  const [registrado, setRegistrado] = useState(false)
  const [sunday, setSunday] = useState(false)
  const [pickerStatus, setPickerStatus] = useState(false)
  const [login, setLogin] = useState(false)
  const [show, setShow] = useState(false)
  const [update, setUpdate] = useState(false)
  const classes = useStyle();
  const { enqueueSnackbar } = useSnackbar();

  const registroOk = () => {
    setRegistrado(true)
    setShow(true)
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
    if (dateToShow.getDay() === 0) {
      setSunday(true)
    } else {
      setSunday(false)
    }
  }, [dateToShow, props.user])

  const handleChange = (e) => {
    if (e.target.name === 'telefono' || e.target.name === "nombre") setUpdate(true)
    props.saveInfo('HANDLE_CHANGE', { nombre: e.target.name, data: e.target.value })
  }

  const registrarCliente = () => {
    let conservaPromo = props.compararFecha(props.user.dia, props.user.diaPromo)
    let data = {
      ...props.user,
      tienePromo: conservaPromo,
      dia: props.user.dia.split("-")[0] + "-" + props.user.dia.split("-")[1] + "-" + Number(props.user.dia.split("-")[2] - 2000)
    }
    axios.post('/newClient', data)
      .then(() => registroOk())
      .catch(() => registroFail())
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (props.user.turno && props.user.turno !== '' && props.user.turno !== 'sin horario para hoy' && props.user.turno !== 'Elige el horario') {
      if (props.user.telefono.length === 10) {
        setRegistrado(true)
        if (update) {
          axios.put('/updateUser', props.user)
        }
        if (props.user.newUser) {
          axios.post('/newUser', props.user)
            .then(() => registrarCliente())
            .catch(() => console.log('falló crear un nuevo usuario'))
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
                          let fechaelegida = new Date(date.toString().slice(4, 15)).toLocaleString('es-AR', { dateStyle: 'short' }).replaceAll('/', '-')
                          fechaelegida = fechaelegida.split("-")[0] + "-" + fechaelegida.split("-")[1] + "-20" + fechaelegida.split("-")[2]
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
                    props.compararFecha(initialDate, props.user.diaPromo) &&
                    <MessagePromo diaActual={props.user.dia} diaPromo={props.user.diaPromo} compararFecha={props.compararFecha} precio={props.price} />
                  }
                  <button disabled={registrado || sunday} className="boton" type="submit">Reservar</button>
                </form>
              </>}
          </div>
        </>
        :
        <Spinner />
      }
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reservado!</Modal.Title>
        </Modal.Header>
        <Modal.Body>{`Registramos tu reserva! Te esperamos el ${props.user.dia} a las ${props.user.turno}`}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShow(false)}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
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
