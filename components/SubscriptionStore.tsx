
import React from 'react';
import { User } from '../types';

interface StoreProps {
  user: User;
  onPurchase: (tokens: number) => void;
}

const SubscriptionStore: React.FC<StoreProps> = ({ user, onPurchase }) => {
  const tokenPacks = [
    { name: 'Starter Sack', amount: 100, price: '$4.99', icon: 'fa-bag-shopping', color: 'bg-indigo-500' },
    { name: 'Language Chest', amount: 500, price: '$19.99', icon: 'fa-box-open', color: 'bg-amber-500', popular: true },
    { name: 'Fluent Fortune', amount: 2000, price: '$59.99', icon: 'fa-vault', color: 'bg-purple-600' }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-4">Level up your learning</h2>
        <p className="text-gray-500 text-lg">Purchase PolyTokens to unlock new languages or upgrade to Pro for advanced AI features.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tokenPacks.map(pack => (
          <div key={pack.name} className={`bg-white rounded-[3rem] p-10 shadow-sm border relative overflow-hidden transition-transform hover:-translate-y-2 duration-300 ${pack.popular ? 'border-amber-400 ring-4 ring-amber-50' : 'border-gray-100'}`}>
            {pack.popular && (
              <div className="absolute top-0 right-0 bg-amber-400 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-bl-3xl">
                Most Popular
              </div>
            )}
            <div className={`w-16 h-16 rounded-[1.5rem] ${pack.color} text-white flex items-center justify-center text-3xl mb-8 shadow-xl`}>
              <i className={`fa-solid ${pack.icon}`}></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">{pack.name}</h3>
            <p className="text-4xl font-black text-indigo-600 mb-6">{pack.amount} 🪙</p>
            <button 
              onClick={() => onPurchase(pack.amount)}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
            >
              Buy for {pack.price}
              <i className="fa-solid fa-credit-card text-xs opacity-50"></i>
            </button>
          </div>
        ))}
      </div>

      <div className="bg-indigo-950 rounded-[4rem] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-500/10 blur-[100px] rounded-full"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="inline-block bg-indigo-500 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              Ultimate Experience
            </div>
            <h2 className="text-5xl font-black tracking-tight mb-8">PolyStep PRO</h2>
            <div className="space-y-6">
              {[
                { title: 'Advanced Reasoning', desc: 'Unlock Gemini 3 Pro reasoning for deep grammar logic.', icon: 'fa-brain-circuit' },
                { title: 'Google Grounding', desc: 'Verify translations with live web search results.', icon: 'fa-globe' },
                { title: 'Visual Immersion', desc: 'Generate cultural images for every lesson.', icon: 'fa-image' },
                { title: 'Native Audio HD', desc: 'Crystal clear neural voices for all 30+ accents.', icon: 'fa-waveform-lines' }
              ].map(feat => (
                <div key={feat.title} className="flex gap-5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-800 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <i className={`fa-solid ${feat.icon}`}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg leading-tight mb-1">{feat.title}</h4>
                    <p className="text-indigo-300 text-sm leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] p-10 border border-white/10 text-center">
            <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest block mb-4">Unlimited Access</span>
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-6xl font-black">$12.99</span>
              <span className="text-indigo-400 font-bold uppercase text-xs">/ month</span>
            </div>
            <ul className="text-sm text-indigo-100/70 space-y-4 mb-10 text-left">
              <li className="flex items-center gap-3"><i className="fa-solid fa-circle-check text-emerald-400"></i> No token limit for Unlocks</li>
              <li className="flex items-center gap-3"><i className="fa-solid fa-circle-check text-emerald-400"></i> Ad-free experience</li>
              <li className="flex items-center gap-3"><i className="fa-solid fa-circle-check text-emerald-400"></i> Priority AI response speed</li>
            </ul>
            <button className="w-full bg-white text-indigo-950 py-5 rounded-3xl font-black text-xl hover:bg-indigo-100 transition-all shadow-2xl shadow-indigo-500/20 active:scale-95">
              Go Pro Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStore;
