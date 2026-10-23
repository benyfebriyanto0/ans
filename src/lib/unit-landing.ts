/**
 * Konten pendukung halaman detail bidang usaha (model landing page).
 * Judul, ringkasan, deskripsi, daftar layanan, foto, dan pesan WhatsApp tetap dikelola dari panel admin;
 * file ini hanya berisi teks pendukung (tagline, keunggulan, langkah, FAQ) per slug.
 */

export type UnitLanding = {
  headline: string;
  highlight: string;
  intro: string;
  servicesTitle: string;
  features: { title: string; text: string }[];
  steps: { title: string; text: string }[];
  faq: { q: string; a: string }[];
  closing: string;
};

const DEFAULT: UnitLanding = {
  headline: "Kebutuhan operasional Anda,",
  highlight: "serahkan ke kami.",
  intro: "Layanan profesional, respons cepat, dan harga kompetitif untuk kebutuhan perusahaan maupun perorangan.",
  servicesTitle: "Layanan yang kami sediakan",
  features: [
    { title: "Berbadan hukum", text: "Perusahaan resmi berbentuk CV di Bandar Lampung." },
    { title: "Respons cepat", text: "Konsultasi & penawaran langsung via WhatsApp." },
    { title: "Harga kompetitif", text: "Penawaran transparan sesuai kebutuhan Anda." },
  ],
  steps: [
    { title: "Ceritakan kebutuhan", text: "Isi formulir singkat atau chat admin kami via WhatsApp." },
    { title: "Terima penawaran", text: "Kami cek ketersediaan lalu kirimkan rekomendasi & harga." },
    { title: "Konfirmasi & beres", text: "Setelah sepakat, pekerjaan/pengiriman kami jadwalkan." },
  ],
  faq: [
    {
      q: "Bagaimana cara mengetahui harga?",
      a: "Kirim kebutuhan Anda lewat formulir atau WhatsApp. Admin kami akan mengirim penawaran pada jam kerja.",
    },
    {
      q: "Apakah melayani perusahaan dan proyek?",
      a: "Ya, kami melayani perusahaan, proyek, instansi, maupun perorangan.",
    },
    {
      q: "Area mana saja yang dilayani?",
      a: "Bandar Lampung dan wilayah Provinsi Lampung. Untuk lokasi lain silakan konsultasikan terlebih dahulu.",
    },
    {
      q: "Apakah mengisi formulir berarti pesanan sudah pasti?",
      a: "Belum. Formulir hanya menyiapkan pesan WhatsApp; pesanan pasti setelah dikonfirmasi admin kami.",
    },
  ],
  closing: "Anda fokus pada bisnis. Kami bantu urusan teknisnya.",
};

const BY_SLUG: Record<string, Partial<UnitLanding>> = {
  perdagangan: {
    headline: "Suku cadang tepat,",
    highlight: "mesin tetap berjalan.",
    intro:
      "Pengadaan suku cadang mesin dan peralatan industri sesuai spesifikasi, untuk pabrik, perkebunan, tambang, dan konstruksi.",
    servicesTitle: "Butuh komponen apa hari ini?",
    features: [
      { title: "Sesuai spesifikasi", text: "Bantu identifikasi part number & alternatif setara." },
      { title: "Jaringan pemasok luas", text: "Ketersediaan barang lebih terjamin." },
      { title: "Harga kompetitif", text: "Penawaran untuk pembelian satuan maupun rutin." },
    ],
    steps: [
      { title: "Kirim daftar kebutuhan", text: "Nama barang, part number/merek, dan jumlah yang dibutuhkan." },
      { title: "Terima penawaran", text: "Kami cek stok & kirim penawaran harga beserta estimasi waktu." },
      { title: "Barang dikirim", text: "Setelah PO/konfirmasi, barang kami siapkan dan kirim ke lokasi Anda." },
    ],
    faq: [
      {
        q: "Bisa cari barang berdasarkan part number?",
        a: "Bisa. Kirimkan part number, foto, atau spesifikasi barang lama Anda, kami bantu carikan yang sesuai atau setara.",
      },
      {
        q: "Apakah melayani pembelian rutin perusahaan?",
        a: "Ya. Kami melayani pengadaan satuan maupun kontrak rutin untuk pabrik, perkebunan, dan kontraktor.",
      },
      ...DEFAULT.faq.slice(2),
    ],
    closing: "Jangan biarkan mesin berhenti karena satu komponen.",
  },
  jasa: {
    headline: "Mesin bermasalah?",
    highlight: "Teknisi kami siap.",
    intro:
      "Reparasi, perawatan berkala, dan overhaul mesin serta peralatan industri oleh teknisi berpengalaman untuk meminimalkan downtime.",
    servicesTitle: "Layanan reparasi & perawatan",
    features: [
      { title: "Teknisi berpengalaman", text: "Menangani beragam mesin & peralatan industri." },
      { title: "Minim downtime", text: "Penanganan cepat agar produksi kembali berjalan." },
      { title: "Perawatan berkala", text: "Kontrak preventive maintenance sesuai jadwal Anda." },
    ],
    steps: [
      { title: "Laporkan kendala", text: "Ceritakan jenis mesin & gejala kerusakan, sertakan foto/video bila ada." },
      { title: "Inspeksi & penawaran", text: "Teknisi kami melakukan pengecekan lalu memberikan estimasi biaya." },
      { title: "Perbaikan selesai", text: "Pekerjaan dikerjakan sesuai jadwal dan diuji sebelum diserahkan." },
    ],
    faq: [
      {
        q: "Apakah bisa datang ke lokasi?",
        a: "Bisa. Untuk mesin yang tidak memungkinkan dipindahkan, teknisi kami akan datang ke lokasi Anda.",
      },
      {
        q: "Apakah tersedia kontrak perawatan berkala?",
        a: "Ya. Kami melayani preventive maintenance terjadwal untuk menjaga performa mesin dan mencegah kerusakan besar.",
      },
      ...DEFAULT.faq.slice(2),
    ],
    closing: "Mesin prima, produksi lancar.",
  },
  "perdagangan-oli": {
    headline: "Pelumas berkualitas,",
    highlight: "mesin lebih awet.",
    intro: "Pasokan oli, pelumas, dan bahan bakar untuk kendaraan operasional, alat berat, genset, dan mesin industri.",
    servicesTitle: "Pilihan pelumas & bahan bakar",
    features: [
      { title: "Sesuai rekomendasi", text: "Bantu pilih grade pelumas sesuai pabrikan." },
      { title: "Berbagai kemasan", text: "Drum, pail, maupun liter sesuai kebutuhan." },
      { title: "Pengiriman terjadwal", text: "Pasokan rutin untuk operasional Anda." },
    ],
    steps: [
      { title: "Sebutkan kebutuhan", text: "Jenis mesin/kendaraan, tipe pelumas, kemasan, dan jumlah." },
      { title: "Terima penawaran", text: "Kami kirimkan rekomendasi produk dan harga terbaik." },
      { title: "Produk dikirim", text: "Pengiriman ke lokasi Anda sesuai jadwal yang disepakati." },
    ],
    faq: [
      {
        q: "Bisa bantu memilih oli yang tepat?",
        a: "Bisa. Sebutkan jenis mesin/kendaraan dan merek, kami rekomendasikan grade pelumas sesuai anjuran pabrikan.",
      },
      {
        q: "Apakah melayani pasokan rutin?",
        a: "Ya, kami melayani pengiriman berkala untuk kebutuhan operasional perusahaan, armada, dan proyek.",
      },
      ...DEFAULT.faq.slice(2),
    ],
    closing: "Pasokan pelumas lancar, operasional tanpa jeda.",
  },
  "rental-mobil": {
    headline: "Perjalanan nyaman.",
    highlight: "Urusan mobil serahkan ke kami.",
    intro:
      "Sewa kendaraan bersih dan terawat untuk agenda kerja, operasional proyek, hingga liburan keluarga, lepas kunci atau dengan pengemudi.",
    servicesTitle: "Mau pergi naik apa?",
    features: [
      { title: "Armada terawat", text: "Bersih, rutin diservis, siap pakai." },
      { title: "Fleksibel", text: "Lepas kunci atau dengan pengemudi." },
      { title: "Harian hingga bulanan", text: "Untuk pribadi maupun perusahaan." },
    ],
    steps: [
      { title: "Ceritakan rencana perjalanan", text: "Tanggal, durasi sewa, jenis mobil, dan lokasi penjemputan." },
      { title: "Konfirmasi dengan admin", text: "Kami cek ketersediaan unit dan kirimkan penawaran harga." },
      { title: "Siap berangkat", text: "Setelah pemesanan dikonfirmasi, mobil siap diantar atau diambil." },
    ],
    faq: [
      {
        q: "Bisa sewa lepas kunci?",
        a: "Bisa, dengan persyaratan identitas yang akan dijelaskan admin. Tersedia juga opsi dengan pengemudi.",
      },
      {
        q: "Berapa tarif sewanya?",
        a: "Tarif bergantung pada jenis mobil, durasi, dan layanan (lepas kunci/dengan driver). Hubungi admin untuk penawaran terbaru.",
      },
      {
        q: "Apakah melayani sewa untuk perusahaan?",
        a: "Ya. Kami melayani sewa kendaraan operasional perusahaan dan proyek, termasuk kontrak bulanan.",
      },
      ...DEFAULT.faq.slice(2),
    ],
    closing: "Anda tentukan tujuan. Kami bantu urusan kendaraan.",
  },
};

export function getUnitLanding(slug: string): UnitLanding {
  return { ...DEFAULT, ...(BY_SLUG[slug] ?? {}) };
}
