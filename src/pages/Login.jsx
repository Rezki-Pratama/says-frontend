import React, { useState } from 'react';
import { Link } from "react-router-dom";

import '../../src/App.css';

function Login() {
  const [sender, setSender] = useState('');
    console.log(sender)
  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <div>
          <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setSender(event.target.value)} />
        </div>
        <Link onClick={e => (!sender) ? e.preventDefault() : null} to={`/home?name=${sender}`}>
          <button className={'button mt-20'} type="submit">Sign In</button>
        </Link>
      </div>
    </div>
  );
}

export default Login;