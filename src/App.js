import logo from './logo.svg';
import '../src/tailwind.output.css';
import '../src/styles/style.scss'
import Home from './pages/Home';
import Login from './pages/Login';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createContext, useReducer } from 'react';

export const AuthContext = createContext()

const initialState = {
  isAuthenticated: (localStorage.getItem('token') ? true : false),
  username: null,
  token: null
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
        localStorage.setItem('username', JSON.stringify(action.payload.user))
        localStorage.setItem('token', JSON.stringify(action.payload.token))
        return {
          ...state,
          isAuthenticated: true,
          username: action.payload.user,
          token: action.payload.token
        }
    case 'LOGOUT':
        localStorage.clear()
        return {
          isAuthenticated: false,
          username: null
        }
    default:
      return state
  }
}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState)
  console.log(state)
  return (
    <div className="bg-lightsecondary">
      <Router>
        <Switch>
          <AuthContext.Provider value={{
            state,
            dispatch
          }}>
              <Route exact path="/" exact component={Login} />
              <Route path="/home" component={Home} />
          </AuthContext.Provider>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
