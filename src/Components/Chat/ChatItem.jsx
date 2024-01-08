import { useState } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { useAuth } from '../../Context/AuthContext';
import { getChatObjectMetadata } from '../../utils';
import moment from 'moment';
import isMobile from 'is-mobile';

/* eslint-disable react/prop-types */
const ChatItem = ({ chat, onClick, isActive, onChatDelete }) => {
    const { user } = useAuth();
    const [openOptions, setOpenOptions] = useState(false);

    const deleteChat = () => {};

    if (!chat) return;

    return (
        <>
            <div
                role="button"
                tabIndex={0}
                onClick={() => onClick(chat)}
                onKeyDown={(e) => {
                    if (isMobile()) return;
                    let key = e.key;
                    let keyCode = e.which || e.keyCode;
                    if (
                        key === 'Enter' ||
                        keyCode === 13 ||
                        key === ' ' ||
                        keyCode === 32
                    ) {
                        onClick(chat);
                    }
                }}
                onMouseLeave={() => setOpenOptions(false)}
                className={`group relative my-2 flex cursor-pointer items-start justify-between gap-3 rounded-3xl p-4 focus-within:bg-gray-400 hover:bg-gray-400 focus:bg-gray-400 focus:outline-none focus:ring-[3px] focus:ring-sky-500 disabled:opacity-50${
                    isActive
                        ? 'border-[1px] border-zinc-500 bg-gray-400 shadow-lg'
                        : ''
                }`}>
                <div className="flex flex-shrink-0 items-center justify-center">
                    <img
                        src={getChatObjectMetadata(chat, user).avatar}
                        className="h-12 rounded-md"
                    />
                </div>
                <div className="w-full">
                    <p className="truncate-1 font-bold capitalize text-white">
                        {getChatObjectMetadata(chat, user).fullName}
                    </p>
                </div>
                <small className="mb-2 inline-flex w-max flex-shrink-0 text-white/50">
                    {moment(chat.updatedAt)
                        .add('TIME_ZONE', 'hours')
                        .fromNow(true)}
                </small>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenOptions(!openOptions);
                    }}
                    className="absolute right-1 hidden self-center p-1 focus:outline-none focus:ring-[3px] focus:ring-sky-500 disabled:opacity-50"
                    aria-label="More Options">
                    <EllipsisVerticalIcon
                        aria-hidden={true}
                        className="h-6 w-0 text-zinc-100 opacity-0 transition-all duration-100 ease-in-out group-focus-within:w-6 group-focus-within:opacity-100 group-hover:w-6 group-hover:opacity-100 group-focus:w-6 group-focus:opacity-100 "
                    />
                </button>
            </div>
        </>
    );
};

export default ChatItem;
