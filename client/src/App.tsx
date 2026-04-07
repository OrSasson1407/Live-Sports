import { useEffect, useRef, useState } from 'react';
import { useSportsStore, GameTick } from './store/useSportsStore';

const API_URL = 'http://localhost:3001';
const WS_URL = 'ws://localhost:3001';

// --- Score Display with flash animation ---
function ScoreDisplay({ score, isHome }: { score: number; isHome: boolean }) {
  const [flash, setFlash] = useState(false);
  const prevScore = useRef(score);

  useEffect(() => {
    if (score !== prevScore.current) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 400);
      prevScore.current = score;
      return () => clearTimeout(t);
    }
  }, [score]);

  const base = 'text-4xl font-mono font-bold px-4 py-2 rounded-lg transition-all duration-300';
  const homeStyle = flash
    ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.6)]'
    : 'text-emerald-400 bg-emerald-400/10';
  const awayStyle = flash
    ? 'bg-white text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.5)]'
    : 'text-white bg-slate-800';

  return (
    <span className={`${base} ${isHome ? homeStyle : awayStyle}`}>{score}</span>
  );
}

// --- Game Card ---
function GameCard({ game }: { game: GameTick }) {
  const theme =
    game.sport === 'basketball'
      ? { border: 'border-orange-500/30', text: 'text-orange-400', bg: 'bg-orange-500/10', dot: 'bg-orange-400' }
      : { border: 'border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-400' };

  const isFinished = game.status === 'finished';

  return (
    <div className={`bg-slate-900 border ${theme.border} rounded-2xl p-6 shadow-xl flex flex-col gap-4`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${theme.bg} ${theme.text}`}>
          {game.sport === 'soccer' ? '⚽ Football' : '🏀 Basketball'}
        </span>
        <div className="flex items-center gap-1.5">
          {!isFinished && (
            <span className={`w-2 h-2 rounded-full animate-pulse ${theme.dot}`} />
          )}
          <span className={`text-sm font-mono ${isFinished ? 'text-slate-500' : 'text-red-400'}`}>
            {isFinished ? 'FINAL' : game.clock}
          </span>
        </div>
      </div>

      {/* Scores */}
      <div className="flex justify-between items-center gap-2">
        <div className="text-center flex-1">
          <p className="text-base font-bold truncate mb-2">{game.homeTeam}</p>
          <ScoreDisplay score={game.homeScore} isHome={true} />
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Home</p>
        </div>
        <div className="text-slate-600 font-black text-lg">VS</div>
        <div className="text-center flex-1">
          <p className="text-base font-bold truncate mb-2">{game.awayTeam}</p>
          <ScoreDisplay score={game.awayScore} isHome={false} />
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Away</p>
        </div>
      </div>
    </div>
  );
}

// --- Empty / Loading States ---
function EmptyState({ loading }: { loading: boolean }) {
  return (
    <div className="col-span-3 flex flex-col items-center justify-center py-24 text-slate-500">
      {loading ? (
        <>
          <div className="w-10 h-10 border-2 border-slate-600 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <p className="text-sm">Fetching live games from Sofascore...</p>
        </>
      ) : (
        <>
          <p className="text-4xl mb-3">💤</p>
          <p className="text-lg font-semibold text-slate-400">No live matches right now</p>
          <p className="text-sm mt-1">Check back soon — games update every 60 seconds</p>
        </>
      )}
    </div>
  );
}

// --- Main App ---
export default function App() {
  const { games, isConnected, setConnected, updateGame, setGames } = useSportsStore();
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const gameList = Object.values(games);

  // 1. Fetch initial game list from REST
  const fetchGames = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tickers/live`);
      const data = await res.json();
      if (data.games && data.games.length > 0) {
        setGames(data.games);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Failed to fetch live games:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Connect WebSocket and subscribe to all games
  const connectWs = (gameIds: string[]) => {
    if (ws.current) ws.current.close();

    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      setConnected(true);
      console.log('🟢 WebSocket connected');
      gameIds.forEach((id) => {
        ws.current?.send(JSON.stringify({ action: 'subscribe', gameId: id }));
      });
    };

    ws.current.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'TICK') {
          updateGame(msg.data);
          setLastUpdated(new Date());
        }
      } catch {}
    };

    ws.current.onclose = () => {
      setConnected(false);
      console.log('🔴 WS disconnected, reconnecting...');
      reconnectTimer.current = window.setTimeout(() => connectWs(gameIds), 3000);
    };
  };

  useEffect(() => {
    fetchGames();
    // Re-fetch REST every 60s to pick up new games
    const pollInterval = setInterval(fetchGames, 60000);
    return () => clearInterval(pollInterval);
  }, []);

  // When game list changes, (re)subscribe via WS
  useEffect(() => {
    const ids = Object.keys(games);
    if (ids.length > 0) {
      connectWs(ids);
    }
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      ws.current?.close();
    };
  }, [Object.keys(games).sort().join(',')]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">⚡ Live Sports</h1>
          <p className="text-slate-400 text-sm mt-1">
            Powered by Sofascore · {gameList.length} match{gameList.length !== 1 ? 'es' : ''} live
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 text-sm font-medium bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
            <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            {isConnected ? 'Live Feed Active' : 'Reconnecting...'}
          </div>
          {lastUpdated && (
            <p className="text-xs text-slate-600">
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </header>

      {/* Game Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {loading || gameList.length === 0 ? (
          <EmptyState loading={loading} />
        ) : (
          gameList.map((game) => <GameCard key={game.gameId} game={game} />)
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-slate-700 text-xs">
        Data refreshes every 60 seconds · WebSocket updates in real-time
      </footer>
    </div>
  );
}
