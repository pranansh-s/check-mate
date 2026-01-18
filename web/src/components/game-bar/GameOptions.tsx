import tw from 'tailwind-styled-components';

import surrender from '@/../public/icons/flag.svg';
import draw from '@/../public/icons/handshake.svg';
import Button from '../common/Button';

const GameOptions = () => {
  return (
    <OptionsContainer>
      <Button size="icon" preIconNode={draw} themeColor="green" />
      <Button size="icon" preIconNode={surrender} />
    </OptionsContainer>
  );
};

export default GameOptions;

const OptionsContainer = tw.div`
  flex
  gap-3
`;
