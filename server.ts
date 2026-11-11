import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Modality } from '@google/genai';
import { WebSocketServer, WebSocket } from 'ws';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const app = express();
const server = http.createServer(app);

app.use(express.json());

// Initialize Gemini SDK on server-side
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const SYSTEM_PROMPT = `Kamu adalah "Teman Belajar LearnSpace", asisten belajar digital yang ceria, ramah, dan mendidik untuk siswa SD Kelas V.
Mata pelajaran: Pendidikan Pancasila (Bab 2: Norma dalam Kehidupanku).
Topik yang dibahas:
1. Pengertian dan pentingnya norma (pedoman perilaku agar tercipta ketertiban).
2. Empat macam norma:
   - Norma Agama (bersumber dari Tuhan, contoh: ibadah, jujur, sanksi: dosa/pahala).
   - Norma Kesusilaan (bersumber dari hati nurani, contoh: tidak mencuri, jujur, sanksi: penyesalan/malu).
   - Norma Kesopanan (bersumber dari kebiasaan/tata krama masyarakat, contoh: pamit orang tua, sapa guru, sanksi: dicemooh/dikucilkan).
   - Norma Hukum (dibuat lembaga resmi/pemerintah, contoh: helm saat naik motor, taat tata tertib, sanksi: denda/hukuman tegas).
3. Hak dan Kewajiban (Hak = sesuatu yang patut diterima; Kewajiban = sesuatu yang wajib dilakukan dengan tanggung jawab; harus seimbang di rumah dan sekolah).
4. Musyawarah mufakat di keluarga dan sekolah (menghargai pendapat, mendengarkan orang lain, damai).

Prinsip komunikasi:
- Gunakan bahasa Indonesia yang santun, hangat, ceria, dan mudah dipahami anak SD.
- Jangan berikan jawaban instan langsung jika siswa bertanya soal kuis; gunakan pendekatan scaffolding (bimbingan bertahap dengan memancing nalar siswa).
- Jika siswa bertanya di luar materi Norma, jawab dengan ramah lalu ajak kembali ke topik norma.
- Jangan gunakan istilah yang terlalu teknis atau rumit.
- Jaga pesan tetap ringkas (2-4 kalimat pendek).`;

// Local pedagogical rules for smart offline fallback
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

function getLocalPedagogicalReply(input: string): { text: string; quickAction?: { label: string; targetTab: string } } {
  const clean = input.trim().toLowerCase();

  if (clean.includes('kesopanan') || clean.includes('sopan')) {
    return {
      text: 'Luar biasa, jawabanmu TEPAT SEKALI! Berbicara santun kepada guru dan orang tua adalah contoh nyata pengamalan norma kesopanan.',
      quickAction: { label: 'Coba Level Game Berikutnya', targetTab: 'drill-game' }
    };
  }

  for (const rule of LOCAL_KNOWLEDGE_RULES) {
    if (rule.keywords.some(kw => clean.includes(kw))) {
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

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

// ---------------------------------------------------------------------
// Server-Side Gemini API Endpoints
// ---------------------------------------------------------------------

// 1. Standard Chat endpoint: POST /api/chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const cleanInput = message.trim().toLowerCase();
    let quickAction: { label: string; targetTab: string } | undefined;
    if (cleanInput.includes('game') || cleanInput.includes('main')) {
      quickAction = { label: 'Buka Menu Game', targetTab: 'drill-game' };
    } else if (cleanInput.includes('latihan') || cleanInput.includes('kasus') || cleanInput.includes('soal')) {
      quickAction = { label: 'Buka Menu Practical', targetTab: 'practical' };
    } else if (cleanInput.includes('materi') || cleanInput.includes('belajar') || cleanInput.includes('tutorial')) {
      quickAction = { label: 'Buka Tutorial', targetTab: 'tutorial' };
    }

    if (ai) {
      try {
        const response = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `${SYSTEM_PROMPT}\n\nPertanyaan siswa: "${message}"\nJawab dengan hangat, ringkas, dan mendidik:`,
          }),
          4000
        );

        const replyText = response.text || '';
        if (replyText.trim().length > 0) {
          return res.json({
            text: replyText.trim(),
            quickAction,
          });
        }
      } catch (geminiErr: any) {
        console.warn('Gemini API call timed out or failed, using local engine:', geminiErr?.message || geminiErr);
      }
    }

    // Fallback to local pedagogical engine
    const localResult = getLocalPedagogicalReply(message);
    return res.json(localResult);
  } catch (err: any) {
    console.error('API /api/chat error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Streaming Chat endpoint (Server-Sent Events): POST /api/chat/stream
app.post('/api/chat/stream', async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const cleanInput = message.trim().toLowerCase();
  let quickAction: { label: string; targetTab: string } | undefined;
  if (cleanInput.includes('game') || cleanInput.includes('main')) {
    quickAction = { label: 'Buka Menu Game', targetTab: 'drill-game' };
  } else if (cleanInput.includes('latihan') || cleanInput.includes('kasus') || cleanInput.includes('soal')) {
    quickAction = { label: 'Buka Menu Practical', targetTab: 'practical' };
  } else if (cleanInput.includes('materi') || cleanInput.includes('belajar') || cleanInput.includes('tutorial')) {
    quickAction = { label: 'Buka Tutorial', targetTab: 'tutorial' };
  }

  if (ai) {
    try {
      const responseStream = await withTimeout(
        ai.models.generateContentStream({
          model: 'gemini-3.8-flash',
          contents: `${SYSTEM_PROMPT}\n\nPertanyaan siswa: "${message}"\nJawab dengan hangat, ringkas, dan mendidik:`,
        }),
        4000
      );

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text, done: false })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true, quickAction })}\n\n`);
      return res.end();
    } catch (streamErr: any) {
      console.error('Gemini streaming call failed, falling back:', streamErr?.message || streamErr);
    }
  }

  // Fallback for stream
  const localResult = getLocalPedagogicalReply(message);
  res.write(`data: ${JSON.stringify({ text: localResult.text, quickAction: localResult.quickAction, done: true })}\n\n`);
  res.end();
});

// 3. Health status check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------------------------------------
// WebSocket Server for Gemini Live API (Real-time voice streaming)
// ---------------------------------------------------------------------
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url || '', `http://${request.headers.host}`);
  if (pathname === '/ws/live' || pathname === '/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

wss.on('connection', async (clientWs: WebSocket) => {
  if (!ai) {
    clientWs.send(JSON.stringify({ error: 'Gemini API key is not configured on the server.' }));
    clientWs.close();
    return;
  }

  try {
    const session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction: SYSTEM_PROMPT,
      },
      callbacks: {
        onmessage: (message: any) => {
          for (const part of message.serverContent?.modelTurn?.parts ?? []) {
            if (part.inlineData?.data) {
              clientWs.send(JSON.stringify({ audio: part.inlineData.data }));
            }
          }
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
      },
    });

    clientWs.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio) {
          session.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        }
      } catch (e) {
        console.error('Error processing client audio packet:', e);
      }
    });

    clientWs.on('close', () => {
      try {
        session.close();
      } catch {
        // ignore
      }
    });
  } catch (err: any) {
    console.error('Live API connection failed:', err);
    clientWs.send(JSON.stringify({ error: 'Live API connection error: ' + (err.message || String(err)) }));
    clientWs.close();
  }
});

// ---------------------------------------------------------------------
// Vite Dev Server / Static File Serving
// ---------------------------------------------------------------------
async function initServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

initServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
