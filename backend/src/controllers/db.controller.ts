import { DatabaseError } from "../models/error.js";
import FirebaseService from "../services/firebase.service.js";
import RedisService from "../services/redis.service.js";

class DatabaseController {
  private static instance: DatabaseController = new DatabaseController();
  private redis: RedisService;
  private firebase: FirebaseService;

  private constructor() {
    this.redis = new RedisService();
    this.firebase = new FirebaseService();

    this.redis.connect();
  }

  static getInstance(): DatabaseController {
    return this.instance;
  }

  loadData = async <T extends object>(prefix: string, id: string): Promise<T | null> => {
    const cacheKey = `${prefix}:${id}`;
    try {
      const cachedData = await this.redis.getItem<T>(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const data = await this.firebase.getDoc<T>(prefix, id);
      if (!data) {
        return null;
      }
      await this.redis.setItem<T>(cacheKey, data);

      return data;
    } catch (err) {
      console.error(`Database load operation failed for ${prefix}/${id}`);
      throw new DatabaseError();
    }
  };

  saveData = async <T extends object>(prefix: string, data: T, id: string) => {
    const cacheKey = `${prefix}:${id}`;
    try {
      await this.firebase.setDoc<T>(prefix, id, data);
      await this.redis.setItem<T>(cacheKey, data);
    } catch (err) {
      console.error(`Database save operation failed for ${prefix}/${id}`);
      throw new DatabaseError();
    }
  };

  deleteData = async (prefix: string, id: string) => {
    const cacheKey = `${prefix}:${id}`;
    try {
      await this.redis.removeItem(cacheKey);
      await this.firebase.removeDoc(prefix, id);
    } catch (err) {
      console.error(`Database delete operation failed for ${prefix}/${id}`);
      throw new DatabaseError();
    }
  };
}

export default DatabaseController.getInstance();
