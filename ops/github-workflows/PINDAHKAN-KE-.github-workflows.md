# Workflow GitHub Actions

File `ci.yml` dan `backup-db.yml` di folder ini **harus dipindahkan ke `.github/workflows/`**
sebelum push ke GitHub (folder `.github` tidak dapat ditulis langsung oleh alat pengiriman file).

```powershell
mkdir .github\workflows
move ops\github-workflows\*.yml .github\workflows\
```

Setelah itu folder `ops/` boleh dihapus. Untuk backup mingguan, isi GitHub Secrets:
`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
