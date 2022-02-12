const phoneDefault = 3492322020

export const contactMe = (phoneNumber, message, name) => {
    return function () {
        if (!message && !phoneNumber) {
            if (name) {
                window.open(
                    `https://wa.me/${phoneDefault}?text=Hola Ariel! Soy ${name}, me estoy contactando desde tu sitio web`,
                    '_blank'
                );
            } else {
                window.open(
                    `https://wa.me/${phoneDefault}?text=Hola Ariel! Me contacto desde tu sitio web`,
                    '_blank'
                );
            }
        } else {
            window.open(
                `https://wa.me/549${phoneNumber}?text=${message || ''}`,
                '_blank'
            );
        }
    }
}

export const sendMessage = (mensaje, tel, turno) => {
    return function () {
        let msg = mensaje.replace("HORA", `*${turno} hs*`)
        window.open(
            `https://wa.me/549${tel}?text=${msg}`,
            '_blank'
        );
    }
}