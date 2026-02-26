import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Games from './pages/Games';
import VideoChat from './pages/VideoChat';
import AITools from './pages/AITools';
import Movies from './pages/Movies';
import Apps from './pages/Apps';
import Monetization from './pages/Monetization';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'games': return <Games />;
      case 'video': return <VideoChat />;
      case 'ai': return <AITools />;
      case 'movies': return <Movies />;
      case 'apps': return <Apps />;
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
