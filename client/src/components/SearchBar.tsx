import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, User, Shield } from 'lucide-react';
import { useSportsStore } from '../store/useSportsStore';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Pull active games from global store
  const games = useSportsStore((state) => state.games);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter matches based on search query
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
    handleClear();
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-lg z-50">
      {/* Search Input Box */}
      <div className="relative flex items-center w-full group">
        <Search className="absolute left-4 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search teams, players, or matches..."
          className="w-full bg-gray-900/50 border border-gray-700/50 rounded-full py-2 pl-11 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-gray-900 transition-all backdrop-blur-sm"
        />
        
        {/* Keyboard shortcut hint (hidden when typing) */}
        {!query && (
           <div className="absolute right-4 hidden sm:flex items-center gap-1 border border-gray-700 rounded px-1.5 py-0.5 text-[10px] font-bold text-gray-500">
             <span>⌘</span><span>K</span>
           </div>
        )}

        {/* Clear Button */}
        {query && (
          <button 
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown Results Area */}
      {isOpen && query.length > 1 && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)] max-h-[400px] overflow-y-auto flex flex-col py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {searchResults.length > 0 ? (
            <div className="mb-2">
              <div className="px-4 py-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2">
                <Shield size={12} /> Matches & Teams
              </div>
              
              {searchResults.map(([id, game]) => (
                <div 
                  key={id}
                  onClick={() => handleSelectMatch(id)}
                  className="px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-blue-500/10 border-l-2 border-transparent hover:border-blue-500 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-white font-medium text-sm">
                      {game.homeTeam} <span className="text-gray-500 font-normal mx-1">vs</span> {game.awayTeam}
                    </span>
                    <span className={`text-xs flex items-center gap-1.5 ${game.status === 'live' ? 'text-red-400' : 'text-gray-500'}`}>
                      {game.status === 'live' ? <Clock size={12} className="animate-pulse" /> : null}
                      {game.status === 'live' ? `Live • ${game.clock}` : game.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="text-white font-black font-mono bg-gray-800 px-3 py-1 rounded-lg border border-gray-700">
                    {game.homeScore} - {game.awayScore}
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="px-4 py-8 text-center text-gray-500 text-sm flex flex-col items-center gap-2">
               <Search size={24} className="text-gray-700 mb-2" />
               No matches found for "{query}"
             </div>
          )}

          {/* MOCK PLAYER RESULT: Demonstrates categorized search layout */}
          {query.toLowerCase().includes('messi') && (
             <div className="border-t border-gray-800/50 pt-2 mt-1">
               <div className="px-4 py-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2">
                 <User size={12} /> Players
               </div>
               <div 
                 onClick={() => {
                   navigate('/player/123'); // Navigates to PlayerView component
                   handleClear();
                 }}
                 className="px-4 py-3 cursor-pointer flex items-center gap-4 hover:bg-blue-500/10 border-l-2 border-transparent hover:border-blue-500 transition-colors"
               >
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                   LM
                 </div>
                 <div className="flex flex-col">
                   <span className="text-white font-bold text-sm">Lionel Messi</span>
                   <span className="text-gray-400 text-xs mt-0.5">Forward • Inter Miami CF</span>
                 </div>
               </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
}