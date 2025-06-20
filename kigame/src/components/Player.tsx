import React from 'react';

interface PlayerProps {
  x: number;
  y: number;
  direction: { dx: number; dy: number }; // 追加
}

const Player: React.FC<PlayerProps> = ({ x, y, direction }) => {
  // 現時点ではHPとマナは内部的に持つだけ
  const hp = 100;
  const mana = 50;

  // directionベクトルから角度（degree）を計算
  // Math.atan2(y, x) でラジアンが求まる。+90は画像の初期向きを調整するため
  const angle = Math.atan2(direction.dy, direction.dx) * (180 / Math.PI) + 90;

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
        zIndex: 160, // HUD(150)より大きい値を設定
      }}
    >
      {/* 向きを示すインジケーター */}
      <div
        style={{
          width: '0',
          height: '0',
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderBottom: '10px solid cyan', // 三角形の矢印
          position: 'absolute',
          top: '50%',
          left: '50%',
          transformOrigin: 'center 2.5px', // 三角形の底辺中心を回転軸に
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        }}
      ></div>
    </div>
  );
};

export default Player;
