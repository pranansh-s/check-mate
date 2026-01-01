import { Socket } from "socket.io";

import { GameConfig } from "@check-mate/shared/types";
import { handleErrors } from "../utils/socket.js";
import RoomService from "../services/room.service.js";
import GameService from "../services/game.service.js";
import ChessService from "../services/chess.service.js";

const SocketController = (socket: Socket) => {
  let currentRoomId: string;
  let currentUserId: string;
  let chess: ChessService;

  socket.on("joinRoom", async (roomId: string, userId: string) => {
    try {
      if (currentRoomId) {
        await RoomService.leaveRoom(currentRoomId, userId);
        socket.leave(currentRoomId);
      }

      socket.join(roomId);
      currentRoomId = roomId;
      currentUserId = userId;

      const existingGame = await GameService.joinGame(roomId, userId);
      chess = new ChessService(existingGame);
    } catch (err) {
      handleErrors(socket, "Failed to connect with room", err);
    }
  });

  socket.on("sendChatMessage", async (message: string) => {
    if (!currentRoomId || !currentUserId) return;

    try {
      const newMessage = await RoomService.sendMessage(currentRoomId, currentUserId, message);
      socket.emit('recieveChatMessage', newMessage);
      socket.to(currentRoomId).emit("recieveChatMessage", newMessage);
    } catch (err) {
      handleErrors(socket, "Failed to send chat message", err);
    }
  });

  socket.on("newGame", async (config: GameConfig, otherUserId?: string) => {
    if (!currentRoomId || !currentUserId) return;

    try {
      let newGame = await GameService.createGame(currentRoomId, currentUserId, config);
      if(otherUserId) {
        newGame = await GameService.joinGame(currentRoomId, otherUserId);
      }
      
      chess = new ChessService(newGame);

      socket.emit("gameJoined", newGame);
      socket.to(currentRoomId).emit("gameJoined", newGame);
    } catch (err) {
      handleErrors(socket, "Failed to create game", err);
    }
  });

  socket.on("disconnect", async () => {
    if (!currentRoomId || !currentUserId) return;

    try {
      const room = await RoomService.leaveRoom(currentRoomId, currentUserId);
      socket.to(currentRoomId).emit("roomUpdate", room);
    } catch (err) {
      handleErrors(socket, "Failed to leave room", err);
    }
  });
};

export default SocketController;