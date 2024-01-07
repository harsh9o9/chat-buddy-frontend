/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const PublicRoute = ({ children }) => {
    // getting user info and JWT
    const { token, user } = useAuth();

    // if there is token and user id present then navigate to chats page else render the children
    return token && user._id ? <Navigate to="/chat" replace /> : children;
};

export default PublicRoute;
