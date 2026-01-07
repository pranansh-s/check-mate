import { Board, Move } from "@check-mate/shared/types";
import { willMoveCheck, opponentSide } from "@check-mate/shared/utils";
	
const COLUMN_LETTERS = 'abcdefgh';
const ROW_NUMBERS = '12345678';

const ChessService = {
	getMoveNotation: (board: Board, move: Move): string => {
		const column = COLUMN_LETTERS[move.to.x];
		const row = ROW_NUMBERS[7 - move.to.y];
		const piece = board[move.from.y][move.from.x];

		if(!piece) {
			throw new Error("No piece in move for notation");
		}

		const pieceSymbol = { king: 'K', queen: 'Q', rook: 'R', bishop: 'B', knight: 'N', pawn: '' }[piece.type];
		const isCapture = !!board[move.to.y][move.to.x];
		const isCheck = willMoveCheck(board, move, opponentSide(piece.color));

		if (piece.type === 'king' && Math.abs(move.from.x - move.to.x) == 2) {
			return move.to.x > move.from.x ? 'O-O' : 'O-O-O';
		}

		if (piece.type === 'pawn' && isCapture) {
			return `${COLUMN_LETTERS[move.from.x]}x${column}${row}`;
		}

		return `${pieceSymbol}${isCapture ? 'x' : ''}${column}${row}${isCheck ? '+' : ''}`;
	}
}

export default ChessService;