import React from 'react';
import { AutosaveStatus } from '../../services/storageService';

interface AutosaveBadgeProps {
  status: AutosaveStatus;
  onRetry?: () => void;
  lastSavedTime?: string;
}

export const AutosaveBadge: React.FC<AutosaveBadgeProps> = ({ status, onRetry, lastSavedTime }) => {
  return (
    <div className="inline-flex items-center gap-2 text-xs font-medium">
      {status === 'saving' && (
        <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-md">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Menyimpan...
        </span>
      )}

      {status === 'saved' && (
        <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-md">
          <span className="text-emerald-600 font-bold">✓</span>
          Semua perubahan tersimpan
          {lastSavedTime && <span className="text-emerald-600/70 text-[11px]">({lastSavedTime})</span>}
        </span>
      )}

      {status === 'failed' && (
        <span className="inline-flex items-center gap-2 text-red-800 bg-red-50 border border-red-200 px-2.5 py-1 rounded-md">
          <span>⚠ Belum tersimpan</span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="underline font-bold hover:text-red-950 cursor-pointer"
            >
              Coba Simpan Lagi
            </button>
          )}
        </span>
      )}
    </div>
  );
};
