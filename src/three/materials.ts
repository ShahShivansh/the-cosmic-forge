import * as THREE from 'three';

/** Shared, cached materials so the scene stays lightweight. */

export const stoneMat = new THREE.MeshStandardMaterial({
  color: '#1a1d2c',
  roughness: 0.82,
  metalness: 0.12,
  flatShading: true,
});

export const darkStoneMat = new THREE.MeshStandardMaterial({
  color: '#0d0f1a',
  roughness: 0.92,
  metalness: 0.08,
  flatShading: true,
});

export const polishedBlackStoneMat = new THREE.MeshStandardMaterial({
  color: '#070810',
  roughness: 0.18,
  metalness: 0.55,
  envMapIntensity: 1.2,
});

export const carvedStoneMat = new THREE.MeshStandardMaterial({
  color: '#232739',
  roughness: 0.7,
  metalness: 0.18,
  flatShading: false,
});

export const brushedMetalMat = new THREE.MeshStandardMaterial({
  color: '#9aa6c0',
  roughness: 0.42,
  metalness: 0.92,
});

export const goldMat = new THREE.MeshStandardMaterial({
  color: '#c8a86a',
  roughness: 0.34,
  metalness: 0.95,
  emissive: '#3a2a10',
  emissiveIntensity: 0.18,
});

export const cyanMat = new THREE.MeshStandardMaterial({
  color: '#6fd0e6',
  roughness: 0.4,
  metalness: 0.3,
  emissive: '#2a6f86',
  emissiveIntensity: 0.5,
});

export const violetMat = new THREE.MeshStandardMaterial({
  color: '#6a5cb0',
  roughness: 0.5,
  metalness: 0.3,
  emissive: '#2a2256',
  emissiveIntensity: 0.35,
});

export const waterMat = new THREE.MeshStandardMaterial({
  color: '#aee3f0',
  transparent: true,
  opacity: 0.55,
  roughness: 0.08,
  metalness: 0.0,
  emissive: '#3a7888',
  emissiveIntensity: 0.22,
  side: THREE.DoubleSide,
});

export const crystalMat = new THREE.MeshPhysicalMaterial({
  color: '#7fb8d8',
  roughness: 0.05,
  metalness: 0.0,
  transmission: 0.85,
  thickness: 1.2,
  transparent: true,
  opacity: 0.7,
  ior: 1.45,
  emissive: '#2a5a78',
  emissiveIntensity: 0.25,
});
