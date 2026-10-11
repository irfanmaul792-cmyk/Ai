import React, { useState } from 'react';
import { Ingredient, IngredientShelf, IngredientCategory } from '../types';
import { resolveIngredientIcon, resolveIngredientCategory } from '../utils/ingredientVisuals';
import {
  Thermometer,
  Zap,
  Plus,
  Trash2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Search,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface SmartFridgeModelProps {
  ingredients: Ingredient[];
  onAddIngredient: (ingredient: Omit<Ingredient, 'id'>) => void;
  onRemoveIngredient: (id: string) => void;
  onSearchRecipes: () => void;
}

export const SmartFridgeModel: React.FC<SmartFridgeModelProps> = ({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onSearchRecipes,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [activeZone, setActiveZone] = useState<IngredientShelf | 'all'>('all');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Form state for adding ingredients into specific fridge shelf
  const [newName, setNewName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newShelf, setNewShelf] = useState<IngredientShelf>('meat');
  const [newUrgency, setNewUrgency] = useState<'urgent' | 'medium' | 'safe'>('urgent');

  // Filter ingredients per shelf
  const meatItems = ingredients.filter(i => (i.shelf === 'meat' || (!i.shelf && i.category === 'protein')));
  const crisperItems = ingredients.filter(i => (i.shelf === 'crisper' || (!i.shelf && i.category === 'sayur')));
  const chillerItems = ingredients.filter(i => (i.shelf === 'chiller' || (!i.shelf && (i.category === 'bumbu' || i.category === 'dairy'))));
  const freezerItems = ingredients.filter(i => i.shelf === 'freezer');
  const doorItems = ingredients.filter(i => (i.shelf === 'door' || (!i.shelf && i.category === 'karbo')));

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    // Resolve accurate food visual icon & category directly from the ingredient's name!
    // Ensures typing "telur" in meat shelf (or any shelf) assigns 🥚, "daging" assigns 🥩, "ayam" assigns 🍗, etc.
    const resolvedIcon = resolveIngredientIcon(newName.trim());
    let defaultCategory: IngredientCategory = 'protein';
    if (newShelf === 'crisper') defaultCategory = 'sayur';
    else if (newShelf === 'chiller') defaultCategory = 'bumbu';
    else if (newShelf === 'door') defaultCategory = 'karbo';
    const resolvedCategory = resolveIngredientCategory(newName.trim(), defaultCategory);

    onAddIngredient({
      name: newName.trim(),
      quantity: newQuantity.trim() || '1 porsi',
      category: resolvedCategory,
      shelf: newShelf,
      urgency: newUrgency,
      icon: resolvedIcon,
      daysRemaining: newUrgency === 'urgent' ? 1 : newUrgency === 'medium' ? 3 : 30,
      selected: true,
    });

    setNewName('');
    setNewQuantity('');
    setIsAdding(false);
  };

  // Quick preset ingredient adder
  const handleQuickAdd = (preset: { name: string; quantity: string; shelf: IngredientShelf; urgency: 'urgent' | 'medium' | 'safe'; icon: string }) => {
    const exists = ingredients.some(i => i.name.toLowerCase() === preset.name.toLowerCase());
    if (exists) return;

    const resolvedIcon = resolveIngredientIcon(preset.name, preset.icon);
    const resolvedCategory = resolveIngredientCategory(preset.name, preset.shelf === 'crisper' ? 'sayur' : preset.shelf === 'door' ? 'karbo' : 'protein');

    onAddIngredient({
      name: preset.name,
      quantity: preset.quantity,
      category: resolvedCategory,
      shelf: preset.shelf,
      urgency: preset.urgency,
      icon: resolvedIcon,
      daysRemaining: preset.urgency === 'urgent' ? 1 : preset.urgency === 'medium' ? 3 : 14,
      selected: true,
    });
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full">
            <AlertTriangle className="w-2.5 h-2.5" /> Segera Olah
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
            <Clock className="w-2.5 h-2.5" /> 3-5 Hari
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-2.5 h-2.5" /> Aman
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-stone-900/95 text-stone-100 rounded-3xl p-5 md:p-8 shadow-2xl border border-stone-800 relative overflow-hidden">
      {/* Background soft ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Header bar of Kulkas Pintar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">Dual-Inverter Hub</span>
            <span className="text-stone-600">·</span>
            <span className="text-xs text-stone-300">Inventaris Dapur Mandiri</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold font-display text-white mt-0.5">
            Kulkas Pintar
          </h3>
          <p className="text-xs md:text-sm text-stone-400 mt-1 max-w-2xl">
            Kelola dan tambahkan bahan makanan yang kamu miliki langsung ke dalam rak Kulkas Pintar. Sistem rekomendasi resep akan membaca seluruh stok yang ada di sini!
          </p>
        </div>

        {/* Digital display & actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-stone-950/80 border border-stone-800 px-3 py-2 rounded-xl flex items-center gap-2.5 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Thermometer className="w-3.5 h-3.5" />
              <span>Chiller 3°C</span>
            </div>
            <div className="h-3 w-px bg-stone-800" />
            <div className="flex items-center gap-1.5 text-blue-400">
              <Zap className="w-3.5 h-3.5" />
              <span>Freezer -18°C</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Bahan ke Kulkas</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            {isOpen ? 'Tutup Pintu' : 'Buka Pintu'}
          </button>
        </div>
      </div>

      {/* Form Tambah Bahan Langsung ke Kulkas Pintar */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="mt-6 p-5 md:p-6 bg-stone-950 rounded-2xl border border-stone-800 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Masukkan Bahan Makanan Baru ke Kulkas Pintar</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-stone-400 hover:text-white"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-300">
                  Nama Bahan
                </label>
                {newName.trim() && (
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <span>Visual:</span>
                    <span className="text-base">{resolveIngredientIcon(newName)}</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="misal: Telur, Daging Sapi, Ayam, Bayam"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs p-2.5 pr-9 rounded-xl border border-stone-700 bg-stone-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
                  {resolveIngredientIcon(newName)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Jumlah / Porsi
              </label>
              <input
                type="text"
                placeholder="misal: 300 gram, 2 buah, 1 ikat"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-700 bg-stone-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Pilih Letak Rak Kulkas
              </label>
              <select
                value={newShelf}
                onChange={(e) => setNewShelf(e.target.value as IngredientShelf)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-700 bg-stone-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="meat">🥩 Rak Daging & Protein Dingin</option>
                <option value="crisper">🥦 Laci Sayuran & Buah (Crisper)</option>
                <option value="chiller">🥫 Rak Atas Saus & Olahan Susu</option>
                <option value="freezer">❄️ Freezer Kompartemen Bawah</option>
                <option value="door">🚪 Rak Pintu Samping (Bumbu/Pasta)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Tingkat Urgensi Olah
              </label>
              <select
                value={newUrgency}
                onChange={(e) => setNewUrgency(e.target.value as 'urgent' | 'medium' | 'safe')}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-700 bg-stone-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="urgent">⚠️ Prioritas (Gunakan 1-2 Hari)</option>
                <option value="medium">🟡 Sedang (3-5 Hari)</option>
                <option value="safe">🟢 Stok Aman (Awet lama)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-400">
              <span className="font-semibold text-stone-300">Pilihan cepat:</span>
              {[
                { name: 'Telur Ayam', quantity: '6 butir', shelf: 'meat' as IngredientShelf, urgency: 'medium' as const, icon: '🥚' },
                { name: 'Dada Ayam Fillet', quantity: '350 gram', shelf: 'meat' as IngredientShelf, urgency: 'urgent' as const, icon: '🍗' },
                { name: 'Tahu & Tempe', quantity: '1 papan', shelf: 'crisper' as IngredientShelf, urgency: 'urgent' as const, icon: '🧈' },
                { name: 'Cabai Rawit Merah', quantity: '100 gram', shelf: 'crisper' as IngredientShelf, urgency: 'medium' as const, icon: '🌶️' },
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickAdd(p)}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-[11px] transition-colors"
                >
                  + {p.name}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow transition-colors ml-auto"
            >
              Simpan ke Kulkas Pintar
            </button>
          </div>
        </form>
      )}

      {/* Main Kulkas Body Showcase */}
      <div className="mt-6">
        {!isOpen ? (
          /* Closed Door Presentation */
          <div className="relative max-w-xl mx-auto py-6">
            <div className="bg-gradient-to-b from-stone-800 to-stone-900 rounded-3xl p-6 border-2 border-stone-700 shadow-2xl relative text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center text-3xl">
                🧊
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Pintu Kulkas Pintar Sedang Tertutup</h4>
                <p className="text-xs text-stone-400 mt-1">
                  Tersimpan <strong className="text-emerald-400 font-mono">{ingredients.length} bahan</strong> di dalam kulkas siap dimasak.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all"
              >
                Buka Pintu Kulkas Pintar →
              </button>
            </div>
          </div>
        ) : (
          /* Open Door Presentation - Shelves of Kulkas Pintar */
          <div className="space-y-6">
            {/* Shelf Filter bar */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-stone-400 mr-1">Tampilkan Rak:</span>
              <button
                type="button"
                onClick={() => setActiveZone('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeZone === 'all'
                    ? 'bg-white text-stone-950 font-bold shadow-sm'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                Semua Rak ({ingredients.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveZone('meat')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeZone === 'meat'
                    ? 'bg-rose-500 text-white font-bold shadow-sm'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                🥩 Rak Daging ({meatItems.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveZone('crisper')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeZone === 'crisper'
                    ? 'bg-emerald-500 text-white font-bold shadow-sm'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                🥦 Laci Sayuran ({crisperItems.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveZone('chiller')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeZone === 'chiller'
                    ? 'bg-amber-500 text-white font-bold shadow-sm'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                🥫 Rak Atas ({chillerItems.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveZone('freezer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeZone === 'freezer'
                    ? 'bg-blue-500 text-white font-bold shadow-sm'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                ❄️ Freezer ({freezerItems.length})
              </button>
            </div>

            {/* Cabinet Visual Display */}
            <div className="bg-stone-950 rounded-3xl p-5 md:p-7 border border-stone-800 space-y-6">
              {/* LED Lighting Bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-60 rounded-full" />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Main Shelves (8 Cols) */}
                <div className="md:col-span-8 space-y-5">
                  {/* SHELF 1: Meat & Protein Zone */}
                  {(activeZone === 'all' || activeZone === 'meat') && (
                    <div className="bg-rose-950/20 rounded-2xl p-4 border border-rose-900/40">
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-rose-300">🥩 Rak Daging & Protein Dingin</span>
                          <span className="text-[10px] text-rose-400 font-mono">Suhu: 1°C</span>
                        </div>
                        <span className="text-stone-400 text-[11px]">{meatItems.length} bahan</span>
                      </div>

                      {meatItems.length === 0 ? (
                        <p className="text-xs text-stone-500 py-3 text-center italic">
                          Belum ada daging di rak ini. Klik "+ Tambah Bahan" di atas.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {meatItems.map((item) => (
                            <div
                              key={item.id}
                              className="p-3 rounded-xl border bg-stone-900/90 border-rose-800/40 flex items-start justify-between gap-2"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl" role="img" aria-label={item.name}>{resolveIngredientIcon(item.name, item.icon)}</span>
                                  <span className="text-xs font-bold text-stone-200">{item.name}</span>
                                </div>
                                <p className="text-[11px] text-stone-400 font-mono">Jumlah: {item.quantity}</p>
                                {getUrgencyBadge(item.urgency)}
                              </div>
                              <button
                                type="button"
                                onClick={() => onRemoveIngredient(item.id)}
                                className="text-stone-500 hover:text-rose-400 p-1 transition-colors"
                                title="Keluarkan dari kulkas"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SHELF 2: Crisper Drawer (Vegetables) */}
                  {(activeZone === 'all' || activeZone === 'crisper') && (
                    <div className="bg-emerald-950/20 rounded-2xl p-4 border border-emerald-900/40">
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-300">🥦 Laci Sayuran & Buah Segar (Crisper)</span>
                          <span className="text-[10px] text-emerald-400 font-mono">Kelembapan 85%</span>
                        </div>
                        <span className="text-stone-400 text-[11px]">{crisperItems.length} bahan</span>
                      </div>

                      {crisperItems.length === 0 ? (
                        <p className="text-xs text-stone-500 py-3 text-center italic">
                          Belum ada sayuran di laci ini.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {crisperItems.map((item) => (
                            <div
                              key={item.id}
                              className="p-3 rounded-xl border bg-stone-900/90 border-stone-800 flex items-start justify-between gap-2"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl" role="img" aria-label={item.name}>{resolveIngredientIcon(item.name, item.icon)}</span>
                                  <span className="text-xs font-bold text-stone-200">{item.name}</span>
                                </div>
                                <p className="text-[11px] text-stone-400 font-mono">Jumlah: {item.quantity}</p>
                                {getUrgencyBadge(item.urgency)}
                              </div>
                              <button
                                type="button"
                                onClick={() => onRemoveIngredient(item.id)}
                                className="text-stone-500 hover:text-rose-400 p-1 transition-colors"
                                title="Keluarkan dari kulkas"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SHELF 3: Top Chiller (Sauces & Condiments) */}
                  {(activeZone === 'all' || activeZone === 'chiller') && (
                    <div className="bg-amber-950/20 rounded-2xl p-4 border border-amber-900/40">
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-300">🥫 Rak Atas — Saus, Keju & Bumbu Olahan</span>
                          <span className="text-[10px] text-amber-400 font-mono">Suhu: 4°C</span>
                        </div>
                        <span className="text-stone-400 text-[11px]">{chillerItems.length} bahan</span>
                      </div>

                      {chillerItems.length === 0 ? (
                        <p className="text-xs text-stone-500 py-3 text-center italic">
                          Belum ada saus di rak ini.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {chillerItems.map((item) => (
                            <div
                              key={item.id}
                              className="p-3 rounded-xl border bg-stone-900/90 border-stone-800 flex items-start justify-between gap-2"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl" role="img" aria-label={item.name}>{resolveIngredientIcon(item.name, item.icon)}</span>
                                  <span className="text-xs font-bold text-stone-200">{item.name}</span>
                                </div>
                                <p className="text-[11px] text-stone-400 font-mono">Jumlah: {item.quantity}</p>
                                {getUrgencyBadge(item.urgency)}
                              </div>
                              <button
                                type="button"
                                onClick={() => onRemoveIngredient(item.id)}
                                className="text-stone-500 hover:text-rose-400 p-1 transition-colors"
                                title="Keluarkan dari kulkas"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SHELF 4: Freezer */}
                  {(activeZone === 'all' || activeZone === 'freezer') && (
                    <div className="bg-blue-950/20 rounded-2xl p-4 border border-blue-900/40">
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-300">❄️ Freezer Kompartemen Bawah</span>
                          <span className="text-[10px] text-blue-400 font-mono">Suhu: -18°C</span>
                        </div>
                        <span className="text-stone-400 text-[11px]">{freezerItems.length} bahan</span>
                      </div>

                      {freezerItems.length === 0 ? (
                        <p className="text-xs text-stone-500 py-3 text-center italic">
                          Freezer kosong.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {freezerItems.map((item) => (
                            <div
                              key={item.id}
                              className="p-3 rounded-xl border bg-stone-900/90 border-stone-800 flex items-start justify-between gap-2"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl" role="img" aria-label={item.name}>{resolveIngredientIcon(item.name, item.icon)}</span>
                                  <span className="text-xs font-bold text-stone-200">{item.name}</span>
                                </div>
                                <p className="text-[11px] text-stone-400 font-mono">Jumlah: {item.quantity}</p>
                                {getUrgencyBadge(item.urgency)}
                              </div>
                              <button
                                type="button"
                                onClick={() => onRemoveIngredient(item.id)}
                                className="text-stone-500 hover:text-rose-400 p-1 transition-colors"
                                title="Keluarkan dari kulkas"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Side: Door Racks & Primary Search Trigger (4 Cols) */}
                <div className="md:col-span-4 space-y-4">
                  {/* Door Racks */}
                  <div className="bg-stone-900/80 rounded-2xl p-4 border border-stone-800">
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="font-bold text-stone-300">🚪 Rak Pintu Samping (Pasta & Kering)</span>
                      <span className="text-stone-500 text-[11px]">{doorItems.length} bahan</span>
                    </div>

                    <div className="space-y-2">
                      {doorItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-xl border bg-stone-950 border-stone-800/80 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl" role="img" aria-label={item.name}>{resolveIngredientIcon(item.name, item.icon)}</span>
                            <div>
                              <p className="font-semibold text-stone-200">{item.name}</p>
                              <p className="text-[10px] text-stone-400 font-mono">{item.quantity}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveIngredient(item.id)}
                            className="text-stone-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Primary Call to Action Box: Cari Resep dari Kulkas Pintar */}
                  <div className="bg-gradient-to-br from-emerald-950/70 to-stone-900 rounded-2xl p-5 border border-emerald-800/50 space-y-4">
                    <div>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                        Pencari Resep Cerdas
                      </span>
                      <h5 className="text-base font-bold text-white mt-1">
                        Cari Resep dari Kulkas Pintar
                      </h5>
                      <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">
                        Sistem akan menganalisis <strong>{ingredients.length} bahan</strong> di atas dan merekomendasikan hidangan lezat yang menghabiskan bahan berisiko kedaluwarsa lebih dulu.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={onSearchRecipes}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                      <span>Cari Resep dari Isi Kulkas ({ingredients.length} Bahan)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
