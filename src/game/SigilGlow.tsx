import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, CanvasTexture, AdditiveBlending } from "three";

function makeHaloTexture(color: string, size = 512, peakAt = 0.35) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const cx = size / 2;

  // Parse hex color to rgb
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  const grad = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx);
  // Center: fully transparent
  grad.addColorStop(0,         `rgba(${r},${g},${b},0)`);
  // Inner dark zone still transparent
  grad.addColorStop(peakAt * 0.5, `rgba(${r},${g},${b},0.04)`);
  // Peak glow ring
  grad.addColorStop(peakAt,    `rgba(${r},${g},${b},1)`);
  // Outer fade
  grad.addColorStop(peakAt + 0.2, `rgba(${r},${g},${b},0.45)`);
  grad.addColorStop(0.85,      `rgba(${r},${g},${b},0.12)`);
  grad.addColorStop(1,         `rgba(${r},${g},${b},0)`);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

interface SigilGlowProps {
  accentColor: string;
}

export default function SigilGlow({ accentColor }: SigilGlowProps) {
  const inner = useRef<Mesh>(null);
  const mid   = useRef<Mesh>(null);
  const outer = useRef<Mesh>(null);

  // Re-generate textures when accent color changes
  const textures = useMemo(() => ({
    inner: makeHaloTexture(accentColor, 512, 0.30),
    mid:   makeHaloTexture(accentColor, 512, 0.40),
    outer: makeHaloTexture(accentColor, 512, 0.55),
  }), [accentColor]);

  useFrame(() => {
    const t = Date.now() * 0.001;

    if (inner.current) {
      (inner.current.material as any).opacity = 0.75 + Math.sin(t * 0.9) * 0.25;
      const s = 1 + Math.sin(t * 0.7) * 0.06;
      inner.current.scale.set(s, s, 1);
    }
    if (mid.current) {
      (mid.current.material as any).opacity = 0.55 + Math.sin(t * 0.5 + 1.1) * 0.2;
      const s = 1 + Math.sin(t * 0.45 + 0.8) * 0.05;
      mid.current.scale.set(s, s, 1);
    }
    if (outer.current) {
      (outer.current.material as any).opacity = 0.35 + Math.sin(t * 0.3 + 2.0) * 0.15;
      const s = 1 + Math.sin(t * 0.3 + 1.5) * 0.04;
      outer.current.scale.set(s, s, 1);
    }
  });

  return (
    <group position={[0, 5, -37]}>
      {/* Tight halo ring — peak glow close to center */}
      <mesh ref={inner}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial
          map={textures.inner}
          transparent
          opacity={0.75}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Mid corona */}
      <mesh ref={mid} position={[0, 0, -0.5]}>
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial
          map={textures.mid}
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Vast outer nebula bloom */}
      <mesh ref={outer} position={[0, 0, -1]}>
        <planeGeometry args={[140, 140]} />
        <meshBasicMaterial
          map={textures.outer}
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
