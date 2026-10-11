import React, { useState, useEffect } from 'react';
import { User as UserIcon, LogIn, UserPlus, Users, X, Shield, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { db } from '../services/db';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserChanged: (user: User) => void;
  initialMode?: 'login' | 'register' | 'switch';
}

const AVATAR_OPTIONS = ['👨‍🍳', '👩‍🍳', '🍳', '🥗', '🍲', '🥑', '🥩', '🧀', '🏡', '🌟'];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
  initialMode = 'switch',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'switch'>(() => {
    const users = db.getUsers();
    if (users.length === 0) return 'register';
    return initialMode;
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👨‍🍳');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userListVersion, setUserListVersion] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const users = db.getUsers();
      if (users.length === 0) {
        setMode('register');
      } else if (initialMode) {
        setMode(initialMode);
      } else if (!currentUser) {
        setMode('login');
      }
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, initialMode, currentUser]);

  if (!isOpen) return null;

  const handleDeleteAccount = (userId: string, userName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Hapus akun "${userName}" beserta seluruh data kulkasnya dari perangkat ini?`)) {
      db.deleteUser(userId);
      setUserListVersion(v => v + 1);
      setError(null);
      setSuccess(`Akun "${userName}" berhasil dihapus.`);
      if (currentUser?.id === userId) {
        db.logout();
        window.location.reload();
      }
    }
  };

  const allUsers = db.getUsers();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!email) {
      setError('Masukkan email atau nama akun Anda.');
      return;
    }

    setLoading(true);
    const res = await db.loginUser(email, password || 'default');
    setLoading(false);

    if (res.success && res.user) {
      setSuccess(`Selamat datang kembali, ${res.user.name}!`);
      setTimeout(() => {
        onUserChanged(res.user!);
        onClose();
      }, 700);
    } else {
      setError(res.error || 'Gagal masuk. Periksa kembali akun Anda.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Nama lengkap / nama dapur wajib diisi.');
      return;
    }
    if (!email.trim()) {
      setError('Email atau ID pengguna wajib diisi.');
      return;
    }

    setLoading(true);
    const res = await db.registerUser(name, email, password || 'default', selectedAvatar);
    setLoading(false);

    if (res.success && res.user) {
      setSuccess(`Akun "${res.user.name}" berhasil dibuat dengan kulkas bersih & kosong!`);
      setTimeout(() => {
        onUserChanged(res.user!);
        onClose();
      }, 800);
    } else {
      setError(res.error || 'Gagal mendaftar akun.');
    }
  };

  const handleQuickSwitch = (userId: string) => {
    const user = db.switchUser(userId);
    if (user) {
      setSuccess(`Beralih ke akun ${user.name}...`);
      setTimeout(() => {
        onUserChanged(user);
        onClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl w-full max-w-lg shadow-2xl relative my-auto max-h-[92vh] flex flex-col overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Pinned Header */}
        <div className="p-5 sm:p-6 pb-3 border-b border-stone-800/80 shrink-0 relative">
          {/* Close Button - Only available if user is already logged in */}
          {currentUser && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-stone-400 hover:text-white p-2 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Database Akun Mandiri</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
            {mode === 'switch' && 'Pilih / Ganti Akun Kulkas'}
            {mode === 'login' && 'Masuk ke Kulkas Anda'}
            {mode === 'register' && 'Daftar Akun Kulkas Baru'}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Setiap akun memiliki kulkas dan catatan menu tersendiri di perangkat Anda.
          </p>

          {/* Mode Selector Tabs */}
          <div className="flex p-1 bg-stone-950 rounded-2xl border border-stone-800 mt-3.5">
            <button
              type="button"
              onClick={() => { setMode('switch'); setError(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'switch' ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Daftar Akun</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'register' ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftar Baru</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'login' ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body Container */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">

        {/* Notification feedback */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Tab 1: Switch Account List */}
        {mode === 'switch' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-400">
              Pilih akun yang ingin Anda gunakan. Kulkas dan resep akun terpilih akan langsung aktif:
            </p>

            {allUsers.length === 0 ? (
              <div className="text-center py-6 px-4 bg-stone-950/60 rounded-2xl border border-stone-800">
                <UserPlus className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-semibold text-stone-200">Belum Ada Akun Terdaftar</p>
                <p className="text-xs text-stone-400 mt-1 mb-4">
                  Buat akun pertama Anda sekarang untuk mulai mengelola kulkas pribadi yang bersih.
                </p>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Daftar Akun Baru Sekarang
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {allUsers.map((u) => {
                  const isActive = currentUser?.id === u.id;
                  const data = db.getUserData(u.id);
                  const itemCount = data.ingredients.length;

                  return (
                    <div
                      key={u.id}
                      onClick={() => handleQuickSwitch(u.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-emerald-950/40 border-emerald-500 text-white'
                          : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-stone-800 flex items-center justify-center text-2xl border border-stone-700 shadow-inner">
                          {u.avatar || '👨‍🍳'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-stone-100">{u.name}</span>
                            {isActive && (
                              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                Aktif Sekarang
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-400">{u.email}</p>
                          <p className="text-[11px] text-stone-300 mt-0.5 font-mono">
                            Stok kulkas: <span className="text-emerald-400 font-semibold">{itemCount} bahan</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteAccount(u.id, u.name, e)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-800/80 transition-colors cursor-pointer"
                          title={`Hapus Akun ${u.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickSwitch(u.id)}
                          className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                            isActive
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                          }`}
                        >
                          {isActive ? 'Aktif' : 'Pilih Akun'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Buat Akun Baru (Kulkas Bersih)</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Register New User */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-2xl text-xs text-emerald-300">
              ✨ <strong>Sesuai Permintaan Anda:</strong> Akun baru akan dibuat dengan <strong>kulkas 100% kosong</strong> sehingga Anda bisa mengisi bahan dapur Anda sendiri tanpa tercampur bahan contoh.
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Pilih Avatar Akun
              </label>
              <div className="flex gap-2 flex-wrap">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                      selectedAvatar === av
                        ? 'bg-emerald-600 scale-110 shadow-md ring-2 ring-emerald-400'
                        : 'bg-stone-950 border border-stone-800 hover:bg-stone-800'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Nama Akun / Nama Dapur
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Dapur Irfan, Masakan Ibu, Kosan"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Email / ID Akun
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="irfan@dapur.com atau username unik"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Kata Sandi / PIN (Opsional)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kosongkan jika tidak butuh sandi"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Tombol Selesai Daftar Akun */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-950/60 transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-400/40"
              >
                <UserPlus className="w-5 h-5 shrink-0" />
                <span>{loading ? 'Menyimpan ke Database...' : '✓ Selesai Daftar & Masuk Akun'}</span>
              </button>
              <p className="text-center text-[11px] text-stone-400 mt-2">
                👆 Klik tombol hijau di atas untuk menyelesaikan pendaftaran
              </p>
            </div>

            <div className="pt-1 text-center border-t border-stone-800/60">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-stone-400 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Sudah punya akun? Masuk di sini &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Login */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Email atau Username Akun
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email yang sudah didaftarkan"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Kata Sandi / PIN
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi jika ada"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-950/60 transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-400/40"
              >
                <LogIn className="w-5 h-5 shrink-0" />
                <span>{loading ? 'Memeriksa Database...' : '✓ Masuk ke Kulkas Sekarang'}</span>
              </button>
            </div>

            <div className="pt-1 text-center border-t border-stone-800/60">
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-xs text-stone-400 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Belum punya akun? Daftar akun baru di sini &rarr;
              </button>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
};
