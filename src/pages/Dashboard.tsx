import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, MousePointer2, DollarSign, ArrowUpRight, Coins } from 'lucide-react';
import { motion } from 'motion/react';

const stats = [
  { label: 'Daily Revenue', value: '$42.50', change: '+12.5%', icon: DollarSign, color: 'text-emerald-400' },
  { label: 'Active Users', value: '1,240', change: '+8.2%', icon: Users, color: 'text-blue-400' },
  { label: 'Avg. CPM', value: '$2.45', change: '+3.1%', icon: TrendingUp, color: 'text-purple-400' },
  { label: 'Click Rate', value: '4.8%', change: '-0.5%', icon: MousePointer2, color: 'text-orange-400' },
];

export default function Dashboard() {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [dbStats, setDbStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/crypto/markets')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setMarketData(data.map(coin => ({
              uuid: coin.id,
              symbol: coin.symbol.toUpperCase(),
              name: coin.name,
              iconUrl: coin.image,
              price: coin.current_price,
              change: coin.price_change_percentage_24h
            })));
          }
        })
        .catch(err => console.error(err));

      fetch('/api/stats')
        .then(res => res.json())
        .then(data => setDbStats(data))
        .catch(err => console.error(err));
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10s

    // Generate mock recent activity
    const activities = [
      'New user joined from USA',
      'Ad click recorded (+$0.15)',
      'Game session started',
      'AI tool used',
      'Movie trailer played',
      'New user joined from UK'
    ];
    setRecentActivity(activities.sort(() => Math.random() - 0.5).slice(0, 4));

    return () => clearInterval(interval);
  }, []);

  const currentStats = [
    { label: 'Total Earnings', value: dbStats ? `$${dbStats.earnings.toFixed(2)}` : '$1,250.80', change: '+12.5%', icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Total Visitors', value: dbStats ? dbStats.visitors.toLocaleString() : '1,240', change: '+8.2%', icon: Users, color: 'text-blue-400' },
    { label: 'Avg. CPM', value: '$2.45', change: '+3.1%', icon: TrendingUp, color: 'text-purple-400' },
    { label: 'Live Traffic', value: Math.floor(Math.random() * 50) + 10, change: 'Live', icon: MousePointer2, color: 'text-orange-400' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-[#0F0F0F] border border-zinc-800 hover:border-zinc-700 transition-colors group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-zinc-900 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-zinc-400 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Revenue Chart */}
          <div className="p-8 rounded-3xl bg-[#0F0F0F] border border-zinc-800">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">Revenue Overview</h3>
              <select className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {[40, 65, 45, 90, 55, 75, 85].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="w-full bg-emerald-500/20 group-hover:bg-emerald-500/40 rounded-t-lg transition-all relative"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      ${(h * 0.5).toFixed(2)}
                    </div>
                  </motion.div>
                  <span className="text-[10px] text-zinc-500 font-mono">Day {i+1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Market Data from RapidAPI */}
          <div className="p-8 rounded-3xl bg-[#0F0F0F] border border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <Coins size={20} className="mr-2 text-yellow-400" /> Market Trends
              </h3>
              <span className="text-xs text-zinc-500">Live via RapidAPI</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketData.map((coin: any) => (
                <div key={coin.uuid} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={coin.iconUrl} alt={coin.name} className="w-8 h-8" />
                    <div>
                      <p className="text-sm font-bold">{coin.symbol}</p>
                      <p className="text-[10px] text-zinc-500">{coin.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">${parseFloat(coin.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                    <p className={`text-[10px] font-bold ${parseFloat(coin.change) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {coin.change}%
                    </p>
                  </div>
                </div>
              ))}
              {marketData.length === 0 && (
                <div className="col-span-2 py-8 text-center text-zinc-500 text-sm">
                  Loading market data...
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
            <h3 className="text-xl font-bold mb-4">Monetization Tips</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Your Games section is performing 24% better than last week. Consider adding more Indie titles to increase session duration.
            </p>
            <div className="space-y-4">
              {['Optimize Ad Placement', 'Update Game Library', 'Promote AI Tools'].map((tip) => (
                <div key={tip} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                  <span className="text-sm font-medium">{tip}</span>
                  <ArrowUpRight size={16} className="text-zinc-500 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800">
            <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-zinc-400">{activity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800">
            <h3 className="text-lg font-bold mb-4">Payout Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Next Payout</span>
                <span className="font-bold">March 1st</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Threshold</span>
                <span className="font-bold">$50.00</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[85%]" />
              </div>
              <p className="text-[10px] text-center text-zinc-500">85% of threshold reached</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
