import { redirect } from 'next/navigation';

import { getErrorMessage } from '@/lib/utils/error';

import RoomClient from '@/components/room';

import { get_room } from '@/lib/api';

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const res = await get_room(id);
    return <RoomClient roomId={id} {...res.data} />;
  } catch (err) {
    //send error data with redirect for toast
    console.error('Failed to join room: ', getErrorMessage(err));
    return redirect('/');
  }
}
