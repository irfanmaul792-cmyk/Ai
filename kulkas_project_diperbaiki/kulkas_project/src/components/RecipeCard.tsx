import React, { useState } from 'react';
import { Recipe } from '../types';
import { scaleAmount } from '../utils/recipeScaler';
import { resolveRecipeImageUrl } from '../utils/recipeImageResolver';
import { getSubstitutionsForIngredients, Substitution } from '../utils/ingredientSubstitutions';
import {
  ChefHat,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Bookmark,
  Share2,
  ShoppingBag,
  Printer,
  Users,
  Camera,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Flame,
  Calendar
} from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onCookClick: (recipe: Recipe) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (recipe: Recipe) => void;
  onShareClick?: (recipe: Recipe) => void;
  onAddMissingToShoppingList?: (recipe: Recipe) => void;
  onPrintClick?: (recipe: Recipe, servingMultiplier: number) => void;
  onAddToMealPlan?: (recipe: Recipe) => void;
  viewMode?: 'grid' | 'list';
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onCookClick,
  isFavorite = false,
  onToggleFavorite,
  onShareClick,
  onAddMissingToShoppingList,
  onPrintClick,
  onAddToMealPlan,
  viewMode = 'grid',
}) => {
  const [servingMultiplier, setServingMultiplier] = useState<number>(1);
  const [preppedIngredients, setPreppedIngredients] = useState<Record<string, boolean>>({});
  const [imageError, setImageError] = useState<boolean>(false);
  const [showSubstitutions, setShowSubstitutions] = useState<boolean>(false);

  const togglePrepIngredient = (name: string) => {
    setPreppedIngredients(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const currentServings = Math.round(recipe.servings * servingMultiplier);
  const ownedIngredientsCount = recipe.ingredients.filter(i => i.isOwned).length;
  const unownedIngredients = recipe.ingredients.filter(i => !i.isOwned);

  // Approximate macro calculation per serving (Ide A)
  const estCalories = Math.round(recipe.calories);
  const estProtein = Math.round(recipe.calories * 0.04);
  const estCarbs = Math.round(recipe.calories * 0.11);
  const estFat = Math.round(recipe.calories * 0.025);

  // Relevant substitutions for this recipe (Ide C)
  const substitutions: Substitution[] = React.useMemo(() => {
    return getSubstitutionsForIngredients(recipe.ingredients);
  }, [recipe.ingredients]);

  // Minimalist hallmark indicators
  const isTenOrLess = recipe.ingredients.length <= 10;
  const isThirtyOrLess = recipe.totalTimeMinutes <= 30;
  const isOnePot =
    recipe.theme === 'stirfry' ||
    recipe.theme === 'soup' ||
    recipe.theme === 'stew' ||
    recipe.title.toLowerCase().includes('tumis') ||
    recipe.title.toLowerCase().includes('oseng') ||
    recipe.title.toLowerCase().includes('sup') ||
    recipe.title.toLowerCase().includes('nasi goreng');

  // Resolved food photography URL
  const photoUrl = recipe.imageUrl || resolveRecipeImageUrl(recipe);
  const hasValidPhoto = Boolean(photoUrl && !imageError);

  // Culinary visual illustration theme fallback
  const getIllustrationTheme = () => {
    const t = (recipe.theme || '').toLowerCase();
    const title = recipe.title.toLowerCase();

    if (t === 'pasta' || title.includes('spaghetti') || title.includes('pasta')) {
      return {
        bg: 'from-[#FDFBF7] to-[#F7EFE8]',
        accent: '#C2593F',
        pattern: 'italian-stripes',
        label: 'Pasta & Saus',
        icon: '🍝'
      };
    }
    if (t === 'stirfry' || title.includes('oseng') || title.includes('tumis')) {
      return {
        bg: 'from-[#FAF6F0] to-[#EFE7DC]',
        accent: '#D9943B',
        pattern: 'wok-steam',
        label: 'Tumisan Kilat Wajan',
        icon: '🍳'
      };
    }
    if (t === 'soup' || title.includes('sup') || title.includes('kuah') || title.includes('soto')) {
      return {
        bg: 'from-[#F4F7F2] to-[#E3EBE0]',
        accent: '#5D7052',
        pattern: 'broth-steam',
        label: 'Kuah Bening Segar',
        icon: '🍲'
      };
    }
    if (t === 'rice' || title.includes('nasi goreng')) {
      return {
        bg: 'from-[#FAF4EB] to-[#F2E5D0]',
        accent: '#B07B37',
        pattern: 'rice-grains',
        label: 'Olahan Nasi Wajan',
        icon: '🍚'
      };
    }
    return {
      bg: 'from-[#F9F7F4] to-[#ECE5DB]',
      accent: '#C2593F',
      pattern: 'artisan-dots',
      label: 'Dapur Kreasi Cepat',
      icon: '🥘'
    };
  };

  const visual = getIllustrationTheme();

  // LIST VIEW LAYOUT (Ide D)
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-3xl border border-[#EBE6DF] hover:border-[#D9D2C7] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col md:flex-row items-stretch group">
        {/* Left Photo Thumbnail */}
        <div className="relative md:w-72 lg:w-80 h-48 md:h-auto shrink-0 overflow-hidden bg-[#241F1D]">
          {hasValidPhoto ? (
            <img
              src={photoUrl}
              alt={recipe.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          ) : (
            <div className={`w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br ${visual.bg}`}>
              <span className="text-4xl mb-2">{visual.icon}</span>
              <span className="text-xs font-bold text-[#736B66] tracking-wider uppercase">{visual.label}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Badges on List Photo */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-[#262220] shadow-sm backdrop-blur-xs flex items-center gap-1">
              <span className="text-[#C2593F]">★</span>
              <span>{recipe.matchPercentage}% Cocok</span>
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium">
            <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-lg backdrop-blur-xs">
              <Clock className="w-3 h-3 text-[#DDB288]" />
              <span>{recipe.totalTimeMinutes} Menit</span>
            </span>
            <span className="text-[#DDB288] bg-black/60 px-2 py-0.5 rounded-lg backdrop-blur-xs font-mono">
              {recipe.estimatedCost}
            </span>
          </div>
        </div>

        {/* Middle Content Section */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C2593F] font-sans">
                  {visual.label}
                </span>
                <span className="text-[#C5BEB7]">·</span>
                {/* Hallmarks */}
                {isTenOrLess && (
                  <span className="text-[10px] font-bold text-[#3B4A34] bg-[#EAF2E6] px-2 py-0.5 rounded-md border border-[#CCDDC5]">
                    ★ ≤ 10 Bahan
                  </span>
                )}
                {isThirtyOrLess && (
                  <span className="text-[10px] font-bold text-[#8C3A27] bg-[#F9ECE7] px-2 py-0.5 rounded-md border border-[#EDD1C6]">
                    ★ ≤ 30 Menit
                  </span>
                )}
                {isOnePot && (
                  <span className="text-[10px] font-bold text-[#7A5722] bg-[#FBF3E6] px-2 py-0.5 rounded-md border border-[#EEDDBF]">
                    ★ 1 Wajan
                  </span>
                )}
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-1">
                {onPrintClick && (
                  <button
                    type="button"
                    onClick={() => onPrintClick(recipe, servingMultiplier)}
                    className="p-1.5 rounded-lg text-[#736B66] hover:text-[#262220] hover:bg-[#F0EDE8] transition-colors"
                    title="Cetak Resep ala Cookbook"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                )}
                {onShareClick && (
                  <button
                    type="button"
                    onClick={() => onShareClick(recipe)}
                    className="p-1.5 rounded-lg text-[#736B66] hover:text-[#262220] hover:bg-[#F0EDE8] transition-colors"
                    title="Bagikan Resep"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                )}
                {onToggleFavorite && (
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(recipe)}
                    className="p-1.5 rounded-lg text-[#736B66] hover:text-[#C2593F] hover:bg-[#F9ECE7] transition-colors"
                    title={isFavorite ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
                  >
                    <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-[#C2593F] text-[#C2593F]' : ''}`} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <h3
                onClick={() => onCookClick(recipe)}
                className="text-lg sm:text-xl font-bold font-serif-editorial text-[#262220] hover:text-[#C2593F] transition-colors cursor-pointer leading-snug"
              >
                {recipe.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#59524C] mt-1 line-clamp-2 leading-relaxed">
                {recipe.description}
              </p>
            </div>

            {/* Nutrition & Macro Micro-Breakdown (Ide A) */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
              <span className="bg-[#FAF8F5] text-[#262220] px-2.5 py-1 rounded-lg border border-[#EDE8E1] font-semibold flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#C2593F]" />
                <span>{estCalories} kkal</span>
              </span>
              <span className="bg-[#FAF8F5] text-[#5D7052] px-2 py-1 rounded-lg border border-[#EDE8E1] font-semibold">
                🥩 {estProtein}g Prot
              </span>
              <span className="bg-[#FAF8F5] text-[#D9943B] px-2 py-1 rounded-lg border border-[#EDE8E1] font-semibold">
                🌾 {estCarbs}g Karbo
              </span>
              <span className="bg-[#FAF8F5] text-[#8C5A41] px-2 py-1 rounded-lg border border-[#EDE8E1] font-semibold">
                🧈 {estFat}g Lemak
              </span>
              <span className="text-[10px] text-[#736B66] font-sans font-medium">
                ({ownedIngredientsCount} dari {recipe.ingredients.length} bahan tersedia)
              </span>
            </div>

            {/* Substitusi Bahan Toggle (Ide C) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowSubstitutions(!showSubstitutions)}
                className="text-[11px] font-semibold text-[#8C3A27] hover:text-[#C2593F] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5 text-[#D9943B]" />
                <span>💡 {showSubstitutions ? 'Sembunyikan Substitusi Bumbu' : 'Ide Pengganti Bumbu & Bahan (Substitusi Pintar)'}</span>
                {showSubstitutions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showSubstitutions && (
                <div className="mt-2 p-3 bg-[#FFFDF9] rounded-xl border border-[#F0E6D8] text-xs space-y-2 animate-fade-in">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C3A27] block">
                    Alternatif jika bahan di kulkas belum lengkap:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {substitutions.map((sub, sIdx) => (
                      <div key={sIdx} className="bg-white p-2 rounded-lg border border-[#EDE4D6]">
                        <span className="font-bold text-[#262220] block">{sub.original}</span>
                        <span className="text-[#5D7052] font-medium block mt-0.5">↳ Ganti: {sub.alternative}</span>
                        <span className="text-[10px] text-[#736B66] block mt-0.5 italic">{sub.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer of List View */}
          <div className="pt-3 border-t border-[#F0EDE8] flex flex-wrap items-center justify-between gap-3">
            {/* Portion Adjuster */}
            <div className="flex items-center gap-1.5 text-xs text-[#59524C]">
              <span className="text-[11px] text-[#8C827A] flex items-center gap-1">
                <Users className="w-3 h-3 text-[#C2593F]" />
                <span>Porsi:</span>
              </span>
              {[1, 1.5, 2].map((mult) => (
                <button
                  key={mult}
                  type="button"
                  onClick={() => setServingMultiplier(mult)}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer text-xs ${
                    servingMultiplier === mult
                      ? 'bg-[#262220] text-white font-bold shadow-xs'
                      : 'hover:bg-[#F0EDE8] text-[#736B66]'
                  }`}
                >
                  {mult === 1 ? '1x' : mult === 1.5 ? '1.5x' : '2x'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {unownedIngredients.length > 0 && onAddMissingToShoppingList && (
                <button
                  type="button"
                  onClick={() => onAddMissingToShoppingList(recipe)}
                  className="px-3 py-2 rounded-xl border border-[#E0D7CC] hover:bg-[#F7F4EE] text-[#59524C] text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#C2593F]" />
                  <span>+ Belanja ({unownedIngredients.length})</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onCookClick(recipe)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#262220] hover:bg-[#C2593F] text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>Mulai Masak</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT EDITORIAL GRID CARD LAYOUT
  return (
    <div className="bg-white rounded-3xl border border-[#EBE6DF] hover:border-[#D9D2C7] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      {/* Top Visual Header: Real Food Photo with Modern Subtle Scrim Overlay */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden flex flex-col justify-between p-4 sm:p-5 transition-transform bg-[#241F1D]">
        {/* Real Food Photo Background */}
        {hasValidPhoto ? (
          <img
            src={photoUrl}
            alt={recipe.title}
            onError={() => setImageError(true)}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${visual.bg}`}>
            {/* SVG Culinary Art Illustration Fallback */}
            <svg
              className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
              viewBox="0 0 400 240"
              preserveAspectRatio="xMidYMid slice"
            >
              <ellipse cx="200" cy="140" rx="90" ry="40" fill="#FFFFFF" opacity="0.75" />
              <ellipse cx="200" cy="138" rx="80" ry="34" fill="#FAF6F0" />
              <ellipse cx="200" cy="136" rx="72" ry="28" fill={visual.accent} opacity="0.3" />
              <circle cx="200" cy="132" r="30" fill={visual.accent} opacity="0.8" />
              <path d="M190,95 Q195,80 200,65 Q205,50 200,35" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
              <path d="M205,98 Q212,82 208,68 Q202,52 208,40" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
            </svg>
          </div>
        )}

        {/* Cinematic Vignette Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/30 pointer-events-none" />

        {/* Top Badges & Action Buttons */}
        <div className="relative z-10 flex items-start justify-between gap-2">
          {/* Match Score Badge */}
          <div className="flex flex-col gap-1.5">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-[#262220] shadow-sm backdrop-blur-xs flex items-center gap-1.5">
              <span className="text-[#C2593F]">★</span>
              <span>{recipe.matchPercentage}% Bahan Tersedia</span>
            </span>
            {recipe.isAiGenerated && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FAF8F5]/90 text-[#8C3A27] backdrop-blur-xs shadow-xs flex items-center gap-1 w-max border border-[#EDD1C6]">
                <Sparkles className="w-3 h-3 text-[#C2593F]" />
                <span>Kreasi Chef Pintar</span>
              </span>
            )}
          </div>

          {/* Quick Actions (Print, Favorite, Share) */}
          <div className="flex items-center gap-1 bg-black/45 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-xs">
            {onPrintClick && (
              <button
                type="button"
                onClick={() => onPrintClick(recipe, servingMultiplier)}
                className="p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                title="Cetak Resep ala Cookbook Minimalis"
                aria-label="Cetak Resep"
              >
                <Printer className="w-4 h-4" />
              </button>
            )}
            {onShareClick && (
              <button
                type="button"
                onClick={() => onShareClick(recipe)}
                className="p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                title="Bagikan Resep"
                aria-label="Bagikan Resep"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
            {onToggleFavorite && (
              <button
                type="button"
                onClick={() => onToggleFavorite(recipe)}
                className="p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                title={isFavorite ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
                aria-label="Simpan Favorit"
              >
                <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-[#C2593F] text-[#C2593F]' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Bottom of Visual Header: Cuisine Type, Camera Badge, and Minimalist Hallmarks */}
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl drop-shadow-xs">{visual.icon}</span>
              <span
                className={`text-xs font-bold tracking-wider uppercase font-sans ${
                  hasValidPhoto ? 'text-amber-100 drop-shadow-sm' : 'text-[#736B66]'
                }`}
              >
                {visual.label}
              </span>
            </div>
            {hasValidPhoto && (
              <span className="text-[10px] font-medium text-white/90 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 flex items-center gap-1 shadow-xs">
                <Camera className="w-3 h-3 text-[#DDB288]" />
                <span>Foto Sajian</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {isTenOrLess && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
                  hasValidPhoto
                    ? 'text-white bg-black/60 backdrop-blur-md border border-white/20'
                    : 'text-[#3B4A34] bg-[#EAF2E6] border border-[#CCDDC5]'
                }`}
              >
                ★ ≤ 10 Bahan
              </span>
            )}
            {isThirtyOrLess && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
                  hasValidPhoto
                    ? 'text-white bg-black/60 backdrop-blur-md border border-white/20'
                    : 'text-[#8C3A27] bg-[#F9ECE7] border border-[#EDD1C6]'
                }`}
              >
                ★ ≤ 30 Menit
              </span>
            )}
            {isOnePot && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
                  hasValidPhoto
                    ? 'text-white bg-black/60 backdrop-blur-md border border-white/20'
                    : 'text-[#7A5722] bg-[#FBF3E6] border border-[#EEDDBF]'
                }`}
              >
                ★ 1 Wajan / Panci
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-6 md:p-7 space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Title & Short Description */}
          <div>
            <h3
              onClick={() => onCookClick(recipe)}
              className="text-xl sm:text-2xl font-bold font-serif-editorial text-[#262220] group-hover:text-[#C2593F] transition-colors leading-snug cursor-pointer"
            >
              {recipe.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#59524C] mt-2 leading-relaxed">
              {recipe.description}
            </p>
          </div>

          {/* Minimalist Metadata Strip & Portion Scaler */}
          <div className="space-y-3 py-2 border-y border-[#F0EDE8]">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#736B66]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 font-semibold text-[#262220]">
                  <Clock className="w-3.5 h-3.5 text-[#C2593F]" />
                  <span>{recipe.totalTimeMinutes} Menit</span>
                </span>
                <span aria-hidden="true" className="text-[#C5BEB7]">·</span>
                <span className="font-medium text-[#262220]">{recipe.ingredients.length} Bahan</span>
                <span aria-hidden="true" className="text-[#C5BEB7]">·</span>
                <span className="font-medium text-[#3D3733]">{recipe.estimatedCost}</span>
              </div>

              {/* Portion Multiplier Buttons */}
              <div className="flex items-center gap-1 bg-[#FAF6F0] p-0.5 rounded-xl border border-[#EBE3D7] text-[11px] font-semibold text-[#59524C]">
                <span className="text-[10px] text-[#8C827A] px-1.5 flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#C2593F]" />
                  <span>Porsi:</span>
                </span>
                {[1, 1.5, 2].map((mult) => (
                  <button
                    key={mult}
                    type="button"
                    onClick={() => setServingMultiplier(mult)}
                    className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer text-xs ${
                      servingMultiplier === mult
                        ? 'bg-white text-[#C2593F] font-bold shadow-xs border border-[#E3D9CC]'
                        : 'hover:text-[#262220] text-[#736B66]'
                    }`}
                    title={`Ubah takaran untuk ${Math.round(recipe.servings * mult)} porsi`}
                  >
                    {mult === 1 ? '1x' : mult === 1.5 ? '1.5x' : '2x'} ({Math.round(recipe.servings * mult)}p)
                  </button>
                ))}
              </div>
            </div>

            {/* Nutrition & Macro Micro-Breakdown (Ide A) */}
            <div className="grid grid-cols-4 gap-1.5 pt-1 text-center font-mono">
              <div className="bg-[#FAF8F5] rounded-xl p-1.5 border border-[#EDE8E1] hover:border-[#DDB288] transition-colors">
                <span className="block text-[9px] uppercase tracking-wider text-[#8C827A] font-sans font-semibold">Kalori</span>
                <span className="text-[11px] font-bold text-[#262220]">{estCalories} <span className="text-[9px] font-normal">kkal</span></span>
              </div>
              <div className="bg-[#FAF8F5] rounded-xl p-1.5 border border-[#EDE8E1] hover:border-[#8CAD7E] transition-colors">
                <span className="block text-[9px] uppercase tracking-wider text-[#8C827A] font-sans font-semibold">Protein</span>
                <span className="text-[11px] font-bold text-[#5D7052]">{estProtein}g</span>
              </div>
              <div className="bg-[#FAF8F5] rounded-xl p-1.5 border border-[#EDE8E1] hover:border-[#E2BA7D] transition-colors">
                <span className="block text-[9px] uppercase tracking-wider text-[#8C827A] font-sans font-semibold">Karbo</span>
                <span className="text-[11px] font-bold text-[#D9943B]">{estCarbs}g</span>
              </div>
              <div className="bg-[#FAF8F5] rounded-xl p-1.5 border border-[#EDE8E1] hover:border-[#C4886E] transition-colors">
                <span className="block text-[9px] uppercase tracking-wider text-[#8C827A] font-sans font-semibold">Lemak</span>
                <span className="text-[11px] font-bold text-[#8C5A41]">{estFat}g</span>
              </div>
            </div>
          </div>

          {/* Urgency Highlight banner if any */}
          {recipe.urgencyMessage && (
            <div className="bg-[#FFF5F2] border border-[#FAD7CC] rounded-xl p-3 flex items-start gap-2 text-xs text-[#8C3A27]">
              <AlertTriangle className="w-3.5 h-3.5 text-[#C2593F] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Prioritas Bahan: </span>
                <span>{recipe.urgencyMessage}</span>
              </div>
            </div>
          )}

          {/* Story from Chef in Artisanal Cookbook styling */}
          {recipe.story && (
            <div className="bg-[#FAF8F5] border border-[#EAE5DD] rounded-xl p-3 text-xs text-[#4A433D] space-y-1">
              <span className="font-bold text-[#736B66] text-[10px] tracking-wider uppercase block font-sans">
                Filosofi Resep
              </span>
              <p className="font-serif-editorial italic text-[#3D3733] leading-relaxed text-xs sm:text-sm">
                "{recipe.story}"
              </p>
            </div>
          )}

          {/* Chef Tip in Soft Olive Sage Callout */}
          {recipe.chefTip && (
            <div className="bg-[#F4F7F2] border border-[#DCE5D8] rounded-xl p-3 text-xs text-[#3E4D37] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#45573E]">
                <Sparkles className="w-3.5 h-3.5 text-[#5D7052]" />
                <span>Rahasia Koki:</span>
              </div>
              <p className="text-[#45573E] leading-relaxed text-[11px] sm:text-xs">
                {recipe.chefTip}
              </p>
            </div>
          )}

          {/* Smart Substitutions Accordion (Ide C) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowSubstitutions(!showSubstitutions)}
              className="w-full py-2 px-3 rounded-xl bg-[#FAF6F0] hover:bg-[#F2EAE0] border border-[#EBE1D3] text-left text-xs font-semibold text-[#8C3A27] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-[#D9943B]" />
                <span>Substitusi Bahan & Bumbu Pintar ({substitutions.length} Alternatif)</span>
              </span>
              {showSubstitutions ? (
                <ChevronUp className="w-4 h-4 text-[#8C3A27]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#8C3A27]" />
              )}
            </button>

            {showSubstitutions && (
              <div className="mt-2 p-3 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl space-y-2.5 animate-fade-in text-xs">
                <div className="flex items-center justify-between text-[10px] font-bold text-[#8C3A27] uppercase tracking-wider">
                  <span>Alternatif Jika Bahan Kurang:</span>
                  <span className="text-[#736B66] font-normal normal-case">Tanpa perlu ke warung</span>
                </div>
                <div className="space-y-2">
                  {substitutions.map((sub, sIdx) => (
                    <div key={sIdx} className="bg-white p-2.5 rounded-xl border border-[#EDE7DF] space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#262220]">{sub.original}</span>
                        {sub.ratio && (
                          <span className="text-[10px] bg-[#F2F6F0] text-[#3B4A34] px-1.5 py-0.2 rounded font-mono">
                            {sub.ratio}
                          </span>
                        )}
                      </div>
                      <p className="text-[#5D7052] font-semibold text-[11px]">
                        ↳ Alternatif: {sub.alternative}
                      </p>
                      <p className="text-[10px] text-[#736B66] italic leading-tight">
                        {sub.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ingredients Checklist Breakdown with Interactive Prep Mode */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#3D3733]">
              <span className="flex items-center gap-1.5">
                <span>Daftar Bahan ({currentServings} Porsi):</span>
                {servingMultiplier !== 1 && (
                  <span className="text-[10px] text-[#C2593F] font-mono font-normal">
                    (disesuaikan {servingMultiplier}x)
                  </span>
                )}
              </span>
              <span className="text-[#736B66] font-mono text-[11px]">
                {ownedIngredientsCount} dari {recipe.ingredients.length} tersedia
              </span>
            </div>
            <p className="text-[10px] text-[#8C827A] italic">
              Sentuh bahan untuk menandai persiapan dapur Anda
            </p>

            <div className="flex flex-wrap gap-1.5">
              {recipe.ingredients.map((ing, idx) => {
                const isPrepped = !!preppedIngredients[ing.name];
                const scaledQty = scaleAmount(ing.amount, servingMultiplier);

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => togglePrepIngredient(ing.name)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer text-left ${
                      isPrepped
                        ? 'bg-[#EAF2E6] text-[#3B4A34] border border-[#B9D4B1] line-through opacity-75'
                        : ing.isOwned
                        ? 'bg-[#F2F6F0] text-[#2F4426] border border-[#CFDFCA] font-medium hover:border-[#5D7052]'
                        : 'bg-[#F7F6F2] text-[#736B66] border border-[#E5E0D8] hover:border-[#C2593F]/50'
                    }`}
                    title={isPrepped ? 'Bahan sudah disiapkan' : 'Klik untuk menandai bahan sudah siap'}
                  >
                    <CheckCircle2
                      className={`w-3 h-3 ${
                        isPrepped
                          ? 'text-[#3B4A34]'
                          : ing.isOwned
                          ? 'text-[#5D7052]'
                          : 'text-stone-300'
                      }`}
                    />
                    <span className={isPrepped ? 'line-through' : ''}>{ing.name}</span>
                    <span className="text-[10px] text-[#8C827A] font-mono">({scaledQty})</span>
                  </button>
                );
              })}
            </div>

            {/* Quick button to add unowned ingredients to shopping list */}
            {unownedIngredients.length > 0 && onAddMissingToShoppingList && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onAddMissingToShoppingList(recipe)}
                  className="w-full py-2 px-3 rounded-xl border border-dashed border-[#C2593F]/40 hover:border-[#C2593F] bg-[#FAF4F0] hover:bg-[#F5ECE5] text-[#8C3A27] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#C2593F]" />
                  <span>+ Catat {unownedIngredients.length} Bahan ke Daftar Belanja</span>
                </button>
              </div>
            )}
          </div>

          {/* Taste Profile Chips in clean muted tone */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {recipe.tasteProfile.map((taste, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-[#F0EDE8] text-[#59524C] px-2 py-0.5 rounded-md"
              >
                #{taste}
              </span>
            ))}
          </div>
        </div>

        {/* Card Action footer */}
        <div className="pt-4 border-t border-[#F0EDE8] flex items-center justify-between gap-3 mt-4">
          <span className="text-xs text-[#736B66] font-medium flex items-center gap-1">
            <span className="text-[#C2593F]">✓</span>
            <span>Panduan Memasak + Timer</span>
          </span>
          <div className="flex items-center gap-2">
            {onAddToMealPlan && (
              <button
                type="button"
                onClick={() => onAddToMealPlan(recipe)}
                className="p-2.5 rounded-xl border border-[#E5DDD2] hover:bg-[#FAF6F3] text-[#59524C] hover:text-[#C2593F] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Rencanakan menu ini di Jadwal Masak Mingguan"
              >
                <Calendar className="w-4 h-4 text-[#C2593F]" />
                <span className="hidden sm:inline">+ Jadwal</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onCookClick(recipe)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#262220] hover:bg-[#C2593F] text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <ChefHat className="w-4 h-4" />
              <span>Mulai Masak</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
