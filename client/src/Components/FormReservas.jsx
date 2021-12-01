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

function FormReservas() {
  const initialDate = new Date().toLocaleString('es-AR', { dateStyle: 'short' }).replaceAll('/', '-')
  const fechaActual = new Date()
  const initialState = { nombre: '', telefono: '', dia: initialDate, turno: '' }

  const [dateToShow, setDateToShow] = useState(fechaActual)
  const [data, setData] = useState(initialState)
  const [horas, setHoras] = useState([])
  const [registrado, setRegistrado] = useState(false)


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
    if (msg === '') {
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
    axios.get(`/hoursFree/${data.dia}`)
      .then(res => {
        if (data.dia === initialDate) {
          const filtroHora = res.data.filter(el => Number(el.split(":")[0]) > new Date().getHours())
          if (filtroHora.length === 0) {
            setHoras(['sin horario para hoy'])
          } else {
            setHoras(filtroHora)
          }
        } else {
          setHoras(res.data)
        }
      })
      .catch(() => registroFail())
  }, [dateToShow])

  const handleChange = (e) => {
    setData((prevData) => {
      const state = { ...prevData, [e.target.name]: e.target.value }
      return state;
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (data.turno !== '') {
      axios.post('/newClient', data)
        .then(() => registroOk())
        .catch(() => registroFail())
    } else {
      registroFail("Debes elegir un horario")
    }
  }

  return (
    <>
      {horas.length !== 0 ?
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
              {<KeyboardDatePicker
                disabled={registrado}
                name='dia'
                autoOk
                className={classes.inputFecha}
                minDate={fechaActual}
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
              />}
            </div>
            <div className="filaFormulario">
              <span>ELIGE EL HORARIO</span>
              <select disabled={registrado} className="form-input select-filter" name="turno" onChange={handleChange} required>
                <option>Elige el horario</option>
                {
                  horas.length === 0 ?
                    <option key="loading">Cargando horas...</option>
                    :
                    horas.map(el => <option key={el} name={el}>{el}</option>)
                }
              </select>
            </div>
            <button disabled={registrado} className="reservar" type="submit">Reservar</button>
          </form>
        </div>
        :
        <div class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      }
    </>
  )
}

export default FormReservas
