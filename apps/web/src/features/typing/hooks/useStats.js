import { useState, useEffect, useMemo } from 'react';
import { StatisticsService } from '../services/StatisticsService.js';
import { SessionStatus } from '../models/Session.js';

export function useStats(session, passage) {
  const [ticker, setTicker] = useState(0);

  // Tick every 500ms during TYPING so time elapsed and WPM update smoothly
  useEffect(() => {
    if (session.status !== SessionStatus.TYPING) return;
    const interval = setInterval(() => {
      setTicker(t => t + 1);
    }, 500);
    return () => clearInterval(interval);
  }, [session.status]);

  return useMemo(() => {
    if (session.status === SessionStatus.IDLE) {
      return { wpm: 0, rawWpm: 0, accuracy: 100, cpm: 0 };
    }
    return StatisticsService.calculateStats(session, passage);
  }, [session, passage, ticker]);
}
