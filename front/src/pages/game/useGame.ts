import { useCallback, useRef, useState } from "react";
import * as THREE from "three";
import { ThreeEngineHandle, SceneObject } from "../../engine/ThreeEngine";
import { GizmoFace } from "../../engine/OrientationGizmo";
import {
    GameEnemy, GameProjectile, GameMysteryBox,
    GameBuff, GameTurret, GameMeteor, OrbitProjectile,
    CardDef, CardType, StartCubeInfo,
} from "./types";
import {
    PROJ_LIFETIME,
    ENEMY_PROJ_SPEED, ENEMY_PROJ_LIFETIME,
    PLAYER_RADIUS,
    SPAWN_INTERVAL_START, SPAWN_INTERVAL_MIN,
    BEST_SCORE_KEY, GAME_WORLD_BOUNDS,
    MYSTERY_BOX_INTERVAL, MYSTERY_BOX_LIFETIME, MYSTERY_BOX_RADIUS,
    ORBIT_COUNT, ORBIT_RADIUS, ORBIT_SPEED, ORBIT_DAMAGE, ORBIT_HIT_RADIUS, ORBIT_COOLDOWN,
    AUTO_FIRE_INTERVAL, AUTO_PROJ_DAMAGE, AUTO_PROJ_SPEED,
    TURRET_HP, TURRET_FIRE_INTERVAL, TURRET_PROJ_DAMAGE, TURRET_PROJ_SPEED, TURRET_RANGE,
    METEOR_COUNT, METEOR_DAMAGE, METEOR_SPEED, METEOR_RADIUS, METEOR_START_Y,
    CARD_DEFS, ENEMY_DEFS,
} from "./constants";

// ── Helpers ─────────────────────────────────────────────────────────────────
function makeProjMesh(color: number): THREE.Mesh {
    return new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 6, 6),
        new THREE.MeshBasicMaterial({ color }),
    );
}

function generateCards(buff: GameBuff | null, turret: GameTurret | null): CardDef[] {
    const pool: CardType[] = ["temp"];
    pool.push(buff?.type === "orbit" ? "upgrade_orbit" : "buff_orbit");
    pool.push(buff?.type === "auto"  ? "upgrade_auto"  : "buff_auto");
    pool.push(turret                 ? "upgrade_turret" : "building_turret");
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 3).map(t => CARD_DEFS[t]);
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useGame(
    engineRef: React.MutableRefObject<ThreeEngineHandle | null>,
    movableRef: React.MutableRefObject<{ id: number; sceneId: string; mesh: THREE.Mesh } | null>,
    activeFaceRef: React.MutableRefObject<GizmoFace>,
) {
    // ── Refs ──────────────────────────────────────────────────────────────────
    const gameActiveRef    = useRef(false);
    const gamePausedRef    = useRef(false);
    const gameStartTimeRef = useRef(0);
    const hpRef            = useRef(100);
    const scoreRef         = useRef(0);
    const bestScoreRef     = useRef(parseInt(localStorage.getItem(BEST_SCORE_KEY) ?? "0"));
    const lastFrameRef     = useRef(0);
    const enemiesRef       = useRef<GameEnemy[]>([]);
    const playerProjsRef   = useRef<GameProjectile[]>([]);
    const enemyProjsRef    = useRef<GameProjectile[]>([]);
    const mysteryBoxesRef  = useRef<GameMysteryBox[]>([]);
    const meteorsRef       = useRef<GameMeteor[]>([]);
    const buffRef          = useRef<GameBuff | null>(null);
    const turretRef        = useRef<GameTurret | null>(null);
    const nextSpawnRef     = useRef(0);
    const nextBoxRef       = useRef(0);
    const startCubeRef     = useRef<StartCubeInfo | null>(null);

    // ── State ─────────────────────────────────────────────────────────────────
    const [gameOver,   setGameOver]   = useState(false);
    const [gameHp,     setGameHp]     = useState(100);
    const [gameScore,  setGameScore]  = useState(0);
    const [bestScore,  setBestScore]  = useState(parseInt(localStorage.getItem(BEST_SCORE_KEY) ?? "0"));
    const [cardChoice, setCardChoice] = useState<CardDef[] | null>(null);
    const [turretHp,   setTurretHp]   = useState<number | null>(null);
    const [activeBuff, setActiveBuff] = useState<"orbit" | "auto" | null>(null);

    // ── Cleanup helper ────────────────────────────────────────────────────────
    const cleanupAllRef = useRef<(engine: ThreeEngineHandle) => void>(() => {});
    cleanupAllRef.current = (engine: ThreeEngineHandle) => {
        [...enemiesRef.current, ...playerProjsRef.current, ...enemyProjsRef.current,
         ...mysteryBoxesRef.current, ...meteorsRef.current]
            .forEach(o => engine.removeObject(o.id));
        buffRef.current?.orbits.forEach(o => engine.removeObject(o.id));
        if (turretRef.current) engine.removeObject(turretRef.current.id);
        enemiesRef.current = []; playerProjsRef.current = []; enemyProjsRef.current = [];
        mysteryBoxesRef.current = []; meteorsRef.current = [];
        buffRef.current = null; turretRef.current = null;
    };

    // ── Game over ─────────────────────────────────────────────────────────────
    const doGameOverRef = useRef<() => void>(() => {});
    doGameOverRef.current = () => {
        const engine = engineRef.current;
        if (!engine) return;
        gameActiveRef.current = false;
        gamePausedRef.current = false;
        cleanupAllRef.current(engine);

        const final = scoreRef.current;
        if (final > bestScoreRef.current) {
            bestScoreRef.current = final;
            localStorage.setItem(BEST_SCORE_KEY, String(final));
            setBestScore(final);
        }
        const sc = startCubeRef.current;
        if (sc) {
            engine.addObject({ id: sc.sceneId, mesh: sc.mesh } as SceneObject);
            if (sc.labelId && sc.labelMesh) engine.addObject({ id: sc.labelId, mesh: sc.labelMesh } as SceneObject);
        }
        setGameOver(true);
        setCardChoice(null);
        setTurretHp(null);
        setActiveBuff(null);
    };

    // ── Apply card ────────────────────────────────────────────────────────────
    const applyCardRef = useRef<(card: CardDef) => void>(() => {});
    applyCardRef.current = (card: CardDef) => {
        const engine = engineRef.current;
        const mv = movableRef.current;
        if (!engine || !mv) return;
        const px = mv.mesh.position.x, pz = mv.mesh.position.z;

        switch (card.type) {
            case "temp": {
                for (let i = 0; i < METEOR_COUNT; i++) {
                    const id = `meteor-${Date.now()}-${i}`;
                    const mesh = new THREE.Mesh(
                        new THREE.SphereGeometry(0.45, 6, 6),
                        new THREE.MeshBasicMaterial({ color: 0xff6b35 }),
                    );
                    const mx = (Math.random() * 2 - 1) * GAME_WORLD_BOUNDS;
                    const mz = (Math.random() * 2 - 1) * GAME_WORLD_BOUNDS;
                    mesh.position.set(mx, METEOR_START_Y + Math.random() * 12, mz);
                    meteorsRef.current.push({ id, mesh });
                    engine.addObject({ id, mesh } as SceneObject);
                }
                break;
            }

            case "buff_orbit": {
                buffRef.current?.orbits.forEach(o => engine.removeObject(o.id));
                const orbits: OrbitProjectile[] = [];
                for (let i = 0; i < ORBIT_COUNT; i++) {
                    const id = `orbit-${Date.now()}-${i}`;
                    const mesh = new THREE.Mesh(
                        new THREE.SphereGeometry(0.3, 8, 8),
                        new THREE.MeshBasicMaterial({ color: 0x4cc9f0 }),
                    );
                    orbits.push({ id, mesh, damageCooldown: new Map() });
                    engine.addObject({ id, mesh } as SceneObject);
                }
                buffRef.current = { type: "orbit", level: 1, orbits, orbitAngle: 0, lastAutoShot: 0 };
                setActiveBuff("orbit");
                break;
            }

            case "upgrade_orbit": {
                const b = buffRef.current;
                if (b?.type === "orbit") {
                    const id = `orbit-${Date.now()}-extra`;
                    const mesh = new THREE.Mesh(
                        new THREE.SphereGeometry(0.3, 8, 8),
                        new THREE.MeshBasicMaterial({ color: 0x4cc9f0 }),
                    );
                    b.orbits.push({ id, mesh, damageCooldown: new Map() });
                    b.level += 1;
                    engine.addObject({ id, mesh } as SceneObject);
                }
                break;
            }

            case "buff_auto": {
                buffRef.current?.orbits.forEach(o => engine.removeObject(o.id));
                buffRef.current = { type: "auto", level: 1, orbits: [], orbitAngle: 0, lastAutoShot: 0 };
                setActiveBuff("auto");
                break;
            }

            case "upgrade_auto": {
                if (buffRef.current?.type === "auto") buffRef.current.level += 1;
                break;
            }

            case "building_turret": {
                if (turretRef.current) engine.removeObject(turretRef.current.id);
                const id = `turret-${Date.now()}`;
                const mesh = new THREE.Mesh(
                    new THREE.BoxGeometry(1.5, 2, 1.5),
                    new THREE.MeshStandardMaterial({ color: 0x06d6a0 }),
                );
                const a = Math.random() * Math.PI * 2;
                mesh.position.set(
                    Math.max(-GAME_WORLD_BOUNDS, Math.min(GAME_WORLD_BOUNDS, px + Math.cos(a) * 4)),
                    1,
                    Math.max(-GAME_WORLD_BOUNDS, Math.min(GAME_WORLD_BOUNDS, pz + Math.sin(a) * 4)),
                );
                turretRef.current = { id, mesh, hp: TURRET_HP, maxHp: TURRET_HP, level: 1, lastShot: 0 };
                engine.addObject({ id, mesh } as SceneObject);
                setTurretHp(TURRET_HP);
                break;
            }

            case "upgrade_turret": {
                const t = turretRef.current;
                if (t) {
                    t.level += 1;
                    t.hp = Math.min(t.maxHp, t.hp + 75);
                    setTurretHp(t.hp);
                }
                break;
            }
        }

        setCardChoice(null);
        gamePausedRef.current = false;
    };

    // ── Game tick (called every frame from Home) ───────────────────────────────
    const gameTick = useCallback(() => {
        if (activeFaceRef.current !== "back" || !gameActiveRef.current) return;
        if (gamePausedRef.current) return;

        const engine = engineRef.current;
        const mv = movableRef.current;
        if (!engine || !mv) return;

        const now = performance.now();
        const dt = Math.min((now - lastFrameRef.current) / 1000, 0.1);
        lastFrameRef.current = now;

        const px = mv.mesh.position.x, pz = mv.mesh.position.z;

        // ── Orbit buff ────────────────────────────────────────────────────────
        const buff = buffRef.current;
        if (buff?.type === "orbit") {
            const speed = ORBIT_SPEED * (1 + (buff.level - 1) * 0.3);
            buff.orbitAngle += speed * dt;
            const count = buff.orbits.length;
            for (let i = 0; i < count; i++) {
                const op = buff.orbits[i];
                const angle = buff.orbitAngle + (i / count) * Math.PI * 2;
                op.mesh.position.set(
                    px + Math.cos(angle) * ORBIT_RADIUS,
                    1.2,
                    pz + Math.sin(angle) * ORBIT_RADIUS,
                );
                for (let j = enemiesRef.current.length - 1; j >= 0; j--) {
                    const e = enemiesRef.current[j];
                    const d = Math.hypot(op.mesh.position.x - e.mesh.position.x, op.mesh.position.z - e.mesh.position.z);
                    if (d < e.radius + ORBIT_HIT_RADIUS) {
                        const lastHit = op.damageCooldown.get(e.id) ?? 0;
                        if (now - lastHit > ORBIT_COOLDOWN) {
                            op.damageCooldown.set(e.id, now);
                            e.hp -= ORBIT_DAMAGE * (1 + (buff.level - 1) * 0.5);
                            if (e.hp <= 0) {
                                engine.removeObject(e.id);
                                scoreRef.current += e.score;
                                setGameScore(scoreRef.current);
                                enemiesRef.current.splice(j, 1);
                            }
                        }
                    }
                }
            }
        }

        // ── Auto-fire buff ────────────────────────────────────────────────────
        if (buff?.type === "auto" && enemiesRef.current.length > 0) {
            const interval = AUTO_FIRE_INTERVAL / (1 + (buff.level - 1) * 0.5);
            if (now - buff.lastAutoShot > interval) {
                buff.lastAutoShot = now;
                let nearest = enemiesRef.current[0], nearestDist = Infinity;
                for (const e of enemiesRef.current) {
                    const d = Math.hypot(e.mesh.position.x - px, e.mesh.position.z - pz);
                    if (d < nearestDist) { nearestDist = d; nearest = e; }
                }
                const dx = nearest.mesh.position.x - px, dz = nearest.mesh.position.z - pz;
                const len = Math.hypot(dx, dz) || 1;
                const dir = new THREE.Vector3(dx / len, 0, dz / len);
                const id = `ap-${now}-${Math.random().toString(36).slice(2)}`;
                const mesh = makeProjMesh(0xf72585);
                mesh.position.set(px + dir.x, 1, pz + dir.z);
                playerProjsRef.current.push({ id, mesh, dir, speed: AUTO_PROJ_SPEED, born: now, lifetime: PROJ_LIFETIME, damage: AUTO_PROJ_DAMAGE * (1 + (buff.level - 1) * 0.5) });
                engine.addObject({ id, mesh } as SceneObject);
            }
        }

        // ── Turret ────────────────────────────────────────────────────────────
        const turret = turretRef.current;
        if (turret) {
            const hpPct = turret.hp / turret.maxHp;
            const mat = turret.mesh.material as THREE.MeshStandardMaterial;
            mat.color.set(hpPct > 0.6 ? 0x06d6a0 : hpPct > 0.3 ? 0xffd166 : 0xe63946);

            if (enemiesRef.current.length > 0) {
                const tx = turret.mesh.position.x, tz = turret.mesh.position.z;
                let nearest: GameEnemy | null = null, nearestDist = TURRET_RANGE;
                for (const e of enemiesRef.current) {
                    const d = Math.hypot(e.mesh.position.x - tx, e.mesh.position.z - tz);
                    if (d < nearestDist) { nearestDist = d; nearest = e; }
                }
                const fireInterval = TURRET_FIRE_INTERVAL / (1 + (turret.level - 1) * 0.4);
                if (nearest && now - turret.lastShot > fireInterval) {
                    turret.lastShot = now;
                    const dx = nearest.mesh.position.x - tx, dz = nearest.mesh.position.z - tz;
                    const len = Math.hypot(dx, dz) || 1;
                    const dir = new THREE.Vector3(dx / len, 0, dz / len);
                    const id = `tp-${now}-${Math.random().toString(36).slice(2)}`;
                    const mesh = makeProjMesh(0x06d6a0);
                    mesh.position.set(tx + dir.x, 1.5, tz + dir.z);
                    playerProjsRef.current.push({ id, mesh, dir, speed: TURRET_PROJ_SPEED, born: now, lifetime: PROJ_LIFETIME, damage: TURRET_PROJ_DAMAGE * (1 + (turret.level - 1) * 0.4) });
                    engine.addObject({ id, mesh } as SceneObject);
                }
            }
        }

        // ── Player/turret projectiles ─────────────────────────────────────────
        playerProjsRef.current = playerProjsRef.current.filter(proj => {
            if (now - proj.born > proj.lifetime) { engine.removeObject(proj.id); return false; }
            proj.mesh.position.x += proj.dir.x * proj.speed * dt;
            proj.mesh.position.z += proj.dir.z * proj.speed * dt;
            for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
                const e = enemiesRef.current[i];
                if (Math.hypot(proj.mesh.position.x - e.mesh.position.x, proj.mesh.position.z - e.mesh.position.z) < e.radius + 0.3) {
                    e.hp -= proj.damage;
                    engine.removeObject(proj.id);
                    if (e.hp <= 0) { engine.removeObject(e.id); scoreRef.current += e.score; setGameScore(scoreRef.current); enemiesRef.current.splice(i, 1); }
                    return false;
                }
            }
            return true;
        });

        // ── Enemy projectiles ─────────────────────────────────────────────────
        enemyProjsRef.current = enemyProjsRef.current.filter(proj => {
            if (now - proj.born > proj.lifetime) { engine.removeObject(proj.id); return false; }
            proj.mesh.position.x += proj.dir.x * proj.speed * dt;
            proj.mesh.position.z += proj.dir.z * proj.speed * dt;

            // Hit player?
            if (Math.hypot(proj.mesh.position.x - px, proj.mesh.position.z - pz) < PLAYER_RADIUS + 0.25) {
                hpRef.current = Math.max(0, hpRef.current - proj.damage);
                setGameHp(hpRef.current);
                engine.removeObject(proj.id);
                if (hpRef.current <= 0) doGameOverRef.current();
                return false;
            }
            // Hit turret?
            const t = turretRef.current;
            if (t && Math.hypot(proj.mesh.position.x - t.mesh.position.x, proj.mesh.position.z - t.mesh.position.z) < 1.5) {
                t.hp -= proj.damage;
                setTurretHp(t.hp);
                engine.removeObject(proj.id);
                if (t.hp <= 0) { engine.removeObject(t.id); turretRef.current = null; setTurretHp(null); }
                return false;
            }
            return true;
        });

        if (!gameActiveRef.current) return;

        // ── Enemies ───────────────────────────────────────────────────────────
        const elapsed = (now - gameStartTimeRef.current) / 1000;
        for (const e of enemiesRef.current) {
            // Melee targets nearest of player/turret
            let tx = px, tz = pz;
            const t = turretRef.current;
            if (t && e.type === "melee") {
                const dP = Math.hypot(e.mesh.position.x - px, e.mesh.position.z - pz);
                const dT = Math.hypot(e.mesh.position.x - t.mesh.position.x, e.mesh.position.z - t.mesh.position.z);
                if (dT < dP) { tx = t.mesh.position.x; tz = t.mesh.position.z; }
            }

            const dx = tx - e.mesh.position.x, dz = tz - e.mesh.position.z;
            const dist = Math.hypot(dx, dz) || 0.001;

            if (e.type === "melee") {
                if (dist > 1.8) {
                    e.mesh.position.x += (dx / dist) * e.speed * dt;
                    e.mesh.position.z += (dz / dist) * e.speed * dt;
                } else if (now - e.lastShot > 900) {
                    e.lastShot = now;
                    // Attack turret if it's the target, else player
                    if (t && tx === t.mesh.position.x) {
                        t.hp -= e.damage; setTurretHp(t.hp);
                        if (t.hp <= 0) { engine.removeObject(t.id); turretRef.current = null; setTurretHp(null); }
                    } else {
                        hpRef.current = Math.max(0, hpRef.current - e.damage);
                        setGameHp(hpRef.current);
                        if (hpRef.current <= 0) { doGameOverRef.current(); return; }
                    }
                }
            } else {
                // Ranged always targets player
                const rdx = px - e.mesh.position.x, rdz = pz - e.mesh.position.z;
                const rdist = Math.hypot(rdx, rdz) || 0.001;
                const preferred = 9;
                if (rdist > preferred + 1) { e.mesh.position.x += (rdx / rdist) * e.speed * dt; e.mesh.position.z += (rdz / rdist) * e.speed * dt; }
                else if (rdist < preferred - 1) { e.mesh.position.x -= (rdx / rdist) * e.speed * dt; e.mesh.position.z -= (rdz / rdist) * e.speed * dt; }
                if (now - e.lastShot > e.shootInterval) {
                    e.lastShot = now;
                    const dir = new THREE.Vector3(rdx / rdist, 0, rdz / rdist);
                    const id = `ep-${now}-${Math.random().toString(36).slice(2)}`;
                    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.25, 6, 6), new THREE.MeshBasicMaterial({ color: 0xff4444 }));
                    mesh.position.set(e.mesh.position.x + dir.x, 1, e.mesh.position.z + dir.z);
                    enemyProjsRef.current.push({ id, mesh, dir, speed: ENEMY_PROJ_SPEED, born: now, lifetime: ENEMY_PROJ_LIFETIME, damage: e.damage });
                    engine.addObject({ id, mesh } as SceneObject);
                }
            }
        }

        // ── Meteors ───────────────────────────────────────────────────────────
        meteorsRef.current = meteorsRef.current.filter(m => {
            m.mesh.position.y -= METEOR_SPEED * dt;
            if (m.mesh.position.y <= 1) {
                for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
                    const e = enemiesRef.current[i];
                    if (Math.hypot(m.mesh.position.x - e.mesh.position.x, m.mesh.position.z - e.mesh.position.z) < METEOR_RADIUS + e.radius) {
                        e.hp -= METEOR_DAMAGE;
                        if (e.hp <= 0) { engine.removeObject(e.id); scoreRef.current += e.score; setGameScore(scoreRef.current); enemiesRef.current.splice(i, 1); }
                    }
                }
                engine.removeObject(m.id);
                return false;
            }
            return true;
        });

        // ── Mystery boxes: bob + proximity ────────────────────────────────────
        mysteryBoxesRef.current = mysteryBoxesRef.current.filter(box => {
            if (now - box.born > MYSTERY_BOX_LIFETIME) { engine.removeObject(box.id); return false; }
            box.mesh.position.y = 1 + Math.sin((now - box.born) / 500) * 0.3;
            box.mesh.rotation.y += 0.015;
            if (Math.hypot(box.mesh.position.x - px, box.mesh.position.z - pz) < MYSTERY_BOX_RADIUS) {
                engine.removeObject(box.id);
                gamePausedRef.current = true;
                setCardChoice(generateCards(buffRef.current, turretRef.current));
                return false;
            }
            return true;
        });

        // Spawn mystery box
        if (now >= nextBoxRef.current) {
            nextBoxRef.current = now + MYSTERY_BOX_INTERVAL;
            const angle = Math.random() * Math.PI * 2;
            const dist  = 5 + Math.random() * 12;
            const bx = Math.max(-GAME_WORLD_BOUNDS, Math.min(GAME_WORLD_BOUNDS, px + Math.cos(angle) * dist));
            const bz = Math.max(-GAME_WORLD_BOUNDS, Math.min(GAME_WORLD_BOUNDS, pz + Math.sin(angle) * dist));
            const id = `box-${now}-${Math.random().toString(36).slice(2)}`;
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(1.2, 1.2, 1.2),
                new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffd166, emissiveIntensity: 0.5 }),
            );
            mesh.position.set(bx, 1, bz);
            mysteryBoxesRef.current.push({ id, mesh, born: now });
            engine.addObject({ id, mesh } as SceneObject);
        }

        // ── Enemy spawn ───────────────────────────────────────────────────────
        if (now >= nextSpawnRef.current) {
            const difficulty = 1 + elapsed / 35;
            nextSpawnRef.current = now + Math.max(SPAWN_INTERVAL_MIN, SPAWN_INTERVAL_START - elapsed * 32);
            const def = ENEMY_DEFS[Math.floor(Math.random() * ENEMY_DEFS.length)];
            const angle = Math.random() * Math.PI * 2;
            const spawnDist = 18 + Math.random() * 4;
            const id = `en-${now}-${Math.random().toString(36).slice(2)}`;
            const size = def.type === "melee" ? 1.8 : 1.3;
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(size, size, size),
                new THREE.MeshStandardMaterial({ color: def.color }),
            );
            mesh.position.set(Math.cos(angle) * spawnDist, 1, Math.sin(angle) * spawnDist);
            enemiesRef.current.push({
                id, mesh,
                hp: Math.round(def.hp * difficulty),
                speed: Math.min(def.speed * Math.sqrt(difficulty), def.speed * 2.5),
                type: def.type,
                damage: Math.round(def.damage * difficulty),
                score: def.score, lastShot: 0, shootInterval: def.shootInterval, radius: def.radius,
            });
            engine.addObject({ id, mesh } as SceneObject);
        }
    }, []);

    // ── Start ──────────────────────────────────────────────────────────────────
    const startGame = useCallback(() => {
        if (gameActiveRef.current) return;
        hpRef.current = 100; scoreRef.current = 0;
        setGameHp(100); setGameScore(0); setGameOver(false);
        setCardChoice(null); setTurretHp(null); setActiveBuff(null);
        gameActiveRef.current = true;
        gamePausedRef.current = false;
        gameStartTimeRef.current = lastFrameRef.current = performance.now();
        nextSpawnRef.current = performance.now() + SPAWN_INTERVAL_START;
        nextBoxRef.current = performance.now() + MYSTERY_BOX_INTERVAL;

        // Spawn one box immediately at start
        const now0 = performance.now();
        const eng = engineRef.current;
        const mv0 = movableRef.current;
        if (eng && mv0) {
            const angle0 = Math.random() * Math.PI * 2;
            const bx0 = mv0.mesh.position.x + Math.cos(angle0) * 5;
            const bz0 = mv0.mesh.position.z + Math.sin(angle0) * 5;
            const id0 = `box-start-${now0}`;
            const mesh0 = new THREE.Mesh(
                new THREE.BoxGeometry(1.2, 1.2, 1.2),
                new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffd166, emissiveIntensity: 0.5 }),
            );
            mesh0.position.set(bx0, 1, bz0);
            mysteryBoxesRef.current.push({ id: id0, mesh: mesh0, born: now0 });
            eng.addObject({ id: id0, mesh: mesh0 } as SceneObject);
        }
        const sc = startCubeRef.current;
        if (sc) {
            const eng = engineRef.current;
            if (eng) { eng.removeObject(sc.sceneId); if (sc.labelId) eng.removeObject(sc.labelId); }
        }
    }, []);

    // ── Stop ───────────────────────────────────────────────────────────────────
    const stopGame = useCallback((engine: ThreeEngineHandle) => {
        if (!gameActiveRef.current) return;
        gameActiveRef.current = false;
        gamePausedRef.current = false;
        cleanupAllRef.current(engine);
        setGameOver(false); setCardChoice(null); setTurretHp(null); setActiveBuff(null);
        startCubeRef.current = null;
    }, []);

    // ── Pick card ──────────────────────────────────────────────────────────────
    const pickCard = useCallback((card: CardDef) => {
        applyCardRef.current(card);
    }, []);

    return {
        gameOver, gameHp, gameScore, bestScore,
        cardChoice, turretHp, activeBuff,
        setGameOver,
        startGame, stopGame, pickCard,
        startCubeRef,
        gameTick,
    };
}
