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
  const handleSelectMatch = (matchId: string) => { navigate(`/match/${matchId}`); handleClear(); };
  const recentSearches = ['Real Madrid', 'Barcelona', 'Premier League', 'NBA'];

  return (
    <div ref={wrapperRef} className="relative w-full max-w-sm">
      {/* Input */}
      <div className="relative">
        <Search
          size={13}
          style={{
            position: 'absolute', left: '10px',
            top: '50%', transform: 'translateY(-50%)',
            color: 'hsl(var(--muted))',
            pointerEvents: 'none',
          }}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search teams..."
          className="search-input"
        />
        {!query && (
          <div style={{
            position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)',
            pointerEvents: 'none', display: 'flex', gap: '2px',
          }}>
            <kbd style={{
              padding: '1px 5px',
              background: 'hsl(var(--surface-2))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '4px',
              fontSize: '10px',
              color: 'hsl(var(--muted))',
              fontFamily: 'monospace',
              lineHeight: '16px',
            }}>⌘K</kbd>
          </div>
        )}
        {query && (
          <button
            onClick={handleClear}
            style={{
              position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
              color: 'hsl(var(--muted))', background: 'none', border: 'none', cursor: 'pointer',
              padding: '2px', borderRadius: '4px',
            }}
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="animate-slide-in"
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '10px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.5), 0 0 0 1px hsl(var(--border))',
            maxHeight: '340px', overflowY: 'auto',
            zIndex: 50,
          }}
        >
          {query.length > 0 ? (
            searchResults.length > 0 ? (
              <>
                <div style={{
                  padding: '8px 12px 6px',
                  fontSize: '10.5px', fontWeight: 600,
                  color: 'hsl(var(--muted))',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  borderBottom: '1px solid hsl(var(--border-subtle))',
                }}>
                  Matches
                </div>
                {searchResults.map(([id, game]) => (
                  <div
                    key={id}
                    onClick={() => handleSelectMatch(id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 12px', cursor: 'pointer',
                      borderBottom: '1px solid hsl(var(--border-subtle))',
                      transition: 'background 0.08s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'hsl(var(--card-hover))')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        fontSize: '13px', fontWeight: 600,
                        color: 'hsl(var(--foreground))',
                        letterSpacing: '-0.01em',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {game.homeTeam}
                        <span style={{ color: 'hsl(var(--muted))', margin: '0 6px', fontWeight: 400 }}>vs</span>
                        {game.awayTeam}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                        {game.status === 'live' && (
                          <span className="badge-live" style={{ fontSize: '10px', padding: '1px 5px' }}>
                            <span className="live-dot" style={{ width: '5px', height: '5px' }} />
                            {game.clock}
                          </span>
                        )}
                        <span style={{ fontSize: '11px', color: 'hsl(var(--muted))' }}>
                          {game.sport === 'basketball' ? 'Basketball' : 'Football'}
                        </span>
                      </div>
                    </div>
                    <span style={{
                      fontFamily: "'SF Mono', monospace",
                      fontSize: '13px', fontWeight: 700,
                      color: 'hsl(var(--foreground))',
                      flexShrink: 0, marginLeft: '12px',
                    }}>
                      {game.homeScore}–{game.awayScore}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                <Search size={24} style={{ color: 'hsl(var(--surface-3))', margin: '0 auto 10px' }} />
                <p style={{ fontSize: '13px', color: 'hsl(var(--muted))' }}>
                  No results for "{query}"
                </p>
              </div>
            )
          ) : (
            <div style={{ padding: '10px 8px' }}>
              <p style={{
                fontSize: '10.5px', fontWeight: 600,
                color: 'hsl(var(--muted))',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                padding: '0 4px 6px',
              }}>
                Recent
              </p>
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    width: '100%', padding: '8px 8px',
                    borderRadius: '6px', textAlign: 'left',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    transition: 'background 0.08s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'hsl(var(--card-hover))')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Clock size={12} style={{ color: 'hsl(var(--muted))', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: 'hsl(var(--foreground-2))', fontWeight: 500 }}>{term}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
