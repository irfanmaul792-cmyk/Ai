import React from 'react';
import { ShoppingBag, Bookmark } from 'lucide-react';

interface NavbarProps {
  onScanClick: () => void;
  onFridgeClick: () => void;
  onPreferencesClick?: () => void;
  onShoppingListClick?: () => void;
  shoppingItemCount?: number;
  onFavoritesClick?: () => void;
  favoritesCount?: number;
  geminiConnected?: boolean | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  onScanClick,
  onFridgeClick,
  onPreferencesClick,
  onShoppingListClick,
  shoppingItemCount = 0,
  onFavoritesClick,
  favoritesCount = 0,
  geminiConnected,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F8F7F3]/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="/"
          className="text-xl font-bold font-display tracking-tight text-stone-900 whitespace-nowrap shrink-0 hover:text-emerald-800 transition-colors"
        >
          Isi Kulkasku
        </a>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs lg:text-sm font-medium text-stone-600">
          <button
            type="button"
            onClick={onFridgeClick}
            className="hover:text-stone-950 font-semibold text-emerald-800 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            Kulkas Pintar
          </button>
          <button
            type="button"
            onClick={onPreferencesClick || (() => {
              const el = document.getElementById('preferences-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            })}
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Preferensi Masak
          </button>
          <a
            href="#recipes-section"
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0"
          >
            Rekomendasi Resep
          </a>
          <a
            href="#zerowaste-section"
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0"
          >
            Tips Hemat Pangan
          </a>
        </nav>

        {/* Zone 3: Actions (Shopping List, Favorites, Status, Search) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Opsi 1: Shopping List Button */}
          {onShoppingListClick && (
            <button
              type="button"
              onClick={onShoppingListClick}
              className="relative p-2 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-xl text-stone-700 hover:text-emerald-800 hover:bg-stone-200/60 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Buka Daftar Belanja Bahan"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">Belanja</span>
              {shoppingItemCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center">
                  {shoppingItemCount}
                </span>
              )}
            </button>
          )}

          {/* Opsi 3: Favorites Button */}
          {onFavoritesClick && (
            <button
              type="button"
              onClick={onFavoritesClick}
              className="relative p-2 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-xl text-stone-700 hover:text-amber-800 hover:bg-stone-200/60 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Lihat Resep Favorit Tersimpan"
            >
              <Bookmark className={`w-4 h-4 ${favoritesCount > 0 ? 'text-amber-600 fill-amber-500' : 'text-stone-500'}`} />
              <span className="hidden sm:inline">Favorit</span>
              {favoritesCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>
          )}

          {geminiConnected !== false ? (
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100/90 text-emerald-900 border border-emerald-300/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Chef Aktif</span>
            </span>
          ) : (
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-200 text-stone-700">
              <span>Mode Lokal</span>
            </span>
          )}

          <button
            type="button"
            onClick={onScanClick}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 rounded-xl hover:bg-emerald-700 transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          >
            Cari Menu Resep
          </button>
        </div>
      </div>
    </header>
  );
};
