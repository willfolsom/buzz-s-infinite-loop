import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

function seededRandom(s: number) {
  const x = Math.sin(s * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

/* ---- FISH (Ocean) ---- */
function Fish({ position, speed }: { position: [number, number, number]; speed: number }) {
  const ref = useRef<Group>(null);
  const tailRef = useRef<Group>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame(() => {
    if (!ref.current) return;
    const t = Date.now() * 0.002 + offset;
    ref.current.position.x = position[0] + Math.sin(t) * 2;
    ref.current.position.y = position[1] + Math.sin(t * 1.5) * 0.5;
    ref.current.rotation.y = Math.sin(t) * 0.5 + Math.PI;
    if (tailRef.current) tailRef.current.rotation.y = Math.sin(t * 6) * 0.5;
  });
  return (
    <group ref={ref} position={position} scale={[1.3, 1.3, 1.3]}>
      {/* Body */}
      <mesh>
        <sphereGeometry args={[0.3, 6, 5]} />
        <meshStandardMaterial color="#1199ff" flatShading />
      </mesh>
      {/* Body stripe */}
      <mesh position={[0, 0, 0.01]}>
        <sphereGeometry args={[0.28, 6, 5]} />
        <meshStandardMaterial color="#33bbff" flatShading transparent opacity={0.6} />
      </mesh>
      {/* Tail fin */}
      <group ref={tailRef} position={[-0.3, 0, 0]}>
        <mesh position={[-0.12, 0.08, 0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.2, 0.18, 0.03]} />
          <meshStandardMaterial color="#0077cc" flatShading />
        </mesh>
        <mesh position={[-0.12, -0.08, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.2, 0.18, 0.03]} />
          <meshStandardMaterial color="#0077cc" flatShading />
        </mesh>
      </group>
      {/* Dorsal fin */}
      <mesh position={[0, 0.25, 0]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.1, 0.2, 3]} />
        <meshStandardMaterial color="#0088dd" flatShading />
      </mesh>
      {/* Pectoral fins */}
      <mesh position={[0.05, -0.1, 0.2]} rotation={[0.4, 0.3, 0]}>
        <boxGeometry args={[0.12, 0.02, 0.15]} />
        <meshStandardMaterial color="#0088dd" flatShading />
      </mesh>
      <mesh position={[0.05, -0.1, -0.2]} rotation={[-0.4, -0.3, 0]}>
        <boxGeometry args={[0.12, 0.02, 0.15]} />
        <meshStandardMaterial color="#0088dd" flatShading />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.2, 0.08, 0.15]}>
        <sphereGeometry args={[0.055, 4, 3]} />
        <meshStandardMaterial color="#ffffff" flatShading />
      </mesh>
      <mesh position={[0.22, 0.08, 0.15]}>
        <sphereGeometry args={[0.03, 4, 3]} />
        <meshStandardMaterial color="#000000" flatShading />
      </mesh>
      <mesh position={[0.2, 0.08, -0.15]}>
        <sphereGeometry args={[0.055, 4, 3]} />
        <meshStandardMaterial color="#ffffff" flatShading />
      </mesh>
      <mesh position={[0.22, 0.08, -0.15]}>
        <sphereGeometry args={[0.03, 4, 3]} />
        <meshStandardMaterial color="#000000" flatShading />
      </mesh>
      {/* Mouth */}
      <mesh position={[0.28, -0.02, 0]}>
        <sphereGeometry args={[0.04, 4, 3]} />
        <meshStandardMaterial color="#ff6688" flatShading />
      </mesh>
      {/* Scales shimmer */}
      {[0.1, -0.05, -0.15].map((x, i) => (
        <mesh key={i} position={[x, 0.05 + i * 0.04, 0.22]}>
          <sphereGeometry args={[0.025, 3, 3]} />
          <meshStandardMaterial color="#66ddff" emissive="#44bbff" emissiveIntensity={0.5} flatShading transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* ---- SNAKE (Desert) ---- */
function Snake({ position }: { position: [number, number, number] }) {
  const ref = useRef<Group>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  const segments = 12;
  useFrame(() => {
    if (!ref.current) return;
    const t = Date.now() * 0.002 + offset;
    // Slithering motion - each segment moves with wave
    ref.current.children.forEach((child, i) => {
      if (i < segments) {
        const phase = t * 3 + i * 0.6;
        const r = 0.6 + i * 0.08;
        const angle = (i / segments) * Math.PI * 1.8 + Math.sin(phase) * 0.3;
        child.position.x = Math.cos(angle) * r;
        child.position.z = Math.sin(angle) * r;
        child.position.y = 0.06 + Math.sin(phase) * 0.06;
      }
    });
    ref.current.rotation.y = t * 0.4;
  });
  return (
    <group ref={ref} position={position} scale={[1.3, 1.3, 1.3]}>
      {/* Body segments */}
      {Array.from({ length: segments }).map((_, i) => {
        const size = i === 0 ? 0.14 : 0.12 - i * 0.006;
        const isHead = i === 0;
        return (
          <mesh key={i}>
            <sphereGeometry args={[Math.max(size, 0.04), 5, 4]} />
            <meshStandardMaterial
              color={isHead ? "#5a8a22" : i % 2 === 0 ? "#4a7a1a" : "#6b9933"}
              flatShading
            />
          </mesh>
        );
      })}
      {/* Head details - on first segment */}
      {/* Eyes */}
      <mesh position={[0.7, 0.12, 0.08]}>
        <sphereGeometry args={[0.04, 4, 3]} />
        <meshStandardMaterial color="#ffee00" emissive="#ffcc00" emissiveIntensity={0.6} flatShading />
      </mesh>
      <mesh position={[0.72, 0.12, 0.08]}>
        <sphereGeometry args={[0.02, 3, 3]} />
        <meshStandardMaterial color="#000000" flatShading />
      </mesh>
      <mesh position={[0.7, 0.12, -0.08]}>
        <sphereGeometry args={[0.04, 4, 3]} />
        <meshStandardMaterial color="#ffee00" emissive="#ffcc00" emissiveIntensity={0.6} flatShading />
      </mesh>
      <mesh position={[0.72, 0.12, -0.08]}>
        <sphereGeometry args={[0.02, 3, 3]} />
        <meshStandardMaterial color="#000000" flatShading />
      </mesh>
      {/* Tongue */}
      <mesh position={[0.82, 0.04, 0]}>
        <boxGeometry args={[0.15, 0.01, 0.01]} />
        <meshStandardMaterial color="#cc0000" flatShading />
      </mesh>
      <mesh position={[0.91, 0.04, 0.02]}>
        <boxGeometry args={[0.06, 0.01, 0.01]} />
        <meshStandardMaterial color="#cc0000" flatShading />
      </mesh>
      <mesh position={[0.91, 0.04, -0.02]}>
        <boxGeometry args={[0.06, 0.01, 0.01]} />
        <meshStandardMaterial color="#cc0000" flatShading />
      </mesh>
      {/* Diamond pattern on back */}
      {[1, 3, 5, 7].map((i) => (
        <mesh key={`d${i}`} position={[0, 0.13, 0]} rotation={[0, (i / segments) * Math.PI * 1.8, 0]}>
          <boxGeometry args={[0.06, 0.02, 0.06]} />
          <meshStandardMaterial color="#8b6914" flatShading transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/* ---- DINOSAUR (Forest) - T-Rex style ---- */
function Dinosaur({ position }: { position: [number, number, number] }) {
  const ref = useRef<Group>(null);
  const jawRef = useRef<Group>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame(() => {
    if (!ref.current) return;
    const t = Date.now() * 0.002 + offset;
    ref.current.position.y = position[1] + Math.abs(Math.sin(t)) * 0.3;
    ref.current.rotation.y = Math.sin(t * 0.3) * 0.5;
    // Jaw chomp
    if (jawRef.current) jawRef.current.rotation.x = Math.sin(t * 3) * 0.15;
  });
  return (
    <group ref={ref} position={position} scale={[1.4, 1.4, 1.4]}>
      {/* Body - larger, more muscular */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.7, 0.9, 1.2]} />
        <meshStandardMaterial color="#2d5a1e" flatShading />
      </mesh>
      {/* Belly */}
      <mesh position={[0, 0.45, 0.1]}>
        <boxGeometry args={[0.55, 0.4, 0.9]} />
        <meshStandardMaterial color="#3a6b28" flatShading />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.1, 0.35]}>
        <boxGeometry args={[0.35, 0.5, 0.35]} />
        <meshStandardMaterial color="#2d5a1e" flatShading />
      </mesh>
      {/* Head - big and menacing */}
      <mesh position={[0, 1.3, 0.6]}>
        <boxGeometry args={[0.45, 0.35, 0.6]} />
        <meshStandardMaterial color="#3a6b28" flatShading />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 1.25, 0.95]}>
        <boxGeometry args={[0.35, 0.2, 0.25]} />
        <meshStandardMaterial color="#336622" flatShading />
      </mesh>
      {/* Jaw - animated */}
      <group ref={jawRef} position={[0, 1.15, 0.7]}>
        <mesh position={[0, 0, 0.15]}>
          <boxGeometry args={[0.38, 0.1, 0.4]} />
          <meshStandardMaterial color="#244d16" flatShading />
        </mesh>
        {/* Teeth bottom */}
        {[-0.1, 0, 0.1].map((x, i) => (
          <mesh key={`tb${i}`} position={[x, 0.06, 0.3]}>
            <coneGeometry args={[0.025, 0.08, 3]} />
            <meshStandardMaterial color="#ffffcc" flatShading />
          </mesh>
        ))}
      </group>
      {/* Teeth top */}
      {[-0.12, -0.04, 0.04, 0.12].map((x, i) => (
        <mesh key={`tt${i}`} position={[x, 1.15, 0.95]}>
          <coneGeometry args={[0.02, 0.1, 3]} />
          <meshStandardMaterial color="#ffffcc" flatShading />
        </mesh>
      ))}
      {/* Eyes - fierce */}
      <mesh position={[0.18, 1.38, 0.75]}>
        <sphereGeometry args={[0.06, 4, 3]} />
        <meshStandardMaterial color="#ff4400" emissive="#ff2200" emissiveIntensity={0.8} flatShading />
      </mesh>
      <mesh position={[-0.18, 1.38, 0.75]}>
        <sphereGeometry args={[0.06, 4, 3]} />
        <meshStandardMaterial color="#ff4400" emissive="#ff2200" emissiveIntensity={0.8} flatShading />
      </mesh>
      {/* Brow ridges */}
      <mesh position={[0.18, 1.42, 0.72]}>
        <boxGeometry args={[0.12, 0.04, 0.1]} />
        <meshStandardMaterial color="#244d16" flatShading />
      </mesh>
      <mesh position={[-0.18, 1.42, 0.72]}>
        <boxGeometry args={[0.12, 0.04, 0.1]} />
        <meshStandardMaterial color="#244d16" flatShading />
      </mesh>
      {/* Tiny arms */}
      <mesh position={[-0.3, 0.8, 0.3]} rotation={[0.5, 0, 0.3]}>
        <boxGeometry args={[0.08, 0.25, 0.08]} />
        <meshStandardMaterial color="#2d5a1e" flatShading />
      </mesh>
      <mesh position={[0.3, 0.8, 0.3]} rotation={[0.5, 0, -0.3]}>
        <boxGeometry args={[0.08, 0.25, 0.08]} />
        <meshStandardMaterial color="#2d5a1e" flatShading />
      </mesh>
      {/* Tail - long segmented */}
      <mesh position={[0, 0.6, -0.7]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.6]} />
        <meshStandardMaterial color="#2d5a1e" flatShading />
      </mesh>
      <mesh position={[0, 0.55, -1.1]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.22, 0.22, 0.5]} />
        <meshStandardMaterial color="#336622" flatShading />
      </mesh>
      <mesh position={[0, 0.45, -1.4]} rotation={[0.35, 0, 0]}>
        <coneGeometry args={[0.12, 0.4, 4]} />
        <meshStandardMaterial color="#336622" flatShading />
      </mesh>
      {/* Legs - thick */}
      <mesh position={[-0.25, 0.2, 0.15]}>
        <boxGeometry args={[0.22, 0.45, 0.25]} />
        <meshStandardMaterial color="#244d16" flatShading />
      </mesh>
      <mesh position={[0.25, 0.2, 0.15]}>
        <boxGeometry args={[0.22, 0.45, 0.25]} />
        <meshStandardMaterial color="#244d16" flatShading />
      </mesh>
      {/* Feet */}
      <mesh position={[-0.25, 0, 0.25]}>
        <boxGeometry args={[0.26, 0.08, 0.3]} />
        <meshStandardMaterial color="#244d16" flatShading />
      </mesh>
      <mesh position={[0.25, 0, 0.25]}>
        <boxGeometry args={[0.26, 0.08, 0.3]} />
        <meshStandardMaterial color="#244d16" flatShading />
      </mesh>
      {/* Dorsal spikes */}
      {[-0.4, -0.15, 0.1, 0.3, 0.5].map((z, i) => (
        <mesh key={i} position={[0, 1.15 - i * 0.05, z]}>
          <coneGeometry args={[0.05, 0.18 - i * 0.02, 3]} />
          <meshStandardMaterial color="#44aa33" flatShading />
        </mesh>
      ))}
    </group>
  );
}

/* ---- SATELLITE (Space) ---- */
function Satellite({ position }: { position: [number, number, number] }) {
  const ref = useRef<Group>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame(() => {
    if (!ref.current) return;
    const t = Date.now() * 0.001 + offset;
    ref.current.rotation.y = t;
    ref.current.rotation.z = Math.sin(t * 0.5) * 0.2;
    ref.current.position.y = position[1] + Math.sin(t * 0.7) * 0.5;
  });
  return (
    <group ref={ref} position={position}>
      {/* Core */}
      <mesh>
        <boxGeometry args={[0.3, 0.3, 0.5]} />
        <meshStandardMaterial color="#aaaacc" flatShading />
      </mesh>
      {/* Solar panel left */}
      <mesh position={[-0.6, 0, 0]}>
        <boxGeometry args={[0.7, 0.02, 0.4]} />
        <meshStandardMaterial color="#2244aa" flatShading />
      </mesh>
      {/* Solar panel right */}
      <mesh position={[0.6, 0, 0]}>
        <boxGeometry args={[0.7, 0.02, 0.4]} />
        <meshStandardMaterial color="#2244aa" flatShading />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 4]} />
        <meshStandardMaterial color="#cccccc" flatShading />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.05, 4, 3]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={1} flatShading />
      </mesh>
    </group>
  );
}

/* ---- FIRE DJINN (Volcano) ---- */
function FireDjinn({ position }: { position: [number, number, number] }) {
  const ref = useRef<Group>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame(() => {
    if (!ref.current) return;
    const t = Date.now() * 0.003 + offset;
    ref.current.position.y = position[1] + Math.sin(t) * 0.8;
    ref.current.position.x = position[0] + Math.sin(t * 0.7) * 1;
    ref.current.rotation.y = t * 2;
    // Scale pulsing
    const s = 1 + Math.sin(t * 3) * 0.15;
    ref.current.scale.set(s, s, s);
  });
  return (
    <group ref={ref} position={position}>
      {/* Smoky body - stacked tapered shapes */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.4, 0.8, 5]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff4400" emissiveIntensity={1.5} flatShading transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.3, 5, 4]} />
        <meshStandardMaterial color="#ff8800" emissive="#ff6600" emissiveIntensity={1} flatShading transparent opacity={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.2, 5, 4]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ff8800" emissiveIntensity={1.2} flatShading />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.08, 0.85, 0.15]}>
        <sphereGeometry args={[0.04, 3, 3]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} flatShading />
      </mesh>
      <mesh position={[0.08, 0.85, 0.15]}>
        <sphereGeometry args={[0.04, 3, 3]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} flatShading />
      </mesh>
      {/* Arms - wispy */}
      <mesh position={[-0.35, 0.4, 0]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.08, 0.5, 3]} />
        <meshStandardMaterial color="#ff5500" emissive="#ff3300" emissiveIntensity={1} flatShading transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.35, 0.4, 0]} rotation={[0, 0, -0.5]}>
        <coneGeometry args={[0.08, 0.5, 3]} />
        <meshStandardMaterial color="#ff5500" emissive="#ff3300" emissiveIntensity={1} flatShading transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

/* ---- MAIN CREATURES COMPONENT ---- */
interface CreaturesProps {
  envIndex: number;
  speed: number;
  playerX: number;
  onHit: () => void;
  paused: boolean;
}

export default function Creatures({ envIndex, speed, playerX, onHit, paused }: CreaturesProps) {
  const group = useRef<Group>(null);
  const offsetRef = useRef(0);

  const creatures = useMemo(() => {
    const items: { position: [number, number, number] }[] = [];
    for (let i = 0; i < 6; i++) {
      const r = seededRandom(envIndex * 500 + i);
      items.push({
        position: [
          (r - 0.5) * 14,
          envIndex === 0 ? 2 + seededRandom(envIndex * 500 + i + 50) * 3 : // space - high
          envIndex === 3 ? 0.5 + seededRandom(envIndex * 500 + i + 50) * 1.5 : // ocean - mid
          envIndex === 4 ? 1 + seededRandom(envIndex * 500 + i + 50) * 2 : // volcano - floating
          0.1, // ground level
          -8 - i * 12,
        ],
      });
    }
    return items;
  }, [envIndex]);

  useFrame((_, delta) => {
    if (!group.current || paused) return;
    offsetRef.current += speed * delta;
    group.current.position.z = offsetRef.current % 80;

    // Hit detection against creatures
    creatures.forEach((c) => {
      const worldZ = c.position[2] + group.current!.position.z;
      if (worldZ > 0 && worldZ < 3 && Math.abs(c.position[0] - playerX) < 1.2) {
        onHit();
      }
    });
  });

  return (
    <group ref={group}>
      {creatures.map((c, i) => {
        switch (envIndex) {
          case 0: return <Satellite key={`${envIndex}-${i}`} position={c.position} />;
          case 1: return <Snake key={`${envIndex}-${i}`} position={c.position} />;
          case 2: return <Dinosaur key={`${envIndex}-${i}`} position={c.position} />;
          case 3: return <Fish key={`${envIndex}-${i}`} position={c.position} speed={speed} />;
          case 4: return <FireDjinn key={`${envIndex}-${i}`} position={c.position} />;
          default: return null;
        }
      })}
    </group>
  );
}
