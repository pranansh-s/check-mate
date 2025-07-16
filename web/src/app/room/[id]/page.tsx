import { redirect } from 'next/navigation';

import RoomClient from '@/components/room';

import { get_room } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/error';

export default async function RoomPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  try {
    const data = (await get_room(id)).data;
    return <RoomClient roomId={id} {...data} />;
  } catch (err) {
    //send error data with redirect for toast
    //propogate firebase console delete or modify for cache
    console.error('Failed to join room: ', getErrorMessage(err));
    return redirect('/');
  }
}
