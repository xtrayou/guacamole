# User Management System - SISKEUDES

## Fitur Terbaru

### Data Import

- ✅ **183 User Desa** berhasil diimpor dari CSV
- ✅ Format: ID, Nama Desa, Username (admin_xxxxx), Password
- ✅ Semua user memiliki role 'admin' dan status 'active'

### User Management Dashboard

- ✅ **Pagination**: 5/10/25/50 users per halaman
- ✅ **Search**: Cari berdasarkan username, nama desa, atau full name
- ✅ **CRUD Operations**: Create, Read, Update, Delete users
- ✅ **Kolom Desa**: Menampilkan nama desa untuk setiap user

### Statistik Dashboard

- ✅ **Total Users**: 183 users dari seluruh desa
- ✅ **Total Connections**: Jumlah koneksi RDP
- ✅ **Total Desa**: Jumlah desa unik yang terdaftar

### Struktur Database

```sql
Table: users
- id (auto_increment)
- username (unique)
- password
- full_name
- desa (nama desa)
- email
- role (admin/operator/viewer)
- status (active/inactive)
- last_login
- created_at
- updated_at
```

## Cara Penggunaan

### 1. Mengakses Dashboard

- Buka browser: `http://localhost:3000`
- Login dengan kredensial admin
- Pilih "User Management" di sidebar

### 2. Pencarian User

- Ketik nama desa atau username di kolom search
- Hasil akan difilter secara otomatis (debounced 500ms)
- Pagination tetap berfungsi dengan hasil search

### 3. Mengelola User

- **Add User**: Klik tombol "+ Add User"
- **Edit User**: Klik tombol "Edit" di baris user
- **Delete User**: Klik tombol "Delete" dengan konfirmasi
- **Manage Connections**: Atur koneksi RDP untuk user

### 4. Navigasi Data

- Gunakan dropdown "Rows per page" untuk mengatur jumlah tampilan
- Tombol "Prev"/"Next" untuk navigasi halaman
- Info "Page X of Y" menunjukkan posisi saat ini

## File-file Penting

### Scripts

- `scripts/import-users.js` - Import data dari CSV
- `scripts/cleanup-users.js` - Bersihkan data user lama

### Database

- `data/USERPASSWORD.csv` - Data user original
- `.env` - Konfigurasi database (USE_MYSQL=true)

### API Endpoints

- `GET /api/users?page=1&limit=10&search=xxx` - List users dengan pagination dan search
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/stats` - Dashboard statistics

## Database Connection

- **Database**: siskeudes_db
- **Host**: 127.0.0.1:3306
- **User**: root
- **Connection Pool**: 10 connections
- **Auto-load**: .env dengan dotenv

## Contoh Data User

```
Username: admin_3214092009
Desa: Ciawi
Role: admin
Status: active
Password: 531369
```

Total: 183 user dari berbagai desa di wilayah Purwakarta (kode area 3214)
