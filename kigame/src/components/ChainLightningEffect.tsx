import React, { useEffect, useState } from 'react';

interface ChainLightningEffectProps {
  id: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  duration: number; // アニメーションの表示時間 (ms)
  onComplete: (id: number) => void; // アニメーション完了時のコールバック
}

const ChainLightningEffect: React.FC<ChainLightningEffectProps> = ({
  id,
  fromX,
  fromY,
  toX,
  toY,
  duration,
  onComplete,
}) => {
  const [opacity, setOpacity] = useState(1);
  const [flash, setFlash] = useState(true);

  useEffect(() => {
    // フェードアウトアニメーション
    const fadeOutTimer = setTimeout(() => {
      setOpacity(0);
    }, duration * 0.8); // 80%の時間でフェードアウト開始

    // アニメーション完了時にコンポーネントを削除するためのコールバック
    const completeTimer = setTimeout(() => {
      onComplete(id);
    }, duration);

    // 点滅アニメーション
    const flashInterval = setInterval(() => {
      setFlash(prev => !prev);
    }, 50); // 50msごとに点滅

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
      clearInterval(flashInterval);
    };
  }, [duration, id, onComplete]);

  // 稲妻のパスを生成する関数
  const generateLightningPath = (x1: number, y1: number, x2: number, y2: number) => {
    const points = [{ x: x1, y: y1 }];
    const numSegments = 5; // 稲妻のギザギザの数
    const randomness = 10; // ギザギザの大きさ

    for (let i = 1; i < numSegments; i++) {
      const segmentX = x1 + (x2 - x1) * (i / numSegments);
      const segmentY = y1 + (y2 - y1) * (i / numSegments);

      const offsetX = (Math.random() - 0.5) * randomness;
      const offsetY = (Math.random() - 0.5) * randomness;

      points.push({ x: segmentX + offsetX, y: segmentY + offsetY });
    }
    points.push({ x: x2, y: y2 });

    return points.map((p, index) => `${index === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  };

  const pathD = generateLightningPath(fromX, fromY, toX, toY);

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // クリックイベントを透過させる
        zIndex: 10, // 魔法より手前に表示
        opacity: opacity,
        transition: 'opacity 0.2s ease-out',
      }}
    >
      <path
        d={pathD}
        stroke={flash ? 'yellow' : 'gold'} // 点滅色
        strokeWidth="2"
        fill="none"
        filter="url(#glow)" // グロー効果
      />
      <defs>
        <filter id="glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};

export default ChainLightningEffect;
