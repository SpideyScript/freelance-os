import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Users,
  Briefcase,
  CheckSquare,
  Receipt,
  FileText,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';
import { api } from '../../lib/api';

export const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Keyboard shortcut listener: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open triggered by parent state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        if (res.data.success) {
          setResults(res.data.data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (url) => {
    navigate(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Palette Dialog */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden z-10 animate-in fade-in-50 zoom-in-95">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 border-b border-border/70 h-14 bg-card">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search across your entire workspace..."
            autoFocus
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {isLoading && (
            <div className="p-4 text-center text-xs text-muted-foreground">
              Searching workspace items...
            </div>
          )}

          {!query && (
            <div className="p-3 text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                Quick Navigation
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Create New Invoice', path: '/invoices/new', icon: Receipt },
                  { label: 'Create New Proposal', path: '/proposals/new', icon: FileText },
                  { label: 'Add Client Account', path: '/clients', icon: Users },
                  { label: 'Freelance Copilot AI', path: '/copilot', icon: Sparkles },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleSelect(item.path)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted text-xs text-foreground text-left transition-colors"
                  >
                    <item.icon className="h-4 w-4 text-primary shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {results && (
            <>
              {/* Clients */}
              {results.clients?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 px-2">
                    Clients ({results.clients.length})
                  </span>
                  {results.clients.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => handleSelect(`/clients/${c._id}`)}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-muted text-xs text-left transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Users className="h-4 w-4 text-sky-500 shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">{c.name}</p>
                          <p className="text-[10px] text-muted-foreground">{c.company || c.email}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              )}

              {/* Projects */}
              {results.projects?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 px-2">
                    Projects ({results.projects.length})
                  </span>
                  {results.projects.map((p) => (
                    <button
                      key={p._id}
                      onClick={() => handleSelect(`/projects/${p._id}`)}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-muted text-xs text-left transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Briefcase className="h-4 w-4 text-amber-500 shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">{p.status}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              )}

              {/* Tasks */}
              {results.tasks?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 px-2">
                    Tasks ({results.tasks.length})
                  </span>
                  {results.tasks.map((t) => (
                    <button
                      key={t._id}
                      onClick={() => handleSelect('/tasks')}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-muted text-xs text-left transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckSquare className="h-4 w-4 text-emerald-500 shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">{t.title}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{t.status}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              )}

              {/* Invoices */}
              {results.invoices?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 px-2">
                    Invoices ({results.invoices.length})
                  </span>
                  {results.invoices.map((inv) => (
                    <button
                      key={inv._id}
                      onClick={() => handleSelect(`/invoices/${inv._id}`)}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-muted text-xs text-left transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Receipt className="h-4 w-4 text-purple-500 shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">{inv.invoiceNumber}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">₹{inv.total?.toLocaleString()}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
