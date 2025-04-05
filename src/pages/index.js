import { useState } from "react";
import Waveform from "../components/Waveform";

export default function Home() {
  const [music, setMusic] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // 🎵 Preset suggestions
  const presets = [
    "Lofi chill with soft piano",
    "Epic orchestral battle music",
    "Ambient rain with synth",
    "Funky retro disco vibes"
  ];
  const applyPreset = (text) => {
    setPrompt(text);
  };
  const generateMusic = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/music-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const { musicUrl } = await response.json();
      setMusic(musicUrl);

    } catch (error) {
      console.error("Failed to generate music:", error);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">AI Music Generator</h1>
      {/* 🎵 Preset Prompt Buttons */}
<div className="flex gap-2 flex-wrap justify-center mb-4">
  {presets.map((preset, index) => (
    <button
      key={index}
      onClick={() => applyPreset(preset)}
      className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
    >
      {preset}
    </button>
  ))}
</div>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt"
        className="px-4 py-2  border border-gray-300 rounded-lg mb-4 w-64"
      />
      <button
        onClick={generateMusic}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate Music"}
      </button>
      {isLoading && (
        <div className="mt-4">
          <svg
            className="animate-spin h-5 w-5 mr-3 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20c3.042 0 5.824-1.135 7.938-3l-2.647-3A7.962 7.962 0 0112 16v4zm5.291-6A7.962 7.962 0 0112 20v4c4.418 0 8-3.582 8-8h-4zM16.938 3C15.824 1.135 13.042 0 10 0v4c1.79 0 3.527.684 4.826 1.938L16.937 3z"
            ></path>
          </svg>
          Generating music...
        </div>
      )}
      
      {music && (
  <>  
    <Waveform audioUrl={music} />
    <a
      href={music}
      download="generated-music.wav"
      className="mt-2 inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
      Download
    </a>
  </>
)}

    </div>
    
  );
}