import React, { useState } from 'react';
import { User, Role } from '../../types';
import { CURRENT_TEACHER } from '../../data/mockData';
import { 
  User as UserIcon, 
  GraduationCap, 
  Lock, 
  Scale, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = usernameInput.trim();

    if (!trimmed) {
      setErrorMessage(
        selectedRole === 'student'
          ? 'Silakan masukkan nama atau username siswa terlebih dahulu.'
          : 'Silakan masukkan username guru terlebih dahulu.'
      );
      return;
    }

    setErrorMessage('');

    // Teacher login path
    if (selectedRole === 'teacher') {
      const lower = trimmed.toLowerCase();
      const teacherUser: User = {
        id: 'tch_' + lower.replace(/\s+/g, '_'),
        name: trimmed.startsWith('Ibu') || trimmed.startsWith('Bapak')
          ? trimmed
          : `Guru ${trimmed.charAt(0).toUpperCase() + trimmed.slice(1)}`,
        email: `${lower.replace(/\s+/g, '')}@belajar.id`,
        role: 'teacher',
        avatar: 'user',
      };
      onLogin(teacherUser);
      return;
    }

    // Student login path - All students start with 0 badges and 0 stars
    const formattedName = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    const studentUser: User = {
      id: 'std_' + trimmed.toLowerCase().replace(/\s+/g, '_'),
      name: formattedName,
      email: `${trimmed.toLowerCase().replace(/\s+/g, '')}@belajar.id`,
      role: 'student',
      avatar: 'user',
      stars: 0,
      badges: [], // Semua siswa belum mendapatkan lencana
    };

    onLogin(studentUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800">
      {/* Top Header */}
      <header className="w-full bg-white border-b border-slate-200 py-4 px-6 sm:px-12 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                LEARN <span className="text-[#4D96FF]">SPACE</span>
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Pendidikan Pancasila: Norma dalam Kehidupanku · SD Kelas V
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm font-semibold text-indigo-700 bg-indigo-50 px-3.5 py-1.5 rounded-lg border border-indigo-200">
            <Sparkles className="w-4 h-4" />
            <span>Portal Belajar Mandiri</span>
          </div>
        </div>
      </header>

      {/* Main Login Hero & Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center justify-center">
        {/* Welcome Card Box */}
        <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Card Top Banner (Clean, dark indigo style) */}
          <div className="bg-[#1E1B4B] p-7 sm:p-9 text-white text-center">
            <span className="inline-block px-3 py-1 bg-white/10 rounded-md text-xs font-bold uppercase tracking-wider mb-2.5 text-indigo-200">
              Pintu Masuk Belajar
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
              Selamat Datang di Portal Pembelajaran
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2.5 max-w-md mx-auto font-normal leading-relaxed">
              Silakan masukkan username kamu untuk memulai petualangan memahami norma, hak dan kewajiban, serta musyawarah mufakat.
            </p>
          </div>

          <div className="p-7 sm:p-9">
            {/* Role Selection Tabs */}
            <div className="mb-6">
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                Pilih Peran Masuk:
              </label>
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('student');
                    setErrorMessage('');
                  }}
                  className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-all cursor-pointer ${
                    selectedRole === 'student'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-300'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <UserIcon className="w-4 h-4 text-indigo-600" />
                  <span>Siswa</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('teacher');
                    setErrorMessage('');
                  }}
                  className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-all cursor-pointer ${
                    selectedRole === 'teacher'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Guru / Pendidik</span>
                </button>
              </div>
            </div>

            {/* Username Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {selectedRole === 'student' ? 'Nama atau Username Siswa:' : 'Nama atau Username Guru:'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    {selectedRole === 'student' ? (
                      <UserIcon className="w-5 h-5 text-slate-400" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                  </span>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => {
                      setUsernameInput(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder={
                      selectedRole === 'student'
                        ? 'Masukkan nama atau username kamu...'
                        : 'Masukkan nama atau username guru...'
                    }
                    className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 rounded-xl text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-all"
                    autoFocus
                  />
                </div>
                {errorMessage && (
                  <p className="mt-2.5 text-sm font-semibold text-rose-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-600" />
                    {errorMessage}
                  </p>
                )}
                <div className="mt-2.5 flex items-start gap-2 text-slate-500 text-sm">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-indigo-500" />
                  <p>
                    {selectedRole === 'student'
                      ? 'Ketik nama panggilanmu untuk langsung masuk ke halaman belajar siswa. Semua lencana dapat diraih saat menyelesaikan misi.'
                      : 'Masuk sebagai guru untuk meninjau capaian siswa dan struktur materi.'}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-4 px-6 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.99] ${
                  selectedRole === 'student'
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <span>{selectedRole === 'student' ? 'Mulai Petualangan Belajar' : 'Masuk ke Ruang Guru'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Learning Summary Highlights Preview (4 clean cards with Lucide icons, readable font size) */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl text-left">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block">4 Macam Norma</span>
              <span className="text-sm text-slate-500 leading-snug block mt-0.5">
                Agama, Kesusilaan, Kesopanan, dan Hukum
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block">Hak & Kewajiban</span>
              <span className="text-sm text-slate-500 leading-snug block mt-0.5">
                Seimbang di Rumah, Sekolah, dan Masyarakat
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block">Pohon Normaku</span>
              <span className="text-sm text-slate-500 leading-snug block mt-0.5">
                Media Interaktif dan Latihan Kasus Nyata
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block">Musyawarah</span>
              <span className="text-sm text-slate-500 leading-snug block mt-0.5">
                Pengambilan Keputusan Bersama secara Damai
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500 font-medium">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>LEARN SPACE · Ruang Belajar Mandiri Pendidikan Pancasila</span>
          <span>Kurikulum Merdeka · SD Kelas V</span>
        </div>
      </footer>
    </div>
  );
};
