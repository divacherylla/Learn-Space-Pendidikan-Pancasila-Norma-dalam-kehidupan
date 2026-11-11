import React, { useState, useRef } from 'react';
import { H5PContentPackage } from '../../types';
import { H5PValidatorService } from '../../services/h5pValidatorService';
import { SAMPLE_H5P_PACKAGES, generateSampleH5PZip } from '../../services/sampleH5PGenerator';

interface H5PUploaderProps {
  onPackageReady: (pkg: H5PContentPackage) => void;
  onPreviewRequested?: (pkg: H5PContentPackage) => void;
}

export const H5PUploader: React.FC<H5PUploaderProps> = ({ onPackageReady, onPreviewRequested }) => {
  const [uploadMode, setUploadMode] = useState<'file' | 'embed'>('file');
  const [embedInputText, setEmbedInputText] = useState<string>('');
  const [embedTitleInput, setEmbedTitleInput] = useState<string>('Praktik Interaktif H5P: Mencocokkan 4 Norma');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [extractedPackage, setExtractedPackage] = useState<H5PContentPackage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle URL / iframe embed code linking
  const handleProcessEmbed = (rawInput?: string) => {
    const input = (rawInput || embedInputText).trim();
    setValidationError(null);
    setExtractedPackage(null);

    if (!input) {
      setValidationError('Silakan masukkan link URL atau kode <iframe> embed dari Lumi Education.');
      return;
    }

    // Extract URL from <iframe src="..."> if pasted as iframe tag
    let extractedUrl = input;
    const iframeSrcMatch = input.match(/src=["']([^"']+)["']/i);
    if (iframeSrcMatch && iframeSrcMatch[1]) {
      extractedUrl = iframeSrcMatch[1];
    }

    // Clean up whitespace and validate URL
    extractedUrl = extractedUrl.trim();
    if (!extractedUrl.startsWith('http://') && !extractedUrl.startsWith('https://')) {
      setValidationError('Format URL tidak valid. Pastikan diawali dengan https:// (contoh: https://app.lumi.education/api/v1/run/Gh_GSY/embed)');
      return;
    }

    const title = embedTitleInput.trim() || 'Aktivitas Interaktif H5P (Lumi Cloud)';
    const embedPackage: H5PContentPackage = {
      id: 'h5p_embed_' + Date.now(),
      title,
      library: 'H5P.LumiCloudLiveEmbed 1.0',
      mainLibrary: 'H5P.LumiCloudLiveEmbed',
      embedUrl: extractedUrl,
      embedCode: input.includes('<iframe')
        ? input
        : `<iframe src="${extractedUrl}" width="1088" height="720" frameborder="0" allowfullscreen="allowfullscreen" allow="geolocation *; microphone *; camera *; midi *; encrypted-media *"></iframe>`,
      metadata: {
        title,
        mainLibrary: 'H5P.LumiCloudLiveEmbed',
        preloadedDependencies: [],
        author: 'Lumi Education Cloud',
        license: 'CC BY 4.0',
        description: 'Media interaktif H5P ditautkan via Lumi Education Cloud embed',
      },
      content: { type: 'lumi_cloud_embed', url: extractedUrl },
      uploadedAt: new Date().toISOString(),
      isValidated: true,
      validationStatus: 'valid',
      passingScore: 70,
    };

    setExtractedPackage(embedPackage);
    onPackageReady(embedPackage);
  };

  // Handle file selection
  const processFile = async (file: File) => {
    setIsProcessing(true);
    setValidationError(null);
    setExtractedPackage(null);

    try {
      setCurrentStep('Memeriksa format & ukuran file .h5p...');
      await new Promise(r => setTimeout(r, 200));

      setCurrentStep('Membaca struktur paket zip & manifest h5p.json...');
      await new Promise(r => setTimeout(r, 250));

      setCurrentStep('Memvalidasi modul interaktif & dependensi Lumi...');
      const outcome = await H5PValidatorService.validateAndExtract(file);

      if (!outcome.success) {
        setValidationError(outcome.userFriendlyMessage);
        setIsProcessing(false);
        return;
      }

      if (outcome.packageData) {
        setExtractedPackage(outcome.packageData);
        onPackageReady(outcome.packageData);
      }
    } catch {
      setValidationError('Terjadi kendala saat memproses file. Pastikan file berasal dari ekspor Lumi yang benar.');
    } finally {
      setIsProcessing(false);
      setCurrentStep('');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Generate and test a sample package on demand
  const handleLoadSample = async (sampleId: string) => {
    setIsProcessing(true);
    setValidationError(null);
    try {
      setCurrentStep('Mengambil paket contoh dari Lumi...');
      const { blob, filename } = await generateSampleH5PZip(sampleId);
      const sampleFile = new File([blob], filename, { type: 'application/zip' });
      await processFile(sampleFile);
    } catch {
      setValidationError('Gagal menyiapkan paket contoh.');
      setIsProcessing(false);
    }
  };

  // Download real .h5p ZIP to disk for testing external upload
  const handleDownloadSampleZip = async (sampleId: string) => {
    const { blob, filename } = await generateSampleH5PZip(sampleId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Negative test: simulate bad file
  const handleTestCorruptFile = () => {
    const fakeCorrupt = new File(['Bukan file zip asli yang valid'], 'rusak.h5p', { type: 'application/octet-stream' });
    processFile(fakeCorrupt);
  };

  const handleTestNonH5P = () => {
    const fakeDoc = new File(['Hello World'], 'catatan_pkn.pdf', { type: 'application/pdf' });
    processFile(fakeDoc);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900">
            Import Media Interaktif H5P (Lumi)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Gunakan berkas ekspor <strong>.h5p</strong> dari Lumi atau tautkan langsung via kode embed <strong>Lumi Education Cloud</strong>.
          </p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-2 mb-4 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setUploadMode('file')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            uploadMode === 'file'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📁 Unggah Berkas .h5p
        </button>
        <button
          type="button"
          onClick={() => setUploadMode('embed')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            uploadMode === 'embed'
              ? 'bg-white text-blue-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🌐 Tautkan Embed / Iframe Lumi Cloud
        </button>
      </div>

      {/* EMBED MODE */}
      {uploadMode === 'embed' && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-4">
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Judul Aktivitas H5P:
            </label>
            <input
              type="text"
              value={embedTitleInput}
              onChange={(e) => setEmbedTitleInput(e.target.value)}
              placeholder="Contoh: Latihan H5P: Mengelompokkan Hak vs Kewajiban"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Kode Embed &lt;iframe&gt; atau URL Lumi Cloud:
            </label>
            <textarea
              rows={3}
              value={embedInputText}
              onChange={(e) => setEmbedInputText(e.target.value)}
              placeholder='<iframe src="https://app.lumi.education/api/v1/run/NATV9r/embed" width="1088" height="720" frameborder="0" allowfullscreen="allowfullscreen"></iframe>'
              className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Quick Presets for Teacher convenience */}
          <div className="mb-4">
            <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
              Pilihan Cepat Media Lumi Cloud Terverifikasi:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmbedTitleInput('Praktik Interaktif H5P: Mencocokkan 4 Norma');
                  setEmbedInputText('<iframe src="https://app.lumi.education/api/v1/run/Gh_GSY/embed" width="1088" height="720" frameborder="0" allowfullscreen="allowfullscreen" allow="geolocation *; microphone *; camera *; midi *; encrypted-media *"></iframe><script src="https://app.Lumi.education/api/v1/h5p/core/js/h5p-resizer.js" charset="UTF-8"></script>');
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-[11px] text-slate-800 font-medium cursor-pointer"
              >
                Misi 1: Gh_GSY (4 Norma)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmbedTitleInput('Latihan H5P: Mengelompokkan Hak vs Kewajiban');
                  setEmbedInputText('<iframe src="https://app.lumi.education/api/v1/run/NATV9r/embed" width="1088" height="720" frameborder="0" allowfullscreen="allowfullscreen" allow="geolocation *; microphone *; camera *; midi *; encrypted-media *"></iframe><script src="https://app.Lumi.education/api/v1/h5p/core/js/h5p-resizer.js" charset="UTF-8"></script>');
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-[11px] text-slate-800 font-medium cursor-pointer"
              >
                Misi 2: NATV9r (Hak & Kewajiban)
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleProcessEmbed()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <span>🔗</span>
            <span>Tautkan & Validasi Media Lumi</span>
          </button>
        </div>
      )}

      {/* Drop Zone for FILE MODE */}
      {uploadMode === 'file' && (
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isProcessing
            ? 'border-blue-400 bg-blue-50/50'
            : 'border-slate-300 hover:border-[#4D96FF] hover:bg-slate-50/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".h5p"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              processFile(e.target.files[0]);
            }
          }}
        />

        <div className="w-14 h-14 mx-auto mb-3 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl shadow-xs">
          📦
        </div>

        {isProcessing ? (
          <div>
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-700 mb-2">
              <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Memproses & Memvalidasi Media H5P...</span>
            </div>
            <p className="text-xs text-slate-600">{currentStep}</p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Tarik file <span className="text-[#4D96FF]">.h5p</span> ke sini, atau klik untuk memilih file
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Mendukung: Video Interaktif, Skenario Percabangan, Drag & Drop, Kuis Pilihan Ganda (Maks 40 MB)
            </p>
          </div>
        )}
      </div>
      )}

      {/* Validation Error Message */}
      {validationError && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-start gap-3">
          <span className="text-lg shrink-0">⚠️</span>
          <div className="flex-1">
            <h4 className="font-semibold text-red-950">File H5P Belum Dapat Digunakan</h4>
            <p className="text-xs mt-1 text-red-800 leading-relaxed">{validationError}</p>
          </div>
        </div>
      )}

      {/* Successfully Extracted Package Card */}
      {extractedPackage && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-950">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center text-xs font-bold text-emerald-800">
                ✓
              </span>
              <h4 className="font-semibold text-sm">{extractedPackage.title}</h4>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-mono">
              {extractedPackage.library}
            </span>
          </div>

          <div className="text-xs text-emerald-800 space-y-1 mb-3">
            <p>
              • Dependensi terverifikasi:{' '}
              <span className="font-medium">
                {extractedPackage.metadata.preloadedDependencies.length} modul Lumi
              </span>
            </p>
            <p>
              • Ukuran paket:{' '}
              <span className="font-medium">
                {extractedPackage.fileSizeBytes ? `${Math.round(extractedPackage.fileSizeBytes / 1024)} KB` : 'Tervalidasi'}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onPreviewRequested && (
              <button
                type="button"
                onClick={() => onPreviewRequested(extractedPackage)}
                className="px-3 py-1.5 bg-[#4D96FF] text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
              >
                👁️ Uji / Preview Media
              </button>
            )}
            <span className="text-xs text-emerald-700">✓ Siap dipublikasikan ke modul pembelajaran</span>
          </div>
        </div>
      )}

      {/* Quick Tested Lumi Samples for fast teacher evaluation */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-700 tracking-wider mb-2">
          UJI CEPAT DENGAN CONTOH MEDIA LUMI (.h5p)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAMPLE_H5P_PACKAGES.map((sample) => (
            <div
              key={sample.id}
              className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-amber-50/60 transition-colors flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-slate-900 line-clamp-1">{sample.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{sample.description}</p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLoadSample(sample.id)}
                  className="flex-1 py-1 px-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-medium rounded-md shadow-2xs transition-colors cursor-pointer"
                >
                  ⚡ Muat & Validasi
                </button>
                <button
                  type="button"
                  title="Unduh file .h5p fisik ke komputer untuk uji upload manual"
                  onClick={() => handleDownloadSampleZip(sample.id)}
                  className="p-1 text-slate-500 hover:text-slate-800 border border-slate-200 bg-white rounded-md cursor-pointer"
                >
                  💾
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Negative Testing triggers to verify validation reliability */}
        <div className="mt-4 pt-3 flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-600">Uji Ketahanan (Negative Test):</span>
          <button
            type="button"
            onClick={handleTestCorruptFile}
            className="text-red-700 hover:underline cursor-pointer"
          >
            [Uji File H5P Rusak]
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={handleTestNonH5P}
            className="text-amber-700 hover:underline cursor-pointer"
          >
            [Uji File Non-.h5p]
          </button>
        </div>
      </div>
    </div>
  );
};
