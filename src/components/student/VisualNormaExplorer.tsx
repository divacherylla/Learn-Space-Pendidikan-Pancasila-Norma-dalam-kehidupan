import React, { useState } from 'react';
import { 
  Compass, 
  HeartHandshake, 
  Users, 
  Scale, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { audioService } from '../../services/audioService';

export interface NormaVisualCard {
  id: string;
  name: string;
  category: string;
  visualTitle: string;
  visualDescription: string;
  altText: string;
  examples: string[];
  source: string;
  sanction: string;
  audioNarration: string;
  colorClass: string;
  badgeClass: string;
  icon: React.ElementType;
  illustrationSvg: React.ReactNode;
  caseStudy: {
    question: string;
    actionA: string;
    actionB: string;
    correctAction: 'A' | 'B';
    explanation: string;
  };
}

export const NORMA_VISUAL_CARDS: NormaVisualCard[] = [
  {
    id: 'norma_agama',
    name: 'Norma Agama',
    category: 'Wahyu & Keimanan',
    visualTitle: 'Melaksanakan Ibadah & Berdoa',
    visualDescription: 'Anak sedang beribadah dengan khusyuk sesuai keyakinannya dan saling menghormati pemeluk agama lain.',
    altText: 'Ilustrasi siswa sedang berdoa dan melaksanakan ibadah dengan khusyuk sesuai keyakinannya',
    examples: [
      'Beribadah sesuai agama dan kepercayaan masing-masing.',
      'Berdoa dengan khusyuk sebelum dan sesudah belajar.',
      'Menghormati teman yang sedang melaksanakan ibadah.',
    ],
    source: 'Wahyu Tuhan Yang Maha Esa yang termaktub dalam kitab suci masing-masing agama.',
    sanction: 'Sanksi bersifat batiniah di hadapan Tuhan Yang Maha Esa dan pertanggungjawaban di akhirat.',
    audioNarration: 'Norma Agama adalah aturan hidup yang bersumber dari wahyu Tuhan Yang Maha Esa. Contohnya adalah beribadah sesuai keyakinan, berdoa sebelum belajar, dan menghormati orang yang sedang beribadah.',
    colorClass: 'border-emerald-200 bg-emerald-50/70 text-emerald-950',
    badgeClass: 'bg-emerald-600 text-white',
    icon: Compass,
    illustrationSvg: (
      <svg viewBox="0 0 400 240" className="w-full h-full object-cover rounded-xl" aria-label="Ilustrasi Norma Agama">
        <rect width="400" height="240" fill="#E8F5E9" />
        {/* Sun & Light Rays */}
        <circle cx="200" cy="50" r="30" fill="#FFF59D" opacity="0.8" />
        <path d="M 200 10 L 200 90 M 160 50 L 240 50 M 172 22 L 228 78 M 172 78 L 228 22" stroke="#FBC02D" strokeWidth="2" strokeDasharray="3 3" />
        {/* Soft Architecture Arch */}
        <path d="M 80 240 L 80 140 Q 200 80 320 140 L 320 240 Z" fill="#C8E6C9" opacity="0.6" />
        <path d="M 120 240 L 120 160 Q 200 110 280 160 L 280 240 Z" fill="#A5D6A7" opacity="0.7" />
        {/* Children Praying in Serenity */}
        <circle cx="160" cy="150" r="18" fill="#FFCCBC" />
        <path d="M 145 170 Q 160 165 175 170 L 175 230 L 145 230 Z" fill="#4CAF50" />
        <circle cx="240" cy="150" r="18" fill="#FFE0B2" />
        <path d="M 225 170 Q 240 165 255 170 L 255 230 L 225 230 Z" fill="#2E7D32" />
        {/* Prayer Hands */}
        <path d="M 158 178 Q 160 170 162 178" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <path d="M 238 178 Q 240 170 242 178" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        {/* Floor base */}
        <rect x="0" y="225" width="400" height="15" fill="#81C784" />
      </svg>
    ),
    caseStudy: {
      question: 'Saat sedang belajar kelompok di rumahmu, temanmu meminta izin untuk menunaikan ibadah salat atau kebaktian. Tindakan terbaikmu:',
      actionA: 'Mempersilakan teman beribadah dengan tenang dan ikut menjaga ketenangan di rumah.',
      actionB: 'Meminta teman menunda ibadahnya sampai semua tugas kelompok selesai.',
      correctAction: 'A',
      explanation: 'Menghormati dan memberi kesempatan orang lain beribadah merupakan wujud nyata penerapan norma agama dan toleransi luhur bangsa kita.',
    },
  },
  {
    id: 'norma_kesusilaan',
    name: 'Norma Kesusilaan',
    category: 'Hati Nurani Batin',
    visualTitle: 'Mengembalikan Barang Temuan & Berkata Jujur',
    visualDescription: 'Anak menemukan dompet yang terjatuh di halaman dan dengan tulus segera mengembalikannya kepada pemiliknya.',
    altText: 'Ilustrasi siswa mengembalikan barang temuan dan berkata jujur kepada guru dengan hati nurani bersih',
    examples: [
      'Berkata jujur dan tidak menyontek saat ujian.',
      'Mengakui kesalahan dengan tulus dan meminta maaf.',
      'Membantu orang lain yang membutuhkan pertolongan.',
    ],
    source: 'Hati nurani dan suara batin manusia yang jujur dan tulus.',
    sanction: 'Rasa bersalah, gelisah, malu mendalam, dan penyesalan batiniah.',
    audioNarration: 'Norma Kesusilaan bersumber dari bisikan hati nurani manusia. Contoh penerapannya adalah selalu berkata jujur, mengakui kesalahan, dan membantu orang lain tanpa pamrih.',
    colorClass: 'border-rose-200 bg-rose-50/70 text-rose-950',
    badgeClass: 'bg-rose-600 text-white',
    icon: HeartHandshake,
    illustrationSvg: (
      <svg viewBox="0 0 400 240" className="w-full h-full object-cover rounded-xl" aria-label="Ilustrasi Norma Kesusilaan">
        <rect width="400" height="240" fill="#FFEBEE" />
        {/* School Garden Background */}
        <path d="M 0 160 Q 100 120 200 150 Q 300 110 400 160 L 400 240 L 0 240 Z" fill="#FFCDD2" opacity="0.6" />
        {/* Heart Glow Icon */}
        <circle cx="200" cy="70" r="32" fill="#EF5350" opacity="0.15" />
        <path d="M 200 60 C 190 45, 170 50, 175 70 C 180 85, 200 100, 200 100 C 200 100, 220 85, 225 70 C 230 50, 210 45, 200 60 Z" fill="#E53935" />
        {/* Child giving lost item to teacher */}
        <circle cx="150" cy="140" r="18" fill="#FFE0B2" />
        <path d="M 135 160 L 165 160 L 160 230 L 140 230 Z" fill="#3949AB" />
        {/* Teacher accepting with smile */}
        <circle cx="250" cy="130" r="20" fill="#FFCCBC" />
        <path d="M 230 155 L 270 155 L 265 235 L 235 235 Z" fill="#00897B" />
        {/* Handheld Returned Wallet */}
        <rect x="185" y="165" width="28" height="18" rx="4" fill="#6D4C41" />
        <circle cx="199" cy="174" r="3" fill="#FFD54F" />
        {/* Ground */}
        <rect x="0" y="225" width="400" height="15" fill="#EF9A9A" />
      </svg>
    ),
    caseStudy: {
      question: 'Saat sedang membersihkan laci meja kelas, kamu menemukan uang Rp10.000 milik teman yang tertinggal. Apa bisikan hati nuranimu?',
      actionA: 'Segera menyerahkan uang tersebut kepada bapak/ibu guru agar diumumkan kepada pemiliknya.',
      actionB: 'Menyimpan uang itu ke dalam saku sendiri karena tidak ada teman lain yang melihat.',
      correctAction: 'A',
      explanation: 'Menyerahkan barang temuan adalah wujud kejujuran batiniah yang menjaga ketenteraman hati nurani.',
    },
  },
  {
    id: 'norma_kesopanan',
    name: 'Norma Kesopanan',
    category: 'Adab & Tata Krama Pergaulan',
    visualTitle: 'Menyapa Guru & Mengantre dengan Tertib',
    visualDescription: 'Anak menyapa guru dengan senyum ramah, mencium tangan, serta mengantre secara tertib di kantin sekolah.',
    altText: 'Ilustrasi siswa menyapa guru dengan sopan dan membudayakan antre tertib',
    examples: [
      'Mengucapkan salam dan menyapa bapak/ibu guru dengan santun.',
      'Berbicara dengan bahasa yang sopan dan tidak kasar.',
      'Menghormati orang yang lebih tua dan menghargai teman sebaya.',
    ],
    source: 'Kebiasaan, kepatutan, dan adat istiadat pergaulan yang disepakati masyarakat.',
    sanction: 'Teguran dari orang tua atau guru, rasa canggung, dan dijauhi teman dalam pergaulan.',
    audioNarration: 'Norma Kesopanan lahir dari tata krama masyarakat. Contohnya adalah membiasakan mengucap salam, berbicara santun, serta menghormati orang yang lebih tua.',
    colorClass: 'border-amber-200 bg-amber-50/70 text-amber-950',
    badgeClass: 'bg-amber-600 text-white',
    icon: Users,
    illustrationSvg: (
      <svg viewBox="0 0 400 240" className="w-full h-full object-cover rounded-xl" aria-label="Ilustrasi Norma Kesopanan">
        <rect width="400" height="240" fill="#FFF8E1" />
        {/* School Veranda Pattern */}
        <rect x="60" y="40" width="280" height="190" rx="16" fill="#FFE082" opacity="0.4" />
        <rect x="90" y="70" width="60" height="80" rx="8" fill="#FFF" opacity="0.8" />
        <rect x="250" y="70" width="60" height="80" rx="8" fill="#FFF" opacity="0.8" />
        {/* Student greeting politely with slight bow */}
        <circle cx="160" cy="135" r="18" fill="#FFE0B2" />
        <path d="M 145 155 Q 160 160 175 155 L 170 230 L 150 230 Z" fill="#FB8C00" />
        {/* Teacher smiling and responding with warm nod */}
        <circle cx="240" cy="125" r="20" fill="#FFCCBC" />
        <path d="M 220 150 L 260 150 L 255 230 L 225 230 Z" fill="#5E35B1" />
        {/* Salam Gesture */}
        <circle cx="195" cy="165" r="8" fill="#FFE082" />
        {/* Ground */}
        <rect x="0" y="225" width="400" height="15" fill="#FFD54F" />
      </svg>
    ),
    caseStudy: {
      question: 'Saat berpapasan dengan kepala sekolah atau ibu guru di lorong sekolah, sikap terbaik yang harus kamu lakukan adalah:',
      actionA: 'Tersenyum ramah, menganggukkan kepala, dan mengucapkan salam dengan santun.',
      actionB: 'Berlari kencang melewatinya tanpa menyapa karena sedang terburu-buru main.',
      correctAction: 'A',
      explanation: 'Menyapa dengan senyum dan salam adalah budaya santun bangsa Indonesia yang mempererat tali kekeluargaan di sekolah.',
    },
  },
  {
    id: 'norma_hukum',
    name: 'Norma Hukum',
    category: 'Ketertiban Negara Resmi',
    visualTitle: 'Menyeberang di Zebra Cross & Patuh Rambu',
    visualDescription: 'Anak menyeberang jalan melalui zebra cross, mematuhi lampu lalu lintas, dan memakai helm berstandar SNI.',
    altText: 'Ilustrasi siswa menyeberang jalan raya di zebra cross dan mematuhi rambu lalu lintas bersama orang tua',
    examples: [
      'Mematuhi rambu lalu lintas dan menyeberang di zebra cross.',
      'Memakai helm SNI saat berkendara bersama orang dewasa.',
      'Mematuhi peraturan tata tertib tertulis yang berlaku di sekolah dan negara.',
    ],
    source: 'Peraturan perundang-undangan tertulis resmi yang disahkan lembaga negara berwenang.',
    sanction: 'Sanksi tegas, pasti, dan mengikat, seperti teguran tertulis, denda, hingga hukuman pidana.',
    audioNarration: 'Norma Hukum adalah pedoman perilaku tertulis resmi dari negara. Contoh penerapannya adalah mematuhi rambu lalu lintas, memakai helm SNI, dan menaati tata tertib sekolah.',
    colorClass: 'border-blue-200 bg-blue-50/70 text-blue-950',
    badgeClass: 'bg-blue-600 text-white',
    icon: Scale,
    illustrationSvg: (
      <svg viewBox="0 0 400 240" className="w-full h-full object-cover rounded-xl" aria-label="Ilustrasi Norma Hukum">
        <rect width="400" height="240" fill="#E3F2FD" />
        {/* Traffic Light Post */}
        <rect x="70" y="30" width="10" height="180" fill="#37474F" />
        <rect x="55" y="30" width="40" height="90" rx="8" fill="#263238" />
        <circle cx="75" cy="48" r="10" fill="#E53935" opacity="0.3" />
        <circle cx="75" cy="75" r="10" fill="#FDD835" opacity="0.3" />
        <circle cx="75" cy="102" r="10" fill="#43A047" /> {/* Green active */}
        {/* Road & Zebra Cross Stripes */}
        <rect x="0" y="180" width="400" height="60" fill="#455A64" />
        <rect x="140" y="190" width="30" height="40" fill="#FFFFFF" />
        <rect x="190" y="190" width="30" height="40" fill="#FFFFFF" />
        <rect x="240" y="190" width="30" height="40" fill="#FFFFFF" />
        <rect x="290" y="190" width="30" height="40" fill="#FFFFFF" />
        {/* Student with Helmet Crossing Road with Adult */}
        {/* Adult */}
        <circle cx="210" cy="120" r="18" fill="#FFCCBC" />
        <path d="M 195 102 Q 210 90 225 102 Z" fill="#1E88E5" /> {/* Helmet */}
        <path d="M 195 140 L 225 140 L 220 200 L 200 200 Z" fill="#0277BD" />
        {/* Child */}
        <circle cx="260" cy="135" r="15" fill="#FFE0B2" />
        <path d="M 248 120 Q 260 110 272 120 Z" fill="#F4511E" /> {/* Child Helmet */}
        <path d="M 248 150 L 272 150 L 268 200 L 252 200 Z" fill="#00897B" />
        {/* Holding hands */}
        <path d="M 220 155 Q 240 160 250 155" stroke="#FFE0B2" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
    caseStudy: {
      question: 'Saat lampu rambu lalu lintas berwarna merah di persimpangan jalan dan suasana tampak sepi, apa yang seharusnya dilakukan pengendara?',
      actionA: 'Tetap berhenti dengan tertib di belakang garis penyeberangan zebra cross sampai lampu menyala hijau.',
      actionB: 'Menerobos langsung karena menganggap tidak ada polisi yang berjaga.',
      correctAction: 'A',
      explanation: 'Aturan lampu lalu lintas berlaku mengikat demi menjamin keselamatan semua pengguna jalan.',
    },
  },
];

interface VisualNormaExplorerProps {
  onScoreEarned?: (scoreDelta: number) => void;
}

export const VisualNormaExplorer: React.FC<VisualNormaExplorerProps> = ({ onScoreEarned }) => {
  const [selectedCardId, setSelectedCardId] = useState<string>(NORMA_VISUAL_CARDS[0].id);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [caseAnswer, setCaseAnswer] = useState<'A' | 'B' | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const selectedCard = NORMA_VISUAL_CARDS.find((c) => c.id === selectedCardId) || NORMA_VISUAL_CARDS[0];
  const IconComponent = selectedCard.icon;

  const handleCardClick = (cardId: string) => {
    audioService.playClickTone();
    audioService.stopSpeaking();
    setIsSpeaking(false);
    setSelectedCardId(cardId);
    setCaseAnswer(null);
    setFeedback(null);
  };

  const handleListenSpeech = () => {
    audioService.playClickTone();
    if (isSpeaking) {
      audioService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      audioService.speakIndonesian(selectedCard.audioNarration, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleAnswerCase = (choice: 'A' | 'B') => {
    setCaseAnswer(choice);
    if (choice === selectedCard.caseStudy.correctAction) {
      audioService.playSuccessChime();
      setFeedback(selectedCard.caseStudy.explanation);
      onScoreEarned?.(10);
    } else {
      audioService.playIncorrectTone();
      setFeedback('Pilihan kurang tepat. Pikirkan kembali tujuan utama penegakan norma ini bagi kebaikan bersama.');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-left space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold border border-indigo-500/30 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Section Visual Khusus: Macam-Macam Norma</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Visualisasi Empat Macam Norma dalam Kehidupanku
            </h2>
            <p className="text-base text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Bedakan empat macam norma melalui ilustrasi kehidupan sehari-hari. Klik salah satu kartu di bawah ini untuk melihat contoh konkret dan penjelasan lengkapnya!
            </p>
          </div>

          <button
            type="button"
            onClick={handleListenSpeech}
            className={`px-5 py-3 rounded-xl font-bold text-base transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              isSpeaking
                ? 'bg-emerald-500 text-white shadow-lg animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
            }`}
          >
            <Volume2 className="w-5 h-5" />
            <span>{isSpeaking ? 'Hentikan Suara' : 'Dengarkan Penjelasan Suara'}</span>
          </button>
        </div>
      </div>

      {/* 2. FOUR VISUAL CARDS GRID (Matching Section 7 specifications) */}
      <div className="px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {NORMA_VISUAL_CARDS.map((card) => {
            const isSelected = card.id === selectedCardId;
            const CardIcon = card.icon;

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(card.id);
                  }
                }}
                className={`rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between p-4 group text-left ${
                  isSelected
                    ? 'border-indigo-600 bg-white ring-4 ring-indigo-500/20 shadow-lg scale-[1.02]'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div>
                  {/* Visual Illustration */}
                  <div className="h-36 w-full rounded-xl overflow-hidden mb-3 border border-slate-200 shadow-2xs">
                    {card.illustrationSvg}
                  </div>

                  {/* Header & Title */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs ${card.badgeClass}`}>
                      <CardIcon className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {card.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {card.name}
                  </h3>

                  <p className="text-sm font-semibold text-indigo-900 mt-1">
                    {card.visualTitle}
                  </p>

                  <p className="text-sm text-slate-600 mt-1 leading-snug">
                    {card.visualDescription}
                  </p>

                  {/* Concrete Examples List */}
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-1">
                    <span className="text-xs font-bold uppercase text-slate-500 block">
                      Contoh Perilaku:
                    </span>
                    <ul className="text-xs text-slate-700 space-y-1">
                      {card.examples.map((ex, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700">
                  <span>{isSelected ? 'Sedang Dipilih' : 'Klik untuk Rincian'}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Deep-Dive Detail & Interactive Case Challenge for Selected Card */}
      <div className="px-6 sm:px-8 pb-8">
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${selectedCard.badgeClass}`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                Eksplorasi Rinci
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                {selectedCard.name}: {selectedCard.visualTitle}
              </h3>
            </div>
          </div>

          {/* Source and Sanction row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <span className="text-xs font-bold uppercase text-slate-500 block mb-1">
                Sumber Norma
              </span>
              <p className="text-base text-slate-800 leading-relaxed font-semibold">
                {selectedCard.source}
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <span className="text-xs font-bold uppercase text-rose-600 block mb-1">
                Sanksi bagi Pelanggar
              </span>
              <p className="text-base text-slate-800 leading-relaxed font-semibold">
                {selectedCard.sanction}
              </p>
            </div>
          </div>

          {/* Interactive Case Study Check */}
          <div className="bg-white rounded-2xl border border-indigo-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <h4 className="text-lg font-bold text-slate-900">
                Tantangan Kasus Nyata: {selectedCard.name}
              </h4>
            </div>

            <p className="text-base text-slate-700 leading-relaxed">
              {selectedCard.caseStudy.question}
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleAnswerCase('A')}
                className={`w-full p-4 rounded-xl border text-left text-base font-semibold transition-all cursor-pointer ${
                  caseAnswer === 'A'
                    ? selectedCard.caseStudy.correctAction === 'A'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-200'
                      : 'bg-rose-50 border-rose-400 text-rose-950'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <strong>A.</strong> {selectedCard.caseStudy.actionA}
              </button>

              <button
                type="button"
                onClick={() => handleAnswerCase('B')}
                className={`w-full p-4 rounded-xl border text-left text-base font-semibold transition-all cursor-pointer ${
                  caseAnswer === 'B'
                    ? selectedCard.caseStudy.correctAction === 'B'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-200'
                      : 'bg-rose-50 border-rose-400 text-rose-950'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <strong>B.</strong> {selectedCard.caseStudy.actionB}
              </button>
            </div>

            {feedback && (
              <div
                className={`p-4 rounded-xl text-base leading-relaxed flex items-start gap-2.5 ${
                  caseAnswer === selectedCard.caseStudy.correctAction
                    ? 'bg-emerald-100/70 text-emerald-950 border border-emerald-300'
                    : 'bg-amber-100/70 text-amber-950 border border-amber-300'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-700" />
                <div>
                  <strong>{caseAnswer === selectedCard.caseStudy.correctAction ? 'Tepat Sekali!' : 'Catatan Pembelajaran:'}</strong>{' '}
                  {feedback}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
