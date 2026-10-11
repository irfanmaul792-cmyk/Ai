import React from 'react';
import { Recipe } from '../types';
import { ChefHat, CheckCircle2, Clock, AlertTriangle, Sparkles, Bookmark, Share2, ShoppingBag } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onCookClick: (recipe: Recipe) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (recipe: Recipe) => void;
  onShareClick?: (recipe: Recipe) => void;
  onAddMissingToShoppingList?: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onCookClick,
  isFavorite = false,
  onToggleFavorite,
  onShareClick,
  onAddMissingToShoppingList,
}) => {
  const ownedIngredientsCount = recipe.ingredients.filter(i => i.isOwned).length;
  const unownedIngredients = recipe.ingredients.filter(i => !i.isOwned);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-7 border border-stone-200/90 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 space-y-5">
      <div className="space-y-4">
        {/* Top Header Row with Match Score & Category & Action Icons */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
              {recipe.matchPercentage}% Bahan Cocok
            </span>
            {recipe.isAiGenerated && (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Kreasi Chef</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-stone-500 font-mono mr-1">
              {recipe.difficulty}
            </span>

            {/* Opsi 3: Bookmark / Favorite Button */}
            {onToggleFavorite && (
              <button
                type="button"
                onClick={() => onToggleFavorite(recipe)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isFavorite
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'bg-stone-100 text-stone-400 hover:text-stone-700 hover:bg-stone-200'
                }`}
                title={isFavorite ? 'Hapus dari Favorit' : 'Simpan ke Resep Favorit'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-600 text-amber-600' : ''}`} />
              </button>
            )}

            {/* Opsi 4: Share Recipe Button */}
            {onShareClick && (
              <button
                type="button"
                onClick={() => onShareClick(recipe)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-400 hover:text-stone-700 hover:bg-stone-200 flex items-center justify-center transition-colors cursor-pointer"
                title="Bagikan resep ini"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Recipe Title & Description */}
        <div>
          <h3 className="text-xl font-bold font-display text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
            {recipe.title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Unboxed Metadata (Time, Servings, Calories) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 py-1 border-y border-stone-100">
          <span className="flex items-center gap-1 font-medium text-stone-700">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{recipe.totalTimeMinutes} Menit</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>{recipe.servings} Porsi</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono">{recipe.calories} kkal</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-stone-800">{recipe.estimatedCost}</span>
        </div>

        {/* Urgency Highlight banner if any */}
        {recipe.urgencyMessage && (
          <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-3 flex items-start gap-2 text-xs text-rose-900">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Prioritas Bahan: </span>
              <span>{recipe.urgencyMessage}</span>
            </div>
          </div>
        )}

        {/* Story from Chef if available */}
        {recipe.story && (
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-950 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <span>📖</span>
              <span>Cerita Kuliner Chef:</span>
            </div>
            <p className="italic text-stone-700 leading-relaxed text-[11px] sm:text-xs">
              "{recipe.story}"
            </p>
          </div>
        )}

        {/* Chef tip if available */}
        {recipe.chefTip && (
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 text-xs text-emerald-950 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rahasia Koki:</span>
            </div>
            <p className="text-stone-700 leading-relaxed text-[11px] sm:text-xs">
              {recipe.chefTip}
            </p>
          </div>
        )}

        {/* Ingredients Checklist Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
            <span>Bahan yang Digunakan:</span>
            <span className="text-stone-500 font-mono text-[11px]">
              {ownedIngredientsCount} dari {recipe.ingredients.length} tersedia
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {recipe.ingredients.map((ing, idx) => (
              <span
                key={idx}
                className={`text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
                  ing.isOwned
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 font-medium'
                    : 'bg-stone-100 text-stone-500 border border-stone-200'
                }`}
              >
                <CheckCircle2 className={`w-3 h-3 ${ing.isOwned ? 'text-emerald-600' : 'text-stone-400'}`} />
                <span>{ing.name}</span>
                <span className="text-[10px] text-stone-400 font-mono">({ing.amount})</span>
              </span>
            ))}
          </div>

          {/* Opsi 1: Quick button to add unowned ingredients to shopping list */}
          {unownedIngredients.length > 0 && onAddMissingToShoppingList && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => onAddMissingToShoppingList(recipe)}
                className="w-full py-2 px-3 rounded-xl border border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 text-emerald-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                <span>+ Catat {unownedIngredients.length} Bahan Kurang ke Daftar Belanja</span>
              </button>
            </div>
          )}
        </div>

        {/* Taste Profile Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {recipe.tasteProfile.map((taste, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md"
            >
              #{taste}
            </span>
          ))}
        </div>
      </div>

      {/* Card Action footer */}
      <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
        <span className="text-xs text-emerald-800 font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Panduan Lengkap + Timer</span>
        </span>

        <button
          type="button"
          onClick={() => onCookClick(recipe)}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          <ChefHat className="w-4 h-4" />
          <span>Mulai Masak</span>
        </button>
      </div>
    </div>
  );
};
