import React, { useState } from 'react';

interface ReflectionModalProps {
  activityTitle: string;
  initialUnderstanding?: 'sangat-paham' | 'cukup-paham' | 'masih-belajar' | 'butuh-bantuan';
  onSave: (
    understanding: 'sangat-paham' | 'cukup-paham' | 'masih-belajar' | 'butuh-bantuan',
    answers: {
      halPenting: string;
      normaRumah: string;
      normaSekolah: string;
      komitmenDepan: string;
    }
  ) => void;
  onClose: () => void;
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({
  activityTitle,
  initialUnderstanding = 'sangat-paham',
  onSave,
  onClose,
}) => {
  const [understanding, setUnderstanding] = useState<
    'sangat-paham' | 'cukup-paham' | 'masih-belajar' | 'butuh-bantuan'
  >(initialUnderstanding);

  const [halPenting, setHalPenting] = useState('Saya belajar bahwa norma menjaga ketertiban, keadilan, dan kerukunan bersama.');
  const [normaRumah, setNormaRumah] = useState('Membantu orang tua merapikan rumah dan berpamitan sebelum bepergian.');
  const [normaSekolah, setNormaSekolah] = useState('Mendengarkan guru saat pelajaran dan antre dengan tertib saat piket.');
  const [komitmenDepan, setKomitmenDepan] = useState('Saya berjanji akan mengutamakan musyawarah dan selalu bersikap santun.');

  const understandingLevels = [
    { id: 'sangat-paham', label: 'Sangat Paham', emoji: '😊', desc: 'Mengerti materi dengan sangat jelas' },
    { id: 'cukup-paham', label: 'Cukup Paham', emoji: '🙂', desc: 'Sudah memahami sebagian besar konsep' },
    { id: 'masih-belajar', label: 'Masih Belajar', emoji: '😐', desc: 'Perlu sedikit latihan tambahan' },
    { id: 'butuh-bantuan', label: 'Butuh Bantuan', emoji: '🤔', desc: 'Ingin bertanya pada guru' },
  ];

  const handleSave = () => {
    onSave(understanding, {
      halPenting: halPenting.trim(),
      normaRumah: normaRumah.trim(),
      normaSekolah: normaSekolah.trim(),
      komitmenDepan: komitmenDepan.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-amber-200 my-auto animate-in zoom-in-95 duration-200">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-2 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl">
            ✨
          </div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
            JURNAL REFLEKSI: NORMA DALAM KEHIDUPANKU
          </span>
          <h3 className="font-display text-xl font-bold text-slate-900 mt-1">
            Refleksi Perjalanan Belajarku
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{activityTitle}</p>
        </div>

        {/* Understanding level selection */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Bagaimana tingkat pemahamanmu terhadap materi ini?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {understandingLevels.map((lvl) => {
              const isSelected = understanding === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setUnderstanding(lvl.id as any)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-100 border-purple-400 font-bold text-purple-950 shadow-xs scale-105'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-2xl block mb-1">{lvl.emoji}</span>
                  <span className="text-xs block">{lvl.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Reflection Questions */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              1. Apa hal penting yang kamu pelajari dari materi ini?
            </label>
            <textarea
              rows={2}
              value={halPenting}
              onChange={(e) => setHalPenting(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 bg-amber-50/20 focus:outline-hidden focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              2. Norma apa yang paling sering kamu lakukan di rumah?
            </label>
            <textarea
              rows={2}
              value={normaRumah}
              onChange={(e) => setNormaRumah(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 bg-amber-50/20 focus:outline-hidden focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              3. Bagaimana kamu menerapkan norma di sekolah?
            </label>
            <textarea
              rows={2}
              value={normaSekolah}
              onChange={(e) => setNormaSekolah(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 bg-amber-50/20 focus:outline-hidden focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              4. Apa yang akan kamu lakukan setelah belajar materi ini?
            </label>
            <textarea
              rows={2}
              value={komitmenDepan}
              onChange={(e) => setKomitmenDepan(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 bg-amber-50/20 focus:outline-hidden focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-[#6BCB77] hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
          >
            ✓ Simpan Refleksi
          </button>
        </div>
      </div>
    </div>
  );
};
