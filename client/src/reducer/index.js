import { GET_FREE_HOURS, GET_HOURS_TOODAY, GET_WSP_MSG, EDIT_WSP_MESSAGE, FIND_USER, HANDLE_CHANGE, GET_PRICE } from "../actions/types";

const initialDate = new Date().toLocaleString('es-AR', { dateStyle: 'short' }).replaceAll('/', '-')

const initialState = {
    freeHours: ['sin horario para hoy'],
    wspMessage: '',
    user: { id: '', nombre: '', telefono: '', tienePromo: false, newUser: false, dia: initialDate, turno: '' },
    price: 0
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
        case FIND_USER:
            let user = {
                ...state.user,
                nombre: payload.nombre,
                telefono: payload.telefono,
                tienePromo: payload.tienePromo,
                diaPromo: payload.diaPromo,
                ultimoRegistro: payload.ultimoRegistro,
                turno: payload.turno
            }
            if (!user.nombre) user.newUser = true
            return {
                ...state,
                user,
                logeado: true
            }
        case HANDLE_CHANGE:
            return {
                ...state,
                user: { ...state.user, [payload.nombre]: payload.data }
            }
        case GET_PRICE:
            return {
                ...state,
                price: payload
            }
        default:
            return state
    }
}

export default reducer;