//move a lot of chess validation to backend or possibly shared utils
//abstract logic in frontend into hooks/functions to make more readable and SOLID friendly
//useCallback, useMemo, memo usage improvement

import { Board, Color, Game, Move, Piece, Position } from "@check-mate/shared/types";
import { boardAfterMove, createBoardforPlayer, getValidMovesForPiece, isInCheck, opponentSide } from "@check-mate/shared/utils";
import { ServiceError } from "../utils/error.js";

class ChessService {
	private board: Board;
	private mySide: Color;
	
	private readonly COLUMN_LETTERS = 'abcdefgh';
	private readonly ROW_NUMBERS = '12345678';

	constructor(newGame: Game) {
		if(newGame.whiteSidePlayer) {
			this.mySide = "white";
		}
		else if(newGame.blackSidePlayer) {
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

	isValidMove = (piece: Piece, to: Position): boolean => {
		return getValidMovesForPiece(this.board, piece, this.mySide).includes(to);
	}

	isCheck = (move: Move): boolean => {
		return isInCheck(this.board, move, this.mySide);
	}

	getAllMovesNotation = (moves: Move[]): string[] => {
		return moves.map((move) => this.getMoveNotation(move));
	}

	getMoveNotation = (move: Move): string => {
		const column = this.COLUMN_LETTERS[move.to.x];
		const row = this.ROW_NUMBERS[8 - move.to.y];
		const piece = this.board[move.from.y][move.from.x];

		if(!piece) {
			throw new ServiceError("Cannot move an empty piece");
		}

		const pieceSymbol = { king: 'K', queen: 'Q', rook: 'R', bishop: 'B', knight: 'N', pawn: '' }[piece.type];
		const isCapture = !!this.board[move.to.y][move.to.x];
		const isCheck = isInCheck(this.board, move, opponentSide(piece.color));

		if (piece.type === 'king' && Math.abs(move.from.x - move.to.x) == 2) {
			return move.to.x > move.from.x ? 'O-O' : 'O-O-O';
		}

		if (piece.type === 'pawn' && isCapture) {
			return `${this.COLUMN_LETTERS[move.from.x]}x${column}${row}`;
		}

		return `${pieceSymbol}${isCapture ? 'x' : ''}${column}${row}${isCheck ? '+' : ''}`;
	};

}

export default ChessService;