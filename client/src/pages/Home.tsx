import { useState } from 'react';
import MatchCard from '../components/MatchCard';
import { useSportsStore } from '../store/useSportsStore';
import { Activity, Search } from 'lucide-react';

// Upgraded SVG icons to match the premium theme
function SportIcon({ sport }: { sport: string }) {
  if (sport === 'basketball') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-orange-400">
        <circle cx="12" cy="12" r="10"/><path d="M4.9 4.9C7 7 8 9.5 8 12s-1 5-3.1 7.1M19.1 4.9C17 7 16 9.5 16 12s1 5 3.1 7.1M2 12h20M12 2v20"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-emerald-400">
      <circle cx="12" cy="12" r="10"/><path d="M12 2C6.5 11 6.5 13 12 22M12 2c5.5 9 5.5 11 0 20M2.5 9h19M2.5 15h19"/>
    </svg>
  );
}

export default function Home() {
  const games = useSportsStore((state) => state.games);
  const liveGameIds = Object.keys(games);
  
  const [activeTab, setActiveTab] = useState<'all' | 'soccer' | 'basketball'>('all');

  const bballMatches = liveGameIds.filter(id => games[id]?.sport === 'basketball');
  const soccerMatches = liveGameIds.filter(id => games[id]?.sport === 'soccer');

  const groups = [];
  if (activeTab === 'all' || activeTab === 'soccer') {
    if (soccerMatches.length > 0) groups.push({ title: 'Football', id: 'soccer', icon: 'soccer', matches: soccerMatches });
  }
  if (activeTab === 'all' || activeTab === 'basketball') {
    if (bballMatches.length > 0) groups.push({ title: 'Basketball', id: 'basketball', icon: 'basketball', matches: bballMatches });
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Hero Stats Header */}
      <div className="bg-gray-900/50 border border-gray-800/50 rounded-3xl p-6 md:p-8 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Active Matches <Activity className="text-blue-500 animate-pulse" />
          </h2>
          <p className="text-gray-400 mt-1 font-medium">Live scores updating in real-time</p>
        </div>
        
        <div className="flex items-center gap-6 bg-gray-950/50 p-4 rounded-2xl border border-gray-800/50 w-full md:w-auto">
          <div className="flex flex-col items-center px-4">
            <span className="text-2xl font-black text-white">{liveGameIds.length}</span>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total</span>
          </div>
          <div className="w-px h-10 bg-gray-800" />
          <div className="flex flex-col items-center px-4">
            <span className="text-2xl font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">{soccerMatches.length}</span>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Football</span>
          </div>
          <div className="w-px h-10 bg-gray-800" />
          <div className="flex flex-col items-center px-4">
            <span className="text-2xl font-black text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.3)]">{bballMatches.length}</span>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Hoops</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'all' ? 'bg-blue-600 text-white shadow-[0_4px_20px_-4px_rgba(37,99,235,0.5)]' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          onClick={() => setActiveTab('all')}
        >
          All Sports
        </button>
        <button 
          className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'soccer' ? 'bg-emerald-600 text-white shadow-[0_4px_20px_-4px_rgba(5,150,105,0.5)]' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          onClick={() => setActiveTab('soccer')}
        >
          ⚽ Football <span className="bg-black/20 px-2 py-0.5 rounded-md text-xs">{soccerMatches.length}</span>
        </button>
        <button 
          className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'basketball' ? 'bg-orange-600 text-white shadow-[0_4px_20px_-4px_rgba(234,88,12,0.5)]' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          onClick={() => setActiveTab('basketball')}
        >
          🏀 Basketball <span className="bg-black/20 px-2 py-0.5 rounded-md text-xs">{bballMatches.length}</span>
        </button>
      </div>

      {/* Match Grids */}
      {liveGameIds.length > 0 ? (
        <div className="flex flex-col gap-8">
          {groups.map(group => (
            <div key={group.id} className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 border-b border-gray-800 pb-2">
                <SportIcon sport={group.icon} />
                <h3 className="text-xl font-black text-white tracking-wide uppercase">{group.title}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {group.matches.map(id => (
                  <MatchCard key={id} gameId={id} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Premium Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-900/20 border border-gray-800/30 rounded-3xl backdrop-blur-sm">
          <div className="relative flex items-center justify-center w-24 h-24 mb-6">
            <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 border-2 border-blue-500/40 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
            <div className="bg-gray-900 p-4 rounded-full border border-gray-700 relative z-10">
              <Search size={32} className="text-blue-500" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Awaiting Live Data</h3>
          <p className="text-gray-500 max-w-sm mb-8">Our servers are actively polling the sports database. Live matches will automatically appear here once they begin.</p>
          <div className="w-48 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-1/2 animate-pulse rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}