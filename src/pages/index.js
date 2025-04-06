import { useState } from "react";
import Waveform from "../components/Waveform";
import CustomParticleBackground from "../components/CustomParticleBackground";

export default function Home() {
  const [bgClass, setBgClass] = useState("");

  const [music, setMusic] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [energy, setEnergy] = useState(0.2);
  const [copied, setCopied] = useState(false);


  const moods = {
    Happy: {
      prompt: "upbeat cheerful pop music",
      bgClass: "from-yellow-400 via-pink-500 to-red-500"
    },
    Sad: {
      prompt: "slow emotional piano with strings",
      bgClass: "from-gray-800 via-blue-900 to-black"
    },
    Chill: {
      prompt: "lofi ambient chill beats",
      bgClass: "from-purple-700 via-indigo-900 to-gray-900"
    },
    Upbeat: {
      prompt: "energetic EDM dance music",
      bgClass: "from-blue-600 via-cyan-400 to-purple-600"
    },
    Cinematic: {
      prompt: "epic orchestral cinematic soundtrack",
      bgClass: "from-gray-700 via-black to-gray-900"
    }
  };
  
  const applyMood = (e) => {
    const selected = moods[e.target.value];
    setPrompt(selected.prompt);
    setBgClass(selected.bgClass);
  };
  
  const generateMusic = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setMusic("");

    try {
      const response = await fetch("/api/music-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const { musicUrl } = await response.json();
      const blobRes = await fetch(musicUrl);
      const audioBlob = await blobRes.blob();
      const blobUrl = URL.createObjectURL(audioBlob);
      setMusic(blobUrl);
    } catch (err) {
      console.error("Music generation failed", err);
    }

    setIsLoading(false);
  };

  return (
    <div className={`relative w-full min-h-screen text-white font-sans bg-gradient-to-br transition-all duration-700 ${bgClass}`}>

  {/* Background Particles */}
  <CustomParticleBackground energy={energy || 0.2} />

  {/* Main Content */}
  <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-4">
    <div className="w-full max-w-2xl p-8 bg-black/50 rounded-xl shadow-2xl border border-white/10">
      <h1 className="text-4xl font-bold mb-6 text-center">
        🎶 AI Music Generator
      </h1>

          <select
            onChange={applyMood}
            className="w-full mb-4 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            defaultValue=""
          >
            <option disabled value="">Select mood</option>
            {Object.keys(moods).map((mood) => (
              <option key={mood} value={mood}>{mood}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Or enter custom prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full mb-4 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={generateMusic}
            disabled={isLoading || !prompt}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
          >
            {isLoading ? "Generating..." : "Generate Music"}
          </button>

          {isLoading && (
            <div className="mt-4 text-center">🔄 Generating your music...</div>
          )}

          {music && (
            <div className="mt-6 text-center">
              <Waveform audioUrl={music} onEnergyChange={setEnergy} />
              <a
                href={music}
                download="generated-music.wav"
                className="inline-block mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
              >
                Download 🎧
              </a>
              {/* Share Link Button */}
<button
  onClick={() => {
    navigator.clipboard.writeText(music);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2s
  }}
  className="inline-block mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg ml-2"
>
  {copied ? "Copied!" : "Copy Link 🔗"}
</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
