"use client";

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, useTexture, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Create a subtle starfield
function Starfield() {
  const count = 1500;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 25 + Math.random() * 20;
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#ffffff" size={0.03} sizeAttenuation={true} depthWrite={false} opacity={0.3} />
    </Points>
  );
}

// Create the elegant Earth
function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const [colorMap] = useTexture(['/earth-colored.jpg']);

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={earthRef}>
      {/* Base Earth - Realistic Texture */}
      <Sphere args={[5, 64, 64]}>
        <meshStandardMaterial 
          map={colorMap}
          metalness={0.1}
          roughness={0.6}
          color="#ffffff" 
        />
      </Sphere>
      
      {/* Subtle Atmosphere Edge Glow */}
      <Sphere args={[5.05, 64, 64]}>
        <meshBasicMaterial 
          color="#06B6D4" 
          transparent 
          opacity={0.05} 
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Satellite Orbit */}
      <SatelliteOrbit />
    </group>
  );
}

function SatelliteOrbit() {
  const satRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (satRef.current) {
      satRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      satRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.2;
    }
  });

  return (
    <group ref={satRef}>
      {/* Subtle Orbit Path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.18, 6.2, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>
      
      {/* The Satellite Point */}
      <mesh position={[6.2, 0, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
        {/* Glow */}
        <mesh>
           <sphereGeometry args={[0.1, 16, 16]} />
           <meshBasicMaterial color="#06B6D4" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
        </mesh>
      </mesh>
    </group>
  );
}

export function LandingGlobe3D() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 0, 14], fov: 45 }}>
        <ambientLight intensity={1.5} />
        {/* Main light from left */}
        <directionalLight position={[-10, 5, 10]} intensity={3.0} color="#ffffff" />
        {/* Subtle rim light from right/back */}
        <directionalLight position={[10, -5, -10]} intensity={1.0} color="#06B6D4" />
        
        <Starfield />
        
        <Suspense fallback={null}>
          <Earth />
        </Suspense>
        
        <OrbitControls 
          enablePan={false}
          enableZoom={false} // Disable zoom for landing page to keep composition
          minDistance={10}
          maxDistance={20}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
