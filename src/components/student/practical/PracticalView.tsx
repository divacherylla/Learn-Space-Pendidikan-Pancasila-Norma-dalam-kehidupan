import React, { useState } from 'react';
import { 
  Briefcase, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  Send, 
  Sparkles, 
  Home, 
  GraduationCap, 
  Users, 
  ThumbsUp, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { PracticalScenario, PracticalCategory, User, PracticalSubmission } from '../../../types';
import { storageService } from '../../../services/storageService';

interface PracticalViewProps {
  user: User;
  onBackToDashboard: () => void;
  onNavigateTab: (tab: string) => void;
}

const PRACTICAL_SCENARIOS: PracticalScenario[] = [
  {
    id: 'sc_sekolah_sampah',
    title: 'Menjaga Kebersihan Lingkungan Sekolah',
    category: 'sekolah',
    categoryLabel: 'Di Sekolah',
    objective: 'Mengidentifikasi tindakan yang tepat saat melihat pelanggaran norma ketertiban dan kebersihan di sekolah.',
    situationHeadline: 'Kasus: Bungkus Makanan di Halaman Sekolah',
    situationNarrative: 'Ketika jam istirahat berbunyi, kamu sedang berjalan santai di selasar depan perpustakaan. Kamu melihat seorang teman satu angkatan melempar bungkus roti kosong ke pot bunga hias, padahal tempat sampah berjarak hanya 4 meter di dekatnya. Teman tersebut kemudian berjalan pergi seolah tidak terjadi apa-apa.',
    instruction: 'Pilihlah tindakan yang paling bijak, sesuai norma kesopanan dan ketertiban sekolah, lalu tuliskan alasan dan refleksimu.',
    options: [
      {
        id: 'opt_1',
        label: 'A. Membiarkannya saja karena takut dimusuhi oleh teman tersebut.',
        description: 'Tidak melakukan tindakan apa pun dan mengabaikan sampah.',
        isRecommended: false,
        consequence: 'Sampah akan menumpuk dan merusak keindahan sekolah, serta teman tidak menyadari kesalahannya.'
      },
      {
        id: 'opt_2',
        label: 'B. Ikut membuang sampah sembarangan karena menganggap hal itu wajar.',
        description: 'Meniru perilaku yang keliru.',
        isRecommended: false,
        consequence: 'Ini adalah pelanggaran norma tata tertib sekolah yang merugikan seluruh warga sekolah.'
      },
      {
        id: 'opt_3',
        label: 'C. Menghampiri teman dan mengingatkannya dengan ramah dan sopan.',
        description: 'Mengingatkan dengan bahasa santun agar teman memindahkan sampah ke tempatnya.',
        isRecommended: true,
        consequence: 'Tindakan terpuji! Teman tersadarkan tanpa merasa dipermalukan, dan lingkungan sekolah tetap bersih asri.'
      },
      {
        id: 'opt_4',
        label: 'D. Meneriaki dan memarahinya di depan banyak orang.',
        description: 'Menegur dengan cara yang kasar dan emosional.',
        isRecommended: false,
        consequence: 'Dapat memicu pertengkaran dan melanggar norma kesopanan, meskipun tujuannya baik.'
      }
    ],
    classificationTask: {
      instruction: 'Kelompokkan perilaku berikut ini: tentukan mana yang Sesuai Norma dan mana yang Tidak Sesuai Norma:',
      items: [
        { id: 'c1', text: 'Menyimpan bungkus jajan di saku saat belum menemukan tempat sampah', isAppropriate: true },
        { id: 'c2', text: 'Mencoret-coret meja belajar dengan tip-ex atau spidol', isAppropriate: false },
        { id: 'c3', text: 'Melaksanakan tugas piket menyapu kelas bersama regu kelompok', isAppropriate: true },
        { id: 'c4', text: 'Meninggalkan piring mangkuk kotor di meja kantin begitu saja', isAppropriate: false }
      ]
    },
    reflectionPrompt: 'Bagaimana kamu menerapkan tanggung jawab menjaga kebersihan fasilitas bersama ini di kehidupan sehari-harimu?'
  },
  {
    id: 'sc_rumah_kesepakatan',
    title: 'Menaati Kesepakatan di Rumah',
    category: 'rumah',
    categoryLabel: 'Di Rumah',
    objective: 'Menerapkan norma kesusilaan dan kesopanan dalam mematuhi kesepakatan keluarga.',
    situationHeadline: 'Kasus: Waktu Belajar vs Main Game',
    situationNarrative: 'Di rumahmu ada kesepakatan keluarga: setiap hari Senin sampai Kamis, pukul 19.00 - 20.30 adalah jam belajar mandiri tanpa gawai (smartphone/gadget). Malam ini, sahabatmu mengajak bermain game daring bersama tepat pukul 19.15, padahal kamu belum menyelesaikan PR matematika.',
    instruction: 'Pilihlah tindakan yang mencerminkan kejujuran dan rasa tanggung jawab terhadap kesepakatan keluarga.',
    options: [
      {
        id: 'opt_r1',
        label: 'A. Bermain game secara sembunyi-sembunyi di dalam kamar dengan pintu terkunci.',
        description: 'Melanggar kesepakatan dan membohongi orang tua.',
        isRecommended: false,
        consequence: 'Melanggar norma kesusilaan (kejujuran hati) dan menghancurkan kepercayaan orang tua.'
      },
      {
        id: 'opt_r2',
        label: 'B. Memberitahu sahabat dengan santun bahwa kamu sedang belajar, dan mengajaknya bermain di akhir pekan.',
        description: 'Menepati janji belajar dan menghargai kesepakatan keluarga.',
        isRecommended: true,
        consequence: 'Pilihan yang sangat bijak! Kewajiban belajarmu tuntas, persahabatan tetap terjaga baik, dan orang tua bangga.'
      },
      {
        id: 'opt_r3',
        label: 'C. Marah-marah kepada orang tua karena merasa aturan jam belajar terlalu kaku.',
        description: 'Meluapkan emosi kepada orang tua.',
        isRecommended: false,
        consequence: 'Melanggar norma kesopanan dan menyakiti perasaan orang tua.'
      }
    ],
    classificationTask: {
      instruction: 'Kelompokkan perilaku anak di rumah berikut ini:',
      items: [
        { id: 'cr1', text: 'Merapikan selimut dan tempat tidur sendiri setelah bangun pagi', isAppropriate: true },
        { id: 'cr2', text: 'Meninggalkan piring kotor di depan televisi setelah makan', isAppropriate: false },
        { id: 'cr3', text: 'Berpamitan dan mencium tangan ayah ibu sebelum bepergian', isAppropriate: true },
        { id: 'cr4', text: 'Membantah perintah orang tua dengan nada suara tinggi', isAppropriate: false }
      ]
    },
    reflectionPrompt: 'Aturan atau kesepakatan apa yang ada di rumahmu yang selalu kamu patuhi dengan senang hati?'
  },
  {
    id: 'sc_musyawarah_pemilihan',
    title: 'Musyawarah Mufakat Pemilihan Ketua Regu',
    category: 'musyawarah',
    categoryLabel: 'Musyawarah',
    objective: 'Mempraktikkan etika musyawarah mufakat, mendengarkan orang lain, dan menghargai keputusan bersama.',
    situationHeadline: 'Kasus: Perbedaan Pendapat Dalam Kelompok Belajar',
    situationNarrative: 'Kelompok belajarmu beranggotakan 5 orang dan sedang bermusyawarah untuk menentukan ketua regu dan tema proyek Pendidikan Pancasila. Dua temanmu saling berebut ingin idenya yang dipilih dan mulai berbicara dengan nada suara meninggi.',
    instruction: 'Pilihlah peran dan tindakanmu sebagai anggota musyawarah yang santun dan menjunjung tinggi mufakat.',
    options: [
      {
        id: 'opt_m1',
        label: 'A. Mengajak teman-teman tenang, mendengarkan argumen masing-masing calon, lalu mencari jalan tengah terbaik.',
        description: 'Menjadi penengah yang adil dan mengedepankan musyawarah santun.',
        isRecommended: true,
        consequence: 'Sangat tepat! Sikap musyawarah mufakat sila ke-4 Pancasila terwujud dalam kerukunan.'
      },
      {
        id: 'opt_m2',
        label: 'B. Memihak teman yang paling dekat saja tanpa mempertimbangkan kebaikan seluruh kelompok.',
        description: 'Memilih berdasarkan pertemanan pribadi secara sepihak.',
        isRecommended: false,
        consequence: 'Memicu kecemburuan dan merusak kekompakan kelompok.'
      },
      {
        id: 'opt_m3',
        label: 'C. Keluar dari kelompok karena malas mendengar perdebatan.',
        description: 'Lari dari tanggung jawab musyawarah.',
        isRecommended: false,
        consequence: 'Tidak menyelesaikan masalah dan menunjukkan sikap belum dewasa dalam berdemokrasi.'
      }
    ],
    classificationTask: {
      instruction: 'Kelompokkan etika musyawarah berikut ini:',
      items: [
        { id: 'cm1', text: 'Mendengarkan teman yang sedang berbicara tanpa memotong kalimatnya', isAppropriate: true },
        { id: 'cm2', text: 'Memaksakan kehendak pribadi harus diterima oleh seluruh anggota', isAppropriate: false },
        { id: 'cm3', text: 'Menerima hasil keputusan mufakat dengan ikhlas dan lapang dada', isAppropriate: true },
        { id: 'cm4', text: 'Mengejek pendapat teman yang berbeda dengan pendapat kita', isAppropriate: false }
      ]
    },
    reflectionPrompt: 'Bagaimana perasaanmu ketika pendapatmu dihargai dalam musyawarah, dan bagaimana sikapmu jika idemu belum terpilih?'
  }
];

export const PracticalView: React.FC<PracticalViewProps> = ({ user, onBackToDashboard, onNavigateTab }) => {
  const [selectedCategory, setSelectedCategory] = useState<PracticalCategory>('sekolah');
  const [activeScenarioId, setActiveScenarioId] = useState<string>('sc_sekolah_sampah');
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [reasoningInput, setReasoningInput] = useState<string>('');
  const [reflectionInput, setReflectionInput] = useState<string>('');
  const [classificationAnswers, setClassificationAnswers] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string>('');

  const currentScenario = PRACTICAL_SCENARIOS.find(s => s.id === activeScenarioId) || PRACTICAL_SCENARIOS[0];

  const handleSelectScenario = (sc: PracticalScenario) => {
    setActiveScenarioId(sc.id);
    setSelectedCategory(sc.category);
    setSelectedOptionId('');
    setReasoningInput('');
    setReflectionInput('');
    setClassificationAnswers({});
    setIsSubmitted(false);
    setSubmissionFeedback('');
  };

  const handleClassificationClick = (itemId: string, isAppropriate: boolean) => {
    if (isSubmitted) return;
    setClassificationAnswers(prev => ({
      ...prev,
      [itemId]: isAppropriate
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOptionId) {
      alert('Pilih salah satu tindakan terlebih dahulu.');
      return;
    }
    if (!reasoningInput.trim()) {
      alert('Tuliskan alasan mengapa kamu memilih tindakan tersebut.');
      return;
    }
    if (!reflectionInput.trim()) {
      alert('Tuliskan refleksi penerapan norma dalam kehidupan sehari-harimu.');
      return;
    }

    const chosenOption = currentScenario.options.find(o => o.id === selectedOptionId);
    const isRecommended = chosenOption?.isRecommended ?? false;

    // Check classification accuracy
    let correctCount = 0;
    if (currentScenario.classificationTask) {
      currentScenario.classificationTask.items.forEach(item => {
        if (classificationAnswers[item.id] === item.isAppropriate) {
          correctCount++;
        }
      });
    }

    const feedbackText = isRecommended
      ? `Luar biasa, ${user.name}! Pilihanmu sangat bijak dan sesuai dengan pengamalan norma. ${chosenOption?.consequence}`
      : `Pilihanmu telah dicatat. ${chosenOption?.consequence} Mari perkuat pemahaman norma agar dapat mengambil keputusan yang lebih tepat.`;

    const submission: PracticalSubmission = {
      id: 'sub_' + Date.now(),
      studentId: user.id,
      studentName: user.name,
      scenarioId: currentScenario.id,
      scenarioTitle: currentScenario.title,
      category: currentScenario.category,
      selectedOptionId,
      selectedOptionLabel: chosenOption?.label || '',
      reasoningText: reasoningInput.trim(),
      reflectionText: reflectionInput.trim(),
      classificationScore: correctCount,
      feedback: feedbackText,
      submittedAt: new Date().toISOString()
    };

    storageService.savePracticalSubmission(submission);
    setSubmissionFeedback(feedbackText);
    setIsSubmitted(true);
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
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
                Aktivitas Practical (Penerapan Kasus Nyata)
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Pendidikan Pancasila · Simulasi Pengambilan Keputusan Moral & Tanggung Jawab
              </p>
            </div>
          </div>
        </div>

        {/* Category switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => handleSelectScenario(PRACTICAL_SCENARIOS.find(s => s.category === 'sekolah')!)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              currentScenario.category === 'sekolah'
                ? 'bg-white text-emerald-700 shadow-xs border border-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Di Sekolah</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectScenario(PRACTICAL_SCENARIOS.find(s => s.category === 'rumah')!)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              currentScenario.category === 'rumah'
                ? 'bg-white text-emerald-700 shadow-xs border border-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Di Rumah</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectScenario(PRACTICAL_SCENARIOS.find(s => s.category === 'musyawarah')!)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              currentScenario.category === 'musyawarah'
                ? 'bg-white text-emerald-700 shadow-xs border border-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Musyawarah</span>
          </button>
        </div>
      </div>

      {/* Main Scenario Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 mb-8 space-y-8">
        {/* Scenario Header */}
        <div className="border-b border-slate-100 pb-6">
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg uppercase tracking-wider mb-2">
            Konteks: {currentScenario.categoryLabel}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            {currentScenario.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Tujuan Aktivitas: {currentScenario.objective}
          </p>
        </div>

        {/* Story Box */}
        <div className="p-6 sm:p-8 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 block">
            {currentScenario.situationHeadline}
          </span>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            {currentScenario.situationNarrative}
          </p>
          <div className="pt-2 text-xs text-slate-400 font-mono">
            Instruksi: {currentScenario.instruction}
          </div>
        </div>

        {/* Task Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* A. Decision Options */}
          <div>
            <label className="block text-base font-bold text-slate-900 mb-3">
              1. Pilih Tindakan yang Paling Tepat Menurutmu:
            </label>
            <div className="space-y-3">
              {currentScenario.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      if (!isSubmitted) setSelectedOptionId(opt.id);
                    }}
                    className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className={`font-bold text-sm sm:text-base block ${isSelected ? 'text-emerald-950' : 'text-slate-900'}`}>
                          {opt.label}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-500 mt-1 block">
                          {opt.description}
                        </span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* B. Classification Activity (Sesuai Norma vs Tidak Sesuai Norma) */}
          {currentScenario.classificationTask && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <label className="block text-base font-bold text-slate-900">
                2. Aktivitas Klasifikasi Perilaku:
              </label>
              <p className="text-sm text-slate-600">
                {currentScenario.classificationTask.instruction}
              </p>

              <div className="space-y-3">
                {currentScenario.classificationTask.items.map((item) => {
                  const currentAns = classificationAnswers[item.id];
                  return (
                    <div
                      key={item.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <span className="text-sm font-semibold text-slate-800 flex-1">
                        {item.text}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleClassificationClick(item.id, true)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentAns === true
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Sesuai Norma
                        </button>
                        <button
                          type="button"
                          onClick={() => handleClassificationClick(item.id, false)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentAns === false
                              ? 'bg-rose-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Tidak Sesuai
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* C. Short Response (Alasan Tindakan) */}
          <div>
            <label className="block text-base font-bold text-slate-900 mb-2">
              3. Berikan Alasan Mengapa Kamu Memilih Tindakan Tersebut:
            </label>
            <textarea
              value={reasoningInput}
              onChange={(e) => setReasoningInput(e.target.value)}
              disabled={isSubmitted}
              rows={3}
              placeholder="Tuliskan alasanmu di sini (contoh: Karena mengingatkan dengan sopan tidak membuat teman malu dan menjaga kerukunan)..."
              className="w-full p-4 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
            />
          </div>

          {/* D. Reflection */}
          <div>
            <label className="block text-base font-bold text-slate-900 mb-2">
              4. Refleksi Pribadi:
            </label>
            <p className="text-xs sm:text-sm text-slate-500 mb-2">
              {currentScenario.reflectionPrompt}
            </p>
            <textarea
              value={reflectionInput}
              onChange={(e) => setReflectionInput(e.target.value)}
              disabled={isSubmitted}
              rows={3}
              placeholder="Tuliskan pengalaman atau komitmen pribadimu..."
              className="w-full p-4 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
            />
          </div>

          {/* Submission and Feedback Banner */}
          {isSubmitted ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-emerald-950">
                    Aktivitas Berhasil Disimpan & Dinilai!
                  </h4>
                  <span className="text-xs text-emerald-700 font-medium">
                    +5 Bintang Pembelajar Ditambahkan ke Profilmu
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-emerald-200 text-sm sm:text-base text-slate-800 leading-relaxed">
                <span className="font-bold text-emerald-800 block mb-1">
                  Umpan Balik Guru & Sistem:
                </span>
                {submissionFeedback}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigateTab('drill-game')}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Lanjut ke Drill & Game
                </button>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold rounded-xl text-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ubah Jawaban</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg"
            >
              <Send className="w-5 h-5" />
              <span>Kirim Jawaban & Dapatkan Feedback</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
