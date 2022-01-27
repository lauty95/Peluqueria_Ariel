const phoneDefault = 5493492587791

export const contactMe = (phoneNumber, message, name) => {
    return function () {
        if (!message && !phoneNumber) {
            if (name) {
                window.open(
                    `https://wa.me/${phoneDefault}?text=Hola Lauty! Soy ${name}, me estoy contactando desde tu sitio web`,
                    '_blank'
                );
            } else {
                window.open(
                    `https://wa.me/${phoneDefault}?text=Hola Lauty! Me contacto desde tu sitio web`,
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