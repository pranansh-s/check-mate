'use client';

import { memo } from 'react';
import Image from 'next/image';

import { Piece } from '@/types';
import { Move, Position } from "@check-mate/shared/types";
import tw from 'tailwind-styled-components';

import { handleErrors } from '@/lib/utils/error';
import { updateMove } from '@/lib/utils/game';
import { deSelectPiece, movePiece, selectPiece } from '@/redux/features/boardSlice';
import { endTurn } from '@/redux/features/gameSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

interface ICellProps {
  piece: Piece | null;
  currentPos: Position;
  isPossibleMove: boolean;
}

const Cell: React.FC<ICellProps> = memo(({ piece, currentPos, isPossibleMove }) => {
  const { selectedPiece, currentMoveIndex, moves } = useAppSelector(state => state.board);
  const { id, isTurn, playerSide } = useAppSelector(state => state.gameState);
  const dispatch = useAppDispatch();

  const isSelected = selectedPiece && piece == selectedPiece;
  const isSelectable = (isTurn && currentMoveIndex == moves.length && piece?.color == playerSide) || isPossibleMove;

  const handleClick = async () => {
    if (selectedPiece) {
      const move = { from: selectedPiece.pos, to: currentPos } as Move;
      if (isPossibleMove) {
        try {
          dispatch(movePiece(move));
          dispatch(endTurn());
          await updateMove(id, move, playerSide);
        } catch (err) {
          handleErrors(err, 'failed to move piece');
        }
      } else {
        dispatch(deSelectPiece());
      }
      return;
    }

    if (isSelectable) {
      dispatch(selectPiece(currentPos));
    }
  };

  return (
    <CellContainer
      onClick={handleClick}
      $isSelectable={isSelectable}
      $isSelected={isSelected}
      $isBlackCell={(currentPos.x + currentPos.y) % 2 !== 0}
      $isHighlighted={isPossibleMove}
      $isCapturable={piece !== null}
    >
      {piece && !isSelected && (
        <Image
          className="h-full w-full"
          width={80}
          height={80}
          src={piece.src}
          alt={`piece-${piece.type}-${piece.color}`}
          priority
        />
      )}
    </CellContainer>
  );
});

export default Cell;

const CellContainer = tw.div<{
  $isSelectable: boolean;
  $isSelected: boolean;
  $isBlackCell: boolean;
  $isHighlighted: boolean;
  $isCapturable: boolean;
}>`
  ${p => (p.$isBlackCell ? 'bg-primary' : 'bg-zinc-200')}
  ${p => p.$isSelectable && 'cursor-pointer'}
  ${p => p.$isSelected && 'bg-blue-300'}
  ${p => p.$isHighlighted && (p.$isCapturable ? 'bg-red-400' : 'invert-[0.8] contrast-125 hue-rotate-90')} `;
