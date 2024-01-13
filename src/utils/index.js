import { redirect } from 'react-router-dom';

// utility function for handling api requests while handling loading, success, error states
export const requestHandler = async (api, setLoading, onSuccess, onError) => {
    setLoading && setLoading(true);

    try {
        const response = await api();
        const { data } = response;
        if (data?.success) {
            onSuccess(data);
        }
    } catch (e) {
        if ([401, 403].includes(e?.response?.data?.statusCode)) {
            console.error('auth error, please relogin');
            localStorage.clear();
            redirect('/login');
        }

        let responseMessage = e?.response?.data?.message;

        if (Array.isArray(responseMessage)) {
            responseMessage.forEach((res) => {
                onError(res?.msg || 'Something went wrong');
            });
        } else {
            onError(e?.response?.data?.message || 'Something went wrong');
        }
    } finally {
        setLoading && setLoading(false);
    }
};

// This utility function generates metadata for chat objects.
export const getChatObjectMetadata = (chat, loggedInUser) => {
    // Identify the participant other than the logged-in user.
    const participant = chat.participants.find(
        (p) => p._id !== loggedInUser?._id
    );

    // Return metadata specific to individual chats.
    return {
        avatar: participant?.avatar.url, // Participant's avatar URL.
        title: participant?.username, // Participant's username serves as the title.
        description: participant?.email,
        fullName: getFullName(participant) // Email address of the participant.
    };
};

export const getFullName = (user) => {
    let firstName, lastName;

    if (user) {
        firstName = user?.fullName?.firstName;
        lastName = user?.fullName?.lastName;
    } else {
        firstName = LocalStorage.get('user')?.fullName?.firstName;
        lastName = LocalStorage.get('user')?.fullName?.lastName;
    }
    return `${firstName} ${lastName}`;
};

// utility class for using localstorage easily
export class LocalStorage {
    static get(key) {
        const value = localStorage.getItem(key);
        if (value) {
            try {
                return JSON.parse(value);
            } catch (err) {
                return null;
            }
        }
        return null;
    }

    static set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static remove(key) {
        localStorage.removeItem(key);
    }

    static clear() {
        localStorage.clear();
    }
}

export const classNames = (...className) => {
    return className.filter().join(' ');
};
