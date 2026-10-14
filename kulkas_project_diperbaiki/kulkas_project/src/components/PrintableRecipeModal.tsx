import React from 'react';
import { Recipe } from '../types';
import { scaleAmount } from '../utils/recipeScaler';
import { resolveRecipeImageUrl } from '../utils/recipeImageResolver';
import { Printer, X, Clock, Sparkles, Camera } from 'lucide-react';

interface PrintableRecipeModalProps {
  recipe: Recipe | null;
  servingMultiplier: number;
  onClose: () => void;
}

export const PrintableRecipeModal: React.FC<PrintableRecipeModalProps> = ({
  recipe,
  servingMultiplier,
  onClose,
}) => {
  if (!recipe) return null;

  const currentServings = Math.round(recipe.servings * servingMultiplier);
  const photoUrl = recipe.imageUrl || resolveRecipeImageUrl(recipe);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1816]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-[#FAF8F5] text-[#262220] rounded-3xl w-full max-w-2xl shadow-2xl border border-[#EBE6DF] overflow-hidden my-auto flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Modal Controls (Hidden in Print) */}
        <div className="p-4 sm:p-5 border-b border-[#EBE6DF] flex items-center justify-between bg-white print:hidden shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#736B66]">
            <Printer className="w-4 h-4 text-[#C2593F]" />
            <span>Kartu Resep Dapur Siap Cetak</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-[#262220] hover:bg-[#C2593F] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F0EDE8] hover:bg-[#E5E0D8] text-[#59524C] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Parchment Sheet */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 print:p-8 bg-[#FAF8F5] print:bg-white">
          {/* Header */}
          <div className="text-center space-y-2 border-b border-[#E8E2D9] pb-6">
            <span className="text-[11px] uppercase tracking-widest text-[#8C827A] font-semibold block font-sans">
              Isi Kulkasku · Dapur Praktis & Lezat
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-editorial text-[#262220]">
              {recipe.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#59524C] max-w-lg mx-auto leading-relaxed">
              {recipe.description}
            </p>

            {/* Metadata Strip */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#736B66] pt-3 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#C2593F]" />
                <span>{recipe.totalTimeMinutes} Menit</span>
              </span>
              <span>·</span>
              <span>{recipe.prepTimeMinutes}m Persiapan</span>
              <span>·</span>
              <span>{recipe.cookTimeMinutes}m Memasak</span>
              <span>·</span>
              <span className="font-semibold text-[#262220]">{currentServings} Porsi</span>
              <span>·</span>
              <span>{recipe.difficulty}</span>
            </div>
          </div>

          {/* Recipe Visual Hero Banner (Food Photography) */}
          {photoUrl && (
            <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden border border-[#E5DFD5] shadow-xs">
              <img
                src={photoUrl}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-sans font-medium flex items-center gap-1.5 shadow-sm">
                <Camera className="w-3.5 h-3.5 text-amber-200" />
                <span>Sajian Siap Nikmati</span>
              </div>
            </div>
          )}

          {/* Recipe Story */}
          {recipe.story && (
            <div className="p-4 rounded-2xl bg-[#F5F1EB] border border-[#E5DFD5] text-xs text-[#4A433D] font-serif-editorial italic leading-relaxed text-center">
              "{recipe.story}"
            </div>
          )}

          {/* Ingredients Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-1.5">
              <h2 className="text-base font-bold font-serif-editorial text-[#262220]">
                Bahan-Bahan ({currentServings} Porsi):
              </h2>
              {servingMultiplier !== 1 && (
                <span className="text-[11px] font-mono text-[#C2593F] font-semibold">
                  (Disesuaikan {servingMultiplier}x)
                </span>
              )}
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-start gap-2 py-1 border-b border-dashed border-[#EFECE6]">
                  <span className="text-[#C2593F] font-bold">□</span>
                  <div>
                    <span className="font-semibold text-[#262220]">{ing.name}</span>
                    <span className="text-[#736B66] ml-1.5 font-mono">
                      — {scaleAmount(ing.amount, servingMultiplier)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Steps Section */}
          <div className="space-y-4 pt-2">
            <h2 className="text-base font-bold font-serif-editorial text-[#262220] border-b border-[#E8E2D9] pb-1.5">
              Langkah Memasak:
            </h2>
            <ol className="space-y-3.5 text-xs sm:text-sm">
              {recipe.steps.map((st) => (
                <li key={st.step} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#EFECE6] text-[#262220] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 font-mono">
                    {st.step}
                  </span>
                  <div className="space-y-1">
                    <p className="text-[#262220] leading-relaxed">
                      {st.instruction}
                    </p>
                    {st.tip && (
                      <p className="text-xs text-[#5D7052] italic font-serif-editorial">
                        💡 Tips: {st.tip}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Chef Tip Footnote */}
          {recipe.chefTip && (
            <div className="p-4 rounded-2xl bg-[#F2F6F0] border border-[#DCE5D8] text-xs text-[#3E4D37] flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#5D7052] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#2F4426]">Rahasia Koki:</strong>
                <span className="leading-relaxed">{recipe.chefTip}</span>
              </div>
            </div>
          )}

          {/* Print Footer note */}
          <div className="pt-4 border-t border-[#E8E2D9] text-center text-[10px] text-[#8C827A]">
            Dicetak dari <strong>Isi Kulkasku</strong> · Resep Praktis Nol Limbah Dapur
          </div>
        </div>
      </div>
    </div>
  );
};
