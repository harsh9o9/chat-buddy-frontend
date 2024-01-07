/* eslint-disable react/prop-types */
import moment from 'moment';

const MessageItem = ({ message, isOwnMessage }) => {
    return (
        <>
            <div
                className={`min-w- flex max-w-lg items-end justify-start gap-1 ${
                    isOwnMessage ? 'ml-auto' : ''
                }`}>
                <img
                    src={message.sender?.avatar?.url}
                    className={`flex h-8 w-8 flex-shrink-0 rounded-full object-cover ${
                        isOwnMessage ? 'order-2' : 'order-1'
                    }`}
                />
                <div
                    className={`flex max-w-xs flex-col rounded-2xl p-3 
            ${
                isOwnMessage
                    ? 'order-1 rounded-br-none bg-gray-400'
                    : 'order-2 rounded-bl-none bg-gray-800'
            }`}>
                    {message.content ? (
                        <p
                            className={`text-sm ${
                                isOwnMessage ? '' : 'text-zinc-100'
                            }`}>
                            {message.content}
                        </p>
                    ) : null}
                    <p
                        className={`mt-1.5 inline-flex items-center self-end text-[10px] text-black 
              ${isOwnMessage ? '' : 'text-zinc-100'}`}>
                        {moment(message.updatedAt)
                            .add('TIME_ZONE', 'hours')
                            .fromNow(true)}{' '}
                        ago
                    </p>
                </div>
            </div>
        </>
    );
};

export default MessageItem;
