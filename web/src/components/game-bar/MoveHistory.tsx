'use client';

import { useMemo } from 'react';

import tw from 'tailwind-styled-components';

import { boardAfterMove, createInitialBoard, parseMove } from '@/lib/utils/chess';
import { goToMove } from '@/redux/features/boardSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

const MoveHistory = () => {
  const moveList = useAppSelector(state => state.board.moves);
  const dispatch = useAppDispatch();

  const notation = useMemo(() => {
    let board = createInitialBoard();
    return moveList.map(move => {
      const piece = board[move.from.y][move.from.x];
      if (!piece) return;

      const moveNotation = parseMove(move, board, piece);
      board = boardAfterMove(board, move, piece);
      return moveNotation;
    });
  }, [moveList]);

  return (
    <MoveHistoryContainer className="striped">
      {notation.map((move, idx) => (
        <MoveItem onClick={() => dispatch(goToMove(idx + 1))} key={idx}>
          <span>{idx + 1}.</span>
          <span>{move}</span>
        </MoveItem>
      ))}
    </MoveHistoryContainer>
  );
};

export default MoveHistory;

const MoveHistoryContainer = tw.ol`
  flex
  flex-1
  flex-wrap
  content-start
  gap-2
  overflow-y-auto
`;

const MoveItem = tw.li`
  h-max
  cursor-pointer
  space-x-1
  rounded-md
  p-2
  font-serif
  text-sm
`;
