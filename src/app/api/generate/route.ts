"use server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { fermentType, ingredient } = await req.json();
    const openai = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a fermentation expert and food scientist. Generate a comprehensive fermentation guide including: ingredients list with quantities, salt-to-vegetable ratio, step-by-step preparation instructions, optimal fermentation temperature and time, troubleshooting tips (mold, off-smells), signs of successful fermentation, and storage instructions. Use safe food handling practices." },
        { role: "user", content: `Type: ${fermentType}\nIngredient: ${ingredient}` },
      ],
      temperature: 0.7, max_tokens: 2048,
    });
    return NextResponse.json({ output: completion.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
