"use client";

import { useState, useEffect } from 'react';
import Player from '../components/Player';
import Spell from '../components/Spell';
import Enemy from '../components/Enemy';
import ExperienceOrb from '../components/ExperienceOrb';

interface SpellData {
  id: number;
  x: number;
  y: number;
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
  const [spells, setSpells] = useState<SpellData[]>([]);
  const [spellIdCounter, setSpellIdCounter] = useState(0);
  const [enemies, setEnemies] = useState<EnemyData[]>([]);
  const [enemyIdCounter, setEnemyIdCounter] = useState(0);
  const [experienceOrbs, setExperienceOrbs] = useState<ExperienceOrbData[]>([]);
  const [experienceOrbIdCounter, setExperienceOrbIdCounter] = useState(0);
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
        setPlayerX(event.clientX - rect.left);
        setPlayerY(event.clientY - rect.top);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // 魔法の自動発射ロジック
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const spellInterval = setInterval(() => {
      setSpells((prevSpells) => [
        ...prevSpells,
        { id: spellIdCounter, x: playerX, y: playerY },
      ]);
      setSpellIdCounter((prevCounter) => prevCounter + 1);
    }, 500);

    return () => clearInterval(spellInterval);
  }, [playerX, playerY, spellIdCounter, gamePhase]);

  // 敵の自動出現ロジック
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const enemyInterval = setInterval(() => {
      setEnemies((prevEnemies) => [
        ...prevEnemies,
        { id: enemyIdCounter, x: Math.random() * 800, y: 0 },
      ]);
      setEnemyIdCounter((prevCounter) => prevCounter + 1);
    }, 2000);

    return () => clearInterval(enemyInterval);
  }, [enemyIdCounter, gamePhase]);

  // ゲームループ（魔法と敵の移動、当たり判定、経験値オーブの移動と回収、プレイヤーHP減少）
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const gameLoop = setInterval(() => {
      // 魔法の移動
      setSpells((prevSpells) =>
        prevSpells
          .map((spell) => ({ ...spell, y: spell.y - 5 }))
          .filter((spell) => spell.y > 0)
      );

      // 敵の移動とプレイヤーへのダメージ
      setEnemies((prevEnemies) => {
        const remainingEnemies: EnemyData[] = [];
        prevEnemies.forEach((enemy) => {
          const newY = enemy.y + 2;
          if (newY >= GAME_CANVAS_HEIGHT - 10) { // 敵が画面下部に到達（プレイヤーの高さ付近）
            setPlayerHp((prevHp) => {
              const newHp = prevHp - 10; // HPを減らす
              if (newHp <= 0) {
                setGamePhase('gameOver'); // ゲームオーバー
                console.log("ゲームオーバー");
                return 0;
              }
              return newHp;
            });
          } else {
            remainingEnemies.push({ ...enemy, y: newY });
          }
        });
        return remainingEnemies;
      });

      // 経験値オーブの移動（プレイヤーに向かって移動する簡易ロジック）
      setExperienceOrbs((prevOrbs) =>
        prevOrbs
          .map((orb) => {
            const dx = playerX - orb.x;
            const dy = playerY - orb.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const speed = 3;

            if (distance < 50) { // プレイヤーが近くにいたら引き寄せる
              return {
                ...orb,
                x: orb.x + (dx / distance) * speed,
                y: orb.y + (dy / distance) * speed,
              };
            }
            return orb;
          })
      );

      // 当たり判定
      setSpells((currentSpells) => {
        const newSpells: SpellData[] = [];
        const newOrbs: ExperienceOrbData[] = [];

        currentSpells.forEach((spell) => {
          let spellHit = false;
          setEnemies((currentEnemies) => {
            const remainingEnemies = currentEnemies.filter((enemy) => {
              const distance = Math.sqrt(
                Math.pow(spell.x - enemy.x, 2) + Math.pow(spell.y - enemy.y, 2)
              );
              if (distance < 20) { // 魔法の半径(5) + 敵の半径(15) = 20
                spellHit = true;
                // 敵を倒したら経験値オーブを生成
                newOrbs.push({ id: experienceOrbIdCounter, x: enemy.x, y: enemy.y });
                setExperienceOrbIdCounter((prev) => prev + 1);
                return false; // 敵を削除
              }
              return true; // 敵を残す
            });
            return remainingEnemies;
          });

          if (!spellHit) {
            newSpells.push(spell); // 当たらなかった魔法は残す
          }
        });
        setExperienceOrbs((prev) => [...prev, ...newOrbs]); // 新しいオーブを追加
        return newSpells;
      });

      // プレイヤーと経験値オーブの当たり判定
      setExperienceOrbs((currentOrbs) => {
        const remainingOrbs = currentOrbs.filter((orb) => {
          const distance = Math.sqrt(
            Math.pow(playerX - orb.x, 2) + Math.pow(playerY - orb.y, 2)
          );
          if (distance < 15) { // プレイヤーの半径(10) + オーブの半径(7) = 17 (少し余裕を持たせる)
            setCurrentExp((prevExp) => prevExp + 1); // 経験値を1加算
            return false; // オーブを削除
          }
          return true; // オーブを残す
        });
        return remainingOrbs;
      });

    }, 50);

    return () => clearInterval(gameLoop);
  }, [playerX, playerY, gamePhase, experienceOrbIdCounter, playerHp]); // playerHpを依存配列に追加

  // レベルアップ処理
  useEffect(() => {
    if (currentExp >= EXP_TO_LEVEL_UP && gamePhase === 'playing') {
      setLevel((prevLevel) => prevLevel + 1);
      setCurrentExp(0); // 経験値をリセット
      setGamePhase('levelUp'); // ゲームを一時停止
    }
  }, [currentExp, gamePhase]);

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

      <Player x={playerX} y={playerY} />
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
