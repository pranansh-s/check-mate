import tw from 'tailwind-styled-components';

import Timer from './Timer';
import { useAppSelector } from '@/redux/hooks';
import { Profile } from '@check-mate/shared/schemas';
import Image from 'next/image';

import avatar from "@/../public/abstract-user-flat-3.png"

interface IUserBarProps {
	timer?: number;
  profile: Profile | null;
	isUser: boolean;
}

const UserBar = ({ timer, profile, isUser }: IUserBarProps) => {
	const { isTurn, isPlaying } = useAppSelector(state => state.gameState);
  const shouldTick = isPlaying && isTurn == isUser;

  return (
    <UserBarContainer>
      <ProfileContainer>
        <Image src={profile?.photo ?? avatar} width={32} height={32} alt="profile"/>
        <span className='text-lg'>{profile?.displayName}</span>
      </ProfileContainer>
      <Timer left={timer ?? 1800000} ticking={shouldTick} />
    </UserBarContainer>
  );
};

export default UserBar;

const UserBarContainer = tw.div`
  flex
	items-center
  justify-between
`;

const ProfileContainer = tw.div`
cursor-pointer
  flex
  font-serif
  text-secondary
  opacity-80
  hover:opacity-100
  items-center
  gap-4
`;