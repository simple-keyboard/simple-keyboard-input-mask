import App from './App';
import AppReact from './AppReact';

// React
import React from 'react';
import ReactDOM from 'react-dom';

let mode = "react";

if(mode === "react")
  ReactDOM.render(<AppReact />, document.getElementById('root'));
else
  new App();

