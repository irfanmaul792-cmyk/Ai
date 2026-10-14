import React, { useState, useMemo } from "react";
import { Recipe, WeeklyMealPlan, PlannedMeal, DayOfWeek, MealSlot, Ingredient } from "../types";
import {
  X,
  Calendar,
  Sparkles,
  ChefHat,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  ShoppingBag,
  Share2,
  Flame,
  Clock,
  Check,
  Search,
  ChevronRight,
  Utensils
} from "lucide-react";
import { resolveRecipeImageUrl } from "../utils/recipeImageResolver";

interface WeeklyMealPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  weeklyPlan: WeeklyMealPlan;
  onUpdateWeeklyPlan: (plan: WeeklyMealPlan) => void;
  availableRecipes: Recipe[];
  fridgeIngredients: Ingredient[];
  onStartCooking: (recipe: Recipe) => void;
  onAddShoppingItems: (items: { name: string; amount: string; category?: any; recipeTitle?: string }[]) => void;
  onOpenShoppingList: () => void;
}

const DAYS_OF_WEEK: { key: DayOfWeek; label: string; short: string }[] = [
  { key: "senin", label: "Senin", short: "Sen" },
  { key: "selasa", label: "Selasa", short: "Sel" },
  { key: "rabu", label: "Rabu", short: "Rab" },
  { key: "kamis", label: "Kamis", short: "Kam" },
  { key: "jumat", label: "Jumat", short: "Jum" },
  { key: "sabtu", label: "Sabtu", short: "Sab" },
  { key: "minggu", label: "Minggu", short: "Min" },
];

const MEAL_SLOTS: { key: MealSlot; label: string; icon: string; time: string }[] = [
  { key: "breakfast", label: "Sarapan", icon: "🌅", time: "06:30 - 08:00" },
  { key: "lunch", label: "Makan Siang", icon: "☀️", time: "12:00 - 13:30" },
  { key: "dinner", label: "Makan Malam", icon: "🌙", time: "18:30 - 20:00" },
];

export const WeeklyMealPlannerModal: React.FC<WeeklyMealPlannerModalProps> = ({
  isOpen,
  onClose,
  weeklyPlan,
  onUpdateWeeklyPlan,
  availableRecipes,
  fridgeIngredients,
  onStartCooking,
  onAddShoppingItems,
  onOpenShoppingList,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("senin");
  const [activeTab, setActiveTab] = useState<"schedule" | "groceries">("schedule");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<{ day: DayOfWeek; slot: MealSlot } | null>(null);
  const [pickerSearch, setPickerSearch] = useState("");
  const [copiedShare, setCopiedShare] = useState(false);
  const [addedGroceryToast, setAddedGroceryToast] = useState(false);

  // Filtered recipes in picker drawer
  const filteredPickerRecipes = useMemo(() => {
    if (!pickerSearch.trim()) return availableRecipes.slice(0, 30);
    const q = pickerSearch.toLowerCase();
    return availableRecipes.filter(
      r =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.ingredients.some(i => i.name.toLowerCase().includes(q))
    );
  }, [availableRecipes, pickerSearch]);

  // Aggregate ingredients required across the entire week
  const weeklyGroceryAnalysis = useMemo(() => {
    const ingredientMap: Record<
      string,
      {
        name: string;
        amounts: string[];
        recipes: string[];
        isOwnedInFridge: boolean;
        category?: any;
      }
    > = {};

    weeklyPlan.meals.forEach(meal => {
      const recipe = availableRecipes.find(r => r.id === meal.recipeId);
      if (!recipe) return;

      recipe.ingredients.forEach(ing => {
        const cleanName = ing.name.toLowerCase().trim();
        const matchingFridgeItem = fridgeIngredients.find(
          fi => fi.name.toLowerCase().includes(cleanName) || cleanName.includes(fi.name.toLowerCase())
        );
        const owned = Boolean(matchingFridgeItem);
        const inferredCategory = matchingFridgeItem?.category || (
          /bayam|kangkung|wortel|tomat|cabai|bawang|sayur|kentang|brokoli|buncis|kol|sawi/i.test(ing.name) ? 'sayur' :
          /ayam|sapi|ikan|udang|telur|tempe|tahu|daging/i.test(ing.name) ? 'protein' :
          /susu|keju|yogurt|mentega/i.test(ing.name) ? 'dairy' :
          /beras|nasi|mie|mi |tepung|roti|pasta|kentang/i.test(ing.name) ? 'karbo' :
          /garam|gula|kecap|saus|minyak|merica|bumbu/i.test(ing.name) ? 'bumbu' : 'lainnya'
        );

        if (!ingredientMap[cleanName]) {
          ingredientMap[cleanName] = {
            name: ing.name,
            amounts: [ing.amount],
            recipes: [recipe.title],
            isOwnedInFridge: owned,
            category: inferredCategory,
          };
        } else {
          ingredientMap[cleanName].amounts.push(ing.amount);
          if (!ingredientMap[cleanName].recipes.includes(recipe.title)) {
            ingredientMap[cleanName].recipes.push(recipe.title);
          }
          if (owned) {
            ingredientMap[cleanName].isOwnedInFridge = true;
            ingredientMap[cleanName].category = inferredCategory;
          }
        }
      });
    });

    const all = Object.values(ingredientMap);
    const needed = all.filter(item => !item.isOwnedInFridge);
    const ready = all.filter(item => item.isOwnedInFridge);

    return { all, needed, ready };
  }, [weeklyPlan.meals, availableRecipes, fridgeIngredients]);

  if (!isOpen) return null;

  // Handle adding meal to slot
  const handleSelectRecipeForSlot = (recipe: Recipe) => {
    if (!pickerTarget) return;

    const existingIdx = weeklyPlan.meals.findIndex(
      m => m.day === pickerTarget.day && m.slot === pickerTarget.slot
    );

    const newMeal: PlannedMeal = {
      id: `meal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      day: pickerTarget.day,
      slot: pickerTarget.slot,
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      recipeImage: resolveRecipeImageUrl(recipe),
      servings: recipe.servings || 4,
      calories: recipe.calories || 350,
      cookTimeMinutes: recipe.totalTimeMinutes || 25,
      isCooked: false,
    };

    let updatedMeals = [...weeklyPlan.meals];
    if (existingIdx >= 0) {
      updatedMeals[existingIdx] = newMeal;
    } else {
      updatedMeals.push(newMeal);
    }

    onUpdateWeeklyPlan({
      ...weeklyPlan,
      meals: updatedMeals,
      updatedAt: Date.now(),
    });

    setIsPickerOpen(false);
    setPickerTarget(null);
  };

  // Remove meal
  const handleRemoveMeal = (day: DayOfWeek, slot: MealSlot) => {
    const updatedMeals = weeklyPlan.meals.filter(m => !(m.day === day && m.slot === slot));
    onUpdateWeeklyPlan({
      ...weeklyPlan,
      meals: updatedMeals,
      updatedAt: Date.now(),
    });
  };

  // Toggle cooked status
  const handleToggleCooked = (mealId: string) => {
    const updatedMeals = weeklyPlan.meals.map(m => {
      if (m.id === mealId) {
        return { ...m, isCooked: !m.isCooked };
      }
      return m;
    });

    onUpdateWeeklyPlan({
      ...weeklyPlan,
      meals: updatedMeals,
      updatedAt: Date.now(),
    });
  };

  // 1-Click Auto Plan Week: prioritize recipes that use ingredients needing to be used soon.
  const handleAutoPlanWeek = () => {
    if (availableRecipes.length === 0) return;

    const normalize = (value: string) => value.toLocaleLowerCase('id-ID').replace(/[^a-z0-9 ]/g, ' ').trim();
    const urgentIngredients = fridgeIngredients.filter(item =>
      item.urgency === 'urgent' || (typeof item.daysRemaining === 'number' && item.daysRemaining <= 3)
    );
    const mediumIngredients = fridgeIngredients.filter(item => item.urgency === 'medium');
    const scored = availableRecipes.map(recipe => {
      const ingredientNames = recipe.ingredients.map(item => normalize(item.name));
      const urgentMatches = urgentIngredients.filter(item => {
        const name = normalize(item.name);
        return ingredientNames.some(ingredient => ingredient.includes(name) || name.includes(ingredient));
      }).length;
      const mediumMatches = mediumIngredients.filter(item => {
        const name = normalize(item.name);
        return ingredientNames.some(ingredient => ingredient.includes(name) || name.includes(ingredient));
      }).length;
      const ownedMatches = recipe.ingredients.filter(item => item.isOwned).length;
      return { recipe, score: urgentMatches * 10 + mediumMatches * 4 + ownedMatches * 0.5 + Math.random() * 0.25 };
    }).sort((a, b) => b.score - a.score);

    const newMeals: PlannedMeal[] = [];
    const usageCount = new Map<string, number>();
    DAYS_OF_WEEK.forEach(day => {
      MEAL_SLOTS.forEach(slot => {
        const ranked = [...scored].sort((a, b) => {
          const aScore = a.score - (usageCount.get(a.recipe.id) || 0) * 3;
          const bScore = b.score - (usageCount.get(b.recipe.id) || 0) * 3;
          return bScore - aScore;
        });
        const recipe = ranked[0].recipe;
        usageCount.set(recipe.id, (usageCount.get(recipe.id) || 0) + 1);
        newMeals.push({
          id: `meal-${day.key}-${slot.key}-${Date.now()}-${newMeals.length}`,
          day: day.key,
          slot: slot.key,
          recipeId: recipe.id,
          recipeTitle: recipe.title,
          recipeImage: resolveRecipeImageUrl(recipe),
          servings: recipe.servings || 4,
          calories: recipe.calories || 350,
          cookTimeMinutes: recipe.totalTimeMinutes || 25,
          isCooked: false,
        });
      });
    });

    onUpdateWeeklyPlan({ ...weeklyPlan, meals: newMeals, updatedAt: Date.now() });
  };

  // Clear weekly plan
  const handleClearPlan = () => {
    if (confirm("Apakah Anda yakin ingin mengosongkan semua jadwal masak minggu ini?")) {
      onUpdateWeeklyPlan({
        ...weeklyPlan,
        meals: [],
        updatedAt: Date.now(),
      });
    }
  };

  // Add missing ingredients to shopping list
  const handlePushMissingToShoppingList = () => {
    if (weeklyGroceryAnalysis.needed.length === 0) return;

    const itemsToAdd = weeklyGroceryAnalysis.needed.map(item => ({
      name: item.name,
      amount: [...new Set(item.amounts)].join(" + ") || "secukupnya",
      recipeTitle: item.recipes.slice(0, 2).join(", "),
      category: item.category,
    }));

    onAddShoppingItems(itemsToAdd);
    setAddedGroceryToast(true);
    setTimeout(() => setAddedGroceryToast(false), 3000);
  };

  // Copy the generated shopping list in a WhatsApp-friendly format.
  const handleCopyShoppingList = async () => {
    const categories: Record<string, string[]> = {};
    weeklyGroceryAnalysis.needed.forEach(item => {
      const category = item.category === 'sayur' ? '🥬 Sayuran' :
        item.category === 'protein' ? '🥩 Protein' :
        item.category === 'bumbu' ? '🧂 Bumbu dan lainnya' :
        item.category === 'dairy' ? '🥛 Produk susu' :
        item.category === 'karbo' ? '🍚 Bahan pokok' : '🛒 Lainnya';
      (categories[category] ||= []).push(`- ${item.name} — ${[...new Set(item.amounts)].join(' + ') || 'secukupnya'}`);
    });
    let text = '*DAFTAR BELANJA MINGGUAN 🛒*\n';
    if (weeklyGroceryAnalysis.needed.length === 0) {
      text += '\nTidak ada bahan yang ditandai perlu dibeli berdasarkan stok yang tercatat.';
    } else {
      text += '\n' + Object.entries(categories).map(([category, items]) => `${category}:\n${items.join('\n')}`).join('\n\n');
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand('copy');
        textarea.remove();
        if (!copied) throw new Error('Browser tidak mengizinkan penyalinan otomatis.');
      }
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    } catch (error) {
      console.error('Gagal menyalin daftar belanja:', error);
      window.alert('Daftar tidak dapat disalin otomatis. Silakan coba melalui HTTPS atau izin clipboard browser.');
    }
  };

  // Share weekly schedule and its shopping list in one WhatsApp-friendly text.
  const handleShareToWhatsApp = async () => {
    let text = `📅 *JADWAL MASAK MINGGUAN KELUARGA*\n\n`;
    DAYS_OF_WEEK.forEach(d => {
      text += `*${d.label.toUpperCase()}*\n`;
      const mealsForDay = weeklyPlan.meals.filter(m => m.day === d.key);
      if (mealsForDay.length === 0) text += '  (Belum ada menu yang direncanakan)\n';
      else MEAL_SLOTS.forEach(slot => {
        const meal = mealsForDay.find(item => item.slot === slot.key);
        if (meal) text += `  • ${slot.icon} ${slot.label}: ${meal.recipeTitle}${meal.isCooked ? ' ✅ (Sudah Dimasak)' : ''}\n`;
      });
      text += '\n';
    });
    if (weeklyGroceryAnalysis.needed.length > 0) {
      text += '*DAFTAR BELANJA MINGGUAN 🛒*\n';
      weeklyGroceryAnalysis.needed.forEach((item, index) => {
        text += `${index + 1}. ${item.name} — ${[...new Set(item.amounts)].join(' + ') || 'secukupnya'}\n`;
      });
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    } catch (error) {
      console.error('Gagal menyalin jadwal:', error);
      window.alert('Tidak dapat menyalin otomatis. Coba buka aplikasi melalui HTTPS dan izinkan akses clipboard.');
    }
  };

  // Stats
  const totalPlanned = weeklyPlan.meals.length;
  const totalCooked = weeklyPlan.meals.filter(m => m.isCooked).length;
  const progressPercent = totalPlanned > 0 ? Math.round((totalCooked / totalPlanned) * 100) : 0;

  // Selected Day meals
  const selectedDayMeals = weeklyPlan.meals.filter(m => m.day === selectedDay);
  const selectedDayCalories = selectedDayMeals.reduce((acc, m) => acc + (m.calories || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#EBE6DF]">
        {/* Modal Header */}
        <div className="p-4 md:p-6 bg-white border-b border-[#EBE6DF] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#F7EDE8] text-[#C2593F] flex items-center justify-center shadow-xs">
              <Calendar className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg md:text-xl font-bold font-serif-editorial text-[#262220]">
                  Jadwal Masak Mingguan
                </h3>
                <span className="text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full bg-[#F7EDE8] text-[#8C3A27] border border-[#EDD1C6]">
                  7 Hari
                </span>
              </div>
              <p className="text-xs text-[#736B66] mt-0.5">
                Rencanakan menu sarapan, makan siang, & malam agar gizi seimbang dan bahan kulkas tidak mubazir.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoPlanWeek}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#C2593F] to-[#A3422A] hover:from-[#A8452D] hover:to-[#8C3520] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="Buat rencana menu sepekan otomatis dari bahan kulkas"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>✨ Otomatis Buat Menu Seminggu</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#F5F2EC] hover:bg-[#EBE6DF] text-[#736B66] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action bar & Stats */}
        <div className="px-4 md:px-6 py-3 bg-[#F4EFEA] border-b border-[#E8E1D7] flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Progress & Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[#736B66]">Kemajuan Memasak:</span>
              <strong className="text-[#262220] font-mono">
                {totalCooked}/{totalPlanned} Menu Selesai ({progressPercent}%)
              </strong>
            </div>
            <div className="w-24 md:w-32 bg-[#E5DDD2] rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Tabs & Tools */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-[#EBE4DA] p-0.5 border border-[#DDD3C5]">
              <button
                type="button"
                onClick={() => setActiveTab("schedule")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "schedule"
                    ? "bg-white text-[#262220] shadow-2xs"
                    : "text-[#736B66] hover:text-[#262220]"
                }`}
              >
                📅 Jadwal 7 Hari
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("groceries")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === "groceries"
                    ? "bg-white text-[#262220] shadow-2xs"
                    : "text-[#736B66] hover:text-[#262220]"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C2593F]" />
                <span>Belanja Mingguan ({weeklyGroceryAnalysis.needed.length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleShareToWhatsApp}
              className="p-1.5 md:px-2.5 md:py-1 rounded-xl bg-white hover:bg-[#FAF4F0] text-[#262220] border border-[#DDD3C5] font-semibold text-xs flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
              title="Salin ringkasan jadwal untuk WhatsApp"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden md:inline text-emerald-700 font-bold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#736B66]" />
                  <span className="hidden md:inline">Salin WA</span>
                </>
              )}
            </button>

            {totalPlanned > 0 && (
              <button
                type="button"
                onClick={handleClearPlan}
                className="p-1.5 md:px-2 md:py-1 rounded-xl text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-xs transition-colors cursor-pointer"
                title="Kosongkan jadwal minggu ini"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {activeTab === "schedule" ? (
            <>
              {/* Day Selector Buttons (Tabs: Senin - Minggu) */}
              <div className="grid grid-cols-7 gap-1.5 md:gap-2">
                {DAYS_OF_WEEK.map(day => {
                  const dayMeals = weeklyPlan.meals.filter(m => m.day === day.key);
                  const isSelected = selectedDay === day.key;
                  const allDayCooked = dayMeals.length > 0 && dayMeals.every(m => m.isCooked);

                  return (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => setSelectedDay(day.key)}
                      className={`p-2 md:p-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[#262220] text-white border-[#262220] shadow-md scale-102"
                          : "bg-white text-[#736B66] border-[#EBE6DF] hover:border-[#C2593F] hover:bg-[#FAF6F3]"
                      }`}
                    >
                      <span className="text-[11px] md:text-xs font-semibold uppercase tracking-wider">
                        {day.short}
                      </span>
                      <span className="text-sm md:text-base font-bold font-serif-editorial mt-0.5">
                        {day.label}
                      </span>
                      <div className="mt-1 flex items-center gap-1">
                        {dayMeals.length > 0 ? (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : allDayCooked
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-[#F5EDE8] text-[#8C3A27]"
                            }`}
                          >
                            {dayMeals.length} menu
                          </span>
                        ) : (
                          <span className="text-[10px] opacity-40">-</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Day Header Banner */}
              <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#EBE6DF]">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold font-serif-editorial text-[#262220]">
                    Menu Hari {DAYS_OF_WEEK.find(d => d.key === selectedDay)?.label}
                  </h4>
                  <span className="text-xs text-[#736B66]">
                    • {selectedDayMeals.length} dari 3 waktu makan terisi
                  </span>
                </div>

                {selectedDayCalories > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    <span>Total Est. Hari Ini: <strong className="font-mono">{selectedDayCalories} kkal</strong></span>
                  </div>
                )}
              </div>

              {/* 3 Meal Slots for Selected Day (Sarapan, Makan Siang, Makan Malam) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MEAL_SLOTS.map(slot => {
                  const meal = selectedDayMeals.find(m => m.slot === slot.key);
                  const matchedRecipe = meal
                    ? availableRecipes.find(r => r.id === meal.recipeId)
                    : null;

                  return (
                    <div
                      key={slot.key}
                      className={`rounded-2xl border transition-all flex flex-col h-full ${
                        meal
                          ? meal.isCooked
                            ? "bg-emerald-50/60 border-emerald-200 shadow-2xs"
                            : "bg-white border-[#E5DDD2] shadow-xs"
                          : "bg-[#FAF8F5] border-dashed border-[#DDD7CF] hover:border-[#C2593F]"
                      }`}
                    >
                      {/* Slot Header */}
                      <div className="p-3 border-b border-[#F0EAE1] flex items-center justify-between bg-stone-50/50 rounded-t-2xl">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{slot.icon}</span>
                          <span className="font-bold text-xs text-[#262220]">{slot.label}</span>
                        </div>
                        <span className="text-[10px] text-[#8C827A] font-mono">{slot.time}</span>
                      </div>

                      {/* Slot Content */}
                      <div className="p-3.5 flex-1 flex flex-col justify-between">
                        {meal ? (
                          <div className="space-y-3">
                            {/* Recipe Thumbnail & Info */}
                            <div className="flex gap-3">
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-stone-200 relative">
                                <img
                                  src={meal.recipeImage || resolveRecipeImageUrl(matchedRecipe || ({ title: meal.recipeTitle } as Recipe))}
                                  alt={meal.recipeTitle}
                                  className="w-full h-full object-cover"
                                />
                                {meal.isCooked && (
                                  <div className="absolute inset-0 bg-emerald-900/60 flex items-center justify-center">
                                    <Check className="w-6 h-6 text-white stroke-[3]" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5
                                  className={`text-xs font-bold line-clamp-2 ${
                                    meal.isCooked
                                      ? "line-through text-stone-500"
                                      : "text-[#262220]"
                                  }`}
                                >
                                  {meal.recipeTitle}
                                </h5>
                                <div className="mt-1 flex items-center gap-2 text-[10px] text-[#736B66]">
                                  <span className="flex items-center gap-0.5">
                                    <Clock className="w-3 h-3 text-[#C2593F]" />
                                    <span>{meal.cookTimeMinutes} mnt</span>
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-0.5">
                                    <Flame className="w-3 h-3 text-amber-500" />
                                    <span>{meal.calories} kkal</span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Cook Status Checkbox */}
                            <button
                              type="button"
                              onClick={() => handleToggleCooked(meal.id)}
                              className={`w-full py-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                                meal.isCooked
                                  ? "bg-emerald-100/70 text-emerald-800 border-emerald-300"
                                  : "bg-[#FAF8F5] hover:bg-[#F2ECE4] text-[#736B66] border-[#E5DDD2]"
                              }`}
                            >
                              {meal.isCooked ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Sudah Dimasak</span>
                                </>
                              ) : (
                                <>
                                  <Circle className="w-3.5 h-3.5 text-stone-400" />
                                  <span>Tandai Selesai Masak</span>
                                </>
                              )}
                            </button>

                            {/* Actions (Masak Sekarang & Ganti / Hapus) */}
                            <div className="flex items-center gap-1.5 pt-1">
                              {matchedRecipe && (
                                <button
                                  type="button"
                                  onClick={() => onStartCooking(matchedRecipe)}
                                  className="flex-1 py-1.5 px-2.5 bg-[#C2593F] hover:bg-[#A8452D] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
                                >
                                  <ChefHat className="w-3.5 h-3.5" />
                                  <span>Masak Sekarang</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setPickerTarget({ day: selectedDay, slot: slot.key });
                                  setIsPickerOpen(true);
                                }}
                                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs transition-colors cursor-pointer"
                                title="Ganti menu"
                              >
                                Ganti
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveMeal(selectedDay, slot.key)}
                                className="p-1.5 rounded-xl hover:bg-rose-100 text-rose-600 text-xs transition-colors cursor-pointer"
                                title="Hapus menu dari slot ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="py-8 flex flex-col items-center justify-center text-center">
                            <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mb-2">
                              <Utensils className="w-5 h-5 stroke-[1.5]" />
                            </div>
                            <p className="text-xs font-medium text-stone-500 mb-2">
                              Belum ada rencana {slot.label.toLowerCase()}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setPickerTarget({ day: selectedDay, slot: slot.key });
                                setIsPickerOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF4F0] text-[#8C3A27] border border-[#DDD3C5] text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Pilih Menu Masakan</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Auto-Plan Floating Button */}
              <div className="sm:hidden pt-2">
                <button
                  type="button"
                  onClick={handleAutoPlanWeek}
                  className="w-full py-3 rounded-2xl bg-[#C2593F] text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>✨ Otomatis Buat Menu Seminggu Penuh</span>
                </button>
              </div>
            </>
          ) : (
            /* Weekly Grocery Aggregator Tab */
            <div className="space-y-6">
              {/* Top Grocery Callout */}
              <div className="p-4 md:p-5 bg-white rounded-2xl border border-[#EBE6DF] shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold font-serif-editorial text-[#262220]">
                    Kalkulator Bahan Belanja Mingguan
                  </h4>
                  <p className="text-xs text-[#736B66] mt-0.5">
                    Dihitung otomatis dari seluruh {totalPlanned} menu yang direncanakan selama sepekan.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleCopyShoppingList}
                    className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedShare ? 'Tersalin!' : 'Salin Daftar untuk WhatsApp'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePushMissingToShoppingList}
                    disabled={weeklyGroceryAnalysis.needed.length === 0}
                    className="px-4 py-2 bg-[#C2593F] hover:bg-[#A8452D] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Masukkan ke Daftar Belanjaan</span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenShoppingList}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Buka Catatan Belanja</span>
                  </button>
                </div>
              </div>

              {addedGroceryToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>{weeklyGroceryAnalysis.needed.length} bahan berhasil ditambahkan ke Daftar Belanjaan Utama!</span>
                </div>
              )}

              {/* 2 Columns: Bahan yang Perlu Dibeli vs Bahan yang Sudah Ada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Needed to Buy */}
                <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                    <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-rose-600" />
                      <span>Perlu Dibeli di Pasar / Toko ({weeklyGroceryAnalysis.needed.length})</span>
                    </span>
                    <span className="text-[10px] text-rose-600 font-medium">Belum ada di kulkas</span>
                  </div>

                  {weeklyGroceryAnalysis.needed.length === 0 ? (
                    <p className="text-xs text-stone-500 py-6 text-center italic">
                      Luar biasa! Semua bahan untuk menu minggu ini sudah tersedia lengkap di kulkas Anda.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {weeklyGroceryAnalysis.needed.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-stone-900 block">{item.name}</span>
                            <span className="text-[10px] text-stone-500">
                              Untuk menu: {item.recipes.slice(0, 2).join(", ")}
                            </span>
                          </div>
                          <span className="font-mono text-xs font-bold text-rose-800 bg-white px-2 py-0.5 rounded-lg border border-rose-200">
                            {[...new Set(item.amounts)].join(" + ") || "secukupnya"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Already in Fridge */}
                <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Sudah Tersedia di Kulkas ({weeklyGroceryAnalysis.ready.length})</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">Siap langsung dimasak</span>
                  </div>

                  {weeklyGroceryAnalysis.ready.length === 0 ? (
                    <p className="text-xs text-stone-500 py-6 text-center italic">
                      Belum ada bahan kulkas yang terpakai di menu mingguan.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {weeklyGroceryAnalysis.ready.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-stone-900 block">{item.name}</span>
                            <span className="text-[10px] text-stone-500">
                              Untuk menu: {item.recipes.slice(0, 2).join(", ")}
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg">
                            ✓ Ada di Kulkas
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recipe Picker Drawer */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full sm:max-w-xl max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#EBE6DF]">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-900 font-serif-editorial">
                  Pilih Menu untuk {DAYS_OF_WEEK.find(d => d.key === pickerTarget?.day)?.label} -{" "}
                  {MEAL_SLOTS.find(s => s.key === pickerTarget?.slot)?.label}
                </h4>
                <p className="text-xs text-stone-500">
                  Pilih dari koleksi resep lezat atau resep AI kulkas Anda.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input in Picker */}
            <div className="p-3 bg-stone-50 border-b border-stone-200">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari masakan (misal: telur, soto, ayam, sayur)..."
                  value={pickerSearch}
                  onChange={e => setPickerSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#C2593F]"
                />
              </div>
            </div>

            {/* Recipe List */}
            <div className="p-3 overflow-y-auto space-y-2 flex-1">
              {filteredPickerRecipes.map(recipe => (
                <div
                  key={recipe.id}
                  onClick={() => handleSelectRecipeForSlot(recipe)}
                  className="p-2.5 rounded-2xl border border-stone-200 hover:border-[#C2593F] bg-white hover:bg-[#FAF6F3] transition-all cursor-pointer flex items-center gap-3 group"
                >
                  <img
                    src={resolveRecipeImageUrl(recipe)}
                    alt={recipe.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-stone-900 group-hover:text-[#C2593F] transition-colors truncate">
                      {recipe.title}
                    </h5>
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      {recipe.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-600">
                      <span>⏱️ {recipe.totalTimeMinutes} mnt</span>
                      <span>•</span>
                      <span>🔥 {recipe.calories} kkal</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">{recipe.matchPercentage}% Cocok</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#C2593F] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
