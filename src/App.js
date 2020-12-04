import logo from './logo.svg';
import '../src/tailwind.output.css';
import '../src/styles/style.scss'
import Home from './pages/Home';
import Login from './pages/Login';
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {

  return (
    <div className="bg-lightsecondary">
      <Router>
        <Route path="/" exact component={Login} />
        <Route path="/home" component={Home} />
      </Router>
    </div>
  );
}

export default App;
