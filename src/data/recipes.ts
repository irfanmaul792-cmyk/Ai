import { Recipe } from '../types';

export const RECIPES_DATABASE: Recipe[] = [
  {
    id: 'recipe-bolognese',
    title: 'Spaghetti Bolognese Daging Sapi Kilat',
    description: 'Paduan saus Prego kental dengan daging sapi cincang gurih, dimasak cepat dengan aroma tumisan bawang bombay segar.',
    matchPercentage: 98,
    prepTimeMinutes: 5,
    cookTimeMinutes: 15,
    totalTimeMinutes: 20,
    difficulty: 'Mudah',
    estimatedCost: 'Rp 28.000 / porsi',
    calories: 490,
    servings: 2,
    urgencyMessage: 'Memakai daging cincang & saus Prego agar tidak terbuang.',
    ingredients: [
      { name: 'Daging sapi cincang', amount: '250-300 gr', isOwned: true, urgentPriority: true },
      { name: 'Pasta spaghetti', amount: '180 gr', isOwned: true },
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
        instruction: 'Didihkan air berlimpah dengan 1 sdt garam. Masukkan pasta spaghetti dan rebus selama 8-9 menit hingga al dente. Tiriskan dan simpan 3 sdm air rebusan pasta.',
        durationMinutes: 8,
        tip: 'Air rebusan pasta yang bertepung akan membantu saus menempel sempurna pada mie spaghetti.'
      },
      {
        step: 2,
        instruction: 'Panaskan wajan dengan sedikit minyak atau mentega. Tumis bawang bombay dan bawang putih cincang hingga harum layu dan keemasan.',
        durationMinutes: 3,
        tip: 'Gunakan api sedang agar bawang tidak lekas gosong.'
      },
      {
        step: 3,
        instruction: 'Masukkan daging sapi cincang. Aduk cepat dan tekan-tekan agar tidak menggumpal, masak sampai daging berubah warna kecokelatan merata.',
        durationMinutes: 4,
        tip: 'Keluarkan daging dari kulkas 5 menit sebelum dimasak agar suhunya tidak terlalu dingin di wajan.'
      },
      {
        step: 4,
        instruction: 'Tuang saus pasta Prego dan masukkan 3 sdm air rebusan pasta. Tambahkan sejumput gula, garam, dan lada bubuk sesuai selera. Aduk rata dan masak mendidih kecil selama 3 menit.',
        durationMinutes: 3,
        tip: 'Jika suka pedas sesuai selera Anda, tambahkan irisan cabai rawit atau cabai bubuk di tahap ini.'
      },
      {
        step: 5,
        instruction: 'Tata spaghetti di atas piring saji, siram saus bolognese daging melimpah di atasnya. Siap disajikan selagi hangat!',
        durationMinutes: 2
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
        instruction: 'Iris tipis daging sapi berlawanan arah serat agar teksturnya empuk saat ditumis cepat. Lumuri daging dengan 1 sdm kecap manis dan sejumput merica selama 5 menit.',
        durationMinutes: 5,
        tip: 'Memotong berlawanan serat membuat daging empuk tanpa perlu direbus berjam-jam.'
      },
      {
        step: 2,
        instruction: 'Panaskan wajan dengan api besar, masukkan irisan bawang merah, bawang putih, dan cabai rawit. Tumis hingga harum dan layu.',
        durationMinutes: 2
      },
      {
        step: 3,
        instruction: 'Masukkan irisan daging sapi. Besarkan api dan aduk cepat selama 3-4 menit sampai daging berubah warna dan keluar aroma harum gurihnya.',
        durationMinutes: 4,
        tip: 'Jangan menumis terlalu lama agar daging tetap juicy.'
      },
      {
        step: 4,
        instruction: 'Masukkan sayuran wortel dan buncis. Beri saus tiram, sisa kecap manis, garam, dan 3 sdm air matang. Tumis sebentar sampai sayur matang renyah.',
        durationMinutes: 3,
        tip: 'Jaga sayuran tetap berwarna hijau cerah dan bertekstur krispi.'
      },
      {
        step: 5,
        instruction: 'Koreksi rasa gurih pedas manisnya. Angkat dan sajikan hangat bersama nasi putih pulen atau pasta.',
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
        instruction: 'Potong daging sapi ukuran dadu 1.5 cm agar cepat empuk. Rebus dalam 1 liter air mendidih bersama bawang putih geprek dengan api sedang.',
        durationMinutes: 12,
        tip: 'Buang buih busa yang mengapung di permukaan panci agar kuah sup tetap jernih berkilau.'
      },
      {
        step: 2,
        instruction: 'Masukkan wortel terlebih dahulu, rebus selama 4 menit hingga setengah empuk.',
        durationMinutes: 4
      },
      {
        step: 3,
        instruction: 'Tambahkan buncis, garam, lada bubuk, sedikit pala bubuk, dan kaldu sapi. Masak hingga sayuran empuk pas.',
        durationMinutes: 3
      },
      {
        step: 4,
        instruction: 'Matikan api, masukkan irisan daun bawang, seledri, dan taburan cabai rawit iris bagi yang suka pedas segar. Sajikan hangat.',
        durationMinutes: 2
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
        instruction: 'Rebus pasta spaghetti dalam air mendidih bergaram selama 8 menit sampai al dente. Tiriskan.',
        durationMinutes: 8
      },
      {
        step: 2,
        instruction: 'Di wajan datar, panaskan minyak dan tumis bawang putih serta cabai dengan api kecil sampai wangi dan kekuningan.',
        durationMinutes: 2,
        tip: 'Jangan gunakan api besar agar bawang putih tidak pahit.'
      },
      {
        step: 3,
        instruction: 'Masukkan daging cincang, tumis hingga matang kecokelatan dan renyah. Bumbui dengan garam dan kaldu bubuk.',
        durationMinutes: 4
      },
      {
        step: 4,
        instruction: 'Masukkan pasta spaghetti yang sudah ditiriskan. Aduk rata di atas wajan dengan api sedang selama 1 menit hingga tercampur sempurna.',
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
        instruction: 'Panaskan 1 sdm minyak di wajan, masukkan telur lalu orak-arik hingga matang berbulir. Angkat dan sisihkan.',
        durationMinutes: 2,
        tip: 'Gunakan api besar agar telur orak-arik beraroma smoky khas resto.'
      },
      {
        step: 2,
        instruction: 'Tambahkan sisa minyak, tumis irisan bawang merah, bawang putih, dan cabai rawit hingga harum semerbak.',
        durationMinutes: 2
      },
      {
        step: 3,
        instruction: 'Masukkan daging sapi iris, tumis cepat selama 3 menit sampai matang kecokelatan dan sarinya keluar.',
        durationMinutes: 3,
        tip: 'Tumis daging dengan api sedang-tinggi agar sari daging meresap ke bumbu tumis.'
      },
      {
        step: 4,
        instruction: 'Masukkan nasi dingin dan telur orak-arik. Bumbui dengan kecap manis, saus tiram, garam, dan lada. Aduk cepat di atas api besar sampai nasi berbulir rata dan bumbu meresap sempurna.',
        durationMinutes: 3
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
        instruction: 'Panaskan minyak, tumis bawang putih cincang dan irisan bawang bombay bersama sedikit pala bubuk sampai wangi semerbak.',
        durationMinutes: 3,
        tip: 'Menumis pala bubuk bersama bawang di awal membuat aroma semur lebih wangi dan menggugah selera.'
      },
      {
        step: 2,
        instruction: 'Masukkan irisan daging sapi, aduk rata sampai daging berubah warna menjadi kecokelatan.',
        durationMinutes: 4
      },
      {
        step: 3,
        instruction: 'Tuang kecap manis, saus tiram, lada, dan air kaldu. Masukkan potongan wortel. Masak dengan api sedang selama 12 menit hingga wortel empuk dan kuah mengental gurih.',
        durationMinutes: 12,
        tip: 'Tutup wajan agar uap panas mematangkan daging dan wortel lebih cepat tanpa kuah cepat surut.'
      },
      {
        step: 4,
        instruction: 'Koreksi rasa manis gurihnya dengan sejumput garam. Angkat dan sajikan kuah semur hangat berpadu nasi putih.',
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
