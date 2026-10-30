import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import CosmicBackground from './CosmicBackground';
// import ShivaPresence from './ShivaPresence';
import CentralSanctuary from './CentralSanctuary';
import { ISLAND_COMPONENTS } from './Islands';
import { ISLANDS, type SectionId } from '../data/portfolio';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface SceneProps {
  activeId: SectionId | null;
  hoveredId: SectionId | null;
  onHover: (id: SectionId | null) => void;
  onSelect: (id: SectionId) => void;
  reducedMotion: boolean;
}

/** A fixed, slightly elevated frontal three-quarter camera. */
function RigCamera({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0.25, 0), []);
  useFrame((state) => {
    // Gentle parallax based on pointer; neutralize when reduced motion.
    const px = reducedMotion ? 0 : state.pointer.x * 1.2;
    const py = reducedMotion ? 0 : state.pointer.y * 0.7;
    const camX = 0 + px * 0.6;
    const camY = 2.0 + py * 0.28;
    // Pull back enough to keep all six islands comfortably inside the frame.
    const camZ = 20.5;
    camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.04);
    camera.lookAt(target);
  });
  return null;
}

/** Invisible clickable/hoverable proxy over each island for stable hit area. */
function IslandProxy({
  id,
  position,
  hover,
  onHover,
  onSelect,
}: {
  id: SectionId;
  position: [number, number, number];
  hover: boolean;
  onHover: (id: SectionId | null) => void;
  onSelect: (id: SectionId) => void;
}) {
  const Component = ISLAND_COMPONENTS[id];
  return (
    <group position={position}>
      <Component hover={hover} />
      
      <mesh
  position={id === 'about' ? [-2, 2, 0] : [0, 0, 0]}
  visible={false}
  onPointerOver={(e) => {
    e.stopPropagation();
    onHover(id);
    document.body.style.cursor = 'pointer';
  }}
  onPointerOut={(e) => {
    e.stopPropagation();
    onHover(null);
    document.body.style.cursor = 'auto';
  }}
  onClick={(e) => {
    e.stopPropagation();
    onSelect(id);
  }}
>
  <sphereGeometry args={[3.0, 24, 24]} />
  <meshBasicMaterial transparent opacity={0} />
</mesh>
      {hover && (
  <mesh position={[-2, 2, 0]}>
    <sphereGeometry args={[2.2, 16, 16]} />
    <meshBasicMaterial
      color="#6fd0e6"
      transparent
      opacity={0.06}
      depthWrite={false}
    />
  </mesh>
)}
    </group>
  );
}

function SceneContents({ activeId, hoveredId, onHover, onSelect, reducedMotion }: SceneProps) {
  const ambient = useRef<THREE.AmbientLight>(null);
  return (
    <>
      <ambientLight ref={ambient} intensity={0.42} color="#aab9e0" />
      {/* Key cool fill */}
      <directionalLight position={[-6, 8, 6]} intensity={0.72} color="#9fc4e8" />
      {/* Warm accent */}
      <directionalLight position={[6, 4, 4]} intensity={0.38} color="#c8a86a" />

      <CosmicBackground />
      {/* <ShivaPresence /> */}
      <CentralSanctuary />

      {ISLANDS.map((isl) => (
        <IslandProxy
          key={isl.id}
          id={isl.id}
          position={isl.position}
          hover={hoveredId === isl.id}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}

      <RigCamera reducedMotion={reducedMotion} />
    </>
  );
}

export default function Scene(props: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
      camera={{ position: [0, 2.0, 20.5], fov: 42, near: 0.1, far: 200 }}
      onCreated={({ gl }) => {
        gl.setClearColor('#04050b', 1);
      }}
    >
      <Suspense fallback={null}>
        <SceneContents {...props} />
      </Suspense>
    </Canvas>
  );
}
