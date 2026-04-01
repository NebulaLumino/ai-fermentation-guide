"use client";
import { useState } from "react";

function Page() {
  const [fermentType, setFermentType] = useState("Vegetables (Kimchi, Sauerkraut)");
  const [ingredient, setIngredient] = useState("");
  const accent = "violet";
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!ingredient.trim()) { setError("Please enter your ferment ingredient."); return; }
    setLoading(true); setError(""); setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fermentType, ingredient }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setOutput(data.output);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className={`text-4xl font-bold mb-3 bg-gradient-to-r from-${accent}-400 to-${accent}-600 bg-clip-text text-transparent`}>AI Fermentation Guide</h1>
        <p className="text-gray-400 text-sm">Step-by-step fermentation guides for kimchi, sauerkraut, kombucha, and more</p>
      </div>
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Fermentation Details</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fermentation Type</label>
            <select value={fermentType} onChange={e => setFermentType(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-violet-500">
              <option>Vegetables (Kimchi, Sauerkraut)</option><option>Kombucha</option><option>Kefir</option><option>Tempeh</option><option>Miso</option><option>Yogurt</option><option>Hot Sauce</option><option>Fermented Fruit</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Specific Ingredient/Recipe *</label>
            <input value={ingredient} onChange={e => setIngredient(e.target.value)} placeholder="e.g., napa cabbage kimchi, ginger lemon kombucha, black bean tempeh" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-violet-500" />
          </div>
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <button onClick={handleGenerate} disabled={loading} className={`px-8 py-3 rounded-lg font-semibold text-white ${loading ? 'bg-violet-700 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-500 transition-all'}`}>
          {loading ? "Fermenting..." : "Generate Guide"}
        </button>
      </div>
      {error && <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300 text-sm mb-6">{error}</div>}
      {output && (
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">Fermentation Guide</h2>
          <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">{output}</pre>
        </div>
      )}
    </main>
  );
}
export default Page;
