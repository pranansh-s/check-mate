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
