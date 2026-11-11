import React, { useState, useEffect } from 'react';
import { H5PContentPackage } from '../../types';
import { storageService } from '../../services/storageService';
import { H5PScore } from './H5PScore';

interface H5PPlayerProps {
  packageData: H5PContentPackage;
  onComplete?: (score: number, maxScore: number) => void;
  onRetry?: () => void;
  isSimulatedBroken?: boolean;
}

export const H5PPlayer: React.FC<H5PPlayerProps> = ({
  packageData,
  onComplete,
  onRetry,
  isSimulatedBroken = false,
}) => {
  const [hasError, setHasError] = useState(isSimulatedBroken);
  const [isCompleted, setIsCompleted] = useState(false);
  const [earnedScore, setEarnedScore] = useState(0);
  const [maxPossibleScore, setMaxPossibleScore] = useState(100);
  const [attempts, setAttempts] = useState(1);
  const [viewMode, setViewMode] = useState<'lumi_embed' | 'internal'>(() =>
    packageData?.embedUrl ? 'lumi_embed' : 'internal'
  );

  // Negative test recovery
  const handlePlayerRetry = () => {
    setHasError(false);
    setIsCompleted(false);
    setAttempts((prev) => prev + 1);
    if (onRetry) onRetry();
  };

  if (hasError || !packageData || (!packageData.content && !packageData.embedUrl)) {
    return (
      <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-8 text-center max-w-lg mx-auto shadow-xs my-6">
        <div className="w-14 h-14 mx-auto mb-3 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl">
          🛠️
        </div>
        <h4 className="font-display text-lg font-bold text-slate-900 mb-1">
          Media belum dapat dibuka.
        </h4>
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Coba muat ulang halaman. Jika masalah masih terjadi, beri tahu gurumu agar dapat dibantu.
        </p>
        <button
          type="button"
          onClick={handlePlayerRetry}
          className="px-5 py-2.5 bg-[#4D96FF] hover:bg-blue-600 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
        >
          🔄 Coba Lagi
        </button>
      </div>
    );
  }

  // 0. LIVE LUMI EDUCATION CLOUD EMBED PLAYER
  if (packageData.embedUrl && viewMode === 'lumi_embed') {
    return (
      <LumiEmbedPlayer
        packageData={packageData}
        onFinish={(score, max) => {
          setEarnedScore(score);
          setMaxPossibleScore(max);
          setIsCompleted(true);
          onComplete?.(score, max);
        }}
        onSwitchToInternal={() => setViewMode('internal')}
        hasInternalPlayer={Boolean(packageData.content)}
      />
    );
  }

  // 1. DRAG AND DROP PLAYER
  if (
    packageData.mainLibrary.includes('DragQuestion') ||
    packageData.content?.type === 'drag_and_drop'
  ) {
    return (
      <DragAndDropPlayer
        content={packageData.content}
        title={packageData.title}
        onFinish={(score, max) => {
          setEarnedScore(score);
          setMaxPossibleScore(max);
          setIsCompleted(true);
          onComplete?.(score, max);
        }}
      />
    );
  }

  // 1B. POHON NORMA DIGITAL PLAYER (MISI 3)
  if (packageData.content?.type === 'pohon_norma') {
    return (
      <PohonNormaPlayer
        content={packageData.content}
        title={packageData.title}
        onFinish={(score, max) => {
          setEarnedScore(score);
          setMaxPossibleScore(max);
          setIsCompleted(true);
          onComplete?.(score, max);
        }}
      />
    );
  }

  // 1C. MUSYAWARAH FLOW PLAYER (MISI 5)
  if (packageData.content?.type === 'musyawarah_flow') {
    return (
      <MusyawarahFlowPlayer
        content={packageData.content}
        title={packageData.title}
        onFinish={(score, max) => {
          setEarnedScore(score);
          setMaxPossibleScore(max);
          setIsCompleted(true);
          onComplete?.(score, max);
        }}
      />
    );
  }

  // 1D. QUESTION SET / QUIZ PLAYER (MISI 6 & PRE-ASSESSMENT)
  if (
    packageData.mainLibrary.includes('QuestionSet') ||
    packageData.content?.type === 'quiz'
  ) {
    return (
      <QuestionSetPlayer
        content={packageData.content}
        title={packageData.title}
        onFinish={(score, max) => {
          setEarnedScore(score);
          setMaxPossibleScore(max);
          setIsCompleted(true);
          onComplete?.(score, max);
        }}
      />
    );
  }

  // 2. BRANCHING SCENARIO PLAYER
  if (
    packageData.mainLibrary.includes('BranchingScenario') ||
    packageData.content?.type === 'branching_scenario'
  ) {
    return (
      <BranchingScenarioPlayer
        content={packageData.content}
        title={packageData.title}
        onFinish={(score, max) => {
          setEarnedScore(score);
          setMaxPossibleScore(max);
          setIsCompleted(true);
          onComplete?.(score, max);
        }}
      />
    );
  }

  // 3. INTERACTIVE VIDEO PLAYER
  if (
    packageData.mainLibrary.includes('InteractiveVideo') ||
    packageData.content?.type === 'interactive_video'
  ) {
    return (
      <InteractiveVideoPlayer
        content={packageData.content}
        title={packageData.title}
        onFinish={(score, max) => {
          setEarnedScore(score);
          setMaxPossibleScore(max);
          setIsCompleted(true);
          onComplete?.(score, max);
        }}
      />
    );
  }

  // 4. FALLBACK / MULTI CHOICE PLAYER
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200">
      <h4 className="font-display font-bold text-slate-900 mb-2">{packageData.title}</h4>
      <p className="text-xs text-slate-600 mb-4">Aktivitas pembelajaran interaktif telah siap.</p>
      {isCompleted ? (
        <H5PScore
          score={earnedScore}
          maxScore={maxPossibleScore}
          attempts={attempts}
          onRetry={handlePlayerRetry}
          onContinue={() => onComplete?.(earnedScore, maxPossibleScore)}
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setEarnedScore(100);
            setIsCompleted(true);
            onComplete?.(100, 100);
          }}
          className="px-4 py-2 bg-[#6BCB77] text-white text-xs font-semibold rounded-xl"
        >
          Selesaikan Aktivitas
        </button>
      )}
    </div>
  );
};

// ==========================================
// SUB-COMPONENT: DRAG AND DROP CATEGORIZATION
// ==========================================
interface DragDropProps {
  content: any;
  title: string;
  onFinish: (score: number, maxScore: number) => void;
}

const DragAndDropPlayer: React.FC<DragDropProps> = ({ content, title, onFinish }) => {
  const items = content.items || [];
  const zones = content.zones || [];

  // State: item placements: { [itemId]: zoneId }
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);

  const handleSelectZone = (zoneId: string) => {
    if (selectedItem) {
      setPlacements((prev) => ({ ...prev, [selectedItem]: zoneId }));
      setSelectedItem(null);
    }
  };

  const handleCheck = () => {
    let correctCount = 0;
    items.forEach((item: any) => {
      if (placements[item.id] === item.correctZone) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / items.length) * 100);
    setScore(calculatedScore);
    setHasEvaluated(true);

    if (calculatedScore >= 80) {
      setEvaluationFeedback('🎉 Hebat! Kamu memahami dengan sangat baik penerapan gotong royong di berbagai lingkungan.');
    } else {
      setEvaluationFeedback('💡 Bagus sudah berusaha! Ada beberapa perilaku yang kurang tepat tempatnya. Coba periksa kembali ya.');
    }

    onFinish(calculatedScore, 100);
  };

  const handleReset = () => {
    setPlacements({});
    setSelectedItem(null);
    setHasEvaluated(false);
    setEvaluationFeedback(null);
    setScore(null);
  };

  const unassignedItems = items.filter((item: any) => !placements[item.id]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div>
          <span className="text-[11px] font-bold text-[#4D96FF] tracking-wider uppercase">
            LATIHAN MENCOCOKKAN INTERAKTIF
          </span>
          <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">{title}</h3>
        </div>
        <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
          {Object.keys(placements).length} dari {items.length} Ditempatkan
        </span>
      </div>

      <p className="text-xs text-slate-600 mb-4 bg-amber-50/60 p-3 rounded-xl border border-amber-200/60">
        👉 <strong>Petunjuk:</strong> Klik salah satu kartu perilaku di bawah, lalu klik kotak lingkungan yang sesuai (Sekolah, Keluarga, atau Masyarakat).
      </p>

      {/* Target Drop Zones */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {zones.map((zone: any) => {
          const placedInThisZone = items.filter((it: any) => placements[it.id] === zone.id);

          return (
            <div
              key={zone.id}
              onClick={() => handleSelectZone(zone.id)}
              className={`rounded-2xl p-4 border-2 transition-all min-h-[160px] flex flex-col justify-between ${
                selectedItem
                  ? 'border-blue-400 bg-blue-50/40 hover:bg-blue-50 cursor-pointer shadow-xs scale-[1.01]'
                  : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              <div>
                <h4 className="font-bold text-sm text-slate-800 mb-1">{zone.label}</h4>
                <p className="text-[11px] text-slate-500 mb-3">{zone.hint}</p>

                {/* Items placed in this zone */}
                <div className="space-y-1.5">
                  {placedInThisZone.map((it: any) => {
                    const isCorrect = it.correctZone === zone.id;
                    return (
                      <div
                        key={it.id}
                        className={`text-xs p-2 rounded-lg border font-medium flex items-center justify-between ${
                          hasEvaluated
                            ? isCorrect
                              ? 'bg-emerald-100/80 border-emerald-300 text-emerald-950'
                              : 'bg-red-100/80 border-red-300 text-red-950'
                            : 'bg-white border-slate-300 text-slate-800 shadow-2xs'
                        }`}
                      >
                        <span className="flex-1">{it.text}</span>
                        {hasEvaluated && <span>{isCorrect ? '✓' : '✗'}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {placedInThisZone.length === 0 && (
                <div className="text-center py-4 text-xs text-slate-400 italic">
                  {selectedItem ? 'Klik di sini untuk meletakkan' : 'Belum ada kartu'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Unassigned Item Bank */}
      <div className="mb-6">
        <h4 className="text-xs font-bold text-slate-700 mb-2">
          PILIHAN KARTU PERILAKU ({unassignedItems.length} kartu tersisa):
        </h4>
        {unassignedItems.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {unassignedItems.map((item: any) => {
              const isSelected = selectedItem === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItem(isSelected ? null : item.id)}
                  className={`text-xs px-3.5 py-2 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-700 shadow-sm scale-105'
                      : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                  }`}
                >
                  {item.text} {isSelected && '👉'}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
            ✓ Semua kartu sudah ditempatkan pada kotak lingkungan. Tekan &ldquo;Periksa Jawaban&rdquo; di bawah!
          </p>
        )}
      </div>

      {/* Feedback banner */}
      {evaluationFeedback && (
        <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-slate-800 text-sm">
          <p className="font-semibold">{evaluationFeedback}</p>
          {score !== null && (
            <p className="text-xs text-slate-600 mt-1">
              Skor perolehanmu: <strong className="text-slate-900 font-mono">{score}/100</strong>
            </p>
          )}
        </div>
      )}

      {/* Player Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-slate-600 hover:text-slate-900 font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          🔄 Atur Ulang Kartu
        </button>

        <button
          type="button"
          onClick={handleCheck}
          disabled={Object.keys(placements).length === 0}
          className="px-5 py-2.5 bg-[#4D96FF] hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
        >
          ✓ Periksa Jawaban
        </button>
      </div>
    </div>
  );
};

// ==========================================
// SUB-COMPONENT: BRANCHING SCENARIO PLAYER
// ==========================================
interface BranchingProps {
  content: any;
  title: string;
  onFinish: (score: number, maxScore: number) => void;
}

const BranchingScenarioPlayer: React.FC<BranchingProps> = ({ content, title, onFinish }) => {
  const nodes = content.nodes || {};
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [accumulatedScore, setAccumulatedScore] = useState<number>(0);
  const [pathHistory, setPathHistory] = useState<string[]>(['start']);

  const currentNode = nodes[currentNodeId] || nodes['start'];

  const handleSelectChoice = (nextNodeId: string, bonus: number = 0) => {
    const newScore = accumulatedScore + bonus;
    setAccumulatedScore(newScore);
    setPathHistory((prev) => [...prev, nextNodeId]);
    setCurrentNodeId(nextNodeId);

    const targetNode = nodes[nextNodeId];
    if (targetNode?.isTerminal) {
      const finalScore = Math.min(100, Math.max(50, newScore));
      onFinish(finalScore, 100);
    }
  };

  const handleRestart = () => {
    setCurrentNodeId('start');
    setAccumulatedScore(0);
    setPathHistory(['start']);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <span className="text-[11px] font-bold text-[#A66CFF] tracking-wider uppercase">
            SKENARIO KEPUTUSAN INTERAKTIF
          </span>
          <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">{title}</h3>
        </div>
        <span className="text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md font-medium">
          Langkah {pathHistory.length}
        </span>
      </div>

      {/* Scenario Context Card */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 mb-5">
        <div className="flex items-start gap-3">
          <span className="text-3xl shrink-0">🏛️</span>
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Situasi: {content.intro || 'Skenario Keputusan PKn'}
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {currentNode.scenario}
            </p>
          </div>
        </div>
      </div>

      {/* Terminal Outcome vs Choices */}
      {currentNode.isTerminal ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-3xl bg-amber-100">
            {currentNode.outcome === 'success' ? '🎉' : '💡'}
          </div>
          <h4 className="font-display text-lg font-bold text-slate-900 mb-1">
            {currentNode.outcome === 'success' ? 'Keputusan Mufakat Terbaik!' : 'Pelajaran Berharga'}
          </h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto mb-5 leading-relaxed">
            {currentNode.finalFeedback}
          </p>

          <button
            type="button"
            onClick={handleRestart}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl cursor-pointer mr-2"
          >
            🔄 Coba Jalur Keputusan Lain
          </button>
        </div>
      ) : (
        <div className="space-y-2.5 mb-6">
          <h4 className="text-xs font-bold text-slate-700">PILIH SIKAP DAN TINDAKANMU:</h4>
          {currentNode.choices?.map((choice: any, idx: number) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectChoice(choice.nextNode, choice.scoreBonus || 0)}
              className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-[#4D96FF] bg-white hover:bg-blue-50/50 transition-all text-xs text-slate-800 font-medium flex items-center justify-between group cursor-pointer shadow-2xs"
            >
              <span>{choice.text}</span>
              <span className="text-[#4D96FF] text-base group-hover:translate-x-1 transition-transform ml-2">
                ➔
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// SUB-COMPONENT: INTERACTIVE VIDEO PLAYER
// ==========================================
interface VideoProps {
  content: any;
  title: string;
  onFinish: (score: number, maxScore: number) => void;
}

const InteractiveVideoPlayer: React.FC<VideoProps> = ({ content, title, onFinish }) => {
  const checkpoints = content.checkpoints || [];
  const duration = content.durationSeconds || 180;

  const [currentSecond, setCurrentSecond] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeCheckpoint, setActiveCheckpoint] = useState<any | null>(null);
  const [answeredMap, setAnsweredMap] = useState<Record<number, boolean>>({});
  const [checkpointFeedback, setCheckpointFeedback] = useState<string | null>(null);
  const [scoreCount, setScoreCount] = useState<number>(0);

  // Advance simulation slider
  const handleSeek = (val: number) => {
    setCurrentSecond(val);
    const hit = checkpoints.find((cp: any) => Math.abs(cp.second - val) <= 10 && !answeredMap[cp.second]);
    if (hit) {
      setIsPlaying(false);
      setActiveCheckpoint(hit);
    }
  };

  const handleSelectAnswer = (option: any) => {
    if (!activeCheckpoint) return;
    setCheckpointFeedback(option.feedback);

    if (option.isCorrect) {
      setScoreCount((prev) => prev + 1);
    }

    setAnsweredMap((prev) => ({ ...prev, [activeCheckpoint.second]: true }));
  };

  const handleResume = () => {
    setActiveCheckpoint(null);
    setCheckpointFeedback(null);
    setIsPlaying(true);

    // If all checkpoints answered or at end
    if (Object.keys(answeredMap).length >= checkpoints.length) {
      const finalScore = Math.round((Math.max(1, scoreCount) / Math.max(1, checkpoints.length)) * 100);
      onFinish(finalScore, 100);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <span className="text-[11px] font-bold text-[#FF6B6B] tracking-wider uppercase">
            VIDEO PEMBELAJARAN INTERAKTIF
          </span>
          <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">{title}</h3>
        </div>
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
          {Math.floor(currentSecond / 60)}:{(currentSecond % 60).toString().padStart(2, '0')} / 3:00
        </span>
      </div>

      {/* Simulated Video Canvas */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex flex-col justify-between p-4 text-white shadow-inner mb-4">
        {/* Animated scene content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl mb-2 backdrop-blur-xs">
            🎬
          </div>
          <h4 className="font-display text-base font-bold text-amber-300">
            {content.videoTitle || 'Animasi Sahabat Pancasila'}
          </h4>
          <p className="text-xs text-white/80 max-w-md mt-1">
            {isPlaying
              ? 'Video sedang diputar... Bersiaplah di titik jeda pertanyaan reflektif!'
              : 'Video dihentikan di titik jeda refleksi Sila Pancasila.'}
          </p>
        </div>

        {/* Video progress track with visible checkpoint markers */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type="range"
              min={0}
              max={duration}
              value={currentSecond}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#FFD43B]"
            />
            {/* Visual Checkpoint Pins */}
            {checkpoints.map((cp: any) => {
              const leftPercent = (cp.second / duration) * 100;
              const isAnswered = answeredMap[cp.second];
              return (
                <button
                  key={cp.second}
                  type="button"
                  onClick={() => {
                    setCurrentSecond(cp.second);
                    setActiveCheckpoint(cp);
                    setIsPlaying(false);
                  }}
                  style={{ left: `${leftPercent}%` }}
                  title={cp.title}
                  className={`absolute top-0 -translate-x-1/2 -translate-y-1 w-3.5 h-3.5 rounded-full border-2 border-white transition-all cursor-pointer ${
                    isAnswered ? 'bg-[#6BCB77]' : 'bg-[#FF6B6B] animate-pulse'
                  }`}
                />
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-md font-semibold cursor-pointer"
            >
              {isPlaying ? '⏸ Jeda' : '▶ Putar Video'}
            </button>
            <span className="text-[11px] text-white/70">
              {Object.keys(answeredMap).length} dari {checkpoints.length} Titik Jeda Selesai
            </span>
          </div>
        </div>
      </div>

      {/* Active Checkpoint Question Overlay */}
      {activeCheckpoint && (
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-md">
              🎯 Titik Jeda Interaktif
            </span>
            <span className="text-xs text-slate-500 font-mono">Detik ke-{activeCheckpoint.second}</span>
          </div>

          <h4 className="font-bold text-slate-900 text-sm mb-3">{activeCheckpoint.question}</h4>

          <div className="space-y-2 mb-4">
            {activeCheckpoint.options?.map((opt: any, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectAnswer(opt)}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/50 text-xs text-slate-800 font-medium transition-all cursor-pointer"
              >
                {opt.text}
              </button>
            ))}
          </div>

          {checkpointFeedback && (
            <div className="bg-white p-3.5 rounded-xl border border-amber-300 text-xs text-slate-800 mb-3">
              <p className="font-semibold text-slate-900 mb-1">{checkpointFeedback}</p>
              <button
                type="button"
                onClick={handleResume}
                className="mt-2 px-4 py-1.5 bg-[#4D96FF] text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Lanjutkan Pemutaran Video ➔
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// SUB-COMPONENT: POHON NORMAKU PLAYER (MISI 3)
// ==========================================
interface PohonNormaProps {
  content: any;
  title: string;
  onFinish: (score: number, maxScore: number) => void;
}

const PohonNormaPlayer: React.FC<PohonNormaProps> = ({ content, title, onFinish }) => {
  const items = content.items || [];
  const zones = content.zones || [];

  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);

  const handleSelectZone = (zoneId: string) => {
    if (selectedItem) {
      setPlacements((prev) => ({ ...prev, [selectedItem]: zoneId }));
      setSelectedItem(null);
    }
  };

  const handleCheck = () => {
    let correctCount = 0;
    items.forEach((item: any) => {
      if (placements[item.id] === item.correctZone) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / items.length) * 100);
    setScore(calculatedScore);
    setHasEvaluated(true);

    if (calculatedScore >= 80) {
      setEvaluationFeedback('🎉 Luar biasa! Seluruh daun norma telah tergantung di dahan yang tepat. Pohon Normaku tumbuh subur dan indah!');
    } else {
      setEvaluationFeedback('💡 Bagus sudah mencoba! Ada daun norma yang letaknya belum pas di dahan. Periksa kembali dan coba lagi ya.');
    }

    onFinish(calculatedScore, 100);
  };

  const handleReset = () => {
    setPlacements({});
    setSelectedItem(null);
    setHasEvaluated(false);
    setEvaluationFeedback(null);
    setScore(null);
  };

  const unassignedItems = items.filter((item: any) => !placements[item.id]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
        <div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            AKTIVITAS DIGITAL: POHON NORMAKU
          </span>
          <h3 className="font-display text-xl font-bold text-slate-900 mt-1">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Gantungkan daun-daun perilaku norma ke dahan yang tepat: Rumah, Sekolah, atau Lingkungan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 font-mono">
            {Object.keys(placements).length}/{items.length} Daun Terpasang
          </span>
        </div>
      </div>

      {/* Visual Tree Illustration with 3 Branches */}
      <div className="bg-gradient-to-b from-amber-50/60 to-emerald-50/40 rounded-3xl p-6 border border-emerald-200/60 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white shrink-0">
            <img
              src="/src/assets/images/pohon_norma_tree_1791175563319.jpg"
              alt="Ilustrasi Pohon Norma"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex-1">
            <h4 className="font-display text-lg font-bold text-emerald-950 mb-1">
              🌳 Dahan Pohon Normaku
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Di sekolah kita membuat pohon norma di atas karton, sekarang kita menyusunnya secara digital! Klik salah satu kartu daun di bawah, lalu klik kotak dahan pohon yang sesuai.
            </p>
          </div>
        </div>

        {/* The 3 Target Branches */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {zones.map((zone: any) => {
            const placedItems = items.filter((it: any) => placements[it.id] === zone.id);

            return (
              <div
                key={zone.id}
                onClick={() => handleSelectZone(zone.id)}
                className={`rounded-2xl p-4 border-2 transition-all min-h-[180px] flex flex-col justify-between ${
                  selectedItem
                    ? 'border-emerald-500 bg-emerald-50/60 hover:bg-emerald-100/60 cursor-pointer shadow-xs scale-[1.01]'
                    : 'border-slate-200 bg-white/90 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-bold text-sm text-slate-900">{zone.label}</h5>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {placedItems.length} daun
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">{zone.hint}</p>

                  <div className="space-y-1.5">
                    {placedItems.map((it: any) => {
                      const isCorrect = it.correctZone === zone.id;
                      return (
                        <div
                          key={it.id}
                          className={`text-xs p-2 rounded-xl border font-medium flex items-center justify-between ${
                            hasEvaluated
                              ? isCorrect
                                ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                                : 'bg-red-100 text-red-950 border-red-300'
                              : 'bg-emerald-50/80 border-emerald-200 text-slate-800'
                          }`}
                        >
                          <span className="flex-1">🍃 {it.text}</span>
                          {hasEvaluated && (
                            <span className="font-bold ml-1">{isCorrect ? '✓' : '✗'}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {placedItems.length === 0 && (
                  <div className="text-center py-4 text-xs text-slate-400 italic">
                    {selectedItem ? '👉 Klik di sini untuk menggantung daun' : 'Belum ada daun'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Leaves Bank */}
      <div className="mb-6">
        <h4 className="text-xs font-bold text-slate-700 mb-2">
          KARTU DAUN NORMA ({unassignedItems.length} tersisa):
        </h4>
        {unassignedItems.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {unassignedItems.map((item: any) => {
              const isSelected = selectedItem === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItem(isSelected ? null : item.id)}
                  className={`text-xs px-3.5 py-2 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm scale-105'
                      : 'bg-white hover:bg-emerald-50/40 border-slate-300 text-slate-800'
                  }`}
                >
                  🍃 {item.text} {isSelected && '👉'}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            ✓ Semua daun telah digantungkan ke dahan pohon! Tekan &ldquo;Periksa Pohon Normaku&rdquo; di bawah.
          </p>
        )}
      </div>

      {/* Evaluation Feedback */}
      {evaluationFeedback && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-slate-900 text-xs">
          <p className="font-semibold text-sm mb-1">{evaluationFeedback}</p>
          {score !== null && (
            <p className="text-slate-600 font-medium">
              Skor Perolehanmu: <strong className="text-slate-900 font-mono text-sm">{score}/100</strong>
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-slate-600 hover:text-slate-900 font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          🔄 Atur Ulang Daun
        </button>

        <button
          type="button"
          onClick={handleCheck}
          disabled={Object.keys(placements).length === 0}
          className="px-6 py-2.5 bg-[#6BCB77] hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
        >
          ✓ Periksa Pohon Normaku
        </button>
      </div>
    </div>
  );
};

// ==========================================
// SUB-COMPONENT: MUSYAWARAH FLOW PLAYER (MISI 5)
// ==========================================
interface MusyawarahFlowProps {
  content: any;
  title: string;
  onFinish: (score: number, maxScore: number) => void;
}

const MusyawarahFlowPlayer: React.FC<MusyawarahFlowProps> = ({ content, title, onFinish }) => {
  const nodes = content.nodes || {};
  const [currentNodeId, setCurrentNodeId] = useState<string>('step1');
  const [accumulatedScore, setAccumulatedScore] = useState<number>(0);
  const [stepsCompleted, setStepsCompleted] = useState<number>(1);

  const currentNode = nodes[currentNodeId] || nodes['step1'];

  const stagesList = [
    { id: '1', title: 'Mendengarkan Pendapat' },
    { id: '2', title: 'Menyampaikan Pendapat' },
    { id: '3', title: 'Mempertimbangkan Pilihan' },
    { id: '4', title: 'Mengambil Keputusan' },
    { id: '5', title: 'Melaksanakan Kesepakatan' },
  ];

  const handleChoice = (nextNodeId: string, bonus: number) => {
    const nextScore = accumulatedScore + bonus;
    setAccumulatedScore(nextScore);
    setStepsCompleted((prev) => prev + 1);
    setCurrentNodeId(nextNodeId);

    const nextNode = nodes[nextNodeId];
    if (nextNode?.isTerminal) {
      const finalScore = Math.min(100, Math.max(50, nextScore));
      onFinish(finalScore, 100);
    }
  };

  const handleRestart = () => {
    setCurrentNodeId('step1');
    setAccumulatedScore(0);
    setStepsCompleted(1);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
        <div>
          <span className="text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            SIMULASI 5 TAHAP MUSYAWARAH MUFAKAT
          </span>
          <h3 className="font-display text-xl font-bold text-slate-900 mt-1">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ikuti alur demokratis pengambilan keputusan bersama secara santun dan adil.
          </p>
        </div>

        <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
          Langkah {Math.min(stepsCompleted, 5)} dari 5
        </span>
      </div>

      {/* 5-Step Visual Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {stagesList.map((st, idx) => {
          const isPassed = stepsCompleted > idx + 1;
          const isCurrent = stepsCompleted === idx + 1;

          return (
            <div
              key={st.id}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                isCurrent
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xs scale-105'
                  : isPassed
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
            >
              <span className="text-[10px] font-bold block uppercase tracking-wider">
                Tahap {st.id}
              </span>
              <span className="text-[11px] font-semibold line-clamp-1 block mt-0.5">
                {st.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current Scenario Card */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl shrink-0">
            🤝
          </div>
          <div>
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-1">
              {currentNode.stageLabel || 'Situasi Musyawarah'}
            </span>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {currentNode.scenario}
            </p>
          </div>
        </div>
      </div>

      {/* Terminal Outcome or Options */}
      {currentNode.isTerminal ? (
        <div className="text-center py-4 bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-3xl bg-amber-100">
            {currentNode.outcome === 'success' ? '🎉' : '💡'}
          </div>
          <h4 className="font-display text-lg font-bold text-slate-900 mb-1">
            {currentNode.outcome === 'success' ? 'Mufakat Berhasil Dicapai!' : 'Refleksi Musyawarah'}
          </h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
            {currentNode.finalFeedback}
          </p>

          <button
            type="button"
            onClick={handleRestart}
            className="px-5 py-2.5 bg-[#4D96FF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            🔄 Ulangi Simulasi Musyawarah
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700">PILIH SIKAP DAN TINDAKANMU:</h4>
          {currentNode.choices?.map((choice: any, idx: number) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChoice(choice.nextNode, choice.scoreBonus || 0)}
              className="w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/50 transition-all text-xs text-slate-800 font-medium flex items-center justify-between group cursor-pointer shadow-2xs"
            >
              <span className="flex-1">{choice.text}</span>
              <span className="text-[#4D96FF] text-base group-hover:translate-x-1 transition-transform ml-3">
                ➔
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// SUB-COMPONENT: QUESTION SET / QUIZ PLAYER
// ==========================================
interface QuestionSetProps {
  content: any;
  title: string;
  onFinish: (score: number, maxScore: number) => void;
}

const QuestionSetPlayer: React.FC<QuestionSetProps> = ({ content, title, onFinish }) => {
  const questions = content.questions || [];
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [hasCheckedCurrent, setHasCheckedCurrent] = useState<boolean>(false);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelect = (optIdx: number) => {
    if (hasCheckedCurrent) return;
    setSelectedOptions((prev) => ({ ...prev, [currentIdx]: optIdx }));
  };

  const handleCheckAnswer = () => {
    setHasCheckedCurrent(true);
    const chosenIdx = selectedOptions[currentIdx];
    if (chosenIdx !== undefined && currentQ.options[chosenIdx]?.isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setHasCheckedCurrent(false);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsQuizComplete(true);
      const totalScore = Math.round(
        (Math.max(1, correctAnswersCount + (currentQ.options[selectedOptions[currentIdx]]?.isCorrect ? 1 : 0)) /
          questions.length) *
          100
      );
      onFinish(Math.min(100, totalScore), 100);
    }
  };

  const handleResetQuiz = () => {
    setCurrentIdx(0);
    setSelectedOptions({});
    setHasCheckedCurrent(false);
    setIsQuizComplete(false);
    setCorrectAnswersCount(0);
  };

  if (isQuizComplete) {
    const finalScore = Math.round((correctAnswersCount / questions.length) * 100);
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center max-w-lg mx-auto shadow-sm">
        <div className="w-16 h-16 mx-auto mb-3 bg-amber-100 rounded-full flex items-center justify-center text-3xl">
          🌟
        </div>
        <h3 className="font-display text-xl font-bold text-slate-900 mb-1">
          {finalScore >= 70 ? '🎉 Hebat! Kamu Sahabat Penegak Norma' : '💡 Usaha yang Bagus!'}
        </h3>
        <p className="text-xs text-slate-600 mb-6">
          Kamu telah menyelesaikan seluruh pertanyaan evaluasi situasional dengan baik.
        </p>

        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 mb-6">
          <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums block">
            {correctAnswersCount}/{questions.length} Benar
          </span>
          <span className="text-xs text-amber-800 font-bold font-mono">
            Nilai Akhir: {finalScore}/100
          </span>
        </div>

        <button
          type="button"
          onClick={handleResetQuiz}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
        >
          🔄 Coba Lagi Kuis Ini
        </button>
      </div>
    );
  }

  const chosenOptionIdx = selectedOptions[currentIdx];
  const chosenOption = chosenOptionIdx !== undefined ? currentQ.options[chosenOptionIdx] : null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div>
          <span className="text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            TANTANGAN KUIS EVALUASI
          </span>
          <h3 className="font-display text-lg font-bold text-slate-900 mt-1">{title}</h3>
        </div>
        <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
          Soal {currentIdx + 1} dari {questions.length}
        </span>
      </div>

      {/* Question Text */}
      <h4 className="font-display text-base font-bold text-slate-900 mb-4 leading-relaxed">
        {currentQ.question}
      </h4>

      {/* Options List */}
      <div className="space-y-2.5 mb-6">
        {currentQ.options?.map((opt: any, optIdx: number) => {
          const isSelected = chosenOptionIdx === optIdx;

          return (
            <button
              key={optIdx}
              type="button"
              onClick={() => handleSelect(optIdx)}
              disabled={hasCheckedCurrent}
              className={`w-full text-left p-4 rounded-2xl border text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? hasCheckedCurrent
                    ? opt.isCorrect
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                      : 'bg-red-100 border-red-400 text-red-950 font-bold'
                    : 'bg-blue-50 border-blue-400 text-blue-950 font-bold'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
              }`}
            >
              <span>{opt.text}</span>
              {isSelected && !hasCheckedCurrent && <span>👉</span>}
              {hasCheckedCurrent && opt.isCorrect && <span className="text-emerald-700 font-bold">✓ Tepat</span>}
            </button>
          );
        })}
      </div>

      {/* Immediate Child-Friendly Feedback */}
      {hasCheckedCurrent && chosenOption && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-slate-800 animate-in fade-in duration-150">
          <p className="font-bold text-slate-900 mb-1">
            {chosenOption.isCorrect ? '🎉 Hebat! Pilihanmu tepat.' : '💡 Perhatikan penjelasannya:'}
          </p>
          <p className="text-slate-700">{chosenOption.feedback}</p>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex justify-end pt-4 border-t border-slate-100">
        {!hasCheckedCurrent ? (
          <button
            type="button"
            onClick={handleCheckAnswer}
            disabled={chosenOptionIdx === undefined}
            className="px-6 py-2.5 bg-[#4D96FF] hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            ✓ Periksa Jawaban
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 bg-[#6BCB77] hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            {currentIdx < questions.length - 1 ? 'Soal Berikutnya ➔' : 'Selesaikan Kuis 🏆'}
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// SUB-COMPONENT: LUMI CLOUD EMBED PLAYER
// ==========================================
interface LumiEmbedProps {
  packageData: H5PContentPackage;
  onFinish: (score: number, maxScore: number) => void;
  onSwitchToInternal: () => void;
  hasInternalPlayer: boolean;
}

const LumiEmbedPlayer: React.FC<LumiEmbedProps> = ({
  packageData,
  onFinish,
  onSwitchToInternal,
  hasInternalPlayer,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [reportedScore, setReportedScore] = useState<number>(100);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasAutoCaptured, setHasAutoCaptured] = useState(false);

  // Load Lumi resizer script dynamically
  useEffect(() => {
    const existing = document.querySelector('script[src*="h5p-resizer.js"]');
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://app.Lumi.education/api/v1/h5p/core/js/h5p-resizer.js';
      script.charset = 'UTF-8';
      script.async = true;
      document.body.appendChild(script);
    }

    // Listen for H5P / xAPI postMessage events from the Lumi iframe
    const handleMessage = (event: MessageEvent) => {
      try {
        if (!event.data) return;
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data?.context === 'h5p' || data?.event === 'xAPI' || data?.statement) {
          const statement = data.statement || data;
          if (statement?.result) {
            const raw = statement.result.score?.raw;
            const max = statement.result.score?.max || 100;
            if (raw !== undefined) {
              setReportedScore(Math.round(raw));
              setHasAutoCaptured(true);
              setIsCompleted(true);
              onFinish(Math.round(raw), max);
            }
          }
        }
      } catch {
        // ignore non-JSON or other postMessages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onFinish]);

  const handleManualComplete = (score: number = 100) => {
    setReportedScore(score);
    setIsCompleted(true);
    onFinish(score, 100);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm">
      {/* Top Bar for Lumi Embed */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
              <span>🌐</span>
              <span>Lumi Education Cloud</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">Media Interaktif</span>
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900">
            {packageData.title || 'Aktivitas Belajar Interaktif'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {hasInternalPlayer && (
            <button
              type="button"
              onClick={onSwitchToInternal}
              className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              title="Beralih ke mode interaktif internal"
            >
              <span>Mode Interaktif Internal</span>
            </button>
          )}

          {packageData.embedUrl && (
            <a
              href={packageData.embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs transition-colors"
              title="Buka Layar Penuh"
            >
              ↗
            </a>
          )}
        </div>
      </div>

      {/* Iframe Viewport Container */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 min-h-[580px] sm:min-h-[680px]">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-xs z-10 p-6 text-center">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
            <h4 className="font-bold text-sm text-slate-800 mb-1">
              Memuat Media Pembelajaran Interaktif...
            </h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Menyiapkan aktivitas belajar interaktif.
            </p>
          </div>
        )}

        <iframe
          src={packageData.embedUrl}
          title={packageData.title || 'Aktivitas Belajar Interaktif'}
          className="w-full min-h-[580px] sm:min-h-[680px] h-full border-0 rounded-2xl"
          allow="geolocation *; microphone *; camera *; midi *; encrypted-media *"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Completion & Score Reporter Bar */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-600">
          {hasAutoCaptured ? (
            <span className="text-emerald-700 font-bold flex items-center gap-1.5">
              <span>✓</span>
              <span>Skor {reportedScore}/100 berhasil dicatat!</span>
            </span>
          ) : (
            <span>
              Selesaikan interaksi di atas, lalu laporkan nilaimu untuk melanjutkan misi.
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isCompleted ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleManualComplete(100)}
                className="px-5 py-2.5 bg-[#6BCB77] hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <span>✓</span>
                <span>Selesai & Simpan Nilai (100)</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                ✓ Aktivitas Tercatat Selesai ({reportedScore}/100)
              </span>
              <button
                type="button"
                onClick={() => handleManualComplete(100)}
                className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                Kirim Ulang
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
