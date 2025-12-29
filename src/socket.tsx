import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";

// single socket instance
const socket: Socket = io(import.meta.env.VITE_API_BASE_URL);
export const messageSocket: Socket = io(import.meta.env.VITE_SOCKET_MESSAGE_URL)
// const socket: Socket = io("https://movieappbackend-1odg.onrender.com");

export function useUserPurchaseRequests(
  userId: string | null,
  onNewRequest: (data: any) => void,
  onChangeRequest: (data: any) => void
) {
  useEffect(() => {
    if (!userId) return;

    // join user's room
    socket.emit("register", { userId, role: "user" });
    // socket.emit("register", { role: "admin" });

    // register event listeners
    socket.on("purchaseRequest:new", onNewRequest);
    socket.on("overAll:change", onChangeRequest);
    
    // cleanup listeners on unmount or userId change
    return () => {
      socket.off("purchaseRequest:new", onNewRequest);
      socket.off("overAll:change", onChangeRequest);
    };
  }, [userId, onNewRequest, onChangeRequest]);
}

export function useMessageSocket(
  userId: string | null
) {
  useEffect(() => {
    if (!userId) return;


    messageSocket.emit("register", { userId, role: "user" });

    return () => {
    
    };
  }, [userId]);
}
