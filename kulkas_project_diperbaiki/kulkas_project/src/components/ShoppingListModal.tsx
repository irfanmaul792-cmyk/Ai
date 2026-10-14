import React, { useState } from 'react';
import { ShoppingItem } from '../types';
import { X, ShoppingBag, Plus, Trash2, CheckCircle2, Circle, Share2, Copy, Check } from 'lucide-react';
import { resolveIngredientIcon } from '../utils/ingredientVisuals';

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingItem[];
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (name: string, amount: string) => void;
  onClearBought: () => void;
  onClearAll: () => void;
}

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({
  isOpen,
  onClose,
  items,
  onToggleItem,
  onDeleteItem,
  onAddItem,
  onClearBought,
  onClearAll,
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const unboughtCount = items.filter(i => !i.isBought).length;
  const boughtCount = items.filter(i => i.isBought).length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim(), newItemAmount.trim() || '1 buah/ikat');
    setNewItemName('');
    setNewItemAmount('');
  };

  const generateShareText = () => {
    const unbought = items.filter(i => !i.isBought);
    const bought = items.filter(i => i.isBought);

    let text = `🛒 *DAFTAR BELANJA BAHAN MASAKAN*\n`;
    text += `_Disusun dari aplikasi Isi Kulkasku_\n\n`;

    if (unbought.length > 0) {
      text += `*Perlu Dibeli (${unbought.length} item):*\n`;
      unbought.forEach((item, idx) => {
        text += `${idx + 1}. [ ] ${item.name} (${item.amount})${item.recipeTitle ? ` - untuk ${item.recipeTitle}` : ''}\n`;
      });
      text += '\n';
    }

    if (bought.length > 0) {
      text += `*Sudah Dibeli (${bought.length} item):*\n`;
      bought.forEach((item, idx) => {
        text += `${idx + 1}. [v] ${item.name} (${item.amount})\n`;
      });
    }

    return text;
  };

  const handleCopyText = () => {
    const text = generateShareText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = generateShareText();
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-stone-100 flex items-center justify-between bg-emerald-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-display text-stone-900">
                  Daftar Belanja Bahan
                </h3>
                {unboughtCount > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-white">
                    {unboughtCount} Kurang
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Bahan yang belum tersedia di kulkas untuk resep pilihanmu
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup daftar belanja"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Tambah Manual */}
        <form onSubmit={handleAddSubmit} className="p-4 bg-stone-50 border-b border-stone-100 flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Nama bahan (misal: Saus Tiram, Bawang Bombay)"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-stone-900 placeholder:text-stone-400"
            />
          </div>
          <div className="w-24">
            <input
              type="text"
              placeholder="Jml (1 btl)"
              value={newItemAmount}
              onChange={(e) => setNewItemAmount(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-stone-900 placeholder:text-stone-400 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah</span>
          </button>
        </form>

        {/* List of Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[48vh]">
          {items.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-800">Daftar Belanja Masih Kosong</p>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Klik tombol <strong>"+ Bahan Belanja"</strong> pada kartu resep, atau ketik nama bahan di atas untuk mencatatnya.
                </p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  item.isBought
                    ? 'bg-stone-50/70 border-stone-200 text-stone-400'
                    : 'bg-white border-stone-200/90 hover:border-emerald-300 text-stone-800 shadow-xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onToggleItem(item.id)}
                  className="flex items-center gap-3 text-left flex-1 min-w-0 cursor-pointer"
                >
                  <span className="shrink-0 text-stone-500">
                    {item.isBought ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-300" />
                    )}
                  </span>
                  <span className="text-lg shrink-0" role="img" aria-label={item.name}>
                    {resolveIngredientIcon(item.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs sm:text-sm font-semibold truncate ${item.isBought ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-stone-500">
                      <span className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
                        {item.amount}
                      </span>
                      {item.recipeTitle && (
                        <span className="truncate italic text-stone-400 max-w-[160px]">
                          untuk {item.recipeTitle}
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteItem(item.id)}
                  className="w-8 h-8 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
                  title="Hapus dari daftar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-4 bg-stone-50 border-t border-stone-200/80 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  title="Kirim ke WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Kirim WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyText}
                  className="px-3 py-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Salin teks daftar belanja"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                {boughtCount > 0 && (
                  <button
                    type="button"
                    onClick={onClearBought}
                    className="text-[11px] font-medium text-stone-600 hover:text-stone-900 px-2 py-1.5 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
                  >
                    Hapus yang Sudah Dibeli
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-[11px] font-medium text-rose-600 hover:text-rose-800 px-2 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  Kosongkan Semua
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
