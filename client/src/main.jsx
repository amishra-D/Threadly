import React from 'react';
import './index.css'
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store } from './App/store';
import { BrowserRouter} from "react-router-dom"

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </Provider>
);
