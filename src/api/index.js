import { LocalStorage } from '../utils';
import axios from 'axios';

// creating axios client to get azios functionality
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URI,
    withCredentials: true,
    timeout: 20000,
    timeoutErrorMessage: 'Waiting for too long...Aborted !'
});

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
    function (config) {
        if (config.requireAuthHeader) {
            // Retrieve user token from local storage
            const token = LocalStorage.get('token');
            // Set authorization header with bearer token
            config.headers.Authorization = `Bearer ${token}`;
            delete config.requireAuthHeader;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

const attachResponseInterceptor = () => {
    const responseInterceptor = apiClient.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const config = error?.config;
            const responseError = error?.response;

            if (
                responseError?.status === 401 &&
                responseError?.headers
                    ?.get('www-authenticate')
                    ?.startsWith('Bearer ')
            ) {
                // Detach the response interceptor temporarily
                apiClient.interceptors.response.eject(responseInterceptor);

                try {
                    const MAX_RETRIES = 2;
                    // Track no. of retries with custom prop on `config`
                    config._retries = Math.abs(config._retries) || 0;

                    // Check if number of retries is exceeded
                    if (config._retries >= MAX_RETRIES) {
                        throw new Error(
                            `Max retries(${config?._retries}) reached!`
                        );
                    }

                    // Call API endpoint to refresh Access token
                    const { data } = await refreshAccessToken();

                    const newAccessToken = data?.accessToken;

                    // Add/replace `Authorization` header to `config` of original request
                    config.headers.Authorization = `Bearer ${newAccessToken}`;

                    // Add the new token to local storage
                    LocalStorage.set('token', data.accessToken);

                    // Increment retry count and attach back interceptor
                    config._retries++;
                    attachResponseInterceptor();

                    // Call the original request with the updated `config` and exit function
                    return apiClient({
                        ...config,
                        headers: config.headers.toJSON()
                    });
                } catch (reauthError) {
                    // throw error so that requestHandler can catch it.
                    throw reauthError;
                }
            }

            return Promise.reject(error);
        }
    );
};
attachResponseInterceptor();

// FUNCTIONS FOR DB ACTION
/**
 * Logs in a user with the provided credentials.
 *
 * @param {Object} data - The user login credentials.
 * @param {string} data.email - The email address of the user.
 * @param {string} data.password - The password for the user.
 * @returns {Promise} A Promise that resolves when the login is successful and rejects on failure.
 */
const loginUser = (data) => {
    data = {
        email: data.email,
        password: data.password
    };
    return apiClient.post('/users/login', data);
};

/**
 * Registers a new user with the provided information.
 *
 * @param {Object} data - The user registration details.
 * @param {string} [data.email] - The email address of the user.
 * @param {string} [data.fullName] - The full name of the user.
 * @param {string} [data.password] - The password for the user.
 * @param {string} [data.username] - The username for the user.
 * @returns {Promise} A Promise that resolves when the registration is successful and rejects on failure.
 */
const registerUser = (data) => {
    data = {
        email: data?.email,
        fullName: data?.fullName,
        password: data?.password,
        username: data?.username
    };
    return apiClient.post('/users/register', data);
};

/**
 * Logs out the current user.
 *
 * @returns {Promise} A Promise that resolves when the logout is successful and rejects on failure.
 */
const logoutUser = () => {
    return apiClient.post('/users/logout', null, {
        requireAuthHeader: true
    });
};

/**
 * Logs out the current user from all sessions.
 *
 * @returns {Promise} A Promise that resolves when the master logout is successful and rejects on failure.
 */
const masterLogoutUser = () => {
    return apiClient.post('/users/master-logout', null, {
        requireAuthHeader: true
    });
};

/**
 * Retrieves the chats for the authenticated user.
 *
 * @returns {Promise} A Promise that resolves with the user's chats and rejects on failure.
 */
const getUserChats = () => {
    return apiClient.get(`/chat-app/chats`, {
        requireAuthHeader: true
    });
};

const getAvailableUsers = () => {
    return apiClient.get('/chat-app/chats/users', {
        requireAuthHeader: true
    });
};

/**
 * Retrieves a list of available users for chatting.
 *
 * @returns {Promise} A Promise that resolves with the list of available users and rejects on failure.
 */
const refreshAccessToken = () => {
    const refreshToken = LocalStorage.get('refreshToken');
    console.log(
        '🔄 Refresh token from localStorage:',
        refreshToken ? 'Found' : 'Not found'
    );
    const headers = {};
    if (refreshToken) {
        headers.Authorization = `Refresh ${refreshToken}`;
        console.log('🔑 Setting Authorization header with refresh token');
    } else {
        console.log('❌ No refresh token available for fallback');
    }
    return apiClient.post(`/users/reauth`, null, { headers });
};

/**
 *  Sends a request to reset the password for the provided email.
 * @param {String} email The email address to which the reset password link will be sent.
 * @returns {Promise} A Promise that resolves when the request is successful and rejects on failure.
 */
const forgotPassword = (email) => {
    return apiClient.post('/users/forgotpass', { email });
};

/**
 * Sends a request to reset the password using the provided password and confirmation.
 * @param {string} password - The new password for the user account.
 * @param {string} confirmPassword - Confirmation of the new password.
 * @returns {Promise} A Promise that resolves when the password is successfully reset and rejects on failure.
 */
const resetPassword = (resetToken, password, confirmPassword) => {
    const url = `/users/resetpass/${resetToken}`;
    return apiClient.post(url, { password, confirmPassword });
};

/**
 * Creates a new chat with the specified user.
 *
 * @param {string} receiverId - The ID of the user to start the chat with.
 * @returns {Promise} A Promise that resolves when the chat is successfully created and rejects on failure.
 */
const createUserChat = (receiverId) => {
    return apiClient.post(`/chat-app/chats/c/${receiverId}`, null, {
        requireAuthHeader: true
    });
};

/**
 * Retrieves the messages for a specific chat.
 *
 * @param {string} chatId - The ID of the chat for which to retrieve messages.
 * @returns {Promise} A Promise that resolves with the chat messages and rejects on failure.
 */
const getChatMessages = (chatId) => {
    return apiClient.get(`/chat-app/messages/${chatId}`, {
        requireAuthHeader: true
    });
};

/**
 * Sends a message to a specific chat.
 *
 * @param {string} chatId - The ID of the chat to which the message will be sent.
 * @param {string} content - The content of the message.
 * @returns {Promise} A Promise that resolves when the message is successfully sent and rejects on failure.
 */
const sendMessage = (chatId, content) => {
    return apiClient.post(
        `/chat-app/messages/${chatId}`,
        { content },
        {
            requireAuthHeader: true
        }
    );
};

export {
    loginUser,
    registerUser,
    logoutUser,
    masterLogoutUser,
    getUserChats,
    getAvailableUsers,
    createUserChat,
    getChatMessages,
    sendMessage,
    refreshAccessToken,
    forgotPassword,
    resetPassword
};
