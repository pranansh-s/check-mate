import tw from 'tailwind-styled-components';

import ProfileTag from './ProfileTag';
import Timer from './Timer';
import { useAppSelector } from '@/redux/hooks';
import { PlayerState } from '@check-mate/shared/types';

interface IUserBarProps {
	user: PlayerState | null,
	isUser: boolean
}

const UserBar = ({ user, isUser }: IUserBarProps) => {
	const { isTurn, isPlaying } = useAppSelector(state => state.gameState);

  return (
    <UserBarContainer>
      <ProfileTag />
      <Timer left={user?.remainingTime ?? 1800000} ticking={isPlaying && isTurn == isUser} />
    </UserBarContainer>
  );
};

export default UserBar;

const UserBarContainer = tw.div`
  flex
	items-center
  justify-between
`;
