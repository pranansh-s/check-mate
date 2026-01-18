import tw from "tailwind-styled-components";
import Board from "./Board";
import UserBar from "./user-bar";
import { useAppSelector } from "@/redux/hooks";

const GameUI = () => {
	const { playerSide, players } = useAppSelector(state => state.gameState);

	return (
		<GameContainer>
			<UserBar user={playerSide == 'white' ? players.blackSidePlayer : players.whiteSidePlayer} isUser={false} />
			<Board />
			<UserBar user={playerSide == 'white' ? players.whiteSidePlayer : players.blackSidePlayer} isUser={true} />
		</GameContainer>
	)
}

export default GameUI;

const GameContainer = tw.div`
  flex
  h-full
  flex-col
  justify-center
  space-y-3
`;
