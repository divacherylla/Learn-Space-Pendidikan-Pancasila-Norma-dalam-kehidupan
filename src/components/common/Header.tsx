import React, { useState } from 'react';
import { Role } from '../../types';
import { audioService } from '../../services/audioService';
import { 
  Home, 
  BookOpen, 
  FileText, 
  Award, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Star, 
  LayoutDashboard, 
  Sparkles, 
  Users,
  Tv,
  Briefcase,
  Gamepad2,
  Bot,
  FileCheck2,
  Volume2,
  VolumeX
} from 'lucide-react';

interface HeaderProps {
  currentRole: Role;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  userName?: string;
  starsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  activeTab,
  onTabChange,
  onLogout,
  userName = 'Siswa',
  starsCount = 0,
}) => {
  const [isSoundOn, setIsSoundOn] = useState<boolean>(() => audioService.isSfxEnabled());

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Wordmark Branding */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange(currentRole === 'student' ? 'dashboard' : 'teacher-dashboard')}
            className="text-left group cursor-pointer focus:outline-hidden"
          >
            <span className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[#263238] group-hover:text-indigo-600 transition-colors">
              LEARN <span className="text-[#4D96FF]">SPACE</span>
            </span>
          </button>
          <span className="hidden xl:inline-block text-xs font-semibold text-slate-500 border-l border-slate-300 pl-3">
            {currentRole === 'student' ? 'Norma dalam Kehidupanku · Pendidikan Pancasila' : 'Portal Pengelolaan Pendidik'}
          </span>
        </div>

        {/* Navigation Links with generous readable font size and clean Lucide icons */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 overflow-x-auto">
          {currentRole === 'student' ? (
            <>
              <button
                onClick={() => onTabChange('dashboard')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs lg:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Tv className="w-4 h-4" />
                <span>Beranda</span>
              </button>

              <button
                onClick={() => onTabChange('tutorial')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs lg:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'tutorial'
                    ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Tutorial</span>
              </button>

              <button
                onClick={() => onTabChange('practical')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs lg:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'practical'
                    ? 'text-emerald-700 bg-emerald-50 border-b-2 border-emerald-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Practical</span>
              </button>

              <button
                onClick={() => onTabChange('drill-game')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs lg:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'drill-game'
                    ? 'text-amber-700 bg-amber-50 border-b-2 border-amber-500 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Drill & Game</span>
              </button>

              <button
                onClick={() => onTabChange('chatbot')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs lg:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'chatbot'
                    ? 'text-purple-700 bg-purple-50 border-b-2 border-purple-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>Teman Belajar</span>
              </button>

              <button
                onClick={() => onTabChange('summary')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs lg:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'summary'
                    ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Rangkuman</span>
              </button>

              <button
                onClick={() => onTabChange('assessment')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs lg:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'assessment'
                    ? 'text-rose-700 bg-rose-50 border-b-2 border-rose-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Asesmen</span>
              </button>

              <button
                onClick={() => onTabChange('achievements')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs lg:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'achievements'
                    ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Pencapaian</span>
              </button>

              <button
                onClick={() => onTabChange('notifications')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs lg:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'notifications'
                    ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Pesan</span>
              </button>

              <button
                onClick={() => onTabChange('profile')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs lg:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'profile'
                    ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Profil</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onTabChange('teacher-dashboard')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'teacher-dashboard'
                    ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Guru</span>
              </button>
              <button
                onClick={() => onTabChange('course-builder')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'course-builder'
                    ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Materi Pembelajaran</span>
              </button>
              <button
                onClick={() => onTabChange('h5p-studio')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'h5p-studio'
                    ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Media Interaktif Lumi</span>
              </button>
              <button
                onClick={() => onTabChange('student-monitoring')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'student-monitoring'
                    ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Pemantauan Nilai</span>
              </button>
            </>
          )}
        </nav>

        {/* User Identity & Logout Button */}
        <div className="flex items-center gap-3 shrink-0">
          {currentRole === 'student' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200 text-sm font-bold text-amber-900 shadow-2xs">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className="tabular-nums font-mono">{starsCount}</span>
              <span className="hidden sm:inline text-xs font-semibold text-amber-800">Bintang</span>
            </div>
          )}

          {/* Sound On / Off Toggle */}
          <button
            type="button"
            onClick={() => {
              const next = audioService.toggleSfx();
              setIsSoundOn(next);
            }}
            title={isSoundOn ? 'Suara Aktif (Klik untuk mematikan)' : 'Suara Mati (Klik untuk membunyikan)'}
            className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center justify-center ${
              isSoundOn
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* User profile card */}
          <div className="flex items-center gap-2.5 pl-2.5 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
              {userName.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <span className="block text-sm font-bold text-slate-800 leading-tight">
                {userName}
              </span>
              <span className="block text-xs text-slate-500 font-medium">
                {currentRole === 'student' ? 'Siswa Kelas V' : 'Pendidik / Guru'}
              </span>
            </div>
          </div>

          {/* Exit / Logout Button returning to Beranda Login */}
          <button
            type="button"
            onClick={onLogout}
            title="Keluar dan kembali ke Beranda Masuk"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
