import { Piece } from '@/types';
import { Move, Position } from "@check-mate/shared/types";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { boardAfterMove, createInitialBoard } from '@/lib/utils/chess';

const initialState = {
  boardMap: createInitialBoard(),
  moves: [] as Move[],
  currentMoveIndex: 0,
  selectedPiece: null as Piece | null,
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    movePiece: (state, action: PayloadAction<Move>) => {
      const move = action.payload;
      const piece = state.boardMap[move.from.y][move.from.x];
      if (!piece) {
        return state;
      }

      const updatedMoveList = [...state.moves, move];
      const updatedMove = boardAfterMove(state.boardMap, move, piece);
      return {
        ...state,
        boardMap: updatedMove,
        moves: updatedMoveList,
        selectedPiece: null,
      };
    },
    initMoves: (_, action: PayloadAction<Move[]>) => {
      const moveList = action.payload;

      let board = createInitialBoard();
      moveList.forEach((move: Move) => {
        const piece = board[move.from.y][move.from.x];
        if (!piece) return;

        board = boardAfterMove(board, move, piece);
      });

      return {
        boardMap: board,
        moves: moveList,
        currentMoveIndex: moveList.length,
        selectedPiece: null,
      };
    },
    goToMove: (state, action: PayloadAction<number>) => {
      const moveList = state.moves;
      const index = action.payload;
      if (index < 0 || index > moveList.length) return;

      let board = createInitialBoard();
      for (let i = 0; i < index; i++) {
        const move = moveList[i];
        const piece = board[move.from.y][move.from.x];
        if (!piece) return;

        board = boardAfterMove(board, move, piece);
      }

      return {
        ...state,
        boardMap: board,
        currentMoveIndex: index,
        selectedPiece: null,
      };
    },
    selectPiece: (state, action: PayloadAction<Position>) => {
      const { x, y } = action.payload;
      const piece = state.boardMap[y][x];

      state.selectedPiece = piece;
    },
    deSelectPiece: state => {
      state.selectedPiece = null;
    },
  },
});

export const { movePiece, initMoves, goToMove, selectPiece, deSelectPiece } = boardSlice.actions;

export default boardSlice.reducer;
