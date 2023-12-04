/* eslint-disable react/prop-types */
import moment from "moment";

const MessageItem = ({ message, isOwnMessage }) => {
  return (
    <>
      <div
        className={`flex justify-start items-end gap-1 max-w-lg min-w- ${
          isOwnMessage ? "ml-auto" : ""
        }`}
      >
        <img
          src={message.sender?.avatar?.url}
          className={`h-8 w-8 object-cover rounded-full flex flex-shrink-0 ${
            isOwnMessage ? "order-2" : "order-1"
          }`}
        />
        <div
          className={`p-3 rounded-2xl flex flex-col max-w-xs 
            ${
              isOwnMessage
                ? "order-1 rounded-br-none bg-gray-400"
                : "order-2 rounded-bl-none bg-gray-800"
            }`}
        >
          {message.content ? (
            <p className={`text-sm ${isOwnMessage ? "" : "text-zinc-100"}`}>
              {message.content}
            </p>
          ) : null}
          <p
            className={`mt-1.5 self-end text-[10px] inline-flex items-center text-black 
              ${isOwnMessage ? "" : "text-zinc-100"}`}
          >
            {moment(message.updatedAt).add("TIME_ZONE", "hours").fromNow(true)}{" "}
            ago
          </p>
        </div>
      </div>
    </>
  );
};

export default MessageItem;
