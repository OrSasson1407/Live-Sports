import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { useSportsStore } from '../store/useSportsStore';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
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
    const q = query.toLowerCase();
    return game.homeTeam.toLowerCase().includes(q) || game.awayTeam.toLowerCase().includes(q);
  });

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  const handleSelectMatch = (matchId: string) => {
    navigate(`/match/${matchId}`);
    handleClear();
  };

  const popularSearches = ['Messi', 'Real Madrid', 'Barcelona', 'Premier League', 'NBA'];

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search teams, players..."
          className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl py-2.5 pl-9 pr-10 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-md"
        />
        {!query && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-mono text-muted-foreground shadow-inner">⌘</kbd>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-mono text-muted-foreground shadow-inner">K</kbd>
          </div>
        )}
        {query && (
          <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-muted-foreground hover:text-white hover:bg-white/10 transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto animate-fade-in">
          {query.length > 0 ? (
            searchResults.length > 0 ? (
              <div>
                <div className="px-4 py-2 border-b border-white/10">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={10} /> Matches
                  </span>
                </div>
                {searchResults.map(([id, game]) => (
                  <div
                    key={id}
                    onClick={() => handleSelectMatch(id)}
                    className="px-4 py-3 cursor-pointer hover:bg-white/10 transition-all flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold">
                        {game.homeTeam} <span className="text-muted-foreground mx-1">vs</span> {game.awayTeam}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs flex items-center gap-1 ${game.status === 'live' ? 'text-red-400' : 'text-muted-foreground'}`}>
                          {game.status === 'live' && <Clock size={10} className="animate-pulse" />}
                          {game.status === 'live' ? game.clock : game.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{game.sport === 'basketball' ? '🏀' : '⚽'}</span>
                      </div>
                    </div>
                    <div className="font-mono font-black text-lg tabular-nums">
                      {game.homeScore} – {game.awayScore}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <Search size={32} className="text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="text-muted-foreground text-sm">No results for "{query}"</p>
              </div>
            )
          ) : (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={12} className="text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Popular</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-full bg-white/10 text-xs text-foreground hover:bg-primary/30 hover:scale-105 transition-all shadow-md"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}