import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  ArrowLeft, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  User as UserIcon
} from 'lucide-react';
import { User, ChatMessage } from '../../../types';
import { askLearningChatbot } from '../../../services/chatbotService';

interface ChatbotViewProps {
  user: User;
  onBackToDashboard: () => void;
  onNavigateTab: (tab: string) => void;
}

const DEFAULT_SUGGESTIONS = [
  'Apa itu norma dan mengapa kita membutuhkannya?',
  'Apa beda norma kesusilaan dan kesopanan?',
  'Contoh hak dan kewajiban anak di rumah apa saja?',
  'Bagaimana sikap yang baik saat musyawarah?',
  'Beri aku satu kuis tebak norma dong!'
];

export const ChatbotView: React.FC<ChatbotViewProps> = ({
  user,
  onBackToDashboard,
  onNavigateTab
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Halo ${user.name}! Aku Teman Belajar LearnSpace. Aku siap menemanimu belajar tentang 4 macam norma, hak & kewajiban seimbang, dan musyawarah mufakat. Apa yang ingin kamu tanyakan hari ini?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await askLearningChatbot(trimmed, messages);
      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickAction: response.quickAction
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: 'Mohon maaf sahabat, Teman Belajar sedang memproses materi. Coba tanyakan kembali ya!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome_reset',
        sender: 'bot',
        text: `Obrolan telah dibersihkan. Halo lagi, ${user.name}! Ada materi Pendidikan Pancasila yang ingin kamu diskusikan?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-6">
        <div>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-indigo-600 mb-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-black text-slate-900">
                  Teman Belajar LearnSpace
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Aktif Membimbing
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Asisten Pembelajaran Digital Pendidikan Pancasila · SD Kelas V
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          className="self-start sm:self-auto px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Bersihkan Obrolan</span>
        </button>
      </div>

      {/* Child-safety information note */}
      <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2.5 text-xs text-indigo-900">
        <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
        <span>
          Teman Belajar aman untuk anak, ramah, dan membimbing pemahaman konsep Bab 2 Norma dalam Kehidupanku tanpa memberikan contekan instan.
        </span>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md flex flex-col h-[520px] overflow-hidden">
        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((m) => {
            const isBot = m.sender === 'bot';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-1">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                  <div
                    className={`p-4 sm:p-5 rounded-2xl text-sm sm:text-base leading-relaxed ${
                      isBot
                        ? 'bg-white border border-slate-200 text-slate-800 shadow-xs'
                        : 'bg-indigo-600 text-white shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                  </div>

                  {/* Direct Jump Button from Bot */}
                  {isBot && m.quickAction && (
                    <button
                      type="button"
                      onClick={() => onNavigateTab(m.quickAction!.targetTab)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{m.quickAction.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <span className={`block text-[10px] text-slate-400 font-mono ${isBot ? 'text-left' : 'text-right'}`}>
                    {m.timestamp}
                  </span>
                </div>

                {!isBot && (
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-2xs mt-1">
                    <UserIcon className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs text-slate-400 font-medium ml-2">Teman Belajar sedang mengetik...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-1 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Ide Tanya:
          </span>
          {DEFAULT_SUGGESTIONS.map((sug, sIdx) => (
            <button
              key={sIdx}
              type="button"
              onClick={() => handleSendMessage(sug)}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border border-slate-200 shrink-0"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="p-4 bg-white border-t border-slate-200 flex items-center gap-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tanyakan materi norma, hak, atau musyawarah di sini..."
            disabled={isTyping}
            className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-all font-medium"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              !inputText.trim() || isTyping
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs hover:shadow-md'
            }`}
          >
            <span>Kirim</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
