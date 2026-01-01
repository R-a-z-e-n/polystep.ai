
import React from 'react';
import { User } from '../types';

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
  onUnlock: (lang: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout, onUnlock }) => {
  const allLanguages = ['French', 'German', 'Japanese', 'Italian', 'Chinese', 'Portuguese', 'Korean', 'Russian'];
  const availableToUnlock = allLanguages.filter(l => !user.unlockedLanguages.includes(l));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-10">
        <div className="relative">
          <img src={user.avatar} className="w-32 h-32 rounded-[2.5rem] bg-indigo-50 border-4 border-white shadow-xl" alt="Profile" />
          {user.isPro && (
            <div className="absolute -top-2 -right-2 bg-amber-400 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg">
              <i className="fa-solid fa-crown text-sm"></i>
            </div>
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">{user.name}</h2>
          <p className="text-gray-400 font-medium mb-6">{user.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="bg-indigo-50 px-4 py-2 rounded-2xl">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Tokens</span>
              <span className="text-lg font-black text-indigo-600">{user.tokens} 🪙</span>
            </div>
            <div className="bg-emerald-50 px-4 py-2 rounded-2xl">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">XP Points</span>
              <span className="text-lg font-black text-emerald-600">{user.xp}</span>
            </div>
            <div className="bg-rose-50 px-4 py-2 rounded-2xl">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">Streak</span>
              <span className="text-lg font-black text-rose-600">{user.streak} days</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="bg-gray-100 text-gray-500 px-6 py-3 rounded-2xl font-bold hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center gap-2"
        >
          <i className="fa-solid fa-power-off"></i>
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <i className="fa-solid fa-flag text-indigo-500"></i>
            Unlocked Languages
          </h3>
          <div className="space-y-4">
            {user.unlockedLanguages.map(lang => (
              <div key={lang} className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <span className="font-bold text-indigo-900">{lang}</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase bg-white px-3 py-1 rounded-full shadow-sm">Active</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <i className="fa-solid fa-lock-open text-amber-500"></i>
              Unlock New Language
            </h3>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-widest">
              Cost: 100 🪙
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {availableToUnlock.map(lang => (
              <button 
                key={lang}
                onClick={() => onUnlock(lang)}
                disabled={user.tokens < 100}
                className="p-4 rounded-2xl border-2 border-dashed border-gray-100 text-slate-400 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-all text-sm font-bold flex items-center justify-between group disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {lang}
                <i className="fa-solid fa-unlock opacity-0 group-hover:opacity-100 transition-opacity"></i>
              </button>
            ))}
          </div>
          {user.tokens < 100 && (
            <p className="mt-4 text-center text-xs text-rose-500 font-bold">
              Need {100 - user.tokens} more tokens to unlock a new language!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
