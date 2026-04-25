export const seoPages = [
  { slug: 'ai-humanizer-for-essays', title: 'AI Humanizer for Essays', description: 'Humanize AI-written essays into natural, readable text while preserving your original meaning.' },
  { slug: 'humanize-ai-text-for-blogs', title: 'Humanize AI Text for Blogs', description: 'Rewrite AI-generated blog drafts so they sound clearer, more natural, and ready for readers.' },
  { slug: 'make-ai-emails-sound-human', title: 'Make AI Emails Sound Human', description: 'Turn stiff AI email drafts into polished, natural messages for work and outreach.' },
  { slug: 'humanize-ai-writing', title: 'Humanize AI Writing', description: 'Make AI writing sound more natural with a simple AI humanizer workflow.' },
  { slug: 'rewrite-ai-text-naturally', title: 'Rewrite AI Text Naturally', description: 'Rewrite AI text into natural human-sounding copy for everyday writing.' },
  { slug: 'make-ai-text-more-human', title: 'Make AI Text More Human', description: 'Improve AI-generated text so it reads more clearly and naturally.' },
  { slug: 'ai-rewriter-that-sounds-human', title: 'AI Rewriter That Sounds Human', description: 'Use an AI rewriter designed to create natural, human-sounding output.' },
  { slug: 'humanize-ai-content-for-students', title: 'Humanize AI Content for Students', description: 'Polish AI-assisted student writing into clearer, more natural text.' },
  { slug: 'bypass-ai-detection', title: 'Bypass AI Detection', description: 'Rewrite AI-generated text to reduce obvious AI writing patterns and improve readability.' },
  { slug: 'make-ai-sounding-text-natural', title: 'Make AI Text Sound Natural', description: 'Convert AI-sounding text into smoother, more natural writing.' },
  { slug: 'ai-paraphrasing-tool', title: 'AI Paraphrasing Tool', description: 'Paraphrase AI-generated text into clearer and more natural wording.' },
  { slug: 'remove-ai-detection', title: 'Remove AI Detection', description: 'Humanize AI text by reducing repetitive patterns and unnatural phrasing.' },
  { slug: 'humanize-ai-content-for-marketers', title: 'Humanize AI Content for Marketers', description: 'Turn AI marketing drafts into more persuasive, natural, brand-friendly copy.' },
  { slug: 'ai-content-detector-proof', title: 'AI Content Detector Proof', description: 'Improve AI content so it reads more naturally and avoids common detector triggers.' },
  { slug: 'make-ai-generated-content-undetectable', title: 'Make AI Generated Content Undetectable', description: 'Rewrite AI-generated content into more natural human-style writing.' },
  { slug: 'bypass-turnitin-ai-humanizer', title: 'Bypass Turnitin with AI Humanizer', description: 'Humanize AI-assisted academic writing with more natural phrasing and structure.' },
  { slug: 'make-ai-sound-human', title: 'Make AI Sound Human', description: 'Make AI-generated writing sound more human, natural, and readable.' },
  { slug: 'remove-ai-writing-patterns', title: 'Remove AI Writing Patterns', description: 'Reduce common AI writing patterns such as repetitive phrasing and robotic structure.' },
  { slug: 'humanize-ai-for-research-papers', title: 'Humanize AI for Research Papers', description: 'Polish AI-assisted research paper text for clarity, flow, and natural tone.' },
  { slug: 'ai-text-to-natural-human-text', title: 'AI Text to Natural Human Text', description: 'Convert AI text into natural human-style writing in seconds.' },
  { slug: 'humanize-ai-linkedin-posts', title: 'Humanize AI LinkedIn Posts', description: 'Make AI-generated LinkedIn posts sound authentic, professional, and readable.' },
  { slug: 'humanize-ai-content-for-seo', title: 'Humanize AI Content for SEO', description: 'Improve AI SEO content so it reads naturally for humans while keeping search intent clear.' },
  { slug: 'ai-writing-improvement-tool', title: 'AI Writing Improvement Tool', description: 'Improve AI writing with clearer wording, better flow, and a more natural tone.' },
  { slug: 'humanize-ai-for-freelancers', title: 'Humanize AI for Freelancers', description: 'Help freelance writers polish AI drafts into client-ready, human-sounding content.' },
  { slug: 'ai-text-detector-remover', title: 'AI Text Detector Remover', description: 'Rewrite AI text to remove obvious detector-triggering patterns and improve readability.' },
  { slug: 'humanize-ai-for-website-content', title: 'Humanize AI for Website Content', description: 'Turn AI website copy into natural, polished text for landing pages and articles.' },
] as const;

export type SeoPageSlug = (typeof seoPages)[number]['slug'];

export function getSeoPage(slug: string) {
  return seoPages.find((page) => page.slug === slug);
}
