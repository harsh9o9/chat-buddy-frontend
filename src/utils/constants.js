export const ChatEvents = Object.freeze({
    // ? when user joins a socket room
    JOIN_CHAT_EVENT: 'joinChat',
    // ? when new message is received
    MESSAGE_RECEIVED_EVENT: 'messageReceived',
    // ? when there is new one on one chat, new group chat or user gets added in the group
    NEW_CHAT_EVENT: 'newChat',
    // ? when user does a master logout
    MASTER_LOGOUT: 'masterLogout'
});

export const QUERY_PARAMS_MAP = Object.freeze({
    SESSION_EXPIRED: {
        name: 'sessionExpired'
    },
    RESET_PASSWORD: {
        name: 'rstPwd'
    }
});
