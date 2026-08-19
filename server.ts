import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory logging buffer for click tracking / telemetry
  const recentClicks: any[] = [];
  const subscribers: string[] = [];
  const contactMessages: any[] = [];

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'SmartPick Guide API',
      timestamp: new Date().toISOString(),
      aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Track Affiliate Click
  app.post('/api/track-click', (req, res) => {
    const clickEvent = req.body;
    if (clickEvent && clickEvent.productId) {
      recentClicks.unshift({
        ...clickEvent,
        serverReceivedAt: new Date().toISOString(),
      });
      if (recentClicks.length > 500) recentClicks.pop();
    }
    res.json({ success: true });
  });

  // Newsletter subscription
  app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      res.status(400).json({ error: 'Valid email is required.' });
      return;
    }
    const cleanEmail = email.toLowerCase().trim();
    if (!subscribers.includes(cleanEmail)) {
      subscribers.push(cleanEmail);
    }
    res.json({
      success: true,
      message: 'Thank you for subscribing to SmartPick Guide product roundups!',
    });
  });

  // Contact form submission
  app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required.' });
      return;
    }
    contactMessages.unshift({
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
      receivedAt: new Date().toISOString(),
    });
    res.json({
      success: true,
      message: 'Your message has been received by the editorial team. We will get back to you shortly.',
    });
  });

  // AI Content & Editorial Assistant (Server-side Gemini 3.7 Flash)
  app.post('/api/ai/editorial-assistant', async (req, res) => {
    try {
      const { taskType, topic, category, existingDraft, targetKeywords } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        res.status(503).json({
          error: 'Gemini API is not configured. Please ensure GEMINI_API_KEY is present in your environment secrets.',
        });
        return;
      }

      const ai = getAiClient();

      let systemInstruction = `You are a senior hardware and product review editor for "SmartPick Guide", an independent, ethical buying guide and product recommendation publication.
CRITICAL COMPLIANCE RULES:
1. NEVER invent or hallucinate fake Amazon customer reviews, fake user ratings, or fake real-time prices.
2. Ground all advice in realistic technical specifications, ergonomics, build quality, and user trade-offs.
3. Maintain an objective, authoritative, and helpful tone (similar to Wirecutter or RTINGS).
4. All suggestions will be human-reviewed before publication.`;

      let prompt = '';

      if (taskType === 'outline') {
        prompt = `Generate a detailed, comprehensive buying guide or review outline for the topic: "${topic}" in category: "${category || 'Consumer Technology'}".
Include:
- Compelling, SEO-friendly headline ideas
- Who should buy & Who should skip
- Key technical factors to evaluate
- Testing methodology section outline
- Suggested FAQ questions (3-4 high-intent shopper queries)`;
      } else if (taskType === 'meta_seo') {
        prompt = `Generate 3 high-CTR, SEO-optimized Meta Titles (under 60 chars) and Meta Descriptions (under 155 chars) for an article about "${topic}".
Target Keywords to integrate naturally: ${targetKeywords || 'best picks, buying guide, review'}.
Format cleanly in Markdown.`;
      } else if (taskType === 'pros_cons') {
        prompt = `Based on standard product engineering and typical user experience for "${topic}", brainstorm 4 realistic, distinct Pros and 3 honest, critical Cons. Avoid generic filler.`;
      } else if (taskType === 'faqs') {
        prompt = `Generate 5 realistic, high-value Frequently Asked Questions (with clear, concise 2-sentence answers) that real buyers ask when shopping for "${topic}".`;
      } else {
        prompt = `Review and enhance the following draft section for clarity, readability, and editorial flow without making unsupported claims:
"${existingDraft || topic}"`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const generatedText = response.text || 'No response generated.';

      res.json({
        success: true,
        result: generatedText,
        disclaimer: 'AI-generated content must be fact-checked and reviewed by an editor before publication.',
      });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      res.status(500).json({
        error: err?.message || 'Failed to process AI editorial request.',
      });
    }
  });

  // Vite middleware for dev / static for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartPick Guide Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
