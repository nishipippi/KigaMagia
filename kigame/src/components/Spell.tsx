import React from 'react';

interface SpellProps {
  x: number;
  y: number;
}

const Spell: React.FC<SpellProps> = ({ x, y }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 5, // 魔法の中心に合わせる
        top: y - 5,  // 魔法の中心に合わせる
        width: '10px',
        height: '10px',
        backgroundColor: 'purple',
        borderRadius: '50%',
        zIndex: 5, // プレイヤーより奥に表示
      }}
    ></div>
  );
};

export default Spell;
