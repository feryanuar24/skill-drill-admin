# 🚀 QUICKSTART - Admin Dashboard

**Panduan Cepat untuk mulai menggunakan Admin Dashboard dalam 5 menit!**

## 1️⃣ Prerequisites Check

Pastikan Anda sudah punya:

```bash
# Check Node.js version (minimal v16)
node --version
npm --version

# Check backend API running
curl http://localhost:8080/api/health
# Response: {"data":null,"message":"API is running","success":true}
```

## 2️⃣ Install & Setup (2 minutes)

```bash
# Navigate ke folder admin
cd admin

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Pastikan .env memiliki:
# VITE_API_URL=http://localhost:8080/api
```

## 3️⃣ Run Development Server (1 minute)

```bash
npm run dev
```

Output akan terlihat seperti:

```
  VITE v... dev server running at:

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## 4️⃣ Access Dashboard

Buka browser ke: **http://localhost:5173**

Anda akan diminta login:

```
Email: admin@example.com
Password: (sesuai database Anda)
```

## 5️⃣ Start Exploring! 🎉

### Left Sidebar Navigation:

1. **Dashboard** 📊 - Overview page (bisa dikustomisasi)
2. **Users** 👥 - Kelola users
3. **Topics** 📚 - Kelola topics
4. **Generate Questions** ❓ - Generate questions dari PDF

---

## ⚡ Quick Tasks

### Task 1: Tambah User Baru

1. Click "👥 Users" di sidebar
2. Click "+ Add New User"
3. Fill form:
   - Username: `john_doe`
   - Email: `john@example.com`
   - Password: `securepass123`
   - Role: `student`
4. Click "Save"

### Task 2: Buat Topic Baru

1. Click "📚 Topics" di sidebar
2. Click "+ Add New Topic"
3. Fill form:
   - Topic Name: `Mathematics`
   - Description: `Algebra, Geometry, Calculus`
4. Click "Save"

### Task 3: Generate Questions

1. Click "❓ Generate Questions" di sidebar
2. Select topic: `Mathematics`
3. Number of Questions: `5`
4. (Optional) Upload PDF file
5. Click "Generate Questions"
6. Lihat hasil generated questions

---

## 🔧 Common Issues & Fixes

### ❌ "API URL is not configured"

**Fix:**

```bash
# Check .env file
cat .env

# Should output:
# VITE_API_URL=http://localhost:8080/api

# Restart dev server
npm run dev
```

### ❌ "Failed to login - Network error"

**Fix:**

```bash
# Pastikan backend API running
curl http://localhost:8080/api/health

# Jika tidak running, start Go backend:
cd backend
go run cmd/api/main.go
```

### ❌ "401 Unauthorized"

**Fix:**

```bash
# Check credentials
# Pastikan email dan password benar di database

# Clear localStorage dan login ulang
# Buka DevTools (F12) > Console:
localStorage.clear()
# Refresh halaman dan login lagi
```

### ❌ "Cannot upload PDF"

**Fix:**

1. File harus `.pdf` (bukan `.docx`, `.txt`)
2. File size < 10MB
3. Backend PDF extractor harus running

---

## 📚 Project Structure

```
admin/
├── src/
│   ├── pages/
│   │   ├── Login.svelte            ← Login page
│   │   ├── Dashboard.svelte        ← Home
│   │   ├── Users.svelte            ← Users CRUD
│   │   ├── Topics.svelte           ← Topics CRUD
│   │   └── GenerateQuestions.svelte ← AI questions
│   ├── components/
│   │   ├── Sidebar.svelte          ← Navigation
│   │   ├── Layout.svelte           ← Layout wrapper
│   │   ├── Table.svelte            ← Data table
│   │   ├── UserForm.svelte         ← User form modal
│   │   └── TopicForm.svelte        ← Topic form modal
│   ├── api/
│   │   └── client.ts               ← API client (Axios)
│   ├── stores/
│   │   ├── auth.ts                 ← Auth state
│   │   └── router.ts               ← Router state
│   ├── App.svelte                  ← Root component
│   └── main.ts                     ← Entry point
├── .env                            ← Environment config
├── package.json                    ← Dependencies
└── index.html                      ← HTML template
```

---

## 🎯 Next Steps

1. **Customize UI:** Edit warna di `src/app.css`
2. **Add Dashboard Stats:** Edit `src/pages/Dashboard.svelte`
3. **Add Filters/Search:** Extend `src/components/Table.svelte`
4. **Add More Features:** Create new pages di `src/pages/`
5. **Deploy to Production:** Build dengan `npm run build`

---

## 📖 Full Documentation

Untuk dokumentasi lengkap, baca:

- [README.md](./README.md) - English documentation
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Indonesian setup guide

---

## 🆘 Need Help?

1. Check browser console (F12) for errors
2. Check backend server logs
3. Read the documentation files
4. Check Svelte docs: https://svelte.dev

---

**Happy Coding! 🎉**

```
╔══════════════════════════════════╗
║  Admin Dashboard is Ready! 🚀   ║
║  http://localhost:5173           ║
╚══════════════════════════════════╝
```
