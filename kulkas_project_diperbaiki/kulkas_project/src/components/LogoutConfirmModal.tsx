import React from 'react';
import { LogOut, X } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative my-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-1.5 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-950/70 border border-amber-800/60 text-amber-400 flex items-center justify-center mb-4">
          <LogOut className="w-6 h-6 text-amber-400" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
          Keluar dari Akun?
        </h3>

        <p className="text-xs text-stone-300 leading-relaxed mb-3">
          Apakah Anda yakin ingin keluar dari akun {userName ? <strong className="text-white">&quot;{userName}&quot;</strong> : 'kulkas Anda'}?
        </p>

        <p className="text-[11px] text-stone-400 leading-relaxed mb-5">
          Seluruh daftar bahan makanan, catatan resep, dan preferensi Anda tetap tersimpan aman di perangkat ini. Anda dapat masuk kembali kapan saja.
        </p>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all cursor-pointer"
          >
            Tidak
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Iya, Yakin Keluar
          </button>
        </div>
      </div>
    </div>
  );
};
