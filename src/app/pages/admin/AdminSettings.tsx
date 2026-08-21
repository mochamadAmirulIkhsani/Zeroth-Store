import { useState } from 'react';
import { Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function AdminSettings() {
  const { settings, setSettings, stats, setStats } = useApp();
  const [form, setForm] = useState({ ...settings });
  const [statsForm, setStatsForm] = useState({ ...stats });
  const [saved, setSaved] = useState('');

  const showSaved = (msg: string) => {
    setSaved(msg);
    setTimeout(() => setSaved(''), 2000);
  };

  const saveSettings = () => {
    setSettings(form);
    showSaved('Pengaturan disimpan!');
  };

  const saveStats = () => {
    setStats(statsForm);
    showSaved('Statistik disimpan!');
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Pengaturan Global
        </h1>
        {saved && (
          <span className="text-green-600 text-sm font-medium bg-green-50 border border-green-100 px-3 py-1.5 rounded-lg">✓ {saved}</span>
        )}
      </div>

      {/* Hero Text */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Teks Homepage</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Hero Headline</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={form.heroHeadline}
              onChange={e => setForm(f => ({ ...f, heroHeadline: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Hero Subheadline</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
              rows={2}
              value={form.heroSubheadline}
              onChange={e => setForm(f => ({ ...f, heroSubheadline: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Banner Pengumuman (opsional)</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={form.announcement}
              onChange={e => setForm(f => ({ ...f, announcement: e.target.value }))}
              placeholder="Kosongkan jika tidak ada pengumuman"
            />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Kontak & Operasional</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nomor WhatsApp (format internasional)</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={form.whatsappNumber}
              onChange={e => setForm(f => ({ ...f, whatsappNumber: e.target.value }))}
              placeholder="Contoh: 6281234567890"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Jam Operasional</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={form.operationalHours}
              onChange={e => setForm(f => ({ ...f, operationalHours: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Pesan SLA / Waktu Respons</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={form.responseTime}
              onChange={e => setForm(f => ({ ...f, responseTime: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Teks Footer</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={form.footerText}
              onChange={e => setForm(f => ({ ...f, footerText: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Media Sosial (opsional)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Instagram (tanpa @)</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={form.socialMedia?.instagram ?? ''}
              onChange={e => setForm(f => ({ ...f, socialMedia: { ...f.socialMedia, instagram: e.target.value } }))}
              placeholder="zerothstore"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Discord</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={form.socialMedia?.discord ?? ''}
              onChange={e => setForm(f => ({ ...f, socialMedia: { ...f.socialMedia, discord: e.target.value } }))}
              placeholder="discord.gg/zerothstore"
            />
          </div>
        </div>
      </div>

      <button
        onClick={saveSettings}
        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        <Save className="w-4 h-4" />
        Simpan Pengaturan
      </button>

      {/* Stats */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Statistik Counter (Homepage)</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'ordersCompleted', label: 'Order Selesai' },
            { key: 'gamesSupported', label: 'Game Dilayani' },
            { key: 'satisfactionRate', label: 'Kepuasan (%)' },
            { key: 'activeClients', label: 'Klien Aktif' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                value={statsForm[key as keyof typeof statsForm]}
                onChange={e => setStatsForm(f => ({ ...f, [key]: Number(e.target.value) }))}
              />
            </div>
          ))}
        </div>
        <button
          onClick={saveStats}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-5 py-2.5 rounded-xl transition-colors mt-4"
        >
          <Save className="w-4 h-4" />
          Simpan Statistik
        </button>
      </div>
    </div>
  );
}
