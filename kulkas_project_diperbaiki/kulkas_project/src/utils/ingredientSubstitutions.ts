export interface Substitution {
  original: string;
  alternative: string;
  note: string;
  ratio?: string;
  category: 'protein' | 'sauce' | 'spice' | 'carb' | 'other';
}

export const COMMON_SUBSTITUTIONS: Record<string, Substitution> = {
  'saus tiram': {
    original: 'Saus Tiram',
    alternative: 'Kecap manis + sejumput garam + sedikit kecap asin',
    note: 'Memberikan rasa umami gurih manis yang mendekati saus tiram.',
    ratio: '1 sdm saus tiram = 1 sdm kecap manis + 1/4 sdt kecap asin',
    category: 'sauce'
  },
  'oyster sauce': {
    original: 'Saus Tiram',
    alternative: 'Kecap manis + kaldu jamur / garam',
    note: 'Alternatif gurih umami yang mudah ditemukan di rumah.',
    category: 'sauce'
  },
  'saus prego': {
    original: 'Saus Pasta Prego / Bolognese',
    alternative: 'Tomat segar cincang + 2 sdm saus tomat/sambal + bawang putih + gula',
    note: 'Tumis tomat hingga lumat lalu tambahkan sedikit garam dan lada.',
    category: 'sauce'
  },
  'saus tomat': {
    original: 'Saus Tomat',
    alternative: 'Tomat segar dihaluskan + 1 sdt gula + perasan jeruk nipis',
    note: 'Rasa segar asam-manis alami tanpa bahan pengawet.',
    category: 'sauce'
  },
  'minyak wijen': {
    original: 'Minyak Wijen',
    alternative: 'Minyak goreng biasa + sangrai biji wijen atau sedikit kecap asin',
    note: 'Memberikan aroma harum gurih khas masakan oriental.',
    category: 'spice'
  },
  'daging sapi': {
    original: 'Daging Sapi / Daging Cincang',
    alternative: 'Telur orak-arik, Tahu sutra, Tempe dadu, atau Jamur tiram',
    note: 'Tahu dan jamur tiram menyerap bumbu dengan sangat baik seperti daging.',
    ratio: '1:1 penggantian setara protein',
    category: 'protein'
  },
  'daging cincang': {
    original: 'Daging Cincang',
    alternative: 'Telur orak-arik gurih / Tempe cincang halus kukus / Kornet',
    note: 'Sangat cocok untuk olahan saus pasta, tumisan, atau nasi goreng.',
    category: 'protein'
  },
  'spaghetti': {
    original: 'Spaghetti / Pasta',
    alternative: 'Mie telur, Bihun, Kwetiau, atau Nasi putih hangat',
    note: 'Saus bolognese atau tumisan daging tetap lezat disiram di atas mie atau nasi!',
    category: 'carb'
  },
  'pasta': {
    original: 'Pasta',
    alternative: 'Mie instan tanpa bumbu, Makaroni, atau Kwetiau',
    note: 'Rebus mie hingga al dente sebelum dicampur saus.',
    category: 'carb'
  },
  'bawang bombay': {
    original: 'Bawang Bombay',
    alternative: '4-5 siung Bawang Merah iris halus atau Daun Bawang bagian putih',
    note: 'Bawang merah menghasilkan aroma manis gurih yang bahkan lebih kaya saat ditumis.',
    category: 'spice'
  },
  'cabai rawit': {
    original: 'Cabai Rawit',
    alternative: 'Cabai merah keriting, Cabai bubuk (Boncabe), atau Lada hitam bubuk',
    note: 'Sesuaikan level kepedasan dengan selera Anda.',
    category: 'spice'
  },
  'keju parmesan': {
    original: 'Keju Parmesan',
    alternative: 'Keju Cheddar parut halus yang dipanggang sebentar di teflon kering',
    note: 'Memberikan rasa asin gurih renyah di atas hidangan pasta.',
    category: 'other'
  },
  'mentega': {
    original: 'Mentega / Butter',
    alternative: 'Margarin (BlueBand) atau Minyak goreng + sejumput garam',
    note: 'Gunakan margarin dengan porsi setara untuk aroma gurih.',
    category: 'other'
  },
  'butter': {
    original: 'Butter',
    alternative: 'Margarin atau Minyak kelapa / minyak goreng',
    note: 'Bisa diganti 1:1 untuk menumis.',
    category: 'other'
  },
  'tepung maizena': {
    original: 'Tepung Maizena',
    alternative: 'Tepung terigu biasa atau Tepung tapioka dilarutkan air dingin',
    note: 'Fungsi pengental kuah tetap bekerja maksimal.',
    ratio: '1 sdt maizena = 1 sdt terigu dilarutkan',
    category: 'other'
  },
  'daun seledri': {
    original: 'Daun Seledri / Parsley',
    alternative: 'Daun bawang cincang halus atau Daun ketumbar',
    note: 'Memberikan aroma segar hijau di akhir masakan.',
    category: 'spice'
  },
  'merica bubuk': {
    original: 'Merica / Lada Bubuk',
    alternative: 'Lada hitam bubuk atau sedikit jahe parut',
    note: 'Memberikan sensasi hangat di tenggorokan pada hidangan sup.',
    category: 'spice'
  }
};

/**
 * Find relevant substitutions for a list of recipe ingredients
 */
export function getSubstitutionsForIngredients(ingredients: { name: string; isOwned: boolean }[]): Substitution[] {
  const result: Substitution[] = [];
  const addedKeys = new Set<string>();

  for (const ing of ingredients) {
    const lowerName = ing.name.toLowerCase();
    for (const [key, sub] of Object.entries(COMMON_SUBSTITUTIONS)) {
      if (lowerName.includes(key) && !addedKeys.has(sub.original)) {
        addedKeys.add(sub.original);
        result.push(sub);
      }
    }
  }

  // If no direct keyword match, provide versatile top kitchen hacks
  if (result.length === 0) {
    result.push(
      COMMON_SUBSTITUTIONS['saus tiram'],
      COMMON_SUBSTITUTIONS['bawang bombay'],
      COMMON_SUBSTITUTIONS['daging sapi']
    );
  }

  return result;
}
