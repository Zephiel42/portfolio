import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SceneObject, ThreeEngineHandle, ThreeEngineProps } from "./types";
import {
    createScene,
    createCamera,
    createRenderer,
    addLighting,
    createGround,
    createInnerGround,
    createFaceLights,
    createBoundary,
    FACE_LIGHTS_ENABLED,
} from "./sceneSetup";

export type { SceneObject, ThreeEngineHandle };

const GROUND_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

function findSceneId(obj: THREE.Object3D): string | undefined {
    let cur: THREE.Object3D | null = obj;
    while (cur) {
        if (cur.userData.sceneId) return cur.userData.sceneId as string;
        cur = cur.parent;
    }
    return undefined;
}

export default function ThreeEngine({
    onReady,
    onGroundClick,
    onMeshClick,
    onRightClick,
    cameraBounds = 25,
    style,
}: ThreeEngineProps) {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // --- Setup ---
        const scene = createScene();
        const camera = createCamera(mount.clientWidth / mount.clientHeight);
        const renderer = createRenderer(mount);
        addLighting(scene);

        const ground = createGround();
        const innerGround = createInnerGround(cameraBounds);
        const boundary = createBoundary(cameraBounds);
        const faceLights = createFaceLights();
        scene.add(ground, innerGround, boundary);
        faceLights.forEach((light) => scene.add(light));

        // --- Object registry ---
        const objects = new Map<string, SceneObject>();

        // --- Animation loop ---
        let frameId = 0;
        const frameCallbackRef = { current: null as (() => void) | null };
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            camera.lookAt(camera.position.x, 0, camera.position.z);
            frameCallbackRef.current?.();
            renderer.render(scene, camera);
        };
        animate();

        // --- Input ---
        const drag = {
            active: false,
            lastX: 0,
            lastY: 0,
            startX: 0,
            startY: 0,
            moved: false,
            button: 0,
        };
        const clamp = (v: number) =>
            Math.max(-cameraBounds, Math.min(cameraBounds, v));

        const onMouseDown = (e: MouseEvent) => {
            drag.active = true;
            drag.lastX = drag.startX = e.clientX;
            drag.lastY = drag.startY = e.clientY;
            drag.moved = false;
            drag.button = e.button;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!drag.active) return;
            camera.position.x = clamp(
                camera.position.x - (e.clientX - drag.lastX) * 0.05,
            );
            camera.position.z = clamp(
                camera.position.z - (e.clientY - drag.lastY) * 0.05,
            );
            drag.lastX = e.clientX;
            drag.lastY = e.clientY;
            const dx = e.clientX - drag.startX,
                dy = e.clientY - drag.startY;
            if (dx * dx + dy * dy > 16) drag.moved = true;
        };

        const onMouseUp = (e: MouseEvent) => {
            if (!drag.active) return;
            if (!drag.moved) {
                const rect = mount.getBoundingClientRect();
                const ndc = new THREE.Vector2(
                    ((e.clientX - rect.left) / mount.clientWidth) * 2 - 1,
                    ((e.clientY - rect.top) / mount.clientHeight) * -2 + 1,
                );
                const ray = new THREE.Raycaster();
                ray.setFromCamera(ndc, camera);

                // Right-click: raycast ground and call onRightClick
                if (drag.button === 2) {
                    const gp = new THREE.Vector3();
                    if (
                        ray.ray.intersectPlane(GROUND_PLANE, gp) &&
                        onRightClick
                    )
                        onRightClick(gp);
                    drag.active = false;
                    return;
                }

                const hits = ray.intersectObjects(
                    Array.from(objects.values()).map((o) => o.mesh),
                    true,
                );
                if (hits.length > 0) {
                    const id = findSceneId(hits[0].object);
                    if (id && onMeshClick) {
                        onMeshClick(id, hits[0].point);
                        drag.active = false;
                        return;
                    }
                }

                const gp = new THREE.Vector3();
                if (ray.ray.intersectPlane(GROUND_PLANE, gp) && onGroundClick)
                    onGroundClick(gp);
            }
            drag.active = false;
        };

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            camera.position.y = Math.max(
                2,
                Math.min(100, camera.position.y + e.deltaY * 0.05),
            );
        };

        const onResize = () => {
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        onResize();

        const onContextMenu = (e: Event) => e.preventDefault();

        // --- Touch input ---
        let lastPinchDist = 0;

        const onTouchStart = (e: TouchEvent) => {
            e.preventDefault();
            if (e.touches.length === 1) {
                const t = e.touches[0];
                drag.active = true;
                drag.lastX = drag.startX = t.clientX;
                drag.lastY = drag.startY = t.clientY;
                drag.moved = false;
                drag.button = 0;
            } else if (e.touches.length === 2) {
                drag.active = false;
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                lastPinchDist = Math.sqrt(dx * dx + dy * dy);
            }
        };

        const onTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            if (e.touches.length === 1 && drag.active) {
                const t = e.touches[0];
                camera.position.x = clamp(camera.position.x - (t.clientX - drag.lastX) * 0.05);
                camera.position.z = clamp(camera.position.z - (t.clientY - drag.lastY) * 0.05);
                const dx = t.clientX - drag.startX, dy = t.clientY - drag.startY;
                if (dx * dx + dy * dy > 16) drag.moved = true;
                drag.lastX = t.clientX;
                drag.lastY = t.clientY;
            } else if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                camera.position.y = Math.max(2, Math.min(100, camera.position.y - (dist - lastPinchDist) * 0.1));
                lastPinchDist = dist;
            }
        };

        const onTouchEnd = (e: TouchEvent) => {
            if (e.touches.length > 0) return;
            if (drag.active && !drag.moved) {
                const rect = mount.getBoundingClientRect();
                const t = e.changedTouches[0];
                const ndc = new THREE.Vector2(
                    ((t.clientX - rect.left) / mount.clientWidth) * 2 - 1,
                    ((t.clientY - rect.top) / mount.clientHeight) * -2 + 1,
                );
                const ray = new THREE.Raycaster();
                ray.setFromCamera(ndc, camera);
                const hits = ray.intersectObjects(Array.from(objects.values()).map(o => o.mesh), true);
                if (hits.length > 0) {
                    const id = findSceneId(hits[0].object);
                    if (id && onMeshClick) { onMeshClick(id, hits[0].point); drag.active = false; return; }
                }
                const gp = new THREE.Vector3();
                if (ray.ray.intersectPlane(GROUND_PLANE, gp) && onGroundClick) onGroundClick(gp);
            }
            drag.active = false;
        };

        mount.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        mount.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("resize", onResize);
        mount.addEventListener("contextmenu", onContextMenu);
        mount.addEventListener("touchstart", onTouchStart, { passive: false });
        mount.addEventListener("touchmove", onTouchMove, { passive: false });
        mount.addEventListener("touchend", onTouchEnd);

        // --- Handle ---
        onReady?.({
            addObject: (obj) => {
                obj.mesh.userData.sceneId = obj.id;
                objects.set(obj.id, obj);
                scene.add(obj.mesh);
            },
            removeObject: (id) => {
                const o = objects.get(id);
                if (o) {
                    scene.remove(o.mesh);
                    objects.delete(id);
                }
            },
            getScene: () => scene,
            resetCamera: () => {
                camera.position.set(0, 20, 0);
            },
            setFaceLit: (face, lit) => {
                if (!FACE_LIGHTS_ENABLED) return;
                const light = faceLights.get(face);
                if (light) light.intensity = lit ? 55 : 0;
            },
            setFrameCallback: (fn) => {
                frameCallbackRef.current = fn;
            },
            zoom: (delta) => {
                camera.position.y = Math.max(2, Math.min(100, camera.position.y + delta));
            },
        });

        return () => {
            cancelAnimationFrame(frameId);
            mount.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            mount.removeEventListener("wheel", onWheel);
            window.removeEventListener("resize", onResize);
            mount.removeEventListener("contextmenu", onContextMenu);
            mount.removeEventListener("touchstart", onTouchStart);
            mount.removeEventListener("touchmove", onTouchMove);
            mount.removeEventListener("touchend", onTouchEnd);
            renderer.dispose();
            if (mount.contains(renderer.domElement))
                mount.removeChild(renderer.domElement);
        };
    }, [onReady, onGroundClick, onMeshClick, onRightClick, cameraBounds]);

    return (
        <div
            ref={mountRef}
            style={{ width: "100%", height: "100%", cursor: "grab", ...style }}
        />
    );
}
