import React from 'react';

interface EnemyProps {
  x: number;
  y: number;
}

const Enemy: React.FC<EnemyProps> = ({ x, y }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 15, // 敵の中心に合わせる
        top: y - 15,  // 敵の中心に合わせる
        width: '30px',
        height: '30px',
        backgroundColor: 'red',
        zIndex: 8, // プレイヤーと魔法の間
      }}
    ></div>
  );
};

export default Enemy;
