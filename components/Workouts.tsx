
import React, { useState, useEffect } from 'react';
import { generateWorkout } from '../services/geminiService';

interface WorkoutsProps {
  language: string;
  nativeLanguage: string;
}

const Workouts: React.FC<WorkoutsProps> = ({ language, nativeLanguage }) => {
  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({ translation: '', composition: '', cloze: '' });
  const [feedback, setFeedback] = useState<{message: string, score: number, tips: string[]} | null>(null);

  const fetchWorkout = async () => {
    setLoading(true);
    setFeedback(null);
    setAnswers({ translation: '', composition: '', cloze: '' });
    try {
      const data = await generateWorkout(language);
      setWorkout(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkout();
  }, [language]);

  const handleSubmit = () => {
    // Simulated adaptive feedback based on LLM analysis
    setFeedback({
      message: `Excellent work! Your bridging logic from ${nativeLanguage} is very strong. You clearly understand the structural differences, though minor prepositional errors remain.`,
      score: 88,
      tips: [
        "Focus on 'por' vs 'para' for durations.",
        "Your vocabulary selection for the essay was B2 level - great use of connectors!",
        "Recommended next step: Indirect Object Pronoun drill."
      ]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
         <div>
            <h3 className="text-lg font-bold text-gray-800">Advanced Practice Pack</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Bridging Logic: {nativeLanguage} → {language}</p>
         </div>
         <button 
           onClick={fetchWorkout} 
           disabled={loading}
           className="px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors flex items-center gap-2 text-sm shadow-sm"
         >
           {loading ? <i className="fa-solid fa-sync fa-spin"></i> : <i className="fa-solid fa-rotate"></i>}
           Refresh Pack
         </button>
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center bg-white rounded-[2.5rem] border border-dashed border-indigo-100">
           <div className="flex flex-col items-center gap-4 text-indigo-600">
              <div className="relative">
                <i className="fa-solid fa-spinner fa-spin text-5xl"></i>
                <i className="fa-solid fa-brain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl"></i>
              </div>
              <p className="font-bold text-sm tracking-widest uppercase animate-pulse">AI is crafting your adaptive workout...</p>
           </div>
        </div>
      ) : workout && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-50 px-4 py-1.5 rounded-bl-2xl text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Task 01</div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                    <i className="fa-solid fa-language"></i>
                 </div>
                 <h4 className="font-bold text-slate-800">Paragraph Translation</h4>
              </div>
              <p className="bg-gray-50/80 p-6 rounded-2xl text-gray-700 leading-relaxed italic mb-6 border-l-4 border-indigo-400 font-medium">
                "{workout.translationTask}"
              </p>
              <textarea 
                value={answers.translation}
                onChange={(e) => setAnswers({...answers, translation: e.target.value})}
                placeholder={`Type your translation in ${language} here...`}
                className="w-full h-40 p-6 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none text-sm"
              />
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative">
              <div className="absolute top-0 right-0 bg-indigo-50 px-4 py-1.5 rounded-bl-2xl text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Task 02</div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                    <i className="fa-solid fa-highlighter"></i>
                 </div>
                 <h4 className="font-bold text-slate-800">Fill in the Gaps</h4>
              </div>
              <p className="mb-6 text-gray-700 font-medium text-lg leading-relaxed">{workout.clozeTask}</p>
              <input 
                type="text" 
                value={answers.cloze}
                onChange={(e) => setAnswers({...answers, cloze: e.target.value})}
                placeholder="Complete the sentence..."
                className="w-full p-6 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative">
              <div className="absolute top-0 right-0 bg-indigo-50 px-4 py-1.5 rounded-bl-2xl text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Task 03</div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                    <i className="fa-solid fa-pen-nib"></i>
                 </div>
                 <h4 className="font-bold text-slate-800">Critical Composition</h4>
              </div>
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 mb-6">
                 <p className="text-amber-800 text-sm font-bold flex items-center gap-2 mb-1">
                   <i className="fa-solid fa-lightbulb"></i> AI Prompt:
                 </p>
                 <p className="text-amber-700 text-sm leading-relaxed">{workout.compositionPrompt}</p>
              </div>
              <textarea 
                value={answers.composition}
                onChange={(e) => setAnswers({...answers, composition: e.target.value})}
                placeholder="Write at least 50 words..."
                className="w-full h-80 p-6 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none text-sm"
              />
              <div className="flex justify-between mt-2 px-2">
                 <span className="text-[10px] font-bold text-gray-400 uppercase">Words: {answers.composition.split(/\s+/).filter(x => x).length}</span>
                 <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Target: 50+</span>
              </div>
            </div>

            {feedback && (
              <div className="bg-white p-8 rounded-[2.5rem] border-2 border-emerald-100 shadow-xl shadow-emerald-50 animate-in slide-in-from-bottom-6 duration-500">
                 <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3 text-emerald-600">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-100">
                        <i className="fa-solid fa-check-double"></i>
                      </div>
                      <h4 className="font-bold">Adaptive Feedback</h4>
                    </div>
                    <div className="text-right">
                       <span className="text-3xl font-black text-emerald-500">{feedback.score}</span>
                       <span className="text-xs font-bold text-gray-400 uppercase block leading-none">Score</span>
                    </div>
                 </div>
                 <p className="text-emerald-800 text-sm leading-relaxed mb-6 font-medium italic bg-emerald-50/50 p-4 rounded-2xl">
                   "{feedback.message}"
                 </p>
                 <div className="space-y-3">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Next Step Recommendations</p>
                    {feedback.tips.map((tip, i) => (
                      <div key={i} className="flex gap-3 text-xs text-slate-600 bg-gray-50 p-3 rounded-xl border-l-4 border-emerald-400">
                         <i className="fa-solid fa-chevron-right mt-0.5 text-[10px] text-emerald-500"></i>
                         <span>{tip}</span>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            <button 
              onClick={handleSubmit}
              className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-bold text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-95 flex items-center justify-center gap-3"
            >
              <i className="fa-solid fa-paper-plane"></i>
              Submit for Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workouts;
