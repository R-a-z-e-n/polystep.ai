
import React, { useState, useEffect } from 'react';
import { generateReadingPassage, translateText } from '../services/geminiService';
import { User } from '../types';

interface ReadingHubProps {
  language: string;
  nativeLanguage: string;
  user: User;
  onSaveVocab: (word: {word: string, translation: string, example: string, source: string}) => void;
  onUnlock: (id: string, cost: number) => boolean;
}

const ReadingHub: React.FC<ReadingHubProps> = ({ language, nativeLanguage, user, onSaveVocab, onUnlock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [hintText, setHintText] = useState("");
  const [isGettingHint, setIsGettingHint] = useState(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  const packs = [
    { id: 'basic', name: 'Cultural Traditions', free: true, cost: 0, desc: 'Festivals and heritage.' },
    { id: 'business', name: 'Corporate World', free: false, cost: 30, desc: 'Professional environments.' },
    { id: 'history', name: 'National History', free: false, cost: 40, desc: 'Key figures and dates.' },
    { id: 'tech', name: 'Digital Future', free: true, cost: 0, desc: 'AI and tech innovation.' },
    { id: 'nature', name: 'The Outdoors', free: false, cost: 20, desc: 'Ecology and adventure.' },
    { id: 'culinary', name: 'Food & Cooking', free: false, cost: 25, desc: 'Gastronomy and recipes.' }
  ];

  const filteredPacks = packs.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchPassage = async (packId: string) => {
    const pack = packs.find(p => p.id === packId);
    if (!pack) return;
    
    if (!pack.free && !user.unlockedContent.includes(`reading_${pack.id}`)) {
      alert("Please unlock this pack first!");
      return;
    }

    setLoading(true);
    setShowResults(false);
    setUserAnswers([]);
    setHintMessage(null);
    try {
      const result = await generateReadingPassage(language, "B1");
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getHint = async () => {
    if (!hintText.trim()) return;
    setIsGettingHint(true);
    setHintMessage(null);
    try {
      // Prompt optimized for "Ask Carlos" context
      const hint = await translateText(`Explain the meaning and grammatical context of this phrase in ${language}: "${hintText}". Keep it simple for an intermediate learner and explain in ${nativeLanguage}.`, language, nativeLanguage);
      setHintMessage(hint);
    } catch (e) {
      console.error(e);
      setHintMessage("I couldn't analyze that phrase right now. Try again!");
    } finally {
      setIsGettingHint(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-indigo-100">
      <i className="fa-solid fa-book-open animate-bounce text-4xl text-indigo-600 mb-4"></i>
      <p className="text-indigo-600 font-bold uppercase tracking-widest text-[10px]">AI is crafting a personalized reading text...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-500 pb-20">
      <div className="lg:col-span-2 space-y-8">
        {!data && (
          <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-gray-100">
             <div className="text-center mb-10">
                <h3 className="text-2xl font-black text-slate-800 mb-2">Select a Reading Theme</h3>
                <p className="text-gray-400 text-sm">Choose from free or premium immersion packs.</p>
             </div>
             <div className="relative mb-8 max-w-md mx-auto">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                <input 
                  type="text" 
                  placeholder="Search themes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPacks.map(p => {
                  const unlocked = p.free || user.unlockedContent.includes(`reading_${p.id}`);
                  return (
                    <div key={p.id} className={`p-6 rounded-[2rem] border-2 flex flex-col items-center justify-between gap-4 transition-all ${unlocked ? 'bg-indigo-50 border-indigo-100 hover:scale-105 cursor-pointer shadow-sm' : 'bg-gray-50 border-gray-100 opacity-70 grayscale'}`}
                       onClick={() => unlocked && fetchPassage(p.id)}
                    >
                       <div className="text-center">
                          <p className="text-lg font-black text-slate-800">{p.name}</p>
                          <p className="text-xs text-slate-500 mb-1">{p.desc}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.free ? 'Free' : `${p.cost} 🪙`}</p>
                       </div>
                       {!unlocked && (
                         <button onClick={(e) => { e.stopPropagation(); onUnlock(`reading_${p.id}`, p.cost); }} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg">Unlock Theme</button>
                       )}
                    </div>
                  );
                })}
             </div>
          </div>
        )}
        {data && (
          <>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 relative">
              <button onClick={() => setData(null)} className="absolute top-8 left-8 text-indigo-500 font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-2">
                 <i className="fa-solid fa-chevron-left"></i> Change Topic
              </button>
              <h2 className="text-3xl font-black text-slate-800 mt-10 mb-6 tracking-tight">{data.title}</h2>
              <div className="prose prose-indigo max-w-none text-lg text-slate-700 leading-relaxed mb-10 whitespace-pre-wrap font-medium">{data.passage}</div>
            </div>
            <div className="space-y-6">
              {data.questions.map((q: any, idx: number) => (
                <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <p className="font-bold text-slate-800 mb-6 text-lg">{q.question}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt: string, optIdx: number) => (
                      <button key={optIdx} onClick={() => { const na = [...userAnswers]; na[idx] = optIdx; setUserAnswers(na); }} disabled={showResults} className={`p-6 rounded-2xl text-left transition-all border-2 font-semibold text-sm ${userAnswers[idx] === optIdx ? showResults ? optIdx === q.correctIndex ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-rose-500 bg-rose-50 text-rose-800' : 'border-indigo-600 bg-indigo-50 text-indigo-800' : showResults && optIdx === q.correctIndex ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-gray-100 bg-gray-50 text-slate-600 hover:border-indigo-200 shadow-sm'}`}>
                        <span className="font-black mr-3 opacity-30">{String.fromCharCode(65 + optIdx)}</span> {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {!showResults ? (
                <button onClick={() => setShowResults(true)} disabled={userAnswers.length < data.questions.length} className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Verify Answers</button>
              ) : (
                <div className="p-8 bg-emerald-100 text-emerald-800 rounded-[2.5rem] text-center font-black text-xl animate-in zoom-in-95">Well Done! {userAnswers.filter((a, i) => a === data.questions[i].correctIndex).length} / {data.questions.length} Correct</div>
              )}
            </div>
          </>
        )}
      </div>
      <div className="space-y-6 lg:sticky lg:top-8">
         <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white shadow-xl">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
               <i className="fa-solid fa-wand-magic-sparkles text-indigo-400"></i> Ask Carlos
            </h3>
            <textarea value={hintText} onChange={(e) => setHintText(e.target.value)} placeholder="Paste phrase here..." className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-xs font-medium h-24 mb-4 resize-none outline-none focus:ring-2 focus:ring-indigo-400 transition-all" />
            <button onClick={getHint} disabled={isGettingHint || !hintText} className="w-full bg-white text-indigo-900 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all disabled:opacity-50">
               {isGettingHint ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-bolt mr-2"></i>}
               Analyze Phrase
            </button>
            {hintMessage && (
               <div className="mt-6 p-4 bg-white/10 rounded-2xl border border-white/10 animate-in slide-in-from-top-2">
                  <p className="text-xs font-bold mb-2 opacity-50 uppercase tracking-widest">Carlos says:</p>
                  <p className="text-xs italic opacity-90 leading-relaxed">{hintMessage}</p>
                  <button onClick={() => onSaveVocab({word: hintText, translation: hintMessage.split('\n')[0], example: data?.passage || '', source: 'Reading Hint'})} className="mt-4 text-[10px] font-bold text-indigo-400 hover:text-white uppercase transition-colors">Save to Vault</button>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default ReadingHub;
