export type ParticleAttribute = 'Physical' | 'Fire' | 'Ice' | 'Lightning' | 'Explosion' | 'Slashing';

export interface ParticleEffectDefinition {
  attribute: ParticleAttribute;
  className: string; // CSSクラス名
  duration: number; // エフェクトの持続時間 (ms)
  particleCount: number; // 生成するパーティクルの数
}

export const particleEffects: ParticleEffectDefinition[] = [
  {
    attribute: 'Lightning',
    className: 'lightning-particle',
    duration: 500,
    particleCount: 20, // 20個のパーティクルを生成
  },
  // 必要に応じて他の属性のエフェクトを追加
  {
    attribute: 'Fire',
    className: 'fire-particle',
    duration: 400,
    particleCount: 15,
  },
  {
    attribute: 'Ice',
    className: 'ice-particle',
    duration: 600,
    particleCount: 25,
  },
  {
    attribute: 'Physical',
    className: 'physical-particle',
    duration: 300,
    particleCount: 10,
  },
  {
    attribute: 'Explosion',
    className: 'explosion-particle',
    duration: 500,
    particleCount: 30,
  },
  {
    attribute: 'Slashing',
    className: 'slashing-particle',
    duration: 350,
    particleCount: 12,
  },
];
