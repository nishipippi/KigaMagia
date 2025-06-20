import React, { useEffect, useRef } from 'react';
import { GroundEffect } from '../data/spells';

interface GroundFlameEffectProps {
  id: number;
  x: number;
  y: number;
  groundEffect: GroundEffect;
  onComplete: (id: number) => void;
}

const GroundFlameEffect: React.FC<GroundFlameEffectProps> = ({
  id,
  x,
  y,
  groundEffect,
  onComplete,
}) => {
  const effectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (effectRef.current) {
      effectRef.current.style.left = `${x - groundEffect.range / 2}px`;
      effectRef.current.style.top = `${y - groundEffect.range / 2}px`;
      effectRef.current.style.width = `${groundEffect.range}px`;
      effectRef.current.style.height = `${groundEffect.range}px`;
    }
    // GroundFlameEffectは純粋な表示コンポーネントに戻すため、
    // 自身の寿命管理やダメージ処理は行わない。
    // 寿命管理はpage.tsxで行い、onCompleteを呼び出す。
    // ダメージ処理もpage.tsxで行う。
    return () => {};
  }, [x, y, groundEffect, onComplete]);

  return (
    <div
      ref={effectRef}
      className={`ground-effect ${groundEffect.sprite}`}
      style={{
        position: 'absolute',
      }}
    >
      {/* エフェクトの視覚的な要素 */}
    </div>
  );
};

export default GroundFlameEffect;
