import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ApiObject {
    id: number;
    label: string;
    geometry: "box" | "sphere" | "cylinder" | "gltf";
    color: string;
    x: number;
    y: number;
    z: number;
    movable: boolean;
    face: string;
    model_url?: string;
    path?: string;
    rx?: number;
    ry?: number;
    rz?: number;
    subtitle?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export const _gltfLoader = new GLTFLoader();

export const DEG = Math.PI / 180;

export function buildPrimitive(obj: ApiObject): THREE.Mesh {
    let geo: THREE.BufferGeometry;
    if (obj.geometry === "sphere") geo = new THREE.SphereGeometry(1.2, 32, 32);
    else if (obj.geometry === "cylinder")
        geo = new THREE.CylinderGeometry(0.8, 0.8, 3, 32);
    else geo = new THREE.BoxGeometry(2, 2, 2);
    return new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({ color: obj.color }),
    );
}

export function applyTransform(model: THREE.Object3D, obj: ApiObject) {
    model.position.set(obj.x, obj.y, obj.z);
    model.rotation.set(
        (obj.rx ?? 0) * DEG,
        (obj.ry ?? 0) * DEG,
        (obj.rz ?? 0) * DEG,
    );
}

export function makeLabel(name: string, subtitle: string): THREE.Sprite {
    const NAME_FS = 30;
    const SUB_FS  = 20;
    const PAD_X   = 36;
    const PAD_Y   = 14;

    // Measure text to size canvas tightly
    const tmp = document.createElement("canvas").getContext("2d")!;
    tmp.font = `bold ${NAME_FS}px sans-serif`;
    const nameW = tmp.measureText(name).width;
    tmp.font = `${SUB_FS}px sans-serif`;
    const subW = subtitle ? tmp.measureText(subtitle).width : 0;

    const W = Math.max(nameW, subW) + PAD_X * 2;
    const H = subtitle ? NAME_FS + SUB_FS + PAD_Y * 3 : NAME_FS + PAD_Y * 2;

    const canvas = document.createElement("canvas");
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // Rounded background
    const r = 10;
    ctx.fillStyle = "rgba(8, 8, 24, 0.88)";
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(W - r, 0);
    ctx.quadraticCurveTo(W, 0, W, r);
    ctx.lineTo(W, H - r);
    ctx.quadraticCurveTo(W, H, W - r, H);
    ctx.lineTo(r, H);
    ctx.quadraticCurveTo(0, H, 0, H - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(120, 160, 255, 0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Name
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = `bold ${NAME_FS}px sans-serif`;
    ctx.fillText(name, W / 2, PAD_Y);

    // Subtitle
    if (subtitle) {
        ctx.fillStyle = "rgba(160, 190, 255, 0.65)";
        ctx.font = `${SUB_FS}px sans-serif`;
        ctx.fillText(subtitle, W / 2, PAD_Y + NAME_FS + PAD_Y * 0.5);
    }

    const WORLD_PX = 5.8 / 512;
    const mat = new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(canvas),
        transparent: true,
        depthTest: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(W * WORLD_PX, H * WORLD_PX, 1);
    return sprite;
}

export function buildObject(obj: ApiObject): Promise<THREE.Object3D> {
    if (obj.model_url) {
        return new Promise((resolve) => {
            _gltfLoader.load(
                obj.model_url!,
                (gltf) => {
                    const model = gltf.scene;
                    applyTransform(model, obj);
                    // Keep original GLTF materials — color tinting would override baked textures
                    resolve(model);
                },
                undefined,
                () => resolve(buildPrimitive({ ...obj, color: "#ff00ff" })), // magenta fallback
            );
        });
    }
    if (obj.movable) {
        const size = 1.4;
        const geo = new THREE.BoxGeometry(size, size, size);
        const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: obj.color }));
        const edges = new THREE.LineSegments(
            new THREE.EdgesGeometry(geo),
            new THREE.LineBasicMaterial({ color: 0x000000 }),
        );
        const group = new THREE.Group();
        group.add(mesh, edges);
        applyTransform(group, obj);
        return Promise.resolve(group);
    }
    const mesh = buildPrimitive(obj);
    const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(mesh.geometry),
        new THREE.LineBasicMaterial({ color: 0x000000 }),
    );
    mesh.add(edges);
    applyTransform(mesh, obj);
    return Promise.resolve(mesh);
}

/** Flat X marker visible from top-down camera */
export function makeCrossMarker(pos: THREE.Vector3): THREE.Group {
    const mat = new THREE.MeshBasicMaterial({
        color: 0xff2222,
        side: THREE.DoubleSide,
    });
    const geo = new THREE.BoxGeometry(1.4, 0.14, 0.22);
    const bar1 = new THREE.Mesh(geo, mat);
    bar1.rotation.y = Math.PI / 4;
    const bar2 = new THREE.Mesh(geo, mat);
    bar2.rotation.y = -Math.PI / 4;
    const group = new THREE.Group();
    group.add(bar1, bar2);
    group.position.set(pos.x, pos.y + 3.5, pos.z);
    return group;
}
