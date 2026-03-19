import { CardDef, CardType } from "./types";

// ── Mini-game constants ─────────────────────────────────────────────────────
export const PROJ_LIFETIME         = 3000;  // ms
export const ENEMY_PROJ_SPEED      = 7;
export const ENEMY_PROJ_LIFETIME   = 4500;
export const PLAYER_RADIUS         = 1.5;
export const SPAWN_INTERVAL_START  = 4000;  // ms
export const SPAWN_INTERVAL_MIN    = 1400;
export const BEST_SCORE_KEY        = "portfolio_best_score";
export const GAME_WORLD_BOUNDS     = 22;

// Mystery box
export const MYSTERY_BOX_INTERVAL  = 15000; // ms between spawns
export const MYSTERY_BOX_LIFETIME  = 35000; // ms before auto-despawn
export const MYSTERY_BOX_RADIUS    = 2.5;   // interaction distance

// Buff — orbital
export const ORBIT_COUNT      = 3;
export const ORBIT_RADIUS     = 3.2;
export const ORBIT_SPEED      = 1.8;   // rad/s
export const ORBIT_DAMAGE     = 20;
export const ORBIT_HIT_RADIUS = 0.65;
export const ORBIT_COOLDOWN   = 900;   // ms between hits on same enemy

// Buff — auto-fire
export const AUTO_FIRE_INTERVAL = 1600; // ms
export const AUTO_PROJ_DAMAGE   = 35;
export const AUTO_PROJ_SPEED    = 18;

// Turret
export const TURRET_HP            = 150;
export const TURRET_FIRE_INTERVAL = 2200; // ms
export const TURRET_PROJ_DAMAGE   = 40;
export const TURRET_PROJ_SPEED    = 16;
export const TURRET_RANGE         = 16;

// Meteor storm
export const METEOR_COUNT   = 30;
export const METEOR_DAMAGE  = 150;
export const METEOR_SPEED   = 30;
export const METEOR_RADIUS  = 3.0;
export const METEOR_START_Y = 30;

// ── Card definitions (display text is in translations.ts) ───────────────────
export const CARD_DEFS: Record<CardType, CardDef> = {
    temp:            { type: "temp",            color: "#ff6b35" },
    buff_orbit:      { type: "buff_orbit",      color: "#4cc9f0" },
    buff_auto:       { type: "buff_auto",       color: "#f72585" },
    building_turret: { type: "building_turret", color: "#06d6a0" },
    upgrade_orbit:   { type: "upgrade_orbit",   color: "#4cc9f0" },
    upgrade_auto:    { type: "upgrade_auto",    color: "#f72585" },
    upgrade_turret:  { type: "upgrade_turret",  color: "#06d6a0" },
};

// ── Enemy definitions ───────────────────────────────────────────────────────
export const ENEMY_DEFS = [
    { color: "#4cc9f0", hp: 30,  speed: 5,   type: "melee"  as const, damage: 15, score: 10, radius: 1.1, shootInterval: 0 },
    { color: "#f72585", hp: 20,  speed: 3,   type: "ranged" as const, damage: 12, score: 25, radius: 0.9, shootInterval: 2400 },
    { color: "#ff9f1c", hp: 80,  speed: 2.5, type: "melee"  as const, damage: 28, score: 40, radius: 1.4, shootInterval: 0 },
];
