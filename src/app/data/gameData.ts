export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  notes?: string;
  category: string;
  active: boolean;
  waTemplate?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  gameId?: string;
  active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  gameId: string;
  service: string;
  rating: number;
  content: string;
  date: string;
  featured: boolean;
  active: boolean;
  avatar?: string;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  description: string;
  tagline: string;
  color: string;
  accentColor: string;
  image: string;
  status: 'active' | 'inactive';
  services: Service[];
  waTemplate?: string;
  howItWorks?: { icon: string; title: string; description: string }[];
  securityNotes?: string[];
  faqs?: FAQ[];
}

export const WHATSAPP_NUMBER = '6281234567890';

export const DEFAULT_WA_TEMPLATE =
  `Halo Admin! Saya tertarik dengan layanan joki {gameName}.\n\nLayanan yang diinginkan: {serviceName}\nDetail tambahan: \n\nMohon info lebih lanjut, terima kasih!`;

// Replace {gameName}, {serviceName}, {price}, {duration} in a template string
export function applyWaTemplate(
  template: string,
  vars: { gameName?: string; serviceName?: string; price?: string; duration?: string }
): string {
  return template
    .replace(/\{gameName\}/g, vars.gameName ?? '')
    .replace(/\{serviceName\}/g, vars.serviceName ?? '')
    .replace(/\{price\}/g, vars.price ?? '')
    .replace(/\{duration\}/g, vars.duration ?? '');
}

export const getWALink = (
  gameName: string,
  serviceName: string,
  number = WHATSAPP_NUMBER,
  template = DEFAULT_WA_TEMPLATE,
  price = '',
  duration = ''
) =>
  `https://wa.me/${number}?text=${encodeURIComponent(
    applyWaTemplate(template, { gameName, serviceName, price, duration })
  )}`;

export const HOW_IT_WORKS_DEFAULT = [
  { icon: '💬', title: 'Hubungi WhatsApp', description: 'Klik tombol Order dan buka chat WhatsApp kami' },
  { icon: '🤝', title: 'Diskusi & Deal', description: 'Kami akan mendiskusikan detail layanan dan negosiasi harga' },
  { icon: '🔑', title: 'Berikan Akses', description: 'Berikan akses akun dengan aman sesuai instruksi kami' },
  { icon: '⚡', title: 'Proses Joki', description: 'Tim profesional kami mengerjakan pesanan Anda' },
  { icon: '✅', title: 'Selesai & Laporan', description: 'Laporan lengkap dikirimkan, akun dikembalikan sepenuhnya' },
];

export const SECURITY_NOTES_DEFAULT = [
  'Akun Anda dijamin aman dan tidak akan diperjualbelikan',
  'Kami tidak menyimpan data login Anda setelah joki selesai',
  'Proses dilakukan dengan hati-hati sesuai aturan game',
  'Garansi pengerjaan ulang jika ada kesalahan dari tim kami',
  'Privasi klien dijaga penuh — tidak ada data yang dibocorkan',
];

export const INITIAL_GAMES: Game[] = [
  {
    id: 'genshin-impact',
    name: 'Genshin Impact',
    slug: 'genshin-impact',
    description: 'Open-world action RPG miHoYo dengan dunia Teyvat yang luas. Kami siap membantu farming, quest, dan progression akun Anda.',
    tagline: 'Jelajahi Teyvat Tanpa Batas',
    color: '#4A90D9',
    accentColor: '#E8B84B',
    image: 'https://images.unsplash.com/photo-1768327239603-f5354182ba22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    status: 'active',
    howItWorks: HOW_IT_WORKS_DEFAULT,
    securityNotes: SECURITY_NOTES_DEFAULT,
    services: [
      { id: 'gi-1', name: 'Adventure Rank (AR) Leveling', description: 'Naik AR dari level berapa saja hingga AR 60. Cocok untuk pemain baru yang ingin cepat unlock konten endgame.', duration: '3–7 hari', price: 'Mulai Rp 50.000', category: 'Leveling', active: true },
      { id: 'gi-2', name: 'Spiral Abyss — Full Clear', description: 'Clear Floor 9/10/11/12 dengan bintang penuh. Dapatkan primogem reward maksimal setiap bulannya.', duration: '1–2 hari', price: 'Mulai Rp 80.000', category: 'Endgame', active: true },
      { id: 'gi-3', name: 'World Quest Completion', description: 'Menyelesaikan quest utama, archon quest, dan side quest per region (Mondstadt, Liyue, Inazuma, dst).', duration: '2–5 hari', price: 'Mulai Rp 60.000', notes: 'Harga tergantung jumlah quest yang diselesaikan', category: 'Story', active: true },
      { id: 'gi-4', name: 'Domain Farming', description: 'Farm artifact terbaik dengan set yang diinginkan. Farming material ascension karakter dan weapon.', duration: '1–3 hari', price: 'Mulai Rp 40.000', category: 'Farming', active: true },
      { id: 'gi-5', name: 'Event Completion', description: 'Selesaikan event limited time dan klaim semua reward eksklusif sebelum event berakhir.', duration: '1–2 hari', price: 'Mulai Rp 35.000', category: 'Event', active: true },
      { id: 'gi-6', name: 'Character Building', description: 'Level up, ascend, upgrade skill, dan optimasi artifact set untuk karakter pilihan Anda.', duration: '2–4 hari', price: 'Mulai Rp 70.000', notes: 'Harga per karakter, material tidak termasuk', category: 'Build', active: true },
      { id: 'gi-7', name: 'Resin Management Harian', description: 'Kelola resin harian secara optimal untuk farming artifact, boss, dan material ascension.', duration: 'Per hari', price: 'Mulai Rp 25.000', category: 'Daily', active: true },
      { id: 'gi-8', name: 'Exploration & Collectibles', description: 'Unlock semua waypoint, cari chest tersembunyi, dan kumpulkan collectible per region.', duration: '2–5 hari', price: 'Mulai Rp 45.000', category: 'Exploration', active: true },
    ],
  },
  {
    id: 'honkai-star-rail',
    name: 'Honkai: Star Rail',
    slug: 'honkai-star-rail',
    description: 'Turn-based space fantasy RPG dari HoYoverse. Jelajahi galaksi bersama Trailblazer dengan bantuan tim profesional kami.',
    tagline: 'Taklukkan Galaksi Bersama Kami',
    color: '#7B5EA7',
    accentColor: '#FFD700',
    image: 'https://images.unsplash.com/photo-1610209204869-4822c0a980da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    status: 'active',
    howItWorks: HOW_IT_WORKS_DEFAULT,
    securityNotes: SECURITY_NOTES_DEFAULT,
    services: [
      { id: 'hsr-1', name: 'Trailblaze Level Leveling', description: 'Naik Trailblaze Level dengan cepat untuk unlock konten baru dan meningkatkan reward harian.', duration: '3–7 hari', price: 'Mulai Rp 50.000', category: 'Leveling', active: true },
      { id: 'hsr-2', name: 'Memory of Chaos (MoC)', description: 'Clear semua floor MoC dengan bintang penuh untuk mendapatkan Stellar Jade maksimal.', duration: '1–2 hari', price: 'Mulai Rp 75.000', category: 'Endgame', active: true },
      { id: 'hsr-3', name: 'Pure Fiction', description: 'Clear semua stage Pure Fiction dan raih reward eksklusif tiap periode.', duration: '1 hari', price: 'Mulai Rp 60.000', category: 'Endgame', active: true },
      { id: 'hsr-4', name: 'Apocalyptic Shadow', description: 'Clear semua floor Apocalyptic Shadow dengan rating terbaik.', duration: '1–2 hari', price: 'Mulai Rp 65.000', category: 'Endgame', active: true },
      { id: 'hsr-5', name: 'Story & Character Quest', description: 'Selesaikan quest utama Trailblazer dan quest karakter favorit Anda.', duration: '2–4 hari', price: 'Mulai Rp 55.000', category: 'Story', active: true },
      { id: 'hsr-6', name: 'Simulated Universe', description: 'Clear world Simulated Universe tertentu dan kumpulkan Curio serta reward.', duration: '1–2 hari', price: 'Mulai Rp 40.000', category: 'Farming', active: true },
      { id: 'hsr-7', name: 'Character Building', description: 'Leveling, unlock trace, dan farm relic terbaik untuk karakter pilihan Anda.', duration: '2–4 hari', price: 'Mulai Rp 70.000', notes: 'Material tidak termasuk', category: 'Build', active: true },
      { id: 'hsr-8', name: 'Event Completion', description: 'Selesaikan event limited time dan klaim semua reward eksklusif.', duration: '1–2 hari', price: 'Mulai Rp 35.000', category: 'Event', active: true },
    ],
  },
  {
    id: 'zenless-zone-zero',
    name: 'Zenless Zone Zero',
    slug: 'zenless-zone-zero',
    description: 'Action RPG urban fantasy dari HoYoverse dengan dunia New Eridu yang dinamis. Kami siap bantu progression akun Anda.',
    tagline: 'Kuasai New Eridu dengan Style',
    color: '#C8A800',
    accentColor: '#1A1A1A',
    image: 'https://images.unsplash.com/photo-1748334806436-e2e1a33f9001?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    status: 'active',
    howItWorks: HOW_IT_WORKS_DEFAULT,
    securityNotes: SECURITY_NOTES_DEFAULT,
    services: [
      { id: 'zzz-1', name: 'Inter-Knot Level Leveling', description: 'Naik Inter-Knot Level untuk unlock konten baru dan tingkatkan reward harian di New Eridu.', duration: '3–6 hari', price: 'Mulai Rp 50.000', category: 'Leveling', active: true },
      { id: 'zzz-2', name: 'Shiyu Defense — Full Clear', description: 'Clear semua floor Shiyu Defense dengan bintang penuh untuk master reward.', duration: '1–2 hari', price: 'Mulai Rp 70.000', category: 'Endgame', active: true },
      { id: 'zzz-3', name: 'Deadly Assault', description: 'Clear konten endgame Deadly Assault dan dapatkan semua reward kompetitif.', duration: '1 hari', price: 'Mulai Rp 60.000', category: 'Endgame', active: true },
      { id: 'zzz-4', name: 'Story Chapter Completion', description: 'Selesaikan chapter utama dan side story untuk unlock konten dan karakter baru.', duration: '2–4 hari', price: 'Mulai Rp 55.000', category: 'Story', active: true },
      { id: 'zzz-5', name: 'Agent Building', description: 'Level up, upgrade skill, mindscape maze, dan optimasi W-Engine untuk agen pilihan.', duration: '2–3 hari', price: 'Mulai Rp 65.000', notes: 'Material tidak termasuk', category: 'Build', active: true },
      { id: 'zzz-6', name: 'Daily Commission', description: 'Kelola daily commission dan hollow expedition untuk reward harian maksimal.', duration: 'Per hari', price: 'Mulai Rp 25.000', category: 'Daily', active: true },
      { id: 'zzz-7', name: 'Event Completion', description: 'Selesaikan event limited time dan klaim semua reward eksklusif sebelum berakhir.', duration: '1–2 hari', price: 'Mulai Rp 40.000', category: 'Event', active: true },
      { id: 'zzz-8', name: 'Exploration HIA', description: 'Jelajahi area Hollow, kumpulkan collectibles, dan unlock semua konten eksplorasi.', duration: '2–4 hari', price: 'Mulai Rp 45.000', category: 'Exploration', active: true },
    ],
  },
  {
    id: 'wuthering-waves',
    name: 'Wuthering Waves',
    slug: 'wuthering-waves',
    description: 'Open-world action RPG dari Kuro Games dengan mekanik combat dinamis. Bantu progression Rover Anda bersama tim kami.',
    tagline: 'Selaraskan Gelombang, Taklukkan Dunia',
    color: '#2DD4BF',
    accentColor: '#06B6D4',
    image: 'https://images.unsplash.com/photo-1750068418058-80db4f76e863?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    status: 'active',
    howItWorks: HOW_IT_WORKS_DEFAULT,
    securityNotes: SECURITY_NOTES_DEFAULT,
    services: [
      { id: 'ww-1', name: 'Union Level Leveling', description: 'Naik Union Level dengan cepat untuk unlock konten endgame dan meningkatkan quality loot.', duration: '3–7 hari', price: 'Mulai Rp 50.000', category: 'Leveling', active: true },
      { id: 'ww-2', name: 'Tower of Adversity', description: 'Clear semua lantai Tower of Adversity dan dapatkan Astrite reward maksimal.', duration: '1–2 hari', price: 'Mulai Rp 75.000', category: 'Endgame', active: true },
      { id: 'ww-3', name: 'Hologram Dungeons', description: 'Farm Hologram Dungeons untuk material echo dan upgrade resonator Anda.', duration: '1–3 hari', price: 'Mulai Rp 45.000', category: 'Farming', active: true },
      { id: 'ww-4', name: 'Main Story Completion', description: 'Selesaikan chapter utama main story dan prologue untuk unlock semua konten peta.', duration: '2–5 hari', price: 'Mulai Rp 60.000', category: 'Story', active: true },
      { id: 'ww-5', name: 'Echo Farming & Build', description: 'Farm echo (artifact WuWa) terbaik dan optimasi set echo untuk resonator pilihan.', duration: '2–4 hari', price: 'Mulai Rp 80.000', notes: 'RNG-dependent, tidak ada garansi substats ideal', category: 'Build', active: true },
      { id: 'ww-6', name: 'Resonator Building', description: 'Level up, sequences unlock, upgrade weapon, dan skill resonator favorit Anda.', duration: '2–3 hari', price: 'Mulai Rp 65.000', notes: 'Material tidak termasuk', category: 'Build', active: true },
      { id: 'ww-7', name: 'Exploration & Collectibles', description: 'Cari chest, kumpulkan collectibles, dan unlock waypoint di semua region.', duration: '2–5 hari', price: 'Mulai Rp 50.000', category: 'Exploration', active: true },
      { id: 'ww-8', name: 'Event Timed', description: 'Selesaikan event terbatas waktu dan klaim semua reward sebelum expired.', duration: '1–2 hari', price: 'Mulai Rp 40.000', category: 'Event', active: true },
    ],
  },
  {
    id: 'arknights-endfield',
    name: 'Arknights: Endfield',
    slug: 'arknights-endfield',
    description: '3D action RPG dari Hypergryph sebagai kelanjutan universe Arknights. Tim kami siap membantu progression Endfield Anda.',
    tagline: 'Bangun Pangkalan, Taklukkan Endfield',
    color: '#F97316',
    accentColor: '#6B7280',
    image: 'https://images.unsplash.com/photo-1678984239499-2f95b25795f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    status: 'active',
    howItWorks: HOW_IT_WORKS_DEFAULT,
    securityNotes: SECURITY_NOTES_DEFAULT,
    services: [
      { id: 'ae-1', name: 'Account Level Leveling', description: 'Naik level akun dengan cepat untuk unlock konten baru dan tingkatkan kapabilitas operator.', duration: '3–7 hari', price: 'Mulai Rp 50.000', category: 'Leveling', active: true },
      { id: 'ae-2', name: 'Main Story Progression', description: 'Clear chapter utama main story Endfield dan unlock area baru di peta.', duration: '2–5 hari', price: 'Mulai Rp 60.000', category: 'Story', active: true },
      { id: 'ae-3', name: 'Annihilation & Endgame', description: 'Clear konten endgame annihilation dan challenge stage dengan rating terbaik.', duration: '1–3 hari', price: 'Mulai Rp 80.000', category: 'Endgame', active: true },
      { id: 'ae-4', name: 'Operator Building', description: 'Level up, promote, skill mastery, dan module unlock untuk operator pilihan Anda.', duration: '2–4 hari', price: 'Mulai Rp 70.000', notes: 'Material tidak termasuk', category: 'Build', active: true },
      { id: 'ae-5', name: 'Material Farming', description: 'Farm material upgrade secara efisien untuk kebutuhan operator dan base building.', duration: '1–3 hari', price: 'Mulai Rp 40.000', category: 'Farming', active: true },
      { id: 'ae-6', name: 'Event Stages', description: 'Clear semua stage event limited dan klaim reward eksklusif sebelum berakhir.', duration: '1–2 hari', price: 'Mulai Rp 45.000', category: 'Event', active: true },
      { id: 'ae-7', name: 'Base Management', description: 'Optimasi facility dan base management untuk produksi material yang efisien.', duration: '1–2 hari', price: 'Nego', category: 'Farming', active: true },
      { id: 'ae-8', name: 'Exploration & Secret Areas', description: 'Jelajahi secret area dan kumpulkan collectibles tersembunyi di seluruh peta Endfield.', duration: '2–4 hari', price: 'Mulai Rp 50.000', category: 'Exploration', active: true },
    ],
  },
  {
    id: 'never-truly-erased',
    name: 'Never Truly Erased',
    slug: 'never-truly-erased',
    description: 'Game action RPG terbaru yang akan segera hadir. Layanan joki siap tersedia saat game diluncurkan secara resmi.',
    tagline: 'Siap Melayani Saat Launch',
    color: '#F43F5E',
    accentColor: '#FFFFFF',
    image: 'https://images.unsplash.com/photo-1663366416840-95a489b61d2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    status: 'active',
    howItWorks: HOW_IT_WORKS_DEFAULT,
    securityNotes: SECURITY_NOTES_DEFAULT,
    services: [
      { id: 'nte-1', name: 'Account Level / Progression', description: 'Joki naik level akun dan progression utama karakter. Detail akan diperbarui setelah game launch resmi.', duration: 'TBA', price: 'Nego', notes: 'Layanan akan dikonfirmasi setelah game dirilis resmi', category: 'Leveling', active: true },
      { id: 'nte-2', name: 'Story Mode Completion', description: 'Selesaikan chapter utama story mode. Detail chapter akan diperbarui setelah launch.', duration: 'TBA', price: 'Nego', category: 'Story', active: true },
      { id: 'nte-3', name: 'Character Leveling & Build', description: 'Upgrade dan build karakter pilihan Anda secara optimal.', duration: 'TBA', price: 'Nego', category: 'Build', active: true },
      { id: 'nte-4', name: 'Event Completion', description: 'Clear event terbatas dan klaim semua reward eksklusif.', duration: 'TBA', price: 'Nego', category: 'Event', active: true },
      { id: 'nte-5', name: 'Daily & Weekly Mission', description: 'Kelola misi harian dan mingguan untuk reward optimal.', duration: 'Per hari/minggu', price: 'Nego', category: 'Daily', active: true },
      { id: 'nte-6', name: 'Endgame & Challenge Mode', description: 'Clear konten challenge dan endgame dengan rating terbaik.', duration: 'TBA', price: 'Nego', category: 'Endgame', active: true },
    ],
  },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  { id: 't1', name: 'R*****a', gameId: 'genshin-impact', service: 'Spiral Abyss Full Clear', rating: 5, content: 'Mantap banget! AR 45 ku akhirnya bisa full star Spiral Abyss floor 12. Prosesnya cepat cuma 1 hari, komunikasinya ramah. Highly recommended!', date: '2026-05-01', featured: true, active: true, avatar: 'https://images.unsplash.com/photo-1656229181541-a42184b5625c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100' },
  { id: 't2', name: 'F*****i', gameId: 'honkai-star-rail', service: 'Memory of Chaos', rating: 5, content: 'MoC 12 udah full star! Adminnya responsif banget, update terus progress-nya. Harganya juga worth it. Pasti balik lagi!', date: '2026-04-28', featured: true, active: true },
  { id: 't3', name: 'D*****o', gameId: 'zenless-zone-zero', service: 'Shiyu Defense Full Clear', rating: 5, content: 'Shiyu Defense selesai dalam waktu kurang dari 2 hari. Aman 100%, akun langsung dikembalikan setelah beres. Top!', date: '2026-04-25', featured: true, active: true },
  { id: 't4', name: 'A*****n', gameId: 'wuthering-waves', service: 'Tower of Adversity', rating: 5, content: 'Tower of Adversity clear semua floor! Zeroth Store emang the best. Sudah 3x order dan selalu memuaskan.', date: '2026-04-20', featured: true, active: true },
  { id: 't5', name: 'S*****i', gameId: 'genshin-impact', service: 'Character Building', rating: 4, content: 'Character building Neuvillette ku selesai dengan artifact yang cukup bagus. Komunikasinya enak, sabar njelasin juga. Recommended!', date: '2026-04-15', featured: false, active: true },
  { id: 't6', name: 'M*****l', gameId: 'honkai-star-rail', service: 'Pure Fiction', rating: 5, content: 'Pure Fiction max score! Prosesnya profesional banget, laporan progress dikirim tiap hari. Harga bersahabat juga!', date: '2026-04-10', featured: false, active: true },
  { id: 't7', name: 'K*****a', gameId: 'arknights-endfield', service: 'Main Story Progression', rating: 5, content: 'Story Endfield selesai dalam 3 hari. Adminnya ngerti banget game-nya. Pelayanan super memuaskan!', date: '2026-05-03', featured: true, active: true },
  { id: 't8', name: 'P*****s', gameId: 'wuthering-waves', service: 'Echo Farming', rating: 4, content: 'Echo farming hasilnya lumayan bagus. RNG memang susah, tapi usahanya maksimal. Bakal order lagi buat build karakter lain!', date: '2026-05-05', featured: false, active: true },
  { id: 't9', name: 'Y*****a', gameId: 'genshin-impact', service: 'Artifact Farming', rating: 5, content: 'Artifact farming buat Hu Tao selesai dengan stats yang keren banget. Tim-nya sabar banget ngejalanin resin tiap hari. Worth it!', date: '2026-05-08', featured: false, active: true },
  { id: 't10', name: 'B*****o', gameId: 'honkai-star-rail', service: 'Simulated Universe', rating: 5, content: 'SU World 8 kelar dalam sehari! Adminnya aktif banget, langsung balas kalau ditanya. Pelayanan terbaik yang pernah aku coba.', date: '2026-05-10', featured: false, active: true },
  { id: 't11', name: 'N*****i', gameId: 'zenless-zone-zero', service: 'Hollow Zero', rating: 4, content: 'Hollow Zero selesai semua node-nya. Prosesnya smooth, nggak ada masalah sama sekali. Harga juga terjangkau!', date: '2026-05-12', featured: false, active: true },
  { id: 't12', name: 'H*****u', gameId: 'arknights-endfield', service: 'Resource Farming', rating: 5, content: 'Resource farming buat upgrade operator lancar banget. Zeroth Store beneran terpercaya, sudah 2x order dan puas semua!', date: '2026-05-14', featured: false, active: true },
  { id: 't13', name: 'L*****a', gameId: 'wuthering-waves', service: 'Tower of Adversity', rating: 5, content: 'Tower of Adversity floor paling susah akhirnya clear juga! Admin ngerti banget cara main-nya. Super satisfied!', date: '2026-05-16', featured: false, active: true },
  { id: 't14', name: 'C*****r', gameId: 'genshin-impact', service: 'Spiral Abyss Full Clear', rating: 5, content: 'Abiss floor 12 clear 36 bintang! Nggak nyangka bisa secepat ini. Komunikasi juga enak banget, update terus.', date: '2026-05-18', featured: false, active: true },
  { id: 't15', name: 'W*****i', gameId: 'honkai-star-rail', service: 'Memory of Chaos', rating: 4, content: 'MoC selesai meski karakter belum terlalu kuat. Adminnya pintar banget atur team comp. Nanti balik lagi buat Pure Fiction!', date: '2026-05-20', featured: false, active: true },
  { id: 't16', name: 'T*****o', gameId: 'zenless-zone-zero', service: 'Shiyu Defense Full Clear', rating: 5, content: 'Shiyu Defense beres semua! Prosesnya cepat dan aman. Admin rutin kasih update screenshot. Sangat direkomendasikan!', date: '2026-05-22', featured: false, active: true },
  { id: 't17', name: 'E*****n', gameId: 'arknights-endfield', service: 'Main Story Progression', rating: 5, content: 'Story chapter terbaru selesai dalam 2 hari. Adminnya fasih banget bahasain lore gamenya. Puas banget!', date: '2026-05-24', featured: false, active: true },
  { id: 't18', name: 'G*****a', gameId: 'genshin-impact', service: 'Character Building', rating: 5, content: 'Build Furina ku jadi mantap banget setelah di-farm. Artifact set lengkap dengan stats yang optimal. Makasih banyak!', date: '2026-05-26', featured: false, active: true },
  { id: 't19', name: 'J*****i', gameId: 'honkai-star-rail', service: 'Pure Fiction', rating: 4, content: 'Pure Fiction done! Lumayan struggle di awal tapi adminnya sabar banget nyari strategi yang pas. Puas dengan hasilnya.', date: '2026-05-28', featured: false, active: true },
  { id: 't20', name: 'V*****a', gameId: 'wuthering-waves', service: 'Echo Farming', rating: 5, content: 'Echo farming hasilnya melampaui ekspektasi! Dapat echo dengan stats hampir perfect. Zeroth Store emang no. 1!', date: '2026-05-30', featured: false, active: true },
  { id: 't21', name: 'R*****o', gameId: 'genshin-impact', service: 'Spiral Abyss Full Clear', rating: 5, content: 'Sudah 5x order di sini dan selalu puas! Kali ini abiss beres cuma 6 jam. Kecepatan dan kualitasnya konsisten banget.', date: '2026-06-01', featured: false, active: true },
  { id: 't22', name: 'I*****n', gameId: 'honkai-star-rail', service: 'Simulated Universe', rating: 5, content: 'SU beres semua path-nya! Adminnya detail banget jelasin setiap pilihan blessings-nya. Edukasi sambil joki, top!', date: '2026-06-03', featured: false, active: true },
  { id: 't23', name: 'O*****i', gameId: 'zenless-zone-zero', service: 'Hollow Zero', rating: 4, content: 'Hollow Zero semua sektor selesai. Sempat ada kendala tapi admin langsung handle dengan cepat. Service after-sales bagus!', date: '2026-06-05', featured: false, active: true },
  { id: 't24', name: 'Q*****a', gameId: 'arknights-endfield', service: 'Resource Farming', rating: 5, content: 'Material langka yang aku butuhin akhirnya full! Prosesnya transparan, tiap sesi farming dikasih laporan. Mantap!', date: '2026-06-07', featured: false, active: true },
  { id: 't25', name: 'Z*****u', gameId: 'wuthering-waves', service: 'Tower of Adversity', rating: 5, content: 'Floor terakhir yang bikin frustrasi akhirnya kelar! Admin sabar banget cari window waktu yang tepat. Respect!', date: '2026-06-09', featured: false, active: true },
  { id: 't26', name: 'X*****i', gameId: 'genshin-impact', service: 'Character Building', rating: 4, content: 'Build Raiden Shogun-ku sekarang udah layak untuk Abiss. Artifact yang didapat lumayan bagus. Worth the price!', date: '2026-06-11', featured: false, active: true },
  { id: 't27', name: 'U*****o', gameId: 'honkai-star-rail', service: 'Memory of Chaos', rating: 5, content: 'MoC perfect! Nggak nyangka bisa 3 bintang semua node. Adminnya jago banget pilih team comp yang efisien.', date: '2026-06-13', featured: false, active: true },
  { id: 't28', name: 'T*****n', gameId: 'zenless-zone-zero', service: 'Shiyu Defense Full Clear', rating: 5, content: 'Shiyu Defense S-rank semua! Kecepatan clearnya luar biasa, dan adminnya friendly banget. Pasti repeat order!', date: '2026-06-15', featured: false, active: true },
  { id: 't29', name: 'S*****a', gameId: 'arknights-endfield', service: 'Main Story Progression', rating: 5, content: 'Story selesai tanpa spoiler! Admin sengaja mainnya urut supaya pengalaman ceritanya tetap terjaga. Thoughtful banget!', date: '2026-06-17', featured: false, active: true },
  { id: 't30', name: 'P*****u', gameId: 'wuthering-waves', service: 'Echo Farming', rating: 4, content: 'Echo farming lumayan, dapat beberapa yang bagus meski nggak semua perfect. Overall puas sama usahanya.', date: '2026-06-19', featured: false, active: true },
  { id: 't31', name: 'M*****a', gameId: 'genshin-impact', service: 'Artifact Farming', rating: 5, content: 'Artifact Yelan-ku sekarang CR/CD udah bagus banget! Farm-nya telaten dan hasilnya di luar dugaan. Terima kasih!', date: '2026-06-21', featured: false, active: true },
  { id: 't32', name: 'L*****o', gameId: 'honkai-star-rail', service: 'Pure Fiction', rating: 5, content: 'Pure Fiction beres 4 bintang! Sempat ragu karena karakter belum E6, tapi admin bisa akali dengan strategi yang tepat.', date: '2026-06-23', featured: false, active: true },
  { id: 't33', name: 'K*****i', gameId: 'zenless-zone-zero', service: 'Hollow Zero', rating: 5, content: 'Hollow Zero semua event challenge selesai! Hadiahnya banyak banget. Admin kerjanya cepat dan rapi. Recommended!', date: '2026-06-25', featured: false, active: true },
  { id: 't34', name: 'J*****a', gameId: 'arknights-endfield', service: 'Resource Farming', rating: 4, content: 'Farming material buat upgrade cukup efisien. Hasilnya sesuai estimasi yang dijanjikan. Tidak ada komplain sama sekali.', date: '2026-06-27', featured: false, active: true },
  { id: 't35', name: 'H*****i', gameId: 'wuthering-waves', service: 'Tower of Adversity', rating: 5, content: '35 testimoni dan Zeroth Store tetap konsisten! Ini order ke-4 ku dan kualitasnya nggak pernah turun. Legend!', date: '2026-06-29', featured: false, active: true },
];

export const INITIAL_FAQS: FAQ[] = [
  { id: 'f1', question: 'Bagaimana cara order layanan joki?', answer: 'Klik tombol "Order via WhatsApp" di halaman layanan yang Anda inginkan. WhatsApp akan terbuka dengan pesan otomatis, lalu diskusikan detail dengan admin kami.', category: 'Umum', active: true },
  { id: 'f2', question: 'Apakah akun saya aman saat dijoki?', answer: 'Keamanan akun adalah prioritas utama kami. Kami tidak menyimpan data login Anda setelah joki selesai, dan tidak ada akses yang diberikan ke pihak ketiga.', category: 'Keamanan', active: true },
  { id: 'f3', question: 'Berapa lama proses joki diselesaikan?', answer: 'Durasi bervariasi tergantung layanan. Kami akan memberikan estimasi waktu yang jelas saat diskusi di WhatsApp. Umumnya 1–7 hari tergantung kompleksitas.', category: 'Umum', active: true },
  { id: 'f4', question: 'Metode pembayaran apa yang diterima?', answer: 'Kami menerima transfer bank, e-wallet (GoPay, OVO, Dana, ShopeePay), dan QRIS. Detail pembayaran akan diberikan saat deal via WhatsApp.', category: 'Pembayaran', active: true },
  { id: 'f5', question: 'Apakah ada garansi jika terjadi masalah?', answer: 'Ya! Jika terjadi kesalahan dari pihak kami, kami memberikan garansi pengerjaan ulang gratis. Hubungi kami segera jika ada masalah.', category: 'Garansi', active: true },
  { id: 'f6', question: 'Apakah akun bisa kena ban karena joki?', answer: 'Risiko ban sangat minimal karena kami menggunakan metode yang aman dan tidak melanggar ToS game secara kasar. Namun kami tetap menyarankan untuk mengganti password setelah joki selesai.', category: 'Keamanan', active: true },
  { id: 'f7', question: 'Bisakah saya memantau progress joki?', answer: 'Tentu! Admin kami akan mengirimkan update progress secara berkala melalui WhatsApp, termasuk screenshot sebagai bukti pengerjaan.', category: 'Umum', active: true },
  { id: 'f8', question: 'Bagaimana kebijakan refund?', answer: 'Refund dapat dilakukan jika kami tidak dapat menyelesaikan pesanan sesuai kesepakatan. Detail kebijakan refund akan dijelaskan saat diskusi awal.', category: 'Garansi', active: true },
];

export const INITIAL_STATS = {
  ordersCompleted: 2847,
  gamesSupported: 6,
  satisfactionRate: 98,
  activeClients: 340,
};

export const INITIAL_SETTINGS = {
  whatsappNumber: WHATSAPP_NUMBER,
  heroHeadline: 'Joki Game Profesional & Terpercaya #1 Indonesia',
  heroSubheadline: 'Tim expert siap bantu progression akun game gacha dan action RPG Anda. Aman, cepat, dan harga terjangkau.',
  operationalHours: 'Senin – Minggu, 08.00 – 24.00 WIB',
  responseTime: 'Kami biasanya merespons dalam 5 menit',
  announcement: '',
  footerText: '© 2026 Zeroth Store. Layanan Joki Game Profesional Indonesia.',
  socialMedia: { instagram: '', tiktok: '', discord: '' },
};
