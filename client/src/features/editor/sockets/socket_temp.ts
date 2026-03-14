// src/socket/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

/**
 * Create socket connection AFTER auth
 */
export function connectSocket(accessToken: string) {
  if (socket) return socket; // prevent multiple connections

  socket = io("https://codevspace-aqhw.onrender.com", {
    auth: {
      token: accessToken, // Supabase access_token
    },
    transports: ["websocket"],
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket?.id);
  });

  socket.on("connect_error", (err) => {
    console.error("🔴 Socket error:", err.message);
  });

  return socket;
}

/**
 * Get existing socket instance
 */
export function getSocket() {
  return socket;
}

/**
 * Disconnect socket (logout / app close)
 */
export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
