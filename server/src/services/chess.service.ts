//TODO: - DI in services, decrease procedural code, validation separately, better abstraction?, better error handling?, event enums rather than strings

import { Board, Color, Game, Move, Piece, Position } from "@check-mate/shared/types";
import { boardAfterMove, createBoardforPlayer, getValidMovesForPiece, isInCheck } from "@check-mate/shared/utils";
import { ServiceError } from "../utils/error.js";

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

	makeMove = (move: Move) => {
		const piece = this.board[move.from.y][move.from.x];
		if(!piece) {
			throw new ServiceError("Cannot move an empty piece");
		}

		if(!this.isValidMove(piece, move.to)) {
			throw new ServiceError("Move not possible");
		}

		this.board = boardAfterMove(this.board, move, piece);
	}

	isValidMove = (piece: Piece, to: Position): boolean => {
		return getValidMovesForPiece(this.board, piece, this.mySide).find(pos => pos.x == to.x && pos.y == to.y) !== undefined;
	}

	isCheck = (move: Move): boolean => {
		return isInCheck(this.board, move, this.mySide);
	}
}

export default ChessService;