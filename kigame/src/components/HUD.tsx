import React from 'react';

interface HUDProps {
  survivalTime: number;
  level: number;
  currentExp: number;
  expToLevelUp: number;
  playerHp: number;
  playerMaxHp: number; // 仮で追加、後で適切な値に置き換える
  playerMana: number; // 仮で追加、後で適切な値に置き換える
  playerMaxMana: number; // 仮で追加、後で適切な値に置き換える
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
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none', // ゲーム操作を妨げないようにする
      zIndex: 150, // ゲーム要素より手前に表示
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      textShadow: '1px 1px 2px black',
    }}>
      {/* 上部中央: 生存時間 */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '2rem',
        fontWeight: 'bold',
      }}>
        {formatTime(survivalTime)}
      </div>

      {/* 上部左右: レベルと経験値ゲージ */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        display: 'flex',
        alignItems: 'center',
        fontSize: '1.2rem',
      }}>
        Level: {level}
        <div style={{
          width: '150px',
          height: '10px',
          backgroundColor: '#333',
          border: '1px solid #555',
          borderRadius: '5px',
          marginLeft: '10px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${expPercentage}%`,
            height: '100%',
            backgroundColor: '#00BFFF', // 経験値バーの色
            transition: 'width 0.2s ease-out',
          }}></div>
        </div>
        <span style={{ marginLeft: '5px' }}>{currentExp}/{expToLevelUp}</span>
      </div>

      {/* 下部中央: HPバーとマナバー */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '70%',
        maxWidth: '400px',
      }}>
        {/* HPバー */}
        <div style={{
          width: '100%',
          height: '20px',
          backgroundColor: '#333',
          border: '1px solid #555',
          borderRadius: '10px',
          overflow: 'hidden',
          marginBottom: '5px',
        }}>
          <div style={{
            width: `${hpPercentage}%`,
            height: '100%',
            backgroundColor: '#FF4500', // HPバーの色
            transition: 'width 0.2s ease-out',
          }}></div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '1rem' }}>HP: {playerHp}/{playerMaxHp}</div>

        {/* マナバー (仮) */}
        <div style={{
          width: '100%',
          height: '15px',
          backgroundColor: '#333',
          border: '1px solid #555',
          borderRadius: '10px',
          overflow: 'hidden',
          marginTop: '10px',
        }}>
          <div style={{
            width: `${manaPercentage}%`,
            height: '100%',
            backgroundColor: '#1E90FF', // マナバーの色
            transition: 'width 0.2s ease-out',
          }}></div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>Mana: {playerMana}/{playerMaxMana}</div>
      </div>
    </div>
  );
};

export default HUD;
