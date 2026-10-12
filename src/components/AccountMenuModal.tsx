import React, { useState } from 'react';
import { User as UserIcon, X, LogOut, Users, Trash2, Download, Upload, ShieldCheck, Database, Check, KeyRound, Smartphone, Copy, ExternalLink } from 'lucide-react';
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
  onDeleteAccount?: () => void;
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
  onDeleteAccount,
  ingredientCount,
  favoriteCount,
  shoppingCount,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [showPairCard, setShowPairCard] = useState(false);
  const [pairCode, setPairCode] = useState<string | null>(null);
  const [pairLoading, setPairLoading] = useState(false);
  const [copiedPairLink, setCopiedPairLink] = useState(false);
  const [copiedPairCode, setCopiedPairCode] = useState(false);
  const [copiedPairToken, setCopiedPairToken] = useState(false);

  if (!isOpen || !currentUser) return null;

  // Generate instant client-side link & token that work without server
  const directLink = typeof window !== 'undefined' ? db.generateDirectSyncUrl(currentUser.id) : '';
  const directToken = db.generateDirectSyncToken(currentUser.id);

  const handleGeneratePairCode = async () => {
    setShowPairCard(prev => !prev);
    if (!pairCode && !pairLoading) {
      setPairLoading(true);
      const res = await db.generatePairCode(currentUser.id);
      setPairLoading(false);
      if (res.success && res.code) {
        setPairCode(res.code);
      }
    }
  };

  const handleCopyPairCode = () => {
    if (!pairCode) return;
    navigator.clipboard.writeText(pairCode);
    setCopiedPairCode(true);
    setTimeout(() => setCopiedPairCode(false), 2500);
  };

  const handleCopyPairLink = () => {
    if (!directLink) return;
    navigator.clipboard.writeText(directLink);
    setCopiedPairLink(true);
    setTimeout(() => setCopiedPairLink(false), 2500);
  };

  const handleCopyPairToken = () => {
    if (!directToken) return;
    navigator.clipboard.writeText(directToken);
    setCopiedPairToken(true);
    setTimeout(() => setCopiedPairToken(false), 2500);
  };

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
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Akun Aktif</span>
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
            {/* Tautkan Akun ke HP / Perangkat Lain */}
            <div className="rounded-2xl border border-emerald-800/60 bg-gradient-to-br from-emerald-950/70 to-stone-950 overflow-hidden shadow-lg">
              <button
                type="button"
                onClick={handleGeneratePairCode}
                className="w-full p-3.5 transition-all flex items-center justify-between text-left text-xs cursor-pointer hover:bg-emerald-900/30"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-800/80 text-emerald-200 flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-emerald-300 text-xs sm:text-sm">Tautkan ke HP / Perangkat Lain</span>
                    <span className="text-[11px] text-stone-300">Buka akun & isi kulkas ini di smartphone Anda</span>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold text-xs shrink-0 px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-700/60">
                  {showPairCard ? 'Tutup ▲' : 'Buka Kode 📲'}
                </span>
              </button>

              {showPairCard && (
                <div className="p-4 border-t border-emerald-900/60 bg-stone-950/90 space-y-3.5 animate-fade-in">
                  {/* Cara 1: Link Cepat HP (Paling Praktis, 100% Selalu Berhasil) */}
                  <div className="p-3 rounded-2xl bg-stone-900 border border-emerald-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Cara 1: Buka Lewat Link Cepat HP (Otomatis Masuk)</span>
                      </span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-800">
                        Rekomendasi
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-300 leading-relaxed">
                      Salin link ini dan kirim ke HP Anda (via WhatsApp/catatan/browser). Begitu link dibuka di HP, akun &amp; isi kulkas langsung aktif instan!
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyPairLink}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-950/50"
                    >
                      {copiedPairLink ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedPairLink ? '✓ Link Cepat Berhasil Disalin!' : '📋 Salin Link Cepat untuk HP'}</span>
                    </button>
                  </div>

                  {/* Cara 2: Kode Tautan / Token (Untuk Ditempel di Layar Masuk HP) */}
                  <div className="p-3 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-2">
                    <span className="text-[11px] font-bold text-stone-300 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Cara 2: Tempel Token / Kode di HP</span>
                    </span>
                    <p className="text-[11px] text-stone-300 leading-relaxed">
                      Salin kode token akun ini, lalu tempelkan pada kotak <em>&quot;Tautkan Akun dari Laptop&quot;</em> di layar Masuk HP Anda:
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyPairToken}
                      className="w-full py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
                    >
                      {copiedPairToken ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPairToken ? '✓ Token Akun Tersalin!' : 'Salin Token Akun'}</span>
                    </button>
                  </div>

                  {/* Opsional: Kode 6-Angka jika server terhubung */}
                  {pairCode && (
                    <div className="p-3 rounded-2xl bg-stone-900/50 border border-stone-800/80 text-center space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">
                        Kode Sinkronisasi 6-Angka
                      </span>
                      <div className="text-2xl font-mono font-black tracking-widest text-emerald-300 select-all">
                        {pairCode}
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyPairCode}
                        className="py-1 px-3 text-[11px] text-stone-400 hover:text-emerald-300 transition-colors cursor-pointer"
                      >
                        {copiedPairCode ? '✓ Kode Tersalin' : 'Salin 6-Angka'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

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
                  <span className="text-[11px] text-stone-300">Beralih ke profil akun yang berbeda</span>
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
                  <span className="text-[11px] text-stone-300">Perbarui kata sandi untuk keamanan akun Anda</span>
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
                    <span className="text-[11px] text-stone-300">Hapus seluruh daftar bahan makanan saat ini</span>
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

            {/* Hapus Akun Ini dari Perangkat */}
            {!confirmDeleteAccount ? (
              <button
                type="button"
                onClick={() => setConfirmDeleteAccount(true)}
                className="w-full p-3 rounded-2xl bg-stone-950 hover:bg-rose-950/30 border border-stone-800 hover:border-rose-900/50 transition-all flex items-center justify-between text-left text-xs text-stone-200 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  <div>
                    <span className="font-semibold block text-rose-300">Hapus Akun Ini dari Perangkat</span>
                    <span className="text-[11px] text-stone-400">Hapus profil {currentUser.name} beserta seluruh datanya di HP ini</span>
                  </div>
                </div>
                <span className="text-rose-400 text-xs font-semibold">Hapus &rarr;</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 space-y-2.5">
                <p className="text-xs text-rose-200 font-medium">
                  Yakin ingin menghapus akun <strong>&quot;{currentUser.name}&quot;</strong> dari perangkat ini? Data kulkas akun ini akan dihapus permanen.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteAccount?.();
                      setConfirmDeleteAccount(false);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-md"
                  >
                    Ya, Hapus Akun Ini
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteAccount(false)}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 text-stone-300 text-xs hover:bg-stone-700 cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
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
