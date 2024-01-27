import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import App from './App.jsx';
import { AuthProvider } from './Context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { SocketProvider } from './Context/SocketContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <BrowserRouter>
        <AuthProvider>
            <SocketProvider>
                <App />
            </SocketProvider>
        </AuthProvider>
    </BrowserRouter>
    // </React.StrictMode>
);
