import { useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useWebSocket } from './hooks/useWebSocket';
import Layout from './components/Layout';
import Home from './pages/Home';
import MatchView from './pages/MatchView';
import PlayerView from './pages/PlayerView';
import Competitions from './pages/Competitions';

export default function App() {
  const globalSub = useMemo(() => ['ALL'], []);
  useWebSocket(globalSub);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/match/:matchId" element={<MatchView />} />
          <Route path="/player/:playerId" element={<PlayerView />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/favourites" element={<Home />} /> {/* Reuse Home with favourites tab */}
          <Route path="/profile" element={<div className="text-center py-20 text-muted-foreground">Profile page coming soon</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}