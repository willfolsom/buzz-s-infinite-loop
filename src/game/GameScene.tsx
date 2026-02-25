import { useState, useEffect, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import BuzzLightyear from "./BuzzLightyear";
import Ground from "./Ground";
import Obstacles from "./Obstacles";
import Creatures from "./Creatures";
import Sigil from "./Sigil";
import SigilGlow from "./SigilGlow";
import Powerups from "./Powerups";
import { environments } from "./environments";

export default function GameScene() {
  const [envIndex, setEnvIndex] = useState(0);
  const [targetX, setTargetX] = useState(0);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("buzzHighScore");
    return saved ? parseInt(saved, 10) : 0;
  });
  const keysRef = useRef<Set<string>>(new Set());
  const playerXRef = useRef(0);

  const env = environments[envIndex];
  const speed = 8;

  // Update high score on death
  useEffect(() => {
    if (paused && score > highScore) {
      setHighScore(score);
      localStorage.setItem("buzzHighScore", String(score));
    }
  }, [paused, score, highScore]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) setEnvIndex((prev) => (prev + 1) % environments.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [paused]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysRef.current.add(e.key);
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysRef.current.delete(e.key);
  }, []);

  // Restart handler
  useEffect(() => {
    const handleRestart = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        if (paused) {
          setPaused(false);
          setScore(0);
          setTargetX(0);
          playerXRef.current = 0;
        }
      }
    };
    window.addEventListener("keydown", handleRestart);
    return () => window.removeEventListener("keydown", handleRestart);
  }, [paused]);

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
      if (!paused) {
        const keys = keysRef.current;
        setTargetX((prev) => {
          let next = prev;
          if (keys.has("ArrowLeft") || keys.has("a")) next = Math.max(prev - 0.12, -5);
          if (keys.has("ArrowRight") || keys.has("d")) next = Math.min(prev + 0.12, 5);
          playerXRef.current = next;
          return next;
        });
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const handleHit = useCallback(() => {
    setPaused(true);
  }, []);

  const handleCollect = useCallback(() => {
    setScore((s) => s + 1);
  }, []);

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      <Canvas
        camera={{ position: [0, 2.8, 4], fov: 65, near: 0.1, far: 100, rotation: [-0.26, 0, 0] }}
        gl={{ antialias: false }}
        dpr={1}
      >
        <color attach="background" args={[env.skyColor]} />
        <fog attach="fog" args={[env.fogColor, 5, 40]} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <pointLight position={[0, 3, -5]} intensity={0.5} color={env.accentColor} />
        <pointLight position={[0, 5, -35]} intensity={2} color="#ffffff" distance={50} />

        <SigilGlow accentColor={env.accentColor} />
        <Sigil color={env.obstacleColor} accentColor={env.accentColor} />
        <BuzzLightyear targetX={targetX} paused={paused} />
        <Ground color={env.groundColor} speed={paused ? 0 : speed} />
        <Obstacles
          color={env.obstacleColor}
          accentColor={env.accentColor}
          speed={paused ? 0 : speed}
          seed={envIndex * 1000}
          playerX={playerXRef.current}
          onHit={handleHit}
          paused={paused}
        />
        <Creatures envIndex={envIndex} speed={paused ? 0 : speed} playerX={playerXRef.current} onHit={handleHit} paused={paused} />
        <Powerups speed={paused ? 0 : speed} seed={envIndex * 1000} playerX={playerXRef.current} onCollect={handleCollect} paused={paused} />
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

      {/* Score */}
      <div className="absolute top-4 right-4 hud-panel">
        <p className="hud-text text-primary text-[8px]">⚡ {score}</p>
        <p className="hud-text text-muted-foreground text-[6px] mt-1">HI {highScore}</p>
      </div>

      {/* Death screen */}
      {paused && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="hud-panel text-center">
            <p className="hud-text text-destructive text-sm mb-2">CRASHED</p>
            <p className="hud-text text-foreground text-[8px]">⚡ {score}</p>
            <p className="hud-text text-muted-foreground text-[6px] mt-2">PRESS R TO RESTART</p>
          </div>
        </div>
      )}

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
