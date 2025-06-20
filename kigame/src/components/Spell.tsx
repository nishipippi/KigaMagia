import React from 'react';
import { SpellAttribute, spells } from '../data/spells';

interface SpellProps {
  x: number;
  y: number;
  spellId: string; // 魔法のIDを追加
}

const Spell: React.FC<SpellProps> = ({ x, y, spellId }) => {
  const spell = spells.find(s => s.id === spellId);

  if (!spell) {
    console.warn(`Spell with ID ${spellId} not found.`);
    return null;
  }

  const getAttributeColor = (attribute: SpellAttribute): string => {
    switch (attribute) {
      case 'Physical':
        return 'gray';
      case 'Fire':
        return 'red';
      case 'Ice':
        return 'lightblue';
      case 'Lightning':
        return 'yellow';
      case 'Explosion':
        return 'orange';
      case 'Slashing':
        return 'darkgray';
      default:
        return 'purple'; // 未定義の属性
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: x - 5, // 魔法の中心に合わせる
        top: y - 5,  // 魔法の中心に合わせる
        width: '10px',
        height: '10px',
        backgroundColor: getAttributeColor(spell.attribute), // 属性に応じて色を変更
        borderRadius: '50%',
        zIndex: 5, // プレイヤーより奥に表示
      }}
    ></div>
  );
};

export default Spell;
