import React, { useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useWebSocket } from './hooks/useWebSocket';

// Import our newly upgraded, premium modular components
import Layout from './components/Layout';
import Home from './pages/Home';
import MatchView from './pages/MatchView';
import PlayerView from './pages/PlayerView';

export default function App() {
  // Maintain the global websocket connection at the top level
  // This ensures the connection stays alive no matter which page you navigate to
  const globalSub = useMemo(() => ['ALL'], []);
  useWebSocket(globalSub);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/match/:matchId" element={<MatchView />} />
          <Route path="/player/:playerId" element={<PlayerView />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}