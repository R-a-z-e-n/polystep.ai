
import React from 'react';
import { AppView, User } from '../types';

interface SidebarProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  nativeLanguage: string;
  setNativeLanguage: (lang: string) => void;
  targetLanguage: string;
  setTargetLanguage: (lang: string) => void;
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setActiveView, 
  nativeLanguage, 
  setNativeLanguage, 
  targetLanguage, 
  setTargetLanguage,
  user
}) => {
  const menuItems = [
    { view: AppView.DASHBOARD, icon: 'fa-chart-line', label: 'Dashboard', group: 'Main' },
    
    { view: AppView.READING, icon: 'fa-book-open', label: 'Reading', group: 'Skillsets' },
    { view: AppView.WRITING, icon: 'fa-pen-nib', label: 'Writing', group: 'Skillsets' },
    { view: AppView.SPEAKING, icon: 'fa-microphone', label: 'Speaking', group: 'Skillsets' },
    { view: AppView.LISTENING, icon: 'fa-headphones', label: 'Listening', group: 'Skillsets' },
    { view: AppView.VOCABULARY, icon: 'fa-language', label: 'Vocabulary', group: 'Skillsets' },

    { view: AppView.GRAMMAR, icon: 'fa-spell-check', label: 'Grammar Hub', group: 'Tools' },
    { view: AppView.CULTURE, icon: 'fa-globe', label: 'Cultural Layer', group: 'Tools' },
    { view: AppView.COMMUNITY, icon: 'fa-people-group', label: 'Community', group: 'Social' },
    { view: AppView.STORE, icon: 'fa-shop', label: 'PolyStore', group: 'Social' },
    { view: AppView.OFFLINE, icon: 'fa-cloud-arrow-down', label: 'Offline Mode', group: 'Social' },
  ];

  const languages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Italian', 'Chinese', 'Portuguese', 'Korean', 'Russian'];

  return (
    <aside className="w-20 md:w-72 bg-indigo-950 text-white flex flex-col transition-all duration-300 shadow-2xl z-50 h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => setActiveView(AppView.DASHBOARD)}>
        <div className="bg-indigo-500 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20">
          <i className="fa-solid fa-stairs"></i>
        </div>
        <span className="hidden md:block font-bold text-xl tracking-tight">PolyStep<span className="text-indigo-400">AI</span></span>
      </div>

      <div className="px-4 mt-2 hidden md:block">
        <div className="bg-indigo-900/40 p-4 rounded-2xl border border-indigo-800/50 space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-2 mb-1.5">
              I Speak (Native)
            </label>
            <div className="relative">
              <select 
                value={nativeLanguage} 
                onChange={(e) => setNativeLanguage(e.target.value)}
                className="w-full bg-indigo-950 border border-indigo-800 rounded-xl p-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer hover:bg-indigo-900 transition-colors"
              >
                {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 text-[10px] pointer-events-none"></i>
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-2 mb-1.5">
              Learning (Target)
            </label>
            <div className="relative">
              <select 
                value={targetLanguage} 
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full bg-indigo-950 border border-indigo-800 rounded-xl p-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer hover:bg-indigo-900 transition-colors"
              >
                {/* Fallback to Spanish if user isn't loaded yet */}
                {(user?.unlockedLanguages || ['Spanish']).map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 text-[10px] pointer-events-none"></i>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 mt-6 overflow-y-auto custom-scrollbar px-2 pb-10">
        {['Main', 'Skillsets', 'Tools', 'Social'].map(group => (
          <div key={group} className="mb-4">
            <div className="px-4 mb-2 hidden md:block">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{group}</span>
            </div>
            {menuItems.filter(item => item.group === group).map((item) => (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`w-full flex items-center gap-4 px-4 py-2.5 transition-all relative group rounded-xl mb-1 ${
                  activeView === item.view 
                    ? 'bg-indigo-800 text-white shadow-lg' 
                    : 'text-indigo-300 hover:bg-indigo-900 hover:text-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${activeView === item.view ? 'bg-indigo-500 text-white' : 'bg-indigo-900/50 text-indigo-400 group-hover:bg-indigo-800'}`}>
                  <i className={`fa-solid ${item.icon} text-base`}></i>
                </div>
                <span className="hidden md:block font-semibold text-sm tracking-wide">{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-indigo-900">
        <button 
          onClick={() => setActiveView(AppView.STORE)}
          className="w-full bg-indigo-900/40 p-3 rounded-2xl mb-4 hidden md:flex items-center justify-center gap-2 border border-indigo-800/50 hover:bg-indigo-900 transition-all"
        >
          <span className="text-xs font-bold text-amber-400">{user?.tokens || 0} 🪙</span>
          <i className="fa-solid fa-plus text-[10px] text-indigo-400"></i>
        </button>
        <button 
          onClick={() => setActiveView(AppView.PROFILE)}
          className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-indigo-900 transition-all group"
        >
          <img src={user?.avatar} className="w-8 h-8 rounded-lg" alt="" />
          <div className="hidden md:block text-left overflow-hidden">
             <p className="text-xs font-bold truncate">{user?.name}</p>
             <p className="text-[9px] text-indigo-400 font-bold uppercase">View Profile</p>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
