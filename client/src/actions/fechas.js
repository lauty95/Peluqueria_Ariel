export const compararFecha = (date1, date2) => {
    return function () {
        if (date1 && date2) return transformarFecha(date1) <= transformarFecha(date2)
        return
    }
}

const transformarFecha = (date) => {
    const dia = date.split("-")[0]
    const mes = date.split("-")[1] - 1
    let anio = date.split("-")[2]
    if (anio < 2000) anio = "" + 20 + anio
    return new Date(anio, mes, dia)
}