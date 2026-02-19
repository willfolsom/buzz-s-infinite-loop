import { useState, useEffect, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import BuzzLightyear from "./BuzzLightyear";
import Ground from "./Ground";
import Obstacles from "./Obstacles";
import Creatures from "./Creatures";
import Sigil from "./Sigil";
import { environments } from "./environments";

export default function GameScene() {
  const [envIndex, setEnvIndex] = useState(0);
  const [targetX, setTargetX] = useState(0);
  const keysRef = useRef<Set<string>>(new Set());

  const env = environments[envIndex];
  const speed = 8;

  useEffect(() => {
    const interval = setInterval(() => {
      setEnvIndex((prev) => (prev + 1) % environments.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysRef.current.add(e.key);
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysRef.current.delete(e.key);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    let raf: number;
    const update = () => {
      const keys = keysRef.current;
      setTargetX((prev) => {
        let next = prev;
        if (keys.has("ArrowLeft") || keys.has("a")) next = Math.max(prev - 0.12, -5);
        if (keys.has("ArrowRight") || keys.has("d")) next = Math.min(prev + 0.12, 5);
        return next;
      });
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      <Canvas
        camera={{ position: [0, 2.8, 4], fov: 65, near: 0.1, far: 100 }}
        gl={{ antialias: false }}
        dpr={1}
      >
        <color attach="background" args={[env.skyColor]} />
        <fog attach="fog" args={[env.fogColor, 5, 40]} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <pointLight position={[0, 3, -5]} intensity={0.5} color={env.accentColor} />

        <Sigil color={env.obstacleColor} accentColor={env.accentColor} />
        <BuzzLightyear targetX={targetX} />
        <Ground color={env.groundColor} speed={speed} />
        <Obstacles
          color={env.obstacleColor}
          accentColor={env.accentColor}
          speed={speed}
          seed={envIndex * 1000}
        />
        <Creatures envIndex={envIndex} speed={speed} />
      </Canvas>

      {/* Hidden SoundCloud autoplay */}
      <iframe
        className="hidden"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/sxnctuary-y/fast-travel&color=%23ff5500&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false"
      />

      {/* HUD */}
      <div className="absolute top-4 left-4 hud-panel">
        <p className="hud-text text-primary text-xs">{env.name}</p>
      </div>


      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hud-panel text-center">
        <p className="hud-text text-foreground text-[8px] leading-relaxed">
          ← → MOVE
        </p>
      </div>

      <div className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none opacity-20">
        <p className="hud-text text-primary text-[10px] rotate-90 origin-center whitespace-nowrap tracking-widest">
          TO INFINITY AND BEYOND
        </p>
      </div>
    </div>
  );
}
