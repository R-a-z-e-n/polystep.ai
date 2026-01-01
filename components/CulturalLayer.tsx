
import React, { useState } from 'react';
import { visualizeCulture } from '../services/geminiService';

interface CulturalLayerProps {
  language: string;
  isPro?: boolean;
}

const CulturalLayer: React.FC<CulturalLayerProps> = ({ language, isPro }) => {
  const [visualPrompt, setVisualPrompt] = useState('');
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);

  const culturalFacts = [
    {
      id: 'slang',
      title: 'Common Slang',
      content: 'Intermediate fluency requires moving beyond "Hola". Discover region-specific expressions.',
      detail: 'Slang is the heart of conversation. In Spain, "guay" is "cool", while in Mexico "padre" or "chido" dominate. In Argentina, you\'ll hear "copado". Mastering these ensures you sound natural and avoid sounding like a textbook.',
      examples: [
        'Spain: ¡Qué guay es esta app! (This app is so cool!)',
        'Mexico: ¡Qué padre está tu coche! (Your car is so cool!)',
        'Argentina: Ese plan está re copado. (That plan is really cool.)'
      ],
      type: 'idiom',
      icon: 'fa-quote-left',
      color: 'bg-amber-100 text-amber-600'
    },
    {
      id: 'etiquette',
      title: 'Etiquette Tips',
      content: 'Social norms vary wildly. Learn the "T-V distinction" and meeting protocols.',
      detail: 'Politeness is encoded in the language. For example, the French distinction between "Tu" (informal) and "Vous" (formal) is critical in business. Transitioning to "tu" too early can be seen as disrespectful. Similarly, in many Asian cultures, the degree of bowing or the order of introductions is linguistically reflected.',
      examples: [
        'French: Always use "Vous" until invited to use "Tu".',
        'Spanish: "Usted" is safer in professional environments until a rapport is built.',
        'German: "Sie" is non-negotiable for strangers and elders.'
      ],
      type: 'culture',
      icon: 'fa-users',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'cognates',
      title: 'False Cognates',
      content: 'Beware of "false friends" — words that look like English but mean something else.',
      detail: 'False cognates are traps for intermediate learners. "Actual" in Spanish means "current", not "real". "Embarazada" means "pregnant", not "embarrassed". Understanding these prevents embarrassing or professional mishaps.',
      examples: [
        'Spanish "Actual" = English "Current"',
        'Spanish "Embarazada" = English "Pregnant"',
        'French "Assister" = English "Attend" (not assist)',
        'German "Gift" = English "Poison" (not gift)'
      ],
      type: 'warning',
      icon: 'fa-triangle-exclamation',
      color: 'bg-rose-100 text-rose-600'
    }
  ];

  const handleGenerate = async () => {
    if (!visualPrompt || !isPro) return;
    setLoadingImg(true);
    setGeneratedImg(null);
    try {
      const img = await visualizeCulture(visualPrompt + " in the context of " + language + " culture");
      setGeneratedImg(img);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingImg(false);
    }
  };

  if (selectedDetail) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-500 space-y-8 pb-20">
        <button onClick={() => setSelectedDetail(null)} className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:underline mb-8">
          <i className="fa-solid fa-arrow-left"></i> Back to Cultural Layer
        </button>
        <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-gray-100">
           <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-8 ${selectedDetail.color}`}>
              <i className={`fa-solid ${selectedDetail.icon}`}></i>
           </div>
           <h2 className="text-4xl font-black text-slate-800 tracking-tighter mb-4">{selectedDetail.title} Deep Dive</h2>
           <p className="text-lg text-indigo-500 font-bold uppercase tracking-widest mb-10">{language} Focus</p>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-8">
                 <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Linguistic Bridge:</h3>
                    <p className="text-gray-700 leading-relaxed text-lg font-medium">{selectedDetail.detail}</p>
                 </div>
                 <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
                    <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
                       <i className="fa-solid fa-lightbulb text-amber-500"></i>
                       Context Examples:
                    </h3>
                    <div className="space-y-4">
                       {selectedDetail.examples.map((ex: string, i: number) => (
                         <div key={i} className="bg-white p-4 rounded-xl border border-indigo-100 text-sm font-bold text-indigo-800 shadow-sm italic">
                            {ex}
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl">
                 <div className="flex items-center gap-4 mb-8">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos" className="w-16 h-16 rounded-2xl bg-indigo-900 border-2 border-indigo-500/30" alt="" />
                    <div>
                       <h3 className="text-xl font-bold flex items-center gap-3 text-white">Carlos's Advice</h3>
                       <span className="text-[10px] text-indigo-400 font-bold uppercase">Intermediate Strategy</span>
                    </div>
                 </div>
                 <p className="text-indigo-100/80 text-lg mb-10 leading-relaxed italic">
                    "Intermediate learners often hit a plateau because they stick to literal dictionary definitions. Embracing {selectedDetail.title.toLowerCase()} is how you transition from 'someone who studied' to 'someone who speaks'. Don't just translate words—translate feelings and respect."
                 </p>
                 <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem]">
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-3">
                       <i className="fa-solid fa-fire text-amber-400"></i> Active Drill
                    </h3>
                    <p className="text-indigo-200 text-xs mb-6 leading-relaxed">Write a 2-sentence scenario in {language} correctly applying this {selectedDetail.title.toLowerCase()} rule.</p>
                    <textarea className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:ring-4 focus:ring-indigo-500/20 mb-6 placeholder-white/20" placeholder="Type dialogue here..."></textarea>
                    <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg active:scale-95">Submit for Carlos to Review</button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {culturalFacts.map((fact) => (
             <div key={fact.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-indigo-200 transition-colors cursor-pointer" onClick={() => setSelectedDetail(fact)}>
                <div>
                  <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center shadow-lg ${fact.color} shadow-current/10`}>
                     <i className={`fa-solid ${fact.icon}`}></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">{fact.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">{fact.content}</p>
                </div>
                <button 
                  className="mt-8 text-xs font-bold text-indigo-600 flex items-center gap-2 group-hover:translate-x-1 duration-300"
                >
                   Explore Deep Dive <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
             </div>
          ))}
       </div>

       <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-10 border-b border-gray-50">
             <h3 className="text-2xl font-black text-slate-800 tracking-tight">Cultural Visualization Hub</h3>
             <p className="text-gray-400 mt-1">Generate AI scenes to better understand cultural context.</p>
          </div>
          <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed font-medium">
                  {isPro ? "As a Pro user, you can use Gemini 2.5 Flash to visualize any cultural scene. Just describe a marketplace, a local festival, or a traditional meal." : "Upgrade to Pro to unlock AI Image Generation for cultural immersion."}
                </p>
                {isPro ? (
                  <div className="space-y-4">
                    <textarea 
                      value={visualPrompt}
                      onChange={(e) => setVisualPrompt(e.target.value)}
                      placeholder="e.g. A bustling tapas bar in Seville at night..."
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 text-sm focus:ring-4 focus:ring-indigo-100 outline-none resize-none h-32"
                    />
                    <button 
                      onClick={handleGenerate}
                      disabled={loadingImg || !visualPrompt}
                      className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {loadingImg ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-palette"></i>}
                      {loadingImg ? "Painting Culture..." : "Generate Scene"}
                    </button>
                  </div>
                ) : (
                  <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 text-center">
                    <i className="fa-solid fa-lock text-3xl text-indigo-400 mb-4"></i>
                    <h4 className="font-bold text-indigo-900 mb-2">Immersion Visualizer Locked</h4>
                    <p className="text-xs text-indigo-700 mb-6 leading-relaxed">Unlock the power of Gemini 2.5 Image Generation to bring your target language's culture to life.</p>
                    <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest">Upgrade to Pro</button>
                  </div>
                )}
             </div>
             <div className="relative group">
                <div className="bg-gray-50 rounded-[2.5rem] p-4 aspect-video flex items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden min-h-[300px]">
                   {loadingImg ? (
                     <div className="flex flex-col items-center gap-3">
                       <i className="fa-solid fa-wand-magic-sparkles text-4xl text-indigo-300 animate-pulse"></i>
                       <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">AI is generating...</p>
                     </div>
                   ) : generatedImg ? (
                     <img src={generatedImg} alt="Culture" className="w-full h-full object-cover rounded-2xl shadow-lg animate-in fade-in scale-95 duration-700" />
                   ) : (
                     <div className="text-center p-8">
                       <i className="fa-solid fa-image text-5xl text-gray-200 mb-4"></i>
                       <p className="text-xs text-gray-300 font-bold uppercase tracking-widest">Visual Canvas Ready</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default CulturalLayer;
