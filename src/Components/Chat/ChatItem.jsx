import { useState } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../../Context/AuthContext";
import { getChatObjectMetadata } from "../../utils";
import moment from "moment";

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
        onMouseLeave={() => setOpenOptions(false)}
        className={`group relative p-4 my-2 flex justify-between gap-3 items-start cursor-pointer rounded-3xl hover:bg-gray-400 focus:bg-gray-400 focus-within:bg-gray-400 focus:outline-none focus:ring-[3px] focus:ring-sky-500 disabled:opacity-50${
          isActive ? "border-[1px] border-zinc-500 bg-gray-400 shadow-lg" : ""
        }`}
      >
        <div className="flex justify-center items-center flex-shrink-0">
          <img
            src={getChatObjectMetadata(chat, user).avatar}
            className="h-12 rounded-md"
          />
        </div>
        <div className="w-full">
          <p className="truncate-1 text-white font-bold capitalize">
            {getChatObjectMetadata(chat, user).fullName}
          </p>
        </div>
        <small className="mb-2 inline-flex flex-shrink-0 w-max text-white/50">
          {moment(chat.updatedAt).add("TIME_ZONE", "hours").fromNow(true)}
        </small>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenOptions(!openOptions);
          }}
          className="self-center p-1 absolute right-1 focus:outline-none focus:ring-[3px] focus:ring-sky-500 disabled:opacity-50"
          aria-label="More Options"
        >
          <EllipsisVerticalIcon
            aria-hidden={true}
            className="h-6 group-hover:w-6 group-hover:opacity-100 group-focus:w-6 group-focus-within:opacity-100 group-focus-within:w-6 group-focus:opacity-100 w-0 opacity-0 transition-all ease-in-out duration-100 text-zinc-100 "
          />
        </button>
      </div>
    </>
  );
};

export default ChatItem;
