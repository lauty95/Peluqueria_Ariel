import React from 'react';

const Spinner = () => {
    return (
        <div className='espera'>
            <div className="d-flex justify-content-center loading">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
            <p>Esto puede demorar porque está alojado en un servidor gratuito</p>
            <p>Si demora en conectarte recarga la página</p>
        </div>
    );
};

export default Spinner;
