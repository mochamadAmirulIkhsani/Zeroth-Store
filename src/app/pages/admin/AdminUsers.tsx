import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, KeyRound, UserPlus, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'OWNER';
  createdAt: string;
}

// ── Shared styles ──────────────────────────────────────────────
const inputCls =
  'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300';
const labelCls = 'block text-xs font-medium text-gray-600 mb-1';
const cardCls = 'bg-white border border-gray-200 rounded-2xl p-6';
const btnPrimary =
  'flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

function getToken(): string | null {
  return sessionStorage.getItem('zeroth_admin_token');
}

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers: authHeaders() });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || `Request gagal (${res.status})`);
  return body as T;
}

const roleBadge = (role: string) =>
  role === 'OWNER'
    ? 'bg-purple-100 text-purple-700'
    : 'bg-blue-100 text-blue-700';

// ── Change password card ───────────────────────────────────────
function ChangePasswordCard() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async () => {
    setMsg(null);
    if (next.length < 8) return setMsg({ ok: false, text: 'Password baru minimal 8 karakter' });
    if (next !== confirm) return setMsg({ ok: false, text: 'Konfirmasi password tidak cocok' });
    setLoading(true);
    try {
      const r = await api<{ message: string }>('/api/admin/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      setMsg({ ok: true, text: r.message });
      setCurrent(''); setNext(''); setConfirm('');
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Gagal mengubah password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cardCls}>
      <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
        <KeyRound className="w-4 h-4" /> Ganti Password Saya
      </h2>
      <p className="text-gray-500 text-xs mb-4">Ubah password akun admin yang sedang login.</p>
      <div className="space-y-4 max-w-md">
        <div>
          <label className={labelCls}>Password Lama</label>
          <input type="password" className={inputCls} value={current} onChange={e => setCurrent(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Password Baru (min 8 karakter)</label>
          <input type="password" className={inputCls} value={next} onChange={e => setNext(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Konfirmasi Password Baru</label>
          <input type="password" className={inputCls} value={confirm} onChange={e => setConfirm(e.target.value)} />
        </div>
        {msg && (
          <p className={`text-sm font-medium ${msg.ok ? 'text-green-600' : 'text-red-500'}`}>{msg.text}</p>
        )}
        <button onClick={submit} disabled={loading} className={btnPrimary}>
          <Save className="w-4 h-4" /> {loading ? 'Menyimpan…' : 'Simpan Password'}
        </button>
      </div>
    </div>
  );
}

// ── User management (OWNER only) ───────────────────────────────
function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // form state
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'OWNER'>('ADMIN');
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      const data = await api<AdminUser[]>('/api/admin/users');
      setUsers(data);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const flash = (ok: boolean, text: string) => {
    setMsg({ ok, text });
    setTimeout(() => setMsg(null), 2500);
  };

  const create = async () => {
    setMsg(null);
    if (!name.trim() || !email.trim() || !password) return flash(false, 'Semua field wajib diisi');
    if (password.length < 8) return flash(false, 'Password minimal 8 karakter');
    setCreating(true);
    try {
      await api('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });
      flash(true, `User ${email} ditambahkan`);
      setName(''); setEmail(''); setPassword(''); setRole('ADMIN'); setShowForm(false);
      await load();
    } catch (e) {
      flash(false, e instanceof Error ? e.message : 'Gagal menambah user');
    } finally {
      setCreating(false);
    }
  };

  const remove = async (u: AdminUser) => {
    if (!window.confirm(`Hapus user "${u.name}" (${u.email})?`)) return;
    try {
      await api(`/api/admin/users/${u.id}`, { method: 'DELETE' });
      flash(true, `User ${u.email} dihapus`);
      await load();
    } catch (e) {
      flash(false, e instanceof Error ? e.message : 'Gagal menghapus user');
    }
  };

  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4" /> Manajemen User Admin
          </h2>
          <p className="text-gray-500 text-xs mt-0.5">Hanya OWNER yang dapat menambah/menghapus user.</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Tambah User
        </button>
      </div>

      {msg && <p className={`text-sm font-medium mb-3 ${msg.ok ? 'text-green-600' : 'text-red-500'}`}>{msg.text}</p>}
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {showForm && (
        <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-4 mb-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Nama</label>
              <input className={inputCls} value={name} onChange={e => setName(e.target.value)} placeholder="Nama admin" />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" className={inputCls} value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@zeroth.store" />
            </div>
            <div>
              <label className={labelCls}>Password (min 8)</label>
              <input type="password" className={inputCls} value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Role</label>
              <select className={inputCls} value={role} onChange={e => setRole(e.target.value as 'ADMIN' | 'OWNER')}>
                <option value="ADMIN">ADMIN</option>
                <option value="OWNER">OWNER</option>
              </select>
            </div>
          </div>
          <button onClick={create} disabled={creating} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50">
            <UserPlus className="w-4 h-4" /> {creating ? 'Menyimpan…' : 'Buat User'}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">Memuat user…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wide border-b border-gray-100">
                <th className="pb-2 pr-4 font-medium">Nama</th>
                <th className="pb-2 pr-4 font-medium">Email</th>
                <th className="pb-2 pr-4 font-medium">Role</th>
                <th className="pb-2 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 pr-4 text-gray-900 font-medium">{u.name}</td>
                  <td className="py-3 pr-4 text-gray-600">{u.email}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadge(u.role)}`}>{u.role}</span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => remove(u)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      title="Hapus user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={4} className="py-4 text-center text-gray-400 text-sm">Belum ada user</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function AdminUsers() {
  const { adminRole } = useApp();
  const isOwner = adminRole === 'OWNER';

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          User Admin
        </h1>
        {adminRole && (
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleBadge(adminRole)}`}>{adminRole}</span>
        )}
      </div>
      <ChangePasswordCard />
      {isOwner ? (
        <UserManagement />
      ) : (
        <div className={cardCls}>
          <p className="text-gray-500 text-sm">Hanya user dengan role <strong>OWNER</strong> yang dapat mengelola user admin.</p>
        </div>
      )}
    </div>
  );
}