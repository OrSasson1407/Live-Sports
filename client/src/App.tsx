// App.tsx
import React, { useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useWebSocket } from './hooks/useWebSocket';
import Layout from './components/Layout';
import Home from './pages/Home';
import MatchView from './pages/MatchView';
import PlayerView from './pages/PlayerView';

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
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}