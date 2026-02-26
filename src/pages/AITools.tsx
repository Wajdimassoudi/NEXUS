import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Image as ImageIcon, MessageSquare, Trash2, Loader2, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  content: string;
  type: 'text' | 'image';
}

export default function AITools() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tool, setTool] = useState<'chat' | 'image'>('chat');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: input, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      if (tool === 'chat') {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: currentInput,
        });

        const aiMsg: Message = { 
          role: 'model', 
          content: response.text || "I'm sorry, I couldn't process that.",
          type: 'text'
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        // Image Generation
        const response = await fetch('/api/ai/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: currentInput })
        });
        
        if (!response.ok) throw new Error('Generation failed');
        
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        
        const aiMsg: Message = { 
          role: 'model', 
          content: imageUrl,
          type: 'image'
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', content: "Error connecting to AI service. Please check your API keys.", type: 'text' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-8">
      {/* Sidebar for AI Tools */}
      <div className="w-64 space-y-4 hidden lg:block">
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <h3 className="font-bold text-sm mb-2 flex items-center">
            <Sparkles size={16} className="mr-2 text-emerald-400" /> Nexus AI
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Multi-modal AI hub. Switch between chat and image generation tools.
          </p>
        </div>
        
        <div className="space-y-2">
          <button 
            onClick={() => setTool('chat')}
            className={`w-full flex items-center p-3 rounded-xl border transition-colors text-sm font-medium ${
              tool === 'chat' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-[#0F0F0F] border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <MessageSquare size={18} className="mr-3" /> Chat Assistant
          </button>
          <button 
            onClick={() => setTool('image')}
            className={`w-full flex items-center p-3 rounded-xl border transition-colors text-sm font-medium ${
              tool === 'image' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-[#0F0F0F] border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <ImageIcon size={18} className="mr-3" /> Image Generator
          </button>
        </div>

        <div className="pt-4 border-t border-zinc-800">
          <button 
            onClick={() => setMessages([])}
            className="w-full flex items-center p-3 rounded-xl text-zinc-500 hover:text-red-400 transition-colors text-sm"
          >
            <Trash2 size={18} className="mr-3" /> Clear History
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0F0F0F] border border-zinc-800 rounded-3xl overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center">
                <BrainCircuit size={32} />
              </div>
              <div>
                <h3 className="font-bold">How can I help you today?</h3>
                <p className="text-sm">Ask me anything about the platform or beyond.</p>
              </div>
            </div>
          )}
          
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-emerald-500 text-black font-medium' 
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-100'
                }`}>
                  {msg.type === 'image' ? (
                    <img src={msg.content} alt="AI Generated" className="rounded-lg w-full h-auto" />
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center space-x-2">
                <Loader2 size={16} className="animate-spin text-emerald-400" />
                <span className="text-sm text-zinc-400">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-[#0A0A0A] border-t border-zinc-800">
          <div className="relative flex items-center">
            <input 
              type="text"
              placeholder="Type your message..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-6 pr-16 outline-none focus:border-emerald-500/50 transition-colors"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute right-2 p-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 text-black rounded-xl transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
