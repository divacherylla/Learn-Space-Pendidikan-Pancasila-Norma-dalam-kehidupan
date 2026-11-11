import React, { useState } from 'react';
import { Course, User } from '../../types';
import { storageService } from '../../services/storageService';
import { audioService } from '../../services/audioService';
import { FeatureCard } from '../common/FeatureCard';
import { OnboardingModal } from '../common/OnboardingModal';
import { InteractiveVideoPlayer } from './InteractiveVideoPlayer';
import { VisualNormaExplorer } from './VisualNormaExplorer';
import { VisualHakKewajibanBalance } from './VisualHakKewajibanBalance';
import { 
  Tv, 
  Volume2, 
  VolumeX, 
  Eye, 
  Scale, 
  Compass, 
  HeartHandshake, 
  Users, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  FileText, 
  Award, 
  BookOpen, 
  Briefcase, 
  Gamepad2, 
  Bot,
  FileCheck2,
  HelpCircle,
  Clock,
  Compass as CompassIcon,
  Flame,
  Star
} from 'lucide-react';

interface StudentDashboardProps {
  course: Course;
  user: User;
  onStartLearning: (activityId?: string) => void;
  onOpenAchievements: () => void;
  onOpenSummary?: () => void;
  onUserUpdated?: (updatedUser: User) => void;
  onNavigateTab?: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  course,
  user,
  onStartLearning,
  onOpenAchievements,
  onOpenSummary,
  onUserUpdated,
  onNavigateTab,
}) => {
  // Multimedia view mode for Interactive Studio
  const [mediaMode, setMediaMode] = useState<'video' | 'visual_lab' | 'balance_sim' | 'missions'>('video');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [isIntroSpeaking, setIsIntroSpeaking] = useState<boolean>(false);
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(() => audioService.isSfxEnabled());

  const allProgress = storageService.getAllProgress();
  const studentProgress = allProgress.filter((p) => p.studentId === user.id);
  const assessmentAttempts = storageService.getAssessmentAttempts(user.id);
  const practicalSubmissions = storageService.getPracticalSubmissions();
  const drillResults = storageService.getDrillResults();
  const gameProgress = storageService.getGameProgress();

  // Total activities and completion status
  let totalActivitiesCount = 0;
  let completedCount = 0;

  course.modules.forEach((mod) => {
    mod.activities.forEach((act) => {
      totalActivitiesCount++;
      const isDone = studentProgress.some((p) => p.activityId === act.id && p.status === 'completed');
      if (isDone) completedCount++;
    });
  });

  const progressPercent =
    totalActivitiesCount > 0 ? Math.round((completedCount / totalActivitiesCount) * 100) : 0;

  // Handle bonus stars earned from video checkpoints or simulations
  const handleScoreEarned = (bonusDelta: number) => {
    const updated = storageService.addBonusStars(bonusDelta);
    if (updated && onUserUpdated) {
      onUserUpdated(updated);
    }
  };

  // Toggle Intro Speech Narration
  const handleToggleIntroSpeech = () => {
    audioService.playClickTone();
    if (isIntroSpeaking) {
      audioService.stopSpeaking();
      setIsIntroSpeaking(false);
    } else {
      setIsIntroSpeaking(true);
      const text = `Halo, Teman Belajar! Selamat datang di LearnSpace. Yuk, kenali cara menggunakan ruang belajar digital ini! Kamu dapat mempelajari materi Bab 2: Norma dalam Kehidupanku melalui video interaktif, aktivitas practical, latihan drill dan game petualangan, serta bertanya langsung kepada Teman Belajar. Selamat belajar!`;
      audioService.speakIndonesian(text, () => {
        setIsIntroSpeaking(false);
      });
    }
  };

  // Switch Media Mode
  const handleSwitchMode = (mode: 'video' | 'visual_lab' | 'balance_sim' | 'missions') => {
    audioService.playClickTone();
    audioService.stopSpeaking();
    setIsIntroSpeaking(false);
    setMediaMode(mode);
  };

  return (
    <div className="space-y-12 pb-16 text-left">
      {/* Onboarding Interactive Guide Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => {
          setShowOnboarding(false);
          storageService.setOnboardingCompleted(true);
        }}
        onStartLearning={() => {
          setShowOnboarding(false);
          storageService.setOnboardingCompleted(true);
          onStartLearning();
        }}
      />

      {/* =========================================================================
          SECTION 1: WELCOME / HERO SECTION
          Matching exact sapaan and action buttons from Section 8
         ========================================================================= */}
      <section className="bg-gradient-to-b from-[#FFF3D6] via-[#FFF9E6] to-[#FFF9E6] border-b border-amber-200/60 pt-8 sm:pt-12 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-900 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Pendidikan Pancasila Kelas V SD · Bab 2</span>
              </div>

              {/* Exact Greeting from Section 8 */}
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-slate-900 tracking-tight leading-tight">
                Halo, Teman Belajar! Selamat datang di LearnSpace.
              </h1>

              <p className="text-lg text-slate-700 leading-relaxed font-normal">
                Yuk, kenali cara menggunakan ruang belajar digital ini! Di sini kita akan mempelajari materi <strong>Bab 2: Norma dalam Kehidupanku</strong> melalui pengalaman belajar interaktif yang terstruktur, menyenangkan, dan bermakna.
              </p>

              {/* Exact Buttons from Section 8: "Lihat Panduan" & "Mulai Belajar" */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    audioService.playClickTone();
                    setShowOnboarding(true);
                  }}
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl text-base transition-all border-2 border-slate-200 shadow-xs hover:border-indigo-300 cursor-pointer flex items-center gap-2"
                >
                  <HelpCircle className="w-5 h-5 text-indigo-600" />
                  <span>Lihat Panduan</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    audioService.playClickTone();
                    onStartLearning();
                  }}
                  className="px-7 py-3.5 bg-[#FFD43B] hover:bg-yellow-400 text-slate-900 font-bold rounded-2xl text-base transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <span>Mulai Belajar</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={handleToggleIntroSpeech}
                  className={`px-4 py-3.5 rounded-2xl text-sm font-semibold transition-colors border cursor-pointer flex items-center gap-2 ${
                    isIntroSpeaking
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 animate-pulse'
                      : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white'
                  }`}
                  title="Dengarkan Sapaan Belajar"
                >
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                  <span className="hidden sm:inline">{isIntroSpeaking ? 'Hentikan Suara' : 'Dengarkan Sapaan'}</span>
                </button>
              </div>
            </div>

            {/* Right Visual Image Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xl space-y-4">
                <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900">
                  <img
                    src="/src/assets/images/norma_kehidupan_banner_1791175549077.jpg"
                    alt="Media Pembelajaran Interaktif Norma dalam Kehidupanku Kelas V SD"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-xl text-xs font-bold text-indigo-900 shadow-xs">
                    Media Digital Terpadu
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 pt-1">
                  <span className="font-semibold">Bab 2: Norma dalam Kehidupanku</span>
                  <span className="font-bold text-indigo-700">Kelas V SD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CARA MENGGUNAKAN LEARNSPACE
          5 langkah panduan siswa dari Section 8
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                Panduan Siswa
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Cara Menggunakan LearnSpace
              </h2>
              <p className="text-base text-slate-600 mt-0.5">
                Ikuti 5 langkah mudah berikut untuk mendapatkan pengalaman belajar yang optimal:
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                audioService.playClickTone();
                setShowOnboarding(true);
              }}
              className="self-start sm:self-auto px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-bold transition-colors cursor-pointer"
            >
              Buka Panduan Lengkap
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-base text-slate-900">Mulai Belajar</h3>
              <p className="text-sm text-slate-600 leading-snug">
                Pilih topik materi Bab 2 dan ikuti tayangan video atau media interaktif.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-base text-slate-900">Pelajari Tutorial</h3>
              <p className="text-sm text-slate-600 leading-snug">
                Pahami materi terstruktur 7 tahap mandiri disertai narasi suara Indonesia.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-base text-slate-900">Kerjakan Practical</h3>
              <p className="text-sm text-slate-600 leading-snug">
                Terapkan nilai norma ke dalam situasi nyata di rumah, sekolah, dan musyawarah.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
              <span className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-sm flex items-center justify-center">
                4
              </span>
              <h3 className="font-bold text-base text-slate-900">Drill & Game</h3>
              <p className="text-sm text-slate-600 leading-snug">
                Latih pemahaman melalui drill soal dan taklukkan petualangan game 5 level.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
              <span className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm flex items-center justify-center">
                5
              </span>
              <h3 className="font-bold text-base text-slate-900">Teman Belajar</h3>
              <p className="text-sm text-slate-600 leading-snug">
                Tanya materi kepada Chatbot AI dan baca rangkuman sebelum asesmen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: KURSUS UTAMA
          Bab 2: Norma dalam Kehidupanku, deskripsi, tujuan pembelajaran
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Kursus Utama · Pendidikan Pancasila SD Kelas V
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Bab 2: Norma dalam Kehidupanku
              </h2>
              <p className="text-base text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Materi pembelajaran resmi berpedoman pada Buku Panduan Guru Pendidikan Pancasila Kelas V SD. Membahas pengertian norma, empat macam norma (agama, kesusilaan, kesopanan, hukum), hak dan kewajiban, Pohon Normaku, serta musyawarah mufakat.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onStartLearning()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-base transition-all shadow-xs cursor-pointer shrink-0"
            >
              Buka Modul Kursus
            </button>
          </div>

          {/* Learning Objectives Checklist */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
              Tujuan Pembelajaran yang Akan Kamu Capai:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {course.learningObjectives.map((obj, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: ENAM FITUR PEMBELAJARAN (REUSABLE FEATURECARD - 3 COLS DESKTOP)
          Tutorial, Practical, Drill & Game, Chatbot, Rangkuman Materi, Assessment
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-200 inline-block mb-2">
            Metode Pembelajaran Terpadu
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Enam Fitur Pembelajaran LearnSpace
          </h2>
          <p className="text-base text-slate-600 mt-2">
            Pilih metode yang kamu butuhkan untuk memahami materi, berlatih, dan menguji kemampuan:
          </p>
        </div>

        {/* 6 Features Grid: 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Fitur 1: Tutorial */}
          <FeatureCard
            featureNumber={1}
            tag="Terstruktur"
            title="Tutorial Mandiri"
            description="Materi terstruktur 7 tahap: Pengenalan, Tujuan, Kasus Nyata, Visual Hotspot, Contoh, Checkpoint, dan Rangkuman dengan narasi suara."
            icon={BookOpen}
            iconBgColor="bg-blue-50 text-blue-600"
            badgeColor="text-blue-700 bg-blue-50 border-blue-200"
            buttonText="Buka Tutorial"
            onAction={() => (onNavigateTab ? onNavigateTab('tutorial') : null)}
          />

          {/* Fitur 2: Practical */}
          <FeatureCard
            featureNumber={2}
            tag="Kasus Nyata"
            title="Aktivitas Practical"
            description="Penerapan norma ke situasi nyata di rumah, sekolah, dan musyawarah. Latih pengambilan keputusan moral, alasan, dan refleksi."
            icon={Briefcase}
            iconBgColor="bg-emerald-50 text-emerald-600"
            badgeColor="text-emerald-700 bg-emerald-50 border-emerald-200"
            buttonText="Mulai Practical"
            isCompleted={practicalSubmissions.length > 0}
            onAction={() => (onNavigateTab ? onNavigateTab('practical') : null)}
          />

          {/* Fitur 3: Drill & Game */}
          <FeatureCard
            featureNumber={3}
            tag="Dua Mode"
            title="Drill & Game"
            description="Latihan penguatan bank soal bervariasi serta petualangan game 5 level 'Misi Penjelajah Norma' dan 2 Game Interaktif H5P."
            icon={Gamepad2}
            iconBgColor="bg-amber-50 text-amber-600"
            badgeColor="text-amber-700 bg-amber-50 border-amber-200"
            buttonText="Masuk Arena Game"
            isCompleted={gameProgress.levelsCompleted.length >= 5}
            onAction={() => (onNavigateTab ? onNavigateTab('drill-game') : null)}
          />

          {/* Fitur 4: Learning Chatbot */}
          <FeatureCard
            featureNumber={4}
            tag="Tanya Jawab"
            title="Teman Belajar (Chatbot)"
            description="Asisten percakapan interaktif ramah anak kelas V. Membantu menjelaskan materi Bab 2 dengan bimbingan pemantik nalar (scaffolding)."
            icon={Bot}
            iconBgColor="bg-purple-50 text-purple-600"
            badgeColor="text-purple-700 bg-purple-50 border-purple-200"
            buttonText="Tanya Teman Belajar"
            onAction={() => (onNavigateTab ? onNavigateTab('chatbot') : null)}
          />

          {/* Fitur 5: Rangkuman Materi */}
          <FeatureCard
            featureNumber={5}
            tag="Ikhtisar Inti"
            title="Rangkuman Materi"
            description="5 bagian ringkasan materi norma, peta konsep interaktif, poin penting, dan kuis kilat untuk mengingat konsep sebelum ujian."
            icon={FileText}
            iconBgColor="bg-sky-50 text-sky-600"
            badgeColor="text-sky-700 bg-sky-50 border-sky-200"
            buttonText="Baca Rangkuman"
            onAction={() => (onNavigateTab ? onNavigateTab('summary') : onOpenSummary?.())}
          />

          {/* Fitur 6: Assessment */}
          <FeatureCard
            featureNumber={6}
            tag="Uji Ketuntasan"
            title="Asesmen Pembelajaran"
            description="Pre Assessment (Awal), Formative Assessment (Berkala), dan Final Assessment (Sumatif Akhir) dengan variasi soal dan riwayat skor."
            icon={FileCheck2}
            iconBgColor="bg-rose-50 text-rose-600"
            badgeColor="text-rose-700 bg-rose-50 border-rose-200"
            buttonText="Ikuti Asesmen"
            isCompleted={assessmentAttempts.some((a) => a.passed)}
            onAction={() => (onNavigateTab ? onNavigateTab('assessment') : null)}
          />
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: LEARNING PATH (ALUR BELAJAR BERGERAK)
          Welcome -> Get Ready -> Apersepsi -> Pre Assessment -> Explore -> Learn -> Practice -> Apply -> Assess -> Reflect
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                Alur Pembelajaran
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Learning Path Siswa
              </h2>
              <p className="text-base text-slate-600 mt-0.5">
                Alur bertahap untuk membangun pemahaman yang kokoh dan bermakna:
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Tingkat Kemajuan:</span>
              <span className="text-sm font-bold font-mono text-indigo-700">{progressPercent}%</span>
            </div>
          </div>

          {/* Learning Stages Horizontal Stepper */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'Apersepsi', desc: 'Konteks Cerita', num: '01' },
              { label: 'Pre Assess', desc: 'Cek Kesiapan', num: '02' },
              { label: 'Explore', desc: 'Video & Visual', num: '03' },
              { label: 'Learn', desc: 'Materi Tutorial', num: '04' },
              { label: 'Practice', desc: 'Drill Soal', num: '05' },
              { label: 'Apply', desc: 'Practical Kasus', num: '06' },
              { label: 'Reflect', desc: 'Refleksi Diri', num: '07' },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1 hover:border-indigo-300 transition-colors"
              >
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full inline-block">
                  Tahap {step.num}
                </span>
                <span className="text-sm font-bold text-slate-900 block truncate">{step.label}</span>
                <span className="text-xs text-slate-500 block truncate">{step.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: PROGRESS BELAJAR
          Overview capaian siswa, bintang, lencana, dan aktivitas yang telah tuntas
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block mb-1">
                Laporan Perkembangan Mandiri
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Progress Belajarku
              </h2>
              <p className="text-base text-indigo-100 mt-1 max-w-2xl leading-relaxed">
                Pantau setiap misi yang telah kamu selesaikan. Buka lencana penghargaan dan tingkatkan bintang prestasimu!
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/20 shrink-0">
              <div className="text-center px-2">
                <span className="text-xs text-indigo-200 block font-semibold">Aktivitas Selesai</span>
                <span className="text-2xl font-bold font-mono text-white">
                  {completedCount}/{totalActivitiesCount}
                </span>
              </div>

              <div className="w-px h-10 bg-white/20" />

              <div className="text-center px-2">
                <span className="text-xs text-indigo-200 block font-semibold">Total Bintang</span>
                <span className="text-2xl font-bold font-mono text-amber-300 flex items-center justify-center gap-1">
                  <Star className="w-5 h-5 fill-amber-300" />
                  {user.stars ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-semibold text-indigo-200">
              <span>Ketuntasan Modul Pembelajaran</span>
              <span className="font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full h-3.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onStartLearning()}
              className="px-6 py-3 bg-[#FFD43B] hover:bg-yellow-400 text-slate-900 font-bold rounded-xl text-base transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Lanjutkan Belajar</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenAchievements}
              className="px-5 py-3 bg-white/15 hover:bg-white/25 text-white font-bold rounded-xl text-base transition-colors border border-white/20 cursor-pointer flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Lihat Lencanaku</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: TEATER MEDIA INTERAKTIF (VIDEO, 4 NORMA VISUAL, NERACA)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          <button
            type="button"
            onClick={() => handleSwitchMode('video')}
            className={`px-5 py-3 rounded-2xl font-bold text-base transition-all cursor-pointer flex items-center gap-2.5 ${
              mediaMode === 'video'
                ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-500/30'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Tv className="w-5 h-5" />
            <span>Teater Video Interaktif</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMode('visual_lab')}
            className={`px-5 py-3 rounded-2xl font-bold text-base transition-all cursor-pointer flex items-center gap-2.5 ${
              mediaMode === 'visual_lab'
                ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-500/30'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-5 h-5" />
            <span>Visual 4 Macam Norma</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMode('balance_sim')}
            className={`px-5 py-3 rounded-2xl font-bold text-base transition-all cursor-pointer flex items-center gap-2.5 ${
              mediaMode === 'balance_sim'
                ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-500/30'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-5 h-5" />
            <span>Simulasi Neraca Hak & Kewajiban</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMode('missions')}
            className={`px-5 py-3 rounded-2xl font-bold text-base transition-all cursor-pointer flex items-center gap-2.5 ${
              mediaMode === 'missions'
                ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-500/30'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span>Misi Pembelajaran</span>
          </button>
        </div>

        {/* Dynamic Media View Rendering */}
        {mediaMode === 'video' && (
          <InteractiveVideoPlayer onScoreEarned={handleScoreEarned} />
        )}

        {mediaMode === 'visual_lab' && (
          <VisualNormaExplorer onScoreEarned={handleScoreEarned} />
        )}

        {mediaMode === 'balance_sim' && (
          <VisualHakKewajibanBalance onScoreEarned={handleScoreEarned} />
        )}

        {mediaMode === 'missions' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-md uppercase">
                Petualangan Terpandu
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Tahapan Misi Pembelajaran Siswa
              </h3>
              <p className="text-base text-slate-600">
                Selesaikan setiap misi interaktif untuk meraih bintang dan membuka lencana prestasi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {course.modules.map((mod, modIdx) => {
                const modActivities = mod.activities;
                const completedInMod = modActivities.filter((a) =>
                  studentProgress.some((p) => p.activityId === a.id && p.status === 'completed')
                ).length;
                const isModComplete =
                  completedInMod === modActivities.length && modActivities.length > 0;

                return (
                  <div
                    key={mod.id}
                    className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow text-left"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md uppercase">
                          Tahap 0{modIdx + 1}
                        </span>
                        {isModComplete ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Selesai
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                            Tersedia
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-slate-900 mb-1.5 leading-snug">
                        {mod.title}
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        {mod.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onStartLearning(modActivities[0]?.id)}
                      className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Mulai Misi Tahap {modIdx + 1}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
