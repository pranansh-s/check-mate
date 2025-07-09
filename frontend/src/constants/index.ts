import { ToastOptions } from 'react-toastify';

import { strings } from './strings';

export const modelPaths = ['/models/bishop.fbx', '/models/knight.fbx', '/models/pawn.fbx', '/models/rook.fbx'];

export const toastConfig = {
  type: 'error',
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: true,
  closeButton: false,
} as ToastOptions;

export const gameTypeOptions = [
  { name: '30m | regular chess', type: '30m' },
  { name: '10m + 3s | quick chess', type: '10m' },
  { name: '3m + 5s | speed chess', type: '3m' },
];

export const Duration = {
  apiTimeout: 60000,
}

export const mapFirebaseErrorToMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'please enter a valid email address.';
    case 'auth/user-disabled':
      return 'this account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'incorrect email or password';
    case 'auth/email-already-in-use':
      return 'email address is already registered';
    case 'auth/too-many-requests':
      return 'too many attempts. please try again later';

    case 'permission-denied':
    case 'unauthenticated':
      return 'sign in before accessing';
    case 'not-found':
      return 'information was not found';
    case 'aborted':
    case 'unavailable':
    case 'resource-exhausted':
      return 'request timed out. try again';

    default:
      return strings.errors.genericError;
  }
};

export const COLUMN_LETTERS = 'abcdefgh';

export const cardinalDirections = [
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
];

export const diagonalDirections = [
  { dx: 1, dy: 1 },
  { dx: -1, dy: -1 },
  { dx: 1, dy: -1 },
  { dx: -1, dy: 1 },
];

export const knightDirections = [
  { dx: 2, dy: 1 },
  { dx: 2, dy: -1 },
  { dx: 1, dy: 2 },
  { dx: -1, dy: 2 },
  { dx: -2, dy: 1 },
  { dx: -2, dy: -1 },
  { dx: 1, dy: -2 },
  { dx: -1, dy: -2 },
];
