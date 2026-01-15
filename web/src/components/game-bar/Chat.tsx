'use client';

import { memo, useEffect, useRef, useState } from 'react';

import SocketService from '@/services/socket.service';
import { MessageSchema } from '@check-mate/shared/schemas';
import { ChatMessage } from '@check-mate/shared/types';
import tw from 'tailwind-styled-components';

import { handleErrors } from '@/lib/utils/error';
import { addMessage } from '@/redux/features/chatSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import { strings } from '@/constants/strings';

import sendIcon from '@/../public/icons/send.svg';
import Button from '../common/Button';
import { ZodError } from 'zod/v4';
import UserService from '@/services/user.service';

const toTime = (val: number): string => {
  const date = new Date(val);
  const timeString = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return timeString;
};

const Chat = memo(() => {
  const endMessageRef = useRef<HTMLDivElement>(null);
  const chat = useAppSelector(state => state.chatState);
  const userId = UserService.getUserId();
  const [message, setMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleSendMessage = () => {
    setIsSending(true);
    try {
      const content = MessageSchema.parse(message);
      setMessage('');
      SocketService.sendMessage(content);
    } catch (err) {
      if (err instanceof ZodError) {
        dispatch(addMessage(`~ ${err.issues[0].message} ~`));
      } else {
        handleErrors(err, 'Could not send message');
      }
    } finally {
      setIsSending(false);
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

  return (
    <ChatContainer>
      <MessageHistory>
        {chat.map((chatMessage: ChatMessage | string, idx: number) => {
          const isError = typeof chatMessage === 'string';
          return (
            <MessageField $isErrorMessage={isError} key={idx}>
              {isError ? chatMessage : <MessageContent $isUserSent={chatMessage.senderId == userId}>{chatMessage.content}</MessageContent>}
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

const MessageContent = tw.span<{ $isUserSent: boolean }>`
  ${p => (p.$isUserSent ? 'text-green-300' : 'text-white')}
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
