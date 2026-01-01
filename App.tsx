
import React, { useState, useEffect } from 'react';
import { AppView, User, VocabularyWord, LearningPurpose } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GrammarHub from './components/GrammarHub';
import VocabularyVault from './components/VocabularyVault';
import AIConversation from './components/AIConversation';
import CulturalLayer from './components/CulturalLayer';
import Community from './components/Community';
import OfflineMode from './components/OfflineMode';
import ReadingHub from './components/ReadingHub';
import WritingHub from './components/WritingHub';
import ListeningHub from './components/ListeningHub';
import Auth from './components/Auth';
import ProfilePage from './components/ProfilePage';
import SubscriptionStore from './components/SubscriptionStore';

const SplashScreen: React.FC = () => (
  <div className="fixed inset-0 bg-indigo-950 flex flex-col items-center justify-center z-[9999] overflow-hidden">
    <div className="relative">
      <div className="w-32 h-32 bg-indigo-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-500/40 animate-[spin_2s_ease-in-out_infinite] perspective-1000">
        <i className="fa-solid fa-stairs text-white text-5xl"></i>
      </div>
      <div className="absolute inset-0 border-4 border-indigo-400/20 rounded-full scale-150 animate-ping duration-1000"></div>
      <div className="absolute inset-0 border-2 border-indigo-400/10 rounded-full scale-[2] animate-ping duration-1000 delay-300"></div>
    </div>
    <div className="mt-12 text-center animate-pulse">
      <h1 className="text-white text-4xl font-black tracking-tighter">PolyStep<span className="text-indigo-400">AI</span></h1>
      <p className="text-indigo-300/60 text-xs font-bold uppercase tracking-[0.4em] mt-2">Bridging the Plateau</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<AppView>(AppView.AUTH);
  const [viewParams, setViewParams] = useState<any>(null);
  const [nativeLanguage, setNativeLanguage] = useState('English');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [offlineEnabled, setOfflineEnabled] = useState(false);
  
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([
    { id: '1', word: 'Aprovechar', translation: 'To take advantage of', mastery: 65, lastReviewed: '2023-10-25', example: 'Debes aprovechar esta oportunidad.', source: 'Reading' },
    { id: '2', word: 'Ojalá', translation: 'Hopefully / I wish', mastery: 80, lastReviewed: '2023-10-26', example: 'Ojalá llueva pronto.', source: 'Speaking' },
    { id: '3', word: 'Desarrollar', translation: 'To develop', mastery: 40, lastReviewed: '2023-10-24', example: 'Queremos desarrollar una nueva app.', source: 'Writing' },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => { setShowSplash(false); }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('poly_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setActiveView(AppView.DASHBOARD);
    }
  }, []);

  const handleLogin = (name: string, email: string) => {
    const newUser: User = {
      id: 'user_123',
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      tokens: 150,
      streak: 12,
      level: 18,
      xp: 1240,
      unlockedLanguages: ['Spanish', 'French', 'German'],
      unlockedContent: ['grammar_subjunctive', 'reading_basic'],
      isPro: false,
      learningPurpose: 'Daily Communication'
    };
    setUser(newUser);
    localStorage.setItem('poly_user', JSON.stringify(newUser));
    setActiveView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('poly_user');
    setActiveView(AppView.AUTH);
  };

  const changeView = (view: AppView, params?: any) => {
    setActiveView(view);
    setViewParams(params);
  };

  const updatePurpose = (purpose: LearningPurpose) => {
    if (!user) return;
    const updatedUser = { ...user, learningPurpose: purpose };
    setUser(updatedUser);
    localStorage.setItem('poly_user', JSON.stringify(updatedUser));
  };

  const addVocab = (word: Omit<VocabularyWord, 'id' | 'mastery' | 'lastReviewed'>) => {
    const newWord: VocabularyWord = {
      ...word,
      id: Math.random().toString(36).substr(2, 9),
      mastery: 0,
      lastReviewed: new Date().toISOString().split('T')[0]
    };
    setVocabulary(prev => [...prev, newWord]);
  };

  const unlockLanguage = (lang: string) => {
    if (!user || user.tokens < 100) return;
    const updatedUser = { 
      ...user, 
      tokens: user.tokens - 100,
      unlockedLanguages: [...user.unlockedLanguages, lang]
    };
    setUser(updatedUser);
    localStorage.setItem('poly_user', JSON.stringify(updatedUser));
  };

  const unlockContent = (contentId: string, cost: number) => {
    if (!user || user.tokens < cost || user.unlockedContent.includes(contentId)) return false;
    const updatedUser = {
      ...user,
      tokens: user.tokens - cost,
      unlockedContent: [...user.unlockedContent, contentId]
    };
    setUser(updatedUser);
    localStorage.setItem('poly_user', JSON.stringify(updatedUser));
    return true;
  };

  if (showSplash) return <SplashScreen />;
  if (activeView === AppView.AUTH) return <Auth onLogin={handleLogin} />;

  const renderView = () => {
    if (!user) return <Auth onLogin={handleLogin} />;
    
    switch (activeView) {
      case AppView.DASHBOARD:
        return <Dashboard user={user} vocabulary={vocabulary} language={targetLanguage} setPurpose={updatePurpose} setActiveView={changeView} />;
      case AppView.GRAMMAR:
        return <GrammarHub language={targetLanguage} nativeLanguage={nativeLanguage} user={user} onUnlock={unlockContent} />;
      case AppView.VOCABULARY:
        return <VocabularyVault vocabulary={vocabulary} setVocabulary={setVocabulary} user={user} onUnlock={unlockContent} />;
      case AppView.READING:
        return <ReadingHub language={targetLanguage} nativeLanguage={nativeLanguage} onSaveVocab={addVocab} user={user} onUnlock={unlockContent} />;
      case AppView.WRITING:
        return <WritingHub language={targetLanguage} nativeLanguage={nativeLanguage} user={user} onUnlock={unlockContent} />;
      case AppView.SPEAKING:
        return (
          <AIConversation 
            targetLanguage={targetLanguage} 
            setTargetLanguage={setTargetLanguage}
            nativeLanguage={nativeLanguage} 
            setNativeLanguage={setNativeLanguage}
            user={user} 
            onUnlock={unlockContent}
            onSaveVocab={addVocab}
            initialMode={viewParams?.mode}
          />
        );
      case AppView.LISTENING:
        return <ListeningHub language={targetLanguage} user={user} onUnlock={unlockContent} />;
      case AppView.CULTURE:
        return <CulturalLayer language={targetLanguage} isPro={user.isPro} />;
      case AppView.COMMUNITY:
        return <Community language={targetLanguage} />;
      case AppView.OFFLINE:
        return <OfflineMode enabled={offlineEnabled} setEnabled={setOfflineEnabled} language={targetLanguage} />;
      case AppView.PROFILE:
        return <ProfilePage user={user} onLogout={handleLogout} onUnlock={unlockLanguage} />;
      case AppView.STORE:
        return <SubscriptionStore user={user} onPurchase={(amount) => {
          const updatedUser = { ...user, tokens: user.tokens + amount };
          setUser(updatedUser);
          localStorage.setItem('poly_user', JSON.stringify(updatedUser));
        }} />;
      default:
        return <Dashboard user={user} vocabulary={vocabulary} language={targetLanguage} setPurpose={updatePurpose} setActiveView={changeView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <Sidebar 
        activeView={activeView} 
        setActiveView={changeView} 
        nativeLanguage={nativeLanguage}
        setNativeLanguage={setNativeLanguage}
        targetLanguage={targetLanguage}
        setTargetLanguage={setTargetLanguage}
        user={user}
      />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                {activeView.charAt(0) + activeView.slice(1).toLowerCase().replace('_', ' ')}
              </h1>
              {offlineEnabled && (
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <i className="fa-solid fa-cloud-arrow-down"></i> OFFLINE READY
                </span>
              )}
            </div>
            <p className="text-slate-500 font-medium">Mastering {targetLanguage} for {user?.learningPurpose}</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="font-bold text-indigo-600 flex items-center gap-2">
                  <i className="fa-solid fa-fire animate-pulse"></i> {user?.streak} Day Streak
                </span>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full w-[80%]"></div>
                   </div>
                   <span className="text-[10px] text-gray-400 font-bold uppercase">{user?.tokens} PolyTokens</span>
                </div>
             </div>
             <div className="flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer group" onClick={() => setActiveView(AppView.PROFILE)}>
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-800 leading-none group-hover:text-indigo-600 transition-colors">{user?.name}</p>
                  <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Level {user?.level} {user?.isPro ? 'Pro' : 'Standard'}</p>
               </div>
               <img src={user?.avatar} alt="Avatar" className="w-12 h-12 rounded-2xl bg-indigo-50 border-2 border-white shadow-sm group-hover:scale-105 transition-transform" />
             </div>
          </div>
        </header>
        <div className="max-w-6xl mx-auto pb-12">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
