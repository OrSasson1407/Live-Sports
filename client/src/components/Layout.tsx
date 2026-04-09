import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, X, Zap } from 'lucide-react';
import { useSportsStore } from '../store/useSportsStore';
import SearchBar from './SearchBar';

export default function Layout({ children }: { children: ReactNode }) {
  const isConnected = useSportsStore((state) => state.isConnected);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left: Logo + mobile menu */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <Link to="/" className="flex items-center gap-2">
                <Zap size={20} className="text-blue-500" />
                <span className="font-bold text-lg">ScoreHub</span>
              </Link>
            </div>

            {/* Center: Search (hidden on mobile) */}
            <div className="hidden md:block flex-1 max-w-md mx-6">
              <SearchBar />
            </div>

            {/* Right: status + notifications */}
            <div className="flex items-center gap-3">
              <div
                className={`hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold ${
                  isConnected
                    ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                {isConnected ? 'LIVE' : 'OFFLINE'}
              </div>
              <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <Bell size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-xl p-4">
            <div className="flex justify-end mb-4">
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Live</Link>
              <Link to="/matches" className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Matches</Link>
              <Link to="/favourites" className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Favourites</Link>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}