import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { audioService } from '../../services/audioService';

export interface FeatureCardProps {
  featureNumber: number;
  tag: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconBgColor?: string;
  badgeColor?: string;
  buttonText: string;
  isCompleted?: boolean;
  onAction: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  featureNumber,
  tag,
  title,
  description,
  icon: Icon,
  iconBgColor = 'bg-indigo-50 text-indigo-600',
  badgeColor = 'text-indigo-700 bg-indigo-50 border-indigo-200',
  buttonText,
  isCompleted = false,
  onAction,
}) => {
  const handleClick = () => {
    audioService.playClickTone();
    onAction();
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className="bg-white rounded-[20px] p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-200 cursor-pointer flex flex-col justify-between group min-h-[210px] text-left relative focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div>
        {/* Top bar with Icon and Tag */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-[44px] h-[44px] rounded-2xl ${iconBgColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs`}
          >
            <Icon className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-2">
            {isCompleted && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Selesai
              </span>
            )}
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${badgeColor}`}
            >
              Fitur {featureNumber} · {tag}
            </span>
          </div>
        </div>

        {/* Title: 22px */}
        <h3 className="text-[22px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight leading-snug">
          {title}
        </h3>

        {/* Description: 16 to 18px */}
        <p className="text-base text-slate-600 mt-2.5 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action Button: 16 to 17px */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-base font-bold text-indigo-700 group-hover:text-indigo-800 flex items-center gap-1.5 transition-colors">
          {buttonText}
        </span>
        <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-600 text-slate-500 group-hover:text-white flex items-center justify-center transition-colors">
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
