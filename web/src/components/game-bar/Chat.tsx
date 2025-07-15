'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

import { doc, onSnapshot } from 'firebase/firestore';
import tw from 'tailwind-styled-components';
import { z } from 'zod';

import { db } from '@/lib/firebase';
import { handleErrors } from '@/lib/utils/error';
import { sendMessage } from '@/lib/utils/room';
import { strings } from '@/constants/strings';

import { MessageSchema } from "@check-mate/shared/schemas";
import { ChatMessage } from '@check-mate/shared/types';

import sendIcon from '@/../public/icons/send.svg';
import Button from '../common/Button';

const toTime = (val: number): string => {
  const date = new Date(val);
  const timeString = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return timeString;
};

const Chat: React.FC = memo(() => {
  const params = useParams();
  const roomId = params?.id as string;

  const endMessageRef = useRef<HTMLDivElement>(null);
  const [chat, setChat] = useState<(ChatMessage | string)[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleSendMessage = async () => {
    setIsSending(true);
    try {
      if (chat.length >= 100) {
        throw new Error('chat length exceeded create a new room');
      }
      const content = MessageSchema.parse(message);
      setMessage('');
      await sendMessage(roomId, content);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setChat([...chat, `~ ${err.errors[0].message} ~`]);
      } else {
        handleErrors(err, 'could not send message');
      }
    } finally {
      setTimeout(() => setIsSending(false), 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSending) {
      handleSendMessage();
      e.preventDefault();
    }
  };

  useEffect(() => {
    endMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  useEffect(() => {
    const chatUnsubscribe = onSnapshot(
      doc(db, 'rooms', roomId),
      snapshot => {
        if (!snapshot.exists() || !snapshot.data().chat) return;
        const fetchedMessages = snapshot.data().chat as ChatMessage[];
        setChat(fetchedMessages);
      },
      err => {
        console.log('messages listening error: ', err);
      }
    );
    return chatUnsubscribe;
  }, [roomId]);

  return (
    <ChatContainer>
      <MessageHistory>
        {chat.map((chatMessage: ChatMessage | string, idx: number) => {
          const isError = typeof chatMessage === 'string';
          return (
            <MessageField $isErrorMessage={isError} key={idx}>
              <span>{isError ? chatMessage : chatMessage.content}</span>
              {!isError && <Timestamp>{toTime(chatMessage.timestamp)}</Timestamp>}
            </MessageField>
          );
        })}
        <div ref={endMessageRef} />
      </MessageHistory>
      <InputArea>
        <InputField
          value={message}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          name="message"
          rows="1"
          type="text"
          placeholder={strings.room.messagePlaceholder}
        />
        <SendButton
          disabled={isSending}
          onClick={handleSendMessage}
          size="icon"
          themeColor="blue"
          preIconNode={sendIcon}
        />
      </InputArea>
    </ChatContainer>
  );
});

export default Chat;

const ChatContainer = tw.div`
  flex
  h-1/3
  min-h-[150px]
  flex-col
  gap-3
  rounded-lg
  bg-zinc-800
  p-3
  font-serif
`;

const MessageHistory = tw.div`
  flex
  flex-1
  flex-col
  overflow-y-auto
  text-zinc-300
`;

const InputArea = tw.div`
  relative
  flex
  space-x-3
  rounded-lg
  bg-zinc-600
  p-3
`;

const InputField = tw.textarea`
  flex-1
  resize-none
  bg-transparent
  p-2
  text-secondary
  focus:outline-none
`;

const SendButton = tw(Button)`
  h-10
  !flex-none
  -mt-1
`;

const MessageField = tw.div<{ $isErrorMessage: boolean }>`
  group
  flex
  items-center
  justify-between
  px-2
  py-1
  ${p => p.$isErrorMessage && 'text-white/30 italic'} `;

const Timestamp = tw.span`
  text-nowrap
  text-xs
  text-white
  opacity-0
  group-hover:opacity-20
`;
