import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
export async function POST(req: NextRequest) {
  try {
    const { fermentType, level, batchSize } = await req.json();
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: "https://api.deepseek.com/v1" });
    const prompt = `Create a comprehensive fermentation guide for ${fermentType}. Experience level: ${level}. Batch size: ${batchSize}.\n\nInclude:\n1. **Ingredients List** - Full ingredient list with specific amounts for the batch size\n2. **Equipment Needed** - Jars, airlocks, weights, thermometers, etc.\n3. **Step-by-Step Instructions** - Detailed day-by-day (or week-by-week) process\n4. **Fermentation Timeline** - Start date, when to check, optimal harvest window\n5. **Temperature Control** - Ideal temperature range, what happens if too hot/cold\n6. **Signs of Success** - What good fermentation looks, smells, tastes like\n7. **Troubleshooting Guide** - Mold, off-flavors, slow fermentation, sliminess\n8. **Storage & Shelf Life** - How to store finished product\n\nUse clear numbered steps and markdown headers.`;
    const completion = await openai.chat.completions.create({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], max_tokens: 1600, temperature: 0.7 });
    return NextResponse.json({ output: completion.choices[0]?.message?.content || "No guide generated." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Generation failed" }, { status: 500 });
  }
}
