import React from 'react';

interface LevelUpScreenProps {
  level: number;
  onChoice: (choice: string) => void;
}

const LevelUpScreen: React.FC<LevelUpScreenProps> = ({ level, onChoice }) => {
  const choices = [
    { id: 'powerUp', name: '威力UP', description: '魔法の威力が上昇する' },
    { id: 'rangeUp', name: '範囲UP', description: '魔法の攻撃範囲が広がる' },
    { id: 'newSpell', name: '新魔法', description: '新たな魔法を習得する' },
  ];

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
      boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)',
      width: '80%',
      maxWidth: '700px',
    }}>
      <h2 style={{ fontSize: '3rem', marginBottom: '30px', color: '#00FFFF' }}>レベルアップ！</h2>
      <p style={{ fontSize: '1.5rem', marginBottom: '40px' }}>現在のレベル: {level}</p>
      <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>選択肢を選んでください:</p>

      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        gap: '20px',
        flexWrap: 'wrap',
      }}>
        {choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => onChoice(choice.id)}
            style={{
              flex: '1 1 30%', // 3列表示
              minWidth: '200px',
              backgroundColor: '#333',
              border: '2px solid #00FFFF',
              borderRadius: '10px',
              padding: '20px',
              color: 'white',
              fontSize: '1.2rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, transform 0.1s ease, border-color 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '200px', // カードの高さを固定
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#555'; e.currentTarget.style.borderColor = '#00FFFF'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#333'; e.currentTarget.style.borderColor = '#00FFFF'; }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3 style={{ fontSize: '1.8rem', marginBottom: '10px', color: '#00FFFF' }}>{choice.name}</h3>
            <p style={{ fontSize: '1rem', flexGrow: 1 }}>{choice.description}</p>
            {/* 仮のイラスト表示エリア */}
            <div style={{ width: '80px', height: '80px', backgroundColor: '#666', borderRadius: '5px', marginTop: '15px' }}>
              {/* ここにイラストを配置 */}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelUpScreen;
