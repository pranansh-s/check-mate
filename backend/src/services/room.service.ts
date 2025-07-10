import dbController from "../controllers/db.controller.js";
import { ServiceError } from "../models/error.js";
import { ChatMessage, Room } from "../models/room.model.js";
import { generateRoomKey } from "../utils/room.js";

class RoomService {
  private static activeRoomIds: string[] = [];

  private readonly ROOM_PREFIX = "rooms";

  getRoom = async (roomId: string): Promise<Room> => {
    const room = await dbController.loadData<Room>(this.ROOM_PREFIX, roomId);
    if (!room) {
      throw new ServiceError("Room not found");
    }
    return room;
  };

  saveRoom = (roomId: string, room: Room) => {
    return dbController.saveData<Room>(this.ROOM_PREFIX, room, roomId);
  };

  destroyRoom = async (roomId: string) => {
    await dbController.deleteData(this.ROOM_PREFIX, roomId);
    RoomService.activeRoomIds = RoomService.activeRoomIds.filter((id) => id !== roomId);
  };

  createRoom = async (userId: string): Promise<string> => {
    const roomId = generateRoomKey(RoomService.activeRoomIds);
    const createdRoom = {
      createdBy: userId,
      participants: [userId],
      chat: [],
    } as Room;

    await this.saveRoom(roomId, createdRoom);
    RoomService.activeRoomIds.push(roomId);
    
    return roomId;
  };

  joinRoom = async (roomId: string, userId: string): Promise<Room> => {
    const room = await this.getRoom(roomId);

    if (room.participants.includes(userId)) {
      return room;
    }
    if (room.participants.length >= 2) {
      throw new ServiceError("Room already full");
    }
    room.participants.push(userId);

    await this.saveRoom(roomId, room);
    return room;
  };

  leaveRoom = async (roomId: string, userId: string): Promise<Room> => {
    const room = await this.getRoom(roomId);

    if (!room.participants.includes(userId)) {
      return room;
    }

    room.participants = room.participants.filter((id) => id !== userId);
    if (room.participants.length == 0) {
      await this.destroyRoom(roomId);
      return room;
    }

    await this.saveRoom(roomId, room);
    return room;
  };

  sendMessage = async (roomId: string, userId: string, content: string): Promise<ChatMessage> => {
    const room = await this.getRoom(roomId);
    const createdMessage = {
      content,
      senderId: userId,
      timestamp: Date.now(),
    } as ChatMessage;

    const updatedRoom = {
      ...room,
      chat: [...(room.chat || []), createdMessage],
    } as Room;

    await this.saveRoom(roomId, updatedRoom);
    return createdMessage;
  };
}

export default RoomService;
