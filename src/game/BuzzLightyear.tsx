import { useRef } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";

export default function BuzzLightyear({ targetX }: { targetX: number }) {
  const group = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.position.x += (targetX - group.current.position.x) * 5 * delta;
    group.current.position.y = Math.sin(Date.now() * 0.008) * 0.05;
    group.current.rotation.z = (targetX - group.current.position.x) * -0.3;

    // Running animation
    const t = Date.now() * 0.01;
    if (leftLeg.current) leftLeg.current.rotation.x = Math.sin(t) * 0.8;
    if (rightLeg.current) rightLeg.current.rotation.x = Math.sin(t + Math.PI) * 0.8;
    if (leftArm.current) leftArm.current.rotation.x = Math.sin(t + Math.PI) * 0.6;
    if (rightArm.current) rightArm.current.rotation.x = Math.sin(t) * 0.6;
  });

  return (
    <group ref={group} position={[0, -0.6, 1]} scale={[0.7, 0.7, 0.7]}>
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

      {/* Head */}
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

      {/* Left arm */}
      <group ref={leftArm} position={[-0.4, 0.7, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.15, 0.4, 0.18]} />
          <meshStandardMaterial color="#e8e8f0" flatShading />
        </mesh>
      </group>

      {/* Right arm */}
      <group ref={rightArm} position={[0.4, 0.7, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.15, 0.4, 0.18]} />
          <meshStandardMaterial color="#e8e8f0" flatShading />
        </mesh>
        {/* Wrist laser */}
        <mesh position={[0, -0.3, 0.08]}>
          <sphereGeometry args={[0.04, 4, 3]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} flatShading />
        </mesh>
      </group>

      {/* Left wing (folded back while running) */}
      <mesh position={[-0.5, 0.85, -0.2]} rotation={[0.3, 0, 0.5]}>
        <boxGeometry args={[0.5, 0.04, 0.3]} />
        <meshStandardMaterial color="#e0e0e8" flatShading />
      </mesh>
      <mesh position={[-0.5, 0.87, -0.2]} rotation={[0.3, 0, 0.5]}>
        <boxGeometry args={[0.4, 0.02, 0.2]} />
        <meshStandardMaterial color="#44cc44" flatShading />
      </mesh>

      {/* Right wing (folded back) */}
      <mesh position={[0.5, 0.85, -0.2]} rotation={[0.3, 0, -0.5]}>
        <boxGeometry args={[0.5, 0.04, 0.3]} />
        <meshStandardMaterial color="#e0e0e8" flatShading />
      </mesh>
      <mesh position={[0.5, 0.87, -0.2]} rotation={[0.3, 0, -0.5]}>
        <boxGeometry args={[0.4, 0.02, 0.2]} />
        <meshStandardMaterial color="#44cc44" flatShading />
      </mesh>

      {/* Left leg */}
      <group ref={leftLeg} position={[-0.15, 0.25, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.2, 0.4, 0.25]} />
          <meshStandardMaterial color="#e8e8f0" flatShading />
        </mesh>
        <mesh position={[0, -0.4, 0.05]}>
          <boxGeometry args={[0.22, 0.15, 0.3]} />
          <meshStandardMaterial color="#6b2fa0" flatShading />
        </mesh>
      </group>

      {/* Right leg */}
      <group ref={rightLeg} position={[0.15, 0.25, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.2, 0.4, 0.25]} />
          <meshStandardMaterial color="#e8e8f0" flatShading />
        </mesh>
        <mesh position={[0, -0.4, 0.05]}>
          <boxGeometry args={[0.22, 0.15, 0.3]} />
          <meshStandardMaterial color="#6b2fa0" flatShading />
        </mesh>
      </group>

      {/* Jetpack (smaller, on back) */}
      <mesh position={[0, 0.6, -0.35]}>
        <boxGeometry args={[0.3, 0.35, 0.15]} />
        <meshStandardMaterial color="#cccccc" flatShading />
      </mesh>
    </group>
  );
}
