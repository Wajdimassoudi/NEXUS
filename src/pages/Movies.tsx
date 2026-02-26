import React, { useState, useEffect } from 'react';
import { Search, Play, Info, Star, TrendingUp, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const TMDB_API_KEY = (import.meta as any).env.VITE_TMDB_API_KEY;

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async (query = '') => {
    setLoading(true);
    try {
      if (!TMDB_API_KEY) {
        // Mock data if no API key
        setMovies([...Array(12)].map((_, i) => ({
          id: i,
          title: query ? `${query} Result ${i + 1}` : `Sample Movie ${i + 1}`,
          poster_path: `https://picsum.photos/seed/movie${i}/400/600`,
          vote_average: 8.5,
          release_date: '2024-01-01',
          overview: 'This is a sample movie description for the Nexus platform.'
        })));
      } else {
        const url = query 
          ? `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`
          : `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        setMovies(data.results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMovies(search);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-96 rounded-3xl overflow-hidden group">
        <img 
          src="https://picsum.photos/seed/cinema/1920/1080" 
          alt="Featured"
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
        <div className="absolute bottom-12 left-12 max-w-2xl space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <TrendingUp size={16} />
            <span>TRENDING NOW</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight">Nexus Originals: The Future</h1>
          <p className="text-zinc-300 text-lg line-clamp-2">
            Experience the next generation of digital entertainment. Stream thousands of movies and TV shows in high definition.
          </p>
          <div className="flex items-center space-x-4 pt-4">
            <button className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-zinc-200 transition-colors flex items-center">
              <Play size={20} className="mr-2 fill-current" /> Play Now
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white font-bold px-8 py-3 rounded-xl hover:bg-white/20 transition-colors flex items-center border border-white/10">
              <Share2 size={20} className="mr-2" /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Popular Movies</h2>
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text"
            placeholder="Search movies..."
            className="w-full bg-[#0F0F0F] border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-emerald-500/50 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-zinc-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {movies.map((movie, i) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[2/3] rounded-2xl overflow-hidden border border-zinc-800 group-hover:border-emerald-500/50 transition-all relative">
                <img 
                  src={movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
                    <Play size={24} className="text-black fill-current ml-1" />
                  </div>
                  <p className="text-xs font-bold line-clamp-3">{movie.overview}</p>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-bold text-sm line-clamp-1 group-hover:text-emerald-400 transition-colors">{movie.title}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-zinc-500">{movie.release_date?.split('-')[0]}</span>
                  <div className="flex items-center text-yellow-500 text-[10px] font-bold">
                    <Star size={10} fill="currentColor" className="mr-1" />
                    {movie.vote_average}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
