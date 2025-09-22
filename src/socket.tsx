import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";

// single socket instance
const socket: Socket = io("http://192.168.110.131:8000");
// const socket: Socket = io("https://movieappbackend-qcij.onrender.com");

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
