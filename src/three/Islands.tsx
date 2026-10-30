import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { IslandBase, GlowSprite } from './IslandBase';
import { brushedMetalMat, goldMat, cyanMat, violetMat, crystalMat, stoneMat } from './materials';


function IslandModel({
  path,
  position,
  targetSize,
  rotation = [0, 0, 0],
}: {
  path: string;
  position: [number, number, number];
  targetSize: number;
  rotation?: [number, number, number];
}) {
  const { scene } = useGLTF(path);

  const model = useMemo(() => {
    const root = scene.clone(true);

    // Clone materials so changes affect only this island's models.
root.traverse((child) => {
  if (!(child instanceof THREE.Mesh)) return;

  const materials = Array.isArray(child.material)
    ? child.material
    : [child.material];

  const updatedMaterials = materials.map((original) => {
    const mat = original.clone();

    // Enhance Kali Linux model only
if (path.includes('kali_linux')) {
  if (mat.color) {
    mat.color.multiplyScalar(1.2);
  }

  if ('emissive' in mat && mat.emissive) {
    mat.emissive.set('#246bff');
    mat.emissiveIntensity = 0.35;
  }
}

    // Gaming PC: pure black materials hide the cabinet details.
    if (
      path.includes('gaming_pc') &&
      mat.color &&
      mat.color.r < 0.03 &&
      mat.color.g < 0.03 &&
      mat.color.b < 0.03
    ) {
      mat.color.set('#252a35');

      if ('roughness' in mat) mat.roughness = 0.48;
      if ('metalness' in mat) mat.metalness = 0.28;
    }

    return mat;
  });

  child.material = Array.isArray(child.material)
    ? updatedMaterials
    : updatedMaterials[0];
});

    root.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(root);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());

    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = targetSize / maxDimension;

    root.scale.setScalar(scale);
    root.position.copy(center).multiplyScalar(-scale);

    root.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return root;
  }, [scene, targetSize]);

  return (
    <group position={position} rotation={rotation}>
      <primitive object={model} />
    </group>
  );
}

/* ============================================================
   ABOUT ISLAND — Illuminated personal technology workstation
   ============================================================ */

export function AboutIsland({ hover }: { hover: boolean }) {
  const islandRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!islandRef.current) return;

    const time = state.clock.elapsedTime;

    // Floating animation — preserve existing movement
    // Move the entire About island left and upward
    islandRef.current.position.x = -2;
    islandRef.current.position.y =
      2.0 + Math.sin(time * 0.65) * 0.10;

    // 360-degree continuous rotation — 60 seconds
    islandRef.current.rotation.y +=
      delta * (Math.PI * 2 / 60);
  });

  return (
    <group ref={islandRef}>
      <IslandBase hover={hover} flat scale={1.5}>

        {/* Workstation arrangement */}
        <group position={[-0.15, 0.38, 0]}>

          {/* GAMING PC — LEFT */}
          <IslandModel
            path="/models/gaming_pc.glb"
            position={[-0.88, 0.48, 0.25]}
            targetSize={1.55}
            rotation={[0, 0.45, 0]}
          />

          {/* CURVED MONITOR — CENTRE BACK */}
          <IslandModel
            path="/models/curved_gaming_monitor.glb"
            position={[0.50, 0.08, -0.92]}
            targetSize={1.55}
            rotation={[0, -0.12, 0]}
          />

          {/* KEYBOARD — FRONT */}
          <IslandModel
            path="/models/pc_keyboard.glb"
            position={[0.55, 0, -0.35]}
            targetSize={1.30}
            rotation={[1, 0, 0]}
          />

          {/* KALI LINUX — RIGHT */}
          <IslandModel
            path="/models/kali_linux.glb"
            position={[0.88, 0.19, 0.55]}
            targetSize={1.45}
            rotation={[0, -0.35, 0]}
          />

          {/* =====================================
              WORKSTATION LIGHTING
              ===================================== */}

          {/* General soft white illumination */}
          {/* <hemisphereLight
            args={["#ffffff", "#687080", 2.0]}
          /> */}

          {/* Main directional light */}
          {/* <directionalLight
            position={[-2, 5, 4]}
            intensity={3.0}
            color="#ffffff"
          /> */}

          {/* Front illumination */}
          {/* <pointLight
            position={[0, 1.5, 3]}
            intensity={15}
            color="#ffffff"
            distance={8}
            decay={1.3}
          /> */}

          {/* Left illumination — PC */}
          {/* <pointLight
            position={[-1.5, 1.5, 1]}
            intensity={12}
            color="#ffffff"
            distance={6}
            decay={1.3}
          /> */}

          {/* Right illumination — Kali model */}
          {/* <pointLight
            position={[1.5, 1.5, 1]}
            intensity={12}
            color="#ffffff"
            distance={6}
            decay={1.3}
          /> */}

          {/* Rear illumination — monitor */}
          {/* <pointLight
            position={[0, 2, -1.5]}
            intensity={10}
            color="#b8eaff"
            distance={5}
            decay={1.5}
          /> */}

          {/* Subtle gaming PC red reflection */}
          {/* <pointLight
            position={[-1, 0.9, -0.4]}
            intensity={3}
            color="#ff4545"
            distance={3}
            decay={2}
          /> */}

          {/* Local workstation lighting — does not globally brighten Shiva */}

{/* Soft white light from the front */}
<pointLight
  position={[0, 1.0, 1.8]}
  intensity={3.5}
  color="#ffffff"
  distance={3.8}
  decay={2}
/>

{/* PC illumination */}
<pointLight
  position={[-1.1, 0.9, 0.5]}
  intensity={3.0}
  color="#dceaff"
  distance={3.0}
  decay={2}
/>

{/* Monitor and Kali illumination */}
<pointLight
  position={[1.0, 1.0, -0.3]}
  intensity={3.0}
  color="#dceaff"
  distance={3.0}
  decay={2}
/>

{/* Very subtle red accent */}
<pointLight
  position={[-1.0, 0.6, -0.4]}
  intensity={0.7}
  color="#ff3030"
  distance={2.0}
  decay={2}
/>

        </group>
      </IslandBase>
    </group>
  );
}

/* ============================================================
   Island 2 — PROJECTS: hardware + software exhibit, 3 groups.
   ============================================================ */
// export function ProjectsIsland({ hover }: { hover: boolean }) {
//   return (
//     <IslandBase hover={hover} scale={1.15}>
//       {/* Group A: embedded hardware (left) */}
//       {/* ESP32 board */}
//       <mesh material={brushedMetalMat} position={[-0.85, 0.35, -0.2]}>
//         <boxGeometry args={[0.4, 0.05, 0.5]} />
//       </mesh>
//       {/* pins */}
//       {Array.from({ length: 6 }).map((_, i) => (
//         <mesh key={`p${i}`} position={[-0.85 - 0.18, 0.37, -0.4 + i * 0.08]}>
//           <boxGeometry args={[0.08, 0.04, 0.04]} />
//           <meshStandardMaterial color="#222" metalness={0.9} roughness={0.4} />
//         </mesh>
//       ))}
//       {/* Raspberry Pi 5 board */}
//       <mesh material={brushedMetalMat} position={[-0.5, 0.35, 0.45]}>
//         <boxGeometry args={[0.45, 0.05, 0.6]} />
//       </mesh>
//       {/* Camera module */}
//       <mesh position={[-0.15, 0.35, 0.2]}>
//         <boxGeometry args={[0.16, 0.1, 0.16]} />
//         <meshStandardMaterial color="#111" roughness={0.5} />
//       </mesh>
//       <mesh position={[-0.15, 0.41, 0.2]}>
//         <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
//         <meshStandardMaterial color="#000" metalness={0.6} roughness={0.2} />
//       </mesh>
//       {/* Breadboard */}
//       <mesh position={[-1.0, 0.35, 0.5]}>
//         <boxGeometry args={[0.3, 0.05, 0.3]} />
//         <meshStandardMaterial color="#f5f5f5" roughness={0.6} />
//       </mesh>
//       {/* wires */}
//       {Array.from({ length: 4 }).map((_, i) => (
//         <mesh key={`w${i}`} position={[-1.0 + (i - 1.5) * 0.06, 0.42, 0.5 + (i % 2) * 0.05]}>
//           <boxGeometry args={[0.03, 0.1, 0.03]} />
//           <meshStandardMaterial color={i % 2 ? '#c8a86a' : '#6fd0e6'} />
//         </mesh>
//       ))}

//       {/* Group B: SmartKheti / Coast Scan (center) */}
//       {/* soil probe */}
//       <mesh position={[0.05, 0.6, -0.1]}>
//         <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
//         <meshStandardMaterial color="#888" metalness={0.7} roughness={0.4} />
//       </mesh>
//       {/* crop sample */}
//       <mesh position={[0.35, 0.45, -0.35]}>
//         <coneGeometry args={[0.1, 0.3, 6]} />
//         <meshStandardMaterial color="#3a6a3a" roughness={0.9} flatShading />
//       </mesh>
//       {/* sand specimen tray */}
//       <mesh position={[0.35, 0.34, 0.25]}>
//         <cylinderGeometry args={[0.18, 0.16, 0.06, 16]} />
//         <meshStandardMaterial color="#d8c89a" roughness={0.95} />
//       </mesh>

//       {/* Group C: Newsly / software (right) */}
//       {/* monitor */}
//       <mesh material={brushedMetalMat} position={[0.85, 0.4, 0.0]}>
//         <boxGeometry args={[0.42, 0.28, 0.03]} />
//       </mesh>
//       <mesh position={[0.85, 0.4, 0.02]}>
//         <planeGeometry args={[0.38, 0.24]} />
//         <meshBasicMaterial color="#0a1428" />
//       </mesh>
//       {/* news-feed article rectangles */}
//       {Array.from({ length: 4 }).map((_, i) => (
//         <mesh key={`a${i}`} position={[0.85, 0.46 - i * 0.08, 0.025]}>
//           <planeGeometry args={[0.34, 0.04]} />
//           <meshBasicMaterial color={i % 2 ? '#1a3a5a' : '#2a4a6a'} />
//         </mesh>
//       ))}
//       <GlowSprite color="rgb(110,180,220)" size={1.8} position={[0, 0.7, 0]} />
//       <pointLight position={[0, 0.8, 0.2]} intensity={1.6} color="#6fd0e6" distance={3.2} />
//     </IslandBase>
//   );
// }


/* ============================================================
   PROJECTS ISLAND — Hardware + Software 3D showcase
   Same platform, floating and rotation style as About Island
   ============================================================ */

// export function ProjectsIsland({ hover }: { hover: boolean }) {
//   const islandRef = useRef<THREE.Group>(null);

//   useFrame((state, delta) => {
//     if (!islandRef.current) return;

//     const time = state.clock.elapsedTime;

//     // Gentle floating animation — same as About Island
//     islandRef.current.position.y =
//       Math.sin(time * 0.65) * 0.10;

//     // Full 360-degree rotation — 60 seconds
//     islandRef.current.rotation.y +=
//       delta * (Math.PI * 2 / 60);
//   });

//   return (
//     <group ref={islandRef}>
//       {/* Same flat platform as About Island */}
//       <IslandBase hover={hover} flat scale={1.58}>

//         {/* Complete showcase arrangement */}
//         <group position={[-0.15, 0.18, 0]}>

//           {/* =====================================
//               HARDWARE COLLECTION — LEFT
//               ===================================== */}

//           {/* ESP32 DEVELOPMENT BOARD */}
//           <IslandModel
//             path="/models/esp32.glb"
//             position={[-0.88, 0.43, 0.30]}
//             targetSize={0.72}
//             rotation={[0, -0.35, 0]}
//           />

//           {/* FLIPPER ZERO — CYBERSECURITY DEVICE */}
//           <IslandModel
//             path="/models/flipperzero_hacking_tool.glb"
//             position={[-0.82, 0.43, -0.48]}
//             targetSize={0.68}
//             rotation={[0, 0.25, 0]}
//           />

//           {/* ELECTRONICS COMPONENTS */}
//           <IslandModel
//             path="/models/electronics_components.glb"
//             position={[-0.20, 0.43, 0.48]}
//             targetSize={0.58}
//             rotation={[0, 0.25, 0]}
//           />

//           {/* =====================================
//               SOFTWARE COLLECTION — RIGHT
//               ===================================== */}

//           {/* PYTHON LOGO */}
//           <IslandModel
//             path="/models/python.glb"
//             position={[0.52, 0.48, -0.48]}
//             targetSize={0.56}
//             rotation={[0, -0.15, 0]}
//           />

//           {/* FLUTTER LOGO */}
//           <IslandModel
//             path="/models/flutter.glb"
//             position={[1.02, 0.48, -0.25]}
//             targetSize={0.54}
//             rotation={[0, 0.20, 0]}
//           />

//           {/* TYPESCRIPT LOGO */}
//           <IslandModel
//             path="/models/typescript_logo__3d_model.glb"
//             position={[0.52, 0.48, 0.38]}
//             targetSize={0.54}
//             rotation={[0, 0.15, 0]}
//           />

//           {/* DOCKER LOGO */}
//           <IslandModel
//             path="/models/docker_logo.glb"
//             position={[1.02, 0.48, 0.48]}
//             targetSize={0.54}
//             rotation={[0, -0.20, 0]}
//           />

//           {/* =====================================
//               AI / NEURAL NETWORK MODEL
//               ===================================== */}

//           <IslandModel
//             path="/models/artificial_neural_network.glb"
//             position={[0.02, 0.48, -0.88]}
//             targetSize={0.62}
//             rotation={[0, 0.15, 0]}
//           />

//           {/* =====================================
//               LOCAL PROJECT ISLAND LIGHTING
//               ===================================== */}

//           {/* Soft front illumination */}
//           <pointLight
//             position={[0, 1.1, 1.6]}
//             intensity={3.0}
//             color="#ffffff"
//             distance={3.8}
//             decay={2}
//           />

//           {/* Hardware-side illumination */}
//           <pointLight
//             position={[-1.0, 1.0, 0.2]}
//             intensity={2.5}
//             color="#6fd0e6"
//             distance={3.0}
//             decay={2}
//           />

//           {/* Software-side illumination */}
//           <pointLight
//             position={[1.0, 1.0, -0.1]}
//             intensity={2.5}
//             color="#b8a0ff"
//             distance={3.0}
//             decay={2}
//           />

//           {/* Subtle AI accent */}
//           <pointLight
//             position={[0.0, 1.0, -0.8]}
//             intensity={1.5}
//             color="#6fd0e6"
//             distance={2.5}
//             decay={2}
//           />

//         </group>
//       </IslandBase>
//     </group>
//   );
// }


// export function ProjectsIsland({ hover }: { hover: boolean }) {
//   const islandRef = useRef<THREE.Group>(null);

//   useFrame((state) => {
//     if (!islandRef.current) return;

//     // Gentle vertical floating only.
//     // No island rotation: models remain facing the viewer.
//     islandRef.current.position.y =
//       Math.sin(state.clock.elapsedTime * 0.65) * 0.10;
//   });

//   return (
//     <group ref={islandRef}>
//       <IslandBase hover={hover} flat scale={1.58}>
//         <group position={[-0.15, 0.38, 0]}>

//           {/* =================================
//               HARDWARE COLLECTION — LEFT
//               ================================= */}

//           {/* ESP32 */}
//           <IslandModel
//             path="/models/esp32.glb"
//             position={[-1.05, 0.46, 0.25]}
//             targetSize={0.82}
//             rotation={[0, -0.25, 0]}
//           />

//           {/* Flipper Zero */}
//           <IslandModel
//             path="/models/flipperzero_hacking_tool.glb"
//             position={[-1.05, 0.46, -0.48]}
//             targetSize={0.78}
//             rotation={[0, 0.15, 0]}
//           />

//           {/* Electronics components */}
//           <IslandModel
//             path="/models/electronics_components.glb"
//             position={[-0.48, 0.46, 0.48]}
//             targetSize={0.68}
//             rotation={[0, 0.20, 0]}
//           />

//           {/* =================================
//               AI / ML — CENTRE BACK
//               ================================= */}

//           <IslandModel
//             path="/models/artificial_neural_network.glb"
//             position={[0.12, 0.48, -0.72]}
//             targetSize={0.76}
//             rotation={[0, 0.10, 0]}
//           />

//           {/* =================================
//               SOFTWARE COLLECTION — RIGHT
//               ================================= */}

//           {/* Python */}
//           <IslandModel
//             path="/models/python.glb"
//             position={[0.62, 0.48, -0.42]}
//             targetSize={0.70}
//             rotation={[0, 0, 0]}
//           />

//           {/* Flutter */}
//           <IslandModel
//             path="/models/flutter.glb"
//             position={[1.12, 0.48, -0.30]}
//             targetSize={0.68}
//             rotation={[0, 0, 0]}
//           />

//           {/* TypeScript */}
//           <IslandModel
//             path="/models/typescript_logo__3d_model.glb"
//             position={[0.62, 0.48, 0.40]}
//             targetSize={0.68}
//             rotation={[0, 0, 0]}
//           />

//           {/* Docker */}
//           <IslandModel
//             path="/models/docker_logo.glb"
//             position={[1.12, 0.48, 0.42]}
//             targetSize={0.68}
//             rotation={[0, 0, 0]}
//           />

//           {/* =================================
//               LOCAL LIGHTING
//               ================================= */}

//           <pointLight
//             position={[0, 1.1, 1.5]}
//             intensity={3.0}
//             color="#ffffff"
//             distance={4}
//             decay={2}
//           />

//           <pointLight
//             position={[-1.0, 1.0, 0.2]}
//             intensity={2.5}
//             color="#6fd0e6"
//             distance={3.5}
//             decay={2}
//           />

//           <pointLight
//             position={[1.0, 1.0, 0]}
//             intensity={2.5}
//             color="#b8a0ff"
//             distance={3.5}
//             decay={2}
//           />

//         </group>
//       </IslandBase>
//     </group>
//   );
// }


// export function ProjectsIsland({ hover }: { hover: boolean }) {
//   const islandRef = useRef<THREE.Group>(null);

//   useFrame((state) => {
//     if (!islandRef.current) return;

//     const time = state.clock.elapsedTime;

//     // Move the complete Projects island downward.
//     // Only gentle vertical floating is animated here.
//     islandRef.current.position.y =
//       -0.55 + Math.sin(time * 0.65) * 0.08;
//   });

//   return (
//     <group ref={islandRef}>

//       {/* ROTATING ROCK AND PLATFORM ONLY */}
//       <IslandBase
//         hover={hover}
//         flat
//         scale={1.58}
//       />

//       {/* MODELS — SEPARATE FROM ROTATING PLATFORM */}
//       <group position={[-0.15, 0.38, 0]}>

//         {/* HARDWARE — LEFT */}

//         <IslandModel
//           path="/models/esp32.glb"
//           position={[-1.05, 0.48, 0.25]}
//           targetSize={0.82}
//           rotation={[0, -0.35, 0]}
//         />

//         <IslandModel
//           path="/models/flipperzero_hacking_tool.glb"
//           position={[-1.05, 0.48, -0.48]}
//           targetSize={0.78}
//           rotation={[0, 0.25, 0]}
//         />

//         {/* Rotate the electronics model to show its components */}
//         <IslandModel
//           path="/models/electronics_components.glb"
//           position={[-0.42, 0.48, 0.48]}
//           targetSize={0.72}
//           rotation={[-0.12, Math.PI / 3, 0]}
//         />

//         {/* AI / ML — CENTRE BACK */}

//         {/* Fixed angle to make the neural network visible */}
//         <IslandModel
//           path="/models/artificial_neural_network.glb"
//           position={[0.12, 0.50, -0.78]}
//           targetSize={0.76}
//           rotation={[0.12, Math.PI / 4, 0]}
//         />

//         {/* SOFTWARE — RIGHT */}

//         <IslandModel
//           path="/models/python.glb"
//           position={[0.62, 0.48, -0.42]}
//           targetSize={0.70}
//           rotation={[0, 0, 0]}
//         />

//         <IslandModel
//           path="/models/flutter.glb"
//           position={[1.12, 0.48, -0.30]}
//           targetSize={0.68}
//           rotation={[0, 0, 0]}
//         />

//         <IslandModel
//           path="/models/typescript_logo__3d_model.glb"
//           position={[0.62, 0.48, 0.40]}
//           targetSize={0.68}
//           rotation={[0, 0, 0]}
//         />

//         <IslandModel
//           path="/models/docker_logo.glb"
//           position={[1.12, 0.48, 0.42]}
//           targetSize={0.68}
//           rotation={[0, 0, 0]}
//         />

//         {/* LOCAL LIGHTING */}

//         <pointLight
//           position={[0, 1.1, 1.5]}
//           intensity={3}
//           color="#ffffff"
//           distance={4}
//           decay={2}
//         />

//         <pointLight
//           position={[-1, 1, 0.2]}
//           intensity={2.5}
//           color="#6fd0e6"
//           distance={3.5}
//           decay={2}
//         />

//         <pointLight
//           position={[1, 1, 0]}
//           intensity={2.5}
//           color="#b8a0ff"
//           distance={3.5}
//           decay={2}
//         />

//       </group>
//     </group>
//   );
// }


// export function ProjectsIsland({ hover }: { hover: boolean }) {
//   const islandRef = useRef<THREE.Group>(null);

//   useFrame((state) => {
//     if (!islandRef.current) return;

//     // Entire island floats lower on Y-axis.
//     islandRef.current.position.y =
//       -0.55 + Math.sin(state.clock.elapsedTime * 0.65) * 0.08;
//   });

//   return (
//     <group ref={islandRef}>

//       {/* ROCK + SURFACE: rotate independently */}
//       <IslandBase hover={hover} flat scale={1.58}>
//         <group />
//       </IslandBase>

//       {/* ALL MODELS: fixed orientation and horizontal X-axis row */}
//       <group position={[-0.15, 0.48, 0.05]}>

//         {/* 1. ESP32 */}
//         <IslandModel
//           path="/models/esp32.glb"
//           position={[-2.10, 0, 0]}
//           targetSize={0.62}
//         />

//         {/* 2. FLIPPER ZERO */}
//         <IslandModel
//           path="/models/flipperzero_hacking_tool.glb"
//           position={[-1.50, 0, 0]}
//           targetSize={0.62}
//         />

//         {/* 3. ELECTRONICS COMPONENTS */}
//         <IslandModel
//           path="/models/electronics_components.glb"
//           position={[-0.90, 0, 0]}
//           targetSize={0.62}
//           rotation={[0, Math.PI / 3, 0]}
//         />

//         {/* 4. ARTIFICIAL NEURAL NETWORK */}
//         <IslandModel
//           path="/models/artificial_neural_network.glb"
//           position={[-0.25, 0, 0]}
//           targetSize={0.62}
//           rotation={[0, Math.PI / 4, 0]}
//         />

//         {/* 5. PYTHON */}
//         <IslandModel
//           path="/models/python.glb"
//           position={[0.40, 0, 0]}
//           targetSize={0.62}
//         />

//         {/* 6. FLUTTER */}
//         <IslandModel
//           path="/models/flutter.glb"
//           position={[1.05, 0, 0]}
//           targetSize={0.62}
//         />

//         {/* 7. TYPESCRIPT */}
//         <IslandModel
//           path="/models/typescript_logo__3d_model.glb"
//           position={[1.70, 0, 0]}
//           targetSize={0.62}
//         />

//         {/* 8. DOCKER */}
//         <IslandModel
//           path="/models/docker_logo.glb"
//           position={[2.35, 0, 0]}
//           targetSize={0.62}
//         />

//       </group>
//     </group>
//   );
// }

export function ProjectsIsland({ hover }: { hover: boolean }) {
  const islandRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!islandRef.current) return;

    const time = state.clock.elapsedTime;

    // Floating animation
    islandRef.current.position.y =
      -0.55 + Math.sin(time * 0.65) * 0.08;

    // Continuous 360-degree rotation (60 seconds)
    islandRef.current.rotation.y +=
      delta * (Math.PI * 2 / 60);
  });

  return (
    <group ref={islandRef}>
      <IslandBase hover={hover} flat scale={1.58}>
        <group position={[-0.15, 0.48, 0.05]}>

          <IslandModel
            path="/models/esp32.glb"
            position={[-2.10, 0, 0]}
            targetSize={0.62}
          />

          <IslandModel
            path="/models/flipperzero_hacking_tool.glb"
            position={[-1.50, 0, 0]}
            targetSize={0.62}
          />

          <IslandModel
            path="/models/electronics_components.glb"
            position={[-0.90, 0, 0]}
            targetSize={0.62}
          />

          <IslandModel
            path="/models/artificial_neural_network.glb"
            position={[-0.25, 0, 0]}
            targetSize={0.62}
          />

          <IslandModel
            path="/models/python.glb"
            position={[0.40, 0, 0]}
            targetSize={0.62}
          />

          <IslandModel
            path="/models/flutter.glb"
            position={[1.05, 0, 0]}
            targetSize={0.62}
          />

          <IslandModel
            path="/models/typescript_logo__3d_model.glb"
            position={[1.70, 0, 0]}
            targetSize={0.62}
          />

          <IslandModel
            path="/models/docker_logo.glb"
            position={[2.35, 0, 0]}
            targetSize={0.62}
          />

          {/* =====================================
    PROJECT MODELS — BRIGHT WHITE LIGHTING
    ===================================== */}

{/* =====================================
    PROJECT ISLAND — ABOUT-STYLE LIGHTING
    ===================================== */}

{/* Soft white front illumination */}
<pointLight
  position={[0, 1.0, 1.8]}
  intensity={3.5}
  color="#ffffff"
  distance={5.5}
  decay={2}
/>

{/* Hardware illumination */}
<pointLight
  position={[-1.5, 0.9, 0.5]}
  intensity={3.0}
  color="#dceaff"
  distance={4.5}
  decay={2}
/>

{/* Software illumination */}
<pointLight
  position={[1.5, 1.0, 0.5]}
  intensity={3.0}
  color="#dceaff"
  distance={4.5}
  decay={2}
/>

{/* Subtle blue accent */}
<pointLight
  position={[0, 0.7, -0.5]}
  intensity={0.7}
  color="#6fd0e6"
  distance={3.5}
  decay={2}
/>

        </group>
      </IslandBase>
    </group>
  );
}



/* ============================================================
   Island 3 — LEADERSHIP: innovation workshop, figures + bench.
   ============================================================ */
// export function LeadershipIsland({ hover }: { hover: boolean }) {
//   const figureColor = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2a3046', roughness: 0.6, metalness: 0.2, flatShading: true }), []);
//   const figures: Array<[number, number]> = [
//     [-0.6, 0.3],
//     [-0.1, 0.4],
//     [0.4, 0.3],
//     [0.0, -0.3],
//   ];
//   return (
//     <IslandBase hover={hover} scale={1.1}>
//       {/* Shared workbench */}
//       <mesh material={brushedMetalMat} position={[0, 0.32, 0]}>
//         <boxGeometry args={[1.1, 0.08, 0.5]} />
//       </mesh>
//       {/* Central prototype on bench */}
//       <mesh material={cyanMat} position={[0, 0.42, 0]}>
//         <icosahedronGeometry args={[0.14, 1]} />
//       </mesh>
//       {/* Figures around bench */}
//       {figures.map(([x, z], i) => (
//         <group key={i} position={[x, 0.36, z]}>
//           {/* body */}
//           <mesh material={figureColor} position={[0, 0.18, 0]}>
//             <coneGeometry args={[0.12, 0.36, 6]} />
//           </mesh>
//           {/* head */}
//           <mesh material={figureColor} position={[0, 0.42, 0]}>
//             <sphereGeometry args={[0.08, 12, 12]} />
//           </mesh>
//         </group>
//       ))}
//       {/* Architectural bridge-like structure */}
//       <mesh material={stoneMat} position={[0, 0.55, -0.55]} rotation={[0, 0, 0]}>
//         <torusGeometry args={[0.3, 0.03, 8, 24, Math.PI]} />
//       </mesh>
//       {/* Blueprint surface */}
//       <mesh position={[0, 0.37, 0.0]} rotation={[-Math.PI / 2, 0, 0]}>
//         <planeGeometry args={[1.0, 0.44]} />
//         <meshBasicMaterial color="#0a1830" transparent opacity={0.4} />
//       </mesh>
//       {/* Circuit paths */}
//       {Array.from({ length: 3 }).map((_, i) => (
//         <mesh key={`c${i}`} position={[-0.3 + i * 0.3, 0.375, 0.1 + (i % 2) * 0.1]}>
//           <boxGeometry args={[0.3, 0.005, 0.03]} />
//           <meshStandardMaterial color="#6fd0e6" emissive="#2a6f86" emissiveIntensity={0.5} />
//         </mesh>
//       ))}
//       <GlowSprite color="rgb(220,180,120)" size={1.5} position={[0, 0.7, 0]} />
//       <pointLight position={[0, 0.85, 0]} intensity={2.4} color="#e8c890" distance={3} />
//     </IslandBase>
//   );
// }

/* ============================================================
   Island 4 — ACHIEVEMENTS: trophy + laurel + pedestal.
   ============================================================ */
export function AchievementsIsland({ hover }: { hover: boolean }) {
  const TrophyGroup = () => {
    const ref = useRef<THREE.Group>(null);
    useFrame(() => {
      if (ref.current) ref.current.rotation.y += 0.004;
    });
    return (
      <group ref={ref} position={[0, 0.6, 0]}>
        {/* Cup */}
        <mesh material={goldMat}>
          <cylinderGeometry args={[0.18, 0.1, 0.3, 16]} />
        </mesh>
        {/* Cup rim */}
        <mesh material={goldMat} position={[0, 0.18, 0]}>
          <torusGeometry args={[0.18, 0.03, 12, 24]} />
        </mesh>
        {/* Handles */}
        <mesh material={goldMat} position={[0.22, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.08, 0.02, 8, 16]} />
        </mesh>
        <mesh material={goldMat} position={[-0.22, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.08, 0.02, 8, 16]} />
        </mesh>
        {/* Stem */}
        <mesh material={goldMat} position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.16, 12]} />
        </mesh>
        {/* Base */}
        <mesh material={goldMat} position={[0, -0.34, 0]}>
          <cylinderGeometry args={[0.14, 0.16, 0.08, 16]} />
        </mesh>
        {/* Laurel arc behind */}
        <mesh material={goldMat} position={[0, 0.05, -0.18]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.32, 0.03, 8, 24, Math.PI]} />
        </mesh>
      </group>
    );
  };
  return (
    <IslandBase hover={hover}>
      {/* Pedestal */}
      <mesh material={brushedMetalMat} position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.3, 24]} />
      </mesh>
      <TrophyGroup />
      {/* Small medal */}
      <mesh material={goldMat} position={[0.5, 0.32, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.03, 24]} />
      </mesh>
      <GlowSprite color="rgb(220,180,110)" size={1.6} position={[0, 0.9, 0]} />
      <pointLight position={[0, 1.0, 0.2]} intensity={2.5} color="#e8c890" distance={3} />
      <pointLight position={[0.4, 0.4, 0.4]} intensity={1} color="#6fd0e6" distance={2} />
    </IslandBase>
  );
}

/* ============================================================
   Island 5 — CONTACT ME: stone+metal gateway, ring, envelope.
   ============================================================ */
export function ContactIsland({ hover }: { hover: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ringRef.current) ringRef.current.rotation.z += 0.003;
  });
  return (
    <IslandBase hover={hover} scale={1.1}>
      {/* Two gateway pillars */}
      <mesh material={stoneMat} position={[-0.4, 0.5, 0]}>
        <boxGeometry args={[0.16, 0.7, 0.16]} />
      </mesh>
      <mesh material={stoneMat} position={[0.4, 0.5, 0]}>
        <boxGeometry args={[0.16, 0.7, 0.16]} />
      </mesh>
      {/* Metal lintel */}
      <mesh material={brushedMetalMat} position={[0, 0.92, 0]}>
        <boxGeometry args={[1.0, 0.1, 0.16]} />
      </mesh>
      {/* Illuminated ring */}
      <mesh ref={ringRef} position={[0, 0.6, 0.1]}>
        <torusGeometry args={[0.3, 0.02, 12, 32]} />
        <meshStandardMaterial color="#6fd0e6" emissive="#3a8aa8" emissiveIntensity={0.9} roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Envelope symbol */}
      <mesh material={brushedMetalMat} position={[0, 0.45, 0.18]}>
        <boxGeometry args={[0.3, 0.2, 0.03]} />
      </mesh>
      <mesh position={[0, 0.45, 0.2]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.2, 0.2, 0.02]} />
        <meshStandardMaterial color="#6fd0e6" emissive="#2a6f86" emissiveIntensity={0.4} />
      </mesh>
      {/* Lanterns */}
      <mesh material={goldMat} position={[-0.4, 0.7, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
      </mesh>
      <mesh material={goldMat} position={[0.4, 0.7, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
      </mesh>
      {/* pathway */}
      <mesh position={[0, 0.15, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 0.6]} />
        <meshStandardMaterial color="#1a2030" roughness={0.8} transparent opacity={0.6} />
      </mesh>
      <GlowSprite color="rgb(110,160,210)" size={1.5} position={[0, 0.7, 0.1]} />
      <pointLight position={[0, 0.6, 0.3]} intensity={2} color="#6fd0e6" distance={2.5} />
      <pointLight position={[0, 0.6, 0.1]} intensity={1.2} color="#6a5cb0" distance={2} />
    </IslandBase>
  );
}

/* ============================================================
   Island 6 — UPCOMING: crystal, computational structure, portal.
   ============================================================ */
// export function UpcomingIsland({ hover }: { hover: boolean }) {
//   const crystalRef = useRef<THREE.Mesh>(null);
//   useFrame(() => {
//     if (crystalRef.current) {
//       crystalRef.current.rotation.y += 0.005;
//       crystalRef.current.rotation.x += 0.002;
//     }
//   });
//   return (
//     <IslandBase hover={hover}>
//       {/* Translucent crystal */}
//       <mesh ref={crystalRef} material={crystalMat} position={[0, 0.7, 0]} scale={0.5}>
//         <octahedronGeometry args={[1.2, 0]} />
//       </mesh>
//       {/* Abstract computational structure (wireframe-ish dodecahedron) */}
//       <mesh position={[0, 0.7, 0]}>
//         <dodecahedronGeometry args={[0.55, 0]} />
//         <meshBasicMaterial color="#6fd0e6" wireframe transparent opacity={0.4} />
//       </mesh>
//       {/* Compact experimental device */}
//       <mesh material={brushedMetalMat} position={[-0.6, 0.35, 0.3]}>
//         <boxGeometry args={[0.3, 0.12, 0.25]} />
//       </mesh>
//       <mesh position={[-0.6, 0.42, 0.3]}>
//         <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
//         <meshStandardMaterial color="#6fd0e6" emissive="#2a6f86" emissiveIntensity={0.6} />
//       </mesh>
//       {/* Portal-like frame */}
//       <mesh position={[0.6, 0.5, -0.2]} rotation={[0, 0.3, 0]}>
//         <torusGeometry args={[0.22, 0.02, 12, 24]} />
//         <meshStandardMaterial color="#6a5cb0" emissive="#2a2256" emissiveIntensity={0.7} roughness={0.3} metalness={0.6} />
//       </mesh>
//       {/* Orbital metallic details */}
//       <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 3, 0, 0]}>
//         <torusGeometry args={[0.8, 0.008, 8, 48]} />
//         <meshStandardMaterial color="#9aa6c0" metalness={0.9} roughness={0.3} />
//       </mesh>
//       <mesh position={[0, 0.7, 0]} rotation={[0, 0, Math.PI / 3]}>
//         <torusGeometry args={[0.7, 0.008, 8, 48]} />
//         <meshStandardMaterial color="#c8a86a" metalness={0.9} roughness={0.3} />
//       </mesh>
//       <GlowSprite color="rgb(120,170,210)" size={1.7} position={[0, 0.9, 0]} />
//       <pointLight position={[0, 1.0, 0.3]} intensity={2} color="#6fd0e6" distance={3} />
//       <pointLight position={[0.5, 0.6, -0.2]} intensity={1} color="#6a5cb0" distance={2} />
//     </IslandBase>
//   );
// }

export const ISLAND_COMPONENTS = {
  about: AboutIsland,
  projects: ProjectsIsland,
  // leadership: LeadershipIsland,
  achievements: AchievementsIsland,
  contact: ContactIsland,
  // upcoming: UpcomingIsland,
} as const;
