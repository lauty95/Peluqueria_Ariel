import React from 'react';

const Footer = ({ precio, className }) => {
    return (
        <div className={className}>
            <marquee><h2>Nuestro precio actual es ${precio} | Los mensajes de whatsapp están deshabilitados temporalmente</h2></marquee>
        </div>
    );
};

export default Footer;
