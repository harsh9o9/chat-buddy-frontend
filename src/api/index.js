import axios from "axios";
import { LocalStorage } from "../utils";

// creating axios client to get azios functionality
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
  timeout: 120000,
});

// intercept every request that goes to backend and send token with it
apiClient.interceptors.request.use(
  function (config) {
    // Retrieve user token from local storage
    const token = LocalStorage.get("token");
    // Set authorization header with bearer token
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// FUNCTIONS FOR DB ACTION
const loginUser = (data) => {
  data = {
    username: data.username,
    password: data.password,
  };
  return apiClient.post("/users/login", data);
};

const registerUser = (data) => {
  data = {
    email: data.email,
    fullName: data.fullName,
    password: data.password,
    username: data.username,
  };
  return apiClient.post("/users/register", data);
};

const logoutUser = () => {
  return apiClient.post("/users/logout");
};

const getUserChats = () => {
  return apiClient.get(`/chat-app/chats`);
};

const getAvailableUsers = () => {
  return apiClient.get("/chat-app/chats/users");
};

const createUserChat = (receiverId) => {
  return apiClient.post(`/chat-app/chats/c/${receiverId}`);
};

const getChatMessages = (chatId) => {
  return apiClient.get(`/chat-app/messages/${chatId}`);
};

const sendMessage = (chatId, content) => {
  return apiClient.post(`/chat-app/messages/${chatId}`, { content });
};
export {
  loginUser,
  registerUser,
  logoutUser,
  getUserChats,
  getAvailableUsers,
  createUserChat,
  getChatMessages,
  sendMessage,
};
