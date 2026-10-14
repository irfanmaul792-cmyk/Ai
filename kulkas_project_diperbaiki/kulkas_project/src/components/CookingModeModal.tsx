import { resolveRecipeImageUrl } from '../utils/recipeImageResolver';
import { getSubstitutionsForIngredients } from '../utils/ingredientSubstitutions';
import React, { useState, useEffect, useRef } from 'react';
import { Recipe } from '../types';
import { X, Play, Pause, RotateCcw, Check, Sparkles, ChefHat, Volume2, VolumeX, Bookmark, Share2, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, ClipboardList, Printer, Lightbulb, Flame, ChevronDown, ChevronUp } from 'lucide-react';

interface CookingModeModalProps {
  recipe: Recipe;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (recipe: Recipe) => void;
  onShareClick?: (recipe: Recipe) => void;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({
  recipe,
  onClose,
  isFavorite = false,
  onToggleFavorite,
  onShareClick,
}) => {
  const photoUrl = recipe.imageUrl || resolveRecipeImageUrl(recipe);

  // Cooking stages:
  // 'checklist': Tampilan awal ceklis kesiapan bahan (Prasyarat wajib sebelum memasak)
  // 'cooking': Langkah-langkah memasak bertahap
  const [cookingStage, setCookingStage] = useState<'checklist' | 'cooking'>('checklist');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  
  // Initialize checklist: pre-check ingredients already owned in the fridge
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    recipe.ingredients.forEach(item => {
      if (item.isOwned) {
        initial[item.name] = true;
      }
    });
    return initial;
  });

  const [showIngredientsDrawer, setShowIngredientsDrawer] = useState<boolean>(false);
  const [showSubstitutions, setShowSubstitutions] = useState<boolean>(false);
  const substitutions = React.useMemo(() => getSubstitutionsForIngredients(recipe.ingredients), [recipe.ingredients]);
  const estCalories = Math.round(recipe.calories);
  const estProtein = Math.round(recipe.calories * 0.04);
  const estCarbs = Math.round(recipe.calories * 0.11);
  const estFat = Math.round(recipe.calories * 0.025);
  const [timerSeconds, setTimerSeconds] = useState<number>(
    (recipe.steps[0]?.durationMinutes || 5) * 60
  );
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentStep = recipe.steps[currentStepIndex] || recipe.steps[0];

  // Stop speech when modal closes or unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Update timer and stop speech whenever step changes
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    if (currentStep?.durationMinutes) {
      setTimerSeconds(currentStep.durationMinutes * 60);
      setIsTimerRunning(false);
    }
  }, [currentStepIndex, currentStep]);

  // Voice narration using Web Speech API (Indonesian)
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Browser Anda belum mendukung fitur pembacaan suara.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `Langkah ${currentStep.step}. ${currentStep.instruction}. ${
      currentStep.tip ? `Tips koki: ${currentStep.tip}` : ''
    }`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95; // Natural cooking pace

    // Find Indonesian voice if available
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.startsWith('id') || v.lang.includes('ID'));
    if (idVoice) {
      utterance.voice = idVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            playCompletionSound();
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  // Clean Web Audio chime sound
  const playCompletionSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.9);
    } catch {
      // Audio not supported or blocked by browser policy
    }
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleIngredientCheck = (name: string) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleCheckAll = () => {
    const allChecked: Record<string, boolean> = {};
    recipe.ingredients.forEach(item => {
      allChecked[item.name] = true;
    });
    setCheckedIngredients(allChecked);
  };

  const handleUncheckAll = () => {
    setCheckedIngredients({});
  };

  const totalIngredients = recipe.ingredients.length;
  const readyIngredientsCount = recipe.ingredients.filter(i => !!checkedIngredients[i.name]).length;
  const isAllReady = readyIngredientsCount === totalIngredients && totalIngredients > 0;
  const readyPercentage = totalIngredients > 0 ? Math.round((readyIngredientsCount / totalIngredients) * 100) : 100;

  const handleStartCooking = () => {
    setCookingStage('cooking');
    setCurrentStepIndex(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1816]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto">
      <div className="bg-[#FAF8F5] text-[#262220] rounded-3xl w-full max-w-3xl shadow-2xl border border-[#EBE6DF] overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 md:p-6 border-b border-[#EBE6DF] flex items-center justify-between bg-white/90 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={recipe.title}
                className="w-11 h-11 rounded-2xl object-cover border border-[#EBE6DF] shadow-xs shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-[#C2593F] text-white flex items-center justify-center shadow-xs shrink-0">
                <ChefHat className="w-5 h-5" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-[#736B66]">
                {cookingStage === 'checklist' ? (
                  <span className="font-semibold text-[#8C3A27] bg-[#F9ECE7] border border-[#EDD1C6] px-2.5 py-0.5 rounded-md">
                    Tahap 1: Ceklis Kesiapan Bahan
                  </span>
                ) : (
                  <span className="font-semibold text-[#8C3A27] bg-[#F9ECE7] border border-[#EDD1C6] px-2.5 py-0.5 rounded-md">
                    Tahap 2: Proses Memasak ({currentStepIndex + 1}/{recipe.steps.length})
                  </span>
                )}
                <span>·</span>
                <span>{recipe.totalTimeMinutes} Menit</span>
                <span>·</span>
                <span className="hidden sm:inline font-medium text-[#C2593F]">{recipe.difficulty}</span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold font-serif-editorial text-[#262220] mt-0.5 truncate">
                {recipe.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="w-9 h-9 rounded-full bg-[#F0EDE8] hover:bg-[#E5E0D8] text-[#59524C] hover:text-[#C2593F] flex items-center justify-center transition-colors cursor-pointer"
              title="Cetak panduan resep ini"
            >
              <Printer className="w-4 h-4" />
            </button>

            {onToggleFavorite && (
              <button
                type="button"
                onClick={() => onToggleFavorite(recipe)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isFavorite
                    ? 'bg-[#C2593F] text-white hover:bg-[#A64830]'
                    : 'bg-[#F0EDE8] hover:bg-[#E5E0D8] text-[#59524C]'
                }`}
                title={isFavorite ? 'Hapus dari resep favorit' : 'Simpan ke resep favorit'}
              >
                <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-white text-white' : ''}`} />
              </button>
            )}

            {onShareClick && (
              <button
                type="button"
                onClick={() => onShareClick(recipe)}
                className="w-9 h-9 rounded-full bg-[#F0EDE8] hover:bg-[#E5E0D8] text-[#59524C] flex items-center justify-center transition-colors cursor-pointer"
                title="Bagikan resep ini"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#F0EDE8] hover:bg-[#E5E0D8] text-[#59524C] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAMPILAN AWAL: CEKLIS KESIAPAN BAHAN (PRASYARAT SEBELUM MEMASAK)           */}
        {/* ========================================================================= */}
        {cookingStage === 'checklist' ? (
          <div className="p-4 sm:p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
            {photoUrl && (
              <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden border border-[#EBE6DF] shadow-xs">
                <img
                  src={photoUrl}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-200 block font-sans">Target Sajian Hasil Masak Anda</span>
                    <h4 className="text-base sm:text-lg font-bold font-serif-editorial text-white">{recipe.title}</h4>
                  </div>
                </div>
              </div>
            )}
            {/* Nutrition & Macro Micro-Breakdown (Ide A) */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
              <div className="bg-white p-2.5 rounded-2xl border border-[#EDE8E1] shadow-2xs">
                <span className="block text-[9px] uppercase tracking-wider text-[#8C827A] font-sans font-semibold">Kalori</span>
                <span className="font-bold text-[#262220] flex items-center justify-center gap-1">
                  <Flame className="w-3 h-3 text-[#C2593F]" />
                  <span>{estCalories} kkal</span>
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-2xl border border-[#EDE8E1] shadow-2xs">
                <span className="block text-[9px] uppercase tracking-wider text-[#8C827A] font-sans font-semibold">Protein</span>
                <span className="font-bold text-[#5D7052]">{estProtein}g</span>
              </div>
              <div className="bg-white p-2.5 rounded-2xl border border-[#EDE8E1] shadow-2xs">
                <span className="block text-[9px] uppercase tracking-wider text-[#8C827A] font-sans font-semibold">Karbo</span>
                <span className="font-bold text-[#D9943B]">{estCarbs}g</span>
              </div>
              <div className="bg-white p-2.5 rounded-2xl border border-[#EDE8E1] shadow-2xs">
                <span className="block text-[9px] uppercase tracking-wider text-[#8C827A] font-sans font-semibold">Lemak</span>
                <span className="font-bold text-[#8C5A41]">{estFat}g</span>
              </div>
            </div>

            {/* Smart Substitutions Accordion (Ide C) */}
            <div className="bg-[#FFFDF9] border border-[#EBE1D3] rounded-2xl p-4 space-y-2">
              <button
                type="button"
                onClick={() => setShowSubstitutions(!showSubstitutions)}
                className="w-full flex items-center justify-between text-xs font-bold text-[#8C3A27] cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-[#D9943B]" />
                  <span>Tips Substitusi Bumbu / Bahan Jika Belum Lengkap ({substitutions.length} Alternatif)</span>
                </span>
                {showSubstitutions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showSubstitutions && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 animate-fade-in text-xs">
                  {substitutions.map((sub, sIdx) => (
                    <div key={sIdx} className="bg-white p-2.5 rounded-xl border border-[#EDE4D6] space-y-0.5 shadow-2xs">
                      <span className="font-bold text-[#262220] block">{sub.original}</span>
                      <span className="text-[#5D7052] font-semibold block text-[11px]">↳ Ganti: {sub.alternative}</span>
                      <span className="text-[10px] text-[#736B66] italic block leading-tight">{sub.note}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Prerequisite Banner Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-3.5">
              <ClipboardList className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-950 space-y-1">
                <h4 className="font-bold text-amber-900">Prasyarat Kesiapan Bahan Masakan:</h4>
                <p className="leading-relaxed text-amber-900/90 text-xs">
                  Sebelum melangkah ke langkah memasak, pastikan seluruh bahan masakan di bawah sudah siap dan ditakar rapi di meja dapur Anda agar proses memasak berjalan lancar tanpa terburu-buru.
                </p>
              </div>
            </div>

            {/* Checklist Progress & Quick Actions */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-stone-900 text-sm">
                    {readyIngredientsCount} dari {totalIngredients} Bahan Siap
                  </span>
                  <span className="text-stone-500 ml-2">({readyPercentage}% Siap)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCheckAll}
                    className="px-3.5 py-1.5 rounded-xl bg-[#C2593F] hover:bg-[#A64830] text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Centang Semua Siap</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleUncheckAll}
                    className="px-3 py-1.5 rounded-xl bg-[#F0EDE8] hover:bg-[#E5E0D8] text-[#59524C] text-xs transition-colors cursor-pointer"
                  >
                    Kosongkan
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#EBE6DF] h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isAllReady ? 'bg-[#5D7052]' : 'bg-[#C2593F]'
                  }`}
                  style={{ width: `${readyPercentage}%` }}
                />
              </div>
            </div>

            {/* List of Ingredients to Check */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs uppercase tracking-wider font-bold text-stone-700">
                  Daftar Bahan yang Harus Disiapkan di Meja Dapur:
                </h4>
                <span className="text-[11px] text-stone-500">Klik bahan untuk mencentang</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {recipe.ingredients.map((item, idx) => {
                  const isChecked = !!checkedIngredients[item.name];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleIngredientCheck(item.name)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950 shadow-xs'
                          : 'bg-white border-stone-200 text-stone-800 hover:border-emerald-300 hover:bg-stone-50'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`font-semibold ${isChecked ? 'text-emerald-900 font-bold' : 'text-stone-800'}`}>
                            {item.name}
                          </span>
                          {item.isOwned && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium">
                              Ada di kulkas
                            </span>
                          )}
                        </div>
                        <span className="text-stone-500 font-mono text-[11px] block mt-0.5">
                          Takaran: {item.amount}
                        </span>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-xl border flex items-center justify-center shrink-0 transition-all ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                            : 'border-stone-300 bg-white hover:border-emerald-500'
                        }`}
                      >
                        {isChecked ? <Check className="w-4 h-4 stroke-[3]" /> : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recipe Story / Chef Intro */}
            {recipe.story && (
              <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 text-xs text-stone-700 space-y-1">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <span>📖</span>
                  <span>Cerita Kuliner & Filosofi Resep:</span>
                </span>
                <p className="italic leading-relaxed text-stone-600 text-xs">
                  "{recipe.story}"
                </p>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* TAMPILAN KEDUA: LANGKAH-LANGKAH MEMASAK BERTAHAP                          */
          /* ========================================================================= */
          <div className="p-4 sm:p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
            {/* Step Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-stone-500 mb-2">
                <span className="font-bold text-stone-800">
                  Langkah {currentStepIndex + 1} dari {recipe.steps.length}
                </span>
                <span className="font-semibold text-emerald-700">
                  {Math.round(((currentStepIndex + 1) / recipe.steps.length) * 100)}% Selesai
                </span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentStepIndex + 1) / recipe.steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Step Detailed Card */}
            <div className="bg-stone-50/95 rounded-2xl p-5 sm:p-6 border border-stone-200/90 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl">
                    Langkah ke-{currentStepIndex + 1}
                  </span>
                  {currentStep.durationMinutes && (
                    <span className="text-xs font-semibold text-stone-600 font-mono bg-white px-2.5 py-1 rounded-xl border border-stone-200">
                      ⏱ ~{currentStep.durationMinutes} menit
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Voice Guide Button */}
                  <button
                    type="button"
                    onClick={toggleSpeech}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                      isSpeaking
                        ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    }`}
                    title="Bacakan petunjuk langkah memasak dengan suara"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Hentikan Suara</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>🔊 Bacakan Langkah</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Step Instruction Text */}
              <div className="space-y-2">
                <p className="text-base sm:text-lg text-stone-900 leading-relaxed font-semibold">
                  {currentStep.instruction}
                </p>
              </div>

              {/* Chef Secret Tip */}
              {currentStep.tip && (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/90 flex items-start gap-2.5 text-xs text-amber-950">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900">Tips Rahasia Koki: </span>
                    <span className="leading-relaxed">{currentStep.tip}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Cooking Countdown Timer */}
            <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Kitchen Timer</span>
                  <span className="text-stone-600">·</span>
                  <span className="text-xs text-stone-400">Pengingat Waktu Memasak</span>
                </div>
                <p className="text-3xl font-mono font-bold text-white mt-1 tabular-nums">
                  {formatTimer(timerSeconds)}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isTimerRunning
                      ? 'bg-amber-500 hover:bg-amber-600 text-stone-950'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5" /> Jeda Timer
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" /> Mulai Timer
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds((currentStep.durationMinutes || 5) * 60);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Reset timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
            </div>

            {/* Quick Toggle to Peek at Ingredients without leaving the cooking steps */}
            <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setShowIngredientsDrawer(!showIngredientsDrawer)}
                className="w-full p-3.5 bg-stone-50 hover:bg-stone-100/80 text-xs font-semibold text-stone-700 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-emerald-600" />
                  <span>Lihat Ringkasan Bahan Masakan ({recipe.ingredients.length} Bahan)</span>
                </span>
                <span className="text-emerald-700 text-[11px] font-bold">
                  {showIngredientsDrawer ? 'Tutup ▲' : 'Buka ▼'}
                </span>
              </button>

              {showIngredientsDrawer && (
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-stone-100 bg-stone-50/40 text-xs">
                  {recipe.ingredients.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200">
                      <span className="font-semibold text-stone-800">{item.name}</span>
                      <span className="text-stone-500 font-mono text-[11px]">({item.amount})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recipe Story and Executive Chef Tip */}
            {(recipe.story || recipe.chefTip) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recipe.story && (
                  <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-950 space-y-1">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <span>📖</span>
                      <span>Cerita Kuliner Resep:</span>
                    </span>
                    <p className="italic leading-relaxed text-stone-700 text-[11px] sm:text-xs">
                      "{recipe.story}"
                    </p>
                  </div>
                )}
                {recipe.chefTip && (
                  <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 text-xs text-emerald-950 space-y-1">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Rahasia Dapur Koki:</span>
                    </span>
                    <p className="leading-relaxed text-stone-700 text-[11px] sm:text-xs">
                      {recipe.chefTip}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* FOOTER NAVIGATION CONTROLS                                                */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 md:p-6 border-t border-[#EBE6DF] bg-white/90 flex items-center justify-between shrink-0">
          {cookingStage === 'checklist' ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#736B66] hover:text-[#262220] hover:bg-[#F0EDE8] transition-colors cursor-pointer"
              >
                Kembali
              </button>

              <button
                type="button"
                onClick={handleStartCooking}
                className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#C2593F] hover:bg-[#A64830] text-white shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{isAllReady ? '✓ Semua Bahan Siap, Mulai Memasak' : 'Lanjut ke Langkah Memasak'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              {currentStepIndex === 0 ? (
                <button
                  type="button"
                  onClick={() => setCookingStage('checklist')}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white border border-[#DDD8D0] text-[#3D3733] hover:bg-[#FAF8F5] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Ceklis Kesiapan Bahan</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white border border-[#DDD8D0] text-[#3D3733] hover:bg-[#FAF8F5] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Langkah Sebelumnya</span>
                </button>
              )}

              {currentStepIndex < recipe.steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex(prev => prev + 1)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#262220] hover:bg-[#C2593F] text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <span>Langkah Berikutnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#C2593F] hover:bg-[#A64830] text-white shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>🎉 Selesai Memasak!</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
