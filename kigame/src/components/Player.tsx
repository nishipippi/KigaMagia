import React from 'react';

interface PlayerProps {
  x: number;
  y: number;
}

const Player: React.FC<PlayerProps> = ({ x, y }) => {
  // 現時点ではHPとマナは内部的に持つだけ
  const hp = 100;
  const mana = 50;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - 10, // プレイヤーの中心に合わせる
        top: y - 10,  // プレイヤーの中心に合わせる
        width: '20px',
        height: '20px',
        backgroundColor: 'blue',
        borderRadius: '50%',
        zIndex: 10, // 他の要素より手前に表示
      }}
    ></div>
  );
};

export default Player;
