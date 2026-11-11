import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  Star, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  Compass, 
  Scale, 
  FileCheck2,
  BookOpen,
  HelpCircle,
  Clock,
  History
} from 'lucide-react';
import { User, AssessmentType, AssessmentQuestion, AssessmentAttempt } from '../../../types';
import { storageService } from '../../../services/storageService';
import { audioService } from '../../../services/audioService';

interface AssessmentViewProps {
  user: User;
  onBackToDashboard: () => void;
  onNavigateTab: (tab: string) => void;
  onUserUpdated?: (user: User) => void;
}

// ===============================================================
// QUESTION BANKS FOR 3 ASSESSMENT TYPES
// ===============================================================
const PRE_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'pre_1',
    type: 'multiple-choice',
    topicTag: 'Pengertian Norma',
    question: 'Sebelum kita memulai pelajaran, apa yang dimaksud dengan "norma" dalam kehidupan sehari-hari?',
    options: [
      { id: 'o1', text: 'Aturan atau pedoman bertingkah laku yang disepakati bersama dalam masyarakat.', isCorrect: true },
      { id: 'o2', text: 'Keinginan pribadi seseorang yang harus dituruti oleh teman-temannya.', isCorrect: false },
      { id: 'o3', text: 'Buku pelajaran resmi yang harus dibeli di toko buku.', isCorrect: false },
      { id: 'o4', text: 'Hukuman berat yang diberikan polisi kepada setiap orang.', isCorrect: false },
    ],
    explanation: 'Norma adalah aturan, pedoman, atau kaidah bertingkah laku yang menjadi petunjuk dalam kehidupan bermasyarakat agar tercipta ketertiban.',
  },
  {
    id: 'pre_2',
    type: 'true-false',
    topicTag: 'Norma Agama',
    question: 'Norma agama hanya berlaku di dalam rumah ibadah saja, dan tidak perlu diterapkan ketika kita berada di sekolah atau tempat bermain.',
    correctAnswerBool: false,
    explanation: 'Salah! Norma agama berlaku di mana pun kita berada, baik di rumah, di sekolah, maupun di lingkungan masyarakat luas.',
  },
  {
    id: 'pre_3',
    type: 'multiple-choice',
    topicTag: 'Hak dan Kewajiban',
    question: 'Di lingkungan sekolah, manakah yang merupakan salah satu contoh "kewajiban" siswa?',
    options: [
      { id: 'o1', text: 'Mendengarkan penjelasan bapak dan ibu guru dengan tertib.', isCorrect: true },
      { id: 'o2', text: 'Menerima nilai dan rapor di akhir semester.', isCorrect: false },
      { id: 'o3', text: 'Bermain bola di lapangan saat jam istirahat.', isCorrect: false },
      { id: 'o4', text: 'Membaca buku cerita di perpustakaan sekolah.', isCorrect: false },
    ],
    explanation: 'Mendengarkan penjelasan guru adalah kewajiban (tugas yang wajib dilakukan), sedangkan menerima nilai dan memakai fasilitas adalah hak siswa.',
  },
  {
    id: 'pre_4',
    type: 'case-study',
    topicTag: 'Norma Kesopanan',
    context: 'Situasi di Rumah: Sebelum berangkat ke sekolah pada pagi hari, apa tindakan sopan yang sebaiknya dilakukan seorang anak kepada orang tuanya?',
    question: 'Pilihlah tindakan yang paling mencerminkan norma kesopanan dalam keluarga:',
    options: [
      { id: 'o1', text: 'Berpamitan, mencium tangan ayah dan ibu, serta memohon doa restu.', isCorrect: true },
      { id: 'o2', text: 'Langsung berlari keluar rumah tanpa memberi tahu siapa pun.', isCorrect: false },
      { id: 'o3', text: 'Meminta uang jajan sebanyak-banyaknya sambil berteriak kencang.', isCorrect: false },
    ],
    explanation: 'Berpamitan dan mencium tangan orang tua merupakan pengamalan norma kesopanan yang menunjukkan rasa hormat dan kasih sayang.',
  },
  {
    id: 'pre_5',
    type: 'true-false',
    topicTag: 'Musyawarah',
    question: 'Ketika bermusyawarah menentukan ketua kelas, kita harus menghargai pendapat teman meskipun pendapatnya berbeda dengan pilihan kita.',
    correctAnswerBool: true,
    explanation: 'Benar! Menghargai dan mendengarkan pendapat orang lain adalah prinsip utama musyawarah mufakat.',
  },
];

const FORMATIVE_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'form_1',
    type: 'multiple-choice',
    topicTag: 'Macam-Macam Norma',
    question: 'Norma yang bersumber dari bisikan hati nurani manusia yang membedakan perbuatan baik dan buruk disebut...',
    options: [
      { id: 'o1', text: 'Norma Kesusilaan', isCorrect: true },
      { id: 'o2', text: 'Norma Hukum', isCorrect: false },
      { id: 'o3', text: 'Norma Kesopanan', isCorrect: false },
      { id: 'o4', text: 'Norma Agama', isCorrect: false },
    ],
    explanation: 'Norma kesusilaan bersumber dari hati nurani (batiniah) manusia yang menuntun pada kejujuran dan kebaikan.',
  },
  {
    id: 'form_2',
    type: 'case-study',
    topicTag: 'Penerapan Norma Hukum',
    context: 'Kasus Lalu Lintas: Saat dibonceng oleh paman dengan sepeda motor di jalan raya, Doni tetap memakai helm berstandar SNI dan menunggu lampu merah berganti hijau.',
    question: 'Doni dan pamannya sedang mematuhi norma apa?',
    options: [
      { id: 'o1', text: 'Norma Hukum resmi negara.', isCorrect: true },
      { id: 'o2', text: 'Norma Kesusilaan batin semata.', isCorrect: false },
      { id: 'o3', text: 'Norma Kesopanan pergaulan teman sebaya.', isCorrect: false },
    ],
    explanation: 'Aturan lalu lintas ditetapkan secara resmi oleh negara dan diawasi aparat hukum, sehingga tergolong norma hukum.',
  },
  {
    id: 'form_3',
    type: 'true-false',
    topicTag: 'Keseimbangan Hak dan Kewajiban',
    question: 'Siswa diperbolehkan menuntut haknya terlebih dahulu dan mengabaikan kewajiban piket membersihkan kelas.',
    correctAnswerBool: false,
    explanation: 'Salah! Hak dan kewajiban harus dilaksanakan secara seimbang. Kita wajib menunaikan kewajiban sebelum menuntut hak.',
  },
  {
    id: 'form_4',
    type: 'multiple-choice',
    topicTag: 'Pohon Normaku',
    question: 'Perilaku "Menjaga ketenangan dan tidak mengotori fasilitas halte umum" paling tepat dimasukkan ke dahan...',
    options: [
      { id: 'o1', text: 'Dahan Lingkungan Masyarakat', isCorrect: true },
      { id: 'o2', text: 'Dahan Rumah Keluarga', isCorrect: false },
      { id: 'o3', text: 'Dahan Sekolah', isCorrect: false },
    ],
    explanation: 'Halte umum adalah fasilitas publik di lingkungan masyarakat, sehingga masuk ke kelompok norma di lingkungan.',
  },
  {
    id: 'form_5',
    type: 'multiple-choice',
    topicTag: 'Tahapan Musyawarah',
    question: 'Langkah pertama dalam alur musyawarah yang tertib adalah...',
    options: [
      { id: 'o1', text: 'Mendengarkan pendapat anggota lain dengan saksama.', isCorrect: true },
      { id: 'o2', text: 'Langsung memaksakan kehendak pribadi agar disetujui.', isCorrect: false },
      { id: 'o3', text: 'Meninggalkan ruang musyawarah jika tidak setuju.', isCorrect: false },
      { id: 'o4', text: 'Mengambil keputusan sendiri tanpa bertanya kepada teman.', isCorrect: false },
    ],
    explanation: 'Tahapan awal musyawarah adalah mendengarkan pendapat dengan baik sebelum menyampaikan pandangan dan membuat keputusan.',
  },
  {
    id: 'form_6',
    type: 'true-false',
    topicTag: 'Sanksi Norma Kesopanan',
    question: 'Sanksi bagi orang yang melanggar norma kesopanan (misalnya berbicara kasar kepada orang tua) biasanya berupa teguran, rasa canggung, dan dijauhi teman.',
    correctAnswerBool: true,
    explanation: 'Benar! Sanksi norma kesopanan bersumber dari lingkungan sosial berupa teguran moral dan pengucilan pergaulan.',
  },
];

const FINAL_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'fin_1',
    type: 'multiple-choice',
    topicTag: 'Macam-Macam Norma',
    question: 'Perhatikan 4 jenis norma berikut: Agama, Kesusilaan, Kesopanan, dan Hukum. Manakah norma yang memiliki sanksi paling tegas, pasti, dan tertulis resmi dari negara?',
    options: [
      { id: 'o1', text: 'Norma Hukum', isCorrect: true },
      { id: 'o2', text: 'Norma Kesopanan', isCorrect: false },
      { id: 'o3', text: 'Norma Kesusilaan', isCorrect: false },
      { id: 'o4', text: 'Norma Adat Lokal', isCorrect: false },
    ],
    explanation: 'Norma hukum dibuat oleh lembaga negara resmi dan memiliki sanksi tegas, pasti, serta mengikat bagi seluruh warga negara.',
  },
  {
    id: 'fin_2',
    type: 'case-study',
    topicTag: 'Norma Kesusilaan',
    context: 'Saat membeli pensil di kantin kejujuran sekolah, Made menyadari uang kembalian yang diterimanya berlebih Rp5.000. Made segera mengembalikan kelebihan uang tersebut.',
    question: 'Tindakan Made tersebut merupakan pengamalan dari norma apa?',
    options: [
      { id: 'o1', text: 'Norma Kesusilaan (menjunjung kejujuran hati nurani).', isCorrect: true },
      { id: 'o2', text: 'Norma Hukum pidana negara.', isCorrect: false },
      { id: 'o3', text: 'Norma Kesopanan semata.', isCorrect: false },
    ],
    explanation: 'Mengembalikan uang kembalian berlebih karena dorongan hati nurani jujur adalah cerminan utama norma kesusilaan.',
  },
  {
    id: 'fin_3',
    type: 'multiple-choice',
    topicTag: 'Hak dan Kewajiban di Rumah',
    question: 'Sebagai anggota keluarga di rumah, manakah yang merupakan "hak" seorang anak?',
    options: [
      { id: 'o1', text: 'Mendapatkan kasih sayang, makanan bergizi, dan perlindungan dari orang tua.', isCorrect: true },
      { id: 'o2', text: 'Membantu merapikan tempat tidur sendiri setelah bangun tidur.', isCorrect: false },
      { id: 'o3', text: 'Menghormati dan mematuhi nasihat baik orang tua.', isCorrect: false },
      { id: 'o4', text: 'Belajar dengan tekun dan menjaga nama baik keluarga.', isCorrect: false },
    ],
    explanation: 'Mendapatkan kasih sayang dan perlindungan adalah hak anak. Membantu orang tua dan belajar adalah kewajiban anak.',
  },
  {
    id: 'fin_4',
    type: 'true-false',
    topicTag: 'Musyawarah Mufakat',
    question: 'Dalam musyawarah keluarga untuk menentukan tujuan liburan, semua anggota keluarga berhak menyampaikan pendapat dengan sopan dan terbuka.',
    correctAnswerBool: true,
    explanation: 'Benar! Setiap anggota keluarga memiliki hak berbicara dan didengarkan secara demokratis dalam musyawarah keluarga.',
  },
  {
    id: 'fin_5',
    type: 'case-study',
    topicTag: 'Toleransi Beragama',
    context: 'Di kelas V SD Nusantara, Ahmad dan Yohanes bersahabat karib. Pada hari Jumat siang, Ahmad hendak menunaikan salat Jumat, sedangkan Yohanes sedang beristirahat.',
    question: 'Sikap terbaik yang mencerminkan penerapan norma agama dan toleransi adalah:',
    options: [
      { id: 'o1', text: 'Yohanes mempersilakan Ahmad beribadah dan menjaga ketenangan.', isCorrect: true },
      { id: 'o2', text: 'Yohanes mengajak Ahmad terus bermain dan mengabaikan ibadah.', isCorrect: false },
      { id: 'o3', text: 'Ahmad marah-marah kepada teman-teman yang tidak beribadah.', isCorrect: false },
    ],
    explanation: 'Menghormati teman yang hendak beribadah adalah pengamalan norma agama dan cerminan toleransi luhur bangsa Indonesia.',
  },
  {
    id: 'fin_6',
    type: 'multiple-choice',
    topicTag: 'Penerapan Norma di Sekolah',
    question: 'Siti melihat seorang adik kelas tersandung dan buku-bukunya berserakan di lorong sekolah. Siti segera membantu merapikan buku tersebut. Nilai utama yang dipraktikkan Siti adalah...',
    options: [
      { id: 'o1', text: 'Kepedulian dan gotong royong sesuai norma kesusilaan dan kesopanan.', isCorrect: true },
      { id: 'o2', text: 'Menghindari hukuman dari kepala sekolah.', isCorrect: false },
      { id: 'o3', text: 'Mengharapkan pujian dan imbalan uang dari teman.', isCorrect: false },
    ],
    explanation: 'Membantu orang lain yang membutuhkan dengan tulus adalah wujud budi pekerti luhur pengamalan norma.',
  },
  {
    id: 'fin_7',
    type: 'true-false',
    topicTag: 'Keputusan Bersama',
    question: 'Jika keputusan musyawarah telah disepakati bersama, anggota yang pendapatnya tidak terpilih boleh menolak menjalankan hasil kesepakatan tersebut.',
    correctAnswerBool: false,
    explanation: 'Salah! Seluruh anggota wajib melaksanakan hasil keputusan musyawarah dengan lapang dada dan penuh tanggung jawab bersama.',
  },
  {
    id: 'fin_8',
    type: 'multiple-choice',
    topicTag: 'Refleksi Norma',
    question: 'Mengapa aturan dan norma sangat dibutuhkan dalam kehidupan bermasyarakat?',
    options: [
      { id: 'o1', text: 'Agar tercipta ketertiban, keadilan, kedamaian, dan saling menghargai antarwarga.', isCorrect: true },
      { id: 'o2', text: 'Agar orang dewasa dapat berkuasa atas anak-anak.', isCorrect: false },
      { id: 'o3', text: 'Agar masyarakat saling berselisih dan mencari kesalahan orang lain.', isCorrect: false },
      { id: 'o4', text: 'Hanya sekadar formalitas buku pelajaran tanpa makna nyata.', isCorrect: false },
    ],
    explanation: 'Norma diciptakan demi mewujudkan masyarakat yang adil, tenteram, tertib, dan harmonis.',
  },
];

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  user,
  onBackToDashboard,
  onNavigateTab,
  onUserUpdated,
}) => {
  const [activeType, setActiveType] = useState<AssessmentType>('formative');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [lastAttempt, setLastAttempt] = useState<AssessmentAttempt | null>(null);

  // Load question bank based on activeType
  const questions = 
    activeType === 'pre'
      ? PRE_ASSESSMENT_QUESTIONS
      : activeType === 'formative'
      ? FORMATIVE_ASSESSMENT_QUESTIONS
      : FINAL_ASSESSMENT_QUESTIONS;

  const currentQ = questions[currentQuestionIndex] || questions[0];
  const allAttempts = storageService.getAssessmentAttempts(user.id);

  const handleSelectAnswer = (ansVal: any) => {
    if (isSubmitted) return;
    audioService.playClickTone();
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: ansVal,
    }));
  };

  const handleNextQuestion = () => {
    audioService.playClickTone();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    audioService.playClickTone();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitAssessment = () => {
    audioService.playClickTone();
    let correctCount = 0;
    const reviewTopics: string[] = [];

    questions.forEach((q) => {
      const userAns = userAnswers[q.id];
      let isCorrect = false;

      if (q.type === 'multiple-choice' || q.type === 'case-study') {
        const correctOpt = q.options?.find((o) => o.isCorrect);
        if (correctOpt && userAns === correctOpt.id) {
          isCorrect = true;
        }
      } else if (q.type === 'true-false') {
        if (userAns === q.correctAnswerBool) {
          isCorrect = true;
        }
      }

      if (isCorrect) {
        correctCount++;
      } else {
        if (!reviewTopics.includes(q.topicTag)) {
          reviewTopics.push(q.topicTag);
        }
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 70;

    if (passed) {
      audioService.playActivityCompleteChime();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    } else {
      audioService.playIncorrectTone();
    }

    const attempt: AssessmentAttempt = {
      id: 'att_' + Date.now(),
      studentId: user.id,
      studentName: user.name,
      assessmentType: activeType,
      score,
      maxScore: 100,
      percentage: score,
      passed,
      completedAt: new Date().toISOString(),
      answers: userAnswers,
      topicsToReview: reviewTopics,
    };

    storageService.saveAssessmentAttempt(attempt);
    setLastAttempt(attempt);
    setIsSubmitted(true);

    if (passed) {
      const updatedUser = storageService.addBonusStars(3);
      if (updatedUser && onUserUpdated) {
        onUserUpdated(updatedUser);
      }
    }
  };

  const handleRestart = () => {
    audioService.playClickTone();
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setLastAttempt(null);
  };

  const handleSwitchType = (type: AssessmentType) => {
    audioService.playClickTone();
    setActiveType(type);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setLastAttempt(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-left">
      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
              Evaluasi Pembelajaran
            </span>
            <span className="text-xs text-slate-500">Pendidikan Pancasila Kelas V SD</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Asesmen Pembelajaran: Bab 2 Norma dalam Kehidupanku
          </h2>
          <p className="text-base text-slate-600 mt-1">
            Uji pemahamanmu secara berkala melalui asesmen awal, formatif, dan sumatif akhir.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToDashboard}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      {/* 3 Assessment Mode Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => handleSwitchType('pre')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeType === 'pre'
              ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-500/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-xs uppercase font-bold block opacity-80">Tahap 1 · Awal</span>
          <h3 className="text-lg font-bold mt-0.5">Pre Assessment</h3>
          <p className="text-xs mt-1 leading-relaxed opacity-90">
            Diagnostik awal mengukur kesiapan belajar sebelum memasuki modul.
          </p>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchType('formative')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeType === 'formative'
              ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-500/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-xs uppercase font-bold block opacity-80">Tahap 2 · Berjalan</span>
          <h3 className="text-lg font-bold mt-0.5">Formative Assessment</h3>
          <p className="text-xs mt-1 leading-relaxed opacity-90">
            Pemantauan capaian pemahaman saat mempelajari norma, hak, dan musyawarah.
          </p>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchType('final')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeType === 'final'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-xs uppercase font-bold block opacity-80">Tahap 3 · Akhir</span>
          <h3 className="text-lg font-bold mt-0.5">Final Assessment</h3>
          <p className="text-xs mt-1 leading-relaxed opacity-90">
            Uji ketuntasan komprehensif Bab 2 berstandar buku panduan guru.
          </p>
        </button>
      </div>

      {/* MAIN TEST WORKSPACE */}
      {!isSubmitted ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
          {/* Header Progress Bar */}
          <div className="flex items-center justify-between text-sm text-slate-500 pb-4 border-b border-slate-100">
            <span className="font-bold text-slate-800">
              Soal {currentQuestionIndex + 1} dari {questions.length}
            </span>
            <span className="text-xs bg-slate-100 px-3 py-1 rounded-full font-semibold text-slate-700">
              Topik: {currentQ.topicTag}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Context box if available (Case Study) */}
          {currentQ.context && (
            <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-sm sm:text-base text-indigo-950 leading-relaxed">
              <strong>Studi Kasus Situasional:</strong> {currentQ.context}
            </div>
          )}

          {/* Question Text */}
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            {currentQ.question}
          </h3>

          {/* Answer Inputs based on type */}
          {(currentQ.type === 'multiple-choice' || currentQ.type === 'case-study') && (
            <div className="space-y-3 pt-2">
              {currentQ.options?.map((opt) => {
                const isSelected = userAnswers[currentQ.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectAnswer(opt.id)}
                    className={`w-full p-4 rounded-2xl border text-left font-semibold text-base transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-200 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt.text}</span>
                    <span
                      className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {currentQ.type === 'true-false' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => handleSelectAnswer(true)}
                className={`p-5 rounded-2xl border text-center font-bold text-lg transition-all cursor-pointer ${
                  userAnswers[currentQ.id] === true
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-200 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                BENAR
              </button>

              <button
                type="button"
                onClick={() => handleSelectAnswer(false)}
                className={`p-5 rounded-2xl border text-center font-bold text-lg transition-all cursor-pointer ${
                  userAnswers[currentQ.id] === false
                    ? 'bg-rose-50 border-rose-600 text-rose-900 ring-2 ring-rose-200 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                SALAH
              </button>
            </div>
          )}

          {/* Stepper Navigation */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={handlePrevQuestion}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentQuestionIndex === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Selanjutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitAssessment}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-base transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Kumpulkan Asesmen</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* RESULT VIEW AFTER SUBMISSION */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8 text-center animate-in fade-in duration-200">
          <div className="max-w-md mx-auto space-y-3">
            <div
              className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
                lastAttempt?.passed
                  ? 'bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50'
                  : 'bg-amber-100 text-amber-600 ring-8 ring-amber-50'
              }`}
            >
              {lastAttempt?.passed ? (
                <Award className="w-10 h-10" />
              ) : (
                <BookOpen className="w-10 h-10" />
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {lastAttempt?.passed ? 'Hebat! Kamu Berhasil Tuntas' : 'Ayo Semangat, Pelajari Lagi!'}
            </h3>

            <div className="flex items-center justify-center gap-3 py-2">
              <div className="px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-xs text-slate-500 font-semibold block">Skor Akhir</span>
                <span className="text-3xl font-extrabold text-slate-900 font-mono">
                  {lastAttempt?.score}
                  <span className="text-lg font-normal text-slate-400">/100</span>
                </span>
              </div>

              <div className="px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-xs text-slate-500 font-semibold block">Status Kelulusan</span>
                <span
                  className={`text-base font-bold ${
                    lastAttempt?.passed ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {lastAttempt?.passed ? 'Tuntas (KKM 70)' : 'Perlu Pendampingan'}
                </span>
              </div>
            </div>

            <p className="text-base text-slate-600 leading-relaxed">
              {lastAttempt?.passed
                ? 'Pemahamanmu tentang nilai-nilai norma, hak, kewajiban, dan musyawarah sudah sangat baik. Terus terapkan dalam kehidupan sehari-hari!'
                : 'Jangan berkecil hati. Mari pelajari kembali materi yang masih membingungkan melalui menu Tutorial atau bertanya kepada Teman Belajar.'}
            </p>
          </div>

          {/* Topics to Review Recommendation */}
          {lastAttempt?.topicsToReview && lastAttempt.topicsToReview.length > 0 && (
            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 max-w-xl mx-auto text-left">
              <span className="text-xs uppercase font-bold text-amber-800 tracking-wider block mb-1">
                Rekomendasi Materi yang Perlu Dipelajari Kembali:
              </span>
              <ul className="list-disc list-inside text-sm sm:text-base text-amber-950 space-y-1 font-semibold">
                {lastAttempt.topicsToReview.map((topic, i) => (
                  <li key={i}>{topic}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRestart}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-base transition-colors cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Asesmen</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('tutorial')}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-base transition-colors cursor-pointer flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Buka Tutorial Materi</span>
            </button>

            <button
              type="button"
              onClick={onBackToDashboard}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl text-base transition-colors cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}

      {/* ATTEMPT HISTORY SECTION */}
      {allAttempts.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4">
            <History className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-bold text-slate-900">
              Riwayat Pengerjaan Asesmen Siswa
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-xs border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Waktu Pengerjaan</th>
                  <th className="py-3 px-4">Jenis Asesmen</th>
                  <th className="py-3 px-4">Skor</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {allAttempts.slice(0, 5).map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-xs text-slate-500">
                      {new Date(att.completedAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 capitalize">
                      {att.assessmentType === 'pre'
                        ? 'Pre Assessment'
                        : att.assessmentType === 'formative'
                        ? 'Formative Assessment'
                        : 'Final Assessment'}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {att.score}/100
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          att.passed
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {att.passed ? 'Tuntas' : 'Perlu Bimbingan'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
