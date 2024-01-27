import { LocalStorage, requestHandler } from '../../utils';
import { Menu, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { logoutUser, masterLogoutUser } from '../../api';

import { ChevronDownIcon } from '@heroicons/react/20/solid';
import SignOutEverywhereIcon from '../SvgComponents/SignOutEverywhereIcon';
import SignOutIcon from '../SvgComponents/SignOutIcon';
import { toast } from 'react-toastify';

const dropdownMenuItemIconNames = {
    signOut: SignOutIcon,
    signOutEveryWhere: SignOutEverywhereIcon
};

let ChatsDropdownData = [
    {
        key: 'signOut',
        name: 'Sign Out',
        disabled: false,
        onClick: async () => {
            await requestHandler(
                async () => await logoutUser(),
                null, // TODO: need to add loading logic here
                // On success clear local storage,
                (res) => {
                    LocalStorage.clear();
                    window.location.href = '/login';
                },
                (message) => toast.error(message)
            );
        }
    },
    {
        key: 'signOutEveryWhere',
        name: 'Sign Out Everywhere',
        disabled: false,
        onClick: async () => {
            await requestHandler(
                async () => await masterLogoutUser(),
                null, // TODO: need to add loading logic here
                // On success clear local storage,
                (res) => {
                    LocalStorage.clear();
                    window.location.href = '/login';
                },
                (message) => toast.error(message)
            );
        }
    }
];

const ChatsDropdown = ({ trigger }) => {
    return (
        <>
            <Menu as="div" className="relative">
                <div>
                    <Menu.Button className="inline-flex items-center justify-center gap-1 rounded-md bg-black/10 py-2 pl-2 pr-1 hover:bg-black/20 focus:bg-black/20 focus:outline-none focus:ring-[3px] focus:ring-sky-500">
                        {trigger}
                        <ChevronDownIcon
                            className=" h-5 w-5 text-gray-200 hover:text-gray-100"
                            aria-hidden="true"
                        />
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <div className="px-1 py-1 ">
                            {ChatsDropdownData.map((dropdownItem) => {
                                const IconName =
                                    dropdownMenuItemIconNames[dropdownItem.key];

                                return (
                                    <Menu.Item
                                        key={dropdownItem.key}
                                        disabled={
                                            dropdownItem.disabled ? true : false
                                        }>
                                        {({ active, disabled }) => (
                                            <button
                                                className={`${
                                                    active
                                                        ? 'bg-gray-400 text-white'
                                                        : 'text-gray-900'
                                                }
                                        ${
                                            disabled ? 'line-through' : ''
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                onClick={() =>
                                                    dropdownItem.onClick()
                                                }>
                                                <IconName
                                                    active={active ? 1 : 0}
                                                    className="mr-2 h-5 w-5"
                                                    aria-hidden={true}
                                                />
                                                {dropdownItem.name}
                                            </button>
                                        )}
                                    </Menu.Item>
                                );
                            })}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </>
    );
};

export default ChatsDropdown;
