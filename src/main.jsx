import React from 'react'
import ReactDom from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext.jsx'
import BodyClassManager from './context/BodyClass.jsx'

ReactDom.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <BodyClassManager />
      <App />
    </AppContextProvider>
  </BrowserRouter>,
)
