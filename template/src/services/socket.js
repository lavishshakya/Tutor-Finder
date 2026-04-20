import { io } from "socket.io-client";
import { API_BASE_URL } from "./api";

let socket = null;

const SOCKET_URL = (
  import.meta.env.VITE_SOCKET_URL || API_BASE_URL
).replace(/\/$/, "");

const isRealtimeEnabled = () => {
  // Vercel serverless does not host persistent Socket.IO connections reliably.
  // Keep sockets opt-in for production unless explicitly enabled.
  if (import.meta.env.DEV) {
    return true;
  }

  return import.meta.env.VITE_ENABLE_SOCKET === "true";
};

export const getSocket = (token) => {
  if (!token) {
    return null;
  }

  if (!isRealtimeEnabled()) {
    return null;
  }

  if (socket && socket.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ["polling", "websocket"],
    withCredentials: true,
    auth: {
      token,
    },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
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
