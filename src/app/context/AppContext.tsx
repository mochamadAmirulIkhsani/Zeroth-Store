import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  INITIAL_GAMES,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  INITIAL_STATS,
  INITIAL_SETTINGS,
  Game,
  Testimonial,
  FAQ,
} from '../data/gameData';

interface AppState {
  games: Game[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  stats: typeof INITIAL_STATS;
  settings: typeof INITIAL_SETTINGS;
  isAdminLoggedIn: boolean;
}

interface AppContextType extends AppState {
  setGames: (games: Game[]) => void;
  setTestimonials: (t: Testimonial[]) => void;
  setFaqs: (f: FAQ[]) => void;
  setStats: (s: typeof INITIAL_STATS) => void;
  setSettings: (s: typeof INITIAL_SETTINGS) => void;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
}

const ADMIN_PASSWORD = 'zeroth2026';
const STORAGE_KEY = 'zeroth_store_state';

const AppContext = createContext<AppContextType | null>(null);

function loadFromStorage(): Partial<AppState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveToStorage(state: Partial<AppState>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function AppProvider({ children }: { children: ReactNode }) {
  const saved = loadFromStorage();
  const [games, setGamesState] = useState<Game[]>(saved.games ?? INITIAL_GAMES);
  const [testimonials, setTestimonialsState] = useState<Testimonial[]>(saved.testimonials ?? INITIAL_TESTIMONIALS);
  const [faqs, setFaqsState] = useState<FAQ[]>(saved.faqs ?? INITIAL_FAQS);
  const [stats, setStatsState] = useState(saved.stats ?? INITIAL_STATS);
  const [settings, setSettingsState] = useState(saved.settings ?? INITIAL_SETTINGS);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('zeroth_admin') === 'true';
  });

  const persistAndSet = (updates: Partial<AppState>) => {
    saveToStorage({ games, testimonials, faqs, stats, settings, ...updates });
  };

  const setGames = (g: Game[]) => { setGamesState(g); persistAndSet({ games: g }); };
  const setTestimonials = (t: Testimonial[]) => { setTestimonialsState(t); persistAndSet({ testimonials: t }); };
  const setFaqs = (f: FAQ[]) => { setFaqsState(f); persistAndSet({ faqs: f }); };
  const setStats = (s: typeof INITIAL_STATS) => { setStatsState(s); persistAndSet({ stats: s }); };
  const setSettings = (s: typeof INITIAL_SETTINGS) => { setSettingsState(s); persistAndSet({ settings: s }); };

  const adminLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('zeroth_admin', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('zeroth_admin');
  };

  useEffect(() => {
    const existingIds = new Set(testimonials.map(t => t.id));
    const missing = INITIAL_TESTIMONIALS.filter(t => !existingIds.has(t.id));
    if (missing.length > 0) {
      setTestimonialsState(prev => [...prev, ...missing]);
    }
  }, []);

  useEffect(() => {
    saveToStorage({ games, testimonials, faqs, stats, settings });
  }, [games, testimonials, faqs, stats, settings]);

  return (
    <AppContext.Provider value={{
      games, testimonials, faqs, stats, settings, isAdminLoggedIn,
      setGames, setTestimonials, setFaqs, setStats, setSettings,
      adminLogin, adminLogout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
