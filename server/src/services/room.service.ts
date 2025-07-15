import { Room, ChatMessage } from "@check-mate/shared/types";
import dbController from "../controllers/db.controller.js";
import { ServiceError } from "../utils/error.js";
import { generateRoomKey } from "../utils/room.js";
import { MessageSchema } from "@check-mate/shared/schemas";

const ROOM_PREFIX = "rooms";
const activeRoomIds: Set<string> = new Set();

const RoomService = {
  getRoom: async (roomId: string): Promise<Room> => {
    const room = await dbController.loadData<Room>(ROOM_PREFIX, roomId);
    if (!room) {
      throw new ServiceError("Room not found");
    }
    return room;
  },

  saveRoom: (roomId: string, room: Room) => {    
    return dbController.saveData<Room>(ROOM_PREFIX, room, roomId);
  },

  destroyRoom: async (roomId: string) => {
    await dbController.deleteData(ROOM_PREFIX, roomId);
    activeRoomIds.delete(roomId);
  },

  createRoom: async (userId: string): Promise<string> => {
    const roomId = generateRoomKey(activeRoomIds);
    const createdRoom: Room = {
      createdBy: userId,
      participants: [userId],
      chat: [],
    };

    await RoomService.saveRoom(roomId, createdRoom);
    activeRoomIds.add(roomId);
    
    return roomId;
  },

  joinRoom: async (roomId: string, userId: string): Promise<Room> => {
    const room = await RoomService.getRoom(roomId);

    if (room.participants.includes(userId)) {
      return room;
    }
    if (room.participants.length >= 2) {
      throw new ServiceError("Room already full");
    }
    room.participants.push(userId);

    await RoomService.saveRoom(roomId, room);
    return room;
  },

  leaveRoom: async (roomId: string, userId: string): Promise<Room> => {
    const room = await RoomService.getRoom(roomId);

    if (!room.participants.includes(userId)) {
      return room;
    }

    room.participants = room.participants.filter((id) => id !== userId);
    if (room.participants.length == 0) {
      await RoomService.destroyRoom(roomId);
      return room;
    }

    await RoomService.saveRoom(roomId, room);
    return room;
  },

  sendMessage: async (roomId: string, userId: string, content: string): Promise<ChatMessage> => {
    MessageSchema.parse(content);
    const createdMessage: ChatMessage = {
      content,
      senderId: userId,
      timestamp: Date.now(),
    };
    
    const room = await RoomService.getRoom(roomId);
    const updatedRoom: Room = {
      ...room,
      chat: [...(room.chat || []), createdMessage],
    };

    await RoomService.saveRoom(roomId, updatedRoom);
    return createdMessage;
  }
}

export default RoomService;
