import { Route } from 'react-router-dom';
import AdminClients from './Components/AdminClients';
import FormReservas from './Components/FormReservas';
import Graphics from './Components/Graphics';
import './style.css'

function App() {
  return (
    <>
      <Route path="/" component={FormReservas} exact />
      <Route path="/admin" component={AdminClients} exact />
      <Route path="/statistics" component={Graphics} exact />
    </>
  );
}

export default App;
