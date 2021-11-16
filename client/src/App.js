import { Route } from 'react-router-dom';
import AdminClients from './Components/AdminClients';
import FormReservas from './Components/FormReservas';
import './style.css'

function App() {
  return (
    <>
      <Route path="/" component={FormReservas} exact />
      <Route path="/admin" component={AdminClients} exact />
    </>
  );
}

export default App;
