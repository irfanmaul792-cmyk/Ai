import { IngredientCategory, IngredientShelf } from '../types';

/**
 * Universal food keyword to icon mapping.
 * Matches general Indonesian and English food ingredients so that:
 * - Telur -> 🥚 (any egg: telur ayam, bebek, puyuh, asin, dll)
 * - Daging -> 🥩 (daging sapi, kambing, steak, cincang, dll)
 * - Ayam -> 🍗 (daging ayam, dada ayam, fillet, bebek, unggas)
 * - Ikan -> 🐟 (lele, gurame, salmon, tongkol, tuna, nila, dll)
 * - Udang -> 🦐 (udang rebon, vaname, tiger, dll)
 * - Cumi -> 🦑 (cumi-cumi, sotong, gurita)
 * - Kepiting -> 🦀
 * - Kerang -> 🦪
 * - Tahu -> 🧈
 * - Tempe -> 🧆
 * - Sosis -> 🌭
 * - Bakso -> 🍢
 * - Sayur daun -> 🥬 (kangkung, bayam, sawi, pakcoy, selada, dll)
 * - Brokoli -> 🥦
 * - Wortel -> 🥕
 * - Tomat -> 🍅
 * - Kentang -> 🥔
 * - Cabai -> 🌶️ (cabe, rawit, sambal, paprika)
 * - Bawang putih -> 🧄
 * - Bawang merah / bombay -> 🧅
 * - Jagung -> 🌽
 * - Terong -> 🍆
 * - Timun -> 🥒
 * - Jamur -> 🍄
 * - Buncis / Kacang -> 🫛
 * - Saus -> 🥫
 * - Kecap / Minyak -> 🍾
 * - Keju -> 🧀
 * - Susu -> 🥛
 * - Mentega -> 🧈
 * - Nasi / Beras -> 🍚
 * - Mie / Pasta -> 🍜 / 🍝
 * - Roti -> 🍞
 * - Buah -> 🍎, 🍌, 🍊, dll
 */

interface KeywordRule {
  keywords: string[];
  icon: string;
  category: IngredientCategory;
  suggestedShelf: IngredientShelf;
}

const INGREDIENT_RULES: KeywordRule[] = [
  // 1. TELUR (Priority match for egg so "telur" inside any shelf always shows 🥚)
  {
    keywords: ['telur', 'telor', 'egg', 'puyuh', 'ceplok', 'dadar', 'omelet', 'asin'],
    icon: '🥚',
    category: 'protein',
    suggestedShelf: 'meat',
  },

  // 2. UNGGAS / AYAM / BEBEK
  {
    keywords: ['ayam', 'chicken', 'bebek', 'unggas', 'dada', 'paha', 'sayap', 'fillet ayam', 'drumstick', 'nugget'],
    icon: '🍗',
    category: 'protein',
    suggestedShelf: 'meat',
  },

  // 3. SEAFOOD KHUSUS
  {
    keywords: ['udang', 'shrimp', 'prawn', 'lobster'],
    icon: '🦐',
    category: 'protein',
    suggestedShelf: 'meat',
  },
  {
    keywords: ['cumi', 'sotong', 'gurita', 'squid', 'octopus'],
    icon: '🦑',
    category: 'protein',
    suggestedShelf: 'meat',
  },
  {
    keywords: ['kepiting', 'crab', 'rajungan'],
    icon: '🦀',
    category: 'protein',
    suggestedShelf: 'meat',
  },
  {
    keywords: ['kerang', 'clam', 'oyster', 'scallop'],
    icon: '🦪',
    category: 'protein',
    suggestedShelf: 'meat',
  },

  // 4. IKAN (Semua jenis ikan air tawar & laut)
  {
    keywords: [
      'ikan', 'fish', 'lele', 'gurame', 'tongkol', 'tuna', 'salmon', 'nila',
      'kakap', 'bandeng', 'patin', 'teri', 'dori', 'sarden', 'tenggiri',
      'bawal', 'belut', 'mujair', 'mas', 'gabus'
    ],
    icon: '🐟',
    category: 'protein',
    suggestedShelf: 'meat',
  },

  // 5. DAGING SAPI / KAMBING / STEAK (All red meats)
  {
    keywords: [
      'daging', 'sapi', 'beef', 'steak', 'iga', 'buntut', 'tetelan', 'rawon',
      'rendang', 'kambing', 'domba', 'lamb', 'kornet', 'cincang'
    ],
    icon: '🥩',
    category: 'protein',
    suggestedShelf: 'meat',
  },

  // 6. OLAHAN PROTEIN
  {
    keywords: ['sosis', 'sausage', 'frankfurter'],
    icon: '🌭',
    category: 'protein',
    suggestedShelf: 'meat',
  },
  {
    keywords: ['bakso', 'baso', 'pentol', 'meatball', 'cilok'],
    icon: '🍢',
    category: 'protein',
    suggestedShelf: 'meat',
  },
  {
    keywords: ['tempe', 'tempeh'],
    icon: '🧆',
    category: 'protein',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['tahu', 'tofu'],
    icon: '🧈',
    category: 'protein',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['edamame', 'kedelai'],
    icon: '🫛',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },

  // 7. SAYURAN DAUN HIJAU
  {
    keywords: [
      'kangkung', 'bayam', 'sawi', 'selada', 'caisim', 'pakcoy', 'pokcoy',
      'kale', 'singkong', 'daun bawang', 'seledri', 'daun', 'lalapan',
      'caisim', 'kailan', 'horenso'
    ],
    icon: '🥬',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['brokoli', 'broccoli'],
    icon: '🥦',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['kol', 'kubis', 'kembang kol', 'cauliflower', 'cabbage'],
    icon: '🥗',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },

  // 8. SAYURAN BUAH, UMBI & POLONG
  {
    keywords: ['wortel', 'carrot'],
    icon: '🥕',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['tomat', 'tomato'],
    icon: '🍅',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['kentang', 'potato'],
    icon: '🥔',
    category: 'karbo',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['cabai', 'cabe', 'chili', 'rawit', 'paprika', 'sambal', 'pedas'],
    icon: '🌶️',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['terong', 'terung', 'eggplant'],
    icon: '🍆',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['jagung', 'corn'],
    icon: '🌽',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['timun', 'mentimun', 'cucumber', 'pare', 'oyong', 'gambas'],
    icon: '🥒',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['labu', 'pumpkin', 'labu siam', 'zucchini'],
    icon: '🎃',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['jamur', 'mushroom', 'enoki', 'champignon', 'shitake', 'shimeji'],
    icon: '🍄',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['buncis', 'kacang panjang', 'kacang polong', 'kacang merah', 'kacang tanah', 'kacang'],
    icon: '🫛',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['ubi', 'singkong', 'ketela', 'talas'],
    icon: '🍠',
    category: 'karbo',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['alpukat', 'avocado'],
    icon: '🥑',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },

  // 9. BAWANG & REMPAH
  {
    keywords: ['bawang putih', 'garlic'],
    icon: '🧄',
    category: 'bumbu',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['bawang', 'bombay', 'bawang merah', 'shallot', 'onion'],
    icon: '🧅',
    category: 'bumbu',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['jahe', 'kunyit', 'lengkuas', 'laos', 'kencur', 'serai', 'sereh', 'rempah', 'ginger'],
    icon: '🫚',
    category: 'bumbu',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['garam', 'salt', 'merica', 'lada', 'ketumbar', 'pala', 'kemiri', 'bumbu halus'],
    icon: '🧂',
    category: 'bumbu',
    suggestedShelf: 'door',
  },
  {
    keywords: ['gula', 'sugar', 'gula pasir', 'gula jawa', 'gula merah', 'madu', 'honey'],
    icon: '🍯',
    category: 'bumbu',
    suggestedShelf: 'door',
  },

  // 10. SAUS, KECAP & MINYAK
  {
    keywords: ['saus', 'sauce', 'pasta tomat', 'prego', 'bolognese', 'tomat kaleng'],
    icon: '🥫',
    category: 'bumbu',
    suggestedShelf: 'chiller',
  },
  {
    keywords: ['kecap', 'tiram', 'teriyaki', 'kecap ikan', 'cuka'],
    icon: '🍾',
    category: 'bumbu',
    suggestedShelf: 'chiller',
  },
  {
    keywords: ['minyak', 'oil', 'goreng', 'zaitun', 'olive', 'wijen'],
    icon: '🫒',
    category: 'bumbu',
    suggestedShelf: 'door',
  },
  {
    keywords: ['santan', 'kelapa', 'coconut'],
    icon: '🥥',
    category: 'bumbu',
    suggestedShelf: 'chiller',
  },
  {
    keywords: ['mayones', 'mayo'],
    icon: '🍶',
    category: 'bumbu',
    suggestedShelf: 'chiller',
  },

  // 11. DAIRY & SUSU
  {
    keywords: ['keju', 'cheese', 'cheddar', 'mozzarella', 'parmesan'],
    icon: '🧀',
    category: 'dairy',
    suggestedShelf: 'chiller',
  },
  {
    keywords: ['susu', 'milk', 'uht', 'kental manis', 'creamer'],
    icon: '🥛',
    category: 'dairy',
    suggestedShelf: 'chiller',
  },
  {
    keywords: ['mentega', 'butter', 'margarin', 'margarine', 'blueband'],
    icon: '🧈',
    category: 'dairy',
    suggestedShelf: 'chiller',
  },
  {
    keywords: ['yogurt', 'yoghurt'],
    icon: '🥣',
    category: 'dairy',
    suggestedShelf: 'chiller',
  },

  // 12. KARBOHIDRAT
  {
    keywords: ['nasi', 'beras', 'rice'],
    icon: '🍚',
    category: 'karbo',
    suggestedShelf: 'door',
  },
  {
    keywords: ['mie', 'mi', 'noodle', 'ramen', 'bihun', 'soun', 'kwetiau', 'indomie'],
    icon: '🍜',
    category: 'karbo',
    suggestedShelf: 'door',
  },
  {
    keywords: ['pasta', 'spaghetti', 'makaroni', 'macaroni', 'fettuccine', 'penne', 'fusilli'],
    icon: '🍝',
    category: 'karbo',
    suggestedShelf: 'door',
  },
  {
    keywords: ['roti', 'bread', 'toast', 'tawar'],
    icon: '🍞',
    category: 'karbo',
    suggestedShelf: 'door',
  },
  {
    keywords: ['tepung', 'terigu', 'maizena', 'tapioka', 'sagu'],
    icon: '🌾',
    category: 'karbo',
    suggestedShelf: 'door',
  },
  {
    keywords: ['oat', 'oatmeal', 'sereal'],
    icon: '🥣',
    category: 'karbo',
    suggestedShelf: 'door',
  },

  // 13. BUAH-BUAHAN
  {
    keywords: ['pisang', 'banana'],
    icon: '🍌',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['apel', 'apple'],
    icon: '🍎',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['jeruk', 'orange', 'lemon', 'lime', 'nipis'],
    icon: '🍋',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['mangga', 'mango'],
    icon: '🥭',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['semangka', 'watermelon'],
    icon: '🍉',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['stroberi', 'strawberry', 'berry'],
    icon: '🍓',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['nanas', 'pineapple'],
    icon: '🍍',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['melon'],
    icon: '🍈',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },
  {
    keywords: ['anggur', 'grape'],
    icon: '🍇',
    category: 'sayur',
    suggestedShelf: 'crisper',
  },

  // 14. MINUMAN & BEKU
  {
    keywords: ['es batu', 'es', 'ice', 'kaldu frozen', 'frozen'],
    icon: '🧊',
    category: 'lainnya',
    suggestedShelf: 'freezer',
  },
  {
    keywords: ['kopi', 'coffee'],
    icon: '☕',
    category: 'bumbu',
    suggestedShelf: 'door',
  },
  {
    keywords: ['teh', 'tea'],
    icon: '🍵',
    category: 'bumbu',
    suggestedShelf: 'door',
  },
];

/**
 * Resolves the accurate visual icon (gambar bahan) for any ingredient by name.
 * It guarantees that typing "telur" in meat shelf (or anywhere) shows 🥚,
 * "daging" shows 🥩, "ayam" shows 🍗, "ikan" shows 🐟, etc.
 */
export function resolveIngredientIcon(name: string, currentIcon?: string): string {
  if (!name || typeof name !== 'string') return currentIcon || '🥘';
  const clean = name.toLowerCase().trim();

  // Look through rules in prioritized order
  for (const rule of INGREDIENT_RULES) {
    for (const kw of rule.keywords) {
      // Word boundary or substring match
      if (clean.includes(kw)) {
        return rule.icon;
      }
    }
  }

  // If no match found and currentIcon is provided and not a generic default
  if (currentIcon && currentIcon !== '🥩' && currentIcon !== '🥦' && currentIcon !== '🥫' && currentIcon !== '🍝' && currentIcon !== '❄️') {
    return currentIcon;
  }

  return '🥘';
}

/**
 * Resolves the logical category for any ingredient by name.
 */
export function resolveIngredientCategory(name: string, fallbackCategory?: IngredientCategory): IngredientCategory {
  if (!name || typeof name !== 'string') return fallbackCategory || 'protein';
  const clean = name.toLowerCase().trim();

  for (const rule of INGREDIENT_RULES) {
    for (const kw of rule.keywords) {
      if (clean.includes(kw)) {
        return rule.category;
      }
    }
  }

  return fallbackCategory || 'protein';
}

/**
 * Resolves the most appropriate shelf for an ingredient if not already set.
 */
export function resolveIngredientShelf(name: string, fallbackShelf?: IngredientShelf): IngredientShelf {
  if (!name || typeof name !== 'string') return fallbackShelf || 'meat';
  const clean = name.toLowerCase().trim();

  for (const rule of INGREDIENT_RULES) {
    for (const kw of rule.keywords) {
      if (clean.includes(kw)) {
        return rule.suggestedShelf;
      }
    }
  }

  return fallbackShelf || 'meat';
}

/**
 * Get category color styling for badge container
 */
export function getIngredientColorClasses(category?: IngredientCategory) {
  switch (category) {
    case 'protein':
      return {
        bg: 'bg-rose-950/40 border-rose-800/40 text-rose-200',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        avatarBg: 'bg-rose-900/40 border-rose-700/50',
      };
    case 'sayur':
      return {
        bg: 'bg-emerald-950/40 border-emerald-800/40 text-emerald-200',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        avatarBg: 'bg-emerald-900/40 border-emerald-700/50',
      };
    case 'karbo':
      return {
        bg: 'bg-amber-950/40 border-amber-800/40 text-amber-200',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        avatarBg: 'bg-amber-900/40 border-amber-700/50',
      };
    case 'dairy':
      return {
        bg: 'bg-sky-950/40 border-sky-800/40 text-sky-200',
        badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
        avatarBg: 'bg-sky-900/40 border-sky-700/50',
      };
    case 'bumbu':
    default:
      return {
        bg: 'bg-stone-900/80 border-stone-800 text-stone-200',
        badge: 'bg-stone-800 text-stone-300 border-stone-700',
        avatarBg: 'bg-stone-800 border-stone-700',
      };
  }
}
