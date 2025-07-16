'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useDispatch } from 'react-redux';
import tw from 'tailwind-styled-components';

import Button from '@/components/common/Button';

import { auth } from '@/lib/firebase';
import { getErrorMessage } from '@/lib/utils/error';
import { createRoom } from '@/lib/utils/room';
import { openModal } from '@/redux/features/modalSlice';

const Options = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const handleCreateRoom = async () => {
    if (!auth.currentUser) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const key = await createRoom();
      router.push(`/room/${key}`);
    } catch (err) {
      console.error('Failed to create room: ', getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <OptionsContainer>
      <Button themeColor="green">play against computer</Button>
      <Button onClick={handleCreateRoom} isLoading={loading} disabled={loading} themeColor="blue">
        create room
      </Button>
      <Button onClick={() => dispatch(openModal('joinRoom'))}>join room</Button>
    </OptionsContainer>
  );
};

export default Options;

const OptionsContainer = tw.div`
  absolute
  left-1/2
  top-1/2
  flex
  -translate-x-1/2
  translate-y-1/4
  flex-col
  gap-6
`;
