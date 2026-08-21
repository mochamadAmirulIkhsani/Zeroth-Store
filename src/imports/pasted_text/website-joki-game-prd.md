# Product Requirements Document (PRD)
## Website Joki Game — Platform Layanan Boosting & Farming

**Versi:** 1.0  
**Tanggal:** Mei 2026  
**Status:** Draft  
**Pemilik Produk:** [Nama Tim / Owner]

---

## 1. Ringkasan Eksekutif

### 1.1 Visi Produk
Membangun platform website joki game yang profesional, modern, dan terpercaya — menjadi layanan joki game terdepan di Indonesia dengan fokus pada game populer dari genre gacha dan action RPG. Website berfungsi sebagai etalase layanan yang mengarahkan semua transaksi melalui WhatsApp untuk pengalaman yang personal dan fleksibel.

### 1.2 Tujuan Bisnis
- Meningkatkan kepercayaan calon klien melalui tampilan profesional dan informasi layanan yang transparan
- Mempercepat konversi pengunjung menjadi klien aktif dengan CTA WhatsApp yang jelas
- Memberikan kemudahan pengelolaan konten secara mandiri melalui Admin Panel
- Membangun brand awareness sebagai jasa joki game terpercaya

### 1.3 Target Pengguna
- **Primer:** Pemain game gacha/action RPG usia 15–30 tahun yang membutuhkan bantuan progression
- **Sekunder:** Komunitas gaming yang ingin meningkatkan rank atau menyelesaikan konten tertentu

---

## 2. Lingkup Produk

### 2.1 Dalam Lingkup (In Scope)
- Website publik (frontend) dengan informasi layanan joki per game
- Admin Panel untuk manajemen konten dinamis
- Integrasi WhatsApp sebagai satu-satunya kanal komunikasi dan transaksi
- Halaman per game dengan daftar layanan, harga estimasi, dan FAQ
- Sistem manajemen testimoni

### 2.2 Di Luar Lingkup (Out of Scope)
- Integrasi payment gateway (Midtrans, Xendit, dll.)
- Sistem login/akun untuk klien
- Live chat built-in
- Aplikasi mobile native

---

## 3. Persyaratan Desain & UI/UX

### 3.1 Identitas Visual
| Elemen | Spesifikasi |
|---|---|
| Tema Dominan | Putih bersih (#FFFFFF / #FAFAFA) |
| Warna Aksen | Hitam (#0A0A0A), Abu gelap (#1C1C1C) |
| Aksen Highlight | Gold/Amber (#F59E0B) atau warna per game |
| Tipografi Display | Font geometris/modern (contoh: Clash Display, Cabinet Grotesk) |
| Tipografi Body | Font readable sans-serif (contoh: DM Sans, Plus Jakarta Sans) |
| Gaya Visual | Clean, editorial, luxury-minimal |
| Border Radius | Halus — 8px hingga 16px |
| Ikon | Line icons, bukan filled — konsisten |

### 3.2 Prinsip UX
- **Mobile-first:** Mayoritas pengguna mengakses via smartphone
- **Clarity over cleverness:** Informasi mudah dipindai, tidak membingungkan
- **Conversion-focused:** Tombol WhatsApp menonjol di setiap titik strategis
- **Trust signals:** Testimoni, jumlah order selesai, dan badge terpercaya
- **Fast loading:** Target di bawah 2 detik First Contentful Paint

### 3.3 Warna Per Game (Badge & Aksen)
| Game | Warna Identitas | Hex |
|---|---|---|
| Genshin Impact | Biru Langit / Emas | #4A90D9 / #E8B84B |
| Honkai: Star Rail | Ungu Galaksi / Emas | #7B5EA7 / #FFD700 |
| Zenless Zone Zero | Kuning Neon / Hitam | #FFE000 / #1A1A1A |
| Wuthering Waves | Hijau Teal / Cyan | #2DD4BF / #06B6D4 |
| Arknights: Endfield | Orange Industri / Abu | #F97316 / #6B7280 |
| Never Truly Erased (NTE) | Merah Muda / Putih | #F43F5E / #FFFFFF |

---

## 4. Arsitektur Website

### 4.1 Struktur Halaman

```
/ (Homepage)
├── /games                    (Daftar semua game)
│   ├── /genshin-impact       (Halaman Genshin)
│   ├── /honkai-star-rail     (Halaman HSR)
│   ├── /zenless-zone-zero    (Halaman ZZZ)
│   ├── /wuthering-waves      (Halaman WuWa)
│   ├── /arknights-endfield   (Halaman Arknight Endfield)
│   └── /never-truly-erased   (Halaman NTE)
├── /testimoni                (Halaman semua testimoni)
├── /faq                      (Pertanyaan umum)
├── /kontak                   (Halaman kontak / WhatsApp)
└── /admin                    (Panel Admin — terproteksi)
    ├── /admin/dashboard
    ├── /admin/games
    ├── /admin/services
    ├── /admin/testimonials
    ├── /admin/settings
    └── /admin/whatsapp
```

### 4.2 Tech Stack Rekomendasi

**Frontend:**
- Framework: Next.js 14+ (React) — SSG/ISR untuk performa optimal
- Styling: Tailwind CSS + custom CSS variables
- Animasi: Framer Motion
- CMS Data: Terhubung ke backend via REST API

**Backend & Admin:**
- Runtime: Node.js (Express) atau Next.js API Routes
- Database: PostgreSQL (relasional, handal untuk konten dinamis)
- ORM: Prisma
- Auth Admin: JWT + bcrypt (session-based)
- Storage: Cloudinary (untuk upload gambar/testimoni)

**Deployment:**
- Frontend: Vercel
- Backend/DB: Railway atau Supabase
- Domain: Custom domain dengan SSL

---

## 5. Spesifikasi Halaman — Frontend

### 5.1 Homepage

**Seksi 1 — Hero Section**
- Headline besar: tagline layanan (dapat diubah via admin)
- Sub-headline: deskripsi singkat
- CTA utama: tombol "Order via WhatsApp" (sticky/prominent)
- Background: pattern subtil atau gradient putih ke abu sangat terang
- Animasi: fade-in dan slide-up saat load

**Seksi 2 — Game List**
- Grid kartu game (2 kolom mobile, 3 kolom tablet, 3 kolom desktop)
- Setiap kartu berisi: thumbnail game, nama game, badge warna, highlight layanan utama
- Hover: elevasi kartu + tombol "Lihat Layanan"

**Seksi 3 — Keunggulan / Why Us**
- 4–6 poin keunggulan layanan (aman, cepat, berpengalaman, harga wajar, dll.)
- Ikon + judul + deskripsi singkat
- Dapat diedit via admin

**Seksi 4 — Statistik**
- Counter animasi: total order selesai, jumlah game dilayani, rating kepuasan
- Data dapat diupdate manual via admin

**Seksi 5 — Testimoni Sorotan**
- Carousel 3–5 testimoni terbaik
- Setiap testimoni: avatar/screenshot, nama (bisa disamarkan), game, isi pesan, rating bintang

**Seksi 6 — FAQ Singkat**
- Accordion 5 pertanyaan paling umum
- Link ke halaman FAQ lengkap

**Seksi 7 — CTA Bawah**
- Banner besar dengan tombol WhatsApp
- Teks persuasif yang dapat diedit

---

### 5.2 Halaman Daftar Game (/games)

- Grid semua game dengan filter aktif
- Setiap kartu: thumbnail, nama, jumlah layanan tersedia, harga mulai dari
- Search sederhana berdasarkan nama game

---

### 5.3 Halaman Detail Per Game

Setiap halaman game memiliki struktur berikut:

#### A. Header Game
- Banner/thumbnail game (bisa diganti via admin)
- Nama game + deskripsi singkat
- Badge status: "Tersedia" / "Sementara Tidak Tersedia"
- Tombol WhatsApp langsung dengan pesan pre-filled

#### B. Daftar Layanan Joki

Ditampilkan dalam bentuk tabel atau kartu per layanan. Setiap layanan memiliki field:

| Field | Keterangan |
|---|---|
| Nama Layanan | Contoh: "Push Rank — Diamond ke Master" |
| Deskripsi | Penjelasan detail apa yang dikerjakan |
| Estimasi Durasi | Contoh: "1–3 hari" |
| Harga Estimasi | Contoh: "Mulai dari Rp 50.000" atau "Nego" |
| Catatan Penting | Contoh: syarat akun, keamanan, dll. |
| Tombol Order | Mengarah ke WhatsApp dengan pesan otomatis |

#### C. Cara Kerja / Alur Joki
- Timeline visual 4–5 langkah: Hubungi WA → Diskusi & Deal → Berikan Akses → Proses Joki → Selesai & Laporan
- Dapat diedit per game via admin

#### D. Informasi Keamanan
- Poin-poin jaminan keamanan akun
- Kebijakan privasi data akun klien
- Disclaimer (editable)

#### E. FAQ Per Game
- Accordion pertanyaan yang spesifik untuk game tersebut
- Dikelola via admin

#### F. Testimoni Per Game
- Filter testimoni berdasarkan game
- Dapat menampilkan screenshot (opsional)

---

### 5.4 Spesifikasi Layanan Per Game

#### 5.4.1 Genshin Impact
Kategori layanan:
- **Adventure Rank (AR) Leveling** — Joki naik AR 1–60
- **Spiral Abyss** — Clear floor 9/10/11/12, full star
- **World Quest Completion** — Menyelesaikan quest utama/side quest
- **Domain Farming** — Farm artifact, material ascension
- **Event Completion** — Selesaikan event limited time
- **Boss Farming** — Farm weekly boss / normal boss
- **Resin Management** — Kelola resin harian untuk farming optimal
- **Character Building** — Level up, ascend, skill, artifact set karakter tertentu
- **Exploration** — Unlock waypoint, chest, collectible per region

#### 5.4.2 Honkai: Star Rail (HSR)
Kategori layanan:
- **Trailblaze Level Leveling** — Joki naik level Trailblaze
- **Memory of Chaos (MoC)** — Clear semua floor, bintang penuh
- **Pure Fiction** — Clear semua stage
- **Apocalyptic Shadow** — Clear semua floor
- **Story Quest** — Selesaikan quest karakter / main story
- **Daily Mission** — Kelola daily quest
- **Simulated Universe** — Clear world tertentu
- **Character Building** — Leveling, trace, relic farming
- **Event Completion** — Event limited time

#### 5.4.3 Zenless Zone Zero (ZZZ)
Kategori layanan:
- **Inter-Knot Level Leveling** — Joki naik level akun
- **Shiyu Defense** — Clear semua floor dengan bintang penuh
- **Deadly Assault** — Clear konten endgame
- **Story Chapter** — Selesaikan chapter utama / side story
- **Commission / Daily** — Kelola daily commission
- **Agent Building** — Level up, skill, mindscape maze, W-Engine
- **Event** — Event limited time
- **Exploration HIA** — Jelajahi area, collectibles

#### 5.4.4 Wuthering Waves (WuWa)
Kategori layanan:
- **Union Level Leveling** — Naik union level
- **Tower of Adversity** — Clear semua lantai
- **Hologram Dungeons** — Farm material dan echo
- **Main Story** — Selesaikan chapter utama
- **Side Quest & World Quest** — Penyelesaian quest sampingan
- **Echo Farming & Build** — Farm echo (artifact WuWa) untuk resonator
- **Resonator Building** — Level up, sequences, weapon, skill
- **Exploration** — Chest, collectibles, waypoint per region
- **Event Timed** — Event limited time

#### 5.4.5 Arknights: Endfield
Kategori layanan:
- **Account Level Leveling** — Naik level akun / Trailblazer equivalent
- **Main Story Progression** — Clear chapter utama
- **Annihilation / Endgame Content** — Clear konten endgame
- **Operator Building** — Level, promote, skill mastery, module
- **Material Farming** — Farm material upgrade
- **Event Stages** — Clear stage event limited
- **Exploration** — Secret area, collectibles
- **Base Management** — Optimasi base/facility (jika relevan di Endfield)

#### 5.4.6 Never Truly Erased (NTE)
Kategori layanan:
- **Account Level / Progression** — Naik level / progress akun
- **Story Mode** — Selesaikan chapter utama
- **Character Leveling & Build** — Upgrade karakter pilihan
- **Event Completion** — Clear event terbatas
- **Daily / Weekly Mission** — Kelola misi harian/mingguan
- **Exploration & Collectibles** — Jelajahi area, unlock konten
- **Endgame / Challenge Mode** — Clear konten challenge

> *Catatan: List layanan NTE akan diperbarui setelah game dirilis resmi dan mekanik final dikonfirmasi. Admin dapat menambah/edit layanan kapan saja.*

---

### 5.5 Halaman Testimoni

- Grid masonry atau list testimoni
- Filter per game, per tipe layanan
- Setiap testimoni: nama (opsional sensor), game, layanan yang digunakan, rating, isi teks, tanggal, screenshot (opsional)
- Pagination atau infinite scroll

---

### 5.6 Halaman FAQ

- Accordion yang dikelompokkan per topik:
  - Umum (cara order, keamanan, dll.)
  - Per game
  - Pembayaran & Harga
  - Garansi & Refund Policy

---

### 5.7 Halaman Kontak / WhatsApp

- Tombol besar WhatsApp
- Jam operasional (editable via admin)
- Pesan sambutan / SLA respons (contoh: "Kami biasanya merespons dalam 5 menit")
- Informasi tambahan (sosial media, dll. — opsional)

---

## 6. Integrasi WhatsApp

### 6.1 Mekanisme
Semua tombol order menggunakan link `https://wa.me/[nomor]?text=[pesan_encoded]`

### 6.2 Template Pesan Otomatis

Setiap tombol order game/layanan akan membuka WhatsApp dengan pesan pre-filled:

```
Halo Admin! Saya tertarik dengan layanan joki [NAMA GAME].

Layanan yang diinginkan: [NAMA LAYANAN]
Detail tambahan: [kosong — diisi klien]

Mohon info lebih lanjut, terima kasih!
```

Nomor WhatsApp dan template pesan dapat diubah via Admin Panel.

### 6.3 Tombol WhatsApp — Posisi Strategis
- Navbar (sticky) — ikon WhatsApp kecil
- Hero section — CTA utama
- Setiap kartu layanan — tombol "Order Sekarang"
- Floating button di semua halaman (pojok kanan bawah)
- Footer — link teks + ikon

---

## 7. Admin Panel

### 7.1 Autentikasi
- Login dengan username + password (satu akun admin atau multi-admin)
- Session JWT dengan expiry 24 jam
- Proteksi brute-force (rate limiting)
- Password dapat diubah dari dalam panel

### 7.2 Dashboard
- Ringkasan statistik: jumlah game aktif, jumlah layanan, jumlah testimoni, kunjungan (opsional via analytics)
- Quick actions: tambah testimoni, edit nomor WA, update pengumuman

### 7.3 Manajemen Game

Untuk setiap game, admin dapat:

| Fitur | Deskripsi |
|---|---|
| Status Aktif/Non-aktif | Toggle tampil/sembunyi game di website |
| Edit Nama & Deskripsi | Ubah nama, tagline, deskripsi game |
| Upload Thumbnail/Banner | Ganti gambar utama game |
| Warna Aksen | Pilih warna identitas kartu/halaman game |
| Urutan Tampil | Drag-and-drop urutan game di homepage & list |

### 7.4 Manajemen Layanan (per Game)

Untuk setiap game, admin dapat mengelola daftar layanan:

| Field | Tipe | Wajib |
|---|---|---|
| Nama Layanan | Text | ✓ |
| Deskripsi | Textarea (rich text ringan) | ✓ |
| Estimasi Durasi | Text | ✓ |
| Harga Estimasi | Text (fleksibel, bisa "Mulai Rp 50rb" atau "Nego") | ✓ |
| Catatan / Syarat | Textarea | ✗ |
| Status Aktif | Toggle | ✓ |
| Urutan Tampil | Angka / Drag-and-drop | ✓ |
| Tag/Kategori | Multi-select (Rank, Story, Farming, Build, dll.) | ✗ |
| Template Pesan WA | Textarea (pre-filled message per layanan) | ✗ |

Operasi: Tambah, Edit, Hapus, Duplikat layanan.

### 7.5 Manajemen Testimoni

| Field | Tipe | Wajib |
|---|---|---|
| Nama Pemberi | Text (bisa "Anonim") | ✓ |
| Game | Dropdown | ✓ |
| Layanan | Text | ✗ |
| Rating | 1–5 bintang | ✓ |
| Isi Testimoni | Textarea | ✓ |
| Screenshot | Upload gambar | ✗ |
| Tanggal | Date picker | ✓ |
| Status Tampil | Toggle | ✓ |
| Featured | Toggle (tampil di homepage) | ✓ |

### 7.6 Manajemen FAQ

- Tambah/edit/hapus pertanyaan dan jawaban
- Pilih kategori/game
- Toggle aktif/non-aktif
- Urutan tampil (drag-and-drop)

### 7.7 Pengaturan Global (Settings)

| Setting | Deskripsi |
|---|---|
| Nomor WhatsApp | Nomor utama (format internasional) |
| Jam Operasional | Teks jam layanan |
| Teks Hero Headline | Ubah tagline homepage |
| Teks Hero Subheadline | Ubah sub-tagline |
| Statistik Counter | Edit angka order selesai, dll. |
| Pengumuman / Banner | Teks pengumuman di atas navbar (opsional) |
| SEO Metadata | Title, description, OG image per halaman |
| Footer Info | Teks, sosial media link |
| Logo & Favicon | Upload file |

### 7.8 Manajemen "Cara Kerja" (Per Game)

- Edit langkah-langkah alur joki per game
- Setiap langkah: ikon, judul, deskripsi
- Tambah/hapus/urut langkah

---

## 8. SEO & Performa

### 8.1 SEO
- Meta title & description unik per halaman (editable via admin)
- Open Graph image untuk sharing sosial media
- Structured data (JSON-LD) untuk nama bisnis
- Sitemap XML otomatis
- Canonical URL
- URL slug yang bersih dan SEO-friendly

### 8.2 Performa
- Target Lighthouse Score: 90+ (Performance, Accessibility, Best Practices)
- Gambar: lazy loading + WebP format
- Font: subset loading, preconnect
- Critical CSS inline
- Caching API responses

---

## 9. Keamanan

| Area | Implementasi |
|---|---|
| Admin Auth | JWT + bcrypt, rate limiting login |
| Input Sanitasi | Escape semua user input, validasi server-side |
| HTTPS | SSL wajib di semua endpoint |
| Environment Variables | Semua secret di .env, tidak di repository |
| File Upload | Validasi tipe file, batas ukuran, scan opsional |
| CORS | Whitelist domain yang diizinkan |
| SQL Injection | ORM (Prisma) mencegah query langsung |

---

## 10. Aksesibilitas

- Contrast ratio minimum 4.5:1 untuk teks
- Semua gambar memiliki alt text (admin wajib mengisi)
- Navigasi keyboard-friendly
- Tombol memiliki label yang jelas
- Animasi dapat dinonaktifkan (prefers-reduced-motion)

---

## 11. Responsivitas

| Breakpoint | Lebar | Perilaku |
|---|---|---|
| Mobile | < 640px | 1 kolom, hamburger menu, tombol full-width |
| Tablet | 640–1024px | 2 kolom grid, menu compact |
| Desktop | > 1024px | 3 kolom, full navbar, sidebar opsional |

---

## 12. Alur Pengguna (User Flows)

### 12.1 Alur Klien — Order Layanan
```
Buka Website → Lihat Homepage → Pilih Game (Kartu Game)
→ Baca Halaman Game → Pilih Layanan → Klik "Order via WhatsApp"
→ WhatsApp terbuka dengan pesan otomatis → Negosiasi dengan Admin → Deal
```

### 12.2 Alur Admin — Update Harga Layanan
```
Login Admin Panel → Pilih Menu "Games" → Pilih Game
→ Pilih Layanan yang ingin diubah → Klik Edit
→ Ubah harga / deskripsi → Simpan → Perubahan langsung tampil di website
```

### 12.3 Alur Admin — Tambah Testimoni Baru
```
Login Admin Panel → Menu "Testimoni" → Klik "Tambah Baru"
→ Isi form (nama, game, rating, isi, screenshot opsional)
→ Toggle "Tampilkan" → Simpan → Testimoni muncul di website
```

---

## 13. Kriteria Penerimaan (Acceptance Criteria)

### Frontend
- [ ] Semua 6 halaman game lengkap dan responsif
- [ ] Tombol WhatsApp berfungsi dengan pesan pre-filled di semua halaman
- [ ] Floating WhatsApp button muncul di semua halaman
- [ ] Homepage menampilkan semua seksi yang ditentukan
- [ ] Website load di bawah 3 detik pada koneksi 4G
- [ ] Tampil baik di Chrome, Firefox, Safari (mobile & desktop)

### Admin Panel
- [ ] Login aman dan session berfungsi
- [ ] Admin dapat menambah, edit, hapus layanan per game tanpa restart server
- [ ] Perubahan konten tampil di frontend dalam <5 detik setelah disimpan
- [ ] Upload gambar berfungsi (thumbnail game, screenshot testimoni)
- [ ] Semua setting global (nomor WA, teks hero, dll.) dapat diubah
- [ ] Admin panel responsif di desktop (tablet opsional)

### Integrasi WhatsApp
- [ ] Semua tombol order membuka WhatsApp dengan pesan yang benar
- [ ] Nomor WhatsApp dapat diubah via admin panel dan langsung berlaku

---

## 14. Milestones & Timeline (Estimasi)

| Fase | Durasi | Deliverable |
|---|---|---|
| **Fase 1 — Setup & Desain** | 1 minggu | Wireframe, design system, setup project |
| **Fase 2 — Frontend Core** | 2 minggu | Homepage, halaman game (template), komponen UI |
| **Fase 3 — Backend & API** | 1.5 minggu | Database, REST API, Auth admin |
| **Fase 4 — Admin Panel** | 1.5 minggu | UI admin, CRUD semua konten |
| **Fase 5 — Konten & Data** | 3 hari | Input semua data layanan 6 game |
| **Fase 6 — QA & Launch** | 3 hari | Testing, bug fix, deployment |
| **Total Estimasi** | **~6–7 minggu** | Website live & siap digunakan |

---

## 15. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Data layanan NTE belum lengkap | Halaman NTE kosong | Tampilkan placeholder "Coming Soon" dengan opsi notif via WA |
| Perubahan mekanik game tiba-tiba | Layanan tidak relevan | Admin panel memudahkan update cepat tanpa developer |
| Penyalahgunaan kontak WA | Spam | Nomor WA bisa diganti kapan saja via admin |
| Server down | Website tidak bisa diakses | Gunakan platform managed (Vercel + Railway/Supabase) dengan uptime tinggi |
| Admin lupa password | Tidak bisa masuk panel | Implementasi reset password via email |

---

## 16. Catatan Tambahan

- **Bahasa website:** Indonesia (default). Opsi Inggris dapat ditambahkan di fase berikutnya.
- **Dark mode:** Tidak diimplementasikan di v1 (prioritaskan konsistensi white theme).
- **Analytics:** Integrasikan Google Analytics atau Plausible (privacy-friendly) untuk tracking pengunjung.
- **Backup:** Database backup otomatis harian disarankan.
- **NTE:** Karena game belum dirilis resmi, halaman NTE dirancang fleksibel — admin dapat mengisi layanan secara bertahap setelah game launch.

---

*Dokumen ini bersifat living document dan dapat diperbarui seiring perkembangan produk.*

**Versi 1.0 — Dibuat: Mei 2026**