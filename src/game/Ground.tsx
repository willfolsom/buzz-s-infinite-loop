import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, PlaneGeometry } from "three";

interface GroundProps {
  color: string;
  speed: number;
}

export default function Ground({ color, speed }: GroundProps) {
  const ref = useRef<Mesh>(null);
  const offsetRef = useRef(0);

  // Create a chunky N64-style ground with displaced vertices
  const geometry = useMemo(() => {
    const geo = new PlaneGeometry(20, 80, 10, 40);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.5) * Math.cos(y * 0.3) * 0.3);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    offsetRef.current += speed * delta;
    ref.current.position.z = -(offsetRef.current % 40) + 20;
  });

  return (
    <mesh ref={ref} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  );
}
