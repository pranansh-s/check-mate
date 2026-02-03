import { createClient, RedisClientType } from 'redis';

class RedisService {
  private client: RedisClientType;

  private readonly TTL_MIN = 10;

  constructor() {
    this.client = createClient();
    this.initEventListeners();
  }

  private initEventListeners = () => {
    this.client.on('connect', () => console.log('Redis connected'));
    this.client.on('error', err => console.error('Redis error:', err));
    this.client.on('end', () => console.log('Redis disconnected'));
  };

  getItem = async <T extends object>(key: string): Promise<T | null> => {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Redis GET failed:', err);
      throw new Error();
    }
  };

  setItem = <T extends object>(key: string, value: T) => {
    try {
      return this.client.set(key, JSON.stringify(value), {
        EX: this.TTL_MIN * 60,
      });
    } catch (err) {
      console.error('Redis SET failed:', err);
      throw new Error();
    }
  };

  removeItem = (key: string) => {
    try {
      return this.client.del(key);
    } catch (err) {
      console.error('Redis DEL failed:', err);
      throw new Error();
    }
  };

  connect = () => {
    this.client.connect();
  };

  disconnect = () => {
    this.client.quit();
  };
}

export default RedisService;
