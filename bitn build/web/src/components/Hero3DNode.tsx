"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Cpu, ShieldCheck, Sparkles, Orbit, Eye, Zap, Flame } from "lucide-react";

export default function Hero3DNode() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"lattice" | "orbit" | "core" | "byzantine">("lattice");
  const [isHovered, setIsHovered] = useState(false);
  const [signalsProved, setSignalsProved] = useState(42);
  const [shockwaveActive, setShockwaveActive] = useState(false);
  const [metrics] = useState({ r1cs: 2543, curve: "BN254", gasSaved: "95%" });

  // Store mutable state for animation loop
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Group to hold all objects for mouse/drag rotation
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Outer Icosahedron Wireframe (BN254 Field Lattice - Electric Cobalt)
    const icosaGeometry = new THREE.IcosahedronGeometry(2.3, 1);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x2563eb, // Cobalt Blue
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const icosaMesh = new THREE.Mesh(icosaGeometry, wireframeMaterial);
    mainGroup.add(icosaMesh);

    // 2. Secondary Dodecahedron (Proof Constraints Boundary - Royal Violet)
    const dodecaGeometry = new THREE.DodecahedronGeometry(1.8, 0);
    const dodecaMaterial = new THREE.MeshBasicMaterial({
      color: 0x7c3aed, // Royal Violet
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const dodecaMesh = new THREE.Mesh(dodecaGeometry, dodecaMaterial);
    mainGroup.add(dodecaMesh);

    // 3. Central Glowing Core (Poseidon Hash State - Signal Emerald)
    const coreGeometry = new THREE.OctahedronGeometry(0.85, 2);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x059669, // Deep Emerald
      emissive: 0x047857,
      emissiveIntensity: 0.9,
      roughness: 0.15,
      metalness: 0.85,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreMesh);

    // 4. Orbiting Rings (Worker Consensus Ring)
    const ringGroup = new THREE.Group();
    mainGroup.add(ringGroup);

    const ringGeometry = new THREE.TorusGeometry(2.8, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0.8,
    });
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeometry, new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      transparent: true,
      opacity: 0.7,
    }));
    ring2.rotation.y = Math.PI / 4;
    ringGroup.add(ring2);

    // 5. Worker Orbit Nodes (3 floating data shards)
    const workerNodes: THREE.Mesh[] = [];
    const shardGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const shardColors = [0x2563eb, 0x059669, 0xd97706];
    for (let i = 0; i < 3; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: shardColors[i],
        emissive: shardColors[i],
        emissiveIntensity: 0.8,
      });
      const node = new THREE.Mesh(shardGeometry, mat);
      ringGroup.add(node);
      workerNodes.push(node);
    }

    // 6. Particle Constellation (Cryptographic Field Elements)
    const particleCount = 280;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x2563eb);
    const color2 = new THREE.Color(0x7c3aed);
    const color3 = new THREE.Color(0x059669);

    for (let i = 0; i < particleCount; i++) {
      const r = 1.5 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const mixedColor = Math.random() > 0.6 ? color1 : Math.random() > 0.3 ? color2 : color3;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(particles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x2563eb, 3.5, 15);
    cyanLight.position.set(3, 4, 3);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0x7c3aed, 3, 15);
    purpleLight.position.set(-3, -3, -2);
    scene.add(purpleLight);

    const emeraldLight = new THREE.PointLight(0x059669, 2.5, 10);
    emeraldLight.position.set(0, 0, 0);
    scene.add(emeraldLight);

    // Drag and Parallax Tracking
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;
    let shockwaveIntensity = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
        targetRotationY += deltaX * 0.01;
        targetRotationX += deltaY * 0.01;
      } else {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetRotationY = x * 0.6;
        targetRotationX = -y * 0.6;
      }
    };

    const handleClick = () => {
      shockwaveIntensity = 1.0;
      setShockwaveActive(true);
      setTimeout(() => setShockwaveActive(false), 500);
      setSignalsProved((prev) => prev + 1);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("click", handleClick);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop using performance.now() (avoids deprecated THREE.Clock warning)
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;
      const currentMode = modeRef.current;

      // Smooth mouse follow
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      // Handle shockwave decay
      if (shockwaveIntensity > 0) {
        shockwaveIntensity = Math.max(0, shockwaveIntensity - 0.03);
        const bump = 1 + shockwaveIntensity * 0.3;
        mainGroup.scale.set(bump, bump, bump);
      } else {
        mainGroup.scale.set(1, 1, 1);
      }

      // Mode-specific visual orchestration
      if (currentMode === "core") {
        camera.position.z += (5.2 - camera.position.z) * 0.05;
        coreMaterial.color.setHex(0x10b981);
        coreMaterial.emissive.setHex(0x059669);
        coreMaterial.emissiveIntensity = 1.6 + Math.sin(elapsedTime * 4) * 0.4;
        wireframeMaterial.opacity = 0.15;
      } else if (currentMode === "orbit") {
        camera.position.z += (6.8 - camera.position.z) * 0.05;
        coreMaterial.emissiveIntensity = 0.7;
        wireframeMaterial.opacity = 0.25;
        ringMaterial.opacity = 0.85;
      } else if (currentMode === "byzantine") {
        camera.position.z += (6.4 - camera.position.z) * 0.05;
        coreMaterial.color.setHex(0xef4444);
        coreMaterial.emissive.setHex(0xdc2626);
        coreMaterial.emissiveIntensity = 1.8 + Math.sin(elapsedTime * 8) * 0.6;
        wireframeMaterial.color.setHex(0xf43f5e);
        wireframeMaterial.opacity = 0.6;
      } else {
        // Lattice mode
        camera.position.z += (7.0 - camera.position.z) * 0.05;
        coreMaterial.color.setHex(0x10b981);
        coreMaterial.emissive.setHex(0x059669);
        coreMaterial.emissiveIntensity = 0.8;
        wireframeMaterial.color.setHex(0x06b6d4);
        wireframeMaterial.opacity = 0.35;
      }

      mainGroup.rotation.x = currentRotationX + Math.sin(elapsedTime * 0.3) * 0.08;
      mainGroup.rotation.y = currentRotationY + elapsedTime * (currentMode === "orbit" ? 0.4 : 0.2) + (shockwaveIntensity * 0.1);

      // Rotate sub-geometries
      icosaMesh.rotation.x = elapsedTime * 0.15;
      icosaMesh.rotation.y = -elapsedTime * 0.2;

      dodecaMesh.rotation.y = elapsedTime * 0.25;
      dodecaMesh.rotation.z = -elapsedTime * 0.15;

      // Pulse core
      const pulseSpeed = currentMode === "byzantine" ? 6 : currentMode === "core" ? 4 : 2.5;
      const pulse = 1 + Math.sin(elapsedTime * pulseSpeed) * 0.1;
      coreMesh.scale.set(pulse, pulse, pulse);
      coreMesh.rotation.x = -elapsedTime * 0.4;
      coreMesh.rotation.y = elapsedTime * 0.5;

      // Move worker orbit nodes
      workerNodes.forEach((node, idx) => {
        const speedMultiplier = currentMode === "orbit" ? 1.8 : 1.0;
        const angle = elapsedTime * (0.8 + idx * 0.2) * speedMultiplier + (idx * Math.PI * 2) / 3;
        const radius = 2.8;
        node.position.x = Math.cos(angle) * radius;
        node.position.z = Math.sin(angle) * radius;
        node.position.y = Math.sin(angle * 2) * 0.6;
      });

      // Rotate particles
      particles.rotation.y = -elapsedTime * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      icosaGeometry.dispose();
      dodecaGeometry.dispose();
      coreGeometry.dispose();
      ringGeometry.dispose();
      shardGeometry.dispose();
      particleGeometry.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className="relative w-full h-[520px] rounded-3xl overflow-hidden flex items-center justify-center cursor-pointer select-none bg-gradient-to-b from-slate-50 to-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background blueprint grid on white */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none opacity-80" />

      {/* Tactical Corner Crosshairs */}
      <span className="absolute top-3 left-3 text-slate-400 font-mono text-sm select-none z-10 pointer-events-none">+</span>
      <span className="absolute top-3 right-3 text-slate-400 font-mono text-sm select-none z-10 pointer-events-none">+</span>
      <span className="absolute bottom-3 left-3 text-slate-400 font-mono text-sm select-none z-10 pointer-events-none">+</span>
      <span className="absolute bottom-3 right-3 text-slate-400 font-mono text-sm select-none z-10 pointer-events-none">+</span>

      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Floating Info Badges with Crisp Light Glassmorphism */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-[11px] font-mono text-blue-700 shadow-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          <span>BN254 Groth16 Field</span>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-[11px] font-mono text-purple-700 shadow-sm font-semibold">
          <Cpu className="w-3.5 h-3.5 text-purple-600" />
          <span>{metrics.r1cs} R1CS Constraints</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-emerald-300 text-[11px] font-mono text-emerald-800 shadow-sm font-semibold">
          <Zap className="w-3.5 h-3.5 text-emerald-600" />
          <span>Signals Proved: {signalsProved}</span>
        </div>
        <div className="text-[10px] font-mono text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200 shadow-xs">
          [COORDS: X:0 Y:0 Z:7.0]
        </div>
      </div>

      {/* Interactive Mode Control Buttons */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-white p-1.5 rounded-full border-2 border-slate-950 shadow-[4px_4px_0px_#0f172a]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMode("lattice");
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-extrabold transition-all duration-200 cursor-pointer ${
            mode === "lattice"
              ? "bg-blue-600 text-white shadow-[2px_2px_0px_#0f172a]"
              : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>ZK Lattice</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMode("orbit");
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-extrabold transition-all duration-200 cursor-pointer ${
            mode === "orbit"
              ? "bg-purple-600 text-white shadow-[2px_2px_0px_#0f172a]"
              : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
          }`}
        >
          <Orbit className="w-3.5 h-3.5" />
          <span>Worker Mesh</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMode("core");
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-extrabold transition-all duration-200 cursor-pointer ${
            mode === "core"
              ? "bg-emerald-500 text-slate-950 shadow-[2px_2px_0px_#0f172a]"
              : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Poseidon Core</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMode("byzantine");
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-extrabold transition-all duration-200 cursor-pointer ${
            mode === "byzantine"
              ? "bg-rose-500 text-white shadow-[2px_2px_0px_#0f172a]"
              : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Byzantine Vector</span>
        </button>
      </div>

      {/* Floating Shockwave Feedback */}
      {shockwaveActive && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex flex-col items-center animate-ping">
          <span className="text-xs font-mono font-black text-white bg-blue-600 px-3 py-1 rounded-full shadow-lg">
            +1 ZK SIGNAL SYNTHESIZED
          </span>
        </div>
      )}

      {/* Hover prompt */}
      <div
        className={`absolute bottom-16 text-[10px] font-mono tracking-widest text-slate-500 uppercase transition-opacity duration-300 pointer-events-none ${
          isHovered ? "opacity-100" : "opacity-60"
        }`}
      >
        Click to emit shockwave &bull; Drag cursor to rotate in 3D
      </div>
    </div>
  );
}
