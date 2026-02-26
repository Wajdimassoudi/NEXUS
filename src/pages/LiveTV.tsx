import React, { useState, useEffect } from 'react';
import { Search, Tv, Play, Globe, Shield, Activity } from 'lucide-react';
import { motion } from 'motion/react';

interface Channel {
  name: string;
  logo: string;
  url: string;
  categories: string[];
  languages: string[];
  countries: string[];
}

export default function LiveTV() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  useEffect(() => {
    fetch('/api/tv/channels')
      .then(res => res.json())
      .then(data => {
        setChannels(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const filteredChannels = channels.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Live TV Hub</h1>
          <p className="text-zinc-400 mt-1">Stream thousands of global channels for free.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text"
            placeholder="Search channels..."
            className="w-full bg-[#0F0F0F] border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-emerald-500/50 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {selectedChannel ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-zinc-800 relative group">
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
                  <Play size={32} className="text-black fill-current ml-1" />
                </div>
                <p className="text-lg font-bold">Connecting to {selectedChannel.name}...</p>
                <p className="text-sm text-zinc-400">External Player Required for M3U8 Streams</p>
                <a 
                  href={selectedChannel.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-8 py-3 rounded-xl transition-colors"
                >
                  Open Stream
                </a>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setSelectedChannel(null)}
            className="text-emerald-400 font-bold text-sm hover:underline"
          >
            ← Back to Channels
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {loading ? (
            [...Array(15)].map((_, i) => (
              <div key={i} className="aspect-square bg-zinc-900 rounded-2xl animate-pulse" />
            ))
          ) : (
            filteredChannels.map((channel, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (i % 20) * 0.02 }}
                onClick={() => setSelectedChannel(channel)}
                className="group p-4 rounded-2xl bg-[#0F0F0F] border border-zinc-800 hover:border-emerald-500/50 transition-all cursor-pointer text-center space-y-3"
              >
                <div className="w-16 h-16 mx-auto rounded-xl bg-zinc-800 overflow-hidden flex items-center justify-center border border-zinc-700 group-hover:border-emerald-500/30">
                  {channel.logo ? (
                    <img src={channel.logo} alt={channel.name} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                  ) : (
                    <Tv size={24} className="text-zinc-600" />
                  )}
                </div>
                <h3 className="font-bold text-xs line-clamp-1">{channel.name}</h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase font-bold">
                    {channel.countries[0] || 'Global'}
                  </span>
                  <Activity size={10} className="text-emerald-500 animate-pulse" />
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        {[
          { icon: Globe, label: 'Global Reach', value: '200+ Countries' },
          { icon: Shield, label: 'Verified Streams', value: '100% Secure' },
          { icon: Tv, label: 'Live Content', value: '24/7 Access' }
        ].map((stat) => (
          <div key={stat.label} className="p-6 rounded-2xl bg-[#0F0F0F] border border-zinc-800 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-bold uppercase">{stat.label}</p>
              <p className="text-lg font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
