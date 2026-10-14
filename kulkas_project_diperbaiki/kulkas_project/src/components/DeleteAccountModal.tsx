import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  accountName: string;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  accountName,
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

        <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800/80 text-rose-400 flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6 text-rose-400" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
          Hapus Akun Tersimpan?
        </h3>

        <p className="text-xs text-stone-300 leading-relaxed mb-3">
          Apakah Anda yakin ingin menghapus profil akun <strong className="text-white">&quot;{accountName}&quot;</strong> dari perangkat ini?
        </p>

        <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-900/40 text-[11px] text-rose-300 leading-relaxed mb-5 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <span>Seluruh daftar isi kulkas, riwayat belanja, dan resep tersimpan akun ini akan dihapus permanen.</span>
        </div>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all cursor-pointer"
          >
            Tidak / Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Ya, Hapus Akun
          </button>
        </div>
      </div>
    </div>
  );
};
