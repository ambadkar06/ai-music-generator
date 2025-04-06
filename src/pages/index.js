import { useState } from "react";
import Waveform from "../components/Waveform.js"; // Import Waveform component
import CustomParticleBackground from "../components/CustomParticleBackground";

export default function Home() {
  const [music, setMusic] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [energy, setEnergy] = useState(0);
  console.log("Music URL:", music);

  const moods = {
    "Happy": "upbeat cheerful pop music",
    "Sad": "slow emotional piano with strings",
    "Chill": "lofi ambient chill beats",
    "Upbeat": "energetic EDM dance music",
    "Cinematic": "epic orchestral cinematic soundtrack",
  };

  const applyMood = (e) => {
    setPrompt(moods[e.target.value]);
  };

  const generateMusic = async () => {
    setIsLoading(true);
    setMusic("");

    try {
      const response = await fetch("/api/music-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const { musicUrl } = await response.json();
      // Convert base64 to blob and then to blob URL
const responseBlob = await fetch(musicUrl);
const audioBlob = await responseBlob.blob();
const blobUrl = URL.createObjectURL(audioBlob);

setMusic(blobUrl);
    } catch (error) {
      console.error("Failed to generate music:", error);
    }

    setIsLoading(false);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">

{music && <CustomParticleBackground energy={energy} />}


      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 sm:p-8 md:p-12 bg-transparent rounded-lg">
        <h1 className="text-4xl font-extrabold mb-6 text-white text-center sm:text-5xl lg:text-6xl">
          🎶 AI Music Generator
        </h1>

        {/* Mood Selection */}
        <select
          onChange={applyMood}
          className="px-6 py-3 mb-4 border border-gray-400 rounded-lg text-white bg-gray-800 hover:bg-gray-700 transition duration-300 ease-in-out w-64 sm:w-72"
          defaultValue=""
        >
          <option value="" disabled>Select mood</option>
          {Object.keys(moods).map((mood) => (
            <option key={mood} value={mood}>
              {mood}
            </option>
          ))}
        </select>

        {/* Custom Prompt */}
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Or enter custom prompt"
          className="px-6 py-3 mb-4 border border-gray-400 rounded-lg text-white bg-gray-800 hover:bg-gray-700 transition duration-300 ease-in-out w-64 sm:w-72"
        />

        {/* Generate Music Button */}
        <button
          onClick={generateMusic}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out w-64 sm:w-72"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Music"}
        </button>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="mt-4 text-white flex gap-2 items-center justify-center">
            <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating your music...
          </div>
        )}

        {/* Display generated music and waveform */}
        {music && (
          <div className="mt-6 flex flex-col items-center">
            <Waveform audioUrl={music} onEnergyChange={setEnergy} />

            <a
              href={music}
              download="generated-music.wav"
              className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 ease-in-out"
            >
              Download 🎧
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
