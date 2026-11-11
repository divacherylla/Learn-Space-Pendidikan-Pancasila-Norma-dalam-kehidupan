import React from 'react';
import { Bell, ArrowRight, Sparkles, Inbox } from 'lucide-react';

interface StudentNotificationsProps {
  onBackToStudy: () => void;
}

export const StudentNotifications: React.FC<StudentNotificationsProps> = ({ onBackToStudy }) => {
  // Database reset: no pre-populated mock feedback with teacher/student names
  const notifications: Array<{
    id: string;
    sender: string;
    senderRole: string;
    time: string;
    title: string;
    message: string;
    type: 'feedback' | 'achievement' | 'reminder';
  }> = [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Pesan & Catatan Belajar
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Pemberitahuan, apresiasi, dan umpan balik belajar dari pendidik.
          </p>
        </div>
        <button
          type="button"
          onClick={onBackToStudy}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer self-start sm:self-auto inline-flex items-center gap-2"
        >
          <span>Lanjut Belajar</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="font-display text-xl font-bold text-slate-800 mb-2">
            Belum Ada Pesan Masuk
          </h3>
          <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
            Kotak pesanmu masih bersih. Mulailah mengerjakan aktivitas Tutorial, Practical, atau Drill & Game agar pendidik dapat memberikan catatan dan umpan balik untukmu.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 px-3.5 py-1.5 rounded-lg border border-indigo-200">
            <Sparkles className="w-4 h-4" />
            <span>Pesan dari guru akan otomatis muncul di sini setelah tugas dinilai</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4 transition-all hover:border-indigo-300"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Bell className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <div>
                    <h4 className="font-bold text-base text-slate-900">{n.title}</h4>
                    <span className="text-xs text-slate-500 font-medium">
                      Dari: {n.sender} ({n.senderRole})
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{n.time}</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mt-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {n.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
