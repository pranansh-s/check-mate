import { ZodError } from "zod";
import { DatabaseError, ServiceError } from "./error.js";
import { Socket } from "socket.io";

export const handleErrors = (socket: Socket, title: string, err: any) => {
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
};