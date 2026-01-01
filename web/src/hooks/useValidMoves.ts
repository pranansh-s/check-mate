import { useCallback, useMemo } from 'react';

import { Board, Color, Piece } from '@check-mate/shared/types';
import { getValidMovesForPiece } from '@check-mate/shared/utils';

const useValidMoves = (board: Board, activePiece: Piece | null, side: Color) => {
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
