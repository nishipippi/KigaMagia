"use client";

import { useState, useEffect, useRef } from 'react';
import Player from '../components/Player';
import Spell from '../components/Spell';
import Enemy from '../components/Enemy';
import ExperienceOrb from '../components/ExperienceOrb';
import TitleScreen from '../components/TitleScreen'; // TitleScreenをインポート
import { spells as allSpells } from '../data/spells'; // spellsデータをインポート
import HUD from '../components/HUD'; // HUDをインポート
import LevelUpScreen from '../components/LevelUpScreen'; // LevelUpScreenをインポート
import ResultScreen from '../components/ResultScreen'; // ResultScreenをインポート
import { Choice } from '../components/LevelUpScreen'; // Choiceインターフェースをインポート
import ChainLightningEffect from '../components/ChainLightningEffect'; // ChainLightningEffectをインポート

interface SpellData {
  id: number;
  x: number;
  y: number;
  dx: number; // 魔法のX方向移動量
  dy: number; // 魔法のY方向移動量
  spellId: string; // 魔法のIDを追加
  status: 'flying' | 'impact' | 'fading'; // 魔法の状態
  startTime: number; // 生成された時刻
  impactTime?: number; // 着弾した時刻
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

type GamePhase = 'title' | 'playing' | 'levelUp' | 'gameOver';

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
  const [playerMaxHp, setPlayerMaxHp] = useState(100); // プレイヤーの最大HP (仮)
  const [playerMana, setPlayerMana] = useState(50); // プレイヤーのマナ (仮)
  const [playerMaxMana, setPlayerMaxMana] = useState(50); // プレイヤーの最大マナ (仮)
  const [acquiredSpells, setAcquiredSpells] = useState<string[]>(['magic_fist']); // 習得済みの魔法
  const [levelUpChoices, setLevelUpChoices] = useState<Choice[]>([]); // レベルアップ時の選択肢を保持
  const [spellCooldowns, setSpellCooldowns] = useState<Record<string, number>>({}); // 魔法ごとのクールダウン管理
  const [chainLightningEffects, setChainLightningEffects] = useState<
    { id: number; fromX: number; fromY: number; toX: number; toY: number; startTime: number }[]
  >([]); // チェインライトニングのアニメーション効果
  const chainLightningEffectIdCounterRef = useRef(0); // チェインライトニングエフェクトのIDカウンター
  const [gamePhase, setGamePhase] = useState<GamePhase>('title'); // 初期状態を'title'に変更
  const [survivalTime, setSurvivalTime] = useState(0); // 生存時間
  const timerRef = useRef<NodeJS.Timeout | null>(null); // タイマー参照
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 }); // キャンバスサイズ

  const EXP_TO_LEVEL_UP = 10;
  const MANA_REGEN_PER_SECOND = 20; // マナ回復量/秒
  // const GAME_CANVAS_HEIGHT = 600; // ゲームキャンバスの高さ (不要になるためコメントアウト)

  const handleStartGame = () => {
    // ゲーム状態を初期化
    setPlayerX(canvasSize.width / 2); // 中央に配置
    setPlayerY(canvasSize.height / 2); // 中央に配置
    setPlayerDirection({ dx: 0, dy: -1 });
    setSpells([]);
    setEnemies([]);
    setExperienceOrbs([]);
    setCurrentExp(0);
    setLevel(1);
    setPlayerHp(100);
    setPlayerMaxHp(100); // リセット時に最大HPも設定
    setPlayerMana(50); // リセット時にマナも設定
    setPlayerMaxMana(50); // リセット時に最大マナも設定
    setAcquiredSpells(['magic_fist']); // 習得済み魔法を初期化
    setSpellCooldowns({}); // クールダウンを初期化
    setSurvivalTime(0); // 生存時間をリセット
    if (timerRef.current) clearInterval(timerRef.current); // 既存タイマーをクリア
    timerRef.current = setInterval(() => {
      setSurvivalTime(prev => prev + 1);
    }, 1000); // 1秒ごとに生存時間を更新
    setGamePhase('playing');
  };

  // キャンバスサイズをウィンドウサイズに合わせる
  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize(); // 初期サイズを設定
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const canvas = document.getElementById('game-canvas');
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        // プレイヤーがキャンバス外に出ないように座標を制限
        const newX = Math.min(Math.max(0, event.clientX - rect.left), canvasSize.width);
        const newY = Math.min(Math.max(0, event.clientY - rect.top), canvasSize.height);

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
  }, [canvasSize]); // canvasSize を依存配列に追加

  // playerDirection の state が更新されたら、ref の値も更新する
  useEffect(() => {
    playerDirectionRef.current = playerDirection;
  }, [playerDirection]);

  // 魔法の自動発射ロジックとマナ回復
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const gameTickInterval = setInterval(() => {
      const now = Date.now();
      const direction = playerDirectionRef.current; // refから最新の向きを取得

      // マナ回復
      setPlayerMana((prevMana) => Math.min(prevMana + (MANA_REGEN_PER_SECOND / 10), playerMaxMana));

      // 各習得魔法の発動チェック
      acquiredSpells.forEach((spellId) => {
        const spell = allSpells.find(s => s.id === spellId);
        if (!spell) return;

        const lastCastTime = spellCooldowns[spell.id] || 0;
        const cooldownTimeMs = spell.cooldown * 1000;

        if (now - lastCastTime >= cooldownTimeMs && playerMana >= spell.manaCost) {
          // 魔法発射
          setSpells((prevSpells) => [
            ...prevSpells,
            {
              id: spellIdCounterRef.current++,
              x: playerXRef.current,
              y: playerYRef.current,
              dx: direction.dx * spell.speed, // 魔法固有の速度を使用
              dy: direction.dy * spell.speed, // 魔法固有の速度を使用
              spellId: spell.id,
              status: 'flying', // 初期状態は飛翔中
              startTime: now, // 生成時刻を記録
            },
          ]);

          // マナ消費
          setPlayerMana((prevMana) => prevMana - spell.manaCost);

          // クールダウン更新
          setSpellCooldowns((prevCooldowns) => ({
            ...prevCooldowns,
            [spell.id]: now,
          }));
        }
      });
    }, 100); // 100msごとにチェック

    return () => clearInterval(gameTickInterval);
  }, [gamePhase, acquiredSpells, playerMana, playerMaxMana, spellCooldowns]); // 依存配列に spellCooldowns と playerMana, playerMaxMana を追加

  // 敵の自動出現ロジック
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const enemyInterval = setInterval(() => {
      setEnemies((prevEnemies) => {
        const spawnSide = Math.floor(Math.random() * 4); // 0:上, 1:下, 2:左, 3:右
        let spawnX, spawnY;

        switch (spawnSide) {
          case 0: // 上辺
            spawnX = Math.random() * canvasSize.width;
            spawnY = 0;
            break;
          case 1: // 下辺
            spawnX = Math.random() * canvasSize.width;
            spawnY = canvasSize.height;
            break;
          case 2: // 左辺
            spawnX = 0;
            spawnY = Math.random() * canvasSize.height;
            break;
          case 3: // 右辺
            spawnX = canvasSize.width;
            spawnY = Math.random() * canvasSize.height;
            break;
          default:
            spawnX = Math.random() * canvasSize.width;
            spawnY = 0;
        }

        return [
          ...prevEnemies,
          { id: enemyIdCounterRef.current++, x: spawnX, y: spawnY },
        ];
      });
    }, 2000);

    return () => clearInterval(enemyInterval);
  }, [canvasSize.height, canvasSize.width, gamePhase]); // 依存配列からenemyIdCounterを削除

  // ゲームループ（移動、衝突判定、状態更新）
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const gameLoop = setInterval(() => {
      // 状態更新をバッチ処理するための準備
      let nextSpells = spells;
      let nextEnemies = enemies;
      let nextPlayerHp = playerHp;
      let nextCurrentExp = currentExp;
      let gamePhaseChanged = false;
      let newChainLightningEffects: typeof chainLightningEffects = [];
      const now = Date.now();
      const IMPACT_EFFECT_DURATION = 500; // 着弾エフェクトの表示時間 (ms)

      // 1. 魔法の位置更新、寿命判定、衝突判定、状態遷移
      const processedSpells: SpellData[] = [];
      const enemiesHitBySpells = new Set<number>();
      const newOrbs: ExperienceOrbData[] = []; // 新しく生成されるオーブ

      spells.forEach((spell) => { // Iterate over the original spells state
        const spellInfo = allSpells.find(s => s.id === spell.spellId);
        if (!spellInfo) {
          // If spell info is missing, just remove it.
          return;
        }

        const currentSpell = { ...spell }; // Create a mutable copy

        if (currentSpell.status === 'flying') {
          // Update position
          currentSpell.x += currentSpell.dx;
          currentSpell.y += currentSpell.dy;

          // Check lifetime
          if (now - currentSpell.startTime > spellInfo.lifetime * 1000) {
            // Spell expired, do not add to processedSpells
            return;
          }

          // Check screen bounds
          if (currentSpell.y < 0 || currentSpell.y > canvasSize.height || currentSpell.x < 0 || currentSpell.x > canvasSize.width) {
            // Off-screen, do not add to processedSpells
            return;
          }

          // Collision detection for flying spells
          let spellHitEnemy = false;
          nextEnemies.forEach((enemy) => {
            if (enemiesHitBySpells.has(enemy.id)) return;

            const collisionRadius = 20; // Assuming a default collision radius
            const distance = Math.sqrt(Math.pow(currentSpell.x - enemy.x, 2) + Math.pow(currentSpell.y - enemy.y, 2));

            if (distance < collisionRadius) {
              spellHitEnemy = true;
              enemiesHitBySpells.add(enemy.id);
              newOrbs.push({ id: experienceOrbIdCounterRef.current++, x: enemy.x, y: enemy.y });

              // Chain Lightning specific logic
              if (currentSpell.spellId === 'chain_lightning') {
                let currentChainCount = 0;
                const maxChains = 3;
                let lastEnemyX = enemy.x;
                let lastEnemyY = enemy.y;
                let currentTargetEnemyId: number | null = enemy.id;

                while (currentChainCount < maxChains) {
                  const availableEnemies = nextEnemies.filter(
                    (e) => !enemiesHitBySpells.has(e.id) && e.id !== currentTargetEnemyId
                  );

                  if (availableEnemies.length === 0) break;

                  let nextTarget: EnemyData | null = null;
                  let minDistance = Infinity;

                  for (const e of availableEnemies) {
                    const dist = Math.sqrt(Math.pow(lastEnemyX - e.x, 2) + Math.pow(lastEnemyY - e.y, 2));
                    if (dist < minDistance) {
                      minDistance = dist;
                      nextTarget = e;
                    }
                  }

                  if (nextTarget) {
                    newChainLightningEffects.push({
                      id: chainLightningEffectIdCounterRef.current++,
                      fromX: lastEnemyX,
                      fromY: lastEnemyY,
                      toX: nextTarget.x,
                      toY: nextTarget.y,
                      startTime: now,
                    });
                    enemiesHitBySpells.add(nextTarget.id);
                    newOrbs.push({ id: experienceOrbIdCounterRef.current++, x: nextTarget.x, y: nextTarget.y });

                    lastEnemyX = nextTarget.x;
                    lastEnemyY = nextTarget.y;
                    currentTargetEnemyId = nextTarget.id;
                    currentChainCount++;
                  } else {
                    break;
                  }
                }
              }
            }
          });

          if (spellHitEnemy) {
            currentSpell.status = 'impact';
            currentSpell.dx = 0; // Stop movement
            currentSpell.dy = 0;
            currentSpell.impactTime = now;
          }
        } else if (currentSpell.status === 'impact') {
          // Check impact effect duration
          if (currentSpell.impactTime && (now - currentSpell.impactTime > IMPACT_EFFECT_DURATION)) {
            // Effect finished, do not add to processedSpells
            return;
          }
        }
        processedSpells.push(currentSpell);
      });
      nextSpells = processedSpells; // Update nextSpells with the processed list

      const enemySpeed = 2;
      nextEnemies = nextEnemies.map((enemy) => {
        const dx = playerXRef.current - enemy.x;
        const dy = playerYRef.current - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const moveX = (dx / distance) * enemySpeed;
        const moveY = (dy / distance) * enemySpeed;
        // 敵がキャンバス外に出ないように座標を制限
        const newEnemyX = enemy.x + moveX;
        const newEnemyY = enemy.y + moveY;
        return {
          ...enemy,
          x: Math.max(0, Math.min(newEnemyX, canvasSize.width)),
          y: Math.max(0, Math.min(newEnemyY, canvasSize.height)),
        };
      });

      nextEnemies = nextEnemies.filter((enemy) => {
        if (enemiesHitBySpells.has(enemy.id)) {
          return false; // Remove enemies hit by spells
        }
        const distance = Math.sqrt(Math.pow(playerXRef.current - enemy.x, 2) + Math.pow(playerYRef.current - enemy.y, 2));
        if (distance < 25) { // Player-enemy collision
          nextPlayerHp -= 10;
          if (nextPlayerHp <= 0) {
            if (timerRef.current) clearInterval(timerRef.current); // Stop timer on game over
            setGamePhase('gameOver');
            gamePhaseChanged = true;
          }
          return false; // Remove enemy if it hit the player
        }
        return true; // Keep remaining enemies
      });

      // Process existing experience orbs and combine with new ones
      let collectedExpThisTick = 0;
      const orbSpeed = 3; // Orb speed defined here
      const remainingOrbs = experienceOrbs.map((orb) => { // Move existing orbs
        const dx = playerXRef.current - orb.x;
        const dy = playerYRef.current - orb.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 50 && distance > 0) {
          return { ...orb, x: orb.x + (dx / distance) * orbSpeed, y: orb.y + (dy / distance) * orbSpeed };
        }
        return orb;
      }).filter((orb) => { // Filter collected orbs
        const distance = Math.sqrt(Math.pow(playerXRef.current - orb.x, 2) + Math.pow(playerYRef.current - orb.y, 2));
        if (distance < 15) { // Player-orb collision
          collectedExpThisTick++;
          return false; // Remove collected orb
        }
        return true; // Keep remaining orbs
      });
      const nextExperienceOrbs = [...remainingOrbs, ...newOrbs]; // Combine existing uncollected with newly generated
      nextCurrentExp += collectedExpThisTick; // Add collected experience

      // 古いチェインライトニングエフェクトを削除
      const effectDuration = 200; // 稲妻アニメーションの表示時間 (ms)
      newChainLightningEffects = [...chainLightningEffects.filter(effect => now - effect.startTime < effectDuration), ...newChainLightningEffects];


      // 3. 状態のバッチ更新
      if (gamePhaseChanged) return; // ゲームオーバーになったら更新を停止

      setSpells(nextSpells);
      setEnemies(nextEnemies);
      setExperienceOrbs(nextExperienceOrbs);
      setPlayerHp(nextPlayerHp);
      setCurrentExp(nextCurrentExp);
      setChainLightningEffects(newChainLightningEffects); // チェインライトニングエフェクトを更新

    }, 50);

    return () => clearInterval(gameLoop);
  }, [gamePhase, playerHp, currentExp, spells, enemies, experienceOrbs, canvasSize.height, canvasSize.width, chainLightningEffects]);

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

      // レベルアップ時の選択肢を生成し、stateに保存
      const availableSpells = allSpells.filter(
        (spell) => !acquiredSpells.includes(spell.id)
      );

      const newSpellChoices = availableSpells.map((spell) => ({
        id: spell.id,
        name: spell.name,
        description: spell.description,
        type: 'spell' as const,
      }));

      const upgradeChoices = acquiredSpells.map((spellId) => {
        const spell = allSpells.find(s => s.id === spellId);
        return {
          id: `${spellId}_upgrade`,
          name: `${spell?.name || '不明な魔法'} 強化`,
          description: `${spell?.name || '不明な魔法'} の性能を向上させる`,
          type: 'upgrade' as const,
        };
      });

      // 新しい魔法の選択肢と既存魔法の強化選択肢を混ぜて、ランダムに3つ選択
      const allPossibleChoices = [...newSpellChoices, ...upgradeChoices];
      const shuffledChoices = allPossibleChoices.sort(() => 0.5 - Math.random());
      setLevelUpChoices(shuffledChoices.slice(0, 3));
    }
  }, [currentExp, gamePhase, EXP_TO_LEVEL_UP, acquiredSpells]); // acquiredSpells を依存配列に追加

  const handleLevelUpChoice = (choiceId: string) => {
    console.log(`選択肢: ${choiceId} を選択しました。`);

    if (choiceId.endsWith('_upgrade')) {
      const originalSpellId = choiceId.replace('_upgrade', '');
      const upgradedSpell = allSpells.find(spell => spell.id === originalSpellId);
      console.log(`${upgradedSpell?.name || '不明な魔法'} を強化しました！`);
      // ここで実際の強化ロジックを実装（例: 威力やクールダウンの変更）
    } else {
      const chosenSpell = allSpells.find(spell => spell.id === choiceId);
      if (chosenSpell) {
        // 新しい魔法の習得
        setAcquiredSpells((prevSpells) => {
          if (!prevSpells.includes(chosenSpell.id)) {
            return [...prevSpells, chosenSpell.id];
          }
          return prevSpells;
        });
        console.log(`新しい魔法 ${chosenSpell.name} を習得しました！`);
      }
    }
    setGamePhase('playing'); // ゲームを再開
  };

  const handleRestartGame = () => {
    handleStartGame(); // ゲーム開始時のロジックを再利用
  };

  const handleGoToTitle = () => {
    setGamePhase('title'); // ゲーム状態をタイトルに戻す
  };

  return (
    <div
      id="game-canvas"
      style={{
        width: `${canvasSize.width}px`, // 動的な幅
        height: `${canvasSize.height}px`, // 動的な高さ
        backgroundColor: 'black',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {gamePhase === 'title' && <TitleScreen onStartGame={handleStartGame} />}

      {gamePhase !== 'title' && (
        <>
          {/* HUDコンポーネント */}
          <HUD
            survivalTime={survivalTime}
            level={level}
            currentExp={currentExp}
            expToLevelUp={EXP_TO_LEVEL_UP}
            playerHp={playerHp}
            playerMaxHp={playerMaxHp}
            playerMana={playerMana}
            playerMaxMana={playerMaxMana}
          />

          {/* ゲーム画面の描画キャンバス */}
          {gamePhase === 'playing' && (
            <>
              <Player x={playerX} y={playerY} direction={playerDirection} />
              {spells.map((spell) => (
                <Spell
                  key={spell.id}
                  x={spell.x}
                  y={spell.y}
                  spellId={spell.spellId}
                  status={spell.status} // 状態を渡す
                />
              ))}
              {enemies.map((enemy) => (
                <Enemy key={enemy.id} x={enemy.x} y={enemy.y} />
              ))}
              {experienceOrbs.map((orb) => (
                <ExperienceOrb key={orb.id} x={orb.x} y={orb.y} />
              ))}
              {chainLightningEffects.map((effect) => (
                <ChainLightningEffect
                  key={effect.id}
                  id={effect.id}
                  fromX={effect.fromX}
                  fromY={effect.fromY}
                  toX={effect.toX}
                  toY={effect.toY}
                  duration={200} // アニメーション表示時間
                  onComplete={(idToRemove) => {
                    setChainLightningEffects((prevEffects) =>
                      prevEffects.filter((e) => e.id !== idToRemove)
                    );
                  }}
                />
              ))}
            </>
          )}

          {gamePhase === 'levelUp' && (
            <LevelUpScreen level={level} choices={levelUpChoices} onChoice={handleLevelUpChoice} />
          )}

          {gamePhase === 'gameOver' && (
            <ResultScreen survivalTime={survivalTime} level={level} onRestart={handleRestartGame} onGoToTitle={handleGoToTitle} />
          )}
        </>
      )}
    </div>
  );
}
