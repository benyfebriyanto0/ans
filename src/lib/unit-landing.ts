/**
 * Konten pendukung halaman detail bidang usaha.
 * Judul, ringkasan, deskripsi, daftar layanan, foto, dan pesan WhatsApp tetap dikelola dari panel admin;
 * file ini hanya berisi teks pendukung (tagline, keunggulan, alur, FAQ) per slug.
 */

export type UnitLanding = {
  headline: string;
  highlight: string;
  intro: string;
  servicesTitle: string;
  servicesIntro: string;
  /** Teks tautan WhatsApp di setiap baris layanan. */
  itemCta: string;
  features: { title: string; text: string }[];
  stepsTitle: string;
  steps: { title: string; text: string }[];
  faq: { q: string; a: string }[];
  closing: string;
  /** Label tombol penutup. */
  cta: string;
};

const DEFAULT: UnitLanding = {
  headline: "Kebutuhan operasional Anda,",
  highlight: "kami bantu urus.",
  intro: "Melayani perusahaan, proyek, dan perorangan di Bandar Lampung dan sekitarnya.",
  servicesTitle: "Yang bisa kami kerjakan",
  servicesIntro: "Klik salah satu untuk langsung bertanya ke admin lewat WhatsApp.",
  itemCta: "Tanyakan",
  features: [
    { title: "Badan usaha CV", text: "Terdaftar dan berkantor di Bandar Lampung." },
    { title: "Penawaran tertulis", text: "Harga dan estimasi waktu dikirim sebelum pekerjaan dimulai." },
    { title: "Satu kontak", text: "Suku cadang, servis, pelumas, dan kendaraan lewat admin yang sama." },
  ],
  stepsTitle: "Alur pemesanan",
  steps: [
    { title: "Kirim kebutuhan", text: "Isi formulir di bawah atau chat admin kami lewat WhatsApp." },
    { title: "Terima penawaran", text: "Kami cek ketersediaan lalu kirim harga dan estimasi waktu." },
    { title: "Konfirmasi", text: "Setelah sepakat, pekerjaan atau pengiriman kami jadwalkan." },
  ],
  faq: [
    {
      q: "Bagaimana cara mengetahui harga?",
      a: "Kirim kebutuhan Anda lewat formulir atau WhatsApp. Admin kami mengirim penawaran pada jam kerja.",
    },
    {
      q: "Apakah melayani perusahaan dan proyek?",
      a: "Ya, kami melayani perusahaan, proyek, instansi, maupun perorangan.",
    },
    {
      q: "Area mana saja yang dilayani?",
      a: "Bandar Lampung dan wilayah Provinsi Lampung. Untuk lokasi lain, silakan konsultasikan terlebih dahulu.",
    },
    {
      q: "Apakah mengisi formulir berarti pesanan sudah pasti?",
      a: "Belum. Formulir hanya menyiapkan pesan WhatsApp. Pesanan pasti setelah dikonfirmasi admin kami.",
    },
  ],
  closing: "Ceritakan kebutuhan Anda, kami balas dengan penawaran.",
  cta: "Chat admin",
};

const BY_SLUG: Record<string, Partial<UnitLanding>> = {
  perdagangan: {
    headline: "Suku cadang tepat,",
    highlight: "mesin tetap berjalan.",
    intro:
      "Pengadaan suku cadang mesin dan peralatan industri sesuai spesifikasi, untuk pabrik, perkebunan, tambang, dan konstruksi.",
    servicesTitle: "Komponen yang kami sediakan",
    servicesIntro: "Kirim part number, merek, atau foto barang lama. Kami carikan yang sesuai atau setara.",
    itemCta: "Cek stok",
    features: [
      { title: "Cari dari part number", text: "Atau dari foto dan spesifikasi barang lama Anda." },
      { title: "Alternatif setara", text: "Pilihan merek lain bila barang original sedang kosong." },
      { title: "Satuan atau rutin", text: "Pembelian sekali maupun kontrak pasokan berkala." },
    ],
    steps: [
      { title: "Kirim daftar kebutuhan", text: "Nama barang, part number atau merek, dan jumlah." },
      { title: "Terima penawaran", text: "Kami cek stok lalu kirim harga beserta estimasi waktu." },
      { title: "Barang dikirim", text: "Setelah PO atau konfirmasi, barang kami siapkan dan kirim." },
    ],
    faq: [
      {
        q: "Bisa cari barang berdasarkan part number?",
        a: "Bisa. Kirimkan part number, foto, atau spesifikasi barang lama Anda. Kami bantu carikan yang sesuai atau setara.",
      },
      {
        q: "Apakah melayani pembelian rutin perusahaan?",
        a: "Ya. Kami melayani pengadaan satuan maupun kontrak rutin untuk pabrik, perkebunan, dan kontraktor.",
      },
      ...DEFAULT.faq.slice(2),
    ],
    closing: "Jangan biarkan mesin berhenti karena satu komponen.",
    cta: "Kirim daftar part",
  },
  jasa: {
    headline: "Mesin bermasalah?",
    highlight: "Teknisi kami siap.",
    intro:
      "Reparasi, perawatan berkala, dan overhaul mesin serta peralatan industri, dikerjakan di bengkel atau langsung di lokasi Anda.",
    servicesTitle: "Pekerjaan yang kami tangani",
    servicesIntro: "Ceritakan jenis mesin dan gejalanya. Foto atau video kerusakan sangat membantu.",
    itemCta: "Konsultasi",
    features: [
      { title: "Datang ke lokasi", text: "Untuk mesin yang tidak bisa dipindahkan." },
      { title: "Diuji sebelum diserahkan", text: "Mesin dicoba jalan setelah perbaikan selesai." },
      { title: "Perawatan terjadwal", text: "Kontrak preventive maintenance sesuai jadwal produksi." },
    ],
    stepsTitle: "Alur perbaikan",
    steps: [
      { title: "Laporkan kendala", text: "Jenis mesin dan gejala kerusakan, sertakan foto atau video." },
      { title: "Inspeksi", text: "Teknisi memeriksa mesin di bengkel atau di lokasi Anda." },
      { title: "Penawaran", text: "Anda menerima rincian pekerjaan, suku cadang, dan biaya." },
      { title: "Perbaikan & uji", text: "Mesin diperbaiki, diuji jalan, lalu diserahkan kembali." },
    ],
    faq: [
      {
        q: "Apakah bisa datang ke lokasi?",
        a: "Bisa. Untuk mesin yang tidak memungkinkan dipindahkan, teknisi kami datang ke lokasi Anda.",
      },
      {
        q: "Apakah tersedia kontrak perawatan berkala?",
        a: "Ya. Kami melayani preventive maintenance terjadwal untuk menjaga performa mesin dan mencegah kerusakan besar.",
      },
      ...DEFAULT.faq.slice(2),
    ],
    closing: "Mesin prima, produksi lancar.",
    cta: "Laporkan kerusakan",
  },
  "perdagangan-oli": {
    headline: "Pelumas yang tepat,",
    highlight: "mesin lebih awet.",
    intro: "Pasokan oli, pelumas, dan bahan bakar untuk kendaraan operasional, alat berat, genset, dan mesin industri.",
    servicesTitle: "Produk yang kami pasok",
    servicesIntro: "Sebutkan jenis mesin dan kemasan yang dibutuhkan. Kami bantu pilihkan grade yang sesuai.",
    itemCta: "Tanya harga",
    features: [
      { title: "Grade sesuai pabrikan", text: "Rekomendasi pelumas sesuai anjuran mesin Anda." },
      { title: "Drum, pail, atau liter", text: "Kemasan menyesuaikan pemakaian." },
      { title: "Kirim terjadwal", text: "Pasokan rutin untuk armada dan proyek." },
    ],
    steps: [
      { title: "Sebutkan kebutuhan", text: "Jenis mesin atau kendaraan, tipe pelumas, kemasan, dan jumlah." },
      { title: "Terima penawaran", text: "Kami kirimkan rekomendasi produk dan harga." },
      { title: "Produk dikirim", text: "Pengiriman ke lokasi Anda sesuai jadwal yang disepakati." },
    ],
    faq: [
      {
        q: "Bisa bantu memilih oli yang tepat?",
        a: "Bisa. Sebutkan jenis mesin atau kendaraan dan mereknya, kami rekomendasikan grade sesuai anjuran pabrikan.",
      },
      {
        q: "Apakah melayani pasokan rutin?",
        a: "Ya, kami melayani pengiriman berkala untuk kebutuhan operasional perusahaan, armada, dan proyek.",
      },
      ...DEFAULT.faq.slice(2),
    ],
    closing: "Pasokan pelumas lancar, operasional tanpa jeda.",
    cta: "Pesan pelumas",
  },
  "rental-mobil": {
    headline: "Perjalanan nyaman,",
    highlight: "urusan mobil serahkan ke kami.",
    intro:
      "Sewa kendaraan bersih dan terawat untuk agenda kerja, operasional proyek, hingga liburan keluarga. Lepas kunci atau dengan pengemudi.",
    servicesTitle: "Mau pergi naik apa?",
    servicesIntro: "Pilih mobil, lalu tanyakan harga dan jadwal yang tersedia ke admin.",
    itemCta: "Tanyakan",
    features: [
      { title: "Dicek sebelum jalan", text: "Unit dibersihkan dan diperiksa sebelum diserahkan." },
      { title: "Lepas kunci atau sopir", text: "Pilih sesuai kebutuhan perjalanan." },
      { title: "Harian hingga bulanan", text: "Untuk pribadi maupun kendaraan operasional perusahaan." },
    ],
    stepsTitle: "Alur sewa",
    steps: [
      { title: "Ceritakan rencana", text: "Tanggal, durasi sewa, jenis mobil, dan lokasi penjemputan." },
      { title: "Cek ketersediaan", text: "Admin mengecek unit lalu mengirim penawaran harga." },
      { title: "Siap berangkat", text: "Setelah dikonfirmasi, mobil diantar atau diambil di lokasi kami." },
    ],
    faq: [
      {
        q: "Bisa sewa lepas kunci?",
        a: "Bisa, dengan persyaratan identitas yang akan dijelaskan admin. Tersedia juga opsi dengan pengemudi.",
      },
      {
        q: "Berapa tarif sewanya?",
        a: "Tarif bergantung pada jenis mobil, durasi, dan layanan (lepas kunci atau dengan pengemudi). Hubungi admin untuk penawaran terbaru.",
      },
      {
        q: "Apakah melayani sewa untuk perusahaan?",
        a: "Ya. Kami melayani sewa kendaraan operasional perusahaan dan proyek, termasuk kontrak bulanan.",
      },
      ...DEFAULT.faq.slice(2),
    ],
    closing: "Anda tentukan tujuan, kami siapkan mobilnya.",
    cta: "Cek mobil tersedia",
  },
};

export function getUnitLanding(slug: string): UnitLanding {
  return { ...DEFAULT, ...(BY_SLUG[slug] ?? {}) };
}
