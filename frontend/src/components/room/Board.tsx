'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

import { Position } from '@/types';
import tw from 'tailwind-styled-components';

import { getValidMovesForPiece } from '@/lib/utils/chess';
import { goToMove } from '@/redux/features/boardSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import Cell from './Cell';

const Board: React.FC = () => {
  const { boardMap, selectedPiece, currentMoveIndex } = useAppSelector(state => state.board);
  const { playerSide } = useAppSelector(state => state.gameState);
  const dispatch = useAppDispatch();

  const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });
  const possibleMoves = useMemo(
    () => (selectedPiece ? getValidMovesForPiece(boardMap, selectedPiece, playerSide) : []),
    [selectedPiece, boardMap, playerSide]
  );
  const board = useMemo(() => (playerSide == 'black' ? [...boardMap].reverse() : boardMap), [boardMap, playerSide]);

  const isValidMove = (cellX: number, cellY: number) => {
    return possibleMoves.some(move => move.x === cellX && move.y === cellY);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key == 'ArrowLeft') {
        dispatch(goToMove(currentMoveIndex - 1));
      } else if (e.key == 'ArrowRight') {
        dispatch(goToMove(currentMoveIndex + 1));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentMoveIndex]);

  return (
    <BoardContainer>
      {board.map((row, rowNumber: number) => {
        const rowIdx = playerSide === 'black' ? boardMap.length - 1 - rowNumber : rowNumber;
        return row.map((piece, colIdx: number) => (
          <Cell
            key={`cell-${rowIdx}+${colIdx}`}
            piece={piece}
            currentPos={{ x: colIdx, y: rowIdx }}
            isPossibleMove={isValidMove(colIdx, rowIdx)}
          />
        ));
      })}
      {selectedPiece && (
        <SelectedPiece
          style={{
            top: mousePos.y - 50,
            left: mousePos.x - 50,
          }}
        >
          <Image
            width={100}
            height={100}
            src={selectedPiece.src}
            alt={`active-piece-${selectedPiece.type}-${selectedPiece.color}`}
            priority
          />
        </SelectedPiece>
      )}
    </BoardContainer>
  );
};

export default Board;

const BoardContainer = tw.div`
  grid
  aspect-square
  h-full
  max-h-[90vw]
  grid-cols-8
  grid-rows-8
  bg-white
`;

const SelectedPiece = tw.div`
  pointer-events-none
  absolute
`;
