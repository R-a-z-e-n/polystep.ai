
import React, { useState } from 'react';
import { generateWritingPrompt, analyzeWriting } from '../services/geminiService';
import { User } from '../types';

interface WritingHubProps {
  language: string;
  nativeLanguage: string;
  user: User;
  onUnlock: (id: string, cost: number) => boolean;
}

const WritingHub: React.FC<WritingHubProps> = ({ language, nativeLanguage, user, onUnlock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [promptData, setPromptData] = useState<any>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const promptPacks = [
    { id: 'daily', name: 'Daily Reflections', free: true, cost: 0, desc: 'Journaling and thoughts.' },
    { id: 'creative', name: 'Fiction & Fantasy', free: false, cost: 25, desc: 'Narrative storytelling.' },
    { id: 'business', name: 'Professional Memos', free: false, cost: 35, desc: 'Workplace communication.' },
    { id: 'opinion', name: 'Persuasive Essays', free: true, cost: 0, desc: 'Arguments and debates.' },
    { id: 'travel', name: 'Travel Blogging', free: false, cost: 20, desc: 'Journeys and itineraries.' },
    { id: 'academic', name: 'Scientific Reports', free: false, cost: 40, desc: 'Technical and data-driven.' }
  ];

  const filteredPacks = promptPacks.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchPrompt = async (packId: string) => {
    const pack = promptPacks.find(p => p.id === packId);
    if (!pack) return;
    if (!pack.free && !user.unlockedContent.includes(`writing_${pack.id}`)) {
      alert("Unlock this focus first!");
      return;
    }

    setLoading(true);
    setAnalysis(null);
    setText('');
    try {
      const result = await generateWritingPrompt(language, pack.name);
      setPromptData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (text.length < 20) return;
    setIsAnalyzing(true);
    try {
      const res = await analyzeWriting(text, language);
      setAnalysis(res);
    } catch (e) {
       console.error(e);
    } finally {
       setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500 pb-20">
      <div className="space-y-6">
        {!promptData ? (
           <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
              <div className="text-center mb-10">
                <h3 className="text-2xl font-black text-slate-800 mb-2">Choose Writing Focus</h3>
                <p className="text-gray-400 text-sm">Targeted prompts for specific goals.</p>
              </div>
              <div className="relative mb-8 max-w-md mx-auto">
                 <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                 <input 
                  type="text" 
                  placeholder="Search foci..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                 />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {filteredPacks.map(p => {
                    const unlocked = p.free || user.unlockedContent.includes(`writing_${p.id}`);
                    return (
                       <div key={p.id} className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col justify-between items-center gap-4 ${unlocked ? 'border-amber-50 bg-amber-50/50 hover:bg-amber-100 cursor-pointer' : 'border-gray-50 bg-gray-50 grayscale opacity-70'}`}
                        onClick={() => unlocked && fetchPrompt(p.id)}
                       >
                          <div className="text-center">
                            <p className="text-lg font-black text-slate-800">{p.name}</p>
                            <p className="text-xs text-slate-500 mb-1">{p.desc}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.free ? 'Free' : `${p.cost} 🪙`}</p>
                          </div>
                          {!unlocked && (
                             <button onClick={(e) => { e.stopPropagation(); onUnlock(`writing_${p.id}`, p.cost); }} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg">Unlock Focus</button>
                          )}
                       </div>
                    );
                 })}
              </div>
           </div>
        ) : (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative">
            <button onClick={() => setPromptData(null)} className="absolute top-6 left-6 text-indigo-500 font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-2">
               <i className="fa-solid fa-chevron-left"></i> Pick Focus
            </button>
            <div className="flex items-center gap-3 mt-10 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg"><i className="fa-solid fa-feather-pointed"></i></div>
              <h3 className="text-xl font-bold text-slate-800">Composition Task</h3>
            </div>
            {loading ? (
              <div className="flex flex-col items-center py-10 animate-pulse">
                 <i className="fa-solid fa-pencil text-indigo-200 text-4xl mb-4"></i>
                 <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Generating prompt...</p>
              </div>
            ) : (
              <>
                <p className="text-lg font-medium text-slate-700 leading-relaxed mb-6 italic">"{promptData.prompt}"</p>
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Keywords to include:</p>
                  <div className="flex flex-wrap gap-2">
                    {promptData.suggestedWords.map((w: string) => (
                      <span key={w} className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100">{w}</span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        <div className="bg-indigo-950 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl transform rotate-12">
             <i className="fa-solid fa-pen-nib"></i>
          </div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={`Start writing in ${language}...`} className="w-full h-80 bg-indigo-900/40 border border-indigo-800 rounded-3xl p-6 text-indigo-100 outline-none resize-none focus:ring-4 focus:ring-indigo-500/20 transition-all text-sm font-medium relative z-10" />
          <div className="flex justify-between items-center mt-4 px-2 relative z-10">
            <span className="text-xs font-bold text-indigo-400">{text.length} characters</span>
            <button 
              onClick={handleAnalyze} 
              disabled={text.length < 20 || isAnalyzing} 
              className="bg-indigo-500 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-400 transition-all disabled:opacity-50 active:scale-95"
            >
               {isAnalyzing ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>}
               Analyze Writing
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {analysis ? (
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-indigo-100 shadow-sm animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-800">Carlos's Analysis</h3>
              <div className="text-right">
                <span className="text-2xl font-black text-indigo-600">{analysis.score}/100</span>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Score</p>
              </div>
            </div>
            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 mb-8">
               <p className="text-indigo-800 font-medium italic leading-relaxed">"{analysis.feedback}"</p>
            </div>
            <div className="space-y-6">
               <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Corrections & Improvements</p>
               <div className="space-y-3">
                 {analysis.corrections.map((c: string, i: number) => (
                   <div key={i} className="flex gap-4 text-sm text-slate-700 bg-gray-50 p-5 rounded-2xl border-l-4 border-rose-400 shadow-sm">
                      <i className="fa-solid fa-circle-exclamation text-rose-500 mt-1"></i>
                      <span className="font-medium">{c}</span>
                   </div>
                 ))}
                 {analysis.corrections.length === 0 && <p className="text-emerald-500 font-bold text-xs p-4 bg-emerald-50 rounded-xl">No corrections needed! Excellent command of the language.</p>}
               </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-10 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center text-gray-400">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-200 text-4xl mb-6 shadow-inner">
               <i className="fa-solid fa-pen-fancy"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Writing Studio</h3>
            <p className="text-sm mt-2 max-w-xs mx-auto leading-relaxed">Select a writing theme and start composing. Carlos will provide a deep analysis of your grammar, tone, and vocabulary choice.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WritingHub;
