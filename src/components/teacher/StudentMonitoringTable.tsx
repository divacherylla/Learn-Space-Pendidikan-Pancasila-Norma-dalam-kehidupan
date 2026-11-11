import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { audioService } from '../../services/audioService';
import { PracticalSubmission, DrillSessionResult, EnrolledStudent } from '../../types';
import { 
  Users, 
  Award, 
  Briefcase, 
  Gamepad2, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  Layers,
  Inbox,
  Copy,
  Check,
  UserPlus
} from 'lucide-react';

export const StudentMonitoringTable: React.FC = () => {
  const [students, setStudents] = useState<EnrolledStudent[]>(() => storageService.getEnrolledStudents());
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [teacherFeedbackInput, setTeacherFeedbackInput] = useState<string>('');
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState<boolean>(false);
  const [activeViewTab, setActiveViewTab] = useState<'progress' | 'practical' | 'drill'>('progress');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [showEnrollModal, setShowEnrollModal] = useState<boolean>(false);

  const allProgress = storageService.getAllProgress();
  const practicalSubmissions = storageService.getPracticalSubmissions();
  const drillResults = storageService.getDrillResults();

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const courseCode = 'NORMA-5SD';

  const handleCopyCode = () => {
    audioService.playClickTone();
    try {
      navigator.clipboard.writeText(courseCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleOpenFeedback = (studentId: string) => {
    setSelectedStudentId(studentId);
    setTeacherFeedbackInput('Ananda sudah menunjukkan pemahaman yang sangat baik dalam bermusyawarah dan menaati norma.');
    setShowFeedbackSuccess(false);
  };

  const handleSaveFeedback = () => {
    setShowFeedbackSuccess(true);
    setTimeout(() => {
      setShowFeedbackSuccess(false);
      setSelectedStudentId(null);
    }, 1500);
  };

  // Metrics (Real values only)
  const totalStudents = students.length;
  const completedAll = students.filter((s) => s.completedActivities >= (s.totalActivities || 1)).length;
  const averageClassScore = totalStudents > 0
    ? Math.round(students.reduce((acc, curr) => acc + curr.averageScore, 0) / totalStudents)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-left space-y-8">
      {/* Top Header Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Total Siswa Terdaftar</span>
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {totalStudents}
          </span>
          <span className="text-xs text-slate-500 block mt-1">
            {totalStudents > 0 ? 'Siswa aktif belajar' : 'Belum ada siswa terdaftar'}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Tuntas Seluruh Modul</span>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-3xl font-bold text-emerald-800 font-mono tabular-nums">
            {completedAll}/{totalStudents}
          </span>
          <span className="text-xs text-emerald-700 block mt-1">
            {totalStudents > 0 ? `${Math.round((completedAll / totalStudents) * 100)}% ketuntasan siswa` : '0% ketuntasan'}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Tugas Practical Masuk</span>
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-3xl font-bold text-blue-800 font-mono tabular-nums">
            {practicalSubmissions.length}
          </span>
          <span className="text-xs text-blue-700 block mt-1">Respon kasus nyata</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-900 mb-1">
            <span className="font-semibold">Sesi Drill Selesai</span>
            <Gamepad2 className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-3xl font-bold text-amber-800 font-mono tabular-nums">
            {drillResults.length}
          </span>
          <span className="text-xs text-amber-800 block mt-1">Latihan penguatan tuntas</span>
        </div>
      </div>

      {/* Monitoring View Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 max-w-xl">
        <button
          type="button"
          onClick={() => setActiveViewTab('progress')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
            activeViewTab === 'progress'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-300'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Daftar Progres Siswa ({totalStudents})
        </button>

        <button
          type="button"
          onClick={() => setActiveViewTab('practical')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
            activeViewTab === 'practical'
              ? 'bg-white text-emerald-700 shadow-xs border border-slate-300'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Hasil Practical ({practicalSubmissions.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveViewTab('drill')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
            activeViewTab === 'drill'
              ? 'bg-white text-amber-700 shadow-xs border border-slate-300'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Hasil Drill ({drillResults.length})
        </button>
      </div>

      {/* TAB 1: MAIN STUDENT PROGRESS TABLE OR EMPTY STATE */}
      {activeViewTab === 'progress' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Daftar Progres Belajar Siswa
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Pemantauan capaian aktivitas, modul, skor perolehan, dan catatan refleksi siswa.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl font-medium">
                Pendidikan Pancasila: Norma dalam Kehidupanku
              </span>
            </div>
          </div>

          {/* Section 10 Empty State when 0 students */}
          {totalStudents === 0 ? (
            <div className="p-8 sm:p-14 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Inbox className="w-8 h-8" />
              </div>

              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-xl font-bold text-slate-900">
                  Belum ada siswa yang terdaftar pada kursus ini.
                </h4>
                <p className="text-base text-slate-600">
                  Data siswa akan muncul setelah siswa bergabung ke kursus.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(true)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Kelola Pendaftaran</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm transition-colors border border-slate-200 cursor-pointer flex items-center gap-2"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Kode Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>Salin Kode Kursus ({courseCode})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-xs">
                  <tr>
                    <th className="py-3.5 px-6">Nama Siswa</th>
                    <th className="py-3.5 px-4">Aktivitas Selesai</th>
                    <th className="py-3.5 px-4">Rata-rata Skor</th>
                    <th className="py-3.5 px-4">Status Belajar</th>
                    <th className="py-3.5 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {students.map((student) => {
                    const percent = Math.round(
                      (student.completedActivities / (student.totalActivities || 1)) * 100
                    );

                    return (
                      <tr key={student.id} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="py-4 px-6 font-semibold text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                              {student.name.charAt(0)}
                            </span>
                            <span>{student.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold">
                          {student.completedActivities}/{student.totalActivities} ({percent}%)
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-slate-900">
                          {student.averageScore}/100
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {student.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenFeedback(student.id)}
                            className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-indigo-700"
                          >
                            Beri Umpan Balik
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRACTICAL SUBMISSIONS */}
      {activeViewTab === 'practical' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            Hasil Respon Aktivitas Practical Siswa
          </h3>
          {practicalSubmissions.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              Belum ada siswa yang mengumpulkan tugas practical.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {practicalSubmissions.map((ps) => (
                <div key={ps.id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-900">{ps.studentName}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(ps.submittedAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">
                    <strong>Pilihan:</strong> {ps.selectedOptionLabel}
                  </p>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <strong>Alasan Siswa:</strong> "{ps.reasoningText}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DRILL RESULTS */}
      {activeViewTab === 'drill' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            Riwayat Sesi Latihan Drill Siswa
          </h3>
          {drillResults.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              Belum ada siswa yang menyelesaikan sesi latihan drill.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {drillResults.map((dr) => (
                <div key={dr.id} className="py-4 flex items-center justify-between text-sm">
                  <div>
                    <span className="font-bold text-slate-900 block">{dr.studentName}</span>
                    <span className="text-xs text-slate-500">{dr.topic} · Tingkat: {dr.difficulty}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 block">{dr.masteryPercentage}%</span>
                    <span className="text-xs text-emerald-700">{dr.correctCount}/{dr.totalQuestions} Benar</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Pendaftaran */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900">
              Kelola Pendaftaran Siswa
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Bagikan kode kelas berikut kepada siswa kelas V agar mereka dapat bergabung:
            </p>

            <div className="p-4 bg-slate-100 rounded-2xl text-center font-mono font-bold text-2xl text-indigo-700 border border-slate-200 tracking-wider">
              {courseCode}
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEnrollModal(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
              >
                {copiedCode ? 'Disalin!' : 'Salin Kode'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
