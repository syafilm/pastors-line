import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { history } from 'utils';
import App from './App';
import './app.scss';
// temporary use event turbolinks until turbolinks unused
// document.addEventListener('DOMContentLoaded', () => {
ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById('root')
)
