// import { useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';

// /**
//  * Cosmic background: layered nebula gradient + starfield + drifting mist.
//  * No floor, no horizon — the universe fades into deep darkness.
//  */

// function Nebula() {
//   // A large inverted sphere with a custom gradient shader. Cheap and atmospheric.
//   const material = useMemo(() => {
//     return new THREE.ShaderMaterial({
//       side: THREE.BackSide,
//       depthWrite: false,
//       uniforms: {
//         uTime: { value: 0 },
//         uColorDeep: { value: new THREE.Color('#04050b') },
//         uColorNebulaA: { value: new THREE.Color('#16204a') },
//         uColorNebulaB: { value: new THREE.Color('#3a2a6a') },
//         uColorNebulaC: { value: new THREE.Color('#0a1838') },
//       },
//       vertexShader: /* glsl */ `
//         varying vec3 vPos;
//         void main() {
//           vPos = position;
//           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//         }
//       `,
//       fragmentShader: /* glsl */ `
//         varying vec3 vPos;
//         uniform float uTime;
//         uniform vec3 uColorDeep;
//         uniform vec3 uColorNebulaA;
//         uniform vec3 uColorNebulaB;
//         uniform vec3 uColorNebulaC;

//         // hash + value noise
//         float hash(vec3 p) {
//           p = fract(p * 0.3183099 + 0.1);
//           p *= 17.0;
//           return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
//         }
//         float noise(vec3 p) {
//           vec3 i = floor(p);
//           vec3 f = fract(p);
//           f = f * f * (3.0 - 2.0 * f);
//           return mix(
//             mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
//                 mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
//             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
//                 mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
//             f.z
//           );
//         }
//         float fbm(vec3 p) {
//           float v = 0.0; float a = 0.5;
//           for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
//           return v;
//         }

//         void main() {
//           vec3 dir = normalize(vPos);
//           // Base deep space
//           vec3 col = uColorDeep;
//           // Two large nebula clouds drifting slowly
//           float t = uTime * 0.012;
//           float n1 = fbm(dir * 2.2 + vec3(t, 0.0, -t * 0.5));
//           float n2 = fbm(dir * 3.1 + vec3(-t * 0.4, t * 0.7, t));
//           float mask1 = smoothstep(0.45, 0.85, n1);
//           float mask2 = smoothstep(0.5, 0.9, n2);
//           // Concentrate nebula toward upper hemisphere
//           float upper = smoothstep(-0.1, 0.6, dir.y);
//           col = mix(col, uColorNebulaA, mask1 * upper * 0.55);
//           col = mix(col, uColorNebulaB, mask2 * upper * 0.4);
//           col = mix(col, uColorNebulaC, mask1 * mask2 * 0.5);
//           // Deeper darkening at the bottom (no floor feeling)
//           col *= mix(0.35, 1.0, smoothstep(-0.6, 0.2, dir.y));
//           gl_FragColor = vec4(col, 1.0);
//         }
//       `,
//     });
//   }, []);

//   useFrame((_, delta) => {
//     material.uniforms.uTime.value += delta;
//   });

//   return (
//     <mesh material={material} scale={[-1, 1, 1]}>
//       <sphereGeometry args={[80, 32, 32]} />
//     </mesh>
//   );
// }

// function Starfield({ count = 1400 }: { count?: number }) {
//   const ref = useRef<THREE.Points>(null);
//   const { positions, sizes } = useMemo(() => {
//     const positions = new Float32Array(count * 3);
//     const sizes = new Float32Array(count);
//     for (let i = 0; i < count; i++) {
//       // Distribute on a large shell
//       const r = 35 + Math.random() * 30;
//       const theta = Math.random() * Math.PI * 2;
//       const phi = Math.acos(2 * Math.random() - 1);
//       positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
//       positions[i * 3 + 1] = r * Math.cos(phi);
//       positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
//       sizes[i] = Math.random() * 1.4 + 0.3;
//     }
//     return { positions, sizes };
//   }, [count]);

//   const material = useMemo(
//     () =>
//       new THREE.ShaderMaterial({
//         transparent: true,
//         depthWrite: false,
//         blending: THREE.AdditiveBlending,
//         uniforms: { uTime: { value: 0 } },
//         vertexShader: /* glsl */ `
//           attribute float size;
//           varying float vSize;
//           uniform float uTime;
//           void main() {
//             vSize = size;
//             vec4 mv = modelViewMatrix * vec4(position, 1.0);
//             // subtle twinkle
//             float tw = 0.7 + 0.3 * sin(uTime * 1.5 + position.x * 4.0 + position.y * 2.0);
//             gl_PointSize = size * tw * (300.0 / -mv.z);
//             gl_Position = projectionMatrix * mv;
//           }
//         `,
//         fragmentShader: /* glsl */ `
//           varying float vSize;
//           void main() {
//             vec2 c = gl_PointCoord - 0.5;
//             float d = length(c);
//             float a = smoothstep(0.5, 0.0, d);
//             vec3 col = mix(vec3(0.8, 0.9, 1.0), vec3(1.0, 0.95, 0.8), vSize / 1.7);
//             gl_FragColor = vec4(col, a * 0.9);
//           }
//         `,
//       }),
//     [],
//   );

//   useFrame((_, delta) => {
//     material.uniforms.uTime.value += delta;
//     if (ref.current) ref.current.rotation.y += delta * 0.005;
//   });

//   return (
//     <points ref={ref} material={material}>
//       <bufferGeometry>
//         <bufferAttribute attach="attributes-position" args={[positions, 3]} />
//         <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
//       </bufferGeometry>
//     </points>
//   );
// }

// /** A few distant galaxy-ish smudges via sprites. Very cheap. */
// function DistantGalaxies() {
//   const textures = useMemo(() => {
//     const make = (hue: [number, number, number]) => {
//       const c = document.createElement('canvas');
//       c.width = c.height = 128;
//       const ctx = c.getContext('2d')!;
//       const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
//       g.addColorStop(0, `rgba(${hue[0]},${hue[1]},${hue[2]},0.9)`);
//       g.addColorStop(0.4, `rgba(${hue[0]},${hue[1]},${hue[2]},0.25)`);
//       g.addColorStop(1, 'rgba(0,0,0,0)');
//       ctx.fillStyle = g;
//       ctx.fillRect(0, 0, 128, 128);
//       const t = new THREE.CanvasTexture(c);
//       t.colorSpace = THREE.SRGBColorSpace;
//       return t;
//     };
//     return [make([90, 120, 200]), make([120, 80, 180]), make([180, 160, 90])];
//   }, []);

//   const spots: Array<{ p: [number, number, number]; s: number; t: number }> = [
//     { p: [-22, 10, -30], s: 14, t: 0 },
//     { p: [24, 6, -34], s: 11, t: 1 },
//     { p: [4, 14, -38], s: 9, t: 2 },
//   ];

//   return (
//     <group>
//       {spots.map((sp, i) => (
//         <sprite key={i} position={sp.p} scale={[sp.s, sp.s, 1]}>
//           <spriteMaterial
//             map={textures[sp.t]}
//             transparent
//             depthWrite={false}
//             blending={THREE.AdditiveBlending}
//             opacity={0.55}
//           />
//         </sprite>
//       ))}
//     </group>
//   );
// }

// export default function CosmicBackground() {
//   return (
//     <group>
//       <Nebula />
//       <Starfield />
//       <DistantGalaxies />
//     </group>
//   );
// }


// import { useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';

// /**
//  * THE COSMIC FORGE
//  * Animated cosmic background with layered nebulae,
//  * drifting stars and soft distant light.
//  */

// function Nebula() {
//   const material = useMemo(
//     () =>
//       new THREE.ShaderMaterial({
//         side: THREE.BackSide,
//         depthWrite: false,
//         uniforms: {
//           uTime: { value: 0 },
//           uDeep: { value: new THREE.Color('#0b1023') },
//           uBlue: { value: new THREE.Color('#365db0') },
//           uViolet: { value: new THREE.Color('#76509e') },
//           uCyan: { value: new THREE.Color('#328ba5') },
//           uRose: { value: new THREE.Color('#62436f') },
//         },
//         vertexShader: /* glsl */ `
//           varying vec3 vDirection;

//           void main() {
//             vDirection = normalize(position);
//             gl_Position =
//               projectionMatrix *
//               modelViewMatrix *
//               vec4(position, 1.0);
//           }
//         `,
//         fragmentShader: /* glsl */ `
          
// varying vec3 vDirection;

// uniform float uTime;
// uniform vec3 uDeep;
// uniform vec3 uBlue;
// uniform vec3 uViolet;
// uniform vec3 uCyan;
// uniform vec3 uRose;

// float hash(vec3 p) {
//   p = fract(p * 0.3183099 + 0.1);
//   p *= 17.0;
//   return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
// }

// float noise(vec3 p) {
//   vec3 i = floor(p);
//   vec3 f = fract(p);
//   f = f * f * (3.0 - 2.0 * f);

//   float a = hash(i);
//   float b = hash(i + vec3(1.0, 0.0, 0.0));
//   float c = hash(i + vec3(0.0, 1.0, 0.0));
//   float d = hash(i + vec3(1.0, 1.0, 0.0));
//   float e = hash(i + vec3(0.0, 0.0, 1.0));
//   float f1 = hash(i + vec3(1.0, 0.0, 1.0));
//   float g = hash(i + vec3(0.0, 1.0, 1.0));
//   float h = hash(i + vec3(1.0, 1.0, 1.0));

//   return mix(
//     mix(mix(a, b, f.x), mix(c, d, f.x), f.y),
//     mix(mix(e, f1, f.x), mix(g, h, f.x), f.y),
//     f.z
//   );
// }

// float fbm(vec3 p) {
//   float value = 0.0;
//   float amplitude = 0.5;

//   for (int i = 0; i < 5; i++) {
//     value += amplitude * noise(p);
//     p = p * 2.02 + vec3(2.7, 1.9, 3.1);
//     amplitude *= 0.5;
//   }

//   return value;
// }

// void main() {
//   vec3 d = normalize(vDirection);
//   float t = uTime * 0.009;

//   // Multiple scales create broad clouds and finer wisps.
//   vec3 p1 = d * 2.8 + vec3(t, -t * 0.35, t * 0.2);
//   vec3 p2 = d * 5.2 + vec3(-t * 0.4, t * 0.25, t * 0.3);
//   vec3 p3 = d * 10.0 + vec3(t * 0.2, t * 0.1, -t * 0.25);

//   float broad = fbm(p1);
//   float detail = fbm(p2);
//   float fine = noise(p3);

//   // Clouds are concentrated above the sanctuary.
//   float upper = smoothstep(-0.35, 0.65, d.y);

//   // Irregular cloud boundaries rather than smooth colour blobs.
//   float clouds = smoothstep(0.39, 0.70, broad);
//   float wisps = smoothstep(0.43, 0.72, detail);
//   float fineClouds = smoothstep(0.48, 0.78, fine);

//   // Dark dust lanes break up the illuminated nebula.
//   float dust = smoothstep(0.40, 0.61, broad * 0.65 + detail * 0.35);

//   vec3 color = uDeep;

//   // Deep blue foundation.
//   color = mix(
//     color,
//     uBlue,
//     clouds * upper * 0.72
//   );

//   // Layered violet cloud banks.
//   color = mix(
//     color,
//     uViolet,
//     wisps * upper * 0.48
//   );

//   // Cool cyan light along selected cloud edges.
//   float cyanEdges = smoothstep(0.50, 0.72, detail)
//                   * (1.0 - smoothstep(0.70, 0.88, broad));

//   color = mix(
//     color,
//     uCyan,
//     cyanEdges * upper * 0.26
//   );

//   // Restrained rose-violet variation.
//   color = mix(
//     color,
//     uRose,
//     fineClouds * wisps * upper * 0.22
//   );

//   // Add fine, low-intensity structure to the cloud layers.
//   color += uBlue * fineClouds * clouds * upper * 0.055;

//   // Dust lanes absorb some light for cinematic contrast.
//   color *= 1.0 - dust * wisps * upper * 0.16;

//   // A faint distant blue glow, not a large neon hotspot.
//   float glow = exp(
//     -(
//       pow((d.x + 0.30) * 2.1, 2.0) +
//       pow((d.y - 0.24) * 2.4, 2.0)
//     )
//   );

//   color += uBlue * glow * 0.10;

//   // Keep the lower part subdued so islands remain readable.
//   float atmosphere = smoothstep(-0.75, 0.15, d.y);
//   color *= mix(0.72, 1.0, atmosphere);

//   gl_FragColor = vec4(color, 1.0);
// }

//           // varying vec3 vDirection;

//           // uniform float uTime;
//           // uniform vec3 uDeep;
//           // uniform vec3 uBlue;
//           // uniform vec3 uViolet;
//           // uniform vec3 uCyan;
//           // uniform vec3 uRose;

//           // float hash(vec3 p) {
//           //   p = fract(p * 0.3183099 + 0.1);
//           //   p *= 17.0;
//           //   return fract(
//           //     p.x * p.y * p.z *
//           //     (p.x + p.y + p.z)
//           //   );
//           // }

//           // float noise(vec3 p) {
//           //   vec3 i = floor(p);
//           //   vec3 f = fract(p);
//           //   f = f * f * (3.0 - 2.0 * f);

//           //   return mix(
//           //     mix(
//           //       mix(hash(i), hash(i + vec3(1,0,0)), f.x),
//           //       mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x),
//           //       f.y
//           //     ),
//           //     mix(
//           //       mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
//           //       mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x),
//           //       f.y
//           //     ),
//           //     f.z
//           //   );
//           // }

//           // float fbm(vec3 p) {
//           //   float value = 0.0;
//           //   float amplitude = 0.52;

//           //   for (int i = 0; i < 5; i++) {
//           //     value += amplitude * noise(p);
//           //     p = p * 2.03 + vec3(3.1, 1.7, 2.4);
//           //     amplitude *= 0.49;
//           //   }

//           //   return value;
//           // }

//           // void main() {
//           //   vec3 d = normalize(vDirection);

//           //   float t = uTime * 0.012;

//           //   vec3 driftA =
//           //     d * 3.0 + vec3(t * 0.65, -t * 0.25, t * 0.35);

//           //   vec3 driftB =
//           //     d * 4.5 + vec3(-t * 0.28, t * 0.42, -t * 0.18);

//           //   float n = fbm(driftA);
//           //   float m = fbm(driftB);

//           //   float clouds = smoothstep(0.34, 0.76, n);
//           //   float wisps = smoothstep(0.38, 0.80, m);

//           //   float upper = smoothstep(-0.60, 0.40, d.y);
//           //   float atmosphere = smoothstep(-0.95, -0.05, d.y);

//           //   vec3 color = uDeep;

//           //   // Broad blue nebula clouds
//           //   color = mix(
//           //     color,
//           //     uBlue,
//           //     clouds * upper * 0.88
//           //   );

//           //   // Violet clouds add depth
//           //   color = mix(
//           //     color,
//           //     uViolet,
//           //     wisps * upper * 0.64
//           //   );

//           //   // Cyan atmospheric wisps
//           //   color = mix(
//           //     color,
//           //     uCyan,
//           //     smoothstep(0.54, 0.84, n * m) * upper * 0.48
//           //   );

//           //   // Subtle rose-violet variation
//           //   color = mix(
//           //     color,
//           //     uRose,
//           //     smoothstep(0.55, 0.85, m) *
//           //     smoothstep(-0.1, 0.65, d.x) *
//           //     upper * 0.30
//           //   );

//           //   // Soft distant blue and violet light regions
//           //   float glowA = exp(
//           //     -dot(
//           //       d - vec3(-0.42, 0.25, -0.88),
//           //       d - vec3(-0.42, 0.25, -0.88)
//           //     ) * 3.5
//           //   );

//           //   float glowB = exp(
//           //     -dot(
//           //       d - vec3(0.55, 0.36, -0.75),
//           //       d - vec3(0.55, 0.36, -0.75)
//           //     ) * 4.2
//           //   );

//           //   color += uBlue * glowA * 0.22;
//           //   color += uViolet * glowB * 0.18;

//           //   // Keep the lower scene dark enough for the islands.
//           //   color *= mix(0.76, 1.0, atmosphere);

//           //   gl_FragColor = vec4(color, 1.0);
//           // }
//         `,
//       }),
//     []
//   );

//   useFrame((_, delta) => {
//     material.uniforms.uTime.value += delta;
//   });

//   return (
//     <mesh material={material} scale={[-1, 1, 1]}>
//       <sphereGeometry args={[80, 48, 48]} />
//     </mesh>
//   );
// }

// function StarLayer({
//   count,
//   radius,
//   size,
//   speed,
//   opacity,
// }: {
//   count: number;
//   radius: number;
//   size: number;
//   speed: number;
//   opacity: number;
// }) {
//   const ref = useRef<THREE.Points>(null);

//   const material = useMemo(
//     () =>
//       new THREE.ShaderMaterial({
//         transparent: true,
//         depthWrite: false,
//         blending: THREE.AdditiveBlending,
//         uniforms: {
//           uTime: { value: 0 },
//           uOpacity: { value: opacity },
//           uSize: { value: size },
//         },
//         vertexShader: /* glsl */ `
//           attribute float aSize;
//           attribute float aPhase;

//           varying float vTwinkle;

//           uniform float uTime;
//           uniform float uSize;

//           void main() {
//             vec4 mv = modelViewMatrix * vec4(position, 1.0);

//             vTwinkle =
//               0.66 + 0.34 *
//               sin(uTime * 1.35 + aPhase);

//             gl_PointSize =
//               uSize * aSize * vTwinkle *
//               (280.0 / max(1.0, -mv.z));

//             gl_Position = projectionMatrix * mv;
//           }
//         `,
//         fragmentShader: /* glsl */ `
//           varying float vTwinkle;
//           uniform float uOpacity;

//           void main() {
//             vec2 p = gl_PointCoord - 0.5;
//             float d = length(p);

//             float alpha =
//               1.0 - smoothstep(0.08, 0.5, d);

//             vec3 color = mix(
//               vec3(0.48, 0.68, 1.0),
//               vec3(1.0, 0.91, 0.75),
//               vTwinkle
//             );

//             gl_FragColor = vec4(
//               color,
//               alpha * uOpacity * vTwinkle
//             );
//           }
//         `,
//       }),
//     [opacity, size]
//   );

//   const { positions, sizes, phases } = useMemo(() => {
//     const positions = new Float32Array(count * 3);
//     const sizes = new Float32Array(count);
//     const phases = new Float32Array(count);

//     for (let i = 0; i < count; i++) {
//       const r = radius + Math.random() * radius * 0.55;
//       const theta = Math.random() * Math.PI * 2;
//       const phi = Math.acos(2 * Math.random() - 1);

//       positions[i * 3] =
//         r * Math.sin(phi) * Math.cos(theta);

//       positions[i * 3 + 1] =
//         r * Math.cos(phi);

//       positions[i * 3 + 2] =
//         r * Math.sin(phi) * Math.sin(theta);

//       sizes[i] = 0.45 + Math.random() * 1.6;
//       phases[i] = Math.random() * Math.PI * 2;
//     }

//     return { positions, sizes, phases };
//   }, [count, radius]);

//   useFrame((_, delta) => {
//     material.uniforms.uTime.value += delta;

//     if (ref.current) {
//       ref.current.rotation.y += delta * speed;
//     }
//   });

//   return (
//     <points ref={ref} material={material}>
//       <bufferGeometry>
//         <bufferAttribute
//           attach="attributes-position"
//           args={[positions, 3]}
//         />
//         <bufferAttribute
//           attach="attributes-aSize"
//           args={[sizes, 1]}
//         />
//         <bufferAttribute
//           attach="attributes-aPhase"
//           args={[phases, 1]}
//         />
//       </bufferGeometry>
//     </points>
//   );
// }

// function CloudGlow({
//   position,
//   color,
//   scale,
//   speed,
// }: {
//   position: [number, number, number];
//   color: string;
//   scale: number;
//   speed: number;
// }) {
//   const ref = useRef<THREE.Sprite>(null);

//   const texture = useMemo(() => {
//     const canvas = document.createElement('canvas');
//     canvas.width = canvas.height = 256;

//     const ctx = canvas.getContext('2d')!;

//     const gradient = ctx.createRadialGradient(
//       128, 128, 2,
//       128, 128, 128
//     );

//     gradient.addColorStop(
//       0,
//       'rgba(255,255,255,0.62)'
//     );

//     gradient.addColorStop(
//       0.16,
//       'rgba(255,255,255,0.28)'
//     );

//     gradient.addColorStop(
//       0.48,
//       'rgba(255,255,255,0.07)'
//     );

//     gradient.addColorStop(
//       1,
//       'rgba(255,255,255,0)'
//     );

//     ctx.fillStyle = gradient;
//     ctx.fillRect(0, 0, 256, 256);

//     const tex = new THREE.CanvasTexture(canvas);
//     tex.colorSpace = THREE.SRGBColorSpace;

//     return tex;
//   }, []);

//   useFrame((state) => {
//     if (!ref.current) return;

//     const time = state.clock.elapsedTime * speed;

//     ref.current.position.y =
//       position[1] + Math.sin(time) * 0.22;

//     ref.current.material.opacity =
//       0.34 + Math.sin(time * 0.7) * 0.08;

//     ref.current.scale.setScalar(
//       scale * (1 + Math.sin(time * 0.4) * 0.035)
//     );
//   });

//   return (
//     <sprite
//       ref={ref}
//       position={position}
//       scale={[scale, scale, 1]}
//     >
//       <spriteMaterial
//         map={texture}
//         color={color}
//         transparent
//         opacity={0.36}
//         depthWrite={false}
//         blending={THREE.AdditiveBlending}
//       />
//     </sprite>
//   );
// }

// function DistantGalaxies() {
//   const group = useRef<THREE.Group>(null);

//   useFrame((_, delta) => {
//     if (group.current) {
//       group.current.rotation.y += delta * 0.002;
//     }
//   });

//   return (
//     <group ref={group}>
//       <CloudGlow
//         position={[-20, 8, -31]}
//         color="#7899ff"
//         scale={21}
//         speed={0.12}
//       />

//       <CloudGlow
//         position={[22, 5, -35]}
//         color="#b18aeb"
//         scale={18}
//         speed={0.09}
//       />

//       <CloudGlow
//         position={[2, 15, -40]}
//         color="#e4cf98"
//         scale={13}
//         speed={0.07}
//       />

//       <CloudGlow
//         position={[-7, -2, -37]}
//         color="#49a6c1"
//         scale={14}
//         speed={0.08}
//       />
//     </group>
//   );
// }

// export default function CosmicBackground() {
//   return (
//     <group>
//       <Nebula />

//       <StarLayer
//         count={1750}
//         radius={38}
//         size={1.1}
//         speed={0.0035}
//         opacity={0.82}
//       />

//       <StarLayer
//         count={430}
//         radius={24}
//         size={1.7}
//         speed={-0.006}
//         opacity={0.58}
//       />

//       <DistantGalaxies />
//     </group>
//   );
// }




import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const BACKGROUND_IMAGE = '/cosmic-shiva-background.png';
const IMAGE_ASPECT = 1672 / 941;

function CosmicImage() {
  const { camera, size } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  const texture = useMemo(() => {
    const image = new THREE.TextureLoader().load(BACKGROUND_IMAGE);
    image.colorSpace = THREE.SRGBColorSpace;
    image.minFilter = THREE.LinearMipmapLinearFilter;
    image.magFilter = THREE.LinearFilter;
    image.generateMipmaps = true;
    image.wrapS = THREE.ClampToEdgeWrapping;
    image.wrapT = THREE.ClampToEdgeWrapping;
    return image;
  }, []);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  useFrame((state) => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    if (!mesh || !material) return;

    const distance = 55;
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    mesh.position
      .copy(camera.position)
      .addScaledVector(direction, distance);

    mesh.quaternion.copy(camera.quaternion);

    const viewHeight =
      camera instanceof THREE.PerspectiveCamera
        ? 2 *
          Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) *
          distance
        : 40;

    const viewWidth =
      viewHeight * (size.width / Math.max(size.height, 1));

    // Preserve the source image's aspect ratio.
    // Small overscan hides edges without excessive zoom.
    // const overscan = 1.035;
    // const planeHeight = Math.max(
    //   viewHeight * overscan,
    //   (viewWidth * overscan) / IMAGE_ASPECT
    // );

    // const planeWidth = planeHeight * IMAGE_ASPECT;

    // mesh.scale.set(planeWidth, planeHeight, 1);

    // Responsive framing for laptops and phones.
    const isMobile = size.width < 700;

    const overscan = isMobile ? 1.04 : 1.025;

    // Slightly zoom out on laptop screens.
    // On phones, prioritize keeping Shiva visible vertically.
    const planeHeight = isMobile
      ? Math.max(
          viewHeight * overscan,
          (viewWidth * overscan) / IMAGE_ASPECT
        )
      : Math.max(
          viewHeight * overscan,
          (viewWidth * overscan) / IMAGE_ASPECT
        );

    const planeWidth = planeHeight * IMAGE_ASPECT;

    mesh.scale.set(planeWidth, planeHeight, 1);

    // Shift the image down slightly to provide more headroom.
    const verticalOffset = isMobile ? 0.015 : 0.035;

    mesh.position.addScaledVector(
      camera.up,
      -viewHeight * verticalOffset
    );

    // Slow, restrained atmospheric movement.
    const time = state.clock.elapsedTime;

    mesh.position.addScaledVector(
      camera.up,
      Math.sin(time * 0.16) * 0.018
    );

    material.opacity = 0.985 + Math.sin(time * 0.22) * 0.01;
  });

  return (
    <mesh
      ref={meshRef}
      renderOrder={-100}
      frustumCulled={false}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent={false}
        opacity={1}
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function StarField({
  count = 1100,
  radius = 38,
  speed = 0.003,
  opacity = 0.6,
}: {
  count?: number;
  radius?: number;
  speed?: number;
  opacity?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.72 + Math.random() * 0.28);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const choice = Math.random();
      color.set(
        choice > 0.94
          ? '#ffe1b0'
          : choice > 0.66
            ? '#9dbdff'
            : '#e5eaff'
      );

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const result = new THREE.BufferGeometry();
    result.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    result.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3)
    );

    return result;
  }, [count, radius]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.065,
        vertexColors: true,
        transparent: true,
        opacity,
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
      }),
    [opacity]
  );

  useFrame((state, delta) => {
    const points = pointsRef.current;
    const mat = materialRef.current;
    if (!points || !mat) return;

    const time = state.clock.elapsedTime;

    points.rotation.y += delta * speed;
    points.rotation.x += delta * speed * 0.12;

    // Gentle star shimmer.
    mat.opacity = opacity * (
      0.86 + 0.14 * (0.5 + 0.5 * Math.sin(time * 0.7))
    );
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  );
}

function AmbientGlow() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const time = state.clock.elapsedTime;
    group.rotation.y = Math.sin(time * 0.08) * 0.006;
    group.position.y = Math.sin(time * 0.24) * 0.025;
  });

  return (
    <group ref={groupRef}>
      <pointLight
        position={[-12, 8, -18]}
        color="#587cff"
        intensity={0.45}
        distance={45}
        decay={2}
      />
      <pointLight
        position={[12, 5, -22]}
        color="#a77aff"
        intensity={0.32}
        distance={40}
        decay={2}
      />
      <pointLight
        position={[0, 12, -28]}
        color="#e2c18c"
        intensity={0.16}
        distance={35}
        decay={2}
      />
    </group>
  );
}


// function LivingCosmos() {
//   const { camera, size } = useThree();
//   const pointsRef = useRef<THREE.Points>(null);
//   const materialRef = useRef<THREE.ShaderMaterial>(null);

//   const particleCount = size.width < 700 ? 180 : 360;

//   const geometry = useMemo(() => {
//     const positions = new Float32Array(particleCount * 3);
//     const phases = new Float32Array(particleCount);
//     const scales = new Float32Array(particleCount);

//     for (let i = 0; i < particleCount; i++) {
//       // Normalized image-plane coordinates.
//       positions[i * 3] = (Math.random() - 0.5) * 100;
//       positions[i * 3 + 1] = (Math.random() - 0.5) * 56.25;
//       positions[i * 3 + 2] = 0;

//       phases[i] = Math.random() * Math.PI * 2;
//       scales[i] = 0.45 + Math.random() * 1.1;
//     }

//     const geo = new THREE.BufferGeometry();
//     geo.setAttribute(
//       'position',
//       new THREE.BufferAttribute(positions, 3)
//     );
//     geo.setAttribute(
//       'aPhase',
//       new THREE.BufferAttribute(phases, 1)
//     );
//     geo.setAttribute(
//       'aScale',
//       new THREE.BufferAttribute(scales, 1)
//     );

//     return geo;
//   }, [particleCount]);

//   const material = useMemo(
//     () =>
//       new THREE.ShaderMaterial({
//         transparent: true,
//         depthWrite: false,
//         depthTest: true,
//         blending: THREE.AdditiveBlending,
//         uniforms: {
//           uTime: { value: 0 },
//         },
//         vertexShader: `
//           attribute float aPhase;
//           attribute float aScale;

//           uniform float uTime;

//           varying float vAlpha;
//           varying float vWarm;

//           void main() {
//             vec3 p = position;

//             // Slow, drifting movement.
//             p.x += sin(uTime * 0.12 + aPhase) * 0.55;
//             p.y += mod(
//               position.y + 28.125 + uTime * (0.10 + aScale * 0.035),
//               56.25
//             ) - 28.125 - position.y;

//             float twinkle =
//               0.55 + 0.45 * sin(uTime * 0.8 + aPhase * 2.0);

//             vAlpha = twinkle;
//             vWarm = step(0.82, aScale);

//             vec4 mvPosition =
//               modelViewMatrix * vec4(p, 1.0);

//             gl_Position = projectionMatrix * mvPosition;
//             gl_PointSize = (1.1 + aScale * 1.1) *
//               (180.0 / max(1.0, -mvPosition.z));
//           }
//         `,
//         fragmentShader: `
//           varying float vAlpha;
//           varying float vWarm;

//           void main() {
//             vec2 centered = gl_PointCoord - vec2(0.5);
//             float d = length(centered);

//             if (d > 0.5) discard;

//             float glow = exp(-d * 12.0);
//             float core = exp(-d * 35.0);

//             vec3 coolColor = vec3(0.48, 0.62, 1.0);
//             vec3 warmColor = vec3(1.0, 0.67, 0.36);

//             vec3 color = mix(coolColor, warmColor, vWarm);

//             gl_FragColor = vec4(
//               color,
//               (glow * 0.28 + core * 0.45) * vAlpha
//             );
//           }
//         `,
//       }),
//     []
//   );

//   useFrame((state) => {
//     const points = pointsRef.current;
//     const shader = materialRef.current;

//     if (!points || !shader) return;

//     const distance = 53;
//     const direction = new THREE.Vector3();
//     camera.getWorldDirection(direction);

//     points.position
//       .copy(camera.position)
//       .addScaledVector(direction, distance);

//     points.quaternion.copy(camera.quaternion);

//     const height =
//       camera instanceof THREE.PerspectiveCamera
//         ? 2 *
//           Math.tan(
//             THREE.MathUtils.degToRad(camera.fov) / 2
//           ) *
//           distance
//         : 40;

//     const width = height * (size.width / Math.max(size.height, 1));

//     points.scale.set(width / 100, height / 56.25, 1);
//     shader.uniforms.uTime.value = state.clock.elapsedTime;
//   });

//   useEffect(() => {
//     return () => {
//       geometry.dispose();
//       material.dispose();
//     };
//   }, [geometry, material]);

//   return (
//     <points
//       ref={pointsRef}
//       geometry={geometry}
//       material={material}
//       frustumCulled={false}
//       renderOrder={-50}
//     />
//   );
// }

function LivingCosmos() {
  const { camera, size } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const isMobile = size.width < 700;
  const particleCount = isMobile ? 240 : 520;

  const geometry = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);
    const warmth = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 56.25;
      positions[i * 3 + 2] = 0;

      phases[i] = Math.random() * Math.PI * 2;
      sizes[i] = 0.65 + Math.random() * 1.35;
      warmth[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();

    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    geo.setAttribute(
      'aPhase',
      new THREE.BufferAttribute(phases, 1)
    );
    geo.setAttribute(
      'aSize',
      new THREE.BufferAttribute(sizes, 1)
    );
    geo.setAttribute(
      'aWarmth',
      new THREE.BufferAttribute(warmth, 1)
    );

    return geo;
  }, [particleCount]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: true,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: `
          attribute float aPhase;
          attribute float aSize;
          attribute float aWarmth;

          uniform float uTime;

          varying float vAlpha;
          varying float vWarmth;

          void main() {
            vec3 p = position;

            // Noticeable but slow upward movement.
            float driftSpeed = 0.22 + aSize * 0.10;

            p.y = mod(
              position.y + 28.125 + uTime * driftSpeed,
              56.25
            ) - 28.125;

            // Gentle sideways wandering.
            p.x += sin(uTime * 0.20 + aPhase) * 0.75;
            p.x += cos(uTime * 0.09 + aPhase * 1.7) * 0.25;

            // Each particle twinkles at a different rate.
            float shimmer =
              0.60 + 0.40 *
              (0.5 + 0.5 * sin(uTime * 1.35 + aPhase));

            vAlpha = shimmer;
            vWarmth = aWarmth;

            vec4 mvPosition =
              modelViewMatrix * vec4(p, 1.0);

            gl_Position = projectionMatrix * mvPosition;

            // Brighter, larger particles with a soft glow.
            gl_PointSize = (2.5 + aSize * 4.0) *
              (100.0 / max(1.0, -mvPosition.z));
          }
        `,
        fragmentShader: `
          varying float vAlpha;
          varying float vWarmth;

          void main() {
            vec2 uv = gl_PointCoord - vec2(0.5);
            float d = length(uv);

            if (d > 0.5) discard;

            float halo = exp(-d * 9.0);
            float brightCore = exp(-d * 28.0);

            vec3 violetBlue = vec3(0.40, 0.48, 1.0);
            vec3 iceBlue = vec3(0.58, 0.82, 1.0);
            vec3 gold = vec3(1.0, 0.66, 0.36);

            vec3 color = mix(
              violetBlue,
              iceBlue,
              smoothstep(0.15, 0.75, vWarmth)
            );

            color = mix(
              color,
              gold,
              smoothstep(0.88, 1.0, vWarmth)
            );

            float alpha =
              (halo * 0.42 + brightCore * 0.75) * vAlpha;

            gl_FragColor = vec4(color, alpha);
          }
        `,
      }),
    []
  );

  useFrame((state) => {
    const points = pointsRef.current;
    const shader = materialRef.current;

    if (!points || !shader) return;

    const distance = 53;
    const direction = new THREE.Vector3();

    camera.getWorldDirection(direction);

    points.position
      .copy(camera.position)
      .addScaledVector(direction, distance);

    points.quaternion.copy(camera.quaternion);

    const visibleHeight =
      camera instanceof THREE.PerspectiveCamera
        ? 2 *
          Math.tan(
            THREE.MathUtils.degToRad(camera.fov) / 2
          ) *
          distance
        : 40;

    const aspect = size.width / Math.max(size.height, 1);
    const visibleWidth = visibleHeight * aspect;

    points.scale.set(
      visibleWidth / 100,
      visibleHeight / 56.25,
      1
    );

    shader.uniforms.uTime.value = state.clock.elapsedTime;
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      frustumCulled={false}
      renderOrder={-50}
    />
  );
}


function AnimatedNebula() {
  const { camera, size } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 1.25 },
        },
        vertexShader: `
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix *
              modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          
uniform float uTime;
uniform float uIntensity;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;

  for (int i = 0; i < 6; i++) {
    value += noise(p) * amp;
    p = p * 2.0 + vec2(4.7, 8.3);
    amp *= 0.5;
  }

  return value;
}

void main() {
  vec2 uv = vUv;
  float t = uTime;

  // Two independently moving currents create evolving cloud shapes.
  vec2 flow1 = vec2(t * 0.025, -t * 0.012);
  vec2 flow2 = vec2(-t * 0.014, t * 0.019);

  float broad = fbm(uv * 3.2 + flow1);
  float detail = fbm(uv * 7.0 + flow2);

  vec2 warped = uv;
  warped += (vec2(
    fbm(uv * 3.0 + flow2),
    fbm(uv * 3.0 - flow1)
  ) - 0.5) * 0.16;

  float clouds = fbm(warped * 4.2 + flow1);
  clouds = clouds * 0.68 + detail * 0.32;

  // Broad, uneven nebula bands with wispy edges.
  float filaments = sin(
    warped.x * 12.0 +
    warped.y * 7.0 +
    broad * 10.0 +
    t * 0.12
  );

  float density = smoothstep(
    0.34,
    0.69,
    clouds + filaments * 0.045
  );

  // Keep the central Shiva face clearer.
  float centerDistance = distance(uv, vec2(0.5, 0.58));
  float centerMask = smoothstep(0.08, 0.38, centerDistance);

  vec3 deepBlue = vec3(0.08, 0.20, 0.78);
  vec3 electricBlue = vec3(0.20, 0.48, 1.0);
  vec3 violet = vec3(0.48, 0.12, 0.92);
  vec3 magenta = vec3(0.80, 0.20, 0.68);
  vec3 amber = vec3(1.0, 0.40, 0.12);

  vec3 color = mix(deepBlue, violet, smoothstep(0.25, 0.8, broad));
  color = mix(color, electricBlue, smoothstep(0.48, 0.78, detail) * 0.8);
  color = mix(color, magenta, smoothstep(0.60, 0.82, broad) * 0.55);

  float warmClouds = smoothstep(0.63, 0.83, fbm(uv * 3.0 + flow2));
  color = mix(color, amber, warmClouds * 0.5);

  // A softly glowing cloud layer, not a full-screen color wash.
  float alpha = density * (0.28 + centerMask * 0.18);
  alpha *= smoothstep(0.30, 0.68, broad);
  alpha *= uIntensity;

  gl_FragColor = vec4(color, alpha);
}
        `,
      }),
    []
  );

  useFrame((state) => {
    const mesh = meshRef.current;
    const shader = materialRef.current;

    if (!mesh || !shader) return;

    const distance = 54;
    const direction = new THREE.Vector3();

    camera.getWorldDirection(direction);

    mesh.position
      .copy(camera.position)
      .addScaledVector(direction, distance);

    mesh.quaternion.copy(camera.quaternion);

    const visibleHeight =
      camera instanceof THREE.PerspectiveCamera
        ? 2 *
          Math.tan(
            THREE.MathUtils.degToRad(camera.fov) / 2
          ) *
          distance
        : 40;

    const visibleWidth =
      visibleHeight * (size.width / Math.max(size.height, 1));

    // Slight overscan prevents uncovered edges.
    mesh.scale.set(
      visibleWidth * 1.04,
      visibleHeight * 1.04,
      1
    );

    shader.uniforms.uTime.value = state.clock.elapsedTime;
  });

  useEffect(() => {
    return () => material.dispose();
  }, [material]);

  return (
    <mesh
      ref={meshRef}
      renderOrder={-90}
      frustumCulled={false}
    >
      <planeGeometry args={[1, 1]} />
      <primitive
        object={material}
        attach="material"
        ref={materialRef}
      />
    </mesh>
  );
}

export default function CosmicBackground() {
  return (
    <group>
      {/* Deep indigo base complements the artwork at tiny exposed edges. */}
      <color attach="background" args={['#10132b']} />

      <CosmicImage />
      <AnimatedNebula />
      <LivingCosmos />

      <StarField
        count={1100}
        radius={38}
        speed={0.003}
        opacity={0.48}
      />

      <StarField
        count={320}
        radius={24}
        speed={-0.004}
        opacity={0.32}
      />

      <AmbientGlow />
    </group>
  );
}
