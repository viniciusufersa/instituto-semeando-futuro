"use client";

import { Float, MeshDistortMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { useRef } from "react";
import type { Group } from "three";

function Sculpture() {
  const group = useRef<Group>(null);
  const reduceMotion = useReducedMotion();
  useFrame((state, delta) => {
    if (group.current && !reduceMotion) {
      group.current.rotation.y += delta * 0.08;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.08;
    }
  });
  return (
    <group ref={group}>
      <Float speed={reduceMotion ? 0 : 1.3} rotationIntensity={0.18} floatIntensity={0.45}>
        <mesh scale={1.65}>
          <icosahedronGeometry args={[1, 5]} />
          <MeshDistortMaterial color="#FE0C6D" roughness={0.2} metalness={0.05} distort={0.18} speed={1.2} />
        </mesh>
        <mesh scale={1.9}><torusGeometry args={[1.18, 0.015, 12, 120]} /><meshBasicMaterial color="#FEE401" transparent opacity={0.8} /></mesh>
        <mesh rotation={[Math.PI / 2.8, 0.4, 0.2]} scale={2.2}><torusGeometry args={[1.18, 0.01, 10, 120]} /><meshBasicMaterial color="#379CE1" transparent opacity={0.55} /></mesh>
      </Float>
    </group>
  );
}

export default function HeroOrbit() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 42 }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={2.3} />
      <directionalLight position={[3, 4, 5]} intensity={3} color="#ffffff" />
      <pointLight position={[-4, -2, 3]} intensity={28} color="#379CE1" />
      <Sculpture />
    </Canvas>
  );
}
