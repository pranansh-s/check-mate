import { BoardMap, Piece, PieceType } from '@/types';
import { Position } from '@check-mate/shared/types';

import { cardinalDirections, COLUMN_LETTERS, diagonalDirections, knightDirections } from '@/constants/chess';

import { opponentSide } from './game';

const createPiece = (type: PieceType, color: PieceColor, x: number, y: number): Piece => ({
  src: `/pieces/${type}-${color}.png`,
  type,
  color,
  pos: { x, y },
});

export const boardAfterMove = (board: BoardMap, move: Move, piece: Piece): BoardMap => {
  const { from, to } = move;
  const newBoard = board.map(row => [...row]);
  newBoard[to.y][to.x] = { ...piece, pos: to };
  newBoard[from.y][from.x] = null;
  return newBoard;
};

const isInCheck = (board: BoardMap, move: Move, kingColor: PieceColor): boolean => {
  let kingPos: Position | null = null;
  const movingPiece = board[move.from.y][move.from.x];

  if (!movingPiece) return false;
  if (movingPiece.type === 'king' && movingPiece.color === kingColor) {
    kingPos = move.to;
  } else {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = board[y][x];
        if (piece && piece.type === 'king' && piece.color === kingColor) {
          kingPos = { x, y } as Position;
        }
      }
    }
  }

  if (!kingPos) return false;
  const newBoard = boardAfterMove(board, move, movingPiece);
  for (const { dx, dy } of diagonalDirections) {
    for (let i = 1; i <= 7; i++) {
      const newX = kingPos.x + dx * i;
      const newY = kingPos.y + dy * i;

      if (newX < 0 || newX >= 8 || newY < 0 || newY >= 8) break;

      if (newBoard[newY][newX]) {
        if (newBoard[newY][newX].color !== kingColor) {
          const pieceType = newBoard[newY][newX].type;
          if (pieceType === 'bishop' || pieceType === 'queen' || (pieceType === 'pawn' && i == 1)) return true;
        }
        break;
      }
    }
  }

  for (const { dx, dy } of cardinalDirections) {
    for (let i = 1; i <= 7; i++) {
      const newX = kingPos.x + dx * i;
      const newY = kingPos.y + dy * i;

      if (newX < 0 || newX >= 8 || newY < 0 || newY >= 8) break;

      if (newBoard[newY][newX]) {
        if (newBoard[newY][newX].color !== kingColor) {
          const pieceType = newBoard[newY][newX].type;
          if (pieceType === 'rook' || pieceType === 'queen') return true;
        }
        break;
      }
    }
  }

  for (const { dx, dy } of knightDirections) {
    const newX = kingPos.x + dx;
    const newY = kingPos.y + dy;

    if (newX < 0 || newX >= 8 || newY < 0 || newY >= 8) break;

    if (newBoard[newY][newX] && newBoard[newY][newX].color !== kingColor) {
      if (newBoard[newY][newX].type === 'knight') return true;
    }
  }
  return false;
};

export const getValidMovesForPiece = (board: BoardMap, piece: Piece, player: PieceColor): Position[] => {
  const validMoves: Position[] = [];
  const { x, y } = piece.pos;

  const getMovesAlongDirection = (directions: { dx: number; dy: number }[], depth: number) => {
    for (const { dx, dy } of directions) {
      for (let i = 1; i <= depth; i++) {
        const newX = x + dx * i;
        const newY = y + dy * i;

        if (newX < 0 || newX >= 8 || newY < 0 || newY >= 8) break;

        if (!board[newY][newX]) {
          validMoves.push({ x: newX, y: newY });
        } else {
          if (board[newY][newX].color !== player) {
            validMoves.push({ x: newX, y: newY });
          }
          break;
        }
      }
    }
  };

  switch (piece.type) {
    case 'pawn':
      const newY = player === 'white' ? y - 1 : y + 1;

      if (newY >= 0 && newY < 8) {
        if (!board[newY][x]) {
          validMoves.push({ x, y: newY });
        }
        if (y == 6 && player === 'white' && !board[newY - 1][x]) {
          validMoves.push({ x, y: newY - 1 });
        }
        if (y == 1 && player === 'black' && !board[newY + 1][x]) {
          validMoves.push({ x, y: newY + 1 });
        }

        [-1, 1].forEach(dir => {
          if (x + dir >= 0 && x + dir < 8) {
            const pieceToCapture = board[newY][x + dir];
            if (pieceToCapture && pieceToCapture.color !== player) {
              validMoves.push({ x: x + dir, y: newY });
            }
          }
        });
      }
      break;
    case 'rook':
      getMovesAlongDirection(cardinalDirections, 7);
      break;
    case 'knight':
      getMovesAlongDirection(knightDirections, 1);
      break;
    case 'bishop':
      getMovesAlongDirection(diagonalDirections, 7);
      break;
    case 'queen':
      getMovesAlongDirection([...cardinalDirections, ...diagonalDirections], 7);
      break;
    case 'king':
      getMovesAlongDirection([...cardinalDirections, ...diagonalDirections], 1);
      break;
  }

  return validMoves.filter(to => !isInCheck(board, { from: piece.pos, to }, player));
};

export const createInitialBoard = (): BoardMap => {
  const board: BoardMap = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));
  const backRow: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

  for (let i = 0; i < 8; i++) {
    board[0][i] = createPiece(backRow[i], 'black', i, 0);
    board[7][i] = createPiece(backRow[i], 'white', i, 7);
  }

  for (let i = 0; i < 8; i++) {
    board[1][i] = createPiece('pawn', 'black', i, 1);
    board[6][i] = createPiece('pawn', 'white', i, 6);
  }

  return board;
};

export const parseMove = (move: Move, board: BoardMap, piece: Piece): string => {
  const column = COLUMN_LETTERS[move.to.x];
  const row = 8 - move.to.y;

  const pieceSymbol = { king: 'K', queen: 'Q', rook: 'R', bishop: 'B', knight: 'N', pawn: '' }[piece.type];
  const isCapture = !!board[move.to.y][move.to.x];
  const isCheck = isInCheck(board, move, opponentSide(piece.color));

  if (piece.type === 'king' && Math.abs(move.from.x - move.to.x) == 2) {
    return move.to.x > move.from.x ? 'O-O' : 'O-O-O';
  }

  if (piece.type === 'pawn' && isCapture) {
    return `${COLUMN_LETTERS[move.from.x]}x${column}${row}`;
  }

  return `${pieceSymbol}${isCapture ? 'x' : ''}${column}${row}${isCheck ? '+' : ''}`;
};
