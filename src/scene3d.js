import * as THREE from 'three';

// 1. Hero Banner 3D Interactive Emblem
export class Hero3DBanner {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.init();
  }

  init() {
    this.resize();
    this.camera.position.set(0, 0, 7);

    // Setup Lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    this.scene.add(this.ambientLight);

    this.goldLight = new THREE.PointLight(0xf59e0b, 15, 50);
    this.goldLight.position.set(5, 5, 5);
    this.scene.add(this.goldLight);

    this.emeraldLight = new THREE.PointLight(0x10b981, 12, 50);
    this.emeraldLight.position.set(-5, -5, 5);
    this.scene.add(this.emeraldLight);

    // Build Hero 3D Emblem Object
    const group = new THREE.Group();

    // Central Faceted Octahedron
    const octGeo = new THREE.OctahedronGeometry(1.6, 0);
    this.octMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    const octMesh = new THREE.Mesh(octGeo, this.octMat);

    // Outer Wireframe Icosahedron Cage
    const icoGeo = new THREE.IcosahedronGeometry(2.2, 1);
    this.icoMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const icoMesh = new THREE.Mesh(icoGeo, this.icoMat);

    // Ring Accent (Unity Ring)
    const ringGeo = new THREE.TorusGeometry(2.7, 0.03, 16, 100);
    this.ringMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.7
    });
    const ringMesh = new THREE.Mesh(ringGeo, this.ringMat);
    ringMesh.rotation.x = Math.PI / 3;

    group.add(octMesh);
    group.add(icoMesh);
    group.add(ringMesh);

    this.scene.add(group);
    this.emblemGroup = group;

    // Mouse Listeners
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      this.mouse.targetY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    window.addEventListener('resize', this.resize.bind(this));

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    if (!this.canvas || !this.canvas.parentElement) return;
    const width = this.canvas.parentElement.clientWidth || 300;
    const height = 300;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  setTheme(theme) {
    if (theme === 'light') {
      this.ambientLight.intensity = 2.5;
      this.goldLight.color.setHex(0xd97706);
      if (this.octMat) this.octMat.color.setHex(0xd97706);
    } else {
      this.ambientLight.intensity = 1.8;
      this.goldLight.color.setHex(0xf59e0b);
      if (this.octMat) this.octMat.color.setHex(0xf59e0b);
    }
  }

  animate(timestamp) {
    requestAnimationFrame(this.animate);
    const time = timestamp * 0.001;

    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    if (this.emblemGroup) {
      this.emblemGroup.rotation.y = time * 0.5 + this.mouse.x * 0.5;
      this.emblemGroup.rotation.x = time * 0.3 + this.mouse.y * 0.5;
      this.emblemGroup.position.y = Math.sin(time * 1.5) * 0.15;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// 2. Research Banner 3D Interactive Symbol Viewer
export class Research3DBanner {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });

    this.currentMesh = null;
    this.activeNum = '8';

    this.init();
  }

  init() {
    this.resize();
    this.camera.position.set(0, 0, 5.5);

    // Setup Lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    this.scene.add(this.ambientLight);

    const pointLight = new THREE.PointLight(0xf59e0b, 20, 50);
    pointLight.position.set(4, 4, 4);
    this.scene.add(pointLight);

    // Initial Mesh (Node 8)
    this.loadSymbol('8');

    window.addEventListener('resize', this.resize.bind(this));

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    if (!this.canvas || !this.canvas.parentElement) return;
    const width = this.canvas.parentElement.clientWidth || 300;
    const height = 260;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  loadSymbol(num) {
    this.activeNum = num;
    if (this.currentMesh) {
      this.scene.remove(this.currentMesh);
    }

    let geo, mat;
    if (num === '1' || num === '7') {
      // Node 1: Torus Ring (Unity)
      geo = new THREE.TorusGeometry(1.2, 0.35, 16, 60);
      mat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0xd97706,
        emissiveIntensity: 0.3
      });
    } else if (num === '8') {
      // Node 8: TorusKnot (Shape of Eight - Timelessness)
      geo = new THREE.TorusKnotGeometry(0.9, 0.3, 120, 16, 2, 3);
      mat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.4
      });
    } else {
      // Node 40: Dodecahedron (Symbolic Resonance of Forty)
      geo = new THREE.DodecahedronGeometry(1.2, 0);
      mat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        metalness: 0.7,
        roughness: 0.3,
        wireframe: true
      });
    }

    this.currentMesh = new THREE.Mesh(geo, mat);
    this.scene.add(this.currentMesh);
  }

  setTheme(theme) {
    if (theme === 'light') {
      this.ambientLight.intensity = 2.8;
    } else {
      this.ambientLight.intensity = 2.0;
    }
  }

  animate(timestamp) {
    requestAnimationFrame(this.animate);
    const time = timestamp * 0.001;

    if (this.currentMesh) {
      this.currentMesh.rotation.y = time * 0.6;
      this.currentMesh.rotation.x = time * 0.4;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
