import { Server } from "socket.io";
import { socketCorsConfig } from "../config/cors.js";
import { handleConnection } from "./handlers/connectionHandler.js";

export const initializeSocket = (server) => {
  const io = new Server(server, socketCorsConfig);

  io.on("connection", (socket) => {
    handleConnection(socket, io);
  });

  return io;
};