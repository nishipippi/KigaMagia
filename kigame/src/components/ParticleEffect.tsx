"use client";

import React, { JSX, useEffect, useState } from 'react';
import '../styles/effects.css'; // CSSをインポート

interface ParticleEffectProps {
  id: number; // エフェクトのユニークID
  x: number;
  y: number;
  className: string;
  particleCount: number;
  duration: number;
  range: number; // エフェクトの範囲（半径）を追加
  onComplete: (id: number) => void; // 完了時にIDを渡す
}

const ParticleEffect = ({ id, x, y, className, particleCount, duration, range, onComplete }: ParticleEffectProps) => {
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }).map((_, i) => {
      // range 内のランダムな座標を生成
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * range;
      const particleX = Math.cos(angle) * radius;
      const particleY = Math.sin(angle) * radius;

      let moveAnimationName;
      if (className === 'physical-particle') {
        moveAnimationName = 'particle-move-shockwave';
      } else if (className === 'fire-particle') {
        moveAnimationName = 'particle-move-up';
      } else if (className === 'ice-particle') {
        moveAnimationName = 'particle-move-shatter';
      } else if (className === 'slashing-particle') {
        // 切断属性の場合は特殊な動きはCSSで直接制御するため、ここでは汎用的な動きは指定しない
        moveAnimationName = ''; // または 'none'
      } else {
        moveAnimationName = `particle-move-${Math.ceil(Math.random() * 5)}`;
      }

      // CSSカスタムプロパティでランダムな方向を設定
      const randomX = (Math.random() - 0.5) * 2; // -1 to 1
      const randomY = (Math.random() - 0.5) * 2; // -1 to 1

      const style: React.CSSProperties = {
        left: `${particleX}px`,
        top: `${particleY}px`,
        animationDuration: `${duration}ms`,
        animationDelay: `${Math.random() * 50}ms`, // 遅延を少し短くして一斉に広がる感を出す
        animationTimingFunction: 'ease-out',
        animationFillMode: 'forwards',
      };

      // 切断属性の場合は個別のtransformを適用
      if (className === 'slashing-particle') {
        const angle = (i / particleCount) * 180 - 90; // -90度から+90度の範囲
        style.transform = `rotate(${angle}deg)`;
        style.animationDelay = `${i * 10}ms`; // 少しずつ表示をずらす
        style.animationName = `${className}-fade`; // 切断属性はfade-in-outではなくfade
      } else {
        style.animationName = `${className}-fade-in-out, ${moveAnimationName}`;
      }

      return <div key={i} className={`${className} particle`} style={{ ...style, '--random-x': randomX, '--random-y': randomY } as React.CSSProperties} />;
    });
    setParticles(newParticles);

    const timer = setTimeout(() => onComplete(id), duration);
    return () => clearTimeout(timer);
  }, [id, className, particleCount, duration, range, onComplete]);

  return (
    <div className="particle-effect-container" style={{ left: x, top: y }}>
      {particles}
    </div>
  );
};

export default ParticleEffect;
