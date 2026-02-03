import express from "express";

import RoomService from "../services/room.service.js";
import GameService from "../services/game.service.js";
import { handleAuthValidation } from "../middleware.js";
import { ServiceError } from "../utils/error.js";

import { Profile, RoomKeySchema } from "@check-mate/shared/schemas";
import ProfileService from "../services/profile.service.js";

const router = express.Router();

router.post("/new-room", handleAuthValidation, async (req, res, next) => {
  try {
    const userId = req.userId;
    const roomId = await RoomService.createRoom(userId);

    res.status(201).json({
      key: roomId,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/room/:id", handleAuthValidation, async (req, res, next) => {
  try {
    const userId = req.userId;
    const roomId = RoomKeySchema.parse(req.params.id);
    
    const room = await RoomService.joinRoom(roomId, userId);

    res.status(200).json({
      room,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
