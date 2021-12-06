import axios from 'axios'
import React, { useEffect, useState } from 'react'
// import './../styles/graphic.css'
import { Line } from 'react-chartjs-2'
import { Table, Button } from 'react-bootstrap';

function Graphics(props) {
    const fechaActual = new Date().toLocaleString('es-AR', { dateStyle: 'short' }).replaceAll('/', '-')
    const [values, setValues] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const [semana, setSemana] = useState([0, 0, 0, 0, 0, 0])
    const [precio, setPrecio] = useState(0)

    useEffect(() => {
        axios.get('/statics')
            .then(r => setValues(r.data))
        axios.get(`/semana/${fechaActual}`)
            .then(r => setSemana(r.data))
        axios.get(`/precio`)
            .then(r => setPrecio(r.data.precio))
    }, [])

    const mayor = () => {
        let may = values[0]
        for (let i = 1; i < values.length; i++) {
            if (may < values[i]) may = values[i]
        }
        return may + 5
    }

    const menor = () => {
        let min = values[0]
        for (let i = 1; i < values.length; i++) {
            if (min > values[i]) min = values[i]
        }
        if (min - 5 < 0) return 0
        return min - 5
    }

    const month = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

    const tooltipLine = {
        id: 'tooltipLine',
        afterDraw: chart => {
            if (chart.tooltip._active && chart.tooltip._active.length) {
                const ctx = chart.ctx;
                ctx.save();
                const activePoint = chart.tooltip._active[0];
                ctx.beginPath();
                ctx.moveTo(activePoint.tooltipPosition().x, activePoint.tooltipPosition().y);
                ctx.lineTo(activePoint.tooltipPosition().x, chart.chartArea.bottom);
                ctx.lineWidth = '0.1em';
                ctx.strokeStyle = '#333333';
                ctx.stroke();
                ctx.restore()
            }
        }
    }

    const data = (canvas) => {
        const ctx = canvas.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, '#FFBE00');
        gradient.addColorStop(0.8, '#FFBE00');
        gradient.addColorStop(1, '#e3e3e3');

        return {
            labels: month,
            datasets: [{
                label: "Cantidad",
                data: values,
                stroke: 'start',
                backgroundColor: gradient,
                borderColor: '#FFBE00',
                borderWidth: 3
            }]
            // {
            //     label: "Ganancia",
            //     data: values.map(val => val * 400),
            //     stroke: 'start',
            //     backgroundColor: gradient,
            //     borderColor: '#FFBE00',
            //     borderWidth: 3
            // }]
        }
    }

    const options = {
        elements: {
            point: {
                radius: 0
            }
        },
        legend: {
            display: false
        },
        // responsive: true,
        maintainAspectRatio: true,
        scales: {
            yAxes: [
                {
                    gridLines: {
                        drawBorder: true,
                        display: false
                    },
                    ticks: {
                        beginAtZero: false,
                        min: menor(),
                        max: mayor(),
                        display: false
                    }
                }
            ],
            xAxes: [{
                gridLines: {
                    drawBorder: true,
                    display: false
                }
            }]
        },
        tooltips: {
            xPadding: 20,
            yPadding: 10,
            displayColors: false,
            bodyFontSize: 16,
            bodyFontStyle: 'bold',
            mode: 'index',
            intersect: false
        },
        hover: {
            mode: 'index',
            intersect: false
        },
    }
    return (
        <div className="graphic">
            <div className="botones">
                <Button variant="primary" onClick={() => props.history.push("/admin")}>
                    Volver
                </Button>
            </div>
            <h1>Cantidad de clientes por mes</h1>
            <div className="grafico">
                <Line
                    data={data}
                    height={'60%'}
                    width={'100%'}
                    options={options}
                    plugins={[tooltipLine]}
                />
            </div>
            <br />
            <h1>Cantidad de clientes esta semana</h1>
            {
                semana[0].dia ?
                    <Table responsive="sm">
                        <thead>
                            <tr>
                                <th>Hoy</th>
                                <th>Mañana</th>
                                <th>{semana[2].dia}</th>
                                <th>{semana[3].dia}</th>
                                <th>{semana[4].dia}</th>
                                <th>{semana[5].dia}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {
                                    semana.map(el => <td>{el.cantidad}</td>)
                                }
                            </tr>
                            <tr>
                                {
                                    semana.map(el => <td>${el.cantidad * precio}</td>)
                                }
                            </tr>
                        </tbody>
                    </Table>
                    :
                    <div class="d-flex justify-content-center loading">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
            }
        </div>
    )
}

export default Graphics
