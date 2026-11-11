import React, { useState } from 'react';
import { Course, User, EnrolledStudent } from '../../types';
import { storageService } from '../../services/storageService';
import { audioService } from '../../services/audioService';
import { 
  Users, 
  Award, 
  BookOpen, 
  Copy, 
  Check, 
  UserPlus, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Inbox
} from 'lucide-react';

interface TeacherDashboardProps {
  course: Course;
  user: User;
  onNavigate: (tab: string) => void;
  onOpenPrePublish: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  course,
  user,
  onNavigate,
  onOpenPrePublish,
}) => {
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [showManageModal, setShowManageModal] = useState<boolean>(false);

  const prePublishResult = storageService.validateCourseForPublish(course);
  const enrolledStudents = storageService.getEnrolledStudents();
  const totalStudents = enrolledStudents.length;

  const completedAll = enrolledStudents.filter(
    (s) => s.completedActivities >= (s.totalActivities || 1)
  ).length;

  const needHelpCount = enrolledStudents.filter((s) => s.needsHelp).length;
  const avgScore = totalStudents > 0
    ? Math.round(enrolledStudents.reduce((acc, curr) => acc + curr.averageScore, 0) / totalStudents)
    : 0;

  const courseCode = 'NORMA-5SD';

  const handleCopyCode = () => {
    audioService.playClickTone();
    try {
      navigator.clipboard.writeText(courseCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // fallback
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-left space-y-8">
      {/* Teacher Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-3 py-1 rounded-full border border-white/20 inline-block">
            Panel Guru Pendidikan Pancasila · Fase C (Kelas V)
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            Selamat Datang, {user.name}!
          </h1>

          <p className="text-base text-blue-100 leading-relaxed font-normal">
            Kelola alur materi pembelajaran Bab 2: Norma dalam Kehidupanku, validasi media interaktif <strong>Lumi (.h5p)</strong>, dan pantau ketuntasan capaian siswa secara nyata tanpa data rekayasa.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => onNavigate('course-builder')}
              className="px-6 py-3 bg-[#FFD43B] hover:bg-yellow-400 text-slate-900 font-bold rounded-2xl text-sm transition-all shadow-xs cursor-pointer"
            >
              Buka Course Builder
            </button>
            <button
              type="button"
              onClick={() => onNavigate('h5p-studio')}
              className="px-5 py-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-2xl text-sm transition-colors border border-white/20 cursor-pointer"
            >
              Kelola H5P Lumi
            </button>
            <button
              type="button"
              onClick={() => onNavigate('student-monitoring')}
              className="px-5 py-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-2xl text-sm transition-colors border border-white/20 cursor-pointer"
            >
              Pemantauan Siswa ({totalStudents})
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview (Strictly zero when no students enrolled) */}
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
            {totalStudents > 0 ? 'Siswa aktif bergabung' : 'Belum ada siswa'}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Tingkat Ketuntasan</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-3xl font-bold text-emerald-800 font-mono tabular-nums">
            {totalStudents > 0 ? Math.round((completedAll / totalStudents) * 100) : 0}%
          </span>
          <span className="text-xs text-emerald-700 block mt-1">
            {completedAll} dari {totalStudents} siswa tuntas
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Rata-rata Nilai</span>
            <Award className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-3xl font-bold text-blue-800 font-mono tabular-nums">
            {avgScore}
          </span>
          <span className="text-xs text-blue-700 block mt-1">Standar KKM: 70/100</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-900 mb-1">
            <span className="font-semibold">Perlu Pendampingan</span>
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-3xl font-bold text-amber-800 font-mono tabular-nums">
            {needHelpCount}
          </span>
          <span className="text-xs text-amber-800 block mt-1">
            {needHelpCount > 0 ? `${needHelpCount} siswa perlu bantuan` : 'Tidak ada kendala'}
          </span>
        </div>
      </div>

      {/* =========================================================================
          SECTION 10 EMPTY STATE: JIKA BELUM ADA SISWA
          Pesan: "Belum ada siswa yang terdaftar pada kursus ini."
          Petunjuk: "Data siswa akan muncul setelah siswa bergabung ke kursus."
          Tombol: "Kelola Pendaftaran", "Salin Kode Kursus"
         ========================================================================= */}
      {totalStudents === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Inbox className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Belum ada siswa yang terdaftar pada kursus ini.
            </h3>
            <p className="text-base text-slate-600">
              Data siswa akan muncul setelah siswa bergabung ke kursus.
            </p>
          </div>

          {/* Action Buttons: Kelola Pendaftaran & Salin Kode Kursus */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowManageModal(true)}
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
        /* Render student table when real students exist */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            Daftar Siswa Terdaftar ({totalStudents})
          </h3>
          <div className="divide-y divide-slate-100">
            {enrolledStudents.map((st) => (
              <div key={st.id} className="py-3 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-900">{st.name}</span>
                <span className="text-xs text-slate-500 font-mono">
                  {st.completedActivities}/{st.totalActivities} Selesai
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course Status & Pre-Publish Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Status Publikasi Kursus
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {course.title}: Norma dalam Kehidupanku
            </h3>
            <p className="text-sm text-slate-600 mt-0.5">
              Status: <span className="font-bold text-emerald-700 capitalize">{course.status}</span> · Modul Pembelajaran: {course.modules.length} Tahap
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenPrePublish}
            className="px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            Validasi Pra-Publikasi
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase block">Total Modul</span>
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {course.modules.length}
            </span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase block">Total Aktivitas</span>
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {prePublishResult.stats.totalActivities}
            </span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase block">Media H5P Valid</span>
            <span className="text-2xl font-bold text-emerald-700 font-mono">
              {prePublishResult.stats.validH5PCount}
            </span>
          </div>
        </div>
      </div>

      {/* Pendaftaran Modal */}
      {showManageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900">
              Kelola Pendaftaran Siswa
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Bagikan kode kursus berikut kepada siswa kelas V agar mereka dapat bergabung dan mulai belajar:
            </p>

            <div className="p-4 bg-slate-100 rounded-2xl text-center font-mono font-bold text-2xl text-indigo-700 border border-slate-200 tracking-wider">
              {courseCode}
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowManageModal(false)}
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
