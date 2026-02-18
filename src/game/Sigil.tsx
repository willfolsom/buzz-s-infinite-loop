import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, DoubleSide } from "three";

export default function Sigil({ color, accentColor }: { color: string; accentColor: string }) {
  const group = useRef<Group>(null);
  const innerRef = useRef<Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const t = Date.now() * 0.0003;
    group.current.rotation.z = t;
    if (innerRef.current) innerRef.current.rotation.z = -t * 1.5;
  });

  const outerRing = useMemo(() => {
    const pts = 12;
    return Array.from({ length: pts }).map((_, i) => {
      const a = (i / pts) * Math.PI * 2;
      return [Math.cos(a) * 8, Math.sin(a) * 8, 0] as [number, number, number];
    });
  }, []);

  const innerRing = useMemo(() => {
    const pts = 6;
    return Array.from({ length: pts }).map((_, i) => {
      const a = (i / pts) * Math.PI * 2;
      return [Math.cos(a) * 4, Math.sin(a) * 4, 0] as [number, number, number];
    });
  }, []);

  return (
    <group position={[0, 5, -35]}>
      <group ref={group}>
        {/* Outer ring segments */}
        {outerRing.map((pos, i) => {
          const next = outerRing[(i + 1) % outerRing.length];
          const mx = (pos[0] + next[0]) / 2;
          const my = (pos[1] + next[1]) / 2;
          const angle = Math.atan2(next[1] - pos[1], next[0] - pos[0]);
          const len = Math.sqrt((next[0] - pos[0]) ** 2 + (next[1] - pos[1]) ** 2);
          return (
            <mesh key={`o${i}`} position={[mx, my, 0]} rotation={[0, 0, angle]}>
              <boxGeometry args={[len, 0.15, 0.05]} />
              <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} flatShading transparent opacity={0.6} />
            </mesh>
          );
        })}

        {/* Star / pentagram lines - connect every other outer point */}
        {outerRing.filter((_, i) => i % 2 === 0).map((pos, i, arr) => {
          const next = arr[(i + 2) % arr.length];
          const mx = (pos[0] + next[0]) / 2;
          const my = (pos[1] + next[1]) / 2;
          const angle = Math.atan2(next[1] - pos[1], next[0] - pos[0]);
          const len = Math.sqrt((next[0] - pos[0]) ** 2 + (next[1] - pos[1]) ** 2);
          return (
            <mesh key={`s${i}`} position={[mx, my, 0]} rotation={[0, 0, angle]}>
              <boxGeometry args={[len, 0.08, 0.03]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} flatShading transparent opacity={0.4} />
            </mesh>
          );
        })}

        {/* Inner rotating group */}
        <group ref={innerRef}>
          {/* Inner hexagon */}
          {innerRing.map((pos, i) => {
            const next = innerRing[(i + 1) % innerRing.length];
            const mx = (pos[0] + next[0]) / 2;
            const my = (pos[1] + next[1]) / 2;
            const angle = Math.atan2(next[1] - pos[1], next[0] - pos[0]);
            const len = Math.sqrt((next[0] - pos[0]) ** 2 + (next[1] - pos[1]) ** 2);
            return (
              <mesh key={`h${i}`} position={[mx, my, 0]} rotation={[0, 0, angle]}>
                <boxGeometry args={[len, 0.12, 0.04]} />
                <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1} flatShading transparent opacity={0.5} />
              </mesh>
            );
          })}

          {/* Cross-lines through center */}
          {[0, Math.PI / 3, (2 * Math.PI) / 3].map((a, i) => (
            <mesh key={`c${i}`} rotation={[0, 0, a]}>
              <boxGeometry args={[9, 0.06, 0.03]} />
              <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.6} flatShading transparent opacity={0.3} />
            </mesh>
          ))}

          {/* Center eye */}
          <mesh>
            <ringGeometry args={[0.8, 1.2, 6]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.5} side={DoubleSide} flatShading transparent opacity={0.7} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.5, 5, 4]} />
            <meshStandardMaterial color={color} emissive={accentColor} emissiveIntensity={2} flatShading transparent opacity={0.6} />
          </mesh>
        </group>

        {/* Rune circles at vertices */}
        {outerRing.filter((_, i) => i % 3 === 0).map((pos, i) => (
          <mesh key={`r${i}`} position={pos}>
            <ringGeometry args={[0.2, 0.35, 5]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.2} side={DoubleSide} flatShading transparent opacity={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
