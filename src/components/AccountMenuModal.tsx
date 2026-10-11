import React, { useState } from 'react';
import { User as UserIcon, X, LogOut, Users, Trash2, Download, Upload, ShieldCheck, Database, Check, KeyRound } from 'lucide-react';
import { db } from '../services/db';
import { User } from '../types';

interface AccountMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onOpenSwitchAccount: () => void;
  onOpenChangePassword?: () => void;
  onClearFridge: () => void;
  onDataImported: () => void;
  onLogout: () => void;
  ingredientCount: number;
  favoriteCount: number;
  shoppingCount: number;
}

export const AccountMenuModal: React.FC<AccountMenuModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenSwitchAccount,
  onOpenChangePassword,
  onClearFridge,
  onDataImported,
  onLogout,
  ingredientCount,
  favoriteCount,
  shoppingCount,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copiedBackup, setCopiedBackup] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleDownloadBackup = () => {
    try {
      const json = db.exportBackup(currentUser.id);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kulkas-${currentUser.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setCopiedBackup(true);
      setTimeout(() => setCopiedBackup(false), 3000);
    } catch (err) {
      console.error('Failed to export backup:', err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const res = db.importBackup(currentUser.id, text);
        if (res.success) {
          setImportStatus('Data kulkas berhasil dipulihkan dari berkas cadangan!');
          onDataImported();
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus(`Gagal impor: ${res.error}`);
        }
      } catch {
        setImportStatus('Berkas tidak dapat dibaca.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl w-full max-w-md shadow-2xl relative my-auto max-h-[92vh] flex flex-col overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Pinned Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-stone-800 shrink-0 relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-stone-700 flex items-center justify-center text-2xl shadow-inner">
              {currentUser.avatar || '👨‍🍳'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">{currentUser.name}</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <p className="text-xs text-stone-400">{currentUser.email}</p>
              <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-emerald-400 font-medium">
                <Database className="w-3 h-3" />
                <span>Database Kulkas Aktif</span>
              </div>
            </div>
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-white p-2 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Account Stats */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-2.5 bg-stone-950/70 rounded-2xl border border-stone-800 text-center">
              <span className="text-xs text-stone-400 block">Isi Kulkas</span>
              <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono mt-0.5 block">{ingredientCount}</span>
              <span className="text-[10px] text-stone-300">Bahan</span>
            </div>
            <div className="p-2.5 bg-stone-950/70 rounded-2xl border border-stone-800 text-center">
              <span className="text-xs text-stone-400 block">Favorit</span>
              <span className="text-base sm:text-lg font-bold text-amber-400 font-mono mt-0.5 block">{favoriteCount}</span>
              <span className="text-[10px] text-stone-300">Resep</span>
            </div>
            <div className="p-2.5 bg-stone-950/70 rounded-2xl border border-stone-800 text-center">
              <span className="text-xs text-stone-400 block">Belanja</span>
              <span className="text-base sm:text-lg font-bold text-cyan-400 font-mono mt-0.5 block">{shoppingCount}</span>
              <span className="text-[10px] text-stone-300">Item</span>
            </div>
          </div>

          {importStatus && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs">
              {importStatus}
            </div>
          )}

          {/* Action List */}
          <div className="space-y-2">
            {/* Switch Account */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSwitchAccount();
              }}
              className="w-full p-3 rounded-2xl bg-stone-950 hover:bg-stone-800 border border-stone-800 transition-all flex items-center justify-between text-left text-xs text-stone-200 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-semibold block text-stone-100">Ganti Akun / Masuk Akun Lain</span>
                  <span className="text-[11px] text-stone-300">Beralih ke kulkas akun yang berbeda</span>
                </div>
              </div>
              <span className="text-stone-300 text-xs font-semibold">Pilih &rarr;</span>
            </button>

            {/* Change Password */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenChangePassword?.();
              }}
              className="w-full p-3 rounded-2xl bg-stone-950 hover:bg-stone-800 border border-stone-800 transition-all flex items-center justify-between text-left text-xs text-stone-200 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="font-semibold block text-stone-100">Ubah Kata Sandi / PIN</span>
                  <span className="text-[11px] text-stone-300">Ganti kata sandi akun untuk akses di HP lain</span>
                </div>
              </div>
              <span className="text-stone-300 text-xs font-semibold">Ubah &rarr;</span>
            </button>

            {/* Empty Fridge */}
            {!confirmClear ? (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="w-full p-3 rounded-2xl bg-stone-950 hover:bg-rose-950/30 border border-stone-800 hover:border-rose-800/40 transition-all flex items-center justify-between text-left text-xs text-stone-200 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <div>
                    <span className="font-semibold block text-rose-300">Kosongkan Semua Isi Kulkas</span>
                    <span className="text-[11px] text-stone-300">Hapus semua bahan di akun ini agar bersih</span>
                  </div>
                </div>
                <span className="text-stone-300 text-xs">Hapus</span>
              </button>
            ) : (
              <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-800/60 space-y-2">
                <p className="text-xs text-rose-200 font-medium">
                  Yakin ingin mengosongkan semua isi kulkas akun ini? Tindakan ini tidak bisa dibatalkan.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClearFridge();
                      setConfirmClear(false);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
                  >
                    Ya, Kosongkan Kulkas
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 text-stone-300 text-xs hover:bg-stone-700 cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            {/* Backup Data */}
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="w-full p-3 rounded-2xl bg-stone-950 hover:bg-stone-800 border border-stone-800 transition-all flex items-center justify-between text-left text-xs text-stone-200 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {copiedBackup ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-cyan-400" />}
                <div>
                  <span className="font-semibold block text-stone-100">Unduh Cadangan (Backup JSON)</span>
                  <span className="text-[11px] text-stone-300">Simpan salinan isi kulkas ke file</span>
                </div>
              </div>
              <span className="text-stone-300 text-xs">Unduh</span>
            </button>

            {/* Import Data */}
            <label className="w-full p-3 rounded-2xl bg-stone-950 hover:bg-stone-800 border border-stone-800 transition-all flex items-center justify-between text-left text-xs text-stone-200 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Upload className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="font-semibold block text-stone-100">Pulihkan / Impor Cadangan</span>
                  <span className="text-[11px] text-stone-300">Muat data dari berkas JSON sebelumnya</span>
                </div>
              </div>
              <span className="text-stone-300 text-xs">Pilih File</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Pinned Footer Logout */}
        <div className="p-4 sm:p-5 border-t border-stone-800 shrink-0 bg-stone-950/80 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar dari Akun (Logout)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
