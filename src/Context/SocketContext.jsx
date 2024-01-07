/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from 'react';
import socketio from 'socket.io-client';
import { useAuth } from './AuthContext';

// Function to establish a socket connection with authorization token
const getSocket = (token) => {
    // create a socket connection with URI & turning credentials true for sending backup auth token in handshake
    return socketio(import.meta.env.VITE_SOCKET_URI, {
        withCredentials: true,
        auth: { token: 'Bearer ' + token }
    });
};

// creating a context to hold socket instance
const SocketContext = createContext({ socket: null });
// exposing a custom hook to access context variable
const useSocket = () => useContext(SocketContext);

// Context provider component to wrap child component and provide them access to the context
const SocketProvider = ({ children }) => {
    let { token } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        setSocket(getSocket(token));
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export { SocketProvider, useSocket };
