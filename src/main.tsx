import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from './config/emailjs';

// Initialize EmailJS with the public key
emailjs.init(EMAILJS_CONFIG.publicKey);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)