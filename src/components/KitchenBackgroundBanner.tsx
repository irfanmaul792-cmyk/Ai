import React from 'react';
import { Sparkles, Utensils, Refrigerator } from 'lucide-react';

interface KitchenBackgroundBannerProps {
  onExploreFridgeClick?: () => void;
  onPreferencesClick?: () => void;
  detectedCount: number;
}

export const KitchenBackgroundBanner: React.FC<KitchenBackgroundBannerProps> = ({
  onExploreFridgeClick,
  onPreferencesClick,
  detectedCount,
}) => {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-stone-900 text-white shadow-2xl border border-stone-800">
      {/* Background SVG Canvas: Modern Scandinavian Kitchen with a Sleek 2-Door French Refrigerator */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-40 md:opacity-50">
        <svg
          viewBox="0 0 1200 500"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2c302e" />
              <stop offset="100%" stopColor="#191b1a" />
            </linearGradient>
            <linearGradient id="fridgeSteel" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3f454a" />
              <stop offset="40%" stopColor="#646c73" />
              <stop offset="70%" stopColor="#4a5259" />
              <stop offset="100%" stopColor="#2d3338" />
            </linearGradient>
            <linearGradient id="woodCabinet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#614a38" />
              <stop offset="100%" stopColor="#412f22" />
            </linearGradient>
            <linearGradient id="marbleCounter" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#eae6e1" />
              <stop offset="50%" stopColor="#f5f2ed" />
              <stop offset="100%" stopColor="#dad5ce" />
            </linearGradient>
            <radialGradient id="sunBeam" cx="95%" cy="10%" r="70%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Kitchen Wall */}
          <rect width="1200" height="500" fill="url(#wallGrad)" />

          {/* Architectural Window with morning light */}
          <rect x="900" y="30" width="260" height="260" rx="8" fill="#384547" />
          <line x1="1030" y1="30" x2="1030" y2="290" stroke="#1f2728" strokeWidth="6" />
          <line x1="900" y1="160" x2="1160" y2="160" stroke="#1f2728" strokeWidth="6" />
          <rect width="1200" height="500" fill="url(#sunBeam)" />

          {/* Upper Oak Wood Cabinets */}
          <rect x="60" y="30" width="460" height="150" fill="url(#woodCabinet)" />
          <line x1="213" y1="30" x2="213" y2="180" stroke="#2a1f17" strokeWidth="3" />
          <line x1="366" y1="30" x2="366" y2="180" stroke="#2a1f17" strokeWidth="3" />

          {/* Under-cabinet warm LED light glow */}
          <rect x="60" y="178" width="460" height="4" fill="#fef08a" opacity="0.6" />

          {/* ============================================================== */}
          {/* THE BIG 2-DOOR FRENCH REFRIGERATOR (Kulkas Besar 2 Pintu)     */}
          {/* ============================================================== */}
          <g transform="translate(560, 40)">
            {/* Refrigerator outer shadow */}
            <rect x="0" y="0" width="310" height="460" rx="16" fill="#0c0e10" opacity="0.9" />

            {/* Refrigerator Main Stainless Steel Body */}
            <rect x="4" y="4" width="302" height="448" rx="14" fill="url(#fridgeSteel)" stroke="#22272b" strokeWidth="2" />

            {/* Upper Section: French Doors (2 Doors Left & Right) */}
            <rect x="10" y="12" width="141" height="295" rx="8" fill="url(#fridgeSteel)" stroke="#282f34" strokeWidth="2" />
            <rect x="157" y="12" width="141" height="295" rx="8" fill="url(#fridgeSteel)" stroke="#282f34" strokeWidth="2" />

            {/* Center seam dividing the 2 upper doors */}
            <line x1="154" y1="12" x2="154" y2="307" stroke="#121619" strokeWidth="4" />

            {/* Vertical Sleek Recessed Door Handles */}
            <rect x="138" y="100" width="7" height="110" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
            <rect x="163" y="100" width="7" height="110" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />

            {/* Smart Glass Tinted Panel on Left Door */}
            <rect x="22" y="32" width="117" height="135" rx="6" fill="#0f172a" opacity="0.92" stroke="#1e293b" strokeWidth="1.5" />
            {/* Digital Smart Screen on Fridge */}
            <rect x="32" y="44" width="97" height="50" rx="4" fill="#020617" />
            <circle cx="44" cy="58" r="3" fill="#38bdf8" />
            <line x1="52" y1="58" x2="115" y2="58" stroke="#38bdf8" strokeWidth="2" />
            <line x1="44" y1="72" x2="100" y2="72" stroke="#4ade80" strokeWidth="2" />
            <text x="35" y="85" fontFamily="monospace" fontSize="8" fill="#94a3b8">3°C | ECO ACTIVE</text>

            {/* Water & Crushed Ice Dispenser Nook */}
            <rect x="42" y="104" width="77" height="50" rx="4" fill="#1e293b" />
            <line x1="60" y1="124" x2="100" y2="124" stroke="#475569" strokeWidth="2" />
            <circle cx="80" cy="138" r="4" fill="#0284c7" />

            {/* Ambient Internal Glow seen through right door window edge */}
            <line x1="285" y1="20" x2="285" y2="300" stroke="#38bdf8" strokeWidth="2" opacity="0.4" />

            {/* Lower Freezer Drawer 1 */}
            <rect x="10" y="318" width="288" height="60" rx="8" fill="url(#fridgeSteel)" stroke="#282f34" strokeWidth="2" />
            <rect x="110" y="342" width="88" height="6" rx="3" fill="#cbd5e1" />

            {/* Lower Freezer Drawer 2 (Bottom) */}
            <rect x="10" y="386" width="288" height="60" rx="8" fill="url(#fridgeSteel)" stroke="#282f34" strokeWidth="2" />
            <rect x="110" y="410" width="88" height="6" rx="3" fill="#cbd5e1" />
          </g>

          {/* Kitchen Island / Marble Counter in Foreground */}
          <polygon points="0,320 540,320 500,500 0,500" fill="url(#marbleCounter)" opacity="0.95" />
          <line x1="0" y1="320" x2="540" y2="320" stroke="#ffffff" strokeWidth="3" />

          {/* Fresh Herbs Pot & Lemon bowl on counter */}
          <ellipse cx="280" cy="340" rx="35" ry="15" fill="#fde047" opacity="0.8" />
          <ellipse cx="300" cy="335" rx="30" ry="14" fill="#eab308" opacity="0.9" />
          <path d="M120,320 C110,280 140,260 150,290 C160,260 190,280 170,320 Z" fill="#15803d" opacity="0.85" />
        </svg>
      </div>

      {/* Atmospheric Vignette & Tint */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/20" />

      {/* Content Foreground */}
      <div className="relative z-10 p-6 md:p-12 lg:p-14 max-w-3xl space-y-5">
        <div className="flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider uppercase text-emerald-400">
          <Refrigerator className="w-4 h-4" />
          <span>Kulkas Pintar</span>
          <span className="text-stone-500">·</span>
          <span className="text-stone-300 normal-case font-normal">Manajemen Bahan & Resep Harian</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-white leading-tight">
          Isi Kulkas Jadi Menu Hari Ini
        </h1>

        <p className="text-sm md:text-base text-stone-300 leading-relaxed max-w-2xl">
          Kelola bahan makanan di Kulkas Pintarmu. Bahan yang paling mendesak dipakai akan ditandai prioritas, lalu sistem mencocokkan resep lezat yang cocok dengan isi kulkas, budget, dan waktumu.
        </p>

        {/* Feature Pills / Trust stats */}
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-stone-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Resep Otomatis dari Isi Kulkas</span>
          </div>
          <span className="text-stone-600 hidden sm:inline">·</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{detectedCount} Bahan Tersimpan di Kulkas</span>
          </div>
          <span className="text-stone-600 hidden sm:inline">·</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Zero Food Waste</span>
          </div>
        </div>

        {/* Interactive Buttons */}
        <div className="pt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onExploreFridgeClick}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs md:text-sm shadow-lg shadow-emerald-950/60 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Refrigerator className="w-4 h-4" />
            <span>Buka Kulkas Pintar ({detectedCount} Bahan)</span>
          </button>

          <button
            type="button"
            onClick={onPreferencesClick || (() => {
              const el = document.getElementById('preferences-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            })}
            className="px-5 py-3 rounded-2xl bg-stone-800/90 hover:bg-stone-700/90 text-stone-200 font-semibold text-xs md:text-sm border border-stone-700 backdrop-blur-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Utensils className="w-4 h-4 text-emerald-400" />
            <span>Atur Budget & Waktu Masak</span>
          </button>
        </div>
      </div>
    </div>
  );
};
