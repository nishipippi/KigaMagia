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
  // その他のプロパティは必要に応じて追加
}

export const spells: Spell[] = [
  {
    id: 'magic_fist',
    name: '魔力の拳',
    attribute: 'Physical',
    description: '前方に低威力のエネルギー弾を1発発射。弾は敵を1体貫通する。',
    baseDamage: 15, // spell.mdの「威力+15%」から逆算して仮に設定
    cooldown: 1.0, // 仮設定
    manaCost: 10, // 仮設定
    isSelfDamage: false,
  },
  {
    id: 'fireball',
    name: 'ファイアボール',
    attribute: 'Fire',
    description: '最も近い敵に向かって火球を発射。着弾時に小爆発し、地面に短時間炎を残す。',
    baseDamage: 20, // spell.mdの「ダメージ+20%」から逆算して仮に設定
    cooldown: 1.5, // 仮設定
    manaCost: 15, // 仮設定
    isSelfDamage: false, // 地形ダメージは自傷としない
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
  },
  {
    id: 'chain_lightning',
    name: 'チェインライトニング',
    attribute: 'Lightning',
    description: '最も近い敵に稲妻を放ち、近くの敵に3回まで連鎖する。連鎖するごとに威力は減衰。',
    baseDamage: 18, // spell.mdの「威力減衰率-5%」から逆算して仮に設定
    cooldown: 1.8, // 仮設定
    manaCost: 20, // 仮設定
    isSelfDamage: false,
  },
];
