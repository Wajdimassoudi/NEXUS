import React, { useState } from 'react';
import { Video, Mic, Share2, Shield, Users, Settings, PhoneOff } from 'lucide-react';
import { motion } from 'motion/react';

export default function VideoChat() {
  const [inCall, setInCall] = useState(false);
  const [roomName, setRoomName] = useState('');

  const startCall = () => {
    if (!roomName) return;
    setInCall(true);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {!inCall ? (
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-8">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
            <Video size={48} className="text-emerald-400" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Private Video Rooms</h1>
            <p className="text-zinc-400 text-lg">
              Secure, encrypted video calls powered by Jitsi Meet. No registration required, just create a room and share the link.
            </p>
          </div>
          
          <div className="w-full space-y-4">
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Enter room name (e.g. my-awesome-room)"
                className="flex-1 bg-[#0F0F0F] border border-zinc-800 rounded-xl px-6 py-4 outline-none focus:border-emerald-500/50 transition-colors text-lg"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <button 
                onClick={startCall}
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-8 rounded-xl transition-colors"
              >
                Start Meeting
              </button>
            </div>
            <p className="text-xs text-zinc-500 flex items-center justify-center gap-4">
              <span className="flex items-center"><Shield size={12} className="mr-1" /> End-to-end Encrypted</span>
              <span className="flex items-center"><Users size={12} className="mr-1" /> Up to 50 Participants</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full pt-8">
            {[
              { title: 'High Quality', desc: 'HD Video & Audio' },
              { title: 'Screen Share', desc: 'Present with ease' },
              { title: 'No Limits', desc: 'Unlimited call time' }
            ].map((feature) => (
              <div key={feature.title} className="p-4 rounded-2xl bg-[#0F0F0F] border border-zinc-800">
                <h4 className="font-bold text-sm mb-1">{feature.title}</h4>
                <p className="text-xs text-zinc-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-black rounded-3xl overflow-hidden border border-zinc-800 relative group">
          {/* Jitsi Iframe Integration */}
          <iframe 
            src={`https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","closedcaptions","desktop","fullscreen","fittowindow","hangup","profile","chat","recording","livestreaming","etherpad","sharedvideo","settings","raisehand","videoquality","filmstrip","invite","feedback","stats","shortcuts","tileview","videobackgroundblur","download","help","mute-everyone","e2ee"]`}
            allow="camera; microphone; display-capture; autoplay; clipboard-write"
            className="w-full h-full border-none"
          />
          
          {/* Custom Controls Overlay (Optional) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={() => setInCall(false)}
              className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-2xl transition-colors"
            >
              <PhoneOff size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
