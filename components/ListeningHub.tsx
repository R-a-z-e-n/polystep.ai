
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { getGeminiClient, decodeBase64, decodeAudioData, generateScenario } from '../services/geminiService';
import { User } from '../types';

interface ListeningHubProps {
  language: string;
  user: User;
  onUnlock: (id: string, cost: number) => boolean;
}

const ListeningHub: React.FC<ListeningHubProps> = ({ language, user, onUnlock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [scenario, setScenario] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showText, setShowText] = useState(false);
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const packs = [
    { id: 'daily', name: 'Everyday Chitchat', level: 'B1', free: true, cost: 0, desc: 'Casual dialogue and meeting friends.' },
    { id: 'news', name: 'Global News Feed', level: 'B2', free: false, cost: 30, desc: 'Formal reports and current events.' },
    { id: 'story', name: 'Classic Tales', level: 'C1', free: false, cost: 50, desc: 'Narrative storytelling and legends.' },
    { id: 'pod', name: 'Tech Podcasts', level: 'B2', free: true, cost: 0, desc: 'Discussions on AI and innovation.' },
    { id: 'medical', name: 'At the Clinic', level: 'B2', free: false, cost: 35, desc: 'Healthcare and medical dialogues.' },
    { id: 'travel', name: 'Navigating Airports', level: 'B1', free: false, cost: 20, desc: 'Logistics and travel help.' }
  ];

  const filteredPacks = packs.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchScenario = async (packId: string) => {
    const pack = packs.find(p => p.id === packId);
    if (!pack) return;
    if (!pack.free && !user.unlockedContent.includes(`listening_${pack.id}`)) {
      alert("Unlock this intensity level first!");
      return;
    }

    setLoading(true);
    setShowText(false);
    setError(null);
    setSelectedPack(pack);
    try {
      const text = await generateScenario(language, pack.level, pack.name);
      setScenario(text || "");
    } catch (e: any) {
      console.error(e);
      setError(e.message || "An error occurred while generating content.");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async () => {
    if (!scenario) return;
    setIsPlaying(true);
    const ai = getGeminiClient();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say naturally: ${scenario}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), audioContext, 24000, 1);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => setIsPlaying(false);
        source.start();
      }
    } catch (e) {
      console.error(e);
      setIsPlaying(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {!selectedPack ? (
        <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-gray-100">
           <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Select Listening Intensity</h2>
              <p className="text-gray-400 text-sm">Targeted listening exercises for your level.</p>
           </div>
           <div className="relative mb-8 max-w-md mx-auto">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                <input 
                  type="text" 
                  placeholder="Search listening packs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
             </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPacks.map(p => {
                 const unlocked = p.free || user.unlockedContent.includes(`listening_${p.id}`);
                 return (
                   <div key={p.id} className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col justify-between items-center text-center gap-4 ${unlocked ? 'bg-indigo-50 border-indigo-100 hover:scale-105 cursor-pointer shadow-sm' : 'bg-gray-50 border-gray-100 opacity-70 grayscale'}`}
                    onClick={() => unlocked && fetchScenario(p.id)}
                   >
                      <div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${unlocked ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                           <i className={`fa-solid ${unlocked ? 'fa-waveform' : 'fa-lock'}`}></i>
                        </div>
                        <p className="text-lg font-black text-slate-800 mb-1">{p.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium mb-2">{p.desc}</p>
                        <div className="flex items-center justify-center gap-2">
                           <span className="bg-white px-2 py-0.5 rounded-full text-[9px] font-black text-indigo-500 uppercase tracking-widest">{p.level}</span>
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.free ? 'Free' : `${p.cost} 🪙`}</span>
                        </div>
                      </div>
                      {!unlocked && (
                         <button onClick={(e) => { e.stopPropagation(); onUnlock(`listening_${p.id}`, p.cost); }} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 active:scale-95">Unlock Intensity</button>
                      )}
                   </div>
                 );
              })}
           </div>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 text-center relative max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
          <button onClick={() => { setSelectedPack(null); setScenario(""); }} className="absolute top-8 left-8 text-indigo-500 font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-2">
             <i className="fa-solid fa-chevron-left"></i> Back to Intensity
          </button>
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto mt-12 mb-8 shadow-inner border border-indigo-100">
             <i className={`fa-solid ${isPlaying ? 'fa-waveform-lines animate-pulse' : 'fa-headphones'} text-4xl`}></i>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">{selectedPack.name}</h2>
          <p className="text-slate-500 text-sm font-medium mb-10 px-10 leading-relaxed">Listen carefully to the neural-generated scenario. Carlos will use natural speed and native idioms for {selectedPack.level} proficiency.</p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm">
              <p className="font-bold mb-1">Error</p>
              <p>{error}</p>
            </div>
          )}

          {loading ? (
             <div className="flex flex-col items-center py-10 animate-pulse">
                <i className="fa-solid fa-sync fa-spin text-3xl text-indigo-200 mb-4"></i>
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Generating Audio Content...</p>
             </div>
          ) : (
            <div className="flex flex-col gap-4 max-w-md mx-auto">
               <button 
                 onClick={playAudio} 
                 disabled={isPlaying || !scenario} 
                 className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-xl shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
               >
                 {isPlaying ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
                 {isPlaying ? "Playing Audio..." : "Start Listening"}
               </button>
               <div className="grid grid-cols-2 gap-4 mt-2">
                  <button onClick={() => setShowText(!showText)} className="bg-white border-2 border-indigo-100 text-indigo-600 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-50 transition-colors">
                     {showText ? "Hide Transcript" : "Show Transcript"}
                  </button>
                  <button onClick={() => fetchScenario(selectedPack.id)} className="bg-gray-50 border-2 border-gray-100 text-gray-600 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors">
                     New Audio
                  </button>
               </div>
            </div>
          )}
          {showText && <div className="mt-10 p-10 bg-indigo-50 rounded-[2rem] border border-indigo-100 text-indigo-900 font-medium italic leading-relaxed animate-in slide-in-from-top-4">"{scenario}"</div>}
        </div>
      )}
    </div>
  );
};

export default ListeningHub;
