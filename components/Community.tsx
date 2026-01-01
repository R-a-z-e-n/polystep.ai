
import React, { useState } from 'react';
import { CommunityPost } from '../types';

interface CommunityProps {
  language: string;
}

const Community: React.FC<CommunityProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges' | 'groups'>('feed');
  const [showAllRankings, setShowAllRankings] = useState(false);

  const posts: CommunityPost[] = [
    {
      id: '1',
      author: 'Maria G.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      content: `Anyone else struggling with the difference between "por" and "para" in ${language}? I found this amazing trick: think of "por" as the cause and "para" as the destination! 🚀`,
      likes: 24,
      comments: 5,
      tags: ['Grammar', 'Tips'],
      timestamp: '2h ago'
    },
    {
      id: '2',
      author: 'Kenji T.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kenji',
      content: `Just hit my 30-day streak! The ${language} AI partner is really helping me sound more natural. Anyone want to join a speaking challenge tomorrow?`,
      likes: 56,
      comments: 12,
      tags: ['Milestone', 'Challenge'],
      timestamp: '5h ago'
    },
    {
      id: '3',
      author: 'Sarah L.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      content: `Found some great slang in Mexico City this weekend. "Chido" is everywhere! Does anyone know the ${language} equivalent in Spain?`,
      likes: 18,
      comments: 3,
      tags: ['Culture', 'Slang'],
      timestamp: '8h ago'
    }
  ];

  const challenges = [
    { title: 'The 500-Word Essay', participants: 420, rewards: '50 Tokens', deadline: '2 days' },
    { title: 'Daily Subjunctive Drill', participants: 1250, rewards: '10 Tokens', deadline: '8 hours' },
    { title: 'Culture Quiz: Madrid', participants: 310, rewards: 'Badge: Explorer', deadline: '5 days' }
  ];

  const rankings = [
    { name: 'Maria G.', score: '4,205', rank: 1, avatar: posts[0]?.avatar },
    { name: 'Kenji T.', score: '3,890', rank: 2, avatar: posts[1]?.avatar },
    { name: 'Sarah L.', score: '3,550', rank: 3, avatar: posts[2]?.avatar },
    { name: 'You', score: '3,124', rank: 4, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { name: 'Hiroshi S.', score: '2,980', rank: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hiroshi' },
    { name: 'Elena R.', score: '2,750', rank: 6, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
    { name: 'Thomas M.', score: '2,400', rank: 7, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas' },
    { name: 'Chloe V.', score: '2,150', rank: 8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          {['feed', 'challenges', 'groups'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all uppercase tracking-wider ${
                activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'feed' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-100 border-b-4 border-b-indigo-500">
               <div className="flex gap-4">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Me" className="w-12 h-12 rounded-2xl bg-indigo-50" />
                 <div className="flex-1">
                   <textarea 
                     placeholder={`Share a thought in ${language}...`}
                     className="w-full bg-gray-50 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none border-none resize-none h-24"
                   />
                   <div className="flex justify-between items-center mt-4">
                     <div className="flex gap-2">
                       <button className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-gray-200">
                         <i className="fa-solid fa-image"></i>
                       </button>
                       <button className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-gray-200">
                         <i className="fa-solid fa-at"></i>
                       </button>
                     </div>
                     <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-700">
                       Post
                     </button>
                   </div>
                 </div>
               </div>
            </div>

            {posts.map(post => (
              <div key={post.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-indigo-100 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-2xl bg-gray-100" />
                    <div>
                      <h4 className="font-bold text-slate-800">{post.author}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{post.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full uppercase">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm mb-6">
                  {post.content}
                </p>
                <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                  <button className="flex items-center gap-2 text-gray-400 hover:text-rose-500 transition-colors text-xs font-bold">
                    <i className="fa-solid fa-heart"></i> {post.likes}
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-indigo-500 transition-colors text-xs font-bold">
                    <i className="fa-solid fa-comment"></i> {post.comments}
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-emerald-500 transition-colors text-xs font-bold ml-auto">
                    <i className="fa-solid fa-share-nodes"></i> Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {challenges.map((c, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                <div className="relative z-10">
                  <div className="text-amber-500 text-2xl mb-4"><i className="fa-solid fa-trophy"></i></div>
                  <h4 className="font-bold text-slate-800 mb-1">{c.title}</h4>
                  <p className="text-xs text-gray-400 mb-4">{c.participants} people participating</p>
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl mb-6">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Rewards</p>
                      <p className="text-sm font-bold text-indigo-600">{c.rewards}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Time Left</p>
                      <p className="text-sm font-bold text-rose-500">{c.deadline}</p>
                    </div>
                  </div>
                  <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                    Join Challenge
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100">
           <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
                <i className="fa-solid fa-medal"></i>
              </div>
              <h3 className="font-bold text-lg leading-tight">Weekly Leaderboard</h3>
           </div>
           <div className="space-y-4">
              {rankings.slice(0, 3).map((user, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${user.name === 'You' ? 'bg-white/10 ring-1 ring-white/20' : ''}`}>
                   <span className={`w-6 text-center font-bold ${i === 0 ? 'text-amber-300' : 'text-indigo-200'}`}>{user.rank}</span>
                   <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-8 h-8 rounded-lg bg-white/10" alt="" />
                   <span className="flex-1 font-bold text-sm">{user.name}</span>
                   <span className="font-bold text-xs">{user.score} XP</span>
                </div>
              ))}
           </div>
           <button 
             onClick={() => setShowAllRankings(true)}
             className="w-full mt-6 bg-white text-indigo-600 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors active:scale-95"
           >
              View All Rankings
           </button>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
           <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Active Study Groups</h3>
           <div className="space-y-4">
              {[
                { name: 'Business Spanish', members: 840, activity: 'High' },
                { name: 'Subjunctive Survivors', members: 120, activity: 'Very High' },
                { name: 'Culture & Wine', members: 45, activity: 'Medium' }
              ].map((group, i) => (
                <div key={i} className="flex flex-col p-3 rounded-2xl border border-gray-50 hover:border-indigo-100 transition-colors cursor-pointer">
                   <div className="flex justify-between mb-1">
                      <span className="font-bold text-sm text-slate-800">{group.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${group.activity === 'Very High' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {group.activity}
                      </span>
                   </div>
                   <span className="text-xs text-gray-400">{group.members} members</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Leaderboard Modal */}
      {showAllRankings && (
        <div className="fixed inset-0 bg-indigo-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 max-h-[85vh] overflow-hidden flex flex-col relative shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowAllRankings(false)} 
              className="absolute top-8 right-8 text-gray-300 hover:text-indigo-600 transition-colors"
            >
               <i className="fa-solid fa-circle-xmark text-3xl"></i>
            </button>
            <div className="mb-8">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Global Leaderboard</h3>
              <p className="text-gray-400 font-medium">Top learners in the {language} community this week.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {rankings.map((user, i) => (
                <div key={i} className={`flex items-center gap-5 p-5 rounded-3xl transition-all border ${user.name === 'You' ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50/50 border-transparent hover:border-indigo-100'}`}>
                   <span className={`w-8 text-center text-xl font-black ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-600' : 'text-indigo-200'}`}>
                    {user.rank}
                   </span>
                   <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-14 h-14 rounded-2xl bg-white shadow-sm" alt="" />
                   <div className="flex-1">
                      <p className="font-black text-slate-800 text-lg leading-tight">{user.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Intermediate Mastering</p>
                   </div>
                   <div className="text-right">
                      <p className="font-black text-indigo-600 text-xl">{user.score}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">PolyXP</p>
                   </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100 flex justify-center">
              <button 
                onClick={() => setShowAllRankings(false)}
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
              >
                Close Leaderboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
