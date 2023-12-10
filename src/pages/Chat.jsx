import { useEffect, useRef, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useSocket } from "../Context/SocketContext";
import Input from "../Components/Input";
import { ChatEvents } from "../utils/constants";
import AddChatModal from "../Components/Chat/AddChatModal";
import {
  LocalStorage,
  getChatObjectMetadata,
  getFullName,
  requestHandler,
} from "../utils";
import { getChatMessages, getUserChats, sendMessage } from "../api";
import ChatItem from "../Components/Chat/ChatItem";
import Typing from "../Components/Chat/Typing";
import Loader from "../Components/Loader";
import {
  PaperAirplaneIcon,
  ArrowLongLeftIcon,
} from "@heroicons/react/20/solid";
import MessageItem from "../Components/Chat/MessageItem";
import isMobile from "is-mobile";
import { toast } from "react-toastify";

const Chat = () => {
  const { token } = useAuth();
  const { user } = useAuth();
  const { socket } = useSocket();
  const currentChat = useRef(null);
  const [isConnected, setIsConnected] = useState(false); // For tracking socket connection
  const [openAddChat, setOpenAddChat] = useState(false); // to control the add chat modal
  const [loadingChats, setLoadingChats] = useState(false); // To indicate loading of chats
  const [loadingMessages, setLoadingMessages] = useState(false); // To indicate loading of messages
  const [isTyping, setIsTyping] = useState(false); // To track if someone is currently typing
  const [chats, setChats] = useState([]); // To store user's chats
  const [messages, setMessages] = useState([]); // To store chat messages
  const [message, setMessage] = useState(""); // To store the currently typed message
  const [showMessagesPannel, setShowMessagesPannel] = useState(
    () => !isMobile()
  );
  const [showChatsPannel, setShowChatsPannel] = useState(true);

  const [localSearchQuery, setLocalSearchQuery] = useState(""); // For local search functionality

  const onConnect = () => {
    setIsConnected(true);
  };

  const onDisconnect = () => {
    setIsConnected(false);
  };

  const onNewChat = (chat) => {
    console.log(chat);
    setChats((prev) => [chat, ...prev]);
  };

  const onMessageReceived = (message) => {
    // Check if the received message belongs to the currently active chat
    if (message.chat !== currentChat.current?._id) {
      console.log("message count");
    } else {
      setMessages((prev) => [message, ...prev]);
    }
  };

  // Event handler which runs when user is typing message
  const handleOnMessageChange = (e) => {
    setMessage(e.target.value);
    // TODO: need to handle user typing indicater here
  };

  // Function to send a chat message
  const sendChatMessage = async () => {
    if (!currentChat.current?._id) return;

    await requestHandler(
      async () => await sendMessage(currentChat.current?._id || "", message),
      null,
      // On successful message sending, clear the message input, then update the UI
      (res) => {
        setMessage(""); // Clear the message input
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
    if (!currentChat.current?._id) return toast.warning("No chat is selected");

    if (!socket) return toast.error("No socket available");

    socket.emit(ChatEvents.JOIN_CHAT_EVENT, currentChat.current?._id);

    // TODO: need to add socket logic here + unread messages count (if possible)

    // Make an async request to fetch chat messages for the current chat
    requestHandler(
      async () => await getChatMessages(currentChat.current?._id || ""),
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
      const _currentChat = LocalStorage.get("currentChat");
      if (_currentChat) {
        currentChat.current = _currentChat;

        // If the socket connection exists, emit an event to join the specific chat using its ID.
        socket?.emit(ChatEvents.JOIN_CHAT_EVENT, _currentChat.current?._id);

        getMessages();
      }
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(ChatEvents.CONNECTED_EVENT, onConnect);
    // Listener for when the socket disconnects.
    socket.on(ChatEvents.DISCONNECT_EVENT, onDisconnect);
    // Listener for when a new chat is added.
    socket.on(ChatEvents.NEW_CHAT_EVENT, onNewChat);
    // Listener for when a new message is received.
    socket.on(ChatEvents.MESSAGE_RECEIVED_EVENT, onMessageReceived);

    return () => {
      // removing eventlisteners to avaoid unwanted behavoiurs
      socket.off(ChatEvents.CONNECTED_EVENT, onConnect);
      socket.off(ChatEvents.DISCONNECT_EVENT, onDisconnect);
      socket.off(ChatEvents.NEW_CHAT_EVENT, onNewChat);
      socket.off(ChatEvents.MESSAGE_RECEIVED_EVENT, onMessageReceived);
    };
  }, [chats, socket]);

  return (
    <>
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
        className={`bg-gray-700 h-screen w-full grid ${
          isMobile() ? "grid-cols-1" : "grid-cols-[minmax(250px,_30%)_1fr]"
        }`}
      >
        {showChatsPannel && (
          <div className="chat-pannel bg-gray-500 px-4 relative overflow-y-auto">
            <div className="z-10 bg-gray-500 w-full sticky top-0 pb-2">
              <div className="pt-4 flex justify-between items-center text-white font-bold text-lg tracking-wide">
                <p className="capitalize">{getFullName()}</p>
                <img
                  src={LocalStorage.get("user").avatar.url}
                  alt="random image"
                  className="h-12 rounded-md"
                />
              </div>
              <div className="pt-4 grid grid-cols-[1fr_30px] gap-1 mr-2">
                <Input
                  placeholder={"Search.."}
                  type="text"
                  value={localSearchQuery}
                  onChange={(e) =>
                    setLocalSearchQuery(e.target.value.toLowerCase())
                  }
                  className={
                    "bg-slate-200 border-none rounded-md p-2 h-auto shadow-md focus:outline-none focus:ring-[3px] focus:ring-sky-500 disabled:opacity-50"
                  }
                ></Input>
                <button
                  onClick={() => setOpenAddChat(true)}
                  className="rounded-lg border-none bg-gray-900 text-white text-4xl flex justify-center items-center px-5 shadow-md focus:outline-none focus:ring-[3px] focus:ring-sky-500 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
            <div className="">
              {loadingChats ? (
                <div className="flex justify-center items-center pt-64">
                  <div className="loader"></div>
                </div>
              ) : (
                [...chats].map((chat) => {
                  return (
                    <ChatItem
                      chat={chat}
                      isActive={chat._id === currentChat.current?._id}
                      onClick={(chat) => {
                        if (
                          currentChat.current?._id &&
                          currentChat.current?._id === chat._id
                        )
                          return;

                        LocalStorage.set("currentChat", chat);
                        currentChat.current = chat;
                        setMessage("");
                        getMessages();
                        if (isMobile()) {
                          setShowChatsPannel(false);
                          setShowMessagesPannel(true);
                        }
                      }}
                      key={chat._id}
                      onChatDelete={(chatId) => {
                        setChats((prev) =>
                          prev.filter((chat) => chat._id !== chatId)
                        );
                        if (currentChat.current?._id === chatId) {
                          currentChat.current = null;
                          LocalStorage.remove("currentChat");
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
            className={`messaging-pannel bg-gray-700 overflow-y-auto texture-1 grid ${
              currentChat.current ? "grid-rows-[auto_1fr_auto]" : ""
            }`}
          >
            {currentChat.current && currentChat.current?._id ? (
              <>
                {/* chat window header */}
                <div className="bg-gray-500 flex justify-between items-center w-full shadow-lg border-l border-white/10">
                  <div className="flex justify-start items-center w-max gap-3 p-4">
                    {currentChat.current.isGroupChat ? (
                      <div></div>
                    ) : (
                      <img
                        className="h-14 w-14 rounded-full flex flex-shrink-0 object-cover"
                        src={
                          getChatObjectMetadata(currentChat.current, user)
                            .avatar
                        }
                      />
                    )}
                    <div>
                      <p className="font-bold capitalize text-white">
                        {
                          getChatObjectMetadata(currentChat.current, user)
                            .fullName
                        }
                      </p>
                      <small className="text-zinc-300">
                        {
                          getChatObjectMetadata(currentChat.current, user)
                            .description
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
                      className="p-6 h-full flex justify-center items-center bg-gray-600 text-zinc-200 focus:bg-gray-700 focus:text-white hover:bg-white hover:text-black border-none outline-sky-500 outline-4 outline-offset-[-3px]"
                    >
                      <ArrowLongLeftIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
                {/* chat messages window */}
                <div
                  className={`p-4 md:p-8 overflow-y-auto flex flex-col-reverse w-full gap-3`}
                  id="message-window"
                >
                  {loadingMessages ? (
                    <div className="flex justify-center items-center">
                      <Loader />
                    </div>
                  ) : (
                    <>
                      {isTyping ? <Typing /> : null}
                      {messages?.map((msg) => {
                        return (
                          <MessageItem
                            key={msg?._id}
                            isOwnMessage={msg.sender?._id === user?._id}
                            message={msg}
                          />
                        );
                      })}
                    </>
                  )}
                </div>
                <div className="border-l border-white/10 p-4 flex justify-between items-center w-full gap-2 bg-gray-500">
                  <Input
                    className={
                      "bg-slate-200 border-none rounded-md p-2 h-auto shadow-md focus:outline-none focus:ring-[3px] focus:ring-sky-500 disabled:opacity-50"
                    }
                    placeholder="Message"
                    value={message}
                    onChange={handleOnMessageChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendChatMessage();
                      }
                    }}
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={!message}
                    className="p-3 rounded-full bg-gray-700 text-zinc-200 focus:bg-white focus:text-black hover:bg-white hover:text-black focus:outline-none focus:ring-[3px] focus:ring-sky-500 disabled:opacity-50"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex justify-center items-center text-white">
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
