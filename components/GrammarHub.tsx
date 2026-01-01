
import React, { useState } from 'react';
import { generateGrammarExplanation, researchGrammarUsage } from '../services/geminiService';
import { GrammarNote, User } from '../types';

interface GrammarHubProps {
  language: string;
  nativeLanguage: string;
  user: User;
  onUnlock: (id: string, cost: number) => boolean;
}

const GrammarHub: React.FC<GrammarHubProps> = ({ language, nativeLanguage, user, onUnlock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [researching, setResearching] = useState(false);
  const [explanation, setExplanation] = useState<GrammarNote | null>(null);
  const [realUsage, setRealUsage] = useState<any>(null);

  const grammarTopics = [
    { id: 'subjunctive', name: 'Subjunctive Mood', free: true, cost: 0, category: 'Advanced' },
    { id: 'participles', name: 'Past Participles', free: false, cost: 25, category: 'Intermediate' },
    { id: 'pronouns', name: 'Direct Object Pronouns', free: false, cost: 15, category: 'Beginner+' },
    { id: 'conditional', name: 'Conditional Tense', free: false, cost: 20, category: 'Intermediate' },
    { id: 'irregular', name: 'Irregular Verbs', free: true, cost: 0, category: 'Beginner+' },
    { id: 'connectors', name: 'Logical Connectors', free: false, cost: 30, category: 'Professional' },
    { id: 'passive', name: 'Passive Voice', free: false, cost: 20, category: 'Intermediate' },
    { id: 'relative', name: 'Relative Pronouns', free: true, cost: 0, category: 'Intermediate' }
  ];

  const filteredTopics = grammarTopics.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerate = async (t: string) => {
    const selectedTopic = grammarTopics.find(item => item.name === t);
    if (!selectedTopic) return;

    if (!selectedTopic.free && !user.unlockedContent.includes(`grammar_${selectedTopic.id}`)) {
       alert("Please unlock this topic first!");
       return;
    }

    setLoading(true);
    setTopic(t);
    setExplanation(null);
    setRealUsage(null);
    try {
      const result = await generateGrammarExplanation(t, language);
      setExplanation(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = (topicId: string, cost: number) => {
     if (onUnlock(`grammar_${topicId}`, cost)) {
        alert("Topic unlocked! You can now explore its secrets.");
     } else {
        alert("Not enough PolyTokens!");
     }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Search Grammar Topics</h3>
          <div className="relative mb-6">
             <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
             <input 
              type="text" 
              placeholder="e.g. Subjunctive, Pronouns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
             />
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredTopics.map(t => {
              const isUnlocked = t.free || user.unlockedContent.includes(`grammar_${t.id}`);
              return (
                <div key={t.id} className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${isUnlocked ? 'border-indigo-50 bg-indigo-50/50 hover:bg-indigo-100 cursor-pointer' : 'border-gray-50 bg-gray-50 grayscale opacity-80'}`}
                  onClick={() => isUnlocked && handleGenerate(t.name)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isUnlocked ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                      <i className={`fa-solid ${isUnlocked ? 'fa-spell-check' : 'fa-lock'}`}></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{t.name}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t.category} • {t.free ? 'Free' : `${t.cost} 🪙`}</p>
                    </div>
                  </div>
                  {!isUnlocked && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleUnlock(t.id, t.cost); }}
                      className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-md"
                    >
                      Unlock
                    </button>
                  )}
                </div>
              );
            })}
            {filteredTopics.length === 0 && <p className="text-center text-gray-400 py-10 text-xs">No topics found.</p>}
          </div>
        </div>

        {explanation && user.isPro && (
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <h4 className="font-bold mb-4 relative z-10 flex items-center gap-2">
              <i className="fa-solid fa-microchip text-indigo-400"></i>
              Grounding Analysis
            </h4>
            <button 
              onClick={() => { setResearching(true); researchGrammarUsage(topic, language).then(res => { setRealUsage(res); setResearching(false); }); }}
              disabled={researching}
              className="w-full bg-white text-indigo-900 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg disabled:opacity-50"
            >
              {researching ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-search mr-2"></i>}
              Research Real Usage
            </button>
            {realUsage && (
              <div className="mt-6 space-y-4 animate-in slide-in-from-top-2">
                 <p className="text-[10px] font-bold text-indigo-300 uppercase">Live Findings:</p>
                 <div className="bg-white/10 p-4 rounded-xl text-[11px] leading-relaxed italic border border-white/5">
                   {realUsage.text.substring(0, 150)}...
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {realUsage.sources.map((s: any, i: number) => (
                      <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="text-[9px] font-bold bg-indigo-500 text-white px-2 py-1 rounded-md hover:bg-indigo-400">
                        {s.title}
                      </a>
                    ))}
                 </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="lg:col-span-2 space-y-6">
        {loading ? (
          <div className="bg-white h-full min-h-[500px] rounded-[3rem] border border-gray-100 flex flex-col items-center justify-center p-10 text-center animate-pulse">
             <i className="fa-solid fa-wand-magic-sparkles text-5xl text-indigo-200 mb-6"></i>
             <p className="text-indigo-400 font-black uppercase tracking-widest">Carlos is generating explanation...</p>
          </div>
        ) : explanation ? (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-right-4">
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-indigo-50/50 to-white flex justify-between items-center">
              <h2 className="text-3xl font-black text-indigo-950 tracking-tight">{explanation.topic}</h2>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Active Lesson</span>
            </div>
            <div className="p-10">
              <div className="prose prose-indigo max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{explanation.explanation}</p>
              </div>
              <div className="mt-10 space-y-4">
                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <i className="fa-solid fa-vial-circle-check text-indigo-500"></i>
                  Usage Examples
                </h4>
                {explanation.examples.map((ex, i) => (
                  <div key={i} className="bg-gray-50 p-6 rounded-2xl border-l-4 border-indigo-500 italic text-gray-800 font-medium">
                    {ex}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 h-full min-h-[500px] rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 p-10 text-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-200 text-4xl mb-6 shadow-inner">
               <i className="fa-solid fa-book-open-reader"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Intermediate Library</h3>
            <p className="text-sm mt-2 max-w-xs mx-auto leading-relaxed">Select or search for a topic on the left to begin your mastery journey.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrammarHub;
