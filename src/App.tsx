import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Games from './pages/Games';
import VideoChat from './pages/VideoChat';
import AITools from './pages/AITools';
import Movies from './pages/Movies';
import Apps from './pages/Apps';
import Monetization from './pages/Monetization';

import LiveTV from './pages/LiveTV';
import Music from './pages/Music';
import News from './pages/News';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetch('/api/track-visit', { method: 'POST' }).catch(() => {});
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'games': return <Games />;
      case 'tv': return <LiveTV />;
      case 'movies': return <Movies />;
      case 'music': return <Music />;
      case 'ai': return <AITools />;
      case 'apps': return <Apps />;
      case 'news': return <News />;
      case 'monetization': return <Monetization />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}
