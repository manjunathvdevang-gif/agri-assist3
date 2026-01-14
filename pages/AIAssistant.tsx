
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Mic, Send, ChevronLeft, Volume2, X, 
  Sparkles, CheckCircle2, ShoppingBag, Loader2, StopCircle, LogOut, VolumeX
} from 'lucide-react';
import { getAssistantResponse, generateSpeech, transcribeAudio, decodePCM, decodeBase64 } from '../services/geminiService';
import { Message, Language, UserListing } from '../types';
import { LANGUAGES } from '../constants';

const AIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Namaskara! I am Agri-Sahayak. I can help with farming advice, weather, or help you list crops for sale. Ask me anything!", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<Language>('kn');
  const [isRecording, setIsRecording] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioSource = useRef<AudioBufferSourceNode | null>(null);

  // Handle initial query from navigation state
  useEffect(() => {
    if (location.state && location.state.initialQuery) {
      handleSend(location.state.initialQuery);
      // Clear state so it doesn't re-send on mount
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleLogout = () => {
    navigate('/welcome');
    window.location.reload();
  };

  const handleConfirmListing = (data: any) => {
    // 1. Get current stock
    const savedStock = localStorage.getItem('agri_user_stock');
    const currentStock: UserListing[] = savedStock ? JSON.parse(savedStock) : [
      { id: '1', cropName: 'Onion', quantity: '50 Quintal', price: 1200, date: '2024-05-20' }
    ];

    // 2. Add new item
    const newItem: UserListing = {
      id: Date.now().toString(),
      cropName: data.crop,
      quantity: `${data.qty} ${data.unit || 'Quintal'}`,
      price: Number(data.price),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    };

    const updatedStock = [newItem, ...currentStock];
    localStorage.setItem('agri_user_stock', JSON.stringify(updatedStock));

    // 3. Confirm in Chat
    handleSend(`Yes, I confirm. Add ${data.crop} to my marketplace listing.`);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const response = await getAssistantResponse(text, language);
    
    // Parse listing data from bot response if present
    let listingData = null;
    let cleanText = response.text;
    try {
      const match = response.text.match(/\{.*\}/s);
      if (match) {
        listingData = JSON.parse(match[0]);
        cleanText = response.text.replace(match[0], "").trim();
      }
    } catch(e) {}

    const botMsg: Message = { 
      id: (Date.now() + 1).toString(), 
      role: 'assistant', 
      content: cleanText || (listingData ? "I've analyzed your request. Please verify the listing details below:" : "How else can I help?"), 
      timestamp: Date.now(),
      sources: response.sources,
      isListingPrompt: !!listingData,
      listingData
    };
    
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);

    // Auto-play the response if enabled
    if (autoPlay) {
      playResponse(botMsg.content, botMsg.id);
    }
  };

  const playResponse = async (text: string, id: string) => {
    if (playingAudio === id) {
      currentAudioSource.current?.stop();
      setPlayingAudio(null);
      return;
    }
    
    // Stop any currently playing audio
    if (currentAudioSource.current) {
      currentAudioSource.current.stop();
    }

    setPlayingAudio(id);
    const audioB64 = await generateSpeech(text, language);
    
    if (audioB64) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const pcmData = decodeBase64(audioB64);
        const buffer = await decodePCM(pcmData, ctx);
        
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        currentAudioSource.current = source;
        
        source.onended = () => {
          if (playingAudio === id) setPlayingAudio(null);
        };
        
        source.start();
      } catch (err) {
        console.error("Playback error:", err);
        setPlayingAudio(null);
      }
    } else {
      setPlayingAudio(null);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];
      setIsRecording(true);
      
      mr.ondataavailable = e => audioChunksRef.current.push(e.data);
      mr.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const b64 = (reader.result as string).split(',')[1];
          setLoading(true);
          const text = await transcribeAudio(b64);
          if (text) handleSend(text);
          setLoading(false);
        };
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
      };
      mr.start();
    } catch (err) {
      console.error("Mic error:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] pb-16 overflow-hidden">
      {/* Header */}
      <div className="bg-white p-4 border-b shadow-sm sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button onClick={() => navigate('/')} className="text-gray-400 p-1 hover:bg-gray-100 rounded-full mr-2">
            <ChevronLeft />
          </button>
          <button onClick={handleLogout} className="text-red-500 p-1.5 hover:bg-red-50 rounded-full" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-green-100 p-2 rounded-full"><Sparkles className="text-green-600" size={18} /></div>
          <h2 className="font-black text-gray-900 tracking-tight">Agri Sahayak</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setAutoPlay(!autoPlay)}
            className={`p-2 rounded-full transition-all ${autoPlay ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}
            title={autoPlay ? "Auto-play ON" : "Auto-play OFF"}
          >
            {autoPlay ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button onClick={() => setShowLangPicker(true)} className="px-3 py-1.5 bg-green-50 rounded-xl text-xs font-black text-green-700 uppercase">
            {LANGUAGES[language].native}
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="flex flex-col gap-2 max-w-[85%]">
              <div className={`rounded-3xl p-5 shadow-sm border border-gray-100 relative ${
                msg.role === 'user' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'
              }`}>
                <p className="text-[15px] font-bold leading-relaxed">{msg.content}</p>
                
                {msg.role === 'assistant' && (
                  <button 
                    onClick={() => playResponse(msg.content, msg.id)}
                    className={`absolute -right-12 bottom-0 p-2.5 rounded-full border shadow-sm transition-all ${
                      playingAudio === msg.id ? 'bg-green-600 text-white animate-pulse' : 'bg-white text-green-600'
                    }`}
                  >
                    {playingAudio === msg.id ? <StopCircle size={18} /> : <Volume2 size={18} />}
                  </button>
                )}

                {msg.isListingPrompt && msg.listingData && (
                  <div className="mt-5 p-5 bg-green-50 rounded-2xl border border-green-100 space-y-4">
                    <div className="flex items-center gap-2 text-green-700 font-black text-xs uppercase tracking-widest">
                      <ShoppingBag size={14} /> New Market Listing
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs bg-white/50 p-4 rounded-xl border border-white">
                      <div className="text-gray-400 font-bold uppercase tracking-tighter">Crop: <span className="text-gray-900 font-black">{msg.listingData.crop}</span></div>
                      <div className="text-gray-400 font-bold uppercase tracking-tighter">Qty: <span className="text-gray-900 font-black">{msg.listingData.qty} {msg.listingData.unit}</span></div>
                      <div className="text-gray-400 font-bold uppercase tracking-tighter">Price: <span className="text-gray-900 font-black">₹{msg.listingData.price}</span></div>
                    </div>
                    <button 
                      onClick={() => handleConfirmListing(msg.listingData)}
                      className="w-full bg-green-600 text-white py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-green-100 active:scale-95 transition-all"
                    >
                      <CheckCircle2 size={18} /> Add to Marketplace
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white px-5 py-3 rounded-2xl shadow-sm flex items-center gap-2 border border-gray-100">
              <Loader2 size={16} className="animate-spin text-green-600" />
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Sahayak is thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-5 border-t">
        <div className="flex items-center gap-3 bg-gray-50 border rounded-[2.5rem] px-5 py-2 focus-within:border-green-300 transition-all focus-within:bg-white focus-within:shadow-inner">
          <button 
            onClick={toggleRecording} 
            className={`p-2 transition-all ${isRecording ? 'text-red-500 scale-125' : 'text-gray-400'}`}
          >
            {isRecording ? <StopCircle size={22} /> : <Mic size={22} />}
          </button>
          <input 
            type="text" 
            placeholder="Type your query..." 
            className="flex-1 bg-transparent py-4 outline-none text-sm font-bold"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend(input)}
          />
          <button 
            onClick={() => handleSend(input)} 
            disabled={!input.trim()}
            className={`p-2.5 rounded-full transition-all ${input.trim() ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-200 text-gray-400'}`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {showLangPicker && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end">
          <div className="bg-white w-full rounded-t-[3rem] p-8 space-y-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black">Choose Your Language</h3>
              <button onClick={() => setShowLangPicker(false)} className="bg-gray-100 p-2 rounded-full"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(Object.entries(LANGUAGES) as [Language, any][]).map(([k, v]) => (
                <button 
                  key={k} 
                  onClick={() => { setLanguage(k); setShowLangPicker(false); }}
                  className={`py-5 rounded-3xl font-black transition-all border-2 ${
                    language === k ? 'bg-green-600 text-white border-green-600 shadow-xl' : 'bg-gray-50 text-gray-600 border-transparent'
                  }`}
                >
                  {v.native}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
