import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ArrowLeft, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Scale, 
  ShieldCheck, 
  HeartHandshake, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw,
  Sparkles,
  Award,
  HelpCircle,
  Eye,
  Tv
} from 'lucide-react';
import { storageService } from '../../../services/storageService';

interface TutorialViewProps {
  onBackToDashboard: () => void;
  onNavigateTab: (tab: string) => void;
}

interface TopicData {
  id: string;
  title: string;
  tagline: string;
  objectives: string[];
  intro: {
    title: string;
    description: string;
    whyImportant: string;
  };
  realSituation: {
    title: string;
    story: string;
    questionPrompt: string;
    hint: string;
  };
  cards: {
    title: string;
    source: string;
    definition: string;
    example: string;
    sanction: string;
    bgAccent: string;
    textColor: string;
  }[];
  hotspots: {
    id: string;
    title: string;
    location: string;
    norma: string;
    description: string;
  }[];
  accordions: {
    title: string;
    content: string;
  }[];
  examples: {
    situation: string;
    normaType: string;
    rightAction: string;
    wrongAction: string;
  }[];
  checkpoint: {
    question: string;
    options: {
      text: string;
      isCorrect: boolean;
      feedback: string;
    }[];
  };
  summary: {
    points: string[];
    reflection: string;
  };
}

const TUTORIAL_TOPICS: TopicData[] = [
  {
    id: 'norma-dasar',
    title: 'Mengenal 4 Macam Norma',
    tagline: 'Memahami pedoman perilaku: Norma Agama, Kesusilaan, Kesopanan, dan Hukum.',
    objectives: [
      'Mengetahui pengertian norma dan alasan mengapa norma sangat dibutuhkan dalam kehidupan sehari-hari.',
      'Mengidentifikasi 4 macam norma: agama, kesusilaan, kesopanan, dan hukum.',
      'Memahami sumber norma dan sanksi dari masing-masing norma.',
      'Menerapkan contoh nyata perilaku menaati norma di lingkungan rumah dan sekolah.'
    ],
    intro: {
      title: 'Mengapa Kita Membutuhkan Norma?',
      description: 'Bayangkan jika di jalan raya tidak ada lampu lalu lintas, atau di sekolah semua siswa masuk dan pulang sesuka hati tanpa jadwal. Apa yang akan terjadi? Kehidupan pasti menjadi kacau, tidak tertib, dan tidak aman.',
      whyImportant: 'Norma hadir sebagai pedoman, petunjuk, dan rambu-rambu agar setiap orang tahu mana yang boleh dilakukan dan mana yang harus dihindari demi kedamaian bersama.'
    },
    realSituation: {
      title: 'Situasi Nyata: Di Halaman Sekolah Pada Waktu Istirahat',
      story: 'Bel istirahat berbunyi nyaring. Raka dan teman-temannya berlari ke kantin. Di dekat tangga, Doni melihat dompet kecil berwarna biru terjatuh tanpa pemilik di dekat pot bunga. Tidak ada seorang pun yang melihat Doni mengambilnya.',
      questionPrompt: 'Menurut hatimu, norma apa saja yang sedang berbicara kepada Doni saat itu?',
      hint: 'Hati nurani Doni berbisik untuk jujur (Norma Kesusilaan), ajaran agamanya melarang mengambil hak orang lain (Norma Agama), dan aturan sekolah mewajibkan mengembalikan barang temuan ke guru (Norma Hukum/Tata Tertib).'
    },
    cards: [
      {
        title: 'Norma Agama',
        source: 'Wahyu Tuhan Yang Maha Esa',
        definition: 'Pedoman hidup manusia yang bersumber dari firman atau wahyu Tuhan.',
        example: 'Menjalankan ibadah tepat waktu, berdoa sebelum belajar, saling menyayangi sesama.',
        sanction: 'Dosa dan penyesalan di hadapan Tuhan Yang Maha Kuasa.',
        bgAccent: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        textColor: 'text-emerald-700'
      },
      {
        title: 'Norma Kesusilaan',
        source: 'Hati Nurani Manusia',
        definition: 'Aturan hidup yang bersumber dari bisikan hati nurani tentang kebaikan dan kebenaran.',
        example: 'Berkata jujur kepada orang tua, tidak menyontek saat ujian, menolong yang kesusahan.',
        sanction: 'Rasa bersalah, gelisah batin, malu pada diri sendiri, dan penyesalan mendalam.',
        bgAccent: 'bg-blue-50 border-blue-200 text-blue-900',
        textColor: 'text-blue-700'
      },
      {
        title: 'Norma Kesopanan',
        source: 'Tata Krama & Adat Kebiasaan Pergaulan',
        definition: 'Pedoman pergaulan yang disepakati oleh masyarakat setempat mengenai kepantasan bertingkah laku.',
        example: 'Mencium tangan orang tua saat berpamitan, mengucapkan salam kepada guru, tidak menyela orang bicara.',
        sanction: 'Teguran lisan, celaan, dicemooh, atau dijauhi dalam pergaulan sosial.',
        bgAccent: 'bg-amber-50 border-amber-200 text-amber-900',
        textColor: 'text-amber-700'
      },
      {
        title: 'Norma Hukum',
        source: 'Lembaga Resmi Pemerintah / Negara',
        definition: 'Aturan resmi yang tertulis, dibuat oleh badan yang berwenang, dan memiliki sifat mengikat serta memaksa.',
        example: 'Memakai helm saat naik motor, mematuhi rambu lalu lintas, menaati tata tertib resmi sekolah.',
        sanction: 'Tegas dan nyata berupa denda, skorsing, atau hukuman sesuai aturan perundang-undangan.',
        bgAccent: 'bg-rose-50 border-rose-200 text-rose-900',
        textColor: 'text-rose-700'
      }
    ],
    hotspots: [
      {
        id: 'hs1',
        title: 'Gerbang Sekolah di Pagi Hari',
        location: 'Pintu Gerbang',
        norma: 'Norma Kesopanan & Hukum',
        description: 'Siswa tiba sebelum pukul 07.00 (Norma Hukum/Tata Tertib) lalu membungkuk dan memberi salam kepada bapak/ibu guru yang menyambut (Norma Kesopanan).'
      },
      {
        id: 'hs2',
        title: 'Ruang Ujian Kelas',
        location: 'Meja Belajar',
        norma: 'Norma Kesusilaan',
        description: 'Mengerjakan lembar soal sendiri tanpa melirik lembar jawaban teman. Suara hati nurani menolak perbuatan curang demi menjaga integritas diri.'
      },
      {
        id: 'hs3',
        title: 'Mushola / Tempat Ibadah Sekolah',
        location: 'Tempat Doa Bersama',
        norma: 'Norma Agama',
        description: 'Siswa berdoa dengan khusyuk sebelum mulai belajar dan menghargai teman yang beribadah sesuai keyakinan masing-masing.'
      }
    ],
    accordions: [
      {
        title: 'Apa perbedaan mendasar antara Norma Kesopanan dan Norma Kesusilaan?',
        content: 'Norma Kesusilaan bersumber dari bisikan batin hati nurani kita sendiri yang bersifat universal bagi seluruh manusia (contoh: kejujuran). Sedangkan Norma Kesopanan bersumber dari kebiasaan tata krama masyarakat yang bisa berbeda-beda di setiap daerah (contoh: cara menyapa, cara makan, dan pakaian adat).'
      },
      {
        title: 'Mengapa Norma Hukum disebut paling tegas?',
        content: 'Karena norma hukum memiliki sanksi yang nyata, tertulis, dan ditegakkan oleh aparat yang berwenang seperti polisi, hakim, atau petugas ketertiban sekolah. Orang yang melanggar tidak hanya merasa bersalah secara batin, melainkan menerima hukuman konkret seperti denda atau sanksi disiplin.'
      }
    ],
    examples: [
      {
        situation: 'Mengetuk pintu dan mengucapkan salam sebelum masuk ke ruang guru.',
        normaType: 'Norma Kesopanan',
        rightAction: 'Mengetuk 3 kali dengan sopan dan memberi salam.',
        wrongAction: 'Langsung membuka pintu dan berteriak memanggil guru.'
      },
      {
        situation: 'Menemukan uang sisa belanja milik ibu di atas meja makan.',
        normaType: 'Norma Kesusilaan & Agama',
        rightAction: 'Mengembalikan sisa uang belanja kepada ibu dengan jujur.',
        wrongAction: 'Memasukkan sisa uang ke kantong sendiri secara diam-diam.'
      },
      {
        situation: 'Menyeberang jalan raya di depan gerbang sekolah.',
        normaType: 'Norma Hukum',
        rightAction: 'Menyeberang melalui zebra cross atau jembatan penyeberangan saat kendaraan berhenti.',
        wrongAction: 'Lari sembarangan memotong jalan di antara mobil yang melaju.'
      }
    ],
    checkpoint: {
      question: 'Sikap berpamitan dan mencium tangan kedua orang tua sebelum berangkat ke sekolah merupakan wujud pengamalan dari...',
      options: [
        {
          text: 'Norma Kesopanan dalam lingkungan keluarga',
          isCorrect: true,
          feedback: 'Hebat, jawabanmu benar! Mencium tangan orang tua adalah wujud tata krama dan kesantunan yang diajarkan dalam keluarga.'
        },
        {
          text: 'Norma Hukum pidana negara',
          isCorrect: false,
          feedback: 'Belum tepat. Berpamitan bukan aturan hukum pidana negara, melainkan kebiasaan santun dalam pergaulan keluarga (Norma Kesopanan).'
        },
        {
          text: 'Norma Kesusilaan yang berlaku di pengadilan',
          isCorrect: false,
          feedback: 'Kurang tepat. Pengadilan mengadili norma hukum, sedangkan pamit kepada orang tua adalah norma kesopanan adat pergaulan.'
        }
      ]
    },
    summary: {
      points: [
        'Norma adalah aturan atau pedoman tingkah laku demi mewujudkan ketertiban dan keadilan.',
        'Ada 4 norma utama: Agama (wahyu Tuhan), Kesusilaan (hati nurani), Kesopanan (tata krama masyarakat), dan Hukum (lembaga resmi negara).',
        'Sanksi norma hukum adalah yang paling tegas dan dapat dipaksakan oleh aparat.',
        'Menaati norma dimulai dari diri sendiri di lingkungan rumah, sekolah, dan masyarakat luas.'
      ],
      reflection: 'Setelah mempelajari macam-macam norma, norma mana yang sudah paling rutin kamu amalkan setiap hari, dan norma mana yang masih perlu kamu tingkatkan?'
    }
  },
  {
    id: 'hak-kewajiban',
    title: 'Hak dan Kewajiban yang Seimbang',
    tagline: 'Memahami bahwa setiap hak yang kita miliki selalu diiringi dengan kewajiban yang harus ditunaikan.',
    objectives: [
      'Memahami makna hak sebagai sesuatu yang patut kita peroleh.',
      'Memahami makna kewajiban sebagai amanah yang wajib kita laksanakan dengan tanggung jawab.',
      'Membedakan hak dan kewajiban di lingkungan rumah serta sekolah.',
      'Membiasakan diri melaksanakan kewajiban terlebih dahulu sebelum menuntut hak.'
    ],
    intro: {
      title: 'Dua Sisi Mata Uang Kehidupan',
      description: 'Hak dan kewajiban ibarat dua roda sepeda. Jika satu roda tidak berputar seimbang, sepeda tidak akan bisa melaju ke depan. Di mana pun kita berada, kita memiliki hak yang dilindungi dan kewajiban yang harus dipenuhi.',
      whyImportant: 'Jika seseorang hanya menuntut hak tanpa mau menunaikan kewajiban, kehidupan bersama akan penuh perselisihan dan ketidakadilan.'
    },
    realSituation: {
      title: 'Situasi Nyata: Giliran Piket Kelas di Hari Selasa',
      story: 'Siti ingin menikmati ruang kelas yang bersih, sejuk, dan rapi saat belajar matematika (Hak Siswa). Namun hari ini adalah jadwal kelompok piketnya untuk menyapu lantai dan merapikan papan tulis bersama Made dan Budi.',
      questionPrompt: 'Apa yang harus dilakukan Siti agar haknya dan hak teman-temannya terpenuhi secara adil?',
      hint: 'Siti harus melaksanakan kewajibannya piket dengan sungguh-sungguh terlebih dahulu. Setelah kewajiban tuntas, hak belajar di kelas yang bersih dinikmati bersama.'
    },
    cards: [
      {
        title: 'Hak Anak di Rumah',
        source: 'Kasih Sayang Keluarga',
        definition: 'Segala hal baik yang berhak diperoleh anak dari orang tua untuk tumbuh kembangnya.',
        example: 'Mendapat kasih sayang, perlindungan, makanan bergizi, dan ruang istirahat yang aman.',
        sanction: 'Orang tua yang menelantarkan anak dapat ditegur oleh hukum perlindungan anak.',
        bgAccent: 'bg-indigo-50 border-indigo-200 text-indigo-900',
        textColor: 'text-indigo-700'
      },
      {
        title: 'Kewajiban Anak di Rumah',
        source: 'Tanggung Jawab Anggota Keluarga',
        definition: 'Tugas dan perbuatan yang wajib dikerjakan anak demi keharmonisan rumah tangga.',
        example: 'Menghormati orang tua, merapikan tempat tidur sendiri, dan belajar dengan tekun.',
        sanction: 'Teguran kasih sayang dari orang tua dan berkurangnya kepercayaan keluarga.',
        bgAccent: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        textColor: 'text-emerald-700'
      },
      {
        title: 'Hak Siswa di Sekolah',
        source: 'Peraturan Pendidikan',
        definition: 'Fasilitas dan layanan pendidikan yang berhak diterima seluruh murid tanpa diskriminasi.',
        example: 'Mendapat bimbingan guru, meminjam buku perpustakaan, bermain aman saat istirahat.',
        sanction: 'Sekolah wajib menjamin seluruh siswa terlayani dengan adil.',
        bgAccent: 'bg-amber-50 border-amber-200 text-amber-900',
        textColor: 'text-amber-700'
      },
      {
        title: 'Kewajiban Siswa di Sekolah',
        source: 'Tata Tertib Sekolah',
        definition: 'Tanggung jawab yang harus dilaksanakan oleh setiap siswa di lingkungan sekolah.',
        example: 'Datang tepat waktu, mendengarkan penjelasan guru, menjaga kebersihan meja kelas.',
        sanction: 'Catatan kedisiplinan dan pembinaan dari wali kelas atau guru BK.',
        bgAccent: 'bg-purple-50 border-purple-200 text-purple-900',
        textColor: 'text-purple-700'
      }
    ],
    hotspots: [
      {
        id: 'hs_lib',
        title: 'Perpustakaan Sekolah',
        location: 'Ruang Baca',
        norma: 'Keseimbangan Hak & Kewajiban',
        description: 'Siswa berhak membaca buku apa pun yang disukai (Hak), tetapi berkewajiban merawat buku dan tidak berisik di dalam perpustakaan (Kewajiban).'
      },
      {
        id: 'hs_canteen',
        title: 'Kantin Sekolah',
        location: 'Meja Makan Kantin',
        norma: 'Tanggung Jawab Bersama',
        description: 'Siswa berhak membeli makanan sehat (Hak), berkewajiban mengantre dengan tertib dan membuang bungkus makanan ke tempat sampah (Kewajiban).'
      }
    ],
    accordions: [
      {
        title: 'Mengapa kewajiban harus didahulukan daripada hak?',
        content: 'Karena hak kita sering kali lahir dari kewajiban orang lain, dan hak orang lain lahir dari kewajiban kita. Jika semua orang menanti diberi hak tanpa mau menunaikan kewajiban, tidak ada hak yang pernah terwujud.'
      }
    ],
    examples: [
      {
        situation: 'Menggunakan seragam sekolah yang bersih dan lengkap sesuai jadwal hari Senin.',
        normaType: 'Kewajiban Siswa di Sekolah',
        rightAction: 'Mengenakan seragam rapi lengkap dengan dasi dan topi upacara.',
        wrongAction: 'Menggunakan pakaian bebas karena malas memakai atribut lengkap.'
      }
    ],
    checkpoint: {
      question: 'Manakah dari pernyataan berikut yang merupakan contoh pemenuhan kewajiban di lingkungan rumah?',
      options: [
        {
          text: 'Membantu orang tua membersihkan meja setelah makan bersama',
          isCorrect: true,
          feedback: 'Tepat sekali! Meringankan pekerjaan orang tua adalah kewajiban mulia anak di rumah.'
        },
        {
          text: 'Menuntut uang saku lebih besar tanpa mau belajar',
          isCorrect: false,
          feedback: 'Kurang tepat. Ini adalah tuntutan hak yang tidak diimbangi dengan kewajiban berbakti.'
        },
        {
          text: 'Bermain game sampai larut malam tanpa merapikan buku pelajaran',
          isCorrect: false,
          feedback: 'Belum tepat. Sikap tersebut melalaikan kewajiban menjaga kesehatan dan belajar.'
        }
      ]
    },
    summary: {
      points: [
        'Hak adalah sesuatu yang mutlak menjadi milik kita, sedangkan kewajiban adalah sesuatu yang harus kita laksanakan.',
        'Pelaksanaan hak dan kewajiban harus seimbang dan selaras.',
        'Di rumah dan sekolah, anak memiliki peran aktif sebagai anggota keluarga dan warga sekolah yang bertanggung jawab.'
      ],
      reflection: 'Apakah kamu sudah melaksanakan kewajiban harianmu di rumah sebelum meminta waktu untuk bermain?'
    }
  }
];

export const TutorialView: React.FC<TutorialViewProps> = ({ onBackToDashboard, onNavigateTab }) => {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [activeCardId, setActiveCardId] = useState<number>(0);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const topic = TUTORIAL_TOPICS[selectedTopicIndex];
  const totalStages = 7;

  // Load saved tutorial progress
  useEffect(() => {
    const saved = storageService.getTutorialProgress();
    if (saved[topic.id]) {
      // resume capability
      setCurrentStage(Math.min(saved[topic.id], totalStages));
    } else {
      setCurrentStage(1);
    }
  }, [selectedTopicIndex, topic.id]);

  // Audio Speech Synthesis for interactive audio-visual learning
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleNextStage = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (currentStage < totalStages) {
      const next = currentStage + 1;
      setCurrentStage(next);
      storageService.saveTutorialProgress(topic.id, next);
    }
  };

  const handlePrevStage = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  const stageNames = [
    'Pengenalan',
    'Tujuan Belajar',
    'Situasi Nyata',
    'Materi & Visual',
    'Contoh Perilaku',
    'Cek Pemahaman',
    'Rangkuman'
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Bar Header */}
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
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
                Tutorial Pembelajaran Mandiri
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Pendidikan Pancasila: Norma dalam Kehidupanku
              </p>
            </div>
          </div>
        </div>

        {/* Topic Switcher Pills */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {TUTORIAL_TOPICS.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setSelectedTopicIndex(idx);
                setSelectedAnswer(null);
                setSelectedHotspot(null);
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedTopicIndex === idx
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Indicator Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs mb-8">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-600 mb-2.5">
          <span className="flex items-center gap-1.5 text-indigo-700">
            <Sparkles className="w-4 h-4" />
            Tahap {currentStage} dari {totalStages}: {stageNames[currentStage - 1]}
          </span>
          <span className="font-mono tabular-nums text-slate-500">
            {Math.round((currentStage / totalStages) * 100)}% Selesai
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${(currentStage / totalStages) * 100}%` }}
          />
        </div>

        {/* Stage dots */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-3 pt-3 border-t border-slate-100">
          {stageNames.map((name, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < currentStage;
            const isCurrent = stepNum === currentStage;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentStage(stepNum)}
                className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer text-[11px] sm:text-xs font-semibold truncate ${
                  isCurrent
                    ? 'bg-indigo-600 text-white font-bold'
                    : isCompleted
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-400 hover:bg-slate-50'
                }`}
                title={name}
              >
                {stepNum}. {name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Stage Content Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 mb-8 min-h-[420px] flex flex-col justify-between">
        {/* STAGE 1: INTRODUCTION */}
        {currentStage === 1 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg uppercase tracking-wider mb-2">
                  Tahap 1: Pengenalan Materi
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                  {topic.intro.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => speakText(`${topic.intro.title}. ${topic.intro.description} ${topic.intro.whyImportant}`)}
                className={`p-3 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                  isSpeaking
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
                title={isSpeaking ? 'Hentikan Audio' : 'Dengarkan Penjelasan'}
              >
                {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-base sm:text-lg text-slate-700 leading-relaxed">
              {topic.intro.description}
            </div>

            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base text-amber-900 mb-1">
                  Mengapa Norma Begitu Penting?
                </h4>
                <p className="text-sm sm:text-base text-amber-800 leading-relaxed">
                  {topic.intro.whyImportant}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: LEARNING OBJECTIVES */}
        {currentStage === 2 && (
          <div className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg uppercase tracking-wider mb-2">
                Tahap 2: Tujuan Pembelajaran
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Apa yang Akan Kamu Kuasai?
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Berikut adalah kompetensi yang akan kamu capai setelah menyelesaikan tutorial ini:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topic.objectives.map((obj, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5 hover:border-emerald-300 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-sm">
                    {i + 1}
                  </div>
                  <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
                    {obj}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 text-sm text-indigo-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Belajarlah secara mandiri sesuai kecepatanmu sendiri. Kamu bisa mengulang setiap bagian kapan saja!</span>
            </div>
          </div>
        )}

        {/* STAGE 3: REAL-LIFE SITUATION */}
        {currentStage === 3 && (
          <div className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg uppercase tracking-wider mb-2">
                Tahap 3: Situasi Nyata Sehari-hari
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                {topic.realSituation.title}
              </h2>
            </div>

            <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 leading-relaxed text-base sm:text-lg">
              <p className="italic text-slate-200">
                "{topic.realSituation.story}"
              </p>
            </div>

            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200 space-y-3">
              <h4 className="font-bold text-base text-blue-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <span>Pertanyaan Pemantik:</span>
              </h4>
              <p className="text-base text-blue-800 font-medium">
                {topic.realSituation.questionPrompt}
              </p>
              <div className="pt-2 border-t border-blue-200 text-sm text-blue-700">
                <span className="font-bold">Ulasan Pedagogis: </span>
                {topic.realSituation.hint}
              </div>
            </div>
          </div>
        )}

        {/* STAGE 4: LEARNING MATERIAL (CARDS + HOTSPOTS + ACCORDIONS) */}
        {currentStage === 4 && (
          <div className="space-y-8">
            <div>
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg uppercase tracking-wider mb-2">
                Tahap 4: Eksplorasi Materi & Laboratorium Visual
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Klik Setiap Kartu untuk Membuka Penjelasan
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Pelajari rincian sumber norma, definisi, contoh pengamalan, dan sanksi tegasnya:
              </p>
            </div>

            {/* Interactive Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topic.cards.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveCardId(idx)}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    activeCardId === idx
                      ? `${c.bgAccent} ring-2 ring-indigo-500 shadow-md`
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block mb-1 text-slate-400">
                      Pilar {idx + 1}
                    </span>
                    <h3 className={`font-display text-lg font-bold mb-2 ${activeCardId === idx ? c.textColor : 'text-slate-900'}`}>
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {c.definition}
                    </p>
                  </div>
                  <span className="mt-4 text-xs font-bold text-indigo-600 block">
                    {activeCardId === idx ? 'Sedang Ditampilkan' : 'Klik untuk Rincian'}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Card Deep Dive */}
            {topic.cards[activeCardId] && (
              <div className={`p-6 rounded-2xl border ${topic.cards[activeCardId].bgAccent} space-y-4`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    {topic.cards[activeCardId].title}
                  </h3>
                  <span className="text-xs font-bold px-3 py-1 bg-white/80 rounded-md border border-slate-200 text-slate-700">
                    Sumber: {topic.cards[activeCardId].source}
                  </span>
                </div>
                <p className="text-base text-slate-800 leading-relaxed">
                  {topic.cards[activeCardId].definition}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-white/90 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                      Contoh Nyata Sehari-hari:
                    </span>
                    <p className="text-sm text-slate-700">
                      {topic.cards[activeCardId].example}
                    </p>
                  </div>
                  <div className="p-4 bg-white/90 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block mb-1">
                      Bentuk Sanksi Pelanggaran:
                    </span>
                    <p className="text-sm text-slate-700">
                      {topic.cards[activeCardId].sanction}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Visual Hotspots Section */}
            {topic.hotspots && topic.hotspots.length > 0 && (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-indigo-600" />
                  <h4 className="font-display text-lg font-bold text-slate-900">
                    Image Hotspot: Titik Penerapan di Lingkungan Sekolah
                  </h4>
                </div>
                <p className="text-sm text-slate-600">
                  Klik titik lokasi di bawah ini untuk melihat norma apa yang wajib diterapkan:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {topic.hotspots.map((hs) => (
                    <button
                      key={hs.id}
                      type="button"
                      onClick={() => setSelectedHotspot(hs.id)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedHotspot === hs.id
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider block opacity-75">
                        {hs.location}
                      </span>
                      <span className="font-bold text-sm block mt-0.5">
                        {hs.title}
                      </span>
                    </button>
                  ))}
                </div>

                {selectedHotspot && (
                  <div className="p-4 bg-white rounded-xl border border-indigo-200 text-slate-800 text-sm">
                    {(() => {
                      const found = topic.hotspots.find(h => h.id === selectedHotspot);
                      if (!found) return null;
                      return (
                        <>
                          <div className="font-bold text-indigo-700 mb-1">
                            Norma yang Berlaku: {found.norma}
                          </div>
                          <p>{found.description}</p>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* Accordions for extra insights */}
            {topic.accordions && topic.accordions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-base text-slate-900">
                  Materi Tambahan & Tanya Jawab:
                </h4>
                {topic.accordions.map((acc, aIdx) => (
                  <div
                    key={aIdx}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenAccordion(openAccordion === aIdx ? null : aIdx)}
                      className="w-full p-4 flex items-center justify-between text-left font-bold text-sm sm:text-base text-slate-800 hover:bg-slate-50 cursor-pointer"
                    >
                      <span>{acc.title}</span>
                      {openAccordion === aIdx ? (
                        <ChevronUp className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    {openAccordion === aIdx && (
                      <div className="p-4 bg-slate-50 text-sm sm:text-base text-slate-700 border-t border-slate-100 leading-relaxed">
                        {acc.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STAGE 5: EXAMPLES */}
        {currentStage === 5 && (
          <div className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg uppercase tracking-wider mb-2">
                Tahap 5: Contoh Perilaku Konkret
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Penerapan Norma vs Tindakan yang Keliru
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Bandingkan tindakan yang sesuai dengan norma dan tindakan yang harus kita hindari:
              </p>
            </div>

            <div className="space-y-4">
              {topic.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{ex.situation}</span>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                      {ex.normaType}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-emerald-900 block">Tindakan Tepat:</span>
                        <p className="text-sm text-emerald-800 mt-0.5">{ex.rightAction}</p>
                      </div>
                    </div>
                    <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 flex items-start gap-2.5">
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-rose-900 block">Tindakan yang Dihindari:</span>
                        <p className="text-sm text-rose-800 mt-0.5">{ex.wrongAction}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 6: INTERACTIVE CHECKPOINT */}
        {currentStage === 6 && (
          <div className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 bg-violet-50 text-violet-700 text-xs font-bold rounded-lg uppercase tracking-wider mb-2">
                Tahap 6: Cek Pemahaman Mandiri
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Uji Pemahaman Cepat
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Pilih jawaban yang paling tepat untuk menguji apa yang sudah kamu pelajari:
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="font-display text-lg font-bold text-slate-900 mb-4">
                {topic.checkpoint.question}
              </h3>

              <div className="space-y-3">
                {topic.checkpoint.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswer === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => setSelectedAnswer(oIdx)}
                      className={`w-full p-4 rounded-xl border text-left font-medium text-sm sm:text-base transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200 font-bold'
                            : 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-200 font-bold'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {isSelected && (
                        <span>
                          {opt.isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-600" />
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <div className={`mt-5 p-4 rounded-xl border text-sm leading-relaxed ${
                  topic.checkpoint.options[selectedAnswer].isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <span className="font-bold block mb-1">
                    {topic.checkpoint.options[selectedAnswer].isCorrect ? 'Benar!' : 'Catatan Pembelajaran:'}
                  </span>
                  {topic.checkpoint.options[selectedAnswer].feedback}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STAGE 7: SUMMARY & REFLECTION */}
        {currentStage === 7 && (
          <div className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg uppercase tracking-wider mb-2">
                Tahap 7: Rangkuman & Refleksi Belajar
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Selamat! Kamu Telah Menuntaskan Tutorial Ini
              </h2>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-base text-slate-900">
                Poin Kunci yang Harus Diingat:
              </h4>
              <ul className="space-y-2 text-sm sm:text-base text-slate-700">
                {topic.summary.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-200 space-y-2">
              <h4 className="font-bold text-base text-indigo-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>Pertanyaan Refleksi Diri:</span>
              </h4>
              <p className="text-sm sm:text-base text-indigo-900 leading-relaxed">
                {topic.summary.reflection}
              </p>
            </div>

            {/* Next Action Launchers */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateTab('practical')}
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Lanjut ke Aktivitas Practical</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('drill-game')}
                className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Uji di Drill & Game</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons (Next / Prev) */}
        <div className="pt-8 mt-8 border-t border-slate-200 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrevStage}
            disabled={currentStage === 1}
            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              currentStage === 1
                ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          <span className="text-xs sm:text-sm font-semibold text-slate-500">
            Halaman {currentStage} / {totalStages}
          </span>

          {currentStage < totalStages ? (
            <button
              type="button"
              onClick={handleNextStage}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-2"
            >
              <span>Selanjutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setCurrentStage(1);
                setSelectedAnswer(null);
              }}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Tutorial</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
