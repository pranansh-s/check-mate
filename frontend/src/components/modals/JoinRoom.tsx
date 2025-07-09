'use client';

import { memo, useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import ModalContainer from '@/components/modals/Modal';

import { handleErrors } from '@/lib/utils/error';
import { formatRoomKey } from '@/lib/utils/room';
import { useForm } from '@/hooks/useForm';
import { RoomKeySchema } from '@/schema/RoomKeySchema';
import { strings } from '@/constants/strings';

const JoinRoom: React.FC = memo(() => {
  const { formState, setFormState, hasErrors } = useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue =
      e.target.value.length > formState.roomKey?.value?.length ? formatRoomKey(e.target.value) : e.target.value;
    setFormState({
      roomKey: { value: formattedValue, error: undefined },
    });
  };

  const handleRoomJoin = async () => {
    setLoading(true);
    try {
      const { roomKey } = RoomKeySchema.parse({
        roomKey: formState.roomKey?.value ?? '',
      });

      router.push(`/room/${roomKey}`);
    } catch (err) {
      handleErrors(err, strings.room.errors.roomJoinFail, setFormState);
      setLoading(false);
    }
  };

  return (
    <ModalContainer>
      <Input
        name="roomKey"
        type="text"
        placeholder={strings.room.roomKeyPlaceholder}
        onChange={handleInput}
        input={formState.roomKey}
        className="mb-6"
      />
      <Button onClick={handleRoomJoin} disabled={hasErrors || loading} isLoading={loading}>
        join
      </Button>
    </ModalContainer>
  );
});

export default JoinRoom;
