import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();

// High resolution image support
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const GEMINI_FALLBACK_MODELS = [
  'gemini-3.8-flash',
  'gemini-2.5-flash',
  'gemini-3.1-flash-lite',
] as const;

async function generateAndParseWithFallback<T>(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config: any;
    validator?: (data: any) => boolean;
  }
): Promise<{ data: T; usedModel: string }> {
  let lastError: unknown = null;

  for (const model of GEMINI_FALLBACK_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);

      if (params.validator && !params.validator(parsed)) {
        throw new Error(`Data format dari model ${model} tidak sesuai skema.`);
      }

      return { data: parsed as T, usedModel: model };
    } catch (err: unknown) {
      lastError = err;
    }
  }

  throw lastError || new Error('Semua model Gemini dalam rantai cadangan gagal merespons.');
}

// Support both /api/gemini/... and /gemini/... in case Vercel rewrites strip prefix
const router = express.Router();

router.get('/status', (_req: Request, res: Response) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.json({
    connected: hasKey,
    primaryModel: 'gemini-3.8-flash',
    fallbackModels: ['gemini-2.5-flash', 'gemini-3.1-flash-lite'],
    features: [
      'Multimodal AI Vision (Image Recognition)',
      'Real-Time Unlimited Indonesian Recipe Synthesis',
      'Zero Food Waste Intelligence',
      '3-Tier Automatic Model Fallback Redundancy',
      'Vercel Serverless Ready'
    ]
  });
});

router.post('/analyze-photos', async (req: Request, res: Response) => {
  try {
    const { photos } = req.body;
    if (!Array.isArray(photos) || photos.length === 0) {
      return res.status(400).json({ error: 'Tidak ada foto yang dikirim untuk dianalisis.' });
    }

    const ai = getGeminiClient();
    const parts: Array<{ inlineData?: { mimeType: string; data: string }; text?: string }> = [];
    photos.slice(0, 3).forEach((photo: { url?: string }) => {
      if (photo.url?.startsWith('data:')) {
        const matches = photo.url.match(/^data:([a-zA-Z0-9/.-]+);base64,(.+)$/);
        if (matches) parts.push({ inlineData: { mimeType: matches[1], data: matches[2] } });
      }
    });
    if (parts.length === 0) {
      return res.status(400).json({ error: 'Format foto tidak valid atau tidak memiliki data base64.' });
    }
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini Vision belum aktif. Tambahkan GEMINI_API_KEY pada environment server untuk menganalisis foto asli.',
        code: 'GEMINI_API_KEY_MISSING'
      });
    }

    const hasReceiptHint = photos.some((photo: { label?: string; type?: string }) =>
      photo.type === 'receipt' || /struk|nota|receipt|kasir|belanja/i.test(photo.label || '')
    );
    parts.push({ text: `Analisis gambar dengan Gemini Vision untuk inventaris bahan makanan Indonesia. Tentukan jenis gambar dari isi visual, bukan hanya nama file. Jika struk: ekstrak hanya barang makanan/minuman/bahan masak, kuantitas/berat jika tercetak, harga jika terbaca, nama toko, tanggal transaksi, dan total belanja; abaikan barang nonmakanan. Jangan menafsirkan harga sebagai kuantitas atau tanggal transaksi sebagai tanggal kedaluwarsa. Jika foto kulkas/dapur: identifikasi hanya bahan yang benar-benar terlihat dan perkirakan kuantitas hanya bila cukup jelas. Jangan mengarang bahan atau tanggal kedaluwarsa. Kategori harus salah satu protein/sayur/karbo/bumbu/dairy/lainnya; urgency urgent/medium/safe sebagai perkiraan umum; shelf meat/crisper/chiller/freezer/door. Jika bukan struk atau bahan makanan, kembalikan detectedIngredients kosong dan jelaskan pada summary. Petunjuk dari uploader: ${hasReceiptHint ? 'kemungkinan struk, verifikasi dari gambar' : 'jenis belum pasti, verifikasi dari gambar'}.` });

    const { data: parsed, usedModel } = await generateAndParseWithFallback<{
      summary?: string; isReceipt?: boolean; storeName?: string; receiptDate?: string;
      totalSpent?: string; detectedIngredients?: any[];
    }>(ai, {
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            isReceipt: { type: Type.BOOLEAN },
            storeName: { type: Type.STRING },
            receiptDate: { type: Type.STRING },
            totalSpent: { type: Type.STRING },
            detectedIngredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING }, quantity: { type: Type.STRING },
                  category: { type: Type.STRING }, urgency: { type: Type.STRING },
                  shelf: { type: Type.STRING }, icon: { type: Type.STRING }, price: { type: Type.STRING }
                },
                required: ['name', 'quantity', 'category', 'urgency', 'shelf']
              }
            }
          },
          required: ['summary', 'detectedIngredients', 'isReceipt']
        }
      },
      validator: (data) => Array.isArray(data?.detectedIngredients)
    });

    return res.json({
      isAiVision: true, usedModel, isReceipt: !!parsed.isReceipt,
      storeName: parsed.storeName || '', receiptDate: parsed.receiptDate || '',
      totalSpent: parsed.totalSpent || '', summary: parsed.summary || 'Berhasil menganalisis gambar.',
      detectedIngredients: parsed.detectedIngredients || []
    });
  } catch (err: unknown) {
    console.error('Error in analyze-photos:', err);
    return res.status(502).json({
      error: err instanceof Error ? `Analisis Gemini gagal: ${err.message}` : 'Gagal menganalisis foto.',
      code: 'GEMINI_VISION_FAILED'
    });
  }
});

router.post('/generate-recipes', async (req: Request, res: Response) => {
  try {
    const { ingredients, photoItems, searchMode, filters, avoidTitles } = req.body;

    const allIngredients = [
      ...(Array.isArray(ingredients) ? ingredients : []),
      ...(Array.isArray(photoItems) ? photoItems : [])
    ];

    if (allIngredients.length === 0) {
      return res.status(400).json({ error: 'Daftar bahan tidak boleh kosong.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(200).json({
        isAiGenerated: false,
        recipes: [],
        message: 'GEMINI_API_KEY belum terpasang di Secrets / Environment Variables.'
      });
    }

    const prompt = `Kamu adalah Executive Chef Kreatif Indonesia kelas bintang 5 yang ahli dalam Zero Food Waste Cooking.
Pengguna ingin memasak menggunakan bahan yang saat ini tersedia:
- Bahan yang tersedia: ${allIngredients.join(', ')}
- Opsi Metode Pencarian: ${searchMode || 'Bahan Kulkas & Foto'}
- Preferensi Pengguna:
  * Budget: ${filters?.budget || 'Bebas'}
  * Maksimal Waktu Memasak: ${filters?.cookingTime || 'Maks. 30 menit'}
  * Porsi: ${filters?.servings || '2'} Porsi
  * Selera / Pantangan: ${filters?.preferences || 'Suka Pedas Gurih'}
${avoidTitles && avoidTitles.length > 0 ? `- HINDARI membuat resep dengan judul berikut: ${avoidTitles.join(', ')}` : ''}

TUGAS:
Hasilkan 3 sampai 4 resep masakan Nusantara atau modern fusion yang SANGAT KREATIF, SPESIFIK, dan LEZAT yang menggunakan bahan-bahan di atas.
Setiap resep wajib menyertakan:
1. "story": Cerita kuliner / filosofi unik khas koki di balik resep ini (2-3 kalimat menarik).
2. "chefTip": Tips rahasia koki untuk menjaga kelezatan, nutrisi, atau teknik memasak terbaik.
3. Langkah-langkah memasak ("steps") berurutan yang runtut dengan estimasi waktu per langkah (dalam menit).
4. Persentase kecocokan bahan ("matchPercentage") antara 75% sampai 100%.`;

    const { data: parsed, usedModel } = await generateAndParseWithFallback<any[]>(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              story: { type: Type.STRING },
              chefTip: { type: Type.STRING },
              matchPercentage: { type: Type.NUMBER },
              prepTimeMinutes: { type: Type.NUMBER },
              cookTimeMinutes: { type: Type.NUMBER },
              totalTimeMinutes: { type: Type.NUMBER },
              difficulty: { type: Type.STRING },
              estimatedCost: { type: Type.STRING },
              calories: { type: Type.NUMBER },
              servings: { type: Type.NUMBER },
              urgencyMessage: { type: Type.STRING },
              ingredients: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    amount: { type: Type.STRING },
                    isOwned: { type: Type.BOOLEAN },
                    urgentPriority: { type: Type.BOOLEAN }
                  },
                  required: ['name', 'amount', 'isOwned']
                }
              },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.NUMBER },
                    instruction: { type: Type.STRING },
                    durationMinutes: { type: Type.NUMBER },
                    tip: { type: Type.STRING }
                  },
                  required: ['step', 'instruction']
                }
              },
              nutrition: {
                type: Type.OBJECT,
                properties: {
                  calories: { type: Type.NUMBER },
                  protein: { type: Type.STRING },
                  carbs: { type: Type.STRING },
                  fat: { type: Type.STRING }
                },
                required: ['calories', 'protein', 'carbs', 'fat']
              },
              tasteProfile: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              theme: { type: Type.STRING }
            },
            required: ['title', 'description', 'story', 'chefTip', 'matchPercentage', 'totalTimeMinutes', 'difficulty', 'estimatedCost', 'ingredients', 'steps', 'tasteProfile']
          }
        }
      },
      validator: (data) => Array.isArray(data) && data.length > 0
    });

    const recipesWithId = parsed.map((r: any, idx: number) => ({
      ...r,
      id: r.id || `ai-recipe-${Date.now()}-${idx}`,
      isAiGenerated: true
    }));

    return res.json({
      isAiGenerated: true,
      usedModel,
      recipes: recipesWithId
    });
  } catch (err: unknown) {
    console.error('Error generating recipes with Gemini:', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Gagal menghasilkan resep dengan Gemini AI'
    });
  }
});

app.use('/api/gemini', router);
app.use('/gemini', router);

export default app;
