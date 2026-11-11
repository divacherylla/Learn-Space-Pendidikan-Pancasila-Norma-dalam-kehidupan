import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  BookOpen, 
  Briefcase, 
  Gamepad2, 
  Bot, 
  FileText,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { audioService } from '../../services/audioService';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartLearning: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartLearning,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!isOpen) return null;

  const steps = [
    {
      stepNumber: 1,
      title: 'Langkah 1: Mulai Belajar & Kenali Materi',
      badge: 'Orientasi Awal',
      icon: Sparkles,
      iconColor: 'bg-indigo-100 text-indigo-700',
      description:
        'Pilih materi utama Pendidikan Pancasila Bab 2: Norma dalam Kehidupanku. Pelajari aturan berkehidupan melalui teater video, laboratorium visual 4 norma, dan simulasi neraca hak dan kewajiban.',
      actionHint: 'Klik tombol Mulai Belajar untuk membuka modul pertama.',
    },
    {
      stepNumber: 2,
      title: 'Langkah 2: Pelajari Tutorial Mandiri',
      badge: 'Guided Learning',
      icon: BookOpen,
      iconColor: 'bg-blue-100 text-blue-700',
      description:
        'Pelajari materi langkah demi langkah melalui 7 tahapan terstruktur: Pengenalan, Tujuan Pembelajaran, Kasus Nyata, Visual Interaktif, Contoh Penerapan, Checkpoint Cek Pemahaman, dan Rangkuman dengan narasi suara berbahasa Indonesia.',
      actionHint: 'Kamu dapat mengatur kecepatan suara narasi dan mengulang kapan saja.',
    },
    {
      stepNumber: 3,
      title: 'Langkah 3: Kerjakan Aktivitas Practical',
      badge: 'Penerapan Nyata',
      icon: Briefcase,
      iconColor: 'bg-emerald-100 text-emerald-700',
      description:
        'Terapkan pemahaman nilai ke dalam skenario kehidupan sehari-hari di rumah, sekolah, dan musyawarah. Latih kemampuan mengidentifikasi tindakan, memberikan alasan etis, serta merefleksikan kebiasaan baik.',
      actionHint: 'Simpan jawabanmu untuk dinilai dan dipantau oleh bapak/ibu guru.',
    },
    {
      stepNumber: 4,
      title: 'Langkah 4: Latih Pemahaman di Drill & Game',
      badge: 'Latihan & Petualangan',
      icon: Gamepad2,
      iconColor: 'bg-amber-100 text-amber-700',
      description:
        'Uji kemampuanmu tanpa rasa cemas melalui 2 mode seru: Sesi Drill (latihan soal acak dengan tingkat kesulitan mudah, sedang, menantang) dan Mode Game (Misi Penjelajah Norma 5 Level & Game Interaktif H5P berhadiah bintang dan lencana).',
      actionHint: 'Dapatkan bintang emas dan poin bonus untuk setiap tantangan.',
    },
    {
      stepNumber: 5,
      title: 'Langkah 5: Teman Belajar & Rangkuman Materi',
      badge: 'Dukungan Belajar',
      icon: Bot,
      iconColor: 'bg-purple-100 text-purple-700',
      description:
        'Tanya materi yang belum kamu pahami kepada Teman Belajar (Chatbot AI berpedoman buku guru). Baca juga kartu rangkuman dan peta konsep untuk mengingat poin penting sebelum mengikuti Asesmen Pembelajaran.',
      actionHint: 'Teman Belajar selalu siap menemanimu belajar dengan ramah dan sabar.',
    },
  ];

  const current = steps[currentStep];

  const handleNext = () => {
    audioService.playClickTone();
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      audioService.playSuccessChime();
      onClose();
    }
  };

  const handlePrev = () => {
    audioService.playClickTone();
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    audioService.playClickTone();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleSkip}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          title="Tutup Panduan"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Dots */}
        <div className="flex items-center gap-1.5 mb-6">
          {steps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                audioService.playClickTone();
                setCurrentStep(idx);
              }}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentStep
                  ? 'w-8 bg-indigo-600'
                  : idx < currentStep
                  ? 'w-2.5 bg-emerald-500'
                  : 'w-2.5 bg-slate-200'
              }`}
              title={`Langkah ${idx + 1}`}
            />
          ))}
          <span className="ml-auto text-xs font-bold text-slate-500">
            Langkah {currentStep + 1} dari {steps.length}
          </span>
        </div>

        {/* Step Content */}
        <div className="text-left space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl ${current.iconColor} flex items-center justify-center shrink-0 shadow-2xs`}
            >
              <current.icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                {current.badge}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {current.title}
              </h3>
            </div>
          </div>

          <p className="text-base text-slate-700 leading-relaxed pt-1">
            {current.description}
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-600 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{current.actionHint}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer px-2"
          >
            Lewati
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>{currentStep === steps.length - 1 ? 'Selesai' : 'Selanjutnya'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
