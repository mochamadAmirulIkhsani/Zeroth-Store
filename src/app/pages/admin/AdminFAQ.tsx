import { useState, useRef, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, ChevronDown, ChevronLeft, ChevronRight, Check, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { FAQ } from '../../data/gameData';

const FAQ_CATEGORIES = ['Umum', 'Keamanan', 'Pembayaran', 'Garansi', 'Teknis', 'Lainnya'];
const ITEMS_PER_PAGE = 6;

const EMPTY: Omit<FAQ, 'id'> = {
  question: '',
  answer: '',
  category: 'Umum',
  gameId: '',
  active: true,
};

// ── Generic Dropdown ─────────────────────────────────────────────
function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Pilih...',
  width = 'w-full sm:w-56',
}: {
  options: { id: string; label: string; color?: string }[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  width?: string;
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
    <div ref={ref} className={`relative ${width}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm hover:border-gray-300 transition-all focus:outline-none"
        style={{ borderColor: open ? '#fbbf24' : undefined, boxShadow: open ? '0 0 0 3px rgba(251,191,36,0.12)' : undefined }}
      >
        <div className="flex items-center gap-2 min-w-0">
          {selected?.color && (
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: selected.color }} />
          )}
          <span className={selected ? 'text-gray-800 truncate' : 'text-gray-400'}>
            {selected ? selected.label : placeholder}
          </span>
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
          {options.map(opt => {
            const isActive = opt.id === value;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => { onChange(opt.id); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                style={{ background: isActive ? 'rgba(251,191,36,0.05)' : undefined }}
              >
                {opt.color && (
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: opt.color }} />
                )}
                <span className={`flex-1 text-sm ${isActive ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                  {opt.label}
                </span>
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
        <span className="font-medium text-gray-600">{totalItems}</span> FAQ
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

// ── Category Badge ───────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Umum:       { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-100' },
  Keamanan:   { bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-100' },
  Pembayaran: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
  Garansi:    { bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-100' },
  Teknis:     { bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-100' },
  Lainnya:    { bg: 'bg-gray-100',  text: 'text-gray-500',   border: 'border-gray-200' },
};

function CategoryBadge({ category }: { category: string }) {
  const c = CATEGORY_COLORS[category] ?? CATEGORY_COLORS['Lainnya'];
  return (
    <span className={`text-xs px-2 py-0.5 rounded-md font-medium border ${c.bg} ${c.text} ${c.border}`}>
      {category}
    </span>
  );
}

// ── Main ─────────────────────────────────────────────────────────
export function AdminFAQ() {
  const { faqs, setFaqs, games } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<FAQ, 'id'>>(EMPTY);
  const [savedMsg, setSavedMsg] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const showSaved = (msg: string) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(''), 2500);
  };

  // Filter + paginate
  const filtered = filterCategory
    ? faqs.filter(f => f.category === filterCategory)
    : faqs;
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const changeFilter = (cat: string) => { setFilterCategory(cat); setCurrentPage(1); };

  const handleAdd = () => {
    setEditingId(null);
    setForm(EMPTY);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setForm({ ...faq });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    if (editingId) {
      setFaqs(faqs.map(f => f.id === editingId ? { ...form, id: editingId } : f));
      showSaved('FAQ diperbarui');
    } else {
      setFaqs([...faqs, { ...form, id: `faq-${Date.now()}` }]);
      const newTotal = Math.ceil((filtered.length + 1) / ITEMS_PER_PAGE);
      setCurrentPage(newTotal);
      showSaved('FAQ ditambahkan');
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Hapus FAQ ini?')) return;
    setFaqs(faqs.filter(f => f.id !== id));
    const newTotal = Math.max(1, Math.ceil((filtered.length - 1) / ITEMS_PER_PAGE));
    if (currentPage > newTotal) setCurrentPage(newTotal);
    showSaved('FAQ dihapus');
  };

  const toggleActive = (id: string) =>
    setFaqs(faqs.map(f => f.id === id ? { ...f, active: !f.active } : f));

  // Dropdown option lists
  const categoryFilterOptions = [
    { id: '', label: 'Semua Kategori' },
    ...FAQ_CATEGORIES.map(c => ({ id: c, label: c })),
  ];
  const categoryFormOptions = FAQ_CATEGORIES.map(c => ({ id: c, label: c }));
  const gameOptions = [
    { id: '', label: 'Tidak spesifik (Umum)' },
    ...games.map(g => ({ id: g.id, label: g.name, color: g.color })),
  ];

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Manajemen FAQ
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {faqs.length} total · {faqs.filter(f => f.active).length} aktif
          </p>
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
            Tambah FAQ
          </button>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-gray-500 flex-shrink-0">Filter:</span>
        <Dropdown
          options={categoryFilterOptions}
          value={filterCategory}
          onChange={changeFilter}
          placeholder="Semua Kategori"
          width="w-full sm:w-52"
        />
        {filterCategory && (
          <span className="text-xs text-gray-400">
            {filtered.length} dari {faqs.length} ditampilkan
            <button
              onClick={() => changeFilter('')}
              className="ml-1.5 text-amber-500 hover:text-amber-600 underline"
            >
              Reset
            </button>
          </span>
        )}
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div
          className="bg-white border-2 border-amber-200 rounded-2xl p-5"
          style={{ boxShadow: '0 4px 24px rgba(251,191,36,0.07)' }}
        >
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">
            {editingId ? 'Edit FAQ' : 'Tambah FAQ Baru'}
          </h3>
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Pertanyaan *</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                value={form.question}
                onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                placeholder="Tulis pertanyaan yang sering ditanya..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Jawaban *</label>
              <textarea
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
                rows={4}
                value={form.answer}
                onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
                placeholder="Tulis jawaban selengkap mungkin..."
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Kategori</label>
                <div className="relative">
                  <select
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white appearance-none pr-9"
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  >
                    {categoryFormOptions.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Spesifik untuk Game (opsional)</label>
                <div className="relative">
                  <select
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white appearance-none pr-9"
                    value={form.gameId ?? ''}
                    onChange={e => setForm(f => ({ ...f, gameId: e.target.value }))}
                  >
                    {gameOptions.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={form.active}
                onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                className="rounded"
              />
              Tampilkan di halaman FAQ
            </label>
          </div>
          <div className="flex gap-2 mt-5">
            <button
              onClick={handleSave}
              disabled={!form.question.trim() || !form.answer.trim()}
              className="px-5 py-2 font-medium rounded-xl text-sm disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg,#fbbf24,#f97316)', color: '#000' }}
            >
              {editingId ? 'Simpan Perubahan' : 'Tambah FAQ'}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditingId(null); }}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* ── FAQ List ── */}
      <div className="space-y-2">
        {paged.length === 0 && (
          <div className="text-center py-14 bg-gray-50 rounded-2xl text-gray-400">
            <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">
              {filterCategory ? `Tidak ada FAQ untuk kategori "${filterCategory}".` : 'Belum ada FAQ. Klik "Tambah FAQ" untuk mulai.'}
            </p>
          </div>
        )}

        {paged.map((faq, idx) => {
          const game = faq.gameId ? games.find(g => g.id === faq.gameId) : null;
          const globalIdx = (safePage - 1) * ITEMS_PER_PAGE + idx + 1;
          return (
            <div
              key={faq.id}
              className={`bg-white border rounded-xl px-4 py-3.5 flex items-start gap-3 transition-all duration-150 ${
                faq.active ? 'border-gray-200' : 'border-gray-100 opacity-55'
              }`}
            >
              {/* Number */}
              <span className="text-xs font-semibold text-gray-300 w-5 flex-shrink-0 pt-0.5 text-center">
                {globalIdx}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <CategoryBadge category={faq.category} />
                  {game && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-md font-medium text-white"
                      style={{ backgroundColor: game.color + 'cc' }}
                    >
                      {game.name}
                    </span>
                  )}
                  {!faq.active && (
                    <span className="text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-md">Tersembunyi</span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-800 mb-1 leading-snug">{faq.question}</p>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{faq.answer}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0 pt-0.5">
                <button
                  onClick={() => toggleActive(faq.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    faq.active
                      ? 'text-green-500 bg-green-50 hover:bg-green-100'
                      : 'text-gray-300 hover:text-gray-500 hover:bg-gray-100'
                  }`}
                  title={faq.active ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {faq.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleEdit(faq)}
                  className="p-1.5 rounded-lg text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
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
