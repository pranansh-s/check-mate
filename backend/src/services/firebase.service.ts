import admin from "firebase-admin";
import { Firestore } from "firebase-admin/firestore";
import { configFirebase } from "../config.js";

class FirebaseService {
  private db: Firestore;

  constructor() {
    const firebaseConfig = configFirebase();
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });

    this.db = admin.firestore();
  }

  getDoc = async <T extends object>(collection: string, id: string): Promise<T | null> => {
    try {
      const docSnapshot = await this.db.collection(collection).doc(id).get();
      return docSnapshot.exists ? (docSnapshot.data() as T) : null;
    } catch (err) {
      console.error("Firebase GET failed:", err);
      throw new Error();
    }
  };

  setDoc = async <T extends object>(collection: string, id: string, data: T) => {
    try {
      await this.db.collection(collection).doc(id).set(data);
    } catch (err) {
      console.error("Firebase SET failed:", err);
      throw new Error();
    }
  };

  removeDoc = async (collection: string, id: string) => {
    try {
      await this.db.collection(collection).doc(id).delete();
    } catch (err) {
      console.error("Firebase DEL failed:", err);
      throw new Error();
    }
  };
}

export default FirebaseService;
