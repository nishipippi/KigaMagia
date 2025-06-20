import React from 'react';

interface ResultScreenProps {
  survivalTime: number;
  level: number;
  onRestart: () => void;
  onGoToTitle: () => void; // タイトルへ戻るためのプロパティを追加
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const ResultScreen: React.FC<ResultScreenProps> = ({ survivalTime, level, onRestart, onGoToTitle }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      padding: '40px',
      borderRadius: '15px',
      color: 'white',
      textAlign: 'center',
      zIndex: 200, // ゲーム画面より手前に表示
      boxShadow: '0 0 30px rgba(255, 0, 0, 0.5)',
      width: '80%',
      maxWidth: '600px',
    }}>
      <h2 style={{ fontSize: '3.5rem', marginBottom: '20px', color: '#FF4500' }}>GAME OVER</h2>
      <p style={{ fontSize: '2rem', marginBottom: '10px' }}>生存時間: <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#FFA07A' }}>{formatTime(survivalTime)}</span></p>
      <p style={{ fontSize: '1.5rem', marginBottom: '40px' }}>到達レベル: <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ADFF2F' }}>{level}</span></p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
        <button
          onClick={onRestart}
          style={{
            padding: '15px 30px',
            fontSize: '1.8rem',
            backgroundColor: '#FF4500', // 再挑戦ボタンの色
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 5px 10px rgba(255, 0, 0, 0.4)',
            transition: 'background-color 0.3s ease, transform 0.1s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E03C00'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF4500'}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          再び挑む
        </button>
        <button
          onClick={onGoToTitle}
          style={{
            padding: '15px 30px',
            fontSize: '1.8rem',
            backgroundColor: '#555', // タイトルへボタンの色
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 5px 10px rgba(0, 0, 0, 0.4)',
            transition: 'background-color 0.3s ease, transform 0.1s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#777'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#555'}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          タイトルへ
        </button>
      </div>
      {/* TODO: 「絶望を力に」（メタプログレッション画面へ）ボタンを追加 */}
    </div>
  );
};

export default ResultScreen;
