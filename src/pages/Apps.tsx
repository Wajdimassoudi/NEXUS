import React, { useState, useEffect } from 'react';
import { Download, Shield, Zap, Smartphone, Search, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const apps = [
  { name: 'WhatsApp', category: 'Communication', size: '45MB', downloads: '5B+', icon: 'https://picsum.photos/seed/wa/100/100' },
  { name: 'Instagram', category: 'Social', size: '52MB', downloads: '1B+', icon: 'https://picsum.photos/seed/ig/100/100' },
  { name: 'Telegram', category: 'Communication', size: '38MB', downloads: '1B+', icon: 'https://picsum.photos/seed/tg/100/100' },
  { name: 'Spotify', category: 'Music', size: '28MB', downloads: '1B+', icon: 'https://picsum.photos/seed/sp/100/100' },
  { name: 'TikTok', category: 'Entertainment', size: '85MB', downloads: '1B+', icon: 'https://picsum.photos/seed/tt/100/100' },
  { name: 'Netflix', category: 'Entertainment', size: '32MB', downloads: '1B+', icon: 'https://picsum.photos/seed/nf/100/100' },
  { name: 'CapCut', category: 'Video Editor', size: '95MB', downloads: '500M+', icon: 'https://picsum.photos/seed/cc/100/100' },
  { name: 'Discord', category: 'Communication', size: '65MB', downloads: '100M+', icon: 'https://picsum.photos/seed/dc/100/100' },
];

export default function Apps() {
  const [search, setSearch] = useState('');
  const [fdroidApps, setFdroidApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://f-droid.org/repo/index-v1.json')
      .then(res => res.json())
      .then(data => {
        if (data.apps) {
          setFdroidApps(data.apps.slice(0, 20));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const displayApps = fdroidApps.length > 0 ? fdroidApps.map(app => ({
    name: app.name || app.packageName,
    category: app.categories?.[0] || 'App',
    size: 'Varies',
    downloads: '1M+',
    icon: `https://f-droid.org/repo/${app.packageName}/en-US/icon.png`
  })) : apps;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">App Store</h1>
          <p className="text-zinc-400 mt-1">Download the latest APKs and Open Source apps.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text"
            placeholder="Search apps..."
            className="w-full bg-[#0F0F0F] border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-emerald-500/50 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0F0F0F] border border-zinc-800">
            <h3 className="font-bold mb-4">Categories</h3>
            <div className="space-y-2">
              {['All Apps', 'Games', 'Social', 'Tools', 'Productivity', 'Entertainment'].map((cat) => (
                <button key={cat} className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center text-emerald-400 font-bold text-sm mb-2">
              <Shield size={16} className="mr-2" /> Verified APKs
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              All apps are scanned for malware and verified by our security engine.
            </p>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-zinc-900 rounded-2xl animate-pulse" />
            ))
          ) : (
            displayApps.map((app, i) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-2xl bg-[#0F0F0F] border border-zinc-800 hover:border-zinc-700 transition-all flex items-center group"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden mr-4 border border-zinc-800 bg-zinc-900 flex items-center justify-center">
                  <img 
                    src={app.icon} 
                    alt={app.name} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${app.name}/100/100`;
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-bold text-sm mr-2 line-clamp-1">{app.name}</h3>
                    <CheckCircle2 size={12} className="text-blue-400" />
                  </div>
                  <p className="text-xs text-zinc-500">{app.category} • {app.size}</p>
                  <div className="flex items-center mt-1 text-[10px] text-zinc-400">
                    <Smartphone size={10} className="mr-1" /> {app.downloads} Downloads
                  </div>
                </div>
                <button className="p-3 rounded-xl bg-zinc-800 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                  <Download size={18} />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Featured Developer Section */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Open Source Repository</h2>
          <p className="text-zinc-300 max-w-xl">
            Access thousands of open-source Android applications from the F-Droid repository. Privacy-focused and community-driven.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-black font-bold px-6 py-2.5 rounded-xl hover:bg-zinc-200 transition-colors">
              Browse F-Droid
            </button>
            <button className="bg-transparent border border-white/20 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-white/10 transition-colors">
              Developer API
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
            <Zap size={24} className="text-yellow-400" />
          </div>
          <div>
            <p className="text-sm font-bold">Fast Downloads</p>
            <p className="text-xs text-zinc-400">Global CDN enabled</p>
          </div>
        </div>
      </div>
    </div>
  );
}
