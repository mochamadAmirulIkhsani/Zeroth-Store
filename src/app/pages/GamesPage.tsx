import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Search, ArrowRight, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const PER_PAGE = 6;

export function GamesPage() {
  const { games } = useApp();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'services'>('default');
  const [minServices, setMinServices] = useState(0);
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const activeGames = games.filter(g => g.status === 'active');

  const filtered = useMemo(() => {
    let list = activeGames.filter(g =>
      g.name.toLowerCase().includes(query.toLowerCase()) ||
      g.tagline?.toLowerCase().includes(query.toLowerCase())
    );
    if (minServices > 0) {
      list = list.filter(g => g.services.filter(s => s.active).length >= minServices);
    }
    if (sortBy === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'services') list = [...list].sort((a, b) =>
      b.services.filter(s => s.active).length - a.services.filter(s => s.active).length
    );
    return list;
  }, [activeGames, query, sortBy, minServices]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const handleQueryChange = (v: string) => { setQuery(v); setPage(1); };
  const handleSort = (v: typeof sortBy) => { setSortBy(v); setPage(1); };
  const handleMinServices = (v: number) => { setMinServices(v); setPage(1); };
  const clearFilters = () => { setQuery(''); setSortBy('default'); setMinServices(0); setPage(1); };

  const hasFilters = query !== '' || sortBy !== 'default' || minServices !== 0;

  const Sidebar = () => (
    <aside className="space-y-6">
      {/* Search */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Cari Game</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Nama game..."
            value={query}
            onChange={e => handleQueryChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition"
          />
          {query && (
            <button onClick={() => handleQueryChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Urutkan</p>
        <div className="space-y-1">
          {([
            { value: 'default', label: 'Default' },
            { value: 'name', label: 'Nama A–Z' },
            { value: 'services', label: 'Layanan Terbanyak' },
          ] as { value: typeof sortBy; label: string }[]).map(opt => (
            <button
              key={opt.value}
              onClick={() => handleSort(opt.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                sortBy === opt.value
                  ? 'bg-amber-50 text-amber-700 font-medium border border-amber-200'
                  : 'text-gray-600 hover:bg-gray-50 border border-transparent'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Min services */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Min. Layanan</p>
        <div className="space-y-1">
          {[
            { value: 0, label: 'Semua' },
            { value: 1, label: '1+ Layanan' },
            { value: 3, label: '3+ Layanan' },
            { value: 5, label: '5+ Layanan' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => handleMinServices(opt.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                minServices === opt.value
                  ? 'bg-amber-50 text-amber-700 font-medium border border-amber-200'
                  : 'text-gray-600 hover:bg-gray-50 border border-transparent'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-white to-gray-50 py-14 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-4xl font-bold text-[#0A0A0A] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Semua Game yang Kami Layani
            </h1>
            <p className="text-gray-500 max-w-lg mx-auto">
              Pilih game favorit Anda dan lihat daftar lengkap layanan joki yang tersedia
            </p>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <p className="text-sm text-gray-500">{filtered.length} game ditemukan</p>
          <button
            onClick={() => setMobileFilterOpen(v => !v)}
            className="flex items-center gap-2 text-sm border border-gray-200 px-3 py-2 rounded-lg hover:border-gray-300 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter {hasFilters && <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />}
          </button>
        </div>

        {/* Mobile filter panel */}
        {mobileFilterOpen && (
          <div className="lg:hidden mb-6 bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <Sidebar />
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>

          {/* Main */}
          <div className="flex-1 min-w-0">
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {filtered.length} game ditemukan
                {hasFilters && (
                  <button onClick={clearFilters} className="ml-3 text-amber-600 hover:underline text-xs">
                    Reset filter
                  </button>
                )}
              </p>
              <p className="text-xs text-gray-400">
                Halaman {safePage} dari {totalPages}
              </p>
            </div>

            {paginated.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p>Tidak ada game yang cocok dengan filter ini.</p>
                <button onClick={clearFilters} className="mt-3 text-sm text-amber-600 hover:underline">
                  Reset filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginated.map((game, i) => {
                  const activeServices = game.services.filter(s => s.active);
                  const startingPrice = activeServices[0]?.price ?? 'Nego';
                  return (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={`/games/${game.slug}`}
                        className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={game.image}
                            alt={game.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                          <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: game.color }} />
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-white font-bold text-lg mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                              {game.name}
                            </h3>
                            <p className="text-gray-300 text-xs line-clamp-1">{game.tagline}</p>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span className="text-xs px-2 py-1 rounded-full font-medium text-white" style={{ backgroundColor: game.color }}>
                              Tersedia
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{game.description}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-400 text-xs mb-0.5">Mulai dari</p>
                              <p className="font-semibold text-[#0A0A0A] text-sm">{startingPrice}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ backgroundColor: game.color + '15', color: game.color }}>
                                {activeServices.length} Layanan
                              </span>
                              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 transition-colors" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <div className="flex items-center justify-center gap-2">
                  {/* Prev */}
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-300 hover:shadow-sm"
                    style={{ borderColor: '#e5e7eb', color: '#6b7280', background: '#fff' }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>

                  {/* Pages */}
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => {
                      const isActive = n === safePage;
                      const isNear = Math.abs(n - safePage) <= 1 || n === 1 || n === totalPages;
                      const showEllipsisBefore = n === safePage - 2 && safePage - 2 > 2;
                      const showEllipsisAfter = n === safePage + 2 && safePage + 2 < totalPages - 1;

                      if (!isNear) {
                        if (showEllipsisBefore || showEllipsisAfter) {
                          return <span key={n} className="w-9 text-center text-gray-400 text-sm select-none">…</span>;
                        }
                        return null;
                      }

                      return (
                        <motion.button
                          key={n}
                          onClick={() => setPage(n)}
                          whileHover={!isActive ? { scale: 1.08 } : {}}
                          whileTap={{ scale: 0.95 }}
                          className="relative w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 overflow-hidden"
                          style={{
                            background: isActive ? 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' : '#fff',
                            color: isActive ? '#000' : '#6b7280',
                            border: isActive ? 'none' : '1px solid #e5e7eb',
                            boxShadow: isActive ? '0 4px 14px rgba(251,191,36,0.4)' : '0 1px 3px rgba(0,0,0,0.04)',
                            fontFamily: 'Space Grotesk, sans-serif',
                          }}
                        >
                          {n}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Next */}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-300 hover:shadow-sm"
                    style={{ borderColor: '#e5e7eb', color: '#6b7280', background: '#fff' }}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Page info */}
                <p className="text-center text-xs text-gray-400 mt-3">
                  Halaman <span className="font-medium text-gray-600">{safePage}</span> dari <span className="font-medium text-gray-600">{totalPages}</span> · {filtered.length} game
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
