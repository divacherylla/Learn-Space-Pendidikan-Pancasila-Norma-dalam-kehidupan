import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface H5PCompletionProps {
  activityTitle: string;
  badgeName?: string;
  earnedStars?: number;
  onNextActivity?: () => void;
  onGoToDashboard?: () => void;
}

export const H5PCompletion: React.FC<H5PCompletionProps> = ({
  activityTitle,
  badgeName = 'Pelopor Kebaikan',
  earnedStars = 25,
  onNextActivity,
  onGoToDashboard,
}) => {
  useEffect(() => {
    // Fire festive child-friendly confetti!
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD43B', '#6BCB77', '#FF6B6B', '#4D96FF', '#A66CFF'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  return (
    <div className="bg-white rounded-3xl p-8 border border-amber-200/80 shadow-md text-center max-w-lg mx-auto my-6 animate-in zoom-in-95 duration-200">
      <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 rounded-3xl flex items-center justify-center text-4xl shadow-xs">
        🏆
      </div>

      <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md">
        Aktivitas Selesai
      </span>

      <h2 className="font-display text-2xl font-bold text-slate-900 mt-2 mb-1">
        Luar Biasa, Sahabat Pancasila!
      </h2>
      <p className="text-sm text-slate-600 mb-6">
        Kamu telah menuntaskan aktivitas <strong>&ldquo;{activityTitle}&rdquo;</strong> dengan penuh tanggung jawab.
      </p>

      {/* Rewards earned */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/70">
          <span className="text-2xl block mb-1">⭐</span>
          <span className="text-lg font-bold text-amber-900 tabular-nums font-mono">+{earnedStars}</span>
          <span className="block text-xs text-amber-700">Bintang Belajar</span>
        </div>
        <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200/70">
          <span className="text-2xl block mb-1">🎖️</span>
          <span className="text-xs font-bold text-purple-900 block truncate">{badgeName}</span>
          <span className="block text-xs text-purple-700">Lencana Terbuka</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        {onNextActivity && (
          <button
            type="button"
            onClick={onNextActivity}
            className="px-6 py-3 bg-[#4D96FF] hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Lanjut ke Aktivitas Berikutnya ➔
          </button>
        )}
        {onGoToDashboard && (
          <button
            type="button"
            onClick={onGoToDashboard}
            className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Kembali ke Beranda
          </button>
        )}
      </div>
    </div>
  );
};
