/* eslint-disable react/prop-types */
import { useId, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';

const Input = ({ label, fullWidth = true, ...props }) => {
    const id = useId();
    const [isDataVisible, setIsDataVisible] = useState(false);

    return (
        <div className={fullWidth ? 'w-full' : ''}>
            <label htmlFor={id} className="text-xs">
                {label}
            </label>
            {props?.type === 'password' ? (
                <div className="relative">
                    <input
                        {...props}
                        type={!isDataVisible ? 'password' : 'text'}
                        id={id}
                        className={`block h-10 border-b-2 border-gray-800 px-2 pb-2 outline-none focus:bg-white ${
                            fullWidth ? 'w-full' : ''
                        } ${props?.className || ''}`}
                    />
                    <button
                        type="button"
                        onClick={() => setIsDataVisible(!isDataVisible)}
                        className="absolute inset-y-0 right-1 flex items-center"
                        aria-label={`${
                            !isDataVisible
                                ? 'reveal input data'
                                : 'hide input data'
                        }`}>
                        {!isDataVisible ? (
                            <EyeSlashIcon
                                className="h-5 w-5 text-gray-800"
                                aria-hidden="true"
                            />
                        ) : (
                            <EyeIcon
                                className="h-5 w-5 text-gray-800"
                                aria-hidden="true"
                            />
                        )}
                    </button>
                </div>
            ) : (
                <input
                    {...props}
                    id={id}
                    className={`block h-10 border-b-2 border-gray-800 px-2 pb-2 outline-none focus:bg-white ${
                        fullWidth ? 'w-full' : ''
                    } ${props?.className || ''}`}
                />
            )}
        </div>
    );
};

export default Input;
