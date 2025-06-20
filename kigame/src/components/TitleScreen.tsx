import React from 'react';

interface TitleScreenProps {
  onStartGame: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStartGame }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      zIndex: 200, // ゲーム画面より手前に表示
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '50px' }}>Apocalypse Weaver</h1>
      <button
        onClick={onStartGame}
        style={{
          padding: '20px 40px',
          fontSize: '2.5rem',
          backgroundColor: '#4CAF50', // 目立つ色
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          boxShadow: '0 5px 15px rgba(0, 255, 0, 0.4)',
          transition: 'background-color 0.3s ease, transform 0.1s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        出撃
      </button>
    </div>
  );
};

export default TitleScreen;
