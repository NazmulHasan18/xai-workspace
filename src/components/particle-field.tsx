"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const ACCENT_A = "#4fd1c5";
const ACCENT_B = "#A78BFA";
const MUTED = "#5B6472";

const KNOT_P = 2;
const KNOT_Q = 3;
const KNOT_R = 1.7;
const KNOT_R2 = 0.55;
const FLOW_SPEED = 0.06;
const TUMBLE_SPEED = 0.001;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function knotPoint(a: number, out: THREE.Vector3, rJitter = 0) {
  const r = KNOT_R2 + rJitter;
  out.x = (KNOT_R + r * Math.cos(KNOT_Q * a)) * Math.cos(KNOT_P * a);
  out.y = (KNOT_R + r * Math.cos(KNOT_Q * a)) * Math.sin(KNOT_P * a);
  out.z = r * Math.sin(KNOT_Q * a);
  return out;
}

function makeGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.55)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

type PointerState = { x: number; y: number; active: boolean };

type FieldProps = {
  count: number;
  progressRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<PointerState>;
  reducedMotion: boolean;
};

type FieldScene = {
  count: number;
  pointGeometry: THREE.BufferGeometry;
  pointMaterial: THREE.PointsMaterial;
  lineGeometry: THREE.BufferGeometry;
  lineMaterial: THREE.LineBasicMaterial;
  colorA: THREE.Color;
  colorB: THREE.Color;
  mutedColor: THREE.Color;
  scatter: Float32Array;
  angleOf: Float32Array;
  jitterR: Float32Array;
  jitterPhase: Float32Array;
  brightOf: Float32Array;
};

const sceneCache = new Map<number, FieldScene>();

function disposeScene(scene: FieldScene | null) {
  if (!scene) return;
  scene.pointGeometry.dispose();
  scene.pointMaterial.dispose();
  scene.lineGeometry.dispose();
  scene.lineMaterial.dispose();
}

function getScene(count: number): FieldScene {
  const existing = sceneCache.get(count);
  if (existing) return existing;

  const scatter = new Float32Array(count * 3);
  const angleOf = new Float32Array(count);
  const jitterR = new Float32Array(count);
  const jitterPhase = new Float32Array(count);
  const brightOf = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    scatter[i * 3 + 0] = (Math.random() - 0.5) * 9.5;
    scatter[i * 3 + 1] = (Math.random() - 0.5) * 5.6;
    scatter[i * 3 + 2] = (Math.random() - 0.5) * 3.4;

    angleOf[i] = (i / count) * Math.PI * 2;
    jitterR[i] = (Math.random() - 0.5) * 0.1;
    jitterPhase[i] = Math.random() * Math.PI * 2;
    brightOf[i] = Math.random() < 0.16 ? 1 : 0.32 + Math.random() * 0.3;
  }

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const pointGeometry = new THREE.BufferGeometry();
  pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pointGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const glowTexture = makeGlowTexture();
  const pointMaterial = new THREE.PointsMaterial({
    size: 0.15,
    map: glowTexture,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const segCount = Math.max(0, count - 1);
  const linePositions = new Float32Array(segCount * 2 * 3);
  const lineColors = new Float32Array(segCount * 2 * 3);
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const scene: FieldScene = {
    count,
    pointGeometry,
    pointMaterial,
    lineGeometry,
    lineMaterial,
    colorA: new THREE.Color(ACCENT_A),
    colorB: new THREE.Color(ACCENT_B),
    mutedColor: new THREE.Color(MUTED),
    scatter,
    angleOf,
    jitterR,
    jitterPhase,
    brightOf,
  };

  sceneCache.set(count, scene);

  return scene;
}

function Field({ count, progressRef, pointerRef, reducedMotion }: FieldProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const smoothPointer = useRef({ x: 0, y: 0 });
  const scratch = useRef(new THREE.Vector3()).current;
  const [scene] = useState(() => getScene(count));

  useEffect(() => {
    return () => {
      const cachedScene = sceneCache.get(count);
      disposeScene(cachedScene ?? null);
      sceneCache.delete(count);
    };
  }, [count]);

  useFrame((state) => {
    const scene = sceneCache.get(count);
    if (!scene) return;

    const t = progressRef.current;
    const time = state.clock.elapsedTime;
    const {
      pointGeometry,
      lineGeometry,
      lineMaterial,
      colorA,
      colorB,
      mutedColor,
      scatter,
      angleOf,
      jitterR,
      jitterPhase,
      brightOf,
    } = scene;

    const posAttr = pointGeometry.attributes.position as THREE.BufferAttribute;
    const colorAttr = pointGeometry.attributes.color as THREE.BufferAttribute;
    const linePosAttr = lineGeometry.attributes.position as THREE.BufferAttribute;
    const lineColorAttr = lineGeometry.attributes.color as THREE.BufferAttribute;

    const target = pointerRef.current;
    const smoothing = reducedMotion ? 1 : 0.055;
    smoothPointer.current.x = lerp(smoothPointer.current.x, target.active ? target.x : 0, smoothing);
    smoothPointer.current.y = lerp(smoothPointer.current.y, target.active ? target.y : 0, smoothing);

    const repelX = smoothPointer.current.x * 2.6;
    const repelY = -smoothPointer.current.y * 1.7;
    const repelRadius = 1.35;
    const repelStrength = target.active ? 0.55 : 0;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      const angle = angleOf[i] + (reducedMotion ? 0 : time * FLOW_SPEED);
      knotPoint(angle, scratch, jitterR[i]);

      let kx = scratch.x;
      let ky = scratch.y;
      const kz = scratch.z;

      const dx = kx - repelX;
      const dy = ky - repelY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < repelRadius && repelStrength > 0) {
        const push = (1 - dist / repelRadius) * repelStrength * t;
        const nx = dist > 0.0001 ? dx / dist : 0;
        const ny = dist > 0.0001 ? dy / dist : 0;
        kx += nx * push;
        ky += ny * push;
      }

      const breathe = reducedMotion ? 0 : Math.sin(time * 0.6 + jitterPhase[i]) * lerp(0.09, 0, t);

      posAttr.array[ix] = lerp(scatter[ix], kx, t) + breathe;
      posAttr.array[iy] = lerp(scatter[iy], ky, t) + breathe * 0.6;
      posAttr.array[iz] = lerp(scatter[iz], kz, t);

      const hue = (angleOf[i] / (Math.PI * 2) + time * 0.01) % 1;
      const flowMix = 0.5 + 0.5 * Math.sin(hue * Math.PI * 2);
      const resolved = colorA.clone().lerp(colorB, flowMix).multiplyScalar(brightOf[i]);
      const c = mutedColor.clone().lerp(resolved, t);
      colorAttr.array[ix] = c.r;
      colorAttr.array[iy] = c.g;
      colorAttr.array[iz] = c.b;

      if (i < count - 1) {
        const li = i * 2 * 3;
        linePosAttr.array[li] = posAttr.array[ix];
        linePosAttr.array[li + 1] = posAttr.array[iy];
        linePosAttr.array[li + 2] = posAttr.array[iz];
        lineColorAttr.array[li] = c.r;
        lineColorAttr.array[li + 1] = c.g;
        lineColorAttr.array[li + 2] = c.b;
      }
      if (i > 0) {
        const li = (i - 1) * 2 * 3 + 3;
        linePosAttr.array[li] = posAttr.array[ix];
        linePosAttr.array[li + 1] = posAttr.array[iy];
        linePosAttr.array[li + 2] = posAttr.array[iz];
        lineColorAttr.array[li] = c.r;
        lineColorAttr.array[li + 1] = c.g;
        lineColorAttr.array[li + 2] = c.b;
      }
    }

    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
    linePosAttr.needsUpdate = true;
    lineColorAttr.needsUpdate = true;
    lineMaterial.opacity = 0.16 * t;

    if (groupRef.current) {
      const auto = reducedMotion ? 0 : time * TUMBLE_SPEED * t;
      const parallaxY = smoothPointer.current.x * 0.35;
      const parallaxX = -smoothPointer.current.y * 0.22;
      groupRef.current.rotation.y = auto + parallaxY;
      groupRef.current.rotation.x = (reducedMotion ? 0 : Math.sin(time * 0.08) * 0.05 * t) + parallaxX;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={scene.lineGeometry} material={scene.lineMaterial} />
      <points geometry={scene.pointGeometry} material={scene.pointMaterial} />
    </group>
  );
}

function ScrollRig({
  containerRef,
  progressRef,
  pointerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
  progressRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<PointerState>;
}) {
  const { gl } = useThree();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateProgress = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = (vh * 0.9 - rect.top) / (vh * 0.9 + rect.height * 0.6);
      progressRef.current = clamp01(raw);
    };

    const updatePointer = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      pointerRef.current.x = nx;
      pointerRef.current.y = ny;
      pointerRef.current.active = true;
    };

    const clearPointer = () => {
      pointerRef.current.active = false;
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("pointerleave", clearPointer);
    document.addEventListener("mouseleave", clearPointer);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerleave", clearPointer);
      document.removeEventListener("mouseleave", clearPointer);
    };
  }, [containerRef, progressRef, pointerRef]);

  useEffect(() => {
    gl.setClearColor(0x000000, 0);
  }, [gl]);

  return null;
}

export function ParticleField({
  className,
  rows = 9,
  cols = 14,
}: {
  className?: string;
  rows?: number;
  cols?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null!);
  const progressRef = useRef(0);
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, active: false });
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const count = rows * cols;

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
        <ScrollRig containerRef={containerRef} progressRef={progressRef} pointerRef={pointerRef} />
        <Field
          key={count}
          count={count}
          progressRef={progressRef}
          pointerRef={pointerRef}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
}
