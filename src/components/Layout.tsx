import React from 'react';
import { 
  LayoutDashboard, 
  Gamepad2, 
  Video, 
  BrainCircuit, 
  Film, 
  Download, 
  DollarSign,
  Menu,
  X,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'games', label: 'Games', icon: Gamepad2 },
  { id: 'tv', label: 'Live TV', icon: Video },
  { id: 'movies', label: 'Movies', icon: Film },
  { id: 'music', label: 'Music', icon: Gamepad2 }, // Using Gamepad2 as placeholder for Music
  { id: 'ai', label: 'AI Tools', icon: BrainCircuit },
  { id: 'apps', label: 'App Store', icon: Download },
  { id: 'news', label: 'News', icon: Film }, // Using Film as placeholder for News
  { id: 'monetization', label: 'Earnings', icon: DollarSign },
];

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col md:flex-row font-sans">
      {/* Desktop Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } border-r border-zinc-800 bg-[#0F0F0F] transition-all duration-300 hidden md:flex flex-col sticky top-0 h-screen z-50`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
            >
              NEXUS
            </motion.h1>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${
                activeTab === tab.id 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
              }`}
            >
              <tab.icon size={20} className={activeTab === tab.id ? 'text-emerald-400' : 'group-hover:text-zinc-100'} />
              {isSidebarOpen && (
                <span className="ml-3 font-medium text-xs">{tab.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button className="w-full flex items-center p-3 rounded-xl hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-100">
            <User size={20} />
            {isSidebarOpen && <span className="ml-3 text-xs font-medium">Profile</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0F0F0F]/95 backdrop-blur-xl border-t border-zinc-800 z-50 px-2 py-1 flex justify-around items-center">
        {tabs.filter(t => ['dashboard', 'games', 'tv', 'movies', 'monetization'].includes(t.id)).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === tab.id ? 'text-emerald-400' : 'text-zinc-500'
            }`}
          >
            <tab.icon size={18} />
            <span className="text-[9px] mt-1 font-medium">{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative pb-20 md:pb-0">
        <header className="h-16 border-b border-zinc-800 bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold capitalize">{activeTab}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] md:text-xs font-mono text-emerald-400">$42.50 Today</span>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
