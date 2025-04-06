// src/components/CustomParticleBackground.js
import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function CustomParticleBackground({ energy = 100 }) {
  const particlesInit = useCallback(async (engine) => {
    // load slim version
    await loadSlim(engine);
  }, []);

  const particleColor =
    energy > 200 ? "#ff00ff" :
    energy > 150 ? "#00ffff" :
    energy > 100 ? "#8884ff" :
    "#ffffff";

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
     style={{ position: "absolute", zIndex: 0 }}
  className="top-0 left-0 w-full h-full"
      options={{
        fullScreen: { enable: false },
        background: {
          color: { value: "transparent" }
        },
        fpsLimit: 60,
        particles: {
          number: {
            value: 60,
            density: {
              enable: true,
              area: 800
            }
          },
          color: { value: "#ff0000" },
          shape: {
            type: "circle"
          },
          opacity: {
            value: 0.4
          },
          size: {
            value: 3
          },
          move: {
            enable: true,
            speed: energy / 10 || 1,
            direction: "none",
            outModes: {
              default: "out"
            }
          },
        },
        detectRetina: true,
      }}
    />
  );
}
