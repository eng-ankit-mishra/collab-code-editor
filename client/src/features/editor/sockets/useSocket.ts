// src/socket/useSocket.ts
import { useEffect } from "react";
import { connectSocket } from "./socket_temp.ts";
import { useAuth } from "../../auth/context/useAuth.tsx";

export function useSocket() {
  const { session } = useAuth();

  useEffect(() => {
    if (!session?.access_token) return;

    // Connect socket after login
    connectSocket(session.access_token);

    return () => {
      // Optional cleanup on unmount
      // disconnectSocket();
    };
  }, [session]);
}
