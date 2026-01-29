'use client';

import { memo, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import { RoomKeySchema } from '@check-mate/shared/schemas';

import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import ModalContainer from '@/components/modals/Modal';

import { useForm } from '@/hooks/useForm';
import { handleErrors } from '@/lib/utils/error';
import { formatRoomKey } from '@/lib/utils/room';

import { strings } from '@/constants/strings';

const JoinRoom = memo(() => {
  const { formState, setFormState, hasErrors } = useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue =
      e.target.value.length > formState.roomKey?.value?.length ? formatRoomKey(e.target.value) : e.target.value;
    setFormState({
      roomKey: { value: formattedValue, error: undefined },
    });
  }, [setFormState]);

  const handleRoomJoin = useCallback(() => {
    setLoading(true);
    try {
      const id = RoomKeySchema.parse(formState.roomKey?.value);
      router.push(`/room/${id}`);
    } catch (err) {
      handleErrors(err, strings.room.errors.roomJoinFail, setFormState);
      setLoading(false);
    }
  }, [formState.roomKey, setFormState]);

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