import { GameType } from "@check-mate/shared/types";

export const GAME_TIME_MS: Record<GameType, number> = {
  "30m": 30 * 60000,
  "10m": 10 * 60000,
  "3m": 3 * 60000,
};
