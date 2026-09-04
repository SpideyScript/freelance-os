import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const TimerContext = createContext(undefined);

export const TimerProvider = ({ children }) => {
  const [activeTimer, setActiveTimer] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const refreshTimer = async () => {
    try {
      const token = localStorage.getItem('freelance_os_token');
      if (!token) return;
      const res = await api.get('/time/active');
      if (res.data.success && res.data.data) {
        setActiveTimer(res.data.data);
        const startTime = new Date(res.data.data.startTime).getTime();
        const diff = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
        setElapsedSeconds(diff);
      } else {
        setActiveTimer(null);
        setElapsedSeconds(0);
      }
    } catch (err) {
      console.error('Failed to fetch active timer:', err);
    }
  };

  useEffect(() => {
    refreshTimer();
  }, []);

  // Timer interval ticker
  useEffect(() => {
    let interval = null;
    if (activeTimer && activeTimer.isTimerRunning) {
      interval = setInterval(() => {
        const startTime = new Date(activeTimer.startTime).getTime();
        const diff = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
        setElapsedSeconds(diff);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer]);

  const startTimer = async (data) => {
    const res = await api.post('/time/start', data);
    if (res.data.success) {
      setActiveTimer(res.data.data);
      setElapsedSeconds(0);
    }
  };

  const stopTimer = async (description) => {
    if (!activeTimer) return;
    const res = await api.post('/time/stop', {
      timeEntryId: activeTimer._id,
      description: description || activeTimer.description,
    });
    if (res.data.success) {
      setActiveTimer(null);
      setElapsedSeconds(0);
    }
  };

  return (
    <TimerContext.Provider
      value={{
        activeTimer,
        elapsedSeconds,
        isRunning: !!activeTimer && activeTimer.isTimerRunning,
        startTimer,
        stopTimer,
        refreshTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
