import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, DoubleSide } from "three";

export default function Sigil({ color, accentColor }: { color: string; accentColor: string }) {
  const group = useRef<Group>(null);
  const innerRef = useRef<Group>(null);
  const sparksRef = useRef<Group>(null);
  const boltsRef = useRef<Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const t = Date.now() * 0.0003;
    group.current.rotation.z = t;
    if (innerRef.current) innerRef.current.rotation.z = -t * 1.5;
    if (sparksRef.current) sparksRef.current.rotation.z = t * 2.5;
    if (boltsRef.current) boltsRef.current.rotation.z = -t * 0.8;

    // Pulse sparks
    if (sparksRef.current) {
      sparksRef.current.children.forEach((child, i) => {
        const st = Date.now() * 0.005 + i * 1.7;
        const s = 0.5 + Math.sin(st) * 0.5;
        child.scale.set(s, s, s);
        (child as any).material && ((child as any).material.opacity = 0.3 + Math.sin(st) * 0.4);
      });
    }
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

  // Spark positions scattered around
  const sparkPositions = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => {
      const a = (i / 24) * Math.PI * 2;
      const r = 3 + Math.sin(i * 2.7) * 5;
      return [Math.cos(a) * r, Math.sin(a) * r, 0] as [number, number, number];
    });
  }, []);

  // Lightning bolt segments
  const bolts = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      const segments: [number, number, number][] = [];
      let x = Math.cos(a) * 2;
      let y = Math.sin(a) * 2;
      for (let j = 0; j < 5; j++) {
        const nx = x + Math.cos(a) * 1.2 + (Math.sin(i * 3 + j * 7) * 0.8);
        const ny = y + Math.sin(a) * 1.2 + (Math.cos(i * 5 + j * 3) * 0.8);
        segments.push([(x + nx) / 2, (y + ny) / 2, 0]);
        x = nx;
        y = ny;
      }
      return { angle: a, segments };
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

        {/* Second outer ring - slightly larger, ghostly */}
        {outerRing.map((pos, i) => {
          const next = outerRing[(i + 1) % outerRing.length];
          const scale = 1.15;
          const mx = ((pos[0] + next[0]) / 2) * scale;
          const my = ((pos[1] + next[1]) / 2) * scale;
          const angle = Math.atan2(next[1] - pos[1], next[0] - pos[0]);
          const len = Math.sqrt((next[0] - pos[0]) ** 2 + (next[1] - pos[1]) ** 2) * scale;
          return (
            <mesh key={`o2-${i}`} position={[mx, my, -0.1]} rotation={[0, 0, angle]}>
              <boxGeometry args={[len, 0.08, 0.03]} />
              <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.4} flatShading transparent opacity={0.25} />
            </mesh>
          );
        })}

        {/* Star / pentagram lines */}
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

        {/* Lightning bolts radiating outward */}
        <group ref={boltsRef}>
          {bolts.map((bolt, bi) =>
            bolt.segments.map((seg, si) => {
              const angle = bolt.angle + Math.sin(si * 2) * 0.3;
              return (
                <mesh key={`b${bi}-${si}`} position={seg} rotation={[0, 0, angle]}>
                  <boxGeometry args={[0.8, 0.04, 0.02]} />
                  <meshStandardMaterial
                    color={accentColor}
                    emissive={accentColor}
                    emissiveIntensity={1.5}
                    flatShading
                    transparent
                    opacity={0.6 - si * 0.08}
                  />
                </mesh>
              );
            })
          )}
        </group>

        {/* Sparks / floating particles */}
        <group ref={sparksRef}>
          {sparkPositions.map((pos, i) => (
            <mesh key={`sp${i}`} position={pos}>
              <sphereGeometry args={[0.08 + (i % 3) * 0.04, 4, 3]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? accentColor : color}
                emissive={i % 2 === 0 ? accentColor : color}
                emissiveIntensity={2}
                flatShading
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}
        </group>

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

          {/* Occult triangle inscribed */}
          {[0, 1, 2].map((i) => {
            const a1 = (i / 3) * Math.PI * 2 - Math.PI / 2;
            const a2 = ((i + 1) / 3) * Math.PI * 2 - Math.PI / 2;
            const r = 5.5;
            const x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r;
            const x2 = Math.cos(a2) * r, y2 = Math.sin(a2) * r;
            const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
            const angle = Math.atan2(y2 - y1, x2 - x1);
            const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            return (
              <mesh key={`tri${i}`} position={[mx, my, 0.05]} rotation={[0, 0, angle]}>
                <boxGeometry args={[len, 0.1, 0.03]} />
                <meshStandardMaterial color={color} emissive={accentColor} emissiveIntensity={0.7} flatShading transparent opacity={0.35} />
              </mesh>
            );
          })}

          {/* Center eye */}
          <mesh>
            <ringGeometry args={[0.8, 1.2, 6]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.5} side={DoubleSide} flatShading transparent opacity={0.7} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.5, 5, 4]} />
            <meshStandardMaterial color={color} emissive={accentColor} emissiveIntensity={2} flatShading transparent opacity={0.6} />
          </mesh>
          {/* Inner eye ring */}
          <mesh>
            <ringGeometry args={[1.4, 1.6, 8]} />
            <meshStandardMaterial color={color} emissive={accentColor} emissiveIntensity={0.8} side={DoubleSide} flatShading transparent opacity={0.3} />
          </mesh>
        </group>

        {/* Rune circles at vertices */}
        {outerRing.filter((_, i) => i % 3 === 0).map((pos, i) => (
          <mesh key={`r${i}`} position={pos}>
            <ringGeometry args={[0.2, 0.35, 5]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.2} side={DoubleSide} flatShading transparent opacity={0.5} />
          </mesh>
        ))}

        {/* Additional rune marks at every other vertex */}
        {outerRing.filter((_, i) => i % 2 === 1).map((pos, i) => (
          <mesh key={`rm${i}`} position={pos}>
            <boxGeometry args={[0.3, 0.3, 0.02]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.9} side={DoubleSide} flatShading transparent opacity={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
