import { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import Input from '../Components/Input';
import Button from '../Components/Button';
import { ToastContainer } from 'react-toastify';
import cartoon from '../assets/cartoon-graphic.webp';
import isMobile from 'is-mobile';

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
                <div className="min-h-svh flex max-w-screen-2xl items-center justify-evenly p-4">
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
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="2.5em"
                                viewBox="0 0 512 512">
                                <path d="M258.6 0c-1.7 0-3.4 .1-5.1 .5C168 17 115.6 102.3 130.5 189.3c2.9 17 8.4 32.9 15.9 47.4L32 224H29.4C13.2 224 0 237.2 0 253.4c0 1.7 .1 3.4 .5 5.1C17 344 102.3 396.4 189.3 381.5c17-2.9 32.9-8.4 47.4-15.9L224 480v2.6c0 16.2 13.2 29.4 29.4 29.4c1.7 0 3.4-.1 5.1-.5C344 495 396.4 409.7 381.5 322.7c-2.9-17-8.4-32.9-15.9-47.4L480 288h2.6c16.2 0 29.4-13.2 29.4-29.4c0-1.7-.1-3.4-.5-5.1C495 168 409.7 115.6 322.7 130.5c-17 2.9-32.9 8.4-47.4 15.9L288 32V29.4C288 13.2 274.8 0 258.6 0zM256 224a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                            </svg>
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
