import React from 'react';
import { spells } from '../data/spells';

interface SpellProps {
  x: number;
  y: number;
  spellId: string; // 魔法のIDを追加
  status: 'flying' | 'impact' | 'fading'; // 魔法の状態
}

const Spell: React.FC<SpellProps> = ({ x, y, spellId, status }) => {
  const spell = spells.find(s => s.id === spellId);

  if (!spell) {
    console.warn(`Spell with ID ${spellId} not found.`);
    return null;
  }

  let className = '';
  if (status === 'flying') {
    className = `spell-effect ${spell.projectileSprite}`;
  } else if (status === 'impact') {
    className = `spell-effect ${spell.impactEffect}`;
  } else {
    return null; // fading状態の場合は表示しない
  }

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: 5, // プレイヤーより奥に表示
      }}
    ></div>
  );
};

export default Spell;
