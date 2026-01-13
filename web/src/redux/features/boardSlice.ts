import { getMoveNotation } from '@/lib/utils/chess';
import { Move, Piece, Position } from '@check-mate/shared/types';
import { boardAfterMove, createBoardforPlayer } from '@check-mate/shared/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  boardMap: createBoardforPlayer(),
  moves: [] as Move[],
  moveNotation: [] as string[],
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
      const updatedBoard = boardAfterMove(state.boardMap, move, piece);
      const updatedNotation = [...state.moveNotation, getMoveNotation(state.boardMap, move)];

      return {
        ...state,
        boardMap: updatedBoard,
        moves: updatedMoveList,
        moveNotation: updatedNotation,
        currentMoveIndex: state.currentMoveIndex + 1,
        selectedPiece: null,
      };
    },

    initMoves: (state, action: PayloadAction<Move[]>) => {
      const moveList = action.payload;

      let board = createBoardforPlayer();
      const notationList: string[] = [];
      for (const move of moveList) {
        const piece = board[move.from.y][move.from.x];
        if (!piece) {
          throw new Error('Move without a piece');
        }

        notationList.push(getMoveNotation(board, move));
        board = boardAfterMove(board, move, piece);
      }

      return {
        ...state,
        boardMap: board,
        moves: moveList,
        moveNotation: notationList,
        currentMoveIndex: moveList.length,
        selectedPiece: null,
      };
    },

    goToMove: (state, action: PayloadAction<number>) => {
      const moveList = state.moves;
      const index = action.payload;
      if (index < 0 || index > moveList.length) return;

      let board = createBoardforPlayer();
      for (let i = 0; i < index; i++) {
        const move = moveList[i];
        const piece = board[move.from.y][move.from.x];
        if (!piece) {
          throw new Error('Move without a piece');
        }

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
      state.selectedPiece = state.boardMap[y][x];
    },

    deSelectPiece: state => {
      state.selectedPiece = null;
    },
  },
});

export const { movePiece, initMoves, goToMove, selectPiece, deSelectPiece } = boardSlice.actions;

export default boardSlice.reducer;
