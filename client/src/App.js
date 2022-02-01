import { Route } from 'react-router-dom';
import AdminClients from './Pages/AdminClients';
import FormReservas from './Pages/FormReservas';
import Graphics from './Pages/Graphics';
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
