import { Navigate, Route, Routes } from 'react-router-dom';

import Chat from './pages/Chat';
import Login from './pages/Login';
import Lost from './Components/Lost';
import PrivateRoute from './Components/PrivatePoute';
import PublicRoute from './Components/PublicRoute';
import Register from './pages/Register';
import { useAuth } from './Context/AuthContext';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
    let { token, user } = useAuth();
    return (
        <Routes>
            {/* if user is authenticated the go to chats page else login page */}
            <Route
                path="/"
                element={
                    token && user._id ? (
                        <Navigate to="/chat" />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />

            {/* private route can't be accessed directly */}
            <Route
                path="/chat"
                element={
                    <PrivateRoute>
                        <Chat />
                    </PrivateRoute>
                }
            />

            {/* public route login can be accessed directly */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />

            {/* public route register can be accessed directly */}
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />
            <Route
                path="/forgot-password"
                element={
                    <PublicRoute>
                        <ForgotPassword />
                    </PublicRoute>
                }
            />
            <Route
                path="/resetpass/:resetToken"
                element={
                    <PublicRoute>
                        <ResetPassword />
                    </PublicRoute>
                }
            />
            <Route path="*" element={<Lost />}></Route>
        </Routes>
    );
}

export default App;
