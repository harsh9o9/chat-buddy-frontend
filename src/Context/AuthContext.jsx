/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from 'react';
import { LocalStorage, requestHandler } from '../utils';
import { loginUser, registerUser, logoutUser } from '../api';
import Loader from '../Components/Loader';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// crating context variable with default values
const AuthContext = createContext({
    user: null,
    token: null,
    login: async () => {},
    logout: async () => {},
    register: () => {}
});

// exposing a custom hook to access context variable
const useAuth = () => useContext(AuthContext);

// Context provider component to wrap child component and provide them access to the context
const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    const login = async (data) => {
        await requestHandler(
            async () => await loginUser(data),
            setIsLoading,
            (res) => {
                const { data } = res;
                setUser(data.user);
                setToken(data.accessToken);
                LocalStorage.set('user', data.user);
                LocalStorage.set('token', data.accessToken);
                navigate('/chat');
            },
            (message) => toast.error(message)
        );
    };

    const register = async (data) => {
        await requestHandler(
            async () => await registerUser(data),
            setIsLoading,
            () => {
                toast.success('Account created successfully, Please login!');
                navigate('/login');
            },
            (message) => toast.error(message)
        );
    };

    const logut = async () => {
        requestHandler(
            async () => logoutUser(),
            setIsLoading,
            () => {
                setUser(null);
                setToken(null);
                LocalStorage.clear();
                navigate('/login');
            },
            (message) => toast.error(message)
        );
    };

    useEffect(() => {
        setIsLoading(true);
        let _token = LocalStorage.get('token');
        let _user = LocalStorage.get('user');
        if (_token && _user?._id) {
            setToken(_token);
            setUser(_user);
        }

        setIsLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, logut, register }}>
            {isLoading ? <Loader className={'min-h-screen'} /> : children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider, useAuth };
