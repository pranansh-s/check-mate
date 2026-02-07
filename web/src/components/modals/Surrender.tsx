import { memo } from "react";
import ModalContainer from "./Modal";
import tw from "tailwind-styled-components";
import Button from "../common/Button";
import { closeModal } from "@/redux/features/modalSlice";
import { useAppDispatch } from "@/redux/hooks";
import SocketService from "@/services/socket.service";

const Surrender = memo(() => {
	const dispatch = useAppDispatch();

	const handleYes = () => {
		SocketService.surrender();
		dispatch(closeModal());
	}

	const handleNo = () => {
		dispatch(closeModal());
	}

	return (
		<StyledModalContainer>
			<AreWeSure>are you sure, surrender?</AreWeSure>
			<ButtonsContainer>
				<Button themeColor='green' onClick={handleYes}>Yes</Button>
				<Button themeColor='red' onClick={handleNo}>No</Button>
			</ButtonsContainer>
		</StyledModalContainer>
	)
});

Surrender.displayName = "Surrender";
export default Surrender;

const StyledModalContainer = tw(ModalContainer)`
  max-w-[368px]
  flex
  items-center
  gap-10
  bg-zinc-900
  py-12
	border-none
`;

const AreWeSure = tw.span`
	text-2xl
	text-secondary
	opacity-75
`;

const ButtonsContainer = tw.div`
	flex
	flex-row
	gap-8
`;