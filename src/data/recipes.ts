import { Recipe } from '../types';

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'recipe-spaghetti-bolognese',
    title: 'Spaghetti Bolognese Daging Sapi Saus Prego',
    description: 'Pasta lembut al dente dengan siraman saus daging sapi cincang gurih bumbu bawang bombay harum khas Italia.',
    matchPercentage: 98,
    prepTimeMinutes: 5,
    cookTimeMinutes: 15,
    totalTimeMinutes: 20,
    difficulty: 'Mudah',
    estimatedCost: 'Rp 28.000 / porsi',
    calories: 490,
    servings: 2,
    urgencyMessage: 'Menggunakan pasta spaghetti, saus Prego, dan daging cincang sebelum batas simpan.',
    ingredients: [
      { name: 'Pasta spaghetti', amount: '200 gr', isOwned: true },
      { name: 'Daging sapi cincang', amount: '250 gr', isOwned: true, urgentPriority: true },
      { name: 'Saus pasta Prego', amount: '1/2 kaleng (200 ml)', isOwned: true },
      { name: 'Bawang bombay cincang', amount: '1/2 butir', isOwned: true },
      { name: 'Bawang putih cincang', amount: '2 siung', isOwned: true },
      { name: 'Minyak goreng / mentega', amount: '2 sdm', isOwned: true },
      { name: 'Garam, gula & lada hitam', amount: 'Secukupnya', isOwned: true },
      { name: 'Keju parut / oregano', amount: 'Opsional (taburan)', isOwned: false }
    ],
    steps: [
      {
        step: 1,
        instruction: 'Perebusan Pasta Al Dente: Didihkan air berlimpah di panci dengan 1 sdt garam. Masukkan pasta spaghetti dan rebus selama 8-9 menit hingga al dente. Tiriskan dan simpan 3 sdm air rebusan pasta.',
        durationMinutes: 8,
        tip: 'Air rebusan pasta yang bertepung akan membantu saus menempel sempurna pada mie spaghetti.'
      },
      {
        step: 2,
        instruction: 'Penumisan Bumbu Aromatik: Panaskan wajan dengan 2 sdm mentega atau minyak goreng di atas api sedang. Masukkan bawang bombay dan bawang putih cincang, tumis hingga harum layu dan berwarna keemasan.',
        durationMinutes: 3,
        tip: 'Gunakan api sedang agar bawang matang merata tanpa gosong.'
      },
      {
        step: 3,
        instruction: 'Pematangan Daging Cincang: Masukkan daging sapi cincang ke dalam wajan. Aduk cepat sambil ditekan-tekan agar butiran daging terpisah merata. Masak hingga daging berubah warna kecokelatan.',
        durationMinutes: 4,
        tip: 'Keluarkan daging dari kulkas 5 menit sebelum dimasak agar suhunya tidak terlalu dingin saat masuk ke wajan.'
      },
      {
        step: 4,
        instruction: 'Penggabungan Saus & Seasoning: Tuang saus pasta Prego dan 3 sdm air rebusan pasta ke dalam wajan. Bumbui dengan sejumput garam, gula pasir, dan lada hitam bubuk.',
        durationMinutes: 2,
        tip: 'Jika menyukai sensasi pedas, tambahkan irisan cabai rawit atau cabai bubuk di tahap ini.'
      },
      {
        step: 5,
        instruction: 'Reduksi & Pematangan Saus: Kecilkan api sedikit, aduk perlahan dan biarkan saus mendidih kecil selama 3 menit hingga kuah mengental dan bumbu meresap ke dalam daging.',
        durationMinutes: 3,
        tip: 'Aduk sesekali agar bagian dasar saus tidak berkerak.'
      },
      {
        step: 6,
        instruction: 'Penyajian & Sentuhan Akhir: Tata pasta spaghetti di piring saji, tuangkan saus bolognese daging melimpah di atasnya. Taburkan keju parut atau oregano bila suka, sajikan selagi panas.',
        durationMinutes: 1
      }
    ],
    nutrition: {
      calories: 490,
      protein: '28g',
      carbs: '58g',
      fat: '16g'
    },
    tasteProfile: ['Gurih Tomat', 'Manis Sedang', 'Bisa Pedas'],
    theme: 'bolognese'
  },
  {
    id: 'recipe-oseng-daging',
    title: 'Oseng Daging Sapi Sayur Gurih Pedas',
    description: 'Daging sapi segar diiris tipis, ditumis dengan buncis renyah, wortel, dan bumbu kecap pedas meresap sempurna.',
    matchPercentage: 94,
    prepTimeMinutes: 8,
    cookTimeMinutes: 12,
    totalTimeMinutes: 20,
    difficulty: 'Praktis',
    estimatedCost: 'Rp 32.000 / porsi',
    calories: 410,
    servings: 2,
    urgencyMessage: 'Daging sapi segar & buncis segar habis sekaligus dalam 1 wajan.',
    ingredients: [
      { name: 'Daging sapi segar', amount: '300 gr (iris tipis)', isOwned: true, urgentPriority: true },
      { name: 'Buncis & Wortel', amount: '150 gr (iris serong)', isOwned: true, urgentPriority: true },
      { name: 'Bawang putih & merah', amount: '4 siung (iris)', isOwned: true },
      { name: 'Cabai rawit & merah', amount: '5-8 buah (sesuai selera pedas)', isOwned: true },
      { name: 'Kecap manis & saus tiram', amount: 'Masing-masing 1.5 sdm', isOwned: true },
      { name: 'Minyak untuk menumis', amount: '2 sdm', isOwned: true },
      { name: 'Garam & merica', amount: 'Secukupnya', isOwned: true }
    ],
    steps: [
      {
        step: 1,
        instruction: 'Persiapan & Marinasi Kilat: Iris tipis daging sapi berlawanan arah serat agar cepat empuk. Lumuri daging dengan 1 sdm kecap manis dan sejumput merica selama 5 menit.',
        durationMinutes: 5,
        tip: 'Memotong berlawanan serat membuat daging empuk tanpa perlu direbus berjam-jam.'
      },
      {
        step: 2,
        instruction: 'Pemotongan Sayuran: Cuci bersih buncis dan wortel, lalu potong serong dengan ukuran seragam agar tingkat kematangannya pas bersamaan.',
        durationMinutes: 2
      },
      {
        step: 3,
        instruction: 'Penumisan Bumbu Iris: Panaskan 2 sdm minyak di wajan dengan api sedang-tinggi. Masukkan irisan bawang merah, bawang putih, dan cabai rawit, tumis hingga harum layu.',
        durationMinutes: 2,
        tip: 'Gunakan api yang cukup panas agar bumbu mengeluarkan aroma smokey harum.'
      },
      {
        step: 4,
        instruction: 'Pematangan Daging Api Besar: Masukkan irisan daging sapi ke dalam wajan. Besarkan api dan aduk cepat selama 3-4 menit sampai daging berubah warna kecokelatan merata.',
        durationMinutes: 4,
        tip: 'Jangan menumis terlalu lama agar tekstur daging tetap empuk dan juicy.'
      },
      {
        step: 5,
        instruction: 'Pemasukan Sayur & Pembumbuan: Masukkan irisan wortel dan buncis. Tambahkan saus tiram, sisa kecap manis, garam, dan 3 sdm air matang. Tumis cepat 2-3 menit hingga sayur matang renyah.',
        durationMinutes: 3,
        tip: 'Jaga sayuran tetap berwarna cerah dan segar dengan tidak menutup wajan terlalu lama.'
      },
      {
        step: 6,
        instruction: 'Koreksi Rasa & Penyajian: Cicipi keseimbangan rasa gurih pedas manisnya. Angkat dari wajan dan sajikan selagi panas mengepul bersama nasi putih pulen.',
        durationMinutes: 1
      }
    ],
    nutrition: {
      calories: 410,
      protein: '32g',
      carbs: '22g',
      fat: '21g'
    },
    tasteProfile: ['Pedas Nendang', 'Gurih Manis', 'Kaya Protein'],
    theme: 'stirfry'
  },
  {
    id: 'recipe-sup-daging',
    title: 'Sup Daging Sapi Bening Wortel Hangat',
    description: 'Kuah bening segar beraroma rempah bawang dan pala, dipadukan potongan daging empuk serta sayuran wortel dan buncis.',
    matchPercentage: 90,
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    totalTimeMinutes: 30,
    difficulty: 'Mudah',
    estimatedCost: 'Rp 26.000 / porsi',
    calories: 340,
    servings: 3,
    urgencyMessage: 'Pilihan sehat untuk keluarga, memanfaatkan semua stok sayur di kulkas.',
    ingredients: [
      { name: 'Daging sapi segar', amount: '300 gr (potong dadu kecil)', isOwned: true, urgentPriority: true },
      { name: 'Wortel & Buncis', amount: '200 gr (potong 2 cm)', isOwned: true, urgentPriority: true },
      { name: 'Bawang putih geprek', amount: '4 siung', isOwned: true },
      { name: 'Air bersih / kaldu', amount: '1 liter', isOwned: true },
      { name: 'Daun bawang & seledri', amount: '1 batang (iris)', isOwned: true },
      { name: 'Garam, kaldu bubuk, pala & lada', amount: 'Secukupnya', isOwned: true },
      { name: 'Bawang goreng', amount: 'Taburan', isOwned: false }
    ],
    steps: [
      {
        step: 1,
        instruction: 'Pemotongan Dadu Daging: Potong daging sapi ukuran dadu 1.5 cm agar cepat empuk dan mudah disantap.',
        durationMinutes: 3
      },
      {
        step: 2,
        instruction: 'Perebusan Daging & Bumbu: Didihkan 1 liter air di panci, masukkan potongan daging bersama 4 siung bawang putih geprek dengan api sedang.',
        durationMinutes: 10,
        tip: 'Rebus bersama bawang putih geprek dari awal agar aroma kaldu daging menjadi harum dan sedap.'
      },
      {
        step: 3,
        instruction: 'Pembersihan Buih Kaldu: Ambil sendok sayur dan buang buih kotoran yang mengapung di permukaan air rebusan secara bertahap.',
        durationMinutes: 2,
        tip: 'Membuang buih busa adalah kunci utama agar kuah sup tetap jernih dan bening berkilau.'
      },
      {
        step: 4,
        instruction: 'Pemasukan Wortel & Rempah: Masukkan potongan wortel ke dalam panci. Tambahkan garam, merica bubuk, sedikit pala bubuk, dan kaldu penyedap. Rebus 4 menit hingga wortel setengah matang.',
        durationMinutes: 4
      },
      {
        step: 5,
        instruction: 'Pemasukan Buncis: Masukkan potongan buncis, masak sebentar selama 2-3 menit sampai buncis berubah hijau cerah dan empuk pas.',
        durationMinutes: 3
      },
      {
        step: 6,
        instruction: 'Penyajian Taburan Segar: Matikan api kompor. Masukkan irisan daun bawang dan seledri segar. Tuang ke mangkuk saji hangat dan taburi bawang goreng renyah.',
        durationMinutes: 1
      }
    ],
    nutrition: {
      calories: 340,
      protein: '29g',
      carbs: '18g',
      fat: '14g'
    },
    tasteProfile: ['Segar Gurih', 'Hangat Berempah', 'Ringan di Perut'],
    theme: 'soup'
  },
  {
    id: 'recipe-pasta-aglio',
    title: 'Spaghetti Tumis Daging Cincang Cabai Bawang',
    description: 'Alternatif pasta ala aglio e olio gurih dengan limpahan daging cincang renyah, bawang putih wangi, dan irisan cabai pedas.',
    matchPercentage: 92,
    prepTimeMinutes: 5,
    cookTimeMinutes: 12,
    totalTimeMinutes: 17,
    difficulty: 'Praktis',
    estimatedCost: 'Rp 24.000 / porsi',
    calories: 460,
    servings: 2,
    urgencyMessage: 'Solusi makan malam super cepat di bawah 20 menit.',
    ingredients: [
      { name: 'Pasta spaghetti', amount: '180 gr', isOwned: true },
      { name: 'Daging sapi cincang', amount: '200 gr', isOwned: true, urgentPriority: true },
      { name: 'Bawang putih cincang halus', amount: '5 siung', isOwned: true },
      { name: 'Cabai rawit merah iris', amount: '5 buah', isOwned: true },
      { name: 'Minyak goreng / zaitun', amount: '3 sdm', isOwned: true },
      { name: 'Garam & kaldu bubuk', amount: 'Secukupnya', isOwned: true }
    ],
    steps: [
      {
        step: 1,
        instruction: 'Perebusan Pasta Al Dente: Rebus pasta spaghetti dalam air mendidih bergaram selama 8 menit sampai al dente. Tiriskan dan tetesi sedikit minyak agar tidak lengket.',
        durationMinutes: 8
      },
      {
        step: 2,
        instruction: 'Penyiapan Bawang & Cabai: Cincang halus 5 siung bawang putih dan iris serong cabai rawit merah segar.',
        durationMinutes: 2
      },
      {
        step: 3,
        instruction: 'Penumisan Minyak Aromatik: Panaskan 3 sdm minyak di wajan datar. Masukkan bawang putih dan cabai rawit dengan api kecil hingga harum dan berwarna kuning keemasan.',
        durationMinutes: 2,
        tip: 'Gunakan api kecil agar bawang putih tidak cepat gosong dan tidak terasa pahit.'
      },
      {
        step: 4,
        instruction: 'Pematangan Daging Cincang: Naikkan api ke sedang, masukkan daging cincang. Tumis cepat hingga daging berubah kecokelatan dan renyah. Bumbui dengan garam dan kaldu bubuk.',
        durationMinutes: 4
      },
      {
        step: 5,
        instruction: 'Penyatuan Pasta & Daging: Masukkan spaghetti yang sudah ditiriskan ke dalam wajan. Aduk cepat di atas api sedang selama 1-2 menit agar seluruh untaian pasta terlumuri minyak gurih.',
        durationMinutes: 2
      },
      {
        step: 6,
        instruction: 'Penyajian Hangat: Koreksi rasa gurih pedasnya, angkat dan sajikan segera di piring selagi hangat.',
        durationMinutes: 1
      }
    ],
    nutrition: {
      calories: 460,
      protein: '26g',
      carbs: '54g',
      fat: '17g'
    },
    tasteProfile: ['Pedas Gurih Bawang', 'Kering & Harum', 'Praktis'],
    theme: 'pasta'
  },
  {
    id: 'recipe-nasgor-sapi',
    title: 'Nasi Goreng Daging Sapi Rawit Bawang',
    description: 'Nasi goreng harum aroma bumbu iris bawang dan cabai rawit, bertabur irisan daging sapi gurih dan telur orak-arik lezat.',
    matchPercentage: 96,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    totalTimeMinutes: 15,
    difficulty: 'Praktis',
    estimatedCost: 'Rp 22.000 / porsi',
    calories: 510,
    servings: 2,
    urgencyMessage: 'Solusi sarapan atau makan malam kilat 15 menit menggunakan stok nasi dan daging.',
    ingredients: [
      { name: 'Nasi putih (pera / dingin)', amount: '2 piring (300 gr)', isOwned: true },
      { name: 'Daging sapi cincang / iris tipis', amount: '150 gr', isOwned: true, urgentPriority: true },
      { name: 'Telur ayam', amount: '1-2 butir', isOwned: true },
      { name: 'Bawang merah & putih', amount: '4 siung (iris tipis)', isOwned: true },
      { name: 'Cabai rawit merah iris', amount: '4-6 buah', isOwned: true },
      { name: 'Kecap manis & saus tiram', amount: 'Masing-masing 1.5 sdm', isOwned: true },
      { name: 'Minyak goreng / margarin', amount: '2 sdm', isOwned: true },
      { name: 'Garam, gula & lada', amount: 'Secukupnya', isOwned: true }
    ],
    steps: [
      {
        step: 1,
        instruction: 'Pengolahan Telur Orak-Arik: Panaskan 1 sdm minyak di wajan, masukkan telur ayam lalu orak-arik cepat dengan spatula hingga matang berbulir. Angkat dan sisihkan ke piring.',
        durationMinutes: 2,
        tip: 'Gunakan api besar agar telur orak-arik beraroma gurih harum khas restoran.'
      },
      {
        step: 2,
        instruction: 'Penumisan Bumbu Iris: Tambahkan sisa minyak ke wajan yang sama. Masukkan irisan bawang merah, bawang putih, dan cabai rawit. Tumis hingga harum semerbak.',
        durationMinutes: 2
      },
      {
        step: 3,
        instruction: 'Pematangan Daging Sapi: Masukkan irisan daging sapi ke dalam bumbu tumis. Aduk cepat di atas api sedang-tinggi selama 3 menit sampai daging matang dan sarinya keluar.',
        durationMinutes: 3,
        tip: 'Tumis daging dengan api agak besar agar sarinya langsung mengunci rasa di wajan.'
      },
      {
        step: 4,
        instruction: 'Pemasukan Nasi & Telur: Masukkan nasi putih dingin dan telur orak-arik ke dalam wajan. Tekan-tekan bulir nasi agar tidak menggumpal.',
        durationMinutes: 2
      },
      {
        step: 5,
        instruction: 'Pembumbuan & Pengadukan Api Besar: Tuangkan kecap manis, saus tiram, garam, dan lada. Aduk cepat di atas api besar selama 2 menit hingga seluruh bulir nasi terlapisi bumbu rata dan berasap harum.',
        durationMinutes: 2,
        tip: 'Teknik mengaduk di atas api besar (wok hei) memberikan aroma sedap pada nasi goreng.'
      },
      {
        step: 6,
        instruction: 'Penyajian Nasi Goreng Hangat: Koreksi rasa, matikan api, dan tata nasi goreng di piring saji. Sajikan dengan irisan timun atau kerupuk.',
        durationMinutes: 1
      }
    ],
    nutrition: {
      calories: 510,
      protein: '27g',
      carbs: '64g',
      fat: '17g'
    },
    tasteProfile: ['Pedas Gurih', 'Smoky Bawang', 'Kenyang Maksimal'],
    theme: 'stirfry'
  },
  {
    id: 'recipe-semur-daging-wortel',
    title: 'Semur Kilat Daging Sapi & Wortel Bumbu Rempah',
    description: 'Potongan daging sapi empuk dipadu irisan wortel manis dalam kuah kecap rempah pala dan lada yang hangat meresap.',
    matchPercentage: 91,
    prepTimeMinutes: 8,
    cookTimeMinutes: 17,
    totalTimeMinutes: 25,
    difficulty: 'Mudah',
    estimatedCost: 'Rp 29.000 / porsi',
    calories: 385,
    servings: 3,
    urgencyMessage: 'Menu berkuah hangat kaya protein dan vitamin A untuk santap siang atau malam.',
    ingredients: [
      { name: 'Daging sapi segar', amount: '250 gr (iris tipis berlawanan serat)', isOwned: true, urgentPriority: true },
      { name: 'Wortel manis', amount: '2 buah (potong bulat / serong)', isOwned: true, urgentPriority: true },
      { name: 'Bawang putih & bawang bombay', amount: '3 siung bawang putih & 1/2 butir bombay', isOwned: true },
      { name: 'Kecap manis kental', amount: '3-4 sdm', isOwned: true },
      { name: 'Pala bubuk & lada putih bubuk', amount: 'Masing-masing 1/3 sdt', isOwned: true },
      { name: 'Saus tiram & garam', amount: 'Secukupnya', isOwned: true },
      { name: 'Air matang / kaldu', amount: '350 ml', isOwned: true },
      { name: 'Minyak untuk menumis', amount: '1.5 sdm', isOwned: true }
    ],
    steps: [
      {
        step: 1,
        instruction: 'Penumisan Bumbu Rempah Semur: Panaskan minyak di wajan, tumis bawang putih cincang, irisan bawang bombay, dan sedikit pala bubuk hingga wangi semerbak.',
        durationMinutes: 3,
        tip: 'Menumis pala bubuk bersama bawang di awal membuat aroma semur lebih harum dan menggugah selera.'
      },
      {
        step: 2,
        instruction: 'Pematangan Daging Sapi: Masukkan irisan daging sapi, aduk rata sampai daging berubah warna menjadi kecokelatan merata.',
        durationMinutes: 4
      },
      {
        step: 3,
        instruction: 'Penambahan Kuah & Bumbu: Tuangkan kecap manis kental, saus tiram, merica putih bubuk, dan 350 ml air matang atau kaldu.',
        durationMinutes: 2
      },
      {
        step: 4,
        instruction: 'Pemasukan Wortel & Penutupan Wajan: Masukkan potongan wortel manis. Tutup wajan dan masak dengan api sedang selama 8 menit agar uap panas mematangkan daging dan wortel bersamaan.',
        durationMinutes: 8,
        tip: 'Menutup wajan membuat wortel cepat empuk tanpa membuat kuah cepat menyusut kering.'
      },
      {
        step: 5,
        instruction: 'Reduksi Kuah Semur Kental: Buka tutup wajan, masak sebentar selama 2 menit hingga kuah sedikit menyusut kental dan mengilap.',
        durationMinutes: 2
      },
      {
        step: 6,
        instruction: 'Penyajian Kuah Semur Hangat: Koreksi rasa manis gurihnya dengan sejumput garam. Angkat dan sajikan kuah semur hangat bersama nasi putih.',
        durationMinutes: 1
      }
    ],
    nutrition: {
      calories: 385,
      protein: '30g',
      carbs: '22g',
      fat: '19g'
    },
    tasteProfile: ['Manis Gurih Berempah', 'Kuah Hangat', 'Daging Juicy'],
    theme: 'stew'
  }
];

export const RECIPES_DATABASE: Recipe[] = INITIAL_RECIPES;
