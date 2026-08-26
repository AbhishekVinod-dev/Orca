"use client";

import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, useTexture, Points, PointMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { useAppStore } from '../../lib/store';

// Helper to convert lat/lon to 3D Cartesian coordinates
function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));
  
  return new THREE.Vector3(x, y, z);
}

// Camera Controller
function CameraController() {
  const { globeTarget } = useAppStore();
  const { camera } = useThree();
  
  useFrame(() => {
    if (globeTarget) {
      // Lerp camera position towards the target coordinates
      const targetPos = latLongToVector3(globeTarget.lat, globeTarget.lon, 10); // Distance of 10 from center
      camera.position.lerp(targetPos, 0.05);
      camera.lookAt(0, 0, 0);
    }
  });
  
  return null;
}

// Create a subtle starfield
function Starfield() {
  const count = 2000;
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

// Interactive Earth
function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const { globeTarget } = useAppStore();
  const [colorMap] = useTexture(['/earth-colored.jpg']);

  useFrame((state) => {
    if (earthRef.current && !globeTarget) {
      // Only auto-rotate if there's no specific target we are looking at
      earthRef.current.rotation.y = state.clock.elapsedTime * 0.02; 
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

      {/* Demo Cyclone Alert */}
      <group position={latLongToVector3(13.5, 83.5, 5.05)}>
        <mesh>
           <sphereGeometry args={[0.2, 16, 16]} />
           <meshBasicMaterial color="#f43f5e" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
        </mesh>
        <Html center zIndexRange={[100, 0]} className="pointer-events-none whitespace-nowrap" position={[0, -0.4, 0]}>
           <div className="bg-space-950/90 backdrop-blur-md border border-rose-500/50 text-rose-400 px-2 py-1 rounded shadow-xl font-bold tracking-wide text-[10px]">
              SEVERE CYCLONIC STORM
           </div>
        </Html>
      </group>

      {/* Demo Algal Bloom */}
      <group position={latLongToVector3(9.5, 75.5, 5.05)}>
        <mesh>
           <sphereGeometry args={[0.1, 16, 16]} />
           <meshBasicMaterial color="#10b981" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
        </mesh>
        <Html center zIndexRange={[100, 0]} className="pointer-events-none whitespace-nowrap" position={[0, -0.3, 0]}>
           <div className="bg-space-950/90 backdrop-blur-md border border-teal-500/50 text-teal-400 px-2 py-1 rounded shadow-xl font-bold tracking-wide text-[10px]">
              HARMFUL ALGAL BLOOM
           </div>
        </Html>
      </group>

      {/* Demo Mining Zone */}
      <group position={latLongToVector3(11.0, 74.5, 5.05)}>
        <mesh>
           <sphereGeometry args={[0.08, 16, 16]} />
           <meshBasicMaterial color="#f59e0b" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>
        <Html center zIndexRange={[100, 0]} className="pointer-events-none whitespace-nowrap" position={[0, -0.3, 0]}>
           <div className="bg-space-950/90 backdrop-blur-md border border-amber-500/50 text-amber-500 px-2 py-1 rounded shadow-xl font-bold tracking-wide text-[10px]">
              AUTHORIZED MINING ZONE
           </div>
        </Html>
      </group>

      {/* Dynamic Target Marker and Tooltip */}
      {globeTarget && (
        <group position={latLongToVector3(globeTarget.lat, globeTarget.lon, 5.05)}>
          <mesh>
             <sphereGeometry args={[0.08, 16, 16]} />
             <meshBasicMaterial color={globeTarget.severity === 'critical' ? '#f43f5e' : globeTarget.severity === 'warning' ? '#f59e0b' : '#14B8A6'} />
          </mesh>
          <mesh>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshBasicMaterial color={globeTarget.severity === 'critical' ? '#f43f5e' : globeTarget.severity === 'warning' ? '#f59e0b' : '#14B8A6'} transparent opacity={0.4} blending={THREE.AdditiveBlending} />
          </mesh>
          
          {globeTarget.title && (
            <Html center zIndexRange={[100, 0]} className="pointer-events-none" position={[0, -0.3, 0]}>
               <div className="bg-space-950/90 backdrop-blur-md border border-space-800 p-4 rounded-md w-72 shadow-2xl pointer-events-auto transition-transform hover:scale-105 mt-4">
                 <div className="flex items-center gap-2 mb-2">
                   {globeTarget.severity === 'critical' && <AlertTriangle size={16} className="text-rose-500" />}
                   {globeTarget.severity === 'warning' && <AlertTriangle size={16} className="text-amber-500" />}
                   {(globeTarget.severity === 'info' || !globeTarget.severity) && <Info size={16} className="text-cyan-500" />}
                   <span className="text-white font-medium text-sm leading-tight">{globeTarget.title}</span>
                 </div>
                 {globeTarget.desc && <p className="text-slate-400 text-xs line-clamp-3">{globeTarget.desc}</p>}
               </div>
            </Html>
          )}
        </group>
      )}
    </group>
  );
}

export function InteractiveGlobe() {
  const { globeTarget } = useAppStore();

  return (
    <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing bg-space-950">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={3.0} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1.0} color="#06B6D4" />
        
        <CameraController />
        <Starfield />
        
        <Suspense fallback={null}>
          <Earth />
        </Suspense>
        
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={6}
          maxDistance={20}
          autoRotate={!globeTarget}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Crosshair Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
         <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center">
           <div className="w-1 h-1 bg-white/30 rounded-full"></div>
         </div>
      </div>
    </div>
  );
}
