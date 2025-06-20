import { Modal, Card, Text, Button, SimpleGrid, Title, Group, useMantineTheme } from '@mantine/core';
import React from 'react';

export interface Choice {
  id: string;
  name: string;
  description: string;
  type: 'spell' | 'upgrade';
}

interface LevelUpScreenProps {
  level: number;
  choices: Choice[]; // 選択肢をpropsで受け取る
  onChoice: (choiceId: string) => void;
}

const LevelUpScreen: React.FC<LevelUpScreenProps> = ({ level, choices, onChoice }) => {
  const theme = useMantineTheme();

  return (
    <Modal
      opened={true}
      onClose={() => {}} // モーダルを閉じさせない（選択必須のため）
      title={<Title order={2} c="#00FFFF">レベルアップ！</Title>}
      centered
      size="xl"
      overlayProps={{ backgroundOpacity: 0.9, blur: 3 }}
      styles={{
        content: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          borderRadius: '15px',
          boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)',
          color: 'white',
          textAlign: 'center',
        },
        header: {
          justifyContent: 'center',
          marginBottom: '20px',
        },
        body: {
          paddingTop: 0,
        }
      }}
    >
      <Text size="xl" mb="md" c="white">現在のレベル: {level}</Text>
      <Text size="lg" mb="xl" c="white">選択肢を選んでください:</Text>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {choices.map((choice) => (
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            key={choice.id}
            style={{
              cursor: 'pointer',
              height: '100%',
              backgroundColor: theme.colors.dark[7],
              borderColor: theme.colors.cyan[6],
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            styles={{
              root: {
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: theme.shadows.xl,
                },
              },
            }}
          >
            <Group justify="center" mb="md">
              <Title order={3} c={choice.type === 'spell' ? 'blue' : 'green'}>{choice.name}</Title>
            </Group>
            <Text size="sm" c="dimmed" style={{ flexGrow: 1 }}>{choice.description}</Text>
            {/* 仮のイラスト表示エリア */}
            <div style={{ width: '80px', height: '80px', backgroundColor: '#666', borderRadius: '5px', margin: '15px auto 0' }}>
              {/* ここにイラストを配置 */}
            </div>
            <Button
              variant="gradient"
              gradient={{ from: 'teal', to: 'lime', deg: 105 }}
              onClick={() => onChoice(choice.id)}
              mt="md"
              fullWidth
            >
              これにする
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </Modal>
  );
};

export default LevelUpScreen;
