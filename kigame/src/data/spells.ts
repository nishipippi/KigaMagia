export type SpellAttribute = 'Physical' | 'Fire' | 'Ice' | 'Lightning' | 'Explosion' | 'Slashing';

export interface Spell {
  id: string;
  name: string;
  attribute: SpellAttribute;
  description: string;
  baseDamage: number;
  cooldown: number; // 秒
  manaCost: number;
  isSelfDamage: boolean; // 自傷リスクがあるか
  lifetime: number; // 魔法の持続時間 (秒)
  speed: number; // 弾速 (ピクセル/秒)
  damageRangeOnHit: number; // 着弾時のダメージ範囲 (半径ピクセル)
  projectileSprite: string; // 飛翔中のアニメーション/画像 (CSSクラス名)
  impactEffect: string;   // 着弾時のエフェクト名 (CSSクラス名)
}

export const spells: Spell[] = [
  {
    id: 'magic_fist',
    name: '魔力の拳',
    attribute: 'Physical',
    description: '前方に低威力のエネルギー弾を1発発射。',
    baseDamage: 15, // spell.mdの「威力+15%」から逆算して仮に設定
    cooldown: 1.0, // 仮設定
    manaCost: 10, // 仮設定
    isSelfDamage: false,
    lifetime: 2, // 仮設定
    speed: 30, // 仮設定
    damageRangeOnHit: 0, // 仮設定
    projectileSprite: 'magic-fist-projectile', // 仮設定
    impactEffect: 'magic-fist-impact', // 仮設定
  },
  {
    id: 'fireball',
    name: 'ファイアボール',
    attribute: 'Fire',
    description: '火球を発射。着弾時に小爆発し、地面に短時間炎を残す。',
    baseDamage: 20, // spell.mdの「ダメージ+20%」から逆算して仮に設定
    cooldown: 1.5, // 仮設定
    manaCost: 15, // 仮設定
    isSelfDamage: false, // 地形ダメージは自傷としない
    lifetime: 3, // 仮設定
    speed: 20, // 仮設定
    damageRangeOnHit: 50, // 仮設定
    projectileSprite: 'fireball-projectile', // 仮設定
    impactEffect: 'fireball-impact', // 仮設定
  },
  {
    id: 'icicle_lance',
    name: 'アイシクルランス',
    attribute: 'Ice',
    description: '高速で貫通する氷の槍を発射。命中した敵に鈍足効果を与える。',
    baseDamage: 25, // spell.mdの「ダメージ+15%」から逆算して仮に設定
    cooldown: 1.2, // 仮設定
    manaCost: 12, // 仮設定
    isSelfDamage: false,
    lifetime: 4, // 仮設定
    speed: 40, // 仮設定
    damageRangeOnHit: 0, // 仮設定
    projectileSprite: 'icicle-lance-projectile', // 仮設定
    impactEffect: 'icicle-lance-impact', // 仮設定
  },
  {
    id: 'chain_lightning',
    name: 'チェインライトニング',
    attribute: 'Lightning',
    description: 'ゆっくりとした稲妻を放ち、近くの敵に3回まで連鎖する。連鎖するごとに威力は減衰。',
    baseDamage: 18, // spell.mdの「威力減衰率-5%」から逆算して仮に設定
    cooldown: 1.8, // 仮設定
    manaCost: 20, // 仮設定
    isSelfDamage: false,
    lifetime: 1, // 仮設定 (瞬時)
    speed: 10, // 仮設定 (瞬時)
    damageRangeOnHit: 0, // 仮設定 (連鎖なので直接的な着弾範囲はなし)
    projectileSprite: 'chain-lightning-projectile', // 仮設定
    impactEffect: 'chain-lightning-impact', // 仮設定
  },
];
