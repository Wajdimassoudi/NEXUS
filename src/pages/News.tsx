import React, { useState, useEffect } from 'react';
import { Search, Newspaper, ExternalLink, Clock, TrendingUp, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface Story {
  id: number;
  title: string;
  url: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
}

export default function News() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news/top')
      .then(res => res.json())
      .then(data => {
        setStories(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tech News</h1>
          <p className="text-zinc-400 mt-1">Stay updated with the latest from HackerNews.</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <TrendingUp size={16} className="text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Top Stories</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-zinc-900 rounded-2xl animate-pulse" />
            ))
          ) : (
            stories.map((story, i) => (
              <motion.a
                key={story.id}
                href={story.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="block p-6 rounded-2xl bg-[#0F0F0F] border border-zinc-800 hover:border-emerald-500/50 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold group-hover:text-emerald-400 transition-colors leading-snug">
                    {story.title}
                  </h3>
                  <ExternalLink size={18} className="text-zinc-600 group-hover:text-white shrink-0 ml-4" />
                </div>
                <div className="flex items-center space-x-6 text-xs text-zinc-500 font-medium">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1.5" />
                    {new Date(story.time * 1000).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <MessageSquare size={14} className="mr-1.5" />
                    {story.descendants} comments
                  </div>
                  <div className="flex items-center text-emerald-400/70">
                    <TrendingUp size={14} className="mr-1.5" />
                    {story.score} points
                  </div>
                  <div className="text-zinc-600">by {story.by}</div>
                </div>
              </motion.a>
            ))
          )}
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-white/5">
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              Get the top tech stories delivered to your inbox daily. Join 50,000+ developers.
            </p>
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="email@example.com"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500/50 transition-colors"
              />
              <button className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors">
                Subscribe Now
              </button>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#0F0F0F] border border-zinc-800">
            <h3 className="text-lg font-bold mb-4">Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
              {['AI', 'Web3', 'Rust', 'React', 'Vite', 'TypeScript', 'LLMs', 'Cybersecurity'].map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium hover:text-emerald-400 cursor-pointer transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
