(() => {
  const storedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (storedTheme === "dark" || (!storedTheme && systemPrefersDark)) {
    document.documentElement.classList.add("dark");
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const menuButton = document.getElementById("menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const themeToggle = document.getElementById("theme-toggle");
  const themeToggleLabel = document.getElementById("theme-toggle-label");
  const moreButton = document.getElementById("more-button");
  const moreMenu = document.getElementById("more-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const revealItems = document.querySelectorAll(".reveal");
  const statCounts = document.querySelectorAll(".stat-count");
  const footerYear = document.getElementById("footer-year");
  const profileFrame = document.querySelector(".profile-frame");
  const navProfileChip = document.querySelector(".nav-profile-chip");
  const certificateTriggers = document.querySelectorAll(".certificate-trigger");
  const certificateLightbox = document.getElementById("certificate-lightbox");
  const certificateLightboxImage = document.getElementById("certificate-lightbox-image");
  const certificateLightboxClose = document.getElementById("certificate-lightbox-close");
  let activeCertificateTrigger = null;
  let certificateLightboxTimeoutId = null;

  const syncThemeToggle = () => {
    if (!themeToggle || !themeToggleLabel) return;

    const isDark = root.classList.contains("dark");
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    themeToggleLabel.innerHTML = isDark ? "&#9790;" : "&#9728;";
  };

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = root.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      themeToggle.classList.remove("is-open", "is-closed");
      void themeToggle.offsetWidth;
      themeToggle.classList.add(isDark ? "is-closed" : "is-open");
      syncThemeToggle();
    });
  }

  if (themeToggle) {
    themeToggle.classList.add(root.classList.contains("dark") ? "is-closed" : "is-open");
  }

  syncThemeToggle();

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isExpanded));
      mobileMenu.classList.toggle("hidden");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        mobileMenu.classList.add("hidden");
      });
    });
  }

  if (moreButton && moreMenu) {
    moreButton.addEventListener("click", () => {
      const isExpanded = moreButton.getAttribute("aria-expanded") === "true";
      moreButton.setAttribute("aria-expanded", String(!isExpanded));
      moreButton.setAttribute("aria-label", isExpanded ? "Open more menu" : "Close more menu");
      moreButton.classList.toggle("is-open", isExpanded);
      moreButton.classList.toggle("is-closed", !isExpanded);
      moreMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (event) => {
      if (!moreMenu.contains(event.target) && !moreButton.contains(event.target)) {
        moreButton.setAttribute("aria-expanded", "false");
        moreButton.setAttribute("aria-label", "Open more menu");
        moreButton.classList.add("is-open");
        moreButton.classList.remove("is-closed");
        moreMenu.classList.add("hidden");
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        moreButton.setAttribute("aria-expanded", "false");
        moreButton.setAttribute("aria-label", "Open more menu");
        moreButton.classList.add("is-open");
        moreButton.classList.remove("is-closed");
        moreMenu.classList.add("hidden");
      });
    });
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  if (profileFrame && navProfileChip) {
    const syncNavProfileChip = (entry) => {
      navProfileChip.classList.toggle("is-visible", !entry.isIntersecting);
    };

    let profileObserver;

    const initProfileObserver = () => {
      profileObserver?.disconnect();

      const navHeight = Math.round(document.querySelector("nav")?.offsetHeight || 72);

      profileObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(syncNavProfileChip);
        },
        {
          threshold: 0.2,
          rootMargin: `-${navHeight}px 0px 0px 0px`,
        }
      );

      profileObserver.observe(profileFrame);
    };

    initProfileObserver();
    window.addEventListener("resize", initProfileObserver);
  }

  if (statCounts.length) {
    const animateStatCount = (element) => {
      if (element.dataset.counted === "true") return;

      const target = Number(element.dataset.statTarget || 0);
      const suffix = element.dataset.statSuffix || "";
      const duration = target >= 1000 ? 1400 : 1100;
      const startTime = performance.now();

      element.dataset.counted = "true";

      const updateValue = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(target * easedProgress);

        element.textContent = `${currentValue}${suffix}`;

        if (progress < 1) {
          window.requestAnimationFrame(updateValue);
        } else {
          element.textContent = `${target}${suffix}`;
        }
      };

      window.requestAnimationFrame(updateValue);
    };

    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateStatCount(entry.target);
          statObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );

    statCounts.forEach((count) => statObserver.observe(count));
  }

  const updateActiveNav = () => {
    const scrollMarker = window.scrollY + 140;
    let activeId = sections[0]?.id;

    sections.forEach((section) => {
      if (section.offsetTop <= scrollMarker) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${activeId}`;
      link.classList.toggle("text-accent", isActive);
    });
  };

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  window.addEventListener("load", updateActiveNav);
  updateActiveNav();

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  if (certificateTriggers.length && certificateLightbox && certificateLightboxImage && certificateLightboxClose) {
    const openCertificateLightbox = (trigger) => {
      const { certificateSrc, certificateAlt } = trigger.dataset;
      if (!certificateSrc) return;

      window.clearTimeout(certificateLightboxTimeoutId);
      activeCertificateTrigger = trigger;
      certificateLightboxImage.src = certificateSrc;
      certificateLightboxImage.alt = certificateAlt || "Certificate preview";
      certificateLightbox.classList.remove("hidden");
      certificateLightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      window.requestAnimationFrame(() => {
        certificateLightbox.classList.add("is-open");
        certificateLightboxClose.focus();
      });
    };

    const closeCertificateLightbox = () => {
      certificateLightbox.classList.remove("is-open");
      certificateLightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";

      certificateLightboxTimeoutId = window.setTimeout(() => {
        certificateLightbox.classList.add("hidden");
        certificateLightboxImage.src = "";
        certificateLightboxImage.alt = "";
        activeCertificateTrigger?.focus();
        activeCertificateTrigger = null;
      }, 280);
    };

    certificateTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => openCertificateLightbox(trigger));
    });

    certificateLightbox.addEventListener("click", (event) => {
      if (event.target === certificateLightbox || event.target.dataset.lightboxClose === "true") {
        closeCertificateLightbox();
      }
    });

    certificateLightboxClose.addEventListener("click", closeCertificateLightbox);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !certificateLightbox.classList.contains("hidden")) {
        closeCertificateLightbox();
      }
    });
  }
});
