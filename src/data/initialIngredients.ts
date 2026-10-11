import { Ingredient } from '../types';

export const INITIAL_INGREDIENTS: Ingredient[] = [
  {
    id: 'ing-1',
    name: 'Daging sapi segar',
    quantity: '300-500 gram',
    category: 'protein',
    urgency: 'urgent',
    shelf: 'meat',
    icon: '🥩',
    daysRemaining: 1,
    selected: true,
  },
  {
    id: 'ing-2',
    name: 'Daging sapi cincang',
    quantity: '300 gram',
    category: 'protein',
    urgency: 'urgent',
    shelf: 'freezer',
    icon: '🥩',
    daysRemaining: 1,
    selected: true,
  },
  {
    id: 'ing-3',
    name: 'Pasta spaghetti',
    quantity: '1 bungkus (450g)',
    category: 'karbo',
    urgency: 'safe',
    shelf: 'door',
    icon: '🍝',
    daysRemaining: 120,
    selected: true,
  },
  {
    id: 'ing-4',
    name: 'Saus pasta Prego',
    quantity: '1 kaleng / jar',
    category: 'bumbu',
    urgency: 'safe',
    shelf: 'chiller',
    icon: '🥫',
    daysRemaining: 60,
    selected: true,
  },
  {
    id: 'ing-5',
    name: 'Wortel & Buncis segar',
    quantity: '250 gram',
    category: 'sayur',
    urgency: 'medium',
    shelf: 'crisper',
    icon: '🥕',
    daysRemaining: 3,
    selected: true,
  },
  {
    id: 'ing-6',
    name: 'Bawang bombay & bawang putih',
    quantity: '3 butir',
    category: 'bumbu',
    urgency: 'safe',
    shelf: 'crisper',
    icon: '🧅',
    daysRemaining: 14,
    selected: true,
  }
];

export const FRIDGE_SHELVES_ITEMS = {
  freezer: [
    { name: 'Daging sapi cincang', icon: '🥩', tag: 'Segera Olah' },
    { name: 'Es batu & kaldu frozen', icon: '🧊', tag: 'Aman' },
    { name: 'Sosis sapi', icon: '🌭', tag: 'Aman' }
  ],
  topChiller: [
    { name: 'Saus pasta Prego', icon: '🥫', tag: 'Sudah Dibuka' },
    { name: 'Keju Cheddar blok', icon: '🧀', tag: '5 hari lagi' },
    { name: 'Mentega / Margarin', icon: '🧈', tag: 'Aman' }
  ],
  middleMeatZone: [
    { name: 'Daging sapi segar potongan', icon: '🥩', tag: 'Gunakan Hari Ini ⚠️' },
    { name: 'Telur ayam (6 butir)', icon: '🥚', tag: '7 hari lagi' }
  ],
  crisperDrawer: [
    { name: 'Wortel segar', icon: '🥕', tag: '3 hari lagi' },
    { name: 'Buncis baby', icon: '🥬', tag: '2 hari lagi ⚠️' },
    { name: 'Tomat merah (3 buah)', icon: '🍅', tag: '3 hari lagi' },
    { name: 'Bawang bombay & putih', icon: '🧅', tag: 'Aman' }
  ],
  doorRacks: [
    { name: 'Saus tiram & kecap manis', icon: '🍾', tag: 'Aman' },
    { name: 'Minyak zaitun / goreng', icon: '🫒', tag: 'Aman' },
    { name: 'Pasta Spaghetti kering', icon: '🍝', tag: 'Stok Kering' }
  ]
};
