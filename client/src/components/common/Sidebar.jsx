import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  FileText,
  Receipt,
  Clock,
  BarChart3,
  Bot,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/Badge';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Clients CRM', path: '/clients', icon: Users },
  { name: 'Projects', path: '/projects', icon: Briefcase },
  { name: 'Task Board', path: '/tasks', icon: CheckSquare },
  { name: 'Proposals', path: '/proposals', icon: FileText },
  { name: 'Invoices', path: '/invoices', icon: Receipt },
  { name: 'Time Tracking', path: '/time', icon: Clock },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Freelance Copilot', path: '/copilot', icon: Bot, isAi: true },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-64 border-r border-border/70 bg-card/95 backdrop-blur-md flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-border/60">
          <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
              <Zap className="h-4 w-4 fill-current" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-foreground block">
                Freelance<span className="text-emerald-500">OS</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-mono block -mt-0.5">
                Autonomous Studio
              </span>
            </div>
          </NavLink>

          <Badge variant="purple" className="text-[9px] px-1.5 py-0 font-mono">
            v2.4 Pro
          </Badge>
        </div>

        {/* Navigation Links */}
        <div className="px-3 py-4 flex-1 overflow-y-auto space-y-1">
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
            Operations Center
          </div>

          {NAV_ITEMS.map((item) => {
            const isActive =
              item.path === '/dashboard'
                ? location.pathname === '/dashboard' || location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group select-none',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-emerald-500/20'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={cn(
                      'h-4 w-4 transition-transform group-hover:scale-110',
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground',
                      item.isAi && !isActive && 'text-emerald-400'
                    )}
                  />
                  <span>{item.name}</span>
                </div>

                {item.isAi && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-500/15 text-emerald-500'
                    )}
                  >
                    <Sparkles className="h-2.5 w-2.5" />
                    AI
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Workspace & Settings */}
        <div className="p-3 border-t border-border/60 space-y-1">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <Settings className="h-4 w-4" />
            <span>Settings & Profile</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};
