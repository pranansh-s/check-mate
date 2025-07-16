import { memo } from 'react';

const Lighting = memo(() => {
  return (
    <group>
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight position={[-5, 5, 5]} intensity={0.5} color="#ffccaa" />
      <directionalLight position={[0, 5, -5]} intensity={0.8} color="#aaccff" />
      <ambientLight intensity={0.2} />
    </group>
  );
});

export default Lighting;
