# Authentication Settings

## Authentication Method

- Provider : Email & Password Authentication
- Authentication Service : Supabase Authentication
- Session Management : JWT (JSON Web Token)
- Email Confirmation : Disabled (Development)
- Password Recovery : Enabled

---

## User Roles


Fitur |Admin	|Pegawai|	User|
Melihat seluruh dokumen|	✔|	✖|	✖|
Melihat dokumen sendiri	|✔|✔|	✔|
Menambah dokumen	|✔|	✔	|✔|
Mengubah dokumen sendiri|	✔|✔|✔|
Mengubah dokumen pengguna lain	|✔|✖|	✖|
Menghapus dokumen |✔|	✖|	✖|

---

## Example Login (Testing)

### Admin
Email    : admin@gmail.com
Password : 123456

### Pegawai
Email    : pegawai@gmail.com
Password : 123456

### User
Email    : user@gmail.com
Password : 123456

---

## Database Roles

Supabase Default Roles:
- authenticated
- anon

Application Roles:
- admin
- pegawai
- user

---

## Authorization

Role-Based Access Control (RBAC) diterapkan menggunakan tabel `profiles` yang menyimpan atribut `role`.

nilai role:
- admin
- pegawai
- user

Row Level Security (RLS) digunakan untuk membatasi akses data berdasarkan role pengguna dan identitas pengguna (`auth.uid()`).
