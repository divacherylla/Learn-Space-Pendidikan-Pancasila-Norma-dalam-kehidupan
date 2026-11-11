import React from 'react';

interface H5PScoreProps {
  score: number;
  maxScore: number;
  passingScore?: number;
  attempts?: number;
  onRetry?: () => void;
  onContinue?: () => void;
}

export const H5PScore: React.FC<H5PScoreProps> = ({
  score,
  maxScore,
  passingScore = 70,
  attempts = 1,
  onRetry,
  onContinue,
}) => {
  const percentage = Math.round((score / Math.max(maxScore, 1)) * 100);
  const isPassed = percentage >= passingScore;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs text-center max-w-md mx-auto">
      <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-3xl shadow-xs bg-amber-50">
        {isPassed ? '🌟' : '💡'}
      </div>

      <h3 className="font-display text-xl font-bold text-slate-900 mb-1">
        {isPassed ? '🎉 Hebat! Pilihanmu Tepat.' : '💡 Belum Tepat, Semangat!'}
      </h3>
      <p className="text-xs text-slate-600 mb-4">
        {isPassed
          ? 'Kamu telah menunjukkan pemahaman yang sangat baik tentang pengamalan nilai Pancasila.'
          : 'Coba perhatikan kembali situasi dan makna sila Pancasila yang dipelajari, lalu coba lagi yuk!'}
      </p>

      {/* Score metric block */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 mb-4 flex items-center justify-around">
        <div>
          <span className="block text-2xl font-bold text-slate-900 tabular-nums font-mono">
            {score}/{maxScore}
          </span>
          <span className="text-[11px] text-slate-500">Nilai Perolehan</span>
        </div>
        <div className="h-8 w-px bg-amber-200" />
        <div>
          <span className="block text-2xl font-bold text-slate-900 tabular-nums font-mono">
            {percentage}%
          </span>
          <span className="text-[11px] text-slate-500">Persentase</span>
        </div>
        <div className="h-8 w-px bg-amber-200" />
        <div>
          <span className="block text-2xl font-bold text-slate-900 tabular-nums font-mono">
            {attempts}x
          </span>
          <span className="text-[11px] text-slate-500">Percobaan</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 justify-center">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            🔄 Coba Lagi
          </button>
        )}
        {onContinue && (
          <button
            type="button"
            onClick={onContinue}
            className="px-5 py-2 bg-[#6BCB77] hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            Lanjutkan Misi ➔
          </button>
        )}
      </div>
    </div>
  );
};
