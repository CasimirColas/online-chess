import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "@/types/socket";

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

const SocketComponent = () => {
  useEffect(() => {
    if (!socket) {
      fetch("/api/socket");
      socket = io();

      socket.on("connect", () => {
        console.log("connected");
      });

      socket.on("hello", (msg: string) => {
        console.log("hello", msg);
      });

      socket.on("userServerConnection", () => {
        console.log("a user connected (client)");
      });

      socket.on("userServerDisconnection", (socketid: string) => {
        console.log(socketid);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect(); // Disconnect socket when component unmounts
        socket = null;
      }
    };
  }, []);

  return (
    <div>
      <h1>Socket.io</h1>
      <button onClick={() => socket?.emit("hello", "kitty")}>Hello</button>
    </div>
  );
};

export default SocketComponent;
