export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { prompt } = req.body;
  
    try {
      const response = await fetch("https://api-inference.huggingface.co/models/facebook/musicgen-small", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "audio/wav"
        },
        body: JSON.stringify({ inputs: prompt || "relaxing lofi beat with piano" })
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Hugging Face MusicGen error:", errorText);
        return res.status(500).json({ error: "Music generation failed", detail: errorText });
      }
  
      const arrayBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(arrayBuffer).toString("base64");
  
      return res.status(200).json({
        musicUrl: `data:audio/wav;base64,${base64Audio}`
      });
  
    } catch (err) {
      console.error("🔥 MusicGen API exception:", err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
  