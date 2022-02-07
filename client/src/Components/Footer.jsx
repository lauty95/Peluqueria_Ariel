import React from 'react';

const Footer = ({ precio }) => {
    return (
        <div className='footer'>
            <h2>Nuestro precio actual es ${precio}</h2>
        </div>
    );
};

export default Footer;
