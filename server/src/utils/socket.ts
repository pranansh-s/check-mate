import { ZodError } from "zod";
import { DatabaseError, ServiceError } from "./error.js";
import { Socket } from "socket.io";
import GameService from "../services/game.service.js";
import RoomService from "../services/room.service.js";
import { GameConfig, Move } from "@check-mate/shared/types";

export const handleErrors = (handler: (...args: any[]) => Promise<void>, socket: Socket, title: string) => {
	return async (...args: any[]) => {
		try {
			await handler(...args);
		} catch (err) {
			if (err instanceof ZodError) {
				console.error("[SOCKET_ERROR]", title, err.issues.map(issue => issue.message).join(', '));
				socket.emit("error", `${err.issues[0].path}: ${err.issues[0].message}`);
			} else if (err instanceof ServiceError) {
				console.error("[SOCKET_ERROR]", title, err.message);
				socket.emit("error", err.message);
			} else if (err instanceof DatabaseError) {
				console.error("[SOCKET_ERROR]", title, err.message);
				socket.emit("error", "Internal Server Error");
			} else {
				console.error("[SOCKET_ERROR]", title, err);
				socket.emit("error", "Internal Server Error");
			}
		}
	};
};

export const socketHandlers = (socket: Socket) => {
	let currentRoomId: string | null = null;
	let currentUserId: string | null = null;

	return {
		joinRoom: async (roomId: string, userId: string) => {
			if (currentRoomId && currentRoomId !== roomId) {
				await RoomService.leaveRoom(currentRoomId, userId);
				socket.leave(currentRoomId);
			}

			socket.join(roomId);
			currentRoomId = roomId;
			currentUserId = userId;
		},

		sendChatMessage: async (content: string) => {
			if (!currentRoomId || !currentUserId) return;

			const message = await RoomService.sendMessage(currentRoomId, currentUserId, content);

			socket.emit('receiveChatMessage', message);
			socket.to(currentRoomId).emit("receiveChatMessage", message);
		},

		newGame: async (config: GameConfig) => {	
			if (!currentRoomId || !currentUserId) return;

			const otherUserId = (await RoomService.getRoom(currentRoomId)).participants.find((id) => id !== currentUserId);
			const newGame = await GameService.createGame(config, currentRoomId, currentUserId, otherUserId);

			socket.emit("gameJoined", newGame);
			socket.to(currentRoomId).emit("gameJoined", newGame);
		},

		newMove: async (move: Move) => {
			if (!currentRoomId || !currentUserId) return;

			await GameService.addMove(currentRoomId, move, currentUserId);
      
      socket.emit("moveUpdate", move);
      socket.to(currentRoomId).emit("moveUpdate", move);
		},

		disconnect: async () => {
			if (!currentRoomId || !currentUserId) return;

			await RoomService.leaveRoom(currentRoomId, currentUserId);

			socket.leave(currentRoomId);

			currentRoomId = null;
			currentUserId = null;
		}
	}
}