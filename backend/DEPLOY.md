# Deploy Backend ke Server Rumah

Panduan menjalankan API Express + Sequelize di server sendiri, dengan HTTPS.
> Detail server (IP/domain, OS, reverse proxy) nanti kita isi & simpan saat kamu kasih infonya.

## 1. Siapkan server
```bash
# Node.js LTS (contoh via nvm)
nvm install --lts

# Ambil kode
git clone <repo-kamu> && cd MainHariIni/backend
cp .env.example .env     # isi DATABASE_URL (Supabase), PORT, CORS_ORIGIN
npm install --omit=dev
```

## 2. Migrasi database
```bash
npm run db:migrate
npm run db:seed          # sekali saja, untuk data awal
```

## 3. Jalankan dengan PM2 (auto-restart)
```bash
npm i -g pm2
pm2 start src/server.js --name mau-kemana-api
pm2 save
pm2 startup             # ikuti instruksi agar jalan saat boot
```

## 4. Reverse proxy + HTTPS

### Opsi A — Caddy (paling simpel, HTTPS otomatis)
`/etc/caddy/Caddyfile`:
```
api.domainkamu.com {
    reverse_proxy localhost:4000
}
```
```bash
sudo systemctl reload caddy
```

### Opsi B — Nginx
`/etc/nginx/sites-available/mau-kemana`:
```nginx
server {
    server_name api.domainkamu.com;
    location / {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
```bash
sudo ln -s /etc/nginx/sites-available/mau-kemana /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d api.domainkamu.com   # HTTPS
```

## 5. Hubungkan frontend
Di frontend (Vercel / build statis), set env:
```
VITE_API_URL=https://api.domainkamu.com
```
Dan di backend `.env`, set origin frontend:
```
CORS_ORIGIN=https://mainhariini.vercel.app
```

## Catatan
- Pastikan port diteruskan dari router ke server (port forwarding) bila diakses dari internet.
- Jangan commit `.env`. Service key / password DB bersifat rahasia.
- Update aplikasi: `git pull && npm install --omit=dev && npm run db:migrate && pm2 restart mau-kemana-api`.
