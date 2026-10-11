import React, { useState } from 'react';
import { KeyRound, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { db } from '../services/db';
import { User } from '../types';

interface ChangePasswordModalProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword.trim()) {
      setError('Silakan masukkan kata sandi baru.');
      return;
    }

    if (newPassword.length < 4) {
      setError('Kata sandi baru minimal 4 karakter agar aman.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi kata sandi baru tidak cocok. Periksa kembali.');
      return;
    }

    setLoading(true);
    const result = await db.changePassword(currentUser.id, oldPassword, newPassword.trim());
    setLoading(false);

    if (result.success) {
      onSuccess('Kata sandi akun berhasil diperbarui! Anda dapat menggunakannya di HP atau perangkat lain.');
      onClose();
    } else {
      setError(result.error || 'Gagal mengubah kata sandi. Pastikan kata sandi lama benar.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl w-full max-w-md shadow-2xl relative my-auto max-h-[92vh] flex flex-col overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Pinned Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-stone-800 shrink-0 relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center text-xl text-emerald-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Ubah Kata Sandi Akun</h3>
              <p className="text-xs text-stone-400">
                Profil: <strong className="text-stone-200">{currentUser.name}</strong> ({currentUser.email})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-white p-2 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 rounded-2xl bg-stone-950/60 border border-stone-800/80 text-[11px] text-stone-300 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Kata sandi baru akan otomatis tersinkronisasi ke server sehingga Anda dapat langsung login di HP atau komputer lain dengan sandi baru ini.
            </span>
          </div>

          {/* 1. Kata Sandi Lama */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Kata Sandi Lama (Opsional jika belum pernah membuat sandi)
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Masukkan kata sandi lama Anda"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-emerald-500 placeholder-stone-600 font-mono tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-1 rounded-lg transition-colors cursor-pointer"
                title={showOldPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
              >
                {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 2. Kata Sandi Baru */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Kata Sandi Baru <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 4 karakter atau angka PIN"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-emerald-500 placeholder-stone-600 font-mono tracking-wider"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-1 rounded-lg transition-colors cursor-pointer"
                title={showNewPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 3. Konfirmasi Kata Sandi Baru */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Konfirmasi Kata Sandi Baru <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-emerald-500 placeholder-stone-600 font-mono tracking-wider"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-1 rounded-lg transition-colors cursor-pointer"
                title={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {newPassword && confirmPassword && (
              <p className={`text-[11px] mt-1.5 font-medium ${newPassword === confirmPassword ? 'text-emerald-400' : 'text-rose-400'}`}>
                {newPassword === confirmPassword ? '✓ Kata sandi cocok' : '✗ Kata sandi belum cocok'}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-sm shadow-xl shadow-emerald-950/60 transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-400/30 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Menyimpan Kata Sandi...' : 'Simpan Kata Sandi Baru'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-stone-400 hover:text-stone-200 text-xs font-semibold hover:bg-stone-800/60 transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
