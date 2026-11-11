import React, { useState } from 'react';
import { User } from '../../types';
import { User as UserIcon, ShieldCheck, Star, CheckCircle2, ArrowRight } from 'lucide-react';

interface StudentProfileProps {
  user: User;
  onUpdateAvatar?: (avatar: string) => void;
  onBackToStudy: () => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({
  user,
  onUpdateAvatar,
  onBackToStudy,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(user.avatar || 'A');
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const avatarColors = [
    { label: 'Indigo', bg: 'bg-indigo-600', text: 'text-white' },
    { label: 'Blue', bg: 'bg-blue-600', text: 'text-white' },
    { label: 'Emerald', bg: 'bg-emerald-600', text: 'text-white' },
    { label: 'Amber', bg: 'bg-amber-500', text: 'text-white' },
    { label: 'Purple', bg: 'bg-purple-600', text: 'text-white' },
    { label: 'Rose', bg: 'bg-rose-600', text: 'text-white' },
  ];

  const handleSelect = (colorName: string) => {
    setSelectedAvatar(colorName);
    onUpdateAvatar?.(colorName);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-md">
            {user.name.charAt(0)}
          </div>

          <div className="text-center sm:text-left flex-1">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
              Akun Belajar Aktif
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1.5">
              {user.name}
            </h2>
            <p className="text-sm text-slate-600 mt-1 font-medium">
              Siswa Pembelajar · Pendidikan Pancasila
            </p>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              ID Belajar: {user.id}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center shrink-0">
            <span className="text-xs text-slate-500 font-semibold block">Koleksi Bintang</span>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {user.stars ?? 0}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium block mt-0.5">Bintang Capaian</span>
          </div>
        </div>

        {/* Child Safety & Privacy Commitment */}
        <div className="pt-6 flex items-start gap-4 text-slate-700">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-base text-slate-900 mb-1">
              Ruang Belajar Aman Anak (Child-Safety)
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Akun belajar ini bebas dari iklan, tidak memiliki profil publik, dan tidak memiliki obrolan umum dengan orang asing. Seluruh hasil latihan dan jurnal refleksi hanya dapat diakses oleh Ananda dan bapak/ibu guru pembimbing untuk keperluan pembelajaran Pendidikan Pancasila.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={onBackToStudy}
          className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-xl shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <span>Lanjut Belajar Misi Petualangan</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
