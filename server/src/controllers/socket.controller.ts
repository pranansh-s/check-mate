import { Socket } from "socket.io";

import { GameConfig, Move } from "@check-mate/shared/types";
import { handleErrors } from "../utils/socket.js";
import RoomService from "../services/room.service.js";
import GameService from "../services/game.service.js";
import ChessService from "../services/chess.service.js";
import { ServiceError } from "../utils/error.js";

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

      const existingGame = await GameService.joinGame(roomId, userId).catch((err) => err instanceof ServiceError ? null : Promise.reject(err));
      if(existingGame) {
        chess = new ChessService(existingGame, currentUserId);
      }
    } catch (err) {
      handleErrors(socket, "Failed to connect with room:", err);
    }
  });

  socket.on("sendChatMessage", async (message: string) => {
    if (!currentRoomId || !currentUserId) return;

    try {
      const newMessage = await RoomService.sendMessage(currentRoomId, currentUserId, message);
      socket.emit('receiveChatMessage', newMessage);
      socket.to(currentRoomId).emit("receiveChatMessage", newMessage);
    } catch (err) {
      handleErrors(socket, "Failed to send chat message:", err);
    }
  });

  socket.on("newGame", async (config: GameConfig) => {
    if (!currentRoomId || !currentUserId) return;

    try {
      let otherUserId = (await RoomService.getRoom(currentRoomId)).participants.find((id) => id !== currentUserId);
      let newGame = await GameService.createGame(config, currentRoomId, currentUserId, otherUserId);
      
      chess = new ChessService(newGame, currentUserId);

      socket.emit("gameJoined", newGame);
      socket.to(currentRoomId).emit("gameJoined", newGame);
    } catch (err) {
      handleErrors(socket, "Failed to create game:", err);
    }
  });

  socket.on("newMove", async (move: Move) => {
    if (!currentRoomId || !currentUserId || !chess) return;

    try {
      await chess.makeMove(currentRoomId, move);
      
      socket.emit("moveUpdate", move);
      socket.to(currentRoomId).emit("moveUpdate", move);
    } catch (err) {
      handleErrors(socket, "Failed to update move:", err);
    }
  });

  socket.on("disconnect", async () => {
    if (!currentRoomId || !currentUserId) return;

    try {
      const room = await RoomService.leaveRoom(currentRoomId, currentUserId);
      socket.to(currentRoomId).emit("roomUpdate", room);
    } catch (err) {
      handleErrors(socket, "Failed to leave room:", err);
    }
  });
};

export default SocketController;