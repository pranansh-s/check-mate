import { Color } from '@check-mate/shared/types';

export const opponentSide = (playerSide: Color) => (playerSide == 'black' ? 'white' : 'black');
