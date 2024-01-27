import Button from '../Components/Button';
import FanIcon from '../Components/SvgComponents/FanIcon';
import Input from '../Components/Input';
import { ToastContainer } from 'react-toastify';
import cartoon from '../assets/cartoon-graphic.webp';
import isMobile from 'is-mobile';
import { useAuth } from '../Context/AuthContext';
import { useState } from 'react';

const Register = () => {
    const [data, setData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: {
            firstName: '',
            lastName: ''
        }
    });

    const handleDataChange = (name) => {
        return (e) => {
            if (name === 'firstName' || name === 'lastName') {
                setData((prevValue) => ({
                    ...data,
                    fullName: {
                        ...prevValue.fullName,
                        [name]: e.target.value
                    }
                }));
            } else {
                setData({
                    ...data,
                    [name]: e.target.value
                });
            }
        };
    };

    const { register } = useAuth();

    const handleRegister = (e) => {
        e.preventDefault();
        register(data);
    };

    return (
        <>
            <ToastContainer position="top-left" />
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
                        className="flex h-full w-full flex-col items-center justify-around gap-5 rounded-xl bg-gray-100 px-8 py-5 sm:basis-1/2 sm:justify-evenly lg:basis-5/12"
                        style={{ minHeight: 'calc(100dvh - 2rem)' }}>
                        <div className="flex w-full flex-col items-center gap-6 text-center">
                            <FanIcon />
                            <div>
                                <h2 className="mb-1 text-2xl font-bold tracking-widest">
                                    {!isMobile()
                                        ? `Welcome to Chat Buddy!`
                                        : 'Welcome!'}
                                </h2>
                                <p className="text-sm tracking-tight">
                                    Please enter your details
                                </p>
                            </div>
                        </div>
                        <form onSubmit={handleRegister} className="w-full">
                            <div className="flex w-full flex-col gap-5">
                                <div className="grid grid-cols-[1fr_1fr] gap-2">
                                    <Input
                                        label="First Name: "
                                        type="text"
                                        value={data.firstName}
                                        autoComplete="given-name"
                                        onChange={handleDataChange('firstName')}
                                        className="bg-transparent"></Input>
                                    <Input
                                        label="Last Name: "
                                        type="text"
                                        value={data.lastName}
                                        autoComplete="family-name"
                                        onChange={handleDataChange('lastName')}
                                        className="bg-transparent"></Input>
                                </div>
                                <Input
                                    label="Username: "
                                    type="text"
                                    value={data.username}
                                    autoComplete="username"
                                    onChange={handleDataChange('username')}
                                    className="bg-transparent"></Input>
                                <Input
                                    label={'Email: '}
                                    type="email"
                                    value={data.email}
                                    autoComplete="email"
                                    onChange={handleDataChange('email')}
                                    className="bg-transparent"></Input>
                                <Input
                                    label="Password: "
                                    type="password"
                                    value={data.password}
                                    autoComplete="new-password"
                                    onChange={handleDataChange('password')}
                                    className="bg-transparent"></Input>

                                <Button
                                    // disabled={Object.values(data).some((val) => !val)}
                                    fullWidth
                                    type="sumbit"
                                    className="text-white">
                                    Register
                                </Button>
                            </div>
                        </form>
                        <div className="w-full text-center">
                            <small className="text-gray-800">
                                Already have an account?{' '}
                                <a
                                    className="font-bold hover:underline"
                                    href="/login">
                                    Login
                                </a>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
