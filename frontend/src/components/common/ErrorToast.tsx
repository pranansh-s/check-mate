'use client';

import { toast } from 'react-toastify';
import tw from 'tailwind-styled-components';

import { toastConfig } from '@/constants/config';

interface IErrorToastProps {
  title: string;
  content: string;
}

export const showErrorToast = (title: string, content: string) => {
  toast.error(<ErrorToast title={title} content={content} />, toastConfig);
};

const ErrorToast: React.FC<IErrorToastProps> = ({ title, content }) => {
  return (
    <NotificationContainer>
      <Title>{title}</Title>
      <ContentWrapper>
        <ContentText>{content}</ContentText>
      </ContentWrapper>
    </NotificationContainer>
  );
};

export default ErrorToast;

const NotificationContainer = tw.div`
  flex
  w-full
  flex-col
  rounded-md
  bg-red-500
  p-3
`;

const Title = tw.h3`
  text-sm
  font-semibold
  text-secondary
  text-white
`;

const ContentWrapper = tw.div`
  flex
  items-center
  justify-between
  text-zinc-300
`;

const ContentText = tw.p`
  text-sm
`;
