import { Socket } from "socket.io";

import { GameConfig } from "@check-mate/shared/types";
import { handleErrors } from "../utils/socket.js";
import RoomService from "../services/room.service.js";
import GameService from "../services/game.service.js";

const SocketController = (socket: Socket) => {
  let currentRoomId: string | null = null;
  let currentUserId: string | null = null;

  socket.on("joinRoom", async (roomId: string, userId: string) => {
    try {
      if (currentRoomId) {
        await RoomService.leaveRoom(currentRoomId, userId);
        socket.leave(currentRoomId);
      }

      socket.join(roomId);
      currentRoomId = roomId;
      currentUserId = userId;

      socket.emit("roomJoined");
    } catch (err) {
      handleErrors(socket, "Failed to connect with room", err);
    }
  });

  socket.on("sendChatMessage", async (message: string) => {
    if (!currentRoomId || !currentUserId) return;

    try {
      const chatMessage = await RoomService.sendMessage(currentRoomId, currentUserId, message);
      socket.to(currentRoomId).emit("recieveChatMessage", chatMessage);
    } catch (err) {
      handleErrors(socket, "Failed to send chat message", err);
    }
  });

  socket.on("newGame", async (config: GameConfig) => {
    if (!currentRoomId || !currentUserId) return;

    try {
      const game = await GameService.createGame(currentRoomId, currentUserId, config);
      socket.emit("gameJoined", game);
      socket.to(currentRoomId).emit("gameCreated");
    } catch (err) {
      handleErrors(socket, "Failed to create game", err);
    }
  });

  socket.on("joinGame", async () => {
    if (!currentRoomId || !currentUserId) return;

    try {
      const game = await GameService.joinGame(currentRoomId, currentUserId);
      socket.emit("gameJoined", game);
      socket.to(currentRoomId).emit("gameJoined", game);
    } catch (err) {
      handleErrors(socket, "Failed to join game", err);
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