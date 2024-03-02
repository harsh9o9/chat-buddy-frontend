import { ToastContainer, toast } from 'react-toastify';
import { requestHandler, updateStateObject } from '../utils';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '../Components/Button';
import Input from '../Components/Input';
import Loader from '../Components/Loader';
import { QUERY_PARAMS_MAP } from '../utils/constants.js';
import { resetPassword } from '../api';
import { useState } from 'react';

const INPUT_NAMES = Object.freeze({
    NEW_PASSWORD: 'newPassword',
    CONFIRM_PASSWORD: 'confirmPassword'
});

const ERROR_MESSAGES = Object.freeze({
    TOO_SHORT: 'Password should contain at least 8 characters.',
    NOT_MATCHING: 'Password does not match.'
});

const ResetPassword = () => {
    const navigate = useNavigate();
    const { resetToken } = useParams();
    const [isLoading, setIsLoading] = useState(false);

    const [inputData, setInputData] = useState({
        [INPUT_NAMES.NEW_PASSWORD]: '',
        [INPUT_NAMES.CONFIRM_PASSWORD]: ''
    });

    const [errorMessages, setErrorMessages] = useState({
        [INPUT_NAMES.NEW_PASSWORD]: '',
        [INPUT_NAMES.CONFIRM_PASSWORD]: ''
    });

    const [validationError, setValidationError] = useState({
        [INPUT_NAMES.NEW_PASSWORD]: false,
        [INPUT_NAMES.CONFIRM_PASSWORD]: false
    });

    const handleDataChange = (name) => (e) => {
        const data = e.target.value?.trim();

        updateStateObject(name, data, inputData, setInputData);
        updateStateObject(name, '', errorMessages, setErrorMessages);
        runInputValidations(name, false);
    };

    const isDisabled = () => {
        return !(
            inputData.newPassword &&
            inputData.confirmPassword &&
            inputData.newPassword === inputData.confirmPassword &&
            validationError[INPUT_NAMES.NEW_PASSWORD] &&
            validationError[INPUT_NAMES.CONFIRM_PASSWORD]
        );
    };

    const runInputValidations = (inputName, showErrorMsg) => {
        if (
            Object.values(INPUT_NAMES).includes(inputName) &&
            inputData[inputName]
        ) {
            const siblingInputName =
                inputName === INPUT_NAMES.NEW_PASSWORD
                    ? INPUT_NAMES.CONFIRM_PASSWORD
                    : INPUT_NAMES.NEW_PASSWORD;
            if (inputData[inputName]?.length < 8) {
                showInputAlert(
                    inputName,
                    ERROR_MESSAGES.TOO_SHORT,
                    showErrorMsg
                );
            } else if (
                inputData[siblingInputName] &&
                inputData.newPassword !== inputData.confirmPassword
            ) {
                showInputAlert(
                    inputName,
                    ERROR_MESSAGES.NOT_MATCHING,
                    showErrorMsg
                );
            }
        }
    };

    const showInputAlert = (inputName, alertMessage, isVisualAlert) => {
        updateStateObject(inputName, true, validationError, setValidationError);
        if (isVisualAlert) {
            updateStateObject(
                inputName,
                alertMessage,
                errorMessages,
                setErrorMessages
            );
        }
    };

    const onResetPasswordSubmit = (evt) => {
        evt.preventDefault();
        resetPasswordHandler();
    };

    const resetPasswordHandler = async () => {
        await requestHandler(
            async () =>
                await resetPassword(
                    resetToken,
                    inputData[INPUT_NAMES.NEW_PASSWORD],
                    inputData[INPUT_NAMES.CONFIRM_PASSWORD]
                ),
            setIsLoading,
            () => {
                navigate(`/login?${QUERY_PARAMS_MAP.RESET_PASSWORD.name}`);
            },
            (message) => toast.error(message)
        );
    };

    return (
        <>
            <ToastContainer position="top-left" />
            <div className="bg-gray-300">
                <div className="flex min-h-[100svh] items-center justify-center p-4">
                    <div className="w-full max-w-lg rounded-md bg-gray-100 p-8 shadow-md sm:p-12">
                        <h1 className=" mb-6 text-3xl font-bold text-gray-900">
                            Reset Password
                        </h1>
                        {isLoading ? (
                            <div className="flex h-40 items-center justify-center">
                                <Loader />
                            </div>
                        ) : (
                            <form
                                className="mt-6 flex flex-col gap-6"
                                onSubmit={onResetPasswordSubmit}>
                                <Input
                                    label="Enter your new password: "
                                    type="password"
                                    value={inputData.newPassword}
                                    autoComplete="new-password"
                                    onInput={handleDataChange(
                                        INPUT_NAMES.NEW_PASSWORD
                                    )}
                                    onBlur={(e) =>
                                        runInputValidations(
                                            INPUT_NAMES.NEW_PASSWORD,
                                            true
                                        )
                                    }
                                    className="bg-transparent"
                                    errorText={
                                        errorMessages[INPUT_NAMES.NEW_PASSWORD]
                                    }
                                />
                                <Input
                                    label="Retype your new password: "
                                    type="password"
                                    value={inputData.confirmPassword}
                                    autoComplete="new-password"
                                    onInput={handleDataChange(
                                        INPUT_NAMES.CONFIRM_PASSWORD
                                    )}
                                    onBlur={() =>
                                        runInputValidations(
                                            INPUT_NAMES.CONFIRM_PASSWORD,
                                            true
                                        )
                                    }
                                    className="bg-transparent"
                                    errorText={
                                        errorMessages[
                                            INPUT_NAMES.CONFIRM_PASSWORD
                                        ]
                                    }
                                />
                                <Button
                                    fullWidth
                                    type="submit"
                                    className="mt-4 text-white"
                                    disabled={isDisabled()}>
                                    Submit
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
