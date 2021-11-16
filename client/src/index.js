import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import esLocale from 'date-fns/locale/es'
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios'
import dotenv from 'dotenv'
import { SnackbarProvider } from 'notistack';

dotenv.config();

axios.defaults.baseURL = process.env.REACT_APP_API || "http://localhost:3001";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <SnackbarProvider maxSnack={1}>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
          <App />
        </MuiPickersUtilsProvider>
      </SnackbarProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);