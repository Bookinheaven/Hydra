import { useState, useEffect } from 'react';
import { StatisticsService } from '../services/StatisticsService.js';
import { SessionStatus } from '../models/Session.js';

export function useStats(session, passage) {
  const [stats, setStats] = useState({ wpm: 0, rawWpm: 0, accuracy: 0, cpm: 0 });

  useEffect(() => {
    if (session.status === SessionStatus.IDLE) {
      setStats({ wpm: 0, rawWpm: 0, accuracy: 0, cpm: 0 });
      return;
    }

    if (session.status === SessionStatus.COMPLETED) {
      setStats(StatisticsService.calculateStats(session, passage));
      return;
    }

    const interval = setInterval(() => {
      setStats(StatisticsService.calculateStats(session, passage));
    }, 1000); // Update stats every second

    return () => clearInterval(interval);
  }, [session, passage]);

  return stats;
}
