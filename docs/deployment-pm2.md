# PM2 Deployment Flow

Dokumen ini menjelaskan langkah-langkah untuk melakukan deployment aplikasi **Construction Management** menggunakan PM2 di server produksi.

## Prasyarat

- Node.js (versi sesuai di `package.json`, disarankan v20+)
- NPM
- PM2 (`npm install -g pm2`)
- Git

## Persiapan Awal

1. Clone repositori ke server:

   ```bash
   git clone <repository-url>
   cd project-construction-management
   ```

2. Instalasi dependensi:

   ```bash
   npm install
   ```

3. Konfigurasi Environment Variables:
   - Salin `.env.example` ke `.env` di setiap folder aplikasi:
     - `apps/api/.env`
     - `apps/web/.env`
   - Sesuaikan konfigurasi database, JWT secret, dan API URL.

## Langkah-langkah Build

Sebelum menjalankan aplikasi dengan PM2, kita perlu melakukan build untuk aplikasi API dan Web.

```bash
# Build seluruh aplikasi menggunakan Turbo
npm run build
```

## Menjalankan Aplikasi dengan PM2

Tersedia file `ecosystem.config.js` di root direktori untuk mempermudah manajemen proses.

### 1. Menjalankan Aplikasi

```bash
pm2 start ecosystem.config.js
```

### 2. Memeriksa Status

```bash
pm2 status
```

### 3. Memantau Log

```bash
pm2 logs
# Atau log spesifik aplikasi
pm2 logs construction-api
pm2 logs construction-web
```

### 4. Menyimpan Daftar Proses

Agar PM2 otomatis menjalankan aplikasi kembali setelah server restart:

```bash
pm2 save
pm2 startup
```

_(Ikuti instruksi yang muncul di terminal setelah menjalankan `pm2 startup`)_

## Update Aplikasi (Redeploy)

Gunakan script berikut untuk melakukan update aplikasi yang sudah berjalan:

```bash
# Tarik perubahan terbaru
git pull origin main

# Instalasi jika ada dependensi baru
npm install

# Rebuild aplikasi
npm run build

# Restart aplikasi di PM2
pm2 restart ecosystem.config.js
```

## Troubleshooting

- **API Port Conflict**: Pastikan port yang digunakan di `apps/api` tidak bentrok dengan aplikasi lain.
- **Web Build Error**: Jika build Next.js gagal, coba hapus folder `.next` dan jalankan build ulang: `rm -rf apps/web/.next && npm run build`.
- **Database Connection**: Pastikan database server (SQLite/PostgreSQL) dapat diakses oleh aplikasi API.
