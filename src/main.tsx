import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

//omogucava moderni rendering
createRoot(document.getElementById('root')!).render(
  //root je prazan div u koji HTML ubacuje celu aplikaciju
  //u index.html imamo inicijalizaciju ove vrednosti

  //strict mode je razvojni alat koji pomaze da otkrijes los kod, bugove...
  //browser router omogucava navigaciju izmedju stranica, promenu URL-a, bez reload-a stranice
  //bez njega useNavigate, Route, Link ne bi radili
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
