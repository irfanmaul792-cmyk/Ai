import React from 'react';
import { Refrigerator, Camera, Layers, Check } from 'lucide-react';

export type SearchMode = 'fridge_only' | 'photo_only' | 'hybrid';

interface SearchModeSelectorProps {
  currentMode: SearchMode;
  onSelectMode: (mode: SearchMode) => void;
  fridgeItemCount: number;
  photoCount: number;
}

export const SearchModeSelector: React.FC<SearchModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  fridgeItemCount,
  photoCount,
}) => {
  const modes = [
    {
      id: 'fridge_only' as SearchMode,
      title: 'Bahan Kulkas Saja',
      subtitle: 'Mencari resep murni dari stok yang ada di Kulkas Pintarmu.',
      icon: Refrigerator,
      badge: `${fridgeItemCount} Bahan di Kulkas`,
      color: 'emerald'
    },
    {
      id: 'photo_only' as SearchMode,
      title: 'Foto yang Di-upload',
      subtitle: 'Mencari resep dari bahan yang terdeteksi pada foto kulkas/dapurmu.',
      icon: Camera,
      badge: `${photoCount}/3 Foto`,
      color: 'blue'
    },
    {
      id: 'hybrid' as SearchMode,
      title: 'Gabungan Foto + Kulkas',
      subtitle: 'Kombinasikan bahan dari foto ditambah bahan pilihan dari Kulkas Pintar.',
      icon: Layers,
      badge: 'Paling Lengkap ⚡',
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
          Pilih Metode Pencarian Resep (3 Opsi):
        </label>
        <span className="text-[11px] text-stone-500">
          Mode Aktif: <strong className="text-emerald-800">{modes.find(m => m.id === currentMode)?.title}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = currentMode === mode.id;

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onSelectMode(mode.id)}
              className={`p-4 md:p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-emerald-950 text-white border-emerald-700 shadow-md ring-2 ring-emerald-600/50'
                  : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200/90 shadow-sm'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-emerald-800/80 text-emerald-200 border border-emerald-600/40'
                        : 'bg-stone-100 text-stone-600 border border-stone-200'
                    }`}
                  >
                    {mode.badge}
                  </span>
                </div>

                <div>
                  <h4 className={`text-sm md:text-base font-bold font-display ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                    {mode.title}
                  </h4>
                  <p className={`text-xs mt-1 leading-relaxed ${isSelected ? 'text-emerald-200/80' : 'text-stone-500'}`}>
                    {mode.subtitle}
                  </p>
                </div>
              </div>

              {/* Active selection checkmark */}
              {isSelected && (
                <div className="mt-3 pt-2.5 border-t border-emerald-800/70 flex items-center gap-1.5 text-[11px] text-emerald-300 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Metode ini sedang digunakan</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
