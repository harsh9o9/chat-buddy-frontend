import {
    ArrowLongLeftIcon,
    PaperAirplaneIcon
} from '@heroicons/react/20/solid';
import {
    LocalStorage,
    getChatObjectMetadata,
    getFullName,
    requestHandler
} from '../utils';
import { ToastContainer, toast } from 'react-toastify';
import { getChatMessages, getUserChats, sendMessage } from '../api';
import { lazy, useEffect, useRef, useState } from 'react';

import { ChatEvents } from '../utils/constants';
import ChatItem from '../Components/Chat/ChatItem';
import Input from '../Components/Input';
import Loader from '../Components/Loader';
import MessageItem from '../Components/Chat/MessageItem';
import Typing from '../Components/Chat/Typing';
import isMobile from 'is-mobile';
import { useAuth } from '../Context/AuthContext';
import { useSocket } from '../Context/SocketContext';

const AddChatModal = lazy(() => import('../Components/Chat/AddChatModal'));
const ChatsDropdown = lazy(() => import('../Components/Chat/ChatsDropdown'));

const Chat = () => {
    const { user } = useAuth();
    const { socket } = useSocket();
    const currentChat = useRef(null);
    const [openAddChat, setOpenAddChat] = useState(false); // to control the add chat modal
    const [loadingChats, setLoadingChats] = useState(false); // To indicate loading of chats
    const [loadingMessages, setLoadingMessages] = useState(false); // To indicate loading of messages
    const [isTyping, setIsTyping] = useState(false); // To track if someone is currently typing
    const [chats, setChats] = useState([]); // To store user's chats
    const [messages, setMessages] = useState([]); // To store chat messages
    const [message, setMessage] = useState(''); // To store the currently typed message
    const [showMessagesPannel, setShowMessagesPannel] = useState(
        () => !isMobile()
    );
    const [showChatsPannel, setShowChatsPannel] = useState(true);

    const [localSearchQuery, setLocalSearchQuery] = useState(''); // For local search functionality

    const onNewChat = (chat) => {
        setChats((prev) => [chat, ...prev]);
    };

    const onMessageReceived = (message) => {
        // Check if the received message belongs to the currently active chat
        if (message.chat !== currentChat.current?._id) {
        } else {
            setMessages((prev) => [message, ...prev]);
        }
    };

    /**
     * handle the master logout socket event
     * Clear local storage, expire refreshTkn, redirect user to login
     */
    const onMasterLogout = () => {
        LocalStorage.clear();
        document.cookie =
            'refreshTkn=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        window.location.href = '/login';
    };

    // Event handler which runs when user is typing message
    const handleOnMessageChange = (e) => {
        setMessage(e.target.value);
        // TODO: need to handle user typing indicater here
    };

    // Function to send a chat message
    const sendChatMessage = async () => {
        if (!currentChat.current?._id) return;
        setMessage(''); // Clear the message input
        await requestHandler(
            async () =>
                await sendMessage(currentChat.current?._id || '', message),
            null,
            // On successful message sending, clear the message input, then update the UI
            (res) => {
                setMessages((prev) => [res.data, ...prev]); // Update messages in the UI
                // TODO: need to handle last message here
            },
            (message) => toast.error(message)
        );
    };

    // returns all the chats for user
    const getChats = () => {
        requestHandler(
            async () => await getUserChats(),
            setLoadingChats,
            (res) => {
                const { data } = res;
                setChats(data || []);
            },
            (message) => toast.error(message)
        );
    };

    const getMessages = async () => {
        if (!currentChat.current?._id)
            return toast.warning('No chat is selected');

        if (!socket) return toast.error('No socket available');

        socket.emit(ChatEvents.JOIN_CHAT_EVENT, currentChat.current?._id);

        // TODO: need to add socket logic here + unread messages count (if possible)

        // Make an async request to fetch chat messages for the current chat
        requestHandler(
            async () => await getChatMessages(currentChat.current?._id || ''),
            setLoadingMessages,
            (res) => {
                const { data } = res;
                setMessages(data || []);
            },
            (message) => toast.error(message)
        );
    };

    useEffect(() => {
        // fetching chat list from server
        getChats();

        if (!isMobile()) {
            const _currentChat = LocalStorage.get('currentChat');
            if (_currentChat) {
                currentChat.current = _currentChat;

                // If the socket connection exists, emit an event to join the specific chat using its ID.
                socket?.emit(
                    ChatEvents.JOIN_CHAT_EVENT,
                    _currentChat.current?._id
                );

                getMessages();
            }
        }
    }, []);

    useEffect(() => {
        if (!socket) return;

        // Listener for when a new chat is added.
        socket.on(ChatEvents.NEW_CHAT_EVENT, onNewChat);
        // Listener for when a new message is received.
        socket.on(ChatEvents.MESSAGE_RECEIVED_EVENT, onMessageReceived);
        // Listener for when a master logout request comes
        socket.on(ChatEvents.MASTER_LOGOUT, onMasterLogout);

        return () => {
            // removing eventlisteners to avaoid unwanted behavoiurs
            socket.off(ChatEvents.NEW_CHAT_EVENT, onNewChat);
            socket.off(ChatEvents.MESSAGE_RECEIVED_EVENT, onMessageReceived);
            socket.off(ChatEvents.MASTER_LOGOUT, onMasterLogout);
        };
    }, [chats, socket]);

    return (
        <>
            <ToastContainer position="bottom-left" />
            <AddChatModal
                open={openAddChat}
                onClose={() => {
                    setOpenAddChat(false);
                }}
                onSuccess={() => {
                    getChats();
                }}
            />
            <div
                className={`grid w-full bg-gray-700 ${
                    isMobile()
                        ? 'h-[100svh] grid-cols-1'
                        : 'h-screen grid-cols-[minmax(250px,_30%)_1fr]'
                }`}>
                {showChatsPannel && (
                    <div className="chat-pannel relative overflow-y-auto bg-gray-500 px-4">
                        <div className="sticky top-0 z-10 w-full bg-gray-500 pb-2">
                            <div className="flex items-center justify-between pt-4 text-lg font-bold tracking-wide text-white">
                                <p className="capitalize drop-shadow-md">
                                    {getFullName()}
                                </p>
                                <ChatsDropdown
                                    trigger={
                                        <img
                                            src={
                                                LocalStorage.get('user')?.avatar
                                                    ?.url
                                            }
                                            alt="user image"
                                            className="h-12 rounded-md"
                                        />
                                    }
                                />
                            </div>
                            <div className="mr-2 grid grid-cols-[1fr_30px] gap-1 pt-4">
                                <Input
                                    placeholder={'Search..'}
                                    type="text"
                                    value={localSearchQuery}
                                    onChange={(e) =>
                                        setLocalSearchQuery(
                                            e.target.value.toLowerCase()
                                        )
                                    }
                                    className={
                                        'h-auto rounded-md border-none bg-slate-200 p-2 shadow-md focus:outline-none focus:ring-[3px] focus:ring-sky-500 disabled:opacity-50'
                                    }></Input>
                                <button
                                    onClick={() => setOpenAddChat(true)}
                                    className="flex items-center justify-center rounded-lg border-none bg-gray-900 px-5 text-4xl text-white shadow-md focus:outline-none focus:ring-[3px] focus:ring-sky-500 disabled:opacity-50">
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="">
                            {loadingChats ? (
                                <div className="flex items-center justify-center pt-64">
                                    <div className="loader"></div>
                                </div>
                            ) : (
                                [...chats].map((chat) => {
                                    return (
                                        <ChatItem
                                            chat={chat}
                                            isActive={
                                                chat._id ===
                                                currentChat.current?._id
                                            }
                                            onClick={(chat) => {
                                                if (
                                                    !isMobile() &&
                                                    currentChat.current?._id &&
                                                    currentChat.current?._id ===
                                                        chat._id
                                                )
                                                    return;

                                                LocalStorage.set(
                                                    'currentChat',
                                                    chat
                                                );
                                                currentChat.current = chat;
                                                setMessage('');
                                                getMessages();
                                                if (isMobile()) {
                                                    setShowChatsPannel(false);
                                                    setShowMessagesPannel(true);
                                                }
                                            }}
                                            key={chat._id}
                                            onChatDelete={(chatId) => {
                                                setChats((prev) =>
                                                    prev.filter(
                                                        (chat) =>
                                                            chat._id !== chatId
                                                    )
                                                );
                                                if (
                                                    currentChat.current?._id ===
                                                    chatId
                                                ) {
                                                    currentChat.current = null;
                                                    LocalStorage.remove(
                                                        'currentChat'
                                                    );
                                                }
                                            }}
                                        />
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
                {showMessagesPannel && (
                    <div
                        className={`messaging-pannel texture-1 grid overflow-y-auto bg-gray-700 ${
                            currentChat.current
                                ? 'grid-rows-[auto_1fr_auto]'
                                : ''
                        }`}>
                        {currentChat.current && currentChat.current?._id ? (
                            <>
                                {/* chat window header */}
                                <div
                                    className={`flex w-full items-center border-l border-white/10 bg-gray-500 shadow-lg ${
                                        isMobile()
                                            ? 'flex-row-reverse justify-end'
                                            : 'justify-between'
                                    }`}>
                                    <div className="flex w-max items-center justify-start gap-3 p-4">
                                        {currentChat.current.isGroupChat ? (
                                            <div></div>
                                        ) : (
                                            <img
                                                className="flex h-14 w-14 flex-shrink-0 rounded-full object-cover"
                                                src={
                                                    getChatObjectMetadata(
                                                        currentChat.current,
                                                        user
                                                    )?.avatar
                                                }
                                                alt={
                                                    getChatObjectMetadata(
                                                        currentChat.current,
                                                        user
                                                    )?.fullName +
                                                    'profile picture'
                                                }
                                            />
                                        )}
                                        <div>
                                            <p className="font-bold capitalize text-white ">
                                                {
                                                    getChatObjectMetadata(
                                                        currentChat.current,
                                                        user
                                                    )?.fullName
                                                }
                                            </p>
                                            <small className="text-zinc-300">
                                                {
                                                    getChatObjectMetadata(
                                                        currentChat.current,
                                                        user
                                                    ).description
                                                }
                                            </small>
                                        </div>
                                    </div>
                                    {isMobile() && (
                                        <button
                                            onClick={() => {
                                                setShowChatsPannel(true);
                                                setShowMessagesPannel(false);
                                            }}
                                            className="flex h-full items-center justify-center border-none bg-gray-600 p-6 text-zinc-200 outline-4 outline-offset-[-3px] outline-sky-500 hover:bg-white hover:text-black focus:bg-gray-700 focus:text-white">
                                            <ArrowLongLeftIcon className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                                {/* chat messages window */}
                                <div
                                    className={`flex w-full flex-col-reverse gap-3 overflow-y-auto p-4 md:p-8 ${
                                        loadingMessages ? 'justify-center' : ''
                                    }`}
                                    id="message-window">
                                    {loadingMessages ? (
                                        <div className="flex items-center justify-center">
                                            <Loader />
                                        </div>
                                    ) : (
                                        <>
                                            {isTyping ? <Typing /> : null}
                                            {messages?.map((msg) => {
                                                return (
                                                    <MessageItem
                                                        key={msg?._id}
                                                        isOwnMessage={
                                                            msg.sender?._id ===
                                                            user?._id
                                                        }
                                                        message={msg}
                                                    />
                                                );
                                            })}
                                        </>
                                    )}
                                </div>
                                <div className="flex w-full items-center justify-between gap-2 border-l border-white/10 bg-gray-500 p-4">
                                    <Input
                                        className={
                                            'h-auto rounded-md border-none bg-slate-200 p-2 shadow-md focus:outline-none focus:ring-[3px] focus:ring-sky-500 disabled:opacity-50'
                                        }
                                        placeholder="Message"
                                        value={message}
                                        onChange={handleOnMessageChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                sendChatMessage();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={sendChatMessage}
                                        disabled={!message}
                                        className="rounded-full bg-gray-700 p-3 text-zinc-200 hover:bg-white hover:text-black focus:bg-white focus:text-black focus:outline-none focus:ring-[3px] focus:ring-sky-500 disabled:opacity-50"
                                        aria-label="Send message">
                                        <PaperAirplaneIcon
                                            className="h-5 w-5"
                                            aria-hidden={true}
                                        />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-white">
                                No chat selected
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Chat;
