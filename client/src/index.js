// eslint-disable-next-line
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom"
import {Provider} from "react-redux"
import { store } from './Redux/store';
import { ThemeProvider } from '@emotion/react';
import theme from './utils/MUITheme';
import {SnackbarProvider} from "notistack"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <SnackbarProvider maxSnack={2} >
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </SnackbarProvider>
  </BrowserRouter>
);

