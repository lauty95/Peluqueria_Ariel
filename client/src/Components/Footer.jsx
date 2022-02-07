import React from 'react';

const Footer = ({ precio, className }) => {
    return (
        <div className={className}>
            <h2>Nuestro precio actual es ${precio}</h2>
        </div>
    );
};

export default Footer;
