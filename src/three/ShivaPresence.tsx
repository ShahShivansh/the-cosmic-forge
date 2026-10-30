import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A monumental, peaceful meditating Shiva-inspired presence emerging from
 * cosmic mist behind the central sanctuary. Built procedurally — a serene
 * face silhouette with closed eyes, a natural topknot, crescent-moon detail,
 * and tripundra-inspired forehead markings. Rim-lit in cool blue-white,
 * dissolving into the nebula.
 *
 * Respectful, contemplative. No aggressive form, weapons, or flames.
 */

function FaceSculpt() {
  // Build a face using a displaced, smoothed icosahedron + additive features.
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(5.2, 6);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();

    // Carve a meditating face: eyes, nose, cheeks, brow, lips, jaw.
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const x = v.x;
      const y = v.y;
      const z = v.z;

      // Pull the front (z+) forward into a calm face plane; round the back.
      const front = Math.max(0, z) / 5.2;

      // Cheekbones: gentle outward bulge
      const cheek = Math.exp(-((y + 0.4) ** 2) / 1.2) * Math.exp(-((x - 1.8) ** 2) / 1.4) * 0.18;
      const cheekL = Math.exp(-((y + 0.4) ** 2) / 1.2) * Math.exp(-((x + 1.8) ** 2) / 1.4) * 0.18;

      // Brow ridge: subtle
      const brow = Math.exp(-((y - 1.0) ** 2) / 0.5) * Math.exp(-((x - 1.0) ** 2) / 1.2) * 0.1;
      const browL = Math.exp(-((y - 1.0) ** 2) / 0.5) * Math.exp(-((x + 1.0) ** 2) / 1.2) * 0.1;

      // Nose bridge
      const nose = Math.exp(-(x * x) / 0.18) * Math.exp(-((y - 0.1) ** 2) / 2.2) * 0.32 * front;

      // Closed-eye hollows (gentle depressions)
      const eyeR = Math.exp(-((y - 0.85) ** 2) / 0.3) * Math.exp(-((x - 1.25) ** 2) / 0.4) * 0.12;
      const eyeL = Math.exp(-((y - 0.85) ** 2) / 0.3) * Math.exp(-((x + 1.25) ** 2) / 0.4) * 0.12;

      // Lips: small calm ridge
      const lips = Math.exp(-(x * x) / 0.6) * Math.exp(-((y + 1.2) ** 2) / 0.12) * 0.05 * front;

      // Chin/jaw narrowing
      const jaw = Math.max(0, y + 1.6) * 0.05;
      const jawNarrow = 1 - Math.max(0, y + 1.2) / 3.5 * 0.35;

      v.z += nose + brow + browL + lips - eyeR - eyeL;
      v.x += (cheek + cheekL) - jaw * 0.2;
      v.x *= jawNarrow;
      v.y -= jaw * 0.4;

      // Soft overall rounding
      v.multiplyScalar(1 + front * 0.04);

      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const material = useMemo(() => {
    // Misty dark stone with subtle subsurface blue-white rim.
    return new THREE.MeshStandardMaterial({
      color: '#0b0e1c',
      roughness: 0.85,
      metalness: 0.15,
      emissive: '#1a2a44',
      emissiveIntensity: 0.06,
      transparent: true,
      opacity: 0.92,
    });
  }, []);

  return <mesh geometry={geometry} material={material} position={[0, 4.6, -7.5]} />;
}

function Topknot() {
  // A natural matted-topknot bun above the head.
  return (
    <mesh position={[0, 9.4, -7.2]}>
      <torusKnotGeometry args={[1.1, 0.42, 80, 12, 2, 3]} />
      <meshStandardMaterial color="#0a0c18" roughness={0.9} metalness={0.1} />
    </mesh>
  );
}

function CrescentMoon() {
  // Subtle crescent in the topknot.
  return (
    <mesh position={[0.9, 10.0, -6.6]} rotation={[0.2, 0.4, 0]}>
      <sphereGeometry args={[0.34, 24, 24, Math.PI * 0.55, Math.PI * 0.9]} />
      <meshStandardMaterial
        color="#d8e6f5"
        roughness={0.3}
        metalness={0.4}
        emissive="#7fa8d0"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

function Tripundra() {
  // Three thin horizontal forehead markings + a vertical bindu dot, drawn as
  // small dark strips. Restrained, symbolic, not garish.
  const mats = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c8a86a',
        roughness: 0.5,
        metalness: 0.5,
        emissive: '#5a4416',
        emissiveIntensity: 0.25,
      }),
    [],
  );
  const lines: Array<{ y: number; w: number }> = [
    { y: 2.05, w: 1.4 },
    { y: 2.35, w: 1.4 },
    { y: 2.65, w: 1.4 },
  ];
  return (
    <group position={[0, 4.6, -7.5]}>
      {lines.map((l, i) => (
        <mesh key={i} position={[0, l.y, 4.6]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[l.w, 0.05, 0.04]} />
          <primitive object={mats} attach="material" />
        </mesh>
      ))}
      {/* bindu dot */}
      <mesh position={[0, 2.5, 4.62]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <primitive object={mats} attach="material" />
      </mesh>
    </group>
  );
}

function RimLight() {
  return (
    <>
      <spotLight
        position={[-8, 7, -4]}
        angle={0.7}
        penumbra={1}
        intensity={22}
        color="#9fc4e8"
        distance={40}
        target-position={[0, 4.5, -7]}
      />
      <spotLight
        position={[8, 6, -4]}
        angle={0.7}
        penumbra={1}
        intensity={14}
        color="#c8a86a"
        distance={40}
        target-position={[0, 4.5, -7]}
      />
    </>
  );
}

/** A soft mist plane drifting in front of the face to dissolve the silhouette. */
function MistVeil() {
  const ref = useRef<THREE.Mesh>(null);
  const material = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    g.addColorStop(0, 'rgba(120,150,210,0.45)');
    g.addColorStop(0.5, 'rgba(60,80,150,0.18)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({
      map: t,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.6,
    });
  }, []);

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.z += dt * 0.02;
      const s = 22 + Math.sin(performance.now() * 0.0003) * 1.2;
      ref.current.scale.set(s, s, 1);
    }
  });

  return (
    <mesh ref={ref} position={[0, 4.5, -5.5]} material={material}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

export default function ShivaPresence() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (group.current) {
      // Very slow, almost-imperceptible breathing drift.
      group.current.position.y = Math.sin(performance.now() * 0.00018) * 0.12;
      void dt;
    }
  });
  return (
    <group ref={group} position={[0, 0.2, -1.2]} scale={0.68}>
      <FaceSculpt />
      <Topknot />
      <CrescentMoon />
      <Tripundra />
      <RimLight />
      <MistVeil />
    </group>
  );
}
