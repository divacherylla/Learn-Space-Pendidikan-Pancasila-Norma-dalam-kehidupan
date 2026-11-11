import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { DevErrorLog } from '../../types';

interface DevLogsModalProps {
  onClose: () => void;
}

export const DevLogsModal: React.FC<DevLogsModalProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<DevErrorLog[]>(() => storageService.getDevLogs());
  const [filterCode, setFilterCode] = useState<string>('all');

  const handleClear = () => {
    storageService.clearDevLogs();
    setLogs([]);
  };

  const filteredLogs = logs.filter((log) => {
    if (filterCode === 'all') return true;
    return log.code.includes(filterCode);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-slate-800 animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-mono text-base font-bold text-white">
                Log Diagnostik Sistem & Observabilitas
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Catatan internal teknis (H5P, validasi paket, xAPI events, dan recovery). Tersembunyi dari tampilan siswa.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex items-center justify-between gap-3 mb-4 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Filter Kode:</span>
            <select
              value={filterCode}
              onChange={(e) => setFilterCode(e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-lg border border-slate-700"
            >
              <option value="all">Semua Log ({logs.length})</option>
              <option value="H5P">H5P / Lumi Events</option>
              <option value="VALIDATION">Validasi Paket</option>
              <option value="STORAGE">Storage / Draf</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-slate-400 hover:text-red-400 underline cursor-pointer"
          >
            Bersihkan Log
          </button>
        </div>

        {/* Logs Terminal Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 italic">
              Tidak ada log diagnostik tercatat.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 text-slate-300"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="font-bold text-amber-400">[{log.code}]</span>
                  <span className="text-slate-500 tabular-nums">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-slate-200 font-sans text-xs">{log.message}</p>
                {log.details && (
                  <pre className="mt-2 p-2 bg-black/40 rounded-lg text-[10px] text-slate-400 overflow-x-auto whitespace-pre-wrap font-mono">
                    {log.details}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 mt-4 flex justify-between items-center shrink-0 text-xs text-slate-400">
          <span>Prinsip Reliability by Design: Isolasi error & log internal</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium cursor-pointer"
          >
            Tutup Konsol
          </button>
        </div>
      </div>
    </div>
  );
};
