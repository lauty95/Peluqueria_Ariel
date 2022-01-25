import axios from "axios";
import { GET_FREE_HOURS } from "./types";

export const getFreeHours = (data) => {
    axios.get(`/hoursFree/${data.dia}`)
        .then(res => { return { type: GET_FREE_HOURS, payload: res } })
        .catch(() => console.log('error al conectar con el server'))
}