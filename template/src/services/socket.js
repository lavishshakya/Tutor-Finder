import { io } from "socket.io-client";
import { API_BASE_URL } from "./api";

let socket = null;

export const getSocket = (token) => {
  if (!token) {
    return null;
  }

  if (socket && socket.connected) {
    return socket;
  }

  socket = io(API_BASE_URL, {
    transports: ["websocket"],
    withCredentials: true,
    auth: {
      token,
    },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 800,
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
