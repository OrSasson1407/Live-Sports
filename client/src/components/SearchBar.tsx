import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock } from 'lucide-react';
import { useSportsStore } from '../store/useSportsStore';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const games = useSportsStore((state) => state.games);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
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
      if (e.key === 'Escape') { setIsOpen(false); setQuery(''); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = Object.entries(games).filter(([_, game]) => {
    if (!query) return false;
    const q = query.toLowerCase();
    return game.homeTeam.toLowerCase().includes(q) || game.awayTeam.toLowerCase().includes(q);
  });

  const handleClear = () => { setQuery(''); setIsOpen(false); };

  const handleSelectMatch = (matchId: string) => {
    navigate(`/match/${matchId}`);
    handleClear();
  };

  const recentSearches = ['Real Madrid', 'Barcelona', 'Premier League', 'NBA'];

  return (
    <div ref={wrapperRef} className="relative w-full max-w-sm">
      {/* ── Input ───────────────────────────────────────── */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'hsl(var(--muted-foreground))' }}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search teams, players..."
          style={{
            width: '100%',
            height: '32px',
            background: 'hsl(var(--surface-2))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            paddingLeft: '30px',
            paddingRight: query ? '28px' : '8px',
            fontSize: '13px',
            color: 'hsl(var(--foreground))',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocusCapture={(e) => (e.currentTarget.style.borderColor = 'hsl(var(--primary))')}
          onBlurCapture={(e) => (e.currentTarget.style.borderColor = 'hsl(var(--border))')}
        />
        {/* Keyboard shortcut hint */}
        {!query && (
          <div
            className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5"
            style={{ pointerEvents: 'none' }}
          >
            <kbd style={{
              padding: '1px 4px',
              background: 'hsl(var(--surface-3))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '3px',
              fontSize: '10px',
              color: 'hsl(var(--muted-foreground))',
              fontFamily: 'monospace',
            }}>⌘K</kbd>
          </div>
        )}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors"
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* ── Dropdown ────────────────────────────────────── */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 animate-fade-in z-50 overflow-hidden"
          style={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            maxHeight: '360px',
            overflowY: 'auto',
          }}
        >
          {query.length > 0 ? (
            searchResults.length > 0 ? (
              <>
                {/* Section label */}
                <div
                  className="px-3 py-2"
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'hsl(var(--muted-foreground))',
                    borderBottom: '1px solid hsl(var(--border))',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Matches
                </div>
                {searchResults.map(([id, game]) => (
                  <div
                    key={id}
                    onClick={() => handleSelectMatch(id)}
                    className="flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors"
                    style={{ borderBottom: '1px solid hsl(var(--border))' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'hsl(var(--card-hover))')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'hsl(var(--foreground))' }}>
                        {game.homeTeam}
                        <span style={{ color: 'hsl(var(--muted-foreground))', margin: '0 6px' }}>vs</span>
                        {game.awayTeam}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {game.status === 'live' && (
                          <span className="badge-live" style={{ fontSize: '10px', padding: '1px 4px' }}>
                            <span className="live-dot" style={{ width: '5px', height: '5px' }} />
                            {game.clock}
                          </span>
                        )}
                        <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                          {game.sport === 'basketball' ? 'Basketball' : 'Football'}
                        </span>
                      </div>
                    </div>
                    <span
                      className="font-mono font-bold text-sm tabular-nums shrink-0 ml-3"
                      style={{ color: 'hsl(var(--foreground))' }}
                    >
                      {game.homeScore}–{game.awayScore}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <div className="px-4 py-8 text-center">
                <Search size={28} style={{ color: 'hsl(var(--surface-3))', margin: '0 auto 8px' }} />
                <p style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
                  No results for "{query}"
                </p>
              </div>
            )
          ) : (
            /* Recent / suggested */
            <div className="p-3">
              <p
                className="mb-2"
                style={{ fontSize: '11px', fontWeight: 600, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                Recent
              </p>
              <div className="flex flex-col">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="flex items-center gap-2.5 px-2 py-2 rounded text-left transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'hsl(var(--card-hover))')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Clock size={13} style={{ color: 'hsl(var(--muted-foreground))', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: 'hsl(var(--foreground))' }}>{term}</span>
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
