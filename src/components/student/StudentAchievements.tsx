import React from 'react';
import { INITIAL_BADGES } from '../../data/mockData';
import { User } from '../../types';
import { Award, Star, CheckCircle2, Lock, ArrowRight, Info } from 'lucide-react';

interface StudentAchievementsProps {
  user: User;
  onBackToStudy?: () => void;
}

export const StudentAchievements: React.FC<StudentAchievementsProps> = ({
  user,
  onBackToStudy,
}) => {
  const badges = INITIAL_BADGES;
  const userBadges = user.badges || [];
  const unlockedCount = userBadges.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header card */}
      <div className="bg-[#1E1B4B] text-white rounded-3xl p-7 sm:p-9 shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 bg-white/10 text-indigo-300 rounded-2xl flex items-center justify-center shrink-0">
            <Award className="w-9 h-9" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Papan Prestasi & Bintang Capaian
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5">
              Prestasi Belajar {user.name}
            </h2>
            <p className="text-sm text-slate-300 font-medium mt-1">
              {user.grade} · {user.schoolName}
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xs rounded-2xl px-6 py-4 border border-white/10 text-center shadow-xs shrink-0">
          <span className="text-xs font-semibold text-indigo-200 block">Total Koleksi</span>
          <div className="flex items-center justify-center gap-2 mt-1">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {user.stars ?? 0}
            </span>
          </div>
          <span className="text-xs text-indigo-200 font-bold block mt-1">Bintang Capaian</span>
        </div>
      </div>

      {/* Badges Collection Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-bold text-slate-900">
            Lencana Sahabat Pancasila
          </h3>
          <span className="text-sm text-slate-500 font-medium">
            {unlockedCount} dari {badges.length} Terbuka
          </span>
        </div>

        {unlockedCount === 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-800">
            <Info className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-amber-900">Belum Ada Lencana yang Didapatkan</h4>
              <p className="text-sm text-amber-700 mt-0.5">
                Semua siswa memulai dari awal. Selesaikan misi pembelajaran, pohon norma, kuis studi kasus, dan refleksi untuk membuka lencana prestasimu satu per satu!
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {badges.map((b) => {
            const isUnlocked = userBadges.includes(b.id);

            return (
              <div
                key={b.id}
                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-white border-slate-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isUnlocked ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Award className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-base text-slate-900">{b.title}</h4>
                    {isUnlocked ? (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Terbuka
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        Terkunci
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{b.description}</p>
                  {isUnlocked && (
                    <span className="text-xs text-indigo-700 font-semibold block mt-2">
                      Didapatkan: {b.unlockedAt || 'Misi Selesai'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center mb-8 shadow-xs">
        <blockquote className="font-display text-base sm:text-lg font-bold text-slate-900 max-w-lg mx-auto">
          &ldquo;Pendidikan Pancasila bukan hanya untuk dihafal, melainkan dihidupkan melalui perbuatan baik setiap hari.&rdquo;
        </blockquote>
        <p className="text-sm text-slate-500 mt-2">
          Terus kumpulkan bintang kebaikanmu di setiap misi belajar!
        </p>
      </div>

      {onBackToStudy && (
        <div className="text-center">
          <button
            type="button"
            onClick={onBackToStudy}
            className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-base transition-all shadow-sm cursor-pointer inline-flex items-center gap-2"
          >
            <span>Mulai Misi Petualangan</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
