# Echo Support Platform

Monorepo untuk platform customer support Echo, terdiri dari 2 aplikasi Next.js, backend Convex, dan package shared UI.

## 1. Arsitektur dan workspace

- `apps/web`: Dashboard internal (auth Clerk + data Convex), default port `3000`
- `apps/widget`: Widget yang di-embed ke situs client, default port `3001`
- `packages/backend`: Convex functions, schema, auth config
- `packages/ui`: Komponen UI reusable lintas app
- `packages/eslint-config`: Shared ESLint config workspace
- `packages/typescript-config`: Shared TypeScript config workspace

Monorepo ini dikelola dengan:

- `pnpm` workspaces
- `turbo` untuk orchestration task (`dev`, `build`, `lint`)

## 2. Prasyarat

- Node.js `>=20`
- pnpm `10.x`
- Git
- Akun/akses service:
  - Convex
  - Clerk
  - Vapi (jika fitur voice widget dipakai)

Setup pnpm (jika belum ada):

```bash
corepack enable
corepack prepare pnpm@10.4.1 --activate
```

## 3. Setup CLI yang dibutuhkan

### Convex CLI

Convex CLI dipakai dari dependency project (tidak wajib install global).

- Login Convex:

```bash
pnpm --filter @workspace/backend exec convex login
```

- Inisialisasi backend sampai deployment dev sukses (first setup):

```bash
pnpm --filter @workspace/backend setup
```

Perintah `setup` menjalankan `convex dev --until-success` untuk generate resource dan file `_generated` yang dibutuhkan.

### Clerk

Tidak ada CLI wajib dari repo ini, tapi Anda harus menyiapkan aplikasi Clerk dan JWT template untuk Convex (`applicationID: convex`).

## 4. Setup project dari nol

Untuk langkah clone ke folder baru, lihat panduan ringkas di `SETUP_NEW_FOLDER.md`.

Langkah utama dari root repo:

```bash
pnpm install
pnpm --filter @workspace/backend setup
pnpm dev
```

Saat `pnpm dev` berjalan:

- Web app: http://localhost:3000
- Widget app: http://localhost:3001

## 5. ENV yang diperlukan

Berikut ENV minimal berdasarkan pemakaian kode saat ini.

### Root (`.env.local`)

Tidak ada ENV root yang wajib saat ini. Root tetap membaca `.env*` untuk turbo cache/input.

### Backend Convex (`packages/backend/.env.local`)

```env
CLERK_SECRET_KEY=
CLERK_JWT_ISSUER_DOMAIN=
```

Keterangan:

- `CLERK_SECRET_KEY`: dipakai di action validasi organisasi.
- `CLERK_JWT_ISSUER_DOMAIN`: dipakai untuk auth provider Convex (Clerk JWT).

### Web app (`apps/web/.env.local`)

```env
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Keterangan:

- `NEXT_PUBLIC_CONVEX_URL`: wajib, dipakai oleh `ConvexReactClient`.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` dan `CLERK_SECRET_KEY`: dibutuhkan integrasi Clerk di Next.js.

### Widget app (`apps/widget/.env.local`)

```env
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_VAPI_API_KEY=
NEXT_PUBLIC_VAPI_ASSISTANT_ID=
```

Keterangan:

- `NEXT_PUBLIC_CONVEX_URL`: koneksi realtime ke Convex.
- `NEXT_PUBLIC_VAPI_API_KEY` dan `NEXT_PUBLIC_VAPI_ASSISTANT_ID`: wajib untuk fitur voice call widget.

## 6. Workflow development harian

1. Pull branch terbaru.
2. Jalankan `pnpm install` jika ada perubahan dependency.
3. Pastikan ENV lokal sudah terisi.
4. Jalankan `pnpm dev` dari root.
5. Jika mengubah schema/function Convex, jalankan backend dev agar `_generated` up-to-date:

```bash
pnpm --filter @workspace/backend dev
```

6. Sebelum push PR, jalankan quality checks:

```bash
pnpm lint
pnpm build
```

## 7. Command matrix

### Root

```bash
pnpm dev
pnpm build
pnpm lint
pnpm format
```

### Per package

```bash
# backend
pnpm --filter @workspace/backend dev
pnpm --filter @workspace/backend setup

# web
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web lint
pnpm --filter web typecheck

# widget
pnpm --filter widget dev
pnpm --filter widget build
pnpm --filter widget lint
pnpm --filter widget typecheck
```

## 8. Catatan integrasi

- Sentry untuk `apps/web` saat ini dikonfigurasi langsung di file config (DSN hardcoded).
- Auth middleware di `apps/web` memaksa user login dan memilih organization sebelum masuk area dashboard.
- Widget bergantung pada Convex URL yang sama dengan environment backend aktif.

## 9. Troubleshooting cepat

### Error `Missing NEXT_PUBLIC_CONVEX_URL`

Pastikan ENV tersebut ada di:

- `apps/web/.env.local`
- `apps/widget/.env.local`

### Convex gagal start atau auth error

- Pastikan sudah login Convex CLI.
- Jalankan ulang setup backend:

```bash
pnpm --filter @workspace/backend setup
```

- Verifikasi `CLERK_JWT_ISSUER_DOMAIN` dan `CLERK_SECRET_KEY` di `packages/backend/.env.local`.

### Widget voice tidak jalan

Pastikan `NEXT_PUBLIC_VAPI_API_KEY` dan `NEXT_PUBLIC_VAPI_ASSISTANT_ID` terisi di `apps/widget/.env.local`.

