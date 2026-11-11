import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  ChevronRight,
  Tv,
  ListVideo,
  ExternalLink,
  Check,
  RefreshCw
} from 'lucide-react';
import { audioService } from '../../services/audioService';

export interface VideoChapter {
  id: string;
  title: string;
  timeSec: number;
  timeLabel: string;
  summary: string;
}

export interface VideoCheckpoint {
  id: string;
  timeSec: number;
  timeLabel: string;
  question: string;
  options: { text: string; isCorrect: boolean; feedback: string }[];
}

export interface InteractiveVideoData {
  id: string;
  title: string;
  durationLabel: string;
  durationSec: number;
  topicBadge: string;
  description: string;
  embedUrl?: string; // Lumi Education embed iframe
  chapters: VideoChapter[];
  checkpoints: VideoCheckpoint[];
  transcript: string[];
}

export const INTERACTIVE_VIDEOS: InteractiveVideoData[] = [
  // 1. OFFICIAL LUMI EDUCATION INTERACTIVE VIDEO EMBED (Requested by user)
  {
    id: 'vid_lumi_norma',
    title: 'Video Interaktif: Norma dalam Kehidupanku',
    durationLabel: 'Interaktif Penuh',
    durationSec: 300,
    topicBadge: 'Video Pembelajaran Interaktif',
    embedUrl: 'https://app.lumi.education/api/v1/run/v3a_TC/embed',
    description: 'Video pembelajaran interaktif dengan kuis langsung. Saksikan tayangan video beranimasi, cermati penjelasan guru, dan jawab langsung pertanyaan pemahaman yang muncul di dalam video.',
    chapters: [
      { id: 'ch_lumi_1', title: 'Pengenalan Norma & Aturan Bersama', timeSec: 0, timeLabel: '00:00', summary: 'Memahami arti penting norma dalam mengatur pergaulan hidup.' },
      { id: 'ch_lumi_2', title: 'Empat Macam Norma & Contoh Nyata', timeSec: 60, timeLabel: '01:00', summary: 'Mengenal norma agama, kesusilaan, kesopanan, dan hukum.' },
      { id: 'ch_lumi_3', title: 'Kuis Refleksi Video Interaktif', timeSec: 150, timeLabel: '02:30', summary: 'Menguji ketelitian dan pemahaman moral melalui pertanyaan interaktif.' },
      { id: 'ch_lumi_4', title: 'Penerapan Norma di Kehidupan Nyata', timeSec: 240, timeLabel: '04:00', summary: 'Membiasakan perilaku terpuji di lingkungan keluarga dan sekolah.' },
    ],
    checkpoints: [
      {
        id: 'cp_lumi_1',
        timeSec: 90,
        timeLabel: '01:30',
        question: 'Ketika kamu menemukan dompet orang lain di lorong sekolah, suara hati nurani dari norma kesusilaan membimbingmu untuk...',
        options: [
          { text: 'Menyerahkannya kepada bapak/ibu guru untuk dikembalikan ke pemiliknya', isCorrect: true, feedback: 'Tepat sekali! Kejujuran adalah cerminan suara batin yang suci.' },
          { text: 'Menyimpannya diam-diam tanpa memberi tahu siapa pun', isCorrect: false, feedback: 'Kurang tepat. Mengambil barang orang lain melanggar norma kesusilaan dan norma hukum.' },
        ],
      },
    ],
    transcript: [
      'Selamat datang di video pembelajaran interaktif Norma dalam Kehidupanku.',
      'Norma adalah kaidah atau pedoman tingkah laku yang mengatur hubungan manusia dalam masyarakat.',
      'Terdapat empat norma utama: Norma Agama, Norma Kesusilaan, Norma Kesopanan, dan Norma Hukum.',
      'Simak video interaktif ini dengan saksama dan selesaikan seluruh pertanyaan yang muncul.',
    ],
  },
  // 2. SIMULASI AUDIO-VISUAL HAK & KEWAJIBAN
  {
    id: 'vid_hak_kewajiban',
    title: 'Simulasi Audio-Visual: Hak & Kewajiban Seimbang',
    durationLabel: '03:15 Menit',
    durationSec: 195,
    topicBadge: 'Studi Kasus Nyata',
    description: 'Menyelami kisah interaktif di ruang kelas: Bagaimana Raka dan kawan-kawan menyadari bahwa hak baru dapat dinikmati dengan indah setelah kewajiban ditunaikan dengan tulus.',
    chapters: [
      { id: 'ch_2_1', title: 'Suasana Kelas Bersih & Nyaman', timeSec: 0, timeLabel: '00:00', summary: 'Hak setiap siswa untuk belajar di lingkungan kelas yang bersih dan rapi.' },
      { id: 'ch_2_2', title: 'Tanggung Jawab Melaksanakan Piket', timeSec: 60, timeLabel: '01:00', summary: 'Kewajiban bergiliran menjaga kebersihan sebelum pelajaran dimulai.' },
      { id: 'ch_2_3', title: 'Dampak Jika Kewajiban Ditinggalkan', timeSec: 120, timeLabel: '02:00', summary: 'Ketika ada siswa yang menuntut hak fasilitas tetapi enggan menjalankan piket.' },
      { id: 'ch_2_4', title: 'Harmoni Hak dan Kewajiban Terwujud', timeSec: 160, timeLabel: '02:40', summary: 'Semua siswa bekerja sama dan merasakan manfaat kelas yang damai bersama.' },
    ],
    checkpoints: [
      {
        id: 'cp_2_1',
        timeSec: 120,
        timeLabel: '02:00',
        question: 'Raka ingin menikmati fasilitas komputer sekolah yang lengkap (Hak). Apa kewajiban utama Raka saat menggunakannya?',
        options: [
          { text: 'Menjaga kebersihan perangkat dan mematikan komputer dengan benar setelah selesai', isCorrect: true, feedback: 'Luar biasa! Hak memanfaatkan sarana harus diimbangi dengan kewajiban merawatnya.' },
          { text: 'Membawa pulang perlengkapan komputer tanpa izin penjaga laboratorium', isCorrect: false, feedback: 'Salah, membawa perlengkapan tanpa izin melanggar norma hukum dan tata tertib sekolah.' },
        ],
      },
    ],
    transcript: [
      'Hak adalah sesuatu yang mutlak menjadi milik kita dan penggunaannya bergantung pada diri kita.',
      'Namun ingatlah, di balik setiap hak, ada kewajiban yang harus kita penuhi terlebih dahulu dengan tulus.',
      'Di sekolah, kamu berhak mendapatkan ilmu dari guru dan menggunakan ruang kelas yang nyaman.',
      'Kewajibanmu adalah memperhatikan penjelasan guru, mengerjakan tugas dengan jujur, dan menjaga kebersihan kelas bersama teman-teman.',
      'Ketika hak dan kewajiban berjalan seimbang, terciptalah suasana belajar yang aman, tenteram, dan membahagiakan bagi semua orang.',
    ],
  },
  // 3. SIMULASI MUSYAWARAH MUFAKAT
  {
    id: 'vid_musyawarah',
    title: 'Simulasi Demokrasi Cilik: Musyawarah Menuju Mufakat',
    durationLabel: '02:50 Menit',
    durationSec: 170,
    topicBadge: 'Praktik Demokrasi Pancasila',
    description: 'Menyaksikan proses penentuan keputusan bersama di ruang kelas melalui diskusi musyawarah yang tertib, santun, dan menghargai perbedaan pendapat.',
    chapters: [
      { id: 'ch_3_1', title: 'Pentingnya Berdiskusi Bersama', timeSec: 0, timeLabel: '00:00', summary: 'Menghindari pertengkaran dan keputusan sepihak dalam kelompok.' },
      { id: 'ch_3_2', title: 'Adab Mengemukakan Pendapat', timeSec: 50, timeLabel: '00:50', summary: 'Mengangkat tangan dengan santun dan tidak memaksakan kehendak pribadi.' },
      { id: 'ch_3_3', title: 'Menerima Hasil Mufakat dengan Ikhlas', timeSec: 110, timeLabel: '01:50', summary: 'Mendukung keputusan bersama meskipun usulan pribadi tidak terpilih.' },
    ],
    checkpoints: [
      {
        id: 'cp_3_1',
        timeSec: 110,
        timeLabel: '01:50',
        question: 'Jika dalam musyawarah usulan kegiatanmu tidak terpilih karena mayoritas teman menyetujui usulan lain, sikap terbaikmu adalah...',
        options: [
          { text: 'Menerima keputusan bersama dengan lapang dada dan ikut melaksanakan mufakat dengan kompak', isCorrect: true, feedback: 'Sangat bijak! Itulah cerminan jiwa Pancasila dalam bermusyawarah mufakat.' },
          { text: 'Merajuk, marah, dan menolak ikut serta dalam kegiatan kelas', isCorrect: false, feedback: 'Sikap egois dapat merusak kerukunan dan persatuan di dalam kelas.' },
        ],
      },
    ],
    transcript: [
      'Musyawarah berasal dari nilai luhur bangsa Indonesia yang tercantum dalam Sila Keempat Pancasila.',
      'Dalam bermusyawarah, setiap orang bebas menyampaikan ide asalkan dilakukan dengan kata-kata yang sopan dan tidak menyinggung orang lain.',
      'Ketika keputusan mufakat sudah diambil, semua peserta musyawarah bertanggung jawab menjalankannya dengan sepenuh hati.',
    ],
  },
];

interface InteractiveVideoPlayerProps {
  onScoreEarned?: (scoreDelta: number) => void;
}

export const InteractiveVideoPlayer: React.FC<InteractiveVideoPlayerProps> = ({ onScoreEarned }) => {
  const [selectedVideo, setSelectedVideo] = useState<InteractiveVideoData>(INTERACTIVE_VIDEOS[0]);
  const [playerMode, setPlayerMode] = useState<'lumi_embed' | 'canvas_sim'>(() =>
    selectedVideo.embedUrl ? 'lumi_embed' : 'canvas_sim'
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [activeCheckpoint, setActiveCheckpoint] = useState<VideoCheckpoint | null>(null);
  const [answeredCheckpoints, setAnsweredCheckpoints] = useState<Record<string, boolean>>({});
  const [checkpointFeedback, setCheckpointFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [isReadingTranscript, setIsReadingTranscript] = useState<boolean>(false);
  const [isLumiVideoCompleted, setIsLumiVideoCompleted] = useState<boolean>(false);
  const [isIframeLoading, setIsIframeLoading] = useState<boolean>(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load Lumi resizer script if not present
  useEffect(() => {
    const existingScript = document.querySelector('script[src*="h5p-resizer.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://app.Lumi.education/api/v1/h5p/core/js/h5p-resizer.js';
      script.charset = 'UTF-8';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Update mode when switching video
  useEffect(() => {
    if (selectedVideo.embedUrl) {
      setPlayerMode('lumi_embed');
      setIsIframeLoading(true);
    } else {
      setPlayerMode('canvas_sim');
    }
  }, [selectedVideo]);

  // Canvas playback timer ticker (for non-embed mode)
  useEffect(() => {
    if (isPlaying && !activeCheckpoint && playerMode === 'canvas_sim') {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          if (next >= selectedVideo.durationSec) {
            setIsPlaying(false);
            audioService.playSuccessChime();
            return selectedVideo.durationSec;
          }

          // Trigger checkpoint if exact match and not answered
          const cp = selectedVideo.checkpoints.find(
            (c) => Math.abs(c.timeSec - next) < 1 && !answeredCheckpoints[c.id]
          );
          if (cp) {
            setIsPlaying(false);
            setActiveCheckpoint(cp);
            audioService.playExploreTone();
          }

          return next;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeCheckpoint, selectedVideo, answeredCheckpoints, playbackSpeed, playerMode]);

  // Handle Video Selection
  const handleSelectVideo = (vid: InteractiveVideoData) => {
    audioService.playClickTone();
    audioService.stopSpeaking();
    setIsReadingTranscript(false);
    setSelectedVideo(vid);
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveCheckpoint(null);
    setCheckpointFeedback(null);
  };

  // Play/Pause toggle (for simulation canvas)
  const handleTogglePlay = () => {
    audioService.playClickTone();
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentTime >= selectedVideo.durationSec) {
        setCurrentTime(0);
      }
      setIsPlaying(true);
      setActiveCheckpoint(null);
      setCheckpointFeedback(null);
    }
  };

  // Jump to Chapter
  const handleJumpToChapter = (sec: number) => {
    audioService.playClickTone();
    setCurrentTime(sec);
    setActiveCheckpoint(null);
    setCheckpointFeedback(null);
    setIsPlaying(true);
  };

  // Handle Checkpoint Answer in simulation canvas
  const handleAnswerOption = (option: { text: string; isCorrect: boolean; feedback: string }) => {
    if (option.isCorrect) {
      audioService.playSuccessChime();
      setCheckpointFeedback({ isCorrect: true, text: option.feedback });
      if (activeCheckpoint) {
        setAnsweredCheckpoints((prev) => ({ ...prev, [activeCheckpoint.id]: true }));
      }
      onScoreEarned?.(15);
    } else {
      audioService.playClickTone();
      setCheckpointFeedback({ isCorrect: false, text: option.feedback });
    }
  };

  // Resume after checkpoint
  const handleResumeAfterCheckpoint = () => {
    audioService.playClickTone();
    setActiveCheckpoint(null);
    setCheckpointFeedback(null);
    setIsPlaying(true);
  };

  // Read Transcript Aloud
  const handleToggleReadTranscript = () => {
    audioService.playClickTone();
    if (isReadingTranscript) {
      audioService.stopSpeaking();
      setIsReadingTranscript(false);
    } else {
      const fullText = selectedVideo.transcript.join(' ');
      setIsReadingTranscript(true);
      audioService.speakIndonesian(fullText, () => {
        setIsReadingTranscript(false);
      });
    }
  };

  // Complete Lumi video activity
  const handleCompleteLumiVideo = () => {
    audioService.playSuccessChime();
    setIsLumiVideoCompleted(true);
    onScoreEarned?.(25);
  };

  const progressPercent = Math.min(100, Math.round((currentTime / selectedVideo.durationSec) * 100));

  // Current active chapter
  const activeChapter = [...selectedVideo.chapters]
    .reverse()
    .find((ch) => currentTime >= ch.timeSec) || selectedVideo.chapters[0];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* 1. Header Toolbar with Video Selector Tabs */}
      <div className="bg-[#181335] text-white px-5 sm:px-8 py-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-500/30">
            <Tv className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Teater Video Interaktif
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Video & Audio-Visual
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight">
              {selectedVideo.title}
            </h2>
          </div>
        </div>

        {/* Video selector buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {INTERACTIVE_VIDEOS.map((vid, idx) => (
            <button
              key={vid.id}
              onClick={() => handleSelectVideo(vid)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedVideo.id === vid.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ListVideo className="w-3.5 h-3.5" />
              <span>{idx === 0 ? 'Video Utama' : `Video ${idx + 1}`}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Video Screen: LIVE EMBED vs SIMULATION CANVAS */}
      {selectedVideo.embedUrl && playerMode === 'lumi_embed' ? (
        /* LIVE INTERACTIVE VIDEO EMBED */
        <div className="bg-slate-900 relative">
          {/* Iframe Loading Overlay */}
          {isIframeLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-xs z-10 text-white p-6 text-center">
              <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
              <h4 className="font-bold text-sm text-white mb-1">
                Memuat Video Pembelajaran Interaktif...
              </h4>
              <p className="text-xs text-indigo-200 max-w-sm">
                Menyiapkan tayangan video dan kuis interaktif.
              </p>
            </div>
          )}

          <div className="w-full flex justify-center bg-slate-950 p-2 sm:p-4">
            <iframe
              src={selectedVideo.embedUrl}
              width="100%"
              height="620"
              className="w-full min-h-[520px] sm:min-h-[640px] max-w-6xl border-0 rounded-2xl shadow-2xl bg-black"
              allowFullScreen
              allow="geolocation *; microphone *; camera *; midi *; encrypted-media *"
              title={selectedVideo.title}
              onLoad={() => setIsIframeLoading(false)}
            />
          </div>

          {/* Lumi Interactive Video Action Bar */}
          <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 text-white flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <p className="text-sm font-bold text-white">
                  Video Pembelajaran Interaktif Aktif
                </p>
                <p className="text-xs text-slate-400">
                  Putar video di atas dan jawab pertanyaan kuis interaktif yang muncul di dalam video.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleToggleReadTranscript}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                  isReadingTranscript
                    ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                    : 'bg-slate-800 text-indigo-300 border-indigo-500/30 hover:bg-slate-700'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isReadingTranscript ? 'Hentikan Suara' : 'Dengarkan Pengantar Suara'}</span>
              </button>

              <a
                href={selectedVideo.embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                title="Buka Layar Penuh"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Layar Penuh</span>
              </a>

              {!isLumiVideoCompleted ? (
                <button
                  type="button"
                  onClick={handleCompleteLumiVideo}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Selesai Menonton (+25 Bintang)</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Capaian Video Tercatat (+25 Bintang)</span>
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* SIMULATION CANVAS PLAYER (FOR INTERNAL ANIMATED CHAPTERS) */
        <div className="relative bg-slate-950 aspect-video max-h-[460px] w-full flex items-center justify-center overflow-hidden group select-none">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 opacity-90" />
          
          <div className="relative z-10 w-full h-full p-6 sm:p-10 flex flex-col justify-between text-white">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-xs font-bold text-indigo-200 border border-white/15">
                {selectedVideo.topicBadge} · Bab: {activeChapter.title}
              </span>

              <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg text-xs font-mono font-bold text-slate-300">
                {Math.floor(currentTime / 60).toString().padStart(2, '0')}:{(currentTime % 60).toString().padStart(2, '0')} / {selectedVideo.durationLabel}
              </span>
            </div>

            <div className="my-auto text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 text-indigo-300 shadow-2xl backdrop-blur-md">
                {isPlaying ? (
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-8 bg-indigo-300 rounded-full animate-pulse" />
                    <span className="w-1.5 h-12 bg-white rounded-full animate-pulse delay-75" />
                    <span className="w-1.5 h-6 bg-indigo-300 rounded-full animate-pulse delay-150" />
                  </div>
                ) : (
                  <Play className="w-10 h-10 ml-1 text-white fill-white" />
                )}
              </div>

              <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-2">
                  {activeChapter.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl mx-auto">
                  {activeChapter.summary}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Tekan tombol putar untuk menyimak animasi dan audio interaktif.</span>
              <span className="font-semibold text-indigo-300">
                {selectedVideo.checkpoints.length} Kuis Interaktif Menantimu
              </span>
            </div>
          </div>

          {/* CHECKPOINT MODAL OVERLAY */}
          {activeCheckpoint && (
            <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-slate-900 shadow-2xl border-2 border-indigo-500">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-bold">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Kuis Interaktif Video ({activeCheckpoint.timeLabel})
                  </span>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    +15 Bintang
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-4 leading-snug">
                  {activeCheckpoint.question}
                </h4>

                <div className="space-y-2.5 mb-5">
                  {activeCheckpoint.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswerOption(opt)}
                      className="w-full text-left p-3.5 rounded-xl border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all font-semibold text-sm sm:text-base text-slate-800 cursor-pointer flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  ))}
                </div>

                {checkpointFeedback && (
                  <div
                    className={`p-3.5 rounded-xl mb-4 text-sm font-semibold flex items-start gap-2.5 ${
                      checkpointFeedback.isCorrect
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border border-rose-200 text-rose-900'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                    <div>
                      <p className="font-bold">{checkpointFeedback.isCorrect ? 'Benar!' : 'Perhatikan Kembali'}</p>
                      <p className="text-xs sm:text-sm font-normal mt-0.5">{checkpointFeedback.text}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                  {checkpointFeedback?.isCorrect ? (
                    <button
                      type="button"
                      onClick={handleResumeAfterCheckpoint}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer flex items-center gap-2"
                    >
                      <span>Lanjutkan Video</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <p className="text-xs text-slate-500 self-center">
                      Pilih jawaban yang paling tepat untuk melanjutkan video.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Media Controls & Chapters Bar (Available for all videos) */}
      <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-4">
        {/* Toggle between Lumi Embed and Canvas Sim if embed exists */}
        {selectedVideo.embedUrl && (
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-600">
              Format Tampilan:
            </span>
            <div className="inline-flex p-1 bg-slate-200 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPlayerMode('lumi_embed')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  playerMode === 'lumi_embed'
                    ? 'bg-white text-indigo-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tampilan Video Interaktif
              </button>
              <button
                type="button"
                onClick={() => setPlayerMode('canvas_sim')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  playerMode === 'canvas_sim'
                    ? 'bg-white text-indigo-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Simulasi Bab Mandiri
              </button>
            </div>
          </div>
        )}

        {/* Timeline Slider with Checkpoint Dots (when in simulation mode) */}
        {playerMode === 'canvas_sim' && (
          <div className="space-y-1.5">
            <div className="relative w-full h-3 bg-slate-200 rounded-full overflow-hidden cursor-pointer group">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
              {selectedVideo.checkpoints.map((cp) => {
                const leftPercent = (cp.timeSec / selectedVideo.durationSec) * 100;
                const isDone = answeredCheckpoints[cp.id];
                return (
                  <div
                    key={cp.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJumpToChapter(cp.timeSec);
                    }}
                    title={`Kuis: ${cp.timeLabel}`}
                    className={`absolute top-0 bottom-0 w-3 -ml-1.5 rounded-full border border-white cursor-pointer transition-transform hover:scale-125 ${
                      isDone ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                    style={{ left: `${leftPercent}%` }}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>{Math.floor(currentTime / 60).toString().padStart(2, '0')}:{(currentTime % 60).toString().padStart(2, '0')}</span>
              <span className="flex items-center gap-1.5 text-indigo-700">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Titik Kuis Interaktif
              </span>
              <span>{selectedVideo.durationLabel}</span>
            </div>
          </div>
        )}

        {/* Control Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {playerMode === 'canvas_sim' && (
              <>
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      <span>Jeda</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>{currentTime > 0 ? 'Lanjut Putar' : 'Putar Video'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    audioService.playClickTone();
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                  className="p-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl transition-colors cursor-pointer"
                  title="Ulangi dari Awal"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <select
                  value={playbackSpeed}
                  onChange={(e) => {
                    audioService.playClickTone();
                    setPlaybackSpeed(parseFloat(e.target.value));
                  }}
                  className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-indigo-500"
                >
                  <option value="0.8">0.8x Santai</option>
                  <option value="1.0">1.0x Normal</option>
                  <option value="1.25">1.25x Cepat</option>
                </select>
              </>
            )}
          </div>

          {/* Right Side Buttons: Transcript & Audio Narration */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleToggleReadTranscript}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                isReadingTranscript
                  ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                  : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isReadingTranscript ? 'Berhenti Membaca' : 'Dengarkan Narasi Suara'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                audioService.playClickTone();
                setShowTranscript((v) => !v);
              }}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>{showTranscript ? 'Tutup Transkrip' : 'Buka Transkrip'}</span>
            </button>
          </div>
        </div>

        {/* 4. Interactive Chapters Pill Bar */}
        <div className="pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Poin Penting & Bab Pembahasan:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {selectedVideo.chapters.map((ch) => {
              const isActive = activeChapter.id === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => handleJumpToChapter(ch.timeSec)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="font-mono text-xs font-bold text-indigo-600 block">
                    {ch.timeLabel}
                  </span>
                  <span className="text-xs font-bold line-clamp-1">
                    {ch.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Transcript Collapsible View */}
        {showTranscript && (
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2 mt-3 animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-bold text-sm text-slate-900">
                Teks Transkrip Pembelajaran:
              </h5>
              <span className="text-xs text-slate-500">Bahasa Indonesia</span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto text-sm text-slate-700 leading-relaxed pr-2">
              {selectedVideo.transcript.map((line, idx) => (
                <p key={idx} className="p-2 rounded-lg hover:bg-slate-50">
                  <span className="font-bold text-indigo-600 mr-2">[{idx + 1}]</span>
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
