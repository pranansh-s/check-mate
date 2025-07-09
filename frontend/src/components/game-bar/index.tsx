'use client';

import { memo } from 'react';

import tw from 'tailwind-styled-components';

import Chat from './Chat';
import GameOptions from './GameOptions';
import MoveHistory from './MoveHistory';

const GameBar: React.FC = memo(() => {
  return (
    <GameBarContainer>
      <GameOptions />
      <Divider />
      <MoveHistory />
      <Chat />
    </GameBarContainer>
  );
});

export default GameBar;

const GameBarContainer = tw.div`
  hidden
  h-full
  w-[30vw]
  max-w-[500px]
  flex-col
  gap-3
  rounded-xl
  bg-zinc-900
  p-6
  lg:flex
`;

const Divider = tw.div`
  mt-3
  border-t
  border-white
`;
