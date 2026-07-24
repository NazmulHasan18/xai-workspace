import * as THREE from "three";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import gsap from "gsap";

export interface ClusterEngineOptions {
  lineCount?: number;
  accentColor?: string;
  mutedColor?: string;
  inkColor?: string;
}

const DEFAULTS: Required<ClusterEngineOptions> = {
  lineCount: 340,
  accentColor: "#4fd1c5",
  mutedColor: "#8b96a5",
  inkColor: "#0e1116",
};

interface LineDatum {
  dir: THREE.Vector3; // resting "signal" direction from the apex
  length: number;
  seed: number; // per-line randomness for noise + timing offsets
  tip: boolean; // does this line get a highlighted dot at its tip
  chaosStart: THREE.Vector3;
  chaosEnd: THREE.Vector3;
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export class ClusterEngine {
  private container: HTMLElement;
  private opts: Required<ClusterEngineOptions>;

  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  private noise = new SimplexNoise();
  private startTime = performance.now() * 0.001;
  private lastFrameTime = this.startTime;

  private group = new THREE.Group();
  private lineData: LineDatum[] = [];
  private lineGeometry = new THREE.BufferGeometry();
  private linePositions!: Float32Array;
  private lineColors!: Float32Array;

  private tipIndices: number[] = [];
  private pointGeometry = new THREE.BufferGeometry();
  private pointPositions!: Float32Array;
  private pointSizes!: Float32Array;
  private tipTexture: THREE.CanvasTexture | null = null;

  private apex = new THREE.Vector3(0, -0.2, 0);
  private apexTarget = new THREE.Vector3(0, -0.2, 0);
  private restApex = new THREE.Vector3(0, -0.2, 0);

  private pointerNDC = new THREE.Vector2(0, 0);
  private pointerWorldTarget = new THREE.Vector3();
  private pointerWorld = new THREE.Vector3();
  private prevPointerWorld = new THREE.Vector3();
  private velocity = new THREE.Vector3();
  private raycaster = new THREE.Raycaster();
  private plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  private order = 0; // 0 = dispersed chaos, 1 = organized signal
  private active = false;
  private introProgress = 0; // 0 -> 1 on mount

  private rafId = 0;
  private disposed = false;

  constructor(container: HTMLElement, options: ClusterEngineOptions = {}) {
    this.container = container;
    this.opts = { ...DEFAULTS, ...options };

    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;

    this.camera = new THREE.PerspectiveCamera(42, (width / height) * 0.6, 0.1, 100);
    this.camera.position.set(0, 0.05, 6.2);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 0);
    if ("outputColorSpace" in this.renderer) {
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
    container.appendChild(this.renderer.domElement);

    this.scene.add(this.group);
    this.buildLines();
    this.buildTips();

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.3, 0.2, 0.1);
    this.composer.addPass(bloom);

    this.playIntro();
    this.animate();
  }

  /** Builds the radiating line set: a hemispherical fan of spokes from a shared apex. */
  private buildLines() {
    const { lineCount, accentColor, mutedColor } = this.opts;
    const accent = new THREE.Color(accentColor);
    const muted = new THREE.Color(mutedColor);
    // Keep the shared apex from becoming a hot spot when the field locks on.
    const apexTint = muted.clone().lerp(accent, 0.02);
    const bright = apexTint.clone().lerp(new THREE.Color("#ffffff"), 0.01);

    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < lineCount; i++) {
      const t = i / lineCount;
      const theta = i * goldenAngle;
      // bias elevation so most spokes fan upward/outward, a few reach near-vertical
      const phi = Math.pow(t, 0.72) * (Math.PI / 2.05);
      const jitterTheta = (this.hash(i) - 0.5) * 0.35;

      const dir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta + jitterTheta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta + jitterTheta) * 0.55,
      ).normalize();

      const length = 1.1 + this.hash(i * 7.31) * 2.3 + (this.hash(i * 13.7) > 0.92 ? 1.1 : 0);

      const chaosStart = new THREE.Vector3(
        (this.hash(i * 2.1) - 0.5) * 6,
        (this.hash(i * 3.7) - 0.5) * 4.5,
        (this.hash(i * 5.3) - 0.5) * 3,
      );
      const chaosEnd = chaosStart
        .clone()
        .add(
          new THREE.Vector3(
            (this.hash(i * 9.1) - 0.5) * 1.4,
            (this.hash(i * 11.3) - 0.5) * 1.4,
            (this.hash(i * 6.6) - 0.5) * 1.4,
          ),
        );

      const isTip = i % 2 === 0;
      this.lineData.push({ dir, length, seed: this.hash(i * 4.2), tip: isTip, chaosStart, chaosEnd });
      if (isTip) this.tipIndices.push(i);
    }

    this.linePositions = new Float32Array(lineCount * 2 * 3);
    this.lineColors = new Float32Array(lineCount * 2 * 3);

    for (let i = 0; i < lineCount; i++) {
      const c0 = bright;
      const c1 = accent.clone().lerp(muted, 0.35 + this.lineData[i].seed * 0.3);
      this.lineColors.set([c0.r, c0.g, c0.b], i * 6);
      this.lineColors.set([c1.r, c1.g, c1.b], i * 6 + 3);
    }

    this.lineGeometry.setAttribute("position", new THREE.BufferAttribute(this.linePositions, 3));
    this.lineGeometry.setAttribute("color", new THREE.BufferAttribute(this.lineColors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const mesh = new THREE.LineSegments(this.lineGeometry, material);
    this.group.add(mesh);
  }

  /** Bright point sprites at a subset of tips, matching the varied dot sizes in the reference. */
  private buildTips() {
    const count = this.tipIndices.length;
    this.pointPositions = new Float32Array(count * 3);
    this.pointSizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const seed = this.lineData[this.tipIndices[i]].seed;
      this.pointSizes[i] = 3 + seed * 7;
    }

    this.pointGeometry.setAttribute("position", new THREE.BufferAttribute(this.pointPositions, 3));
    this.pointGeometry.setAttribute("pointSize", new THREE.BufferAttribute(this.pointSizes, 1));

    this.tipTexture = this.createGlowTexture();

    const material = new THREE.PointsMaterial({
      color: new THREE.Color(this.opts.accentColor).lerp(new THREE.Color("#ffffff"), 0.22),
      size: 1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 1.25,
      map: this.tipTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      alphaTest: 0.02,
    });
    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "attribute float pointSize;\n#include <common>")
        .replace("gl_PointSize = size;", "gl_PointSize = pointSize * size * 0.03;");
    };

    const points = new THREE.Points(this.pointGeometry, material);
    this.group.add(points);
  }

  private createGlowTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Unable to create glow texture canvas context.");
    }

    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.18, "rgba(180,255,250,0.95)");
    gradient.addColorStop(0.38, "rgba(79,209,197,0.5)");
    gradient.addColorStop(0.68, "rgba(79,209,197,0.14)");
    gradient.addColorStop(1, "rgba(79,209,197,0)");

    context.clearRect(0, 0, 128, 128);
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    return texture;
  }

  private hash(n: number) {
    const s = Math.sin(n * 12.9898) * 43758.5453;
    return s - Math.floor(s);
  }

  private playIntro() {
    gsap.fromTo(
      this,
      { introProgress: 0 },
      { introProgress: 1, duration: 1.6, delay: 0.15, ease: "power3.out" },
    );
    gsap.to(this.group.scale, { x: 1, y: 1, z: 1, duration: 1.6, delay: 0.15, ease: "back.out(1.4)" });
    this.group.scale.setScalar(0.001);
  }

  setPointer(ndcX: number, ndcY: number) {
    this.pointerNDC.set(ndcX, ndcY);
  }

  setActive(active: boolean) {
    if (this.active === active) return;
    this.active = active;
    gsap.to(this, {
      order: active ? 1 : 0,
      duration: active ? 0.9 : 1.4,
      ease: active ? "power3.out" : "power2.inOut",
    });
  }

  resize(width: number, height: number) {
    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  }

  private updatePointerWorld() {
    this.raycaster.setFromCamera(this.pointerNDC, this.camera);
    this.raycaster.ray.intersectPlane(this.plane, this.pointerWorldTarget);
    // keep the apex from wandering off past the visible spread
    this.pointerWorldTarget.x = clamp(this.pointerWorldTarget.x, -2.6, 2.6);
    this.pointerWorldTarget.y = clamp(this.pointerWorldTarget.y, -1.6, 1.9);
  }

  private animate = () => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.animate);
    const now = performance.now() * 0.001;
    const delta = Math.min(now - this.lastFrameTime, 0.05);
    this.lastFrameTime = now;
    const elapsed = now - this.startTime;

    this.updatePointerWorld();
    const pointerFollow = 1 - Math.exp(-delta * 16);
    this.pointerWorld.lerp(this.pointerWorldTarget, pointerFollow);
    this.velocity.subVectors(this.pointerWorld, this.prevPointerWorld);
    this.prevPointerWorld.copy(this.pointerWorld);

    // apex target: cursor when locked on, a slow idle drift otherwise
    if (this.active) {
      this.apexTarget.copy(this.pointerWorld);
    } else {
      this.apexTarget.set(
        this.restApex.x + Math.sin(elapsed * 0.25) * 0.35,
        this.restApex.y + Math.cos(elapsed * 0.2) * 0.15,
        this.restApex.z,
      );
    }
    this.apex.lerp(this.apexTarget, 1 - Math.pow(0.001, delta));

    // gentle whole-field rotation, settles down when locked on
    this.group.rotation.y += delta * 0.06 * (1 - this.order * 0.85);

    const order = this.order * this.introProgress;
    const posAttr = this.lineGeometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < this.lineData.length; i++) {
      const d = this.lineData[i];
      const wobble = this.noise.noise(d.seed * 10, elapsed * 0.35 + d.seed * 4) * (0.16 - order * 0.11);
      const stretch = 1 + clamp(this.velocity.length() * 2.2, 0, 0.18) * order;

      const orderedStart = this.apex;
      const orderedEnd = this.apex
        .clone()
        .add(d.dir.clone().multiplyScalar(d.length * this.introProgress * stretch))
        .add(new THREE.Vector3(wobble, wobble * 0.6, wobble * 0.4));

      const sx = THREE.MathUtils.lerp(d.chaosStart.x, orderedStart.x, order);
      const sy = THREE.MathUtils.lerp(d.chaosStart.y, orderedStart.y, order);
      const sz = THREE.MathUtils.lerp(d.chaosStart.z, orderedStart.z, order);
      const ex = THREE.MathUtils.lerp(d.chaosEnd.x, orderedEnd.x, order);
      const ey = THREE.MathUtils.lerp(d.chaosEnd.y, orderedEnd.y, order);
      const ez = THREE.MathUtils.lerp(d.chaosEnd.z, orderedEnd.z, order);

      posAttr.setXYZ(i * 2, sx, sy, sz);
      posAttr.setXYZ(i * 2 + 1, ex, ey, ez);
    }
    posAttr.needsUpdate = true;

    const pointPosAttr = this.pointGeometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < this.tipIndices.length; i++) {
      const idx = this.tipIndices[i] * 2 + 1;
      pointPosAttr.setXYZ(i, posAttr.getX(idx), posAttr.getY(idx), posAttr.getZ(idx));
    }
    pointPosAttr.needsUpdate = true;

    this.composer.render();
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    gsap.killTweensOf(this);
    gsap.killTweensOf(this.group.scale);
    this.lineGeometry.dispose();
    this.pointGeometry.dispose();
    this.tipTexture?.dispose();
    this.group.traverse((obj) => {
      if (obj instanceof THREE.LineSegments || obj instanceof THREE.Points) {
        (obj.material as THREE.Material).dispose();
      }
    });
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
