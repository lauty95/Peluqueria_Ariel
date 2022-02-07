import axios from "axios";
import { GET_FREE_HOURS, GET_HOURS_TOODAY, GET_WSP_MSG, EDIT_WSP_MESSAGE, FIND_USER, GET_PRICE } from "./types";

export { contactMe, sendMessage } from './wspActions'
export { compararFecha } from './fechas'

export const getUser = (id) => {
    return function (dispatch) {
        axios.get(`/usuario/${id}`)
            .then(res => dispatch(saveInfo(FIND_USER, res.data)))
            .catch(() => console.log('error al conectar con el server'))
    }
}

export const getFreeHours = (data) => {
    return function (dispatch) {
        axios.get(`/hoursFree/${data}`)
            .then(res => dispatch(saveInfo(GET_FREE_HOURS, res.data)))
            .catch(() => console.log('error al conectar con el server'))
    }
}

export const getHoursToday = (data) => {
    return function (dispatch) {
        axios.get(`/hoursFree/${data}`)
            .then(res => dispatch(saveInfo(GET_HOURS_TOODAY, res.data)))
            .catch(() => console.log('error al conectar con el server'))
    }
}

export const saveWspMessage = (mensaje) => {
    return function () {
        axios.post(`/setearMensaje`, { mensaje })
    }
}

export const getWspMessage = () => {
    return function (dispatch) {
        axios.get(`/mensajeWsp`)
            .then(res => dispatch(saveInfo(GET_WSP_MSG, res.data.mensaje)))
            .catch(() => console.log('error al conectar con el server'))
    }
}

export const getPrice = () => {
    return function (dispatch) {
        axios.get(`/precio`)
            .then(r => dispatch(saveInfo(GET_PRICE, r.data.precio)))
            .catch(() => console.log('error al conectar con el server'))
    }
}

export const editWspMessage = (data) => {
    return function (dispatch) {
        dispatch(saveInfo(EDIT_WSP_MESSAGE, data))
    }
}

export const saveInfo = (type, data) => {
    return {
        type: type,
        payload: data
    }
}