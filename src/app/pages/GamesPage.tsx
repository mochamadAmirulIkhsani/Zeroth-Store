import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Search, ArrowRight, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEO } from '../components/SEO';

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
        <p className="text-xs font-semibold text-[rgba(20,20,19,0.5)] uppercase tracking-wider mb-2">Cari Game</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Nama game..."
            value={query}
            onChange={e => handleQueryChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e6dfd8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
          {query && (
            <button onClick={() => handleQueryChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="text-xs font-semibold text-[rgba(20,20,19,0.5)] uppercase tracking-wider mb-2">Urutkan</p>
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
                                  ? 'bg-primary text-white font-medium border border-primary'
                                  : 'text-[rgba(20,20,19,0.6)] hover:bg-[#f5f0e8] border border-transparent'
                              }`}
                            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Min services */}
      <div>
        <p className="text-xs font-semibold text-[rgba(20,20,19,0.5)] uppercase tracking-wider mb-2">Min. Layanan</p>
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
                  ? 'bg-primary text-white font-medium border border-primary'
                  : 'text-[rgba(20,20,19,0.6)] hover:bg-[#f5f0e8] border border-transparent'
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
          className="w-full flex items-center justify-center gap-2 text-sm text-[rgba(20,20,19,0.6)] hover:text-[#141413] border border-[#d8cfc2] hover:border-[#c8c0b2] py-2 rounded-xl transition-colors"
        >
          <X className="w-3.5 h-3.5" /> Reset Filter
        </button>
      )}
    </aside>
  );

  return (
    <>
      <SEO
        title="Semua Game — Zeroth Store"
        description="Daftar lengkap game yang kami layani: Genshin Impact, Honkai Star Rail, Zenless Zone Zero, Wuthering Waves, dan lainnya. Lihat layanan joki yang tersedia."
        path="/games"
      />
      <div className="min-h-screen" style={{ background: '#faf9f5' }}>
      {/* Header */}
      <div className="py-14" style={{ background: '#faf9f5', borderBottom: '1px solid #e6dfd8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-4xl font-bold text-[#141413] mb-3" style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", fontWeight: 500, letterSpacing: '-0.02em' }}>
              Semua Game yang Kami Layani
            </h1>
            <p className="max-w-lg mx-auto" style={{ color: 'rgba(20,20,19,0.55)' }}>
              Pilih game favorit Anda dan lihat daftar lengkap layanan joki yang tersedia
            </p>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <p className="text-sm" style={{ color: 'rgba(20,20,19,0.55)' }}>{filtered.length} game ditemukan</p>
          <button
            onClick={() => setMobileFilterOpen(v => !v)}
            className="flex items-center gap-2 text-sm border border-[#d8cfc2] px-3 py-2 rounded-lg hover:border-[#c0b8a8] transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter {hasFilters && <span className="w-2 h-2 rounded-full bg-primary inline-block" />}
          </button>
        </div>

        {/* Mobile filter panel */}
        {mobileFilterOpen && (
          <div className="lg:hidden mb-6" style={{ background: '#f5f0e8', border: '1px solid #e6dfd8', borderRadius: '16px', padding: '20px' }}>
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
              <p className="text-sm" style={{ color: 'rgba(20,20,19,0.55)' }}>
                {filtered.length} game ditemukan
                {hasFilters && (
                  <button onClick={clearFilters} className="ml-3 text-primary hover:underline text-xs">
                    Reset filter
                  </button>
                )}
              </p>
              <p className="text-xs" style={{ color: 'rgba(20,20,19,0.5)' }}>
                Halaman {safePage} dari {totalPages}
              </p>
            </div>

            {paginated.length === 0 ? (
              <div className="text-center py-20" style={{ color: 'rgba(20,20,19,0.55)' }}>
                <p>Tidak ada game yang cocok dengan filter ini.</p>
                <button onClick={clearFilters} className="mt-3 text-sm text-primary hover:underline">
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
                        className="group block bg-white border border-[#e6dfd8] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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
                            <h3 className="text-white font-bold text-lg mb-0.5" style={{ fontFamily: "'Cormorant Garamond', 'EB Garamond', serif", fontWeight: 600 }}>
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
                          <p className="text-sm mb-4 line-clamp-2" style={{ color: 'rgba(20,20,19,0.55)' }}>{game.description}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs mb-0.5" style={{ color: 'rgba(20,20,19,0.5)' }}>Mulai dari</p>
                              <p className="font-semibold text-[#141413] text-sm">{startingPrice}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ backgroundColor: game.color + '15', color: game.color }}>
                                {activeServices.length} Layanan
                              </span>
                              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
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
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#d8cfc2] hover:shadow-sm"
                    style={{ borderColor: '#d8cfc2', color: 'rgba(20,20,19,0.6)', background: '#fff' }}
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
                          return <span key={n} className="w-9 text-center text-[rgba(20,20,19,0.55)] text-sm select-none">…</span>;
                        }
                        return null;
                      }

                      return (
                        <motion.button
                          key={n}
                          onClick={() => setPage(n)}
                          whileHover={!isActive ? { scale: 1.08 } : {}}
                          whileTap={{ scale: 0.95 }}
                          className="relative w-11 h-11 rounded-xl text-sm font-semibold transition-all duration-200 overflow-hidden"
                          style={{
                            background: isActive ? '#cc785c' : '#fff',
                            color: isActive ? '#fff' : 'rgba(20,20,19,0.6)',
                            border: isActive ? 'none' : '1px solid #d8cfc2',
                            boxShadow: isActive ? '0 4px 14px rgba(204,120,92,0.4)' : '0 1px 3px rgba(20,20,19,0.04)',
                            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
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
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#d8cfc2] hover:shadow-sm"
                    style={{ borderColor: '#d8cfc2', color: 'rgba(20,20,19,0.6)', background: '#fff' }}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Page info */}
                <p className="text-center text-xs mt-3" style={{ color: 'rgba(20,20,19,0.55)' }}>
                  Halaman <span className="font-medium" style={{ color: 'rgba(20,20,19,0.75)' }}>{safePage}</span> dari <span className="font-medium" style={{ color: 'rgba(20,20,19,0.75)' }}>{totalPages}</span> · {filtered.length} game
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>

  );
}
