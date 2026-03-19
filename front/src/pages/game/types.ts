import * as THREE from "three";

export interface GameEnemy {
    id:            string;
    mesh:          THREE.Mesh;
    hp:            number;
    speed:         number;
    type:          "melee" | "ranged";
    damage:        number;
    score:         number;
    lastShot:      number;
    shootInterval: number;
    radius:        number;
}

export interface GameProjectile {
    id:       string;
    mesh:     THREE.Mesh;
    dir:      THREE.Vector3;
    speed:    number;
    born:     number;
    lifetime: number;
    damage:   number;
}

export interface GameMysteryBox {
    id:   string;
    mesh: THREE.Mesh;
    born: number;
}

export interface OrbitProjectile {
    id:             string;
    mesh:           THREE.Mesh;
    damageCooldown: Map<string, number>;
}

export interface GameBuff {
    type:         "orbit" | "auto";
    level:        number;
    orbits:       OrbitProjectile[];
    orbitAngle:   number;
    lastAutoShot: number;
}

export interface GameTurret {
    id:       string;
    mesh:     THREE.Mesh;
    hp:       number;
    maxHp:    number;
    level:    number;
    lastShot: number;
}

export interface GameMeteor {
    id:   string;
    mesh: THREE.Mesh;
}

export type CardType =
    | "temp"
    | "buff_orbit"
    | "buff_auto"
    | "building_turret"
    | "upgrade_orbit"
    | "upgrade_auto"
    | "upgrade_turret";

export interface CardDef {
    type:  CardType;
    color: string;
}

export interface StartCubeInfo {
    sceneId:   string;
    mesh:      THREE.Mesh;
    labelId:   string | null;
    labelMesh: THREE.Object3D | null;
}
