import { redirect } from 'next/navigation';

import { fetchRoomAndGame } from '@/lib/utils/room';
import RoomClient from '@/components/room';

export default async function RoomPage({ params }: { params: { id: string } }) {
	const { id } = await params;

	try {
		const data = await fetchRoomAndGame(id);
		return <RoomClient roomId={id} {...data} />;
  	} catch (err) {
		//send error data with redirect for toast
		return redirect('/');
  	}
}
