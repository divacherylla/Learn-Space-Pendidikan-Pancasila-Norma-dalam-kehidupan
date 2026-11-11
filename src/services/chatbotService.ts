import { ChatMessage } from '../types';

// Local pedagogical response engine for instant offline fallback
interface LocalRule {
  keywords: string[];
  response: string;
  quickAction?: { label: string; targetTab: string };
}

const LOCAL_KNOWLEDGE_RULES: LocalRule[] = [
  {
    keywords: ['apa itu norma', 'pengertian norma', 'maksud norma', 'definisi norma', 'norma adalah'],
    response: 'Norma adalah aturan atau pedoman perilaku dalam kehidupan bermasyarakat agar tercipta ketertiban, keadilan, dan kedamaian. Bayangkan kalau jalan raya tidak ada rambu lalu lintas, pasti kacau kan? Nah, norma menjaga kita tetap hidup rukun!',
    quickAction: { label: 'Buka Tutorial Mengenal Norma', targetTab: 'tutorial' }
  },
  {
    keywords: ['macam norma', 'jenis norma', '4 norma', 'empat norma', 'pembagian norma'],
    response: 'Ada 4 macam norma dalam kehidupan kita:\n1. Norma Agama (dari Tuhan)\n2. Norma Kesusilaan (dari hati nurani)\n3. Norma Kesopanan (dari adat & pergaulan)\n4. Norma Hukum (dibuat pemerintah/negara)\nSemuanya penting untuk ditaati ya!',
    quickAction: { label: 'Lihat Tutorial Norma', targetTab: 'tutorial' }
  },
  {
    keywords: ['norma agama', 'agama'],
    response: 'Norma agama adalah aturan hidup yang bersumber dari wahyu Tuhan Yang Maha Esa. Contohnya: rajin beribadah, saling menyayangi sesama ciptaan Tuhan, dan tidak boleh menyakiti orang lain.',
  },
  {
    keywords: ['norma kesusilaan', 'susila', 'hati nurani'],
    response: 'Norma kesusilaan bersumber dari suara hati nurani manusia mengenai apa yang baik dan buruk. Contohnya: berbuat jujur, tidak menyontek saat ulangan, dan mengembalikan barang temuan kepada pemiliknya.',
  },
  {
    keywords: ['norma kesopanan', 'sopan', 'santun', 'tata krama'],
    response: 'Norma kesopanan lahir dari tata krama dan adat kebiasaan masyarakat. Contohnya: mencium tangan orang tua saat berpamitan, menyapa guru dengan ramah, dan mengetuk pintu sebelum masuk.',
  },
  {
    keywords: ['norma hukum', 'hukum', 'sanksi hukum', 'polisi'],
    response: 'Norma hukum dibuat oleh badan resmi atau pemerintah dan sifatnya tegas serta mengikat. Contohnya: mematuhi rambu lalu lintas, memakai helm saat bersepeda motor, dan tidak melanggar aturan negara.',
  },
  {
    keywords: ['hak dan kewajiban', 'kewajiban', 'hak'],
    response: 'Hak adalah hal yang patut kita terima, sedangkan kewajiban adalah sesuatu yang harus kita laksanakan dengan penuh tanggung jawab. Keduanya harus dijalankan secara seimbang, ya! Lakukan kewajiban dulu, baru menuntut hak.',
    quickAction: { label: 'Latihan Keseimbangan Hak & Kewajiban', targetTab: 'practical' }
  },
  {
    keywords: ['musyawarah', 'mufakat', 'diskusi', 'pendapat'],
    response: 'Musyawarah adalah berdiskusi bersama untuk mencapai mufakat (kesepakatan bulat). Sikap yang baik saat musyawarah: mendengarkan teman bicara tanpa memotong, menyampaikan pendapat dengan santun, dan menerima hasil keputusan bersama.',
    quickAction: { label: 'Coba Kasus Musyawarah di Practical', targetTab: 'practical' }
  },
  {
    keywords: ['kuis', 'pertanyaan', 'tebak', 'latihan', 'uji'],
    response: 'Ayo coba tebak! "Ketika kamu berbicara kepada guru menggunakan bahasa yang santun dan nada suara lembut, norma apa yang sedang kamu amalkan?"\nKetik jawabanmu ya: apakah norma hukum, kesopanan, atau agama?',
  },
  {
    keywords: ['game', 'permainan', 'main game', 'penjelajah'],
    response: 'Kamu bisa menguji kemampuanmu di Misi Penjelajah Norma! Ada 5 level seru: Detektif Norma, Pasangkan dengan Tepat, Penjaga Hak & Kewajiban, Pilih Tindakanmu, dan Tantangan Musyawarah.',
    quickAction: { label: 'Mulai Main Game', targetTab: 'drill-game' }
  },
  {
    keywords: ['drill', 'latihan soal', 'bank soal'],
    response: 'Di menu Drill, kamu bisa berlatih soal-soal norma berulang kali dari tingkat Mudah, Sedang, hingga Menantang dengan penjelasan lengkap di setiap jawaban!',
    quickAction: { label: 'Buka Drill Penguatan', targetTab: 'drill-game' }
  },
  {
    keywords: ['halo', 'hai', 'pagi', 'siang', 'sore', 'malam', 'assalamualaikum'],
    response: 'Halo sahabat pembelajar! Aku Teman Belajar LearnSpace. Senang bisa menemanimu belajar norma, hak, kewajiban, dan musyawarah. Ada yang ingin kamu tanyakan hari ini?',
  },
  {
    keywords: ['terima kasih', 'makasih', 'oke', 'makasi', 'thanks'],
    response: 'Sama-sama! Semangat selalu belajarnya ya. Kamu adalah anak hebat calon penerus bangsa yang berbudi luhur!',
  }
];

function getClientFallback(input: string): { text: string; quickAction?: { label: string; targetTab: string } } {
  const cleanInput = input.trim().toLowerCase();

  if (cleanInput.includes('kesopanan') || cleanInput.includes('sopan')) {
    return {
      text: 'Luar biasa, jawabanmu TEPAT SEKALI! Berbicara santun kepada guru dan orang tua adalah contoh nyata pengamalan norma kesopanan.',
      quickAction: { label: 'Coba Level Game Berikutnya', targetTab: 'drill-game' }
    };
  }

  for (const rule of LOCAL_KNOWLEDGE_RULES) {
    if (rule.keywords.some(kw => cleanInput.includes(kw))) {
      return {
        text: rule.response,
        quickAction: rule.quickAction,
      };
    }
  }

  return {
    text: `Pertanyaan yang bagus tentang "${input}"! Dalam materi Norma dalam Kehidupanku, kita mempelajari aturan hidup agar rukun, seimbang antara hak dan kewajiban, serta gemar bermusyawarah. Mau mencoba menyimak materi atau latihan studi kasus nyata?`,
    quickAction: { label: 'Buka Tutorial Norma', targetTab: 'tutorial' }
  };
}

/**
 * Ask Teman Belajar LearnSpace.
 * Calls the server-side proxy route /api/chat which executes Gemini API safely on the server.
 * If server is unreachable or offline, falls back seamlessly to the child-friendly pedagogical engine.
 */
export async function askLearningChatbot(
  userInput: string,
  history: ChatMessage[] = []
): Promise<{ text: string; quickAction?: { label: string; targetTab: string } }> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userInput,
        history: history.slice(-6).map(h => ({ sender: h.sender, text: h.text })),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.text === 'string' && data.text.trim()) {
        return {
          text: data.text.trim(),
          quickAction: data.quickAction,
        };
      }
    }
  } catch (err) {
    console.warn('Server chat proxy unreachable, using local pedagogical engine:', err);
  }

  // Graceful local pedagogical fallback
  return getClientFallback(userInput);
}
