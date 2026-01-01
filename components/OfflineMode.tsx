
import React from 'react';

interface OfflineModeProps {
  enabled: boolean;
  setEnabled: (val: boolean) => void;
  language: string;
}

const OfflineMode: React.FC<OfflineModeProps> = ({ enabled, setEnabled, language }) => {
  const packs = [
    { name: 'Essential Grammar', size: '12 MB', type: 'Core', downloaded: true },
    { name: 'Audio Pronunciation Pack', size: '45 MB', type: 'Media', downloaded: false },
    { name: 'Culture & Slang Bundle', size: '8 MB', type: 'Read', downloaded: false },
    { name: 'AI Partner Sample Phrases', size: '5 MB', type: 'Voice', downloaded: true }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mb-8">
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg transition-colors ${enabled ? 'bg-emerald-500 shadow-emerald-100' : 'bg-gray-200'}`}>
                 <i className="fa-solid fa-cloud-arrow-down"></i>
               </div>
               <div>
                  <h3 className="text-xl font-bold text-slate-800">Master Offline Access</h3>
                  <p className="text-sm text-gray-400 font-medium">Learn even when you're disconnected.</p>
               </div>
            </div>
            <button 
              onClick={() => setEnabled(!enabled)}
              className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${enabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transition-transform duration-300 transform ${enabled ? 'translate-x-8' : 'translate-x-0'}`}></div>
            </button>
         </div>

         <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 mb-8">
            <h4 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
              <i className="fa-solid fa-circle-info"></i> How it works
            </h4>
            <p className="text-xs text-indigo-700 leading-relaxed">
              Enabling offline mode will store essential lesson data and practice exercises in your local cache. Large media files like high-fidelity voice models require manual download.
            </p>
         </div>

         <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Downloadable Packs</h4>
            {packs.map((pack, i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:border-indigo-100 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-400 shadow-sm border border-gray-50">
                        <i className={`fa-solid ${pack.downloaded ? 'fa-check' : 'fa-arrow-down'}`}></i>
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-800">{pack.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[10px] text-gray-400 font-bold uppercase">{pack.type}</span>
                           <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                           <span className="text-[10px] text-gray-400 font-bold uppercase">{pack.size}</span>
                        </div>
                     </div>
                  </div>
                  {pack.downloaded ? (
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">Ready</span>
                  ) : (
                    <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-50">
                      Download
                    </button>
                  )}
               </div>
            ))}
         </div>
      </div>

      <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100 flex flex-col items-center text-center">
         <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-500 text-3xl shadow-sm mb-4">
            <i className="fa-solid fa-plane"></i>
         </div>
         <h4 className="text-amber-900 font-bold mb-2">Traveling Soon?</h4>
         <p className="text-xs text-amber-800 leading-relaxed max-w-sm mb-6">
            Make sure to download the **"Full Immersion Pack"** which includes Carlos's basic voice responses for offline AI conversation simulation.
         </p>
         <button className="bg-amber-500 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-amber-200 hover:bg-amber-600 transition-all">
            Download Travel Pack (120 MB)
         </button>
      </div>
    </div>
  );
};

export default OfflineMode;
