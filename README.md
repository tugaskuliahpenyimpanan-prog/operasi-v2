# OK Operasi · Alkes & Obat

Aplikasi manajemen alat kesehatan dan obat untuk kamar operasi. Berjalan sepenuhnya di browser — tidak perlu server, data tersimpan lokal di perangkat.

## Fitur
- Manajemen 6 kamar operasi
- Pencatatan barang diambil & retur
- Input suara 🎤 (ucapkan "alkohol 5")
- Preset & template barang
- Riwayat operasi
- Inventaris global
- Export Excel & berbagi via QR/WhatsApp
- PWA — bisa diinstall & dipakai offline

## Deploy ke GitHub Pages

1. Upload semua file ini ke repository GitHub
2. Buka **Settings → Pages**
3. Source: **Deploy from a branch** → Branch: `main` → Folder: `/ (root)`
4. Klik **Save**
5. Tunggu 1–2 menit → akses di `https://<username>.github.io/<repo-name>/`

## Struktur File

```
├── index.html       ← Aplikasi utama
├── manifest.json    ← PWA manifest
├── sw.js            ← Service worker (offline support)
├── .nojekyll        ← Agar GitHub Pages tidak skip file
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

## Catatan

- Data tersimpan di `localStorage` browser masing-masing perangkat
- Gunakan fitur **Export / Share** untuk backup atau pindah data antar HP
- Fitur suara membutuhkan HTTPS (otomatis terpenuhi di GitHub Pages) dan Chrome/Edge
