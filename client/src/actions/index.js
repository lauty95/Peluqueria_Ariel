import axios from "axios";
import { GET_FREE_HOURS, GET_HOURS_TOODAY, GET_WSP_MSG, EDIT_WSP_MESSAGE, SAVE_WSP_MESSAGE } from "./types";

export { contactMe, sendMessage } from './wspActions'

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
    return function (dispatch) {
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

export const editWspMessage = (data) => {
    return function (dispatch) {
        dispatch(saveInfo(EDIT_WSP_MESSAGE, data))
    }
}


const saveInfo = (type, data) => {
    return {
        type: type,
        payload: data
    }
}