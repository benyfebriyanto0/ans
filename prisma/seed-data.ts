// Data awal (seeder) — diambil dari PRD & company profile CV Arsindo Niaga Sejahtera.
// Konten dapat diubah kapan saja melalui panel admin.

export const businessUnits = [
  {
    menuName: "Perdagangan",
    officialName: "Perdagangan Suku Cadang Mesin dan Peralatan Industri",
    kbliCode: "46693",
    slug: "perdagangan",
    icon: "cog",
    sortOrder: 1,
    summary:
      "Penyediaan suku cadang mesin dan peralatan industri yang andal untuk mendukung kelancaran operasional pabrik, perkebunan, dan proyek Anda.",
    description: `<p>CV Arsindo Niaga Sejahtera melayani pengadaan <strong>suku cadang mesin dan peralatan industri</strong> untuk kebutuhan sektor manufaktur, agroindustri, perkebunan, pertambangan, dan konstruksi.</p>
<p>Kami bekerja sama dengan jaringan pemasok terpercaya sehingga mampu menyediakan komponen yang sesuai spesifikasi, dengan waktu pengiriman yang terukur dan harga yang kompetitif. Tim kami siap membantu identifikasi part number serta memberikan rekomendasi komponen pengganti yang tepat.</p>`,
    services: [
      "Suku cadang mesin produksi & mesin pengolahan",
      "Bearing, seal, v-belt, gear, dan komponen transmisi",
      "Pompa, valve, fitting, dan komponen hidrolik/pneumatik",
      "Peralatan kerja & perkakas industri",
      "Pengadaan sesuai spesifikasi dan part number",
    ],
    waMessage:
      "Halo CV Arsindo Niaga Sejahtera, saya ingin menanyakan ketersediaan suku cadang mesin/peralatan industri.",
  },
  {
    menuName: "Jasa",
    officialName: "Reparasi Mesin dan Peralatan",
    kbliCode: "33120",
    slug: "jasa",
    icon: "wrench",
    sortOrder: 2,
    summary: "Layanan reparasi, perawatan, dan overhaul mesin serta peralatan industri oleh teknisi berpengalaman.",
    description: `<p>Kami menyediakan <strong>jasa reparasi dan perawatan mesin serta peralatan</strong> untuk menjaga performa aset produksi Anda tetap optimal dan meminimalkan downtime.</p>
<p>Pekerjaan dilakukan oleh teknisi berpengalaman dengan standar keselamatan kerja, mulai dari inspeksi, troubleshooting, penggantian komponen, hingga overhaul. Kami juga melayani perawatan berkala (preventive maintenance) sesuai jadwal yang disepakati.</p>`,
    services: [
      "Perbaikan & overhaul mesin industri",
      "Preventive & corrective maintenance",
      "Troubleshooting dan inspeksi peralatan",
      "Penggantian & instalasi komponen",
      "Pekerjaan fabrikasi dan pengelasan pendukung",
    ],
    waMessage:
      "Halo CV Arsindo Niaga Sejahtera, saya ingin berkonsultasi mengenai jasa reparasi/perawatan mesin dan peralatan.",
  },
  {
    menuName: "Perdagangan Oli",
    officialName: "Perdagangan Bahan Bakar dan Pelumas",
    kbliCode: "46610",
    slug: "perdagangan-oli",
    icon: "droplet",
    sortOrder: 3,
    summary: "Distribusi pelumas (oli) dan bahan bakar untuk kebutuhan kendaraan, alat berat, dan mesin industri.",
    description: `<p>CV Arsindo Niaga Sejahtera menyalurkan <strong>pelumas (oli) dan bahan bakar</strong> berkualitas untuk kebutuhan kendaraan operasional, alat berat, genset, dan mesin industri.</p>
<p>Kami membantu pelanggan memilih jenis dan grade pelumas yang sesuai rekomendasi pabrikan, serta melayani pengiriman dalam berbagai kemasan sesuai kebutuhan operasional.</p>`,
    services: [
      "Oli mesin kendaraan & alat berat",
      "Oli hidrolik, gear oil, dan grease",
      "Pelumas mesin industri & genset",
      "Bahan bakar untuk kebutuhan operasional",
      "Pengiriman dalam kemasan drum, pail, maupun liter",
    ],
    waMessage: "Halo CV Arsindo Niaga Sejahtera, saya ingin menanyakan kebutuhan oli/pelumas dan bahan bakar.",
  },
  {
    menuName: "Rental Mobil",
    officialName: "Penyewaan Kendaraan",
    kbliCode: "77100",
    slug: "rental-mobil",
    icon: "car",
    sortOrder: 4,
    summary: "Penyewaan kendaraan yang bersih, terawat, dan siap pakai untuk kebutuhan perusahaan maupun perorangan.",
    description: `<p>Layanan <strong>penyewaan kendaraan</strong> kami mendukung mobilitas perusahaan, proyek, maupun perjalanan pribadi dengan armada yang bersih, terawat, dan rutin diservis.</p>
<p>Tersedia pilihan sewa harian, mingguan, hingga bulanan, dengan opsi lepas kunci atau menggunakan pengemudi. Hubungi kami untuk informasi ketersediaan unit dan penawaran terbaik.</p>`,
    services: [
      "Sewa harian, mingguan, dan bulanan",
      "Pilihan lepas kunci atau dengan pengemudi",
      "Kendaraan operasional perusahaan & proyek",
      "Antar-jemput bandara dan perjalanan luar kota",
      "Armada bersih, terawat, dan diservis berkala",
    ],
    waMessage: "Halo CV Arsindo Niaga Sejahtera, saya ingin menanyakan ketersediaan dan harga sewa mobil.",
  },
];

export const settings: Record<string, string> = {
  company_name: "CV Arsindo Niaga Sejahtera",
  company_short_name: "Arsindo",
  company_tagline: "Mitra Terpercaya untuk Suku Cadang, Jasa Reparasi, Pelumas, dan Rental Kendaraan",
  company_form: "Persekutuan Komanditer (CV)",
  established_year: "",
  short_profile:
    "CV Arsindo Niaga Sejahtera adalah perusahaan yang berbasis di Bandar Lampung dan bergerak di bidang perdagangan suku cadang mesin dan peralatan industri, jasa reparasi mesin, perdagangan bahan bakar dan pelumas, serta penyewaan kendaraan.",
  profile:
    "CV Arsindo Niaga Sejahtera merupakan badan usaha berbentuk Persekutuan Komanditer (CV) yang berkedudukan di Bandar Lampung. Perusahaan hadir untuk menjadi mitra yang dapat diandalkan bagi pelaku usaha dan industri dalam memenuhi kebutuhan suku cadang mesin dan peralatan industri, jasa reparasi dan perawatan mesin, pasokan pelumas dan bahan bakar, serta penyewaan kendaraan.\n\nDengan mengedepankan integritas, kualitas, dan ketepatan waktu, kami berkomitmen memberikan solusi yang efisien dan bernilai tambah bagi setiap pelanggan. Didukung tim yang kompeten dan jaringan pemasok yang luas, kami siap menjadi bagian dari kelancaran operasional bisnis Anda.",
  vision:
    "Menjadi perusahaan penyedia barang dan jasa industri yang terpercaya, profesional, dan berdaya saing di Provinsi Lampung dan sekitarnya.",
  missions: JSON.stringify([
    "Menyediakan suku cadang mesin dan peralatan industri yang berkualitas dan sesuai kebutuhan pelanggan.",
    "Memberikan layanan reparasi dan perawatan mesin yang cepat, tepat, dan bertanggung jawab.",
    "Menyalurkan bahan bakar dan pelumas yang terjamin mutunya dengan pengiriman tepat waktu.",
    "Menyediakan layanan penyewaan kendaraan yang aman, nyaman, dan terawat.",
    "Membangun hubungan jangka panjang dengan pelanggan dan mitra berdasarkan kepercayaan.",
    "Mengembangkan kompetensi sumber daya manusia secara berkelanjutan.",
  ]),
  values: JSON.stringify([
    { title: "Integritas", description: "Jujur, transparan, dan memegang teguh komitmen dalam setiap pekerjaan." },
    { title: "Profesional", description: "Bekerja dengan standar kualitas, kompetensi, dan etika yang tinggi." },
    { title: "Tepat Waktu", description: "Menghargai waktu pelanggan dengan layanan yang cepat dan terukur." },
    { title: "Kepuasan Pelanggan", description: "Mengutamakan kebutuhan dan kepuasan pelanggan sebagai prioritas." },
    { title: "Kerja Sama", description: "Membangun sinergi yang solid dengan tim, pelanggan, dan mitra usaha." },
  ]),
  commitment:
    "Kami berkomitmen menghadirkan produk dan layanan yang berkualitas, harga yang kompetitif, serta pelayanan yang responsif demi mendukung kelancaran dan keberhasilan usaha setiap pelanggan.",
  nib: "",
  npwp: "",
  address: "Perum Semesta Blok L 13, Kemiling, Kota Bandar Lampung, Lampung",
  phone: "08117913336",
  email: "arsindoniagasejahtera@outlook.com",
  whatsapp: "628117913336",
  business_hours: "Senin – Sabtu, 08.00 – 17.00 WIB",
  maps_embed_url: "https://www.google.com/maps?q=Perum+Semesta+Kemiling+Bandar+Lampung&output=embed",
  maps_link: "https://maps.google.com/?q=Perum+Semesta+Kemiling+Bandar+Lampung",
  logo_url: "",
  logo_public_id: "",
  wa_default_message: "Halo CV Arsindo Niaga Sejahtera, saya ingin bertanya mengenai layanan Anda.",
};

export const vehicles = [
  {
    name: "Toyota Avanza",
    slug: "toyota-avanza",
    brand: "Toyota",
    category: "MPV",
    transmission: "Manual",
    fuel: "Bensin",
    seats: 7,
    year: null as number | null,
    description: "MPV keluarga yang irit dan nyaman untuk perjalanan dalam maupun luar kota.",
    features: ["AC", "Audio", "Bisa dengan pengemudi"],
    sortOrder: 1,
  },
  {
    name: "Toyota Innova",
    slug: "toyota-innova",
    brand: "Toyota",
    category: "MPV",
    transmission: "Manual",
    fuel: "Diesel",
    seats: 7,
    year: null as number | null,
    description: "Kabin lapang dan tangguh, cocok untuk kebutuhan operasional perusahaan dan perjalanan jauh.",
    features: ["AC Double Blower", "Audio", "Bisa dengan pengemudi"],
    sortOrder: 2,
  },
];
