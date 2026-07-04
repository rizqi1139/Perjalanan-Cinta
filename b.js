/* ==========================================
   11 BULAN, SATU LANGIT YANG SAMA
   b.js — logika utama halaman perjalanan cinta

   CARA EDIT CEPAT (baca ini dulu sebelum ubah kode):
   1. Ganti nama panggilan di VISITOR_NAME kalau perlu.
   2. Tambah/ubah cerita bulan LDR di array `ldrMonths`.
   3. Tambah/ubah progres skripsi di array `skripsiSteps`.
   4. Tambah foto/video baru di array `galleryItems`
      — taruh file barunya di folder assets/img atau assets/video,
      lalu tambahkan barisnya di sini, tidak perlu ubah HTML/CSS.
   5. Isi surat cinta di fungsi `letterMessage()`.
========================================== */

const pages = document.querySelectorAll(".page");
const journeyDots = document.querySelectorAll(".journey-dot");
const journeySteps = [
  "welcome",
  "awal",
  "ldr",
  "skripsi",
  "galeri",
  "surat",
  "penutup",
];
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// Nama orang yang membuka halaman ini (dipakai kalau mau dipersonalisasi lagi nanti)
const VISITOR_NAME = "Cintaku";

function showPage(id) {
  pages.forEach((page) => page.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) target.classList.add("active");
  updateJourney(id);
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });

  if (id === "penutup") {
    setTimeout(
      () =>
        spawnHearts(30, window.innerWidth / 2, window.innerHeight * 0.35, 320),
      300,
    );
  }
}

function updateJourney(id) {
  const index = journeySteps.indexOf(id);
  if (index === -1) return;
  journeyDots.forEach((dot, i) => {
    dot.classList.remove("done", "current");
    if (i < index) dot.classList.add("done");
    if (i === index) dot.classList.add("current");
  });
}

/* ==============================
   Loading screen
============================== */

window.addEventListener("load", () => {
  setTimeout(() => showPage("welcome"), 2200);
  buildStarField();
  buildLdrMap();
  renderTimeline();
  renderMilestones();
  renderGallery();
});

/* ==============================
   Animasi Love — heart burst & ambient
============================== */

const HEART_ICONS = [
  "\u2764\uFE0F",
  "\uD83D\uDC96",
  "\uD83D\uDC95",
  "\uD83D\uDC97",
  "\uD83D\uDC98",
  "\uD83D\uDC9D",
  "\uD83E\uDE77",
];

function spawnHearts(count, originX, originY, spread) {
  if (prefersReducedMotion) return;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.className = "burst-heart";
      heart.textContent =
        HEART_ICONS[Math.floor(Math.random() * HEART_ICONS.length)];
      heart.style.left = originX + "px";
      heart.style.top = originY + "px";
      heart.style.fontSize = 14 + Math.random() * 22 + "px";

      const angle = Math.random() * 360;
      const distance = spread * (0.5 + Math.random() * 0.6);

      const animation = heart.animate(
        [
          { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: 1 },
          {
            transform: `translate(${Math.cos((angle * Math.PI) / 180) * distance}px, ${
              Math.sin((angle * Math.PI) / 180) * distance
            }px) scale(.2) rotate(${Math.random() > 0.5 ? 40 : -40}deg)`,
            opacity: 0,
          },
        ],
        { duration: 1800, easing: "ease-out" },
      );

      document.body.appendChild(heart);
      animation.onfinish = () => heart.remove();
    }, i * 16);
  }
}

// Hujan hati kecil yang jatuh terus-menerus di background — melambangkan cinta yang nggak berhenti
function startFloatingHearts() {
  if (prefersReducedMotion) return;

  function drop() {
    const heart = document.createElement("div");
    heart.className = "float-heart";
    heart.textContent =
      HEART_ICONS[Math.floor(Math.random() * HEART_ICONS.length)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = 12 + Math.random() * 16 + "px";
    heart.style.animationDuration = 6 + Math.random() * 6 + "s";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 13000);
  }

  setInterval(drop, 1400);
  drop();
}

// Hati kecil muncul tiap kali klik di mana pun di halaman
document.addEventListener("click", (e) => {
  if (e.target.closest(".lightbox-close")) return;
  spawnHearts(4, e.clientX, e.clientY, 90);
});

// Hati melompat setiap kali hover tombol utama
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    const rect = btn.getBoundingClientRect();
    spawnHearts(3, rect.left + rect.width / 2, rect.top, 60);
  });
});

startFloatingHearts();

/* ==============================
   Simple "next" buttons
============================== */

document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => {
    showPage(btn.dataset.next);
    if (btn.dataset.next === "surat") startLetter();
  });
});

/* ==============================
   Star field — simbol "menatap langit yang sama"
============================== */

function buildStarField() {
  const field = document.getElementById("starField");
  if (!field) return;
  const total = 60;

  for (let i = 0; i < total; i++) {
    const star = document.createElement("span");
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDuration = 2 + Math.random() * 4 + "s";
    star.style.animationDelay = Math.random() * 5 + "s";
    field.appendChild(star);
  }
}

/* ==============================
   Peta jarak LDR (dua kota, satu jalur)
   Ganti label "Aku" / "Kamu" di index.html kalau mau
   pakai nama kota, misalnya "Bandung" / "Surabaya".
============================== */

function buildLdrMap() {
  // Placeholder — struktur sudah ada di index.html (.ldr-map),
  // fungsi ini disiapkan kalau nanti mau menambahkan kota transit
  // atau titik-titik perjalanan tambahan secara dinamis.
}

/* ==============================
   Data perjalanan LDR — 8 bulan
   Edit teksnya sesuai kenangan asli kalian ya.
============================== */

const ldrMonths = [
  {
    month: "Bulan 1",
    text: "Masih canggung dengan rasa jauh. Video call jadi pengganti ketemu langsung, dan itu belum cukup, tapi kita coba biasakan.",
  },
  {
    month: "Bulan 2",
    text: "Mulai belajar atur waktu — kamu sibuk kuliah, aku sibuk kerja/kuliah, tapi selalu ada slot buat cerita di malam hari.",
  },
  {
    month: "Bulan 3",
    text: "Rindu mulai jadi rutinitas. Tapi kita juga mulai lebih jujur soal apa yang dirasa, nggak dipendam sendiri-sendiri.",
  },
  {
    month: "Bulan 4",
    text: "Ada masa-masa berat, komunikasi sempat renggang. Tapi kita pilih buat ngobrol lagi, bukan diam-diaman.",
  },
  {
    month: "Bulan 5",
    text: "Kita mulai nemu ritme sendiri: jadwal telepon, kirim foto random, dan saling kasih tahu kabar meski cuma sekilas.",
  },
  {
    month: "Bulan 6",
    text: "Mulai kelihatan siapa yang benar-benar bertahan. Alhamdulillah, kita berdua masih di sini, masih saling pilih.",
  },
  {
    month: "Bulan 7",
    text: "Rasanya jarak makin terasa 'biasa' — bukan karena nggak kangen, tapi karena kita sudah lebih siap menghadapinya.",
  },
  {
    month: "Bulan 8",
    text: "Sambil menghitung hari, kamu masih setia jadi tempat ceritaku — termasuk soal skripsi yang lagi aku kejar.",
  },
  {
    month: "Bulan 9",
    text: "Sampai di bulan ini, aku makin yakin — jarak cuma soal kilometer, bukan soal rasa. Kamu tetap orang yang paling ingin aku kabari duluan setiap ada kabar baik atau buruk.",
  },
];

function renderTimeline() {
  const container = document.getElementById("ldrTimeline");
  if (!container) return;
  container.innerHTML = "";

  ldrMonths.forEach((item) => {
    const row = document.createElement("div");
    row.className = "timeline-item";

    const month = document.createElement("div");
    month.className = "timeline-month";
    month.textContent = item.month;

    const text = document.createElement("div");
    text.className = "timeline-text";
    text.textContent = item.text;

    row.appendChild(month);
    row.appendChild(text);
    container.appendChild(row);
  });
}

/* ==============================
   Data perjalanan skripsi -> wisuda
   "done: true" artinya sudah dilewati, tampil dengan tanda centang.
============================== */

const skripsiSteps = [
  {
    title: "Pengajuan Judul",
    text: "Awal yang penuh keraguan, tapi aku berani mulai — kamu yang pertama kasih semangat.",
    done: true,
  },
  {
    title: "Bimbingan & Revisi",
    text: "Ratusan catatan merah, dan aku tetap lanjut karena kamu selalu dengar keluh kesahku.",
    done: true,
  },
  {
    title: "Sidang Skripsi",
    text: "Deg-degan sendirian, tapi kamu yang paling percaya aku bisa, walau cuma lewat chat.",
    done: true,
  },
  {
    title: "Wisuda",
    text: "Titik yang selalu kita bayangkan bareng-bareng.",
    done: false,
  },
];

function renderMilestones() {
  const container = document.getElementById("skripsiMilestones");
  if (!container) return;
  container.innerHTML = "";

  skripsiSteps.forEach((step) => {
    const card = document.createElement("div");
    card.className = "milestone" + (step.done ? " done" : "");

    const title = document.createElement("div");
    title.className = "milestone-title";
    title.innerHTML =
      (step.done ? '<span class="check">&#10003;</span> ' : "") +
      escapeHtml(step.title);

    const text = document.createElement("div");
    text.className = "milestone-text";
    text.textContent = step.text;

    card.appendChild(title);
    card.appendChild(text);
    container.appendChild(card);
  });
}

/* ==============================
   Galeri foto & video
   Tambahkan baris baru di sini setiap kali ada foto/video baru.
   type: "image" atau "video"
   caption: opsional, tampil kecil di lightbox (boleh dihapus)
============================== */

const galleryItems = [
  {
    type: "image",
    src: "assets/img/foto-01.jpeg",
    caption:
      "Momen waktu kita masih bisa sering ketemu langsung — dua bulan yang paling aku syukuri, awal dari segalanya.",
  },
  {
    type: "image",
    src: "assets/img/foto-02.jpg",
    caption:
      "Santai berdua, tanpa rencana apa-apa, dan itu sudah cukup jadi hari yang sempurna buatku.",
  },
  {
    type: "image",
    src: "assets/img/foto-03.jpg",
    caption:
      "Kenangan yang selalu aku buka lagi kalau kangen sudah kelewat parah — obat rindu paling manjur.",
  },
  {
    type: "image",
    src: "assets/img/foto-04.jpg",
    caption:
      "Momen kecil yang ternyata paling berkesan, walau waktu itu kelihatan biasa saja. Ternyata yang sederhana justru yang paling aku rindukan.",
  },
  {
    type: "image",
    src: "assets/img/foto-05.jpg",
    caption:
      "Bukti bahwa jarak tidak pernah benar-benar membuat kita jauh secara rasa. Kamu tetap terasa dekat, di mana pun kamu berada.",
  },
  {
    type: "image",
    src: "assets/img/foto-06.jpg",
    caption:
      "Foto ini sederhana, tapi selalu berhasil membuatku tersenyum sendiri setiap kali melihatnya lagi.",
  },
  {
    type: "video",
    src: "assets/video/kenangan-01.mp4",
    caption:
      "Video kecil yang isinya kita, apa adanya — dan justru itu yang membuatnya paling berharga untuk aku simpan.",
  },
  // Tambahkan foto/video baru di baris ini, contoh:
  // { type: "image", src: "assets/img/foto-07.jpg", caption: "Ceritanya di sini..." },
];

function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;
  grid.innerHTML = "";

  galleryItems.forEach((item, index) => {
    const cell = document.createElement("div");
    cell.className = "gallery-item";
    cell.setAttribute("role", "button");
    cell.setAttribute("tabindex", "0");
    cell.setAttribute("aria-label", "Lihat kenangan " + (index + 1));

    if (item.type === "video") {
      const video = document.createElement("video");
      video.src = item.src;
      video.muted = true;
      video.playsInline = true;
      video.preload = "metadata";
      cell.appendChild(video);

      const badge = document.createElement("div");
      badge.className = "play-badge";
      badge.innerHTML = "&#9658;";
      cell.appendChild(badge);
    } else {
      const img = document.createElement("img");
      img.src = item.src;
      img.loading = "lazy";
      img.alt = item.caption || "Foto kenangan";
      cell.appendChild(img);
    }

    if (item.caption) {
      const captionTag = document.createElement("div");
      captionTag.className = "gallery-caption";
      captionTag.textContent = item.caption;
      cell.appendChild(captionTag);
    }

    const heartTag = document.createElement("span");
    heartTag.className = "gallery-heart";
    heartTag.innerHTML = "&#10084;";
    cell.appendChild(heartTag);

    const openThis = () => openLightbox(item);
    cell.addEventListener("click", openThis);
    cell.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openThis();
      }
    });

    grid.appendChild(cell);
  });
}

/* ==============================
   Lightbox
============================== */

const lightbox = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightboxContent");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(item) {
  if (!lightbox || !lightboxContent) return;
  lightboxContent.innerHTML = "";

  if (item.type === "video") {
    const video = document.createElement("video");
    video.src = item.src;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    lightboxContent.appendChild(video);
  } else {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.caption || "Foto kenangan";
    lightboxContent.appendChild(img);
  }

  if (item.caption) {
    const caption = document.createElement("p");
    caption.className = "lightbox-caption";
    caption.textContent = item.caption;
    lightboxContent.appendChild(caption);
  }

  lightbox.hidden = false;
  spawnHearts(10, window.innerWidth / 2, window.innerHeight / 2, 260);
}

function closeLightbox() {
  if (!lightbox || !lightboxContent) return;
  lightbox.hidden = true;
  lightboxContent.innerHTML = "";
}

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox && !lightbox.hidden) closeLightbox();
});

/* ==============================
   Surat — efek mengetik
   Ubah isi pesannya di dalam letterMessage().
============================== */

const typingEl = document.getElementById("typingText");
let typingTimer = null;
let typingDone = false;

function letterMessage() {
  return `Halo, ${VISITOR_NAME}.

Sepuluh bulan ini kalau dijabarkan mungkin nggak akan cukup satu halaman. Tapi izinkan aku coba merangkumnya, dari 05 Oktober 2025 sampai hari ini.

Dua bulan pertama, kita belajar saling kenal dari dekat. Delapan bulan sesudahnya, kita belajar saling percaya dari jauh — lewat panggilan yang kadang putus-putus, pesan yang kadang telat dibalas, tapi rasa yang nggak pernah benar-benar hilang, apalagi berkurang.

Di tengah semua itu, aku sedang berjuang dengan skripsiku. Kamu nggak selalu bisa ada secara fisik, tapi kamu selalu ada buat dengar cerita capekku jam berapa pun itu, dan selalu jadi orang pertama yang bangga di setiap progres kecil yang aku ceritakan.

Terima kasih sudah bertahan menempuh jarak ini bersamaku. Terima kasih sudah jadi alasan aku semangat lagi setiap kali lelah, dari bimbingan pertama sampai aku menggunakan toga.

Sepuluh bulan ini baru permulaan. Aku masih mau ada di bab-bab berikutnya, satu bulan lagi menuju satu tahun, lalu tahun-tahun sesudahnya dan hari-hari panjang setelah itu.

Selamat 10 bulan, ${VISITOR_NAME}. Makasih sudah memilih untuk tetap bertahan, sama seperti aku
Angka hubungan kita seperti kata cinta yah, 10ve you forever cintaku :)`;
}

function startLetter() {
  if (!typingEl) return;
  const message = letterMessage();
  typingEl.textContent = "";
  typingDone = false;
  clearTimeout(typingTimer);

  if (prefersReducedMotion) {
    typingEl.textContent = message;
    typingDone = true;
    return;
  }

  let i = 0;
  function type() {
    if (i < message.length) {
      typingEl.textContent += message.charAt(i);
      i++;
      typingTimer = setTimeout(type, 20);
    } else {
      typingDone = true;
      const rect = typingEl.getBoundingClientRect();
      spawnHearts(20, rect.left + rect.width / 2, rect.bottom, 240);
    }
  }
  type();
}

const skipTypingBtn = document.getElementById("skipTyping");
if (skipTypingBtn) {
  skipTypingBtn.addEventListener("click", () => {
    clearTimeout(typingTimer);
    if (typingEl) {
      typingEl.textContent = letterMessage();
      const rect = typingEl.getBoundingClientRect();
      spawnHearts(15, rect.left + rect.width / 2, rect.bottom, 200);
    }
    typingDone = true;
  });
}

/* ==============================
   Helper
============================== */

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ==============================
   Ending & restart
============================== */

const restartBtn = document.getElementById("restart");
if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    location.reload();
  });
}

/* ==============================
   Music toggle (placeholder source)
   Taruh file musik di assets/audio/ lalu isi audio.src di bawah.
============================== */

const audio = new Audio();
audio.loop = true;
// Ganti dengan musik pilihanmu, contoh:
// audio.src = "assets/audio/musik.mp3";

const muteBtn = document.getElementById("muteBtn");
if (muteBtn) {
  muteBtn.addEventListener("click", () => {
    if (!audio.src) {
      muteBtn.style.opacity = "0.5";
      return;
    }
    if (audio.paused) {
      audio.play();
      muteBtn.textContent = "\u266B";
    } else {
      audio.pause();
      muteBtn.textContent = "\u266A";
    }
  });
}
