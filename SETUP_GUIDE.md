# SETUP_GUIDE.md - Panduan Setup Admin Dashboard

Dokumentasi lengkap dalam Bahasa Indonesia untuk setup Skill Drill Admin Dashboard.

## 📋 Daftar Isi

1. [Persyaratan](#persyaratan)
2. [Instalasi](#instalasi)
3. [Konfigurasi](#konfigurasi)
4. [Menjalankan Development Server](#menjalankan-development-server)
5. [Build untuk Production](#build-untuk-production)
6. [Struktur Project](#struktur-project)
7. [Fitur Utama](#fitur-utama)
8. [Troubleshooting](#troubleshooting)

## 🔧 Persyaratan

- Node.js v16+ dan npm/yarn
- Go backend API yang sudah running di `http://localhost:8080`
- Browser modern (Chrome, Firefox, Safari, Edge)

## 📦 Instalasi

### 1. Navigasi ke folder admin

```bash
cd admin
```

### 2. Install dependencies

```bash
npm install
```

atau jika menggunakan yarn:

```bash
yarn install
```

### 3. Setup environment variables

Buat file `.env` dari template:

```bash
cp .env.example .env
```

### 4. Konfigurasi API URL

Edit file `.env` dan sesuaikan URL API Anda:

```env
# Development
VITE_API_URL=http://localhost:8080/api

# Production (jika diperlukan)
# VITE_API_URL=https://api.yourdomain.com/api
```

## 🚀 Menjalankan Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5173`

**Fitur:**

- Hot reload otomatis saat file berubah
- Proxy API requests ke backend
- TypeScript checking

### Proxy API Otomatis

File `vite.config.ts` sudah mengkonfigurasi proxy:

```
/api -> http://localhost:8080/api
```

Jadi request ke `/api/users` akan di-proxy ke `http://localhost:8080/api/users`

## 📦 Build untuk Production

### 1. Build aplikasi

```bash
npm run build
```

Output akan berada di folder `dist/`

### 2. Preview production build

```bash
npm run preview
```

### 3. Deploy

Anda bisa deploy folder `dist/` ke:

- Vercel
- Netlify
- AWS S3 + CloudFront
- Nginx/Apache server
- GitHub Pages
- Atau host statis lainnya

**Penting:** Pastikan environment variable `VITE_API_URL` di-set dengan benar untuk production.

## 📁 Struktur Project

```
admin/
├── src/
│   ├── api/
│   │   └── client.ts              # API Client dengan Axios
│   │                               # Methods: login, logout, getUsers, createUser, etc.
│   │
│   ├── components/
│   │   ├── Layout.svelte          # Layout wrapper untuk pages
│   │   ├── Sidebar.svelte         # Navigation sidebar
│   │   ├── Table.svelte           # Reusable data table component
│   │   ├── UserForm.svelte        # Modal form untuk create/edit user
│   │   └── TopicForm.svelte       # Modal form untuk create/edit topic
│   │
│   ├── pages/
│   │   ├── Dashboard.svelte       # Halaman dashboard (home)
│   │   ├── Login.svelte           # Halaman login
│   │   ├── Users.svelte           # Halaman manajemen users
│   │   ├── Topics.svelte          # Halaman manajemen topics
│   │   └── GenerateQuestions.svelte  # Halaman generate questions
│   │
│   ├── stores/
│   │   ├── auth.ts                # Svelte store untuk authentication state
│   │   └── router.ts              # Svelte store untuk routing
│   │
│   ├── utils/
│   │   ├── helpers.ts             # Utility functions (format date, auth helpers)
│   │   └── router.ts              # Router utilities (navigate, getCurrentRoute)
│   │
│   ├── App.svelte                 # Root component dengan routing logic
│   ├── app.css                    # Global CSS styles
│   ├── main.ts                    # Entry point aplikasi
│
├── index.html                     # HTML template
├── vite.config.ts                 # Vite config dengan proxy API
├── tsconfig.json                  # TypeScript configuration
├── svelte.config.js               # Svelte configuration
├── package.json                   # Dependencies dan scripts
├── .env.example                   # Template environment variables
├── README.md                       # README dalam English
└── SETUP_GUIDE.md                 # Panduan ini

```

## ✨ Fitur Utama

### 🔐 Authentication Module

**File:** `src/pages/Login.svelte`

- Login dengan email dan password
- JWT token stored di localStorage
- Auto redirect ke dashboard saat login sukses
- Auto redirect ke login saat token expired (401)

**Credentials untuk Testing:**

```
Email: admin@example.com
Password: (sesuai dengan database Anda)
```

### 👥 Users Management

**File:** `src/pages/Users.svelte`

**Fitur:**

- ✅ Lihat semua users dalam table
- ✅ Tambah user baru dengan form modal
- ✅ Edit user (username, email, password, role)
- ✅ Hapus user dengan konfirmasi
- ✅ Filter dan sort (bisa ditambahkan)

**Endpoints:**

```
GET    /api/users           -> Get all users
GET    /api/users/:id       -> Get user by ID
POST   /api/users           -> Create user
PUT    /api/users/:id       -> Update user
DELETE /api/users/:id       -> Delete user
```

**User Fields:**

- `username`: string
- `email`: string (unique)
- `password`: string (hanya untuk create)
- `role`: "student" | "admin"
- `is_verified`: boolean
- `created_at`: datetime

### 📚 Topics Management

**File:** `src/pages/Topics.svelte`

**Fitur:**

- ✅ Lihat semua topics dalam table
- ✅ Tambah topic baru
- ✅ Edit topic (name, description)
- ✅ Hapus topic dengan konfirmasi

**Endpoints:**

```
GET    /api/topics           -> Get all topics
GET    /api/topics/:id       -> Get topic by ID
POST   /api/topics           -> Create topic
PUT    /api/topics/:id       -> Update topic
DELETE /api/topics/:id       -> Delete topic
```

**Topic Fields:**

- `name`: string (unique)
- `description`: text
- `created_at`: datetime

### ❓ Generate Questions

**File:** `src/pages/GenerateQuestions.svelte`

**Fitur:**

- ✅ Pilih topic dari dropdown
- ✅ Spesifikasi jumlah questions (1-50)
- ✅ Upload PDF file (max 10MB) - optional
- ✅ Generate questions menggunakan AI/LLM
- ✅ Display hasil dalam format Q&A dengan options dan answer

**Endpoints:**

```
POST /api/admin/generate-questions  -> Generate questions
```

**Request:**

```
Content-Type: multipart/form-data

Fields:
- topic_id: number
- num_questions: number (1-50)
- file_pdf: File (optional)
```

**Response:**

```json
{
  "success": true,
  "message": "Questions generated successfully",
  "data": {
    "questions": [
      {
        "text": "Question text...",
        "options": ["A", "B", "C", "D"],
        "answer": "A"
      }
    ]
  }
}
```

### 📊 Dashboard

**File:** `src/pages/Dashboard.svelte`

Halaman overview untuk admin (bisa ditambahkan stats, charts, dll)

## 🎨 Styling & Customization

### CSS Variables

Semua warna didefinisikan di `src/app.css` dan `:root`:

```css
--primary: #3366cc; /* Main color (blue) */
--secondary: #8899dd; /* Secondary color */
--danger: #dd3333; /* Red untuk delete/error */
--success: #33aa33; /* Green untuk success */
--warning: #ffaa00; /* Orange untuk warning */
--text: #333333; /* Text color */
--bg: #f5f5f5; /* Background color */
--border: #dddddd; /* Border color */
--radius: 8px; /* Border radius */
--shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
```

### Customize Warna

Edit di `src/App.svelte` atau `src/app.css`:

```css
:root {
  --primary: #your-color;
}
```

### Responsive Design

Layout sudah responsive untuk:

- Desktop (> 1024px)
- Tablet (768px - 1024px)
- Mobile (< 768px)

Sidebar akan berubah menjadi horizontal pada mobile.

## 🐛 Troubleshooting

### Problem: "Failed to load users"

**Solusi:**

1. Pastikan backend API running di `http://localhost:8080`
2. Cek di `.env` apakah `VITE_API_URL` benar
3. Cek browser console untuk error details
4. Pastikan CORS di-enable di backend

### Problem: "Login failed"

**Solusi:**

1. Verifikasi email dan password di database
2. Cek backend logs untuk error
3. Pastikan user role adalah "admin"
4. Cek token expiration di backend

### Problem: "Cannot upload PDF"

**Solusi:**

1. File harus format `.pdf` (bukan `.docx`, `.txt`, dll)
2. File size harus < 10MB
3. Pastikan backend PDF extractor service running
4. Cek backend logs untuk error

### Problem: API requests timeout

**Solusi:**

1. Pastikan backend API running
2. Cek network tab di browser DevTools
3. Increase timeout di `src/api/client.ts` jika perlu
4. Cek firewall/antivirus yang mungkin blocking requests

## 📝 Script Commands

```bash
# Development
npm run dev              # Start dev server dengan hot reload

# Build
npm run build            # Build untuk production
npm run preview          # Preview production build locally

# Type checking
npm run check            # Run TypeScript & Svelte checker

# Package management
npm install              # Install dependencies
npm update               # Update dependencies
npm outdated             # Check for outdated packages
```

## 🔐 Security Notes

1. **JWT Token:**
   - Stored di localStorage (simple tapi less secure)
   - Untuk lebih secure, gunakan httpOnly cookies (perlu backend support)

2. **API Requests:**
   - Semua requests dilakukan via HTTPS di production
   - Token di-attach otomatis ke header `Authorization: Bearer {token}`

3. **Environment Variables:**
   - Jangan commit `.env` ke git (sudah di `.gitignore`)
   - Hanya `.env.example` yang di-commit

## 📚 Dokumentasi Tambahan

### Svelte Resources

- [Svelte Documentation](https://svelte.dev)
- [Svelte Tutorial](https://learn.svelte.dev)
- [Svelte Stores](https://svelte.dev/docs#run-time-svelte-store)

### Vite Resources

- [Vite Documentation](https://vitejs.dev)
- [Vite Config Reference](https://vitejs.dev/config/)

### API Client (Axios)

- [Axios Documentation](https://axios-http.com)
- [Interceptors](https://axios-http.com/docs/interceptors)

## 🤝 Support

Jika ada error atau masalah:

1. Cek browser console (F12)
2. Cek backend server logs
3. Cek network tab di DevTools
4. Baca README.md untuk detail lebih

---

**Happy coding! 🚀**
