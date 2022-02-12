import React from 'react';

const MessagePromo = ({ compararFecha, diaActual, diaPromo, precio }) => {
    return (
        <div className="filaFormulario">
            {
                compararFecha(diaActual, diaPromo) ?
                    <p className={`havePromo`}>Usted tiene una promoción válida hasta el {diaPromo} con un coste de {precio / 2}</p>
                    :
                    <>
                        <p className={`doesntHavePromo`}>Si elije esta fecha el corte te costará {precio}</p>
                        <p className={`doesntHavePromo`}>Para mantener la promo elige una fecha anterior al {diaPromo}</p>
                    </>
            }
        </div>
    );
};

export default MessagePromo;
