import React, { useState } from 'react';
import { LogIn, UserPlus, Users, Shield, Sparkles, ChefHat, CheckCircle2, AlertCircle, Trash2, ArrowRight, Refrigerator } from 'lucide-react';
import { db } from '../services/db';
import { User } from '../types';

interface AuthDashboardProps {
  onLoginSuccess: (user: User) => void;
  initialMode?: 'login' | 'register' | 'switch';
}

const AVATAR_OPTIONS = ['👨‍🍳', '👩‍🍳', '🍳', '🥗', '🍲', '🥑', '🥩', '🧀', '🏡', '🌟'];

export const AuthDashboard: React.FC<AuthDashboardProps> = ({
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const usersOnDevice = db.getUsers();
  const [mode, setMode] = useState<'login' | 'register' | 'switch'>(() => {
    if (usersOnDevice.length === 0) return 'register';
    return initialMode === 'register' ? 'register' : 'login';
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👨‍🍳');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [usersVersion, setUsersVersion] = useState(0);

  const allUsers = db.getUsers();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError('Masukkan email atau username akun Anda.');
      return;
    }

    setLoading(true);
    const res = await db.loginUser(email.trim(), password || 'default');
    setLoading(false);

    if (res.success && res.user) {
      setSuccess(`Selamat datang kembali, ${res.user.name}! Membuka kulkas Anda...`);
      setTimeout(() => {
        onLoginSuccess(res.user!);
      }, 600);
    } else {
      setError(res.error || 'Akun tidak ditemukan atau kata sandi salah. Silakan coba lagi.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Nama lengkap atau nama kulkas wajib diisi.');
      return;
    }
    if (!email.trim()) {
      setError('Email atau ID akun wajib diisi.');
      return;
    }

    setLoading(true);
    const res = await db.registerUser(name.trim(), email.trim(), password || 'default', selectedAvatar);
    setLoading(false);

    if (res.success && res.user) {
      setSuccess(`Akun "${res.user.name}" berhasil dibuat! Kulkas baru Anda 100% kosong & siap diisi.`);
      setTimeout(() => {
        onLoginSuccess(res.user!);
      }, 700);
    } else {
      setError(res.error || 'Gagal mendaftar akun. Silakan coba username lain.');
    }
  };

  const handleQuickLogin = (userId: string) => {
    const user = db.switchUser(userId);
    if (user) {
      setSuccess(`Masuk sebagai ${user.name}...`);
      setTimeout(() => {
        onLoginSuccess(user);
      }, 500);
    }
  };

  const handleDeleteAccount = (userId: string, userName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Hapus akun "${userName}" beserta seluruh data kulkasnya dari perangkat ini?`)) {
      db.deleteUser(userId);
      setUsersVersion(v => v + 1);
      setError(null);
      setSuccess(`Akun "${userName}" berhasil dihapus.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-stone-900 flex flex-col justify-between selection:bg-emerald-200">
      {/* Top Navbar Header */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-sm">
              <Refrigerator className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display text-stone-900 leading-tight">Isi Kulkasku</h1>
              <p className="text-[11px] text-stone-500 hidden sm:block">Portal Masuk & Manajemen Akun Kulkas</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
              <Shield className="w-3.5 h-3.5 text-emerald-700" />
              <span>Database Terisolasi per Akun</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* Left Side: Brand Story & Highlights */}
        <div className="w-full lg:w-1/2 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-100/80 text-amber-900 text-xs font-bold border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Kulkas Pribadi Tanpa Tercampur</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-stone-900 tracking-tight leading-tight">
            Masak Lebih Cerdas dari Bahan yang Anda Miliki.
          </h2>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Setiap akun kulkas memiliki database bahan mandiri. Akun baru Anda akan dibuka dengan <strong>kulkas 100% bersih dan kosong</strong>, bebas dari contoh bahan demo.
          </p>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-stone-900">Database Akun Mandiri</h3>
                <p className="text-xs text-stone-500 mt-0.5">Isi kulkas, daftar belanja, dan resep favorit tersimpan rapi khusus untuk profil akun Anda.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-stone-900">Kulkas Baru Bersih Total</h3>
                <p className="text-xs text-stone-500 mt-0.5">Ketika mendaftar, stok dimulai dari 0 bahan sehingga Anda bebas memasukkan isi kulkas riil Anda.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Dashboard Card */}
        <div className="w-full lg:w-1/2 max-w-lg">
          <div className="bg-stone-900 text-stone-100 rounded-3xl border border-stone-800 shadow-2xl overflow-hidden relative">
            {/* Ambient emerald backlight */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Dashboard Tabs */}
            <div className="p-5 sm:p-6 pb-4 border-b border-stone-800/80">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Portal Akses Kulkas</span>
                </span>
                <span className="text-xs text-stone-400">
                  {allUsers.length} Akun Tersimpan
                </span>
              </div>

              <div className="flex p-1 bg-stone-950 rounded-2xl border border-stone-800">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'login' ? 'bg-emerald-600 text-white shadow-md' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(null); }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'register' ? 'bg-emerald-600 text-white shadow-md' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftar Akun Baru</span>
                </button>

                {allUsers.length > 0 && (
                  <button
                    type="button"
                    onClick={() => { setMode('switch'); setError(null); }}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      mode === 'switch' ? 'bg-emerald-600 text-white shadow-md' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Pilih Akun ({allUsers.length})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Form & Content Area */}
            <div className="p-5 sm:p-7 space-y-4 max-h-[68vh] overflow-y-auto">
              {/* Notifications */}
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {/* TAB 1: LOGIN */}
              {mode === 'login' && (
                <div className="space-y-4">
                  {/* Quick Select for returning user (if exists on this device) */}
                  {allUsers.length > 0 && (
                    <div className="mb-4 space-y-2">
                      <span className="text-[11px] font-semibold text-stone-400 block">
                        Pilih Cepat Akun yang Pernah Digunakan:
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {allUsers.slice(0, 2).map(u => (
                          <div
                            key={u.id}
                            onClick={() => handleQuickLogin(u.id)}
                            className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800 hover:border-emerald-500/60 transition-all flex items-center justify-between cursor-pointer group"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-10 h-10 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-xl">
                                {u.avatar || '👨‍🍳'}
                              </span>
                              <div>
                                <span className="font-bold text-sm text-white block group-hover:text-emerald-300 transition-colors">
                                  {u.name}
                                </span>
                                <span className="text-[11px] text-stone-400">{u.email}</span>
                              </div>
                            </div>
                            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                              Masuk &rarr;
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-stone-800" />
                    <span className="flex-shrink mx-3 text-stone-500 text-[11px]">atau ketik email akun</span>
                    <div className="flex-grow border-t border-stone-800" />
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                        Email atau Username Akun
                      </label>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Contoh: irfan@gmail.com atau irfan"
                        className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-emerald-500 placeholder-stone-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                        Kata Sandi / PIN (Opsional)
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Kosongkan jika saat daftar tidak memakai sandi"
                        className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-emerald-500 placeholder-stone-600"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-950/60 transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-400/40"
                    >
                      <LogIn className="w-5 h-5 shrink-0" />
                      <span>{loading ? 'Memeriksa Database...' : 'Masuk ke Kulkas Sekarang'}</span>
                    </button>
                  </form>

                  <div className="pt-2 text-center border-t border-stone-800/80">
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-xs text-stone-400 hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      Belum punya akun? <strong>Daftar Akun Baru (Kulkas Bersih) di sini &rarr;</strong>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: REGISTER NEW ACCOUNT */}
              {mode === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/50 rounded-2xl text-xs text-emerald-300 leading-relaxed flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Kulkas Bersih 100%:</strong> Akun baru Anda akan langsung dibuat dengan <strong>kulkas kosong tanpa bahan demo</strong>, sehingga Anda bisa leluasa memasukkan bahan dapur Anda sendiri.
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      1. Pilih Avatar Profil
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {AVATAR_OPTIONS.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => setSelectedAvatar(av)}
                          className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
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
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      2. Nama Akun / Nama Dapur <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Dapur Irfan, Masakan Ibu, Kosan"
                      className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-emerald-500 placeholder-stone-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      3. Email / ID Akun <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Contoh: irfan@gmail.com atau irfan_kulkas"
                      className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-emerald-500 placeholder-stone-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      4. Kata Sandi / PIN (Opsional)
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Bisa dikosongkan jika tidak butuh kata sandi"
                      className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-emerald-500 placeholder-stone-600"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-950/60 transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-400/40"
                    >
                      <UserPlus className="w-5 h-5 shrink-0" />
                      <span>{loading ? 'Menyimpan Akun Baru...' : '✓ Selesai & Buka Kulkas Baru Saya'}</span>
                    </button>
                    <p className="text-center text-[11px] text-stone-400 mt-2">
                      👆 Klik tombol hijau di atas untuk menyelesaikan pendaftaran
                    </p>
                  </div>

                  <div className="pt-2 text-center border-t border-stone-800/80">
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

              {/* TAB 3: SWITCH / MANAGE SAVED ACCOUNTS */}
              {mode === 'switch' && (
                <div className="space-y-3">
                  <p className="text-xs text-stone-400">
                    Daftar profil kulkas yang tersimpan di perangkat ini:
                  </p>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {allUsers.map((u) => {
                      const data = db.getUserData(u.id);
                      const itemCount = data.ingredients.length;

                      return (
                        <div
                          key={u.id}
                          onClick={() => handleQuickLogin(u.id)}
                          className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 hover:border-emerald-600 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-stone-800 flex items-center justify-center text-2xl border border-stone-700 shadow-inner">
                              {u.avatar || '👨‍🍳'}
                            </div>
                            <div>
                              <span className="font-bold text-sm text-stone-100 block group-hover:text-emerald-300 transition-colors">
                                {u.name}
                              </span>
                              <p className="text-xs text-stone-400">{u.email}</p>
                              <p className="text-[11px] text-stone-400 mt-0.5 font-mono">
                                Stok: <span className="text-emerald-400 font-semibold">{itemCount} bahan</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteAccount(u.id, u.name, e)}
                              className="p-2 rounded-xl text-stone-500 hover:text-rose-400 hover:bg-stone-800 transition-colors cursor-pointer"
                              title={`Hapus Akun ${u.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickLogin(u.id)}
                              className="text-xs px-3.5 py-1.5 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-all cursor-pointer"
                            >
                              Buka &rarr;
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

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
                      onClick={() => setMode('login')}
                      className="text-xs text-stone-400 hover:text-stone-200 cursor-pointer"
                    >
                      Kembali ke Login
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-stone-300/80 bg-white/60 py-4 px-4 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Isi Kulkasku · Sistem Manajemen Kulkas Pribadi & Resep Cerdas</span>
          <span className="text-stone-400">Data tersimpan aman di perangkat lokal Anda</span>
        </div>
      </footer>
    </div>
  );
};
