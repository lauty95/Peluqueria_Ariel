import React from 'react';

const MessagePromo = ({ compararFecha, diaActual, diaPromo }) => {
    return (
        <div className="filaFormulario">
            {
                compararFecha(diaActual, diaPromo) ?
                    <p className={`havePromo`}>Usted tiene una promoción válida hasta el {diaPromo}</p>
                    :
                    <p className={`doesntHavePromo`}>Le recomendamos elegir una fecha anterior al {diaPromo}</p>
            }
        </div>
    );
};

export default MessagePromo;
