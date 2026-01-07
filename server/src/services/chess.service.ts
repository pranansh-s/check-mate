//TODO: - DI in services, decrease procedural code, validation separately, better abstraction?, better error handling?, event enums rather than strings

import { Board, Color, Game, Move, Piece, Position } from "@check-mate/shared/types";
import { boardAfterMove, createBoardforPlayer, getValidMovesForPiece, opponentSide } from "@check-mate/shared/utils";
import { ServiceError } from "../utils/error.js";
import GameService from "./game.service.js";

class ChessService {
	private board: Board;
	private mySide: Color;

	constructor(newGame: Game, userId: string) {
		if(newGame.whiteSidePlayer?.userId == userId) {
			this.mySide = "white";
		}
		else if(newGame.blackSidePlayer?.userId == userId) {
			this.mySide = "black";
		}
		else {
			throw new ServiceError("Cannot start game with no player");
		}

		this.board = createBoardforPlayer();
		this.initMoves(newGame.moves);
	}

	private initMoves = (moves: Move[]) => {
		this.board = moves.reduce((currentBoard, move) => {
			const piece = currentBoard[move.from.y][move.from.x];
			if(!piece) {
				throw new ServiceError("No piece in move");
			}
			
			return boardAfterMove(this.board, move, piece);
		}, this.board);
	}

	private isValidMove = (piece: Piece, to: Position): boolean => {
		return getValidMovesForPiece(this.board, piece, this.mySide).find(pos => pos.x == to.x && pos.y == to.y) !== undefined;
	}
	
	private isCheckMate = (): boolean => {
		let opponent = opponentSide(this.mySide);
		const myPieces = this.board.flat().filter(p => p && p.color == opponent) as Piece[];
		for(const piece of myPieces) {
			const validMoves = getValidMovesForPiece(this.board, piece, opponent);
			if(validMoves.length > 0) {
				return false;
			}
		}

		return true;
	}

	makeMove = async (roomId: string, move: Move) => {
		const piece = this.board[move.from.y][move.from.x];
		if(!piece) {
			throw new ServiceError("Cannot move an empty piece");
		}

		if(!this.isValidMove(piece, move.to)) {
			throw new ServiceError("Move not possible");
		}

		this.board = boardAfterMove(this.board, move, piece);
		await GameService.addMove(roomId, move);

		let mate = this.isCheckMate();
	}
}

export default ChessService;