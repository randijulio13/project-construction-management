# Project Rules & Best Practices

Dokumen ini berisi aturan standar pengembangan untuk proyek **Construction Management**. Gunakan dokumen ini sebagai referensi utama saat melakukan coding atau memberikan instruksi kepada AI.

## 1. Arsitektur & Pola Pikir (Mindset)

### Single Responsibility Principle (SRP)
- Setiap file/fungsi/komponen hanya boleh memiliki **satu tanggung jawab**.
- Jika sebuah fungsi melakukan lebih dari satu hal (misal: fetching data DAN manipulasi DOM), pecah menjadi dua.

### DRY (Don't Repeat Yourself)
- **Shared Packages First**: Sebelum membuat fungsi utilitas baru, cek `packages/shared`.
- Pindahkan logika yang digunakan di lebih dari satu aplikasi (Web & API) ke `packages/shared`.

## 2. Frontend (Next.js / React)

### Reusability
- **DILARANG** membuat ulang komponen UI dasar (Button, Input, Modal, dll) secara manual menggunakan utility classes jika komponen tersebut sudah tersedia di `components/ui`.
- Folder `components/ui` adalah pustaka komponen yang dikelola oleh **shadcn/ui**.
- Selalu gunakan perintah `npx shadcn@latest add <component-name>` untuk menambahkan komponen UI baru dari shadcn/ui.
- Cek folder `components/ui` terlebih dahulu sebelum melakukan styling manual. Gunakan komponen yang sudah ada dan tambahkan props jika butuh variasi atau styling tambahan melalui `className` (menggunakan `cn` helper).
- Jika komponen UI dasar belum ada dan tidak tersedia di shadcn/ui, buat di `components/ui` dengan standar yang konsisten agar bisa digunakan kembali di tempat lain.

### Icons
- Selalu gunakan library **Lucide React** untuk icon. Library ini sudah terpasang di `@construction/web`.
- **DILARANG** menggunakan font icon eksternal seperti Material Symbols atau Font Awesome kecuali ada kebutuhan khusus yang sudah disetujui.
- Import icon langsung dari `lucide-react` (contoh: `import { Mail, Lock } from "lucide-react"`).

### Page Decomposition
- **DILARANG** membuat 1 file halaman yang sangat panjang (monolith).
- Pecah halaman menjadi sub-komponen fungsional:
  - `components/UserForm.tsx`
  - `components/StatHero.tsx`
  - `components/ActionLayout.tsx`
### Styling & Colors
- Selalu gunakan **semantic colors** yang didefinisikan di `apps/web/app/globals.css` (contoh: `bg-background`, `text-primary`, `border-input`).
- **DILARANG** menggunakan hardcoded hex/rgb colors di dalam komponen. Gunakan variabel CSS yang sudah disediakan oleh shadcn/ui setup.

### Internationalization (i18n)
- **DILARANG** menulis teks bahasa Indonesia atau Inggris secara langsung (hardcoded) di dalam komponen.
- Selalu gunakan library `next-intl` dan hook `useTranslations()`.
- Letakkan semua string terjemahan di dalam folder `messages/` (contoh: `id.json`, `en.json`).
- Gunakan komponen `Link`, `usePathname`, and `useRouter` dari `@/i18n/routing` untuk navigasi yang sadar bahasa (locale-aware).


## 3. Backend (API / Express)

### Backend Architecture
- **Controller**: Mengurus request/response serta logika bisnis utama.
- **Entity**: Definisi database (TypeORM).
- Gunakan Middleware untuk autentikasi dan otorisasi.

## 4. Konvensi Penamaan (Naming Convention)

| Tipe | Format | Contoh |
| :--- | :--- | :--- |
| **Folder / File** | `kebab-case` | `user-profile.tsx`, `auth-service.ts` |
| **Komponen React** | `PascalCase` | `SubmitButton.tsx`, `Sidebar.tsx` |
| **Variabel / Fungsi** | `camelCase` | `isLoading`, `getUserData()` |
| **Type / Interface** | `PascalCase` | `UserResponse`, `AppConfig` |

## 5. TypeScript & Validasi
- **Strict Mode**: Hindari penggunaan `any`. Selalu definisikan type/interface.
- **Runtime Validation**: Gunakan `Zod` untuk memvalidasi input dari user atau response dari API.

## 7. Sinkronisasi Tipe Data (Type Synchronization)
- **Shared Types**: Return type dari API Controller dan parameter Action di Frontend **WAJIB** menggunakan interface yang sama dari `packages/shared`.
- **DILARANG** melakukan redefinisi interface yang sama di dua tempat berbeda (Backend & Frontend).
- Jika ada perubahan struktur data di Backend, perbarui interface di `packages/shared` agar TypeScript memberikan error di Frontend jika tipe data tidak sesuai.

## 8. Middleware & Routing
- **Halaman Baru**: Setiap kali menambahkan halaman baru yang membutuhkan autentikasi (protected route), pastikan untuk menambahkannya ke list `isProtectedRoute` di `apps/web/middleware.ts`.
- **Public vs Protected**: Pisahkan dengan jelas mana rute yang bisa diakses publik dan mana yang harus login.

---

*Gunakan aturan ini setiap saat untuk menjaga kualitas kode yang tinggi.*
