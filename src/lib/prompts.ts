// lib/prompts.ts - AI Humanizer Prompts

export type HumanizeMode = 'standard' | 'academic' | 'creative';

export function getHumanizePrompt(mode: HumanizeMode, input: string): string {
  const prompts: Record<HumanizeMode, string> = {
    standard: `You are a writing assistant. Rewrite the following AI-generated text to sound more natural and human-written.
Rules:
- Keep the original meaning completely intact
- Use varied sentence lengths (mix short and long)
- Add natural transitions and connective words
- Avoid overly perfect or formulaic structures
- Use occasional contractions (it's, don't, etc.)
- Output only the rewritten text, no explanations or extra commentary.

Text to rewrite:
${input}`,

    academic: `You are an academic writing assistant. Rewrite the following text to sound like it was written by a knowledgeable human student or researcher.
Rules:
- Maintain academic tone but avoid robotic perfection
- Use varied sentence structures
- Include natural academic transitions (however, furthermore, notably, etc.)
- Keep all original arguments and facts
- Avoid overly uniform paragraph lengths
- Output only the rewritten text, no explanations or extra commentary.

Text to rewrite:
${input}`,

    creative: `You are a creative writing assistant. Rewrite the following text with more personality, warmth, and human flair.
Rules:
- Make it engaging and relatable
- Add natural personality without changing core meaning
- Use vivid but simple language
- Vary rhythm and sentence flow
- Feel free to use rhetorical questions or light humor where appropriate
- Output only the rewritten text, no explanations or extra commentary.

Text to rewrite:
${input}`,
  };

  return prompts[mode];
}
