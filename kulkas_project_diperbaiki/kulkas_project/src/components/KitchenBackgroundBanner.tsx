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
    <div className="relative w-full rounded-3xl overflow-hidden bg-[#241F1D] text-white shadow-xl border border-[#3D3531]">
      {/* Background SVG Canvas: Warm Minimalist Culinary Studio Kitchen with Artisanal Cookware & Linen */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-45 md:opacity-55">
        <svg
          viewBox="0 0 1200 500"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wallWarm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3A322D" />
              <stop offset="100%" stopColor="#221C19" />
            </linearGradient>
            <linearGradient id="warmWood" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#544336" />
              <stop offset="50%" stopColor="#695343" />
              <stop offset="100%" stopColor="#48392D" />
            </linearGradient>
            <linearGradient id="linenCounter" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E8E2D9" />
              <stop offset="50%" stopColor="#F5F0E8" />
              <stop offset="100%" stopColor="#D9D2C7" />
            </linearGradient>
            <radialGradient id="morningLight" cx="90%" cy="15%" r="65%">
              <stop offset="0%" stopColor="#FFF4D6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FFF4D6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Warm Studio Wall */}
          <rect width="1200" height="500" fill="url(#wallWarm)" />

          {/* Diffused Morning Sun Beam */}
          <rect width="1200" height="500" fill="url(#morningLight)" />

          {/* Open Wooden Kitchen Shelving with Ceramic Jars & Olive Oil */}
          <rect x="700" y="70" width="450" height="18" rx="4" fill="url(#warmWood)" />
          {/* Ceramic Olive Oil Cruet */}
          <path d="M740,70 L755,70 L752,32 L743,32 Z" fill="#D9943B" opacity="0.85" />
          <path d="M745,32 L750,32 L749,18 L746,18 Z" fill="#C2593F" />
          {/* Artisanal Ceramic Spice Pots */}
          <rect x="780" y="30" width="38" height="40" rx="6" fill="#E8E2D9" opacity="0.9" />
          <rect x="830" y="24" width="44" height="46" rx="6" fill="#C87A5B" opacity="0.85" />
          <rect x="890" y="34" width="34" height="36" rx="5" fill="#6E7E63" opacity="0.85" />
          {/* Stack of Handmade Plates */}
          <ellipse cx="980" cy="65" rx="36" ry="6" fill="#E5DFD5" />
          <ellipse cx="980" cy="60" rx="34" ry="5" fill="#FAF8F5" />
          <ellipse cx="980" cy="55" rx="32" ry="5" fill="#EAE5DC" />

          {/* Second Shelf */}
          <rect x="740" y="150" width="410" height="16" rx="4" fill="url(#warmWood)" />
          {/* Clear Glass Herb Jars with Green Leaves */}
          <rect x="770" y="115" width="28" height="35" rx="4" fill="#A4B29E" opacity="0.7" />
          <rect x="815" y="110" width="32" height="40" rx="4" fill="#E2BA7D" opacity="0.75" />
          <rect x="865" y="118" width="30" height="32" rx="4" fill="#C87A5B" opacity="0.7" />

          {/* Sleek Minimalist Matte Charcoal Fridge in Background */}
          <g transform="translate(100, 40)">
            <rect x="0" y="0" width="240" height="450" rx="14" fill="#1C1816" stroke="#3A332F" strokeWidth="2" />
            {/* Top Door */}
            <rect x="8" y="8" width="224" height="280" rx="8" fill="#28221E" stroke="#38302B" strokeWidth="1.5" />
            <rect x="216" y="90" width="6" height="80" rx="3" fill="#D9D2C7" opacity="0.7" />
            {/* Warm Glass Glow Window */}
            <rect x="22" y="24" width="180" height="130" rx="6" fill="#151210" opacity="0.85" />
            <text x="36" y="52" fontFamily="serif" fontSize="11" fill="#E8D9CD" fontWeight="600">PANTRY & CHILL</text>
            <text x="36" y="70" fontFamily="sans-serif" fontSize="9" fill="#9C8F85">Organized · Fresh · Zero Waste</text>
            {/* Soft inner shelf lines */}
            <line x1="30" y1="88" x2="190" y2="88" stroke="#D9943B" strokeWidth="1" opacity="0.3" />
            <line x1="30" y1="120" x2="190" y2="120" stroke="#7A8B71" strokeWidth="1" opacity="0.3" />
            {/* Bottom Drawer */}
            <rect x="8" y="296" width="224" height="138" rx="8" fill="#28221E" stroke="#38302B" strokeWidth="1.5" />
            <rect x="80" y="320" width="80" height="5" rx="2" fill="#D9D2C7" opacity="0.6" />
          </g>

          {/* Artisanal Travertine & Linen Counter Foreground */}
          <polygon points="360,280 1200,280 1200,500 300,500" fill="url(#linenCounter)" opacity="0.95" />
          <line x1="360" y1="280" x2="1200" y2="280" stroke="#FFFFFF" strokeWidth="2" />

          {/* Cast Iron Skillet with Sizzling Ingredients */}
          <ellipse cx="640" cy="380" rx="85" ry="32" fill="#1F1B19" />
          <ellipse cx="640" cy="377" rx="76" ry="27" fill="#C2593F" opacity="0.8" />
          {/* Skillet Handle */}
          <rect x="520" y="375" width="45" height="10" rx="4" fill="#1F1B19" transform="rotate(-15 540 380)" />
          {/* Fresh Rosemary Sprig */}
          <path d="M780,360 Q810,340 845,355 Q820,375 780,360 Z" fill="#5D7052" opacity="0.9" />
          {/* Farm Fresh Brown Eggs in small ceramic bowl */}
          <ellipse cx="940" cy="365" rx="42" ry="18" fill="#EAE5DC" />
          <ellipse cx="930" cy="358" rx="12" ry="8" fill="#DDB288" />
          <ellipse cx="952" cy="356" rx="11" ry="8" fill="#CE9E71" />
          <ellipse cx="942" cy="368" rx="12" ry="7" fill="#E5C7A5" />
        </svg>
      </div>

      {/* Atmospheric Warm Vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1E1917] via-[#241F1D]/90 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1E1917] via-transparent to-black/10" />

      {/* Content Foreground in Minimalist Baker Editorial Style */}
      <div className="relative z-10 p-6 md:p-12 lg:p-14 max-w-3xl space-y-5">
        {/* Editorial Eyebrow */}
        <div className="flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider uppercase text-[#DDB288]">
          <span className="font-serif-editorial text-base italic">Dapur Praktis & Cerdas</span>
          <span className="text-[#8C827A]">·</span>
          <span className="text-[#D9D2C7] normal-case font-normal">Manajemen Bahan & Resep Cepat</span>
        </div>

        {/* Display Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-editorial tracking-tight text-[#FAF8F5] leading-[1.15]">
          Bahan Sederhana, Rasa Istimewa.
        </h1>

        <p className="text-sm md:text-base text-[#D9D2C7] leading-relaxed max-w-2xl font-light">
          Olah apa yang ada di kulkasmu hari ini dengan konsep dapur praktis: resep dibuat sederhana dengan <span className="underline decoration-[#C2593F] underline-offset-4">10 bahan atau kurang</span>, <span className="underline decoration-[#C2593F] underline-offset-4">30 menit atau kurang</span>, atau cukup <span className="underline decoration-[#C2593F] underline-offset-4">1 wajan saja</span>.
        </p>

        {/* Minimalist Baker Tri-Pillars Unboxed Strip */}
        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#D9D2C7]">
          <span className="text-white font-medium">★ 10 Bahan atau Kurang</span>
          <span className="text-[#8C827A]" aria-hidden="true">·</span>
          <span className="text-white font-medium">★ 30 Menit Kilat</span>
          <span className="text-[#8C827A]" aria-hidden="true">·</span>
          <span className="text-white font-medium">★ 1 Wajan / Panci</span>
          <span className="text-[#8C827A]" aria-hidden="true">·</span>
          <span className="text-[#DDB288] font-medium">{detectedCount} Bahan di Kulkas</span>
        </div>

        {/* Interactive Buttons */}
        <div className="pt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onExploreFridgeClick}
            className="px-6 py-3 rounded-2xl bg-[#C2593F] hover:bg-[#A64830] text-white font-semibold text-xs md:text-sm shadow-lg shadow-black/40 flex items-center gap-2 transition-all cursor-pointer"
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
            className="px-5 py-3 rounded-2xl bg-[#3D3531]/80 hover:bg-[#4E433E] text-[#FAF8F5] font-semibold text-xs md:text-sm border border-[#594D46] backdrop-blur-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Utensils className="w-4 h-4 text-[#DDB288]" />
            <span>Atur Waktu & Porsi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
