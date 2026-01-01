
import React, { useState } from 'react';
import { VocabularyWord, User } from '../types';

interface VocabularyVaultProps {
  vocabulary: VocabularyWord[];
  setVocabulary: React.Dispatch<React.SetStateAction<VocabularyWord[]>>;
  user: User;
  onUnlock: (id: string, cost: number) => boolean;
}

const VocabularyVault: React.FC<VocabularyVaultProps> = ({ vocabulary, setVocabulary, user, onUnlock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [packSearch, setPackSearch] = useState('');

  const packs = [
    { id: 'idioms', name: 'Native Idioms Pack', cost: 40, free: false, desc: 'Sound like a native instantly.' },
    { id: 'slang', name: 'Modern Slang Bundle', cost: 30, free: false, desc: 'TikTok and street talk.' },
    { id: 'pro', name: 'Professional Vocab', cost: 60, free: false, desc: 'Business and legal terms.' },
    { id: 'travel', name: 'Travel Essentials', cost: 0, free: true, desc: 'Airport and hotel basics.' },
    { id: 'food', name: 'Culinary Terms', cost: 15, free: false, desc: 'Cooking and dining out.' }
  ];

  const filteredPacks = packs.filter(p => 
    p.name.toLowerCase().includes(packSearch.toLowerCase()) || 
    p.desc.toLowerCase().includes(packSearch.toLowerCase())
  );

  const filteredVocab = vocabulary.filter(v => 
    v.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.translation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div>
               <h3 className="text-xl font-black text-slate-800">Browse Vocabulary Packs</h3>
               <p className="text-gray-400 text-sm">Expand your library with targeted word lists.</p>
            </div>
            <div className="relative w-full md:w-64">
               <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
               <input 
                type="text" 
                placeholder="Search packs..."
                value={packSearch}
                onChange={(e) => setPackSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
               />
            </div>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPacks.map(p => {
              const unlocked = p.free || user.unlockedContent.includes(`vocab_${p.id}`);
              return (
                <div key={p.id} className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col justify-between items-center text-center gap-4 ${unlocked ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100 opacity-80'}`}>
                   <div>
                     <p className="text-lg font-black text-slate-800 mb-1">{p.name}</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">{p.desc}</p>
                     <p className="text-[10px] font-black text-emerald-600 mt-2 uppercase tracking-widest">{unlocked ? 'Unlocked' : `${p.cost} 🪙`}</p>
                   </div>
                   {!unlocked && (
                     <button onClick={() => onUnlock(`vocab_${p.id}`, p.cost)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95">Unlock Pack</button>
                   )}
                </div>
              );
            })}
         </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
           <h3 className="text-xl font-black text-slate-800">Your Personal Vault</h3>
           <div className="relative w-full md:w-64">
               <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
               <input 
                type="text" 
                placeholder="Search saved words..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
               />
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Word</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Translation</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mastery</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVocab.map((v) => (
                <tr key={v.id} className="hover:bg-indigo-50/30 group transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-800 text-base">{v.word}</div>
                    <div className="text-[11px] text-gray-400 mt-1 font-medium">{v.example}</div>
                  </td>
                  <td className="px-8 py-6 text-slate-600 font-semibold">{v.translation}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${v.mastery >= 80 ? 'bg-emerald-500' : v.mastery >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{width: `${v.mastery}%`}}></div>
                      </div>
                      <span className="text-[10px] font-black text-gray-400">{v.mastery}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <button className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-indigo-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:shadow-lg hover:-translate-y-1">
                        <i className="fa-solid fa-volume-high text-sm"></i>
                     </button>
                  </td>
                </tr>
              ))}
              {filteredVocab.length === 0 && (
                <tr>
                   <td colSpan={4} className="px-8 py-20 text-center text-gray-400">
                      <i className="fa-solid fa-inbox text-4xl mb-4 block opacity-10"></i>
                      <p className="text-sm font-bold">No words found in your vault.</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VocabularyVault;
