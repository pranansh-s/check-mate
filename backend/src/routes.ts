import express from "express";

import RoomService from "./services/room.service.js";
import GameService from "./services/game.service.js";
import { handleAuthValidation } from "./utils/middleware.js";
import { ServiceError } from "./models/error.js";

const router = express.Router();

const roomService = new RoomService();
const gameService = new GameService();

router.post("/new-room", handleAuthValidation, async (req, res, next) => {
  try {
    const userId = req.userId;
    const roomId = await roomService.createRoom(userId);

    res.status(201).json({
      message: "Succesfully created room",
      key: roomId,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/room/:id", handleAuthValidation, async (req, res, next) => {
  try {
    const userId = req.userId;
    const roomId = req.params.id;

    const room = await roomService.joinRoom(roomId, userId);
    const game = await gameService
      .joinGame(roomId, userId)
      .catch((err) =>
        err instanceof ServiceError ? null : Promise.reject(err)
      );

    res.status(200).json({
      message: "Succesfully joined room",
      room,
      game,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
