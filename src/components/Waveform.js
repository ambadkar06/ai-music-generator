import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export default function Waveform({ audioUrl }) {
  const containerRef = useRef(null);
  const waveSurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioUrl || !containerRef.current) return;
  
    const abortController = new AbortController();
  
    if (waveSurferRef.current) {
      try {
        waveSurferRef.current.destroy();
      } catch (err) {
        console.warn("Destroy error:", err);
      }
    }
  
    const waveSurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#94a3b8",
      progressColor: "#3b82f6",
      height: 80,
      barWidth: 2,
      responsive: true,
    });
  
    waveSurferRef.current = waveSurfer;
  
    const loadAudio = async () => {
      try {
        const res = await fetch(audioUrl, { signal: abortController.signal });
        const blob = await res.blob();
        if (!abortController.signal.aborted) {
          const blobUrl = URL.createObjectURL(blob);
          waveSurfer.load(blobUrl);
        }
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Audio load error:", err);
        }
      }
    };
  
    loadAudio();
    waveSurfer.on("finish", () => setIsPlaying(false));
  
    return () => {
      abortController.abort();
      if (waveSurferRef.current) {
        try {
          waveSurferRef.current.destroy();
        } catch (err) {
          console.warn("Cleanup error:", err);
        }
      }
    };
  }, [audioUrl]);
  
  const togglePlay = () => {
    if (waveSurferRef.current) {
      waveSurferRef.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div ref={containerRef} className="w-full my-4" />
      <button
        onClick={togglePlay}
        className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}


