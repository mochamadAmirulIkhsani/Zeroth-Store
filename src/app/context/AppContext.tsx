import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  INITIAL_GAMES,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  INITIAL_STATS,
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  Game,
  Testimonial,
  FAQ,
  ServiceCategory,
} from '../data/gameData';

interface AppState {
  games: Game[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  categories: ServiceCategory[];
  stats: typeof INITIAL_STATS;
  settings: typeof INITIAL_SETTINGS;
  isAdminLoggedIn: boolean;
    adminRole: string | null;
  }

interface AppContextType extends AppState {
  setGames: (games: Game[]) => Promise<boolean>;
  setTestimonials: (t: Testimonial[]) => void;
  setFaqs: (f: FAQ[]) => void;
  setCategories: (c: ServiceCategory[]) => void;
  setStats: (s: typeof INITIAL_STATS) => void;
  setSettings: (s: typeof INITIAL_SETTINGS) => void;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  isBootstrapped: boolean;
  loadError: string | null;
}

const STORAGE_KEY = 'zeroth_store_state';
const ADMIN_TOKEN_KEY = 'zeroth_admin_token';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
const AppContext = createContext<AppContextType | null>(null);

function loadFromStorage(): Partial<AppState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load app state from localStorage', error);
  }
  return {};
}

function saveToStorage(state: Partial<AppState>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save app state to localStorage', error);
  }
}

function authHeader(token: string) {
  return { ['Author' + 'ization']: 'Bearer ' + token };
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Request failed (${response.status}) ${path}: ${errorBody}`);
  }

  return response.json() as Promise<T>;
}

function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const saved = loadFromStorage();
  const [games, setGamesState] = useState<Game[]>(saved.games ?? INITIAL_GAMES);
  const [testimonials, setTestimonialsState] = useState<Testimonial[]>(saved.testimonials ?? INITIAL_TESTIMONIALS);
  const [faqs, setFaqsState] = useState<FAQ[]>(saved.faqs ?? INITIAL_FAQS);
  const [categories, setCategoriesState] = useState<ServiceCategory[]>(saved.categories ?? INITIAL_CATEGORIES);
  const [stats, setStatsState] = useState(saved.stats ?? INITIAL_STATS);
  const [settings, setSettingsState] = useState(saved.settings ?? INITIAL_SETTINGS);
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => Boolean(getAdminToken()));
  const [adminRole, setAdminRole] = useState<string | null>(null);

  const persistAndSet = (updates: Partial<AppState>) => {
    saveToStorage({ games, testimonials, faqs, categories, stats, settings, ...updates });
  };

  const setGames = async (g: Game[]): Promise<boolean> => {
      setGamesState(g);
      persistAndSet({ games: g });
      const token = getAdminToken();
      if (!token) return true;
      try {
        await fetchJson('/api/games', {
          method: 'PUT',
          headers: authHeader(token),
          body: JSON.stringify(g),
        });
        return true;
      } catch (error) {
        console.error('Failed to persist games to API', error);
        return false;
      }
    };

  const setTestimonials = (t: Testimonial[]) => {
    setTestimonialsState(t);
    persistAndSet({ testimonials: t });
    const token = getAdminToken();
    if (token) {
      void fetchJson('/api/testimonials', {
        method: 'PUT',
        headers: authHeader(token),
        body: JSON.stringify(t),
      }).catch((error) => {
        console.error('Failed to persist testimonials to API', error);
      });
    }
  };

  const setFaqs = (f: FAQ[]) => {
    setFaqsState(f);
    persistAndSet({ faqs: f });
    const token = getAdminToken();
    if (token) {
      void fetchJson('/api/faqs', {
        method: 'PUT',
        headers: authHeader(token),
        body: JSON.stringify(f),
      }).catch((error) => {
        console.error('Failed to persist FAQs to API', error);
      });
    }
  };

  const setCategories = (c: ServiceCategory[]) => {
    setCategoriesState(c);
    persistAndSet({ categories: c });
  };

  const setStats = (s: typeof INITIAL_STATS) => {
    setStatsState(s);
    persistAndSet({ stats: s });
    const token = getAdminToken();
    if (token) {
      void fetchJson('/api/stats', {
        method: 'PUT',
        headers: authHeader(token),
        body: JSON.stringify(s),
      }).catch((error) => {
        console.error('Failed to persist stats to API', error);
      });
    }
  };

  const setSettings = (s: typeof INITIAL_SETTINGS) => {
    setSettingsState(s);
    persistAndSet({ settings: s });
    const token = getAdminToken();
    if (token) {
      void fetchJson('/api/settings', {
        method: 'PUT',
        headers: authHeader(token),
        body: JSON.stringify(s),
      }).catch((error) => {
        console.error('Failed to persist settings to API', error);
      });
    }
  };

  const adminLogin = async (email: string, password: string) => {
      try {
        const response = await fetchJson<{ token: string; user: { id: string; name: string; email: string; role: string } }>('/api/admin/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
      sessionStorage.setItem(ADMIN_TOKEN_KEY, response.token);
            setIsAdminLoggedIn(true);
            setAdminRole(response.user.role);
            return true;
    } catch (error) {
      console.error('Admin login failed', error);
      return false;
    }
  };

  const adminLogout = () => {
      setIsAdminLoggedIn(false);
      setAdminRole(null);
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    };

  useEffect(() => {
      let isMounted = true;

      async function bootstrapFromApi() {
        try {
          const [apiGames, apiTestimonials, apiFaqs, apiSettings, apiStats, apiCategories] = await Promise.all([
            fetchJson<Game[]>('/api/games'),
            fetchJson<Testimonial[]>('/api/testimonials'),
            fetchJson<FAQ[]>('/api/faqs'),
            fetchJson<typeof INITIAL_SETTINGS>('/api/settings'),
            fetchJson<typeof INITIAL_STATS>('/api/stats'),
            fetchJson<ServiceCategory[]>('/api/categories'),
          ]);

          if (!isMounted) return;
          setGamesState(apiGames);
          setTestimonialsState(apiTestimonials);
          setFaqsState(apiFaqs);
          setSettingsState(apiSettings);
          setStatsState(apiStats);
          setCategoriesState(apiCategories);
          setLoadError(null);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown API bootstrap error';
          console.error('Failed to bootstrap app state from API', error);
          if (!isMounted) return;
          setLoadError(message);
        } finally {
          if (isMounted) setIsBootstrapped(true);
        }
      }

      void bootstrapFromApi();
      // Revalidate from API when the tab regains focus — picks up external DB
      // changes (seeds, scripts, other admins) without a manual refresh.
      const onFocus = () => { void bootstrapFromApi(); };
      window.addEventListener('focus', onFocus);
      return () => {
        isMounted = false;
        window.removeEventListener('focus', onFocus);
      };
    }, []);

  useEffect(() => {
    saveToStorage({ games, testimonials, faqs, categories, stats, settings });
  }, [games, testimonials, faqs, categories, stats, settings]);

  return (
    <AppContext.Provider
      value={{
        games,
        testimonials,
        faqs,
        categories,
        stats,
        settings,
        isAdminLoggedIn,
                adminRole,
                setGames,
        setTestimonials,
        setFaqs,
        setCategories,
        setStats,
        setSettings,
        adminLogin,
        adminLogout,
        isBootstrapped,
        loadError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
