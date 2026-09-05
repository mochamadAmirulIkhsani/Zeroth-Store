import { useState } from 'react';
import { Link } from 'react-router';
import { Wrench, Eye, EyeOff, ArrowRight, Plus, X, Trash2, ImageIcon, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Game } from '../../data/gameData';

const DEFAULT_COLORS = [
  '#fbbf24', '#f97316', '#ef4444', '#ec4899',
  '#a78bfa', '#60a5fa', '#34d399', '#2dd4bf',
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

interface AddGameForm {
  name: string;
  tagline: string;
  description: string;
  color: string;
  image: string;
}

const EMPTY_FORM: AddGameForm = {
  name: '',
  tagline: '',
  description: '',
  color: '#fbbf24',
  image: '',
};

const ITEMS_PER_PAGE = 5;

export function AdminGames() {
  const { games, setGames } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Game>>({});
  const [editImageError, setEditImageError] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<AddGameForm>(EMPTY_FORM);
  const [addErrors, setAddErrors] = useState<Partial<AddGameForm>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(games.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedGames = games.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  // ── toggle active/inactive ──
  const toggleStatus = (id: string) => {
    setGames(games.map(g => g.id === id
      ? { ...g, status: g.status === 'active' ? 'inactive' : 'active' }
      : g
    ));
  };

  // ── edit existing game ──
  const startEdit = (game: Game) => {
    setEditingId(game.id);
    setEditImageError(false);
    setEditForm({ name: game.name, description: game.description, tagline: game.tagline, color: game.color, image: game.image });
  };

  const saveEdit = async (id: string) => {
    const ok = await setGames(games.map(g => g.id === id ? { ...g, ...editForm } : g));
    setEditingId(null);
    setSaved(ok ? id : `GAGAL: ${id}`);
    setTimeout(() => setSaved(null), 3000);
  };

  // ── delete game ──
  const deleteGame = async (id: string) => {
    setDeleteConfirmId(null);
    const ok = await setGames(games.filter(g => g.id !== id));
    // adjust page if last item on page was deleted
    const newTotal = games.length - 1;
    const newTotalPages = Math.max(1, Math.ceil(newTotal / ITEMS_PER_PAGE));
    if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
    setSaved(ok ? `Deleted ${id}` : `GAGAL hapus: ${id}`);
    setTimeout(() => setSaved(null), 3000);
  };

  // ── validate & add new game ──
  const validateAddForm = () => {
    const errs: Partial<AddGameForm> = {};
    if (!addForm.name.trim()) errs.name = 'Nama game wajib diisi';
    if (!addForm.tagline.trim()) errs.tagline = 'Tagline wajib diisi';
    if (!addForm.description.trim()) errs.description = 'Deskripsi wajib diisi';
    if (!addForm.image.trim()) errs.image = 'URL gambar wajib diisi';
    setAddErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddGame = async () => {
    if (!validateAddForm()) return;

    const slug = slugify(addForm.name);
    const newGame: Game = {
      id: `game-${Date.now()}`,
      name: addForm.name.trim(),
      slug: slug || `game-${Date.now()}`,
      description: addForm.description.trim(),
      tagline: addForm.tagline.trim(),
      color: addForm.color,
      accentColor: addForm.color,
      image: addForm.image.trim(),
      status: 'active',
      services: [],
      howItWorks: [
        { icon: 'MessageCircle', title: 'Hubungi Kami', description: 'Chat via WhatsApp dan pilih layanan yang diinginkan.' },
        { icon: 'CreditCard', title: 'Pembayaran', description: 'Lakukan pembayaran sesuai layanan yang dipilih.' },
        { icon: 'Zap', title: 'Proses Joki', description: 'Tim kami mulai mengerjakan pesanan Anda.' },
        { icon: 'Trophy', title: 'Selesai', description: 'Akun dikembalikan dan hasil dijamin memuaskan.' },
      ],
      securityNotes: [
        'Jangan bagikan data sensitif selain yang dibutuhkan untuk layanan.',
        'Kami tidak menyimpan data login setelah joki selesai.',
        'Keamanan akun Anda adalah prioritas utama kami.',
      ],
    };

    const ok = await setGames([...games, newGame]);
    // jump to last page to see the newly added game
    setCurrentPage(Math.ceil((games.length + 1) / ITEMS_PER_PAGE));
    setShowAddModal(false);
    setAddForm(EMPTY_FORM);
    setAddErrors({});
    setImagePreviewError(false);
    if (!ok) {
      alert('GAGAL menyimpan game baru — cek console (F12) untuk detail. Perubahan hanya lokal, tidak masuk database.');
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setAddForm(EMPTY_FORM);
    setAddErrors({});
    setImagePreviewError(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Manajemen Game
          </h1>
          <p className="text-gray-500 text-sm mt-1">Kelola game yang tampil di website</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #fbbf24, #f97316)',
            color: '#000',
            fontFamily: 'Space Grotesk, sans-serif',
            boxShadow: '0 4px 16px rgba(251,191,36,0.3)',
          }}
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Tambah Game
        </button>
      </div>

      {/* Game list */}
      <div className="space-y-4">
        {games.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">Belum ada game. Tambahkan game baru!</p>
          </div>
        )}
        {pagedGames.map(game => (
          <div key={game.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-start gap-4 p-5">
              {/* Thumb — shows live preview when editing */}
              <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={editingId === game.id ? (editForm.image || game.image) : game.image}
                  alt={game.name}
                  className="w-full h-full object-cover"
                  onError={e => { (e.currentTarget as HTMLImageElement).src = game.image; }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: editingId === game.id ? (editForm.color ?? game.color) : game.color }}
                />
              </div>

              <div className="flex-1 min-w-0">
                {editingId === game.id ? (
                  <div className="space-y-2">
                    {/* Image URL field with live preview */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">URL Gambar</label>
                      <div className="relative">
                        <ImageIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        <input
                          type="url"
                          className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                          value={editForm.image ?? ''}
                          onChange={e => {
                            setEditImageError(false);
                            setEditForm(f => ({ ...f, image: e.target.value }));
                          }}
                          placeholder="Tempel URL gambar cover…"
                        />
                      </div>
                      {editImageError && <p className="text-red-400 text-xs">URL gambar tidak valid</p>}
                    </div>
                    <input
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                      value={editForm.name ?? ''}
                      onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Nama game"
                    />
                    <input
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                      value={editForm.tagline ?? ''}
                      onChange={e => setEditForm(f => ({ ...f, tagline: e.target.value }))}
                      placeholder="Tagline"
                    />
                    <textarea
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
                      rows={2}
                      value={editForm.description ?? ''}
                      onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Deskripsi"
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500">Warna:</label>
                      <input
                        type="color"
                        value={editForm.color ?? game.color}
                        onChange={e => setEditForm(f => ({ ...f, color: e.target.value }))}
                        className="w-8 h-7 rounded cursor-pointer border-0"
                      />
                      <span className="text-xs font-mono text-gray-400">{editForm.color ?? game.color}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-gray-900 truncate">{game.name}</h3>
                      {saved === game.id && (
                        <span className="text-green-500 text-xs flex items-center gap-1">
                          <Check className="w-3 h-3" /> Tersimpan
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm truncate">{game.tagline}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          game.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {game.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {game.services.filter(s => s.active).length} layanan aktif
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {editingId === game.id ? (
                  <>
                    <button
                      onClick={() => saveEdit(game.id)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-xs rounded-lg font-medium transition-colors"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded-lg transition-colors"
                    >
                      Batal
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => toggleStatus(game.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        game.status === 'active'
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title={game.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      {game.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => startEdit(game)}
                      className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                      title="Edit"
                    >
                      <Wrench className="w-4 h-4" />
                    </button>
                    <Link
                      to="/admin/services"
                      className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                      title="Kelola Layanan"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    {deleteConfirmId === game.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => deleteGame(game.id)}
                          className="px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg font-medium transition-colors"
                        >
                          Hapus
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded-lg transition-colors"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(game.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                        title="Hapus Game"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── PAGINATION ── */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-2 pt-2">
          <p className="text-sm text-gray-400">
            Menampilkan{' '}
            <span className="font-medium text-gray-600">
              {(safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, games.length)}
            </span>{' '}
            dari <span className="font-medium text-gray-600">{games.length}</span> game
          </p>

          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
              const isActive = page === safePage;
              // Show first, last, current ±1, and ellipsis
              const show =
                page === 1 ||
                page === totalPages ||
                Math.abs(page - safePage) <= 1;
              if (!show) {
                // show ellipsis only once between gaps
                const prevShow =
                  page - 1 === 1 ||
                  page - 1 === totalPages ||
                  Math.abs(page - 1 - safePage) <= 1;
                if (!prevShow) return null;
                return (
                  <span key={`ellipsis-${page}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">
                    …
                  </span>
                );
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all"
                  style={
                    isActive
                      ? {
                          background: 'linear-gradient(135deg, #fbbf24, #f97316)',
                          color: '#000',
                          boxShadow: '0 2px 8px rgba(251,191,36,0.35)',
                        }
                      : {
                          background: '#fff',
                          border: '1px solid #e5e7eb',
                          color: '#6b7280',
                        }
                  }
                >
                  {page}
                </button>
              );
            })}

            {/* Next */}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── ADD GAME MODAL ── */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            style={{ animation: 'slideUp 0.3s ease-out' }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-900 text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Tambah Game Baru
                </h2>
                <p className="text-gray-500 text-xs mt-0.5">Isi detail game yang ingin ditambahkan</p>
              </div>
              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-5">

              {/* Image URL + Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  URL Gambar Cover <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="url"
                      className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all ${
                        addErrors.image ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      value={addForm.image}
                      onChange={e => {
                        setAddForm(f => ({ ...f, image: e.target.value }));
                        setImagePreviewError(false);
                        if (addErrors.image) setAddErrors(err => ({ ...err, image: undefined }));
                      }}
                      placeholder="Tempel URL gambar cover…"
                    />
                    {addErrors.image && <p className="text-red-500 text-xs mt-1">{addErrors.image}</p>}
                  </div>
                  {/* Image preview thumbnail */}
                  <div
                    className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 flex items-center justify-center bg-gray-50"
                  >
                    {addForm.image && !imagePreviewError ? (
                      <img
                        src={addForm.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => setImagePreviewError(true)}
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-1">Gunakan link gambar dari internet (misal dari Unsplash, Google, dll.)</p>
              </div>

              {/* Game name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nama Game <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all ${
                    addErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  value={addForm.name}
                  onChange={e => {
                    setAddForm(f => ({ ...f, name: e.target.value }));
                    if (addErrors.name) setAddErrors(err => ({ ...err, name: undefined }));
                  }}
                  placeholder="Contoh: Mobile Legends, PUBG, Valorant"
                />
                {addErrors.name && <p className="text-red-500 text-xs mt-1">{addErrors.name}</p>}
                {addForm.name && (
                  <p className="text-gray-400 text-xs mt-1">
                    Slug: <span className="font-mono text-gray-500">{slugify(addForm.name) || '...'}</span>
                  </p>
                )}
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tagline <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all ${
                    addErrors.tagline ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  value={addForm.tagline}
                  onChange={e => {
                    setAddForm(f => ({ ...f, tagline: e.target.value }));
                    if (addErrors.tagline) setAddErrors(err => ({ ...err, tagline: undefined }));
                  }}
                  placeholder="Contoh: Joki rank tercepat & terpercaya"
                />
                {addErrors.tagline && <p className="text-red-500 text-xs mt-1">{addErrors.tagline}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Deskripsi <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all resize-none ${
                    addErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  value={addForm.description}
                  onChange={e => {
                    setAddForm(f => ({ ...f, description: e.target.value }));
                    if (addErrors.description) setAddErrors(err => ({ ...err, description: undefined }));
                  }}
                  placeholder="Deskripsi singkat tentang layanan joki game ini..."
                />
                {addErrors.description && <p className="text-red-500 text-xs mt-1">{addErrors.description}</p>}
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warna Aksen
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {DEFAULT_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setAddForm(f => ({ ...f, color: c }))}
                      className="w-8 h-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                      style={{
                        backgroundColor: c,
                        boxShadow: addForm.color === c ? `0 0 0 3px white, 0 0 0 5px ${c}` : 'none',
                        transform: addForm.color === c ? 'scale(1.15)' : undefined,
                      }}
                    >
                      {addForm.color === c && <Check className="w-4 h-4 text-white drop-shadow" strokeWidth={3} />}
                    </button>
                  ))}
                  {/* Custom color */}
                  <label className="cursor-pointer">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors overflow-hidden relative"
                      title="Warna kustom"
                    >
                      <span className="text-gray-400 text-xs font-bold leading-none">+</span>
                      <input
                        type="color"
                        value={addForm.color}
                        onChange={e => setAddForm(f => ({ ...f, color: e.target.value }))}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>
                  </label>
                  {/* Current color preview */}
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50"
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: addForm.color }} />
                    <span className="text-xs font-mono text-gray-500">{addForm.color}</span>
                  </div>
                </div>
              </div>

              {/* Info note */}
              <div className="rounded-xl p-3.5 flex gap-3" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-[9px] font-black leading-none">i</span>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Setelah game ditambahkan, buka menu <strong>Layanan</strong> untuk menambahkan layanan joki pada game ini.
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAddGame}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f97316)',
                  color: '#000',
                  fontFamily: 'Space Grotesk, sans-serif',
                  boxShadow: '0 4px 16px rgba(251,191,36,0.3)',
                }}
              >
                Tambah Game
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}