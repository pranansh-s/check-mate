import { Game, GameConfig, GameServer, Move, Piece, PieceColor } from '@/types';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';

import { db } from '../firebase';
import { handleErrors } from './error';

export const createNewGameForRoom = async (roomId: string, config: GameConfig) => {
  const newGame = {
    roomId,
    moves: [],
    playerTurn: 'white',
    active: true,
    ...config,
  };

  try {
    await addDoc(collection(db, 'games'), newGame);
  } catch (err) {
    handleErrors(err, 'failed to create a new game');
  }
};

export const updateMove = async (gameId: string | null, newMove: Move, currentTurn: PieceColor) => {
  if (!gameId) {
    throw new Error('need game id');
  }

  const gameRef = doc(db, 'games', gameId);
  const gameData = (await getDoc(gameRef)).data() as GameServer;

  await updateDoc(gameRef, {
    moves: [...gameData.moves, newMove],
    playerTurn: opponentSide(currentTurn),
  });
};

export const opponentSide = (playerSide: PieceColor) => (playerSide == 'black' ? 'white' : 'black');

export const updatePlayerSide = async (gameId: string, game: GameServer, userId: string) => {
  let update: Partial<GameServer> = {};

  if (game.blackSidePlayer === userId || game.whiteSidePlayer === userId) return;
  if (!game.blackSidePlayer) {
    update.blackSidePlayer = userId;
  } else if (!game.whiteSidePlayer) {
    update.whiteSidePlayer = userId;
  }

  if (Object.keys(update).length === 0) return;
  try {
    await updateDoc(doc(db, 'games', gameId), update);
  } catch (err) {
    handleErrors(err, "failed to update player's side");
  }
};

export const parseGame = (gameId: string, userId: string, game: GameServer): Game => {
  let playerSide: PieceColor;
  if (game.whiteSidePlayer === userId) playerSide = 'white';
  else if (game.blackSidePlayer === userId) playerSide = 'black';
  else if (game.blackSidePlayer === null) playerSide = 'black';
  else playerSide = 'white';

  return {
    id: gameId,
    roomId: game.roomId,
    moves: game.moves,
    playerTurn: game.playerTurn,
    playerSide,
    gameType: game.gameType,
  } as Game;
};
