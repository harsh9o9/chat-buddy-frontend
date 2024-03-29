import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';

import Button from '../Components/Button';
import FanIcon from '../Components/SvgComponents/FanIcon';
import Input from '../Components/Input';
import { Link } from 'react-router-dom';
import { QUERY_PARAMS_MAP } from '../utils/constants';
import cartoon from '../assets/cartoon-graphic.webp';
import { useAuth } from '../Context/AuthContext';

const Login = () => {
    const [data, setData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.has(QUERY_PARAMS_MAP.SESSION_EXPIRED.name)) {
            toast.error('Your session expired, please re-login');
        } else if (queryParams.has(QUERY_PARAMS_MAP.RESET_PASSWORD.name)) {
            toast.success('Password reset successfully, Please login!');
        }
    }, []);

    const handleDataChange = (name) => {
        return (evt) => {
            setData({
                ...data,
                [name]: evt.target.value
            });
        };
    };

    const { login } = useAuth();

    const handleLogin = (e) => {
        e.preventDefault();
        login(data);
    };

    return (
        <>
            <ToastContainer
                limit={3}
                pauseOnFocusLoss={false}
                position="top-left"
            />
            <div className="bg-gray-300">
                <div className="min-h-svh flex items-center justify-evenly p-4">
                    <div className="hidden sm:block sm:basis-1/2 lg:basis-7/12">
                        <img
                            className="mx-auto my-0"
                            src={cartoon}
                            alt="cartoon"
                        />
                    </div>
                    <div
                        className="flex h-full w-full flex-col items-center justify-evenly gap-5 rounded-xl bg-gray-100 p-8 sm:basis-1/2 lg:basis-5/12"
                        style={{ minHeight: 'calc(100dvh - 2rem)' }}>
                        <div className="flex w-full flex-col items-center gap-6 text-center">
                            <FanIcon />
                            <div>
                                <h2 className="mb-1 text-2xl font-bold tracking-widest">
                                    Welcome Back!
                                </h2>
                                <p className="text-sm tracking-tight">
                                    Please enter your details
                                </p>
                            </div>
                        </div>
                        <form onSubmit={handleLogin} className="w-full">
                            <div className="flex w-full flex-col gap-5">
                                <Input
                                    label="Email: "
                                    type="email"
                                    value={data.email}
                                    autoComplete="email"
                                    onChange={handleDataChange('email')}
                                    className="bg-transparent"
                                />

                                <Input
                                    label="Password: "
                                    type="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    onChange={handleDataChange('password')}
                                    className="bg-transparent"
                                />
                                <Link
                                    to={'/forgot-password'}
                                    className="text-right text-xs">
                                    ForgotPassword?
                                </Link>
                                <Button
                                    fullWidth
                                    type="submit"
                                    className="text-white">
                                    Login
                                </Button>
                            </div>
                        </form>
                        <div className="w-full text-center">
                            <small className="text-gray-800">
                                Don&apos;t have an account?{' '}
                                <a
                                    className="font-bold hover:underline"
                                    href="/register">
                                    Register
                                </a>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
