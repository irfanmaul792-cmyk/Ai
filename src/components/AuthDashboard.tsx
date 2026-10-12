import React, { useState } from 'react';
import { LogIn, UserPlus, Users, Shield, Sparkles, ChefHat, CheckCircle2, AlertCircle, Trash2, ArrowRight, Refrigerator, Eye, EyeOff } from 'lucide-react';
import { db } from '../services/db';
import { User } from '../types';
import { DeleteAccountModal } from './DeleteAccountModal';

interface AuthDashboardProps {
  onLoginSuccess: (user: User) => void;
  initialMode?: 'login' | 'register' | 'switch';
}

const AVATAR_OPTIONS = ['👨‍🍳', '👩‍🍳', '🍳', '🥗', '🍲', '🥑', '🥩', '🧀', '🏡', '🌟'];

export const AuthDashboard: React.FC<AuthDashboardProps> = ({
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => db.getUsers());
  const [mode, setMode] = useState<'login' | 'register' | 'switch'>(() => initialMode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👨‍🍳');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<{ id: string; name: string } | null>(null);

  // Sync with central server on mount to pull accounts registered on other devices/web
  React.useEffect(() => {
    db.syncWithServer().then(users => {
      setAllUsers(users);
    });

    const unsubscribe = db.subscribeUsers(users => {
      setAllUsers(users);
    });

    return unsubscribe;
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError('Masukkan email atau username akun Anda.');
      return;
    }

    if (!password.trim()) {
      setError('Kata sandi harus diisi untuk masuk ke akun Anda.');
      return;
    }

    setLoading(true);
    const res = await db.loginUser(email.trim(), password.trim());
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

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName) {
      setError('Nama lengkap atau nama kulkas harus diisi.');
      return;
    }
    if (!trimmedEmail) {
      setError('Email atau ID akun harus diisi.');
      return;
    }

    // Pengecekan kata sandi
    if (!trimmedPassword) {
      setError('Kata sandi harus dibuat agar akun Anda aman dan dapat login di perangkat lain.');
      return;
    }
    if (trimmedPassword.length < 8) {
      setError('Kata sandi minimal 8 karakter (bisa berupa huruf, angka, atau simbol).');
      return;
    }

    // Pengecekan apakah Email atau ID sudah digunakan
    const normalizedEmail = trimmedEmail.toLowerCase();
    const isAlreadyUsed = allUsers.some(u => 
      u.email.toLowerCase() === normalizedEmail || 
      u.name.toLowerCase() === normalizedEmail
    );

    if (isAlreadyUsed) {
      setError(`Email atau ID "${trimmedEmail}" sudah digunakan oleh akun lain. Silakan gunakan email atau ID yang lain.`);
      return;
    }

    setLoading(true);
    const res = await db.registerUser(trimmedName, trimmedEmail, trimmedPassword, selectedAvatar);
    setLoading(false);

    if (res.success && res.user) {
      setSuccess(`Akun "${res.user.name}" berhasil dibuat! Membuka kulkas Anda...`);
      setTimeout(() => {
        onLoginSuccess(res.user!);
      }, 700);
    } else {
      setError(res.error || `Email atau ID "${trimmedEmail}" sudah digunakan. Silakan gunakan email atau ID lain.`);
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
    setAccountToDelete({ id: userId, name: userName });
  };

  const confirmDeleteAccountAction = () => {
    if (!accountToDelete) return;
    const { id, name: targetName } = accountToDelete;
    db.deleteUser(id);
    setAllUsers(db.getUsers());
    setAccountToDelete(null);
    setError(null);
    setSuccess(`Akun "${targetName}" berhasil dihapus dari perangkat.`);
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Akses Aman & Terenkripsi</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* Left Side: Brand Story & Highlights */}
        <div className="w-full lg:w-1/2 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Manajemen Kulkas & Resep Cerdas</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-stone-900 tracking-tight leading-tight">
            Masak Lebih Cerdas dari Bahan yang Anda Miliki.
          </h2>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Kelola persediaan bahan makanan di rumah, temukan rekomendasi resep masakan yang lezat, dan pantau masa kedaluwarsa bahan secara praktis dari mana saja.
          </p>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-stone-900">Sinkronisasi Lintas Perangkat</h3>
                <p className="text-xs text-stone-500 mt-0.5">Daftar bahan, resep favorit, dan rencana belanja tersimpan aman serta dapat diakses di berbagai perangkat Anda.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-stone-900">Inspirasi Resep Otomatis</h3>
                <p className="text-xs text-stone-500 mt-0.5">Cukup catat bahan yang Anda miliki di dapur untuk mendapatkan rekomendasi menu harian yang siap dimasak.</p>
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
                        {allUsers.slice(0, 3).map(u => (
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
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteAccount(u.id, u.name, e)}
                                className="p-1.5 rounded-xl text-stone-500 hover:text-rose-400 hover:bg-rose-950/50 border border-transparent hover:border-rose-900/50 transition-colors cursor-pointer"
                                title={`Hapus akun "${u.name}" dari perangkat`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickLogin(u.id)}
                                className="text-xs text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                              >
                                Masuk &rarr;
                              </button>
                            </div>
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
                        Email atau Username Akun <span className="text-rose-400 font-bold">*</span>
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
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-stone-300">
                          Kata Sandi / PIN Akun <span className="text-rose-400 font-bold">*</span>
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Masukkan kata sandi akun Anda"
                          className="w-full px-4 py-3 pr-11 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-emerald-500 placeholder-stone-600 font-mono tracking-wider"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-1 rounded-lg transition-colors cursor-pointer"
                          title={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
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
                      Belum punya akun? <strong>Daftar Akun Baru di sini &rarr;</strong>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: REGISTER NEW ACCOUNT */}
              {mode === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
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
                      2. Nama Akun / Nama Dapur <span className="text-rose-400 font-bold">*</span>
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
                      3. Email / ID Akun <span className="text-rose-400 font-bold">*</span>
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
                      4. Buat Kata Sandi / PIN Akun <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showRegisterPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 8 karakter (huruf, angka, atau simbol)"
                        className="w-full px-4 py-3 pr-11 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-emerald-500 placeholder-stone-600 font-mono tracking-wider"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-1 rounded-lg transition-colors cursor-pointer"
                        title={showRegisterPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                      >
                        {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-1.5 text-[11px]">
                      <span className={password.length >= 8 ? 'text-emerald-400 font-medium' : 'text-stone-400'}>
                        🔒 Minimal 8 karakter (dapat berupa huruf, angka, atau simbol)
                      </span>
                      {password.length > 0 && (
                        <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${password.length >= 8 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-stone-800 text-amber-300'}`}>
                          {password.length}/8
                        </span>
                      )}
                    </div>
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
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-stone-300">
                      Kelola & Hapus Akun yang Tersimpan:
                    </p>
                    <span className="text-[11px] text-stone-400">
                      {allUsers.length} akun tersimpan
                    </span>
                  </div>

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

                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteAccount(u.id, u.name, e)}
                              className="px-2.5 py-1.5 rounded-xl text-stone-400 hover:text-rose-300 hover:bg-rose-950/60 border border-stone-800 hover:border-rose-800/60 transition-all cursor-pointer flex items-center gap-1.5 text-xs"
                              title={`Hapus akun "${u.name}" dari perangkat`}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                              <span className="hidden sm:inline">Hapus</span>
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
                      <span>+ Buat Akun Baru</span>
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

      {/* In-App Delete Account Confirmation Modal */}
      <DeleteAccountModal
        isOpen={accountToDelete !== null}
        onClose={() => setAccountToDelete(null)}
        onConfirm={confirmDeleteAccountAction}
        accountName={accountToDelete?.name || ''}
      />
    </div>
  );
};
