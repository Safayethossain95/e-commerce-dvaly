import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import 'bootstrap/dist/css/bootstrap.min.css';
import {StoreProvider} from './Store'
ReactDOM.render(
    <StoreProvider>
      <HelmetProvider>
         <App />
      </HelmetProvider>
    </StoreProvider>
    ,
  document.getElementById('root')
);


