import { GET_FREE_HOURS, GET_HOURS_TOODAY, GET_WSP_MSG, EDIT_WSP_MESSAGE } from "../actions/types";

const initialState = {
    freeHours: [],
    wspMessage: '',
}

function reducer(state = initialState, { type, payload }) {
    let result;
    switch (type) {
        case GET_HOURS_TOODAY:
            const filtroHora = payload.filter(el => {
                if (Number(el.split(":")[0]) === new Date().getHours()) {
                    return Number(el.split(":")[1]) >= new Date().getMinutes()
                } else {
                    return (Number(el.split(":")[0]) > new Date().getHours())
                }
            })
            if (filtroHora.length === 0) {
                result = ['sin horario para hoy']
            } else {
                result = filtroHora
            }
            return {
                ...state,
                freeHours: result
            }
        case GET_FREE_HOURS:
            if (payload.length === 0) {
                result = ['sin horario para hoy']
            } else {
                result = payload
            }
            return {
                ...state,
                freeHours: result
            }
        case GET_WSP_MSG: 
            return {
                ...state,
                wspMessage: payload
            }
        case EDIT_WSP_MESSAGE:
            return {
                ...state,
                wspMessage: payload
            }
        default:
            return state
    }
}

export default reducer;