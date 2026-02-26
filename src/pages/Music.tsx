import React, { useState, useEffect } from 'react';
import { Search, Music as MusicIcon, Play, SkipForward, SkipBack, Heart, ListMusic } from 'lucide-react';
import { motion } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: { name: string };
  album: { cover_medium: string };
  preview: string;
}

export default function Music() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  useEffect(() => {
    fetch('/api/music/chart')
      .then(res => res.json())
      .then(data => {
        if (data.tracks && data.tracks.data) {
          setTracks(data.tracks.data);
        }
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Music Station</h1>
          <p className="text-zinc-400 mt-1">Listen to the latest global hits powered by Deezer.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text"
            placeholder="Search artists or songs..."
            className="w-full bg-[#0F0F0F] border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-emerald-500/50 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main List */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-xl font-bold flex items-center">
            <ListMusic size={20} className="mr-2 text-emerald-400" /> Top Charts
          </h2>
          <div className="space-y-2">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="h-16 bg-zinc-900 rounded-xl animate-pulse" />
              ))
            ) : (
              tracks.map((track, i) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setCurrentTrack(track)}
                  className={`p-3 rounded-xl flex items-center justify-between group cursor-pointer transition-all ${
                    currentTrack?.id === track.id ? 'bg-emerald-500/10 border border-emerald-500/20' : 'hover:bg-zinc-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-xs font-mono text-zinc-600 w-4">{i + 1}</span>
                    <img src={track.album.cover_medium} alt={track.title} className="w-10 h-10 rounded-lg shadow-lg" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className={`text-sm font-bold ${currentTrack?.id === track.id ? 'text-emerald-400' : 'text-zinc-100'}`}>{track.title}</h4>
                      <p className="text-xs text-zinc-500">{track.artist.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="p-2 text-zinc-500 hover:text-emerald-400 transition-colors">
                      <Heart size={16} />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-all">
                      <Play size={14} className="fill-current ml-0.5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Player Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0F0F0F] border border-zinc-800 sticky top-24">
            <h3 className="font-bold mb-6 text-sm uppercase tracking-widest text-zinc-500">Now Playing</h3>
            {currentTrack ? (
              <div className="space-y-6 text-center">
                <motion.div 
                  key={currentTrack.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/10"
                >
                  <img src={currentTrack.album.cover_medium} alt={currentTrack.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold line-clamp-1">{currentTrack.title}</h3>
                  <p className="text-sm text-zinc-400">{currentTrack.artist.name}</p>
                </div>
                <div className="flex items-center justify-center space-x-6">
                  <button className="text-zinc-500 hover:text-white transition-colors"><SkipBack size={24} /></button>
                  <button className="w-14 h-14 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform">
                    <Play size={24} className="fill-current ml-1" />
                  </button>
                  <button className="text-zinc-500 hover:text-white transition-colors"><SkipForward size={24} /></button>
                </div>
                <div className="space-y-2">
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-1/3" />
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>0:45</span>
                    <span>3:20</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                <MusicIcon size={48} />
                <p className="text-xs font-medium">Select a track to start listening</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
