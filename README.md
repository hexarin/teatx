## Fitur

- Mengirimkan token TEA ke setiap alamat.
- Memungkinkan pengguna untuk memasukkan daftar alamat secara manual.
- Dapat mengirimkan token ERC-20 ke alamat-alamat yang terdaftar, menggunakan private key dari file .env.

## Persyaratan

- Node.js (pastikan versi terbaru sudah terpasang).
- Private key Anda sendiri yang disimpan di file `.env`.

## Instalasi

Ikuti langkah-langkah berikut untuk menginstal dan menjalankan skrip:

### 1. Clone Repositori

Clone repositori ini ke komputer lokal Anda:

```bash
git clone https://github.com/hexarin/teatx.git

cd teatx

npm install

- Perbarui file .env dengan alamat smart contract token TEA di TOKEN_ADDRESS , set banyaknya tx di NUM_TX , set banyaknya token yg akan di kirim di AMOUNT, 

- Jalankan skrip dengan perintah berikut:

node index.js
