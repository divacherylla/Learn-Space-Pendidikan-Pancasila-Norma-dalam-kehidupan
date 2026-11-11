import React, { useState } from 'react';
import { 
  Home, 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Scale, 
  Compass, 
  HeartHandshake, 
  Users, 
  Volume2, 
  ShieldCheck 
} from 'lucide-react';
import { audioService } from '../../services/audioService';

interface ChapterSummaryViewProps {
  onStartMission?: (activityId?: string) => void;
  onBackToDashboard?: () => void;
}

export const ChapterSummaryView: React.FC<ChapterSummaryViewProps> = ({
  onStartMission,
  onBackToDashboard,
}) => {
  const [activeSection, setActiveSection] = useState<string>('all');
  const [selectedNorma, setSelectedNorma] = useState<number>(0);
  const [environmentTab, setEnvironmentTab] = useState<'rumah' | 'sekolah'>('rumah');
  const [quizAnswer, setQuizAnswer] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const [isSpeakingSummary, setIsSpeakingSummary] = useState<boolean>(false);

  // 4 Macam Norma Data
  const normaList = [
    {
      id: 1,
      name: 'Norma Agama',
      icon: Compass,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      source: 'Bersumber dari wahyu / ajaran agama Tuhan Yang Maha Esa',
      explanation: 'Pedoman perilaku dan ibadah manusia yang mengatur hubungan dengan Tuhan dan sesama ciptaan-Nya.',
      examples: [
        'Melaksanakan ibadah tepat waktu sesuai ajaran agama masing-masing',
        'Tidak mengambil atau mencuri barang milik orang lain',
        'Menyayangi sesama makhluk hidup ciptaan Tuhan',
        'Menghormati teman yang sedang beribadah atau berdoa',
      ],
      sanksi: 'Dosa dan pertanggungjawaban di hadapan Tuhan YME di akhirat kelak.',
      misiRef: 'act_1_2',
    },
    {
      id: 2,
      name: 'Norma Kesusilaan',
      icon: HeartHandshake,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      source: 'Berkaitan dengan bisikan hati nurani manusia',
      explanation: 'Pedoman perilaku baik atau buruk yang bersumber dari lubuk hati nurani yang suci dan jujur.',
      examples: [
        'Berperilaku jujur saat ujian, tidak mencontek',
        'Mengembalikan kelebihan uang kembalian belanja kepada penjual',
        'Merasa bersalah jika berbohong dan segera meminta maaf',
        'Menolong orang yang membutuhkan dengan ikhlas tanpa pamrih',
      ],
      sanksi: 'Rasa penyesalan batin, gelisah, rasa malu, dan tersiksa oleh hati nurani sendiri.',
      misiRef: 'act_1_2',
    },
    {
      id: 3,
      name: 'Norma Kesopanan',
      icon: Users,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      source: 'Tata krama, adat istiadat, dan pergaulan masyarakat',
      explanation: 'Aturan pergaulan hidup yang timbul dari kesepakatan suatu kelompok masyarakat tentang kepantasan berperilaku.',
      examples: [
        'Menyapa guru dan orang tua dengan mencium tangan serta membungkukkan badan',
        'Berbicara dengan bahasa yang santun dan nada suara yang ramah',
        'Makan dan minum menggunakan tangan kanan sambil duduk',
        'Tidak memotong pembicaraan orang tua atau teman yang sedang berbicara',
      ],
      sanksi: 'Teguran lisan, dicemooh, atau dikucilkan dari pergaulan masyarakat.',
      misiRef: 'act_1_2',
    },
    {
      id: 4,
      name: 'Norma Hukum',
      icon: Scale,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      source: 'Dibuat dan ditetapkan oleh lembaga resmi negara yang berwenang',
      explanation: 'Aturan tertulis resmi yang mengikat seluruh warga negara demi menjamin keadilan dan ketertiban umum.',
      examples: [
        'Memakai helm standar saat mengendarai sepeda motor',
        'Menyeberang jalan raya di zebra cross atau jembatan penyeberangan',
        'Menaati peraturan rambu-rambu lalu lintas',
        'Tidak merusak fasilitas umum atau milik negara',
      ],
      sanksi: 'Sanksi tegas dan nyata berupa denda, teguran tertulis, hingga kurungan/penjara oleh aparat penegak hukum.',
      misiRef: 'act_1_2',
    },
  ];

  // Quick review questions
  const miniQuiz = [
    {
      q: 'Norma yang bersumber dari bisikan hati nurani tentang perilaku baik dan buruk adalah...',
      options: ['Norma Hukum', 'Norma Kesusilaan', 'Norma Kesopanan', 'Norma Kebiasaan'],
      correct: 1,
      explanation: 'Norma kesusilaan bersumber dari hati nurani manusia yang membedakan mana yang benar dan salah.',
    },
    {
      q: 'Berikut ini yang merupakan contoh pelaksanaan kewajiban siswa di sekolah adalah...',
      options: [
        'Mendapatkan ruang kelas yang bersih',
        'Meminjam buku perpustakaan',
        'Mengikuti upacara bendera hari Senin dengan tertib',
        'Mendapatkan nilai rapor yang memuaskan',
      ],
      correct: 2,
      explanation: 'Mengikuti upacara bendera dengan tertib adalah kewajiban siswa, sedangkan fasilitas dan nilai adalah hak siswa.',
    },
    {
      q: 'Mengapa manusia perlu melakukan musyawarah dalam mengambil keputusan?',
      options: [
        'Agar orang yang paling berani selalu menang',
        'Karena manusia makhluk sosial yang perlu mufakat bersama demi ketertiban',
        'Hanya untuk mengisi waktu luang di kelas',
        'Supaya semua aturan bisa dilanggar bersama-sama',
      ],
      correct: 1,
      explanation: 'Musyawarah penting karena kita hidup bersama sebagai makhluk sosial dan harus menghargai pendapat sesama.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Banner Header (Consuloan Inspired: Clean, prominent, readable) */}
      <div className="bg-[#1E1B4B] text-white rounded-3xl p-7 sm:p-10 border border-slate-800 shadow-md mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 text-indigo-200 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-2.5">
              <BookOpen className="w-4 h-4 text-indigo-300" />
              <span>Buku Panduan Siswa Kelas V · Pendidikan Pancasila</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Rangkuman Materi: Norma dalam Kehidupanku
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mt-2.5">
              Panduan lengkap belajar norma, hak dan kewajiban secara seimbang, praktik sehari-hari di rumah dan sekolah, hingga musyawarah mufakat.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                audioService.playClickTone();
                if (isSpeakingSummary) {
                  audioService.stopSpeaking();
                  setIsSpeakingSummary(false);
                } else {
                  setIsSpeakingSummary(true);
                  const text = `Rangkuman Materi: Norma dalam Kehidupanku. Ada empat macam norma: Norma Agama yang bersumber dari wahyu Tuhan, Norma Kesusilaan dari hati nurani manusia, Norma Kesopanan dari tata krama pergaulan masyarakat, dan Norma Hukum dari aturan tertulis resmi negara. Hak dan kewajiban harus dilaksanakan secara seimbang, serta musyawarah mufakat diutamakan dalam setiap pengambilan keputusan bersama.`;
                  audioService.speakIndonesian(text, () => {
                    setIsSpeakingSummary(false);
                  });
                }
              }}
              className={`px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                isSpeakingSummary
                  ? 'bg-emerald-500 text-white shadow-md animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isSpeakingSummary ? 'Hentikan Audio' : 'Dengarkan Narasi Audio'}</span>
            </button>

            {onBackToDashboard && (
              <button
                type="button"
                onClick={onBackToDashboard}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Ke Beranda</span>
              </button>
            )}
            {onStartMission && (
              <button
                type="button"
                onClick={() => onStartMission('act_1_2')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer flex items-center gap-2 border border-slate-700"
              >
                <span>Kerjakan Latihan Interaktif</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Navigation Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none text-sm font-semibold">
        {[
          { id: 'all', label: 'Semua Rangkuman' },
          { id: 'pengertian', label: '1. Pengertian & Pentingnya' },
          { id: 'macam-norma', label: '2. 4 Macam Norma' },
          { id: 'hak-kewajiban', label: '3. Hak & Kewajiban' },
          { id: 'penerapan', label: '4. Penerapan Sehari-hari' },
          { id: 'musyawarah', label: '5. Musyawarah Mufakat' },
          { id: 'inti', label: 'Poin Penting Diingat' },
        ].map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setActiveSection(sec.id)}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer border ${
              activeSection === sec.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {/* BAGIAN 1: PENGERTIAN & PENTINGNYA NORMA */}
        {(activeSection === 'all' || activeSection === 'pengertian') && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                1
              </span>
              <h2 className="font-display text-xl font-bold text-slate-900">
                Pengertian dan Pentingnya Norma
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-1">
                  📖 Apa itu Norma?
                </span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  <strong>Norma</strong> adalah kaidah atau aturan yang menjadi pedoman perilaku manusia dalam kehidupan bermasyarakat.
                </p>
                <div className="mt-3 pt-3 border-t border-amber-200/80 text-[11px] text-slate-700">
                  Norma menjadi pagar petunjuk agar kita tahu tindakan apa yang pantas dilakukan dan tindakan apa yang harus dihindari.
                </div>
              </div>

              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block mb-1">
                  🛡️ Mengapa Norma Sangat Penting?
                </span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  Norma diperlukan agar kehidupan menjadi <strong>tertib, damai, rukun</strong>, dan <strong>tidak terjadi benturan kepentingan</strong> antarindividu maupun kelompok.
                </p>
                <div className="mt-3 pt-3 border-t border-blue-200/80 text-[11px] text-slate-700">
                  Bayangkan jika jalan raya tanpa lampu lalu lintas atau kelas tanpa jadwal piket—tentu akan terjadi kekacauan!
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <span className="text-2xl">🏡 🏫 🌳</span>
              <p className="text-xs text-slate-700 font-medium">
                <strong>Ruang Lingkup Penerapan:</strong> Norma harus diterapkan dalam kehidupan sehari-hari secara konsisten, baik di <strong>rumah</strong>, di <strong>sekolah</strong>, maupun di <strong>masyarakat</strong>.
              </p>
            </div>
          </section>
        )}

        {/* BAGIAN 2: MACAM-MACAM NORMA */}
        {(activeSection === 'all' || activeSection === 'macam-norma') && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                  2
                </span>
                <h2 className="font-display text-xl font-bold text-slate-900">
                  4 Macam Norma yang Berlaku di Indonesia
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                Klik kartu norma untuk telaah mendalam
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-6">
              Keempat norma ini menjadi pedoman dalam bertingkah laku dan membantu menjaga keseimbangan antara hak dan kewajiban.
            </p>

            {/* Norma Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {normaList.map((n, idx) => {
                const NIcon = n.icon;
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setSelectedNorma(idx)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      selectedNorma === idx
                        ? 'bg-indigo-50 border-indigo-400 shadow-xs scale-[1.02]'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2">
                      <NIcon className="w-4 h-4" />
                    </div>
                    <h4 className="font-display font-bold text-xs text-slate-900">{n.name}</h4>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {idx === 0 ? 'Ajaran Agama' : idx === 1 ? 'Hati Nurani' : idx === 2 ? 'Tata Krama' : 'Aturan Negara'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Norma Detailed View */}
            {(() => {
              const current = normaList[selectedNorma];
              const CurrentIcon = current.icon;
              return (
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-2xs border border-slate-200 text-indigo-700">
                        <CurrentIcon className="w-6 h-6" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-lg font-bold text-slate-900">
                            {current.name}
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${current.badgeColor}`}>
                            Norma Resmi
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">{current.source}</p>
                      </div>
                    </div>

                    {onStartMission && (
                      <button
                        type="button"
                        onClick={() => onStartMission(current.misiRef)}
                        className="self-start sm:self-auto px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-2xs flex items-center gap-1.5"
                      >
                        <span>Latihan di Misi 1</span>
                        <span>➔</span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium mb-4">
                    {current.explanation}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">
                        Contoh Perilaku Sehari-hari:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {current.examples.map((ex, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✔</span>
                            <span>{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200">
                      <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-2">
                        Sanksi Jika Dilanggar:
                      </span>
                      <p className="text-xs text-rose-950 font-medium leading-relaxed">
                        {current.sanksi}
                      </p>
                      <div className="mt-3 pt-3 border-t border-rose-200 text-[11px] text-rose-900">
                        <em>Sanksi norma hukum adalah yang paling tegas dan nyata karena melibatkan aparat resmi negara.</em>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </section>
        )}

        {/* BAGIAN 3: HAK DAN KEWAJIBAN SECARA SEIMBANG */}
        {(activeSection === 'all' || activeSection === 'hak-kewajiban') && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                  3
                </span>
                <h2 className="font-display text-xl font-bold text-slate-900">
                  Hak dan Kewajiban Harus Dijalankan Secara Seimbang
                </h2>
              </div>

              {onStartMission && (
                <button
                  type="button"
                  onClick={() => onStartMission('act_2_2')}
                  className="self-start sm:self-auto px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <span>Latihan Interaktif: Hak & Kewajiban</span>
                  <span>➔</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Hak dan kewajiban ibarat dua sisi keping mata uang. Kita tidak boleh hanya menuntut hak tanpa terlebih dahulu menyelesaikan kewajiban kita dengan sungguh-sungguh.
            </p>

            {/* Definitions side-by-side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-display text-base font-bold text-emerald-950">HAK</h3>
                </div>
                <p className="text-xs sm:text-sm text-emerald-900 font-medium">
                  <strong>Hak</strong> adalah segala sesuatu yang <strong>seharusnya kita terima</strong> atau kita peroleh untuk tumbuh, belajar, dan berkembang dengan baik.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <HeartHandshake className="w-5 h-5 text-blue-700" />
                  <h3 className="font-display text-base font-bold text-blue-950">KEWAJIBAN</h3>
                </div>
                <p className="text-xs sm:text-sm text-blue-900 font-medium">
                  <strong>Kewajiban</strong> adalah segala sesuatu yang <strong>harus kita lakukan</strong> dengan penuh rasa tanggung jawab sebelum menuntut hak.
                </p>
              </div>
            </div>

            {/* Interactive Compare Environment: Di Rumah vs Di Sekolah */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50">
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="text-xs font-bold text-slate-800">
                  Perbandingan Contoh Nyata:
                </span>
                <div className="inline-flex p-1 bg-slate-200 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setEnvironmentTab('rumah')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      environmentTab === 'rumah' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                    }`}
                  >
                    Di Rumah
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnvironmentTab('sekolah')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      environmentTab === 'sekolah' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                    }`}
                  >
                    Di Sekolah
                  </button>
                </div>
              </div>

              {environmentTab === 'rumah' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-emerald-700 block mb-2">
                      Hak Siswa di Rumah:
                    </span>
                    <ul className="text-xs text-slate-700 space-y-1.5">
                      <li>• Mendapatkan kasih sayang dan perhatian orang tua</li>
                      <li>• Mendapatkan makanan bergizi, pakaian, dan tempat tinggal</li>
                      <li>• Mendapatkan waktu istirahat dan bermain yang cukup</li>
                      <li>• Mendapatkan rasa aman dan perlindungan keluarga</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-blue-700 block mb-2">
                      Kewajiban Siswa di Rumah:
                    </span>
                    <ul className="text-xs text-slate-700 space-y-1.5">
                      <li>• Membantu orang tua membersihkan dan merapikan rumah</li>
                      <li>• Menghormati dan mematuhi nasihat ayah dan ibu</li>
                      <li>• Merapikan tempat tidur dan perlengkapan sendiri</li>
                      <li>• Menjaga nama baik dan kerukunan anggota keluarga</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-emerald-700 block mb-2">
                      Hak Siswa di Sekolah:
                    </span>
                    <ul className="text-xs text-slate-700 space-y-1.5">
                      <li>• Mendapatkan penjelasan materi pelajaran dan bimbingan guru</li>
                      <li>• Menggunakan fasilitas sekolah (perpustakaan, UKS, kelas nyaman)</li>
                      <li>• Mendapatkan perlakuan yang adil tanpa diskriminasi</li>
                      <li>• Menyampaikan pendapat dalam diskusi atau pemilihan ketua kelas</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-blue-700 block mb-2">
                      Kewajiban Siswa di Sekolah:
                    </span>
                    <ul className="text-xs text-slate-700 space-y-1.5">
                      <li>• Menaati tata tertib sekolah dan hadir tepat waktu</li>
                      <li>• Mengikuti <strong>upacara bendera</strong> hari Senin dengan khidmat dan tertib</li>
                      <li>• Menjaga kebersihan kelas serta melaksanakan tugas piket</li>
                      <li>• Menghormati bapak/ibu guru dan menghargai teman sekelas</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* BAGIAN 4: PENERAPAN NORMA DALAM KEHIDUPAN */}
        {(activeSection === 'all' || activeSection === 'penerapan') && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                4
              </span>
              <h2 className="font-display text-xl font-bold text-slate-900">
                Penerapan Norma dalam Kehidupan Sehari-hari
              </h2>
            </div>

            <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 mb-6 text-xs text-slate-800 leading-relaxed">
              ⭐ <strong>Ingat Selalu:</strong> Norma tidak hanya sekadar dipahami dan dihafalkan definisinya, tetapi <strong>wajib dipraktikkan</strong> dalam sikap, tutur kata, dan perilaku nyata setiap hari!
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                {
                  icon: '🧹',
                  title: 'Membantu Orang Tua',
                  desc: 'Mencuci piring sendiri, menyapu lantai, dan merapikan tempat tidur tanpa disuruh berulang kali.',
                },
                {
                  icon: '❤️',
                  title: 'Menghormati Keluarga',
                  desc: 'Berpamitan saat berangkat sekolah dan bertutur kata santun kepada kakak, adik, dan kakek nenek.',
                },
                {
                  icon: '🏫',
                  title: 'Mematuhi Tertib Sekolah',
                  desc: 'Hadir sebelum pukul 07.00, mengenakan seragam rapi lengkap, dan mengerjakan PR tepat waktu.',
                },
                {
                  icon: '🤝',
                  title: 'Menolong Teman',
                  desc: 'Membantu teman yang terjatuh, meminjamkan alat tulis saat teman lupa, dan tidak mengejek.',
                },
                {
                  icon: '🍱',
                  title: 'Berbagi dengan Orang Lain',
                  desc: 'Berbagi bekal saat jam istirahat dan peduli kepada orang di sekitar yang membutuhkan.',
                },
                {
                  icon: '🇮🇩',
                  title: 'Tertib Mengikuti Upacara',
                  desc: 'Berbaris lurus, memakai topi dan dasi, menyanyikan lagu Indonesia Raya dengan khidmat.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-colors"
                >
                  <span className="text-2xl block mb-2">{item.icon}</span>
                  <h4 className="font-display font-bold text-xs text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-slate-700 flex items-center gap-3">
              <span className="text-2xl">🎭</span>
              <div>
                <strong>Aktivitas Simulasi & Roleplay:</strong> Penerapan norma juga dapat dilatih di kelas melalui kegiatan simulasi atau drama interaktif mengenai situasi nyata di rumah dan di sekolah (dapat kamu coba di <strong>Misi 4</strong>).
              </div>
            </div>
          </section>
        )}

        {/* BAGIAN 5: MUSYAWARAH */}
        {(activeSection === 'all' || activeSection === 'musyawarah') && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                5
              </span>
              <h2 className="font-display text-xl font-bold text-slate-900">
                Musyawarah untuk Mengambil Keputusan Bersama
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-6">
              <strong>Musyawarah</strong> merupakan cara khas bangsa Indonesia untuk mengambil keputusan bersama. Musyawarah penting karena manusia hidup sebagai <strong>makhluk sosial</strong> dan saling membutuhkan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-2">
                  🏡 Musyawarah di Keluarga
                </span>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  Dilakukan bersama ayah, ibu, dan saudara untuk memecahkan masalah atau menyusun rencana keluarga:
                </p>
                <ul className="text-xs text-slate-700 space-y-1">
                  <li>• Menentukan destinasi liburan akhir pekan</li>
                  <li>• Pembagian tugas membersihkan rumah di hari Minggu</li>
                  <li>• Menentukan jadwal belajar dan menonton televisi</li>
                </ul>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block mb-2">
                  🏫 Musyawarah di Sekolah
                </span>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  Dilakukan bersama guru dan teman sekelas secara demokratis dan saling menghargai:
                </p>
                <ul className="text-xs text-slate-700 space-y-1">
                  <li>• Menentukan kesepakatan dan tata tertib kelas</li>
                  <li>• Pemilihan ketua kelas dan pengurus kelas V</li>
                  <li>• Pembagian regu jadwal piket kebersihan kelas</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-3">
                🤝 Sikap Terpuji Saat Bermusyawarah:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-bold block text-slate-900 mb-1">1. Menghargai Pendapat</span>
                  Tidak mencela pendapat teman walaupun berbeda dengan usulan kita.
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-bold block text-slate-900 mb-1">2. Mendengarkan dengan Tertib</span>
                  Tidak memotong pembicaraan saat orang lain sedang menyampaikan alasan.
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-bold block text-slate-900 mb-1">3. Menerima Hasil Mufakat</span>
                  Menjalankan keputusan bersama dengan ikhlas dan penuh tanggung jawab.
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ⭐ INTI YANG PERLU DIINGAT (PETA KONSEP DIGITAL) */}
        {(activeSection === 'all' || activeSection === 'inti') && (
          <section className="bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-300 rounded-3xl p-6 sm:p-8 text-slate-950 border border-amber-300 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⭐</span>
              <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                Inti yang Perlu Diingat (Rangkuman Kilat)
              </h2>
            </div>

            {/* Core Diagram */}
            <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-white shadow-xs mb-6">
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block mb-2 text-center sm:text-left">
                Peta Alur Makna Norma:
              </span>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold text-slate-800 text-center">
                <div className="bg-amber-100 border border-amber-300 px-3 py-2 rounded-xl w-full sm:w-auto">
                  Norma
                </div>
                <span className="text-amber-800">➔</span>
                <div className="bg-blue-100 border border-blue-300 px-3 py-2 rounded-xl w-full sm:w-auto">
                  Mengatur Perilaku
                </div>
                <span className="text-amber-800">➔</span>
                <div className="bg-emerald-100 border border-emerald-300 px-3 py-2 rounded-xl w-full sm:w-auto">
                  Menciptakan Ketertiban
                </div>
                <span className="text-amber-800">➔</span>
                <div className="bg-purple-100 border border-purple-300 px-3 py-2 rounded-xl w-full sm:w-auto">
                  Menjaga Keseimbangan Hak & Kewajiban
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-white">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                  4 Norma Utama:
                </span>
                <ul className="text-xs font-semibold text-slate-800 space-y-1.5">
                  <li className="flex items-center gap-2">👉 <strong>Norma Agama</strong> (Ajaran Tuhan YME)</li>
                  <li className="flex items-center gap-2">👉 <strong>Norma Kesusilaan</strong> (Hati Nurani & Kejujuran)</li>
                  <li className="flex items-center gap-2">👉 <strong>Norma Kesopanan</strong> (Tata Krama Pergaulan)</li>
                  <li className="flex items-center gap-2">👉 <strong>Norma Hukum</strong> (Peraturan Resmi Negara)</li>
                </ul>
              </div>

              <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-white">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                  Aksi Nyata Sehari-hari:
                </span>
                <ul className="text-xs font-semibold text-slate-800 space-y-1.5">
                  <li className="flex items-center gap-2">👉 <strong>Pahami</strong> norma-norma di sekitarmu</li>
                  <li className="flex items-center gap-2">👉 <strong>Laksanakan</strong> hak dengan bijak</li>
                  <li className="flex items-center gap-2">👉 <strong>Jalankan</strong> kewajiban dengan sungguh-sungguh</li>
                  <li className="flex items-center gap-2">👉 <strong>Biasakan</strong> musyawarah mufakat</li>
                </ul>
              </div>
            </div>

            <div className="mt-5 p-4 rounded-2xl bg-white/70 border border-white text-xs font-medium text-slate-900 leading-relaxed text-center sm:text-left">
              Materi ini pada akhirnya mengajarkan kita untuk menjadi anggota keluarga dan warga sekolah yang <strong>tertib, bertanggung jawab, menghargai orang lain, serta mampu bekerja sama</strong>.
            </div>
          </section>
        )}

        {/* INTERACTIVE MINI QUIZ REVIEW */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                📝
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Uji Ingatan Kilat (Kuis Singkat Rangkuman)
                </h3>
                <p className="text-xs text-slate-500">
                  Coba jawab 3 pertanyaan cepat berikut untuk mengetes pemahamanmu terhadap rangkuman di atas.
                </p>
              </div>
            </div>

            {quizSubmitted && (
              <button
                type="button"
                onClick={() => {
                  setQuizAnswer({});
                  setQuizSubmitted(false);
                }}
                className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                Ulangi Kuis
              </button>
            )}
          </div>

          <div className="space-y-4 mt-6">
            {miniQuiz.map((item, qIdx) => {
              const selected = quizAnswer[qIdx];
              const isCorrect = selected === item.correct;

              return (
                <div key={qIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-bold text-slate-900 mb-3">
                    {qIdx + 1}. {item.q}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.options.map((opt, optIdx) => {
                      const isSelected = selected === optIdx;
                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                      if (quizSubmitted) {
                        if (optIdx === item.correct) {
                          btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-100 border-rose-400 text-rose-950 line-through';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-blue-100 border-blue-400 text-blue-900 font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() => setQuizAnswer((prev) => ({ ...prev, [qIdx]: optIdx }))}
                          className={`p-3 rounded-xl border text-left text-xs transition-colors cursor-pointer ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className={`mt-3 p-2.5 rounded-xl text-xs font-medium ${
                      isCorrect ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'
                    }`}>
                      {isCorrect ? '✓ Tepat sekali!' : '✕ Belum tepat.'} {item.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              {Object.keys(quizAnswer).length} dari 3 pertanyaan telah dijawab
            </span>

            {!quizSubmitted ? (
              <button
                type="button"
                disabled={Object.keys(quizAnswer).length === 0}
                onClick={() => setQuizSubmitted(true)}
                className="px-5 py-2.5 bg-[#6BCB77] hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-xs"
              >
                ✓ Periksa Jawaban
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onStartMission?.('act_1_2')}
                className="px-5 py-2.5 bg-[#4D96FF] hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>Lanjut ke Aktivitas Interaktif Lumi</span>
                <span>➔</span>
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
