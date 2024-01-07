/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const PrivateRoute = ({ children }) => {
    // getting user info and JWT
    const { token, user } = useAuth();
    //   if no token or no user id the go to login page else children passed
    return !token || !user._id ? <Navigate to="/login" replace /> : children;
};

export default PrivateRoute;
