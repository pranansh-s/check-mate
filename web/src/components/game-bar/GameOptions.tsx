import tw from 'tailwind-styled-components';

import surrender from '@/../public/icons/flag.svg';
import draw from '@/../public/icons/handshake.svg';
import Button from '../common/Button';
import { useAppDispatch } from '@/redux/hooks';
import { openModal } from '@/redux/features/modalSlice';

const GameOptions = () => {
  const dispatch = useAppDispatch();

  const handleSurrenderModal = () => {
    dispatch(openModal('surrender'));
  }
  
  return (
    <OptionsContainer>
      <Button size="icon" preIconNode={draw} themeColor="green" />
      <Button size="icon" preIconNode={surrender} onClick={handleSurrenderModal} />
    </OptionsContainer>
  );
};

export default GameOptions;

const OptionsContainer = tw.div`
  flex
  gap-3
`;
