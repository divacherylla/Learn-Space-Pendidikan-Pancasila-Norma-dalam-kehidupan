import JSZip from 'jszip';
import { H5PContentPackage, H5PMetadata, DevErrorLog } from '../types';

export interface ValidationOutcome {
  success: boolean;
  userFriendlyMessage: string;
  technicalDetails?: string;
  packageData?: H5PContentPackage;
  devLog?: DevErrorLog;
}

// Supported major H5P libraries from Lumi
export const SUPPORTED_H5P_LIBRARIES = [
  'H5P.InteractiveVideo',
  'H5P.BranchingScenario',
  'H5P.CoursePresentation',
  'H5P.DragQuestion',
  'H5P.MultiChoice',
  'H5P.QuestionSet',
  'H5P.Summary',
  'H5P.Blanks',
  'H5P.MemoryGame',
  'H5P.ImageHotspots',
];

export class H5PValidatorService {
  /**
   * Validates and extracts an uploaded .h5p file using JSZip
   */
  static async validateAndExtract(file: File): Promise<ValidationOutcome> {
    const timestamp = new Date().toISOString();

    // 1. File extension validation
    if (!file.name.toLowerCase().endsWith('.h5p')) {
      return {
        success: false,
        userFriendlyMessage: 'File H5P belum dapat digunakan. Pastikan file berakhiran format .h5p hasil ekspor dari Lumi.',
        technicalDetails: `Invalid file extension: expected .h5p, got ${file.name}`,
        devLog: {
          id: 'err_' + Date.now(),
          timestamp,
          code: 'H5P_INVALID_EXTENSION',
          message: `Attempted upload of non-.h5p file: ${file.name}`,
          details: `MIME type: ${file.type}, Size: ${file.size} bytes`,
          resolved: false,
        },
      };
    }

    // 2. File size validation (max 40MB, min 50 bytes)
    const MAX_SIZE_BYTES = 40 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return {
        success: false,
        userFriendlyMessage: 'Ukuran file H5P terlalu besar. Maksimal ukuran media yang disarankan adalah 40 MB agar siswa mudah mengaksesnya.',
        technicalDetails: `File size exceeded: ${file.size} > ${MAX_SIZE_BYTES}`,
        devLog: {
          id: 'err_' + Date.now(),
          timestamp,
          code: 'H5P_FILE_SIZE_LIMIT',
          message: `File size ${file.size} exceeds max limit of 40MB`,
          resolved: false,
        },
      };
    }

    if (file.size < 64) {
      return {
        success: false,
        userFriendlyMessage: 'File H5P kosong atau rusak. Silakan ekspor ulang materi dari Lumi.',
        technicalDetails: `File is too small (${file.size} bytes) to be a valid zip archive`,
        devLog: {
          id: 'err_' + Date.now(),
          timestamp,
          code: 'H5P_EMPTY_PACKAGE',
          message: `File is truncated or 0 bytes (${file.size} bytes)`,
          resolved: false,
        },
      };
    }

    // 3. Zip structure extraction & validation
    try {
      const zip = new JSZip();
      const zipContents = await zip.loadAsync(file);

      // Check h5p.json
      const h5pJsonFile = zipContents.file('h5p.json');
      if (!h5pJsonFile) {
        return {
          success: false,
          userFriendlyMessage: 'Struktur paket H5P tidak lengkap. File "h5p.json" tidak ditemukan di dalam paket Lumi.',
          technicalDetails: 'Missing h5p.json manifest in zip archive root',
          devLog: {
            id: 'err_' + Date.now(),
            timestamp,
            code: 'H5P_MISSING_MANIFEST',
            message: 'ZIP archive does not contain h5p.json',
            details: `Found files: ${Object.keys(zipContents.files).slice(0, 10).join(', ')}`,
            resolved: false,
          },
        };
      }

      // Read and parse h5p.json
      const h5pJsonText = await h5pJsonFile.async('text');
      let metadata: H5PMetadata;
      try {
        metadata = JSON.parse(h5pJsonText);
      } catch (parseErr) {
        return {
          success: false,
          userFriendlyMessage: 'Data pengaturan H5P rusak atau tidak dapat dibaca. Coba ekspor ulang dari Lumi.',
          technicalDetails: `Failed to parse h5p.json: ${(parseErr as Error).message}`,
          devLog: {
            id: 'err_' + Date.now(),
            timestamp,
            code: 'H5P_CORRUPTED_MANIFEST',
            message: 'Syntax error in h5p.json',
            details: (parseErr as Error).stack,
            resolved: false,
          },
        };
      }

      // Validate required metadata fields
      if (!metadata.title || !metadata.mainLibrary) {
        return {
          success: false,
          userFriendlyMessage: 'Informasi media H5P belum lengkap (judul atau jenis aktivitas tidak terdefinisi).',
          technicalDetails: `Invalid manifest: title="${metadata.title}", mainLibrary="${metadata.mainLibrary}"`,
          devLog: {
            id: 'err_' + Date.now(),
            timestamp,
            code: 'H5P_INVALID_METADATA',
            message: 'h5p.json is missing title or mainLibrary',
            resolved: false,
          },
        };
      }

      // Check content/content.json
      const contentJsonFile = zipContents.file('content/content.json') || zipContents.file('content.json');
      let contentData: any = {};
      if (contentJsonFile) {
        const contentText = await contentJsonFile.async('text');
        try {
          contentData = JSON.parse(contentText);
        } catch {
          return {
            success: false,
            userFriendlyMessage: 'Materi interaktif di dalam H5P tidak dapat diproses karena ada kesalahan data.',
            technicalDetails: 'Failed to parse content/content.json',
            devLog: {
              id: 'err_' + Date.now(),
              timestamp,
              code: 'H5P_CONTENT_PARSE_ERROR',
              message: 'Invalid JSON inside content/content.json',
              resolved: false,
            },
          };
        }
      } else {
        // Warning: content.json missing, generate empty fallback object
        contentData = { title: metadata.title, questions: [] };
      }

      // Clean main library name
      const mainLibClean = metadata.mainLibrary.split(' ')[0];
      const isKnownLibrary = SUPPORTED_H5P_LIBRARIES.some(lib => mainLibClean.startsWith(lib));

      const h5pPackage: H5PContentPackage = {
        id: 'h5p_' + Date.now(),
        title: metadata.title || file.name.replace('.h5p', ''),
        library: metadata.mainLibrary,
        mainLibrary: mainLibClean,
        metadata: {
          title: metadata.title,
          mainLibrary: metadata.mainLibrary,
          preloadedDependencies: metadata.preloadedDependencies || [],
          author: metadata.author || 'Guru PKn Kelas V',
          license: metadata.license || 'CC BY-SA 4.0',
          description: metadata.description || 'Media interaktif Pendidikan Pancasila Kelas V SD',
        },
        content: contentData,
        rawFileName: file.name,
        fileSizeBytes: file.size,
        uploadedAt: timestamp,
        isValidated: true,
        validationStatus: isKnownLibrary ? 'valid' : 'warning',
        validationErrors: isKnownLibrary
          ? []
          : [`Jenis library ${metadata.mainLibrary} belum sepenuhnya dioptimalkan, namun dapat dimuat dengan fallback player.`],
        passingScore: 70,
      };

      return {
        success: true,
        userFriendlyMessage: 'Media H5P berhasil divalidasi dan siap digunakan!',
        packageData: h5pPackage,
      };
    } catch (zipError) {
      return {
        success: false,
        userFriendlyMessage: 'File H5P tidak dapat dibuka. Pastikan file tidak rusak saat proses ekspor dari Lumi.',
        technicalDetails: (zipError as Error).message,
        devLog: {
          id: 'err_' + Date.now(),
          timestamp,
          code: 'H5P_ZIP_READ_ERROR',
          message: 'JSZip failed to read the package archive',
          details: (zipError as Error).stack,
          resolved: false,
        },
      };
    }
  }
}
