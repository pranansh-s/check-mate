import tw from 'tailwind-styled-components';

const ModalContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <ModalOverlay>
    <ModalBox className={className}>{children}</ModalBox>
  </ModalOverlay>
);

const ModalOverlay = tw.div`
  fixed
  left-0
  top-0
  z-[100]
  flex
  h-screen
  w-screen
  items-center
  justify-center
  bg-black/60
  backdrop-blur-sm
`;

const ModalBox = tw.div`
  flex
  w-[90vw]
  max-w-[300px]
  flex-col
  gap-5
  rounded-xl
  border
  border-tertiary
  bg-primary
  p-10
  font-serif
`;

export default ModalContainer;
