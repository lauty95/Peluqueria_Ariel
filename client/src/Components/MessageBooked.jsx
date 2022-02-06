import React from 'react';

const MessageBooked = ({ fecha, nombre }) => {
    return (
        <div className='booked'>
            <p>{`Hola ${nombre}! Tienes registrado un turno a la peluquería el día ${fecha}.`}</p>
            <p>Hasta entonces no podrás sacar otro turno</p>
        </div>
    );
};

export default MessageBooked;
