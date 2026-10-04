# Konten TikTok — "Ngedate Bareng Ayang"

Video 9:16 (1080×1920, 30 fps, ±50 detik) direkam **langsung dari aplikasinya** dengan data contoh,
jadi tidak ada riwayat asli kalian yang ikut tampil. File: `ngedate-tiktok.mp4`.

> **Video ini tanpa suara.** Saat upload, pilih *sound* yang lagi tren di TikTok (lo-fi / cute / chill
> cocok dengan nuansa pixel-nya). Konten dengan sound tren terangkat algoritma jauh lebih mudah
> daripada musik sendiri.

## Alur video (timestamp)

| Detik | Yang tampil | Teks di layar |
|------:|-------------|---------------|
| 0–1 | Beranda aplikasi | **pacar: "terserah~" 🙄** |
| 1–2 | | **aku: *bikin website* 💻** |
| 2–5 | Jari tekan SPIN, nama tempat berputar | **biar semesta yang milih ✨** |
| 5–8 | Hasil: Museum Nasional + "belum pernah ke sini" | **nggak ada lagi debat 1 jam 😮‍💨** — *bahkan tau kalian udah pernah ke sana atau belum* |
| 8–14 | Filter HEMAT + BELUM PERNAH → spin → Taman Suropati (gratis) | **tanggal tua? 💸** — *filter budget + "belum pernah"* → **gratis & belum pernah 🌿** |
| 14–18 | Tombol JADWALKAN → pilih tanggal | **belum bisa sekarang?** — *jadwalin aja 📌* |
| 18–23 | Tab Riwayat: kalender ♥ ★ 📌, ketuk tanggal → detail | **kalender kencan kita ♥** — *♥ udah pergi · ★ naik level · 📌 rencana* |
| 23–30 | Ketuk 📌 → UDAH PERGI → **perayaan naik level LV.03 "Partner Jajan"** | **abis jalan? tandain ✅** → **tiap 3x jalan NAIK LEVEL 🎉** — *dapet gelar baru tiap level* |
| 30–37 | Jurnal: 5 hati, ketik cerita, tambah foto, simpan | **terus tulis ceritanya 📸** — *rating · catatan · foto* |
| 37–42 | Pilih kategori → karakter berkomentar, kucing tidur | **karakternya ikut komen 💬** — *beda kategori, beda celetukan* |
| 42–45 | Layar kunci PIN | **cuma kita berdua yang bisa buka 🔒** |
| 45–50 | Kartu penutup: karakter, link, Zavokra, CTA | **ngedatebarengayang.zavokra.com** — *bikin buat kita berdua ♥* — *dibikin sama ZAVOKRA* — *mau versi kalian? DM ya 💌* |

**Kenapa 5 detik pertamanya begini:** baris pertama adalah kalimat yang hampir semua pasangan pernah
dengar ("terserah"), jadi penonton langsung merasa *"ini gue banget"*. Baris kedua memberi twist
(solusinya bikin website, bukan ngambek). Detik ke-2 sampai 5 ada gerakan terus (nama tempat berputar)
dan "hadiah"-nya (hasil keluar) jatuh tepat di detik ke-5, sebelum orang sempat swipe.

## Caption (pilih satu)

**A — relatable (saran utama)**
> capek debat "mau makan di mana" tiap weekend, akhirnya aku bikinin pacarku website sendiri 🥹
> tinggal SPIN, semesta yang milih. ada kalender kencan, naik level tiap 3x jalan, sama jurnal foto.
> cuma kita berdua yang punya PIN-nya 🔒
>
> mau dibikinin versi kalian berdua? DM aja 💌 — @zavokra

**B — pendek**
> pacar: terserah
> aku: *bikin website* 💻
> sekarang nggak pernah debat lagi ✨ link di bio

**C — sudut bisnis**
> ini project kecil Zavokra buat pasangan: spin tempat kencan, kalender ♥, level & gelar, jurnal foto.
> bisa dibikin custom pakai nama & karakter kalian sendiri. DM buat tanya 💌

## Hashtag

Gabungkan 1–2 yang besar + 3–4 yang spesifik; jangan lebih dari ±8.

`#pasangan #couplegoals #ideKencan #ngedate #longdistance #webdeveloper #pixelart #zavokra #fyp #ideDate`

## Tips posting

- **Link**: caption TikTok tidak bisa diklik; taruh `ngedatebarengayang.zavokra.com` di **bio**, dan tulis
  "link di bio" di caption. Sematkan komentar pertama berisi link + "DM kalau mau versi kalian".
- **Jam tayang**: 18.00–21.00 WIB hari kerja, atau Jumat–Minggu sore.
- **Cover**: pilih frame detik ke-5 (hasil "Museum Nasional" + caption "nggak ada lagi debat 1 jam"),
  atau detik ke-26 (perayaan naik level) sebagai sampul.
- **Balas komentar dengan video**: pertanyaan "bikinnya pakai apa?", "bisa custom?" → bahan konten lanjutan.
- Kalau mau yang lebih pendek (15–20 detik) untuk versi kedua: potong di detik 23 (setelah kalender)
  lalu langsung ke kartu penutup. Video pendek biasanya punya *completion rate* lebih tinggi.

## Variasi hook (untuk A/B)

Ganti dua baris pertama di `record-tiktok.cjs` (bagian `HOOK`) lalu rekam ulang:

1. `POV: pacar kamu bilang "terserah" ke-100 kalinya` → `jadi aku bikin ini`
2. `kami udah 3 bulan nggak debat "makan di mana"` → `rahasianya: website 540 baris`
3. `hadiah anniversary yang nggak bisa dibeli 🎁` → `aku coding-in sendiri`

## Rekam ulang

```bash
cd frontend && npm run build && npx vite preview --port 4173 &
node promo/record-tiktok.cjs promo/out      # hasil: promo/out/ngedate-tiktok.mp4
```

Semua teks, tempo, dan data contoh ada di `promo/record-tiktok.cjs`. Nama tempat contoh bisa diganti
dengan tempat favorit kalian supaya terasa lebih personal.
