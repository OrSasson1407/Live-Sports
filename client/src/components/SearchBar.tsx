// components/SearchBar.tsx - Premium Redesign
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, User, Shield, TrendingUp } from 'lucide-react';
import { useSportsStore } from '../store/useSportsStore';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const games = useSportsStore((state) => state.games);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = Object.entries(games).filter(([_, game]) => {
    if (!query) return false;
    const searchLower = query.toLowerCase();
    return (
      game.homeTeam.toLowerCase().includes(searchLower) ||
      game.awayTeam.toLowerCase().includes(searchLower)
    );
  });

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  const handleSelectMatch = (matchId: string) => {
    navigate(`/match/${matchId}`);
    setRecentSearches(prev => [matchId, ...prev.filter(id => id !== matchId)].slice(0, 5));
    handleClear();
  };

  const popularSearches = ['Messi', 'Real Madrid', 'Barcelona', 'Premier League', 'NBA'];

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search teams, players, or matches..."
          className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-2.5 pl-9 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
        />
        
        {!query && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] font-mono text-gray-500">⌘</kbd>
            <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] font-mono text-gray-500">K</kbd>
          </div>
        )}

        {query && (
          <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && query.length > 0 && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#1a1c23] border border-white/10 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50 animate-fadeIn">
          {searchResults.length > 0 ? (
            <div>
              <div className="px-4 py-2 border-b border-white/5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Shield size={10} /> Matches
                </span>
              </div>
              
              {searchResults.map(([id, game]) => (
                <div 
                  key={id}
                  onClick={() => handleSelectMatch(id)}
                  className="px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {game.homeTeam} <span className="text-gray-500 mx-1">vs</span> {game.awayTeam}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs flex items-center gap-1 ${game.status === 'live' ? 'text-red-400' : 'text-gray-500'}`}>
                        {game.status === 'live' && <Clock size={10} className="animate-pulse" />}
                        {game.status === 'live' ? game.clock : game.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-xs text-gray-500">{game.sport === 'basketball' ? '🏀' : '⚽'}</span>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-lg tabular-nums">
                    {game.homeScore} - {game.awayScore}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center">
              <Search size={32} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No results found for "{query}"</p>
              <p className="text-xs text-gray-500 mt-1">Try searching for a team or player name</p>
            </div>
          )}
        </div>
      )}

      {/* Popular searches when focused but empty */}
      {isOpen && !query && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#1a1c23] border border-white/10 rounded-xl shadow-2xl z-50 animate-fadeIn">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={12} className="text-gray-500" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Popular Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}