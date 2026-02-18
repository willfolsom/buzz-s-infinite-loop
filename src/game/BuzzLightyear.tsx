import { useRef } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";

export default function BuzzLightyear({ targetX }: { targetX: number }) {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    // Smooth lerp to target X
    group.current.position.x += (targetX - group.current.position.x) * 5 * delta;
    // Slight bob
    group.current.position.y = Math.sin(Date.now() * 0.003) * 0.1;
    // Lean into turns
    group.current.rotation.z = (targetX - group.current.position.x) * -0.3;
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Body - white torso */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.6, 0.7, 0.5]} />
        <meshStandardMaterial color="#e8e8f0" flatShading />
      </mesh>

      {/* Purple chest piece */}
      <mesh position={[0, 0.7, 0.2]}>
        <boxGeometry args={[0.5, 0.4, 0.15]} />
        <meshStandardMaterial color="#6b2fa0" flatShading />
      </mesh>

      {/* Green accent stripe */}
      <mesh position={[0, 0.5, 0.26]}>
        <boxGeometry args={[0.52, 0.12, 0.05]} />
        <meshStandardMaterial color="#44cc44" flatShading />
      </mesh>

      {/* Head - sphere with helmet */}
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.25, 6, 4]} />
        <meshStandardMaterial color="#f0d0a0" flatShading />
      </mesh>

      {/* Helmet dome */}
      <mesh position={[0, 1.2, 0.05]}>
        <sphereGeometry args={[0.3, 6, 4]} />
        <meshStandardMaterial color="#aaddff" transparent opacity={0.4} flatShading />
      </mesh>

      {/* Purple hood */}
      <mesh position={[0, 1.35, -0.05]}>
        <boxGeometry args={[0.35, 0.15, 0.3]} />
        <meshStandardMaterial color="#7b3fb0" flatShading />
      </mesh>

      {/* Left wing */}
      <mesh position={[-0.55, 0.85, -0.1]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.6, 0.05, 0.4]} />
        <meshStandardMaterial color="#e0e0e8" flatShading />
      </mesh>
      <mesh position={[-0.55, 0.87, -0.1]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.5, 0.02, 0.3]} />
        <meshStandardMaterial color="#44cc44" flatShading />
      </mesh>

      {/* Right wing */}
      <mesh position={[0.55, 0.85, -0.1]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.6, 0.05, 0.4]} />
        <meshStandardMaterial color="#e0e0e8" flatShading />
      </mesh>
      <mesh position={[0.55, 0.87, -0.1]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.5, 0.02, 0.3]} />
        <meshStandardMaterial color="#44cc44" flatShading />
      </mesh>

      {/* Left leg */}
      <mesh position={[-0.15, 0.05, 0]}>
        <boxGeometry args={[0.2, 0.4, 0.25]} />
        <meshStandardMaterial color="#e8e8f0" flatShading />
      </mesh>
      {/* Left boot */}
      <mesh position={[-0.15, -0.15, 0.05]}>
        <boxGeometry args={[0.22, 0.15, 0.3]} />
        <meshStandardMaterial color="#6b2fa0" flatShading />
      </mesh>

      {/* Right leg */}
      <mesh position={[0.15, 0.05, 0]}>
        <boxGeometry args={[0.2, 0.4, 0.25]} />
        <meshStandardMaterial color="#e8e8f0" flatShading />
      </mesh>
      {/* Right boot */}
      <mesh position={[0.15, -0.15, 0.05]}>
        <boxGeometry args={[0.22, 0.15, 0.3]} />
        <meshStandardMaterial color="#6b2fa0" flatShading />
      </mesh>

      {/* Jetpack */}
      <mesh position={[0, 0.6, -0.35]}>
        <boxGeometry args={[0.35, 0.45, 0.2]} />
        <meshStandardMaterial color="#cccccc" flatShading />
      </mesh>
      {/* Jetpack flames */}
      <mesh position={[-0.08, 0.3, -0.4]}>
        <coneGeometry args={[0.06, 0.25, 4]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff4400" emissiveIntensity={2} flatShading />
      </mesh>
      <mesh position={[0.08, 0.3, -0.4]}>
        <coneGeometry args={[0.06, 0.25, 4]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ff6600" emissiveIntensity={2} flatShading />
      </mesh>

      {/* Wrist laser - red button */}
      <mesh position={[0.35, 0.55, 0.15]}>
        <sphereGeometry args={[0.04, 4, 3]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} flatShading />
      </mesh>
    </group>
  );
}
