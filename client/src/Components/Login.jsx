import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions'
import { useSnackbar } from 'notistack';
import Slide from '@material-ui/core/Slide';

const Login = ({ value, onClick, onChange, className }) => {
    const { enqueueSnackbar } = useSnackbar();
    const toastVerifyDNI = () => {
        enqueueSnackbar('Revisa tu DNI', {
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'left',
            },
            TransitionComponent: Slide,
            variant: 'error',
        })
    }

    const verifyDNI = (dni) => {
        return new RegExp(/^[0-9]{8}$/).test(dni)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!verifyDNI(value)) {
            toastVerifyDNI()
        } else {
            onClick()
        }
    }
    return (
        <div className={`filaFormulario ${className}`}>
            <input name='id' value={value} onChange={onChange} type="dni" placeholder='Ingrese su DNI' />
            <button className="boton" onClick={handleSubmit}>Siguiente</button>
        </div>
    );
};


const mapDispatchToProps = function (dispatch) {
    return bindActionCreators(actionCreators, dispatch)
}

export default connect(null, mapDispatchToProps)(Login);
