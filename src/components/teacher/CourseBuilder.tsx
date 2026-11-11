import React, { useState, useEffect } from 'react';
import { Course, Module, Activity, LearningStage, H5PContentPackage } from '../../types';
import { storageService, AutosaveStatus } from '../../services/storageService';
import { AutosaveBadge } from '../common/AutosaveBadge';
import { H5PUploader } from '../h5p/H5PUploader';
import { H5PPreview } from '../h5p/H5PPreview';
import { PrePublishModal } from './PrePublishModal';

interface CourseBuilderProps {
  initialCourse: Course;
  onCourseUpdated?: (course: Course) => void;
  onOpenPreviewH5P?: (pkg: H5PContentPackage) => void;
}

const AVAILABLE_STAGES: { stage: LearningStage; label: string; desc: string }[] = [
  { stage: 'welcome', label: 'Welcome / Sambutan', desc: 'Pengantar dan sasaran petualangan' },
  { stage: 'get-ready', label: 'Get Ready / Kesiapan', desc: 'Apersepsi dan cek pemahaman awal' },
  { stage: 'real-life-context', label: 'Real-Life Context', desc: 'Situasi nyata kehidupan siswa sehari-hari' },
  { stage: 'explore', label: 'Explore / Eksplorasi', desc: 'Pertanyaan pemantik dan pengamatan' },
  { stage: 'learn', label: 'Learn / Konsep Inti', desc: 'Pemaparan nilai luhur Pancasila' },
  { stage: 'practice', label: 'Play & Practice (H5P)', desc: 'Aktivitas interaktif Lumi (Drag & Drop, Quiz)' },
  { stage: 'apply', label: 'Apply / Penerapan', desc: 'Studi kasus dan simulasi musyawarah' },
  { stage: 'assess', label: 'Assess / Evaluasi', desc: 'Tantangan pemahaman dan kuis akhir' },
  { stage: 'reflect', label: 'Reflect / Refleksi', desc: 'Jurnal perasaan dan komitmen kebaikan' },
  { stage: 'celebrate', label: 'Celebrate / Perayaan', desc: 'Apresiasi bintang dan lencana' },
];

export const CourseBuilder: React.FC<CourseBuilderProps> = ({
  initialCourse,
  onCourseUpdated,
}) => {
  const [course, setCourse] = useState<Course>(initialCourse);
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>('saved');
  const [activeModuleId, setActiveModuleId] = useState<string>(
    initialCourse.modules[0]?.id || ''
  );
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  // Modals & Panels
  const [showPrePublishModal, setShowPrePublishModal] = useState<boolean>(false);
  const [previewPackage, setPreviewPackage] = useState<H5PContentPackage | null>(null);
  const [showH5PUploader, setShowH5PUploader] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Subscribe to autosave changes
  useEffect(() => {
    const unsubscribe = storageService.onAutosaveChange((status) => {
      setAutosaveStatus(status);
    });
    return unsubscribe;
  }, []);

  // Trigger autosave when course state changes
  const updateCourse = (updated: Course) => {
    setCourse(updated);
    storageService.saveCourse(updated);
    onCourseUpdated?.(updated);
  };

  const handleTitleChange = (val: string) => {
    updateCourse({ ...course, title: val });
  };

  const handleDescChange = (val: string) => {
    updateCourse({ ...course, description: val });
  };

  // Add / remove learning objective
  const handleAddObjective = () => {
    const updated = [
      ...course.learningObjectives,
      'Siswa mampu menunjukkan sikap toleransi dan kerja sama dalam keberagaman.',
    ];
    updateCourse({ ...course, learningObjectives: updated });
  };

  const handleRemoveObjective = (idx: number) => {
    const updated = course.learningObjectives.filter((_, i) => i !== idx);
    updateCourse({ ...course, learningObjectives: updated });
  };

  const handleObjectiveChange = (idx: number, val: string) => {
    const updated = [...course.learningObjectives];
    updated[idx] = val;
    updateCourse({ ...course, learningObjectives: updated });
  };

  // Module management
  const handleAddModule = () => {
    const newMod: Module = {
      id: 'mod_' + Date.now(),
      courseId: course.id,
      title: `Misi ${course.modules.length + 1}: Pengamalan Sila Pancasila`,
      description: 'Mempelajari pengamalan sila Pancasila dalam pertemanan di sekolah.',
      order: course.modules.length + 1,
      activities: [],
    };
    const updatedModules = [...course.modules, newMod];
    updateCourse({ ...course, modules: updatedModules });
    setActiveModuleId(newMod.id);
  };

  // Activity management
  const handleAddActivity = (moduleId: string) => {
    const targetMod = course.modules.find((m) => m.id === moduleId);
    if (!targetMod) return;

    const newAct: Activity = {
      id: 'act_' + Date.now(),
      moduleId,
      title: 'Aktivitas Baru: Eksplorasi Nilai Kebaikan',
      stage: 'practice',
      stageLabel: 'Play & Practice',
      estimatedMinutes: 10,
      difficulty: 'mudah',
      instruction: 'Kerjakan aktivitas interaktif berikut dengan cermat.',
      learningObjective: 'Memahami contoh pengamalan nilai Pancasila.',
      type: 'h5p',
      passingScore: 70,
      maxScore: 100,
      isRequired: true,
    };

    const updatedModules = course.modules.map((m) => {
      if (m.id === moduleId) {
        return { ...m, activities: [...m.activities, newAct] };
      }
      return m;
    });

    updateCourse({ ...course, modules: updatedModules });
    setSelectedActivityId(newAct.id);
  };

  // Attach uploaded H5P package to current selected activity
  const handleAttachH5P = (pkg: H5PContentPackage) => {
    if (!selectedActivityId) return;

    const updatedModules = course.modules.map((m) => ({
      ...m,
      activities: m.activities.map((a) => {
        if (a.id === selectedActivityId) {
          return {
            ...a,
            title: pkg.title || a.title,
            h5pPackage: pkg,
            type: 'h5p' as const,
          };
        }
        return a;
      }),
    }));

    updateCourse({ ...course, modules: updatedModules });
    setShowH5PUploader(false);
    setNotificationMsg(`✓ Paket H5P "${pkg.title}" berhasil dihubungkan ke aktivitas.`);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Pre-Publish validation check
  const prePublishResult = storageService.validateCourseForPublish(course);

  const handleConfirmPublish = () => {
    updateCourse({ ...course, status: 'published' });
    setShowPrePublishModal(false);
    setNotificationMsg('🎉 Course PKn berhasil dipublikasikan untuk seluruh siswa Kelas V!');
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const activeModule = course.modules.find((m) => m.id === activeModuleId) || course.modules[0];
  const selectedActivity = activeModule?.activities.find((a) => a.id === selectedActivityId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top action & autosave bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl">
            ✏️
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Course Builder & Kurikulum PKn
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-500">
                Pendidikan Pancasila · Fase C (Kelas V)
              </span>
              <span>·</span>
              <AutosaveBadge
                status={autosaveStatus}
                onRetry={() => storageService.saveCourse(course)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPrePublishModal(true)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
              prePublishResult.canPublish
                ? 'bg-[#6BCB77] hover:bg-emerald-600 text-white'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
            }`}
          >
            <span>{prePublishResult.canPublish ? '🚀 Siap Publish' : '⚠️ Validasi Pra-Publikasi'}</span>
            {!prePublishResult.canPublish && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {prePublishResult.issues.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Floating Notification */}
      {notificationMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-in slide-in-from-top-2">
          <span>{notificationMsg}</span>
          <button onClick={() => setNotificationMsg(null)} className="cursor-pointer">✕</button>
        </div>
      )}

      {/* Course Core Metadata Editor */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8">
        <h3 className="font-display text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Informasi Utama Pembelajaran
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Judul Pembelajaran / Course:
            </label>
            <input
              type="text"
              value={course.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: Meneladani Nilai Pancasila & Semangat Gotong Royong"
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Sasaran & Tingkat Kelas:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`${course.grade} (${course.semester})`}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 font-medium"
              />
              <span className="px-3 py-3 rounded-xl bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200 shrink-0">
                {course.status === 'published' ? '✓ Published' : 'Draft'}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Deskripsi Pengalaman Belajar (LXD):
          </label>
          <textarea
            rows={3}
            value={course.description}
            onChange={(e) => handleDescChange(e.target.value)}
            placeholder="Jelaskan alur belajar yang ramah anak dan kontekstual..."
            className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Learning Objectives List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-700">
              Capaian Pembelajaran (Learning Objectives):
            </label>
            <button
              type="button"
              onClick={handleAddObjective}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
            >
              + Tambah Capaian
            </button>
          </div>

          <div className="space-y-2">
            {course.learningObjectives.map((obj, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400 w-5">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  value={obj}
                  onChange={(e) => handleObjectiveChange(idx, e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveObjective(idx)}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 text-xs cursor-pointer"
                  title="Hapus capaian"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modules & Activities Split Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Module Navigator Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs h-fit">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h4 className="font-display text-base font-bold text-slate-900">
              Daftar Modul ({course.modules.length})
            </h4>
            <button
              type="button"
              onClick={handleAddModule}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              + Modul Baru
            </button>
          </div>

          <div className="space-y-2.5">
            {course.modules.map((m, idx) => {
              const isSelected = m.id === activeModuleId;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setActiveModuleId(m.id);
                    setSelectedActivityId(null);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/90 border-amber-400 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Modul {idx + 1}
                  </span>
                  <h5 className="font-bold text-xs text-slate-900 line-clamp-1 mt-0.5">
                    {m.title}
                  </h5>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    {m.activities.length} Aktivitas Pembelajaran
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Module Activities Deck */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          {activeModule ? (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-6">
                <div>
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                    PENGATURAN MODUL
                  </span>
                  <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">
                    {activeModule.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddActivity(activeModule.id)}
                  className="px-4 py-2 bg-[#4D96FF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  + Tambah Aktivitas
                </button>
              </div>

              {/* Activity Cards List */}
              <div className="space-y-3 mb-6">
                {activeModule.activities.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <p className="text-xs text-slate-500">
                      Modul ini belum memiliki aktivitas. Klik &ldquo;Tambah Aktivitas&rdquo; di atas.
                    </p>
                  </div>
                ) : (
                  activeModule.activities.map((act, actIdx) => {
                    const isSelected = act.id === selectedActivityId;

                    return (
                      <div
                        key={act.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isSelected
                            ? 'bg-amber-50/80 border-amber-400 shadow-xs'
                            : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[10px] font-mono font-bold text-slate-600">
                              {actIdx + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-900">{act.title}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                              {act.stageLabel || act.stage}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedActivityId(isSelected ? null : act.id)
                              }
                              className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-white rounded-md border border-slate-200 cursor-pointer"
                            >
                              {isSelected ? 'Tutup Pengaturan' : '⚙️ Atur'}
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-1">{act.learningObjective}</p>

                        {/* Expandable Activity Details & H5P Linker */}
                        {isSelected && (
                          <div className="mt-4 pt-4 border-t border-amber-200/70 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                  Judul Aktivitas:
                                </label>
                                <input
                                  type="text"
                                  value={act.title}
                                  onChange={(e) => {
                                    const updated = course.modules.map((m) => ({
                                      ...m,
                                      activities: m.activities.map((a) =>
                                        a.id === act.id ? { ...a, title: e.target.value } : a
                                      ),
                                    }));
                                    updateCourse({ ...course, modules: updated });
                                  }}
                                  className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                  Tahap Pembelajaran LXD:
                                </label>
                                <select
                                  value={act.stage}
                                  onChange={(e) => {
                                    const chosen = AVAILABLE_STAGES.find((s) => s.stage === e.target.value);
                                    const updated = course.modules.map((m) => ({
                                      ...m,
                                      activities: m.activities.map((a) =>
                                        a.id === act.id
                                          ? {
                                              ...a,
                                              stage: e.target.value as LearningStage,
                                              stageLabel: chosen?.label || e.target.value,
                                            }
                                          : a
                                      ),
                                    }));
                                    updateCourse({ ...course, modules: updated });
                                  }}
                                  className="w-full p-2 rounded-xl border border-slate-300 text-xs bg-white"
                                >
                                  {AVAILABLE_STAGES.map((s) => (
                                    <option key={s.stage} value={s.stage}>
                                      {s.label} ({s.desc})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* H5P Media Attachment Section */}
                            <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-800">
                                  Media Interaktif H5P (Lumi):
                                </span>
                                {act.h5pPackage && (
                                  <button
                                    type="button"
                                    onClick={() => setPreviewPackage(act.h5pPackage || null)}
                                    className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                                  >
                                    👁️ Preview Media
                                  </button>
                                )}
                              </div>

                              {act.h5pPackage ? (
                                <div className="flex items-center justify-between text-xs text-emerald-900 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                                  <div>
                                    <span className="font-bold">{act.h5pPackage.title}</span>
                                    <span className="block text-[11px] text-emerald-700 font-mono">
                                      {act.h5pPackage.library}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setShowH5PUploader(true)}
                                    className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-800 rounded-md font-semibold cursor-pointer"
                                  >
                                    Ganti Paket H5P
                                  </button>
                                </div>
                              ) : (
                                <div className="text-center py-3">
                                  <p className="text-xs text-slate-500 mb-2">
                                    Belum ada paket H5P dari Lumi yang dipasang pada aktivitas ini.
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => setShowH5PUploader(true)}
                                    className="px-4 py-1.5 bg-[#4D96FF] text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors cursor-pointer"
                                  >
                                    📦 Hubungkan Paket H5P Lumi
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Pilih salah satu modul di sebelah kiri.
            </div>
          )}
        </div>
      </div>

      {/* H5P Uploader Modal */}
      {showH5PUploader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="max-w-2xl w-full">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setShowH5PUploader(false)}
                className="bg-white/80 hover:bg-white text-slate-800 text-xs px-3 py-1 rounded-lg cursor-pointer"
              >
                ✕ Tutup
              </button>
            </div>
            <H5PUploader
              onPackageReady={handleAttachH5P}
              onPreviewRequested={(pkg) => setPreviewPackage(pkg)}
            />
          </div>
        </div>
      )}

      {/* Pre-Publish Modal */}
      {showPrePublishModal && (
        <PrePublishModal
          validationResult={prePublishResult}
          onPublishConfirm={handleConfirmPublish}
          onClose={() => setShowPrePublishModal(false)}
        />
      )}

      {/* Full H5P Preview Modal */}
      {previewPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="max-w-4xl w-full my-auto">
            <H5PPreview
              packageData={previewPackage}
              onClose={() => setPreviewPackage(null)}
              onPublish={() => {
                setPreviewPackage(null);
                setNotificationMsg('✓ Media H5P tervalidasi dan siap digunakan.');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
