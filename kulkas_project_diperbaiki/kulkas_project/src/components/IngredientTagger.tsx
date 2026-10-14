import React, { useState } from 'react';
import { Ingredient, IngredientCategory } from '../types';
import { resolveIngredientIcon, resolveIngredientCategory } from '../utils/ingredientVisuals';
import { Plus, X, AlertTriangle, ShieldCheck, Clock, Sparkles } from 'lucide-react';

interface IngredientTaggerProps {
  ingredients: Ingredient[];
  onToggleSelect: (id: string) => void;
  onRemoveIngredient: (id: string) => void;
  onAddIngredient: (ingredient: Omit<Ingredient, 'id'>) => void;
}

export const IngredientTagger: React.FC<IngredientTaggerProps> = ({
  ingredients,
  onToggleSelect,
  onRemoveIngredient,
  onAddIngredient,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState<IngredientCategory>('protein');
  const [urgency, setUrgency] = useState<'urgent' | 'medium' | 'safe'>('medium');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const resolvedIcon = resolveIngredientIcon(name.trim());
    const resolvedCat = resolveIngredientCategory(name.trim(), category);

    onAddIngredient({
      name: name.trim(),
      quantity: quantity.trim() || '1 porsi',
      category: resolvedCat,
      urgency,
      icon: resolvedIcon,
      daysRemaining: urgency === 'urgent' ? 1 : urgency === 'medium' ? 3 : 30,
      selected: true,
    });

    setName('');
    setQuantity('');
    setIsAdding(false);
  };

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case 'urgent':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />;
      case 'medium':
        return <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Title & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold font-display text-stone-900 flex items-center gap-2">
            <span>Bahan yang terdeteksi</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {ingredients.length} item
            </span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Ketuk bahan untuk mengaktifkan/nonaktifkan dalam pencarian resep.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? 'Batal Tambah' : 'Tambah Bahan Manual'}</span>
        </button>
      </div>

      {/* Manual Input Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                Nama Bahan
              </label>
              <input
                type="text"
                placeholder="misal: Telur ayam, Bawang putih"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                Jumlah / Berat
              </label>
              <input
                type="text"
                placeholder="misal: 250 gram, 2 butir"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IngredientCategory)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="protein">Protein & Daging</option>
                <option value="sayur">Sayuran & Buah</option>
                <option value="karbo">Karbohidrat / Pasta</option>
                <option value="bumbu">Bumbu & Saus</option>
                <option value="dairy">Susu & Keju</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                Tingkat Urgensi
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as 'urgent' | 'medium' | 'safe')}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="urgent">⚠️ Segera Gunakan (1-2 hari)</option>
                <option value="medium">🟡 Sedang (3-5 hari)</option>
                <option value="safe">🟢 Stok Aman (Tahan lama)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
            >
              Simpan ke Daftar Bahan
            </button>
          </div>
        </form>
      )}

      {/* Ingredient Tag Pills / Badges (Styled cleanly in green & warm culinary style like in screenshot) */}
      <div className="flex flex-wrap gap-2.5">
        {ingredients.map((item) => {
          const isSelected = item.selected !== false;
          const isUrgent = item.urgency === 'urgent';

          return (
            <div
              key={item.id}
              onClick={() => onToggleSelect(item.id)}
              className={`group flex items-center gap-2 pl-3.5 pr-2 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all border ${
                isSelected
                  ? isUrgent
                    ? 'bg-rose-50/90 border-rose-200 text-rose-950 shadow-sm hover:border-rose-400'
                    : 'bg-emerald-50/90 border-emerald-200 text-emerald-950 shadow-sm hover:border-emerald-400'
                  : 'bg-stone-100 border-stone-200 text-stone-400 line-through opacity-70'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base" role="img" aria-label={item.name}>{resolveIngredientIcon(item.name, item.icon)}</span>
                {getUrgencyIcon(item.urgency)}
                <span className="font-semibold">{item.name}</span>
                <span className="text-[11px] opacity-75 font-mono">({item.quantity})</span>
              </div>

              {isUrgent && isSelected && (
                <span className="text-[10px] font-bold bg-rose-200/80 text-rose-800 px-1.5 py-0.5 rounded">
                  Segera Olah
                </span>
              )}

              {/* Remove single ingredient button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveIngredient(item.id);
                }}
                className="w-5 h-5 rounded-full hover:bg-stone-300/80 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors ml-0.5"
                title="Hapus bahan ini"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Informational Callout */}
      <div className="flex items-center gap-2 text-xs text-stone-500 bg-white/70 p-3 rounded-xl border border-stone-200/80">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Bahan dengan tanda <strong className="text-rose-700">Segera Olah</strong> akan diprioritaskan oleh sistem resep agar Anda tidak membuang sisa makanan (Zero Food Waste).
        </span>
      </div>
    </div>
  );
};
