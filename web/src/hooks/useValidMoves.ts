import { useCallback, useMemo } from 'react';

import { BoardMap, Piece } from '@/types';
import { Color } from '@check-mate/shared/types';

import { getValidMovesForPiece } from '@/lib/utils/chess';

const useValidMoves = (board: BoardMap, activePiece: Piece | null, side: Color) => {
  const validMoves = useMemo(
    () => (activePiece ? getValidMovesForPiece(board, activePiece, side) : []),
    [activePiece, board, side]
  );

  return useCallback(
    (cellX: number, cellY: number) => {
      return validMoves.some(move => move.x === cellX && move.y === cellY);
    },
    [validMoves]
  );
};

export default useValidMoves;
