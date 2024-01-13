import axios from 'axios';
import { LocalStorage } from '../utils';
import { toast } from 'react-toastify';

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

                    // Add the new token to redux store
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
                    LocalStorage.clear();
                    toast.error('Session expired, please re-login');
                    window.location.href = '/login';
                    /* We do not `return` so that we proceed to log error */
                }
            }

            return Promise.reject(error);
        }
    );
};
attachResponseInterceptor();

// FUNCTIONS FOR DB ACTION
const loginUser = (data) => {
    data = {
        email: data.email,
        password: data.password
    };
    return apiClient.post('/users/login', data);
};

const registerUser = (data) => {
    data = {
        email: data?.email,
        fullName: data?.fullName,
        password: data?.password,
        username: data?.username
    };
    return apiClient.post('/users/register', data);
};

const logoutUser = () => {
    return apiClient.post('/users/logout', null, {
        requireAuthHeader: true
    });
};

const masterLogoutUser = () => {
    return apiClient.post('/users/master-logout', null, {
        requireAuthHeader: true
    });
};

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

const refreshAccessToken = () => {
    return apiClient.post(`/users/reauth`);
};

const createUserChat = (receiverId) => {
    return apiClient.post(`/chat-app/chats/c/${receiverId}`, null, {
        requireAuthHeader: true
    });
};

const getChatMessages = (chatId) => {
    return apiClient.get(`/chat-app/messages/${chatId}`, {
        requireAuthHeader: true
    });
};

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
    refreshAccessToken
};
