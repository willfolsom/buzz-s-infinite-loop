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
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame(() => {
    if (!ref.current) return;
    const t = Date.now() * 0.002 + offset;
    ref.current.position.x = position[0] + Math.sin(t) * 2;
    ref.current.position.y = position[1] + Math.sin(t * 1.5) * 0.5;
    ref.current.rotation.y = Math.sin(t) * 0.5 + Math.PI;
    // Tail wag
    ref.current.children[1]?.rotation && ((ref.current.children[1] as any).rotation.y = Math.sin(t * 5) * 0.4);
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.3, 5, 4]} />
        <meshStandardMaterial color="#2299ff" flatShading />
      </mesh>
      <mesh position={[-0.3, 0, 0]}>
        <coneGeometry args={[0.2, 0.3, 3]} />
        <meshStandardMaterial color="#1177dd" flatShading />
      </mesh>
      {/* Eye */}
      <mesh position={[0.15, 0.1, 0.15]}>
        <sphereGeometry args={[0.05, 4, 3]} />
        <meshStandardMaterial color="#ffffff" flatShading />
      </mesh>
    </group>
  );
}

/* ---- SNAKE (Desert) ---- */
function Snake({ position }: { position: [number, number, number] }) {
  const ref = useRef<Group>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame(() => {
    if (!ref.current) return;
    const t = Date.now() * 0.003 + offset;
    ref.current.rotation.y = t * 0.5;
  });
  const segments = 8;
  return (
    <group ref={ref} position={position}>
      {Array.from({ length: segments }).map((_, i) => {
        const angle = (i / segments) * Math.PI * 2;
        const r = 0.6;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, 0.05 + Math.sin(i * 0.5) * 0.1, Math.sin(angle) * r]}>
            <sphereGeometry args={[0.1 - i * 0.008, 4, 3]} />
            <meshStandardMaterial color={i === 0 ? "#558822" : "#447711"} flatShading />
          </mesh>
        );
      })}
      {/* Eyes on head */}
      <mesh position={[0.6, 0.15, 0.06]}>
        <sphereGeometry args={[0.03, 3, 3]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} flatShading />
      </mesh>
    </group>
  );
}

/* ---- DINOSAUR (Forest) ---- */
function Dinosaur({ position }: { position: [number, number, number] }) {
  const ref = useRef<Group>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame(() => {
    if (!ref.current) return;
    const t = Date.now() * 0.002 + offset;
    ref.current.position.y = position[1] + Math.abs(Math.sin(t)) * 0.3;
    ref.current.rotation.y = Math.sin(t * 0.3) * 0.5;
  });
  return (
    <group ref={ref} position={position}>
      {/* Body */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.6, 0.8, 1.0]} />
        <meshStandardMaterial color="#336633" flatShading />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.0, 0.5]}>
        <boxGeometry args={[0.4, 0.4, 0.5]} />
        <meshStandardMaterial color="#448844" flatShading />
      </mesh>
      {/* Jaw */}
      <mesh position={[0, 0.8, 0.7]}>
        <boxGeometry args={[0.35, 0.12, 0.3]} />
        <meshStandardMaterial color="#2a5a2a" flatShading />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.15, 1.1, 0.7]}>
        <sphereGeometry args={[0.06, 4, 3]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.3} flatShading />
      </mesh>
      <mesh position={[-0.15, 1.1, 0.7]}>
        <sphereGeometry args={[0.06, 4, 3]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.3} flatShading />
      </mesh>
      {/* Tail */}
      <mesh position={[0, 0.5, -0.6]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.2, 0.8, 4]} />
        <meshStandardMaterial color="#336633" flatShading />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.2, 0.15, 0.2]}>
        <boxGeometry args={[0.18, 0.35, 0.2]} />
        <meshStandardMaterial color="#2a5a2a" flatShading />
      </mesh>
      <mesh position={[0.2, 0.15, 0.2]}>
        <boxGeometry args={[0.18, 0.35, 0.2]} />
        <meshStandardMaterial color="#2a5a2a" flatShading />
      </mesh>
      {/* Spikes */}
      {[0, 0.25, 0.5, -0.25].map((z, i) => (
        <mesh key={i} position={[0, 1.05 + (i === 0 ? 0.1 : 0), z - 0.1]}>
          <coneGeometry args={[0.06, 0.2, 3]} />
          <meshStandardMaterial color="#44aa44" flatShading />
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
}

export default function Creatures({ envIndex, speed }: CreaturesProps) {
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
    if (!group.current) return;
    offsetRef.current += speed * delta;
    group.current.position.z = offsetRef.current % 80;
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
