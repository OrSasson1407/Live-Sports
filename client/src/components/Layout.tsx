import { ReactNode, useState, useEffect } from 'react';
import { Bell, Menu, WifiOff } from 'lucide-react';
import { useSportsStore } from '../store/useSportsStore';
import SearchBar from './SearchBar';

export default function Layout({ children }: { children: ReactNode }) {
  const isConnected = useSportsStore((state) => state.isConnected);
  const [showToast, setShowToast] = useState(false);

  // Mock a global toast notification popping up for demonstration
  useEffect(() => {
    if (isConnected) {
      const timer = setTimeout(() => setShowToast(true), 15000); // Pops up after 15s
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col font-sans">
      
      {/* Offline Banner */}
      {!isConnected && (
        <div className="bg-red-500/90 text-white text-sm py-1.5 px-4 flex items-center justify-center gap-2 animate-pulse z-50">
          <WifiOff size={16} />
          <span>Connection lost. Attempting to reconnect to live feed...</span>
        </div>
      )}

      {/* Top Navbar - Upgraded with Glassmorphism */}
      <header className="sticky top-0 z-40 bg-gray-950/70 backdrop-blur-lg border-b border-gray-800/50 px-4 h-16 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6 text-gray-400 cursor-pointer lg:hidden hover:text-white transition-colors" />
          <div className="font-bold text-xl flex items-center gap-2 tracking-tight">
            <span className="text-blue-500">LiveScore</span> PRO
          </div>
        </div>

        {/* Global Search Component */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

        <div className="flex items-center gap-4">
          <div className={`hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border ${isConnected ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            {isConnected ? 'LIVE SYNC' : 'OFFLINE'}
          </div>
          
          {/* Notification Bell with indicator */}
          <div className="relative cursor-pointer group">
            <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-gray-900"></span>
          </div>
        </div>
      </header>

      {/* Global Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50 bg-gray-900 border border-gray-700 shadow-2xl rounded-xl p-4 flex gap-4 items-start w-80 animate-in slide-in-from-right-8 duration-300">
           <div className="text-2xl">⚽</div>
           <div className="flex-1">
             <div className="text-xs text-blue-400 font-bold mb-1">GOAL • Premier League</div>
             <div className="text-sm font-semibold">Arsenal 1 - 0 Chelsea</div>
             <div className="text-xs text-gray-400 mt-1">Saka 14'</div>
           </div>
           <button onClick={() => setShowToast(false)} className="text-gray-500 hover:text-white">&times;</button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 flex gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-5 sticky top-24 backdrop-blur-sm">
            <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">Pinned Competitions</h3>
            <ul className="space-y-1">
              {['🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League', '🇪🇸 La Liga', '🏀 NBA', '🏆 Champions League'].map((league, i) => (
                <li key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-800 text-gray-300 hover:text-white transition-all">
                  <span className="text-lg">{league.split(' ')[0]}</span>
                  <span className="text-sm font-medium">{league.split(' ').slice(1).join(' ')}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Dynamic Page Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}