import { Title, Button, Stack, Transition } from '@mantine/core';
import { useState, useEffect } from 'react';

interface TitleScreenProps {
  onStartGame: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStartGame }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Transition mounted={mounted} transition="fade" duration={1000} timingFunction="ease">
      {(styles) => (
        <Stack
          style={{
            ...styles,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            zIndex: 200,
          }}
          align="center"
          justify="center"
        >
          <Title order={1} size="h1" mb="50px">Apocalypse Weaver</Title>
          <Button
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            size="xl"
            onClick={onStartGame}
          >
            出撃
          </Button>
        </Stack>
      )}
    </Transition>
  );
};

export default TitleScreen;
