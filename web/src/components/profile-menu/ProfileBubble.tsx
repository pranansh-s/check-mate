'use client';

import { useRouter } from 'next/navigation';

import tw from 'tailwind-styled-components';

import { useAppSelector } from '@/redux/hooks';

const ProfileBubble = () => {
  const router = useRouter();
  const user = useAppSelector(state => state.user);
  if (!user) return;

  const initial = user.displayName.charAt(0);
  return <BubbleIcon onClick={() => router.push('/profile')}>{initial}</BubbleIcon>;
};

export default ProfileBubble;

const BubbleIcon = tw.div`
  group
  absolute
  right-5
  top-5
  z-50
  flex
  h-12
  w-12
  cursor-pointer
  items-center
  justify-center
  rounded-full
  bg-secondary
  font-serif
  text-xl
  font-extrabold
  uppercase
`;
