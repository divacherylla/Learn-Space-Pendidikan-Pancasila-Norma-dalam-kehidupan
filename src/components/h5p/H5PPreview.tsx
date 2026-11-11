import React, { useState } from 'react';
import { H5PContentPackage } from '../../types';
import { H5PPlayer } from './H5PPlayer';

interface H5PPreviewProps {
  packageData: H5PContentPackage;
  learningObjective?: string;
  onEdit?: () => void;
  onPublish?: () => void;
  onClose?: () => void;
}

export const H5PPreview: React.FC<H5PPreviewProps> = ({
  packageData,
  learningObjective = 'Siswa mampu memahami dan mempraktikkan nilai gotong royong dan musyawarah.',
  onEdit,
  onPublish,
  onClose,
}) => {
  const [loadSuccess, setLoadSuccess] = useState<boolean>(true);
  const [simulateError, setSimulateError] = useState<boolean>(false);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-4xl mx-auto my-6 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-base font-bold">
            👁️
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-white">
              H5P Preview (Mode Peninjauan Guru)
            </h3>
            <p className="text-xs text-slate-400">
              Uji coba interaksi sebelum diterbitkan kepada siswa Kelas V
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-3 py-1.5 rounded-lg bg-white/10 transition-colors cursor-pointer"
          >
            ✕ Tutup Preview
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Title & Learning Objective Info */}
        <div className="mb-5 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-[#4D96FF] tracking-wider uppercase">
              {packageData.library}
            </span>
            <h2 className="font-display text-xl font-bold text-slate-900 mt-0.5">
              {packageData.title}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              🎯 <strong>Capaian Belajar:</strong> {learningObjective}
            </p>
          </div>

          {/* Test toggle button for simulation */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSimulateError(!simulateError);
                setLoadSuccess(simulateError);
              }}
              className="text-[11px] text-slate-500 hover:text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer"
            >
              {simulateError ? 'Normal Preview' : '⚡ Uji Simulasi Gagal'}
            </button>
          </div>
        </div>

        {/* Live Interactive H5P Container */}
        <div className="bg-[#FFF9E6]/40 p-4 rounded-2xl border border-amber-200/50 mb-6">
          <H5PPlayer
            packageData={packageData}
            isSimulatedBroken={simulateError}
            onRetry={() => {
              setSimulateError(false);
              setLoadSuccess(true);
            }}
          />
        </div>

        {/* Load Status Indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div>
            {loadSuccess && !simulateError ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <span className="text-emerald-600">✓</span> Media berhasil dimuat & siap digunakan siswa
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-800 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                <span>⚠ Media tidak dapat dimuat. Periksa kembali file H5P sebelum dipublikasikan.</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                ✏️ Edit Media
              </button>
            )}
            {onPublish && (
              <button
                type="button"
                onClick={onPublish}
                disabled={simulateError}
                className="px-5 py-2 bg-[#6BCB77] hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                🚀 Terbitkan ke Modul Siswa
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
