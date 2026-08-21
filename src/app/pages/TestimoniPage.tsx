import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, ChevronDown, X, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Game } from '../data/gameData';

const ITEMS_PER_PAGE = 10;

const STAR_OPTIONS = [
  { value: 0, label: 'Semua Rating' },
  { value: 5, label: '5 Bintang' },
  { value: 4, label: '4+ Bintang' },
  { value: 3, label: '3+ Bintang' },
];

interface SidebarProps {
  games: Game[];
  filterGame: string;
  setFilterGame: (v: string) => void;
  filterRating: number;
  setFilterRating: (v: number) => void;
  gameDropdownOpen: boolean;
  setGameDropdownOpen: (v: boolean) => void;
  selectedGame: Game | undefined;
  hasFilters: boolean;
  clearFilters: () => void;
}

function Sidebar({
  games, filterGame, setFilterGame, filterRating, setFilterRating,
  gameDropdownOpen, setGameDropdownOpen, selectedGame, hasFilters, clearFilters,
}: SidebarProps) {
  return (
    <aside className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Filter Game</p>
        <div className="relative">
          <button
            onClick={() => setGameDropdownOpen(!gameDropdownOpen)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm hover:border-gray-300 transition-colors"
          >
            <span className={selectedGame ? 'text-[#0A0A0A] font-medium' : 'text-gray-400'}>
              {selectedGame ? selectedGame.name : 'Semua Game'}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${gameDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {gameDropdownOpen && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => { setFilterGame('all'); setGameDropdownOpen(false); }}
                className={`w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors ${filterGame === 'all' ? 'font-medium text-amber-700 bg-amber-50' : 'text-gray-600'}`}
              >
                Semua Game
              </button>
              {games.map(g => (
                <button
                  key={g.id}
                  onClick={() => { setFilterGame(g.id); setGameDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${filterGame === g.id ? 'font-medium bg-gray-50' : 'text-gray-600'}`}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }} />
                  <span style={filterGame === g.id ? { color: g.color } : {}}>{g.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Filter Bintang</p>
        <div className="space-y-1">
          {STAR_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilterRating(opt.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                filterRating === opt.value
                  ? 'bg-amber-50 text-amber-700 font-medium border border-amber-200'
                  : 'text-gray-600 hover:bg-gray-50 border border-transparent'
              }`}
            >
              {opt.value > 0 ? (
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: opt.value }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </span>
              ) : (
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-gray-300" />
                  ))}
                </span>
              )}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 py-2 rounded-xl transition-colors"
        >
          <X className="w-3.5 h-3.5" /> Reset Filter
        </button>
      )}
    </aside>
  );
}

export function TestimoniPage() {
  const { testimonials, games } = useApp();
  const [filterGame, setFilterGame] = useState('all');
  const [filterRating, setFilterRating] = useState(0);
  const [gameDropdownOpen, setGameDropdownOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const activeTestimonials = testimonials.filter(t => t.active);

  const filtered = useMemo(() =>
    activeTestimonials
      .filter(t => filterGame === 'all' || t.gameId === filterGame)
      .filter(t => filterRating === 0 || t.rating >= filterRating),
    [activeTestimonials, filterGame, filterRating]
  );

  useEffect(() => { setCurrentPage(1); }, [filterGame, filterRating]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const avgRating = activeTestimonials.length
    ? (activeTestimonials.reduce((s, t) => s + t.rating, 0) / activeTestimonials.length).toFixed(1)
    : '5.0';

  const selectedGame = games.find(g => g.id === filterGame);
  const hasFilters = filterGame !== 'all' || filterRating !== 0;
  const clearFilters = () => { setFilterGame('all'); setFilterRating(0); };

  const sidebarProps: SidebarProps = {
    games, filterGame, setFilterGame, filterRating, setFilterRating,
    gameDropdownOpen, setGameDropdownOpen, selectedGame, hasFilters, clearFilters,
  };

  return (
    <div className="min-h-screen bg-white" onClick={() => gameDropdownOpen && setGameDropdownOpen(false)}>
      {/* Header */}
      <div className="bg-gradient-to-br from-white to-gray-50 py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <h1 className="text-4xl font-bold text-[#0A0A0A] mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Testimoni Klien
            </h1>
            <p className="text-gray-500 mb-4">
              {activeTestimonials.length}+ testimoni nyata dari klien yang puas
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Rating rata-rata {avgRating}/5.0</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <p className="text-sm text-gray-500">{filtered.length} testimoni</p>
          <button
            onClick={e => { e.stopPropagation(); setMobileFilterOpen(v => !v); }}
            className="flex items-center gap-2 text-sm border border-gray-200 px-3 py-2 rounded-lg hover:border-gray-300 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter {hasFilters && <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />}
          </button>
        </div>

        {mobileFilterOpen && (
          <div className="lg:hidden mb-6 bg-gray-50 border border-gray-100 rounded-2xl p-5" onClick={e => e.stopPropagation()}>
            <Sidebar {...sidebarProps} />
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-52 flex-shrink-0" onClick={e => e.stopPropagation()}>
            <div className="sticky top-24">
              <Sidebar {...sidebarProps} />
            </div>
          </div>

          {/* Main */}
          <div className="flex-1 min-w-0">
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {filtered.length} testimoni ditemukan
                {hasFilters && (
                  <button onClick={clearFilters} className="ml-3 text-amber-600 hover:underline text-xs">
                    Reset filter
                  </button>
                )}
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p>Belum ada testimoni yang sesuai filter.</p>
                <button onClick={clearFilters} className="mt-3 text-sm text-amber-600 hover:underline">
                  Reset filter
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {paginated.map((t, i) => {
                    const game = games.find(g => g.id === t.gameId);
                    return (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.04, 0.25) }}
                        className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star key={j} className={`w-3.5 h-3.5 ${j < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                            ))}
                          </div>
                          {game && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ backgroundColor: game.color + '15', color: game.color }}
                            >
                              {game.name}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.content}"</p>
                        {t.service && (
                          <p className="text-gray-400 text-xs mb-3 bg-gray-50 px-2 py-1 rounded-lg inline-block">
                            {t.service}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                              {t.avatar ? (
                                <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-gray-500 text-xs font-medium">{t.name[0]}</span>
                              )}
                            </div>
                            <span className="font-medium text-[#0A0A0A] text-sm">{t.name}</span>
                          </div>
                          <span className="text-gray-400 text-xs">{t.date}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-[#0A0A0A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm transition-colors ${
                          page === currentPage
                            ? 'bg-[#0A0A0A] text-white'
                            : 'border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-[#0A0A0A]'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-[#0A0A0A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
