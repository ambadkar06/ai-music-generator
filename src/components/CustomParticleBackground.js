import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";

export default function CustomParticleBackground({ energy = 0.2 }) {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: { value: "transparent" } }, // 👈 Transparent is key!
          fpsLimit: 60,
          particles: {
            number: { value: 60, density: { enable: true, area: 800 } },
            color: { value: "#00ffff" }, // ✅ Bright cyan
            opacity: { value: 0.7 },
            size: { value: 5, random: true },
            move: {
              enable: true,
              speed: 2,
              outModes: { default: "bounce" },
            },
          },
        }}
      />
    </div>
  );
}
