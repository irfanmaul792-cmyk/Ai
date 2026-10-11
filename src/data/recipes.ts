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
  }
];
