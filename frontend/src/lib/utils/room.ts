import { Game, Message, Room } from '@/types';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';

import { auth, db } from '../firebase/client';
import { get_room, post_createRoom } from '../api';

export const formatRoomKey = (val: string) => {
	const cleaned = val.replace(/[^a-z0-9]/gi, '');
	return cleaned
		.slice(0, 8)
		.replace(/(\w{4})(\w{0,4})/, '$1-$2')
		.toLowerCase();
};

export const fetchRoomAndGame = async (roomId: string): Promise<{ room: Room, game: Game | null }> => {
	const res = await get_room(roomId);
	return res.data();
}

export const createNewRoom = async (): Promise<string> => {
	const res = await post_createRoom();
	const { key } = res.data();
	return key;
}

export const sendMessage = async (roomId: string, content: string) => {
  const newMessage = {
    content,
    senderId: auth.currentUser!.uid,
    timestamp: Date.now(),
  } as Message;

  await updateDoc(doc(db, 'rooms', roomId), {
    chat: arrayUnion(newMessage),
  });
};
