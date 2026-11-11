import React from 'react';
import { PrePublishValidationResult } from '../../types';

interface PrePublishModalProps {
  validationResult: PrePublishValidationResult;
  onPublishConfirm: () => void;
  onClose: () => void;
  onFixIssue?: (field: string) => void;
}

export const PrePublishModal: React.FC<PrePublishModalProps> = ({
  validationResult,
  onPublishConfirm,
  onClose,
  onFixIssue,
}) => {
  const { canPublish, issues, stats } = validationResult;
  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
              📋
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                Pemeriksaan Pra-Publikasi (Pre-Publish Check)
              </h3>
              <p className="text-xs text-slate-500">
                Memastikan seluruh modul & media H5P bebas kesalahan sebelum diakses siswa.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Validation Overview Metric */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 block">Modul Aktif</span>
            <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
              {stats.totalModules}
            </span>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 block">Aktivitas</span>
            <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
              {stats.totalActivities}
            </span>
          </div>
          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
            <span className="text-xs text-emerald-800 block">Media H5P Valid</span>
            <span className="text-lg font-bold text-emerald-900 font-mono tabular-nums">
              {stats.validH5PCount}/{stats.totalH5P}
            </span>
          </div>
        </div>

        {/* Checklist Results */}
        <div className="mb-6 space-y-2 max-h-60 overflow-y-auto pr-1">
          {issues.length === 0 ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 text-xs">
              <div className="flex items-center gap-2 font-bold mb-1">
                <span className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800">
                  ✓
                </span>
                <span>Semua Pemeriksaan Berhasil (100% Siap)</span>
              </div>
              <p className="text-emerald-800 ml-7">
                Judul, deskripsi, learning objectives, struktur modul, dan seluruh dependensi H5P dari Lumi telah tervalidasi dengan baik.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-3 text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>CATATAN PEMERIKSAAN SISTEM:</span>
                <span className="text-red-700 font-semibold">
                  {criticalCount} kritis, {warningCount} peringatan
                </span>
              </div>

              {issues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs mb-2 flex items-start justify-between gap-3 ${
                    issue.severity === 'critical'
                      ? 'bg-red-50/80 border-red-200 text-red-950'
                      : 'bg-amber-50/80 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5">{issue.severity === 'critical' ? '🚫' : '⚠️'}</span>
                    <div>
                      <span className="font-bold text-[11px] uppercase tracking-wider block">
                        [{issue.section}]
                      </span>
                      <p className="mt-0.5 leading-relaxed">{issue.message}</p>
                    </div>
                  </div>

                  {onFixIssue && (
                    <button
                      type="button"
                      onClick={() => onFixIssue(issue.field)}
                      className="text-[11px] font-semibold underline shrink-0 hover:opacity-80 cursor-pointer"
                    >
                      Periksa
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
          >
            Tutup
          </button>

          {canPublish ? (
            <button
              type="button"
              onClick={onPublishConfirm}
              className="px-6 py-2.5 bg-[#6BCB77] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              🚀 Terbitkan Course Sekarang
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-700 font-semibold">
                ⚠ Perbaiki error kritis sebelum publikasi
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
