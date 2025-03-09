import './assets/main.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Configure Content Security Policy for media
const meta = document.createElement('meta');
meta.httpEquiv = "Content-Security-Policy";
meta.content = "default-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
               "media-src 'self' https: http: data: blob:; " +
               "connect-src 'self' https: http:; " +
               "img-src 'self' https: http: data: blob:; " +
               "style-src 'self' 'unsafe-inline' https:;";
document.head.appendChild(meta);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
