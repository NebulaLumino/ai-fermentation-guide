"use client";
import { useState } from "react";
const TYPES = ["Kimchi","Kombucha","Sourdough Starter","Sourdough Bread","Yogurt","Kefir","Miso","Tempeh","Sauerkraut","Hot Sauce/Fermented Chili","Pickles","Fermented Fruit"];
const LEVELS = ["Beginner","Intermediate","Advanced"];
export default function FermentationGuidePage() {
  const [fermentType, setFermentType] = useState("Kimchi");
  const [level, setLevel] = useState("Beginner");
  const [batchSize, setBatchSize] = useState("Standard (1 quart/L)");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleGenerate = async () => {
    setLoading(true); setError(""); setOutput("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fermentType, level, batchSize }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOutput(data.output);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3" style={{ color: "hsl(330, 70%, 55%)" }}>AI Fermentation Guide Generator</h1>
          <p className="text-gray-400 text-lg">Get step-by-step fermentation guides with timelines, temperature controls, and troubleshooting</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Fermentation Type</label>
              <select value={fermentType} onChange={(e) => setFermentType(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-rose-500">
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Experience Level</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-rose-500">
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Batch Size</label>
              <select value={batchSize} onChange={(e) => setBatchSize(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-rose-500">
                {["Small (1 cup)","Standard (1 quart/L)","Large (1 gallon/4L)"].map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <button onClick={handleGenerate} disabled={loading} className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50" style={{ backgroundColor: "hsl(330, 70%, 55%)" }}>{loading ? "Generating Guide..." : "Generate Fermentation Guide"}</button>
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 min-h-[500px]">
              <h2 className="text-lg font-semibold text-gray-300 mb-4">Fermentation Guide</h2>
              {output ? <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: output.replace(/\n/g, "<br>") }} /> : <p className="text-gray-600 italic">Your fermentation guide will appear here...</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
