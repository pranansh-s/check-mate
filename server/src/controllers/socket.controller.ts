import { Socket } from "socket.io";

import { GameConfig } from "@check-mate/shared/types";
import { DatabaseError, ServiceError } from "../utils/error.js";
import RoomService from "../services/room.service.js";
import GameService from "../services/game.service.js";
import { ZodError } from "zod";

class SocketController {
  private roomService = new RoomService();
  private gameService = new GameService();

  handleErrors = (socket: Socket, roomId: string, title: string, err: any) => {
    if (err instanceof ZodError) {
      console.error("[SOCKET_ERROR]", title, err.issues.map(issue => issue.message).join(', '));
    } else if (err instanceof ServiceError) {
      console.error("[SOCKET_ERROR]", title, err.message);
      socket.to(roomId).emit("error", err.message);
    } else if (err instanceof DatabaseError) {
      console.error("[SOCKET_ERROR]", title, err.message);
      socket.to(roomId).emit("error", "Internal Server Error");
    } else {
      console.error("[SOCKET_ERROR]", title, err);
      socket.to(roomId).emit("error", "Internal Server Error");
    }
  };

  useSocketConnection = (socket: Socket) => {
    let currentRoomId: string | null = null;
    let currentUserId: string | null = null;

    socket.on("joinRoom", async (roomId: string, userId: string) => {
      try {
        if (currentRoomId) {
          await this.roomService.leaveRoom(currentRoomId, userId);
          socket.leave(currentRoomId);
        }

        socket.join(roomId);
        currentRoomId = roomId;
        currentUserId = userId;

        socket.emit("roomJoined");
      } catch (err) {
        this.handleErrors(socket, roomId, "Failed to connect with room", err);
      }
    });

    socket.on("sendChatMessage", async (message: string) => {
      if (!currentRoomId || !currentUserId) return;

      try {
        const chatMessage = await this.roomService.sendMessage(currentRoomId, currentUserId, message);
        socket.to(currentRoomId).emit("recieveChatMessage", chatMessage);
      } catch (err) {
        this.handleErrors(socket, currentRoomId, "Failed to send chat message", err);
      }
    });

    socket.on("newGame", async (config: GameConfig) => {
      if (!currentRoomId || !currentUserId) return;

      try {
        const game = await this.gameService.createGame(currentRoomId, currentUserId, config);
        socket.emit("gameJoined", game);
        socket.to(currentRoomId).emit("gameCreated");
      } catch (err) {
        this.handleErrors(socket, currentRoomId, "Failed to create game", err);
      }
    });

    socket.on("joinGame", async () => {
      if (!currentRoomId || !currentUserId) return;

      try {
        const game = await this.gameService.joinGame(currentRoomId, currentUserId);
        socket.emit("gameJoined", game);
        socket.to(currentRoomId).emit("gameJoined", game);
      } catch (err) {
        this.handleErrors(socket, currentRoomId, "Failed to join game", err);
      }
    });

    socket.on("disconnect", async () => {
      if (!currentRoomId || !currentUserId) return;

      try {
        const room = await this.roomService.leaveRoom(currentRoomId, currentUserId);
        socket.to(currentRoomId).emit("roomUpdate", room);
      } catch (err) {
        this.handleErrors(socket, currentRoomId, "Failed to leave room", err);
      }
    });
  };
}

export default SocketController;
