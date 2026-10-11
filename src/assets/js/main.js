document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  // Mobile drawer (left) toggle
  const openBtn = document.querySelector("[data-mobile-open]");
  const closeBtn = document.querySelector("[data-mobile-close]");
  const overlay = document.querySelector("[data-mobile-overlay]");
  const drawer = document.querySelector("[data-mobile-drawer]");

  if (openBtn && closeBtn && overlay && drawer) {
    let isOpen = false;

    const lockScroll = () => {
      // matikan scroll tanpa mengubah posisi scroll (tetap di section terakhir)
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none"; // bantu mobile biar gak "ketarik"
    };

    const unlockScroll = () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };

    const onOutsidePointer = (e) => {
      if (!isOpen) return;

      // klik di dalam drawer -> jangan close
      if (drawer.contains(e.target)) return;

      // klik tombol open -> jangan close
      if (openBtn.contains(e.target)) return;

      // klik di luar drawer -> close saja
      close();
    };

    const open = () => {
      if (isOpen) return;

      lockScroll();

      overlay.classList.remove("hidden");
      drawer.classList.remove("hidden");
      openBtn.setAttribute("aria-expanded", "true");
      isOpen = true;

      // klik di luar drawer -> close
      document.addEventListener("pointerdown", onOutsidePointer, true);
      document.documentElement.classList.add("drawer-open");
    };

    const close = () => {
      if (!isOpen) return;

      overlay.classList.add("hidden");
      drawer.classList.add("hidden");
      openBtn.setAttribute("aria-expanded", "false");
      isOpen = false;

      unlockScroll();

      document.removeEventListener("pointerdown", onOutsidePointer, true);
      document.documentElement.classList.remove("drawer-open");
    };

    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);

    // klik link di drawer -> close
    drawer
      .querySelectorAll("a")
      .forEach((a) => a.addEventListener("click", close));

    // Esc -> close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  // HERO CAROUSEL — Owl-like (loop + drag + peek)
  const carousel = document.querySelector("[data-hero-carousel]");

  if (carousel) {
    const viewport = carousel.querySelector(".hero-viewport");
    const track = carousel.querySelector("[data-hero-track]");
    const baseSlides = Array.from(track.querySelectorAll(".hero-slide"));

    if (!viewport || !track || baseSlides.length === 0) {
      console.warn("Hero carousel: missing elements");
    } else {
      const baseCount = baseSlides.length;

      // CLONE BEFORE & AFTER (untuk infinite loop)
      const beforeFrag = document.createDocumentFragment();
      const afterFrag = document.createDocumentFragment();

      baseSlides.forEach((slide) => {
        const cloneBefore = slide.cloneNode(true);
        const cloneAfter = slide.cloneNode(true);
        cloneBefore.classList.add("hero-slide-clone");
        cloneAfter.classList.add("hero-slide-clone");
        beforeFrag.appendChild(cloneBefore);
        afterFrag.appendChild(cloneAfter);
      });

      track.insertBefore(beforeFrag, baseSlides[0]);
      track.appendChild(afterFrag);

      const slides = Array.from(track.querySelectorAll(".hero-slide"));
      let currentIndex = baseCount; // mulai di batch tengah (slide pertama asli)
      let isTransitioning = false;

      let slideWidth = slides[currentIndex].getBoundingClientRect().width;
      let currentTranslate = 0;

      function computeTranslateForIndex(index) {
        const viewportWidth = viewport.clientWidth;
        slideWidth = slides[index].getBoundingClientRect().width;
        // center: tengah viewport - tengah slide
        return viewportWidth / 2 - (index + 0.5) * slideWidth;
      }

      function updatePosition(animate = true) {
        currentTranslate = computeTranslateForIndex(currentIndex);
        track.style.transition = animate ? "transform 0.45s ease" : "none";
        track.style.transform = `translateX(${currentTranslate}px)`;
      }

      function normalizeIndex() {
        const total = slides.length; // = baseCount * 3
        const minIndex = baseCount;
        const maxIndex = baseCount * 2 - 1;

        if (currentIndex < minIndex) {
          currentIndex += baseCount;
        } else if (currentIndex > maxIndex) {
          currentIndex -= baseCount;
        }
      }

      function goToSlide(delta) {
        if (isTransitioning) return;
        isTransitioning = true;

        currentIndex += delta;
        updatePosition(true);

        track.addEventListener(
          "transitionend",
          () => {
            normalizeIndex();
            updatePosition(false); // lompat tanpa animasi kalau perlu
            isTransitioning = false;
          },
          { once: true },
        );
      }

      // --- DRAG / SWIPE SUPPORT ---
      let isDragging = false;
      let startX = 0;
      let dragDelta = 0;
      let dragStartTranslate = 0;

      function getX(event) {
        if (event.type.startsWith("mouse")) {
          return event.clientX;
        }
        const t = event.touches?.[0] || event.changedTouches?.[0];
        return t ? t.clientX : 0;
      }

      function pointerDown(event) {
        // hanya klik kiri untuk mouse
        if (event.type === "mousedown" && event.button !== 0) return;
        if (isTransitioning) return;

        // kalau klik di tombol (play, arrow, dll) jangan mulai drag
        if (event.target.closest("button")) return;

        // cegah default drag image untuk mouse
        if (event.type === "mousedown") {
          event.preventDefault();
        }

        isDragging = true;
        startX = getX(event);
        dragDelta = 0;
        dragStartTranslate = currentTranslate;

        track.style.transition = "none";
      }

      function pointerMove(event) {
        if (!isDragging) return;

        const x = getX(event);
        dragDelta = x - startX;
        const nextTranslate = dragStartTranslate + dragDelta;
        track.style.transform = `translateX(${nextTranslate}px)`;
      }

      function pointerUp() {
        if (!isDragging) return;
        isDragging = false;

        const threshold = slideWidth * 0.2;

        if (dragDelta < -threshold) {
          // geser ke kiri → slide berikutnya
          goToSlide(1);
        } else if (dragDelta > threshold) {
          // geser ke kanan → slide sebelumnya
          goToSlide(-1);
        } else {
          // kurang dari threshold → balik ke tengah slide sekarang
          updatePosition(true);
        }
      }

      // Mouse events
      viewport.addEventListener("mousedown", pointerDown);
      viewport.addEventListener("mousemove", pointerMove);
      viewport.addEventListener("mouseleave", pointerUp);
      window.addEventListener("mouseup", pointerUp);

      // Touch events
      viewport.addEventListener("touchstart", pointerDown, { passive: true });
      viewport.addEventListener("touchmove", pointerMove, { passive: true });
      window.addEventListener("touchend", pointerUp);
      window.addEventListener("touchcancel", pointerUp);

      // Buttons
      const prevBtn = carousel.querySelector("[data-hero-prev]");
      const nextBtn = carousel.querySelector("[data-hero-next]");

      prevBtn?.addEventListener("click", () => goToSlide(-1));
      nextBtn?.addEventListener("click", () => goToSlide(1));

      // Resize
      window.addEventListener("resize", () => {
        slideWidth = slides[currentIndex].getBoundingClientRect().width;
        updatePosition(false);
      });

      // Init
      updatePosition(false);
    }
  }

  // --- VIDEO MODAL ELEMENTS ---
  const videoModal = document.querySelector("[data-video-modal]");
  const videoIframe = document.querySelector("[data-video-iframe]");
  const videoClose = document.querySelector("[data-video-close]");

  // VIDEO MODAL YOUTUBE
  if (videoModal && videoIframe) {
    // AMBIL SEMUA TOMBOL PLAY DI HALAMAN, BUKAN CUMA DI DALAM CAROUSEL
    const playButtons = document.querySelectorAll("[data-video-id]");

    function openVideo(id) {
      const src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      videoIframe.src = src;
      videoModal.classList.remove("hidden");
      videoModal.classList.add("flex");
    }

    function closeVideo() {
      videoIframe.src = "";
      videoModal.classList.remove("flex");
      videoModal.classList.add("hidden");
    }

    playButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-video-id");
        if (id) openVideo(id);
      });
    });

    if (videoClose) {
      videoClose.addEventListener("click", closeVideo);
    }

    // klik backdrop untuk tutup
    videoModal.addEventListener("click", (event) => {
      if (event.target === videoModal) {
        closeVideo();
      }
    });

    // ESC untuk tutup
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !videoModal.classList.contains("hidden")) {
        closeVideo();
      }
    });
  }
});

//
// MARQUEE (kode lama kamu tetap dipakai)
//
function initMarquee(track, direction = "left", speed = 30) {
  if (!track) return;

  let position = 0;
  let lastTime = null;

  const dir = direction === "left" ? -1 : 1;

  function step(timestamp) {
    if (lastTime === null) lastTime = timestamp;
    const delta = (timestamp - lastTime) / 1000; // detik
    lastTime = timestamp;

    const distance = dir * speed * delta; // px yang digeser per frame
    position += distance;

    const halfWidth = track.scrollWidth / 2;

    // loop tanpa kelihatan lompat
    if (direction === "left" && position <= -halfWidth) {
      position += halfWidth;
    } else if (direction === "right" && position >= 0) {
      position -= halfWidth;
    }

    track.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

document.addEventListener("DOMContentLoaded", () => {
  const leftTrack = document.querySelector('[data-marquee-track="left"]');
  const rightTrack = document.querySelector('[data-marquee-track="right"]');

  initMarquee(leftTrack, "left", 30); // speed = 30px/s
  initMarquee(rightTrack, "right", 30);
});

document.addEventListener("DOMContentLoaded", () => {
  const select = document.querySelector("[data-cinema-select]");
  const logoEl = document.querySelector("[data-partner-logo]");
  const nameEl = document.querySelector("[data-partner-name]");
  const ratingEl = document.querySelector("[data-partner-rating]");
  const buyEl = document.querySelector("[data-buy-ticket]");
  const ticketDateEl = document.querySelector("[data-ticket-date]");

  if (!select || !logoEl || !nameEl || !ratingEl || !buyEl) return;

  // ✅ Set rating & link & logo tiap partner
  const partners = {
    mtix: {
      name: "M-Tix",
      logo: "/assets/img/m-tix.png",
      buyUrl: "https://m.21cineplex.com/id/movies/16IDAH",
      rating: 4.6,
      reviews: "137rb Ulasan",
    },
    xxi: {
      name: "XXI",
      logo: "/assets/img/xxi.png",
      buyUrl: "https://m.21cineplex.com/id/movies/16IDAH",
      rating: 4.7,
      reviews: "210rb Ulasan",
    },
    cgv: {
      name: "CGV",
      logo: "/assets/img/cgv.png",
      buyUrl: "https://www.cgv.id/en/movies/info/26016700?title=ikatan-darah",
      rating: 4.5,
      reviews: "98rb Ulasan",
    },
  };

  // ✅ tanggal hari ini (contoh: 17 December 2025)
  function formatToday() {
    const d = new Date();
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(d);
  }

  function applyPartner(key) {
    const k = String(key).toLowerCase();
    const p = partners[k] || partners.mtix;

    // logo & name
    logoEl.src = p.logo;
    logoEl.alt = p.name;
    nameEl.textContent = p.name;

    // rating
    ratingEl.innerHTML = `
      <span class="text-[#FACC15] text-[18px]">★</span>
      ${p.rating}, ${p.reviews}
    `;

    // buy link
    buyEl.href = p.buyUrl;

    // ticket date = hari ini
    if (ticketDateEl) ticketDateEl.textContent = formatToday();
  }

  // initial
  applyPartner(select.value);

  // on change
  select.addEventListener("change", (e) => applyPartner(e.target.value));
});

// ===== SEARCH MODAL (KEYWORD ONLY) =====
const searchOpenBtns = document.querySelectorAll("[data-search-open]");
const searchCloseBtn = document.querySelector("[data-search-close]");
const searchOverlay = document.querySelector("[data-search-overlay]");
const searchModal = document.querySelector("[data-search-modal]");
const searchForm = document.querySelector("[data-search-form]");
const searchInput = document.querySelector("[data-search-input]");
const searchError = document.querySelector("[data-search-error]");

if (
  searchOpenBtns.length &&
  searchCloseBtn &&
  searchOverlay &&
  searchModal &&
  searchForm &&
  searchInput
) {
  let isOpen = false;

  const pageLang = (
    document.documentElement.getAttribute("lang") || "id"
  ).toLowerCase();
  const isEnglish = pageLang === "en";

  const MOVIE_URLS = isEnglish
    ? {
        timur: "/en/movie/timur/",
        "ikatan-darah": "/en/movie/ikatan-darah/",
        pasung: "/en/movie/pasung/",
      }
    : {
        timur: "/film/timur/",
        "ikatan-darah": "/film/ikatan-darah/",
        pasung: "/film/pasung/",
      };

  const normalize = (s) =>
    (s || "").toString().trim().toLowerCase().replace(/\s+/g, " ");

  const lockScroll = () => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  };

  const unlockScroll = () => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  };

  const openSearch = () => {
    if (isOpen) return;
    isOpen = true;

    lockScroll();

    searchOverlay.classList.remove("hidden");
    searchModal.classList.remove("hidden");
    searchModal.classList.add("flex"); // penting: karena modal wrapper pakai flex untuk center

    if (searchError) {
      searchError.textContent = "";
      searchError.classList.add("hidden");
    }
    searchInput.value = "";
    setTimeout(() => searchInput.focus(), 0);
  };

  const closeSearch = () => {
    if (!isOpen) return;
    isOpen = false;

    searchOverlay.classList.add("hidden");
    searchModal.classList.add("hidden");
    searchModal.classList.remove("flex");

    unlockScroll();
  };

  const routeByKeyword = (keywordRaw) => {
    const keyword = normalize(keywordRaw);

    if (!keyword) return null;

    if (keyword.includes("timur")) return MOVIE_URLS.timur;

    // ikatan darah: toleransi input
    if (
      keyword.includes("ikatan darah") ||
      keyword.includes("ikatan") ||
      keyword.includes("darah")
    ) {
      return MOVIE_URLS["ikatan-darah"];
    }

    if (keyword.includes("pasung")) return MOVIE_URLS.pasung;

    return null;
  };

  searchOpenBtns.forEach((btn) => btn.addEventListener("click", openSearch));
  searchCloseBtn.addEventListener("click", closeSearch);
  searchOverlay.addEventListener("click", closeSearch);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSearch();
  });

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const targetUrl = routeByKeyword(searchInput.value);

    if (!targetUrl) {
      if (searchError) {
        searchError.textContent =
          "Film tidak ditemukan. Coba: timur / ikatan darah / pasung.";
        searchError.classList.remove("hidden");
      }
      return;
    }

    window.location.href = targetUrl;
  });
}

// ===== SHARE MODAL (Movie Page) =====
const shareOpenBtn = document.querySelector("[data-share-open]");
const shareOverlay = document.querySelector("[data-share-overlay]");
const shareModal = document.querySelector("[data-share-modal]");
const shareCloseBtn = document.querySelector("[data-share-close]");
const shareLinkInput = document.querySelector("[data-share-link]");
const shareCopyBtn = document.querySelector("[data-share-copy]");
const shareCopied = document.querySelector("[data-share-copied]");

const waBtn = document.querySelector("[data-share-wa]");
const fbBtn = document.querySelector("[data-share-fb]");
const tgBtn = document.querySelector("[data-share-tg]");

if (shareOpenBtn && shareOverlay && shareModal && shareCloseBtn) {
  let isOpen = false;

  const lockScroll = () => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  };

  const unlockScroll = () => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  };

  const openShare = () => {
    if (isOpen) return;
    isOpen = true;

    // siapkan URL & text
    const url = window.location.href;
    const text = document.title || "Uwais Pictures";

    if (shareLinkInput) shareLinkInput.value = url;

    // build share links
    if (waBtn)
      waBtn.href = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
    if (fbBtn)
      fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    if (tgBtn)
      tgBtn.href = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;

    if (shareCopied) shareCopied.classList.add("hidden");

    lockScroll();
    shareOverlay.classList.remove("hidden");
    shareModal.classList.remove("hidden");
    shareModal.classList.add("flex");
  };

  const closeShare = () => {
    if (!isOpen) return;
    isOpen = false;

    shareOverlay.classList.add("hidden");
    shareModal.classList.add("hidden");
    shareModal.classList.remove("flex");

    unlockScroll();
  };

  shareOpenBtn.addEventListener("click", () => {
    // kalau browser support native share, kamu bisa pakai ini (opsional)
    // if (navigator.share) return navigator.share({ title: document.title, url: window.location.href }).catch(() => {});
    openShare();
  });

  shareCloseBtn.addEventListener("click", closeShare);
  shareOverlay.addEventListener("click", closeShare);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeShare();
  });

  if (shareCopyBtn && shareLinkInput) {
    shareCopyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(shareLinkInput.value);
        if (shareCopied) shareCopied.classList.remove("hidden");
        setTimeout(
          () => shareCopied && shareCopied.classList.add("hidden"),
          1200,
        );
      } catch (err) {
        // fallback
        shareLinkInput.select();
        document.execCommand("copy");
        if (shareCopied) shareCopied.classList.remove("hidden");
        setTimeout(
          () => shareCopied && shareCopied.classList.add("hidden"),
          1200,
        );
      }
    });
  }
}

const form = document.querySelector('form[action="/api/contact.php"]');

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = "Mengirim...";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
      });

      const data = await res.json();

      if (data.ok) {
        form.reset();
        alert("Pesan berhasil dikirim. Terima kasih!");
      } else {
        alert(data.message || "Terjadi kesalahan.");
      }
    } catch (err) {
      alert("Gagal mengirim pesan. Silakan coba lagi.");
    }

    btn.disabled = false;
    btn.innerHTML = originalText;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const chart = document.querySelector("[data-review-chart]");
  if (!chart) return;

  const bars = chart.querySelectorAll("[data-review-bar]");

  const clearActive = () => {
    bars.forEach((bar) => {
      const tooltip = bar.parentElement.querySelector(".review-tooltip");
      const score = bar.closest(".group")?.querySelector(".review-score");

      bar.classList.remove(
        "bg-[#E31E26]",
        "shadow-[0_12px_30px_rgba(227,30,38,0.25)]",
      );
      bar.classList.add("bg-white/10");

      if (tooltip) {
        tooltip.classList.add("opacity-0", "translate-y-1");
        tooltip.classList.remove("opacity-100", "translate-y-0");
      }

      if (score) {
        score.classList.remove("text-white");
        score.classList.add("text-uwais-muted");
      }
    });
  };

  const setActive = (bar) => {
    const tooltip = bar.parentElement.querySelector(".review-tooltip");
    const score = bar.closest(".group")?.querySelector(".review-score");

    bar.classList.remove("bg-white/10");
    bar.classList.add(
      "bg-[#E31E26]",
      "shadow-[0_12px_30px_rgba(227,30,38,0.25)]",
    );

    if (tooltip) {
      tooltip.classList.remove("opacity-0", "translate-y-1");
      tooltip.classList.add("opacity-100", "translate-y-0");
    }

    if (score) {
      score.classList.remove("text-uwais-muted");
      score.classList.add("text-white");
    }
  };

  bars.forEach((bar) => {
    bar.addEventListener("mouseenter", () => {
      clearActive();
      setActive(bar);
    });

    bar.addEventListener("mouseleave", () => {
      clearActive();
    });

    bar.addEventListener("focus", () => {
      clearActive();
      setActive(bar);
    });

    bar.addEventListener("blur", () => {
      clearActive();
    });

    bar.addEventListener("click", () => {
      clearActive();
      setActive(bar);
    });
  });
});
