import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

function seededRandom(s: number) {
  const x = Math.sin(s * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

interface PowerupsProps {
  speed: number;
  seed: number;
  playerX: number;
  onCollect: () => void;
  paused: boolean;
}

export default function Powerups({ speed, seed, playerX, onCollect, paused }: PowerupsProps) {
  const group = useRef<Group>(null);
  const offsetRef = useRef(0);
  const collected = useRef<Set<number>>(new Set());

  const batteries = useMemo(() => {
    collected.current.clear();
    const items = [];
    for (let i = 0; i < 20; i++) {
      const r = seededRandom(seed + i + 5000);
      items.push({
        x: (r - 0.5) * 10,
        z: -i * 9 - 8,
      });
    }
    return items;
  }, [seed]);

  useFrame((_, delta) => {
    if (!group.current || paused) return;
    offsetRef.current += speed * delta;
    group.current.position.z = offsetRef.current % 180;

    // Check pickup - battery world z = obs.z + group offset
    batteries.forEach((bat, i) => {
      if (collected.current.has(i)) return;
      const worldZ = bat.z + group.current!.position.z;
      if (worldZ > 0.5 && worldZ < 2.5 && Math.abs(bat.x - playerX) < 1.0) {
        collected.current.add(i);
        onCollect();
      }
    });
  });

  const t = Date.now() * 0.003;

  return (
    <group ref={group}>
      {batteries.map((bat, i) => {
        if (collected.current.has(i)) return null;
        return (
          <group key={i} position={[bat.x, 0.3, bat.z]}>
            {/* Battery body */}
            <mesh position={[0, 0, 0]} rotation={[0, Date.now() * 0.001 + i, 0]}>
              <boxGeometry args={[0.2, 0.35, 0.12]} />
              <meshStandardMaterial color="#44ee44" emissive="#22cc22" emissiveIntensity={1.5} flatShading />
            </mesh>
            {/* Battery top nub */}
            <mesh position={[0, 0.22, 0]}>
              <boxGeometry args={[0.1, 0.08, 0.06]} />
              <meshStandardMaterial color="#66ff66" emissive="#44ff44" emissiveIntensity={2} flatShading />
            </mesh>
            {/* Glow sphere */}
            <mesh>
              <sphereGeometry args={[0.4, 6, 4]} />
              <meshStandardMaterial color="#44ff44" emissive="#22ff22" emissiveIntensity={0.8} flatShading transparent opacity={0.15} />
            </mesh>
            {/* Point light for local glow */}
            <pointLight color="#44ff44" intensity={0.8} distance={3} />
          </group>
        );
      })}
    </group>
  );
}
