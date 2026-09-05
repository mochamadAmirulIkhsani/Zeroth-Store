import { useState, useRef, useEffect } from 'react';
import { Plus, Pencil, Trash2, Star, Eye, EyeOff, Bookmark, ChevronDown, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Testimonial } from '../../data/gameData';
import { formatDate } from '../../components/ui/formatDate';

const EMPTY: Omit<Testimonial, 'id'> = {
  name: '',
  gameId: '',
  service: '',
  rating: 5,
  content: '',
  date: new Date().toISOString().split('T')[0],
  featured: false,
  active: true,
};

const ITEMS_PER_PAGE = 5;

// ── Game Filter Dropdown ─────────────────────────────────────────
function FilterDropdown({
  options,
  value,
  onChange,
}: {
  options: { id: string; name: string; color: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.id === value);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative w-full sm:w-60">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm transition-all hover:border-gray-300 focus:outline-none"
        style={{ borderColor: open ? '#fbbf24' : undefined, boxShadow: open ? '0 0 0 3px rgba(251,191,36,0.12)' : undefined }}
      >
        <div className="flex items-center gap-2 min-w-0">
          {selected && selected.id !== 'all' ? (
            <>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: selected.color }} />
              <span className="text-gray-800 truncate">{selected.name}</span>
            </>
          ) : (
            <span className="text-gray-500">Semua Game</span>
          )}
        </div>
        <ChevronDown
          className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-150"
          style={{ transform: open ? 'rotate(180deg)' : undefined }}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 py-1.5 overflow-hidden"
          style={{ boxShadow: '0 8px 28px rgba(0,0,0,0.10)' }}
        >
          {[{ id: 'all', name: 'Semua Game', color: '#9ca3af' }, ...options].map(opt => {
            const isActive = opt.id === value || (opt.id === 'all' && !value);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => { onChange(opt.id === 'all' ? '' : opt.id); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                style={{ background: isActive ? 'rgba(251,191,36,0.05)' : undefined }}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: opt.color }} />
                <span className={`flex-1 text-sm ${isActive ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{opt.name}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Pagination ───────────────────────────────────────────────────
function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  return (
    <div className="flex flex-col items-center gap-2 pt-2">
      <p className="text-sm text-gray-400">
        Menampilkan <span className="font-medium text-gray-600">{start}–{end}</span> dari{' '}
        <span className="font-medium text-gray-600">{totalItems}</span> testimoni
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
          const show = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
          if (!show) {
            const prevShow = page - 1 === 1 || page - 1 === totalPages || Math.abs(page - 1 - currentPage) <= 1;
            if (!prevShow) return null;
            return <span key={`el-${page}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>;
          }
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onChange(page)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all"
              style={
                isActive
                  ? { background: 'linear-gradient(135deg,#fbbf24,#f97316)', color: '#000', boxShadow: '0 2px 8px rgba(251,191,36,0.35)' }
                  : { background: '#fff', border: '1px solid #e5e7eb', color: '#6b7280' }
              }
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Star Row ─────────────────────────────────────────────────────
function Stars({ rating, interactive = false, onChange }: { rating: number; interactive?: boolean; onChange?: (r: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(r => (
        <button
          key={r}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(r)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star className={`${interactive ? 'w-5 h-5' : 'w-3 h-3'} ${r <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
        </button>
      ))}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────
export function AdminTestimonials() {
  const { testimonials, setTestimonials, games } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Testimonial, 'id'>>(EMPTY);
  const [savedMsg, setSavedMsg] = useState('');
  const [filterGameId, setFilterGameId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const showSaved = (msg: string) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(''), 2500);
  };

  // Filtered + paginated
  const filtered = filterGameId
    ? testimonials.filter(t => t.gameId === filterGameId)
    : testimonials;
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const changeFilter = (id: string) => {
    setFilterGameId(id);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY, gameId: games[0]?.id ?? '' });
    setShowForm(true);
  };

  const handleEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setForm({ ...t });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.content.trim() || !form.gameId) return;
    if (editingId) {
      setTestimonials(testimonials.map(t => t.id === editingId ? { ...form, id: editingId } : t));
      showSaved('Testimoni diperbarui');
    } else {
      setTestimonials([...testimonials, { ...form, id: `t${Date.now()}` }]);
      const newTotal = Math.ceil((filtered.length + 1) / ITEMS_PER_PAGE);
      setCurrentPage(newTotal);
      showSaved('Testimoni ditambahkan');
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Hapus testimoni ini?')) return;
    setTestimonials(testimonials.filter(t => t.id !== id));
    const newTotal = Math.max(1, Math.ceil((filtered.length - 1) / ITEMS_PER_PAGE));
    if (currentPage > newTotal) setCurrentPage(newTotal);
    showSaved('Testimoni dihapus');
  };

  const toggle = (id: string, field: 'active' | 'featured') =>
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, [field]: !t[field] } : t));

  const dropdownOptions = games.map(g => ({ id: g.id, name: g.name, color: g.color }));

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Manajemen Testimoni
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">{testimonials.length} total · {testimonials.filter(t => t.featured).length} featured</p>
        </div>
        <div className="flex items-center gap-2">
          {savedMsg && (
            <span className="text-green-600 text-sm font-medium bg-green-50 border border-green-100 px-3 py-1.5 rounded-lg">
              ✓ {savedMsg}
            </span>
          )}
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg,#fbbf24,#f97316)',
              color: '#000',
              fontFamily: 'Space Grotesk, sans-serif',
              boxShadow: '0 4px 12px rgba(251,191,36,0.25)',
            }}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Tambah
          </button>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-gray-500 flex-shrink-0">Filter:</span>
        <FilterDropdown options={dropdownOptions} value={filterGameId} onChange={changeFilter} />
        {filtered.length !== testimonials.length && (
          <span className="text-xs text-gray-400">
            {filtered.length} dari {testimonials.length} ditampilkan
          </span>
        )}
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div className="bg-white border-2 border-amber-200 rounded-2xl p-5" style={{ boxShadow: '0 4px 24px rgba(251,191,36,0.07)' }}>
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">
            {editingId ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Nama *</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Nama atau Anonim"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Game *</label>
              <div className="relative">
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white appearance-none pr-8"
                  value={form.gameId}
                  onChange={e => setForm(f => ({ ...f, gameId: e.target.value }))}
                >
                  <option value="">Pilih game</option>
                  {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Layanan</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                value={form.service}
                onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                placeholder="Contoh: Push Rank"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tanggal</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Rating</label>
              <Stars rating={form.rating} interactive onChange={r => setForm(f => ({ ...f, rating: r }))} />
            </div>
            <div className="flex flex-col justify-end gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="rounded" />
                Tampil di website
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="rounded" />
                Featured (homepage)
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Isi Testimoni *</label>
              <textarea
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
                rows={3}
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Tulis isi testimoni..."
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={!form.name.trim() || !form.content.trim() || !form.gameId}
              className="px-5 py-2 font-medium rounded-xl text-sm disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg,#fbbf24,#f97316)', color: '#000' }}
            >
              {editingId ? 'Simpan Perubahan' : 'Tambah'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* ── List ── */}
      <div className="space-y-2">
        {paged.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl text-gray-400">
            <p className="text-sm">
              {filterGameId ? 'Tidak ada testimoni untuk game ini.' : 'Belum ada testimoni.'}
            </p>
          </div>
        )}
        {paged.map(t => {
          const game = games.find(g => g.id === t.gameId);
          return (
            <div
              key={t.id}
              className={`bg-white border rounded-xl px-4 py-3 flex items-center gap-3 transition-all duration-150 ${
                t.active ? 'border-gray-200' : 'border-gray-100 opacity-55'
              }`}
            >
              {/* Game color bar */}
              {game && (
                <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: game.color }} />
              )}

              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                style={{ background: game ? game.color : '#9ca3af' }}
              >
                {t.name[0]?.toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-sm font-medium text-gray-900">{t.name}</span>
                  {game && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-md font-medium text-white"
                      style={{ backgroundColor: game.color + 'cc' }}
                    >
                      {game.name}
                    </span>
                  )}
                  {t.featured && (
                    <span className="text-xs px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-md font-medium flex items-center gap-0.5 border border-amber-100">
                      <Bookmark className="w-2.5 h-2.5" /> Featured
                    </span>
                  )}
                  {!t.active && (
                    <span className="text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-md">Tersembunyi</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Stars rating={t.rating} />
                  <span className="text-gray-300 text-xs">·</span>
                  <span className="text-gray-400 text-xs">{formatDate(t.date)}</span>
                  {t.service && (
                    <>
                      <span className="text-gray-300 text-xs">·</span>
                      <span className="text-gray-400 text-xs truncate max-w-[140px]">{t.service}</span>
                    </>
                  )}
                </div>
                <p className="text-gray-500 text-xs line-clamp-1">"{t.content}"</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => toggle(t.id, 'featured')}
                  className={`p-1.5 rounded-lg transition-colors ${t.featured ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-gray-300 hover:text-gray-500 hover:bg-gray-100'}`}
                  title="Toggle featured"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => toggle(t.id, 'active')}
                  className={`p-1.5 rounded-lg transition-colors ${t.active ? 'text-green-500 bg-green-50 hover:bg-green-100' : 'text-gray-300 hover:text-gray-500 hover:bg-gray-100'}`}
                  title={t.active ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {t.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleEdit(t)}
                  className="p-1.5 rounded-lg text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1.5 rounded-lg text-red-400 bg-red-50 hover:bg-red-100 transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Pagination ── */}
      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        totalItems={filtered.length}
        onChange={setCurrentPage}
      />

    </div>
  );
}
