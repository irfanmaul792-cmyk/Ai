import React from "react";
import { ShoppingBag, Bookmark, User as UserIcon, LogOut, Calendar } from "lucide-react";
import { User } from "../types";

interface NavbarProps {
  onScanClick: () => void;
  onFridgeClick: () => void;
  onPreferencesClick?: () => void;
  onShoppingListClick?: () => void;
  shoppingItemCount?: number;
  onFavoritesClick?: () => void;
  favoritesCount?: number;
  onWeeklyPlanClick?: () => void;
  weeklyPlanCount?: number;
  geminiConnected?: boolean | null;
  currentUser?: User | null;
  onAccountClick?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onScanClick,
  onFridgeClick,
  onPreferencesClick,
  onShoppingListClick,
  shoppingItemCount = 0,
  onFavoritesClick,
  favoritesCount = 0,
  onWeeklyPlanClick,
  weeklyPlanCount = 0,
  geminiConnected,
  currentUser,
  onAccountClick,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EBE6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="/"
          className="group flex flex-col shrink-0"
        >
          <span className="text-2xl font-bold font-serif-editorial tracking-tight text-[#262220] group-hover:text-[#C2593F] transition-colors leading-none">
            Isi Kulkasku
          </span>
          <span className="text-[10px] tracking-widest uppercase text-[#8C827A] font-medium mt-0.5">
            Minimalist Kitchen & Recipes
          </span>
        </a>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs lg:text-sm font-medium text-[#59524C]">
          <button
            type="button"
            onClick={onFridgeClick}
            className="hover:text-[#262220] font-semibold text-[#C2593F] transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            Kulkas Pintar
          </button>
          {onWeeklyPlanClick && (
            <button
              type="button"
              onClick={onWeeklyPlanClick}
              className="hover:text-[#262220] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 text-[#262220] font-semibold"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C2593F]" />
              <span>Jadwal Masak</span>
              {weeklyPlanCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#F7EDE8] text-[#8C3A27] font-bold">
                  {weeklyPlanCount}
                </span>
              )}
            </button>
          )}
          <button
            type="button"
            onClick={onPreferencesClick || (() => {
              const el = document.getElementById("preferences-section");
              el?.scrollIntoView({ behavior: "smooth" });
            })}
            className="hover:text-[#262220] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Preferensi Masak
          </button>
          <a
            href="#recipes-section"
            className="hover:text-[#262220] transition-colors whitespace-nowrap shrink-0"
          >
            Resep Minimalis
          </a>
          <a
            href="#zerowaste-section"
            className="hover:text-[#262220] transition-colors whitespace-nowrap shrink-0"
          >
            Tips Nol Limbah
          </a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Weekly Plan Button */}
          {onWeeklyPlanClick && (
            <button
              type="button"
              onClick={onWeeklyPlanClick}
              className="relative p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl text-[#3D3733] hover:text-[#C2593F] hover:bg-[#F0EDE8] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Buka Jadwal Masak Mingguan"
            >
              <Calendar className="w-4 h-4 text-[#C2593F]" />
              <span className="hidden sm:inline">Jadwal</span>
              {weeklyPlanCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#C2593F] text-white text-[10px] font-bold flex items-center justify-center">
                  {weeklyPlanCount}
                </span>
              )}
            </button>
          )}

          {/* Shopping List Button */}
          {onShoppingListClick && (
            <button
              type="button"
              onClick={onShoppingListClick}
              className="relative p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl text-[#3D3733] hover:text-[#C2593F] hover:bg-[#F0EDE8] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Buka Daftar Belanja Bahan"
            >
              <ShoppingBag className="w-4 h-4 text-[#C2593F]" />
              <span className="hidden sm:inline">Belanja</span>
              {shoppingItemCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#C2593F] text-white text-[10px] font-bold flex items-center justify-center">
                  {shoppingItemCount}
                </span>
              )}
            </button>
          )}

          {/* Favorites Button */}
          {onFavoritesClick && (
            <button
              type="button"
              onClick={onFavoritesClick}
              className="relative p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl text-[#3D3733] hover:text-[#C2593F] hover:bg-[#F0EDE8] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Lihat Resep Favorit Tersimpan"
            >
              <Bookmark className={`w-4 h-4 ${favoritesCount > 0 ? "text-[#C2593F] fill-[#C2593F]" : "text-stone-400"}`} />
              <span className="hidden sm:inline">Favorit</span>
              {favoritesCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#D9943B] text-white text-[10px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>
          )}

          {/* User Account / Database Profile */}
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              {onAccountClick && (
                <button
                  type="button"
                  onClick={onAccountClick}
                  className="px-2.5 py-1.5 rounded-xl border border-[#DDD8D0] bg-white hover:bg-[#FAF8F5] text-[#262220] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  title="Kelola Akun & Database Kulkas"
                >
                  <span className="w-6 h-6 rounded-lg bg-[#F5EDE8] flex items-center justify-center text-sm">
                    {currentUser.avatar || "👨‍🍳"}
                  </span>
                  <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
                </button>
              )}
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 sm:px-2.5 py-1.5 rounded-xl border border-[#DDD8D0] bg-white hover:bg-rose-50 text-stone-600 hover:text-rose-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  title="Keluar dari akun kulkas"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Keluar</span>
                </button>
              )}
            </div>
          ) : (
            onAccountClick && (
              <button
                type="button"
                onClick={onAccountClick}
                className="px-3.5 py-2 rounded-xl bg-[#C2593F] hover:bg-[#A64830] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>Masuk / Daftar</span>
              </button>
            )
          )}

          <button
            type="button"
            onClick={onScanClick}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#262220] rounded-xl hover:bg-[#C2593F] transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          >
            Cari Menu Resep
          </button>
        </div>
      </div>
    </header>
  );
};
