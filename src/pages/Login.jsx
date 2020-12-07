import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import qs from 'querystring'

import '../../src/App.css';
import { AuthContext } from '../App';

const END_POINT = 'http://127.0.0.1:5000/';

function Login(props) {

  const {dispatch} = useContext(AuthContext)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmit, setIsSubmit] = useState(false)

  const [message, setMessage] = useState({
    message: '',
    display: 'block'
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    setIsSubmit(true)
    setMessage({
      message: ''
    })

    const configHeaders = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    const reqBody = {
      email: email,
      password: password
    }

    axios.post(END_POINT + 'login', qs.stringify(reqBody), configHeaders).then(res => {
      if(res.data.success === true) {
        dispatch({
          type: 'LOGIN',
          payload: res.data
        })
        console.log('berhasil login')
        props.history.push('/home')

      } else {
        setIsSubmit(false)
        setMessage({
          message: res.data.message
        })
      }

      throw res
    }).catch(e => {
      console.log(e)
    })


  }


  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <input placeholder="Email" className="joinInput" type="text" onChange={(event) => setEmail(event.target.value)} />
            <input placeholder="Password" className="joinInput" type="password" onChange={(event) => setPassword(event.target.value)} />
          </div>
          <button className={'button mt-20'} type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;