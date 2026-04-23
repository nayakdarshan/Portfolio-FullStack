import {
  Component, ElementRef, ViewChild, AfterViewInit, OnDestroy,
  Input, PLATFORM_ID, inject, NgZone
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero-canvas',
  standalone: true,
  template: `<canvas #canvas class="hero-canvas"></canvas>`,
  styles: [`
    .hero-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }
  `]
})
export class HeroCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private platform = inject(PLATFORM_ID);
  private zone = inject(NgZone);

  private scene: any;
  private camera: any;
  private renderer: any;
  private meshes: any[] = [];
  private stars: any;
  private rafId!: number;
  private mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  private resizeObs!: ResizeObserver;

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platform)) return;
    if (window.innerWidth < 768) return; // CPU-safe: desktop only

    const THREE = await import('three');
    this.initScene(THREE);
  }

  private initScene(THREE: any): void {
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(w, h, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setClearColor(0x000000, 0);

    // Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 200);
    this.camera.position.z = 8;

    // ── Wireframe Icosahedra ─────────────────────────────────────
    const icosaConfigs = [
      { color: 0x06B6D4, size: 2.2, pos: [3.5, 1.2, -2], speed: 0.004 },
      { color: 0xEC4899, size: 1.6, pos: [-3.8, -1.5, -3], speed: -0.006 },
      { color: 0xF97316, size: 1.2, pos: [0.8, -2.8, -1.5], speed: 0.008 },
    ];

    icosaConfigs.forEach(cfg => {
      const geo = new THREE.IcosahedronGeometry(cfg.size, 1);
      const edges = new THREE.EdgesGeometry(geo);
      const mat = new THREE.LineBasicMaterial({
        color: cfg.color, transparent: true, opacity: 0.25
      });
      const mesh = new THREE.LineSegments(edges, mat);
      mesh.position.set(...cfg.pos as [number, number, number]);
      mesh.userData = { speed: cfg.speed, basePos: [...cfg.pos] };
      this.scene.add(mesh);
      this.meshes.push(mesh);
    });

    // ── Starfield ────────────────────────────────────────────────
    const starCount = 1800;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 80;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff, size: 0.06, transparent: true, opacity: 0.5, sizeAttenuation: true,
    });
    this.stars = new THREE.Points(starGeo, starMat);
    this.scene.add(this.stars);

    // ── Mouse parallax ────────────────────────────────────────────
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    // ── Resize ────────────────────────────────────────────────────
    this.resizeObs = new ResizeObserver(() => this.onResize(THREE));
    this.resizeObs.observe(canvas);

    // ── Animate ───────────────────────────────────────────────────
    this.zone.runOutsideAngular(() => this.animate());
  }

  private animate(): void {
    this.rafId = requestAnimationFrame(() => this.animate());

    // Smooth mouse interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;

    // Rotate meshes
    this.meshes.forEach(mesh => {
      mesh.rotation.x += mesh.userData.speed;
      mesh.rotation.y += mesh.userData.speed * 0.7;
      // Mouse parallax offset
      mesh.position.x = mesh.userData.basePos[0] + this.mouse.x * 0.3;
      mesh.position.y = mesh.userData.basePos[1] + this.mouse.y * 0.3;
    });

    // Slowly rotate star field
    if (this.stars) {
      this.stars.rotation.y += 0.0002;
      this.stars.rotation.x += 0.0001;
    }

    this.renderer?.render(this.scene, this.camera);
  }

  private onResize(THREE: any): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || !this.renderer) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.resizeObs?.disconnect();
    this.renderer?.dispose();
    this.meshes.forEach(m => {
      m.geometry?.dispose();
      m.material?.dispose();
    });
  }
}
