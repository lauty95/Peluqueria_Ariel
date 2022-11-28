import { Route } from 'react-router-dom';
import AdminClients from './Pages/AdminClients';
import FormReservas from './Pages/FormReservas';
import Graphics from './Pages/Graphics';
import Promotions from './Pages/Promotions';
import Searcher from './Pages/Searcher';
import './style.css'

function App() {
  window.location.replace("http://66.97.34.27")
  // return (
  //   <>
  //     <Route path="/" component={FormReservas} exact />
  //     <Route path="/admin" component={AdminClients} exact />
  //     <Route path="/statistics" component={Graphics} exact />
  //     <Route path="/promotions" component={Promotions} exact />
  //     <Route path="/search" component={Searcher} exact />
  //   </>
  // );
}

export default App;
