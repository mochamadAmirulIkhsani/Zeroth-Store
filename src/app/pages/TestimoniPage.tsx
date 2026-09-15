import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, ChevronDown, X, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Game } from '../data/gameData';
import { formatDate } from '../components/ui/formatDate';

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
        <p className="text-xs font-semibold text-[rgba(20,20,19,0.5)] uppercase tracking-wider mb-2">Filter Game</p>
        <div className="relative">
          <button
            onClick={() => setGameDropdownOpen(!gameDropdownOpen)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white border border-[#e6dfd8] rounded-xl text-sm hover:border-[#d8cfc2] transition-colors"
          >
            <span className={selectedGame ? 'text-[#141413] font-medium' : 'text-[rgba(20,20,19,0.5)]'}>
              {selectedGame ? selectedGame.name : 'Semua Game'}
            </span>
            <ChevronDown className={`w-4 h-4 text-[rgba(20,20,19,0.5)] transition-transform ${gameDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {gameDropdownOpen && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-[#e6dfd8] rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => { setFilterGame('all'); setGameDropdownOpen(false); }}
                className={`w-full text-left px-3 py-2.5 text-sm hover:bg-[#f5f0e8] transition-colors ${filterGame === 'all' ? 'font-medium text-[#141413] bg-[#f5f0e8]' : 'text-[rgba(20,20,19,0.6)]'}`}
              >
                Semua Game
              </button>
              {games.map(g => (
                <button
                  key={g.id}
                  onClick={() => { setFilterGame(g.id); setGameDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 text-sm hover:bg-[#f5f0e8] transition-colors flex items-center gap-2 ${filterGame === g.id ? 'font-medium bg-[#f5f0e8]' : 'text-[rgba(20,20,19,0.6)]'}`}
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
        <p className="text-xs font-semibold text-[rgba(20,20,19,0.5)] uppercase tracking-wider mb-2">Filter Bintang</p>
        <div className="space-y-1">
          {STAR_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilterRating(opt.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                filterRating === opt.value
                  ? 'bg-primary text-white font-medium border border-primary'
                  : 'text-[rgba(20,20,19,0.6)] hover:bg-[#f5f0e8] border border-transparent'
              }`}
            >
              {opt.value > 0 ? (
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: opt.value }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-primary text-primary" />
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
          className="w-full flex items-center justify-center gap-2 text-sm text-[rgba(20,20,19,0.6)] hover:text-[#141413] border border-[#d8cfc2] hover:border-[#c0b8a8] py-2 rounded-xl transition-colors"
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
    <div className="min-h-screen pt-16" style={{ background: '#faf9f5' }} onClick={() => gameDropdownOpen && setGameDropdownOpen(false)}>
      {/* Header */}
      <div className="py-16" style={{ background: '#faf9f5', borderBottom: '1px solid #e6dfd8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-6 h-6 text-primary fill-primary" />
              ))}
            </div>
            <h1 className="text-4xl font-bold text-[#141413] mb-2" style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", fontWeight: 500, letterSpacing: '-0.02em' }}>
              Testimoni Klien
            </h1>
            <p className="mb-4" style={{ color: 'rgba(20,20,19,0.55)' }}>
              {activeTestimonials.length}+ testimoni nyata dari klien yang puas
            </p>
            <div className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-full text-sm" style={{ background: '#cc785c' }}>
              <Star className="w-4 h-4 fill-white text-white" />
              <span>Rating rata-rata {avgRating}/5.0</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <p className="text-sm" style={{ color: 'rgba(20,20,19,0.55)' }}>{filtered.length} testimoni</p>
          <button
            onClick={e => { e.stopPropagation(); setMobileFilterOpen(v => !v); }}
            className="flex items-center gap-2 text-sm border border-[#d8cfc2] px-3 py-2 rounded-lg hover:border-[#c0b8a8] transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter {hasFilters && <span className="w-2 h-2 rounded-full bg-primary inline-block" />}
          </button>
        </div>

        {mobileFilterOpen && (
          <div className="lg:hidden mb-6" style={{ background: '#f5f0e8', border: '1px solid #e6dfd8', borderRadius: '16px', padding: '20px' }} onClick={e => e.stopPropagation()}>
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
              <p className="text-sm" style={{ color: 'rgba(20,20,19,0.55)' }}>
                {filtered.length} testimoni ditemukan
                {hasFilters && (
                  <button onClick={clearFilters} className="ml-3 text-primary hover:underline text-xs">
                    Reset filter
                  </button>
                )}
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20" style={{ color: 'rgba(20,20,19,0.55)' }}>
                <p>Belum ada testimoni yang sesuai filter.</p>
                <button onClick={clearFilters} className="mt-3 text-sm text-primary hover:underline">
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
                        className="bg-white border border-[#e6dfd8] rounded-2xl p-5 hover:shadow-md hover:border-[#d8cfc2] transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star key={j} className={`w-3.5 h-3.5 ${j < t.rating ? 'text-primary fill-primary' : 'text-gray-200'}`} />
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
                        <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(20,20,19,0.7)' }}>"{t.content}"</p>
                        {t.service && (
                          <p className="text-xs mb-3 px-2 py-1 rounded-lg inline-block" style={{ color: 'rgba(20,20,19,0.55)', background: '#f5f0e8' }}>
                            {t.service}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#ebe6df' }}>
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: '#efe9de' }}>
                              {t.avatar ? (
                                <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xs font-medium" style={{ color: 'rgba(20,20,19,0.5)' }}>{t.name[0]}</span>
                              )}
                            </div>
                            <span className="font-medium text-[#141413] text-sm">{t.name}</span>
                          </div>
                          <span className="text-xs" style={{ color: 'rgba(20,20,19,0.5)' }}>{formatDate(t.date)}</span>
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
                      className="w-11 h-11 flex items-center justify-center rounded-xl border border-[#d8cfc2] text-[rgba(20,20,19,0.55)] hover:border-[#c0b8a8] hover:text-[#141413] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-11 h-11 flex items-center justify-center rounded-xl text-sm transition-colors ${
                          page === currentPage
                            ? 'bg-[#141413] text-[#faf9f5]'
                            : 'border border-[#d8cfc2] text-[rgba(20,20,19,0.55)] hover:border-[#c0b8a8] hover:text-[#141413]'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-11 h-11 flex items-center justify-center rounded-xl border border-[#d8cfc2] text-[rgba(20,20,19,0.55)] hover:border-[#c0b8a8] hover:text-[#141413] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
