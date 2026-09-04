import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Feature Showcase Banner (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-gradient-to-br from-card via-slate-900 to-emerald-950 border-r border-border/60 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-glow">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              Freelance<span className="text-emerald-400">OS</span>
            </span>
            <span className="text-xs text-slate-400 block -mt-1 font-mono">
              Autonomous Operating System
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Powered by Freelance Copilot AI</span>
          </div>

          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Manage your entire freelance business from one intelligent command center.
          </h1>

          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Context-aware AI proposals, follow-ups, and project planning</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Sprint Kanban board with subtasks and deadline tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Tax-ready dynamic invoices with payment reminders & PDF export</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Live billable time tracking & financial cash flow analytics</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 font-mono flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Enterprise-grade security • JWT Authentication • Encrypted DB</span>
        </div>
      </div>

      {/* Right Auth Form View */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
