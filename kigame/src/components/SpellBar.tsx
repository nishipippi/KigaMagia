import React, { useState, useEffect } from 'react';
import { Spell as SpellType } from '../data/spells';
import { Progress, Switch, Tooltip, Text, Group, Box } from '@mantine/core'; // Mantineコンポーネントをインポート

interface SpellBarProps {
  acquiredSpells: string[];
  allSpells: SpellType[];
  spellCooldowns: Record<string, number>;
  activeSpells: string[];
  onToggleSpell: (spellId: string) => void;
}

const SpellBar: React.FC<SpellBarProps> = ({
  acquiredSpells,
  allSpells,
  spellCooldowns,
  activeSpells,
  onToggleSpell,
}) => {
  const [, setNow] = useState(Date.now()); // 再レンダリングをトリガーするためのstate

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now()); // 100msごとにstateを更新して再レンダリング
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const now = Date.now(); // nowの取得はuseEffectの外で行う

  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '10px',
        borderRadius: '5px',
        color: 'white',
        zIndex: 100,
      }}
    >
      <Text size="lg" fw={700} mb="md">習得魔法</Text>
      <Box>
        {acquiredSpells.map((spellId) => {
          const spell = allSpells.find((s) => s.id === spellId);
          if (!spell) return null;

          const lastCastTime = spellCooldowns[spell.id] || 0;
          const cooldownRemaining = Math.max(0, (spell.cooldown * 1000 - (now - lastCastTime)) / 1000);
          const cooldownProgress = spell.cooldown > 0 ? ((spell.cooldown * 1000 - cooldownRemaining * 1000) / (spell.cooldown * 1000)) * 100 : 100;
          const isActive = activeSpells.includes(spell.id);
          const manaPerSecond = spell.cooldown > 0 ? spell.manaCost / spell.cooldown : 0;

          return (
            <Box
              key={spell.id}
              style={{
                marginBottom: '15px',
                opacity: isActive ? 1 : 0.6, // 非アクティブな魔法は半透明に
                border: isActive ? '1px solid white' : '1px solid gray',
                padding: '8px',
                borderRadius: '5px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <Group justify="space-between" align="center" mb={5}>
                <Group gap="sm">
                  <Tooltip label={spell.description} withArrow>
                    <div
                      className={`spell-icon ${spell.projectileSprite}`} // 仮のアイコン表示
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: 'darkgray', // 仮の背景色
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: 'white',
                        border: '1px solid #fff',
                      }}
                    >
                      {spell.name[0]} {/* 魔法名の頭文字をアイコン代わりに表示 */}
                    </div>
                  </Tooltip>
                  <div>
                    <Text size="sm" fw={700} c="white">{spell.name}</Text>
                    <Text size="xs" c="dimmed">MPS: {manaPerSecond.toFixed(2)}</Text>
                  </div>
                </Group>
                <Switch
                  checked={isActive}
                  onChange={() => onToggleSpell(spell.id)}
                  size="md"
                  color="teal"
                  label={isActive ? 'ON' : 'OFF'}
                  styles={{ label: { color: 'white' } }}
                />
              </Group>
              <Text size="xs" c="white" style={{ textAlign: 'right', marginBottom: '2px' }}>
                {cooldownRemaining > 0 ? `${cooldownRemaining.toFixed(1)}s` : 'Ready'}
              </Text>
              <Progress
                value={cooldownProgress}
                size="lg"
                radius="xl"
                color={cooldownRemaining > 0 ? 'yellow' : 'lime'}
              />
            </Box>
          );
        })}
      </Box>
    </div>
  );
};

export default SpellBar;
