import { showErrorToast } from "@/components/common/ErrorToast";
import { GameConfig, Move } from "@check-mate/shared/types";
import { io } from "socket.io-client"

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);

const SocketService = {
	initListeners: () => {
		socket.on('error', (message: string) => {
			showErrorToast("Failed to process task", message);
		});
	},

	connectToRoom: (roomId: string, userId: string) => {
		socket.emit('joinRoom', roomId, userId);
	},

	sendMessage: (message: string) => {
		socket.emit('sendChatMessage', message);
	},

	newGame: (config: GameConfig) => {
		socket.emit('newGame', config);
	},

	joinGame: () => {
		socket.emit('joinGame');
	},

	makeMove: (move: Move) => {
		socket.emit('newMove', move);
	}
}

export default SocketService;