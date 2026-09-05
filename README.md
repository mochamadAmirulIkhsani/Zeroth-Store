<div align="center">

# 🎮 Zeroth Store

**Platform Joki Game Profesional & Terpercaya**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)

Layanan joki game gacha & action RPG — aman, cepat, harga terjangkau.

</div>

---

## ✨ Fitur

### Sisi Publik
- 🏠 **Landing page** — hero, statistik animasi, testimoni, FAQ, CTA WhatsApp
- 🎮 **Daftar game** — pencarian, urutkan (A–Z / layanan terbanyak), filter min. layanan
- 📋 **Detail game** — daftar layanan + filter kategori, harga & durasi, alur joki, jaminan keamanan, testimoni per game
- ⭐ **Testimoni** — rating rata-rata, filter game & bintang, pagination
- ❓ **FAQ** — akordeon & filter kategori
- 💬 **Order via WhatsApp** — semua CTA membuka chat WA admin dengan template pesan otomatis

### Admin Panel
- 🔐 **Login** — email + password, JWT + bcrypt, role ADMIN/OWNER
- 📊 **Dashboard** — ringkasan: game aktif, total layanan, testimoni, FAQ + statistik publik + quick actions
- 🎮 **Manajemen game** — tambah, edit (gambar, nama, tagline, deskripsi, warna), aktif/nonaktif, hapus (dengan konfirmasi)
- 🛠️ **Kelola layanan** — CRUD layanan per game (nama, deskripsi, durasi, harga, kategori, aktif, template WA)
- 💬 **Testimoni** — CRUD lengkap, featured, aktif/nonaktif
- ❓ **FAQ** — CRUD per kategori
- ⚙️ **Pengaturan** — WhatsApp number, headline hero, statistik publik
- 👥 **User Admin** — (OWNER only) tambah/hapus user admin, pilih role ADMIN/OWNER; semua admin bisa ganti password sendiri

---

## 🧱 Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 18, TypeScript, Vite 6, Tailwind CSS, Framer Motion, React Router |
| Backend | Node.js 20+, Express 5 (ESM `.mjs`) |
| Database | PostgreSQL via Supabase, Prisma 6.19 ORM (engine client + driver adapter) |
| Auth | Manual JWT + bcrypt (tanpa managed auth) |

**Arsitektur:** `server.mjs` (entry) → `backend/` (routes per resource) → Prisma (`engineType = "client"` + `@prisma/adapter-pg`) → Supabase Postgres. Frontend menarik data via REST API (`/api/*`) dan menyimpan state di localStorage. Deploy monolith ke Vercel: frontend (dist/) + API satu domain (same-origin, tanpa CORS).

---

## 🚀 Menjalankan

### Prasyarat
- Node.js ≥ 20 (direkomendasikan 24)
- Akun Supabase + Project Postgres
- File `.env` di root:

```env
DATABASE_URL="postgresql://...:6543/postgres?pgbouncer=true&sslmode=require&schema=public"
DIRECT_URL="postgresql://...:5432/postgres?sslmode=require&schema=public"
JWT_SECRET="<secret-panjang-acak>"
```

> `DATABASE_URL` memakai **transaction pooler** (`:6543`) — kode memakai operasi non-transaksional agar kompatibel dengan pgbouncer. `DIRECT_URL` (`:5432`) dipakai CLI Prisma (db push / migrate / seed).
>
> `JWT_SECRET` wajib (fail-fast: server menolak start kalau kosong/default). Untuk dev terpisah (API 4000 + web 5173), set `CORS_ORIGIN=http://localhost:5173` dan `VITE_API_BASE_URL=http://localhost:4000`. Deploy monolith Vercel: biarkan kosong (same-origin).

Kopi dari template: `cp .env.example .env` — isi `JWT_SECRET`, `DATABASE_URL`, `DIRECT_URL`.

### Install & Sinkronkan Database

```bash
npm install
npm run db:push     # sinkronkan schema Prisma ke Supabase
npm run db:seed     # seed data awal (games, layanan, testimoni, FAQ, admin)
```

### Jalankan Dev (dua terminal)

```bash
npm run dev:api     # API backend — http://localhost:4000 (node --watch)
npm run dev:web     # Frontend Vite — http://localhost:5173
```

Buka **http://localhost:5173**.

> CORS: saat dev terpisah (5173 → 4000), set `CORS_ORIGIN=http://localhost:5173` dan `VITE_API_BASE_URL=http://localhost:4000` di `.env`.

### Build Produksi

```bash
npm run build       # bundle Vite + generate Prisma Client
```

---

## 🚀 Deploy ke Vercel (Free Plan)

Monolith: frontend (dist/) + API (server.mjs serverless) satu domain, same-origin (tanpa CORS).

1. Push repo ke GitHub.
2. Vercel → New Project → Import repo (Framework Preset: *Other*).
3. Set Environment Variables di Vercel:
   - `DATABASE_URL` — pooler `:6543?pgbouncer=true`
   - `DIRECT_URL` — direct `:5432` (dipakai CLI, opsional di Vercel)
   - `JWT_SECRET` — acak ≥ 32 char
   - `NODE_ENV=production`
   - `VITE_API_BASE_URL=` (kosong = same-origin)
   - `CORS_ORIGIN=` (kosong = same-origin)
4. **Schema DB dulu**: sebelum deploy pertama, terapkan schema ke Supabase (SQL editor, atau `npx prisma db push` dari lokal — memakai `DIRECT_URL`). Lalu seed admin: set `ADMIN_EMAIL`/`ADMIN_PASSWORD` env lalu redeploy, atau jalankan `npm run db:seed` via terminal.
5. Deploy. Build otomatis: `vite build && prisma generate` (`vercel-build`).

> `server.mjs` otomatis skip `listen()` saat `VERCEL=1` — Vercel inject handler sendiri.
> `.env` tidak ikut ter-commit (git-ignored) — semua rahasia via Vercel env.

---

## 📜 Scripts

| Script | Fungsi |
|---|---|
| `npm run dev:api` | Jalankan API dengan `node --watch` (auto-restart) |
| `npm run dev:web` | Jalankan Vite dev server |
| `npm run dev` | Jalankan keduanya via Node (port 4000 + 5173) |
| `npm run build` | Build produksi frontend + generate Prisma Client |
| `npm run db:push` | Sinkronkan schema Prisma ke DB (`prisma db push` — pakai `DIRECT_URL`) |
| `npm run db:seed` | Seed/reset data kanonik |

---

## 🗂️ Struktur Proyek

```
├── server.mjs               # Entry API: Express + helmet + rate limit + CORS + mounts routes
│                            # prod: serve dist/ (static + SPA fallback); skip listen() di Vercel
├── backend/
│   ├── lib/prisma.mjs       # PrismaClient (engine client + adapter-pg) + JWT_SECRET (shared)
│   ├── middleware/          # auth.mjs (verifyToken/requireRole), security.mjs (cleanStr/sanitize)
│   ├── utils/serializeGame.mjs  # Prisma row → kontrak frontend
│   └── routes/              # admin, games, testimonials, faqs, settings, stats, categories
├── prisma/
│   ├── schema.prisma        # User, Game, Service, ServiceCategory, FAQ, Testimonial, GlobalSettings, Stats
│   └── seed.mjs             # Seeder idempotent (wipe + recreate)
├── prisma.config.ts         # Konfigurasi Prisma (schema path, seed)
├── vercel.json              # Routing Vercel: /api/* → server.mjs, sisanya → dist/
├── src/
│   ├── app/
│   │   ├── context/AppContext.tsx   # State global + persist localStorage + bootstrap API
│   │   ├── pages/                  # Home, Games, GameDetail, Testimoni, FAQ, Kontak + admin/*
│   │   ├── components/             # UI komponen (carousel, formatDate, ...)
│   │   └── data/gameData.ts        # Data awal statis + tipe TS
│   └── main.tsx
```
Admin routes: `/admin` (login), `/admin/dashboard`, `/admin/games`, `/admin/services`, `/admin/testimonials`, `/admin/faq`, `/admin/settings`, `/admin/users` (User Admin), `/admin/whatsapp`.

---

## 🗄️ Model Data

- **User** — admin/owner (`role: ADMIN | OWNER`), password bcrypt
- **Game** — profil game (slug, nama, tagline, deskripsi, warna, gambar, status `active/inactive`, urutan, template WA)
- **Service** — layanan per game (nama, deskripsi, durasi, harga, kategori, aktif, template WA) — *FK Cascade ke Game*
- **ServiceCategory** — kategori layanan (slug, nama, warna)
- **Testimonial** — ulasan klien (game, rating, konten, tanggal, featured)
- **FAQ** — pertanyaan + jawaban + kategori
- **GlobalSettings** — nomor WA, headline hero, jam operasional, social media (Json)
- **Stats** — statistik publik (order selesai, game dilayani, kepuasan, klien aktif)

> `HowItWorksStep` & `SecurityNote` sengaja **tidak** di database — konten statis di `backend/constants.mjs` (sama untuk semua game).

---

## 📌 Catatan

- Seeder idempotent — aman dijalankan berulang (wipe + recreate, tidak menumpuk duplikat).
- Admin PUT `/api/games` memakai upsert-by-slug + hapus yang absen + `Promise.all` (≈3 detik untuk semua game).
- Login admin default (dari seed): `admin@zeroth.store` — **role `OWNER`** (pemilik; bisa manage user). Ganti password via seed/data atau panel *User Admin* → *Ganti Password Saya*. Di production, set `ADMIN_EMAIL`/`ADMIN_PASSWORD` env untuk seed admin pertama.
- **Role & akses:** `ADMIN` = semua menu kecuali *User Admin*; `OWNER` = tambahan manage user (list/create/delete). Password admin bisa diganti sendiri oleh siapa pun yang login (`PUT /api/admin/password`).
- Database: `DATABASE_URL` (pooler `:6543`) untuk runtime — **tidak mendukung interactive `$transaction`**. `DIRECT_URL` (`:5432`) untuk CLI Prisma (db push / migrate / seed).
- Prisma `engineType = "client"` + `@prisma/adapter-pg` — kompatibel Vercel serverless. Versi adapter harus sama dengan prisma core (`@prisma/adapter-pg@6.x` ↔ prisma 6.19).
- `.env` dan semua variannya git-ignored; rahasia produksi via env Vercel.
- Detail lengkap untuk agent/developer lanjutan: `docs/DEVELOPMENT_HANDOFF.md`.

---

<div align="center">

Dibuat dengan ❤️ 

</div>