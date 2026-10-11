import React, { useState, useEffect, useRef } from 'react';
import { Recipe } from '../types';
import { X, Play, Pause, RotateCcw, Check, Sparkles, ChefHat, Volume2, VolumeX, Bookmark, Share2 } from 'lucide-react';

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
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(
    (recipe.steps[0]?.durationMinutes || 5) * 60
  );
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentStep = recipe.steps[currentStepIndex];

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

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="bg-white text-stone-900 rounded-3xl w-full max-w-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <ChefHat className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span>Mode Memasak Interaktif</span>
                <span>·</span>
                <span className="font-medium text-emerald-700">{recipe.difficulty}</span>
                <span>·</span>
                <span>{recipe.totalTimeMinutes} Menit</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold font-display text-stone-900 mt-0.5 truncate">
                {recipe.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onToggleFavorite && (
              <button
                type="button"
                onClick={() => onToggleFavorite(recipe)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isFavorite
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'bg-stone-200/70 hover:bg-stone-300 text-stone-600'
                }`}
                title={isFavorite ? 'Hapus dari resep favorit' : 'Simpan ke resep favorit'}
              >
                <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-600 text-amber-600' : ''}`} />
              </button>
            )}

            {onShareClick && (
              <button
                type="button"
                onClick={() => onShareClick(recipe)}
                className="w-9 h-9 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Bagikan resep ini"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 md:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Progress Bar of Steps */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-stone-500 mb-2">
              <span>Langkah {currentStepIndex + 1} dari {recipe.steps.length}</span>
              <span>{Math.round(((currentStepIndex + 1) / recipe.steps.length) * 100)}% Selesai</span>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentStepIndex + 1) / recipe.steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Step Big Card with Voice Speech Guidance */}
          <div className="bg-stone-50/90 rounded-2xl p-6 border border-stone-200/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg">
                Instruksi Langkah {currentStepIndex + 1}
              </span>

              <div className="flex items-center gap-2">
                {/* Opsi 5: Voice Guide Button */}
                <button
                  type="button"
                  onClick={toggleSpeech}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    isSpeaking
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                  title="Bacakan petunjuk langkah memasak dengan suara (berguna saat tangan kotor)"
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

                {currentStep.durationMinutes && (
                  <span className="text-xs text-stone-500 font-mono">
                    ~{currentStep.durationMinutes} mnt
                  </span>
                )}
              </div>
            </div>

            <p className="text-base md:text-lg text-stone-800 leading-relaxed font-medium">
              {currentStep.instruction}
            </p>

            {currentStep.tip && (
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-950">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Tips Rahasia Koki: </span>
                  <span>{currentStep.tip}</span>
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

          {/* Quick Checklist for Ingredients */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-stone-500 mb-3">
              Ceklis Kesiapan Bahan Masakan:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recipe.ingredients.map((item, idx) => {
                const isChecked = !!checkedIngredients[item.name];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleIngredientCheck(item.name)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 line-through opacity-75'
                        : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-stone-500 ml-1.5 font-mono">({item.amount})</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div className="p-4 md:p-6 border-t border-stone-200 bg-stone-50/80 flex items-center justify-between">
          <button
            onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              currentStepIndex === 0
                ? 'opacity-40 cursor-not-allowed text-stone-400 bg-stone-200'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            ← Langkah Sebelumnya
          </button>

          {currentStepIndex < recipe.steps.length - 1 ? (
            <button
              onClick={() => setCurrentStepIndex(prev => prev + 1)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white transition-colors cursor-pointer"
            >
              Langkah Berikutnya →
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors cursor-pointer"
            >
              🎉 Selesai Memasak!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

