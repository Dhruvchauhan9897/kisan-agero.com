import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY_MISSING');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const CROP_EXTRACT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    detectedLanguage: {
      type: Type.STRING,
      description: 'Language spoken or written, e.g. Hindi, Marathi, Punjabi, Telugu, English',
    },
    cropId: {
      type: Type.STRING,
      description:
        'Must be one of: wheat, soybean, paddy, mustard, chana, cotton, onion, maize. Empty string if not mentioned.',
    },
    regionId: {
      type: Type.STRING,
      description:
        'Closest matching region ID from: sehore_mp, indore_mp, nashik_mh, latur_mh, ludhiana_pb, nizamabad_tg. Empty string if not clear.',
    },
    quantityQuintals: {
      type: Type.NUMBER,
      description: 'Quantity in quintals (convert tonnes/tons * 10, kg / 100, bags*0.5 if 50kg bag). 0 if not mentioned.',
    },
    moisturePct: {
      type: Type.NUMBER,
      description: 'Moisture percentage if mentioned, 0 if not mentioned.',
    },
    foreignMatterPct: {
      type: Type.NUMBER,
      description: 'Dust or foreign matter percentage if mentioned, 0 if not mentioned.',
    },
    grade: {
      type: Type.STRING,
      description: 'One of A, FAQ, B if quality/grade mentioned, empty string otherwise.',
    },
    confidenceNote: {
      type: Type.STRING,
      description: 'Brief 1-sentence plain explanation of what was understood.',
    },
  },
  required: ['detectedLanguage', 'confidenceNote'],
};

async function extractCropFieldsFromText(transcript: string, uiLanguage: string) {
  const ai = getGeminiClient();
  const prompt = `Extract agricultural crop-selling details from this farmer's input: "${transcript}".
Supported cropIds:
- wheat (गेहूं, गहू, ਕਣਕ, గోధుమలు)
- soybean (सोयाबीन, ਸੋਇਆਬੀਨ, సోయాబీన్)
- paddy (धान, भात, ਝੋਨਾ, వరి, rice)
- mustard (सरसों, मोहरी, ਸਰ੍ਹੋਂ, ఆవాలు)
- chana (चना, हरभरा, ਛੋਲੇ, శనగలు, gram)
- cotton (कपास, कापूस, ਨਰਮਾ, పత్తి)
- onion (प्याज, कांदा, ਪਿਆਜ਼, ఉల్లిపాయ)
- maize (मक्का, मका, ਮੱਕੀ, మొక్కజొన్న, corn)

Supported regionIds:
- sehore_mp (Sehore, Bhopal, Raisen, Vidisha)
- indore_mp (Indore, Malwa, Ujjain, Dewas, Dhar)
- nashik_mh (Nashik, Niphad, Lasalgaon, Pune)
- latur_mh (Latur, Marathwada, Solapur, Beed)
- ludhiana_pb (Ludhiana, Khanna, Samrala, Punjab, Rajpura)
- nizamabad_tg (Nizamabad, Karimnagar, Armoor, Telangana, Warangal)

Write confidenceNote in language code "${uiLanguage}". Return 0 or empty string for fields not mentioned.`;

  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: CROP_EXTRACT_SCHEMA,
    },
  });

  const raw = (response.text ?? '{}').trim();
  const parsed = JSON.parse(raw) as {
    detectedLanguage?: string;
    cropId?: string;
    regionId?: string;
    quantityQuintals?: number;
    moisturePct?: number;
    foreignMatterPct?: number;
    grade?: string;
    confidenceNote?: string;
  };

  const validCrops = new Set(['wheat', 'soybean', 'paddy', 'mustard', 'chana', 'cotton', 'onion', 'maize']);
  const validRegions = new Set([
    'sehore_mp',
    'indore_mp',
    'nashik_mh',
    'latur_mh',
    'ludhiana_pb',
    'nizamabad_tg',
  ]);
  const validGrades = new Set(['A', 'FAQ', 'B']);

  return {
    transcript,
    detectedLanguage: parsed.detectedLanguage || 'Detected',
    cropId: parsed.cropId && validCrops.has(parsed.cropId) ? parsed.cropId : undefined,
    regionId: parsed.regionId && validRegions.has(parsed.regionId) ? parsed.regionId : undefined,
    quantityQuintals:
      typeof parsed.quantityQuintals === 'number' && parsed.quantityQuintals > 0
        ? Math.round(parsed.quantityQuintals * 10) / 10
        : undefined,
    moisturePct:
      typeof parsed.moisturePct === 'number' && parsed.moisturePct > 0 && parsed.moisturePct <= 35
        ? parsed.moisturePct
        : undefined,
    foreignMatterPct:
      typeof parsed.foreignMatterPct === 'number' &&
      parsed.foreignMatterPct > 0 &&
      parsed.foreignMatterPct <= 15
        ? parsed.foreignMatterPct
        : undefined,
    grade:
      parsed.grade && validGrades.has(parsed.grade)
        ? (parsed.grade as 'A' | 'FAQ' | 'B')
        : undefined,
    confidenceNote: parsed.confidenceNote || 'Extracted available fields from your input.',
  };
}

function handleGeminiError(err: unknown, res: express.Response) {
  const message = err instanceof Error ? err.message : 'Unexpected server error';
  if (message === 'GEMINI_API_KEY_MISSING') {
    return res.status(503).json({
      error:
        'Voice and AI explanation require a Gemini API key in Settings > Secrets. All net proceeds calculations still work locally.',
    });
  }
  console.error('Gemini API error:', err);
  return res.status(502).json({
    error: `Unable to process request via Gemini service: ${message}`,
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '12mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'kisanmargin' });
  });

  app.post('/api/voice-parse', async (req, res) => {
    try {
      const { audioBase64, mimeType, uiLanguage } = req.body as {
        audioBase64?: string;
        mimeType?: string;
        uiLanguage?: string;
      };

      if (!audioBase64 || !mimeType) {
        return res.status(400).json({ error: 'Audio recording payload is required.' });
      }

      const ai = getGeminiClient();
      const transcribeResp = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: audioBase64,
              },
            },
            {
              text: 'Transcribe this farmer voice message accurately in the original language spoken (Hindi, Marathi, Punjabi, Telugu, or English).',
            },
          ],
        },
      });

      const transcript = (transcribeResp.text ?? '').trim();
      if (!transcript) {
        return res.status(422).json({ error: 'No clear speech detected in the recording.' });
      }

      const extracted = await extractCropFieldsFromText(transcript, uiLanguage || 'en');
      return res.json(extracted);
    } catch (err) {
      return handleGeminiError(err, res);
    }
  });

  app.post('/api/text-parse', async (req, res) => {
    try {
      const { text, uiLanguage } = req.body as { text?: string; uiLanguage?: string };
      if (!text || !text.trim()) {
        return res.status(400).json({ error: 'Please enter a phrase describing your crop lot.' });
      }
      const extracted = await extractCropFieldsFromText(text.trim(), uiLanguage || 'en');
      return res.json(extracted);
    } catch (err) {
      return handleGeminiError(err, res);
    }
  });

  app.post('/api/outlook-explain', async (req, res) => {
    try {
      const { cropName, regionName, moisturePct, faqMoistureMax, priceRangeLow, priceRangeHigh, currentModal, uiLanguage } =
        req.body as {
          cropName: string;
          regionName: string;
          moisturePct: number;
          faqMoistureMax: number;
          priceRangeLow: number;
          priceRangeHigh: number;
          currentModal: number;
          uiLanguage: string;
        };

      const ai = getGeminiClient();
      const prompt = `You are explaining a 7-day agricultural market outlook to a farmer in language "${uiLanguage}".
Crop: ${cropName}
Region: ${regionName}
Current Verified Modal Rate: Rs ${currentModal}/qtl
Projected 7-day uncertain range: Rs ${priceRangeLow} to Rs ${priceRangeHigh}/qtl
Farmer's lot moisture: ${moisturePct}% (FAQ limit: ${faqMoistureMax}%)

Write 3 short, practical bullet points in plain language (${uiLanguage}) covering:
1. Why the next 7 days carry price uncertainty (arrivals, weather, mill demand) — explicitly state this is an uncertain range, never a guaranteed price.
2. What moisture ${moisturePct}% vs ${faqMoistureMax}% FAQ means for their actual take-home net cash.
3. One practical selling tip (e.g. compare net proceeds after transport, or dry grain if above FAQ).
Keep it under 120 words total. No markdown headers or jargon.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
      });

      return res.json({ explanation: (response.text ?? '').trim() });
    } catch (err) {
      return handleGeminiError(err, res);
    }
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexHtml = path.join(distDir, 'index.html');
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KisanMargin server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
