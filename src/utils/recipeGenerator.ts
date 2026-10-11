import { Ingredient, Recipe, FilterOptions } from '../types';

interface GenerateRecipesParams {
  ingredients: Ingredient[];
  photoItems?: string[];
  filters: FilterOptions;
}

// Helper to normalize ingredient strings
function normalize(str: string): string {
  return str.toLowerCase().trim();
}

// Culinary knowledge base for dynamic generation
const PROTEIN_PATTERNS = [
  { match: ['ayam', 'chicken'], name: 'Daging Ayam', icon: '🍗' },
  { match: ['sapi', 'beef', 'daging sapi', 'cincang'], name: 'Daging Sapi', icon: '🥩' },
  { match: ['telur', 'egg'], name: 'Telur Ayam', icon: '🥚' },
  { match: ['tahu', 'tofu'], name: 'Tahu Putih / Kuning', icon: '🧈' },
  { match: ['tempe', 'tempeh'], name: 'Tempe Kedelai', icon: '🟫' },
  { match: ['udang', 'shrimp', 'prawn'], name: 'Udang Segar', icon: '🦐' },
  { match: ['ikan', 'fish', 'tongkol', 'gurame', 'nila', 'salmon'], name: 'Ikan Segar', icon: '🐟' },
  { match: ['sosis', 'sausage'], name: 'Sosis', icon: '🌭' },
  { match: ['bakso', 'meatball'], name: 'Bakso Sapi', icon: '⚪' },
  { match: ['cumi', 'squid'], name: 'Cumi-Cumi Segar', icon: '🦑' }
];

const VEGGIE_PATTERNS = [
  { match: ['bayam', 'spinach'], name: 'Bayam Hijau', icon: '🥬' },
  { match: ['kangkung', 'water spinach'], name: 'Kangkung Segar', icon: '🥬' },
  { match: ['wortel', 'carrot'], name: 'Wortel Manis', icon: '🥕' },
  { match: ['buncis', 'green bean'], name: 'Buncis Baby', icon: '🥬' },
  { match: ['brokoli', 'broccoli'], name: 'Brokoli Segar', icon: '🥦' },
  { match: ['kol', 'kubis', 'cabbage'], name: 'Kol / Kubis', icon: '🥬' },
  { match: ['tomat', 'tomato'], name: 'Tomat Merah Segar', icon: '🍅' },
  { match: ['jagung', 'corn'], name: 'Jagung Manis', icon: '🌽' },
  { match: ['jamur', 'mushroom'], name: 'Jamur Tiram / Kancing', icon: '🍄' },
  { match: ['tauge', 'toge', 'sprouts'], name: 'Tauge Segar', icon: '🌱' },
  { match: ['sawi', 'pakcoy', 'pokcoy'], name: 'Sawi / Pakcoy Hijau', icon: '🥬' },
  { match: ['terong', 'eggplant'], name: 'Terong Ungu', icon: '🍆' },
  { match: ['kentang', 'potato'], name: 'Kentang', icon: '🥔' }
];

const CARB_PATTERNS = [
  { match: ['pasta', 'spaghetti', 'fettuccine', 'makaroni'], name: 'Pasta Spaghetti', icon: '🍝' },
  { match: ['nasi', 'rice'], name: 'Nasi Putih', icon: '🍚' },
  { match: ['mie', 'noodle', 'bihun'], name: 'Mie / Bihun', icon: '🍜' },
  { match: ['roti', 'bread'], name: 'Roti Gandum', icon: '🍞' }
];

export function generateDynamicRecipes({
  ingredients,
  photoItems = [],
  filters
}: GenerateRecipesParams): Recipe[] {
  // Combine all active ingredient names
  const allNames: string[] = [
    ...ingredients.map(i => i.name),
    ...photoItems
  ];

  if (allNames.length === 0) {
    return [];
  }

  const isPedas = filters.preferences.toLowerCase().includes('pedas');
  const isTanpaSantan = filters.preferences.toLowerCase().includes('tanpa santan');
  const maxTime = filters.cookingTime.includes('15') ? 15 : filters.cookingTime.includes('30') ? 25 : 35;
  const servingsNum = parseInt(filters.servings) || 2;

  // Identify present culinary building blocks
  const matchedProteins: string[] = [];
  const matchedVeggies: string[] = [];
  const matchedCarbs: string[] = [];

  allNames.forEach(item => {
    const norm = normalize(item);
    PROTEIN_PATTERNS.forEach(p => {
      if (p.match.some(m => norm.includes(m)) && !matchedProteins.includes(p.name)) {
        matchedProteins.push(p.name);
      }
    });
    VEGGIE_PATTERNS.forEach(v => {
      if (v.match.some(m => norm.includes(m)) && !matchedVeggies.includes(v.name)) {
        matchedVeggies.push(v.name);
      }
    });
    CARB_PATTERNS.forEach(c => {
      if (c.match.some(m => norm.includes(m)) && !matchedCarbs.includes(c.name)) {
        matchedCarbs.push(c.name);
      }
    });
  });

  // Fallback primary items if not mapped
  const primaryItem1 = allNames[0] || 'Bahan Pilihan';
  const primaryItem2 = allNames[1] || '';
  const primaryItem3 = allNames[2] || '';

  const dynamicRecipes: Recipe[] = [];

  // =========================================================================
  // RECIPE 1: TUMIS / OSENG KILAT (Cepat, Praktis, Menghabiskan Sayur & Lauk)
  // =========================================================================
  const mainProteinName = matchedProteins[0] || primaryItem1;
  const mainVeggieName = matchedVeggies[0] || primaryItem2 || 'Sayuran Segar';

  dynamicRecipes.push({
    id: `dyn-stirfry-${Date.now()}-1`,
    title: `Oseng ${mainProteinName} ${mainVeggieName} ${isPedas ? 'Pedas Gurih' : 'Saus Tiram'}`,
    description: `Perpaduan gurih ${mainProteinName} ditumis cepat bersama ${mainVeggieName} renyah dengan bumbu bawang wangi${isPedas ? ' dan irisan cabai pedas' : ''}. Paling pas untuk menghabiskan stok bahan sebelum layu.`,
    matchPercentage: 96,
    prepTimeMinutes: 5,
    cookTimeMinutes: Math.min(maxTime - 5, 12),
    totalTimeMinutes: Math.min(maxTime, 17),
    difficulty: 'Praktis',
    estimatedCost: 'Rp 22.000 / porsi',
    calories: 320,
    servings: servingsNum,
    urgencyMessage: `Memaksimalkan olahan ${mainProteinName} & ${mainVeggieName} hari ini.`,
    ingredients: [
      { name: mainProteinName, amount: '250-300 gr', isOwned: true, urgentPriority: true },
      { name: mainVeggieName, amount: '150 gr (potong sesuai selera)', isOwned: true, urgentPriority: true },
      { name: 'Bawang putih & merah', amount: '4 siung (iris)', isOwned: true },
      { name: isPedas ? 'Cabai rawit merah' : 'Kecap manis & asin', amount: isPedas ? '5-7 buah' : '1 sdm masing-masing', isOwned: true },
      { name: 'Saus tiram & minyak goreng', amount: 'Secukupnya untuk menumis', isOwned: true },
      { name: 'Garam, gula & merica bubuk', amount: 'Secukupnya', isOwned: true }
    ],
    steps: [
      {
        step: 1,
        instruction: `Siapkan bahan: potong ${mainProteinName} dan ${mainVeggieName} menjadi ukuran gigitan agar cepat matang merata.`,
        durationMinutes: 4,
        tip: 'Potong bahan dengan ketebalan yang sama agar matangnya bersamaan.'
      },
      {
        step: 2,
        instruction: 'Panaskan 2 sdm minyak di wajan dengan api sedang. Tumis irisan bawang putih dan merah hingga harum kekuningan.',
        durationMinutes: 2
      },
      {
        step: 3,
        instruction: `Masukkan ${mainProteinName}. Tumis dan aduk cepat hingga berubah warna dan mengeluarkan aroma gurih sedap.`,
        durationMinutes: 4,
        tip: 'Gunakan api agak besar saat menumis daging/protein agar cairan tidak keluar berlebihan.'
      },
      {
        step: 4,
        instruction: `Masukkan ${mainVeggieName}, bumbui dengan saus tiram, sejumput garam, lada, dan sedikit air (3 sdm). Aduk sebentar hingga sayuran matang krispi.`,
        durationMinutes: 3,
        tip: 'Jangan masak sayur terlalu lama agar warnanya tetap cerah dan vitaminnya terjaga.'
      },
      {
        step: 5,
        instruction: 'Koreksi rasa, angkat selagi panas dan sajikan bersama nasi hangat.',
        durationMinutes: 1
      }
    ],
    nutrition: {
      calories: 320,
      protein: '24g',
      carbs: '12g',
      fat: '16g'
    },
    tasteProfile: [isPedas ? 'Pedas Gurih' : 'Gurih Manis', 'Praktis Cepat', 'Kaya Serat'],
    theme: 'stirfry'
  });

  // =========================================================================
  // RECIPE 2: SUP / KUAH SEGAR HANGAT (Ringan, Tanpa Santan, Menghangatkan)
  // =========================================================================
  const soupMain = matchedProteins[0] || primaryItem1;
  const soupVeggie = matchedVeggies[1] || matchedVeggies[0] || 'Sayur Segar';

  dynamicRecipes.push({
    id: `dyn-soup-${Date.now()}-2`,
    title: `Sup Bening Gurih ${soupMain} & ${soupVeggie}`,
    description: `Kuah kaldu bening yang menyegarkan dengan aroma rempah bawang geprek dan seledri, dipadukan ${soupMain} empuk serta kesegaran ${soupVeggie}.`,
    matchPercentage: 92,
    prepTimeMinutes: 7,
    cookTimeMinutes: Math.min(maxTime, 18),
    totalTimeMinutes: Math.min(maxTime + 5, 25),
    difficulty: 'Mudah',
    estimatedCost: 'Rp 18.000 / porsi',
    calories: 260,
    servings: servingsNum,
    urgencyMessage: 'Menu sehat berkuah segar untuk seluruh keluarga tanpa santan.',
    ingredients: [
      { name: soupMain, amount: '200 gr (potong kecil)', isOwned: true, urgentPriority: true },
      { name: soupVeggie, amount: '150 gr', isOwned: true },
      { name: 'Bawang putih geprek', amount: '3 siung', isOwned: true },
      { name: 'Air bersih kaldu', amount: '800 ml', isOwned: true },
      { name: 'Daun bawang & seledri', amount: '1 batang (iris halus)', isOwned: true },
      { name: 'Garam, merica & kaldu jamur', amount: 'Secukupnya', isOwned: true },
      { name: 'Bawang goreng', amount: 'Taburan opsional', isOwned: false }
    ],
    steps: [
      {
        step: 1,
        instruction: `Rebus air dalam panci hingga mendidih. Masukkan bawang putih geprek dan potongan ${soupMain}.`,
        durationMinutes: 8,
        tip: 'Buang buih yang mengapung di permukaan air agar kuah tetap bening jernih berkilau.'
      },
      {
        step: 2,
        instruction: `Masukkan ${soupVeggie}. Bumbui dengan garam, merica bubuk, dan sedikit kaldu penyedap.`,
        durationMinutes: 5,
        tip: 'Jika memakai wortel, masukkan lebih dulu sebelum sayuran hijau.'
      },
      {
        step: 3,
        instruction: 'Masak hingga semua bahan empuk pas. Sesaat sebelum diangkat, taburkan irisan daun bawang dan seledri.',
        durationMinutes: 2
      },
      {
        step: 4,
        instruction: 'Tuang ke dalam mangkuk saji hangat. Siap dinikmati selagi mengepul.',
        durationMinutes: 1
      }
    ],
    nutrition: {
      calories: 260,
      protein: '21g',
      carbs: '15g',
      fat: '9g'
    },
    tasteProfile: ['Segar Alami', 'Hangat Berkaldu', 'Tanpa Santan'],
    theme: 'soup'
  });

  // =========================================================================
  // RECIPE 3: OLAHAN SPESIAL / FUSION / GORENG (Pasta/Nasi/Gorengan Gurih)
  // =========================================================================
  const carbSource = matchedCarbs[0] || (allNames.some(n => normalize(n).includes('pasta') || normalize(n).includes('spaghetti')) ? 'Pasta' : 'Nasi');
  const fusionProtein = matchedProteins[1] || matchedProteins[0] || primaryItem1;

  if (carbSource.toLowerCase().includes('pasta') || allNames.some(n => normalize(n).includes('prego') || normalize(n).includes('pasta') || normalize(n).includes('spaghetti'))) {
    dynamicRecipes.push({
      id: `dyn-pasta-${Date.now()}-3`,
      title: `Pasta Spaghetti ${fusionProtein} Saus Gurih Meresap`,
      description: `Spaghetti dimasak al dente dengan baluran saus gurih kental dan cacahan ${fusionProtein}, kaya cita rasa rempah gurih tomat.`,
      matchPercentage: 95,
      prepTimeMinutes: 5,
      cookTimeMinutes: 15,
      totalTimeMinutes: 20,
      difficulty: 'Mudah',
      estimatedCost: 'Rp 26.000 / porsi',
      calories: 450,
      servings: servingsNum,
      urgencyMessage: `Memanfaatkan pasta kering & stok ${fusionProtein} di kulkas.`,
      ingredients: [
        { name: 'Pasta spaghetti', amount: '180 gr', isOwned: true },
        { name: fusionProtein, amount: '200 gr', isOwned: true, urgentPriority: true },
        { name: 'Saus pasta / tomat', amount: '150 ml', isOwned: true },
        { name: 'Bawang bombay / putih cincang', amount: '3 siung', isOwned: true },
        { name: 'Minyak / margarin', amount: '2 sdm', isOwned: true },
        { name: 'Garam, gula, lada & oregano', amount: 'Secukupnya', isOwned: true }
      ],
      steps: [
        {
          step: 1,
          instruction: 'Didihkan air dengan sedikit garam, rebus spaghetti selama 8-9 menit hingga al dente. Tiriskan dan sisihkan 3 sdm air rebusannya.',
          durationMinutes: 8
        },
        {
          step: 2,
          instruction: `Panaskan wajan dengan minyak/margarin. Tumis bawang cincang hingga harum, lalu masukkan ${fusionProtein} hingga matang kecokelatan.`,
          durationMinutes: 4
        },
        {
          step: 3,
          instruction: 'Tuang saus pasta dan 3 sdm air rebusan pasta. Bumbui dengan garam, gula, dan lada. Masak mendidih kecil selama 3 menit.',
          durationMinutes: 3
        },
        {
          step: 4,
          instruction: 'Campurkan spaghetti ke dalam saus, aduk merata dan sajikan hangat.',
          durationMinutes: 2
        }
      ],
      nutrition: {
        calories: 450,
        protein: '27g',
        carbs: '54g',
        fat: '14g'
      },
      tasteProfile: ['Gurih Tomat', 'Al Dente', 'Favorit Keluarga'],
      theme: 'bolognese'
    });
  } else {
    // Nasi Goreng / Orak Arik Cepat
    dynamicRecipes.push({
      id: `dyn-friedrice-${Date.now()}-3`,
      title: `Nasi / Mie Goreng Spesial ${fusionProtein} & Sayur`,
      description: `Solusi kilat menghabiskan stok ${fusionProtein} dan sisa nasi/sayuran dingin. Dimasak dengan aroma harum bawang dan kecap manis ${isPedas ? 'cabai ulek' : 'gurih'}.`,
      matchPercentage: 94,
      prepTimeMinutes: 5,
      cookTimeMinutes: 10,
      totalTimeMinutes: 15,
      difficulty: 'Praktis',
      estimatedCost: 'Rp 16.000 / porsi',
      calories: 390,
      servings: servingsNum,
      urgencyMessage: 'Menu penyelamat makanan sisa menjadi hidangan restoran.',
      ingredients: [
        { name: 'Nasi dingin / Mie', amount: '2 piring', isOwned: true },
        { name: fusionProtein, amount: '150 gr', isOwned: true, urgentPriority: true },
        { name: mainVeggieName, amount: '1 genggam (iris)', isOwned: true },
        { name: 'Bawang putih & merah', amount: '3 siung cincang', isOwned: true },
        { name: 'Kecap manis & saus tiram', amount: 'Masing-masing 1.5 sdm', isOwned: true },
        { name: 'Garam & merica', amount: 'Secukupnya', isOwned: true }
      ],
      steps: [
        {
          step: 1,
          instruction: 'Panaskan minyak di wajan datar. Tumis bawang cincang hingga harum kekuningan.',
          durationMinutes: 2
        },
        {
          step: 2,
          instruction: `Masukkan ${fusionProtein} dan irisan ${mainVeggieName}. Aduk cepat hingga matang sempurna.`,
          durationMinutes: 3
        },
        {
          step: 3,
          instruction: 'Masukkan nasi/mie dingin. Tuang kecap manis, saus tiram, garam, dan lada. Gunakan api besar dan aduk cepat hingga bumbu merata.',
          durationMinutes: 4,
          tip: 'Gunakan nasi dingin dari kulkas agar butirannya tidak lembek menggumpal.'
        },
        {
          step: 4,
          instruction: 'Angkat dan sajikan selagi panas bersama kerupuk atau taburan bawang goreng.',
          durationMinutes: 1
        }
      ],
      nutrition: {
        calories: 390,
        protein: '22g',
        carbs: '48g',
        fat: '13g'
      },
      tasteProfile: ['Wangi Aromatik', 'Gurih Manis', 'Super Kilat'],
      theme: 'stirfry'
    });
  }

  // =========================================================================
  // RECIPE 4: ORAK-ARIK / DADAR GURIH / KREASI BUMBU PEDAS
  // =========================================================================
  const fourthItem = primaryItem2 || primaryItem1;
  dynamicRecipes.push({
    id: `dyn-orakarik-${Date.now()}-4`,
    title: `Orak-Arik ${fourthItem} Saus Mentega Bawang`,
    description: `Kreasi masakan rumahan lezat berbahan dasar ${fourthItem} dimasak lembut dengan aroma mentega bawang yang menggugah selera makan.`,
    matchPercentage: 89,
    prepTimeMinutes: 4,
    cookTimeMinutes: 8,
    totalTimeMinutes: 12,
    difficulty: 'Praktis',
    estimatedCost: 'Rp 15.000 / porsi',
    calories: 280,
    servings: servingsNum,
    urgencyMessage: 'Siap saji dalam waktu kurang dari 15 menit.',
    ingredients: [
      { name: fourthItem, amount: 'Secukupnya stok', isOwned: true, urgentPriority: true },
      { name: 'Bawang bombay / putih', amount: '2 siung (cincang)', isOwned: true },
      { name: 'Margarin / mentega', amount: '1.5 sdm', isOwned: true },
      { name: 'Kecap asin & saus tiram', amount: '1 sdt', isOwned: true },
      { name: 'Lada bubuk & garam', amount: 'Secukupnya', isOwned: true }
    ],
    steps: [
      {
        step: 1,
        instruction: `Potong-potong ${fourthItem} sesuai selera agar bumbu mudah meresap.`,
        durationMinutes: 2
      },
      {
        step: 2,
        instruction: 'Lelehkan margarin di wajan, tumis bawang hingga wangi gurih semerbak.',
        durationMinutes: 2
      },
      {
        step: 3,
        instruction: `Masukkan ${fourthItem}, bumbui dengan sedikit kecap asin, saus tiram, dan lada. Masak cepat selama 4-5 menit.`,
        durationMinutes: 4
      },
      {
        step: 4,
        instruction: 'Angkat saat bumbu sudah meresap harum. Sajikan sebagai lauk pendamping lezat.',
        durationMinutes: 1
      }
    ],
    nutrition: {
      calories: 280,
      protein: '18g',
      carbs: '8g',
      fat: '17g'
    },
    tasteProfile: ['Gurih Mentega', 'Praktis Kilat', 'Empuk Lembut'],
    theme: 'saute'
  });

  // =========================================================================
  // RECIPE 5: NASI GORENG / OLAHAN KARBO SPESIAL BUMBU IRIS
  // =========================================================================
  const fifthItem = primaryItem1;
  const isRicePresent = matchedCarbs.some(c => c.toLowerCase().includes('nasi') || c.toLowerCase().includes('rice'));
  const carboName = isRicePresent ? 'Nasi Putih' : 'Nasi / Karbohidrat Pilihan';
  dynamicRecipes.push({
    id: `dyn-nasgor-${Date.now()}-5`,
    title: `Nasi Goreng ${fifthItem} Bumbu Rawit Bawang`,
    description: `Nasi goreng harum beraroma smoky dengan potongan ${fifthItem}, bumbu iris bawang melimpah, dan sensasi pedas gurih nagih.`,
    matchPercentage: 94,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    totalTimeMinutes: 15,
    difficulty: 'Praktis',
    estimatedCost: 'Rp 18.000 / porsi',
    calories: 480,
    servings: servingsNum,
    urgencyMessage: 'Menu cepat saji 15 menit menggunakan stok bahan dapur yang ada.',
    ingredients: [
      { name: fifthItem, amount: 'Secukupnya (potong kecil)', isOwned: true, urgentPriority: true },
      { name: carboName, amount: `${servingsNum} porsi`, isOwned: true },
      { name: 'Bawang merah & putih', amount: '4 siung (iris)', isOwned: true },
      { name: 'Cabai rawit merah', amount: isPedas ? '5 buah (iris)' : '2 buah', isOwned: true },
      { name: 'Kecap manis & saus tiram', amount: 'Masing-masing 1 sdm', isOwned: true },
      { name: 'Minyak / margarin', amount: '2 sdm', isOwned: true },
      { name: 'Garam & lada', amount: 'Secukupnya', isOwned: true }
    ],
    steps: [
      {
        step: 1,
        instruction: 'Panaskan wajan dengan minyak atau margarin. Tumis irisan bawang dan cabai rawit hingga wangi kekuningan.',
        durationMinutes: 2
      },
      {
        step: 2,
        instruction: `Masukkan ${fifthItem}, tumis cepat dengan api sedang hingga matang merata dan mengeluarkan aroma harum.`,
        durationMinutes: 3
      },
      {
        step: 3,
        instruction: 'Masukkan nasi atau karbohidrat. Bumbui dengan kecap manis, saus tiram, garam, dan lada bubuk.',
        durationMinutes: 2
      },
      {
        step: 4,
        instruction: 'Aduk cepat dengan api besar hingga bumbu merata dan nasi berbutir kering sedap. Sajikan selagi hangat.',
        durationMinutes: 3
      }
    ],
    nutrition: {
      calories: 480,
      protein: '22g',
      carbs: '60g',
      fat: '16g'
    },
    tasteProfile: ['Pedas Gurih Bawang', 'Smoky Wajan', 'Kenyang Mantap'],
    theme: 'stirfry'
  });

  // =========================================================================
  // RECIPE 6: BALADO / GURIH MANIS PEDAS NUSANTARA
  // =========================================================================
  const sixthItem = primaryItem3 || primaryItem2 || primaryItem1;
  dynamicRecipes.push({
    id: `dyn-balado-${Date.now()}-6`,
    title: `${sixthItem} Masak Balado Merah Gurih Segar`,
    description: `Kreasi masakan khas Nusantara memadukan ${sixthItem} berbalut bumbu balado tomat cabai merah yang gurih, manis, dan pedas seimbang.`,
    matchPercentage: 92,
    prepTimeMinutes: 7,
    cookTimeMinutes: 13,
    totalTimeMinutes: 20,
    difficulty: 'Mudah',
    estimatedCost: 'Rp 20.000 / porsi',
    calories: 340,
    servings: servingsNum,
    urgencyMessage: 'Cita rasa tradisional nusantara yang lezat dan cocok untuk lauk harian.',
    ingredients: [
      { name: sixthItem, amount: 'Secukupnya stok', isOwned: true, urgentPriority: true },
      { name: 'Tomat merah segar', amount: '1-2 buah (cincang kasar)', isOwned: true },
      { name: 'Cabai merah & rawit', amount: isPedas ? '6 buah (haluskan kasar)' : '3 buah', isOwned: true },
      { name: 'Bawang merah & putih', amount: '4 siung', isOwned: true },
      { name: 'Gula merah / pasir & garam', amount: 'Secukupnya', isOwned: true },
      { name: 'Minyak goreng', amount: '2 sdm', isOwned: true }
    ],
    steps: [
      {
        step: 1,
        instruction: `Goreng atau tumis sebentar ${sixthItem} hingga berkulit dan tiriskan.`,
        durationMinutes: 4
      },
      {
        step: 2,
        instruction: 'Tumis cabai, bawang, dan tomat yang dicincang kasar hingga matang berminyak dan tidak langu.',
        durationMinutes: 5
      },
      {
        step: 3,
        instruction: 'Bumbui sambal balado dengan garam dan gula merah hingga rasa gurih pedas manisnya pas seimbang.',
        durationMinutes: 2
      },
      {
        step: 4,
        instruction: `Masukkan ${sixthItem}, aduk rata dengan sambal balado di atas api kecil selama 2 menit. Angkat dan sajikan.`,
        durationMinutes: 2
      }
    ],
    nutrition: {
      calories: 340,
      protein: '24g',
      carbs: '18g',
      fat: '18g'
    },
    tasteProfile: ['Pedas Manis Gurih', 'Tomat Segar', 'Khas Nusantara'],
    theme: 'spicy'
  });

  return dynamicRecipes;
}
