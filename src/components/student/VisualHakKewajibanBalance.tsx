import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  HeartHandshake, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Volume2, 
  Plus, 
  Minus,
  Check
} from 'lucide-react';
import { audioService } from '../../services/audioService';

interface BalanceItem {
  id: string;
  title: string;
  weight: number;
  type: 'hak' | 'kewajiban';
  location: 'sekolah' | 'rumah' | 'masyarakat';
}

const AVAILABLE_ITEMS: BalanceItem[] = [
  // HAK ITEMS
  { id: 'h_1', title: 'Mendapat Bimbingan Ilmu dari Guru', weight: 1, type: 'hak', location: 'sekolah' },
  { id: 'h_2', title: 'Belajar di Kelas yang Bersih & Rapi', weight: 1, type: 'hak', location: 'sekolah' },
  { id: 'h_3', title: 'Mendapat Kasih Sayang & Nafkah Keluarga', weight: 1, type: 'hak', location: 'sekolah' },
  { id: 'h_4', title: 'Bermain & Beristirahat dengan Aman', weight: 1, type: 'hak', location: 'sekolah' },

  // KEWAJIBAN ITEMS
  { id: 'k_1', title: 'Memperhatikan Pelajaran dengan Tertib', weight: 1, type: 'kewajiban', location: 'sekolah' },
  { id: 'k_2', title: 'Melaksanakan Tugas Piket Kebersihan', weight: 1, type: 'kewajiban', location: 'sekolah' },
  { id: 'k_3', title: 'Membantu Pekerjaan Rumah & Berbakti', weight: 1, type: 'kewajiban', location: 'sekolah' },
  { id: 'k_4', title: 'Menghormati Teman & Mentaati Tata Tertib', weight: 1, type: 'kewajiban', location: 'sekolah' },
];

interface VisualHakKewajibanBalanceProps {
  onScoreEarned?: (scoreDelta: number) => void;
}

export const VisualHakKewajibanBalance: React.FC<VisualHakKewajibanBalanceProps> = ({ onScoreEarned }) => {
  const [selectedHakIds, setSelectedHakIds] = useState<string[]>(['h_1', 'h_2']);
  const [selectedKewajibanIds, setSelectedKewajibanIds] = useState<string[]>(['k_1']);
  const [hasAchievedBalance, setHasAchievedBalance] = useState<boolean>(false);

  const totalHakWeight = selectedHakIds.length;
  const totalKewajibanWeight = selectedKewajibanIds.length;
  const diff = totalHakWeight - totalKewajibanWeight;

  // Tilt angle calculation: Max +/- 18 degrees
  const tiltDeg = Math.max(-18, Math.min(18, diff * 7));

  const toggleItem = (item: BalanceItem) => {
    audioService.playClickTone();
    if (item.type === 'hak') {
      setSelectedHakIds((prev) => {
        const next = prev.includes(item.id)
          ? prev.filter((id) => id !== item.id)
          : [...prev, item.id];
        checkBalance(next.length, selectedKewajibanIds.length);
        return next;
      });
    } else {
      setSelectedKewajibanIds((prev) => {
        const next = prev.includes(item.id)
          ? prev.filter((id) => id !== item.id)
          : [...prev, item.id];
        checkBalance(selectedHakIds.length, next.length);
        return next;
      });
    }
  };

  const checkBalance = (hakCount: number, kewajibanCount: number) => {
    if (hakCount > 0 && hakCount === kewajibanCount) {
      audioService.playBalanceHarmonized();
      if (!hasAchievedBalance) {
        setHasAchievedBalance(true);
        onScoreEarned?.(20);
      }
    }
  };

  const handleReset = () => {
    audioService.playClickTone();
    setSelectedHakIds([]);
    setSelectedKewajibanIds([]);
  };

  const isBalanced = totalHakWeight > 0 && totalHakWeight === totalKewajibanWeight;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#181335] text-white p-6 sm:p-8 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold border border-indigo-500/30 mb-2">
            <Scale className="w-4 h-4 text-indigo-400" />
            <span>Simulasi Fisika Interaktif</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Neraca Keseimbangan Hak & Kewajiban
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl">
            Tentukan kartu hak dan kewajibanmu. Perhatikan bagaimana timbangan bergerak! Hak baru dapat dinikmati seutuhnya jika diimbangi kewajiban yang ditunaikan.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shrink-0 border border-slate-700"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Atur Ulang Timbangan</span>
        </button>
      </div>

      {/* 2. Interactive Balance Scale Display */}
      <div className="p-6 sm:p-10 bg-slate-50 flex flex-col items-center">
        {/* Balance Status Banner */}
        <div className="mb-8">
          {isBalanced ? (
            <div className="px-5 py-2.5 bg-emerald-50 border-2 border-emerald-400 text-emerald-900 rounded-2xl flex items-center gap-2.5 shadow-sm animate-bounce">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <span className="font-display font-bold text-base sm:text-lg">
                Keseimbangan Sempurna! Hak dan kewajiban berjalan selaras dalam harmoni.
              </span>
            </div>
          ) : totalHakWeight > totalKewajibanWeight ? (
            <div className="px-5 py-2.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl flex items-center gap-2.5 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span className="font-semibold text-sm sm:text-base">
                Timbangan condong ke Hak! Jangan lupa menunaikan kewajiban sebelum menuntut hak.
              </span>
            </div>
          ) : totalKewajibanWeight > totalHakWeight ? (
            <div className="px-5 py-2.5 bg-blue-50 border border-blue-300 text-blue-900 rounded-2xl flex items-center gap-2.5 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <span className="font-semibold text-sm sm:text-base">
                Kewajiban tinggi! Kamu juga berhak atas perlindungan, ilmu, dan istirahat yang cukup.
              </span>
            </div>
          ) : (
            <div className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-2xl text-sm font-semibold">
              Pilih kartu Hak dan Kewajiban di bawah untuk mulai menyeimbangkan neraca.
            </div>
          )}
        </div>

        {/* The Visual Scale SVG / CSS Physics Mechanism */}
        <div className="w-full max-w-2xl relative h-64 flex flex-col items-center justify-end select-none">
          {/* Fulcrum base (Penyangga) */}
          <div className="absolute bottom-0 w-24 h-28 bg-slate-800 rounded-t-2xl border-4 border-slate-900 flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 rounded-full bg-amber-400 border-2 border-slate-900 flex items-center justify-center">
              <Scale className="w-5 h-5 text-slate-900" />
            </div>
          </div>

          {/* Fulcrum pin */}
          <div className="absolute bottom-28 w-5 h-5 rounded-full bg-slate-900 z-20" />

          {/* Rotating Beam (Batang Timbangan) */}
          <div
            className="absolute bottom-28 w-full max-w-lg h-4 bg-gradient-to-r from-indigo-700 via-slate-800 to-indigo-700 rounded-full transition-transform duration-500 origin-center z-10 shadow-md flex items-center justify-between px-2"
            style={{ transform: `rotate(${tiltDeg}deg)` }}
          >
            {/* Left Pan (Piringan Hak) */}
            <div className="relative -ml-6 -top-2 flex flex-col items-center">
              {/* String */}
              <div className="w-0.5 h-20 bg-slate-600" />
              {/* Pan */}
              <div className="w-40 sm:w-48 min-h-24 bg-white border-2 border-indigo-400 rounded-2xl shadow-xl p-3 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Piringan Hak ({totalHakWeight})
                </span>
                <span className="text-xs text-slate-500 font-medium mt-0.5">
                  {selectedHakIds.length === 0 ? 'Belum ada hak dipilih' : `${selectedHakIds.length} Hak Aktif`}
                </span>
              </div>
            </div>

            {/* Right Pan (Piringan Kewajiban) */}
            <div className="relative -mr-6 -top-2 flex flex-col items-center">
              {/* String */}
              <div className="w-0.5 h-20 bg-slate-600" />
              {/* Pan */}
              <div className="w-40 sm:w-48 min-h-24 bg-white border-2 border-emerald-400 rounded-2xl shadow-xl p-3 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Piringan Kewajiban ({totalKewajibanWeight})
                </span>
                <span className="text-xs text-slate-500 font-medium mt-0.5">
                  {selectedKewajibanIds.length === 0 ? 'Belum ada kewajiban' : `${selectedKewajibanIds.length} Kewajiban Aktif`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Item Picker Tray */}
      <div className="p-6 sm:p-8 bg-white border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column Hak */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>Pilih Hak Siswa:</span>
              </h4>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                {selectedHakIds.length} Aktif
              </span>
            </div>

            <div className="space-y-2.5">
              {AVAILABLE_ITEMS.filter((i) => i.type === 'hak').map((item) => {
                const isSelected = selectedHakIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item)}
                    className={`w-full p-3.5 rounded-xl border text-left font-semibold text-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-700'
                    }`}
                  >
                    <span>{item.title}</span>
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column Kewajiban */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-emerald-600" />
                <span>Pilih Kewajiban Siswa:</span>
              </h4>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                {selectedKewajibanIds.length} Aktif
              </span>
            </div>

            <div className="space-y-2.5">
              {AVAILABLE_ITEMS.filter((i) => i.type === 'kewajiban').map((item) => {
                const isSelected = selectedKewajibanIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item)}
                    className={`w-full p-3.5 rounded-xl border text-left font-semibold text-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-700'
                    }`}
                  >
                    <span>{item.title}</span>
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
