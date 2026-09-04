import React, { useState } from 'react';
import { Bot, Sparkles, X, Send, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';
import { Link } from 'react-router-dom';

export const FloatingCopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi! I am **Freelance Copilot**. Ask me anything about your current projects, pending invoices, or draft client emails.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: userMsg });
      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: res.data.data.reply },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Copilot encountered an issue. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 text-white shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-glow active:scale-95"
          title="Open Freelance Copilot AI"
        >
          <Sparkles className="h-6 w-6 transition-transform group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-[9px] font-bold text-slate-900 animate-pulse">
            AI
          </span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col h-[480px] animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/40">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Freelance Copilot</h4>
                <p className="text-[10px] text-muted-foreground">Autonomous Business Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link to="/copilot" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" size="icon" className="h-7 w-7" title="Expand Full Copilot Hub">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-muted/50 border border-border/50 text-foreground rounded-tl-none'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Bot className="h-3.5 w-3.5 animate-spin text-primary" />
                <span>Copilot is reasoning...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} className="p-2 border-t border-border bg-card flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot anything..."
              className="flex-1 bg-muted/40 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              type="submit"
              variant="copilot"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="h-8 w-8 shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
