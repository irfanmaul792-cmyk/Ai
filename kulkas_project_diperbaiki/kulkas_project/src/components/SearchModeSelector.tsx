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
        <label className="text-xs font-bold uppercase tracking-wider text-[#736B66]">
          Pilih Metode Pencarian Resep:
        </label>
        <span className="text-[11px] text-[#8C827A]">
          Mode Aktif: <strong className="text-[#C2593F] font-semibold">{modes.find(m => m.id === currentMode)?.title}</strong>
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
                  ? 'bg-[#262220] text-white border-[#3D3531] shadow-md ring-2 ring-[#C2593F]/60'
                  : 'bg-white hover:bg-[#FAF8F5] text-[#262220] border-[#EBE6DF] shadow-xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#C2593F] text-white'
                        : 'bg-[#F5F2ED] text-[#736B66]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-[#3D3531] text-[#E8D9CD] border border-[#594D46]'
                        : 'bg-[#F0EDE8] text-[#736B66] border border-[#DDD8D0]'
                    }`}
                  >
                    {mode.badge}
                  </span>
                </div>

                <div>
                  <h4 className={`text-sm md:text-base font-bold font-serif-editorial ${isSelected ? 'text-white' : 'text-[#262220]'}`}>
                    {mode.title}
                  </h4>
                  <p className={`text-xs mt-1 leading-relaxed ${isSelected ? 'text-[#D9D2C7]' : 'text-[#736B66]'}`}>
                    {mode.subtitle}
                  </p>
                </div>
              </div>

              {/* Active selection checkmark */}
              {isSelected && (
                <div className="mt-3 pt-2.5 border-t border-[#3D3531] flex items-center gap-1.5 text-[11px] text-[#DDB288] font-semibold">
                  <Check className="w-3.5 h-3.5 text-[#C2593F]" />
                  <span>Metode ini sedang aktif</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
