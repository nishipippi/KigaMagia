import React from 'react';

interface ExperienceOrbProps {
  x: number;
  y: number;
}

const ExperienceOrb: React.FC<ExperienceOrbProps> = ({ x, y }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 7, // オーブの中心に合わせる
        top: y - 7,  // オーブの中心に合わせる
        width: '14px',
        height: '14px',
        backgroundColor: 'lime',
        borderRadius: '50%',
        zIndex: 6, // 魔法と敵の間
      }}
    ></div>
  );
};

export default ExperienceOrb;
