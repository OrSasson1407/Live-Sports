import { ReactNode } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useSportsStore } from '../store/useSportsStore';

export default function Layout({ children }: { children: ReactNode }) {
  const isConnected = useSportsStore((state) => state.isConnected);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6 text-gray-400 cursor-pointer lg:hidden" />
          <div className="font-bold text-xl flex items-center gap-2">
            <span className="text-blue-500">LiveScore</span> PRO
          </div>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex relative w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search teams, players, or matches..." 
            className="w-full bg-gray-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            {isConnected ? 'LIVE' : 'DISCONNECTED'}
          </div>
          <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 flex gap-6">
        {/* Sidebar Filters (Leagues/Sports) */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-gray-800 rounded-xl p-4 sticky top-20">
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Top Leagues</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 cursor-pointer hover:text-blue-400 transition-colors">
                <span className="text-xl">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span> Premier League
              </li>
              <li className="flex items-center gap-3 cursor-pointer hover:text-blue-400 transition-colors">
                <span className="text-xl">🇪🇸</span> La Liga
              </li>
              <li className="flex items-center gap-3 cursor-pointer hover:text-blue-400 transition-colors">
                <span className="text-xl">🏀</span> NBA
              </li>
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