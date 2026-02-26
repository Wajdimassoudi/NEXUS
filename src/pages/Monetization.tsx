import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, BarChart3, PieChart, ArrowUpRight, Globe, ShieldCheck, Zap, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface Wallets {
  btc: string;
  usdt: string;
  sol: string;
  eth: string;
  ltc: string;
}

export default function Monetization() {
  const [wallets, setWallets] = useState<Wallets | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/wallets')
      .then(res => res.json())
      .then(data => setWallets(data));
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Earnings Card */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-black">
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-emerald-900/70 font-bold text-sm tracking-widest uppercase">Total Balance</p>
              <h2 className="text-5xl font-black mt-2">$1,250.80</h2>
            </div>
            <div className="p-3 bg-black/10 rounded-2xl backdrop-blur-md">
              <DollarSign size={32} />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
              <p className="text-[10px] font-bold text-emerald-900/60 uppercase">This Week</p>
              <p className="text-xl font-bold">$284.15</p>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
              <p className="text-[10px] font-bold text-emerald-900/60 uppercase">Pending</p>
              <p className="text-xl font-bold">$42.50</p>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
              <p className="text-[10px] font-bold text-emerald-900/60 uppercase">Payouts</p>
              <p className="text-xl font-bold">12</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-8 rounded-3xl bg-[#0F0F0F] border border-zinc-800 flex flex-col justify-between">
          <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Withdraw Funds', icon: ArrowUpRight, color: 'text-emerald-400' },
              { label: 'Ad Settings', icon: Globe, color: 'text-blue-400' },
              { label: 'Security Audit', icon: ShieldCheck, color: 'text-purple-400' },
              { label: 'Boost Traffic', icon: Zap, color: 'text-yellow-400' }
            ].map((action) => (
              <button key={action.label} className="w-full flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all group">
                <div className="flex items-center">
                  <action.icon size={20} className={`${action.color} mr-3`} />
                  <span className="text-sm font-medium">{action.label}</span>
                </div>
                <ArrowUpRight size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payout Wallets Section */}
      <div className="p-8 rounded-3xl bg-[#0F0F0F] border border-zinc-800">
        <h2 className="text-2xl font-bold mb-6">Payout Wallets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wallets && Object.entries(wallets).map(([key, address]) => (
            <div key={key} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between group">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs uppercase text-emerald-400">
                  {key}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">{key} Address</p>
                  <p className="text-sm font-mono truncate max-w-[200px] md:max-w-[300px]">{address || 'Not Configured'}</p>
                </div>
              </div>
              <button 
                onClick={() => address && copyToClipboard(address as string, key)}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 hover:text-white"
              >
                {copied === key ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Ad Networks Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Connected Ad Networks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Adsterra', type: 'Popunder & Social Bar', status: 'Active', cpm: '$3.20' },
            { name: 'Monetag', type: 'Smart Tag & Interstitial', status: 'Active', cpm: '$2.85' },
            { name: 'Evadav', type: 'Push Notifications', status: 'Pending', cpm: '$1.50' }
          ].map((network) => (
            <div key={network.name} className="p-6 rounded-2xl bg-[#0F0F0F] border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">{network.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  network.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {network.status}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mb-4">{network.type}</p>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <div className="flex items-center text-sm font-bold">
                  <TrendingUp size={14} className="mr-2 text-emerald-400" />
                  {network.cpm} CPM
                </div>
                <button className="text-xs font-bold text-zinc-400 hover:text-white transition-colors underline underline-offset-4">
                  View Stats
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-[#0F0F0F] border border-zinc-800">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center">
              <BarChart3 size={20} className="mr-2 text-blue-400" /> Traffic Sources
            </h3>
            <span className="text-xs text-zinc-500">Last 24 Hours</span>
          </div>
          <div className="space-y-4">
            {[
              { source: 'Direct', value: 45, color: 'bg-blue-500' },
              { source: 'Organic Search', value: 30, color: 'bg-emerald-500' },
              { source: 'Social Media', value: 15, color: 'bg-purple-500' },
              { source: 'Referral', value: 10, color: 'bg-orange-500' }
            ].map((item) => (
              <div key={item.source} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span>{item.source}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-[#0F0F0F] border border-zinc-800">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center">
              <PieChart size={20} className="mr-2 text-emerald-400" /> Revenue Split
            </h3>
            <span className="text-xs text-zinc-500">By Category</span>
          </div>
          <div className="h-48 flex items-center justify-center">
            {/* Simple CSS Pie Chart Representation */}
            <div className="relative w-40 h-40 rounded-full border-8 border-zinc-900 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-8 border-emerald-500 border-t-transparent border-r-transparent rotate-45" />
              <div className="absolute inset-0 rounded-full border-8 border-blue-500 border-b-transparent border-l-transparent -rotate-12" />
              <div className="text-center">
                <p className="text-2xl font-bold">65%</p>
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Games</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="flex items-center text-xs text-zinc-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" /> Games (65%)
            </div>
            <div className="flex items-center text-xs text-zinc-400">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" /> Video Chat (20%)
            </div>
            <div className="flex items-center text-xs text-zinc-400">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2" /> AI Tools (10%)
            </div>
            <div className="flex items-center text-xs text-zinc-400">
              <div className="w-2 h-2 rounded-full bg-orange-500 mr-2" /> Others (5%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
