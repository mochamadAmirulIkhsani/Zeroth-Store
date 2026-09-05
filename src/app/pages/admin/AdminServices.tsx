import { useState, useRef, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, ChevronDown, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Service, ServiceCategory } from '../../data/gameData';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

const EMPTY_SERVICE: Omit<Service, 'id'> = {
  name: '',
  description: '',
  duration: '',
  price: '',
  notes: '',
  category: 'Leveling',
  active: true,
};

const ITEMS_PER_PAGE = 5;

// ── Custom Dropdown ──────────────────────────────────────────────
interface DropdownOption {
  id: string;
  name: string;
  color: string;
  serviceCount: number;
}

function GameDropdown({
  options,
  value,
  onChange,
}: {
  options: DropdownOption[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.id === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full sm:w-72">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm transition-all hover:border-gray-300 focus:outline-none"
        style={{ boxShadow: open ? '0 0 0 3px rgba(251,191,36,0.15)' : undefined, borderColor: open ? '#fbbf24' : undefined }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {selected ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: selected.color }} />
              <span className="font-medium text-gray-800 truncate">{selected.name}</span>
              <span className="text-xs text-gray-400 flex-shrink-0">{selected.serviceCount} layanan</span>
            </>
          ) : (
            <span className="text-gray-400">Pilih game...</span>
          )}
        </div>
        <ChevronDown
          className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : undefined }}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
        >
          {options.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-4">Belum ada game</p>
          )}
          {options.map(opt => {
            const isActive = opt.id === value;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => { onChange(opt.id); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                style={{ background: isActive ? 'rgba(251,191,36,0.06)' : undefined }}
              >
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: opt.color }} />
                <span className={`flex-1 text-sm ${isActive ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                  {opt.name}
                </span>
                <span className="text-xs text-gray-400">{opt.serviceCount} layanan</span>
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
  itemsPerPage,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col items-center gap-2 pt-2">
      <p className="text-sm text-gray-400">
        Menampilkan{' '}
        <span className="font-medium text-gray-600">{start}–{end}</span>{' '}
        dari <span className="font-medium text-gray-600">{totalItems}</span> layanan
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
          const show = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
          if (!show) {
            const prevShow = page - 1 === 1 || page - 1 === totalPages || Math.abs(page - 1 - currentPage) <= 1;
            if (!prevShow) return null;
            return (
              <span key={`el-${page}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
            );
          }
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onChange(page)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all"
              style={
                isActive
                  ? { background: 'linear-gradient(135deg, #fbbf24, #f97316)', color: '#000', boxShadow: '0 2px 8px rgba(251,191,36,0.35)' }
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
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────
export function AdminServices() {
  const { games, setGames, categories, setCategories } = useApp();
  const [selectedGameId, setSelectedGameId] = useState(games[0]?.id ?? '');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Service, 'id'>>(EMPTY_SERVICE);
  const [showForm, setShowForm] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  // Kategori management modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('#6B7280');
  const [catEditing, setCatEditing] = useState<ServiceCategory | null>(null);
  const [catError, setCatError] = useState('');

  const selectedGame = games.find(g => g.id === selectedGameId);

  const dropdownOptions: DropdownOption[] = games.map(g => ({
    id: g.id,
    name: g.name,
    color: g.color,
    serviceCount: g.services.length,
  }));

  const services = selectedGame?.services ?? [];
  const totalPages = Math.max(1, Math.ceil(services.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedServices = services.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const changeGame = (id: string) => {
    setSelectedGameId(id);
    setShowForm(false);
    setCurrentPage(1);
  };

  const showSaved = (msg: string) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(''), 2500);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setForm(EMPTY_SERVICE);
    setShowForm(true);
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setForm({ ...service });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !selectedGame) return;
    if (editingId) {
      setGames(games.map(g =>
        g.id === selectedGameId
          ? { ...g, services: g.services.map(s => s.id === editingId ? { ...form, id: editingId } : s) }
          : g
      ));
      showSaved('Layanan diperbarui');
    } else {
      const newId = `${selectedGameId}-${Date.now()}`;
      setGames(games.map(g =>
        g.id === selectedGameId
          ? { ...g, services: [...g.services, { ...form, id: newId }] }
          : g
      ));
      // jump to last page
      const newCount = services.length + 1;
      setCurrentPage(Math.ceil(newCount / ITEMS_PER_PAGE));
      showSaved('Layanan ditambahkan');
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Hapus layanan ini?')) return;
    setGames(games.map(g =>
      g.id === selectedGameId
        ? { ...g, services: g.services.filter(s => s.id !== id) }
        : g
    ));
    // adjust page if needed
    const newCount = services.length - 1;
    const newTotal = Math.max(1, Math.ceil(newCount / ITEMS_PER_PAGE));
    if (currentPage > newTotal) setCurrentPage(newTotal);
    showSaved('Layanan dihapus');
  };

  const toggleActive = (id: string) => {
    setGames(games.map(g =>
      g.id === selectedGameId
        ? { ...g, services: g.services.map(s => s.id === id ? { ...s, active: !s.active } : s) }
        : g
    ));
  };

  // ── Category management ────────────────────────────────────────
  const openAddCategory = () => {
    setCatEditing(null);
    setCatName('');
    setCatColor('#6B7280');
    setCatError('');
    setShowCategoryModal(true);
  };

  const openEditCategory = (c: ServiceCategory) => {
    setCatEditing(c);
    setCatName(c.name);
    setCatColor(c.color);
    setCatError('');
    setShowCategoryModal(true);
  };

  const saveCategory = async () => {
    const name = catName.trim();
    if (!name) { setCatError('Nama kategori wajib diisi'); return; }
    setCatError('');
    const token = sessionStorage.getItem('zeroth_admin_token');
    if (!token) { setCatError('Sesi admin berakhir, login ulang'); return; }
    try {
      if (catEditing) {
        // rename/color -> slug berubah? jaga konsistensi: kirim name+color, slug lama
        const res = await fetch(`${API_BASE_URL}/api/categories/${encodeURIComponent(catEditing.id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name, color: catColor }),
        });
        if (!res.ok) { const j = await res.json().catch(() => ({})); setCatError(j.message || 'Gagal mengubah kategori'); return; }
      } else {
        const res = await fetch(`${API_BASE_URL}/api/categories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name, color: catColor }),
        });
        if (!res.ok) { const j = await res.json().catch(() => ({})); setCatError(j.message || 'Gagal menambah kategori'); return; }
      }
      // refresh categories from API
      const cats = await (await fetch('http://localhost:4000/api/categories')).json();
      setCategories(cats);
      setShowCategoryModal(false);
      showSaved(catEditing ? 'Kategori diperbarui' : 'Kategori ditambahkan');
    } catch (error) {
      console.error('Category save failed', error);
      setCatError('Gagal menyimpan kategori. Cek koneksi API.');
    }
  };

  const deleteCategory = async (c: ServiceCategory) => {
    if (!confirm(`Hapus kategori "${c.name}"? Layanan dengan kategori ini akan berubah ke "Umum".`)) return;
    const token = sessionStorage.getItem('zeroth_admin_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories/${encodeURIComponent(c.id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { const j = await res.json().catch(() => ({})); alert(j.message || 'Gagal menghapus kategori'); return; }
      const cats = await (await fetch(`${API_BASE_URL}/api/categories`)).json();
      setCategories(cats);
      showSaved('Kategori dihapus');
    } catch (error) {
      console.error('Category delete failed', error);
      alert('Gagal menghapus kategori');
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Manajemen Layanan
          </h1>
          <p className="text-gray-500 text-sm mt-1">Tambah, edit, dan kelola layanan per game</p>
        </div>
        {savedMsg && (
          <span className="text-green-600 text-sm font-medium bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
            ✓ {savedMsg}
          </span>
        )}
      </div>

      {/* ── Game Selector Dropdown ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-gray-600 flex-shrink-0">Filter Game:</span>
        <GameDropdown
          options={dropdownOptions}
          value={selectedGameId}
          onChange={changeGame}
        />
        {selectedGame && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: `${selectedGame.color}18`, color: selectedGame.color, border: `1px solid ${selectedGame.color}40` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedGame.color }} />
            {selectedGame.services.filter(s => s.active).length} aktif · {selectedGame.services.filter(s => !s.active).length} nonaktif
          </div>
        )}
      </div>

      {selectedGame && (
        <>
          {/* ── Sub-header ── */}
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-700">
              {selectedGame.name}
              <span className="ml-2 text-gray-400 font-normal">— {services.length} layanan</span>
            </h2>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f97316)',
                color: '#000',
                fontFamily: 'Space Grotesk, sans-serif',
                boxShadow: '0 4px 12px rgba(251,191,36,0.25)',
              }}
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Tambah Layanan
            </button>
          </div>

          {/* ── Add / Edit Form ── */}
          {showForm && (
            <div className="bg-white border-2 border-amber-200 rounded-2xl p-6" style={{ boxShadow: '0 4px 24px rgba(251,191,36,0.08)' }}>
              <h3 className="font-semibold text-gray-900 mb-4">
                {editingId ? 'Edit Layanan' : 'Tambah Layanan Baru'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nama Layanan *</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Contoh: Push Rank Diamond ke Master"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Deskripsi *</label>
                  <textarea
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
                    rows={3}
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Jelaskan detail layanan ini..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Estimasi Durasi *</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    value={form.duration}
                    onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                    placeholder="Contoh: 1–3 hari"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Harga Estimasi *</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="Contoh: Mulai Rp 50.000 atau Nego"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Kategori</label>
                  <div className="relative">
                    <select
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white appearance-none pr-9"
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    >
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <button
                    type="button"
                    onClick={openAddCategory}
                    className="mt-1.5 text-xs text-amber-600 hover:text-amber-700 font-medium"
                  >
                    + Kelola Kategori
                  </button>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Catatan / Syarat (opsional)</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    value={form.notes ?? ''}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Contoh: Material tidak termasuk"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active-check"
                    checked={form.active}
                    onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="active-check" className="text-sm text-gray-600">Tampilkan di website</label>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleSave}
                  disabled={!form.name.trim()}
                  className="px-5 py-2.5 disabled:opacity-50 font-medium rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24, #f97316)',
                    color: '#000',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                >
                  {editingId ? 'Simpan Perubahan' : 'Tambah Layanan'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {/* ── Services List (paged) ── */}
          <div className="space-y-3">
            {services.length === 0 && (
              <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl">
                <p className="text-sm">Belum ada layanan. Klik "Tambah Layanan" untuk mulai.</p>
              </div>
            )}
            {pagedServices.map(service => (
              <div
                key={service.id}
                className={`bg-white border rounded-xl p-4 transition-all duration-200 ${
                  service.active ? 'border-gray-200' : 'border-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Color stripe */}
                  <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: selectedGame.color, opacity: service.active ? 1 : 0.3 }} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h4 className="font-medium text-gray-900 text-sm">{service.name}</h4>
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-md">
                        {service.category}
                      </span>
                      {!service.active && (
                        <span className="text-xs px-1.5 py-0.5 bg-red-50 text-red-400 rounded-md">Nonaktif</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs line-clamp-1">{service.description}</p>
                    <div className="flex items-center gap-4 mt-1.5">
                      <span className="text-xs text-gray-400">⏱ {service.duration}</span>
                      <span className="text-xs font-medium text-gray-700">{service.price}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => toggleActive(service.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        service.active ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                      }`}
                      title={service.active ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      {service.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-1.5 rounded-lg text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-1.5 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Pagination ── */}
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={services.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onChange={setCurrentPage}
          />
        </>
      )}

      {/* ── Kelola Kategori Modal ── */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {catEditing ? 'Edit Kategori' : 'Tambah Kategori'}
            </h3>

            <label className="block text-xs font-medium text-gray-600 mb-1">Nama Kategori *</label>
            <input
              value={catName}
              onChange={e => setCatName(e.target.value)}
              placeholder="Contoh: Premium"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 mb-3"
            />

            <label className="block text-xs font-medium text-gray-600 mb-1">Warna</label>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="color"
                value={catColor}
                onChange={e => setCatColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
              />
              <span className="text-sm text-gray-500">{catColor}</span>
            </div>

            {catError && <p className="text-xs text-red-500 mb-3">{catError}</p>}

            <div className="flex flex-wrap gap-2 mb-4 max-h-40 overflow-y-auto">
              {categories.map(c => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border border-gray-200 bg-gray-50"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                  <button
                    type="button"
                    onClick={() => openEditCategory(c)}
                    className="text-amber-600 hover:text-amber-800"
                    title="Edit"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCategory(c)}
                    className="text-red-400 hover:text-red-600"
                    title="Hapus"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveCategory}
                className="flex-1 px-4 py-2.5 font-medium rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #fbbf24, #f97316)', color: '#000' }}
              >
                {catEditing ? 'Simpan Perubahan' : 'Tambah Kategori'}
              </button>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}