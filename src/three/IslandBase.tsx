import * as THREE from 'three';
import { useMemo, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { darkStoneMat, carvedStoneMat, stoneMat } from './materials';

// /**
//  * Shared base for all six navigation islands: a small floating rock platform
//  * with a fractured underside. Children are the island's distinctive props.
//  */
// export function IslandBase({
//   children,
//   scale = 1,
//   hover = false,
// }: {
//   children: ReactNode;
//   scale?: number;
//   hover?: boolean;
// }) {
//   const group = useRef<THREE.Group>(null);

//   const underside = useMemo(() => {
//     const geo = new THREE.IcosahedronGeometry(1.4 * scale, 2);
//     const pos = geo.attributes.position as THREE.BufferAttribute;
//     const v = new THREE.Vector3();
//     for (let i = 0; i < pos.count; i++) {
//       v.fromBufferAttribute(pos, i);
//       const n = Math.sin(v.x * 2.5) * Math.cos(v.y * 2.2) * Math.sin(v.z * 2.7);
//       v.multiplyScalar(0.8 + n * 0.18);
//       pos.setXYZ(i, v.x, v.y, v.z);
//     }
//     geo.computeVertexNormals();
//     return geo;
//   }, [scale]);

//   useFrame(() => {
//     if (group.current) {
//       group.current.position.y += Math.sin(performance.now() * 0.0005) * 0.0008;
//       group.current.rotation.y += hover ? 0.002 : 0.0006;
//     }
//   });

//   return (
//     <group ref={group}>
//       {/* Top platform disc */}
//       <mesh material={carvedStoneMat} position={[0, 0, 0]} receiveShadow castShadow>
//         <cylinderGeometry args={[1.35 * scale, 1.45 * scale, 0.28, 40]} />
//       </mesh>
//       {/* Rim */}
//       <mesh material={stoneMat} position={[0, 0.16, 0]}>
//         <torusGeometry args={[1.3 * scale, 0.06, 10, 40]} />
//       </mesh>
//       {/* Fractured underside */}
//       <mesh geometry={underside} material={darkStoneMat} position={[0, -0.5 * scale, 0]} />
//       {children}
//     </group>
//   );
// }

// /** A tiny glow sprite to lift an island's focal object. */
// export function GlowSprite({ color, size = 1, position = [0, 0, 0] }: { color: string; size?: number; position?: [number, number, number] }) {
//   const mat = useMemo(() => {
//     const c = document.createElement('canvas');
//     c.width = c.height = 128;
//     const ctx = c.getContext('2d')!;
//     const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
//     g.addColorStop(0, color);
//     g.addColorStop(0.4, color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
//     g.addColorStop(1, 'rgba(0,0,0,0)');
//     ctx.fillStyle = g;
//     ctx.fillRect(0, 0, 128, 128);
//     const t = new THREE.CanvasTexture(c);
//     t.colorSpace = THREE.SRGBColorSpace;
//     return new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
//   }, [color]);
//   return (
//     <sprite position={position} scale={[size, size, 1]}>
//       <primitive object={mat} attach="material" />
//     </sprite>
//   );
// }

export function IslandBase({
  children,
  scale = 1,
  hover = false,
  flat = false,
}: {
  children: ReactNode;
  scale?: number;
  hover?: boolean;
  flat?: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  const underside = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.4 * scale, 2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n =
        Math.sin(v.x * 2.5) *
        Math.cos(v.y * 2.2) *
        Math.sin(v.z * 2.7);

      v.multiplyScalar(0.8 + n * 0.18);
      pos.setXYZ(i, v.x, v.y, v.z);
    }

    geo.computeVertexNormals();
    return geo;
  }, [scale]);

  useFrame(() => {
    if (group.current) {
      group.current.position.y +=
        Math.sin(performance.now() * 0.0005) * 0.0008;

      group.current.rotation.y += hover ? 0.002 : 0.0006;
    }
  });

  return (
    <group ref={group}>
      {flat ? (
        <>
          {/* Wide, flat rocky platform */}
          {/* <mesh
            material={carvedStoneMat}
            position={[0, 0, 0]}
            scale={[1, 1, 0.88]}
            receiveShadow
            castShadow
          >
            <cylinderGeometry
              args={[1.48 * scale, 1.55 * scale, 0.24 * scale, 48]}
            />
          </mesh> */}

          {/* Shallow natural rocky underside */}
          {/* <mesh
            geometry={underside}
            material={darkStoneMat}
            position={[0, -0.24 * scale, 0]}
            scale={[1, 0.18, 0.88]}
          /> */}

          {/* Wide, flat top surface */}
  {/* Illuminated natural stone platform */}
<mesh
  position={[0, 0, 0]}
  receiveShadow
  castShadow
>
  <cylinderGeometry
    args={[1.48 * scale, 1.55 * scale, 0.24 * scale, 48]}
  />
  {/* <meshStandardMaterial
    color="#858b98"
    roughness={0.88}
    metalness={0.08}
  /> */}
  <meshStandardMaterial
  color="#555b68"
  roughness={0.92}
  metalness={0.06}
/>
</mesh>

  {/* Full fractured floating-rock underside */}
  {/* <mesh
    geometry={underside}
    material={darkStoneMat}
    position={[0, -0.88 * scale, 0]}
    scale={[1, 0.9, 0.88]}
    receiveShadow
    castShadow
  /> */}
  {/* Natural fractured floating-rock underside */}
<mesh
  geometry={underside}
  position={[0, -0.88 * scale, 0]}
  scale={[1, 0.9, 0.88]}
  castShadow
  receiveShadow
>
  {/* <meshStandardMaterial
    color="#343b4b"
    roughness={0.96}
    metalness={0.04}
  /> */}
  <meshStandardMaterial
  color="#252a36"
  roughness={0.98}
  metalness={0.02}
/>
</mesh>
        </>
      ) : (
        <>
          {/* Original platform */}
          <mesh
            material={carvedStoneMat}
            position={[0, 0, 0]}
            receiveShadow
            castShadow
          >
            <cylinderGeometry
              args={[1.35 * scale, 1.45 * scale, 0.28, 40]}
            />
          </mesh>

          {/* Original rim */}
          <mesh material={stoneMat} position={[0, 0.16, 0]}>
            <torusGeometry args={[1.3 * scale, 0.06, 10, 40]} />
          </mesh>

          {/* Original fractured underside */}
          <mesh
            geometry={underside}
            material={darkStoneMat}
            position={[0, -0.5 * scale, 0]}
          />
        </>
      )}

      {children}
    </group>
  );
}

/** A tiny glow sprite to lift an island's focal object. */
export function GlowSprite({
  color,
  size = 1,
  position = [0, 0, 0],
}: {
  color: string;
  size?: number;
  position?: [number, number, number];
}) {
  const mat = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;

    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);

    g.addColorStop(0, color);
    g.addColorStop(
      0.4,
      color.replace(')', ', 0.3)').replace('rgb', 'rgba')
    );
    g.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);

    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;

    return new THREE.SpriteMaterial({
      map: t,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [color]);

  return (
    <sprite position={position} scale={[size, size, 1]}>
      <primitive object={mat} attach="material" />
    </sprite>
  );
}