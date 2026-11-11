import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Gamepad2, 
  Target, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  Star, 
  Sparkles, 
  Scale, 
  ShieldCheck, 
  Users, 
  Layers,
  HeartHandshake,
  RefreshCw,
  Trophy,
  Play
} from 'lucide-react';
import { User, DrillQuestion, DrillDifficulty, DrillSessionResult, GameProgress } from '../../../types';
import { storageService } from '../../../services/storageService';

interface DrillGameViewProps {
  user: User;
  onBackToDashboard: () => void;
  onNavigateTab: (tab: string) => void;
  onUserUpdated?: (user: User) => void;
}

// ==========================================
// DRILL QUESTION BANK (Bervariasi & Bersahabat)
// ==========================================
const DRILL_QUESTIONS: DrillQuestion[] = [
  {
    id: 'dq_1',
    topic: 'Macam-Macam Norma',
    difficulty: 'mudah',
    type: 'multiple-choice',
    question: 'Sikap menghormati dan berbicara santun kepada orang tua ketika di rumah merupakan contoh penerapan norma apa?',
    options: [
      { id: 'o1', text: 'Norma Hukum', isCorrect: false },
      { id: 'o2', text: 'Norma Kesopanan', isCorrect: true },
      { id: 'o3', text: 'Norma Agama', isCorrect: false },
      { id: 'o4', text: 'Norma Kesusilaan', isCorrect: false }
    ],
    explanation: 'Sikap santun dan tata krama dalam pergaulan sehari-hari termasuk ke dalam Norma Kesopanan.'
  },
  {
    id: 'dq_2',
    topic: 'Macam-Macam Norma',
    difficulty: 'mudah',
    type: 'true-false',
    question: 'Norma hukum adalah aturan yang dibuat oleh lembaga resmi negara dan memiliki sanksi yang tegas dan memaksa.',
    correctAnswerBool: true,
    explanation: 'Benar! Norma hukum bersifat tertulis, resmi dibuat pemerintah/lembaga berwenang, dan sanksinya mengikat.'
  },
  {
    id: 'dq_3',
    topic: 'Macam-Macam Norma',
    difficulty: 'sedang',
    type: 'multiple-choice',
    question: 'Jika seseorang melanggar norma kesusilaan (seperti berbohong atau menyontek), sanksi utama yang langsung dirasakan adalah...',
    options: [
      { id: 'o1', text: 'Denda uang tunai dari polisi', isCorrect: false },
      { id: 'o2', text: 'Penyesalan batin, gelisah, dan rasa malu pada diri sendiri', isCorrect: true },
      { id: 'o3', text: 'Dikeluarkan dari negara', isCorrect: false },
      { id: 'o4', text: 'Disita barang-barangnya oleh pemerintah', isCorrect: false }
    ],
    explanation: 'Norma kesusilaan bersumber dari hati nurani, sehingga sanksinya berupa penyesalan batin dan rasa bersalah.'
  },
  {
    id: 'dq_4',
    topic: 'Hak & Kewajiban',
    difficulty: 'mudah',
    type: 'multiple-choice',
    question: 'Manakah tindakan berikut yang merupakan pelaksanaan kewajiban sebagai siswa di sekolah?',
    options: [
      { id: 'o1', text: 'Mendengarkan penjelasan guru dengan tertib dan seksama', isCorrect: true },
      { id: 'o2', text: 'Meminjam buku di perpustakaan', isCorrect: false },
      { id: 'o3', text: 'Bermain bola di lapangan saat jam istirahat', isCorrect: false },
      { id: 'o4', text: 'Menerima nilai rapor dari bapak/ibu guru', isCorrect: false }
    ],
    explanation: 'Mendengarkan guru adalah kewajiban siswa, sedangkan meminjam buku dan bermain istirahat adalah hak siswa.'
  },
  {
    id: 'dq_5',
    topic: 'Musyawarah',
    difficulty: 'sedang',
    type: 'true-false',
    question: 'Dalam musyawarah mufakat, kita diperbolehkan memaksakan pendapat pribadi agar diterima oleh semua anggota.',
    correctAnswerBool: false,
    explanation: 'Salah! Dalam musyawarah kita tidak boleh memaksakan kehendak, melainkan harus mendengarkan dan mencari kesepakatan bersama.'
  },
  {
    id: 'dq_6',
    topic: 'Penerapan Norma',
    difficulty: 'menantang',
    type: 'multiple-choice',
    question: 'Ketika mengendarai sepeda di jalan raya, Doni mematuhi rambu lampu merah meskipun jalanan sedang sepi. Doni sedang menaati norma...',
    options: [
      { id: 'o1', text: 'Norma Hukum', isCorrect: true },
      { id: 'o2', text: 'Norma Kesopanan semata', isCorrect: false },
      { id: 'o3', text: 'Norma Adat suku tertentu', isCorrect: false },
      { id: 'o4', text: 'Norma Kesusilaan perorangan', isCorrect: false }
    ],
    explanation: 'Rambu lalu lintas merupakan aturan resmi perundang-undangan negara yang tergolong dalam Norma Hukum.'
  }
];

export const DrillGameView: React.FC<DrillGameViewProps> = ({
  user,
  onBackToDashboard,
  onNavigateTab,
  onUserUpdated
}) => {
  const [activeMode, setActiveMode] = useState<'drill' | 'game'>('drill');

  // ==========================================
  // DRILL STATE
  // ==========================================
  const [selectedDifficulty, setSelectedDifficulty] = useState<DrillDifficulty>('mudah');
  const [currentDrillIndex, setCurrentDrillIndex] = useState<number>(0);
  const [drillAnswers, setDrillAnswers] = useState<Record<number, any>>({});
  const [showDrillFeedback, setShowDrillFeedback] = useState<boolean>(false);
  const [drillCompleted, setDrillCompleted] = useState<boolean>(false);
  const [drillReport, setDrillReport] = useState<DrillSessionResult | null>(null);

  // Filter questions based on difficulty or all
  const filteredQuestions = DRILL_QUESTIONS.filter(
    q => q.difficulty === selectedDifficulty || selectedDifficulty === 'sedang'
  );
  const currentQuestion = filteredQuestions[currentDrillIndex] || filteredQuestions[0];

  const handleSelectDrillAnswer = (answerVal: any) => {
    if (showDrillFeedback) return;
    setDrillAnswers(prev => ({
      ...prev,
      [currentDrillIndex]: answerVal
    }));
  };

  const handleCheckDrillAnswer = () => {
    setShowDrillFeedback(true);
  };

  const handleNextDrillQuestion = () => {
    setShowDrillFeedback(false);
    if (currentDrillIndex + 1 < filteredQuestions.length) {
      setCurrentDrillIndex(currentDrillIndex + 1);
    } else {
      // Calculate final summary
      let correct = 0;
      filteredQuestions.forEach((q, idx) => {
        const userAns = drillAnswers[idx];
        if (q.type === 'multiple-choice') {
          const opt = q.options?.find(o => o.id === userAns);
          if (opt?.isCorrect) correct++;
        } else if (q.type === 'true-false') {
          if (userAns === q.correctAnswerBool) correct++;
        }
      });

      const total = filteredQuestions.length;
      const pct = Math.round((correct / total) * 100);

      const rec = pct >= 80
        ? 'Hebat sekali! Pemahamanmu terhadap materi norma sudah sangat kuat. Pertahankan sikap bijakmu!'
        : pct >= 60
        ? 'Bagus! Kamu sudah memahami sebagian besar materi. Yuk ulangi beberapa soal yang masih keliru.'
        : 'Jangan berkecil hati! Belajar adalah proses. Yuk buka menu Tutorial untuk mengulang penjelasan materi.';

      const result: DrillSessionResult = {
        id: 'drill_' + Date.now(),
        studentId: user.id,
        studentName: user.name,
        topic: 'Norma dalam Kehidupanku',
        difficulty: selectedDifficulty,
        correctCount: correct,
        totalQuestions: total,
        masteryPercentage: pct,
        completedAt: new Date().toISOString(),
        recommendation: rec
      };

      storageService.saveDrillResult(result);
      setDrillReport(result);
      setDrillCompleted(true);
    }
  };

  const handleRestartDrill = () => {
    setCurrentDrillIndex(0);
    setDrillAnswers({});
    setShowDrillFeedback(false);
    setDrillCompleted(false);
    setDrillReport(null);
  };

  // ==========================================
  // GAME STATE: H5P Interaktif & Misi Penjelajah
  // ==========================================
  const [gameProgress, setGameProgress] = useState<GameProgress>(() => storageService.getGameProgress());
  const [gameArena, setGameArena] = useState<'h5p_1' | 'h5p_2' | 'adventure'>('h5p_1');
  const [iframeLoading1, setIframeLoading1] = useState<boolean>(true);
  const [iframeLoading2, setIframeLoading2] = useState<boolean>(true);
  const [claimedH5P1, setClaimedH5P1] = useState<boolean>(false);
  const [claimedH5P2, setClaimedH5P2] = useState<boolean>(false);
  const [h5pKey1, setH5pKey1] = useState<number>(0);
  const [h5pKey2, setH5pKey2] = useState<number>(0);
  const [activeGameLevel, setActiveGameLevel] = useState<number>(1);

  // Level 1: Detektif Norma (Pilih gambar/skenario norma hukum)
  const [lvl1Answer, setLvl1Answer] = useState<string | null>(null);
  // Level 2: Pasangkan dengan tepat
  const [lvl2SelectedNorma, setLvl2SelectedNorma] = useState<string | null>(null);
  const [lvl2Matches, setLvl2Matches] = useState<Record<string, string>>({});
  // Level 3: Hak vs Kewajiban Sorter
  const [lvl3Sorts, setLvl3Sorts] = useState<Record<string, 'hak' | 'kewajiban'>>({});
  // Level 4: Dilema Moral
  const [lvl4Choice, setLvl4Choice] = useState<string | null>(null);
  // Level 5: Musyawarah Challenge
  const [lvl5Votes, setLvl5Votes] = useState<string | null>(null);

  const [levelSuccessNotice, setLevelSuccessNotice] = useState<string | null>(null);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handleClaimH5P = (gameNum: 1 | 2) => {
    triggerConfetti();
    const pointsBonus = 30;
    const updatedPoints = gameProgress.totalPoints + pointsBonus;
    const updated: GameProgress = {
      ...gameProgress,
      totalPoints: updatedPoints,
      starsEarned: gameProgress.starsEarned + 2,
    };
    setGameProgress(updated);
    storageService.saveGameProgress(updated);

    const updatedUser = storageService.addBonusStars(2);
    if (updatedUser && onUserUpdated) {
      onUserUpdated(updatedUser);
    }

    if (gameNum === 1) setClaimedH5P1(true);
    if (gameNum === 2) setClaimedH5P2(true);

    setLevelSuccessNotice(`Luar biasa! Game Interaktif ${gameNum} berhasil diselesaikan! +${pointsBonus} Poin & +2 Bintang ditambahkan.`);
    setTimeout(() => {
      setLevelSuccessNotice(null);
    }, 2800);
  };

  const completeGameLevel = (levelNum: number, pointsBonus: number) => {
    triggerConfetti();
    const updatedPoints = gameProgress.totalPoints + pointsBonus;
    const completed = Array.from(new Set([...gameProgress.levelsCompleted, levelNum]));
    const allCompleted = completed.length >= 5;

    const updated: GameProgress = {
      ...gameProgress,
      currentLevel: Math.min(5, levelNum + 1),
      totalPoints: updatedPoints,
      starsEarned: gameProgress.starsEarned + 2,
      levelsCompleted: completed,
      unlockedBadge: allCompleted || gameProgress.unlockedBadge
    };

    setGameProgress(updated);
    storageService.saveGameProgress(updated);

    const updatedUser = storageService.addBonusStars(2);
    if (updatedUser && onUserUpdated) {
      onUserUpdated(updatedUser);
    }

    setLevelSuccessNotice(`Level ${levelNum} Berhasil Diselesaikan! +${pointsBonus} Poin Penjelajah diperoleh.`);
    setTimeout(() => {
      setLevelSuccessNotice(null);
      if (levelNum < 5) {
        setActiveGameLevel(levelNum + 1);
      }
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-indigo-600 mb-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
                Drill & Game Pembelajaran
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Pendidikan Pancasila · Latihan Penguatan Konsep & Petualangan Interaktif
              </p>
            </div>
          </div>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveMode('drill')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeMode === 'drill'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Mode DRILL (Latihan)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('game')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeMode === 'game'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Mode GAME (Penjelajah)</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          MODE A: DRILL (LATIHAN PENGUATAN)
         ========================================================= */}
      {activeMode === 'drill' && (
        <div className="space-y-6">
          {/* Difficulty selector & summary */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tingkat Kesulitan:
              </span>
              {(['mudah', 'sedang', 'menantang'] as DrillDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => {
                    setSelectedDifficulty(diff);
                    handleRestartDrill();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    selectedDifficulty === diff
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <span className="text-xs sm:text-sm font-bold text-indigo-700">
              Soal {currentDrillIndex + 1} dari {filteredQuestions.length}
            </span>
          </div>

          {/* Drill Question Card */}
          {!drillCompleted ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-6">
              <div>
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg uppercase tracking-wider mb-2">
                  Topik: {currentQuestion.topic}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Multiple Choice Options */}
              {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = drillAnswers[currentDrillIndex] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectDrillAnswer(opt.id)}
                        className={`w-full p-4 rounded-xl border text-left font-semibold text-sm sm:text-base transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-200'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <span>{opt.text}</span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* True/False Options */}
              {currentQuestion.type === 'true-false' && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleSelectDrillAnswer(true)}
                    className={`p-6 rounded-2xl border text-center font-bold text-lg transition-all cursor-pointer ${
                      drillAnswers[currentDrillIndex] === true
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-200'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    BENAR
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectDrillAnswer(false)}
                    className={`p-6 rounded-2xl border text-center font-bold text-lg transition-all cursor-pointer ${
                      drillAnswers[currentDrillIndex] === false
                        ? 'bg-rose-50 border-rose-600 text-rose-900 ring-2 ring-rose-200'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    SALAH
                  </button>
                </div>
              )}

              {/* Instant Feedback Explanation */}
              {showDrillFeedback && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-sm text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Penjelasan & Ulasan:</span>
                  </h4>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleRestartDrill}
                  className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi dari Awal</span>
                </button>

                {!showDrillFeedback ? (
                  <button
                    type="button"
                    disabled={drillAnswers[currentDrillIndex] === undefined}
                    onClick={handleCheckDrillAnswer}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                      drillAnswers[currentDrillIndex] === undefined
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs'
                    }`}
                  >
                    Periksa Jawaban
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextDrillQuestion}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-2"
                  >
                    <span>{currentDrillIndex + 1 < filteredQuestions.length ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Drill Completion Summary Report */
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 sm:p-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
                  Hasil Latihanmu!
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Catatan penguasaan materi sesi drill penguatan mandiri
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-800 uppercase block">Jawaban Benar</span>
                  <span className="text-3xl font-black text-emerald-900 font-mono mt-1 block">
                    {drillReport?.correctCount}
                  </span>
                </div>

                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
                  <span className="text-xs font-bold text-rose-800 uppercase block">Belum Tepat</span>
                  <span className="text-3xl font-black text-rose-900 font-mono mt-1 block">
                    {(drillReport?.totalQuestions ?? 0) - (drillReport?.correctCount ?? 0)}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-600 uppercase block">Total Soal</span>
                  <span className="text-3xl font-black text-slate-900 font-mono mt-1 block">
                    {drillReport?.totalQuestions}
                  </span>
                </div>

                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
                  <span className="text-xs font-bold text-indigo-800 uppercase block">Penguasaan</span>
                  <span className="text-3xl font-black text-indigo-900 font-mono mt-1 block">
                    {drillReport?.masteryPercentage}%
                  </span>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 max-w-xl mx-auto text-left">
                <span className="font-bold text-slate-900 block mb-1">Rekomendasi Pembelajaran:</span>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {drillReport?.recommendation}
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleRestartDrill}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi Latihan Drill</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMode('game')}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>Coba Game Misi Penjelajah</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          MODE B: GAME ("MISI PENJELAJAH NORMA" - 5 LEVELS)
         ========================================================= */}
      {activeMode === 'game' && (
        <div className="space-y-6">
          {/* Game Stats Bar */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-3xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200 block">
                Petualangan Pembelajaran
              </span>
              <h3 className="font-display text-2xl font-black text-white">
                Misi Penjelajah Norma
              </h3>
              <p className="text-xs sm:text-sm text-amber-100 mt-1">
                Selesaikan 5 level tantangan untuk membuka lencana "Penjelajah Norma"!
              </p>
            </div>

            <div className="flex items-center gap-4 bg-black/20 p-3 rounded-2xl">
              <div className="text-center px-2">
                <span className="text-xs text-amber-200 font-semibold block">Total Poin</span>
                <span className="text-2xl font-black font-mono">{gameProgress.totalPoints}</span>
              </div>
              <div className="w-px h-8 bg-amber-400/40" />
              <div className="text-center px-2">
                <span className="text-xs text-amber-200 font-semibold block">Bintang</span>
                <span className="text-2xl font-black font-mono flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  {gameProgress.starsEarned}
                </span>
              </div>
            </div>
          </div>

          {/* Game Arena Navigation Tabs */}
          <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-col sm:flex-row gap-1.5">
            <button
              type="button"
              onClick={() => setGameArena('h5p_1')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                gameArena === 'h5p_1'
                  ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-black/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Play className="w-4 h-4 text-indigo-600" />
              <span>Game Interaktif 1</span>
              {claimedH5P1 && (
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                  Selesai
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setGameArena('h5p_2')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                gameArena === 'h5p_2'
                  ? 'bg-white text-purple-700 shadow-sm ring-1 ring-black/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-purple-600" />
              <span>Game Interaktif 2</span>
              {claimedH5P2 && (
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                  Selesai
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setGameArena('adventure')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                gameArena === 'adventure'
                  ? 'bg-white text-amber-600 shadow-sm ring-1 ring-black/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Misi Petualangan (5 Level)</span>
              {gameProgress.levelsCompleted.length === 5 && (
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                  Selesai
                </span>
              )}
            </button>
          </div>

          {/* Toast Notification */}
          {levelSuccessNotice && (
            <div className="p-4 bg-emerald-600 text-white font-bold rounded-2xl text-center shadow-lg transition-all flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span>{levelSuccessNotice}</span>
            </div>
          )}

          {/* ARENA 1: GAME INTERAKTIF 1 */}
          {gameArena === 'h5p_1' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-5 sm:p-7 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
                      Game Edukatif
                    </span>
                    <span className="text-xs text-slate-500">Pendidikan Pancasila Kelas V</span>
                  </div>
                  <h4 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    Game Interaktif 1: Petualangan Norma Kehidupanku
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Mainkan game interaktif berikut langsung di layar. Ikuti petunjuk permainan sampai selesai!
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setIframeLoading1(true);
                      setH5pKey1(k => k + 1);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                    title="Muat ulang jika game belum muncul"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Muat Ulang</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleClaimH5P(1)}
                    disabled={claimedH5P1}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
                      claimedH5P1
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer active:scale-95'
                    }`}
                  >
                    {claimedH5P1 ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Skor Telah Diklaim (+30 Poin)</span>
                      </>
                    ) : (
                      <>
                        <Trophy className="w-4 h-4 text-amber-300" />
                        <span>Klaim Skor Game (+30 Poin)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Responsive Frame Container */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 shadow-inner border border-slate-200 aspect-[16/10] sm:aspect-[16/9] min-h-[460px] sm:min-h-[580px]">
                {iframeLoading1 && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-100 text-slate-600">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-sm font-semibold text-slate-700">Menyiapkan Game Interaktif 1...</p>
                    <p className="text-xs text-slate-500 mt-1">Harap tunggu sebentar</p>
                  </div>
                )}
                <iframe
                  key={h5pKey1}
                  src="https://app.lumi.education/api/v1/run/WoI9J3/embed"
                  className="w-full h-full border-0 rounded-2xl"
                  allow="geolocation *; microphone *; camera *; midi *; encrypted-media *; fullscreen *"
                  allowFullScreen={true}
                  title="Game Interaktif 1"
                  onLoad={() => setIframeLoading1(false)}
                />
              </div>

              <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-indigo-950 leading-relaxed">
                  <strong>Petunjuk Bermain:</strong> Mainkan game secara mandiri di dalam bingkai interaktif di atas. Setelah menyelesaikan permainan, klik tombol <strong>"Klaim Skor Game (+30 Poin)"</strong> di kanan atas untuk menambahkan poin dan bintang penghargaan ke profil LearnSpace-mu!
                </div>
              </div>
            </div>
          )}

          {/* ARENA 2: GAME INTERAKTIF 2 */}
          {gameArena === 'h5p_2' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-5 sm:p-7 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                      Game Edukatif
                    </span>
                    <span className="text-xs text-slate-500">Pendidikan Pancasila Kelas V</span>
                  </div>
                  <h4 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    Game Interaktif 2: Tantangan Norma & Musyawarah
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Mainkan game interaktif berikut langsung di layar. Selesaikan setiap tantangan serunya!
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setIframeLoading2(true);
                      setH5pKey2(k => k + 1);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                    title="Muat ulang jika game belum muncul"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Muat Ulang</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleClaimH5P(2)}
                    disabled={claimedH5P2}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
                      claimedH5P2
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default'
                        : 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer active:scale-95'
                    }`}
                  >
                    {claimedH5P2 ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Skor Telah Diklaim (+30 Poin)</span>
                      </>
                    ) : (
                      <>
                        <Trophy className="w-4 h-4 text-amber-300" />
                        <span>Klaim Skor Game (+30 Poin)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Responsive Frame Container */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 shadow-inner border border-slate-200 aspect-[16/10] sm:aspect-[16/9] min-h-[460px] sm:min-h-[580px]">
                {iframeLoading2 && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-100 text-slate-600">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-sm font-semibold text-slate-700">Menyiapkan Game Interaktif 2...</p>
                    <p className="text-xs text-slate-500 mt-1">Harap tunggu sebentar</p>
                  </div>
                )}
                <iframe
                  key={h5pKey2}
                  src="https://app.lumi.education/api/v1/run/OhKoTs/embed"
                  className="w-full h-full border-0 rounded-2xl"
                  allow="geolocation *; microphone *; camera *; midi *; encrypted-media *; fullscreen *"
                  allowFullScreen={true}
                  title="Game Interaktif 2"
                  onLoad={() => setIframeLoading2(false)}
                />
              </div>

              <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-100 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-purple-950 leading-relaxed">
                  <strong>Petunjuk Bermain:</strong> Mainkan game secara mandiri di dalam bingkai interaktif di atas. Setelah menyelesaikan permainan, klik tombol <strong>"Klaim Skor Game (+30 Poin)"</strong> di kanan atas untuk menambahkan poin dan bintang penghargaan ke profil LearnSpace-mu!
                </div>
              </div>
            </div>
          )}

          {/* ARENA 3: MISI PENJELAJAH NORMA (5 LEVEL) */}
          {gameArena === 'adventure' && (
            <div className="space-y-6">
              {/* Level Switcher Stepper */}
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {[1, 2, 3, 4, 5].map((lvl) => {
                  const isDone = gameProgress.levelsCompleted.includes(lvl);
                  const isActive = activeGameLevel === lvl;
                  const levelNames = ['Detektif', 'Pasangkan', 'Hak & Tugas', 'Tindakan', 'Musyawarah'];
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setActiveGameLevel(lvl)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                          : isDone
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-bold block">Level {lvl}</span>
                      <span className="text-[11px] sm:text-xs font-medium block truncate mt-0.5">
                        {levelNames[lvl - 1]}
                      </span>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 mx-auto mt-1 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>

          {/* LEVEL 1: DETEKTIF NORMA */}
          {activeGameLevel === 1 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                  Level 1: Detektif Norma
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  Tugas Detektif: Temukan Kasus yang Berkaitan dengan Norma Hukum!
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Klik kartu kasus yang menunjukkan penerapan norma hukum resmi negara:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setLvl1Answer('A')}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                    lvl1Answer === 'A'
                      ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Kasus A</span>
                  <h4 className="font-bold text-slate-900 mb-2">Mengucapkan Salam Saat Bertemu Guru</h4>
                  <p className="text-xs text-slate-500">Membungkuk santun di depan gerbang sekolah.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setLvl1Answer('B')}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                    lvl1Answer === 'B'
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Kasus B</span>
                  <h4 className="font-bold text-slate-900 mb-2">Menggunakan Helm SNI Saat Naik Motor</h4>
                  <p className="text-xs text-slate-500">Mematuhi aturan keselamatan lalu lintas resmi.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setLvl1Answer('C')}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                    lvl1Answer === 'C'
                      ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Kasus C</span>
                  <h4 className="font-bold text-slate-900 mb-2">Berdoa Sebelum Tidur di Kamar</h4>
                  <p className="text-xs text-slate-500">Mengamalkan ajaran agama kepada Tuhan.</p>
                </button>
              </div>

              {lvl1Answer && (
                <div className={`p-4 rounded-xl text-sm ${
                  lvl1Answer === 'B' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}>
                  {lvl1Answer === 'B' ? (
                    <span className="font-bold">Tepat sekali! Memakai helm SNI adalah kepatuhan terhadap norma hukum lalu lintas.</span>
                  ) : (
                    <span>Kurang tepat detektif! Pilihan tersebut adalah norma kesopanan atau norma agama. Coba pilih Kasus B.</span>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  disabled={lvl1Answer !== 'B'}
                  onClick={() => completeGameLevel(1, 20)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                    lvl1Answer === 'B'
                      ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-xs'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Klaim Skor Level 1 (+20 Poin)
                </button>
              </div>
            </div>
          )}

          {/* LEVEL 2: PASANGKAN DENGAN TEPAT */}
          {activeGameLevel === 2 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                  Level 2: Pasangkan dengan Tepat
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  Cocokkan Norma dengan Sumber Asalnya
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Pilih kartu norma di kiri, lalu pilih sumber yang sesuai di kanan:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-700">Jenis Norma:</h4>
                  {[
                    { id: 'norma_agama', name: 'Norma Agama' },
                    { id: 'norma_susila', name: 'Norma Kesusilaan' },
                    { id: 'norma_sopan', name: 'Norma Kesopanan' },
                    { id: 'norma_hukum', name: 'Norma Hukum' }
                  ].map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setLvl2SelectedNorma(n.id)}
                      className={`w-full p-3.5 rounded-xl border text-left font-bold text-sm transition-all cursor-pointer flex items-center justify-between ${
                        lvl2SelectedNorma === n.id
                          ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span>{n.name}</span>
                      {lvl2Matches[n.id] && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-700">Sumber Norma:</h4>
                  {[
                    { targetId: 'norma_agama', label: 'Wahyu Tuhan Yang Maha Esa' },
                    { targetId: 'norma_susila', label: 'Bisikan Hati Nurani Manusia' },
                    { targetId: 'norma_sopan', label: 'Adat Kebiasaan dan Tata Krama Pergaulan' },
                    { targetId: 'norma_hukum', label: 'Pemerintah dan Badan Resmi Negara' }
                  ].map((src, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => {
                        if (lvl2SelectedNorma) {
                          setLvl2Matches(prev => ({
                            ...prev,
                            [lvl2SelectedNorma]: src.targetId
                          }));
                        }
                      }}
                      className="w-full p-3.5 rounded-xl border bg-slate-50 hover:bg-white border-slate-200 text-left text-sm font-semibold text-slate-800 transition-colors cursor-pointer"
                    >
                      {src.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => completeGameLevel(2, 25)}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm transition-all cursor-pointer shadow-xs"
                >
                  Selesaikan Level 2 (+25 Poin)
                </button>
              </div>
            </div>
          )}

          {/* LEVEL 3: PENJAGA HAK DAN KEWAJIBAN */}
          {activeGameLevel === 3 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                  Level 3: Penjaga Hak dan Kewajiban
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  Tentukan Mana Hak dan Mana Kewajiban Siswa!
                </h3>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'hk1', text: 'Mendapatkan nilai dan bimbingan belajar dari guru', type: 'hak' },
                  { id: 'hk2', text: 'Melaksanakan piket menyapu kelas sesuai jadwal', type: 'kewajiban' },
                  { id: 'hk3', text: 'Meminjam buku cerita di perpustakaan sekolah', type: 'hak' },
                  { id: 'hk4', text: 'Mengenakan seragam lengkap dan datang tepat waktu', type: 'kewajiban' }
                ].map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <span className="text-sm font-semibold text-slate-800">{item.text}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setLvl3Sorts(prev => ({ ...prev, [item.id]: 'hak' }))}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          lvl3Sorts[item.id] === 'hak'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        HAK
                      </button>
                      <button
                        type="button"
                        onClick={() => setLvl3Sorts(prev => ({ ...prev, [item.id]: 'kewajiban' }))}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          lvl3Sorts[item.id] === 'kewajiban'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        KEWAJIBAN
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => completeGameLevel(3, 25)}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm transition-all cursor-pointer shadow-xs"
                >
                  Selesaikan Level 3 (+25 Poin)
                </button>
              </div>
            </div>
          )}

          {/* LEVEL 4: PILIH TINDAKANMU */}
          {activeGameLevel === 4 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                  Level 4: Pilih Tindakanmu (Skenario Bercabang)
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  Dilema Penjaga Kejujuran
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Teman sebangkumu meminta contekan saat ulangan berlangsung. Jika tidak diberi, dia mengancam tidak akan mengajakmu bermain sore nanti. Apa keputusanmu?
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setLvl4Choice('A')}
                  className={`w-full p-4 rounded-xl border text-left font-semibold text-sm transition-all cursor-pointer ${
                    lvl4Choice === 'A'
                      ? 'bg-rose-50 border-rose-400 text-rose-900'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  A. Memberinya contekan demi menjaga pertemanan.
                </button>

                <button
                  type="button"
                  onClick={() => setLvl4Choice('B')}
                  className={`w-full p-4 rounded-xl border text-left font-semibold text-sm transition-all cursor-pointer ${
                    lvl4Choice === 'B'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  B. Menolak dengan santun dan berjanji akan membantunya belajar bersama setelah ujian selesai.
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  disabled={lvl4Choice !== 'B'}
                  onClick={() => completeGameLevel(4, 30)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                    lvl4Choice === 'B'
                      ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-xs'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Selesaikan Level 4 (+30 Poin)
                </button>
              </div>
            </div>
          )}

          {/* LEVEL 5: TANTANGAN MUSYAWARAH */}
          {activeGameLevel === 5 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                  Level 5: Tantangan Musyawarah
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  Mencapai Mufakat Bersama
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Musyawarah menentukan tujuan wisata studi tur kelas: 12 siswa memilih museum sejarah dan 10 siswa memilih kebun binatang. Bagaimana cara terbaik mengambil keputusan mufakat?
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setLvl5Votes('A')}
                  className={`w-full p-4 rounded-xl border text-left font-semibold text-sm transition-all cursor-pointer ${
                    lvl5Votes === 'A'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  A. Bersepakat pergi ke museum sejarah sesuai musyawarah mufakat, dan seluruh siswa mendukung keputusan bersama secara lapang dada.
                </button>

                <button
                  type="button"
                  onClick={() => setLvl5Votes('B')}
                  className={`w-full p-4 rounded-xl border text-left font-semibold text-sm transition-all cursor-pointer ${
                    lvl5Votes === 'B'
                      ? 'bg-rose-50 border-rose-400 text-rose-900'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  B. Membatalkan acara karena ada yang berbeda pilihan.
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  disabled={lvl5Votes !== 'A'}
                  onClick={() => completeGameLevel(5, 50)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                    lvl5Votes === 'A'
                      ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-xs'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Selesaikan & Buka Lencana Penjelajah Norma (+50 Poin)
                </button>
              </div>
            </div>
          )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
