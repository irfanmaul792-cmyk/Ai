import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Central Multi-Device Database File Storage
const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'kulkas_central_db.json');

interface CentralDbSchema {
  users: Array<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    createdAt: number;
    lastLoginAt: number;
  }>;
  passwords: Record<string, string>; // userId -> passwordHash (SHA-256)
  userData: Record<string, any>;     // userId -> UserAccountData
}

function initCentralDb(): CentralDbSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        passwords: parsed.passwords || {},
        userData: parsed.userData || {}
      };
    }
  } catch (err) {
    console.error('Failed reading central db, initializing fresh:', err);
  }
  const initial: CentralDbSchema = { users: [], passwords: {}, userData: {} };
  saveCentralDb(initial);
  return initial;
}

function saveCentralDb(data: CentralDbSchema): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed writing central db:', err);
  }
}

function hashPasswordServer(plain: string): string {
  return crypto.createHash('sha256').update(plain).digest('hex');
}

// Support high-resolution camera / photo uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// =========================================================================
// CENTRAL AUTH & DATABASE SYNC API (Multi-Device Sync Across HP / Laptops)
// =========================================================================

app.get('/api/auth/users', (_req, res) => {
  const db = initCentralDb();
  res.json({ users: db.users });
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Nama dan email harus diisi.' });
    }

    if (!password || password.trim().length < 8) {
      return res.status(400).json({ 
        error: 'Kata sandi minimal 8 karakter (bisa berupa huruf, angka, atau simbol) agar akun Anda aman dan bisa login di perangkat lain.' 
      });
    }

    const db = initCentralDb();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim().toLowerCase();

    const existing = db.users.find(u => 
      u.email.toLowerCase() === normalizedEmail || 
      u.name.toLowerCase() === normalizedName
    );
    if (existing) {
      return res.status(400).json({ 
        error: `Email atau ID "${email.trim()}" sudah digunakan oleh akun lain. Silakan gunakan email atau ID yang lain.` 
      });
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const passHash = hashPasswordServer(password.trim());

    const newUser = {
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      avatar: avatar || '👨‍🍳',
      createdAt: Date.now(),
      lastLoginAt: Date.now()
    };

    db.users.push(newUser);
    db.passwords[userId] = passHash;
    const initialAccountData = {
      userId,
      ingredients: [],
      selectedFridgeIds: {},
      shoppingItems: [],
      favoriteRecipes: [],
      filters: {
        budget: 'Bebas',
        cookingTime: 'Maks. 30 menit',
        servings: '2',
        preferences: 'suka pedas'
      },
      photos: [],
      updatedAt: Date.now()
    };
    db.userData[userId] = initialAccountData;
    saveCentralDb(db);

    return res.json({ success: true, user: newUser, accountData: initialAccountData });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal membuat akun di server.' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { emailOrName, password } = req.body;
    if (!emailOrName) {
      return res.status(400).json({ error: 'Email atau username akun harus diisi.' });
    }

    if (!password || !password.trim()) {
      return res.status(400).json({ error: 'Kata sandi harus diisi untuk masuk ke akun Anda.' });
    }

    const db = initCentralDb();
    const query = emailOrName.trim().toLowerCase();
    const user = db.users.find(u => 
      u.email.toLowerCase() === query || 
      u.name.toLowerCase() === query
    );

    if (!user) {
      return res.status(404).json({ error: 'Akun tidak ditemukan. Silakan periksa kembali atau buat akun baru.' });
    }

    const storedHash = db.passwords[user.id];
    if (storedHash) {
      const inputHash = hashPasswordServer(password.trim());
      if (storedHash !== inputHash) {
        return res.status(401).json({ error: 'Kata sandi / PIN tidak cocok. Silakan coba lagi.' });
      }
    } else {
      // Rekam kata sandi baru untuk akun lama
      db.passwords[user.id] = hashPasswordServer(password.trim());
      saveCentralDb(db);
    }

    // Update last login
    user.lastLoginAt = Date.now();
    saveCentralDb(db);

    const accountData = db.userData[user.id] || {
      userId: user.id,
      ingredients: [],
      selectedFridgeIds: {},
      shoppingItems: [],
      favoriteRecipes: [],
      filters: { budget: 'Bebas', cookingTime: 'Maks. 30 menit', servings: '2', preferences: 'suka pedas' },
      photos: [],
      updatedAt: Date.now()
    };

    return res.json({ success: true, user, accountData });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal masuk akun di server.' });
  }
});

app.post('/api/auth/change-password', (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    if (!userId || !newPassword) {
      return res.status(400).json({ error: 'User ID dan kata sandi baru harus disertakan.' });
    }
    if (newPassword.trim().length < 8) {
      return res.status(400).json({ error: 'Kata sandi baru minimal 8 karakter (bisa berupa kombinasi huruf, angka, atau simbol).' });
    }
    const db = initCentralDb();
    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'Akun tidak ditemukan di database server.' });
    }

    const storedHash = db.passwords[userId];
    if (storedHash && oldPassword) {
      const oldHash = hashPasswordServer(oldPassword);
      if (storedHash !== oldHash) {
        return res.status(401).json({ error: 'Kata sandi lama tidak cocok. Silakan masukkan kata sandi lama yang benar.' });
      }
    }

    // Update to new password
    db.passwords[userId] = hashPasswordServer(newPassword);
    saveCentralDb(db);

    return res.json({ success: true, message: 'Kata sandi berhasil diperbarui.' });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal merubah kata sandi di server.' });
  }
});

// Sync accounts bidirectionally across web/devices
app.post('/api/auth/sync-all', (req, res) => {
  try {
    const { users, passwords, userData } = req.body;
    const db = initCentralDb();
    let hasChanges = false;

    if (Array.isArray(users)) {
      users.forEach((clientUser: any) => {
        if (!clientUser?.id) return;
        const exists = db.users.find(u => 
          u.id === clientUser.id || 
          u.email.toLowerCase() === (clientUser.email || '').toLowerCase()
        );
        if (!exists) {
          db.users.push(clientUser);
          hasChanges = true;
        }
      });
    }

    if (passwords && typeof passwords === 'object') {
      Object.entries(passwords).forEach(([uid, passHash]) => {
        if (!db.passwords[uid] && typeof passHash === 'string') {
          db.passwords[uid] = passHash;
          hasChanges = true;
        }
      });
    }

    if (userData && typeof userData === 'object') {
      Object.entries(userData).forEach(([uid, uData]) => {
        if (!db.userData[uid] && uData) {
          db.userData[uid] = uData;
          hasChanges = true;
        }
      });
    }

    if (hasChanges) {
      saveCentralDb(db);
    }

    return res.json({ success: true, users: db.users });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal sinkronisasi data akun ke server.' });
  }
});

// In-memory pair codes for rapid cross-device linking (Laptop -> HP)
const activePairCodes: Map<string, { code: string; userId: string; createdAt: number }> = new Map();

app.post('/api/auth/generate-pair-code', (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID diperlukan.' });
    }
    const db = initCentralDb();
    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'Akun tidak ditemukan.' });
    }

    // Clean expired codes (> 60 mins)
    const now = Date.now();
    for (const [c, val] of activePairCodes.entries()) {
      if (now - val.createdAt > 60 * 60 * 1000) {
        activePairCodes.delete(c);
      }
    }

    // Generate readable 6-character code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    activePairCodes.set(code, {
      code,
      userId,
      createdAt: now
    });

    return res.json({ success: true, code, expiresInMinutes: 60 });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal membuat kode tautan perangkat.' });
  }
});

app.post('/api/auth/claim-pair-code', (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Kode tautan harus diisi.' });
    }
    const cleanCode = code.toString().trim();
    const pair = activePairCodes.get(cleanCode);
    if (!pair) {
      return res.status(404).json({ error: 'Kode tautan tidak valid atau telah kedaluwarsa. Silakan buat kode baru di laptop Anda.' });
    }

    const db = initCentralDb();
    const user = db.users.find(u => u.id === pair.userId);
    if (!user) {
      return res.status(404).json({ error: 'Akun untuk kode ini tidak ditemukan.' });
    }

    const accountData = db.userData[user.id] || {
      userId: user.id,
      ingredients: [],
      selectedFridgeIds: {},
      shoppingItems: [],
      favoriteRecipes: [],
      filters: { budget: 'Bebas', cookingTime: 'Maks. 30 menit', servings: '2', preferences: 'suka pedas' },
      photos: [],
      updatedAt: Date.now()
    };

    const passHash = db.passwords[user.id] || '';

    return res.json({ success: true, user, accountData, passHash });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menautkan akun perangkat.' });
  }
});

app.get('/api/user-data/:userId', (req, res) => {
  const { userId } = req.params;
  const db = initCentralDb();
  const data = db.userData[userId] || null;
  res.json({ data });
});

app.post('/api/user-data/:userId', (req, res) => {
  const { userId } = req.params;
  const { data } = req.body;
  if (!data) return res.status(400).json({ error: 'Data tidak boleh kosong' });

  const db = initCentralDb();
  db.userData[userId] = {
    ...data,
    userId,
    updatedAt: Date.now()
  };
  saveCentralDb(db);
  res.json({ success: true });
});

app.post('/api/auth/delete-user', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'User ID diperlukan' });
  }

  const db = initCentralDb();
  db.users = db.users.filter(u => u.id !== userId);
  delete db.passwords[userId];
  delete db.userData[userId];
  saveCentralDb(db);

  res.json({ success: true });
});

/**
 * Returns an instance of GoogleGenAI using the server-side environment key.
 * Strictly uses httpOptions User-Agent 'aistudio-build' as required.
 */
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

/**
 * Health check & Gemini connection status
 */
const GEMINI_FALLBACK_MODELS = [
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
] as const;

/**
 * Executes a Gemini generateContent call with an automatic 3-tier fallback chain.
 * If the primary model encounters a rate limit (429), temporary error, or quota issue,
 * it immediately and transparently fails over to the next standby model.
 */
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
      console.log(`[Gemini Fallback Chain] Mengirim permintaan ke model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);

      if (params.validator && !params.validator(parsed)) {
        throw new Error(`Data format dari model ${model} tidak sesuai skema yang diharapkan.`);
      }

      console.log(`[Gemini Fallback Chain] Sukses dieksekusi oleh model: ${model}`);
      return { data: parsed as T, usedModel: model };
    } catch (err: unknown) {
      console.warn(
        `[Gemini Fallback Chain] Model ${model} mengalami kendala/error, beralih ke cadangan berikutnya:`,
        err instanceof Error ? err.message : err
      );
      lastError = err;
    }
  }

  throw lastError || new Error('Semua model Gemini dalam rantai cadangan (fallback) gagal merespons.');
}

app.get('/api/gemini/status', (_req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.json({
    connected: hasKey,
    primaryModel: 'gemini-3.8-flash',
    fallbackModels: ['gemini-2.5-flash', 'gemini-3.1-flash-lite'],
    features: [
      'Multimodal AI Vision (Image Recognition)',
      'Real-Time Unlimited Indonesian Recipe Synthesis',
      'Zero Food Waste Intelligence',
      '3-Tier Automatic Model Fallback Redundancy'
    ]
  });
});

/**
 * 1. REAL AI VISION (Multimodal Image Recognition)
 * Analyzes messy photos of fridge, shelves, or kitchen countertops
 * and detects actual ingredients (e.g. eggs, kangkung, chili sauce, beef, garlic, etc.)
 */
app.post('/api/gemini/analyze-photos', async (req, res) => {
  try {
    const { photos } = req.body;
    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return res.status(400).json({ error: 'Tidak ada foto yang dikirim untuk dianalisis.' });
    }

    const ai = getGeminiClient();

    // Check if user uploaded a receipt/nota based on labels or type hints
    const hasReceiptHint = photos.some(
      (p: { label?: string; type?: string }) =>
        (p.label && /struk|nota|receipt|kasir|belanja|supermarket/i.test(p.label)) ||
        p.type === 'receipt'
    );

    // Prepare multimodal parts for Gemini 3.8 Flash
    const parts: Array<{ inlineData?: { mimeType: string; data: string }; text?: string }> = [];

    photos.slice(0, 3).forEach((photo: { url: string }) => {
      if (photo.url && photo.url.startsWith('data:')) {
        const matches = photo.url.match(/^data:([a-zA-Z0-9/.-]+);base64,(.+)$/);
        if (matches) {
          parts.push({
            inlineData: {
              mimeType: matches[1],
              data: matches[2],
            },
          });
        }
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

    parts.push({
      text: `Kamu adalah Chef AI Vision Multimodal Indonesia yang sangat teliti, ramah, dan berpengalaman.
Periksa dengan cermat foto yang diunggah. Foto dapat berupa:
A. FOTO KULKAS, RAK MAKANAN, MEJA DAPUR, ATAU KERANJANG BELANJA (Visual bahan makanan nyata).
B. STRUK BELANJAAN / NOTA PEMBELIAN SUPERMARKET, MINIMARKET, ATAU PASAR (Teks cetak kasir dari Indomaret, Alfamart, Super Indo, Hypermart, Pasar Tradisional, dsb).

TUGAS UTAMA:
1. Kenali tipe foto: Apakah ini struk belanjaan (isReceipt = true) atau foto bahan makanan di kulkas/dapur (isReceipt = false).
2. Jika STRUK BELANJAAN:
   - Pindai dan ekstrak semua item bahan masakan / makanan / bumbu / sayur / protein (Abaikan item non-makanan seperti sabun cuci, detergen, kantong plastik, baterai, tisu, dsb).
   - Bersihkan singkatan kasir menjadi nama bahan Indonesia yang ramah (contoh: "AYAM FLT 500G" -> "Dada Ayam Fillet", "KCP BNGO 220ML" -> "Kecap Manis Bango", "TLR AYM NGR" -> "Telur Ayam Negeri", "BUNCIS BBY" -> "Buncis Baby").
   - Cantumkan takaran/kuantitas (contoh: "500 gram", "1 botol", "1 kg", "1 pack").
   - Deteksi nama toko/supermarket jika terbaca (misal "Super Indo", "Indomaret", "Alfamart").
   - Deteksi total belanja jika terbaca.
3. Jika FOTO KULKAS / DAPUR:
   - Pindai dan kenali SEMUA bahan makanan nyata yang terlihat:
     * Sayur & Buah (kangkung, wortel, tomat, cabai rawit, buncis, bayam, bawang putih, bawang merah, jeruk nipis, dsb)
     * Protein (telur ayam, daging sapi, dada ayam, tahu putih, tempe, udang, ikan, bakso, dsb)
     * Karbohidrat (pasta spaghetti, mie telur, beras/nasi, kentang, roti tawar, dsb)
     * Bumbu, Saus & Minyak (saus sambal, saus pasta, saus tiram, kecap manis, garam, merica, margarin, santan, dsb)
     * Dairy / Olahan Susu (susu UHT, keju cheddar, mentega, yogurt, dsb)
   - Estimasi kuantitas yang realistis ("3 butir", "setengah ikat", "1 botol", "300 gram", "4 buah").
4. Untuk setiap bahan yang terdeteksi:
   - "urgency": "urgent" untuk sayuran hijau dan daging/ikan segar; "medium" untuk bahan tahan 3-5 hari (telur, wortel, tahu); "safe" untuk saus botol/bahan kering awet.
   - "shelf": rak penyimpanan ideal ('meat' | 'crisper' | 'chiller' | 'freezer' | 'door').
   - "category": 'protein' | 'sayur' | 'karbo' | 'bumbu' | 'dairy' | 'lainnya'.
   - "icon": emoji representatif (🍗, 🥩, 🥚, 🥬, 🍅, 🥕, 🧅, 🧄, 🥫, 🥛, 🍞).
5. Buat narasi ringkasan hangat chef (summary), misalnya:
   - Jika struk: "Berhasil membaca struk belanjaan Super Indo! Terdeteksi 5 bahan masakan segar (Dada Ayam Fillet, Buncis Baby, Telur Ayam, dsb) siap dimasukkan ke kulkas."
   - Jika kulkas: "Terdeteksi 3 butir telur ayam, setengah ikat kangkung segar, 1 botol saus sambal, dan bawang merah di foto kulkas Anda!"`
    });

    const { data: parsed, usedModel } = await generateAndParseWithFallback<{
      isReceipt?: boolean;
      storeName?: string;
      totalSpent?: string;
      receiptDate?: string;
      summary?: string;
      detectedIngredients?: any[];
    }>(ai, {
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isReceipt: {
              type: Type.BOOLEAN,
              description: 'True jika gambar adalah struk belanja/nota kasir supermarket/minimarket'
            },
            storeName: {
              type: Type.STRING,
              description: 'Nama toko/supermarket jika terbaca pada struk (misal: Super Indo, Alfamart)'
            },
            totalSpent: {
              type: Type.STRING,
              description: 'Total pengeluaran jika terbaca pada struk'
            },
            receiptDate: {
              type: Type.STRING,
              description: 'Tanggal transaksi pada struk jika terbaca; bukan tanggal kedaluwarsa'
            },
            summary: {
              type: Type.STRING,
              description: 'Ringkasan narasi ramah chef atas bahan yang terdeteksi secara visual atau dari struk'
            },
            detectedIngredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  quantity: { type: Type.STRING },
                  category: { type: Type.STRING },
                  urgency: { type: Type.STRING },
                  shelf: { type: Type.STRING },
                  icon: { type: Type.STRING },
                  price: { type: Type.STRING }
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
      isAiVision: true,
      usedModel,
      isReceipt: !!parsed.isReceipt,
      storeName: parsed.storeName || '',
      totalSpent: parsed.totalSpent || '',
      receiptDate: parsed.receiptDate || '',
      summary: parsed.summary || 'Berhasil mendeteksi bahan makanan dari foto.',
      detectedIngredients: parsed.detectedIngredients || []
    });
  } catch (err: unknown) {
    console.error('Gemini Vision analysis failed:', err);
    return res.status(502).json({
      error: err instanceof Error ? `Analisis Gemini gagal: ${err.message}` : 'Analisis foto gagal. Silakan coba lagi.',
      code: 'GEMINI_VISION_FAILED'
    });
  }
});

/**
 * 2. REAL-TIME UNLIMITED RECIPE SYNTHESIS
 */
app.post('/api/gemini/generate-recipes', async (req, res) => {
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
        message: 'GEMINI_API_KEY belum terpasang di Secrets.'
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
${avoidTitles && avoidTitles.length > 0 ? `- HINDARI membuat resep dengan judul berikut (ciptakan kreasi baru yang berbeda): ${avoidTitles.join(', ')}` : ''}

TUGAS:
Hasilkan 6 resep masakan Nusantara atau modern fusion yang SANGAT KREATIF, SPESIFIK, dan LEZAT yang menggunakan bahan-bahan di atas.
RESEP HARUS REALISTIS, PRAKTIS, DAN TIDAK MEMBOSANKAN!
Jika bahan utamanya kangkung dan telur, jadikan menu seperti "Tumis Kangkung Belacan Telur Ceplok" atau "Orak-Arik Kangkung Telur Bumbu Iris".
Jika bahan utamanya daging sapi dan sayur, ciptakan "Oseng Daging Sapi Bumbu Bawang Rawit" atau "Semur Kilat Daging Wortel Gurih".
Setiap resep wajib menyertakan:
1. "story": Cerita kuliner / filosofi unik khas koki di balik resep ini (2-3 kalimat menarik).
2. "chefTip": Tips rahasia koki untuk menjaga kelezatan, nutrisi, atau teknik memasak terbaik.
3. Langkah-langkah memasak ("steps") berurutan, SANGAT JELAS, RUNTUT, DAN DETAIL (antara 5 sampai 8 langkah, TIDAK BOLEH SAMPAI 10 LANGKAH!). Jelaskan teknik api, urutan penumisan/perebusan, bumbu, dan indikator kematangan secara spesifik.
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
              story: { type: Type.STRING, description: 'Cerita kuliner dan filosofi menu di balik resep ini' },
              chefTip: { type: Type.STRING, description: 'Tips rahasia koki untuk memasak menu ini' },
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

// Serve frontend with Vite in development or static in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server Isi Kulkas Jadi Menu Hari Ini running at http://0.0.0.0:${port}`);
});
