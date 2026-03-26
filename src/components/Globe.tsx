import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { Destination } from "@/data/mockData";

// Convert lat/lng to 3D position on sphere
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Approximate lat/lng for our destinations
const COORDS: Record<string, [number, number]> = {
  goa: [15.4, 73.9],
  manali: [32.2, 77.2],
  kerala: [10.9, 76.3],
  jaipur: [26.9, 75.8],
  andaman: [11.7, 92.7],
  thailand: [13.8, 100.5],
  dubai: [25.2, 55.3],
  vietnam: [14.1, 108.3],
  singapore: [1.3, 103.8],
  bali: [-8.3, 115.1],
  turkey: [41.0, 28.9],
};

function GlobeMesh({ destinations, onSelect, selectedId }: {
  destinations: Destination[];
  onSelect: (d: Destination) => void;
  selectedId?: string;
}) {
  const globeRef = useRef<THREE.Mesh>(null);
  const markersRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.06;
    }
    if (markersRef.current) {
      markersRef.current.rotation.y += delta * 0.06;
    }
  });

  const wireframeMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color("hsl(199, 89%, 48%)"),
    wireframe: true,
    transparent: true,
    opacity: 0.08,
  }), []);

  const surfaceMat = useMemo(() => new THREE.MeshPhongMaterial({
    color: new THREE.Color("hsl(222, 47%, 11%)"),
    transparent: true,
    opacity: 0.85,
    shininess: 15,
  }), []);

  return (
    <>
      {/* Globe surface */}
      <Sphere ref={globeRef} args={[2, 64, 64]}>
        <primitive object={surfaceMat} attach="material" />
      </Sphere>
      {/* Wireframe overlay */}
      <Sphere args={[2.01, 32, 32]}>
        <primitive object={wireframeMat} attach="material" />
      </Sphere>
      {/* Atmosphere glow */}
      <Sphere args={[2.15, 32, 32]}>
        <meshBasicMaterial color="hsl(199, 89%, 48%)" transparent opacity={0.04} side={THREE.BackSide} />
      </Sphere>

      {/* Markers */}
      <group ref={markersRef}>
        {destinations.map((dest) => {
          const coords = COORDS[dest.id];
          if (!coords) return null;
          const pos = latLngToVector3(coords[0], coords[1], 2.05);
          const isSelected = selectedId === dest.id;
          return (
            <group key={dest.id} position={pos}>
              <mesh
                onClick={(e) => { e.stopPropagation(); onSelect(dest); }}
                onPointerOver={(e) => { (e.object as any).scale.set(1.5, 1.5, 1.5); document.body.style.cursor = 'pointer'; }}
                onPointerOut={(e) => { (e.object as any).scale.set(1, 1, 1); document.body.style.cursor = 'auto'; }}
              >
                <sphereGeometry args={[isSelected ? 0.08 : 0.05, 16, 16]} />
                <meshBasicMaterial color={isSelected ? "hsl(172, 66%, 50%)" : "hsl(199, 89%, 48%)"} />
              </mesh>
              {/* Pulse ring */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.08, 0.12, 32]} />
                <meshBasicMaterial color="hsl(199, 89%, 48%)" transparent opacity={isSelected ? 0.6 : 0.3} side={THREE.DoubleSide} />
              </mesh>
            </group>
          );
        })}
      </group>
    </>
  );
}

interface GlobeProps {
  destinations: Destination[];
  onSelect: (d: Destination) => void;
  selectedId?: string;
  className?: string;
}

export default function Globe({ destinations, onSelect, selectedId, className = "" }: GlobeProps) {
  return (
    <div className={`globe-canvas ${className}`}>
      <Canvas camera={{ position: [0, 0, 5.5], fov: 42 }} dpr={[1, 2]}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={0.8} />
        <pointLight position={[-5, -3, -5]} intensity={0.3} color="hsl(172, 66%, 50%)" />
        <GlobeMesh destinations={destinations} onSelect={onSelect} selectedId={selectedId} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI * 3 / 4}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
