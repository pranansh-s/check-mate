import { ZodError } from "zod";
import { DatabaseError, ServiceError } from "./error.js";
import { Socket } from "socket.io";
import ChessService from "../services/chess.service.js";
import GameService from "../services/game.service.js";
import RoomService from "../services/room.service.js";
import { Game, GameConfig, Move, Room } from "@check-mate/shared/types";

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
	let currentRoom: Room | null = null;
	let currentGame: Game | null = null;
	let chess: ChessService | null = null;

	return {
		joinRoom: async (roomId: string, userId: string) => {
			if (currentRoom && currentRoomId && currentRoomId !== roomId) {
				const room = await RoomService.leaveRoom(currentRoom, currentRoomId, userId);
				socket.leave(currentRoomId);
				socket.to(currentRoomId).emit("roomUpdate", room);
			}

			socket.join(roomId);
			currentRoomId = roomId;
			currentUserId = userId;

			currentRoom = await RoomService.getRoom(roomId);
			//get game
			currentGame = await GameService.joinGame(roomId, userId).catch((err) => err instanceof ServiceError ? null : Promise.reject(err));

			if(currentGame) {
				chess = new ChessService(currentGame, currentUserId);
			}
		},

		sendChatMessage: async (message: string) => {
			if (!currentRoomId || !currentUserId || !currentRoom) return;

			currentRoom = await RoomService.sendMessage(currentRoom, currentRoomId, currentUserId, message);
			const latestMessage = currentRoom.chat[currentRoom.chat.length - 1];

			socket.emit('receiveChatMessage', latestMessage);
			socket.to(currentRoomId).emit("receiveChatMessage", latestMessage);
		},

		newGame: async (config: GameConfig) => {	
			if (!currentRoomId || !currentUserId || !currentRoom) return;

			const otherUserId = (await RoomService.getRoom(currentRoomId)).participants.find((id) => id !== currentUserId);
			currentGame = await GameService.createGame(config, currentRoomId, currentUserId, otherUserId);
			
			chess = new ChessService(currentGame, currentUserId);

			socket.emit("gameJoined", currentGame);
			socket.to(currentRoomId).emit("gameJoined", currentGame);
		},

		newMove: async (move: Move) => {
			if (!currentRoomId || !currentUserId || !currentRoom || !currentGame || !chess) return;

			await GameService.addMove(currentRoomId, currentGame, move, chess);
      
      socket.emit("moveUpdate", move);
      socket.to(currentRoomId).emit("moveUpdate", move);
		},

		disconnect: async () => {
			if (!currentRoomId || !currentUserId || !currentRoom) return;

			const room = await RoomService.leaveRoom(currentRoom, currentRoomId, currentUserId);

			socket.leave(currentRoomId);
      socket.to(currentRoomId).emit("roomUpdate", room);
		}
	}
}