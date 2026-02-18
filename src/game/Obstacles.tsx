import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

interface ObstaclesProps {
  color: string;
  accentColor: string;
  speed: number;
  seed: number;
}

function seededRandom(s: number) {
  const x = Math.sin(s * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

export default function Obstacles({ color, accentColor, speed, seed }: ObstaclesProps) {
  const group = useRef<Group>(null);
  const offsetRef = useRef(0);

  const obstacles = useMemo(() => {
    const items = [];
    for (let i = 0; i < 30; i++) {
      const r = seededRandom(seed + i);
      const r2 = seededRandom(seed + i + 100);
      const r3 = seededRandom(seed + i + 200);
      items.push({
        x: (r - 0.5) * 16,
        z: -i * 6 - 5,
        scale: 0.5 + r2 * 1.5,
        type: r3 > 0.5 ? "box" : "cone",
        rotation: r * Math.PI * 2,
      });
    }
    return items;
  }, [seed]);

  useFrame((_, delta) => {
    if (!group.current) return;
    offsetRef.current += speed * delta;
    group.current.position.z = offsetRef.current % 180;
  });

  return (
    <group ref={group}>
      {obstacles.map((obs, i) => (
        <group key={i} position={[obs.x, obs.scale * 0.5 - 0.3, obs.z]} rotation={[0, obs.rotation, 0]}>
          {obs.type === "box" ? (
            <mesh>
              <boxGeometry args={[obs.scale, obs.scale * 1.5, obs.scale]} />
              <meshStandardMaterial color={i % 3 === 0 ? accentColor : color} flatShading />
            </mesh>
          ) : (
            <mesh>
              <coneGeometry args={[obs.scale * 0.6, obs.scale * 2, 5]} />
              <meshStandardMaterial color={i % 3 === 0 ? accentColor : color} flatShading />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
