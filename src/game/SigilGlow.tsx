import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, AdditiveBlending } from "three";

interface SigilGlowProps {
  accentColor: string;
}

export default function SigilGlow({ accentColor }: SigilGlowProps) {
  const core = useRef<Mesh>(null);
  const mid = useRef<Mesh>(null);
  const outer = useRef<Mesh>(null);
  const halo = useRef<Mesh>(null);

  useFrame(() => {
    const t = Date.now() * 0.001;
    const pulse = 0.7 + Math.sin(t * 0.7) * 0.3;
    const pulse2 = 0.5 + Math.sin(t * 0.4 + 1.2) * 0.35;
    const pulse3 = 0.3 + Math.sin(t * 0.3 + 2.5) * 0.2;

    if (core.current) {
      (core.current.material as any).opacity = pulse * 0.55;
      const s = 0.9 + Math.sin(t * 0.8) * 0.1;
      core.current.scale.set(s, s, 1);
    }
    if (mid.current) {
      (mid.current.material as any).opacity = pulse2 * 0.35;
      const s = 1 + Math.sin(t * 0.5 + 0.5) * 0.08;
      mid.current.scale.set(s, s, 1);
    }
    if (outer.current) {
      (outer.current.material as any).opacity = pulse3 * 0.18;
      const s = 1 + Math.sin(t * 0.35 + 1.0) * 0.06;
      outer.current.scale.set(s, s, 1);
    }
    if (halo.current) {
      (halo.current.material as any).opacity = 0.06 + Math.sin(t * 0.25) * 0.04;
    }
  });

  // position z=-37 puts it behind the sigil at z=-35
  return (
    <group position={[0, 5, -37]}>
      {/* Tight bright core glow */}
      <mesh ref={core}>
        <planeGeometry args={[18, 18]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Mid glow halo */}
      <mesh ref={mid} position={[0, 0, -0.5]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Outer diffuse bloom */}
      <mesh ref={outer} position={[0, 0, -1]}>
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.15}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Vast sky tint — covers the whole background */}
      <mesh ref={halo} position={[0, 0, -2]}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.07}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
