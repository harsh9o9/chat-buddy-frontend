/* eslint-disable react/prop-types */
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { createUserChat, getAvailableUsers } from '../../api';

import Button from '../Button';
import Select from '../Select';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { requestHandler } from '../../utils';
import { toast } from 'react-toastify';

const AddChatModal = ({ open, onClose, onSuccess }) => {
    // State to store the list of users, initialized as an empty array
    const [users, setUsers] = useState([]);
    // State to store the ID of a selected user, initialized as null
    const [selectedUserId, setSelectedUserId] = useState('');
    // State to determine if a chat is currently being created, initialized as false
    const [creatingChat, setCreatingChat] = useState(false);

    // Function to fetch users
    const getUsers = async () => {
        requestHandler(
            async () => await getAvailableUsers(),
            null, // No loading yet
            (res) => {
                const { data } = res;
                setUsers(data || []);
            },
            (message) => toast.error(message)
        );
    };

    // Function to reset local state values and close the modal/dialog
    const handleClose = () => {
        // Clear the list of users
        setUsers([]);
        // Reset the selected user ID
        setSelectedUserId('');
        onClose();
    };

    const createNewChat = async () => {
        // If no user is selected, show an toast alert
        if (!selectedUserId) return toast.info('Please select a user');

        // Handle the request to create a chat
        await requestHandler(
            async () => await createUserChat(selectedUserId),
            setCreatingChat, // for loading
            (res) => {
                const { data } = res;
                // If chat already exists with the selected user
                if (res.statusCode === 200) {
                    toast.info('Chat with selected user already exists');
                    return;
                }
                onSuccess(data);
                handleClose();
            },
            (message) => toast.error(message)
        );
    };

    useEffect(() => {
        // Check if the modal/dialog is not open
        if (!open) return;
        // Fetch users if the modal/dialog is open
        getUsers();
        // The effect depends on the 'open' value. Whenever 'open' changes, the effect will re-run.
    }, [open]);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/50 bg-opacity-75 transition-opacity" />
                </Transition.Child>
                <div className="fixed inset-0 z-10 overflow-y-visible">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                            <Dialog.Panel
                                className="relative transform overflow-x-hidden rounded-lg bg-gray-300 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6"
                                style={{
                                    overflow: 'inherit'
                                }}>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-semibold leading-6 text-black">
                                            Create chat
                                        </Dialog.Title>
                                        <button
                                            type="button"
                                            className="rounded-md bg-transparent text-black hover:text-gray-800 focus:outline-none focus:ring-[3px] focus:ring-sky-500"
                                            aria-label="Close"
                                            onClick={() => handleClose()}>
                                            <XMarkIcon
                                                className="h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </div>
                                <div className="my-5">
                                    <Select
                                        placeholder={'search...'}
                                        label={'Select a user to chat:'}
                                        value={selectedUserId}
                                        options={users.map((user) => {
                                            return {
                                                label: user.username,
                                                value: user._id
                                            };
                                        })}
                                        onChange={({ value }) => {
                                            // if user is creating normal chat just get a single user
                                            setSelectedUserId(value);
                                        }}
                                    />
                                </div>
                                <div className="mt-5 grid grid-cols-[1fr_1fr] gap-2">
                                    <Button
                                        disabled={creatingChat}
                                        severity={'secondary'}
                                        onClick={handleClose}
                                        fullWidth={true}
                                        className="text-black focus:ring-black">
                                        Close
                                    </Button>
                                    <Button
                                        disabled={creatingChat}
                                        fullWidth={true}
                                        className="text-white"
                                        onClick={createNewChat}>
                                        Create
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default AddChatModal;
