// import { useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';
// import { polishedBlackStoneMat, carvedStoneMat, darkStoneMat, waterMat, goldMat } from './materials';

// /**
//  * Central sanctuary: a large floating circular carved-stone platform with a
//  * fractured-rock underside, a sacred basin, and a polished black-stone
//  * Shivling on a traditional yoni pedestal. Continuous Abhishek water flows
//  * over the Shivling into the basin via an animated shader — no visible source.
//  */

// function FracturedUnderside() {
//   // Icosahedron with noise displacement for a fractured floating-rock look.
//   const geometry = useMemo(() => {
//     const geo = new THREE.IcosahedronGeometry(3.6, 3);
//     const pos = geo.attributes.position as THREE.BufferAttribute;
//     const v = new THREE.Vector3();
//     for (let i = 0; i < pos.count; i++) {
//       v.fromBufferAttribute(pos, i);
//       const n = Math.sin(v.x * 2.1) * Math.cos(v.y * 1.7) * Math.sin(v.z * 2.3);
//       v.multiplyScalar(0.78 + n * 0.16);
//       pos.setXYZ(i, v.x, v.y, v.z);
//     }
//     geo.computeVertexNormals();
//     return geo;
//   }, []);
//   return (
//     <mesh geometry={geometry} material={darkStoneMat} position={[0, -1.4, 0]} rotation={[0, 0.6, 0.2]} />
//   );
// }

// function Platform() {
//   return (
//     <group>
//       {/* Broad carved circular platform */}
//       <mesh material={carvedStoneMat} position={[0, -0.2, 0]} receiveShadow>
//         <cylinderGeometry args={[3.4, 3.6, 0.5, 64]} />
//       </mesh>
//       {/* Carved ring detail */}
//       <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
//         <ringGeometry args={[2.7, 3.2, 64]} />
//         <meshStandardMaterial color="#1a1f30" roughness={0.7} metalness={0.2} side={THREE.DoubleSide} />
//       </mesh>
//       {/* Rim lip */}
//       <mesh material={carvedStoneMat} position={[0, 0.12, 0]}>
//         <torusGeometry args={[3.3, 0.08, 12, 64]} />
//       </mesh>
//       <FracturedUnderside />
//     </group>
//   );
// }

// function Basin() {
//   // Sacred basin integrated into the platform.
//   return (
//     <group position={[0, 0.05, 0]}>
//       {/* Basin ring */}
//       <mesh material={carvedStoneMat} position={[0, 0.05, 0]}>
//         <torusGeometry args={[1.25, 0.16, 16, 48]} />
//       </mesh>
//       {/* Water surface in the basin */}
//       <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
//         <circleGeometry args={[1.15, 48]} />
//         <meshStandardMaterial
//           color="#3a6072"
//           roughness={0.15}
//           metalness={0.35}
//           emissive="#1a3a4a"
//           emissiveIntensity={0.18}
//           transparent
//           opacity={0.85}
//         />
//       </mesh>
//     </group>
//   );
// }

// function YoniPedestal() {
//   // Traditional yoni pedestal: a circular base with a drainage channel/spout.
//   return (
//     <group position={[0, 0.18, 0]}>
//       <mesh material={polishedBlackStoneMat} position={[0, 0.12, 0]}>
//         <cylinderGeometry args={[0.95, 1.05, 0.3, 48]} />
//       </mesh>
//       {/* Yoni disc */}
//       <mesh material={polishedBlackStoneMat} position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
//         <ringGeometry args={[0.45, 0.92, 48]} />
//       </mesh>
//       {/* Channel/spout facing forward */}
//       <mesh material={polishedBlackStoneMat} position={[0, 0.3, 0.7]} rotation={[0, 0, 0]}>
//         <boxGeometry args={[0.2, 0.06, 0.4]} />
//       </mesh>
//     </group>
//   );
// }

// function Shivling() {
//   // The polished black-stone Shivling: a smooth cylindrical-ellipsoid form.
//   return (
//     <group position={[0, 0.48, 0]}>
//       <mesh material={polishedBlackStoneMat} castShadow>
//         <sphereGeometry args={[0.42, 32, 32]} />
//       </mesh>
//       {/* Tapered top */}
//       <mesh material={polishedBlackStoneMat} position={[0, 0.35, 0]} scale={[1, 1.25, 1]}>
//         <sphereGeometry args={[0.34, 32, 32]} />
//       </mesh>
//       {/* Tripundra-inspired markings on the lingam (restrained) */}
//       <mesh position={[0, 0.55, 0.34]} rotation={[Math.PI / 2, 0, 0]}>
//         <boxGeometry args={[0.32, 0.02, 0.02]} />
//         <primitive object={goldMat} attach="material" />
//       </mesh>
//       <mesh position={[0, 0.62, 0.33]} rotation={[Math.PI / 2, 0, 0]}>
//         <boxGeometry args={[0.3, 0.02, 0.02]} />
//         <primitive object={goldMat} attach="material" />
//       </mesh>
//       <mesh position={[0, 0.69, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
//         <boxGeometry args={[0.28, 0.02, 0.02]} />
//         <primitive object={goldMat} attach="material" />
//       </mesh>
//     </group>
//   );
// }

// /**
//  * Continuous Abhishek: translucent cool blue-white water flowing over the
//  * Shivling and down its sides into the basin. Implemented as a flowing
//  * shader on a cylindrical shell around the lingam — no visible source.
//  */
// function AbhishekWater() {
//   const material = useMemo(() => {
//     return new THREE.ShaderMaterial({
//       transparent: true,
//       side: THREE.DoubleSide,
//       depthWrite: false,
//       uniforms: {
//         uTime: { value: 0 },
//         uColorA: { value: new THREE.Color('#bfe8f5') },
//         uColorB: { value: new THREE.Color('#5fa0c8') },
//       },
//       vertexShader: /* glsl */ `
//         varying vec2 vUv;
//         varying float vFlow;
//         uniform float uTime;
//         void main() {
//           vUv = uv;
//           // Flow downward: animate vertical UV and add a subtle ripple.
//           float flow = sin(uv.y * 18.0 - uTime * 2.4) * 0.5 + 0.5;
//           vFlow = flow;
//           vec3 p = position;
//           // Slight radial shimmer
//           p.x += sin(uTime * 1.6 + uv.y * 10.0) * 0.012;
//           p.z += cos(uTime * 1.4 + uv.y * 10.0) * 0.012;
//           gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
//         }
//       `,
//       fragmentShader: /* glsl */ `
//         varying vec2 vUv;
//         varying float vFlow;
//         uniform vec3 uColorA;
//         uniform vec3 uColorB;
//         uniform float uTime;
//         void main() {
//           // Vertical streaks of flowing water
//           float streak = sin(vUv.x * 40.0 + vUv.y * 6.0 - uTime * 3.0) * 0.5 + 0.5;
//           float alpha = mix(0.25, 0.7, vFlow * 0.7 + streak * 0.3);
//           // Fade near the bottom where it meets the basin
//           float bottomFade = smoothstep(0.0, 0.18, vUv.y);
//           // Stronger, brighter at the top crown
//           float topGlow = smoothstep(0.7, 1.0, vUv.y) * 0.5;
//           vec3 col = mix(uColorB, uColorA, vFlow * 0.6 + topGlow + streak * 0.2);
//           gl_FragColor = vec4(col, alpha * bottomFade * 0.8);
//         }
//       `,
//     });
//   }, []);

//   useFrame((_, delta) => {
//     material.uniforms.uTime.value += delta;
//   });

//   return (
//     <group position={[0, 0.48, 0]}>
//       {/* Flowing shell hugging the Shivling */}
//       <mesh material={material}>
//         <cylinderGeometry args={[0.46, 0.95, 1.0, 32, 1, true]} />
//       </mesh>
//       {/* A thin crown ring of water at the top, like the source point */}
//       <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
//         <ringGeometry args={[0.3, 0.46, 32]} />
//         <primitive object={waterMat} attach="material" />
//       </mesh>
//     </group>
//   );
// }

// function HaloAndLighting() {
//   const ref = useRef<THREE.Mesh>(null);
//   useFrame(() => {
//     if (ref.current) {
//       const s = 1 + Math.sin(performance.now() * 0.0008) * 0.03;
//       ref.current.scale.set(s, s, 1);
//     }
//   });
//   const haloMat = useMemo(() => {
//     const c = document.createElement('canvas');
//     c.width = c.height = 256;
//     const ctx = c.getContext('2d')!;
//     const g = ctx.createRadialGradient(128, 128, 30, 128, 128, 128);
//     g.addColorStop(0, 'rgba(200,168,106,0.5)');
//     g.addColorStop(0.5, 'rgba(160,120,60,0.18)');
//     g.addColorStop(1, 'rgba(0,0,0,0)');
//     ctx.fillStyle = g;
//     ctx.fillRect(0, 0, 256, 256);
//     const t = new THREE.CanvasTexture(c);
//     t.colorSpace = THREE.SRGBColorSpace;
//     return new THREE.MeshBasicMaterial({
//       map: t,
//       transparent: true,
//       depthWrite: false,
//       blending: THREE.AdditiveBlending,
//     });
//   }, []);
//   return (
//     <group>
//       <mesh ref={ref} position={[0, 1.2, -0.4]} material={haloMat}>
//         <planeGeometry args={[7, 7]} />
//       </mesh>
//       {/* Soft cool rim light on the sanctuary */}
//       <pointLight position={[0, 2.2, 1.5]} intensity={6} color="#9fc4e8" distance={9} />
//       <pointLight position={[0, 0.5, -1]} intensity={3} color="#c8a86a" distance={7} />
//     </group>
//   );
// }

// export default function CentralSanctuary() {
//   const group = useRef<THREE.Group>(null);
//   useFrame(() => {
//     if (group.current) {
//       group.current.position.y = Math.sin(performance.now() * 0.00025) * 0.1;
//     }
//   });
//   return (
//     <group ref={group} position={[0, 0, 0]}>
//       <Platform />
//       <Basin />
//       <YoniPedestal />
//       <Shivling />
//       <AbhishekWater />
//       <HaloAndLighting />
//     </group>
//   );
// }



// import { useEffect, useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';

// function createRockGeometry() {
//   const geometry = new THREE.IcosahedronGeometry(1, 4);
//   const positions = geometry.attributes.position;

//   for (let i = 0; i < positions.count; i++) {
//     const x = positions.getX(i);
//     const y = positions.getY(i);
//     const z = positions.getZ(i);

//     const noise =
//       1 +
//       0.055 * Math.sin(x * 17 + z * 11) *
//         Math.cos(y * 13 - x * 5) +
//       0.025 * Math.sin(z * 27 + y * 19);

//     positions.setXYZ(i, x * noise, y * noise, z * noise);
//   }

//   geometry.computeVertexNormals();
//   return geometry;
// }

// function WaterMaterial() {
//   const materialRef = useRef<THREE.ShaderMaterial>(null);

//   const material = useMemo(
//     () =>
//       new THREE.ShaderMaterial({
//         transparent: true,
//         depthWrite: false,
//         side: THREE.DoubleSide,
//         uniforms: {
//           uTime: { value: 0 },
//         },
//         vertexShader: `
//           varying vec2 vUv;
//           varying vec3 vPosition;

//           void main() {
//             vUv = uv;
//             vPosition = position;
//             gl_Position =
//               projectionMatrix *
//               modelViewMatrix *
//               vec4(position, 1.0);
//           }
//         `,
//         fragmentShader: `
//           uniform float uTime;
//           varying vec2 vUv;
//           varying vec3 vPosition;

//           void main() {
//             float flow =
//               sin(vUv.y * 38.0 - uTime * 3.2 +
//                   sin(vUv.x * 12.0 + uTime) * 0.6);

//             float ripples =
//               sin(vUv.x * 24.0 + uTime * 1.4) *
//               cos(vUv.y * 17.0 - uTime * 2.0);

//             vec3 deepWater = vec3(0.015, 0.12, 0.28);
//             vec3 brightWater = vec3(0.25, 0.72, 1.0);

//             float highlights =
//               smoothstep(0.62, 0.98, flow * 0.5 + 0.5);

//             vec3 color = mix(
//               deepWater,
//               brightWater,
//               highlights * 0.72 + (ripples * 0.5 + 0.5) * 0.12
//             );

//             float alpha = 0.76 + highlights * 0.20;
//             gl_FragColor = vec4(color, alpha);
//           }
//         `,
//       }),
//     []
//   );

//   useFrame((state) => {
//     if (materialRef.current) {
//       materialRef.current.uniforms.uTime.value =
//         state.clock.elapsedTime;
//     }
//   });

//   useEffect(() => {
//     return () => material.dispose();
//   }, [material]);

//   return <primitive ref={materialRef} object={material} attach="material" />;
// }

// function FlowingWater() {
//   const streamRef = useRef<THREE.Mesh>(null);

//   const streamGeometry = useMemo(() => {
//     // A curved stream runs from the crown down the front of the lingam.
//     const points = [
//       new THREE.Vector3(0, 2.12, 0.0),
//       new THREE.Vector3(0.015, 1.95, 0.16),
//       new THREE.Vector3(-0.025, 1.72, 0.29),
//       new THREE.Vector3(0.025, 1.45, 0.37),
//       new THREE.Vector3(-0.015, 1.15, 0.43),
//       new THREE.Vector3(0.02, 0.88, 0.47),
//       new THREE.Vector3(0, 0.67, 0.52),
//     ];

//     const curve = new THREE.CatmullRomCurve3(points);
//     return new THREE.TubeGeometry(curve, 72, 0.038, 10, false);
//   }, []);

//   useEffect(() => {
//     return () => streamGeometry.dispose();
//   }, [streamGeometry]);

//   return (
//     <group>
//       <mesh
//         ref={streamRef}
//         geometry={streamGeometry}
//         renderOrder={5}
//       >
//         <WaterMaterial />
//       </mesh>

//       {/* Fine droplets around the falling water */}
//       {Array.from({ length: 12 }, (_, i) => (
//         <Droplet key={i} index={i} />
//       ))}
//     </group>
//   );
// }

// function Droplet({ index }: { index: number }) {
//   const ref = useRef<THREE.Mesh>(null);

//   useFrame((state) => {
//     if (!ref.current) return;

//     const t = state.clock.elapsedTime * 0.8 + index * 0.53;
//     const progress = (t % 1);

//     ref.current.position.set(
//       Math.sin(index * 12.3) * 0.075,
//       1.9 - progress * 1.15,
//       0.18 + progress * 0.36
//     );

//     ref.current.scale.setScalar(
//       0.55 + 0.45 * Math.sin(progress * Math.PI)
//     );
//   });

//   return (
//     <mesh ref={ref}>
//       <sphereGeometry args={[0.018, 8, 8]} />
//       <meshBasicMaterial
//         color="#9be8ff"
//         transparent
//         opacity={0.8}
//       />
//     </mesh>
//   );
// }

// export default function CentralSanctuary() {
//   const sanctuaryRef = useRef<THREE.Group>(null);

//   const rockGeometry = useMemo(createRockGeometry, []);

//   useEffect(() => {
//     return () => rockGeometry.dispose();
//   }, [rockGeometry]);

//   useFrame((state) => {
//     if (!sanctuaryRef.current) return;

//     // Gentle floating motion for the complete sanctuary.
//     sanctuaryRef.current.position.y =
//       Math.sin(state.clock.elapsedTime * 0.42) * 0.035;
//   });

//   const darkStone = new THREE.MeshPhysicalMaterial({
//     color: '#111521',
//     roughness: 0.24,
//     metalness: 0.34,
//     clearcoat: 0.9,
//     clearcoatRoughness: 0.14,
//   });

//   const platformStone = new THREE.MeshStandardMaterial({
//     color: '#333747',
//     roughness: 0.68,
//     metalness: 0.18,
//   });

//   const goldTrim = new THREE.MeshStandardMaterial({
//     color: '#b99453',
//     metalness: 0.78,
//     roughness: 0.28,
//     emissive: '#543719',
//     emissiveIntensity: 0.18,
//   });

//   // Smooth, rounded Shivling geometry
//   const lingamGeometry = useMemo(() => {
//   const profile = [
//     new THREE.Vector2(0.00, 0.00),
//     new THREE.Vector2(0.30, 0.00),
//     new THREE.Vector2(0.36, 0.10),
//     new THREE.Vector2(0.37, 0.32),
//     new THREE.Vector2(0.34, 0.56),
//     new THREE.Vector2(0.27, 0.78),
//     new THREE.Vector2(0.17, 0.94),
//     new THREE.Vector2(0.07, 1.02),
//     new THREE.Vector2(0.00, 1.04),
//   ];

//   return new THREE.LatheGeometry(profile, 96);
// }, []);

//   useEffect(() => {
//     return () => lingamGeometry.dispose();
//   }, [lingamGeometry]);

//   return (
//     <group ref={sanctuaryRef} position={[0, 0, 0]}>
//       {/* Floating, fractured rocky underside */}
//       <mesh
//         geometry={rockGeometry}
//         position={[0, -0.48, 0]}
//         scale={[2.25, 1.18, 1.65]}
//         material={platformStone}
//       />

//       {/* Strata beneath the island */}
//       <mesh position={[0, -0.1, 0]} rotation={[0.05, 0.1, 0]}>
//         <cylinderGeometry args={[2.15, 2.28, 0.22, 12, 1]} />
//         <meshStandardMaterial
//           color="#171b2a"
//           roughness={0.82}
//         />
//       </mesh>

//       {/* Main circular sanctuary platform */}
//       <mesh position={[0, 0.08, 0]}>
//         <cylinderGeometry args={[2.0, 2.12, 0.22, 96]} />
//         <meshStandardMaterial
//           color="#252a3a"
//           roughness={0.48}
//           metalness={0.28}
//         />
//       </mesh>

//       {/* Thin inlaid gold ring */}
//       <mesh position={[0, 0.205, 0]}>
//         <torusGeometry args={[1.78, 0.018, 8, 96]} />
//         <primitive object={goldTrim} attach="material" />
//       </mesh>

//       {/* Yoni pedestal base */}
//       <mesh
//         position={[0, 0.34, 0]}
//         scale={[1.02, 0.16, 0.84]}
//       >
//         <cylinderGeometry args={[0.92, 1.08, 0.34, 64]} />
//         <primitive object={darkStone} attach="material" />
//       </mesh>

//       {/* Rounded yoni basin */}
//       <mesh
//         position={[0, 0.48, 0]}
//         scale={[1.0, 0.12, 0.83]}
//       >
//         <cylinderGeometry args={[0.92, 0.92, 0.18, 64]} />
//         <primitive object={darkStone} attach="material" />
//       </mesh>

//       {/* Basin water surface */}
//       <mesh
//         position={[0, 0.584, 0]}
//         rotation={[-Math.PI / 2, 0, 0]}
//       >
//         <circleGeometry args={[0.78, 64]} />
//         <meshPhysicalMaterial
//           color="#167db3"
//           roughness={0.12}
//           metalness={0.2}
//           transparent
//           opacity={0.82}
//           clearcoat={1}
//           emissive="#07365a"
//           emissiveIntensity={0.35}
//         />
//       </mesh>

//       {/* Shivling — one continuous polished stone form */}
//       <mesh
//         geometry={lingamGeometry}
//         position={[0, 0.62, 0]}
//         material={darkStone}
//         castShadow
//         receiveShadow
//       />

//       {/* Water flowing down the front of the Shivling */}
//       <FlowingWater />

//       {/* Soft blue illumination around the sacred basin */}
//       <pointLight
//         position={[0, 0.85, 0.9]}
//         color="#4caeff"
//         intensity={0.75}
//         distance={3.5}
//         decay={2}
//       />

//       <pointLight
//         position={[0, 1.6, -0.5]}
//         color="#e3c58d"
//         intensity={0.38}
//         distance={4}
//         decay={2}
//       />
//     </group>
//   );
// }


// import { useEffect, useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';
// import { useGLTF } from '@react-three/drei';

// /**
//  * THE COSMIC FORGE — Central Sanctuary
//  * Procedural Three.js geometry only.
//  * Keeps the existing Scene.tsx interface unchanged.
//  */

// function createRockGeometry() {
//   const geometry = new THREE.IcosahedronGeometry(1, 4);
//   const positions = geometry.attributes.position;

//   for (let i = 0; i < positions.count; i++) {
//     const x = positions.getX(i);
//     const y = positions.getY(i);
//     const z = positions.getZ(i);

//     const noise =
//       1 +
//       0.045 * Math.sin(x * 17 + z * 11) * Math.cos(y * 13 - x * 5) +
//       0.022 * Math.sin(z * 27 + y * 19);

//     positions.setXYZ(i, x * noise, y * noise, z * noise);
//   }

//   geometry.computeVertexNormals();
//   return geometry;
// }

// /** A rounded, traditional dome-topped lingam. */
// // function createLingamGeometry() {
// //   const profile = [
// //     new THREE.Vector2(0.00, 0.000),
// //     new THREE.Vector2(0.27, 0.000),
// //     new THREE.Vector2(0.355, 0.035),
// //     new THREE.Vector2(0.385, 0.105),
// //     new THREE.Vector2(0.385, 0.390),
// //     new THREE.Vector2(0.365, 0.565),
// //     new THREE.Vector2(0.320, 0.735),
// //     new THREE.Vector2(0.245, 0.895),
// //     new THREE.Vector2(0.155, 1.015),
// //     new THREE.Vector2(0.070, 1.075),
// //     new THREE.Vector2(0.000, 1.090),
// //   ];

// //   const geometry = new THREE.LatheGeometry(profile, 96);
// //   geometry.computeVertexNormals();
// //   return geometry;
// // }
// /** Larger, smooth, traditional black-stone Shivling. */
// function createLingamGeometry() {
//   const profile = [
//     new THREE.Vector2(0.00, 0.000),
//     new THREE.Vector2(0.34, 0.000),
//     new THREE.Vector2(0.44, 0.045),
//     new THREE.Vector2(0.47, 0.13),
//     new THREE.Vector2(0.47, 0.48),
//     new THREE.Vector2(0.44, 0.70),
//     new THREE.Vector2(0.38, 0.91),
//     new THREE.Vector2(0.29, 1.10),
//     new THREE.Vector2(0.18, 1.25),
//     new THREE.Vector2(0.08, 1.32),
//     new THREE.Vector2(0.00, 1.34),
//   ];

//   const geometry = new THREE.LatheGeometry(profile, 128);
//   geometry.computeVertexNormals();
//   return geometry;
// }

// /** Elliptical yoni basin with a subtle forward-projecting spout. */
// function createBasinGeometry() {
//   const shape = new THREE.Shape();

//   shape.moveTo(-0.78, -0.36);
//   shape.bezierCurveTo(-1.02, -0.12, -0.98, 0.31, -0.70, 0.43);
//   shape.bezierCurveTo(-0.35, 0.57, 0.35, 0.57, 0.70, 0.43);
//   shape.bezierCurveTo(0.98, 0.31, 1.02, -0.12, 0.78, -0.36);
//   shape.bezierCurveTo(0.45, -0.55, -0.45, -0.55, -0.78, -0.36);

//   // Extend the front into a traditional yoni spout.
//   shape.lineTo(-0.38, -0.57);
//   shape.lineTo(-0.20, -0.94);
//   shape.quadraticCurveTo(0, -1.06, 0.20, -0.94);
//   shape.lineTo(0.38, -0.57);
//   shape.closePath();

//   const geometry = new THREE.ExtrudeGeometry(shape, {
//     depth: 0.105,
//     bevelEnabled: true,
//     bevelSegments: 3,
//     steps: 1,
//     bevelSize: 0.035,
//     bevelThickness: 0.035,
//     curveSegments: 16,
//   });

//   geometry.rotateX(-Math.PI / 2);
//   geometry.computeVertexNormals();
//   return geometry;
// }

// /** Animated water shader for the falling water sheet. */
// function createWaterMaterial() {
//   return new THREE.ShaderMaterial({
//     transparent: true,
//     depthWrite: false,
//     side: THREE.DoubleSide,
//     uniforms: {
//       uTime: { value: 0 },
//     },
//     vertexShader: `
//       varying vec2 vUv;

//       void main() {
//         vUv = uv;
//         gl_Position = projectionMatrix *
//           modelViewMatrix * vec4(position, 1.0);
//       }
//     `,
//     fragmentShader: `
//       uniform float uTime;
//       varying vec2 vUv;

//       void main() {
//         float flowA = sin(vUv.y * 46.0 - uTime * 4.2
//           + sin(vUv.x * 12.0 + uTime * 1.4) * 1.1);

//         float flowB = sin(vUv.y * 89.0 - uTime * 6.0
//           + vUv.x * 8.0);

//         float edge = smoothstep(0.0, 0.16, vUv.x)
//           * (1.0 - smoothstep(0.84, 1.0, vUv.x));

//         float streaks = smoothstep(0.25, 0.94, flowA * 0.5 + 0.5);
//         streaks = max(streaks, smoothstep(0.76, 0.99, flowB) * 0.55);

//         vec3 deepBlue = vec3(0.035, 0.24, 0.43);
//         vec3 iceBlue = vec3(0.36, 0.79, 1.0);
//         vec3 white = vec3(0.91, 0.98, 1.0);

//         vec3 color = mix(deepBlue, iceBlue, streaks * 0.78);
//         color = mix(color, white, streaks * 0.42);

//         float alpha = (0.43 + streaks * 0.48) * edge;

//         gl_FragColor = vec4(color, alpha);
//       }
//     `,
//   });
// }

// /** Build a curved ribbon instead of a thin central tube. */
// function createWaterRibbon(
//   points: THREE.Vector3[],
//   width: number,
// ) {
//   const curve = new THREE.CatmullRomCurve3(points);
//   const segments = 96;
//   const verticesAcross = 8;
//   const positions: number[] = [];
//   const uvs: number[] = [];
//   const indices: number[] = [];

//   for (let i = 0; i <= segments; i++) {
//     const t = i / segments;
//     const point = curve.getPoint(t);
//     const tangent = curve.getTangent(t).normalize();

//     // Keep the sheet wide across the front of the stone.
//     const across = new THREE.Vector3(1, 0, 0);
//     across.addScaledVector(tangent, -across.dot(tangent)).normalize();

//     const taper = Math.min(
//       1,
//       0.35 + t * 2.8,
//       0.35 + (1 - t) * 2.5,
//     );

//     for (let j = 0; j <= verticesAcross; j++) {
//       const u = j / verticesAcross;
//       const offset = (u - 0.5) * width * taper;
//       const p = point.clone().addScaledVector(across, offset);

//       positions.push(p.x, p.y, p.z);
//       uvs.push(u, t);
//     }
//   }

//   for (let i = 0; i < segments; i++) {
//     for (let j = 0; j < verticesAcross; j++) {
//       const a = i * (verticesAcross + 1) + j;
//       const b = a + verticesAcross + 1;

//       indices.push(a, b, a + 1);
//       indices.push(b, b + 1, a + 1);
//     }
//   }

//   const geometry = new THREE.BufferGeometry();
//   geometry.setAttribute(
//     'position',
//     new THREE.Float32BufferAttribute(positions, 3),
//   );
//   geometry.setAttribute(
//     'uv',
//     new THREE.Float32BufferAttribute(uvs, 2),
//   );
//   geometry.setIndex(indices);
//   geometry.computeVertexNormals();

//   return geometry;
// }

// function WaterSheet({
//   points,
//   width,
//   offset = 0,
// }: {
//   points: THREE.Vector3[];
//   width: number;
//   offset?: number;
// }) {
//   const meshRef = useRef<THREE.Mesh>(null);

//   const geometry = useMemo(
//     () => createWaterRibbon(points, width),
//     [points, width],
//   );

//   const material = useMemo(createWaterMaterial, []);

//   useFrame((state) => {
//     material.uniforms.uTime.value = state.clock.elapsedTime + offset;

//     if (meshRef.current) {
//       meshRef.current.visible = true;
//     }
//   });

//   useEffect(() => {
//     return () => {
//       geometry.dispose();
//       material.dispose();
//     };
//   }, [geometry, material]);

//   return (
//     <mesh
//       ref={meshRef}
//       geometry={geometry}
//       material={material}
//       renderOrder={5}
//       frustumCulled={false}
//     />
//   );
// }

// /** Fine droplets travel down toward the basin. */
// function Droplets() {
//   const groupRef = useRef<THREE.Group>(null);

//   const drops = useMemo(
//     () =>
//       Array.from({ length: 24 }, (_, i) => ({
//         x: Math.sin(i * 12.73) * (0.10 + (i % 4) * 0.025),
//         z: 0.22 + (i % 5) * 0.055,
//         speed: 0.55 + (i % 6) * 0.13,
//         phase: (i * 0.173) % 1,
//         size: 0.010 + (i % 3) * 0.004,
//       })),
//     [],
//   );

//   useFrame((state) => {
//     if (!groupRef.current) return;

//     const time = state.clock.elapsedTime;

//     groupRef.current.children.forEach((drop, i) => {
//       const data = drops[i];
//       const progress = (time * data.speed + data.phase) % 1;

//       drop.position.set(
//         data.x,
//         1.62 - progress * 1.12,
//         data.z + progress * 0.25,
//       );

//       const scale = 0.65 + Math.sin(progress * Math.PI) * 0.55;
//       drop.scale.set(data.size * scale, data.size * scale * 1.8, data.size * scale);
//     });
//   });

//   return (
//     <group ref={groupRef}>
//       {drops.map((drop, i) => (
//         <mesh key={i} position={[drop.x, 1.3, drop.z]}>
//           <sphereGeometry args={[1, 8, 8]} />
//           <meshBasicMaterial
//             color="#bcefff"
//             transparent
//             opacity={0.92}
//           />
//         </mesh>
//       ))}
//     </group>
//   );
// }

// /** Expanding rings give the water surface continuous movement. */
// function WaterRipples() {
//   const rings = useRef<(THREE.Mesh | null)[]>([]);

//   useFrame((state) => {
//     const time = state.clock.elapsedTime;

//     rings.current.forEach((ring, i) => {
//       if (!ring) return;

//       const phase = (time * 0.38 + i / 3) % 1;
//       const radius = 0.12 + phase * 0.40;

//       ring.scale.set(radius, radius, radius);
//       ring.position.y = 0.485 + i * 0.001;
//       ring.position.z = 0.12;

//       const material = ring.material as THREE.MeshBasicMaterial;
//       material.opacity = (1 - phase) * 0.48;
//     });
//   });

//   return (
//     <group>
//       {[0, 1, 2].map((i) => (
//         <mesh
//           key={i}
//           ref={(node) => {
//             rings.current[i] = node;
//           }}
//           rotation={[-Math.PI / 2, 0, 0]}
//           position={[0, 0.485, 0.12]}
//         >
//           <torusGeometry args={[1, 0.012, 6, 64]} />
//           <meshBasicMaterial
//             color="#7edcff"
//             transparent
//             opacity={0.4}
//             depthWrite={false}
//           />
//         </mesh>
//       ))}
//     </group>
//   );
// }

// function ShivlingModel() {
//   const { scene } = useGLTF('/models/shivling.glb');

//   const model = useMemo(() => {
//     const clone = scene.clone(true);

//     // Measure the downloaded model.
//     const bounds = new THREE.Box3().setFromObject(clone);
//     const size = bounds.getSize(new THREE.Vector3());
//     const center = bounds.getCenter(new THREE.Vector3());

//     // Normalize it to a predictable height.
//     const targetHeight = 1.5;
//     const scale = targetHeight / Math.max(size.y, 0.001);

//     clone.scale.setScalar(scale);
//     clone.position.set(
//       -center.x * scale,
//       -bounds.min.y * scale,
//       -center.z * scale,
//     );

//     return clone;
//   }, [scene]);

//   return (
//     <primitive
//       object={model}
//       position={[0, 0.46, 0.12]}
//       castShadow
//       receiveShadow
//     />
//   );
// }

// useGLTF.preload('/models/shivling.glb');

// export default function CentralSanctuary() {
//   const sanctuaryRef = useRef<THREE.Group>(null);

//   const rockGeometry = useMemo(createRockGeometry, []);
//   const lingamGeometry = useMemo(createLingamGeometry, []);
//   const basinGeometry = useMemo(createBasinGeometry, []);

//   const darkStone = useMemo(
//   () =>
//     new THREE.MeshPhysicalMaterial({
//       color: '#171b25',
//       roughness: 0.17,
//       metalness: 0.22,
//       clearcoat: 1,
//       clearcoatRoughness: 0.08,
//       emissive: '#080d19',
//       emissiveIntensity: 0.08,
//     }),
//   [],
// );

//   const platformStone = useMemo(
//     () =>
//       new THREE.MeshStandardMaterial({
//         color: '#34394a',
//         roughness: 0.63,
//         metalness: 0.20,
//       }),
//     [],
//   );

//   const goldTrim = useMemo(
//     () =>
//       new THREE.MeshStandardMaterial({
//         color: '#c6a36a',
//         metalness: 0.72,
//         roughness: 0.25,
//         emissive: '#503016',
//         emissiveIntensity: 0.22,
//       }),
//     [],
//   );

//   const basinWater = useMemo(
//     () =>
//       new THREE.MeshPhysicalMaterial({
//         color: '#1684b9',
//         roughness: 0.12,
//         metalness: 0.15,
//         transparent: true,
//         opacity: 0.86,
//         clearcoat: 1,
//         clearcoatRoughness: 0.06,
//         emissive: '#07365a',
//         emissiveIntensity: 0.24,
//       }),
//     [],
//   );

//   // const mainWaterPoints = useMemo(
//   //   () => [
//   //     new THREE.Vector3(0.015, 1.49, 0.035),
//   //     new THREE.Vector3(0.005, 1.40, 0.19),
//   //     new THREE.Vector3(-0.015, 1.25, 0.31),
//   //     new THREE.Vector3(0.015, 1.04, 0.365),
//   //     new THREE.Vector3(-0.01, 0.82, 0.40),
//   //     new THREE.Vector3(0.015, 0.61, 0.43),
//   //     new THREE.Vector3(0.0, 0.49, 0.47),
//   //   ],
//   //   [],
//   // );

//   // const leftWaterPoints = useMemo(
//   //   () => [
//   //     new THREE.Vector3(-0.20, 1.39, 0.17),
//   //     new THREE.Vector3(-0.24, 1.20, 0.28),
//   //     new THREE.Vector3(-0.25, 0.96, 0.35),
//   //     new THREE.Vector3(-0.23, 0.73, 0.40),
//   //     new THREE.Vector3(-0.27, 0.52, 0.47),
//   //   ],
//   //   [],
//   // );

//   // const rightWaterPoints = useMemo(
//   //   () => [
//   //     new THREE.Vector3(0.21, 1.39, 0.17),
//   //     new THREE.Vector3(0.24, 1.20, 0.28),
//   //     new THREE.Vector3(0.25, 0.96, 0.35),
//   //     new THREE.Vector3(0.23, 0.73, 0.40),
//   //     new THREE.Vector3(0.27, 0.52, 0.47),
//   //   ],
//   //   [],
//   // );
//   const mainWaterPoints = useMemo(
//   () => [
//     new THREE.Vector3(0.00, 1.77, 0.035),
//     new THREE.Vector3(0.015, 1.58, 0.20),
//     new THREE.Vector3(-0.015, 1.35, 0.34),
//     new THREE.Vector3(0.02, 1.10, 0.43),
//     new THREE.Vector3(-0.01, 0.83, 0.47),
//     new THREE.Vector3(0.015, 0.61, 0.49),
//     new THREE.Vector3(0.00, 0.49, 0.51),
//   ],
//   [],
// );

// const leftWaterPoints = useMemo(
//   () => [
//     new THREE.Vector3(-0.25, 1.60, 0.17),
//     new THREE.Vector3(-0.29, 1.35, 0.31),
//     new THREE.Vector3(-0.30, 1.08, 0.39),
//     new THREE.Vector3(-0.27, 0.78, 0.45),
//     new THREE.Vector3(-0.29, 0.51, 0.50),
//   ],
//   [],
// );

// const rightWaterPoints = useMemo(
//   () => [
//     new THREE.Vector3(0.25, 1.60, 0.17),
//     new THREE.Vector3(0.29, 1.35, 0.31),
//     new THREE.Vector3(0.30, 1.08, 0.39),
//     new THREE.Vector3(0.27, 0.78, 0.45),
//     new THREE.Vector3(0.29, 0.51, 0.50),
//   ],
//   [],
// );

//   useEffect(() => {
//     return () => {
//       rockGeometry.dispose();
//       lingamGeometry.dispose();
//       basinGeometry.dispose();
//       darkStone.dispose();
//       platformStone.dispose();
//       goldTrim.dispose();
//       basinWater.dispose();
//     };
//   }, [
//     rockGeometry,
//     lingamGeometry,
//     basinGeometry,
//     darkStone,
//     platformStone,
//     goldTrim,
//     basinWater,
//   ]);

//   useFrame((state) => {
//     if (!sanctuaryRef.current) return;

//     sanctuaryRef.current.position.y =
//       Math.sin(state.clock.elapsedTime * 0.42) * 0.025;
//   });

//   return (
//     <group ref={sanctuaryRef} position={[0, 0, 0]}>
//       {/* Floating rocky island */}
//       <mesh
//         geometry={rockGeometry}
//         position={[0, -0.48, 0]}
//         scale={[2.25, 1.18, 1.65]}
//         material={platformStone}
//         castShadow
//         receiveShadow
//       />

//       <mesh position={[0, -0.10, 0]}>
//         <cylinderGeometry args={[2.15, 2.28, 0.22, 96]} />
//         <primitive object={platformStone} attach="material" />
//       </mesh>

//       {/* Circular sanctuary platform */}
//       <mesh position={[0, 0.08, 0]}>
//         <cylinderGeometry args={[2.0, 2.12, 0.22, 96]} />
//         <meshStandardMaterial
//           color="#34394a"
//           roughness={0.45}
//           metalness={0.28}
//         />
//       </mesh>

//       <mesh position={[0, 0.198, 0]}>
//         <torusGeometry args={[1.78, 0.018, 8, 96]} />
//         <primitive object={goldTrim} attach="material" />
//       </mesh>

//       {/* Raised pedestal beneath the yoni */}
//       <mesh position={[0, 0.235, 0]} scale={[1.0, 1, 0.82]}>
//         <cylinderGeometry args={[0.93, 1.02, 0.20, 96]} />
//         <primitive object={darkStone} attach="material" />
//       </mesh>

//       <mesh position={[0, 0.345, 0]} scale={[1.0, 1, 0.84]}>
//         <cylinderGeometry args={[0.94, 0.94, 0.055, 96]} />
//         <primitive object={goldTrim} attach="material" />
//       </mesh>

//       {/* Traditional yoni basin and front spout */}
//       <mesh
//         geometry={basinGeometry}
//         position={[0, 0.37, 0.0]}
//         scale={[1.0, 1.0, 1.0]}
//         material={darkStone}
//         castShadow
//         receiveShadow
//       />

//       {/* Visible pool inside the basin */}
//       <mesh
//         position={[0, 0.475, -0.015]}
//         rotation={[-Math.PI / 2, 0, 0]}
//       >
//         <circleGeometry args={[0.78, 96]} />
//         <primitive object={basinWater} attach="material" />
//       </mesh>

//       {/* Polished black-stone Shivling — fully visible above the basin */}
//       <mesh
//   geometry={lingamGeometry}
//   position={[0, 0.46, 0.12]}
//   scale={[1.2, 1.15, 1.2]}
//   material={darkStone}
//   castShadow
//   receiveShadow
//   renderOrder={2}
// />

//       {/* Fine metallic highlight around the basin rim */}
//       <mesh
//         position={[0, 0.49, -0.01]}
//         rotation={[-Math.PI / 2, 0, 0]}
//       >
//         <torusGeometry args={[0.69, 0.012, 8, 96]} />
//         <primitive object={goldTrim} attach="material" />
//       </mesh>

//       {/* Continuous animated water flowing over the stone */}
//       <WaterSheet points={mainWaterPoints} width={0.38} />
// <WaterSheet points={leftWaterPoints} width={0.12} offset={1.7} />
// <WaterSheet points={rightWaterPoints} width={0.12} offset={3.1} />

//       <Droplets />
//       <WaterRipples />

//       {/* Restrained cool and warm lighting reveals the stone shape */}
//       <pointLight
//         position={[-1.1, 1.8, 2.1]}
//         color="#72caff"
//         intensity={1.5}
//         distance={5}
//         decay={2}
//       />

//       <pointLight
//         position={[1.1, 1.4, -0.8]}
//         color="#f0d09a"
//         intensity={0.8}
//         distance={4}
//         decay={2}
//       />

//       <pointLight
//         position={[0, 0.8, 1.5]}
//         color="#36a9ff"
//         intensity={0.65}
//         distance={3}
//         decay={2}
//       />
//     </group>
//   );
// }









// import { useEffect, useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';
// import { useGLTF } from '@react-three/drei';

// /**
//  * THE COSMIC FORGE — Central Sanctuary
//  * Procedural Three.js geometry only.
//  * Keeps the existing Scene.tsx interface unchanged.
//  */

// function createRockGeometry() {
//   const geometry = new THREE.IcosahedronGeometry(1, 4);
//   const positions = geometry.attributes.position;

//   for (let i = 0; i < positions.count; i++) {
//     const x = positions.getX(i);
//     const y = positions.getY(i);
//     const z = positions.getZ(i);

//     const noise =
//       1 +
//       0.045 * Math.sin(x * 17 + z * 11) * Math.cos(y * 13 - x * 5) +
//       0.022 * Math.sin(z * 27 + y * 19);

//     positions.setXYZ(i, x * noise, y * noise, z * noise);
//   }

//   geometry.computeVertexNormals();
//   return geometry;
// }

// /** A rounded, traditional dome-topped lingam. */
// // function createLingamGeometry() {
// //   const profile = [
// //     new THREE.Vector2(0.00, 0.000),
// //     new THREE.Vector2(0.27, 0.000),
// //     new THREE.Vector2(0.355, 0.035),
// //     new THREE.Vector2(0.385, 0.105),
// //     new THREE.Vector2(0.385, 0.390),
// //     new THREE.Vector2(0.365, 0.565),
// //     new THREE.Vector2(0.320, 0.735),
// //     new THREE.Vector2(0.245, 0.895),
// //     new THREE.Vector2(0.155, 1.015),
// //     new THREE.Vector2(0.070, 1.075),
// //     new THREE.Vector2(0.000, 1.090),
// //   ];

// //   const geometry = new THREE.LatheGeometry(profile, 96);
// //   geometry.computeVertexNormals();
// //   return geometry;
// // }
// /** Larger, smooth, traditional black-stone Shivling. */
// function createLingamGeometry() {
//   const profile = [
//     new THREE.Vector2(0.00, 0.000),
//     new THREE.Vector2(0.34, 0.000),
//     new THREE.Vector2(0.44, 0.045),
//     new THREE.Vector2(0.47, 0.13),
//     new THREE.Vector2(0.47, 0.48),
//     new THREE.Vector2(0.44, 0.70),
//     new THREE.Vector2(0.38, 0.91),
//     new THREE.Vector2(0.29, 1.10),
//     new THREE.Vector2(0.18, 1.25),
//     new THREE.Vector2(0.08, 1.32),
//     new THREE.Vector2(0.00, 1.34),
//   ];

//   const geometry = new THREE.LatheGeometry(profile, 128);
//   geometry.computeVertexNormals();
//   return geometry;
// }

// /** Elliptical yoni basin with a subtle forward-projecting spout. */
// function createBasinGeometry() {
//   const shape = new THREE.Shape();

//   shape.moveTo(-0.78, -0.36);
//   shape.bezierCurveTo(-1.02, -0.12, -0.98, 0.31, -0.70, 0.43);
//   shape.bezierCurveTo(-0.35, 0.57, 0.35, 0.57, 0.70, 0.43);
//   shape.bezierCurveTo(0.98, 0.31, 1.02, -0.12, 0.78, -0.36);
//   shape.bezierCurveTo(0.45, -0.55, -0.45, -0.55, -0.78, -0.36);

//   // Extend the front into a traditional yoni spout.
//   shape.lineTo(-0.38, -0.57);
//   shape.lineTo(-0.20, -0.94);
//   shape.quadraticCurveTo(0, -1.06, 0.20, -0.94);
//   shape.lineTo(0.38, -0.57);
//   shape.closePath();

//   const geometry = new THREE.ExtrudeGeometry(shape, {
//     depth: 0.105,
//     bevelEnabled: true,
//     bevelSegments: 3,
//     steps: 1,
//     bevelSize: 0.035,
//     bevelThickness: 0.035,
//     curveSegments: 16,
//   });

//   geometry.rotateX(-Math.PI / 2);
//   geometry.computeVertexNormals();
//   return geometry;
// }

// /** Animated water shader for the falling water sheet. */
// function createWaterMaterial() {
//   return new THREE.ShaderMaterial({
//     transparent: true,
//     depthWrite: false,
//     side: THREE.DoubleSide,
//     uniforms: {
//       uTime: { value: 0 },
//     },
//     vertexShader: `
//       varying vec2 vUv;

//       void main() {
//         vUv = uv;
//         gl_Position = projectionMatrix *
//           modelViewMatrix * vec4(position, 1.0);
//       }
//     `,
//     fragmentShader: `
//       uniform float uTime;
//       varying vec2 vUv;

//       void main() {
//         float flowA = sin(vUv.y * 46.0 - uTime * 4.2
//           + sin(vUv.x * 12.0 + uTime * 1.4) * 1.1);

//         float flowB = sin(vUv.y * 89.0 - uTime * 6.0
//           + vUv.x * 8.0);

//         float edge = smoothstep(0.0, 0.16, vUv.x)
//           * (1.0 - smoothstep(0.84, 1.0, vUv.x));

//         float streaks = smoothstep(0.25, 0.94, flowA * 0.5 + 0.5);
//         streaks = max(streaks, smoothstep(0.76, 0.99, flowB) * 0.55);

//         vec3 deepBlue = vec3(0.035, 0.30, 0.55);
// vec3 iceBlue = vec3(0.42, 0.84, 1.0);
// vec3 white = vec3(0.96, 0.99, 1.0);

//         vec3 color = mix(deepBlue, iceBlue, streaks * 0.78);
//         color = mix(color, white, streaks * 0.42);

//         float alpha = (0.62 + streaks * 0.36) * edge;

//         gl_FragColor = vec4(color, alpha);
//       }
//     `,
//   });
// }

// /** Build a curved ribbon instead of a thin central tube. */
// function createWaterRibbon(
//   points: THREE.Vector3[],
//   width: number,
// ) {
//   const curve = new THREE.CatmullRomCurve3(points);
//   const segments = 96;
//   const verticesAcross = 8;
//   const positions: number[] = [];
//   const uvs: number[] = [];
//   const indices: number[] = [];

//   for (let i = 0; i <= segments; i++) {
//     const t = i / segments;
//     const point = curve.getPoint(t);
//     const tangent = curve.getTangent(t).normalize();

//     // Keep the sheet wide across the front of the stone.
//     const across = new THREE.Vector3(1, 0, 0);
//     across.addScaledVector(tangent, -across.dot(tangent)).normalize();

//     const taper = Math.min(
//       1,
//       0.35 + t * 2.8,
//       0.35 + (1 - t) * 2.5,
//     );

//     for (let j = 0; j <= verticesAcross; j++) {
//       const u = j / verticesAcross;
//       const offset = (u - 0.5) * width * taper;
//       const p = point.clone().addScaledVector(across, offset);

//       positions.push(p.x, p.y, p.z);
//       uvs.push(u, t);
//     }
//   }

//   for (let i = 0; i < segments; i++) {
//     for (let j = 0; j < verticesAcross; j++) {
//       const a = i * (verticesAcross + 1) + j;
//       const b = a + verticesAcross + 1;

//       indices.push(a, b, a + 1);
//       indices.push(b, b + 1, a + 1);
//     }
//   }

//   const geometry = new THREE.BufferGeometry();
//   geometry.setAttribute(
//     'position',
//     new THREE.Float32BufferAttribute(positions, 3),
//   );
//   geometry.setAttribute(
//     'uv',
//     new THREE.Float32BufferAttribute(uvs, 2),
//   );
//   geometry.setIndex(indices);
//   geometry.computeVertexNormals();

//   return geometry;
// }

// function WaterSheet({
//   points,
//   width,
//   offset = 0,
// }: {
//   points: THREE.Vector3[];
//   width: number;
//   offset?: number;
// }) {
//   const meshRef = useRef<THREE.Mesh>(null);

//   const geometry = useMemo(
//     () => createWaterRibbon(points, width),
//     [points, width],
//   );

//   const material = useMemo(createWaterMaterial, []);

//   useFrame((state) => {
//     material.uniforms.uTime.value = state.clock.elapsedTime + offset;

//     if (meshRef.current) {
//       meshRef.current.visible = true;
//     }
//   });

//   useEffect(() => {
//     return () => {
//       geometry.dispose();
//       material.dispose();
//     };
//   }, [geometry, material]);

//   return (
//     <mesh
//       ref={meshRef}
//       geometry={geometry}
//       material={material}
//       renderOrder={5}
//       frustumCulled={false}
//     />
//   );
// }

// /** Fine droplets travel down toward the basin. */
// // function Droplets() {
// //   const groupRef = useRef<THREE.Group>(null);

// //   const drops = useMemo(
// //     () =>
// //       Array.from({ length: 24 }, (_, i) => ({
// //         x: Math.sin(i * 12.73) * (0.22 + (i % 4) * 0.045),
// //         z: Math.cos(i * 8.31) * 0.28 + 0.12,
// //         speed: 0.55 + (i % 6) * 0.13,
// //         phase: (i * 0.173) % 1,
// //         size: 0.010 + (i % 3) * 0.004,
// //       })),
// //     [],
// //   );

// //   useFrame((state) => {
// //     if (!groupRef.current) return;

// //     const time = state.clock.elapsedTime;

// //     groupRef.current.children.forEach((drop, i) => {
// //       const data = drops[i];
// //       const progress = (time * data.speed + data.phase) % 1;

// //       drop.position.set(
// //   data.x,
// //   4.85 - progress * 2.0,
// //   data.z + progress * 0.12,
// // );

// //       const scale = 0.65 + Math.sin(progress * Math.PI) * 0.55;
// //       drop.scale.set(data.size * scale, data.size * scale * 1.8, data.size * scale);
// //     });
// //   });

// //   return (
// //     <group ref={groupRef}>
// //       {drops.map((drop, i) => (
// //         <mesh key={i} position={[drop.x, 1.3, drop.z]}>
// //           <sphereGeometry args={[1, 8, 8]} />
// //           <meshBasicMaterial
// //             color="#bcefff"
// //             transparent
// //             opacity={0.92}
// //           />
// //         </mesh>
// //       ))}
// //     </group>
// //   );
// // }

// function Droplets() {
//   const groupRef = useRef<THREE.Group>(null);

//   const drops = useMemo(
//     () =>
//       Array.from({ length: 110 }, (_, i) => ({
//         angle: i * 2.399963,
//         phase: (i * 0.6180339) % 1,
//         speed: 0.42 + (i % 9) * 0.055,
//         size: 0.007 + (i % 4) * 0.003,
//       })),
//     [],
//   );

//   useFrame((state) => {
//     if (!groupRef.current) return;

//     const time = state.clock.elapsedTime;

//     groupRef.current.children.forEach((drop, i) => {
//       const d = drops[i];
//       const progress = (time * d.speed + d.phase) % 1;

//       // Start just above the crown and fall past the sides.
//       const y = 4.72 - progress * 2.08;

//       // The drops follow the approximate curved outline.
//       let radius: number;

//       if (y > 4.25) {
//         radius = THREE.MathUtils.lerp(
//           0.08,
//           0.34,
//           (4.72 - y) / 0.47,
//         );
//       } else {
//         radius = THREE.MathUtils.lerp(
//           0.35,
//           0.43,
//           THREE.MathUtils.clamp((4.25 - y) / 1.53, 0, 1),
//         );
//       }

//       // Slight sideways drift makes the water feel less mechanical.
//       const angle = d.angle + Math.sin(time * 1.8 + i) * 0.035;

//       drop.position.set(
//         Math.sin(angle) * radius,
//         y,
//         Math.cos(angle) * radius,
//       );

//       const pulse = 0.8 + Math.sin(progress * Math.PI) * 0.5;

//       drop.scale.set(
//         d.size * pulse,
//         d.size * pulse * 2.6,
//         d.size * pulse,
//       );
//     });
//   });

//   return (
//     <group ref={groupRef} position={[0, 0.46, 0.12]}>
//       {drops.map((d, i) => (
//         <mesh key={i}>
//           <sphereGeometry args={[1, 8, 8]} />
//           <meshPhysicalMaterial
//             color="#b9edff"
//             roughness={0.08}
//             metalness={0.0}
//             transparent
//             opacity={0.82}
//             clearcoat={1}
//           />
//         </mesh>
//       ))}
//     </group>
//   );
// }


// /** Expanding rings give the water surface continuous movement. */
// function WaterRipples() {
//   const rings = useRef<(THREE.Mesh | null)[]>([]);

//   useFrame((state) => {
//     const time = state.clock.elapsedTime;

//     rings.current.forEach((ring, i) => {
//       if (!ring) return;

//       const phase = (time * 0.38 + i / 3) % 1;
//       const radius = 0.12 + phase * 0.40;

//       ring.scale.set(radius, radius, radius);
//       ring.position.y = 0.485 + i * 0.001;
//       ring.position.z = 0.12;

//       const material = ring.material as THREE.MeshBasicMaterial;
//       material.opacity = (1 - phase) * 0.48;
//     });
//   });

//   return (
//     <group>
//       {[0, 1, 2].map((i) => (
//         <mesh
//           key={i}
//           ref={(node) => {
//             rings.current[i] = node;
//           }}
//           rotation={[-Math.PI / 2, 0, 0]}
//           position={[0, 0.485, 0.12]}
//         >
//           <torusGeometry args={[1, 0.012, 6, 64]} />
//           <meshBasicMaterial
//             color="#7edcff"
//             transparent
//             opacity={0.4}
//             depthWrite={false}
//           />
//         </mesh>
//       ))}
//     </group>
//   );
// }

// function FloatingFlower({
//   position,
//   rotation = 0,
// }: {
//   position: [number, number, number];
//   rotation?: number;
// }) {
//   const flowerRef = useRef<THREE.Group>(null);

//   useFrame((state) => {
//     if (!flowerRef.current) return;

//     const t = state.clock.elapsedTime + rotation;
//     flowerRef.current.position.y =
//       position[1] + Math.sin(t * 1.4) * 0.012;

//     flowerRef.current.rotation.z = Math.sin(t * 0.7) * 0.04;
//   });

//   return (
//     <group
//       ref={flowerRef}
//       position={position}
//       rotation={[0, rotation, 0]}
//     >
//       {Array.from({ length: 6 }, (_, i) => {
//         const angle = (i / 6) * Math.PI * 2;

//         return (
//           <mesh
//             key={i}
//             position={[
//               Math.cos(angle) * 0.075,
//               0,
//               Math.sin(angle) * 0.075,
//             ]}
//             rotation={[0, -angle, 0]}
//             scale={[0.075, 0.018, 0.038]}
//           >
//             <sphereGeometry args={[1, 12, 8]} />
//             <meshStandardMaterial
//               color="#f6a0c7"
//               emissive="#52132e"
//               emissiveIntensity={0.22}
//               roughness={0.38}
//             />
//           </mesh>
//         );
//       })}

//       <mesh position={[0, 0.008, 0]}>
//         <sphereGeometry args={[0.028, 12, 8]} />
//         <meshStandardMaterial
//           color="#ffd45e"
//           roughness={0.5}
//         />
//       </mesh>
//     </group>
//   );
// }

// function ShivlingModel() {
//   const { scene } = useGLTF('/models/shivling.glb');

//   const model = useMemo(() => {
//     const clone = scene.clone(true);

//     // Measure the downloaded model.
//     const bounds = new THREE.Box3().setFromObject(clone);
//     const size = bounds.getSize(new THREE.Vector3());
//     const center = bounds.getCenter(new THREE.Vector3());

//     // Normalize it to a predictable height.
//     const targetHeight = 4.5;
//     const scale = targetHeight / Math.max(size.y, 0.001);

//     clone.scale.setScalar(scale);
//     clone.position.set(
//       -center.x * scale,
//       -bounds.min.y * scale,
//       -center.z * scale,
//     );

//     return clone;
//   }, [scene]);

//   return (
//     <primitive
//       object={model}
//       position={[0, 0.46, 0.12]}
//       // scale={1.35}
//       // castShadow
//       // receiveShadow
//     />
//   );
// }

// useGLTF.preload('/models/shivling.glb');

// // /** Water flows around the full circumference of the rotating Shivling. */
// // function AbhishekWater() {
// //   const meshRef = useRef<THREE.Mesh>(null);

// //   const geometry = useMemo(() => {
// //     const segments = 192;
// //     const rings = 100;

// //     // Local coordinates assume the GLB is normalized to height 4.5.
// //     const topY = 4.49;
// //     const bottomY = 2.72;

// //     const positions: number[] = [];
// //     const uvs: number[] = [];
// //     const indices: number[] = [];

// //     // Approximate the rounded crown and cylindrical body.
// //     const radiusAt = (t: number) => {
// //       if (t < 0.12) {
// //         const crown = t / 0.12;
// //         return 0.055 + 0.31 * Math.sin(crown * Math.PI * 0.5);
// //       }

// //       if (t < 0.88) {
// //         return 0.37 + 0.025 * Math.sin(t * Math.PI * 3.0);
// //       }

// //       return 0.395 - (t - 0.88) * 0.12;
// //     };

// //     for (let j = 0; j <= rings; j++) {
// //       const v = j / rings;
// //       const y = THREE.MathUtils.lerp(topY, bottomY, v);
// //       const radius = radiusAt(v);

// //       for (let i = 0; i <= segments; i++) {
// //         const u = i / segments;
// //         const angle = u * Math.PI * 2;

// //         // A tiny offset keeps the water just above the stone.
// //         const r = radius + 0.018;

// //         positions.push(
// //           Math.sin(angle) * r,
// //           y,
// //           Math.cos(angle) * r,
// //         );

// //         uvs.push(u, v);
// //       }
// //     }

// //     for (let j = 0; j < rings; j++) {
// //       for (let i = 0; i < segments; i++) {
// //         const a = j * (segments + 1) + i;
// //         const b = a + segments + 1;

// //         indices.push(a, b, a + 1);
// //         indices.push(b, b + 1, a + 1);
// //       }
// //     }

// //     const geo = new THREE.BufferGeometry();

// //     geo.setAttribute(
// //       'position',
// //       new THREE.Float32BufferAttribute(positions, 3),
// //     );
// //     geo.setAttribute(
// //       'uv',
// //       new THREE.Float32BufferAttribute(uvs, 2),
// //     );
// //     geo.setIndex(indices);
// //     geo.computeVertexNormals();

// //     return geo;
// //   }, []);

// //   const material = useMemo(
// //     () =>
// //       new THREE.ShaderMaterial({
// //         transparent: true,
// //         depthWrite: false,
// //         side: THREE.DoubleSide,
// //         uniforms: {
// //           uTime: { value: 0 },
// //         },
// //         vertexShader: `
// //           varying vec2 vUv;

// //           void main() {
// //             vUv = uv;
// //             gl_Position = projectionMatrix *
// //               modelViewMatrix * vec4(position, 1.0);
// //           }
// //         `,
// //         fragmentShader: `
// //           uniform float uTime;
// //           varying vec2 vUv;

// //           void main() {
// //             float flow = vUv.y * 24.0 - uTime * 3.8
// //               + sin(vUv.x * 32.0 + uTime * 1.5) * 0.65;

// //             float streak = smoothstep(
// //               0.35, 0.95, sin(flow) * 0.5 + 0.5
// //             );

// //             float fineStreak = smoothstep(
// //               0.72, 0.98,
// //               sin(vUv.y * 85.0 - uTime * 6.0 + vUv.x * 50.0)
// //                 * 0.5 + 0.5
// //             );

// //             float variation = 0.35 + streak * 0.42 + fineStreak * 0.23;

// //             vec3 waterColor = mix(
// //               vec3(0.08, 0.42, 0.70),
// //               vec3(0.78, 0.96, 1.0),
// //               variation
// //             );

// //             float edgeFade = smoothstep(0.0, 0.08, vUv.y)
// //               * (1.0 - smoothstep(0.90, 1.0, vUv.y));

// //             float alpha = (0.24 + streak * 0.44 + fineStreak * 0.22)
// //               * edgeFade;

// //             gl_FragColor = vec4(waterColor, alpha);
// //           }
// //         `,
// //       }),
// //     [],
// //   );

// //   useFrame((state) => {
// //     material.uniforms.uTime.value = state.clock.elapsedTime;
// //   });

// //   useEffect(() => {
// //     return () => {
// //       geometry.dispose();
// //       material.dispose();
// //     };
// //   }, [geometry, material]);

// //   return (
// //     <mesh
// //       ref={meshRef}
// //       geometry={geometry}
// //       material={material}
// //       position={[0, 0.46, 0.12]}
// //       renderOrder={5}
// //       frustumCulled={false}
// //     />
// //   );
// // }


// // function AbhishekWater() {
// //   const materialRef = useRef<THREE.ShaderMaterial>(null);

// //   const geometry = useMemo(() => {
// //     const segments = 256;
// //     const rings = 120;
// //     const positions: number[] = [];
// //     const uvs: number[] = [];
// //     const indices: number[] = [];

// //     // Coordinates match the normalized 4.5-unit Shivling model.
// //     // Adjust these radii if your downloaded model has a different shape.
// //     const profile = [
// //   { t: 0.00, y: 4.49, r: 0.055 },
// //   { t: 0.05, y: 4.43, r: 0.23 },
// //   { t: 0.12, y: 4.25, r: 0.37 },
// //   { t: 0.20, y: 4.00, r: 0.405 },
// //   { t: 0.48, y: 3.35, r: 0.41 },
// //   { t: 0.75, y: 2.75, r: 0.425 },
// //   { t: 1.00, y: 2.35, r: 0.44 },
// // ];

// //     const sampleProfile = (t: number) => {
// //       for (let k = 0; k < profile.length - 1; k++) {
// //         const a = profile[k];
// //         const b = profile[k + 1];

// //         if (t <= b.t) {
// //           const f = (t - a.t) / (b.t - a.t);
// //           const smooth = f * f * (3 - 2 * f);

// //           return {
// //             y: THREE.MathUtils.lerp(a.y, b.y, f),
// //             r: THREE.MathUtils.lerp(a.r, b.r, smooth),
// //           };
// //         }
// //       }

// //       return profile[profile.length - 1];
// //     };

// //     for (let j = 0; j <= rings; j++) {
// //       const t = j / rings;
// //       const p = sampleProfile(t);

// //       for (let i = 0; i <= segments; i++) {
// //         const u = i / segments;
// //         const angle = u * Math.PI * 2;

// //         // Small gap prevents the water surface from z-fighting with stone.
// //         const r = p.r + 0.25;

// //         positions.push(
// //           Math.sin(angle) * r,
// //           p.y,
// //           Math.cos(angle) * r,
// //         );

// //         uvs.push(u, t);
// //       }
// //     }

// //     for (let j = 0; j < rings; j++) {
// //       for (let i = 0; i < segments; i++) {
// //         const a = j * (segments + 1) + i;
// //         const b = a + segments + 1;

// //         indices.push(a, b, a + 1);
// //         indices.push(b, b + 1, a + 1);
// //       }
// //     }

// //     const geo = new THREE.BufferGeometry();

// //     geo.setAttribute(
// //       'position',
// //       new THREE.Float32BufferAttribute(positions, 3),
// //     );
// //     geo.setAttribute(
// //       'uv',
// //       new THREE.Float32BufferAttribute(uvs, 2),
// //     );
// //     geo.setIndex(indices);
// //     geo.computeVertexNormals();

// //     return geo;
// //   }, []);

// //   const material = useMemo(
// //     () =>
// //       new THREE.ShaderMaterial({
// //         transparent: true,
// //         depthWrite: false,
// //         side: THREE.DoubleSide,
// //         uniforms: {
// //           uTime: { value: 0 },
// //         },
// //         vertexShader: `
// //           varying vec2 vUv;

// //           void main() {
// //             vUv = uv;
// //             gl_Position = projectionMatrix *
// //               modelViewMatrix * vec4(position, 1.0);
// //           }
// //         `,
// //         fragmentShader: `
// //           uniform float uTime;
// //           varying vec2 vUv;

// //           void main() {
// //             float angle = vUv.x * 6.2831853;

// //             // Several narrow, irregular streams around the full surface.
// //             float bands = sin(
// //               angle * 25.0
// //               + sin(angle * 7.0) * 1.5
// //               + uTime * 0.55
// //             );

// //             float streams = smoothstep(0.25, 0.88, bands);

// //             float fine = sin(
// //               angle * 65.0
// //               + vUv.y * 12.0
// //               - uTime * 2.8
// //             );

// //             float shimmer = smoothstep(0.52, 0.96, fine);

// //             // Motion travels downward from the crown.
// //             float flow = sin(
// //               vUv.y * 70.0
// //               - uTime * 7.0
// //               + sin(angle * 9.0) * 1.2
// //             );

// //             float movingHighlights =
// //               smoothstep(0.45, 0.96, flow);

// //             vec3 darkWater = vec3(0.025, 0.19, 0.31);
// //             vec3 blueWater = vec3(0.16, 0.56, 0.78);
// //             vec3 brightWater = vec3(0.78, 0.96, 1.0);

// //             vec3 color = mix(
// //               darkWater,
// //               blueWater,
// //               0.30 + streams * 0.35
// //             );

// //             color = mix(
// //               color,
// //               brightWater,
// //               shimmer * 0.34 + movingHighlights * 0.32
// //             );

// //             // The water stays visible around the entire lingam.
// //             float alpha = 0.25
// //               + streams * 0.15
// //               + shimmer * 0.12
// //               + movingHighlights * 0.12;

// //             // Fade only near the top and bottom edges.
// //             alpha *= smoothstep(0.0, 0.035, vUv.y);
// //             alpha *= 1.0 - smoothstep(0.95, 1.0, vUv.y);

// //             gl_FragColor = vec4(color, alpha);
// //           }
// //         `,
// //       }),
// //     [],
// //   );

// //   useFrame((state) => {
// //     if (materialRef.current) {
// //       materialRef.current.uniforms.uTime.value =
// //         state.clock.elapsedTime;
// //     }
// //   });

// //   useEffect(() => {
// //     return () => {
// //       geometry.dispose();
// //       material.dispose();
// //     };
// //   }, [geometry, material]);

// //   return (
// //     <mesh
// //       geometry={geometry}
// //       position={[-0.48, 0.30, 0.10]}
// //       renderOrder={5}
// //       frustumCulled={false}
// //     >
// //       <primitive
// //         ref={materialRef}
// //         object={material}
// //         attach="material"
// //       />
// //     </mesh>
// //   );
// // }

// // function AbhishekWater() {
// //   const dropsRef = useRef<THREE.InstancedMesh>(null);
// //   const blanketMaterialRef = useRef<THREE.ShaderMaterial>(null);

// //   const dropCount = 360;
// //   const streamCount = 40;

// //   // Reuse the earlier blanket's height and radius profile.
// //   const topY = 4.49;
// //   const blanketBottomY = 2.35;
// //   const fallBottomY = 0.16;
// //   const segments = 192;
// //   const rings = 100;

// //   // Full 360-degree water blanket.
// //   const blanketGeometry = useMemo(() => {
// //     const positions: number[] = [];
// //     const uvs: number[] = [];
// //     const indices: number[] = [];

// //     const profile = [
// //       { t: 0.0, r: 0.055 },
// //       { t: 0.05, r: 0.23 },
// //       { t: 0.12, r: 0.37 },
// //       { t: 0.2, r: 0.405 },
// //       { t: 0.48, r: 0.41 },
// //       { t: 0.75, r: 0.425 },
// //       { t: 1.0, r: 0.44 },
// //     ];

// //     const radiusAt = (t: number) => {
// //       for (let k = 0; k < profile.length - 1; k++) {
// //         const a = profile[k];
// //         const b = profile[k + 1];

// //         if (t <= b.t) {
// //           const f = (t - a.t) / (b.t - a.t);
// //           const smooth = f * f * (3 - 2 * f);
// //           return THREE.MathUtils.lerp(a.r, b.r, smooth) + 0.25;
// //         }
// //       }

// //       return 0.69;
// //     };

// //     for (let j = 0; j <= rings; j++) {
// //       const v = j / rings;
// //       const y = THREE.MathUtils.lerp(topY, blanketBottomY, v);

// //       for (let i = 0; i <= segments; i++) {
// //         const u = i / segments;
// //         const angle = u * Math.PI * 2;

// //         // Small undulation breaks up the perfectly smooth cylinder.
// //         const ripple =
// //           Math.sin(angle * 17 + v * 24) * 0.012 +
// //           Math.sin(angle * 31 - v * 18) * 0.006;

// //         const r = radiusAt(v) + ripple;

// //         positions.push(
// //           Math.sin(angle) * r,
// //           y,
// //           Math.cos(angle) * r,
// //         );

// //         uvs.push(u, v);
// //       }
// //     }

// //     for (let j = 0; j < rings; j++) {
// //       for (let i = 0; i < segments; i++) {
// //         const a = j * (segments + 1) + i;
// //         const b = a + segments + 1;
// //         indices.push(a, b, a + 1, b, b + 1, a + 1);
// //       }
// //     }

// //     const geometry = new THREE.BufferGeometry();
// //     geometry.setAttribute(
// //       'position',
// //       new THREE.Float32BufferAttribute(positions, 3),
// //     );
// //     geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
// //     geometry.setIndex(indices);
// //     geometry.computeVertexNormals();

// //     return geometry;
// //   }, []);

// //   // Animated transparent water with fine, moving highlights.
// //   const blanketMaterial = useMemo(
// //     () =>
// //       new THREE.ShaderMaterial({
// //         transparent: true,
// //         depthWrite: false,
// //         side: THREE.DoubleSide,
// //         uniforms: {
// //           uTime: { value: 0 },
// //         },
// //         vertexShader: `
// //           varying vec2 vUv;

// //           void main() {
// //             vUv = uv;
// //             gl_Position = projectionMatrix * modelViewMatrix
// //               * vec4(position, 1.0);
// //           }
// //         `,
// //         fragmentShader: `
// //           uniform float uTime;
// //           varying vec2 vUv;

// //           void main() {
// //             float angle = vUv.x * 6.2831853;

// //             float broadFlow = sin(
// //               vUv.y * 42.0 - uTime * 5.0
// //               + sin(angle * 8.0 + uTime * 0.8) * 1.1
// //             );

// //             float fineFlow = sin(
// //               vUv.y * 115.0 - uTime * 8.0
// //               + sin(angle * 19.0 - uTime) * 1.8
// //             );

// //             float streaks = smoothstep(0.05, 0.88, broadFlow * 0.5 + 0.5);
// //             float fine = smoothstep(0.48, 0.96, fineFlow * 0.5 + 0.5);

// //             float brokenFlow = sin(
// //               angle * 38.0 + sin(vUv.y * 13.0 + uTime) * 2.0
// //             );

// //             float strands = smoothstep(0.40, 0.95, brokenFlow * 0.5 + 0.5);

// //             vec3 deepWater = vec3(0.025, 0.16, 0.27);
// //             vec3 blueWater = vec3(0.10, 0.43, 0.64);
// //             vec3 whiteWater = vec3(0.82, 0.96, 1.0);

// //             vec3 color = mix(deepWater, blueWater, 0.35 + streaks * 0.45);
// //             color = mix(color, whiteWater, fine * 0.55 + strands * 0.23);

// //             float alpha = 0.25 + streaks * 0.16 + fine * 0.28 + strands * 0.12;
// //             alpha *= smoothstep(0.0, 0.025, vUv.y);
// //             alpha *= 1.0 - smoothstep(0.97, 1.0, vUv.y);

// //             gl_FragColor = vec4(color, alpha);
// //           }
// //         `,
// //       }),
// //     [],
// //   );

// //   // Separate curved rivulets travel from the crown down to the basin.
// //   const streamGeometries = useMemo(() => {
// //     return Array.from({ length: streamCount }, (_, i) => {
// //       const angle = (i / streamCount) * Math.PI * 2;
// //       const wobble = Math.sin(i * 2.31) * 0.045;
// //       const points: THREE.Vector3[] = [];

// //       points.push(
// //         new THREE.Vector3(
// //           Math.cos(angle) * 0.04,
// //           topY + 0.09,
// //           Math.sin(angle) * 0.04,
// //         ),
// //       );

// //       points.push(
// //         new THREE.Vector3(
// //           Math.cos(angle + 0.08) * 0.24,
// //           topY - 0.28,
// //           Math.sin(angle + 0.08) * 0.24,
// //         ),
// //       );

// //       points.push(
// //         new THREE.Vector3(
// //           Math.cos(angle + 0.12) * 0.52,
// //           topY - 0.72,
// //           Math.sin(angle + 0.12) * 0.52,
// //         ),
// //       );

// //       points.push(
// //         new THREE.Vector3(
// //           Math.cos(angle + 0.17) * (0.69 + wobble),
// //           2.45,
// //           Math.sin(angle + 0.17) * (0.69 + wobble),
// //         ),
// //       );

// //       points.push(
// //         new THREE.Vector3(
// //           Math.cos(angle + 0.2) * (0.72 + wobble),
// //           fallBottomY,
// //           Math.sin(angle + 0.2) * (0.72 + wobble),
// //         ),
// //       );

// //       const curve = new THREE.CatmullRomCurve3(points);

// //       return new THREE.TubeGeometry(
// //         curve,
// //         100,
// //         i % 5 === 0 ? 0.018 : 0.011,
// //         8,
// //         false,
// //       );
// //     });
// //   }, []);

// //   const streamMaterial = useMemo(
// //     () =>
// //       new THREE.MeshPhysicalMaterial({
// //         color: '#8de5ff',
// //         roughness: 0.055,
// //         metalness: 0.0,
// //         transparent: true,
// //         opacity: 0.68,
// //         clearcoat: 1,
// //         clearcoatRoughness: 0.025,
// //         depthWrite: false,
// //       }),
// //     [],
// //   );

// //   const dropGeometry = useMemo(
// //     () => new THREE.SphereGeometry(1, 10, 12),
// //     [],
// //   );

// //   const dropMaterial = useMemo(
// //     () =>
// //       new THREE.MeshPhysicalMaterial({
// //         color: '#d8f5ff',
// //         roughness: 0.025,
// //         metalness: 0,
// //         transparent: true,
// //         opacity: 0.94,
// //         clearcoat: 1,
// //         clearcoatRoughness: 0.015,
// //         depthWrite: false,
// //       }),
// //     [],
// //   );

// //   const dummy = useMemo(() => new THREE.Object3D(), []);

// //   const drops = useMemo(
// //     () =>
// //       Array.from({ length: dropCount }, (_, i) => ({
// //         angle: i * 2.399963,
// //         phase: (i * 0.6180339) % 1,
// //         speed: 0.75 + (i % 11) * 0.095,
// //         spread: 0.08 + ((i * 7) % 13) * 0.055,
// //         size: 0.008 + (i % 5) * 0.0035,
// //       })),
// //     [],
// //   );

// //   useFrame((state) => {
// //     const time = state.clock.elapsedTime;

// //     if (blanketMaterialRef.current) {
// //       blanketMaterialRef.current.uniforms.uTime.value = time;
// //     }

// //     const mesh = dropsRef.current;
// //     if (!mesh) return;

// //     for (let i = 0; i < drops.length; i++) {
// //       const d = drops[i];
// //       const progress = (time * d.speed + d.phase) % 1;

// //       // Drops start just above the crown and fall around the full circumference.
// //       const y = topY + 0.13 - progress * (topY - fallBottomY + 0.13);

// //       const radius =
// //         0.045 +
// //         progress * d.spread +
// //         Math.sin(progress * Math.PI) * 0.035;

// //       const angle = d.angle + Math.sin(time * 1.6 + i) * 0.025;

// //       dummy.position.set(
// //         Math.cos(angle) * radius,
// //         y,
// //         Math.sin(angle) * radius,
// //       );

// //       // Teardrop-like ellipsoids with slight size variation.
// //       const pulse = 0.82 + Math.sin(time * 4.5 + i) * 0.18;
// //       dummy.scale.set(
// //         d.size * pulse,
// //         d.size * (2.2 + d.speed) * pulse,
// //         d.size * pulse,
// //       );

// //       dummy.rotation.set(
// //         0.12 * Math.sin(time + i),
// //         angle,
// //         0.1 * Math.cos(time * 0.8 + i),
// //       );

// //       dummy.updateMatrix();
// //       mesh.setMatrixAt(i, dummy.matrix);
// //     }

// //     mesh.instanceMatrix.needsUpdate = true;
// //   });

// //   useEffect(() => {
// //     return () => {
// //       blanketGeometry.dispose();
// //       blanketMaterial.dispose();
// //       streamGeometries.forEach((geometry) => geometry.dispose());
// //       streamMaterial.dispose();
// //       dropGeometry.dispose();
// //       dropMaterial.dispose();
// //     };
// //   }, [
// //     blanketGeometry,
// //     blanketMaterial,
// //     streamGeometries,
// //     streamMaterial,
// //     dropGeometry,
// //     dropMaterial,
// //   ]);

// //   return (
// //     // Keep your final manually chosen position.
// //     <group position={[-0.48, 0.30, 0.10]}>
// //       <mesh
// //         geometry={blanketGeometry}
// //         renderOrder={5}
// //         frustumCulled={false}
// //       >
// //         <primitive
// //           object={blanketMaterial}
// //           attach="material"
// //           ref={blanketMaterialRef}
// //         />
// //       </mesh>

// //       {streamGeometries.map((geometry, i) => (
// //         <mesh
// //           key={i}
// //           geometry={geometry}
// //           material={streamMaterial}
// //           renderOrder={6}
// //           frustumCulled={false}
// //         />
// //       ))}

// //       <instancedMesh
// //         ref={dropsRef}
// //         args={[dropGeometry, dropMaterial, dropCount]}
// //         renderOrder={7}
// //         frustumCulled={false}
// //       />
// //     </group>
// //   );
// // }

// const WATER_POSITION: [number, number, number] = [
//   -0.48, 0.30, 0.10,
// ];

// const WATER_HEIGHT = 1.58;
// const WATER_TOP_RADIUS = 0.48;
// const WATER_BOTTOM_RADIUS = 0.43;
// const DROPLET_COUNT = 180;

// /**
//  * Creates a smooth, open-ended 360-degree water curtain.
//  * UV coordinates animate vertically flowing highlights.
//  */
// function createAbhishekMaterial() {
//   return new THREE.ShaderMaterial({
//     transparent: true,
//     depthWrite: false,
//     side: THREE.DoubleSide,
//     uniforms: {
//       uTime: { value: 0 },
//     },
//     vertexShader: `
//       uniform float uTime;
//       varying vec2 vUv;
//       varying vec3 vWorldNormal;

//       void main() {
//         vUv = uv;

//         vec3 p = position;

//         // Subtle irregular movement in the falling water.
//         float wave1 = sin(uv.x * 42.0 + uTime * 1.5
//                           + uv.y * 8.0) * 0.009;
//         float wave2 = sin(uv.x * 79.0 - uTime * 2.1
//                           + uv.y * 17.0) * 0.004;

//         float envelope = smoothstep(0.0, 0.12, uv.y);
//         p.x += (wave1 + wave2) * envelope;

//         vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
//         gl_Position = projectionMatrix * mvPosition;

//         vWorldNormal = normalize(mat3(modelMatrix) * normal);
//       }
//     `,
//     fragmentShader: `
//       uniform float uTime;
//       varying vec2 vUv;
//       varying vec3 vWorldNormal;

//       void main() {
//         float angle = vUv.x * 6.2831853;
//         float fall = vUv.y;

//         // Multiple overlapping, non-uniform flowing patterns.
//         float distortion =
//           sin(angle * 5.0 + uTime * 0.55) * 0.025
//           + sin(angle * 13.0 - uTime * 0.8) * 0.012;

//         float flow = fall + distortion;

//         float broadFlow = sin(
//           flow * 24.0 - uTime * 4.0
//           + sin(angle * 4.0 + uTime * 0.7) * 1.1
//         );

//         float fineFlow = sin(
//           flow * 68.0 - uTime * 6.8
//           + sin(angle * 9.0 - uTime) * 1.4
//         );

//         float glimmer = smoothstep(
//           0.40, 0.94, broadFlow * 0.5 + 0.5
//         );

//         float fineGlimmer = smoothstep(
//           0.78, 0.99, fineFlow * 0.5 + 0.5
//         );

//         // Break up uniform stripes to avoid the wire-cage look.
//         float breakup =
//           0.72 + 0.28 * sin(angle * 17.0 + fall * 31.0);

//         glimmer *= breakup;

//         vec3 deepWater = vec3(0.018, 0.12, 0.19);
//         vec3 blueWater = vec3(0.08, 0.35, 0.49);
//         vec3 brightReflection = vec3(0.72, 0.91, 1.0);

//         vec3 color = mix(deepWater, blueWater, 0.55);
//         color = mix(
//           color,
//           brightReflection,
//           clamp(glimmer * 0.58 + fineGlimmer * 0.25, 0.0, 0.8)
//         );

//         // Fresnel-like rim highlights.
//         float facing = abs(dot(
//           normalize(vWorldNormal),
//           vec3(0.0, 0.0, 1.0)
//         ));

//         float rim = pow(1.0 - facing, 2.0);

//         float alpha =
//           0.16
//           + glimmer * 0.24
//           + fineGlimmer * 0.10
//           + rim * 0.12;

//         // Fade the edges without cutting off the falling water.
//         alpha *= smoothstep(0.0, 0.035, fall);
//         alpha *= 1.0 - smoothstep(0.965, 1.0, fall);

//         gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.62));
//       }
//     `,
//   });
// }

// /**
//  * Animated droplets distributed around the entire Shivling.
//  * Every particle loops from above the crown down toward the basin.
//  */
// function AbhishekDroplets() {
//   const dropletsRef = useRef<THREE.InstancedMesh>(null);

//   const dummy = useMemo(() => new THREE.Object3D(), []);
//   const rng = (n: number) => {
//     const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
//     return x - Math.floor(x);
//   };

//   const particleData = useMemo(
//     () =>
//       Array.from({ length: DROPLET_COUNT }, (_, i) => ({
//         angle: rng(i + 1) * Math.PI * 2,
//         phase: rng(i + 101),
//         speed: 0.55 + rng(i + 201) * 0.85,
//         radius: 0.40 + rng(i + 301) * 0.12,
//         size: 0.009 + rng(i + 401) * 0.012,
//         drift: (rng(i + 501) - 0.5) * 0.075,
//       })),
//     [],
//   );

//   useEffect(() => {
//     const mesh = dropletsRef.current;
//     if (!mesh) return;

//     mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

//     for (let i = 0; i < DROPLET_COUNT; i++) {
//       dummy.position.set(0, -100, 0);
//       dummy.scale.setScalar(0);
//       dummy.updateMatrix();
//       mesh.setMatrixAt(i, dummy.matrix);
//     }

//     mesh.instanceMatrix.needsUpdate = true;
//   }, [dummy]);

//   useFrame((state) => {
//     const mesh = dropletsRef.current;
//     if (!mesh) return;

//     const time = state.clock.elapsedTime;

//     particleData.forEach((drop, i) => {
//       const progress =
//         (time * drop.speed * 0.36 + drop.phase) % 1;

//       // Start slightly above the lingam and fall toward the basin.
//       const y = WATER_HEIGHT + 0.10 - progress * (WATER_HEIGHT + 0.02);

//       const angle =
//         drop.angle
//         + Math.sin(time * 1.1 + drop.phase * 6.0) * 0.025;

//       const radius = drop.radius + progress * 0.055;
//       const x = Math.cos(angle) * radius + drop.drift * progress;
//       const z = Math.sin(angle) * radius;

//       // Stretch droplets vertically as they accelerate downward.
//       const size = drop.size * (0.8 + progress * 0.45);

//       dummy.position.set(x, y, z);
//       dummy.scale.set(size * 0.8, size * 1.9, size * 0.8);
//       dummy.rotation.set(
//         0.10 * Math.sin(time + drop.phase),
//         angle,
//         0.08 * Math.cos(time * 1.3 + drop.phase),
//       );
//       dummy.updateMatrix();

//       mesh.setMatrixAt(i, dummy.matrix);
//     });

//     mesh.instanceMatrix.needsUpdate = true;
//   });

//   return (
//     <instancedMesh
//       ref={dropletsRef}
//       args={[undefined, undefined, DROPLET_COUNT]}
//       frustumCulled={false}
//       renderOrder={7}
//     >
//       <sphereGeometry args={[1, 8, 8]} />
//       <meshPhysicalMaterial
//         color="#a9eaff"
//         roughness={0.08}
//         metalness={0}
//         clearcoat={1}
//         clearcoatRoughness={0.03}
//         transparent
//         opacity={0.86}
//         depthWrite={false}
//         emissive="#123c52"
//         emissiveIntensity={0.15}
//       />
//     </instancedMesh>
//   );
// }

// /**
//  * Main 360-degree jal abhishek effect.
//  * Keep WATER_POSITION unchanged to preserve your current alignment.
//  */
// function AbhishekWater() {
//   const waterRef = useRef<THREE.Mesh>(null);

//   const waterGeometry = useMemo(() => {
//     const geometry = new THREE.CylinderGeometry(
//       WATER_TOP_RADIUS,
//       WATER_BOTTOM_RADIUS,
//       WATER_HEIGHT,
//       128,
//       96,
//       true,
//     );

//     // Place the bottom at y=0 and the top above the lingam.
//     geometry.translate(0, WATER_HEIGHT / 2, 0);

//     return geometry;
//   }, []);

//   const waterMaterial = useMemo(createAbhishekMaterial, []);

//   useFrame((state) => {
//     waterMaterial.uniforms.uTime.value = state.clock.elapsedTime;

//     if (waterRef.current) {
//       // Gentle movement of the water surface, not the island.
//       waterRef.current.rotation.y =
//         Math.sin(state.clock.elapsedTime * 0.35) * 0.012;
//     }
//   });

//   useEffect(() => {
//     return () => {
//       waterGeometry.dispose();
//       waterMaterial.dispose();
//     };
//   }, [waterGeometry, waterMaterial]);

//   return (
//     <group position={WATER_POSITION}>
//       {/* Smooth flowing water curtain around all 360 degrees */}
//       <mesh
//         ref={waterRef}
//         geometry={waterGeometry}
//         material={waterMaterial}
//         renderOrder={5}
//         frustumCulled={false}
//       />

//       {/* Fine droplets falling around the whole water curtain */}
//       <AbhishekDroplets />
//     </group>
//   );
// }

// export default function CentralSanctuary() {
//   const sanctuaryRef = useRef<THREE.Group>(null);

//   const rockGeometry = useMemo(createRockGeometry, []);
//   const lingamGeometry = useMemo(createLingamGeometry, []);
//   const basinGeometry = useMemo(createBasinGeometry, []);

//   const darkStone = useMemo(
//   () =>
//     new THREE.MeshPhysicalMaterial({
//       color: '#171b25',
//       roughness: 0.17,
//       metalness: 0.22,
//       clearcoat: 1,
//       clearcoatRoughness: 0.08,
//       emissive: '#080d19',
//       emissiveIntensity: 0.08,
//     }),
//   [],
// );

//   const platformStone = useMemo(
//     () =>
//       new THREE.MeshStandardMaterial({
//         color: '#34394a',
//         roughness: 0.63,
//         metalness: 0.20,
//       }),
//     [],
//   );

//   const goldTrim = useMemo(
//     () =>
//       new THREE.MeshStandardMaterial({
//         color: '#c6a36a',
//         metalness: 0.72,
//         roughness: 0.25,
//         emissive: '#503016',
//         emissiveIntensity: 0.22,
//       }),
//     [],
//   );

//   const basinWater = useMemo(
//     () =>
//       new THREE.MeshPhysicalMaterial({
//         color: '#1684b9',
//         roughness: 0.12,
//         metalness: 0.15,
//         transparent: true,
//         opacity: 0.86,
//         clearcoat: 1,
//         clearcoatRoughness: 0.06,
//         emissive: '#07365a',
//         emissiveIntensity: 0.24,
//       }),
//     [],
//   );

//   // const mainWaterPoints = useMemo(
//   //   () => [
//   //     new THREE.Vector3(0.015, 1.49, 0.035),
//   //     new THREE.Vector3(0.005, 1.40, 0.19),
//   //     new THREE.Vector3(-0.015, 1.25, 0.31),
//   //     new THREE.Vector3(0.015, 1.04, 0.365),
//   //     new THREE.Vector3(-0.01, 0.82, 0.40),
//   //     new THREE.Vector3(0.015, 0.61, 0.43),
//   //     new THREE.Vector3(0.0, 0.49, 0.47),
//   //   ],
//   //   [],
//   // );

//   // const leftWaterPoints = useMemo(
//   //   () => [
//   //     new THREE.Vector3(-0.20, 1.39, 0.17),
//   //     new THREE.Vector3(-0.24, 1.20, 0.28),
//   //     new THREE.Vector3(-0.25, 0.96, 0.35),
//   //     new THREE.Vector3(-0.23, 0.73, 0.40),
//   //     new THREE.Vector3(-0.27, 0.52, 0.47),
//   //   ],
//   //   [],
//   // );

//   // const rightWaterPoints = useMemo(
//   //   () => [
//   //     new THREE.Vector3(0.21, 1.39, 0.17),
//   //     new THREE.Vector3(0.24, 1.20, 0.28),
//   //     new THREE.Vector3(0.25, 0.96, 0.35),
//   //     new THREE.Vector3(0.23, 0.73, 0.40),
//   //     new THREE.Vector3(0.27, 0.52, 0.47),
//   //   ],
//   //   [],
//   // );
  
//   const mainWaterPoints = useMemo(
//   () => [
//     new THREE.Vector3(0.00, 4.35, 0.16),
//     new THREE.Vector3(0.00, 4.05, 0.34),
//     new THREE.Vector3(-0.01, 3.60, 0.47),
//     new THREE.Vector3(0.01, 3.10, 0.54),
//     new THREE.Vector3(-0.01, 2.40, 0.59),
//     new THREE.Vector3(0.00, 1.55, 0.64),
//     new THREE.Vector3(0.00, 1.00, 0.68),
//   ],
//   [],
// );

// const leftWaterPoints = useMemo(
//   () => [
//     new THREE.Vector3(-0.34, 4.05, 0.16),
//     new THREE.Vector3(-0.38, 3.70, 0.34),
//     new THREE.Vector3(-0.43, 3.20, 0.46),
//     new THREE.Vector3(-0.46, 2.60, 0.53),
//     new THREE.Vector3(-0.48, 1.75, 0.61),
//     new THREE.Vector3(-0.42, 1.00, 0.68),
//   ],
//   [],
// );

// const rightWaterPoints = useMemo(
//   () => [
//     new THREE.Vector3(0.34, 4.05, 0.16),
//     new THREE.Vector3(0.38, 3.70, 0.34),
//     new THREE.Vector3(0.43, 3.20, 0.46),
//     new THREE.Vector3(0.46, 2.60, 0.53),
//     new THREE.Vector3(0.48, 1.75, 0.61),
//     new THREE.Vector3(0.42, 1.00, 0.68),
//   ],
//   [],
// );

// const extraWaterPaths = useMemo(
//   () =>
//     [-0.24, -0.12, 0.12, 0.24].map(
//       (x) => [
//         new THREE.Vector3(x * 0.65, 4.00, 0.20),
//         new THREE.Vector3(x * 0.90, 3.65, 0.38),
//         new THREE.Vector3(x, 3.10, 0.49),
//         new THREE.Vector3(x * 1.05, 2.45, 0.57),
//         new THREE.Vector3(x * 0.90, 1.65, 0.64),
//         new THREE.Vector3(x, 1.00, 0.68),
//       ],
//     ),
//   [],
// );

//   useEffect(() => {
//     return () => {
//       rockGeometry.dispose();
//       lingamGeometry.dispose();
//       basinGeometry.dispose();
//       darkStone.dispose();
//       platformStone.dispose();
//       goldTrim.dispose();
//       basinWater.dispose();
//     };
//   }, [
//     rockGeometry,
//     lingamGeometry,
//     basinGeometry,
//     darkStone,
//     platformStone,
//     goldTrim,
//     basinWater,
//   ]);

//   useFrame((state, delta) => {
//   if (!sanctuaryRef.current) return;

//   // Lower the complete island and Shivling.
//   sanctuaryRef.current.position.y =
//     -2.50 + Math.sin(state.clock.elapsedTime * 0.42) * 0.025;

//   // Keep the same slow, continuous rotation.
//   sanctuaryRef.current.rotation.y += delta * 0.18;
// });

//   return (
//     <group ref={sanctuaryRef} position={[0, 0, 0]}>
//       {/* Floating rocky island */}
//       <mesh
//   geometry={rockGeometry}
//   position={[0, -0.55, 0]}
//   scale={[4.7, 1.35, 4.65]}
//   material={platformStone}
//   castShadow
//   receiveShadow
// />

//       {/* <mesh position={[0, -0.10, 0]}>
//         <cylinderGeometry args={[2.15, 2.28, 0.22, 96]} />
//         <primitive object={platformStone} attach="material" />
//       </mesh>

//       {/* Circular sanctuary platform */}
//       {/* <mesh position={[0, 0.08, 0]}>
//         <cylinderGeometry args={[2.0, 2.12, 0.22, 96]} />
//         <meshStandardMaterial
//           color="#34394a"
//           roughness={0.45}
//           metalness={0.28}
//         />
//       </mesh> */}

//       {/* Lower platform */}
// <mesh position={[0, -0.10, 0]}>
//   <cylinderGeometry args={[2.55, 2.70, 0.22, 96]} />
//   <primitive object={platformStone} attach="material" />
// </mesh>

// {/* Upper platform */}
// <mesh position={[0, 0.08, 0]}>
//   <cylinderGeometry args={[2.35, 2.48, 0.22, 96]} />
//   <meshStandardMaterial
//     color="#34394a"
//     roughness={0.45}
//     metalness={0.28}
//   />
// </mesh>

//       {/* <mesh position={[0, 0.198, 0]}>
//         <torusGeometry args={[1.78, 0.018, 8, 96]} />
//         <primitive object={goldTrim} attach="material" />
//       </mesh> */}

//       {/* Raised pedestal beneath the yoni */}
//       <mesh position={[0, 0.235, 0]} scale={[1.0, 1, 0.82]}>
//         <cylinderGeometry args={[0.93, 1.02, 0.20, 96]} />
//         <primitive object={darkStone} attach="material" />
//       </mesh>

//       <mesh position={[0, 0.345, 0]} scale={[1.0, 1, 0.84]}>
//         <cylinderGeometry args={[0.94, 0.94, 0.055, 96]} />
//         <primitive object={goldTrim} attach="material" />
//       </mesh>

//       {/* Traditional yoni basin and front spout */}
//       <mesh
//         geometry={basinGeometry}
//         position={[0, 0.37, 0.0]}
//         scale={[1.0, 1.0, 1.0]}
//         material={darkStone}
//         castShadow
//         receiveShadow
//       />

//       {/* Visible pool inside the basin */}
//       <mesh
//         position={[0, 0.475, -0.015]}
//         rotation={[-Math.PI / 2, 0, 0]}
//       >
//         <circleGeometry args={[0.78, 96]} />
//         <primitive object={basinWater} attach="material" />
//       </mesh>

//       {/* Downloaded GLB Shivling model */}
//       <ShivlingModel />

//       {/* Fine metallic highlight around the basin rim */}
//       <mesh
//         position={[0, 0.49, -0.01]}
//         rotation={[-Math.PI / 2, 0, 0]}
//       >
//         <torusGeometry args={[0.69, 0.012, 8, 96]} />
//         <primitive object={goldTrim} attach="material" />
//       </mesh>

//       {/* Continuous animated water flowing over the stone */}
//       {/* <WaterSheet points={mainWaterPoints} width={0.38} />
// <WaterSheet points={leftWaterPoints} width={0.12} offset={1.7} />
// <WaterSheet points={rightWaterPoints} width={0.12} offset={3.1} /> */}
//       {/* <WaterSheet points={mainWaterPoints} width={0.72} />
// <WaterSheet points={leftWaterPoints} width={0.24} offset={1.7} />
// <WaterSheet points={rightWaterPoints} width={0.24} offset={3.1} /> */}

// {/* Continuous water flowing around the full Shivling */}
// <AbhishekWater />

// {/* Falling droplets around the lingam */}
// {/* <Droplets /> */}

// {/* Ripples where the water meets the basin */}
// {/* <WaterRipples /> */}

// {/* {extraWaterPaths.map((points, i) => (
//   <WaterSheet
//     key={i}
//     points={points}
//     width={0.11}
//     offset={i * 0.8 + 0.5}
//   />
// ))}

//       <Droplets />
//       <WaterRipples /> */}

//       {/* Floating flowers on the basin water */}
//       {/* <FloatingFlower position={[-0.43, 0.49, 0.10]} rotation={0.3} />
//       <FloatingFlower position={[0.43, 0.49, 0.08]} rotation={1.2} />
//       <FloatingFlower position={[0.10, 0.49, -0.42]} rotation={2.1} /> */}
//       <FloatingFlower position={[-0.48, 0.51, 0.10]} rotation={0.3} />
// <FloatingFlower position={[0.48, 0.51, 0.10]} rotation={1.2} />
// <FloatingFlower position={[0.00, 0.51, -0.34]} rotation={2.1} />

//       {/* Restrained cool and warm lighting reveals the stone shape */}
//       <pointLight
//         position={[-1.1, 1.8, 2.1]}
//         color="#72caff"
//         intensity={1.5}
//         distance={5}
//         decay={2}
//       />

//       <pointLight
//         position={[1.1, 1.4, -0.8]}
//         color="#f0d09a"
//         intensity={0.8}
//         distance={4}
//         decay={2}
//       />

//       <pointLight
//         position={[0, 0.8, 1.5]}
//         color="#36a9ff"
//         intensity={0.65}
//         distance={3}
//         decay={2}
//       />
//     </group>
//   );
// }


// import { useEffect, useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';
// import { useGLTF } from '@react-three/drei';

// /**
//  * THE COSMIC FORGE — Central Sanctuary
//  * Procedural Three.js geometry only.
//  * Keeps the existing Scene.tsx interface unchanged.
//  */

// function createRockGeometry() {
//   const geometry = new THREE.IcosahedronGeometry(1, 4);
//   const positions = geometry.attributes.position;

//   for (let i = 0; i < positions.count; i++) {
//     const x = positions.getX(i);
//     const y = positions.getY(i);
//     const z = positions.getZ(i);

//     const noise =
//       1 +
//       0.045 * Math.sin(x * 17 + z * 11) * Math.cos(y * 13 - x * 5) +
//       0.022 * Math.sin(z * 27 + y * 19);

//     positions.setXYZ(i, x * noise, y * noise, z * noise);
//   }

//   geometry.computeVertexNormals();
//   return geometry;
// }

// /** A rounded, traditional dome-topped lingam. */
// // function createLingamGeometry() {
// //   const profile = [
// //     new THREE.Vector2(0.00, 0.000),
// //     new THREE.Vector2(0.27, 0.000),
// //     new THREE.Vector2(0.355, 0.035),
// //     new THREE.Vector2(0.385, 0.105),
// //     new THREE.Vector2(0.385, 0.390),
// //     new THREE.Vector2(0.365, 0.565),
// //     new THREE.Vector2(0.320, 0.735),
// //     new THREE.Vector2(0.245, 0.895),
// //     new THREE.Vector2(0.155, 1.015),
// //     new THREE.Vector2(0.070, 1.075),
// //     new THREE.Vector2(0.000, 1.090),
// //   ];

// //   const geometry = new THREE.LatheGeometry(profile, 96);
// //   geometry.computeVertexNormals();
// //   return geometry;
// // }
// /** Larger, smooth, traditional black-stone Shivling. */
// function createLingamGeometry() {
//   const profile = [
//     new THREE.Vector2(0.00, 0.000),
//     new THREE.Vector2(0.34, 0.000),
//     new THREE.Vector2(0.44, 0.045),
//     new THREE.Vector2(0.47, 0.13),
//     new THREE.Vector2(0.47, 0.48),
//     new THREE.Vector2(0.44, 0.70),
//     new THREE.Vector2(0.38, 0.91),
//     new THREE.Vector2(0.29, 1.10),
//     new THREE.Vector2(0.18, 1.25),
//     new THREE.Vector2(0.08, 1.32),
//     new THREE.Vector2(0.00, 1.34),
//   ];

//   const geometry = new THREE.LatheGeometry(profile, 128);
//   geometry.computeVertexNormals();
//   return geometry;
// }

// /** Elliptical yoni basin with a subtle forward-projecting spout. */
// function createBasinGeometry() {
//   const shape = new THREE.Shape();

//   shape.moveTo(-0.78, -0.36);
//   shape.bezierCurveTo(-1.02, -0.12, -0.98, 0.31, -0.70, 0.43);
//   shape.bezierCurveTo(-0.35, 0.57, 0.35, 0.57, 0.70, 0.43);
//   shape.bezierCurveTo(0.98, 0.31, 1.02, -0.12, 0.78, -0.36);
//   shape.bezierCurveTo(0.45, -0.55, -0.45, -0.55, -0.78, -0.36);

//   // Extend the front into a traditional yoni spout.
//   shape.lineTo(-0.38, -0.57);
//   shape.lineTo(-0.20, -0.94);
//   shape.quadraticCurveTo(0, -1.06, 0.20, -0.94);
//   shape.lineTo(0.38, -0.57);
//   shape.closePath();

//   const geometry = new THREE.ExtrudeGeometry(shape, {
//     depth: 0.105,
//     bevelEnabled: true,
//     bevelSegments: 3,
//     steps: 1,
//     bevelSize: 0.035,
//     bevelThickness: 0.035,
//     curveSegments: 16,
//   });

//   geometry.rotateX(-Math.PI / 2);
//   geometry.computeVertexNormals();
//   return geometry;
// }

// /** Animated water shader for the falling water sheet. */
// function createWaterMaterial() {
//   return new THREE.ShaderMaterial({
//     transparent: true,
//     depthWrite: false,
//     side: THREE.DoubleSide,
//     uniforms: {
//       uTime: { value: 0 },
//     },
//     vertexShader: `
//       varying vec2 vUv;

//       void main() {
//         vUv = uv;
//         gl_Position = projectionMatrix *
//           modelViewMatrix * vec4(position, 1.0);
//       }
//     `,
//     fragmentShader: `
//       uniform float uTime;
//       varying vec2 vUv;

//       void main() {
//         float flowA = sin(vUv.y * 46.0 - uTime * 4.2
//           + sin(vUv.x * 12.0 + uTime * 1.4) * 1.1);

//         float flowB = sin(vUv.y * 89.0 - uTime * 6.0
//           + vUv.x * 8.0);

//         float edge = smoothstep(0.0, 0.16, vUv.x)
//           * (1.0 - smoothstep(0.84, 1.0, vUv.x));

//         float streaks = smoothstep(0.25, 0.94, flowA * 0.5 + 0.5);
//         streaks = max(streaks, smoothstep(0.76, 0.99, flowB) * 0.55);

//         vec3 deepBlue = vec3(0.035, 0.30, 0.55);
// vec3 iceBlue = vec3(0.42, 0.84, 1.0);
// vec3 white = vec3(0.96, 0.99, 1.0);

//         vec3 color = mix(deepBlue, iceBlue, streaks * 0.78);
//         color = mix(color, white, streaks * 0.42);

//         float alpha = (0.62 + streaks * 0.36) * edge;

//         gl_FragColor = vec4(color, alpha);
//       }
//     `,
//   });
// }

// /** Build a curved ribbon instead of a thin central tube. */
// function createWaterRibbon(
//   points: THREE.Vector3[],
//   width: number,
// ) {
//   const curve = new THREE.CatmullRomCurve3(points);
//   const segments = 96;
//   const verticesAcross = 8;
//   const positions: number[] = [];
//   const uvs: number[] = [];
//   const indices: number[] = [];

//   for (let i = 0; i <= segments; i++) {
//     const t = i / segments;
//     const point = curve.getPoint(t);
//     const tangent = curve.getTangent(t).normalize();

//     // Keep the sheet wide across the front of the stone.
//     const across = new THREE.Vector3(1, 0, 0);
//     across.addScaledVector(tangent, -across.dot(tangent)).normalize();

//     const taper = Math.min(
//       1,
//       0.35 + t * 2.8,
//       0.35 + (1 - t) * 2.5,
//     );

//     for (let j = 0; j <= verticesAcross; j++) {
//       const u = j / verticesAcross;
//       const offset = (u - 0.5) * width * taper;
//       const p = point.clone().addScaledVector(across, offset);

//       positions.push(p.x, p.y, p.z);
//       uvs.push(u, t);
//     }
//   }

//   for (let i = 0; i < segments; i++) {
//     for (let j = 0; j < verticesAcross; j++) {
//       const a = i * (verticesAcross + 1) + j;
//       const b = a + verticesAcross + 1;

//       indices.push(a, b, a + 1);
//       indices.push(b, b + 1, a + 1);
//     }
//   }

//   const geometry = new THREE.BufferGeometry();
//   geometry.setAttribute(
//     'position',
//     new THREE.Float32BufferAttribute(positions, 3),
//   );
//   geometry.setAttribute(
//     'uv',
//     new THREE.Float32BufferAttribute(uvs, 2),
//   );
//   geometry.setIndex(indices);
//   geometry.computeVertexNormals();

//   return geometry;
// }

// function WaterSheet({
//   points,
//   width,
//   offset = 0,
// }: {
//   points: THREE.Vector3[];
//   width: number;
//   offset?: number;
// }) {
//   const meshRef = useRef<THREE.Mesh>(null);

//   const geometry = useMemo(
//     () => createWaterRibbon(points, width),
//     [points, width],
//   );

//   const material = useMemo(createWaterMaterial, []);

//   useFrame((state) => {
//     material.uniforms.uTime.value = state.clock.elapsedTime + offset;

//     if (meshRef.current) {
//       meshRef.current.visible = true;
//     }
//   });

//   useEffect(() => {
//     return () => {
//       geometry.dispose();
//       material.dispose();
//     };
//   }, [geometry, material]);

//   return (
//     <mesh
//       ref={meshRef}
//       geometry={geometry}
//       material={material}
//       renderOrder={5}
//       frustumCulled={false}
//     />
//   );
// }

// /** Fine droplets travel down toward the basin. */
// // function Droplets() {
// //   const groupRef = useRef<THREE.Group>(null);

// //   const drops = useMemo(
// //     () =>
// //       Array.from({ length: 24 }, (_, i) => ({
// //         x: Math.sin(i * 12.73) * (0.22 + (i % 4) * 0.045),
// //         z: Math.cos(i * 8.31) * 0.28 + 0.12,
// //         speed: 0.55 + (i % 6) * 0.13,
// //         phase: (i * 0.173) % 1,
// //         size: 0.010 + (i % 3) * 0.004,
// //       })),
// //     [],
// //   );

// //   useFrame((state) => {
// //     if (!groupRef.current) return;

// //     const time = state.clock.elapsedTime;

// //     groupRef.current.children.forEach((drop, i) => {
// //       const data = drops[i];
// //       const progress = (time * data.speed + data.phase) % 1;

// //       drop.position.set(
// //   data.x,
// //   4.85 - progress * 2.0,
// //   data.z + progress * 0.12,
// // );

// //       const scale = 0.65 + Math.sin(progress * Math.PI) * 0.55;
// //       drop.scale.set(data.size * scale, data.size * scale * 1.8, data.size * scale);
// //     });
// //   });

// //   return (
// //     <group ref={groupRef}>
// //       {drops.map((drop, i) => (
// //         <mesh key={i} position={[drop.x, 1.3, drop.z]}>
// //           <sphereGeometry args={[1, 8, 8]} />
// //           <meshBasicMaterial
// //             color="#bcefff"
// //             transparent
// //             opacity={0.92}
// //           />
// //         </mesh>
// //       ))}
// //     </group>
// //   );
// // }

// function Droplets() {
//   const groupRef = useRef<THREE.Group>(null);

//   const drops = useMemo(
//     () =>
//       Array.from({ length: 110 }, (_, i) => ({
//         angle: i * 2.399963,
//         phase: (i * 0.6180339) % 1,
//         speed: 0.42 + (i % 9) * 0.055,
//         size: 0.007 + (i % 4) * 0.003,
//       })),
//     [],
//   );

//   useFrame((state) => {
//     if (!groupRef.current) return;

//     const time = state.clock.elapsedTime;

//     groupRef.current.children.forEach((drop, i) => {
//       const d = drops[i];
//       const progress = (time * d.speed + d.phase) % 1;

//       // Start just above the crown and fall past the sides.
//       const y = 4.72 - progress * 2.08;

//       // The drops follow the approximate curved outline.
//       let radius: number;

//       if (y > 4.25) {
//         radius = THREE.MathUtils.lerp(
//           0.08,
//           0.34,
//           (4.72 - y) / 0.47,
//         );
//       } else {
//         radius = THREE.MathUtils.lerp(
//           0.35,
//           0.43,
//           THREE.MathUtils.clamp((4.25 - y) / 1.53, 0, 1),
//         );
//       }

//       // Slight sideways drift makes the water feel less mechanical.
//       const angle = d.angle + Math.sin(time * 1.8 + i) * 0.035;

//       drop.position.set(
//         Math.sin(angle) * radius,
//         y,
//         Math.cos(angle) * radius,
//       );

//       const pulse = 0.8 + Math.sin(progress * Math.PI) * 0.5;

//       drop.scale.set(
//         d.size * pulse,
//         d.size * pulse * 2.6,
//         d.size * pulse,
//       );
//     });
//   });

//   return (
//     <group ref={groupRef} position={[0, 0.46, 0.12]}>
//       {drops.map((d, i) => (
//         <mesh key={i}>
//           <sphereGeometry args={[1, 8, 8]} />
//           <meshPhysicalMaterial
//             color="#b9edff"
//             roughness={0.08}
//             metalness={0.0}
//             transparent
//             opacity={0.82}
//             clearcoat={1}
//           />
//         </mesh>
//       ))}
//     </group>
//   );
// }


// /** Expanding rings give the water surface continuous movement. */
// function WaterRipples() {
//   const rings = useRef<(THREE.Mesh | null)[]>([]);

//   useFrame((state) => {
//     const time = state.clock.elapsedTime;

//     rings.current.forEach((ring, i) => {
//       if (!ring) return;

//       const phase = (time * 0.38 + i / 3) % 1;
//       const radius = 0.12 + phase * 0.40;

//       ring.scale.set(radius, radius, radius);
//       ring.position.y = 0.485 + i * 0.001;
//       ring.position.z = 0.12;

//       const material = ring.material as THREE.MeshBasicMaterial;
//       material.opacity = (1 - phase) * 0.48;
//     });
//   });

//   return (
//     <group>
//       {[0, 1, 2].map((i) => (
//         <mesh
//           key={i}
//           ref={(node) => {
//             rings.current[i] = node;
//           }}
//           rotation={[-Math.PI / 2, 0, 0]}
//           position={[0, 0.485, 0.12]}
//         >
//           <torusGeometry args={[1, 0.012, 6, 64]} />
//           <meshBasicMaterial
//             color="#7edcff"
//             transparent
//             opacity={0.4}
//             depthWrite={false}
//           />
//         </mesh>
//       ))}
//     </group>
//   );
// }

// function FloatingFlower({
//   position,
//   rotation = 0,
// }: {
//   position: [number, number, number];
//   rotation?: number;
// }) {
//   const flowerRef = useRef<THREE.Group>(null);

//   useFrame((state) => {
//     if (!flowerRef.current) return;

//     const t = state.clock.elapsedTime + rotation;
//     flowerRef.current.position.y =
//       position[1] + Math.sin(t * 1.4) * 0.012;

//     flowerRef.current.rotation.z = Math.sin(t * 0.7) * 0.04;
//   });

//   return (
//     <group
//       ref={flowerRef}
//       position={position}
//       rotation={[0, rotation, 0]}
//     >
//       {Array.from({ length: 6 }, (_, i) => {
//         const angle = (i / 6) * Math.PI * 2;

//         return (
//           <mesh
//             key={i}
//             position={[
//               Math.cos(angle) * 0.075,
//               0,
//               Math.sin(angle) * 0.075,
//             ]}
//             rotation={[0, -angle, 0]}
//             scale={[0.075, 0.018, 0.038]}
//           >
//             <sphereGeometry args={[1, 12, 8]} />
//             <meshStandardMaterial
//               color="#f6a0c7"
//               emissive="#52132e"
//               emissiveIntensity={0.22}
//               roughness={0.38}
//             />
//           </mesh>
//         );
//       })}

//       <mesh position={[0, 0.008, 0]}>
//         <sphereGeometry args={[0.028, 12, 8]} />
//         <meshStandardMaterial
//           color="#ffd45e"
//           roughness={0.5}
//         />
//       </mesh>
//     </group>
//   );
// }

// function ShivlingModel() {
//   const { scene } = useGLTF('/models/shivling.glb');

//   const model = useMemo(() => {
//     const clone = scene.clone(true);

//     // Measure the downloaded model.
//     const bounds = new THREE.Box3().setFromObject(clone);
//     const size = bounds.getSize(new THREE.Vector3());
//     const center = bounds.getCenter(new THREE.Vector3());

//     // Normalize it to a predictable height.
//     const targetHeight = 4.5;
//     const scale = targetHeight / Math.max(size.y, 0.001);

//     clone.scale.setScalar(scale);
//     clone.position.set(
//       -center.x * scale,
//       -bounds.min.y * scale,
//       -center.z * scale,
//     );

//     return clone;
//   }, [scene]);

//   return (
//     <primitive
//       object={model}
//       position={[0, 0.46, 0.12]}
//       // scale={1.35}
//       // castShadow
//       // receiveShadow
//     />
//   );
// }

// useGLTF.preload('/models/shivling.glb');

// // /** Water flows around the full circumference of the rotating Shivling. */
// // function AbhishekWater() {
// //   const meshRef = useRef<THREE.Mesh>(null);

// //   const geometry = useMemo(() => {
// //     const segments = 192;
// //     const rings = 100;

// //     // Local coordinates assume the GLB is normalized to height 4.5.
// //     const topY = 4.49;
// //     const bottomY = 2.72;

// //     const positions: number[] = [];
// //     const uvs: number[] = [];
// //     const indices: number[] = [];

// //     // Approximate the rounded crown and cylindrical body.
// //     const radiusAt = (t: number) => {
// //       if (t < 0.12) {
// //         const crown = t / 0.12;
// //         return 0.055 + 0.31 * Math.sin(crown * Math.PI * 0.5);
// //       }

// //       if (t < 0.88) {
// //         return 0.37 + 0.025 * Math.sin(t * Math.PI * 3.0);
// //       }

// //       return 0.395 - (t - 0.88) * 0.12;
// //     };

// //     for (let j = 0; j <= rings; j++) {
// //       const v = j / rings;
// //       const y = THREE.MathUtils.lerp(topY, bottomY, v);
// //       const radius = radiusAt(v);

// //       for (let i = 0; i <= segments; i++) {
// //         const u = i / segments;
// //         const angle = u * Math.PI * 2;

// //         // A tiny offset keeps the water just above the stone.
// //         const r = radius + 0.018;

// //         positions.push(
// //           Math.sin(angle) * r,
// //           y,
// //           Math.cos(angle) * r,
// //         );

// //         uvs.push(u, v);
// //       }
// //     }

// //     for (let j = 0; j < rings; j++) {
// //       for (let i = 0; i < segments; i++) {
// //         const a = j * (segments + 1) + i;
// //         const b = a + segments + 1;

// //         indices.push(a, b, a + 1);
// //         indices.push(b, b + 1, a + 1);
// //       }
// //     }

// //     const geo = new THREE.BufferGeometry();

// //     geo.setAttribute(
// //       'position',
// //       new THREE.Float32BufferAttribute(positions, 3),
// //     );
// //     geo.setAttribute(
// //       'uv',
// //       new THREE.Float32BufferAttribute(uvs, 2),
// //     );
// //     geo.setIndex(indices);
// //     geo.computeVertexNormals();

// //     return geo;
// //   }, []);

// //   const material = useMemo(
// //     () =>
// //       new THREE.ShaderMaterial({
// //         transparent: true,
// //         depthWrite: false,
// //         side: THREE.DoubleSide,
// //         uniforms: {
// //           uTime: { value: 0 },
// //         },
// //         vertexShader: `
// //           varying vec2 vUv;

// //           void main() {
// //             vUv = uv;
// //             gl_Position = projectionMatrix *
// //               modelViewMatrix * vec4(position, 1.0);
// //           }
// //         `,
// //         fragmentShader: `
// //           uniform float uTime;
// //           varying vec2 vUv;

// //           void main() {
// //             float flow = vUv.y * 24.0 - uTime * 3.8
// //               + sin(vUv.x * 32.0 + uTime * 1.5) * 0.65;

// //             float streak = smoothstep(
// //               0.35, 0.95, sin(flow) * 0.5 + 0.5
// //             );

// //             float fineStreak = smoothstep(
// //               0.72, 0.98,
// //               sin(vUv.y * 85.0 - uTime * 6.0 + vUv.x * 50.0)
// //                 * 0.5 + 0.5
// //             );

// //             float variation = 0.35 + streak * 0.42 + fineStreak * 0.23;

// //             vec3 waterColor = mix(
// //               vec3(0.08, 0.42, 0.70),
// //               vec3(0.78, 0.96, 1.0),
// //               variation
// //             );

// //             float edgeFade = smoothstep(0.0, 0.08, vUv.y)
// //               * (1.0 - smoothstep(0.90, 1.0, vUv.y));

// //             float alpha = (0.24 + streak * 0.44 + fineStreak * 0.22)
// //               * edgeFade;

// //             gl_FragColor = vec4(waterColor, alpha);
// //           }
// //         `,
// //       }),
// //     [],
// //   );

// //   useFrame((state) => {
// //     material.uniforms.uTime.value = state.clock.elapsedTime;
// //   });

// //   useEffect(() => {
// //     return () => {
// //       geometry.dispose();
// //       material.dispose();
// //     };
// //   }, [geometry, material]);

// //   return (
// //     <mesh
// //       ref={meshRef}
// //       geometry={geometry}
// //       material={material}
// //       position={[0, 0.46, 0.12]}
// //       renderOrder={5}
// //       frustumCulled={false}
// //     />
// //   );
// // }


// // function AbhishekWater() {
// //   const materialRef = useRef<THREE.ShaderMaterial>(null);

// //   const geometry = useMemo(() => {
// //     const segments = 256;
// //     const rings = 120;
// //     const positions: number[] = [];
// //     const uvs: number[] = [];
// //     const indices: number[] = [];

// //     // Coordinates match the normalized 4.5-unit Shivling model.
// //     // Adjust these radii if your downloaded model has a different shape.
// //     const profile = [
// //   { t: 0.00, y: 4.49, r: 0.055 },
// //   { t: 0.05, y: 4.43, r: 0.23 },
// //   { t: 0.12, y: 4.25, r: 0.37 },
// //   { t: 0.20, y: 4.00, r: 0.405 },
// //   { t: 0.48, y: 3.35, r: 0.41 },
// //   { t: 0.75, y: 2.75, r: 0.425 },
// //   { t: 1.00, y: 2.35, r: 0.44 },
// // ];

// //     const sampleProfile = (t: number) => {
// //       for (let k = 0; k < profile.length - 1; k++) {
// //         const a = profile[k];
// //         const b = profile[k + 1];

// //         if (t <= b.t) {
// //           const f = (t - a.t) / (b.t - a.t);
// //           const smooth = f * f * (3 - 2 * f);

// //           return {
// //             y: THREE.MathUtils.lerp(a.y, b.y, f),
// //             r: THREE.MathUtils.lerp(a.r, b.r, smooth),
// //           };
// //         }
// //       }

// //       return profile[profile.length - 1];
// //     };

// //     for (let j = 0; j <= rings; j++) {
// //       const t = j / rings;
// //       const p = sampleProfile(t);

// //       for (let i = 0; i <= segments; i++) {
// //         const u = i / segments;
// //         const angle = u * Math.PI * 2;

// //         // Small gap prevents the water surface from z-fighting with stone.
// //         const r = p.r + 0.25;

// //         positions.push(
// //           Math.sin(angle) * r,
// //           p.y,
// //           Math.cos(angle) * r,
// //         );

// //         uvs.push(u, t);
// //       }
// //     }

// //     for (let j = 0; j < rings; j++) {
// //       for (let i = 0; i < segments; i++) {
// //         const a = j * (segments + 1) + i;
// //         const b = a + segments + 1;

// //         indices.push(a, b, a + 1);
// //         indices.push(b, b + 1, a + 1);
// //       }
// //     }

// //     const geo = new THREE.BufferGeometry();

// //     geo.setAttribute(
// //       'position',
// //       new THREE.Float32BufferAttribute(positions, 3),
// //     );
// //     geo.setAttribute(
// //       'uv',
// //       new THREE.Float32BufferAttribute(uvs, 2),
// //     );
// //     geo.setIndex(indices);
// //     geo.computeVertexNormals();

// //     return geo;
// //   }, []);

// //   const material = useMemo(
// //     () =>
// //       new THREE.ShaderMaterial({
// //         transparent: true,
// //         depthWrite: false,
// //         side: THREE.DoubleSide,
// //         uniforms: {
// //           uTime: { value: 0 },
// //         },
// //         vertexShader: `
// //           varying vec2 vUv;

// //           void main() {
// //             vUv = uv;
// //             gl_Position = projectionMatrix *
// //               modelViewMatrix * vec4(position, 1.0);
// //           }
// //         `,
// //         fragmentShader: `
// //           uniform float uTime;
// //           varying vec2 vUv;

// //           void main() {
// //             float angle = vUv.x * 6.2831853;

// //             // Several narrow, irregular streams around the full surface.
// //             float bands = sin(
// //               angle * 25.0
// //               + sin(angle * 7.0) * 1.5
// //               + uTime * 0.55
// //             );

// //             float streams = smoothstep(0.25, 0.88, bands);

// //             float fine = sin(
// //               angle * 65.0
// //               + vUv.y * 12.0
// //               - uTime * 2.8
// //             );

// //             float shimmer = smoothstep(0.52, 0.96, fine);

// //             // Motion travels downward from the crown.
// //             float flow = sin(
// //               vUv.y * 70.0
// //               - uTime * 7.0
// //               + sin(angle * 9.0) * 1.2
// //             );

// //             float movingHighlights =
// //               smoothstep(0.45, 0.96, flow);

// //             vec3 darkWater = vec3(0.025, 0.19, 0.31);
// //             vec3 blueWater = vec3(0.16, 0.56, 0.78);
// //             vec3 brightWater = vec3(0.78, 0.96, 1.0);

// //             vec3 color = mix(
// //               darkWater,
// //               blueWater,
// //               0.30 + streams * 0.35
// //             );

// //             color = mix(
// //               color,
// //               brightWater,
// //               shimmer * 0.34 + movingHighlights * 0.32
// //             );

// //             // The water stays visible around the entire lingam.
// //             float alpha = 0.25
// //               + streams * 0.15
// //               + shimmer * 0.12
// //               + movingHighlights * 0.12;

// //             // Fade only near the top and bottom edges.
// //             alpha *= smoothstep(0.0, 0.035, vUv.y);
// //             alpha *= 1.0 - smoothstep(0.95, 1.0, vUv.y);

// //             gl_FragColor = vec4(color, alpha);
// //           }
// //         `,
// //       }),
// //     [],
// //   );

// //   useFrame((state) => {
// //     if (materialRef.current) {
// //       materialRef.current.uniforms.uTime.value =
// //         state.clock.elapsedTime;
// //     }
// //   });

// //   useEffect(() => {
// //     return () => {
// //       geometry.dispose();
// //       material.dispose();
// //     };
// //   }, [geometry, material]);

// //   return (
// //     <mesh
// //       geometry={geometry}
// //       position={[-0.48, 0.30, 0.10]}
// //       renderOrder={5}
// //       frustumCulled={false}
// //     >
// //       <primitive
// //         ref={materialRef}
// //         object={material}
// //         attach="material"
// //       />
// //     </mesh>
// //   );
// // }

// // function AbhishekWater() {
// //   const dropsRef = useRef<THREE.InstancedMesh>(null);
// //   const blanketMaterialRef = useRef<THREE.ShaderMaterial>(null);

// //   const dropCount = 360;
// //   const streamCount = 40;

// //   // Reuse the earlier blanket's height and radius profile.
// //   const topY = 4.49;
// //   const blanketBottomY = 2.35;
// //   const fallBottomY = 0.16;
// //   const segments = 192;
// //   const rings = 100;

// //   // Full 360-degree water blanket.
// //   const blanketGeometry = useMemo(() => {
// //     const positions: number[] = [];
// //     const uvs: number[] = [];
// //     const indices: number[] = [];

// //     const profile = [
// //       { t: 0.0, r: 0.055 },
// //       { t: 0.05, r: 0.23 },
// //       { t: 0.12, r: 0.37 },
// //       { t: 0.2, r: 0.405 },
// //       { t: 0.48, r: 0.41 },
// //       { t: 0.75, r: 0.425 },
// //       { t: 1.0, r: 0.44 },
// //     ];

// //     const radiusAt = (t: number) => {
// //       for (let k = 0; k < profile.length - 1; k++) {
// //         const a = profile[k];
// //         const b = profile[k + 1];

// //         if (t <= b.t) {
// //           const f = (t - a.t) / (b.t - a.t);
// //           const smooth = f * f * (3 - 2 * f);
// //           return THREE.MathUtils.lerp(a.r, b.r, smooth) + 0.25;
// //         }
// //       }

// //       return 0.69;
// //     };

// //     for (let j = 0; j <= rings; j++) {
// //       const v = j / rings;
// //       const y = THREE.MathUtils.lerp(topY, blanketBottomY, v);

// //       for (let i = 0; i <= segments; i++) {
// //         const u = i / segments;
// //         const angle = u * Math.PI * 2;

// //         // Small undulation breaks up the perfectly smooth cylinder.
// //         const ripple =
// //           Math.sin(angle * 17 + v * 24) * 0.012 +
// //           Math.sin(angle * 31 - v * 18) * 0.006;

// //         const r = radiusAt(v) + ripple;

// //         positions.push(
// //           Math.sin(angle) * r,
// //           y,
// //           Math.cos(angle) * r,
// //         );

// //         uvs.push(u, v);
// //       }
// //     }

// //     for (let j = 0; j < rings; j++) {
// //       for (let i = 0; i < segments; i++) {
// //         const a = j * (segments + 1) + i;
// //         const b = a + segments + 1;
// //         indices.push(a, b, a + 1, b, b + 1, a + 1);
// //       }
// //     }

// //     const geometry = new THREE.BufferGeometry();
// //     geometry.setAttribute(
// //       'position',
// //       new THREE.Float32BufferAttribute(positions, 3),
// //     );
// //     geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
// //     geometry.setIndex(indices);
// //     geometry.computeVertexNormals();

// //     return geometry;
// //   }, []);

// //   // Animated transparent water with fine, moving highlights.
// //   const blanketMaterial = useMemo(
// //     () =>
// //       new THREE.ShaderMaterial({
// //         transparent: true,
// //         depthWrite: false,
// //         side: THREE.DoubleSide,
// //         uniforms: {
// //           uTime: { value: 0 },
// //         },
// //         vertexShader: `
// //           varying vec2 vUv;

// //           void main() {
// //             vUv = uv;
// //             gl_Position = projectionMatrix * modelViewMatrix
// //               * vec4(position, 1.0);
// //           }
// //         `,
// //         fragmentShader: `
// //           uniform float uTime;
// //           varying vec2 vUv;

// //           void main() {
// //             float angle = vUv.x * 6.2831853;

// //             float broadFlow = sin(
// //               vUv.y * 42.0 - uTime * 5.0
// //               + sin(angle * 8.0 + uTime * 0.8) * 1.1
// //             );

// //             float fineFlow = sin(
// //               vUv.y * 115.0 - uTime * 8.0
// //               + sin(angle * 19.0 - uTime) * 1.8
// //             );

// //             float streaks = smoothstep(0.05, 0.88, broadFlow * 0.5 + 0.5);
// //             float fine = smoothstep(0.48, 0.96, fineFlow * 0.5 + 0.5);

// //             float brokenFlow = sin(
// //               angle * 38.0 + sin(vUv.y * 13.0 + uTime) * 2.0
// //             );

// //             float strands = smoothstep(0.40, 0.95, brokenFlow * 0.5 + 0.5);

// //             vec3 deepWater = vec3(0.025, 0.16, 0.27);
// //             vec3 blueWater = vec3(0.10, 0.43, 0.64);
// //             vec3 whiteWater = vec3(0.82, 0.96, 1.0);

// //             vec3 color = mix(deepWater, blueWater, 0.35 + streaks * 0.45);
// //             color = mix(color, whiteWater, fine * 0.55 + strands * 0.23);

// //             float alpha = 0.25 + streaks * 0.16 + fine * 0.28 + strands * 0.12;
// //             alpha *= smoothstep(0.0, 0.025, vUv.y);
// //             alpha *= 1.0 - smoothstep(0.97, 1.0, vUv.y);

// //             gl_FragColor = vec4(color, alpha);
// //           }
// //         `,
// //       }),
// //     [],
// //   );

// //   // Separate curved rivulets travel from the crown down to the basin.
// //   const streamGeometries = useMemo(() => {
// //     return Array.from({ length: streamCount }, (_, i) => {
// //       const angle = (i / streamCount) * Math.PI * 2;
// //       const wobble = Math.sin(i * 2.31) * 0.045;
// //       const points: THREE.Vector3[] = [];

// //       points.push(
// //         new THREE.Vector3(
// //           Math.cos(angle) * 0.04,
// //           topY + 0.09,
// //           Math.sin(angle) * 0.04,
// //         ),
// //       );

// //       points.push(
// //         new THREE.Vector3(
// //           Math.cos(angle + 0.08) * 0.24,
// //           topY - 0.28,
// //           Math.sin(angle + 0.08) * 0.24,
// //         ),
// //       );

// //       points.push(
// //         new THREE.Vector3(
// //           Math.cos(angle + 0.12) * 0.52,
// //           topY - 0.72,
// //           Math.sin(angle + 0.12) * 0.52,
// //         ),
// //       );

// //       points.push(
// //         new THREE.Vector3(
// //           Math.cos(angle + 0.17) * (0.69 + wobble),
// //           2.45,
// //           Math.sin(angle + 0.17) * (0.69 + wobble),
// //         ),
// //       );

// //       points.push(
// //         new THREE.Vector3(
// //           Math.cos(angle + 0.2) * (0.72 + wobble),
// //           fallBottomY,
// //           Math.sin(angle + 0.2) * (0.72 + wobble),
// //         ),
// //       );

// //       const curve = new THREE.CatmullRomCurve3(points);

// //       return new THREE.TubeGeometry(
// //         curve,
// //         100,
// //         i % 5 === 0 ? 0.018 : 0.011,
// //         8,
// //         false,
// //       );
// //     });
// //   }, []);

// //   const streamMaterial = useMemo(
// //     () =>
// //       new THREE.MeshPhysicalMaterial({
// //         color: '#8de5ff',
// //         roughness: 0.055,
// //         metalness: 0.0,
// //         transparent: true,
// //         opacity: 0.68,
// //         clearcoat: 1,
// //         clearcoatRoughness: 0.025,
// //         depthWrite: false,
// //       }),
// //     [],
// //   );

// //   const dropGeometry = useMemo(
// //     () => new THREE.SphereGeometry(1, 10, 12),
// //     [],
// //   );

// //   const dropMaterial = useMemo(
// //     () =>
// //       new THREE.MeshPhysicalMaterial({
// //         color: '#d8f5ff',
// //         roughness: 0.025,
// //         metalness: 0,
// //         transparent: true,
// //         opacity: 0.94,
// //         clearcoat: 1,
// //         clearcoatRoughness: 0.015,
// //         depthWrite: false,
// //       }),
// //     [],
// //   );

// //   const dummy = useMemo(() => new THREE.Object3D(), []);

// //   const drops = useMemo(
// //     () =>
// //       Array.from({ length: dropCount }, (_, i) => ({
// //         angle: i * 2.399963,
// //         phase: (i * 0.6180339) % 1,
// //         speed: 0.75 + (i % 11) * 0.095,
// //         spread: 0.08 + ((i * 7) % 13) * 0.055,
// //         size: 0.008 + (i % 5) * 0.0035,
// //       })),
// //     [],
// //   );

// //   useFrame((state) => {
// //     const time = state.clock.elapsedTime;

// //     if (blanketMaterialRef.current) {
// //       blanketMaterialRef.current.uniforms.uTime.value = time;
// //     }

// //     const mesh = dropsRef.current;
// //     if (!mesh) return;

// //     for (let i = 0; i < drops.length; i++) {
// //       const d = drops[i];
// //       const progress = (time * d.speed + d.phase) % 1;

// //       // Drops start just above the crown and fall around the full circumference.
// //       const y = topY + 0.13 - progress * (topY - fallBottomY + 0.13);

// //       const radius =
// //         0.045 +
// //         progress * d.spread +
// //         Math.sin(progress * Math.PI) * 0.035;

// //       const angle = d.angle + Math.sin(time * 1.6 + i) * 0.025;

// //       dummy.position.set(
// //         Math.cos(angle) * radius,
// //         y,
// //         Math.sin(angle) * radius,
// //       );

// //       // Teardrop-like ellipsoids with slight size variation.
// //       const pulse = 0.82 + Math.sin(time * 4.5 + i) * 0.18;
// //       dummy.scale.set(
// //         d.size * pulse,
// //         d.size * (2.2 + d.speed) * pulse,
// //         d.size * pulse,
// //       );

// //       dummy.rotation.set(
// //         0.12 * Math.sin(time + i),
// //         angle,
// //         0.1 * Math.cos(time * 0.8 + i),
// //       );

// //       dummy.updateMatrix();
// //       mesh.setMatrixAt(i, dummy.matrix);
// //     }

// //     mesh.instanceMatrix.needsUpdate = true;
// //   });

// //   useEffect(() => {
// //     return () => {
// //       blanketGeometry.dispose();
// //       blanketMaterial.dispose();
// //       streamGeometries.forEach((geometry) => geometry.dispose());
// //       streamMaterial.dispose();
// //       dropGeometry.dispose();
// //       dropMaterial.dispose();
// //     };
// //   }, [
// //     blanketGeometry,
// //     blanketMaterial,
// //     streamGeometries,
// //     streamMaterial,
// //     dropGeometry,
// //     dropMaterial,
// //   ]);

// //   return (
// //     // Keep your final manually chosen position.
// //     <group position={[-0.48, 0.30, 0.10]}>
// //       <mesh
// //         geometry={blanketGeometry}
// //         renderOrder={5}
// //         frustumCulled={false}
// //       >
// //         <primitive
// //           object={blanketMaterial}
// //           attach="material"
// //           ref={blanketMaterialRef}
// //         />
// //       </mesh>

// //       {streamGeometries.map((geometry, i) => (
// //         <mesh
// //           key={i}
// //           geometry={geometry}
// //           material={streamMaterial}
// //           renderOrder={6}
// //           frustumCulled={false}
// //         />
// //       ))}

// //       <instancedMesh
// //         ref={dropsRef}
// //         args={[dropGeometry, dropMaterial, dropCount]}
// //         renderOrder={7}
// //         frustumCulled={false}
// //       />
// //     </group>
// //   );
// // }

// const WATER_POSITION: [number, number, number] = [
//   -0.48, 0.30, 0.10,
// ];

// const WATER_HEIGHT = 4.62;
// const WATER_TOP_RADIUS = 0.48;
// const WATER_BOTTOM_RADIUS = 0.43;
// const DROPLET_COUNT = 180;

// /**
//  * Creates a smooth, open-ended 360-degree water curtain.
//  * UV coordinates animate vertically flowing highlights.
//  */
// function createAbhishekMaterial() {
//   return new THREE.ShaderMaterial({
//     transparent: true,
//     depthWrite: false,
//     side: THREE.DoubleSide,
//     uniforms: {
//       uTime: { value: 0 },
//     },
//     vertexShader: `
//       uniform float uTime;
//       varying vec2 vUv;
//       varying vec3 vWorldNormal;

//       void main() {
//         vUv = uv;

//         vec3 p = position;

//         // Subtle irregular movement in the falling water.
//         float wave1 = sin(uv.x * 42.0 + uTime * 1.5
//                           + uv.y * 8.0) * 0.009;
//         float wave2 = sin(uv.x * 79.0 - uTime * 2.1
//                           + uv.y * 17.0) * 0.004;

//         float envelope = smoothstep(0.0, 0.12, uv.y);
//         p.x += (wave1 + wave2) * envelope;

//         vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
//         gl_Position = projectionMatrix * mvPosition;

//         vWorldNormal = normalize(mat3(modelMatrix) * normal);
//       }
//     `,
//     fragmentShader: `
//       uniform float uTime;
//       varying vec2 vUv;
//       varying vec3 vWorldNormal;

//       void main() {
//         float angle = vUv.x * 6.2831853;
//         float fall = vUv.y;

//         // Multiple overlapping, non-uniform flowing patterns.
//         float distortion =
//           sin(angle * 5.0 + uTime * 0.55) * 0.025
//           + sin(angle * 13.0 - uTime * 0.8) * 0.012;

//         float flow = fall + distortion;

//         float broadFlow = sin(
//           flow * 24.0 - uTime * 4.0
//           + sin(angle * 4.0 + uTime * 0.7) * 1.1
//         );

//         float fineFlow = sin(
//           flow * 68.0 - uTime * 6.8
//           + sin(angle * 9.0 - uTime) * 1.4
//         );

//         float glimmer = smoothstep(
//           0.40, 0.94, broadFlow * 0.5 + 0.5
//         );

//         float fineGlimmer = smoothstep(
//           0.78, 0.99, fineFlow * 0.5 + 0.5
//         );

//         // Break up uniform stripes to avoid the wire-cage look.
//         float breakup =
//           0.72 + 0.28 * sin(angle * 17.0 + fall * 31.0);

//         glimmer *= breakup;

//         vec3 deepWater = vec3(0.018, 0.12, 0.19);
//         vec3 blueWater = vec3(0.08, 0.35, 0.49);
//         vec3 brightReflection = vec3(0.72, 0.91, 1.0);

//         vec3 color = mix(deepWater, blueWater, 0.55);
//         color = mix(
//           color,
//           brightReflection,
//           clamp(glimmer * 0.58 + fineGlimmer * 0.25, 0.0, 0.8)
//         );

//         // Fresnel-like rim highlights.
//         float facing = abs(dot(
//           normalize(vWorldNormal),
//           vec3(0.0, 0.0, 1.0)
//         ));

//         float rim = pow(1.0 - facing, 2.0);

//         float alpha =
//           0.16
//           + glimmer * 0.24
//           + fineGlimmer * 0.10
//           + rim * 0.12;

//         // Fade the edges without cutting off the falling water.
//         alpha *= smoothstep(0.0, 0.035, fall);
//         alpha *= 1.0 - smoothstep(0.965, 1.0, fall);

//         gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.62));
//       }
//     `,
//   });
// }

// /**
//  * Animated droplets distributed around the entire Shivling.
//  * Every particle loops from above the crown down toward the basin.
//  */
// function AbhishekDroplets() {
//   const dropletsRef = useRef<THREE.InstancedMesh>(null);

//   const dummy = useMemo(() => new THREE.Object3D(), []);
//   const rng = (n: number) => {
//     const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
//     return x - Math.floor(x);
//   };

//   const particleData = useMemo(
//     () =>
//       Array.from({ length: DROPLET_COUNT }, (_, i) => ({
//         angle: rng(i + 1) * Math.PI * 2,
//         phase: rng(i + 101),
//         speed: 0.55 + rng(i + 201) * 0.85,
//         radius: 0.40 + rng(i + 301) * 0.12,
//         size: 0.009 + rng(i + 401) * 0.012,
//         drift: (rng(i + 501) - 0.5) * 0.075,
//       })),
//     [],
//   );

//   useEffect(() => {
//     const mesh = dropletsRef.current;
//     if (!mesh) return;

//     mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

//     for (let i = 0; i < DROPLET_COUNT; i++) {
//       dummy.position.set(0, -100, 0);
//       dummy.scale.setScalar(0);
//       dummy.updateMatrix();
//       mesh.setMatrixAt(i, dummy.matrix);
//     }

//     mesh.instanceMatrix.needsUpdate = true;
//   }, [dummy]);

//   useFrame((state) => {
//     const mesh = dropletsRef.current;
//     if (!mesh) return;

//     const time = state.clock.elapsedTime;

//     particleData.forEach((drop, i) => {
//       const progress =
//         (time * drop.speed * 0.36 + drop.phase) % 1;

//       // Start slightly above the lingam and fall toward the basin.
//       const y = WATER_HEIGHT + 0.10 - progress * (WATER_HEIGHT + 0.02);

//       const angle =
//         drop.angle
//         + Math.sin(time * 1.1 + drop.phase * 6.0) * 0.025;

//       const radius = drop.radius + progress * 0.055;
//       const x = Math.cos(angle) * radius + drop.drift * progress;
//       const z = Math.sin(angle) * radius;

//       // Stretch droplets vertically as they accelerate downward.
//       const size = drop.size * (0.8 + progress * 0.45);

//       // WATER_POSITION remains [-0.48, 0.30, 0.10].
//       // Compensate its X offset so the curtain and droplets stay centered
//       // on the Shivling, whose center is at x = 0.
//       dummy.position.set(x + 0.48, y, z);
//       dummy.scale.set(size * 0.8, size * 1.9, size * 0.8);
//       dummy.rotation.set(
//         0.10 * Math.sin(time + drop.phase),
//         angle,
//         0.08 * Math.cos(time * 1.3 + drop.phase),
//       );
//       dummy.updateMatrix();

//       mesh.setMatrixAt(i, dummy.matrix);
//     });

//     mesh.instanceMatrix.needsUpdate = true;
//   });

//   return (
//     <instancedMesh
//       ref={dropletsRef}
//       args={[undefined, undefined, DROPLET_COUNT]}
//       frustumCulled={false}
//       renderOrder={7}
//     >
//       <sphereGeometry args={[1, 8, 8]} />
//       <meshPhysicalMaterial
//         color="#a9eaff"
//         roughness={0.08}
//         metalness={0}
//         clearcoat={1}
//         clearcoatRoughness={0.03}
//         transparent
//         opacity={0.86}
//         depthWrite={false}
//         emissive="#123c52"
//         emissiveIntensity={0.15}
//       />
//     </instancedMesh>
//   );
// }

// /**
//  * Main 360-degree jal abhishek effect.
//  * Keep WATER_POSITION unchanged to preserve your current alignment.
//  */
// function AbhishekWater() {
//   const waterRef = useRef<THREE.Mesh>(null);

//   const waterGeometry = useMemo(() => {
//     const geometry = new THREE.CylinderGeometry(
//       WATER_TOP_RADIUS,
//       WATER_BOTTOM_RADIUS,
//       WATER_HEIGHT,
//       128,
//       96,
//       true,
//     );

//     // Keep the manually chosen WATER_POSITION unchanged, but compensate
//     // its -0.48 X offset so the water is centered on the Shivling.
//     // The bottom starts at local y=0; the top reaches just below the crown.
//     geometry.translate(0.48, WATER_HEIGHT / 2, 0);

//     return geometry;
//   }, []);

//   const waterMaterial = useMemo(createAbhishekMaterial, []);

//   useFrame((state) => {
//     waterMaterial.uniforms.uTime.value = state.clock.elapsedTime;

//     if (waterRef.current) {
//       // Gentle movement of the water surface, not the island.
//       waterRef.current.rotation.y =
//         Math.sin(state.clock.elapsedTime * 0.35) * 0.012;
//     }
//   });

//   useEffect(() => {
//     return () => {
//       waterGeometry.dispose();
//       waterMaterial.dispose();
//     };
//   }, [waterGeometry, waterMaterial]);

//   return (
//     <group position={WATER_POSITION}>
//       {/* Smooth flowing water curtain around all 360 degrees */}
//       <mesh
//         ref={waterRef}
//         geometry={waterGeometry}
//         material={waterMaterial}
//         renderOrder={5}
//         frustumCulled={false}
//       />

//       {/* Fine droplets falling around the whole water curtain */}
//       <AbhishekDroplets />
//     </group>
//   );
// }

// export default function CentralSanctuary() {
//   const sanctuaryRef = useRef<THREE.Group>(null);

//   const rockGeometry = useMemo(createRockGeometry, []);
//   const lingamGeometry = useMemo(createLingamGeometry, []);
//   const basinGeometry = useMemo(createBasinGeometry, []);

//   const darkStone = useMemo(
//   () =>
//     new THREE.MeshPhysicalMaterial({
//       color: '#171b25',
//       roughness: 0.17,
//       metalness: 0.22,
//       clearcoat: 1,
//       clearcoatRoughness: 0.08,
//       emissive: '#080d19',
//       emissiveIntensity: 0.08,
//     }),
//   [],
// );

//   const platformStone = useMemo(
//     () =>
//       new THREE.MeshStandardMaterial({
//         color: '#34394a',
//         roughness: 0.63,
//         metalness: 0.20,
//       }),
//     [],
//   );

//   const goldTrim = useMemo(
//     () =>
//       new THREE.MeshStandardMaterial({
//         color: '#c6a36a',
//         metalness: 0.72,
//         roughness: 0.25,
//         emissive: '#503016',
//         emissiveIntensity: 0.22,
//       }),
//     [],
//   );

//   const basinWater = useMemo(
//     () =>
//       new THREE.MeshPhysicalMaterial({
//         color: '#1684b9',
//         roughness: 0.12,
//         metalness: 0.15,
//         transparent: true,
//         opacity: 0.86,
//         clearcoat: 1,
//         clearcoatRoughness: 0.06,
//         emissive: '#07365a',
//         emissiveIntensity: 0.24,
//       }),
//     [],
//   );

//   // const mainWaterPoints = useMemo(
//   //   () => [
//   //     new THREE.Vector3(0.015, 1.49, 0.035),
//   //     new THREE.Vector3(0.005, 1.40, 0.19),
//   //     new THREE.Vector3(-0.015, 1.25, 0.31),
//   //     new THREE.Vector3(0.015, 1.04, 0.365),
//   //     new THREE.Vector3(-0.01, 0.82, 0.40),
//   //     new THREE.Vector3(0.015, 0.61, 0.43),
//   //     new THREE.Vector3(0.0, 0.49, 0.47),
//   //   ],
//   //   [],
//   // );

//   // const leftWaterPoints = useMemo(
//   //   () => [
//   //     new THREE.Vector3(-0.20, 1.39, 0.17),
//   //     new THREE.Vector3(-0.24, 1.20, 0.28),
//   //     new THREE.Vector3(-0.25, 0.96, 0.35),
//   //     new THREE.Vector3(-0.23, 0.73, 0.40),
//   //     new THREE.Vector3(-0.27, 0.52, 0.47),
//   //   ],
//   //   [],
//   // );

//   // const rightWaterPoints = useMemo(
//   //   () => [
//   //     new THREE.Vector3(0.21, 1.39, 0.17),
//   //     new THREE.Vector3(0.24, 1.20, 0.28),
//   //     new THREE.Vector3(0.25, 0.96, 0.35),
//   //     new THREE.Vector3(0.23, 0.73, 0.40),
//   //     new THREE.Vector3(0.27, 0.52, 0.47),
//   //   ],
//   //   [],
//   // );
  
//   const mainWaterPoints = useMemo(
//   () => [
//     new THREE.Vector3(0.00, 4.35, 0.16),
//     new THREE.Vector3(0.00, 4.05, 0.34),
//     new THREE.Vector3(-0.01, 3.60, 0.47),
//     new THREE.Vector3(0.01, 3.10, 0.54),
//     new THREE.Vector3(-0.01, 2.40, 0.59),
//     new THREE.Vector3(0.00, 1.55, 0.64),
//     new THREE.Vector3(0.00, 1.00, 0.68),
//   ],
//   [],
// );

// const leftWaterPoints = useMemo(
//   () => [
//     new THREE.Vector3(-0.34, 4.05, 0.16),
//     new THREE.Vector3(-0.38, 3.70, 0.34),
//     new THREE.Vector3(-0.43, 3.20, 0.46),
//     new THREE.Vector3(-0.46, 2.60, 0.53),
//     new THREE.Vector3(-0.48, 1.75, 0.61),
//     new THREE.Vector3(-0.42, 1.00, 0.68),
//   ],
//   [],
// );

// const rightWaterPoints = useMemo(
//   () => [
//     new THREE.Vector3(0.34, 4.05, 0.16),
//     new THREE.Vector3(0.38, 3.70, 0.34),
//     new THREE.Vector3(0.43, 3.20, 0.46),
//     new THREE.Vector3(0.46, 2.60, 0.53),
//     new THREE.Vector3(0.48, 1.75, 0.61),
//     new THREE.Vector3(0.42, 1.00, 0.68),
//   ],
//   [],
// );

// const extraWaterPaths = useMemo(
//   () =>
//     [-0.24, -0.12, 0.12, 0.24].map(
//       (x) => [
//         new THREE.Vector3(x * 0.65, 4.00, 0.20),
//         new THREE.Vector3(x * 0.90, 3.65, 0.38),
//         new THREE.Vector3(x, 3.10, 0.49),
//         new THREE.Vector3(x * 1.05, 2.45, 0.57),
//         new THREE.Vector3(x * 0.90, 1.65, 0.64),
//         new THREE.Vector3(x, 1.00, 0.68),
//       ],
//     ),
//   [],
// );

//   useEffect(() => {
//     return () => {
//       rockGeometry.dispose();
//       lingamGeometry.dispose();
//       basinGeometry.dispose();
//       darkStone.dispose();
//       platformStone.dispose();
//       goldTrim.dispose();
//       basinWater.dispose();
//     };
//   }, [
//     rockGeometry,
//     lingamGeometry,
//     basinGeometry,
//     darkStone,
//     platformStone,
//     goldTrim,
//     basinWater,
//   ]);

//   useFrame((state, delta) => {
//   if (!sanctuaryRef.current) return;

//   // Lower the complete island and Shivling.
//   sanctuaryRef.current.position.y =
//     -2.50 + Math.sin(state.clock.elapsedTime * 0.42) * 0.025;

//   // Keep the same slow, continuous rotation.
//   sanctuaryRef.current.rotation.y += delta * 0.18;
// });

//   return (
//     <group ref={sanctuaryRef} position={[0, 0, 0]}>
//       {/* Floating rocky island */}
//       <mesh
//   geometry={rockGeometry}
//   position={[0, -0.55, 0]}
//   scale={[4.7, 1.35, 4.65]}
//   material={platformStone}
//   castShadow
//   receiveShadow
// />

//       {/* <mesh position={[0, -0.10, 0]}>
//         <cylinderGeometry args={[2.15, 2.28, 0.22, 96]} />
//         <primitive object={platformStone} attach="material" />
//       </mesh>

//       {/* Circular sanctuary platform */}
//       {/* <mesh position={[0, 0.08, 0]}>
//         <cylinderGeometry args={[2.0, 2.12, 0.22, 96]} />
//         <meshStandardMaterial
//           color="#34394a"
//           roughness={0.45}
//           metalness={0.28}
//         />
//       </mesh> */}

//       {/* Lower platform */}
// <mesh position={[0, -0.10, 0]}>
//   <cylinderGeometry args={[2.55, 2.70, 0.22, 96]} />
//   <primitive object={platformStone} attach="material" />
// </mesh>

// {/* Upper platform */}
// <mesh position={[0, 0.08, 0]}>
//   <cylinderGeometry args={[2.35, 2.48, 0.22, 96]} />
//   <meshStandardMaterial
//     color="#34394a"
//     roughness={0.45}
//     metalness={0.28}
//   />
// </mesh>

//       {/* <mesh position={[0, 0.198, 0]}>
//         <torusGeometry args={[1.78, 0.018, 8, 96]} />
//         <primitive object={goldTrim} attach="material" />
//       </mesh> */}

//       {/* Raised pedestal beneath the yoni */}
//       <mesh position={[0, 0.235, 0]} scale={[1.0, 1, 0.82]}>
//         <cylinderGeometry args={[0.93, 1.02, 0.20, 96]} />
//         <primitive object={darkStone} attach="material" />
//       </mesh>

//       <mesh position={[0, 0.345, 0]} scale={[1.0, 1, 0.84]}>
//         <cylinderGeometry args={[0.94, 0.94, 0.055, 96]} />
//         <primitive object={goldTrim} attach="material" />
//       </mesh>

//       {/* Traditional yoni basin and front spout */}
//       <mesh
//         geometry={basinGeometry}
//         position={[0, 0.37, 0.0]}
//         scale={[1.0, 1.0, 1.0]}
//         material={darkStone}
//         castShadow
//         receiveShadow
//       />

//       {/* Visible pool inside the basin */}
//       <mesh
//         position={[0, 0.475, -0.015]}
//         rotation={[-Math.PI / 2, 0, 0]}
//       >
//         <circleGeometry args={[0.78, 96]} />
//         <primitive object={basinWater} attach="material" />
//       </mesh>

//       {/* Downloaded GLB Shivling model */}
//       <ShivlingModel />

//       {/* Fine metallic highlight around the basin rim */}
//       <mesh
//         position={[0, 0.49, -0.01]}
//         rotation={[-Math.PI / 2, 0, 0]}
//       >
//         <torusGeometry args={[0.69, 0.012, 8, 96]} />
//         <primitive object={goldTrim} attach="material" />
//       </mesh>

//       {/* Continuous animated water flowing over the stone */}
//       {/* <WaterSheet points={mainWaterPoints} width={0.38} />
// <WaterSheet points={leftWaterPoints} width={0.12} offset={1.7} />
// <WaterSheet points={rightWaterPoints} width={0.12} offset={3.1} /> */}
//       {/* <WaterSheet points={mainWaterPoints} width={0.72} />
// <WaterSheet points={leftWaterPoints} width={0.24} offset={1.7} />
// <WaterSheet points={rightWaterPoints} width={0.24} offset={3.1} /> */}

// {/* Continuous water flowing around the full Shivling */}
// <AbhishekWater />

// {/* Falling droplets around the lingam */}
// {/* <Droplets /> */}

// {/* Ripples where the water meets the basin */}
// {/* <WaterRipples /> */}

// {/* {extraWaterPaths.map((points, i) => (
//   <WaterSheet
//     key={i}
//     points={points}
//     width={0.11}
//     offset={i * 0.8 + 0.5}
//   />
// ))}

//       <Droplets />
//       <WaterRipples /> */}

//       {/* Floating flowers on the basin water */}
//       {/* <FloatingFlower position={[-0.43, 0.49, 0.10]} rotation={0.3} />
//       <FloatingFlower position={[0.43, 0.49, 0.08]} rotation={1.2} />
//       <FloatingFlower position={[0.10, 0.49, -0.42]} rotation={2.1} /> */}
//       <FloatingFlower position={[-0.48, 0.51, 0.10]} rotation={0.3} />
// <FloatingFlower position={[0.48, 0.51, 0.10]} rotation={1.2} />
// <FloatingFlower position={[0.00, 0.51, -0.34]} rotation={2.1} />

//       {/* Restrained cool and warm lighting reveals the stone shape */}
//       <pointLight
//         position={[-1.1, 1.8, 2.1]}
//         color="#72caff"
//         intensity={1.5}
//         distance={5}
//         decay={2}
//       />

//       <pointLight
//         position={[1.1, 1.4, -0.8]}
//         color="#f0d09a"
//         intensity={0.8}
//         distance={4}
//         decay={2}
//       />

//       <pointLight
//         position={[0, 0.8, 1.5]}
//         color="#36a9ff"
//         intensity={0.65}
//         distance={3}
//         decay={2}
//       />
//     </group>
//   );
// }






// import { useEffect, useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';
// import { useGLTF } from '@react-three/drei';

// /**
//  * THE COSMIC FORGE — Central Sanctuary
//  * Procedural Three.js geometry only.
//  * Keeps the existing Scene.tsx interface unchanged.
//  */

// function createRockGeometry() {
//   const geometry = new THREE.IcosahedronGeometry(1, 4);
//   const positions = geometry.attributes.position;

//   for (let i = 0; i < positions.count; i++) {
//     const x = positions.getX(i);
//     const y = positions.getY(i);
//     const z = positions.getZ(i);

//     const noise =
//       1 +
//       0.045 * Math.sin(x * 17 + z * 11) * Math.cos(y * 13 - x * 5) +
//       0.022 * Math.sin(z * 27 + y * 19);

//     positions.setXYZ(i, x * noise, y * noise, z * noise);
//   }

//   geometry.computeVertexNormals();
//   return geometry;
// }

// /** A rounded, traditional dome-topped lingam. */
// // function createLingamGeometry() {
// //   const profile = [
// //     new THREE.Vector2(0.00, 0.000),
// //     new THREE.Vector2(0.27, 0.000),
// //     new THREE.Vector2(0.355, 0.035),
// //     new THREE.Vector2(0.385, 0.105),
// //     new THREE.Vector2(0.385, 0.390),
// //     new THREE.Vector2(0.365, 0.565),
// //     new THREE.Vector2(0.320, 0.735),
// //     new THREE.Vector2(0.245, 0.895),
// //     new THREE.Vector2(0.155, 1.015),
// //     new THREE.Vector2(0.070, 1.075),
// //     new THREE.Vector2(0.000, 1.090),
// //   ];

// //   const geometry = new THREE.LatheGeometry(profile, 96);
// //   geometry.computeVertexNormals();
// //   return geometry;
// // }
// /** Larger, smooth, traditional black-stone Shivling. */
// function createLingamGeometry() {
//   const profile = [
//     new THREE.Vector2(0.00, 0.000),
//     new THREE.Vector2(0.34, 0.000),
//     new THREE.Vector2(0.44, 0.045),
//     new THREE.Vector2(0.47, 0.13),
//     new THREE.Vector2(0.47, 0.48),
//     new THREE.Vector2(0.44, 0.70),
//     new THREE.Vector2(0.38, 0.91),
//     new THREE.Vector2(0.29, 1.10),
//     new THREE.Vector2(0.18, 1.25),
//     new THREE.Vector2(0.08, 1.32),
//     new THREE.Vector2(0.00, 1.34),
//   ];

//   const geometry = new THREE.LatheGeometry(profile, 128);
//   geometry.computeVertexNormals();
//   return geometry;
// }

// /** Elliptical yoni basin with a subtle forward-projecting spout. */
// function createBasinGeometry() {
//   const shape = new THREE.Shape();

//   shape.moveTo(-0.78, -0.36);
//   shape.bezierCurveTo(-1.02, -0.12, -0.98, 0.31, -0.70, 0.43);
//   shape.bezierCurveTo(-0.35, 0.57, 0.35, 0.57, 0.70, 0.43);
//   shape.bezierCurveTo(0.98, 0.31, 1.02, -0.12, 0.78, -0.36);
//   shape.bezierCurveTo(0.45, -0.55, -0.45, -0.55, -0.78, -0.36);

//   // Extend the front into a traditional yoni spout.
//   shape.lineTo(-0.38, -0.57);
//   shape.lineTo(-0.20, -0.94);
//   shape.quadraticCurveTo(0, -1.06, 0.20, -0.94);
//   shape.lineTo(0.38, -0.57);
//   shape.closePath();

//   const geometry = new THREE.ExtrudeGeometry(shape, {
//     depth: 0.105,
//     bevelEnabled: true,
//     bevelSegments: 3,
//     steps: 1,
//     bevelSize: 0.035,
//     bevelThickness: 0.035,
//     curveSegments: 16,
//   });

//   geometry.rotateX(-Math.PI / 2);
//   geometry.computeVertexNormals();
//   return geometry;
// }

// /** Animated water shader for the falling water sheet. */
// function createWaterMaterial() {
//   return new THREE.ShaderMaterial({
//     transparent: true,
//     depthWrite: false,
//     side: THREE.DoubleSide,
//     uniforms: {
//       uTime: { value: 0 },
//     },
//     vertexShader: `
//       varying vec2 vUv;

//       void main() {
//         vUv = uv;
//         gl_Position = projectionMatrix *
//           modelViewMatrix * vec4(position, 1.0);
//       }
//     `,
//     fragmentShader: `
//       uniform float uTime;
//       varying vec2 vUv;

//       void main() {
//         float flowA = sin(vUv.y * 46.0 - uTime * 4.2
//           + sin(vUv.x * 12.0 + uTime * 1.4) * 1.1);

//         float flowB = sin(vUv.y * 89.0 - uTime * 6.0
//           + vUv.x * 8.0);

//         float edge = smoothstep(0.0, 0.16, vUv.x)
//           * (1.0 - smoothstep(0.84, 1.0, vUv.x));

//         float streaks = smoothstep(0.25, 0.94, flowA * 0.5 + 0.5);
//         streaks = max(streaks, smoothstep(0.76, 0.99, flowB) * 0.55);

//         vec3 deepBlue = vec3(0.035, 0.30, 0.55);
// vec3 iceBlue = vec3(0.42, 0.84, 1.0);
// vec3 white = vec3(0.96, 0.99, 1.0);

//         vec3 color = mix(deepBlue, iceBlue, streaks * 0.78);
//         color = mix(color, white, streaks * 0.42);

//         float alpha = (0.62 + streaks * 0.36) * edge;

//         gl_FragColor = vec4(color, alpha);
//       }
//     `,
//   });
// }

// /** Build a curved ribbon instead of a thin central tube. */
// function createWaterRibbon(
//   points: THREE.Vector3[],
//   width: number,
// ) {
//   const curve = new THREE.CatmullRomCurve3(points);
//   const segments = 96;
//   const verticesAcross = 8;
//   const positions: number[] = [];
//   const uvs: number[] = [];
//   const indices: number[] = [];

//   for (let i = 0; i <= segments; i++) {
//     const t = i / segments;
//     const point = curve.getPoint(t);
//     const tangent = curve.getTangent(t).normalize();

//     // Keep the sheet wide across the front of the stone.
//     const across = new THREE.Vector3(1, 0, 0);
//     across.addScaledVector(tangent, -across.dot(tangent)).normalize();

//     const taper = Math.min(
//       1,
//       0.35 + t * 2.8,
//       0.35 + (1 - t) * 2.5,
//     );

//     for (let j = 0; j <= verticesAcross; j++) {
//       const u = j / verticesAcross;
//       const offset = (u - 0.5) * width * taper;
//       const p = point.clone().addScaledVector(across, offset);

//       positions.push(p.x, p.y, p.z);
//       uvs.push(u, t);
//     }
//   }

//   for (let i = 0; i < segments; i++) {
//     for (let j = 0; j < verticesAcross; j++) {
//       const a = i * (verticesAcross + 1) + j;
//       const b = a + verticesAcross + 1;

//       indices.push(a, b, a + 1);
//       indices.push(b, b + 1, a + 1);
//     }
//   }

//   const geometry = new THREE.BufferGeometry();
//   geometry.setAttribute(
//     'position',
//     new THREE.Float32BufferAttribute(positions, 3),
//   );
//   geometry.setAttribute(
//     'uv',
//     new THREE.Float32BufferAttribute(uvs, 2),
//   );
//   geometry.setIndex(indices);
//   geometry.computeVertexNormals();

//   return geometry;
// }

// function WaterSheet({
//   points,
//   width,
//   offset = 0,
// }: {
//   points: THREE.Vector3[];
//   width: number;
//   offset?: number;
// }) {
//   const meshRef = useRef<THREE.Mesh>(null);

//   const geometry = useMemo(
//     () => createWaterRibbon(points, width),
//     [points, width],
//   );

//   const material = useMemo(createWaterMaterial, []);

//   useFrame((state) => {
//     material.uniforms.uTime.value = state.clock.elapsedTime + offset;

//     if (meshRef.current) {
//       meshRef.current.visible = true;
//     }
//   });

//   useEffect(() => {
//     return () => {
//       geometry.dispose();
//       material.dispose();
//     };
//   }, [geometry, material]);

//   return (
//     <mesh
//       ref={meshRef}
//       geometry={geometry}
//       material={material}
//       renderOrder={5}
//       frustumCulled={false}
//     />
//   );
// }

// /** Fine droplets travel down toward the basin. */
// // function Droplets() {
// //   const groupRef = useRef<THREE.Group>(null);

// //   const drops = useMemo(
// //     () =>
// //       Array.from({ length: 24 }, (_, i) => ({
// //         x: Math.sin(i * 12.73) * (0.22 + (i % 4) * 0.045),
// //         z: Math.cos(i * 8.31) * 0.28 + 0.12,
// //         speed: 0.55 + (i % 6) * 0.13,
// //         phase: (i * 0.173) % 1,
// //         size: 0.010 + (i % 3) * 0.004,
// //       })),
// //     [],
// //   );

// //   useFrame((state) => {
// //     if (!groupRef.current) return;

// //     const time = state.clock.elapsedTime;

// //     groupRef.current.children.forEach((drop, i) => {
// //       const data = drops[i];
// //       const progress = (time * data.speed + data.phase) % 1;

// //       drop.position.set(
// //   data.x,
// //   4.85 - progress * 2.0,
// //   data.z + progress * 0.12,
// // );

// //       const scale = 0.65 + Math.sin(progress * Math.PI) * 0.55;
// //       drop.scale.set(data.size * scale, data.size * scale * 1.8, data.size * scale);
// //     });
// //   });

// //   return (
// //     <group ref={groupRef}>
// //       {drops.map((drop, i) => (
// //         <mesh key={i} position={[drop.x, 1.3, drop.z]}>
// //           <sphereGeometry args={[1, 8, 8]} />
// //           <meshBasicMaterial
// //             color="#bcefff"
// //             transparent
// //             opacity={0.92}
// //           />
// //         </mesh>
// //       ))}
// //     </group>
// //   );
// // }

// function Droplets() {
//   const groupRef = useRef<THREE.Group>(null);

//   const drops = useMemo(
//     () =>
//       Array.from({ length: 110 }, (_, i) => ({
//         angle: i * 2.399963,
//         phase: (i * 0.6180339) % 1,
//         speed: 0.42 + (i % 9) * 0.055,
//         size: 0.007 + (i % 4) * 0.003,
//       })),
//     [],
//   );

//   useFrame((state) => {
//     if (!groupRef.current) return;

//     const time = state.clock.elapsedTime;

//     groupRef.current.children.forEach((drop, i) => {
//       const d = drops[i];
//       const progress = (time * d.speed + d.phase) % 1;

//       // Start just above the crown and fall past the sides.
//       const y = 4.72 - progress * 2.08;

//       // The drops follow the approximate curved outline.
//       let radius: number;

//       if (y > 4.25) {
//         radius = THREE.MathUtils.lerp(
//           0.08,
//           0.34,
//           (4.72 - y) / 0.47,
//         );
//       } else {
//         radius = THREE.MathUtils.lerp(
//           0.35,
//           0.43,
//           THREE.MathUtils.clamp((4.25 - y) / 1.53, 0, 1),
//         );
//       }

//       // Slight sideways drift makes the water feel less mechanical.
//       const angle = d.angle + Math.sin(time * 1.8 + i) * 0.035;

//       drop.position.set(
//         Math.sin(angle) * radius,
//         y,
//         Math.cos(angle) * radius,
//       );

//       const pulse = 0.8 + Math.sin(progress * Math.PI) * 0.5;

//       drop.scale.set(
//         d.size * pulse,
//         d.size * pulse * 2.6,
//         d.size * pulse,
//       );
//     });
//   });

//   return (
//     <group ref={groupRef} position={[0, 0.46, 0.12]}>
//       {drops.map((d, i) => (
//         <mesh key={i}>
//           <sphereGeometry args={[1, 8, 8]} />
//           <meshPhysicalMaterial
//             color="#b9edff"
//             roughness={0.08}
//             metalness={0.0}
//             transparent
//             opacity={0.82}
//             clearcoat={1}
//           />
//         </mesh>
//       ))}
//     </group>
//   );
// }


// /** Expanding rings give the water surface continuous movement. */
// function WaterRipples() {
//   const rings = useRef<(THREE.Mesh | null)[]>([]);

//   useFrame((state) => {
//     const time = state.clock.elapsedTime;

//     rings.current.forEach((ring, i) => {
//       if (!ring) return;

//       const phase = (time * 0.38 + i / 3) % 1;
//       const radius = 0.12 + phase * 0.40;

//       ring.scale.set(radius, radius, radius);
//       ring.position.y = 0.485 + i * 0.001;
//       ring.position.z = 0.12;

//       const material = ring.material as THREE.MeshBasicMaterial;
//       material.opacity = (1 - phase) * 0.48;
//     });
//   });

//   return (
//     <group>
//       {[0, 1, 2].map((i) => (
//         <mesh
//           key={i}
//           ref={(node) => {
//             rings.current[i] = node;
//           }}
//           rotation={[-Math.PI / 2, 0, 0]}
//           position={[0, 0.485, 0.12]}
//         >
//           <torusGeometry args={[1, 0.012, 6, 64]} />
//           <meshBasicMaterial
//             color="#7edcff"
//             transparent
//             opacity={0.4}
//             depthWrite={false}
//           />
//         </mesh>
//       ))}
//     </group>
//   );
// }

// function FloatingFlower({
//   position,
//   rotation = 0,
// }: {
//   position: [number, number, number];
//   rotation?: number;
// }) {
//   const flowerRef = useRef<THREE.Group>(null);

//   useFrame((state) => {
//     if (!flowerRef.current) return;

//     const t = state.clock.elapsedTime + rotation;
//     flowerRef.current.position.y =
//       position[1] + Math.sin(t * 1.4) * 0.012;

//     flowerRef.current.rotation.z = Math.sin(t * 0.7) * 0.04;
//   });

//   return (
//     <group
//       ref={flowerRef}
//       position={position}
//       rotation={[0, rotation, 0]}
//     >
//       {Array.from({ length: 6 }, (_, i) => {
//         const angle = (i / 6) * Math.PI * 2;

//         return (
//           <mesh
//             key={i}
//             position={[
//               Math.cos(angle) * 0.075,
//               0,
//               Math.sin(angle) * 0.075,
//             ]}
//             rotation={[0, -angle, 0]}
//             scale={[0.075, 0.018, 0.038]}
//           >
//             <sphereGeometry args={[1, 12, 8]} />
//             <meshStandardMaterial
//               color="#f6a0c7"
//               emissive="#52132e"
//               emissiveIntensity={0.22}
//               roughness={0.38}
//             />
//           </mesh>
//         );
//       })}

//       <mesh position={[0, 0.008, 0]}>
//         <sphereGeometry args={[0.028, 12, 8]} />
//         <meshStandardMaterial
//           color="#ffd45e"
//           roughness={0.5}
//         />
//       </mesh>
//     </group>
//   );
// }

// function ShivlingModel() {
//   const { scene } = useGLTF('/models/shivling.glb');

//   const model = useMemo(() => {
//     const clone = scene.clone(true);

//     // Measure the downloaded model.
//     const bounds = new THREE.Box3().setFromObject(clone);
//     const size = bounds.getSize(new THREE.Vector3());
//     const center = bounds.getCenter(new THREE.Vector3());

//     // Normalize it to a predictable height.
//     const targetHeight = 4.5;
//     const scale = targetHeight / Math.max(size.y, 0.001);

//     clone.scale.setScalar(scale);
//     clone.position.set(
//       -center.x * scale,
//       -bounds.min.y * scale,
//       -center.z * scale,
//     );

//     return clone;
//   }, [scene]);

//   return (
//     <primitive
//       object={model}
//       position={[0, 0.46, 0.12]}
//       // scale={1.35}
//       // castShadow
//       // receiveShadow
//     />
//   );
// }

// useGLTF.preload('/models/shivling.glb');

// // /** Water flows around the full circumference of the rotating Shivling. */
// // function AbhishekWater() {
// //   const meshRef = useRef<THREE.Mesh>(null);

// //   const geometry = useMemo(() => {
// //     const segments = 192;
// //     const rings = 100;

// //     // Local coordinates assume the GLB is normalized to height 4.5.
// //     const topY = 4.49;
// //     const bottomY = 2.72;

// //     const positions: number[] = [];
// //     const uvs: number[] = [];
// //     const indices: number[] = [];

// //     // Approximate the rounded crown and cylindrical body.
// //     const radiusAt = (t: number) => {
// //       if (t < 0.12) {
// //         const crown = t / 0.12;
// //         return 0.055 + 0.31 * Math.sin(crown * Math.PI * 0.5);
// //       }

// //       if (t < 0.88) {
// //         return 0.37 + 0.025 * Math.sin(t * Math.PI * 3.0);
// //       }

// //       return 0.395 - (t - 0.88) * 0.12;
// //     };

// //     for (let j = 0; j <= rings; j++) {
// //       const v = j / rings;
// //       const y = THREE.MathUtils.lerp(topY, bottomY, v);
// //       const radius = radiusAt(v);

// //       for (let i = 0; i <= segments; i++) {
// //         const u = i / segments;
// //         const angle = u * Math.PI * 2;

// //         // A tiny offset keeps the water just above the stone.
// //         const r = radius + 0.018;

// //         positions.push(
// //           Math.sin(angle) * r,
// //           y,
// //           Math.cos(angle) * r,
// //         );

// //         uvs.push(u, v);
// //       }
// //     }

// //     for (let j = 0; j < rings; j++) {
// //       for (let i = 0; i < segments; i++) {
// //         const a = j * (segments + 1) + i;
// //         const b = a + segments + 1;

// //         indices.push(a, b, a + 1);
// //         indices.push(b, b + 1, a + 1);
// //       }
// //     }

// //     const geo = new THREE.BufferGeometry();

// //     geo.setAttribute(
// //       'position',
// //       new THREE.Float32BufferAttribute(positions, 3),
// //     );
// //     geo.setAttribute(
// //       'uv',
// //       new THREE.Float32BufferAttribute(uvs, 2),
// //     );
// //     geo.setIndex(indices);
// //     geo.computeVertexNormals();

// //     return geo;
// //   }, []);

// //   const material = useMemo(
// //     () =>
// //       new THREE.ShaderMaterial({
// //         transparent: true,
// //         depthWrite: false,
// //         side: THREE.DoubleSide,
// //         uniforms: {
// //           uTime: { value: 0 },
// //         },
// //         vertexShader: `
// //           varying vec2 vUv;

// //           void main() {
// //             vUv = uv;
// //             gl_Position = projectionMatrix *
// //               modelViewMatrix * vec4(position, 1.0);
// //           }
// //         `,
// //         fragmentShader: `
// //           uniform float uTime;
// //           varying vec2 vUv;

// //           void main() {
// //             float flow = vUv.y * 24.0 - uTime * 3.8
// //               + sin(vUv.x * 32.0 + uTime * 1.5) * 0.65;

// //             float streak = smoothstep(
// //               0.35, 0.95, sin(flow) * 0.5 + 0.5
// //             );

// //             float fineStreak = smoothstep(
// //               0.72, 0.98,
// //               sin(vUv.y * 85.0 - uTime * 6.0 + vUv.x * 50.0)
// //                 * 0.5 + 0.5
// //             );

// //             float variation = 0.35 + streak * 0.42 + fineStreak * 0.23;

// //             vec3 waterColor = mix(
// //               vec3(0.08, 0.42, 0.70),
// //               vec3(0.78, 0.96, 1.0),
// //               variation
// //             );

// //             float edgeFade = smoothstep(0.0, 0.08, vUv.y)
// //               * (1.0 - smoothstep(0.90, 1.0, vUv.y));

// //             float alpha = (0.24 + streak * 0.44 + fineStreak * 0.22)
// //               * edgeFade;

// //             gl_FragColor = vec4(waterColor, alpha);
// //           }
// //         `,
// //       }),
// //     [],
// //   );

// //   useFrame((state) => {
// //     material.uniforms.uTime.value = state.clock.elapsedTime;
// //   });

// //   useEffect(() => {
// //     return () => {
// //       geometry.dispose();
// //       material.dispose();
// //     };
// //   }, [geometry, material]);

// //   return (
// //     <mesh
// //       ref={meshRef}
// //       geometry={geometry}
// //       material={material}
// //       position={[0, 0.46, 0.12]}
// //       renderOrder={5}
// //       frustumCulled={false}
// //     />
// //   );
// // }


// // function AbhishekWater() {
// //   const materialRef = useRef<THREE.ShaderMaterial>(null);

// //   const geometry = useMemo(() => {
// //     const segments = 256;
// //     const rings = 120;
// //     const positions: number[] = [];
// //     const uvs: number[] = [];
// //     const indices: number[] = [];

// //     // Coordinates match the normalized 4.5-unit Shivling model.
// //     // Adjust these radii if your downloaded model has a different shape.
// //     const profile = [
// //   { t: 0.00, y: 4.49, r: 0.055 },
// //   { t: 0.05, y: 4.43, r: 0.23 },
// //   { t: 0.12, y: 4.25, r: 0.37 },
// //   { t: 0.20, y: 4.00, r: 0.405 },
// //   { t: 0.48, y: 3.35, r: 0.41 },
// //   { t: 0.75, y: 2.75, r: 0.425 },
// //   { t: 1.00, y: 2.35, r: 0.44 },
// // ];

// //     const sampleProfile = (t: number) => {
// //       for (let k = 0; k < profile.length - 1; k++) {
// //         const a = profile[k];
// //         const b = profile[k + 1];

// //         if (t <= b.t) {
// //           const f = (t - a.t) / (b.t - a.t);
// //           const smooth = f * f * (3 - 2 * f);

// //           return {
// //             y: THREE.MathUtils.lerp(a.y, b.y, f),
// //             r: THREE.MathUtils.lerp(a.r, b.r, smooth),
// //           };
// //         }
// //       }

// //       return profile[profile.length - 1];
// //     };

// //     for (let j = 0; j <= rings; j++) {
// //       const t = j / rings;
// //       const p = sampleProfile(t);

// //       for (let i = 0; i <= segments; i++) {
// //         const u = i / segments;
// //         const angle = u * Math.PI * 2;

// //         // Small gap prevents the water surface from z-fighting with stone.
// //         const r = p.r + 0.25;

// //         positions.push(
// //           Math.sin(angle) * r,
// //           p.y,
// //           Math.cos(angle) * r,
// //         );

// //         uvs.push(u, t);
// //       }
// //     }

// //     for (let j = 0; j < rings; j++) {
// //       for (let i = 0; i < segments; i++) {
// //         const a = j * (segments + 1) + i;
// //         const b = a + segments + 1;

// //         indices.push(a, b, a + 1);
// //         indices.push(b, b + 1, a + 1);
// //       }
// //     }

// //     const geo = new THREE.BufferGeometry();

// //     geo.setAttribute(
// //       'position',
// //       new THREE.Float32BufferAttribute(positions, 3),
// //     );
// //     geo.setAttribute(
// //       'uv',
// //       new THREE.Float32BufferAttribute(uvs, 2),
// //     );
// //     geo.setIndex(indices);
// //     geo.computeVertexNormals();

// //     return geo;
// //   }, []);

// //   const material = useMemo(
// //     () =>
// //       new THREE.ShaderMaterial({
// //         transparent: true,
// //         depthWrite: false,
// //         side: THREE.DoubleSide,
// //         uniforms: {
// //           uTime: { value: 0 },
// //         },
// //         vertexShader: `
// //           varying vec2 vUv;

// //           void main() {
// //             vUv = uv;
// //             gl_Position = projectionMatrix *
// //               modelViewMatrix * vec4(position, 1.0);
// //           }
// //         `,
// //         fragmentShader: `
// //           uniform float uTime;
// //           varying vec2 vUv;

// //           void main() {
// //             float angle = vUv.x * 6.2831853;

// //             // Several narrow, irregular streams around the full surface.
// //             float bands = sin(
// //               angle * 25.0
// //               + sin(angle * 7.0) * 1.5
// //               + uTime * 0.55
// //             );

// //             float streams = smoothstep(0.25, 0.88, bands);

// //             float fine = sin(
// //               angle * 65.0
// //               + vUv.y * 12.0
// //               - uTime * 2.8
// //             );

// //             float shimmer = smoothstep(0.52, 0.96, fine);

// //             // Motion travels downward from the crown.
// //             float flow = sin(
// //               vUv.y * 70.0
// //               - uTime * 7.0
// //               + sin(angle * 9.0) * 1.2
// //             );

// //             float movingHighlights =
// //               smoothstep(0.45, 0.96, flow);

// //             vec3 darkWater = vec3(0.025, 0.19, 0.31);
// //             vec3 blueWater = vec3(0.16, 0.56, 0.78);
// //             vec3 brightWater = vec3(0.78, 0.96, 1.0);

// //             vec3 color = mix(
// //               darkWater,
// //               blueWater,
// //               0.30 + streams * 0.35
// //             );

// //             color = mix(
// //               color,
// //               brightWater,
// //               shimmer * 0.34 + movingHighlights * 0.32
// //             );

// //             // The water stays visible around the entire lingam.
// //             float alpha = 0.25
// //               + streams * 0.15
// //               + shimmer * 0.12
// //               + movingHighlights * 0.12;

// //             // Fade only near the top and bottom edges.
// //             alpha *= smoothstep(0.0, 0.035, vUv.y);
// //             alpha *= 1.0 - smoothstep(0.95, 1.0, vUv.y);

// //             gl_FragColor = vec4(color, alpha);
// //           }
// //         `,
// //       }),
// //     [],
// //   );

// //   useFrame((state) => {
// //     if (materialRef.current) {
// //       materialRef.current.uniforms.uTime.value =
// //         state.clock.elapsedTime;
// //     }
// //   });

// //   useEffect(() => {
// //     return () => {
// //       geometry.dispose();
// //       material.dispose();
// //     };
// //   }, [geometry, material]);

// //   return (
// //     <mesh
// //       geometry={geometry}
// //       position={[-0.48, 0.30, 0.10]}
// //       renderOrder={5}
// //       frustumCulled={false}
// //     >
// //       <primitive
// //         ref={materialRef}
// //         object={material}
// //         attach="material"
// //       />
// //     </mesh>
// //   );
// // }

// // function AbhishekWater() {
// //   const dropsRef = useRef<THREE.InstancedMesh>(null);
// //   const blanketMaterialRef = useRef<THREE.ShaderMaterial>(null);

// //   const dropCount = 360;
// //   const streamCount = 40;

// //   // Reuse the earlier blanket's height and radius profile.
// //   const topY = 4.49;
// //   const blanketBottomY = 2.35;
// //   const fallBottomY = 0.16;
// //   const segments = 192;
// //   const rings = 100;

// //   // Full 360-degree water blanket.
// //   const blanketGeometry = useMemo(() => {
// //     const positions: number[] = [];
// //     const uvs: number[] = [];
// //     const indices: number[] = [];

// //     const profile = [
// //       { t: 0.0, r: 0.055 },
// //       { t: 0.05, r: 0.23 },
// //       { t: 0.12, r: 0.37 },
// //       { t: 0.2, r: 0.405 },
// //       { t: 0.48, r: 0.41 },
// //       { t: 0.75, r: 0.425 },
// //       { t: 1.0, r: 0.44 },
// //     ];

// //     const radiusAt = (t: number) => {
// //       for (let k = 0; k < profile.length - 1; k++) {
// //         const a = profile[k];
// //         const b = profile[k + 1];

// //         if (t <= b.t) {
// //           const f = (t - a.t) / (b.t - a.t);
// //           const smooth = f * f * (3 - 2 * f);
// //           return THREE.MathUtils.lerp(a.r, b.r, smooth) + 0.25;
// //         }
// //       }

// //       return 0.69;
// //     };

// //     for (let j = 0; j <= rings; j++) {
// //       const v = j / rings;
// //       const y = THREE.MathUtils.lerp(topY, blanketBottomY, v);

// //       for (let i = 0; i <= segments; i++) {
// //         const u = i / segments;
// //         const angle = u * Math.PI * 2;

// //         // Small undulation breaks up the perfectly smooth cylinder.
// //         const ripple =
// //           Math.sin(angle * 17 + v * 24) * 0.012 +
// //           Math.sin(angle * 31 - v * 18) * 0.006;

// //         const r = radiusAt(v) + ripple;

// //         positions.push(
// //           Math.sin(angle) * r,
// //           y,
// //           Math.cos(angle) * r,
// //         );

// //         uvs.push(u, v);
// //       }
// //     }

// //     for (let j = 0; j < rings; j++) {
// //       for (let i = 0; i < segments; i++) {
// //         const a = j * (segments + 1) + i;
// //         const b = a + segments + 1;
// //         indices.push(a, b, a + 1, b, b + 1, a + 1);
// //       }
// //     }

// //     const geometry = new THREE.BufferGeometry();
// //     geometry.setAttribute(
// //       'position',
// //       new THREE.Float32BufferAttribute(positions, 3),
// //     );
// //     geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
// //     geometry.setIndex(indices);
// //     geometry.computeVertexNormals();

// //     return geometry;
// //   }, []);

// //   // Animated transparent water with fine, moving highlights.
// //   const blanketMaterial = useMemo(
// //     () =>
// //       new THREE.ShaderMaterial({
// //         transparent: true,
// //         depthWrite: false,
// //         side: THREE.DoubleSide,
// //         uniforms: {
// //           uTime: { value: 0 },
// //         },
// //         vertexShader: `
// //           varying vec2 vUv;

// //           void main() {
// //             vUv = uv;
// //             gl_Position = projectionMatrix * modelViewMatrix
// //               * vec4(position, 1.0);
// //           }
// //         `,
// //         fragmentShader: `
// //           uniform float uTime;
// //           varying vec2 vUv;

// //           void main() {
// //             float angle = vUv.x * 6.2831853;

// //             float broadFlow = sin(
// //               vUv.y * 42.0 - uTime * 5.0
// //               + sin(angle * 8.0 + uTime * 0.8) * 1.1
// //             );

// //             float fineFlow = sin(
// //               vUv.y * 115.0 - uTime * 8.0
// //               + sin(angle * 19.0 - uTime) * 1.8
// //             );

// //             float streaks = smoothstep(0.05, 0.88, broadFlow * 0.5 + 0.5);
// //             float fine = smoothstep(0.48, 0.96, fineFlow * 0.5 + 0.5);

// //             float brokenFlow = sin(
// //               angle * 38.0 + sin(vUv.y * 13.0 + uTime) * 2.0
// //             );

// //             float strands = smoothstep(0.40, 0.95, brokenFlow * 0.5 + 0.5);

// //             vec3 deepWater = vec3(0.025, 0.16, 0.27);
// //             vec3 blueWater = vec3(0.10, 0.43, 0.64);
// //             vec3 whiteWater = vec3(0.82, 0.96, 1.0);

// //             vec3 color = mix(deepWater, blueWater, 0.35 + streaks * 0.45);
// //             color = mix(color, whiteWater, fine * 0.55 + strands * 0.23);

// //             float alpha = 0.25 + streaks * 0.16 + fine * 0.28 + strands * 0.12;
// //             alpha *= smoothstep(0.0, 0.025, vUv.y);
// //             alpha *= 1.0 - smoothstep(0.97, 1.0, vUv.y);

// //             gl_FragColor = vec4(color, alpha);
// //           }
// //         `,
// //       }),
// //     [],
// //   );

// //   // Separate curved rivulets travel from the crown down to the basin.
// //   const streamGeometries = useMemo(() => {
// //     return Array.from({ length: streamCount }, (_, i) => {
// //       const angle = (i / streamCount) * Math.PI * 2;
// //       const wobble = Math.sin(i * 2.31) * 0.045;
// //       const points: THREE.Vector3[] = [];

// //       points.push(
// //         new THREE.Vector3(
// //           Math.cos(angle) * 0.04,
// //           topY + 0.09,
// //           Math.sin(angle) * 0.04,
// //         ),
// //       );

// //       points.push(
// //         new THREE.Vector3(
// //           Math.cos(angle + 0.08) * 0.24,
// //           topY - 0.28,
// //           Math.sin(angle + 0.08) * 0.24,
// //         ),
// //       );

// //       points.push(
// //         new THREE.Vector3(
// //           Math.cos(angle + 0.12) * 0.52,
// //           topY - 0.72,
// //           Math.sin(angle + 0.12) * 0.52,
// //         ),
// //       );

// //       points.push(
// //         new THREE.Vector3(
// //           Math.cos(angle + 0.17) * (0.69 + wobble),
// //           2.45,
// //           Math.sin(angle + 0.17) * (0.69 + wobble),
// //         ),
// //       );

// //       points.push(
// //         new THREE.Vector3(
// //           Math.cos(angle + 0.2) * (0.72 + wobble),
// //           fallBottomY,
// //           Math.sin(angle + 0.2) * (0.72 + wobble),
// //         ),
// //       );

// //       const curve = new THREE.CatmullRomCurve3(points);

// //       return new THREE.TubeGeometry(
// //         curve,
// //         100,
// //         i % 5 === 0 ? 0.018 : 0.011,
// //         8,
// //         false,
// //       );
// //     });
// //   }, []);

// //   const streamMaterial = useMemo(
// //     () =>
// //       new THREE.MeshPhysicalMaterial({
// //         color: '#8de5ff',
// //         roughness: 0.055,
// //         metalness: 0.0,
// //         transparent: true,
// //         opacity: 0.68,
// //         clearcoat: 1,
// //         clearcoatRoughness: 0.025,
// //         depthWrite: false,
// //       }),
// //     [],
// //   );

// //   const dropGeometry = useMemo(
// //     () => new THREE.SphereGeometry(1, 10, 12),
// //     [],
// //   );

// //   const dropMaterial = useMemo(
// //     () =>
// //       new THREE.MeshPhysicalMaterial({
// //         color: '#d8f5ff',
// //         roughness: 0.025,
// //         metalness: 0,
// //         transparent: true,
// //         opacity: 0.94,
// //         clearcoat: 1,
// //         clearcoatRoughness: 0.015,
// //         depthWrite: false,
// //       }),
// //     [],
// //   );

// //   const dummy = useMemo(() => new THREE.Object3D(), []);

// //   const drops = useMemo(
// //     () =>
// //       Array.from({ length: dropCount }, (_, i) => ({
// //         angle: i * 2.399963,
// //         phase: (i * 0.6180339) % 1,
// //         speed: 0.75 + (i % 11) * 0.095,
// //         spread: 0.08 + ((i * 7) % 13) * 0.055,
// //         size: 0.008 + (i % 5) * 0.0035,
// //       })),
// //     [],
// //   );

// //   useFrame((state) => {
// //     const time = state.clock.elapsedTime;

// //     if (blanketMaterialRef.current) {
// //       blanketMaterialRef.current.uniforms.uTime.value = time;
// //     }

// //     const mesh = dropsRef.current;
// //     if (!mesh) return;

// //     for (let i = 0; i < drops.length; i++) {
// //       const d = drops[i];
// //       const progress = (time * d.speed + d.phase) % 1;

// //       // Drops start just above the crown and fall around the full circumference.
// //       const y = topY + 0.13 - progress * (topY - fallBottomY + 0.13);

// //       const radius =
// //         0.045 +
// //         progress * d.spread +
// //         Math.sin(progress * Math.PI) * 0.035;

// //       const angle = d.angle + Math.sin(time * 1.6 + i) * 0.025;

// //       dummy.position.set(
// //         Math.cos(angle) * radius,
// //         y,
// //         Math.sin(angle) * radius,
// //       );

// //       // Teardrop-like ellipsoids with slight size variation.
// //       const pulse = 0.82 + Math.sin(time * 4.5 + i) * 0.18;
// //       dummy.scale.set(
// //         d.size * pulse,
// //         d.size * (2.2 + d.speed) * pulse,
// //         d.size * pulse,
// //       );

// //       dummy.rotation.set(
// //         0.12 * Math.sin(time + i),
// //         angle,
// //         0.1 * Math.cos(time * 0.8 + i),
// //       );

// //       dummy.updateMatrix();
// //       mesh.setMatrixAt(i, dummy.matrix);
// //     }

// //     mesh.instanceMatrix.needsUpdate = true;
// //   });

// //   useEffect(() => {
// //     return () => {
// //       blanketGeometry.dispose();
// //       blanketMaterial.dispose();
// //       streamGeometries.forEach((geometry) => geometry.dispose());
// //       streamMaterial.dispose();
// //       dropGeometry.dispose();
// //       dropMaterial.dispose();
// //     };
// //   }, [
// //     blanketGeometry,
// //     blanketMaterial,
// //     streamGeometries,
// //     streamMaterial,
// //     dropGeometry,
// //     dropMaterial,
// //   ]);

// //   return (
// //     // Keep your final manually chosen position.
// //     <group position={[-0.48, 0.30, 0.10]}>
// //       <mesh
// //         geometry={blanketGeometry}
// //         renderOrder={5}
// //         frustumCulled={false}
// //       >
// //         <primitive
// //           object={blanketMaterial}
// //           attach="material"
// //           ref={blanketMaterialRef}
// //         />
// //       </mesh>

// //       {streamGeometries.map((geometry, i) => (
// //         <mesh
// //           key={i}
// //           geometry={geometry}
// //           material={streamMaterial}
// //           renderOrder={6}
// //           frustumCulled={false}
// //         />
// //       ))}

// //       <instancedMesh
// //         ref={dropsRef}
// //         args={[dropGeometry, dropMaterial, dropCount]}
// //         renderOrder={7}
// //         frustumCulled={false}
// //       />
// //     </group>
// //   );
// // }

// // Align the water curtain to the same local origin as the GLB Shivling.
// // ShivlingModel is placed at [0, 0.46, 0.12], so the water uses that exact anchor.
// const WATER_POSITION: [number, number, number] = [0, 0.46, 0.12];

// // The top sits slightly above the crown; the bottom reaches the yoni basin.
// // const WATER_HEIGHT = 4.72;
// // const WATER_TOP_RADIUS = 0.58;
// // const WATER_BOTTOM_RADIUS = 0.76;
// // const DROPLET_COUNT = 360;
// const WATER_HEIGHT = 2.35;
// const WATER_TOP_RADIUS = 0.40;
// const WATER_BOTTOM_RADIUS = 0.72;
// const DROPLET_COUNT = 360;

// /**
//  * Creates a smooth, open-ended 360-degree water curtain.
//  * UV coordinates animate vertically flowing highlights.
//  */
// function createAbhishekMaterial() {
//   return new THREE.ShaderMaterial({
//     transparent: true,
//     depthWrite: false,
//     side: THREE.DoubleSide,
//     uniforms: {
//       uTime: { value: 0 },
//     },
//     vertexShader: `
//       uniform float uTime;
//       varying vec2 vUv;
//       varying vec3 vWorldNormal;

//       void main() {
//         vUv = uv;

//         vec3 p = position;

//         // Subtle irregular movement in the falling water.
//         float wave1 = sin(uv.x * 42.0 + uTime * 1.5
//                           + uv.y * 8.0) * 0.009;
//         float wave2 = sin(uv.x * 79.0 - uTime * 2.1
//                           + uv.y * 17.0) * 0.004;

//         float envelope = smoothstep(0.0, 0.12, uv.y);
//         p.x += (wave1 + wave2) * envelope;

//         vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
//         gl_Position = projectionMatrix * mvPosition;

//         vWorldNormal = normalize(mat3(modelMatrix) * normal);
//       }
//     `,
//     fragmentShader: `
//       uniform float uTime;
//       varying vec2 vUv;
//       varying vec3 vWorldNormal;

//       void main() {
//         float angle = vUv.x * 6.2831853;
//         float fall = vUv.y;

//         // Multiple overlapping, non-uniform flowing patterns. The +uTime terms
//         // move highlights toward decreasing UV.y, so the flow reads downward.
//         float distortion =
//           sin(angle * 5.0 + uTime * 0.55) * 0.025
//           + sin(angle * 13.0 - uTime * 0.8) * 0.012;

//         float flow = fall + distortion;

//         float broadFlow = sin(
//           flow * 24.0 + uTime * 4.0
//           + sin(angle * 4.0 + uTime * 0.7) * 1.1
//         );

//         float fineFlow = sin(
//           flow * 68.0 + uTime * 6.8
//           + sin(angle * 9.0 - uTime) * 1.4
//         );

//         float glimmer = smoothstep(
//           0.40, 0.94, broadFlow * 0.5 + 0.5
//         );

//         float fineGlimmer = smoothstep(
//           0.78, 0.99, fineFlow * 0.5 + 0.5
//         );

//         // Break up uniform stripes to avoid the wire-cage look.
//         float breakup =
//           0.72 + 0.28 * sin(angle * 17.0 + fall * 31.0);

//         glimmer *= breakup;

//         vec3 deepWater = vec3(0.025, 0.20, 0.30);
//         vec3 blueWater = vec3(0.12, 0.48, 0.66);
//         vec3 brightReflection = vec3(0.82, 0.96, 1.0);

//         vec3 color = mix(deepWater, blueWater, 0.55);
//         color = mix(
//           color,
//           brightReflection,
//           clamp(glimmer * 0.58 + fineGlimmer * 0.25, 0.0, 0.8)
//         );

//         // Fresnel-like rim highlights.
//         float facing = abs(dot(
//           normalize(vWorldNormal),
//           vec3(0.0, 0.0, 1.0)
//         ));

//         float rim = pow(1.0 - facing, 2.0);

//         float alpha =
//           0.25
//           + glimmer * 0.30
//           + fineGlimmer * 0.15
//           + rim * 0.12;

//         // Fade the edges without cutting off the falling water.
//         alpha *= smoothstep(0.0, 0.035, fall);
//         alpha *= 1.0 - smoothstep(0.965, 1.0, fall);

//         gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.78));
//       }
//     `,
//   });
// }

// /**
//  * Animated droplets distributed around the entire Shivling.
//  * Every particle loops from above the crown down toward the basin.
//  */
// function AbhishekDroplets() {
//   const dropletsRef = useRef<THREE.InstancedMesh>(null);

//   const dummy = useMemo(() => new THREE.Object3D(), []);
//   const rng = (n: number) => {
//     const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
//     return x - Math.floor(x);
//   };

//   const particleData = useMemo(
//     () =>
//       Array.from({ length: DROPLET_COUNT }, (_, i) => ({
//         angle: rng(i + 1) * Math.PI * 2,
//         phase: rng(i + 101),
//         speed: 0.55 + rng(i + 201) * 0.85,
//         radius: 0.50 + rng(i + 301) * 0.27,
//         size: 0.009 + rng(i + 401) * 0.012,
//         drift: (rng(i + 501) - 0.5) * 0.075,
//       })),
//     [],
//   );

//   useEffect(() => {
//     const mesh = dropletsRef.current;
//     if (!mesh) return;

//     mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

//     for (let i = 0; i < DROPLET_COUNT; i++) {
//       dummy.position.set(0, -100, 0);
//       dummy.scale.setScalar(0);
//       dummy.updateMatrix();
//       mesh.setMatrixAt(i, dummy.matrix);
//     }

//     mesh.instanceMatrix.needsUpdate = true;
//   }, [dummy]);

//   useFrame((state) => {
//     const mesh = dropletsRef.current;
//     if (!mesh) return;

//     const time = state.clock.elapsedTime;

//     particleData.forEach((drop, i) => {
//       const progress =
//         (time * drop.speed * 0.36 + drop.phase) % 1;

//       // Start slightly above the lingam and fall toward the basin.
//       const y = WATER_HEIGHT + 0.12 - progress * (WATER_HEIGHT + 0.25);

//       const angle =
//         drop.angle
//         + Math.sin(time * 1.1 + drop.phase * 6.0) * 0.025;

//       // const radius = drop.radius + progress * 0.075;
//       const radius = 0.55 + progress * 0.32;
//       const x = Math.cos(angle) * radius + drop.drift * progress;
//       const z = Math.sin(angle) * radius;

//       // Stretch droplets vertically as they accelerate downward.
//       const size = drop.size * (0.8 + progress * 0.45);

//       // Coordinates are local to the Shivling anchor; no X compensation.
//       dummy.position.set(x, y, z);
//       dummy.scale.set(size * 0.8, size * 1.9, size * 0.8);
//       dummy.rotation.set(
//         0.10 * Math.sin(time + drop.phase),
//         angle,
//         0.08 * Math.cos(time * 1.3 + drop.phase),
//       );
//       dummy.updateMatrix();

//       mesh.setMatrixAt(i, dummy.matrix);
//     });

//     mesh.instanceMatrix.needsUpdate = true;
//   });

//   return (
//     <instancedMesh
//       ref={dropletsRef}
//       args={[undefined, undefined, DROPLET_COUNT]}
//       frustumCulled={false}
//       renderOrder={7}
//     >
//       <sphereGeometry args={[1, 8, 8]} />
//       <meshPhysicalMaterial
//         color="#a9eaff"
//         roughness={0.08}
//         metalness={0}
//         clearcoat={1}
//         clearcoatRoughness={0.03}
//         transparent
//         opacity={0.86}
//         depthWrite={false}
//         emissive="#123c52"
//         emissiveIntensity={0.15}
//       />
//     </instancedMesh>
//   );
// }

// /**
//  * Main 360-degree jal abhishek effect.
//  * Align the curtain directly with the GLB Shivling's position.
//  */
// // function AbhishekWater() {
// //   const waterRef = useRef<THREE.Mesh>(null);

// //   const waterGeometry = useMemo(() => {
// //     const geometry = new THREE.CylinderGeometry(
// //       WATER_TOP_RADIUS,
// //       WATER_BOTTOM_RADIUS,
// //       WATER_HEIGHT,
// //       128,
// //       96,
// //       true,
// //     );

// //     // Center the cylinder around its own axis. Its parent uses the exact
// //     // same [x, y, z] anchor as ShivlingModel, so it stays aligned while rotating.
// //     geometry.translate(0, WATER_HEIGHT / 2, 0);

// //     return geometry;
// //   }, []);

// //   const waterMaterial = useMemo(createAbhishekMaterial, []);

// //   useFrame((state) => {
// //     waterMaterial.uniforms.uTime.value = state.clock.elapsedTime;

// //     if (waterRef.current) {
// //       // Do not rotate the water independently: it must remain attached to
// //       // the Shivling as the complete sanctuary rotates.
// //     }
// //   });

// //   useEffect(() => {
// //     return () => {
// //       waterGeometry.dispose();
// //       waterMaterial.dispose();
// //     };
// //   }, [waterGeometry, waterMaterial]);

// //   return (
// //     // <group position={WATER_POSITION}>
// //     <group position={[-0.5, 2.35, 0.12]}>
// //       {/* Smooth flowing water curtain around all 360 degrees */}
// //       <mesh
// //         ref={waterRef}
// //         geometry={waterGeometry}
// //         material={waterMaterial}
// //         renderOrder={5}
// //         frustumCulled={false}
// //       />

// //       {/* Fine droplets falling around the whole water curtain */}
// //       <AbhishekDroplets />
// //     </group>
// //   );
// // }


// // function AbhishekWater() {
// //   const streamRef = useRef<THREE.Mesh>(null);
// //   const splashRef = useRef<THREE.Group>(null);

// //   const droplets = useMemo(
// //     () =>
// //       Array.from({ length: 22 }, (_, i) => ({
// //         angle: i * 2.399963,
// //         speed: 0.65 + (i % 5) * 0.12,
// //         phase: (i * 0.6180339) % 1,
// //         size: 0.012 + (i % 4) * 0.004,
// //       })),
// //     [],
// //   );

// //   useFrame((state) => {
// //     const time = state.clock.elapsedTime;

// //     // Subtle flowing highlights on the single vertical stream.
// //     if (streamRef.current) {
// //       const material = streamRef.current
// //         .material as THREE.MeshPhysicalMaterial;

// //       material.opacity = 0.72 + Math.sin(time * 5) * 0.08;
// //     }

// //     // Small droplets burst outward at the crown.
// //     if (splashRef.current) {
// //       splashRef.current.children.forEach((drop, i) => {
// //         const d = droplets[i];
// //         const progress = (time * d.speed + d.phase) % 1;
// //         const angle = d.angle + Math.sin(time * 2 + i) * 0.08;

// //         const radius = 0.035 + progress * 0.28;
// //         const height = 4.88 + Math.sin(progress * Math.PI) * 0.13
// //           - progress * 0.22;

// //         drop.position.set(
// //           Math.cos(angle) * radius,
// //           height,
// //           0.12 + Math.sin(angle) * radius,
// //         );

// //         const scale = d.size * (0.6 + Math.sin(progress * Math.PI) * 0.8);
// //         drop.scale.set(scale, scale * 1.6, scale);
// //       });
// //     }
// //   });

// //   return (
// //     <group>
// //       {/* One narrow, continuous stream falling from above */}
// //       <mesh
// //         ref={streamRef}
// //         position={[0, 5.40, 0.12]}
// //         renderOrder={8}
// //       >
// //         <cylinderGeometry args={[0.035, 0.055, 1.25, 16, 1]} />
// //         <meshPhysicalMaterial
// //           color="#c9f4ff"
// //           roughness={0.04}
// //           metalness={0}
// //           transparent
// //           opacity={0.76}
// //           clearcoat={1}
// //           clearcoatRoughness={0.02}
// //           depthWrite={false}
// //           emissive="#246b85"
// //           emissiveIntensity={0.12}
// //         />
// //       </mesh>

// //       {/* A restrained splash of droplets where the stream hits the crown */}
// //       <group ref={splashRef}>
// //         {droplets.map((d, i) => (
// //           <mesh key={i} scale={0}>
// //             <sphereGeometry args={[1, 10, 10]} />
// //             <meshPhysicalMaterial
// //               color="#d8f7ff"
// //               roughness={0.04}
// //               transparent
// //               opacity={0.88}
// //               clearcoat={1}
// //               depthWrite={false}
// //             />
// //           </mesh>
// //         ))}
// //       </group>
// //     </group>
// //   );
// // }




// function AbhishekWater() {
//   const streamRef = useRef<THREE.Mesh>(null);
//   const veilRef = useRef<THREE.Mesh>(null);
//   const streaksRef = useRef<THREE.Group>(null);
//   const dropletsRef = useRef<THREE.Group>(null);
//   const splashRef = useRef<THREE.Group>(null);

//   // Keep the established alignment with the Shivling.
//   const WATER_POSITION: [number, number, number] = [-0.48, 0.30, 0.10];

//   const PARTICLE_COUNT = 96;
//   const STREAK_COUNT = 56;
//   const TAU = Math.PI * 2;

//   const particles = useMemo(
//     () =>
//       Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
//         angle: i * 2.399963,
//         speed: 0.65 + ((i * 17) % 9) * 0.09,
//         phase: ((i * 0.6180339) % 1),
//         radius: 0.24 + ((i * 13) % 100) / 250,
//         size: 0.008 + ((i * 7) % 7) * 0.0025,
//         outward: 0.04 + ((i * 11) % 100) / 220,
//       })),
//     [],
//   );

//   const streakData = useMemo(
//     () =>
//       Array.from({ length: STREAK_COUNT }, (_, i) => ({
//         angle: (i / STREAK_COUNT) * TAU,
//         length: 0.36 + ((i * 19) % 100) / 180,
//         width: 0.004 + ((i * 7) % 5) * 0.0015,
//         phase: (i * 0.173) % 1,
//       })),
//     [],
//   );

//   const waterMaterial = useMemo(
//     () =>
//       new THREE.MeshPhysicalMaterial({
//         color: new THREE.Color("#a8eaff"),
//         roughness: 0.045,
//         metalness: 0,
//         transparent: true,
//         opacity: 0.32,
//         clearcoat: 1,
//         clearcoatRoughness: 0.025,
//         depthWrite: false,
//         side: THREE.DoubleSide,
//         emissive: new THREE.Color("#17617b"),
//         emissiveIntensity: 0.09,
//       }),
//     [],
//   );

//   const streamMaterial = useMemo(
//     () =>
//       new THREE.MeshPhysicalMaterial({
//         color: new THREE.Color("#d8f7ff"),
//         roughness: 0.025,
//         metalness: 0,
//         transparent: true,
//         opacity: 0.82,
//         clearcoat: 1,
//         clearcoatRoughness: 0.015,
//         depthWrite: false,
//         side: THREE.DoubleSide,
//         emissive: new THREE.Color("#327d98"),
//         emissiveIntensity: 0.12,
//       }),
//     [],
//   );

//   useFrame((state) => {
//     const time = state.clock.elapsedTime;

//     // Animate the overhead stream's reflective intensity.
//     streamMaterial.opacity = 0.75 + Math.sin(time * 7.0) * 0.07;

//     // Animate the water veil's flow highlights.
//     waterMaterial.opacity = 0.25 + (Math.sin(time * 4.5) + 1) * 0.045;

//     if (veilRef.current) {
//       veilRef.current.rotation.y = time * 0.12;
//     }

//     // Droplets scatter around the complete circumference at the crown.
//     if (splashRef.current) {
//       splashRef.current.children.forEach((drop, i) => {
//         const p = particles[i];
//         const progress = (time * p.speed + p.phase) % 1;
//         const angle = p.angle + Math.sin(time * 3 + i) * 0.045;
//         const radius = 0.055 + progress * p.outward;

//         drop.position.set(
//           Math.cos(angle) * radius,
//           4.95 + Math.sin(progress * Math.PI) * 0.12 - progress * 0.34,
//           0.10 + Math.sin(angle) * radius,
//         );

//         const scale = p.size * (0.45 + Math.sin(progress * Math.PI) * 1.1);
//         drop.scale.set(scale, scale * (1.4 + progress), scale);
//         drop.visible = true;
//       });
//     }

//     // Fine, bright water streaks travel down around the Shivling.
//     if (streaksRef.current) {
//       streaksRef.current.children.forEach((streak, i) => {
//         const d = streakData[i];
//         const progress = (time * (0.65 + (i % 5) * 0.1) + d.phase) % 1;
//         const angle = d.angle + Math.sin(time * 1.3 + i) * 0.025;

//         const radius = 0.315 + Math.sin(i * 2.1) * 0.035;
//         const y = 4.72 - progress * 0.92;

//         streak.position.set(
//           Math.cos(angle) * radius,
//           y,
//           0.10 + Math.sin(angle) * radius,
//         );

//         streak.scale.y = d.length * (0.65 + progress * 0.35);
//         streak.rotation.y = -angle;
//       });
//     }

//     // Droplets continue down around all 360 degrees, not just the front.
//     if (dropletsRef.current) {
//       dropletsRef.current.children.forEach((drop, i) => {
//         const p = particles[i];
//         const progress = (time * p.speed + p.phase) % 1;
//         const angle = p.angle + Math.sin(time * 1.7 + i) * 0.035;
//         const radius = 0.37 + progress * 0.09;

//         drop.position.set(
//           Math.cos(angle) * radius,
//           4.62 - progress * 1.02,
//           0.10 + Math.sin(angle) * radius,
//         );

//         const size = p.size * (0.7 + progress * 0.7);
//         drop.scale.set(size, size * 1.8, size);
//       });
//     }
//   });

//   useEffect(() => {
//     return () => {
//       waterMaterial.dispose();
//       streamMaterial.dispose();
//     };
//   }, [waterMaterial, streamMaterial]);

//   return (
//     <group>
//       {/* Continuous water source descending onto the crown */}
//       <mesh
//         ref={streamRef}
//         position={[-0.48, 5.45, 0.10]}
//         material={streamMaterial}
//         renderOrder={8}
//         frustumCulled={false}
//       >
//         <cylinderGeometry args={[0.025, 0.105, 1.55, 48, 24, false]} />
//       </mesh>

//       {/* Thin transparent 360-degree water curtain */}
//       <mesh
//         ref={veilRef}
//         position={WATER_POSITION}
//         material={waterMaterial}
//         renderOrder={9}
//         frustumCulled={false}
//       >
//         <cylinderGeometry args={[0.345, 0.405, 1.0, 96, 48, true]} />
//       </mesh>

//       {/* Separate animated rivulets distributed around the lingam */}
//       <group ref={streaksRef} position={WATER_POSITION}>
//         {streakData.map((d, i) => (
//           <mesh key={`streak-${i}`} renderOrder={10}>
//             <capsuleGeometry args={[d.width, d.length, 3, 6]} />
//             <meshPhysicalMaterial
//               color="#c9f5ff"
//               roughness={0.035}
//               transparent
//               opacity={0.55}
//               clearcoat={1}
//               depthWrite={false}
//               side={THREE.DoubleSide}
//             />
//           </mesh>
//         ))}
//       </group>

//       {/* Crown impact splash, visible around the full circumference */}
//       <group ref={splashRef}>
//         {particles.map((p, i) => (
//           <mesh key={`splash-${i}`} scale={0} renderOrder={11}>
//             <sphereGeometry args={[1, 8, 8]} />
//             <meshPhysicalMaterial
//               color="#e0faff"
//               roughness={0.025}
//               transparent
//               opacity={0.88}
//               clearcoat={1}
//               depthWrite={false}
//             />
//           </mesh>
//         ))}
//       </group>

//       {/* Falling droplets all around the lingam */}
//       <group ref={dropletsRef}>
//         {particles.map((p, i) => (
//           <mesh key={`drop-${i}`} renderOrder={11}>
//             <sphereGeometry args={[1, 8, 8]} />
//             <meshPhysicalMaterial
//               color="#d8f7ff"
//               roughness={0.025}
//               transparent
//               opacity={0.88}
//               clearcoat={1}
//               depthWrite={false}
//             />
//           </mesh>
//         ))}
//       </group>
//     </group>
//   );
// }




// export default function CentralSanctuary() {
//   const sanctuaryRef = useRef<THREE.Group>(null);

//   const rockGeometry = useMemo(createRockGeometry, []);
//   const lingamGeometry = useMemo(createLingamGeometry, []);
//   const basinGeometry = useMemo(createBasinGeometry, []);

//   const darkStone = useMemo(
//   () =>
//     new THREE.MeshPhysicalMaterial({
//       color: '#171b25',
//       roughness: 0.17,
//       metalness: 0.22,
//       clearcoat: 1,
//       clearcoatRoughness: 0.08,
//       emissive: '#080d19',
//       emissiveIntensity: 0.08,
//     }),
//   [],
// );

//   const platformStone = useMemo(
//     () =>
//       new THREE.MeshStandardMaterial({
//         color: '#34394a',
//         roughness: 0.63,
//         metalness: 0.20,
//       }),
//     [],
//   );

//   const goldTrim = useMemo(
//     () =>
//       new THREE.MeshStandardMaterial({
//         color: '#c6a36a',
//         metalness: 0.72,
//         roughness: 0.25,
//         emissive: '#503016',
//         emissiveIntensity: 0.22,
//       }),
//     [],
//   );

//   const basinWater = useMemo(
//     () =>
//       new THREE.MeshPhysicalMaterial({
//         color: '#1684b9',
//         roughness: 0.12,
//         metalness: 0.15,
//         transparent: true,
//         opacity: 0.86,
//         clearcoat: 1,
//         clearcoatRoughness: 0.06,
//         emissive: '#07365a',
//         emissiveIntensity: 0.24,
//       }),
//     [],
//   );

//   // const mainWaterPoints = useMemo(
//   //   () => [
//   //     new THREE.Vector3(0.015, 1.49, 0.035),
//   //     new THREE.Vector3(0.005, 1.40, 0.19),
//   //     new THREE.Vector3(-0.015, 1.25, 0.31),
//   //     new THREE.Vector3(0.015, 1.04, 0.365),
//   //     new THREE.Vector3(-0.01, 0.82, 0.40),
//   //     new THREE.Vector3(0.015, 0.61, 0.43),
//   //     new THREE.Vector3(0.0, 0.49, 0.47),
//   //   ],
//   //   [],
//   // );

//   // const leftWaterPoints = useMemo(
//   //   () => [
//   //     new THREE.Vector3(-0.20, 1.39, 0.17),
//   //     new THREE.Vector3(-0.24, 1.20, 0.28),
//   //     new THREE.Vector3(-0.25, 0.96, 0.35),
//   //     new THREE.Vector3(-0.23, 0.73, 0.40),
//   //     new THREE.Vector3(-0.27, 0.52, 0.47),
//   //   ],
//   //   [],
//   // );

//   // const rightWaterPoints = useMemo(
//   //   () => [
//   //     new THREE.Vector3(0.21, 1.39, 0.17),
//   //     new THREE.Vector3(0.24, 1.20, 0.28),
//   //     new THREE.Vector3(0.25, 0.96, 0.35),
//   //     new THREE.Vector3(0.23, 0.73, 0.40),
//   //     new THREE.Vector3(0.27, 0.52, 0.47),
//   //   ],
//   //   [],
//   // );
  
//   const mainWaterPoints = useMemo(
//   () => [
//     new THREE.Vector3(0.00, 4.35, 0.16),
//     new THREE.Vector3(0.00, 4.05, 0.34),
//     new THREE.Vector3(-0.01, 3.60, 0.47),
//     new THREE.Vector3(0.01, 3.10, 0.54),
//     new THREE.Vector3(-0.01, 2.40, 0.59),
//     new THREE.Vector3(0.00, 1.55, 0.64),
//     new THREE.Vector3(0.00, 1.00, 0.68),
//   ],
//   [],
// );

// const leftWaterPoints = useMemo(
//   () => [
//     new THREE.Vector3(-0.34, 4.05, 0.16),
//     new THREE.Vector3(-0.38, 3.70, 0.34),
//     new THREE.Vector3(-0.43, 3.20, 0.46),
//     new THREE.Vector3(-0.46, 2.60, 0.53),
//     new THREE.Vector3(-0.48, 1.75, 0.61),
//     new THREE.Vector3(-0.42, 1.00, 0.68),
//   ],
//   [],
// );

// const rightWaterPoints = useMemo(
//   () => [
//     new THREE.Vector3(0.34, 4.05, 0.16),
//     new THREE.Vector3(0.38, 3.70, 0.34),
//     new THREE.Vector3(0.43, 3.20, 0.46),
//     new THREE.Vector3(0.46, 2.60, 0.53),
//     new THREE.Vector3(0.48, 1.75, 0.61),
//     new THREE.Vector3(0.42, 1.00, 0.68),
//   ],
//   [],
// );

// const extraWaterPaths = useMemo(
//   () =>
//     [-0.24, -0.12, 0.12, 0.24].map(
//       (x) => [
//         new THREE.Vector3(x * 0.65, 4.00, 0.20),
//         new THREE.Vector3(x * 0.90, 3.65, 0.38),
//         new THREE.Vector3(x, 3.10, 0.49),
//         new THREE.Vector3(x * 1.05, 2.45, 0.57),
//         new THREE.Vector3(x * 0.90, 1.65, 0.64),
//         new THREE.Vector3(x, 1.00, 0.68),
//       ],
//     ),
//   [],
// );

//   useEffect(() => {
//     return () => {
//       rockGeometry.dispose();
//       lingamGeometry.dispose();
//       basinGeometry.dispose();
//       darkStone.dispose();
//       platformStone.dispose();
//       goldTrim.dispose();
//       basinWater.dispose();
//     };
//   }, [
//     rockGeometry,
//     lingamGeometry,
//     basinGeometry,
//     darkStone,
//     platformStone,
//     goldTrim,
//     basinWater,
//   ]);

//   useFrame((state, delta) => {
//   if (!sanctuaryRef.current) return;

//   // Lower the complete island and Shivling.
//   sanctuaryRef.current.position.y =
//     -2.50 + Math.sin(state.clock.elapsedTime * 0.42) * 0.025;

//   // Keep the same slow, continuous rotation.
//   sanctuaryRef.current.rotation.y += delta * 0.18;
// });

//   return (
//     <group ref={sanctuaryRef} position={[0, 0, 0]}>
//       {/* Floating rocky island */}
//       <mesh
//   geometry={rockGeometry}
//   position={[0, -0.55, 0]}
//   scale={[4.7, 1.35, 4.65]}
//   material={platformStone}
//   castShadow
//   receiveShadow
// />

//       {/* <mesh position={[0, -0.10, 0]}>
//         <cylinderGeometry args={[2.15, 2.28, 0.22, 96]} />
//         <primitive object={platformStone} attach="material" />
//       </mesh>

//       {/* Circular sanctuary platform */}
//       {/* <mesh position={[0, 0.08, 0]}>
//         <cylinderGeometry args={[2.0, 2.12, 0.22, 96]} />
//         <meshStandardMaterial
//           color="#34394a"
//           roughness={0.45}
//           metalness={0.28}
//         />
//       </mesh> */}

//       {/* Lower platform */}
// <mesh position={[0, -0.10, 0]}>
//   <cylinderGeometry args={[2.55, 2.70, 0.22, 96]} />
//   <primitive object={platformStone} attach="material" />
// </mesh>

// {/* Upper platform */}
// <mesh position={[0, 0.08, 0]}>
//   <cylinderGeometry args={[2.35, 2.48, 0.22, 96]} />
//   <meshStandardMaterial
//     color="#34394a"
//     roughness={0.45}
//     metalness={0.28}
//   />
// </mesh>

//       {/* <mesh position={[0, 0.198, 0]}>
//         <torusGeometry args={[1.78, 0.018, 8, 96]} />
//         <primitive object={goldTrim} attach="material" />
//       </mesh> */}

//       {/* Raised pedestal beneath the yoni */}
//       <mesh position={[0, 0.235, 0]} scale={[1.0, 1, 0.82]}>
//         <cylinderGeometry args={[0.93, 1.02, 0.20, 96]} />
//         <primitive object={darkStone} attach="material" />
//       </mesh>

//       <mesh position={[0, 0.345, 0]} scale={[1.0, 1, 0.84]}>
//         <cylinderGeometry args={[0.94, 0.94, 0.055, 96]} />
//         <primitive object={goldTrim} attach="material" />
//       </mesh>

//       {/* Traditional yoni basin and front spout */}
//       <mesh
//         geometry={basinGeometry}
//         position={[0, 0.37, 0.0]}
//         scale={[1.0, 1.0, 1.0]}
//         material={darkStone}
//         castShadow
//         receiveShadow
//       />

//       {/* Visible pool inside the basin */}
//       <mesh
//         position={[0, 0.475, -0.015]}
//         rotation={[-Math.PI / 2, 0, 0]}
//       >
//         <circleGeometry args={[0.78, 96]} />
//         <primitive object={basinWater} attach="material" />
//       </mesh>

//       {/* Downloaded GLB Shivling model */}
//       <ShivlingModel />

//       {/* Fine metallic highlight around the basin rim */}
//       <mesh
//         position={[0, 0.49, -0.01]}
//         rotation={[-Math.PI / 2, 0, 0]}
//       >
//         <torusGeometry args={[0.69, 0.012, 8, 96]} />
//         <primitive object={goldTrim} attach="material" />
//       </mesh>

//       {/* Continuous animated water flowing over the stone */}
//       {/* <WaterSheet points={mainWaterPoints} width={0.38} />
// <WaterSheet points={leftWaterPoints} width={0.12} offset={1.7} />
// <WaterSheet points={rightWaterPoints} width={0.12} offset={3.1} /> */}
//       {/* <WaterSheet points={mainWaterPoints} width={0.72} />
// <WaterSheet points={leftWaterPoints} width={0.24} offset={1.7} />
// <WaterSheet points={rightWaterPoints} width={0.24} offset={3.1} /> */}

// {/* Continuous water flowing around the full Shivling */}
// <AbhishekWater />

// {/* Falling droplets around the lingam */}
// {/* <Droplets /> */}

// {/* Ripples where the water meets the basin */}
// {/* <WaterRipples /> */}

// {/* {extraWaterPaths.map((points, i) => (
//   <WaterSheet
//     key={i}
//     points={points}
//     width={0.11}
//     offset={i * 0.8 + 0.5}
//   />
// ))}

//       <Droplets />
//       <WaterRipples /> */}

//       {/* Floating flowers on the basin water */}
//       {/* <FloatingFlower position={[-0.43, 0.49, 0.10]} rotation={0.3} />
//       <FloatingFlower position={[0.43, 0.49, 0.08]} rotation={1.2} />
//       <FloatingFlower position={[0.10, 0.49, -0.42]} rotation={2.1} /> */}
//       <FloatingFlower position={[-0.48, 0.51, 0.10]} rotation={0.3} />
// <FloatingFlower position={[0.48, 0.51, 0.10]} rotation={1.2} />
// <FloatingFlower position={[0.00, 0.51, -0.34]} rotation={2.1} />

//       {/* Restrained cool and warm lighting reveals the stone shape */}
//       <pointLight
//         position={[-1.1, 1.8, 2.1]}
//         color="#72caff"
//         intensity={1.5}
//         distance={5}
//         decay={2}
//       />

//       <pointLight
//         position={[1.1, 1.4, -0.8]}
//         color="#f0d09a"
//         intensity={0.8}
//         distance={4}
//         decay={2}
//       />

//       <pointLight
//         position={[0, 0.8, 1.5]}
//         color="#36a9ff"
//         intensity={0.65}
//         distance={3}
//         decay={2}
//       />
//     </group>
//   );
// }


// import { useEffect, useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';
// import { useGLTF } from '@react-three/drei';

// /**
//  * THE COSMIC FORGE — Central Sanctuary
//  * Procedural Three.js geometry only.
//  * Keeps the existing Scene.tsx interface unchanged.
//  */

// function createRockGeometry() {
//   const geometry = new THREE.IcosahedronGeometry(1, 4);
//   const positions = geometry.attributes.position;

//   for (let i = 0; i < positions.count; i++) {
//     const x = positions.getX(i);
//     const y = positions.getY(i);
//     const z = positions.getZ(i);

//     const noise =
//       1 +
//       0.045 * Math.sin(x * 17 + z * 11) * Math.cos(y * 13 - x * 5) +
//       0.022 * Math.sin(z * 27 + y * 19);

//     positions.setXYZ(i, x * noise, y * noise, z * noise);
//   }

//   geometry.computeVertexNormals();
//   return geometry;
// }

// /** A rounded, traditional dome-topped lingam. */
// // function createLingamGeometry() {
// //   const profile = [
// //     new THREE.Vector2(0.00, 0.000),
// //     new THREE.Vector2(0.27, 0.000),
// //     new THREE.Vector2(0.355, 0.035),
// //     new THREE.Vector2(0.385, 0.105),
// //     new THREE.Vector2(0.385, 0.390),
// //     new THREE.Vector2(0.365, 0.565),
// //     new THREE.Vector2(0.320, 0.735),
// //     new THREE.Vector2(0.245, 0.895),
// //     new THREE.Vector2(0.155, 1.015),
// //     new THREE.Vector2(0.070, 1.075),
// //     new THREE.Vector2(0.000, 1.090),
// //   ];

// //   const geometry = new THREE.LatheGeometry(profile, 96);
// //   geometry.computeVertexNormals();
// //   return geometry;
// // }
// /** Larger, smooth, traditional black-stone Shivling. */
// function createLingamGeometry() {
//   const profile = [
//     new THREE.Vector2(0.00, 0.000),
//     new THREE.Vector2(0.34, 0.000),
//     new THREE.Vector2(0.44, 0.045),
//     new THREE.Vector2(0.47, 0.13),
//     new THREE.Vector2(0.47, 0.48),
//     new THREE.Vector2(0.44, 0.70),
//     new THREE.Vector2(0.38, 0.91),
//     new THREE.Vector2(0.29, 1.10),
//     new THREE.Vector2(0.18, 1.25),
//     new THREE.Vector2(0.08, 1.32),
//     new THREE.Vector2(0.00, 1.34),
//   ];

//   const geometry = new THREE.LatheGeometry(profile, 128);
//   geometry.computeVertexNormals();
//   return geometry;
// }

// /** Elliptical yoni basin with a subtle forward-projecting spout. */
// function createBasinGeometry() {
//   const shape = new THREE.Shape();

//   shape.moveTo(-0.78, -0.36);
//   shape.bezierCurveTo(-1.02, -0.12, -0.98, 0.31, -0.70, 0.43);
//   shape.bezierCurveTo(-0.35, 0.57, 0.35, 0.57, 0.70, 0.43);
//   shape.bezierCurveTo(0.98, 0.31, 1.02, -0.12, 0.78, -0.36);
//   shape.bezierCurveTo(0.45, -0.55, -0.45, -0.55, -0.78, -0.36);

//   // Extend the front into a traditional yoni spout.
//   shape.lineTo(-0.38, -0.57);
//   shape.lineTo(-0.20, -0.94);
//   shape.quadraticCurveTo(0, -1.06, 0.20, -0.94);
//   shape.lineTo(0.38, -0.57);
//   shape.closePath();

//   const geometry = new THREE.ExtrudeGeometry(shape, {
//     depth: 0.105,
//     bevelEnabled: true,
//     bevelSegments: 3,
//     steps: 1,
//     bevelSize: 0.035,
//     bevelThickness: 0.035,
//     curveSegments: 16,
//   });

//   geometry.rotateX(-Math.PI / 2);
//   geometry.computeVertexNormals();
//   return geometry;
// }

// /** Animated water shader for the falling water sheet. */
// function createWaterMaterial() {
//   return new THREE.ShaderMaterial({
//     transparent: true,
//     depthWrite: false,
//     side: THREE.DoubleSide,
//     uniforms: {
//       uTime: { value: 0 },
//     },
//     vertexShader: `
//       varying vec2 vUv;

//       void main() {
//         vUv = uv;
//         gl_Position = projectionMatrix *
//           modelViewMatrix * vec4(position, 1.0);
//       }
//     `,
//     fragmentShader: `
//       uniform float uTime;
//       varying vec2 vUv;

//       void main() {
//         float flowA = sin(vUv.y * 46.0 - uTime * 4.2
//           + sin(vUv.x * 12.0 + uTime * 1.4) * 1.1);

//         float flowB = sin(vUv.y * 89.0 - uTime * 6.0
//           + vUv.x * 8.0);

//         float edge = smoothstep(0.0, 0.16, vUv.x)
//           * (1.0 - smoothstep(0.84, 1.0, vUv.x));

//         float streaks = smoothstep(0.25, 0.94, flowA * 0.5 + 0.5);
//         streaks = max(streaks, smoothstep(0.76, 0.99, flowB) * 0.55);

//         vec3 deepBlue = vec3(0.035, 0.30, 0.55);
// vec3 iceBlue = vec3(0.42, 0.84, 1.0);
// vec3 white = vec3(0.96, 0.99, 1.0);

//         vec3 color = mix(deepBlue, iceBlue, streaks * 0.78);
//         color = mix(color, white, streaks * 0.42);

//         float alpha = (0.62 + streaks * 0.36) * edge;

//         gl_FragColor = vec4(color, alpha);
//       }
//     `,
//   });
// }

// /** Build a curved ribbon instead of a thin central tube. */
// function createWaterRibbon(
//   points: THREE.Vector3[],
//   width: number,
// ) {
//   const curve = new THREE.CatmullRomCurve3(points);
//   const segments = 96;
//   const verticesAcross = 8;
//   const positions: number[] = [];
//   const uvs: number[] = [];
//   const indices: number[] = [];

//   for (let i = 0; i <= segments; i++) {
//     const t = i / segments;
//     const point = curve.getPoint(t);
//     const tangent = curve.getTangent(t).normalize();

//     // Keep the sheet wide across the front of the stone.
//     const across = new THREE.Vector3(1, 0, 0);
//     across.addScaledVector(tangent, -across.dot(tangent)).normalize();

//     const taper = Math.min(
//       1,
//       0.35 + t * 2.8,
//       0.35 + (1 - t) * 2.5,
//     );

//     for (let j = 0; j <= verticesAcross; j++) {
//       const u = j / verticesAcross;
//       const offset = (u - 0.5) * width * taper;
//       const p = point.clone().addScaledVector(across, offset);

//       positions.push(p.x, p.y, p.z);
//       uvs.push(u, t);
//     }
//   }

//   for (let i = 0; i < segments; i++) {
//     for (let j = 0; j < verticesAcross; j++) {
//       const a = i * (verticesAcross + 1) + j;
//       const b = a + verticesAcross + 1;

//       indices.push(a, b, a + 1);
//       indices.push(b, b + 1, a + 1);
//     }
//   }

//   const geometry = new THREE.BufferGeometry();
//   geometry.setAttribute(
//     'position',
//     new THREE.Float32BufferAttribute(positions, 3),
//   );
//   geometry.setAttribute(
//     'uv',
//     new THREE.Float32BufferAttribute(uvs, 2),
//   );
//   geometry.setIndex(indices);
//   geometry.computeVertexNormals();

//   return geometry;
// }

// function WaterSheet({
//   points,
//   width,
//   offset = 0,
// }: {
//   points: THREE.Vector3[];
//   width: number;
//   offset?: number;
// }) {
//   const meshRef = useRef<THREE.Mesh>(null);

//   const geometry = useMemo(
//     () => createWaterRibbon(points, width),
//     [points, width],
//   );

//   const material = useMemo(createWaterMaterial, []);

//   useFrame((state) => {
//     material.uniforms.uTime.value = state.clock.elapsedTime + offset;

//     if (meshRef.current) {
//       meshRef.current.visible = true;
//     }
//   });

//   useEffect(() => {
//     return () => {
//       geometry.dispose();
//       material.dispose();
//     };
//   }, [geometry, material]);

//   return (
//     <mesh
//       ref={meshRef}
//       geometry={geometry}
//       material={material}
//       renderOrder={5}
//       frustumCulled={false}
//     />
//   );
// }

// /** Fine droplets travel down toward the basin. */
// // function Droplets() {
// //   const groupRef = useRef<THREE.Group>(null);

// //   const drops = useMemo(
// //     () =>
// //       Array.from({ length: 24 }, (_, i) => ({
// //         x: Math.sin(i * 12.73) * (0.22 + (i % 4) * 0.045),
// //         z: Math.cos(i * 8.31) * 0.28 + 0.12,
// //         speed: 0.55 + (i % 6) * 0.13,
// //         phase: (i * 0.173) % 1,
// //         size: 0.010 + (i % 3) * 0.004,
// //       })),
// //     [],
// //   );

// //   useFrame((state) => {
// //     if (!groupRef.current) return;

// //     const time = state.clock.elapsedTime;

// //     groupRef.current.children.forEach((drop, i) => {
// //       const data = drops[i];
// //       const progress = (time * data.speed + data.phase) % 1;

// //       drop.position.set(
// //   data.x,
// //   4.85 - progress * 2.0,
// //   data.z + progress * 0.12,
// // );

// //       const scale = 0.65 + Math.sin(progress * Math.PI) * 0.55;
// //       drop.scale.set(data.size * scale, data.size * scale * 1.8, data.size * scale);
// //     });
// //   });

// //   return (
// //     <group ref={groupRef}>
// //       {drops.map((drop, i) => (
// //         <mesh key={i} position={[drop.x, 1.3, drop.z]}>
// //           <sphereGeometry args={[1, 8, 8]} />
// //           <meshBasicMaterial
// //             color="#bcefff"
// //             transparent
// //             opacity={0.92}
// //           />
// //         </mesh>
// //       ))}
// //     </group>
// //   );
// // }

// function Droplets() {
//   const groupRef = useRef<THREE.Group>(null);

//   const drops = useMemo(
//     () =>
//       Array.from({ length: 110 }, (_, i) => ({
//         angle: i * 2.399963,
//         phase: (i * 0.6180339) % 1,
//         speed: 0.42 + (i % 9) * 0.055,
//         size: 0.007 + (i % 4) * 0.003,
//       })),
//     [],
//   );

//   useFrame((state) => {
//     if (!groupRef.current) return;

//     const time = state.clock.elapsedTime;

//     groupRef.current.children.forEach((drop, i) => {
//       const d = drops[i];
//       const progress = (time * d.speed + d.phase) % 1;

//       // Start just above the crown and fall past the sides.
//       const y = 4.72 - progress * 2.08;

//       // The drops follow the approximate curved outline.
//       let radius: number;

//       if (y > 4.25) {
//         radius = THREE.MathUtils.lerp(
//           0.08,
//           0.34,
//           (4.72 - y) / 0.47,
//         );
//       } else {
//         radius = THREE.MathUtils.lerp(
//           0.35,
//           0.43,
//           THREE.MathUtils.clamp((4.25 - y) / 1.53, 0, 1),
//         );
//       }

//       // Slight sideways drift makes the water feel less mechanical.
//       const angle = d.angle + Math.sin(time * 1.8 + i) * 0.035;

//       drop.position.set(
//         Math.sin(angle) * radius,
//         y,
//         Math.cos(angle) * radius,
//       );

//       const pulse = 0.8 + Math.sin(progress * Math.PI) * 0.5;

//       drop.scale.set(
//         d.size * pulse,
//         d.size * pulse * 2.6,
//         d.size * pulse,
//       );
//     });
//   });

//   return (
//     <group ref={groupRef} position={[0, 0.46, 0.12]}>
//       {drops.map((d, i) => (
//         <mesh key={i}>
//           <sphereGeometry args={[1, 8, 8]} />
//           <meshPhysicalMaterial
//             color="#b9edff"
//             roughness={0.08}
//             metalness={0.0}
//             transparent
//             opacity={0.82}
//             clearcoat={1}
//           />
//         </mesh>
//       ))}
//     </group>
//   );
// }


// /** Expanding rings give the water surface continuous movement. */
// function WaterRipples() {
//   const rings = useRef<(THREE.Mesh | null)[]>([]);

//   useFrame((state) => {
//     const time = state.clock.elapsedTime;

//     rings.current.forEach((ring, i) => {
//       if (!ring) return;

//       const phase = (time * 0.38 + i / 3) % 1;
//       const radius = 0.12 + phase * 0.40;

//       ring.scale.set(radius, radius, radius);
//       ring.position.y = 0.485 + i * 0.001;
//       ring.position.z = 0.12;

//       const material = ring.material as THREE.MeshBasicMaterial;
//       material.opacity = (1 - phase) * 0.48;
//     });
//   });

//   return (
//     <group>
//       {[0, 1, 2].map((i) => (
//         <mesh
//           key={i}
//           ref={(node) => {
//             rings.current[i] = node;
//           }}
//           rotation={[-Math.PI / 2, 0, 0]}
//           position={[0, 0.485, 0.12]}
//         >
//           <torusGeometry args={[1, 0.012, 6, 64]} />
//           <meshBasicMaterial
//             color="#7edcff"
//             transparent
//             opacity={0.4}
//             depthWrite={false}
//           />
//         </mesh>
//       ))}
//     </group>
//   );
// }

// function FloatingFlower({
//   position,
//   rotation = 0,
// }: {
//   position: [number, number, number];
//   rotation?: number;
// }) {
//   const flowerRef = useRef<THREE.Group>(null);

//   useFrame((state) => {
//     if (!flowerRef.current) return;

//     const t = state.clock.elapsedTime + rotation;
//     flowerRef.current.position.y =
//       position[1] + Math.sin(t * 1.4) * 0.012;

//     flowerRef.current.rotation.z = Math.sin(t * 0.7) * 0.04;
//   });

//   return (
//     <group
//       ref={flowerRef}
//       position={position}
//       rotation={[0, rotation, 0]}
//     >
//       {Array.from({ length: 6 }, (_, i) => {
//         const angle = (i / 6) * Math.PI * 2;

//         return (
//           <mesh
//             key={i}
//             position={[
//               Math.cos(angle) * 0.075,
//               0,
//               Math.sin(angle) * 0.075,
//             ]}
//             rotation={[0, -angle, 0]}
//             scale={[0.075, 0.018, 0.038]}
//           >
//             <sphereGeometry args={[1, 12, 8]} />
//             <meshStandardMaterial
//               color="#f6a0c7"
//               emissive="#52132e"
//               emissiveIntensity={0.22}
//               roughness={0.38}
//             />
//           </mesh>
//         );
//       })}

//       <mesh position={[0, 0.008, 0]}>
//         <sphereGeometry args={[0.028, 12, 8]} />
//         <meshStandardMaterial
//           color="#ffd45e"
//           roughness={0.5}
//         />
//       </mesh>
//     </group>
//   );
// }

// function ShivlingModel() {
//   const { scene } = useGLTF('/models/shivling.glb');

//   const model = useMemo(() => {
//     const clone = scene.clone(true);

//     // Measure the downloaded model.
//     const bounds = new THREE.Box3().setFromObject(clone);
//     const size = bounds.getSize(new THREE.Vector3());
//     const center = bounds.getCenter(new THREE.Vector3());

//     // Normalize it to a predictable height.
//     const targetHeight = 4.5;
//     const scale = targetHeight / Math.max(size.y, 0.001);

//     clone.scale.setScalar(scale);
//     clone.position.set(
//       -center.x * scale,
//       -bounds.min.y * scale,
//       -center.z * scale,
//     );

//     return clone;
//   }, [scene]);

//   return (
//     <primitive
//       object={model}
//       position={[0, 0.46, 0.12]}
//       // scale={1.35}
//       // castShadow
//       // receiveShadow
//     />
//   );
// }

// useGLTF.preload('/models/shivling.glb');

// // /** Water flows around the full circumference of the rotating Shivling. */
// // function AbhishekWater() {
// //   const meshRef = useRef<THREE.Mesh>(null);

// //   const geometry = useMemo(() => {
// //     const segments = 192;
// //     const rings = 100;

// //     // Local coordinates assume the GLB is normalized to height 4.5.
// //     const topY = 4.49;
// //     const bottomY = 2.72;

// //     const positions: number[] = [];
// //     const uvs: number[] = [];
// //     const indices: number[] = [];

// //     // Approximate the rounded crown and cylindrical body.
// //     const radiusAt = (t: number) => {
// //       if (t < 0.12) {
// //         const crown = t / 0.12;
// //         return 0.055 + 0.31 * Math.sin(crown * Math.PI * 0.5);
// //       }

// //       if (t < 0.88) {
// //         return 0.37 + 0.025 * Math.sin(t * Math.PI * 3.0);
// //       }

// //       return 0.395 - (t - 0.88) * 0.12;
// //     };

// //     for (let j = 0; j <= rings; j++) {
// //       const v = j / rings;
// //       const y = THREE.MathUtils.lerp(topY, bottomY, v);
// //       const radius = radiusAt(v);

// //       for (let i = 0; i <= segments; i++) {
// //         const u = i / segments;
// //         const angle = u * Math.PI * 2;

// //         // A tiny offset keeps the water just above the stone.
// //         const r = radius + 0.018;

// //         positions.push(
// //           Math.sin(angle) * r,
// //           y,
// //           Math.cos(angle) * r,
// //         );

// //         uvs.push(u, v);
// //       }
// //     }

// //     for (let j = 0; j < rings; j++) {
// //       for (let i = 0; i < segments; i++) {
// //         const a = j * (segments + 1) + i;
// //         const b = a + segments + 1;

// //         indices.push(a, b, a + 1);
// //         indices.push(b, b + 1, a + 1);
// //       }
// //     }

// //     const geo = new THREE.BufferGeometry();

// //     geo.setAttribute(
// //       'position',
// //       new THREE.Float32BufferAttribute(positions, 3),
// //     );
// //     geo.setAttribute(
// //       'uv',
// //       new THREE.Float32BufferAttribute(uvs, 2),
// //     );
// //     geo.setIndex(indices);
// //     geo.computeVertexNormals();

// //     return geo;
// //   }, []);

// //   const material = useMemo(
// //     () =>
// //       new THREE.ShaderMaterial({
// //         transparent: true,
// //         depthWrite: false,
// //         side: THREE.DoubleSide,
// //         uniforms: {
// //           uTime: { value: 0 },
// //         },
// //         vertexShader: `
// //           varying vec2 vUv;

// //           void main() {
// //             vUv = uv;
// //             gl_Position = projectionMatrix *
// //               modelViewMatrix * vec4(position, 1.0);
// //           }
// //         `,
// //         fragmentShader: `
// //           uniform float uTime;
// //           varying vec2 vUv;

// //           void main() {
// //             float flow = vUv.y * 24.0 - uTime * 3.8
// //               + sin(vUv.x * 32.0 + uTime * 1.5) * 0.65;

// //             float streak = smoothstep(
// //               0.35, 0.95, sin(flow) * 0.5 + 0.5
// //             );

// //             float fineStreak = smoothstep(
// //               0.72, 0.98,
// //               sin(vUv.y * 85.0 - uTime * 6.0 + vUv.x * 50.0)
// //                 * 0.5 + 0.5
// //             );

// //             float variation = 0.35 + streak * 0.42 + fineStreak * 0.23;

// //             vec3 waterColor = mix(
// //               vec3(0.08, 0.42, 0.70),
// //               vec3(0.78, 0.96, 1.0),
// //               variation
// //             );

// //             float edgeFade = smoothstep(0.0, 0.08, vUv.y)
// //               * (1.0 - smoothstep(0.90, 1.0, vUv.y));

// //             float alpha = (0.24 + streak * 0.44 + fineStreak * 0.22)
// //               * edgeFade;

// //             gl_FragColor = vec4(waterColor, alpha);
// //           }
// //         `,
// //       }),
// //     [],
// //   );

// //   useFrame((state) => {
// //     material.uniforms.uTime.value = state.clock.elapsedTime;
// //   });

// //   useEffect(() => {
// //     return () => {
// //       geometry.dispose();
// //       material.dispose();
// //     };
// //   }, [geometry, material]);

// //   return (
// //     <mesh
// //       ref={meshRef}
// //       geometry={geometry}
// //       material={material}
// //       position={[0, 0.46, 0.12]}
// //       renderOrder={5}
// //       frustumCulled={false}
// //     />
// //   );
// // }


// // function AbhishekWater() {
// //   const materialRef = useRef<THREE.ShaderMaterial>(null);

// //   const geometry = useMemo(() => {
// //     const segments = 256;
// //     const rings = 120;
// //     const positions: number[] = [];
// //     const uvs: number[] = [];
// //     const indices: number[] = [];

// //     // Coordinates match the normalized 4.5-unit Shivling model.
// //     // Adjust these radii if your downloaded model has a different shape.
// //     const profile = [
// //   { t: 0.00, y: 4.49, r: 0.055 },
// //   { t: 0.05, y: 4.43, r: 0.23 },
// //   { t: 0.12, y: 4.25, r: 0.37 },
// //   { t: 0.20, y: 4.00, r: 0.405 },
// //   { t: 0.48, y: 3.35, r: 0.41 },
// //   { t: 0.75, y: 2.75, r: 0.425 },
// //   { t: 1.00, y: 2.35, r: 0.44 },
// // ];

// //     const sampleProfile = (t: number) => {
// //       for (let k = 0; k < profile.length - 1; k++) {
// //         const a = profile[k];
// //         const b = profile[k + 1];

// //         if (t <= b.t) {
// //           const f = (t - a.t) / (b.t - a.t);
// //           const smooth = f * f * (3 - 2 * f);

// //           return {
// //             y: THREE.MathUtils.lerp(a.y, b.y, f),
// //             r: THREE.MathUtils.lerp(a.r, b.r, smooth),
// //           };
// //         }
// //       }

// //       return profile[profile.length - 1];
// //     };

// //     for (let j = 0; j <= rings; j++) {
// //       const t = j / rings;
// //       const p = sampleProfile(t);

// //       for (let i = 0; i <= segments; i++) {
// //         const u = i / segments;
// //         const angle = u * Math.PI * 2;

// //         // Small gap prevents the water surface from z-fighting with stone.
// //         const r = p.r + 0.25;

// //         positions.push(
// //           Math.sin(angle) * r,
// //           p.y,
// //           Math.cos(angle) * r,
// //         );

// //         uvs.push(u, t);
// //       }
// //     }

// //     for (let j = 0; j < rings; j++) {
// //       for (let i = 0; i < segments; i++) {
// //         const a = j * (segments + 1) + i;
// //         const b = a + segments + 1;

// //         indices.push(a, b, a + 1);
// //         indices.push(b, b + 1, a + 1);
// //       }
// //     }

// //     const geo = new THREE.BufferGeometry();

// //     geo.setAttribute(
// //       'position',
// //       new THREE.Float32BufferAttribute(positions, 3),
// //     );
// //     geo.setAttribute(
// //       'uv',
// //       new THREE.Float32BufferAttribute(uvs, 2),
// //     );
// //     geo.setIndex(indices);
// //     geo.computeVertexNormals();

// //     return geo;
// //   }, []);

// //   const material = useMemo(
// //     () =>
// //       new THREE.ShaderMaterial({
// //         transparent: true,
// //         depthWrite: false,
// //         side: THREE.DoubleSide,
// //         uniforms: {
// //           uTime: { value: 0 },
// //         },
// //         vertexShader: `
// //           varying vec2 vUv;

// //           void main() {
// //             vUv = uv;
// //             gl_Position = projectionMatrix *
// //               modelViewMatrix * vec4(position, 1.0);
// //           }
// //         `,
// //         fragmentShader: `
// //           uniform float uTime;
// //           varying vec2 vUv;

// //           void main() {
// //             float angle = vUv.x * 6.2831853;

// //             // Several narrow, irregular streams around the full surface.
// //             float bands = sin(
// //               angle * 25.0
// //               + sin(angle * 7.0) * 1.5
// //               + uTime * 0.55
// //             );

// //             float streams = smoothstep(0.25, 0.88, bands);

// //             float fine = sin(
// //               angle * 65.0
// //               + vUv.y * 12.0
// //               - uTime * 2.8
// //             );

// //             float shimmer = smoothstep(0.52, 0.96, fine);

// //             // Motion travels downward from the crown.
// //             float flow = sin(
// //               vUv.y * 70.0
// //               - uTime * 7.0
// //               + sin(angle * 9.0) * 1.2
// //             );

// //             float movingHighlights =
// //               smoothstep(0.45, 0.96, flow);

// //             vec3 darkWater = vec3(0.025, 0.19, 0.31);
// //             vec3 blueWater = vec3(0.16, 0.56, 0.78);
// //             vec3 brightWater = vec3(0.78, 0.96, 1.0);

// //             vec3 color = mix(
// //               darkWater,
// //               blueWater,
// //               0.30 + streams * 0.35
// //             );

// //             color = mix(
// //               color,
// //               brightWater,
// //               shimmer * 0.34 + movingHighlights * 0.32
// //             );

// //             // The water stays visible around the entire lingam.
// //             float alpha = 0.25
// //               + streams * 0.15
// //               + shimmer * 0.12
// //               + movingHighlights * 0.12;

// //             // Fade only near the top and bottom edges.
// //             alpha *= smoothstep(0.0, 0.035, vUv.y);
// //             alpha *= 1.0 - smoothstep(0.95, 1.0, vUv.y);

// //             gl_FragColor = vec4(color, alpha);
// //           }
// //         `,
// //       }),
// //     [],
// //   );

// //   useFrame((state) => {
// //     if (materialRef.current) {
// //       materialRef.current.uniforms.uTime.value =
// //         state.clock.elapsedTime;
// //     }
// //   });

// //   useEffect(() => {
// //     return () => {
// //       geometry.dispose();
// //       material.dispose();
// //     };
// //   }, [geometry, material]);

// //   return (
// //     <mesh
// //       geometry={geometry}
// //       position={[-0.48, 0.30, 0.10]}
// //       renderOrder={5}
// //       frustumCulled={false}
// //     >
// //       <primitive
// //         ref={materialRef}
// //         object={material}
// //         attach="material"
// //       />
// //     </mesh>
// //   );
// // }

// // function AbhishekWater() {
// //   const dropsRef = useRef<THREE.InstancedMesh>(null);
// //   const blanketMaterialRef = useRef<THREE.ShaderMaterial>(null);

// //   const dropCount = 360;
// //   const streamCount = 40;

// //   // Reuse the earlier blanket's height and radius profile.
// //   const topY = 4.49;
// //   const blanketBottomY = 2.35;
// //   const fallBottomY = 0.16;
// //   const segments = 192;
// //   const rings = 100;

// //   // Full 360-degree water blanket.
// //   const blanketGeometry = useMemo(() => {
// //     const positions: number[] = [];
// //     const uvs: number[] = [];
// //     const indices: number[] = [];

// //     const profile = [
// //       { t: 0.0, r: 0.055 },
// //       { t: 0.05, r: 0.23 },
// //       { t: 0.12, r: 0.37 },
// //       { t: 0.2, r: 0.405 },
// //       { t: 0.48, r: 0.41 },
// //       { t: 0.75, r: 0.425 },
// //       { t: 1.0, r: 0.44 },
// //     ];

// //     const radiusAt = (t: number) => {
// //       for (let k = 0; k < profile.length - 1; k++) {
// //         const a = profile[k];
// //         const b = profile[k + 1];

// //         if (t <= b.t) {
// //           const f = (t - a.t) / (b.t - a.t);
// //           const smooth = f * f * (3 - 2 * f);
// //           return THREE.MathUtils.lerp(a.r, b.r, smooth) + 0.25;
// //         }
// //       }

// //       return 0.69;
// //     };

// //     for (let j = 0; j <= rings; j++) {
// //       const v = j / rings;
// //       const y = THREE.MathUtils.lerp(topY, blanketBottomY, v);

// //       for (let i = 0; i <= segments; i++) {
// //         const u = i / segments;
// //         const angle = u * Math.PI * 2;

// //         // Small undulation breaks up the perfectly smooth cylinder.
// //         const ripple =
// //           Math.sin(angle * 17 + v * 24) * 0.012 +
// //           Math.sin(angle * 31 - v * 18) * 0.006;

// //         const r = radiusAt(v) + ripple;

// //         positions.push(
// //           Math.sin(angle) * r,
// //           y,
// //           Math.cos(angle) * r,
// //         );

// //         uvs.push(u, v);
// //       }
// //     }

// //     for (let j = 0; j < rings; j++) {
// //       for (let i = 0; i < segments; i++) {
// //         const a = j * (segments + 1) + i;
// //         const b = a + segments + 1;
// //         indices.push(a, b, a + 1, b, b + 1, a + 1);
// //       }
// //     }

// //     const geometry = new THREE.BufferGeometry();
// //     geometry.setAttribute(
// //       'position',
// //       new THREE.Float32BufferAttribute(positions, 3),
// //     );
// //     geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
// //     geometry.setIndex(indices);
// //     geometry.computeVertexNormals();

// //     return geometry;
// //   }, []);

// //   // Animated transparent water with fine, moving highlights.
// //   const blanketMaterial = useMemo(
// //     () =>
// //       new THREE.ShaderMaterial({
// //         transparent: true,
// //         depthWrite: false,
// //         side: THREE.DoubleSide,
// //         uniforms: {
// //           uTime: { value: 0 },
// //         },
// //         vertexShader: `
// //           varying vec2 vUv;

// //           void main() {
// //             vUv = uv;
// //             gl_Position = projectionMatrix * modelViewMatrix
// //               * vec4(position, 1.0);
// //           }
// //         `,
// //         fragmentShader: `
// //           uniform float uTime;
// //           varying vec2 vUv;

// //           void main() {
// //             float angle = vUv.x * 6.2831853;

// //             float broadFlow = sin(
// //               vUv.y * 42.0 - uTime * 5.0
// //               + sin(angle * 8.0 + uTime * 0.8) * 1.1
// //             );

// //             float fineFlow = sin(
// //               vUv.y * 115.0 - uTime * 8.0
// //               + sin(angle * 19.0 - uTime) * 1.8
// //             );

// //             float streaks = smoothstep(0.05, 0.88, broadFlow * 0.5 + 0.5);
// //             float fine = smoothstep(0.48, 0.96, fineFlow * 0.5 + 0.5);

// //             float brokenFlow = sin(
// //               angle * 38.0 + sin(vUv.y * 13.0 + uTime) * 2.0
// //             );

// //             float strands = smoothstep(0.40, 0.95, brokenFlow * 0.5 + 0.5);

// //             vec3 deepWater = vec3(0.025, 0.16, 0.27);
// //             vec3 blueWater = vec3(0.10, 0.43, 0.64);
// //             vec3 whiteWater = vec3(0.82, 0.96, 1.0);

// //             vec3 color = mix(deepWater, blueWater, 0.35 + streaks * 0.45);
// //             color = mix(color, whiteWater, fine * 0.55 + strands * 0.23);

// //             float alpha = 0.25 + streaks * 0.16 + fine * 0.28 + strands * 0.12;
// //             alpha *= smoothstep(0.0, 0.025, vUv.y);
// //             alpha *= 1.0 - smoothstep(0.97, 1.0, vUv.y);

// //             gl_FragColor = vec4(color, alpha);
// //           }
// //         `,
// //       }),
// //     [],
// //   );

// //   // Separate curved rivulets travel from the crown down to the basin.
// //   const streamGeometries = useMemo(() => {
// //     return Array.from({ length: streamCount }, (_, i) => {
// //       const angle = (i / streamCount) * Math.PI * 2;
// //       const wobble = Math.sin(i * 2.31) * 0.045;
// //       const points: THREE.Vector3[] = [];

// //       points.push(
// //         new THREE.Vector3(
// //           Math.cos(angle) * 0.04,
// //           topY + 0.09,
// //           Math.sin(angle) * 0.04,
// //         ),
// //       );

// //       points.push(
// //         new THREE.Vector3(
// //           Math.cos(angle + 0.08) * 0.24,
// //           topY - 0.28,
// //           Math.sin(angle + 0.08) * 0.24,
// //         ),
// //       );

// //       points.push(
// //         new THREE.Vector3(
// //           Math.cos(angle + 0.12) * 0.52,
// //           topY - 0.72,
// //           Math.sin(angle + 0.12) * 0.52,
// //         ),
// //       );

// //       points.push(
// //         new THREE.Vector3(
// //           Math.cos(angle + 0.17) * (0.69 + wobble),
// //           2.45,
// //           Math.sin(angle + 0.17) * (0.69 + wobble),
// //         ),
// //       );

// //       points.push(
// //         new THREE.Vector3(
// //           Math.cos(angle + 0.2) * (0.72 + wobble),
// //           fallBottomY,
// //           Math.sin(angle + 0.2) * (0.72 + wobble),
// //         ),
// //       );

// //       const curve = new THREE.CatmullRomCurve3(points);

// //       return new THREE.TubeGeometry(
// //         curve,
// //         100,
// //         i % 5 === 0 ? 0.018 : 0.011,
// //         8,
// //         false,
// //       );
// //     });
// //   }, []);

// //   const streamMaterial = useMemo(
// //     () =>
// //       new THREE.MeshPhysicalMaterial({
// //         color: '#8de5ff',
// //         roughness: 0.055,
// //         metalness: 0.0,
// //         transparent: true,
// //         opacity: 0.68,
// //         clearcoat: 1,
// //         clearcoatRoughness: 0.025,
// //         depthWrite: false,
// //       }),
// //     [],
// //   );

// //   const dropGeometry = useMemo(
// //     () => new THREE.SphereGeometry(1, 10, 12),
// //     [],
// //   );

// //   const dropMaterial = useMemo(
// //     () =>
// //       new THREE.MeshPhysicalMaterial({
// //         color: '#d8f5ff',
// //         roughness: 0.025,
// //         metalness: 0,
// //         transparent: true,
// //         opacity: 0.94,
// //         clearcoat: 1,
// //         clearcoatRoughness: 0.015,
// //         depthWrite: false,
// //       }),
// //     [],
// //   );

// //   const dummy = useMemo(() => new THREE.Object3D(), []);

// //   const drops = useMemo(
// //     () =>
// //       Array.from({ length: dropCount }, (_, i) => ({
// //         angle: i * 2.399963,
// //         phase: (i * 0.6180339) % 1,
// //         speed: 0.75 + (i % 11) * 0.095,
// //         spread: 0.08 + ((i * 7) % 13) * 0.055,
// //         size: 0.008 + (i % 5) * 0.0035,
// //       })),
// //     [],
// //   );

// //   useFrame((state) => {
// //     const time = state.clock.elapsedTime;

// //     if (blanketMaterialRef.current) {
// //       blanketMaterialRef.current.uniforms.uTime.value = time;
// //     }

// //     const mesh = dropsRef.current;
// //     if (!mesh) return;

// //     for (let i = 0; i < drops.length; i++) {
// //       const d = drops[i];
// //       const progress = (time * d.speed + d.phase) % 1;

// //       // Drops start just above the crown and fall around the full circumference.
// //       const y = topY + 0.13 - progress * (topY - fallBottomY + 0.13);

// //       const radius =
// //         0.045 +
// //         progress * d.spread +
// //         Math.sin(progress * Math.PI) * 0.035;

// //       const angle = d.angle + Math.sin(time * 1.6 + i) * 0.025;

// //       dummy.position.set(
// //         Math.cos(angle) * radius,
// //         y,
// //         Math.sin(angle) * radius,
// //       );

// //       // Teardrop-like ellipsoids with slight size variation.
// //       const pulse = 0.82 + Math.sin(time * 4.5 + i) * 0.18;
// //       dummy.scale.set(
// //         d.size * pulse,
// //         d.size * (2.2 + d.speed) * pulse,
// //         d.size * pulse,
// //       );

// //       dummy.rotation.set(
// //         0.12 * Math.sin(time + i),
// //         angle,
// //         0.1 * Math.cos(time * 0.8 + i),
// //       );

// //       dummy.updateMatrix();
// //       mesh.setMatrixAt(i, dummy.matrix);
// //     }

// //     mesh.instanceMatrix.needsUpdate = true;
// //   });

// //   useEffect(() => {
// //     return () => {
// //       blanketGeometry.dispose();
// //       blanketMaterial.dispose();
// //       streamGeometries.forEach((geometry) => geometry.dispose());
// //       streamMaterial.dispose();
// //       dropGeometry.dispose();
// //       dropMaterial.dispose();
// //     };
// //   }, [
// //     blanketGeometry,
// //     blanketMaterial,
// //     streamGeometries,
// //     streamMaterial,
// //     dropGeometry,
// //     dropMaterial,
// //   ]);

// //   return (
// //     // Keep your final manually chosen position.
// //     <group position={[-0.48, 0.30, 0.10]}>
// //       <mesh
// //         geometry={blanketGeometry}
// //         renderOrder={5}
// //         frustumCulled={false}
// //       >
// //         <primitive
// //           object={blanketMaterial}
// //           attach="material"
// //           ref={blanketMaterialRef}
// //         />
// //       </mesh>

// //       {streamGeometries.map((geometry, i) => (
// //         <mesh
// //           key={i}
// //           geometry={geometry}
// //           material={streamMaterial}
// //           renderOrder={6}
// //           frustumCulled={false}
// //         />
// //       ))}

// //       <instancedMesh
// //         ref={dropsRef}
// //         args={[dropGeometry, dropMaterial, dropCount]}
// //         renderOrder={7}
// //         frustumCulled={false}
// //       />
// //     </group>
// //   );
// // }

// // Align the water curtain to the same local origin as the GLB Shivling.
// // ShivlingModel is placed at [0, 0.46, 0.12], so the water uses that exact anchor.
// const WATER_POSITION: [number, number, number] = [0, 0.46, 0.12];

// // The top sits slightly above the crown; the bottom reaches the yoni basin.
// // const WATER_HEIGHT = 4.72;
// // const WATER_TOP_RADIUS = 0.58;
// // const WATER_BOTTOM_RADIUS = 0.76;
// // const DROPLET_COUNT = 360;
// const WATER_HEIGHT = 2.35;
// const WATER_TOP_RADIUS = 0.40;
// const WATER_BOTTOM_RADIUS = 0.72;
// const DROPLET_COUNT = 360;

// /**
//  * Creates a smooth, open-ended 360-degree water curtain.
//  * UV coordinates animate vertically flowing highlights.
//  */
// function createAbhishekMaterial() {
//   return new THREE.ShaderMaterial({
//     transparent: true,
//     depthWrite: false,
//     side: THREE.DoubleSide,
//     uniforms: {
//       uTime: { value: 0 },
//     },
//     vertexShader: `
//       uniform float uTime;
//       varying vec2 vUv;
//       varying vec3 vWorldNormal;

//       void main() {
//         vUv = uv;

//         vec3 p = position;

//         // Subtle irregular movement in the falling water.
//         float wave1 = sin(uv.x * 42.0 + uTime * 1.5
//                           + uv.y * 8.0) * 0.009;
//         float wave2 = sin(uv.x * 79.0 - uTime * 2.1
//                           + uv.y * 17.0) * 0.004;

//         float envelope = smoothstep(0.0, 0.12, uv.y);
//         p.x += (wave1 + wave2) * envelope;

//         vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
//         gl_Position = projectionMatrix * mvPosition;

//         vWorldNormal = normalize(mat3(modelMatrix) * normal);
//       }
//     `,
//     fragmentShader: `
//       uniform float uTime;
//       varying vec2 vUv;
//       varying vec3 vWorldNormal;

//       void main() {
//         float angle = vUv.x * 6.2831853;
//         float fall = vUv.y;

//         // Multiple overlapping, non-uniform flowing patterns. The +uTime terms
//         // move highlights toward decreasing UV.y, so the flow reads downward.
//         float distortion =
//           sin(angle * 5.0 + uTime * 0.55) * 0.025
//           + sin(angle * 13.0 - uTime * 0.8) * 0.012;

//         float flow = fall + distortion;

//         float broadFlow = sin(
//           flow * 24.0 + uTime * 4.0
//           + sin(angle * 4.0 + uTime * 0.7) * 1.1
//         );

//         float fineFlow = sin(
//           flow * 68.0 + uTime * 6.8
//           + sin(angle * 9.0 - uTime) * 1.4
//         );

//         float glimmer = smoothstep(
//           0.40, 0.94, broadFlow * 0.5 + 0.5
//         );

//         float fineGlimmer = smoothstep(
//           0.78, 0.99, fineFlow * 0.5 + 0.5
//         );

//         // Break up uniform stripes to avoid the wire-cage look.
//         float breakup =
//           0.72 + 0.28 * sin(angle * 17.0 + fall * 31.0);

//         glimmer *= breakup;

//         vec3 deepWater = vec3(0.025, 0.20, 0.30);
//         vec3 blueWater = vec3(0.12, 0.48, 0.66);
//         vec3 brightReflection = vec3(0.82, 0.96, 1.0);

//         vec3 color = mix(deepWater, blueWater, 0.55);
//         color = mix(
//           color,
//           brightReflection,
//           clamp(glimmer * 0.58 + fineGlimmer * 0.25, 0.0, 0.8)
//         );

//         // Fresnel-like rim highlights.
//         float facing = abs(dot(
//           normalize(vWorldNormal),
//           vec3(0.0, 0.0, 1.0)
//         ));

//         float rim = pow(1.0 - facing, 2.0);

//         float alpha =
//           0.25
//           + glimmer * 0.30
//           + fineGlimmer * 0.15
//           + rim * 0.12;

//         // Fade the edges without cutting off the falling water.
//         alpha *= smoothstep(0.0, 0.035, fall);
//         alpha *= 1.0 - smoothstep(0.965, 1.0, fall);

//         gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.78));
//       }
//     `,
//   });
// }

// /**
//  * Animated droplets distributed around the entire Shivling.
//  * Every particle loops from above the crown down toward the basin.
//  */
// function AbhishekDroplets() {
//   const dropletsRef = useRef<THREE.InstancedMesh>(null);

//   const dummy = useMemo(() => new THREE.Object3D(), []);
//   const rng = (n: number) => {
//     const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
//     return x - Math.floor(x);
//   };

//   const particleData = useMemo(
//     () =>
//       Array.from({ length: DROPLET_COUNT }, (_, i) => ({
//         angle: rng(i + 1) * Math.PI * 2,
//         phase: rng(i + 101),
//         speed: 0.55 + rng(i + 201) * 0.85,
//         radius: 0.50 + rng(i + 301) * 0.27,
//         size: 0.009 + rng(i + 401) * 0.012,
//         drift: (rng(i + 501) - 0.5) * 0.075,
//       })),
//     [],
//   );

//   useEffect(() => {
//     const mesh = dropletsRef.current;
//     if (!mesh) return;

//     mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

//     for (let i = 0; i < DROPLET_COUNT; i++) {
//       dummy.position.set(0, -100, 0);
//       dummy.scale.setScalar(0);
//       dummy.updateMatrix();
//       mesh.setMatrixAt(i, dummy.matrix);
//     }

//     mesh.instanceMatrix.needsUpdate = true;
//   }, [dummy]);

//   useFrame((state) => {
//     const mesh = dropletsRef.current;
//     if (!mesh) return;

//     const time = state.clock.elapsedTime;

//     particleData.forEach((drop, i) => {
//       const progress =
//         (time * drop.speed * 0.36 + drop.phase) % 1;

//       // Start slightly above the lingam and fall toward the basin.
//       const y = WATER_HEIGHT + 0.12 - progress * (WATER_HEIGHT + 0.25);

//       const angle =
//         drop.angle
//         + Math.sin(time * 1.1 + drop.phase * 6.0) * 0.025;

//       // const radius = drop.radius + progress * 0.075;
//       const radius = 0.55 + progress * 0.32;
//       const x = Math.cos(angle) * radius + drop.drift * progress;
//       const z = Math.sin(angle) * radius;

//       // Stretch droplets vertically as they accelerate downward.
//       const size = drop.size * (0.8 + progress * 0.45);

//       // Coordinates are local to the Shivling anchor; no X compensation.
//       dummy.position.set(x, y, z);
//       dummy.scale.set(size * 0.8, size * 1.9, size * 0.8);
//       dummy.rotation.set(
//         0.10 * Math.sin(time + drop.phase),
//         angle,
//         0.08 * Math.cos(time * 1.3 + drop.phase),
//       );
//       dummy.updateMatrix();

//       mesh.setMatrixAt(i, dummy.matrix);
//     });

//     mesh.instanceMatrix.needsUpdate = true;
//   });

//   return (
//     <instancedMesh
//       ref={dropletsRef}
//       args={[undefined, undefined, DROPLET_COUNT]}
//       frustumCulled={false}
//       renderOrder={7}
//     >
//       <sphereGeometry args={[1, 8, 8]} />
//       <meshPhysicalMaterial
//         color="#a9eaff"
//         roughness={0.08}
//         metalness={0}
//         clearcoat={1}
//         clearcoatRoughness={0.03}
//         transparent
//         opacity={0.86}
//         depthWrite={false}
//         emissive="#123c52"
//         emissiveIntensity={0.15}
//       />
//     </instancedMesh>
//   );
// }

// /**
//  * Main 360-degree jal abhishek effect.
//  * Align the curtain directly with the GLB Shivling's position.
//  */
// // function AbhishekWater() {
// //   const waterRef = useRef<THREE.Mesh>(null);

// //   const waterGeometry = useMemo(() => {
// //     const geometry = new THREE.CylinderGeometry(
// //       WATER_TOP_RADIUS,
// //       WATER_BOTTOM_RADIUS,
// //       WATER_HEIGHT,
// //       128,
// //       96,
// //       true,
// //     );

// //     // Center the cylinder around its own axis. Its parent uses the exact
// //     // same [x, y, z] anchor as ShivlingModel, so it stays aligned while rotating.
// //     geometry.translate(0, WATER_HEIGHT / 2, 0);

// //     return geometry;
// //   }, []);

// //   const waterMaterial = useMemo(createAbhishekMaterial, []);

// //   useFrame((state) => {
// //     waterMaterial.uniforms.uTime.value = state.clock.elapsedTime;

// //     if (waterRef.current) {
// //       // Do not rotate the water independently: it must remain attached to
// //       // the Shivling as the complete sanctuary rotates.
// //     }
// //   });

// //   useEffect(() => {
// //     return () => {
// //       waterGeometry.dispose();
// //       waterMaterial.dispose();
// //     };
// //   }, [waterGeometry, waterMaterial]);

// //   return (
// //     // <group position={WATER_POSITION}>
// //     <group position={[-0.5, 2.35, 0.12]}>
// //       {/* Smooth flowing water curtain around all 360 degrees */}
// //       <mesh
// //         ref={waterRef}
// //         geometry={waterGeometry}
// //         material={waterMaterial}
// //         renderOrder={5}
// //         frustumCulled={false}
// //       />

// //       {/* Fine droplets falling around the whole water curtain */}
// //       <AbhishekDroplets />
// //     </group>
// //   );
// // }


// // function AbhishekWater() {
// //   const streamRef = useRef<THREE.Mesh>(null);
// //   const splashRef = useRef<THREE.Group>(null);

// //   const droplets = useMemo(
// //     () =>
// //       Array.from({ length: 22 }, (_, i) => ({
// //         angle: i * 2.399963,
// //         speed: 0.65 + (i % 5) * 0.12,
// //         phase: (i * 0.6180339) % 1,
// //         size: 0.012 + (i % 4) * 0.004,
// //       })),
// //     [],
// //   );

// //   useFrame((state) => {
// //     const time = state.clock.elapsedTime;

// //     // Subtle flowing highlights on the single vertical stream.
// //     if (streamRef.current) {
// //       const material = streamRef.current
// //         .material as THREE.MeshPhysicalMaterial;

// //       material.opacity = 0.72 + Math.sin(time * 5) * 0.08;
// //     }

// //     // Small droplets burst outward at the crown.
// //     if (splashRef.current) {
// //       splashRef.current.children.forEach((drop, i) => {
// //         const d = droplets[i];
// //         const progress = (time * d.speed + d.phase) % 1;
// //         const angle = d.angle + Math.sin(time * 2 + i) * 0.08;

// //         const radius = 0.035 + progress * 0.28;
// //         const height = 4.88 + Math.sin(progress * Math.PI) * 0.13
// //           - progress * 0.22;

// //         drop.position.set(
// //           Math.cos(angle) * radius,
// //           height,
// //           0.12 + Math.sin(angle) * radius,
// //         );

// //         const scale = d.size * (0.6 + Math.sin(progress * Math.PI) * 0.8);
// //         drop.scale.set(scale, scale * 1.6, scale);
// //       });
// //     }
// //   });

// //   return (
// //     <group>
// //       {/* One narrow, continuous stream falling from above */}
// //       <mesh
// //         ref={streamRef}
// //         position={[0, 5.40, 0.12]}
// //         renderOrder={8}
// //       >
// //         <cylinderGeometry args={[0.035, 0.055, 1.25, 16, 1]} />
// //         <meshPhysicalMaterial
// //           color="#c9f4ff"
// //           roughness={0.04}
// //           metalness={0}
// //           transparent
// //           opacity={0.76}
// //           clearcoat={1}
// //           clearcoatRoughness={0.02}
// //           depthWrite={false}
// //           emissive="#246b85"
// //           emissiveIntensity={0.12}
// //         />
// //       </mesh>

// //       {/* A restrained splash of droplets where the stream hits the crown */}
// //       <group ref={splashRef}>
// //         {droplets.map((d, i) => (
// //           <mesh key={i} scale={0}>
// //             <sphereGeometry args={[1, 10, 10]} />
// //             <meshPhysicalMaterial
// //               color="#d8f7ff"
// //               roughness={0.04}
// //               transparent
// //               opacity={0.88}
// //               clearcoat={1}
// //               depthWrite={false}
// //             />
// //           </mesh>
// //         ))}
// //       </group>
// //     </group>
// //   );
// // }




// function AbhishekWater() {
//   const streamRef = useRef<THREE.Mesh>(null);
//   const streaksRef = useRef<THREE.Group>(null);
//   const dropletsRef = useRef<THREE.Group>(null);
//   const splashRef = useRef<THREE.Group>(null);
//   const TAU = Math.PI * 2;
//   const STREAK_COUNT = 84;
//   const DROP_COUNT = 220;
//   const SPLASH_COUNT = 90;

//   // ShivlingModel is normalized to 4.5 units tall and placed at [0, 0.46, 0.12].
//   // This component is a sibling of the model inside CentralSanctuary's rotating group.
//   const MODEL_X = 0;
//   const MODEL_Z = 0.12;
//   const MODEL_BASE_Y = 0.46;
//   const CROWN_Y = MODEL_BASE_Y + 4.48;
//   const FLOW_BOTTOM_Y = MODEL_BASE_Y + 2.25;

//   const streakData = useMemo(
//     () => Array.from({ length: STREAK_COUNT }, (_, i) => ({
//       angle: (i / STREAK_COUNT) * TAU,
//       phase: (i * 0.6180339) % 1,
//       radius: 0.34 + ((i * 17) % 100) / 1700,
//       length: 0.24 + ((i * 13) % 100) / 180,
//       width: i % 7 === 0 ? 0.012 : 0.006 + (i % 3) * 0.0015,
//     })),
//     [],
//   );

//   const dropData = useMemo(
//     () => Array.from({ length: DROP_COUNT }, (_, i) => ({
//       angle: (i * 2.399963) % TAU,
//       phase: (i * 0.754877666) % 1,
//       speed: 0.45 + ((i * 11) % 17) * 0.035,
//       size: 0.006 + ((i * 7) % 7) * 0.0022,
//       spread: 0.04 + ((i * 19) % 100) / 520,
//     })),
//     [],
//   );

//   const splashData = useMemo(
//     () => Array.from({ length: SPLASH_COUNT }, (_, i) => ({
//       angle: (i * 2.399963) % TAU,
//       phase: (i * 0.6180339) % 1,
//       speed: 0.75 + (i % 7) * 0.09,
//       size: 0.008 + (i % 5) * 0.0025,
//       reach: 0.28 + ((i * 13) % 100) / 280,
//     })),
//     [],
//   );

//   const streamMaterial = useMemo(
//     () => new THREE.MeshPhysicalMaterial({
//       color: '#d9f7ff',
//       roughness: 0.025,
//       metalness: 0,
//       transparent: true,
//       opacity: 0.88,
//       clearcoat: 1,
//       clearcoatRoughness: 0.015,
//       depthWrite: false,
//       side: THREE.DoubleSide,
//       emissive: '#2a718c',
//       emissiveIntensity: 0.12,
//     }),
//     [],
//   );

//   const rivuletMaterial = useMemo(
//     () => new THREE.MeshPhysicalMaterial({
//       color: '#bcefff',
//       roughness: 0.035,
//       metalness: 0,
//       transparent: true,
//       opacity: 0.76,
//       clearcoat: 1,
//       clearcoatRoughness: 0.02,
//       depthWrite: false,
//       side: THREE.DoubleSide,
//       emissive: '#174d69',
//       emissiveIntensity: 0.08,
//     }),
//     [],
//   );

//   const dropMaterial = useMemo(
//     () => new THREE.MeshPhysicalMaterial({
//       color: '#d8f7ff',
//       roughness: 0.025,
//       metalness: 0,
//       transparent: true,
//       opacity: 0.94,
//       clearcoat: 1,
//       clearcoatRoughness: 0.01,
//       depthWrite: false,
//       emissive: '#235d78',
//       emissiveIntensity: 0.08,
//     }),
//     [],
//   );

//   useFrame((state) => {
//     const time = state.clock.elapsedTime;
//     streamMaterial.opacity = 0.82 + Math.sin(time * 8) * 0.045;
//     rivuletMaterial.opacity = 0.62 + (Math.sin(time * 4.3) + 1) * 0.08;

//     // A continuous, almost cylindrical stream; never a cone or tapered spike.
//     if (streamRef.current) {
//       streamRef.current.scale.x = 1 + Math.sin(time * 5.2) * 0.045;
//       streamRef.current.scale.z = 1 + Math.cos(time * 4.6) * 0.04;
//     }

//     // Narrow wet rivulets run down the curved stone in every direction.
//     if (streaksRef.current) {
//       streaksRef.current.children.forEach((streak, i) => {
//         const d = streakData[i];
//         const progress = (time * (0.34 + (i % 6) * 0.045) + d.phase) % 1;
//         const angle = d.angle + Math.sin(time * 1.25 + i * 0.7) * 0.018;
//         const y = CROWN_Y - 0.12 - progress * (CROWN_Y - FLOW_BOTTOM_Y - 0.12);
//         const crownT = THREE.MathUtils.clamp((CROWN_Y - y) / 0.62, 0, 1);
//         const radius = 0.08 + crownT * (d.radius - 0.08);
//         streak.position.set(
//           MODEL_X + Math.cos(angle) * radius,
//           y,
//           MODEL_Z + Math.sin(angle) * radius,
//         );
//         streak.rotation.set(0, -angle, 0);
//         streak.scale.y = d.length * (0.78 + 0.22 * Math.sin(time * 3 + i));
//       });
//     }

//     // Tiny droplets are spread around the full 360-degree circumference.
//     if (dropletsRef.current) {
//       dropletsRef.current.children.forEach((drop, i) => {
//         const d = dropData[i];
//         const progress = (time * d.speed + d.phase) % 1;
//         const angle = d.angle + Math.sin(time * 1.4 + i) * 0.035;
//         const radius = 0.18 + progress * d.spread;
//         const y = CROWN_Y - 0.04 - progress * (CROWN_Y - FLOW_BOTTOM_Y + 0.04);
//         const size = d.size * (0.78 + Math.sin(progress * Math.PI) * 0.7);
//         drop.position.set(
//           MODEL_X + Math.cos(angle) * radius,
//           y,
//           MODEL_Z + Math.sin(angle) * radius,
//         );
//         drop.scale.set(size, size * (1.8 + progress * 0.7), size);
//       });
//     }

//     // Crown impact spray bursts outward, then falls back down around the lingam.
//     if (splashRef.current) {
//       splashRef.current.children.forEach((drop, i) => {
//         const d = splashData[i];
//         const progress = (time * d.speed + d.phase) % 1;
//         const angle = d.angle + Math.sin(time * 2 + i) * 0.045;
//         const radius = 0.045 + progress * d.reach;
//         const y = CROWN_Y - 0.015 + Math.sin(progress * Math.PI) * 0.18 - progress * 0.30;
//         const size = d.size * (0.5 + Math.sin(progress * Math.PI) * 1.1);
//         drop.position.set(
//           MODEL_X + Math.cos(angle) * radius,
//           y,
//           MODEL_Z + Math.sin(angle) * radius,
//         );
//         drop.scale.set(size, size * (1.1 + progress), size);
//       });
//     }
//   });

//   useEffect(() => () => {
//     streamMaterial.dispose();
//     rivuletMaterial.dispose();
//     dropMaterial.dispose();
//   }, [streamMaterial, rivuletMaterial, dropMaterial]);

//   return (
//     <group>
//       {/* Water comes from above the frame and lands directly on the crown. */}
//       <mesh
//         ref={streamRef}
//         position={[MODEL_X, MODEL_BASE_Y + 5.18, MODEL_Z]}
//         material={streamMaterial}
//         renderOrder={8}
//         frustumCulled={false}
//       >
//         <cylinderGeometry args={[0.052, 0.058, 1.48, 48, 12, false]} />
//       </mesh>

//       {/* 84 slim, curved-looking wet streaks make the flow visible from every angle. */}
//       <group ref={streaksRef}>
//         {streakData.map((d, i) => (
//           <mesh key={`rivulet-${i}`} material={rivuletMaterial} renderOrder={9}>
//             <capsuleGeometry args={[d.width, d.length, 4, 8]} />
//           </mesh>
//         ))}
//       </group>

//       {/* Falling drops run down all sides rather than appearing only at the front. */}
//       <group ref={dropletsRef}>
//         {dropData.map((d, i) => (
//           <mesh key={`falling-drop-${i}`} material={dropMaterial} renderOrder={10}>
//             <sphereGeometry args={[1, 10, 10]} />
//           </mesh>
//         ))}
//       </group>

//       {/* Fine 360-degree crown splash, like water striking a hard rounded surface. */}
//       <group ref={splashRef}>
//         {splashData.map((d, i) => (
//           <mesh key={`crown-splash-${i}`} material={dropMaterial} renderOrder={11}>
//             <sphereGeometry args={[1, 10, 10]} />
//           </mesh>
//         ))}
//       </group>
//     </group>
//   );
// }



// export default function CentralSanctuary() {
//   const sanctuaryRef = useRef<THREE.Group>(null);

//   const rockGeometry = useMemo(createRockGeometry, []);
//   const lingamGeometry = useMemo(createLingamGeometry, []);
//   const basinGeometry = useMemo(createBasinGeometry, []);

//   const darkStone = useMemo(
//   () =>
//     new THREE.MeshPhysicalMaterial({
//       color: '#171b25',
//       roughness: 0.17,
//       metalness: 0.22,
//       clearcoat: 1,
//       clearcoatRoughness: 0.08,
//       emissive: '#080d19',
//       emissiveIntensity: 0.08,
//     }),
//   [],
// );

//   const platformStone = useMemo(
//     () =>
//       new THREE.MeshStandardMaterial({
//         color: '#34394a',
//         roughness: 0.63,
//         metalness: 0.20,
//       }),
//     [],
//   );

//   const goldTrim = useMemo(
//     () =>
//       new THREE.MeshStandardMaterial({
//         color: '#c6a36a',
//         metalness: 0.72,
//         roughness: 0.25,
//         emissive: '#503016',
//         emissiveIntensity: 0.22,
//       }),
//     [],
//   );

//   const basinWater = useMemo(
//     () =>
//       new THREE.MeshPhysicalMaterial({
//         color: '#1684b9',
//         roughness: 0.12,
//         metalness: 0.15,
//         transparent: true,
//         opacity: 0.86,
//         clearcoat: 1,
//         clearcoatRoughness: 0.06,
//         emissive: '#07365a',
//         emissiveIntensity: 0.24,
//       }),
//     [],
//   );

//   // const mainWaterPoints = useMemo(
//   //   () => [
//   //     new THREE.Vector3(0.015, 1.49, 0.035),
//   //     new THREE.Vector3(0.005, 1.40, 0.19),
//   //     new THREE.Vector3(-0.015, 1.25, 0.31),
//   //     new THREE.Vector3(0.015, 1.04, 0.365),
//   //     new THREE.Vector3(-0.01, 0.82, 0.40),
//   //     new THREE.Vector3(0.015, 0.61, 0.43),
//   //     new THREE.Vector3(0.0, 0.49, 0.47),
//   //   ],
//   //   [],
//   // );

//   // const leftWaterPoints = useMemo(
//   //   () => [
//   //     new THREE.Vector3(-0.20, 1.39, 0.17),
//   //     new THREE.Vector3(-0.24, 1.20, 0.28),
//   //     new THREE.Vector3(-0.25, 0.96, 0.35),
//   //     new THREE.Vector3(-0.23, 0.73, 0.40),
//   //     new THREE.Vector3(-0.27, 0.52, 0.47),
//   //   ],
//   //   [],
//   // );

//   // const rightWaterPoints = useMemo(
//   //   () => [
//   //     new THREE.Vector3(0.21, 1.39, 0.17),
//   //     new THREE.Vector3(0.24, 1.20, 0.28),
//   //     new THREE.Vector3(0.25, 0.96, 0.35),
//   //     new THREE.Vector3(0.23, 0.73, 0.40),
//   //     new THREE.Vector3(0.27, 0.52, 0.47),
//   //   ],
//   //   [],
//   // );
  
//   const mainWaterPoints = useMemo(
//   () => [
//     new THREE.Vector3(0.00, 4.35, 0.16),
//     new THREE.Vector3(0.00, 4.05, 0.34),
//     new THREE.Vector3(-0.01, 3.60, 0.47),
//     new THREE.Vector3(0.01, 3.10, 0.54),
//     new THREE.Vector3(-0.01, 2.40, 0.59),
//     new THREE.Vector3(0.00, 1.55, 0.64),
//     new THREE.Vector3(0.00, 1.00, 0.68),
//   ],
//   [],
// );

// const leftWaterPoints = useMemo(
//   () => [
//     new THREE.Vector3(-0.34, 4.05, 0.16),
//     new THREE.Vector3(-0.38, 3.70, 0.34),
//     new THREE.Vector3(-0.43, 3.20, 0.46),
//     new THREE.Vector3(-0.46, 2.60, 0.53),
//     new THREE.Vector3(-0.48, 1.75, 0.61),
//     new THREE.Vector3(-0.42, 1.00, 0.68),
//   ],
//   [],
// );

// const rightWaterPoints = useMemo(
//   () => [
//     new THREE.Vector3(0.34, 4.05, 0.16),
//     new THREE.Vector3(0.38, 3.70, 0.34),
//     new THREE.Vector3(0.43, 3.20, 0.46),
//     new THREE.Vector3(0.46, 2.60, 0.53),
//     new THREE.Vector3(0.48, 1.75, 0.61),
//     new THREE.Vector3(0.42, 1.00, 0.68),
//   ],
//   [],
// );

// const extraWaterPaths = useMemo(
//   () =>
//     [-0.24, -0.12, 0.12, 0.24].map(
//       (x) => [
//         new THREE.Vector3(x * 0.65, 4.00, 0.20),
//         new THREE.Vector3(x * 0.90, 3.65, 0.38),
//         new THREE.Vector3(x, 3.10, 0.49),
//         new THREE.Vector3(x * 1.05, 2.45, 0.57),
//         new THREE.Vector3(x * 0.90, 1.65, 0.64),
//         new THREE.Vector3(x, 1.00, 0.68),
//       ],
//     ),
//   [],
// );

//   useEffect(() => {
//     return () => {
//       rockGeometry.dispose();
//       lingamGeometry.dispose();
//       basinGeometry.dispose();
//       darkStone.dispose();
//       platformStone.dispose();
//       goldTrim.dispose();
//       basinWater.dispose();
//     };
//   }, [
//     rockGeometry,
//     lingamGeometry,
//     basinGeometry,
//     darkStone,
//     platformStone,
//     goldTrim,
//     basinWater,
//   ]);

//   useFrame((state, delta) => {
//   if (!sanctuaryRef.current) return;

//   // Lower the complete island and Shivling.
//   sanctuaryRef.current.position.y =
//     -2.50 + Math.sin(state.clock.elapsedTime * 0.42) * 0.025;

//   // Keep the same slow, continuous rotation.
//   sanctuaryRef.current.rotation.y += delta * 0.18;
// });

//   return (
//     <group ref={sanctuaryRef} position={[0, 0, 0]}>
//       {/* Floating rocky island */}
//       <mesh
//   geometry={rockGeometry}
//   position={[0, -0.55, 0]}
//   scale={[4.7, 1.35, 4.65]}
//   material={platformStone}
//   castShadow
//   receiveShadow
// />

//       {/* <mesh position={[0, -0.10, 0]}>
//         <cylinderGeometry args={[2.15, 2.28, 0.22, 96]} />
//         <primitive object={platformStone} attach="material" />
//       </mesh>

//       {/* Circular sanctuary platform */}
//       {/* <mesh position={[0, 0.08, 0]}>
//         <cylinderGeometry args={[2.0, 2.12, 0.22, 96]} />
//         <meshStandardMaterial
//           color="#34394a"
//           roughness={0.45}
//           metalness={0.28}
//         />
//       </mesh> */}

//       {/* Lower platform */}
// <mesh position={[0, -0.10, 0]}>
//   <cylinderGeometry args={[2.55, 2.70, 0.22, 96]} />
//   <primitive object={platformStone} attach="material" />
// </mesh>

// {/* Upper platform */}
// <mesh position={[0, 0.08, 0]}>
//   <cylinderGeometry args={[2.35, 2.48, 0.22, 96]} />
//   <meshStandardMaterial
//     color="#34394a"
//     roughness={0.45}
//     metalness={0.28}
//   />
// </mesh>

//       {/* <mesh position={[0, 0.198, 0]}>
//         <torusGeometry args={[1.78, 0.018, 8, 96]} />
//         <primitive object={goldTrim} attach="material" />
//       </mesh> */}

//       {/* Raised pedestal beneath the yoni */}
//       <mesh position={[0, 0.235, 0]} scale={[1.0, 1, 0.82]}>
//         <cylinderGeometry args={[0.93, 1.02, 0.20, 96]} />
//         <primitive object={darkStone} attach="material" />
//       </mesh>

//       <mesh position={[0, 0.345, 0]} scale={[1.0, 1, 0.84]}>
//         <cylinderGeometry args={[0.94, 0.94, 0.055, 96]} />
//         <primitive object={goldTrim} attach="material" />
//       </mesh>

//       {/* Traditional yoni basin and front spout */}
//       <mesh
//         geometry={basinGeometry}
//         position={[0, 0.37, 0.0]}
//         scale={[1.0, 1.0, 1.0]}
//         material={darkStone}
//         castShadow
//         receiveShadow
//       />

//       {/* Visible pool inside the basin */}
//       <mesh
//         position={[0, 0.475, -0.015]}
//         rotation={[-Math.PI / 2, 0, 0]}
//       >
//         <circleGeometry args={[0.78, 96]} />
//         <primitive object={basinWater} attach="material" />
//       </mesh>

//       {/* Downloaded GLB Shivling model */}
//       <ShivlingModel />

//       {/* Fine metallic highlight around the basin rim */}
//       <mesh
//         position={[0, 0.49, -0.01]}
//         rotation={[-Math.PI / 2, 0, 0]}
//       >
//         <torusGeometry args={[0.69, 0.012, 8, 96]} />
//         <primitive object={goldTrim} attach="material" />
//       </mesh>

//       {/* Continuous animated water flowing over the stone */}
//       {/* <WaterSheet points={mainWaterPoints} width={0.38} />
// <WaterSheet points={leftWaterPoints} width={0.12} offset={1.7} />
// <WaterSheet points={rightWaterPoints} width={0.12} offset={3.1} /> */}
//       {/* <WaterSheet points={mainWaterPoints} width={0.72} />
// <WaterSheet points={leftWaterPoints} width={0.24} offset={1.7} />
// <WaterSheet points={rightWaterPoints} width={0.24} offset={3.1} /> */}

// {/* Continuous water flowing around the full Shivling */}
// <AbhishekWater />

// {/* Falling droplets around the lingam */}
// {/* <Droplets /> */}

// {/* Ripples where the water meets the basin */}
// {/* <WaterRipples /> */}

// {/* {extraWaterPaths.map((points, i) => (
//   <WaterSheet
//     key={i}
//     points={points}
//     width={0.11}
//     offset={i * 0.8 + 0.5}
//   />
// ))}

//       <Droplets />
//       <WaterRipples /> */}

//       {/* Floating flowers on the basin water */}
//       {/* <FloatingFlower position={[-0.43, 0.49, 0.10]} rotation={0.3} />
//       <FloatingFlower position={[0.43, 0.49, 0.08]} rotation={1.2} />
//       <FloatingFlower position={[0.10, 0.49, -0.42]} rotation={2.1} /> */}
//       <FloatingFlower position={[-0.48, 0.51, 0.10]} rotation={0.3} />
// <FloatingFlower position={[0.48, 0.51, 0.10]} rotation={1.2} />
// <FloatingFlower position={[0.00, 0.51, -0.34]} rotation={2.1} />

//       {/* Restrained cool and warm lighting reveals the stone shape */}
//       <pointLight
//         position={[-1.1, 1.8, 2.1]}
//         color="#72caff"
//         intensity={1.5}
//         distance={5}
//         decay={2}
//       />

//       <pointLight
//         position={[1.1, 1.4, -0.8]}
//         color="#f0d09a"
//         intensity={0.8}
//         distance={4}
//         decay={2}
//       />

//       <pointLight
//         position={[0, 0.8, 1.5]}
//         color="#36a9ff"
//         intensity={0.65}
//         distance={3}
//         decay={2}
//       />
//     </group>
//   );
// }




// import { useEffect, useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import { useGLTF } from '@react-three/drei';
// import * as THREE from 'three';

// const TAU = Math.PI * 2;
// const MODEL_POSITION: [number, number, number] = [0, 0.46, 0.12];
// const CROWN_Y = 4.88;

// // ------------------------------------------------------------
// // Island and traditional stone basin
// // ------------------------------------------------------------

// function createRockGeometry() {
//   const geometry = new THREE.IcosahedronGeometry(1, 4);
//   const p = geometry.attributes.position;

//   for (let i = 0; i < p.count; i++) {
//     const x = p.getX(i);
//     const y = p.getY(i);
//     const z = p.getZ(i);
//     const n =
//       1 +
//       0.045 * Math.sin(x * 17 + z * 11) * Math.cos(y * 13 - x * 5) +
//       0.022 * Math.sin(z * 27 + y * 19);

//     p.setXYZ(i, x * n, y * n, z * n);
//   }

//   geometry.computeVertexNormals();
//   return geometry;
// }

// function createBasinGeometry() {
//   const shape = new THREE.Shape();

//   shape.moveTo(-0.78, -0.36);
//   shape.bezierCurveTo(-1.02, -0.12, -0.98, 0.31, -0.7, 0.43);
//   shape.bezierCurveTo(-0.35, 0.57, 0.35, 0.57, 0.7, 0.43);
//   shape.bezierCurveTo(0.98, 0.31, 1.02, -0.12, 0.78, -0.36);
//   shape.bezierCurveTo(0.45, -0.55, -0.45, -0.55, -0.78, -0.36);
//   shape.lineTo(-0.38, -0.57);
//   shape.lineTo(-0.2, -0.94);
//   shape.quadraticCurveTo(0, -1.06, 0.2, -0.94);
//   shape.lineTo(0.38, -0.57);
//   shape.closePath();

//   const geometry = new THREE.ExtrudeGeometry(shape, {
//     depth: 0.105,
//     bevelEnabled: true,
//     bevelSegments: 4,
//     bevelSize: 0.035,
//     bevelThickness: 0.035,
//     curveSegments: 24,
//   });

//   geometry.rotateX(-Math.PI / 2);
//   geometry.computeVertexNormals();
//   return geometry;
// }

// // ------------------------------------------------------------
// // Cinematic water materials
// // ------------------------------------------------------------

// function createStreamMaterial() {
//   return new THREE.ShaderMaterial({
//     transparent: true,
//     depthWrite: false,
//     side: THREE.DoubleSide,
//     uniforms: { uTime: { value: 0 } },
//     vertexShader: `
//       uniform float uTime;
//       varying vec2 vUv;

//       void main() {
//         vUv = uv;
//         vec3 p = position;

//         float wave =
//           sin(uv.y * 24.0 - uTime * 7.0) * 0.012 +
//           sin(uv.y * 47.0 - uTime * 10.0) * 0.006;

//         p.x += wave;
//         p.z += sin(uv.y * 31.0 - uTime * 8.0) * 0.009;

//         gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
//       }
//     `,
//     fragmentShader: `
//       uniform float uTime;
//       varying vec2 vUv;

//       void main() {
//         float flow1 = sin(vUv.y * 48.0 - uTime * 10.0
//                     + sin(vUv.x * 17.0) * 1.2);
//         float flow2 = sin(vUv.y * 93.0 - uTime * 14.0
//                     + sin(vUv.x * 31.0) * 0.8);

//         float highlights =
//           smoothstep(0.35, 0.96, flow1 * 0.5 + 0.5) * 0.65 +
//           smoothstep(0.72, 0.99, flow2 * 0.5 + 0.5) * 0.6;

//         vec3 color = mix(
//           vec3(0.12, 0.43, 0.59),
//           vec3(0.92, 0.99, 1.0),
//           clamp(highlights, 0.0, 1.0)
//         );

//         float alpha = 0.43 + clamp(highlights, 0.0, 1.0) * 0.48;
//         gl_FragColor = vec4(color, alpha);
//       }
//     `,
//   });
// }

// function createSurfaceWaterMaterial() {
//   return new THREE.ShaderMaterial({
//     transparent: true,
//     depthWrite: false,
//     side: THREE.DoubleSide,
//     uniforms: { uTime: { value: 0 } },
//     vertexShader: `
//       uniform float uTime;
//       varying vec2 vUv;

//       void main() {
//         vUv = uv;
//         vec3 p = position;
//         p.x += sin(uv.y * 13.0 + uTime * 2.2) * 0.008;
//         p.z += sin(uv.y * 19.0 - uTime * 2.8) * 0.008;
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
//       }
//     `,
//     fragmentShader: `
//       uniform float uTime;
//       varying vec2 vUv;

//       void main() {
//         float flow = sin(vUv.y * 44.0 - uTime * 7.0
//                     + sin(vUv.x * 15.0 + uTime) * 1.2);
//         float fine = sin(vUv.y * 91.0 - uTime * 10.0 + vUv.x * 27.0);
//         float shine = smoothstep(0.45, 0.96, flow * 0.5 + 0.5)
//                     * 0.62
//                     + smoothstep(0.75, 0.99, fine * 0.5 + 0.5) * 0.42;

//         vec3 color = mix(
//           vec3(0.025, 0.13, 0.22),
//           vec3(0.72, 0.94, 1.0),
//           clamp(shine, 0.0, 1.0)
//         );

//         float alpha = 0.16 + clamp(shine, 0.0, 1.0) * 0.68;
//         gl_FragColor = vec4(color, alpha);
//       }
//     `,
//   });
// }

// // ------------------------------------------------------------
// // Waterfall, crown splash and full 360-degree rivulets
// // ------------------------------------------------------------

// function AbhishekWater() {
//   const streamRef = useRef<THREE.Mesh>(null);
//   const splashRef = useRef<THREE.InstancedMesh>(null);
//   const dropletsRef = useRef<THREE.InstancedMesh>(null);
//   const surfaceMaterial = useMemo(createSurfaceWaterMaterial, []);
//   const streamMaterial = useMemo(createStreamMaterial, []);
//   const dummy = useMemo(() => new THREE.Object3D(), []);

//   const splashCount = 190;
//   const dropletCount = 240;
//   const rivuletCount = 30;

//   const splashData = useMemo(
//     () =>
//       Array.from({ length: splashCount }, (_, i) => ({
//         angle: i * 2.399963,
//         phase: ((i * 0.6180339) % 1),
//         speed: 0.72 + (i % 8) * 0.09,
//         size: 0.009 + (i % 5) * 0.0035,
//         reach: 0.2 + ((i * 13) % 100) / 240,
//       })),
//     [],
//   );

//   const dropData = useMemo(
//     () =>
//       Array.from({ length: dropletCount }, (_, i) => ({
//         angle: i * 2.399963,
//         phase: ((i * 0.754877666) % 1),
//         speed: 0.5 + (i % 11) * 0.065,
//         size: 0.007 + (i % 5) * 0.003,
//         drift: Math.sin(i * 4.17) * 0.055,
//       })),
//     [],
//   );

//   // Curved paths follow the rounded crown and descend around every side.
//   const rivulets = useMemo(() => {
//     return Array.from({ length: rivuletCount }, (_, i) => {
//       const angle = (i / rivuletCount) * TAU;
//       const wobble = Math.sin(i * 2.41) * 0.045;
//       const points: THREE.Vector3[] = [];

//       const samples = [
//         { y: 4.82, r: 0.09 },
//         { y: 4.70, r: 0.23 },
//         { y: 4.46, r: 0.34 },
//         { y: 4.08, r: 0.385 },
//         { y: 3.52, r: 0.405 },
//         { y: 2.78, r: 0.42 },
//         { y: 1.85, r: 0.44 },
//         { y: 0.68, r: 0.54 },
//       ];

//       samples.forEach((sample, j) => {
//         const a = angle + Math.sin(j * 0.8 + i) * 0.025;
//         const r = sample.r + wobble * (j / samples.length);

//         points.push(
//           new THREE.Vector3(
//             Math.cos(a) * r,
//             sample.y,
//             Math.sin(a) * r,
//           ),
//         );
//       });

//       const curve = new THREE.CatmullRomCurve3(points);

//       return {
//         geometry: new THREE.TubeGeometry(
//           curve,
//           72,
//           i % 5 === 0 ? 0.014 : 0.008,
//           7,
//           false,
//         ),
//         phase: i * 0.37,
//       };
//     });
//   }, []);

//   useFrame((state) => {
//     const time = state.clock.elapsedTime;

//     streamMaterial.uniforms.uTime.value = time;
//     surfaceMaterial.uniforms.uTime.value = time;

//     // A lively impact halo, with droplets thrown out in every direction.
//     if (splashRef.current) {
//       splashData.forEach((p, i) => {
//         const progress = (time * p.speed + p.phase) % 1;
//         const angle = p.angle + Math.sin(time * 2.3 + i) * 0.045;

//         const radius = 0.045 + progress * p.reach;
//         const y =
//           CROWN_Y +
//           Math.sin(progress * Math.PI) * 0.19 -
//           progress * progress * 0.52;

//         const size = p.size * (0.6 + Math.sin(progress * Math.PI) * 0.8);

//         dummy.position.set(
//           Math.cos(angle) * radius,
//           y,
//           MODEL_POSITION[2] + Math.sin(angle) * radius,
//         );

//         dummy.scale.set(size, size * 1.8, size);
//         dummy.rotation.set(0.15, angle, 0.1);
//         dummy.updateMatrix();
//         splashRef.current!.setMatrixAt(i, dummy.matrix);
//       });

//       splashRef.current.instanceMatrix.needsUpdate = true;
//     }

//     // Falling droplets follow the curved profile, then scatter past the basin.
//     if (dropletsRef.current) {
//       dropData.forEach((p, i) => {
//         const progress = (time * p.speed * 0.42 + p.phase) % 1;
//         const y = CROWN_Y - progress * 4.15;
//         const t = THREE.MathUtils.clamp((CROWN_Y - y) / 3.8, 0, 1);

//         const radius =
//           THREE.MathUtils.lerp(0.12, 0.47, t) +
//           Math.sin(progress * Math.PI) * 0.045;

//         const angle = p.angle + Math.sin(time * 1.5 + i) * 0.035;
//         const size = p.size * (0.75 + progress * 0.55);

//         dummy.position.set(
//           Math.cos(angle) * radius + p.drift * progress,
//           y,
//           MODEL_POSITION[2] + Math.sin(angle) * radius,
//         );

//         dummy.scale.set(size, size * 2.0, size);
//         dummy.rotation.set(0.12, angle, 0.08);
//         dummy.updateMatrix();

//         dropletsRef.current!.setMatrixAt(i, dummy.matrix);
//       });

//       dropletsRef.current.instanceMatrix.needsUpdate = true;
//     }
//   });

//   useEffect(() => {
//     return () => {
//       streamMaterial.dispose();
//       surfaceMaterial.dispose();
//       rivulets.forEach((r) => r.geometry.dispose());
//     };
//   }, [streamMaterial, surfaceMaterial, rivulets]);

//   return (
//     <group>
//       {/* A single continuous stream coming from above the frame.
//           Its centre aligns with the Shivling crown. */}
//       <mesh
//         ref={streamRef}
//         position={[0, 5.53, MODEL_POSITION[2]]}
//         material={streamMaterial}
//         renderOrder={8}
//         frustumCulled={false}
//       >
//         <cylinderGeometry args={[0.042, 0.052, 1.36, 32, 48, true]} />
//       </mesh>

//       {/* Irregular flowing highlights over the rounded stone surface */}
//       {rivulets.map((r, i) => (
//         <mesh
//           key={`rivulet-${i}`}
//           geometry={r.geometry}
//           renderOrder={9}
//           frustumCulled={false}
//         >
//           <meshPhysicalMaterial
//             color="#9ce7ff"
//             emissive="#164e69"
//             emissiveIntensity={0.18}
//             roughness={0.035}
//             metalness={0}
//             clearcoat={1}
//             clearcoatRoughness={0.02}
//             transparent
//             opacity={i % 5 === 0 ? 0.82 : 0.57}
//             depthWrite={false}
//           />
//         </mesh>
//       ))}

//       {/* Fine animated water texture along the curved surface */}
//       <mesh
//         position={[0, 2.78, MODEL_POSITION[2]]}
//         material={surfaceMaterial}
//         renderOrder={7}
//         frustumCulled={false}
//       >
//         <cylinderGeometry args={[0.405, 0.47, 3.95, 128, 96, true]} />
//       </mesh>

//       {/* 360-degree crown splash */}
//       <instancedMesh
//         ref={splashRef}
//         args={[new THREE.SphereGeometry(1, 10, 10), new THREE.MeshPhysicalMaterial({
//           color: '#e4faff',
//           roughness: 0.025,
//           clearcoat: 1,
//           transparent: true,
//           opacity: 0.92,
//           depthWrite: false,
//         }), splashCount]}
//         frustumCulled={false}
//         renderOrder={11}
//       />

//       {/* Water droplets surrounding all sides of the Shivling */}
//       <instancedMesh
//         ref={dropletsRef}
//         args={[new THREE.SphereGeometry(1, 8, 10), new THREE.MeshPhysicalMaterial({
//           color: '#bfefff',
//           roughness: 0.035,
//           clearcoat: 1,
//           transparent: true,
//           opacity: 0.9,
//           depthWrite: false,
//         }), dropletCount]}
//         frustumCulled={false}
//         renderOrder={12}
//       />
//     </group>
//   );
// }

// // ------------------------------------------------------------
// // Load and normalize the downloaded Shivling model
// // ------------------------------------------------------------

// function ShivlingModel() {
//   const { scene } = useGLTF('/models/shivling.glb');

//   const model = useMemo(() => {
//     const clone = scene.clone(true);
//     const bounds = new THREE.Box3().setFromObject(clone);
//     const size = bounds.getSize(new THREE.Vector3());
//     const center = bounds.getCenter(new THREE.Vector3());

//     const scale = 4.5 / Math.max(size.y, 0.001);
//     clone.scale.setScalar(scale);
//     clone.position.set(
//       -center.x * scale,
//       -bounds.min.y * scale,
//       -center.z * scale,
//     );

//     clone.traverse((object) => {
//       if (object instanceof THREE.Mesh) {
//         object.castShadow = true;
//         object.receiveShadow = true;
//       }
//     });

//     return clone;
//   }, [scene]);

//   return <primitive object={model} position={MODEL_POSITION} />;
// }

// useGLTF.preload('/models/shivling.glb');

// // ------------------------------------------------------------
// // Main central sanctuary
// // ------------------------------------------------------------

// export default function CentralSanctuary() {
//   const sanctuaryRef = useRef<THREE.Group>(null);

//   const rockGeometry = useMemo(createRockGeometry, []);
//   const basinGeometry = useMemo(createBasinGeometry, []);

//   const stone = useMemo(
//     () =>
//       new THREE.MeshPhysicalMaterial({
//         color: '#10131b',
//         roughness: 0.2,
//         metalness: 0.18,
//         clearcoat: 1,
//         clearcoatRoughness: 0.09,
//       }),
//     [],
//   );

//   const platformStone = useMemo(
//     () =>
//       new THREE.MeshStandardMaterial({
//         color: '#292f40',
//         roughness: 0.68,
//         metalness: 0.16,
//       }),
//     [],
//   );

//   const gold = useMemo(
//     () =>
//       new THREE.MeshStandardMaterial({
//         color: '#b99357',
//         metalness: 0.68,
//         roughness: 0.28,
//       }),
//     [],
//   );

//   useFrame((state, delta) => {
//     if (!sanctuaryRef.current) return;

//     sanctuaryRef.current.position.y =
//       -2.5 + Math.sin(state.clock.elapsedTime * 0.42) * 0.025;

//     sanctuaryRef.current.rotation.y += delta * 0.18;
//   });

//   useEffect(() => {
//     return () => {
//       rockGeometry.dispose();
//       basinGeometry.dispose();
//       stone.dispose();
//       platformStone.dispose();
//       gold.dispose();
//     };
//   }, [rockGeometry, basinGeometry, stone, platformStone, gold]);

//   return (
//     <group ref={sanctuaryRef}>
//       {/* Floating island — preserved */}
//       <mesh
//         geometry={rockGeometry}
//         position={[0, -0.55, 0]}
//         scale={[4.7, 1.35, 4.65]}
//         material={platformStone}
//         castShadow
//         receiveShadow
//       />

//       <mesh position={[0, -0.1, 0]}>
//         <cylinderGeometry args={[2.55, 2.7, 0.22, 96]} />
//         <primitive object={platformStone} attach="material" />
//       </mesh>

//       <mesh position={[0, 0.08, 0]}>
//         <cylinderGeometry args={[2.35, 2.48, 0.22, 96]} />
//         <meshStandardMaterial
//           color="#34394a"
//           roughness={0.45}
//           metalness={0.28}
//         />
//       </mesh>

//       {/* Pedestal */}
//       <mesh position={[0, 0.235, 0]} scale={[1, 1, 0.82]}>
//         <cylinderGeometry args={[0.93, 1.02, 0.2, 96]} />
//         <primitive object={stone} attach="material" />
//       </mesh>

//       <mesh position={[0, 0.345, 0]} scale={[1, 1, 0.84]}>
//         <cylinderGeometry args={[0.94, 0.94, 0.055, 96]} />
//         <primitive object={gold} attach="material" />
//       </mesh>

//       {/* Yoni basin and spout */}
//       <mesh
//         geometry={basinGeometry}
//         position={[0, 0.37, 0]}
//         material={stone}
//         castShadow
//         receiveShadow
//       />

//       {/* Shivling model */}
//       <ShivlingModel />

//       {/* Water effect */}
//       <AbhishekWater />

//       {/* Cool and warm cinematic reflections */}
//       <pointLight
//         position={[-1.1, 1.8, 2.1]}
//         color="#72caff"
//         intensity={1.5}
//         distance={5}
//         decay={2}
//       />

//       <pointLight
//         position={[1.1, 1.4, -0.8]}
//         color="#f0d09a"
//         intensity={0.8}
//         distance={4}
//         decay={2}
//       />

//       <pointLight
//         position={[0, 0.8, 1.5]}
//         color="#36a9ff"
//         intensity={0.65}
//         distance={3}
//         decay={2}
//       />
//     </group>
//   );
// }


// import { useEffect, useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';
// import { useGLTF } from '@react-three/drei';

// /**
//  * THE COSMIC FORGE — Central Sanctuary
//  * Keeps the existing Scene.tsx interface unchanged.
//  */

// function createRockGeometry() {
//   const geometry = new THREE.IcosahedronGeometry(1, 4);
//   const positions = geometry.attributes.position;

//   for (let i = 0; i < positions.count; i++) {
//     const x = positions.getX(i);
//     const y = positions.getY(i);
//     const z = positions.getZ(i);

//     const noise =
//       1 +
//       0.045 * Math.sin(x * 17 + z * 11) * Math.cos(y * 13 - x * 5) +
//       0.022 * Math.sin(z * 27 + y * 19);

//     positions.setXYZ(i, x * noise, y * noise, z * noise);
//   }

//   geometry.computeVertexNormals();
//   return geometry;
// }

// function createLingamGeometry() {
//   const profile = [
//     new THREE.Vector2(0.00, 0.000),
//     new THREE.Vector2(0.34, 0.000),
//     new THREE.Vector2(0.44, 0.045),
//     new THREE.Vector2(0.47, 0.13),
//     new THREE.Vector2(0.47, 0.48),
//     new THREE.Vector2(0.44, 0.70),
//     new THREE.Vector2(0.38, 0.91),
//     new THREE.Vector2(0.29, 1.10),
//     new THREE.Vector2(0.18, 1.25),
//     new THREE.Vector2(0.08, 1.32),
//     new THREE.Vector2(0.00, 1.34),
//   ];

//   const geometry = new THREE.LatheGeometry(profile, 128);
//   geometry.computeVertexNormals();
//   return geometry;
// }

// function createBasinGeometry() {
//   const shape = new THREE.Shape();

//   shape.moveTo(-0.78, -0.36);
//   shape.bezierCurveTo(-1.02, -0.12, -0.98, 0.31, -0.70, 0.43);
//   shape.bezierCurveTo(-0.35, 0.57, 0.35, 0.57, 0.70, 0.43);
//   shape.bezierCurveTo(0.98, 0.31, 1.02, -0.12, 0.78, -0.36);
//   shape.bezierCurveTo(0.45, -0.55, -0.45, -0.55, -0.78, -0.36);

//   shape.lineTo(-0.38, -0.57);
//   shape.lineTo(-0.20, -0.94);
//   shape.quadraticCurveTo(0, -1.06, 0.20, -0.94);
//   shape.lineTo(0.38, -0.57);
//   shape.closePath();

//   const geometry = new THREE.ExtrudeGeometry(shape, {
//     depth: 0.105,
//     bevelEnabled: true,
//     bevelSegments: 3,
//     steps: 1,
//     bevelSize: 0.035,
//     bevelThickness: 0.035,
//     curveSegments: 16,
//   });

//   geometry.rotateX(-Math.PI / 2);
//   geometry.computeVertexNormals();
//   return geometry;
// }

// function createWaterMaterial() {
//   return new THREE.ShaderMaterial({
//     transparent: true,
//     depthWrite: false,
//     side: THREE.DoubleSide,
//     uniforms: {
//       uTime: { value: 0 },
//     },
//     vertexShader: `
//       varying vec2 vUv;

//       void main() {
//         vUv = uv;
//         gl_Position = projectionMatrix *
//           modelViewMatrix * vec4(position, 1.0);
//       }
//     `,
//     fragmentShader: `
//       uniform float uTime;
//       varying vec2 vUv;

//       void main() {
//         float flowA = sin(
//           vUv.y * 46.0 - uTime * 4.2 +
//           sin(vUv.x * 12.0 + uTime * 1.4) * 1.1
//         );

//         float flowB = sin(
//           vUv.y * 89.0 - uTime * 6.0 + vUv.x * 8.0
//         );

//         float edge = smoothstep(0.0, 0.16, vUv.x) *
//           (1.0 - smoothstep(0.84, 1.0, vUv.x));

//         float streaks = smoothstep(0.25, 0.94, flowA * 0.5 + 0.5);
//         streaks = max(
//           streaks,
//           smoothstep(0.76, 0.99, flowB) * 0.55
//         );

//         vec3 deepBlue = vec3(0.035, 0.30, 0.55);
//         vec3 iceBlue = vec3(0.42, 0.84, 1.0);
//         vec3 white = vec3(0.96, 0.99, 1.0);

//         vec3 color = mix(deepBlue, iceBlue, streaks * 0.78);
//         color = mix(color, white, streaks * 0.42);

//         float alpha = (0.62 + streaks * 0.36) * edge;

//         gl_FragColor = vec4(color, alpha);
//       }
//     `,
//   });
// }

// function createWaterRibbon(
//   points: THREE.Vector3[],
//   width: number,
// ) {
//   const curve = new THREE.CatmullRomCurve3(points);
//   const segments = 96;
//   const verticesAcross = 8;
//   const positions: number[] = [];
//   const uvs: number[] = [];
//   const indices: number[] = [];

//   for (let i = 0; i <= segments; i++) {
//     const t = i / segments;
//     const point = curve.getPoint(t);
//     const tangent = curve.getTangent(t).normalize();

//     const across = new THREE.Vector3(1, 0, 0);
//     across.addScaledVector(tangent, -across.dot(tangent)).normalize();

//     const taper = Math.min(
//       1,
//       0.35 + t * 2.8,
//       0.35 + (1 - t) * 2.5,
//     );

//     for (let j = 0; j <= verticesAcross; j++) {
//       const u = j / verticesAcross;
//       const offset = (u - 0.5) * width * taper;
//       const p = point.clone().addScaledVector(across, offset);

//       positions.push(p.x, p.y, p.z);
//       uvs.push(u, t);
//     }
//   }

//   for (let i = 0; i < segments; i++) {
//     for (let j = 0; j < verticesAcross; j++) {
//       const a = i * (verticesAcross + 1) + j;
//       const b = a + verticesAcross + 1;

//       indices.push(a, b, a + 1);
//       indices.push(b, b + 1, a + 1);
//     }
//   }

//   const geometry = new THREE.BufferGeometry();
//   geometry.setAttribute(
//     'position',
//     new THREE.Float32BufferAttribute(positions, 3),
//   );
//   geometry.setAttribute(
//     'uv',
//     new THREE.Float32BufferAttribute(uvs, 2),
//   );
//   geometry.setIndex(indices);
//   geometry.computeVertexNormals();

//   return geometry;
// }

// function WaterSheet({
//   points,
//   width,
//   offset = 0,
// }: {
//   points: THREE.Vector3[];
//   width: number;
//   offset?: number;
// }) {
//   const meshRef = useRef<THREE.Mesh>(null);

//   const geometry = useMemo(
//     () => createWaterRibbon(points, width),
//     [points, width],
//   );

//   const material = useMemo(createWaterMaterial, []);

//   useFrame((state) => {
//     material.uniforms.uTime.value = state.clock.elapsedTime + offset;

//     if (meshRef.current) {
//       meshRef.current.visible = true;
//     }
//   });

//   useEffect(() => {
//     return () => {
//       geometry.dispose();
//       material.dispose();
//     };
//   }, [geometry, material]);

//   return (
//     <mesh
//       ref={meshRef}
//       geometry={geometry}
//       material={material}
//       renderOrder={5}
//       frustumCulled={false}
//     />
//   );
// }

// function Droplets() {
//   const groupRef = useRef<THREE.Group>(null);

//   const particles = useMemo(
//     () =>
//       Array.from({ length: 180 }, (_, i) => ({
//         angle: i * 2.399963,
//         speed: 0.45 + (i % 11) * 0.075,
//         phase: (i * 0.61803398875) % 1,
//         radius: 0.34 + (i % 9) * 0.045,
//         size: 0.008 + (i % 5) * 0.003,
//       })),
//     [],
//   );

//   useFrame((state) => {
//     if (!groupRef.current) return;

//     const time = state.clock.elapsedTime;

//     groupRef.current.children.forEach((drop, i) => {
//       const p = particles[i];
//       const progress = (time * p.speed + p.phase) % 1;
//       const angle = p.angle + Math.sin(time * 1.7 + i) * 0.045;
//       const radius = p.radius + Math.sin(time * 2.1 + i) * 0.025;

//       // Droplets fall downward while spreading around the lingam.
//       const y = 1.55 - progress * 1.22;
//       const x = Math.cos(angle) * radius;
//       const z = Math.sin(angle) * radius;

//       drop.position.set(x, y, z);

//       const scale = p.size * (0.65 + Math.sin(progress * Math.PI) * 0.75);
//       drop.scale.set(scale, scale * 1.7, scale);
//       drop.visible = true;
//     });
//   });

//   return (
//     <group ref={groupRef}>
//       {particles.map((p, i) => (
//         <mesh key={i} scale={0}>
//           <sphereGeometry args={[1, 8, 8]} />
//           <meshPhysicalMaterial
//             color="#bcefff"
//             roughness={0.035}
//             metalness={0}
//             transparent
//             opacity={0.88}
//             clearcoat={1}
//             clearcoatRoughness={0.02}
//             depthWrite={false}
//           />
//         </mesh>
//       ))}
//     </group>
//   );
// }

// function WaterRipples() {
//   const rippleRefs = useRef<(THREE.Mesh | null)[]>([]);

//   useFrame((state) => {
//     const time = state.clock.elapsedTime;

//     rippleRefs.current.forEach((mesh, i) => {
//       if (!mesh) return;

//       const phase = (time * 0.42 + i * 0.27) % 1;
//       const scale = 0.12 + phase * 0.32;

//       mesh.scale.set(scale, scale, scale);
//       mesh.material instanceof THREE.Material &&
//         (mesh.material.opacity = (1 - phase) * 0.38);
//     });
//   });

//   return (
//     <group position={[0, 0.18, 0]}>
//       {Array.from({ length: 7 }, (_, i) => (
//         <mesh
//           key={i}
//           ref={(mesh) => {
//             rippleRefs.current[i] = mesh;
//           }}
//           rotation={[-Math.PI / 2, 0, 0]}
//           position={[
//             Math.cos(i * (Math.PI * 2 / 7)) * 0.46,
//             0.002 + i * 0.0005,
//             Math.sin(i * (Math.PI * 2 / 7)) * 0.46,
//           ]}
//         >
//           <ringGeometry args={[0.8, 1, 48]} />
//           <meshBasicMaterial
//             color="#7ddfff"
//             transparent
//             opacity={0.25}
//             side={THREE.DoubleSide}
//             depthWrite={false}
//           />
//         </mesh>
//       ))}
//     </group>
//   );
// }

// function FloatingFlower({
//   position,
//   rotation = [0, 0, 0],
//   scale = 1,
// }: {
//   position: [number, number, number];
//   rotation?: [number, number, number];
//   scale?: number;
// }) {
//   const flowerRef = useRef<THREE.Group>(null);

//   useFrame((state) => {
//     if (!flowerRef.current) return;

//     const time = state.clock.elapsedTime;
//     flowerRef.current.position.y =
//       position[1] + Math.sin(time * 0.65 + position[0] * 3) * 0.012;

//     flowerRef.current.rotation.z =
//       rotation[2] + Math.sin(time * 0.4 + position[2]) * 0.035;
//   });

//   return (
//     <group
//       ref={flowerRef}
//       position={position}
//       rotation={rotation}
//       scale={scale}
//     >
//       {/* Flower center */}
//       <mesh>
//         <sphereGeometry args={[0.045, 16, 12]} />
//         <meshStandardMaterial
//           color="#f5bf43"
//           emissive="#6a3805"
//           emissiveIntensity={0.25}
//           roughness={0.38}
//         />
//       </mesh>

//       {/* Six soft petals */}
//       {Array.from({ length: 6 }, (_, i) => (
//         <mesh
//           key={i}
//           position={[
//             Math.cos((i * Math.PI) / 3) * 0.09,
//             0,
//             Math.sin((i * Math.PI) / 3) * 0.09,
//           ]}
//           rotation={[
//             0,
//             -(i * Math.PI) / 3,
//             Math.PI / 2,
//           ]}
//         >
//           <sphereGeometry args={[0.07, 14, 10]} />
//           <meshStandardMaterial
//             color="#fff4dc"
//             roughness={0.42}
//             side={THREE.DoubleSide}
//           />
//         </mesh>
//       ))}
//     </group>
//   );
// }

// /**
//  * Shivling model component.
//  * The model file is loaded from public/models/shivling.glb.
//  */
// // function ShivlingModel() {
// //   const modelRef = useRef<THREE.Group>(null);
// //   const { scene } = useGLTF('/models/shivling.glb');

// //   const model = useMemo(() => {
// //     const clone = scene.clone(true);

// //     // Preserve source textures and materials, while improving stone reflections.
// //     clone.traverse((object) => {
// //       if (!(object instanceof THREE.Mesh)) return;

// //       object.castShadow = true;
// //       object.receiveShadow = true;

// //       const materials = Array.isArray(object.material)
// //         ? object.material
// //         : [object.material];

// //       materials.forEach((material) => {
// //         if (material instanceof THREE.MeshStandardMaterial) {
// //           material.roughness = Math.min(material.roughness, 0.32);
// //           material.metalness = Math.max(material.metalness, 0.12);
// //           material.envMapIntensity = 1.25;
// //           material.needsUpdate = true;
// //         }
// //       });
// //     });

// //     // Normalize model bounds so the model can be positioned consistently.
// //     const bounds = new THREE.Box3().setFromObject(clone);
// //     const size = bounds.getSize(new THREE.Vector3());
// //     const center = bounds.getCenter(new THREE.Vector3());

// //     clone.position.sub(center);

// //     const maxDimension = Math.max(size.x, size.y, size.z);
// //     if (maxDimension > 0) {
// //       const scale = 2.0 / maxDimension;
// //       clone.scale.setScalar(scale);
// //     }

// //     return clone;
// //   }, [scene]);

// //   useEffect(() => {
// //     return () => {
// //       // Do not dispose the cached GLTF scene here; useGLTF shares it.
// //     };
// //   }, []);

// //   useFrame((state) => {
// //     if (!modelRef.current) return;

// //     // Gentle motion only; no independent rotation that would misalign the water.
// //     modelRef.current.position.y =
// //       Math.sin(state.clock.elapsedTime * 0.5) * 0.003;
// //   });

// //   return (
// //     <group ref={modelRef} position={[0, 0.52, 0]}>
// //       <primitive object={model} />
// //     </group>
// //   );
// // }


// function ShivlingModel() {
//   const modelRef = useRef<THREE.Group>(null);
//   const { scene } = useGLTF('/models/shivling.glb');

//   const model = useMemo(() => {
//     const clone = scene.clone(true);

//     // Preserve the original model and textures.
//     clone.traverse((object) => {
//       if (!(object instanceof THREE.Mesh)) return;

//       object.castShadow = true;
//       object.receiveShadow = true;
//     });

//     // Restore the previous 4.5-unit target height.
//     const bounds = new THREE.Box3().setFromObject(clone);
//     const size = bounds.getSize(new THREE.Vector3());
//     const center = bounds.getCenter(new THREE.Vector3());

//     const targetHeight = 4.5;
//     const scale = targetHeight / Math.max(size.y, 0.001);

//     clone.scale.setScalar(scale);

//     // Center the model horizontally and align its base.
//     // Keep the previous sanctuary pedestal placement.
//     clone.position.set(
//       -center.x * scale,
//       -bounds.min.y * scale,
//       -center.z * scale
//     );

//     return clone;
//   }, [scene]);

//   useFrame((state) => {
//     if (!modelRef.current) return;

//     modelRef.current.position.y =
//       Math.sin(state.clock.elapsedTime * 0.5) * 0.003;
//   });

//   return (
//     <group ref={modelRef} position={[0, 0.46, 0.12]}>
//       <primitive object={model} />
//     </group>
//   );
// }

// useGLTF.preload('/models/shivling.glb');

// function AbhishekWater() {
//   const streamRef = useRef<THREE.Mesh>(null);
//   const splashRef = useRef<THREE.Group>(null);
//   const dropsRef = useRef<THREE.Group>(null);

//   const streamMaterial = useMemo(
//     () =>
//       new THREE.MeshPhysicalMaterial({
//         color: '#d8f7ff',
//         roughness: 0.025,
//         metalness: 0,
//         transparent: true,
//         opacity: 0.8,
//         clearcoat: 1,
//         clearcoatRoughness: 0.02,
//         emissive: '#246b85',
//         emissiveIntensity: 0.12,
//         depthWrite: false,
//         side: THREE.DoubleSide,
//       }),
//     [],
//   );

//   const splashParticles = useMemo(
//     () =>
//       Array.from({ length: 72 }, (_, i) => ({
//         angle: i * 2.399963,
//         phase: (i * 0.6180339) % 1,
//         speed: 0.7 + (i % 6) * 0.12,
//         size: 0.008 + (i % 4) * 0.004,
//       })),
//     [],
//   );

//   const fallingParticles = useMemo(
//     () =>
//       Array.from({ length: 120 }, (_, i) => ({
//         angle: i * 2.399963,
//         phase: (i * 0.754877666) % 1,
//         speed: 0.55 + (i % 7) * 0.1,
//         size: 0.008 + (i % 5) * 0.003,
//         radius: 0.34 + (i % 8) * 0.025,
//       })),
//     [],
//   );

//   useFrame((state) => {
//     const time = state.clock.elapsedTime;

//     if (streamRef.current) {
//       streamMaterial.opacity = 0.74 + Math.sin(time * 7) * 0.05;
//     }

//     if (splashRef.current) {
//       splashRef.current.children.forEach((drop, i) => {
//         const p = splashParticles[i];
//         const progress = (time * p.speed + p.phase) % 1;
//         const angle = p.angle + Math.sin(time * 2 + i) * 0.04;

//         const radius = 0.06 + progress * 0.34;
//         const y =
//           4.82 +
//           Math.sin(progress * Math.PI) * 0.16 -
//           progress * progress * 0.35;

//         drop.position.set(
//           Math.cos(angle) * radius,
//           y,
//           Math.sin(angle) * radius,
//         );

//         const s = p.size * (0.6 + Math.sin(progress * Math.PI) * 0.8);
//         drop.scale.set(s, s * 1.7, s);
//       });
//     }

//     if (dropsRef.current) {
//       dropsRef.current.children.forEach((drop, i) => {
//         const p = fallingParticles[i];
//         const progress = (time * p.speed + p.phase) % 1;
//         const angle = p.angle + Math.sin(time * 1.6 + i) * 0.03;

//         const radius = p.radius + progress * 0.06;
//         const y = 4.78 - progress * 3.50 ;

//         drop.position.set(
//           Math.cos(angle) * radius,
//           y,
//           Math.sin(angle) * radius,
//         );

//         const s = p.size * (0.7 + progress * 0.45);
//         drop.scale.set(s, s * 1.8, s);
//       });
//     }
//   });

//   useEffect(() => {
//     return () => {
//       streamMaterial.dispose();
//     };
//   }, [streamMaterial]);

//   return (
//     <group>
//       {/* Continuous overhead stream */}
//       <mesh
//         ref={streamRef}
//         position={[0, 5.51, 0]}
//         material={streamMaterial}
//         renderOrder={8}
//         frustumCulled={false}
//       >
//         <cylinderGeometry args={[0.045, 0.06, 1.1, 32, 24, true]} />
//       </mesh>

//       {/* Crown splash spreading in all directions */}
//       <group ref={splashRef} position={[0, 0, 0]}>
//         {splashParticles.map((p, i) => (
//           <mesh key={i}>
//             <sphereGeometry args={[1, 8, 8]} />
//             <meshPhysicalMaterial
//               color="#e0faff"
//               roughness={0.025}
//               transparent
//               opacity={0.9}
//               clearcoat={1}
//               depthWrite={false}
//             />
//           </mesh>
//         ))}
//       </group>

//       {/* Falling droplets around the entire circumference */}
//       <group ref={dropsRef}>
//         {fallingParticles.map((p, i) => (
//           <mesh key={i}>
//             <sphereGeometry args={[1, 8, 8]} />
//             <meshPhysicalMaterial
//               color="#c7f1ff"
//               roughness={0.03}
//               transparent
//               opacity={0.9}
//               clearcoat={1}
//               depthWrite={false}
//             />
//           </mesh>
//         ))}
//       </group>
//     </group>
//   );
// }

// export default function CentralSanctuary() {
//   const sanctuaryRef = useRef<THREE.Group>(null);

//   const rockGeometry = useMemo(createRockGeometry, []);
//   const basinGeometry = useMemo(createBasinGeometry, []);

//   const platformStone = useMemo(
//     () =>
//       new THREE.MeshStandardMaterial({
//         color: '#34394a',
//         roughness: 0.63,
//         metalness: 0.2,
//       }),
//     [],
//   );

//   const darkStone = useMemo(
//     () =>
//       new THREE.MeshPhysicalMaterial({
//         color: '#171b25',
//         roughness: 0.17,
//         metalness: 0.22,
//         clearcoat: 1,
//         clearcoatRoughness: 0.08,
//       }),
//     [],
//   );

//   const goldTrim = useMemo(
//     () =>
//       new THREE.MeshStandardMaterial({
//         color: '#b99357',
//         metalness: 0.68,
//         roughness: 0.28,
//       }),
//     [],
//   );

//   useFrame((state, delta) => {
//     if (!sanctuaryRef.current) return;

//     sanctuaryRef.current.position.y =
//       -2.5 + Math.sin(state.clock.elapsedTime * 0.42) * 0.025;

//     sanctuaryRef.current.rotation.y += delta * 0.18;
//   });

//   useEffect(() => {
//     return () => {
//       rockGeometry.dispose();
//       basinGeometry.dispose();
//       platformStone.dispose();
//       darkStone.dispose();
//       goldTrim.dispose();
//     };
//   }, [
//     rockGeometry,
//     basinGeometry,
//     platformStone,
//     darkStone,
//     goldTrim,
//   ]);

//   return (
//     <group ref={sanctuaryRef}>
//       {/* Floating rocky island */}
//       <mesh
//         geometry={rockGeometry}
//         position={[0, -0.55, 0]}
//         scale={[4.7, 1.35, 4.65]}
//         material={platformStone}
//         castShadow
//         receiveShadow
//       />

//       <mesh position={[0, -0.1, 0]}>
//         <cylinderGeometry args={[2.55, 2.7, 0.22, 96]} />
//         <primitive object={platformStone} attach="material" />
//       </mesh>

//       <mesh position={[0, 0.08, 0]}>
//         <cylinderGeometry args={[2.35, 2.48, 0.22, 96]} />
//         <meshStandardMaterial
//           color="#34394a"
//           roughness={0.45}
//           metalness={0.28}
//         />
//       </mesh>

//       {/* Pedestal */}
//       <mesh position={[0, 0.235, 0]} scale={[1, 1, 0.82]}>
//         <cylinderGeometry args={[0.93, 1.02, 0.2, 96]} />
//         <primitive object={darkStone} attach="material" />
//       </mesh>

//       <mesh position={[0, 0.345, 0]} scale={[1, 1, 0.84]}>
//         <cylinderGeometry args={[0.94, 0.94, 0.055, 96]} />
//         <primitive object={goldTrim} attach="material" />
//       </mesh>

//       {/* Traditional basin and front spout */}
//       <mesh
//         geometry={basinGeometry}
//         position={[0, 0.37, 0]}
//         material={darkStone}
//         castShadow
//         receiveShadow
//       />

//       {/* Shivling model */}
//       <ShivlingModel />

//       {/* Abhishek water animation */}
//       <AbhishekWater />

//       {/* Floating flowers */}
//       <FloatingFlower
//         position={[-0.48, 0.92, 0.38]}
//         rotation={[0, 0.3, 0]}
//         scale={0.8}
//       />
//       <FloatingFlower
//         position={[0.48, 0.92, 0.38]}
//         rotation={[0, 1.2, 0]}
//         scale={0.8}
//       />
//       <FloatingFlower
//         position={[0, 0.92, -0.35]}
//         rotation={[0, 2.1, 0]}
//         scale={0.8}
//       />

//       {/* Cinematic reflections */}
//       <pointLight
//         position={[-1.1, 1.8, 2.1]}
//         color="#72caff"
//         intensity={1.5}
//         distance={5}
//         decay={2}
//       />

//       <pointLight
//         position={[1.1, 1.4, -0.8]}
//         color="#f0d09a"
//         intensity={0.8}
//         distance={4}
//         decay={2}
//       />

//       <pointLight
//         position={[0, 0.8, 1.5]}
//         color="#36a9ff"
//         intensity={0.65}
//         distance={3}
//         decay={2}
//       />
//     </group>
//   );
// }


import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

// ======================================================
// THE COSMIC FORGE — CENTRAL SHIVA SANCTUARY
// Final model-based implementation
// ======================================================

const WATER_COLOR = '#bdefff';

// ------------------------------------------------------
// SHIVLING MODEL
// Preserve original 4.5-unit height and glossy material.
// Yoni spout remains directed towards screen-right.
// ------------------------------------------------------

function ShivlingModel() {
  const modelRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/shivling.glb');

  const model = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.castShadow = true;
      object.receiveShadow = true;

      // Clone materials so the cached GLB materials stay untouched.
      const original = object.material;
      object.material = Array.isArray(original)
        ? original.map((material) => material.clone())
        : original.clone();

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          // Preserve the original dark colour and make the surface
          // glossy enough to retain the continuously-watered look.
          material.roughness = Math.min(material.roughness, 0.22);
          material.metalness = Math.max(material.metalness, 0.08);

          if (material instanceof THREE.MeshPhysicalMaterial) {
            material.clearcoat = 1;
            material.clearcoatRoughness = 0.08;
          }

          material.needsUpdate = true;
        }
      });
    });

    clone.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());

    const targetHeight = 4.5;
    const scale = targetHeight / Math.max(size.y, 0.001);

    clone.scale.setScalar(scale);
    clone.position.set(
      -center.x * scale,
      -bounds.min.y * scale,
      -center.z * scale,
    );

    return clone;
  }, [scene]);

  useFrame((state) => {
    if (!modelRef.current) return;

    // Very subtle movement only. Never rotate the entire Shivling.
    modelRef.current.position.y =
      -0.42 + Math.sin(state.clock.elapsedTime * 0.5) * 0.003;
  });

  return (
    <group
      ref={modelRef}
      position={[0.28, -0.32, 0.12]}
      rotation={[0, -0.08, 0]}
    >
      <primitive object={model} />
    </group>
  );
}

// ------------------------------------------------------
// FLOATING ROCK MODEL
// Uses the downloaded natural rock island GLB.
// ------------------------------------------------------

// function FloatingIsland() {
//   const { scene } = useGLTF('/models/floating_rocks.glb');

//   const island = useMemo(() => {
//     const clone = scene.clone(true);

//     clone.traverse((object) => {
//       if (object instanceof THREE.Mesh) {
//         object.castShadow = true;
//         object.receiveShadow = true;
//       }
//     });

//     clone.updateMatrixWorld(true);

//     const bounds = new THREE.Box3().setFromObject(clone);
//     const size = bounds.getSize(new THREE.Vector3());
//     const center = bounds.getCenter(new THREE.Vector3());

//     // Keep the island approximately the width of the previous platform.
//     const targetWidth = 5.9;
//     const horizontalScale =
//       targetWidth / Math.max(size.x, size.z, 0.001);

//     // Slightly compress its vertical depth so it fits the composition.
//     const verticalScale = horizontalScale * 0.55;

//     clone.scale.set(
//       horizontalScale,
//       verticalScale,
//       horizontalScale,
//     );

//     // Align the highest point of the island with the shrine platform.
//     clone.position.set(
//       -center.x * horizontalScale,
//       -bounds.max.y * verticalScale - 0.02,
//       -center.z * horizontalScale,
//     );

//     return clone;
//   }, [scene]);

//   return <primitive object={island} />;
// }
function FloatingIsland() {
  const { scene } = useGLTF('/models/floating_rocks.glb');

  const island = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    clone.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());

    // Wider, more substantial central floating island.
    const targetWidth = 9.1;
    const horizontalScale =
      targetWidth / Math.max(size.x, size.z, 0.001);

    const verticalScale = horizontalScale * 0.55;

    clone.scale.set(
      horizontalScale,
      verticalScale,
      horizontalScale,
    );

    // Align the top of the rock island with the shrine.
    clone.position.set(
      -center.x * horizontalScale,
      -bounds.max.y * verticalScale - 0.02,
      -center.z * horizontalScale,
    );

    return clone;
  }, [scene]);

  return <primitive object={island} />;
}

// ------------------------------------------------------
// LOTUS MODEL
// Uses the downloaded lilies.glb.
// ------------------------------------------------------

function Lotus({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const flowerRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/lilies.glb');

  const flower = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    clone.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());

    // Keep each complete flower compact around the shrine.
    const targetHeight = 1.32;
    const flowerScale = targetHeight / Math.max(size.y, 0.001);

    clone.scale.setScalar(flowerScale);
    clone.position.set(
      -center.x * flowerScale,
      -bounds.min.y * flowerScale,
      -center.z * flowerScale,
    );

    return clone;
  }, [scene]);

  useFrame((state) => {
    if (!flowerRef.current) return;

    flowerRef.current.position.y =
      position[1] +
      Math.sin(state.clock.elapsedTime * 0.65 + position[0]) * 0.009;
  });

  return (
    <group ref={flowerRef} position={position} scale={scale}>
      <primitive object={flower} />
    </group>
  );
}

// ------------------------------------------------------
// CONTINUOUS ABHISHEK WATER STREAM
// Medium-width stream, not a thin line or broad curtain.
// ------------------------------------------------------

function WaterStream() {
  const streamRef = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: WATER_COLOR,
        roughness: 0.035,
        metalness: 0,
        transparent: true,
        opacity: 0.55,
        transmission: 0.18,
        thickness: 0.35,
        clearcoat: 1,
        clearcoatRoughness: 0.025,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useFrame((state) => {
    if (!streamRef.current) return;

    const time = state.clock.elapsedTime;

    // Small natural variations without breaking the continuous stream.
    streamRef.current.scale.x = 1 + Math.sin(time * 4.2) * 0.035;
    streamRef.current.scale.z = 1 + Math.cos(time * 4.2) * 0.035;
  });

  useEffect(() => {
    return () => material.dispose();
  }, [material]);

  return (
    <mesh
      ref={streamRef}
      position={[0, 5.585, 0]}
      material={material}
      renderOrder={8}
      frustumCulled={false}
    >
      <cylinderGeometry args={[0.085, 0.11, 1.25, 32, 12, true]} />
    </mesh>
  );
}

// ------------------------------------------------------
// SMALL DROPLETS INSIDE THE CONTINUOUS STREAM
// ------------------------------------------------------

function StreamDroplets() {
  const groupRef = useRef<THREE.Group>(null);

  const droplets = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        phase: (i * 0.61803398875) % 1,
        speed: 0.65 + (i % 5) * 0.08,
        angle: i * 2.399963,
        size: 0.009 + (i % 3) * 0.003,
      })),
    [],
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    groupRef.current.children.forEach((drop, i) => {
      const item = droplets[i];
      const progress = (time * item.speed + item.phase) % 1;

      const angle = item.angle + time * 0.35;
      const radius = 0.035 + Math.sin(time * 3 + i) * 0.018;

      drop.position.set(
        Math.cos(angle) * radius,
        5.82 - progress * 1.18,
        Math.sin(angle) * radius,
      );

      const size = item.size * (0.7 + progress * 0.3);
      drop.scale.set(size, size * 2.4, size);
    });
  });

  return (
    <group ref={groupRef}>
      {droplets.map((drop, i) => (
        <mesh key={i} scale={0}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshPhysicalMaterial
            color="#e7faff"
            roughness={0.025}
            transparent
            opacity={0.9}
            clearcoat={1}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ------------------------------------------------------
// ANIMATED SPLASH MODEL
// Uses your downloaded Pixor splash GLB.
// ------------------------------------------------------

// function CrownSplash() {
//   const splashRoot = useRef<THREE.Group>(null);
//   const { scene, animations } = useGLTF(
//     '/models/pixor-library-splash.glb',
//   );

//   const splash = useMemo(() => {
//     const clone = scene.clone(true);

//     clone.traverse((object) => {
//       if (!(object instanceof THREE.Mesh)) return;

//       object.castShadow = false;
//       object.receiveShadow = false;
//       object.frustumCulled = false;

//       const materials = Array.isArray(object.material)
//         ? object.material
//         : [object.material];

//       materials.forEach((material) => {
//         if (material.name === 'Water' &&
//             material instanceof THREE.MeshStandardMaterial) {
//           material.color.lerp(new THREE.Color('#bdefff'), 0.35);
//           material.roughness = 0.08;
//           material.metalness = 0;
//           material.needsUpdate = true;
//         }
//       });
//     });

//     return clone;
//   }, [scene]);

//   const { actions } = useAnimations(animations, splashRoot);

//   useEffect(() => {
//     const action = actions['Splash'];

//     if (!action) return;

//     action.reset();
//     action.setLoop(THREE.LoopRepeat, Infinity);
//     action.play();

//     return () => {
//       action.stop();
//     };
//   }, [actions]);

//   return (
//     <group
//       ref={splashRoot}
//       position={[0, 4.88, 0]}
//       scale={1.15}
//     >
//       <primitive object={splash} />
//     </group>
//   );
// }
function CrownSplash() {
  const rootRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const { scene, animations } = useGLTF(
    '/models/pixor-library-splash.glb',
  );

  const splash = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.castShadow = false;
      object.receiveShadow = false;
      object.frustumCulled = false;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.color.set('#bdefff');
          material.roughness = 0.07;
          material.metalness = 0;
          material.transparent = true;
          material.opacity = 0.72;
          material.needsUpdate = true;
        }
      });
    });

    return clone;
  }, [scene]);

  // Log the real animation names instead of guessing "Splash".
  useEffect(() => {
    console.info(
      '[Pixor splash] Available GLB animations:',
      animations.map((clip) => clip.name),
    );
  }, [animations]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (ringRef.current) {
      const pulse = (Math.sin(time * 5) + 1) / 2;

      ringRef.current.scale.setScalar(0.8 + pulse * 0.35);

      const material = ringRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.38 + pulse * 0.32;
    }
  });

  return (
    <group ref={rootRef} position={[0, 4.98, 0]}>
      {/* Downloaded Pixor splash geometry */}
      <primitive object={splash} scale={0.65} />

      {/* Continuous visible impact crown */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.015, 0]}
      >
        <torusGeometry args={[0.35, 0.029, 10, 40]} />
        <meshBasicMaterial
          color="#d8f7ff"
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ------------------------------------------------------
// WATER DROPLETS FLOWING DOWN AROUND THE SHIVLING
// ------------------------------------------------------

function FallingWater() {
  const groupRef = useRef<THREE.Group>(null);

  const particles = useMemo(
    () =>
      // Array.from({ length: 64 }, (_, i) => ({
      //   angle: i * 2.399963,
      //   phase: (i * 0.754877666) % 1,
      //   speed: 0.5 + (i % 7) * 0.075,
      //   radius: 0.30 + (i % 8) * 0.035,
      //   size: 0.008 + (i % 4) * 0.003,
      // })),
      Array.from({ length: 100 }, (_, i) => ({
      angle: i * 2.399963,
      phase: (i * 0.754877666) % 1,
      speed: 0.5 + (i % 7) * 0.075,
      radius: 0.32 + (i % 10) * 0.035,
      size: 0.010 + (i % 4) * 0.004,
    })),
    [],
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    groupRef.current.children.forEach((drop, i) => {
      const item = particles[i];
      const progress = (time * item.speed + item.phase) % 1;

      const angle = item.angle + Math.sin(time * 1.8 + i) * 0.04;
      const radius =
        item.radius + Math.sin(time * 2 + i) * 0.02;

      const y = 4.50 - progress * 3.55;

      drop.position.set(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius,
      );

      const size = item.size * (0.7 + progress * 0.4);
      drop.scale.set(size, size * 1.8, size);
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle, i) => (
        <mesh key={i} scale={0}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshPhysicalMaterial
            color="#d9f6ff"
            roughness={0.025}
            transparent
            opacity={0.85}
            clearcoat={1}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ------------------------------------------------------
// COMPLETE ABHISHEK EFFECT
// ------------------------------------------------------

// function AbhishekWater() {
//   return (
//     <group>
//       <WaterStream />
//       <StreamDroplets />
//       <CrownSplash />
//       <FallingWater />
//     </group>
//   );
// }
function AbhishekWater() {
  return (
    <group position={[-0.55, -1.06, 0]}>
      <WaterStream />
      <StreamDroplets />
      <CrownSplash />
      <ImpactBounce />
      <FallingWater />
    </group>
  );
}

function ImpactBounce() {
  const groupRef = useRef<THREE.Group>(null);

  const drops = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        angle: i * 2.399963,
        phase: (i * 0.61803398875) % 1,
        speed: 0.7 + (i % 5) * 0.12,
        // distance: 0.18 + (i % 6) * 0.045,
        // size: 0.009 + (i % 3) * 0.004,
        distance: 0.24 + (i % 8) * 0.065,
        size: 0.012 + (i % 4) * 0.005,
      })),
    [],
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    groupRef.current.children.forEach((drop, i) => {
      const p = drops[i];
      const progress = (time * p.speed + p.phase) % 1;

      // Each droplet rises, slows, then falls back.
      const arc = Math.sin(progress * Math.PI);

      const radius = p.distance * (0.25 + progress);

      drop.position.set(
        Math.cos(p.angle) * radius,
        4.98 + arc * 0.38 - progress * 0.12,
        Math.sin(p.angle) * radius,
      );

      const size = p.size * Math.sin(progress * Math.PI);
      drop.scale.set(size, size * 1.5, size);
    });
  });

  return (
    <group ref={groupRef}>
      {drops.map((_, i) => (
        <mesh key={i} scale={0}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshPhysicalMaterial
            color="#e8faff"
            roughness={0.02}
            transparent
            opacity={0.9}
            clearcoat={1}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ------------------------------------------------------
// DIYA LIGHTS
// ------------------------------------------------------

function Diya({
  position,
}: {
  position: [number, number, number];
}) {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const flicker =
      Math.sin(state.clock.elapsedTime * 8 + position[0]) * 0.12;

    if (flameRef.current) {
      flameRef.current.scale.y = 1 + flicker;
    }

    if (lightRef.current) {
      lightRef.current.intensity = 0.9 + flicker;
    }
  });

  return (
    <group position={position}>
      {/* <mesh>
        <cylinderGeometry args={[0.07, 0.095, 0.04, 24]} />
        <meshStandardMaterial
          color="#9b7042"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      <mesh ref={flameRef} position={[0, 0.075, 0]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshBasicMaterial color="#ffd18a" />
      </mesh> */}
      {/* Brass diya bowl */}
<mesh position={[0, 0, 0]}>
  <cylinderGeometry args={[0.105, 0.075, 0.055, 32]} />
  <meshStandardMaterial
    color="#d49a43"
    metalness={0.82}
    roughness={0.22}
  />
</mesh>

{/* Visible warm flame */}
<mesh ref={flameRef} position={[0, 0.075, 0]}>
  <sphereGeometry args={[0.038, 16, 16]} />
  <meshBasicMaterial color="#ffbd63" />
</mesh>

      <pointLight
        ref={lightRef}
        position={[0, 0.12, 0]}
        color="#ffb65d"
        intensity={0.9}
        distance={2}
        decay={2}
      />
    </group>
  );
}

// ------------------------------------------------------
// CENTRAL SANCTUARY
// ------------------------------------------------------

export default function CentralSanctuary() {
  const sanctuaryRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!sanctuaryRef.current) return;

    const time = state.clock.elapsedTime;

    // Gentle floating motion. No rotation of the central shrine.
    sanctuaryRef.current.position.y =
      -2.5 + Math.sin(time * 1.25) * 0.045;

    sanctuaryRef.current.rotation.set(0.05, 0, 0);
  });

  return (
    <group ref={sanctuaryRef}>
      {/* Actual floating rock island */}
      <FloatingIsland />

      {/* Subtle light beneath the island */}
      <pointLight
        position={[0, -0.55, 0]}
        color="#526dff"
        intensity={0.35}
        distance={4}
        decay={2}
      />

      <pointLight
        position={[-1.5, -0.1, 0.7]}
        color="#7967ff"
        intensity={0.25}
        distance={3}
        decay={2}
      />

      <pointLight
        position={[1.5, -0.1, -0.7]}
        color="#599dff"
        intensity={0.25}
        distance={3}
        decay={2}
      />

      {/* Original glossy Shivling model */}
      <ShivlingModel />

      {/* Continuous Abhishek water */}
      <AbhishekWater />

      {/* Real lotus models around the shrine */}
      {/* <Lotus position={[-1.35, 0.10, 0.65]} scale={0.85} />
      <Lotus position={[1.35, 0.10, 0.65]} scale={0.85} />
      <Lotus position={[0, 0.10, -1.55]} scale={0.75} />
      <Lotus position={[-1.65, 0.10, -0.7]} scale={0.70} />
      <Lotus position={[1.65, 0.10, -0.7]} scale={0.70} /> */}
      {/* Six larger lotus flowers around the shrine */}
{/* Flowers arranged around the Shivling base */}
<Lotus position={[-2.15, 0.10, 0.65]} scale={0.78} />
<Lotus position={[2.15, 0.10, 0.65]} scale={0.78} />

<Lotus position={[-1.75, 0.10, 1.75]} scale={0.82} />
<Lotus position={[1.75, 0.10, 1.75]} scale={0.82} />

<Lotus position={[-2.65, 0.10, -0.65]} scale={0.72} />
<Lotus position={[2.65, 0.10, -0.65]} scale={0.72} />

      {/* Warm diya lighting */}
      {/* <Diya position={[-1.85, 0.10, -0.15]} />
      <Diya position={[1.85, 0.10, -0.15]} />
      <Diya position={[-0.95, 0.10, -1.7]} />
      <Diya position={[0.95, 0.10, -1.7]} /> */}
      {/* Diya lamps close to the shrine */}
<Diya position={[-2.45, 0.13, 1.25]} />
<Diya position={[2.45, 0.13, 1.25]} />

<Diya position={[-1.45, 0.13, 2.05]} />
<Diya position={[1.45, 0.13, 2.05]} />

      {/* Soft ambient illumination */}
      <ambientLight intensity={0.3} color="#a6baff" />

      <hemisphereLight
        args={['#91b7ff', '#151020', 0.45]}
      />

      {/* Cool key light */}
      <pointLight
        position={[-1.1, 2.5, 2.2]}
        color="#8acfff"
        intensity={1.8}
        distance={6}
        decay={2}
      />

      <pointLight
        position={[1.2, 1.8, -1.4]}
        color="#a58aff"
        intensity={1.1}
        distance={5}
        decay={2}
      />

      {/* Soft overhead light */}
      <spotLight
        position={[0, 7, 1]}
        color="#d6eaff"
        intensity={2}
        angle={0.32}
        penumbra={0.85}
        distance={9}
        decay={2}
      />
    </group>
  );
}

// ------------------------------------------------------
// PRELOAD MODELS
// ------------------------------------------------------

useGLTF.preload('/models/shivling.glb');
useGLTF.preload('/models/floating_rocks.glb');
useGLTF.preload('/models/lilies.glb');
useGLTF.preload('/models/pixor-library-splash.glb');