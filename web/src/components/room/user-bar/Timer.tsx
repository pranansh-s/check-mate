'use client';

import React, { useCallback, useEffect, useState } from 'react';

import tw from 'tailwind-styled-components';

interface ITimerProps {
  left: number;
  ticking: boolean;
}

const Timer = ({ left, ticking }: ITimerProps) => {
  const [displayTime, setDisplayTime] = useState<number>(left);

  const formatTime = useCallback((val: number) => {
    const totalSeconds = Math.floor(val / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => setDisplayTime(left), [left]);

  useEffect(() => {
    if (!ticking) return;

    const interval = setInterval(() => {
      setDisplayTime(prev => {
        return Math.max(prev - 1000, 0);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [ticking]);

  return <TimerContainer $isTicking={ticking}>{formatTime(displayTime)}</TimerContainer>;
};

export default Timer;

const TimerContainer = tw.div<{ $isTicking: boolean }>`
  ${p => (p.$isTicking ? 'opacity-100' : 'opacity-50')}
  h-max
  rounded-lg
  bg-secondary
  px-4
  py-2
  font-serif
  text-2xl
  text-tertiary
`;
