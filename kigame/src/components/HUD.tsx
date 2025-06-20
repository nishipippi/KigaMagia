import React from 'react';
import { Text, Progress, Group, Box } from '@mantine/core';

interface HUDProps {
  survivalTime: number;
  level: number;
  currentExp: number;
  expToLevelUp: number;
  playerHp: number;
  playerMaxHp: number;
  playerMana: number;
  playerMaxMana: number;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const HUD: React.FC<HUDProps> = ({ survivalTime, level, currentExp, expToLevelUp, playerHp, playerMaxHp, playerMana, playerMaxMana }) => {
  const hpPercentage = (playerHp / playerMaxHp) * 100;
  const manaPercentage = (playerMana / playerMaxMana) * 100;
  const expPercentage = (currentExp / expToLevelUp) * 100;

  return (
    <Box
      pos="absolute"
      top={0}
      left={0}
      w="100%"
      h="100%"
      style={{
        pointerEvents: 'none',
        zIndex: 150,
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        textShadow: '1px 1px 2px black',
      }}
    >
      {/* 上部中央: 生存時間 */}
      <Text
        pos="absolute"
        top="10px"
        left="50%"
        style={{ transform: 'translateX(-50%)' }}
        size="2rem"
        fw="bold"
      >
        {formatTime(survivalTime)}
      </Text>

      {/* 上部左右: レベルと経験値ゲージ */}
      <Group
        pos="absolute"
        top="10px"
        left="10px"
        align="center"
        gap="xs"
      >
        <Text size="lg">Level: {level}</Text>
        <Progress
          value={expPercentage}
          size="lg"
          radius="xl"
          w={150}
          color="blue"
          animated
        />
        <Text size="sm">{currentExp}/{expToLevelUp}</Text>
      </Group>

      {/* 下部中央: HPバーとマナバー */}
      <Box
        pos="absolute"
        bottom="10px"
        left="50%"
        style={{ transform: 'translateX(-50%)' }}
        w="70%"
        maw={400}
      >
        {/* HPバー */}
        <Progress
          value={hpPercentage}
          size="xl"
          radius="xl"
          color="red"
          animated
          mb="xs"
        />
        <Text ta="center" size="sm">HP: {playerHp}/{playerMaxHp}</Text>

        {/* マナバー */}
        <Progress
          value={manaPercentage}
          size="lg"
          radius="xl"
          color="blue"
          animated
          mt="md"
        />
        <Text ta="center" size="xs">Mana: {playerMana}/{playerMaxMana}</Text>
      </Box>
    </Box>
  );
};

export default HUD;
