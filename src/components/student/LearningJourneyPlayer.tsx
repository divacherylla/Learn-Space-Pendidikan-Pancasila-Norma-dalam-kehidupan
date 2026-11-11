import React, { useState, useEffect } from 'react';
import { Course, Activity, LearningStage } from '../../types';
import { storageService } from '../../services/storageService';
import { H5PPlayer } from '../h5p/H5PPlayer';
import { H5PScore } from '../h5p/H5PScore';
import { H5PCompletion } from '../h5p/H5PCompletion';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { ChapterSummaryView } from './ChapterSummaryView';
import { 
  BookOpen, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Target, 
  HelpCircle, 
  Sparkles, 
  X, 
  Award, 
  FileText 
} from 'lucide-react';

const LXD_STAGE_ORDER: { stage: LearningStage; label: string }[] = [
  { stage: 'welcome', label: 'Pengantar' },
  { stage: 'get-ready', label: 'Persiapan' },
  { stage: 'real-life-context', label: 'Konteks Cerita' },
  { stage: 'explore', label: 'Eksplorasi' },
  { stage: 'learn', label: 'Materi Inti' },
  { stage: 'practice', label: 'Latihan Interaktif' },
  { stage: 'apply', label: 'Penerapan' },
  { stage: 'assess', label: 'Penilaian' },
  { stage: 'reflect', label: 'Refleksi' },
  { stage: 'celebrate', label: 'Perayaan' },
];

interface LearningJourneyPlayerProps {
  course: Course;
  initialActivityId?: string;
  studentId?: string;
  studentName?: string;
  onGoToDashboard?: () => void;
  onActivityChanged?: (activityId: string) => void;
}

export const LearningJourneyPlayer: React.FC<LearningJourneyPlayerProps> = ({
  course,
  initialActivityId,
  studentId = 'std_raka',
  studentName = 'Raka Pratama',
  onGoToDashboard,
  onActivityChanged,
}) => {
  // Collect all activities flatly
  const allActivities: Activity[] = [];
  course.modules.forEach((m) => {
    m.activities.forEach((act) => {
      allActivities.push(act);
    });
  });

  const [currentActIndex, setCurrentActIndex] = useState<number>(() => {
    if (initialActivityId) {
      const idx = allActivities.findIndex((a) => a.id === initialActivityId);
      if (idx >= 0) return idx;
    }
    return 0;
  });

  const currentActivity = allActivities[currentActIndex] || allActivities[0];
  const [progressRecord, setProgressRecord] = useState(() =>
    storageService.getProgressForActivity(studentId, currentActivity?.id)
  );

  // States for activity completion
  const [isActivityDone, setIsActivityDone] = useState(
    progressRecord?.status === 'completed'
  );
  const [activityScore, setActivityScore] = useState<number | null>(
    progressRecord?.score ?? null
  );

  // Reflection journal states
  const [reflectionMood, setReflectionMood] = useState<'senang' | 'bangga' | 'penasaran' | 'perlu-bantuan'>(
    progressRecord?.reflectionMood || 'senang'
  );
  const [reflectionText, setReflectionText] = useState<string>(
    progressRecord?.reflectionText || ''
  );
  const [isReflectionSaved, setIsReflectionSaved] = useState<boolean>(
    Boolean(progressRecord?.reflectionText)
  );

  // Track time spent
  const [startTime] = useState<number>(Date.now());
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);

  useEffect(() => {
    if (currentActivity) {
      const rec = storageService.getProgressForActivity(studentId, currentActivity.id);
      setProgressRecord(rec);
      setIsActivityDone(rec?.status === 'completed');
      setActivityScore(rec?.score ?? null);
      setReflectionMood(rec?.reflectionMood || 'senang');
      setReflectionText(rec?.reflectionText || '');
      setIsReflectionSaved(Boolean(rec?.reflectionText));
      onActivityChanged?.(currentActivity.id);
    }
  }, [currentActIndex, currentActivity, studentId, onActivityChanged]);

  const handleNextActivity = () => {
    if (currentActIndex < allActivities.length - 1) {
      setCurrentActIndex((prev) => prev + 1);
    }
  };

  const handlePrevActivity = () => {
    if (currentActIndex > 0) {
      setCurrentActIndex((prev) => prev - 1);
    }
  };

  // Called when H5P completes or student submits exercise
  const handleH5PCompletion = (score: number, maxScore: number) => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const rec = storageService.recordProgress({
      studentId,
      studentName,
      courseId: course.id,
      moduleId: currentActivity.moduleId,
      activityId: currentActivity.id,
      status: 'completed',
      score,
      maxScore,
      percentage: Math.round((score / Math.max(maxScore, 1)) * 100),
      timeSpentSeconds: timeSpent,
      lastAttemptAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    });
    setProgressRecord(rec);
    setActivityScore(score);
    setIsActivityDone(true);
  };

  const handleSaveReflection = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const textToSave = reflectionText.trim() || 'Saya belajar memahami pentingnya musyawarah dan tolong menolong.';
    const rec = storageService.recordProgress({
      studentId,
      studentName,
      courseId: course.id,
      moduleId: currentActivity.moduleId,
      activityId: currentActivity.id,
      status: 'completed',
      score: 100,
      maxScore: 100,
      percentage: 100,
      timeSpentSeconds: timeSpent,
      lastAttemptAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      reflectionMood,
      reflectionText: textToSave,
    });
    setProgressRecord(rec);
    setIsReflectionSaved(true);
    setIsActivityDone(true);
  };

  if (!currentActivity) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 text-center bg-white rounded-3xl border border-slate-200">
        <p className="text-slate-600 text-sm">Belum ada aktivitas pembelajaran yang tersedia.</p>
        {onGoToDashboard && (
          <button
            onClick={onGoToDashboard}
            className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            Kembali ke Beranda
          </button>
        )}
      </div>
    );
  }

  // Find corresponding module
  const currentModule = course.modules.find((m) => m.id === currentActivity.moduleId);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      {/* Top Breadcrumb & Step Navigation */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <span>{course.title}</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">{currentModule?.title}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            {currentActivity.title}
          </h1>
        </div>

        {/* Stage badge & Quick Actions */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowSummaryModal(true)}
            className="text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3.5 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
            title="Buka Rangkuman Materi jika butuh panduan materi"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Rangkuman Materi</span>
          </button>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 uppercase tracking-wider">
            {currentActivity.stageLabel || currentActivity.stage}
          </span>
          <span className="text-sm text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-xl font-mono tabular-nums font-semibold">
            {currentActIndex + 1} / {allActivities.length}
          </span>
        </div>
      </div>

      {/* LXD Journey Progress Strip */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs mb-8 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[640px] gap-2">
          {allActivities.map((act, idx) => {
            const isCurrent = idx === currentActIndex;
            const isPassed = storageService.getProgressForActivity(studentId, act.id)?.status === 'completed';

            return (
              <button
                key={act.id}
                type="button"
                onClick={() => setCurrentActIndex(idx)}
                className={`flex-1 p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-50 border-indigo-400 shadow-xs ring-1 ring-indigo-300'
                    : isPassed
                    ? 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/50'
                    : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Langkah {idx + 1}
                  </span>
                  {isPassed ? (
                    <span className="text-xs text-emerald-600 font-bold">✓</span>
                  ) : (
                    <span className="text-xs text-slate-300">○</span>
                  )}
                </div>
                <p className="text-sm font-bold text-slate-800 line-clamp-1">{act.title}</p>
                <span className="text-xs text-slate-500 block truncate mt-0.5">
                  {act.stageLabel || act.stage}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Learning Activity Canvas */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6">
        {/* Learning Guidance Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/70 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-0.5">
              Tujuan Pembelajaran:
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {currentActivity.learningObjective}
            </p>
            <p className="text-xs text-slate-500 mt-1 italic">
              Petunjuk: {currentActivity.instruction}
            </p>
          </div>
        </div>

        {/* 1. Context Story Activity */}
        {currentActivity.type === 'context-story' && currentActivity.storyContext && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-amber-50/90 to-yellow-50/40 p-6 rounded-2xl border border-amber-200">
              <span className="text-xs font-bold text-amber-800 bg-amber-200/60 px-2.5 py-1 rounded-md">
                Kisah Sahabat Pancasila
              </span>
              <h3 className="font-display text-xl font-bold text-slate-900 mt-2 mb-3">
                {currentActivity.storyContext.headline}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-4 font-normal">
                {currentActivity.storyContext.narrative}
              </p>

              <div className="bg-white p-4 rounded-xl border border-amber-300 shadow-2xs">
                <span className="text-xs font-bold text-slate-800 block mb-1">
                  🤔 Pertanyaan Eksplorasi:
                </span>
                <p className="text-xs text-slate-700 font-medium">
                  {currentActivity.storyContext.sceneQuestion}
                </p>
              </div>
            </div>

            {/* Complete contextual reading button */}
            <div className="text-center pt-2">
              {!isActivityDone ? (
                <button
                  type="button"
                  onClick={() => handleH5PCompletion(100, 100)}
                  className="px-6 py-3 bg-[#6BCB77] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  ✓ Saya Sudah Membaca & Memahami Kisah Ini
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                  <span>✓</span> Tahap ini telah diselesaikan!
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Interactive H5P Activity (Lumi) */}
        {currentActivity.type === 'h5p' && (
          <div>
            <ErrorBoundary
              fallbackTitle="Media H5P Belum Dapat Dibuka"
              fallbackMessage="Coba muat ulang halaman. Jika masalah masih terjadi, beri tahu gurumu."
              componentContext="H5PPlayer in LearningJourney"
            >
              {currentActivity.h5pPackage ? (
                <H5PPlayer
                  packageData={currentActivity.h5pPackage}
                  onComplete={(score, max) => handleH5PCompletion(score, max)}
                />
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-500">
                    Aktivitas media interaktif sedang disiapkan oleh guru.
                  </p>
                </div>
              )}
            </ErrorBoundary>
          </div>
        )}

        {/* 3. Reflection Stage Activity */}
        {currentActivity.type === 'reflection' && (
          <div className="space-y-6">
            {currentActivity.stage === 'celebrate' ? (
              <H5PCompletion
                activityTitle={course.title}
                badgeName="🏅 Penjelajah Norma"
                earnedStars={50}
                onGoToDashboard={onGoToDashboard}
              />
            ) : (
              <div className="max-w-2xl mx-auto bg-purple-50/50 p-6 sm:p-8 rounded-3xl border border-purple-200/80">
                <div className="text-center mb-6">
                  <span className="text-3xl block mb-1">✨</span>
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    Jurnal Refleksi: Norma dalam Kehidupanku
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Renungkan apa yang telah kamu pelajari dan tentukan komitmen tindakan kebaikanmu.
                  </p>
                </div>

                {/* Understanding level selection */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Tingkat Pemahamanmu:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'sangat-paham', label: 'Sangat Paham', icon: '😊' },
                      { id: 'cukup-paham', label: 'Cukup Paham', icon: '🙂' },
                      { id: 'masih-belajar', label: 'Masih Belajar', icon: '😐' },
                      { id: 'butuh-bantuan', label: 'Butuh Bantuan', icon: '🤔' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setReflectionMood(m.id as any)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          reflectionMood === m.id
                            ? 'bg-purple-100 border-purple-400 font-bold text-purple-950 shadow-2xs scale-105'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-2xl block mb-1">{m.icon}</span>
                        <span className="text-xs block">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reflection Text Prompt */}
                <div className="mb-6 space-y-3">
                  <label className="block text-xs font-bold text-slate-800">
                    Jawablah pertanyaan refleksi berikut:
                  </label>
                  <div className="bg-white/80 p-3.5 rounded-2xl border border-purple-200 text-xs text-slate-700 space-y-1">
                    <p>• <strong>Apa hal penting yang kamu pelajari dari materi ini?</strong></p>
                    <p>• <strong>Norma apa yang paling sering kamu lakukan di rumah?</strong></p>
                    <p>• <strong>Bagaimana kamu menerapkan norma di sekolah?</strong></p>
                    <p>• <strong>Apa komitmen yang akan kamu lakukan setelah ini?</strong></p>
                  </div>
                  <textarea
                    rows={4}
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="Tuliskan jawaban dan komitmenmu di sini dengan jujur dan santun..."
                    className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleSaveReflection}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 inline-flex items-center gap-2"
                  >
                    <span>{isReflectionSaved ? '✓ Refleksi Tersimpan (Simpan Ulang)' : 'Simpan Refleksi ke Jurnal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handlePrevActivity}
          disabled={currentActIndex === 0}
          className="px-5 py-3 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-40 text-slate-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Aktivitas Sebelumnya</span>
        </button>

        {onGoToDashboard && (
          <button
            type="button"
            onClick={onGoToDashboard}
            className="text-sm text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
          >
            Kembali ke Beranda Belajar
          </button>
        )}

        <button
          type="button"
          onClick={handleNextActivity}
          disabled={currentActIndex >= allActivities.length - 1}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
        >
          <span>Aktivitas Berikutnya</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Rangkuman Modal Sheet */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-4xl w-full my-auto bg-slate-50 rounded-3xl overflow-hidden shadow-2xl border border-slate-300 max-h-[92vh] flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span className="font-display font-bold text-base">Buku Rangkuman: Norma dalam Kehidupanku</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                className="text-sm text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg cursor-pointer transition-colors inline-flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Tutup</span>
              </button>
            </div>
            <div className="overflow-y-auto p-2 sm:p-4 flex-1">
              <ChapterSummaryView
                onStartMission={(actId) => {
                  setShowSummaryModal(false);
                  if (actId) {
                    const idx = allActivities.findIndex((a) => a.id === actId);
                    if (idx >= 0) setCurrentActIndex(idx);
                  }
                }}
                onBackToDashboard={() => setShowSummaryModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
