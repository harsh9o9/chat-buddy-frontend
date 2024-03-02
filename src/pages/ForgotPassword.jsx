import { ToastContainer, toast } from 'react-toastify';

import Button from '../Components/Button';
import Input from '../Components/Input';
import { forgotPassword } from '../api';
import { requestHandler } from '../utils';
import { useState } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const onForgotPasswordSubmit = (evt) => {
        evt.preventDefault();
        forgotPasswordHandler();
        setIsSubmitted(true);
    };

    const forgotPasswordHandler = async () => {
        await requestHandler(
            async () => await forgotPassword(email.trim()),
            setIsLoading,
            null,
            (message) => toast.error(message)
        );
    };

    return (
        <>
            <ToastContainer position="top-left" />
            <div className="bg-gray-300">
                <div className="flex min-h-[100svh] items-center justify-center p-4">
                    <div className="max-w-md rounded-md bg-gray-100 p-12 shadow-md">
                        <h1 className=" mb-6 text-3xl font-bold text-gray-900">
                            Forgot Password
                        </h1>
                        {!isSubmitted ? (
                            <form
                                className="mt-6"
                                onSubmit={onForgotPasswordSubmit}>
                                <Input
                                    label="Email: "
                                    type="email"
                                    value={email}
                                    autoComplete="email"
                                    onChange={handleEmailChange}
                                    className="bg-transparent"
                                />
                                <p className="my-6 text-sm">
                                    We'll send a verification code to this email
                                    phone number if it matches an existing
                                    ChatBuddy account.
                                </p>

                                <Button
                                    fullWidth
                                    type="submit"
                                    className="text-white">
                                    {isLoading ? 'Loading' : 'Next'}
                                </Button>
                            </form>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <p>
                                    Check your <strong>email address</strong>,
                                    you will recive a email. Use it to reset
                                    your password and then try again to login.
                                </p>
                                <p>
                                    If you did not receive a email please check
                                    the email or try again after some time.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
