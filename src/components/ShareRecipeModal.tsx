import React, { useState } from 'react';
import { Recipe } from '../types';
import { X, Share2, Copy, Check, Printer, Clock, ChefHat, Sparkles } from 'lucide-react';

interface ShareRecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareRecipeModal: React.FC<ShareRecipeModalProps> = ({
  recipe,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !recipe) return null;

  const formatRecipeText = () => {
    let text = `🍳 *${recipe.title}*\n`;
    text += `_${recipe.description}_\n\n`;
    text += `⏱ Waktu: ${recipe.totalTimeMinutes} Menit | Porsi: ${recipe.servings} | Kalori: ${recipe.calories} kkal\n`;
    text += `💰 Estimasi: ${recipe.estimatedCost} | Tingkat: ${recipe.difficulty}\n\n`;

    text += `🛒 *BAHAN-BAHAN:*\n`;
    recipe.ingredients.forEach((ing, i) => {
      text += `${i + 1}. ${ing.name} (${ing.amount})\n`;
    });
    text += '\n';

    text += `👨‍🍳 *LANGKAH MEMASAK:*\n`;
    recipe.steps.forEach((step) => {
      text += `Langkah ${step.step} (${step.durationMinutes ? `${step.durationMinutes} menit` : ''}):\n`;
      text += `${step.instruction}\n`;
      if (step.tip) {
        text += `💡 Tips: ${step.tip}\n`;
      }
      text += '\n';
    });

    if (recipe.chefTip) {
      text += `✨ *Rahasia Koki:*\n${recipe.chefTip}\n\n`;
    }

    text += `_Dibuat dengan aplikasi Isi Kulkasku_ 🍽️`;
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatRecipeText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = formatRecipeText();
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-sm">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-stone-900">
                Bagikan Resep Masakan
              </h3>
              <p className="text-xs text-stone-500 mt-0.5 truncate max-w-xs">
                {recipe.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup modal bagikan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview Ringkasan */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 max-h-[55vh]">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                Resep Siap Masak
              </span>
              <span className="text-xs font-medium text-stone-500">
                {recipe.totalTimeMinutes} Menit · {recipe.servings} Porsi
              </span>
            </div>
            <h4 className="text-base font-bold text-stone-900">{recipe.title}</h4>
            <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">{recipe.description}</p>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-bold text-stone-700">Teks yang akan dibagikan:</p>
            <div className="p-3.5 rounded-xl bg-stone-100/90 border border-stone-200 font-mono text-[11px] text-stone-700 max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
              {formatRecipeText()}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 bg-stone-50 border-t border-stone-100 space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Kirim via WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Teks Resep'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="w-full py-2 px-3 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Resep / Simpan PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
