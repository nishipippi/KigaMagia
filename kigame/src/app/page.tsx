"use client";

import { useState, useEffect, useRef } from 'react';
import Player from '../components/Player';
import Spell from '../components/Spell';
import Enemy from '../components/Enemy';
import ExperienceOrb from '../components/ExperienceOrb';

interface SpellData {
  id: number;
  x: number;
  y: number;
  dx: number; // 魔法のX方向移動量
  dy: number; // 魔法のY方向移動量
}

interface EnemyData {
  id: number;
  x: number;
  y: number;
}

interface ExperienceOrbData {
  id: number;
  x: number;
  y: number;
}

type GamePhase = 'playing' | 'levelUp' | 'gameOver';

export default function Home() {
  const [playerX, setPlayerX] = useState(400); // 初期位置X
  const [playerY, setPlayerY] = useState(300); // 初期位置Y
  const playerXRef = useRef(playerX);
  const playerYRef = useRef(playerY);
  const [playerDirection, setPlayerDirection] = useState({ dx: 0, dy: -1 }); // プレイヤーの移動方向 (初期値は上方向)
  const playerDirectionRef = useRef(playerDirection); // 追加: 向きを保持するref
  const positionHistoryRef = useRef<{ x: number; y: number; timestamp: number }[]>([]); // 移動履歴

  const [spells, setSpells] = useState<SpellData[]>([]);
  const spellIdCounterRef = useRef(0); // useRefに変更
  const [enemies, setEnemies] = useState<EnemyData[]>([]);
  const enemyIdCounterRef = useRef(0); // useRefに変更
  const [experienceOrbs, setExperienceOrbs] = useState<ExperienceOrbData[]>([]);
  const experienceOrbIdCounterRef = useRef(0); // useRefに変更
  const [currentExp, setCurrentExp] = useState(0);
  const [level, setLevel] = useState(1);
  const [playerHp, setPlayerHp] = useState(100); // プレイヤーのHP
  const [gamePhase, setGamePhase] = useState<GamePhase>('playing');

  const EXP_TO_LEVEL_UP = 10;
  const GAME_CANVAS_HEIGHT = 600; // ゲームキャンバスの高さ

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const canvas = document.getElementById('game-canvas');
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const newX = event.clientX - rect.left;
        const newY = event.clientY - rect.top;

        setPlayerX(newX);
        setPlayerY(newY);
        playerXRef.current = newX; // refを更新
        playerYRef.current = newY; // refを更新

        // 移動履歴を更新
        const now = Date.now();
        positionHistoryRef.current = positionHistoryRef.current.filter(p => now - p.timestamp < 1000); // 古い履歴を削除
        positionHistoryRef.current.push({ x: newX, y: newY, timestamp: now });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // playerDirection の state が更新されたら、ref の値も更新する
  useEffect(() => {
    playerDirectionRef.current = playerDirection;
  }, [playerDirection]);

  // 魔法の自動発射ロジック
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const spellInterval = setInterval(() => {
      const spellSpeed = 10; // 魔法の速度
      const direction = playerDirectionRef.current; // refから最新の向きを取得

      setSpells((prevSpells) => [
        ...prevSpells,
        {
          id: spellIdCounterRef.current++,
          x: playerXRef.current,
          y: playerYRef.current,
          dx: direction.dx * spellSpeed,
          dy: direction.dy * spellSpeed,
        },
      ]);
    }, 500);

    return () => clearInterval(spellInterval);
  }, [gamePhase]); // 依存配列から playerDirection を削除

  // 敵の自動出現ロジック
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const enemyInterval = setInterval(() => {
      setEnemies((prevEnemies) => [
        ...prevEnemies,
        { id: enemyIdCounterRef.current, x: Math.random() * 800, y: 0 },
      ]);
      enemyIdCounterRef.current += 1; // refを更新
    }, 2000);

    return () => clearInterval(enemyInterval);
  }, [gamePhase]); // 依存配列からenemyIdCounterを削除

  // ゲームループ（移動、衝突判定、状態更新）
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const gameLoop = setInterval(() => {
      // 状態更新をバッチ処理するための準備
      let nextSpells = spells;
      let nextEnemies = enemies;
      let nextExperienceOrbs = experienceOrbs;
      let nextPlayerHp = playerHp;
      let nextCurrentExp = currentExp;
      let gamePhaseChanged = false;

      // 1. 位置更新
      nextSpells = nextSpells
        .map((spell) => ({ ...spell, x: spell.x + spell.dx, y: spell.y + spell.dy }))
        .filter((spell) => spell.y > 0 && spell.y < GAME_CANVAS_HEIGHT && spell.x > 0 && spell.x < 800);

      const enemySpeed = 2;
      nextEnemies = nextEnemies.map((enemy) => {
        const dx = playerXRef.current - enemy.x;
        const dy = playerYRef.current - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const moveX = (dx / distance) * enemySpeed;
        const moveY = (dy / distance) * enemySpeed;
        return { ...enemy, x: enemy.x + moveX, y: enemy.y + moveY };
      });

      const orbSpeed = 3;
      nextExperienceOrbs = nextExperienceOrbs.map((orb) => {
        const dx = playerXRef.current - orb.x;
        const dy = playerYRef.current - orb.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 50 && distance > 0) {
          return { ...orb, x: orb.x + (dx / distance) * orbSpeed, y: orb.y + (dy / distance) * orbSpeed };
        }
        return orb;
      });

      // 2. 衝突判定
      const enemiesHitBySpells = new Set<number>();
      const newOrbs: ExperienceOrbData[] = [];
      const spellsAfterCollision: SpellData[] = [];

      nextSpells.forEach((spell) => {
        let spellHit = false;
        nextEnemies.forEach((enemy) => {
          if (enemiesHitBySpells.has(enemy.id)) return;
          const distance = Math.sqrt(Math.pow(spell.x - enemy.x, 2) + Math.pow(spell.y - enemy.y, 2));
          if (distance < 20) {
            spellHit = true;
            enemiesHitBySpells.add(enemy.id);
            newOrbs.push({ id: experienceOrbIdCounterRef.current++, x: enemy.x, y: enemy.y });
          }
        });
        if (!spellHit) {
          spellsAfterCollision.push(spell);
        }
      });
      nextSpells = spellsAfterCollision;
      if (newOrbs.length > 0) {
        nextExperienceOrbs = [...nextExperienceOrbs, ...newOrbs];
      }

      const remainingEnemies: EnemyData[] = [];
      nextEnemies.forEach((enemy) => {
        if (enemiesHitBySpells.has(enemy.id)) return;
        const distance = Math.sqrt(Math.pow(playerXRef.current - enemy.x, 2) + Math.pow(playerYRef.current - enemy.y, 2));
        if (distance < 25) {
          nextPlayerHp -= 10;
          if (nextPlayerHp <= 0) {
            setGamePhase('gameOver');
            gamePhaseChanged = true;
          }
        } else {
          remainingEnemies.push(enemy);
        }
      });
      nextEnemies = remainingEnemies;

      const remainingOrbs: ExperienceOrbData[] = [];
      nextExperienceOrbs.forEach((orb) => {
        const distance = Math.sqrt(Math.pow(playerXRef.current - orb.x, 2) + Math.pow(playerYRef.current - orb.y, 2));
        if (distance < 15) {
          nextCurrentExp++;
        } else {
          remainingOrbs.push(orb);
        }
      });
      nextExperienceOrbs = remainingOrbs;

      // 3. 状態のバッチ更新
      if (gamePhaseChanged) return; // ゲームオーバーになったら更新を停止

      setSpells(nextSpells);
      setEnemies(nextEnemies);
      setExperienceOrbs(nextExperienceOrbs);
      setPlayerHp(nextPlayerHp);
      setCurrentExp(nextCurrentExp);

    }, 50);

    return () => clearInterval(gameLoop);
  }, [gamePhase, playerHp, currentExp, spells, enemies, experienceOrbs]);

  // プレイヤーの向きを計算するロジック
  useEffect(() => {
    const directionInterval = setInterval(() => {
      const now = Date.now();
      const history = positionHistoryRef.current;

      // 0.1秒前以降の履歴を取得
      const recentHistory = history.filter(p => now - p.timestamp <= 100);

      if (recentHistory.length < 2) {
        // 十分な履歴がない場合は何もしない
        return;
      }

      const startPos = recentHistory[0];
      const endPos = recentHistory[recentHistory.length - 1];

      const moveDx = endPos.x - startPos.x;
      const moveDy = endPos.y - startPos.y;
      const distance = Math.sqrt(moveDx * moveDx + moveDy * moveDy);

      // 移動量がごくわずかな場合は向きを変えない（最低1pxの移動を要求）
      if (distance > 1) {
        const newDx = moveDx / distance;
        const newDy = moveDy / distance;
        setPlayerDirection(prevDirection => {
          if (prevDirection.dx !== newDx || prevDirection.dy !== newDy) {
            return { dx: newDx, dy: newDy };
          }
          return prevDirection;
        });
      }
    }, 50); // 50msごとに向きを更新

    return () => clearInterval(directionInterval);
  }, []); // この useEffect はマウント時に一度だけ実行

  // レベルアップ処理
  useEffect(() => {
    if (currentExp >= EXP_TO_LEVEL_UP && gamePhase === 'playing') {
      setLevel((prevLevel) => prevLevel + 1);
      setCurrentExp(0); // 経験値をリセット
      setGamePhase('levelUp'); // ゲームを一時停止
    }
  }, [currentExp, gamePhase, EXP_TO_LEVEL_UP]); // EXP_TO_LEVEL_UP を依存配列に追加

  const handleLevelUpChoice = (choice: string) => {
    console.log(`選択肢: ${choice} を選択しました。`);
    // ここで選択に応じたプレイヤーの性能強化ロジックを実装（今回はダミー）
    setGamePhase('playing'); // ゲームを再開
  };

  return (
    <div id="game-canvas" style={{ width: '800px', height: '600px', backgroundColor: 'black', margin: '50px auto', border: '1px solid white', position: 'relative', overflow: 'hidden' }}>
      {/* ゲーム画面の描画キャンバス */}
      <h1 style={{ color: 'white', textAlign: 'center', marginTop: '200px' }}>Game Canvas</h1>
      <p style={{ color: 'white', position: 'absolute', top: '10px', left: '10px' }}>HP: {playerHp}</p> {/* HP表示を追加 */}
      <p style={{ color: 'white', position: 'absolute', top: '30px', left: '10px' }}>EXP: {currentExp}/{EXP_TO_LEVEL_UP}</p> {/* EXP表示を追加 */}
      <p style={{ color: 'white', position: 'absolute', top: '50px', left: '10px' }}>Level: {level}</p> {/* Level表示を追加 */}

      <Player x={playerX} y={playerY} direction={playerDirection} />
      {spells.map((spell) => (
        <Spell key={spell.id} x={spell.x} y={spell.y} />
      ))}
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} x={enemy.x} y={enemy.y} />
      ))}
      {experienceOrbs.map((orb) => (
        <ExperienceOrb key={orb.id} x={orb.x} y={orb.y} />
      ))}

      {gamePhase === 'levelUp' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '20px',
          borderRadius: '10px',
          color: 'white',
          textAlign: 'center',
          zIndex: 100,
        }}>
          <h2>レベルアップ！</h2>
          <p>現在のレベル: {level}</p>
          <p>選択肢を選んでください:</p>
          <button onClick={() => handleLevelUpChoice('威力UP')} style={{ margin: '10px', padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}>威力UP</button>
          <button onClick={() => handleLevelUpChoice('範囲UP')} style={{ margin: '10px', padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}>新魔法</button>
        </div>
      )}

      {gamePhase === 'gameOver' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '20px',
          borderRadius: '10px',
          color: 'white',
          textAlign: 'center',
          zIndex: 100,
        }}>
          <h2>ゲームオーバー</h2>
          <p>あなたのレベル: {level}</p>
          <p>コンソールに「ゲームオーバー」と表示されました。</p>
        </div>
      )}
    </div>
  );
}
