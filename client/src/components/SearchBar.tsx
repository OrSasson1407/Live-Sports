import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock } from 'lucide-react';
import { useSportsStore } from '../store/useSportsStore';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Pull active games from your global store
  const games = useSportsStore((state) => state.games);

  // Close dropdown when clicking outside of the search component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter matches based on the search query
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
    <div 
      ref={wrapperRef} 
      style={{ position: 'relative', width: '100%', maxWidth: '400px', zIndex: 100 }}
    >
      {/* Search Input Box */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Search 
          size={18} 
          style={{ position: 'absolute', left: '12px', color: '#888' }} 
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search teams, players, or matches..."
          style={{
            width: '100%',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '10px 36px 10px 40px',
            color: '#fff',
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocusCapture={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlurCapture={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
        {query && (
          <button 
            onClick={handleClear}
            style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex' }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Dropdown Results Area */}
      {isOpen && query.length > 1 && (
        <div style={{
          position: 'absolute',
          top: '110%',
          left: 0,
          right: 0,
          backgroundColor: '#1f2937', // dark gray matching your theme
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          maxHeight: '400px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          padding: '0.5rem 0'
        }}>
          
          {searchResults.length > 0 ? (
            <>
              <div style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: '#888', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Matches & Teams
              </div>
              
              {searchResults.map(([id, game]) => (
                <div 
                  key={id}
                  onClick={() => handleSelectMatch(id)}
                  style={{
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(255,255,255,0.02)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ color: '#fff', fontWeight: '500', fontSize: '0.9rem' }}>
                      {game.homeTeam} vs {game.awayTeam}
                    </span>
                    <span style={{ color: game.status === 'live' ? '#ef4444' : '#888', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {game.status === 'live' ? <Clock size={12} /> : null}
                      {game.status === 'live' ? `Live • ${game.clock}` : game.status}
                    </span>
                  </div>
                  
                  <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>
                    {game.homeScore} - {game.awayScore}
                  </div>
                </div>
              ))}
            </>
          ) : (
             <div style={{ padding: '1.5rem', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
               No matches found for "{query}"
             </div>
          )}

          {/* MOCK PLAYER RESULT: This demonstrates how a player search would look */}
          {query.toLowerCase() === 'messi' && (
             <>
               <div style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: '#888', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>
                 Players
               </div>
               <div 
                  onClick={() => {
                    navigate('/player/123'); // Navigates to the PlayerView component
                    handleClear();
                  }}
                  style={{
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px' }}>
                    LM
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: '#fff', fontWeight: '500', fontSize: '0.9rem' }}>Lionel Messi</span>
                    <span style={{ color: '#888', fontSize: '0.75rem' }}>Forward • Inter Miami CF</span>
                  </div>
                </div>
             </>
          )}

        </div>
      )}
    </div>
  );
}