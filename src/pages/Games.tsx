import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Star, Gamepad } from 'lucide-react';
import { motion } from 'motion/react';

interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
  platforms: any[];
}

export default function Games() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const RAWG_API_KEY = (import.meta as any).env.VITE_RAWG_API_KEY;

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async (query = '') => {
    setLoading(true);
    try {
      if (!RAWG_API_KEY) {
        const url = query 
          ? `https://www.freetogame.com/api/games?platform=pc&category=${query}` 
          : 'https://www.freetogame.com/api/games';
        const res = await fetch(url);
        const data = await res.json();
        setGames(Array.isArray(data) ? data.slice(0, 20).map((g: any) => ({
          id: g.id,
          name: g.title,
          background_image: g.thumbnail,
          rating: 4.5,
          released: g.release_date,
          platforms: []
        })) : []);
      } else {
        const url = query 
          ? `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${query}&page_size=20`
          : `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page_size=20`;
        const res = await fetch(url);
        const data = await res.json();
        setGames(data.results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGames(search);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gaming Hub</h1>
          <p className="text-zinc-400 mt-1">Discover and play thousands of free games.</p>
        </div>
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text"
            placeholder="Search games..."
            className="w-full bg-[#0F0F0F] border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-emerald-500/50 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-zinc-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="group relative bg-[#0F0F0F] border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img 
                  src={game.background_image} 
                  alt={game.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-sm line-clamp-1">{game.name}</h3>
                  <div className="flex items-center text-yellow-500 text-xs">
                    <Star size={12} fill="currentColor" className="mr-1" />
                    {game.rating}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                    {game.released?.split('-')[0] || '2024'}
                  </span>
                  <button className="flex items-center text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                    PLAY NOW <ExternalLink size={12} className="ml-1" />
                  </button>
                </div>
              </div>
              
              {/* Ad Overlay Placeholder */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-emerald-500 text-black text-[10px] font-bold px-2 py-1 rounded">
                  AD FREE
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cloud Gaming Section */}
      <div className="mt-12 p-8 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            NEW FEATURE
          </div>
          <h2 className="text-2xl font-bold">Cloud Emulator Support</h2>
          <p className="text-zinc-400">
            Play classic retro games directly in your browser using EmulatorJS integration. No downloads required.
          </p>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 px-6 rounded-xl transition-colors flex items-center">
            <Gamepad className="mr-2" size={20} /> Launch Emulator
          </button>
        </div>
        <div className="w-full md:w-1/3 aspect-video bg-black rounded-2xl border border-zinc-800 flex items-center justify-center relative overflow-hidden group">
          <img 
            src="https://picsum.photos/seed/retro/800/450" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700"
            alt="Retro Gaming"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
              <Gamepad size={32} />
            </div>
            <span className="text-sm font-bold tracking-widest uppercase">Retro Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
}
