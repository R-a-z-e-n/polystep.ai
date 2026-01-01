
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { VocabularyWord, User, LearningPurpose, AppView } from '../types';

interface DashboardProps {
  vocabulary: VocabularyWord[];
  language: string;
  user: User;
  setPurpose: (p: LearningPurpose) => void;
  setActiveView: (view: AppView, params?: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ vocabulary, language, user, setPurpose, setActiveView }) => {
  const [chartMode, setChartMode] = useState<'minutes' | 'xp'>('minutes');

  const chartData = [
    { day: 'Mon', minutes: 20, xp: 120 },
    { day: 'Tue', minutes: 45, xp: 280 },
    { day: 'Wed', minutes: 30, xp: 190 },
    { day: 'Thu', minutes: 60, xp: 450 },
    { day: 'Fri', minutes: 15, xp: 90 },
    { day: 'Sat', minutes: 50, xp: 380 },
    { day: 'Sun', minutes: 40, xp: 310 },
  ];

  const stats = [
    { label: 'Fluency Focus', value: user.learningPurpose, icon: 'fa-bullseye', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Vault Size', value: vocabulary.length, icon: 'fa-list-check', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'XP Points', value: user.xp, icon: 'fa-star', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Level', value: `B${Math.ceil(user.level / 10)}`, icon: 'fa-stairs', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const adaptiveTips = [
    { text: `Your ${user.learningPurpose} vocabulary is growing. Try a Verbalization challenge today.`, icon: 'fa-circle-exclamation', color: 'text-rose-500' },
    { text: "Intermediate Plateau: Focus on connecting phrases (conjunctions) to improve flow.", icon: 'fa-bridge', color: 'text-indigo-500' },
    { text: "Mistaken Words: You've failed 'Aprovechar' 3 times. Spaced repetition due.", icon: 'fa-clock', color: 'text-amber-500' }
  ];

  const purposes: LearningPurpose[] = ['Daily Communication', 'Business', 'Travel', 'Academic', 'Personal Interest'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Purpose Switcher */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Learning Focus:</span>
        {purposes.map(p => (
          <button 
            key={p} 
            onClick={() => setPurpose(p)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${user.learningPurpose === p ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} text-xl shadow-inner`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
              <p className="text-sm font-bold text-slate-800 leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Progression Momentum</h3>
                <p className="text-sm text-gray-400 font-medium">Tracking your path to B2 proficiency</p>
              </div>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                 <button 
                  onClick={() => setChartMode('minutes')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${chartMode === 'minutes' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
                 >
                   Minutes
                 </button>
                 <button 
                  onClick={() => setChartMode('xp')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${chartMode === 'xp' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                 >
                   XP Gain
                 </button>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                {chartMode === 'minutes' ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                      cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                    />
                    <Line type="monotone" dataKey="minutes" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                  </LineChart>
                ) : (
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    />
                    <Area type="monotone" dataKey="xp" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorXp)" />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
               <i className="fa-solid fa-sparkles text-indigo-500"></i> AI Plateau Analysis
             </h3>
             <div className="space-y-4">
                {adaptiveTips.map((tip, i) => (
                  <div key={i} className="flex gap-4 group p-4 rounded-2xl bg-gray-50/50 hover:bg-white border border-transparent hover:border-indigo-100 transition-all cursor-default">
                     <div className={`mt-1 text-sm ${tip.color}`}><i className={`fa-solid ${tip.icon}`}></i></div>
                     <p className="text-xs font-medium text-slate-600 leading-relaxed">{tip.text}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-950 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">
                <i className="fa-solid fa-microphone-lines"></i>
             </div>
             <h3 className="text-xl font-bold mb-2">Verbalization Skill</h3>
             <p className="text-xs opacity-70 mb-6">Describe real scenarios to build spontaneous confidence. Carlos will correct you instantly.</p>
             <div className="bg-white/10 p-4 rounded-2xl mb-6">
                <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                   <span>Accuracy</span>
                   <span>72%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                   <div className="bg-emerald-400 h-full w-[72%]"></div>
                </div>
             </div>
             <button 
               onClick={() => setActiveView(AppView.SPEAKING, { mode: 'Verbalization' })}
               className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg hover:bg-emerald-400 transition-all active:scale-95"
             >
                Start Verbalizing
             </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-slate-800 mb-8">Skill Breakdown</h3>
            <div className="space-y-4">
              {[
                { label: 'Reading', value: 85, color: 'bg-indigo-500' },
                { label: 'Writing', value: 45, color: 'bg-rose-500' },
                { label: 'Speaking', value: 65, color: 'bg-emerald-500' },
                { label: 'Listening', value: 78, color: 'bg-amber-500' }
              ].map(skill => (
                <div key={skill.label}>
                   <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase mb-1">
                      <span>{skill.label}</span>
                      <span className="text-slate-700">{skill.value}%</span>
                   </div>
                   <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`${skill.color} h-full`} style={{ width: `${skill.value}%` }}></div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
