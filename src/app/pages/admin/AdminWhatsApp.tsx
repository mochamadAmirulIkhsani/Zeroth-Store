import { useEffect, useState } from 'react';
import { MessageCircle, Save, ExternalLink, Copy, Check, RotateCcw, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_WA_TEMPLATE, applyWaTemplate } from '../../data/gameData';

const VARIABLES = [
  { key: '{gameName}', desc: 'Nama game' },
  { key: '{serviceName}', desc: 'Nama layanan yang dipesan' },
  { key: '{price}', desc: 'Harga layanan' },
  { key: '{duration}', desc: 'Estimasi durasi' },
];

export function AdminWhatsApp() {
  const { settings, setSettings, games, setGames } = useApp();

  // WA number state
  const [number, setNumber] = useState(settings.whatsappNumber);
  const [numberSaved, setNumberSaved] = useState(false);

  // Per-game template state: gameId → draft template text
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(games.map(g => [g.id, g.waTemplate ?? DEFAULT_WA_TEMPLATE]))
  );
  const [savedGames, setSavedGames] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState('');
  const [activeGame, setActiveGame] = useState(games[0]?.id ?? '');

  useEffect(() => {
    setNumber(settings.whatsappNumber);
  }, [settings.whatsappNumber]);

  useEffect(() => {
    setDrafts((prev) => {
      const next: Record<string, string> = {};
      for (const game of games) {
        next[game.id] = prev[game.id] ?? game.waTemplate ?? DEFAULT_WA_TEMPLATE;
      }
      return next;
    });

    if (!activeGame || !games.some((game) => game.id === activeGame)) {
      setActiveGame(games[0]?.id ?? '');
    }
  }, [games, activeGame]);

  const handleSaveNumber = () => {
    setSettings({ ...settings, whatsappNumber: number });
    setNumberSaved(true);
    setTimeout(() => setNumberSaved(false), 2000);
  };

  const handleSaveTemplate = (gameId: string) => {
    setGames(games.map(g => g.id === gameId ? { ...g, waTemplate: drafts[gameId] } : g));
    setSavedGames(prev => ({ ...prev, [gameId]: true }));
    setTimeout(() => setSavedGames(prev => ({ ...prev, [gameId]: false })), 2000);
  };

  const handleReset = (gameId: string) => {
    setDrafts(prev => ({ ...prev, [gameId]: DEFAULT_WA_TEMPLATE }));
  };

  const handleInsertVar = (gameId: string, variable: string) => {
    setDrafts(prev => ({ ...prev, [gameId]: (prev[gameId] ?? '') + variable }));
  };

  const copyLink = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const getPreview = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return '';
    return applyWaTemplate(drafts[gameId] ?? DEFAULT_WA_TEMPLATE, {
      gameName: game.name,
      serviceName: 'Nama Layanan Contoh',
      price: 'Mulai Rp 50.000',
      duration: '1–3 hari',
    });
  };

  const getTestLink = (gameId: string) => {
    const preview = getPreview(gameId);
    return `https://wa.me/${number || settings.whatsappNumber}?text=${encodeURIComponent(preview)}`;
  };

  const globalTestLink = `https://wa.me/${number}?text=${encodeURIComponent('Halo Admin! Saya ingin tanya tentang layanan Zeroth Store.')}`;

  const currentGame = games.find(g => g.id === activeGame);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Pengaturan WhatsApp
        </h1>
        <p className="text-gray-500 text-sm mt-1">Kelola nomor WhatsApp dan template pesan per game</p>
      </div>

      {/* WA Number */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <MessageCircle className="w-5 h-5 text-green-600" strokeWidth={1.5} />
          <h2 className="font-semibold text-gray-900">Nomor WhatsApp Aktif</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Nomor (format internasional, tanpa + atau spasi)
            </label>
            <div className="flex gap-3">
              <input
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                value={number}
                onChange={e => setNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Contoh: 6281234567890"
              />
              <button
                onClick={handleSaveNumber}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  numberSaved ? 'bg-green-500 text-white' : 'bg-amber-500 hover:bg-amber-600 text-black'
                }`}
              >
                {numberSaved ? <><Check className="w-4 h-4" /> Tersimpan</> : <><Save className="w-4 h-4" /> Simpan</>}
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-1.5">Contoh: 628123456789 (Indonesia 08123456789)</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-2">
            <code className="flex-1 text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap">
              {globalTestLink}
            </code>
            <button onClick={() => copyLink(globalTestLink, 'global')}
              className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-lg transition-colors flex-shrink-0">
              {copied === 'global' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <a href={globalTestLink} target="_blank" rel="noopener noreferrer"
              className="p-2 text-green-600 bg-green-50 border border-green-200 rounded-lg transition-colors flex-shrink-0">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Variables Reference */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 mb-2">Variabel yang tersedia di template:</p>
            <div className="flex flex-wrap gap-2">
              {VARIABLES.map(v => (
                <span key={v.key} className="inline-flex items-center gap-1.5 text-xs bg-white border border-amber-200 text-amber-700 px-2.5 py-1 rounded-lg">
                  <code className="font-mono">{v.key}</code>
                  <span className="text-amber-500">→</span>
                  <span>{v.desc}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Per-game templates */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Template Pesan per Game</h2>
          <p className="text-gray-500 text-xs mt-0.5">Kustomisasi pesan WhatsApp yang dikirim otomatis saat klien menekan tombol order</p>
        </div>

        <div className="flex divide-x divide-gray-100 min-h-[480px]">
          {/* Game list sidebar */}
          <div className="w-48 flex-shrink-0 py-2">
            {games.map(g => (
              <button
                key={g.id}
                onClick={() => setActiveGame(g.id)}
                className={`w-full text-left px-4 py-3 text-sm flex items-center gap-2.5 transition-colors ${
                  activeGame === g.id ? 'bg-amber-50 text-amber-700 font-medium border-r-2 border-amber-400' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }} />
                <span className="truncate">{g.name}</span>
                {/* Indicator if customized */}
                {g.waTemplate && g.waTemplate !== DEFAULT_WA_TEMPLATE && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Editor area */}
          {currentGame && (
            <div className="flex-1 p-6 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentGame.color }} />
                <h3 className="font-semibold text-gray-900">{currentGame.name}</h3>
                {currentGame.waTemplate && currentGame.waTemplate !== DEFAULT_WA_TEMPLATE && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Dikustomisasi</span>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1">
                {/* Editor */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-600">Template Pesan</label>
                    <button
                      onClick={() => handleReset(currentGame.id)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset ke default
                    </button>
                  </div>
                  <textarea
                    className="flex-1 min-h-[220px] border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
                    value={drafts[currentGame.id] ?? DEFAULT_WA_TEMPLATE}
                    onChange={e => setDrafts(prev => ({ ...prev, [currentGame.id]: e.target.value }))}
                    placeholder="Tulis template pesan..."
                  />
                  {/* Variable quick-insert */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs text-gray-400">Sisipkan:</span>
                    {VARIABLES.map(v => (
                      <button
                        key={v.key}
                        onClick={() => handleInsertVar(currentGame.id, v.key)}
                        className="text-xs font-mono bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-0.5 rounded transition-colors"
                      >
                        {v.key}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-gray-600">Preview Pesan</p>
                  <div className="flex-1 min-h-[220px] bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">
                      {getPreview(currentGame.id)}
                    </pre>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyLink(getTestLink(currentGame.id), currentGame.id)}
                      className="flex items-center gap-1.5 text-xs px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                    >
                      {copied === currentGame.id ? <><Check className="w-3.5 h-3.5 text-green-500" /> Disalin</> : <><Copy className="w-3.5 h-3.5" /> Salin Link</>}
                    </button>
                    <a
                      href={getTestLink(currentGame.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Test di WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Save button */}
              <div className="flex justify-end pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleSaveTemplate(currentGame.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    savedGames[currentGame.id]
                      ? 'bg-green-500 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-black'
                  }`}
                >
                  {savedGames[currentGame.id]
                    ? <><Check className="w-4 h-4" /> Template Tersimpan</>
                    : <><Save className="w-4 h-4" /> Simpan Template</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
