import JSZip from 'jszip';

export interface SampleH5POption {
  id: string;
  name: string;
  filename: string;
  library: string;
  description: string;
  title: string;
  contentData: any;
}

export const SAMPLE_H5P_PACKAGES: SampleH5POption[] = [
  {
    id: 'misi1_mengenal_norma',
    name: 'Misi 1: Mencocokkan 4 Norma (Agama, Kesusilaan, Kesopanan, Hukum)',
    filename: 'Misi1_Mengenal_Norma_Kelas_V.h5p',
    library: 'H5P.DragQuestion 1.14',
    description: 'Aktivitas mengidentifikasi dan mencocokkan contoh perilaku nyata dengan 4 jenis norma.',
    title: 'Aktivitas Membedakan 4 Jenis Norma',
    contentData: {
      type: 'drag_and_drop',
      instructions: 'Tarik setiap kartu contoh perilaku ke kotak jenis norma yang sesuai!',
      zones: [
        { id: 'norma_agama', label: 'Norma Agama', hint: 'Berasal dari wahyu Tuhan Yang Maha Esa' },
        { id: 'norma_kesusilaan', label: 'Norma Kesusilaan', hint: 'Berasal dari hati nurani (kejujuran)' },
        { id: 'norma_kesopanan', label: 'Norma Kesopanan', hint: 'Tata krama dan adat pergaulan sehari-hari' },
        { id: 'norma_hukum', label: 'Norma Hukum', hint: 'Aturan tertulis resmi dengan sanksi tegas' },
      ],
      items: [
        { id: 'n1', text: 'Melaksanakan ibadah tepat waktu sesuai keyakinan', correctZone: 'norma_agama' },
        { id: 'n2', text: 'Mengembalikan uang kembalian yang berlebih kepada pedagang', correctZone: 'norma_kesusilaan' },
        { id: 'n3', text: 'Menyapa bapak/ibu guru dengan menundukkan badan dan sopan', correctZone: 'norma_kesopanan' },
        { id: 'n4', text: 'Memakai helm standar saat dibonceng sepeda motor', correctZone: 'norma_hukum' },
        { id: 'n5', text: 'Tidak berbohong saat ditanya oleh orang tua', correctZone: 'norma_kesusilaan' },
        { id: 'n6', text: 'Menyeberang jalan raya di zebra cross dan jembatan penyeberangan', correctZone: 'norma_hukum' },
        { id: 'n7', text: 'Makan dan minum sambil duduk serta menggunakan tangan kanan', correctZone: 'norma_kesopanan' },
        { id: 'n8', text: 'Menghormati teman yang sedang berdoa sebelum makan siang', correctZone: 'norma_agama' },
      ],
    },
  },
  {
    id: 'misi2_hak_kewajiban',
    name: 'Misi 2: Mengelompokkan Hak & Kewajiban di Rumah dan Sekolah',
    filename: 'Misi2_Hak_dan_Kewajiban_Kelas_V.h5p',
    library: 'H5P.DragQuestion 1.14',
    description: 'Aktivitas membedakan hak (sesuatu yang diterima) dan kewajiban (sesuatu yang harus dilakukan).',
    title: 'Pengelompokan Hak vs Kewajiban Siswa',
    contentData: {
      type: 'drag_and_drop',
      instructions: 'Kelompokkan kartu berikut ke kotak Hak atau Kewajiban!',
      zones: [
        { id: 'zone_hak', label: 'Hak (Harus Diterima)', hint: 'Sesuatu yang patut kita peroleh untuk tumbuh dan belajar' },
        { id: 'zone_kewajiban', label: 'Kewajiban (Wajib Dilakukan)', hint: 'Tanggung jawab yang harus dikerjakan dengan sungguh-sungguh' },
      ],
      items: [
        { id: 'hk1', text: 'Mendapatkan bimbingan dan penjelasan pelajaran dari guru', correctZone: 'zone_hak' },
        { id: 'hk2', text: 'Mendengarkan penjelasan guru saat jam pelajaran berlangsung', correctZone: 'zone_kewajiban' },
        { id: 'hk3', text: 'Mendapatkan kasih sayang dan perlindungan dari orang tua', correctZone: 'zone_hak' },
        { id: 'hk4', text: 'Merapikan kamar tidur dan membantu menjaga kebersihan rumah', correctZone: 'zone_kewajiban' },
        { id: 'hk5', text: 'Memakai seragam sekolah yang rapi sesuai jadwal', correctZone: 'zone_kewajiban' },
        { id: 'hk6', text: 'Menggunakan fasilitas perpustakaan sekolah dengan nyaman', correctZone: 'zone_hak' },
      ],
    },
  },
  {
    id: 'misi3_pohon_norma',
    name: 'Misi 3: Pohon Normaku (Rumah, Sekolah, Lingkungan)',
    filename: 'Misi3_Pohon_Normaku_Kelas_V.h5p',
    library: 'H5P.DragQuestion 1.14',
    description: 'Menyajikan hasil identifikasi penerapan norma ke dalam dahan pohon norma digital.',
    title: 'Pohon Normaku: Dahan Rumah, Sekolah, dan Lingkungan',
    contentData: {
      type: 'pohon_norma',
      instructions: 'Tempatkan daun norma ke cabang pohon yang tepat: Rumah, Sekolah, atau Lingkungan!',
      zones: [
        { id: 'dahan_rumah', label: 'Dahan Rumah', hint: 'Norma dan aturan bersama keluarga di rumah' },
        { id: 'dahan_sekolah', label: 'Dahan Sekolah', hint: 'Norma dan aturan bersama warga sekolah' },
        { id: 'dahan_lingkungan', label: 'Dahan Lingkungan', hint: 'Norma bermasyarakat bersama tetangga' },
      ],
      items: [
        { id: 'pn1', text: 'Berpamitan dan mencium tangan orang tua sebelum bepergian', correctZone: 'dahan_rumah' },
        { id: 'pn2', text: 'Datang ke sekolah tepat waktu sebelum bel masuk berbunyi', correctZone: 'dahan_sekolah' },
        { id: 'pn3', text: 'Membuang sampah pada tempatnya saat bermain di taman desa', correctZone: 'dahan_lingkungan' },
        { id: 'pn4', text: 'Menghargai ketenangan tetangga yang sedang istirahat', correctZone: 'dahan_lingkungan' },
        { id: 'pn5', text: 'Mengikuti upacara bendera hari Senin dengan khidmat', correctZone: 'dahan_sekolah' },
        { id: 'pn6', text: 'Menjaga kerukunan dan membantu adik belajar di rumah', correctZone: 'dahan_rumah' },
      ],
    },
  },
  {
    id: 'misi4_praktik_norma',
    name: 'Misi 4: Praktik Norma: Sikap Saat Diskusi Kelompok',
    filename: 'Misi4_Praktik_Norma_Kelas_V.h5p',
    library: 'H5P.BranchingScenario 1.5',
    description: 'Skenario situasi sehari-hari: Menentukan tindakan santun ketika teman sedang berbicara dalam diskusi kelompok.',
    title: 'Praktik Norma: Etika Berbicara dan Mendengarkan',
    contentData: {
      type: 'branching_scenario',
      title: 'Situasi Nyata: Diskusi Kelompok Kelas V',
      intro: 'Kamu sedang melakukan kerja kelompok Pendidikan Pancasila. Saat salah satu temanmu (Beni) sedang mengemukakan pendapatnya, ada usulan yang berbeda dari pemikiranmu.',
      nodes: {
        start: {
          id: 'start',
          scenario: 'Temanmu sedang berbicara ketika diskusi kelompok berlangsung. Apa yang sebaiknya kamu lakukan?',
          choices: [
            {
              text: 'Mendengarkan Beni sampai selesai berbicara terlebih dahulu, baru kemudian mengangkat tangan dengan sopan untuk menyampaikan usulan.',
              nextNode: 'good_listening',
              scoreBonus: 50,
            },
            {
              text: 'Langsung memotong pembicaraan Beni dengan suara keras karena pendapatmu terasa lebih hebat.',
              nextNode: 'bad_interrupt',
              scoreBonus: 10,
            },
            {
              text: 'Mengabaikan Beni dan mengobrol sendiri dengan teman sebangku.',
              nextNode: 'bad_ignore',
              scoreBonus: 10,
            },
          ],
        },
        good_listening: {
          id: 'good_listening',
          scenario: 'Beni merasa sangat dihargai. Sekarang giliranmu menyampaikan pendapat. Bagaimana caramu berbicara?',
          choices: [
            {
              text: 'Menyampaikan alasan dengan santun, menggunakan kata-kata yang baik tanpa merendahkan pendapat Beni.',
              nextNode: 'success_norma',
              scoreBonus: 50,
            },
            {
              text: 'Mengatakan bahwa usulan Beni salah dan tidak boleh dipakai.',
              nextNode: 'harsh_speech',
              scoreBonus: 20,
            },
          ],
        },
        bad_interrupt: {
          id: 'bad_interrupt',
          scenario: 'Beni terkejut dan merasa tersinggung. Diskusi kelompok terhenti karena suasana menjadi kurang nyaman. Norma kesopanan mengingatkan kita untuk tidak memotong pembicaraan orang lain.',
          choices: [
            {
              text: 'Sadar bahwa tindakan itu keliru, lalu meminta maaf dan mempersilakan Beni melanjutkan bicaranya.',
              nextNode: 'good_listening',
              scoreBonus: 30,
            },
            {
              text: 'Tetap ngotot dan tidak mau mengalah.',
              nextNode: 'selfish_end',
              scoreBonus: 10,
            },
          ],
        },
        bad_ignore: {
          id: 'bad_ignore',
          scenario: 'Kelompokmu tidak dapat menyelesaikan tugas tepat waktu karena kurang kerja sama dan tidak fokus.',
          isTerminal: true,
          outcome: 'learning',
          finalFeedback: 'Belajar bersama membutuhkan kerja sama dan rasa hormat pada teman yang sedang berbicara.',
        },
        harsh_speech: {
          id: 'harsh_speech',
          scenario: 'Pendapatmu mungkin bagus, namun penyampaian yang kasar melanggar norma kesopanan dan membuat teman merasa sedih.',
          isTerminal: true,
          outcome: 'learning',
          finalFeedback: 'Ingat norma kesopanan: Gunakan bahasa yang santun agar suasana belajar tetap sejuk dan harmonis.',
        },
        success_norma: {
          id: 'success_norma',
          scenario: 'Luar biasa! Kelompokmu berhasil memadukan pendapat Beni dan usulanmu menjadi karya yang hebat. Guru mengapresiasi kerja sama kalian!',
          isTerminal: true,
          outcome: 'success',
          finalFeedback: 'Kamu berhasil mempraktikkan norma kesopanan dan kesusilaan dalam kehidupan sehari-hari.',
        },
        selfish_end: {
          id: 'selfish_end',
          scenario: 'Sikap egois membuat kelompok terpecah. Norma hadir agar pergaulan kita berjalan rukun dan damai.',
          isTerminal: true,
          outcome: 'learning',
          finalFeedback: 'Refleksi: Mematuhi norma kesopanan adalah kunci terciptanya kerukunan.',
        },
      },
    },
  },
  {
    id: 'misi5_musyawarah',
    name: 'Misi 5: Ayo Bermusyawarah: Alur 5 Tahap Pengambilan Keputusan',
    filename: 'Misi5_Ayo_Bermusyawarah_Kelas_V.h5p',
    library: 'H5P.BranchingScenario 1.5',
    description: 'Mempraktikkan alur musyawarah: Mendengarkan -> Menyampaikan -> Mempertimbangkan -> Mengambil Keputusan -> Membuat Kesepakatan.',
    title: 'Simulasi Musyawarah Pembagian Tugas Kebersihan Kelas',
    contentData: {
      type: 'musyawarah_flow',
      title: 'Musyawarah Kelas V: Menentukan Jadwal & Petugas Kebersihan',
      intro: 'Hari Jumat ini kelas V-A akan mengadakan kerja bakti besar. Ketua kelas membuka forum musyawarah untuk menentukan pembagian regu piket.',
      nodes: {
        step1: {
          id: 'step1',
          stageLabel: 'Tahap 1: Mendengarkan Pendapat',
          scenario: 'Siti mengusulkan agar regu piket dibagi berdasarkan baris meja, sedangkan Made mengusulkan dibagi campuran laki-laki dan perempuan agar seimbang. Apa sikapmu?',
          choices: [
            {
              text: 'Mendengarkan kedua usulan dengan tertib dan mencatat kelebihan masing-masing usulan.',
              nextNode: 'step2',
              scoreBonus: 25,
            },
            {
              text: 'Hanya membela usulan Siti karena Siti teman dekatmu tanpa melihat alasan yang adil.',
              nextNode: 'fail_favoritism',
              scoreBonus: 5,
            },
          ],
        },
        step2: {
          id: 'step2',
          stageLabel: 'Tahap 2: Menyampaikan Pendapat',
          scenario: 'Sekarang ketua kelas memberi kesempatan pada siswa lain untuk berpendapat. Bagaimana caramu menyampaikan pandangan?',
          choices: [
            {
              text: 'Mengangkat tangan terlebih dahulu, lalu berbicara dengan ramah dan mengapresiasi usulan teman sebelumnya.',
              nextNode: 'step3',
              scoreBonus: 25,
            },
            {
              text: 'Berbicara langsung tanpa menunggu izin dari ketua kelas.',
              nextNode: 'fail_disorder',
              scoreBonus: 10,
            },
          ],
        },
        step3: {
          id: 'step3',
          stageLabel: 'Tahap 3: Mempertimbangkan Pilihan Bersama',
          scenario: 'Semua usulan sudah terkumpul di papan tulis. Usulan campuran dinilai paling adil agar beban tugas merata. Bagaimana kamu menyikapinya?',
          choices: [
            {
              text: 'Menyetujui pertimbangan tersebut demi kepentingan bersama seluruh kelas.',
              nextNode: 'step4',
              scoreBonus: 25,
            },
            {
              text: 'Menolak dan memaksakan kehendak sendiri walaupun teman-teman sudah sepakat.',
              nextNode: 'fail_stubborn',
              scoreBonus: 5,
            },
          ],
        },
        step4: {
          id: 'step4',
          stageLabel: 'Tahap 4 & 5: Mengambil Keputusan & Melaksanakan Kesepakatan',
          scenario: 'Ketua kelas mengetuk palu mufakat. Jadwal piket regu campuran resmi disepakati bersama. Apa yang akan kamu lakukan?',
          choices: [
            {
              text: 'Menerima keputusan musyawarah dengan lapang dada dan melaksanakan tugas piket dengan penuh tanggung jawab.',
              nextNode: 'success_mufakat',
              scoreBonus: 25,
            },
            {
              text: 'Menggerutu dan berniat datang terlambat saat jadwal piket tiba.',
              nextNode: 'fail_irresponsible',
              scoreBonus: 0,
            },
          ],
        },
        success_mufakat: {
          id: 'success_mufakat',
          scenario: 'Selamat! Kamu telah berhasil menempuh 5 alur musyawarah mufakat yang beradab. Kelas V-A bersih, rapi, dan semua siswa rukun bahagia!',
          isTerminal: true,
          outcome: 'success',
          finalFeedback: 'Mendengarkan ➔ Menyampaikan ➔ Mempertimbangkan ➔ Memutuskan ➔ Melaksanakan Kesepakatan.',
        },
        fail_favoritism: {
          id: 'fail_favoritism',
          scenario: 'Dalam musyawarah, kita harus mengutamakan keadilan dan kebaikan bersama, bukan sekadar memihak teman dekat.',
          isTerminal: true,
          outcome: 'learning',
          finalFeedback: 'Musyawarah adalah jalan menemukan keputusan yang adil bagi seluruh warga kelas.',
        },
        fail_disorder: {
          id: 'fail_disorder',
          scenario: 'Berbicara tanpa aturan membuat musyawarah menjadi gaduh dan tidak terarah.',
          isTerminal: true,
          outcome: 'learning',
          finalFeedback: 'Ingat norma kesopanan: angkat tangan dan tunggu giliran untuk berbicara.',
        },
        fail_stubborn: {
          id: 'fail_stubborn',
          scenario: 'Memaksakan kehendak bertentangan dengan semangat musyawarah mufakat.',
          isTerminal: true,
          outcome: 'learning',
          finalFeedback: 'Sikap lapang dada dan menghargai kesepakatan bersama adalah ciri anak berbudi pekerti luhur.',
        },
        fail_irresponsible: {
          id: 'fail_irresponsible',
          scenario: 'Keputusan musyawarah wajib dilaksanakan dengan ikhlas oleh seluruh pihak, termasuk yang awalnya berbeda pendapat.',
          isTerminal: true,
          outcome: 'learning',
          finalFeedback: 'Kewajiban warga kelas adalah bertanggung jawab atas kesepakatan bersama.',
        },
      },
    },
  },
  {
    id: 'misi6_tantangan_akhir',
    name: 'Misi 6: Tantangan Akhir: Asesmen Situasional',
    filename: 'Misi6_Tantangan_Akhir_Kelas_V.h5p',
    library: 'H5P.QuestionSet 1.20',
    description: 'Uji pemahaman komprehensif: Mengenali norma, hak, kewajiban, tindakan nyata, dan musyawarah.',
    title: 'Tantangan Akhir: Sahabat Penegak Norma',
    contentData: {
      type: 'quiz',
      questions: [
        {
          question: '1. Mengapa dalam kehidupan keluarga, sekolah, dan masyarakat kita memerlukan norma?',
          options: [
            { text: 'Agar tercipta ketertiban, keamanan, keadilan, dan kerukunan bersama', isCorrect: true, feedback: 'Tepat sekali! Tanpa norma, kehidupan menjadi kacau dan tidak teratur.' },
            { text: 'Agar anak-anak merasa takut dan selalu diawasi orang dewasa', isCorrect: false, feedback: 'Kurang tepat. Norma bukan untuk menakut-nakuti, melainkan untuk kebaikan bersama.' },
            { text: 'Supaya salah satu kelompok dapat menguasai kelompok yang lain', isCorrect: false, feedback: 'Salah. Norma berlaku adil bagi semua orang tanpa membedakan.' },
          ],
        },
        {
          question: '2. Contoh penerapan norma kesusilaan yang bersumber dari hati nurani manusia adalah...',
          options: [
            { text: 'Merasakan penyesalan mendalam dan meminta maaf ketika berbuat salah atau berbohong', isCorrect: true, feedback: 'Hebat! Norma kesusilaan bekerja melalui suara hati nurani.' },
            { text: 'Membayar denda tilang kepada polisi lalu lintas', isCorrect: false, feedback: 'Itu adalah contoh norma hukum.' },
            { text: 'Makan dengan tangan kanan sambil duduk', isCorrect: false, feedback: 'Itu adalah contoh norma kesopanan.' },
          ],
        },
        {
          question: '3. Di bawah ini yang merupakan hak siswa di sekolah yang harus dipenuhi adalah...',
          options: [
            { text: 'Mendapatkan lingkungan belajar yang aman, nyaman, dan bersih', isCorrect: true, feedback: 'Bagus! Ini adalah hak setiap peserta didik di sekolah.' },
            { text: 'Boleh tidak mengerjakan PR jika merasa lelah', isCorrect: false, feedback: 'Mengerjakan PR adalah kewajiban siswa.' },
            { text: 'Bebas datang terlambat ke sekolah sesuka hati', isCorrect: false, feedback: 'Tertib waktu adalah kewajiban tata tertib sekolah.' },
          ],
        },
        {
          question: '4. Apa yang membedakan musyawarah mufakat dengan voting suara terbanyak?',
          options: [
            { text: 'Musyawarah mengutamakan pembahasan bersama sampai tercapai kesepakatan bulat yang disetujui semua pihak', isCorrect: true, feedback: 'Tepat! Musyawarah mufakat mengedepankan kebijaksanaan dan kebersamaan.' },
            { text: 'Musyawarah hanya boleh diputuskan oleh ketua kelas saja', isCorrect: false, feedback: 'Tidak benar. Semua anggota berhak berpartisipasi dalam musyawarah.' },
            { text: 'Musyawarah dilakukan dengan cara saling mengadu kekuatan suara', isCorrect: false, feedback: 'Itu bukan musyawarah mufakat yang beradab.' },
          ],
        },
      ],
    },
  },
];

/**
 * Creates a real valid .h5p ZIP blob on the client-side for testing Lumi export
 */
export async function generateSampleH5PZip(sampleId: string): Promise<{ blob: Blob; filename: string }> {
  const sample = SAMPLE_H5P_PACKAGES.find(s => s.id === sampleId) || SAMPLE_H5P_PACKAGES[0];
  const zip = new JSZip();

  // Create h5p.json manifest
  const h5pManifest = {
    title: sample.title,
    mainLibrary: sample.library,
    language: 'id',
    preloadedDependencies: [
      { machineName: sample.library.split(' ')[0], majorVersion: 1, minorVersion: 5 },
      { machineName: 'FontAwesome', majorVersion: 4, minorVersion: 5 },
      { machineName: 'H5P.JoubelUI', majorVersion: 1, minorVersion: 3 },
    ],
    author: 'Guru Pendidikan Pancasila Kelas V (Lumi Export)',
    license: 'CC BY-SA 4.0',
    description: sample.description,
  };

  zip.file('h5p.json', JSON.stringify(h5pManifest, null, 2));

  // Create content/content.json
  const contentFolder = zip.folder('content');
  if (contentFolder) {
    contentFolder.file('content.json', JSON.stringify(sample.contentData, null, 2));
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  return { blob, filename: sample.filename };
}
