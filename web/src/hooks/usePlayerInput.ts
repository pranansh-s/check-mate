import { useEffect, useState } from 'react';

import { Position } from '@xhess/shared/types';

import { goToMove } from '@/redux/features/boardSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

const usePlayerInput = () => {
  const { currentMoveIndex } = useAppSelector(state => state.board);
  const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (activeElement && activeElement.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key == 'ArrowLeft') {
        dispatch(goToMove(currentMoveIndex - 1));
      } else if (e.key == 'ArrowRight') {
        dispatch(goToMove(currentMoveIndex + 1));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [currentMoveIndex]);

  return mousePos;
};

export default usePlayerInput;
