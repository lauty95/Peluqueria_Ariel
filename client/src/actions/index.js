import axios from "axios";
import { GET_FREE_HOURS, GET_HOURS_TOODAY } from "./types";

export { contactMe } from './wspActions'

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

const saveInfo = (type, data) => {
    return {
        type: type,
        payload: data
    }
}