import React, { useState } from 'react';
import {
  Search,
  Moon,
  Sun,
  Bell,
  Clock,
  Play,
  Square,
  Menu,
  Sparkles,
  LogOut,
  User,
  CheckCircle2,
  AlertCircle,
  Receipt,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTimer } from '../../context/TimerContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../ui/Button';
import { formatDurationDigital, formatDate } from '../../lib/utils';
import { Link } from 'react-router-dom';

export const Header = ({ onMenuClick, onSearchClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isRunning, elapsedSeconds, stopTimer, activeTimer } = useTimer();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/70 bg-background/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Left Menu & Quick Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Command Palette Trigger */}
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground transition-all w-44 sm:w-64"
        >
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="truncate">Search clients, invoices...</span>
          <kbd className="hidden sm:inline-block ml-auto rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono font-semibold">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Stopwatch Widget */}
        <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-card px-2.5 sm:px-3 py-1.5 shadow-sm">
          <div
            className={`h-2 w-2 rounded-full ${
              isRunning ? 'bg-emerald-500 animate-ping' : 'bg-muted-foreground/50'
            }`}
          />
          <Clock className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
          <span className="font-mono text-xs font-bold text-foreground">
            {formatDurationDigital(elapsedSeconds)}
          </span>

          {isRunning ? (
            <Button
              onClick={() => stopTimer()}
              variant="danger"
              size="sm"
              className="h-6 px-2 text-[10px] gap-1"
            >
              <Square className="h-2.5 w-2.5 fill-current" />
              <span className="hidden sm:inline">Stop</span>
            </Button>
          ) : (
            <Link to="/time">
              <Button
                variant="secondary"
                size="sm"
                className="h-6 px-2 text-[10px] gap-1 text-primary hover:text-primary"
              >
                <Play className="h-2.5 w-2.5 fill-current" />
                <span className="hidden sm:inline">Tracker</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-xl border border-border bg-card p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl border border-border bg-card p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow-glow">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-card p-4 shadow-2xl z-50 animate-in fade-in-50">
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-foreground">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-mono">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-semibold text-primary hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="mt-2 max-h-72 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-center text-xs text-muted-foreground py-6">
                    No active notifications
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => markAsRead(n._id)}
                      className={`p-3 rounded-xl border text-xs transition-colors cursor-pointer ${
                        n.isRead
                          ? 'border-border/40 bg-muted/20 opacity-70'
                          : 'border-primary/30 bg-primary/5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-foreground">{n.title}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {formatDate(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-[11px] mt-1">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 rounded-xl border border-border bg-card p-1.5 hover:bg-muted transition-colors"
          >
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              {user?.name?.slice(0, 2).toUpperCase() || 'FL'}
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-2xl z-50 animate-in fade-in-50">
              <div className="px-3 py-2 border-b border-border/50">
                <p className="font-bold text-xs text-foreground truncate">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Workspace Settings</span>
                </Link>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-lg"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
