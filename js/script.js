(() => {
  const storedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (storedTheme === "dark" || (!storedTheme && systemPrefersDark)) {
    document.documentElement.classList.add("dark");
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  root.classList.add("reveal-enabled");
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
  const heroTypingText = document.getElementById("hero-typing-text");
  const footerYear = document.getElementById("footer-year");
  const scrollProgressBar = document.getElementById("scroll-progress-bar");
  const navElement = document.querySelector("nav");
  const profileFrame = document.querySelector(".profile-frame");
  const navProfileChip = document.querySelector(".nav-profile-chip");
  const educationPanel = document.querySelector(".education-panel");
  const educationScroll = document.querySelector(".education-scroll");
  const certificateTriggers = document.querySelectorAll(".certificate-trigger");
  const certificateLightbox = document.getElementById("certificate-lightbox");
  const certificateLightboxImage = document.getElementById("certificate-lightbox-image");
  const certificateLightboxClose = document.getElementById("certificate-lightbox-close");
  const caseStudyTriggers = document.querySelectorAll(".case-study-trigger");
  const caseStudyModal = document.getElementById("case-study-modal");
  const caseStudyTitle = document.getElementById("case-study-title");
  const caseStudyProblem = document.getElementById("case-study-problem");
  const caseStudyBuild = document.getElementById("case-study-build");
  const caseStudyStack = document.getElementById("case-study-stack");
  const caseStudyImpact = document.getElementById("case-study-impact");
  const caseStudyClose = document.getElementById("case-study-close");
  let activeCertificateTrigger = null;
  let certificateLightboxTimeoutId = null;
  let caseStudyModalTimeoutId = null;
  let activeCaseStudyTrigger = null;

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

  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const prefersCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (prefersCoarsePointer) {
    const rippleTargets = document.querySelectorAll(
      "a, button, .section-shell, .surface-card, .project-card, .certificate-trigger, .footer-panel"
    );

    rippleTargets.forEach((target) => {
      target.classList.add("touch-ripple-host");

      target.addEventListener(
        "pointerdown",
        (event) => {
          if (event.pointerType !== "touch") return;

          const targetRect = target.getBoundingClientRect();
          const ripple = document.createElement("span");
          ripple.className = "touch-ripple";
          ripple.style.left = `${event.clientX - targetRect.left}px`;
          ripple.style.top = `${event.clientY - targetRect.top}px`;
          target.appendChild(ripple);

          window.setTimeout(() => {
            ripple.remove();
          }, 560);
        },
        { passive: true }
      );
    });
  }

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      event.preventDefault();

      const navHeight = Math.round(navElement?.offsetHeight || 72);
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight - 18;

      window.scrollTo({
        top: Math.max(targetPosition, 0),
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });

      if (window.history.pushState) {
        window.history.pushState(null, "", targetId);
      }
    });
  });

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

  const syncInitialRevealState = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    revealItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const isInInitialViewport = rect.top < viewportHeight * 0.92 && rect.bottom > viewportHeight * 0.08;
      item.classList.toggle("is-visible", isInInitialViewport);
    });
  };

  syncInitialRevealState();

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const hasMeaningfulOverlap =
          entry.intersectionRatio > 0.04 ||
          (entry.boundingClientRect.top < viewportHeight * 0.9 && entry.boundingClientRect.bottom > viewportHeight * 0.12);

        entry.target.classList.toggle("is-visible", hasMeaningfulOverlap);
      });
    },
    {
      threshold: [0, 0.04, 0.12, 0.22],
      rootMargin: "0px 0px -2% 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
  window.addEventListener("resize", syncInitialRevealState);

  if (heroTypingText?.dataset.typingText) {
    const typingSource = heroTypingText.dataset.typingText;
    let typingIndex = 0;
    let isDeleting = false;

    const runTypingLoop = () => {
      const nextText = typingSource.slice(0, typingIndex);
      heroTypingText.textContent = nextText;

      if (!isDeleting && typingIndex < typingSource.length) {
        typingIndex += 1;
        window.setTimeout(runTypingLoop, 85);
        return;
      }

      if (!isDeleting && typingIndex === typingSource.length) {
        isDeleting = true;
        window.setTimeout(runTypingLoop, 1200);
        return;
      }

      if (isDeleting && typingIndex > 0) {
        typingIndex -= 1;
        window.setTimeout(runTypingLoop, 42);
        return;
      }

      isDeleting = false;
      window.setTimeout(runTypingLoop, 260);
    };

    runTypingLoop();
  }

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

  if (educationPanel && educationScroll) {
    let educationScrollStateTimeoutId = null;

    const syncEducationProgress = () => {
      const maxScroll = educationScroll.scrollHeight - educationScroll.clientHeight;
      const progress = maxScroll <= 0 ? 0 : educationScroll.scrollTop / maxScroll;
      educationPanel.style.setProperty("--education-progress", progress.toFixed(4));
    };

    educationScroll.addEventListener(
      "scroll",
      () => {
        educationPanel.classList.add("is-scrolling");
        syncEducationProgress();
        window.clearTimeout(educationScrollStateTimeoutId);
        educationScrollStateTimeoutId = window.setTimeout(() => {
          educationPanel.classList.remove("is-scrolling");
        }, 140);
      },
      { passive: true }
    );

    window.addEventListener("resize", syncEducationProgress);
    syncEducationProgress();
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

    if (navElement) {
      navElement.classList.toggle("is-scrolled", window.scrollY > 18);
    }
  };

  const updateScrollProgress = () => {
    if (!scrollProgressBar) return;

    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight <= 0 ? 0 : (window.scrollY / scrollableHeight) * 100;
    scrollProgressBar.style.width = `${Math.min(progress, 100)}%`;
  };

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("load", updateActiveNav);
  window.addEventListener("load", updateScrollProgress);
  updateActiveNav();
  updateScrollProgress();

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  if (
    caseStudyTriggers.length &&
    caseStudyModal &&
    caseStudyTitle &&
    caseStudyProblem &&
    caseStudyBuild &&
    caseStudyStack &&
    caseStudyImpact &&
    caseStudyClose
  ) {
    const closeCaseStudyModal = ({ restoreFocus = true } = {}) => {
      caseStudyModal.classList.remove("is-open");
      caseStudyModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";

      window.clearTimeout(caseStudyModalTimeoutId);
      caseStudyModalTimeoutId = window.setTimeout(() => {
        caseStudyModal.classList.add("hidden");

        if (activeCaseStudyTrigger) {
          activeCaseStudyTrigger.setAttribute("aria-expanded", "false");
          if (restoreFocus) {
            activeCaseStudyTrigger.focus();
          }
        }

        activeCaseStudyTrigger = null;
      }, 280);
    };

    const openCaseStudyModal = (trigger) => {
      const isSameTrigger = activeCaseStudyTrigger === trigger && caseStudyModal.classList.contains("is-open");

      if (isSameTrigger) {
        closeCaseStudyModal();
        return;
      }

      window.clearTimeout(caseStudyModalTimeoutId);

      if (activeCaseStudyTrigger) {
        activeCaseStudyTrigger.setAttribute("aria-expanded", "false");
      }

      caseStudyTitle.textContent = trigger.dataset.caseTitle || "Project Case Study";
      caseStudyProblem.textContent = trigger.dataset.caseProblem || "";
      caseStudyBuild.textContent = trigger.dataset.caseBuild || "";
      caseStudyStack.textContent = trigger.dataset.caseStack || "";
      caseStudyImpact.textContent = trigger.dataset.caseImpact || "";

      activeCaseStudyTrigger = trigger;
      activeCaseStudyTrigger.setAttribute("aria-expanded", "true");
      caseStudyModal.classList.remove("hidden");
      caseStudyModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      window.requestAnimationFrame(() => {
        caseStudyModal.classList.add("is-open");
        caseStudyClose.focus();
      });
    };

    caseStudyTriggers.forEach((trigger) => {
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-controls", "case-study-modal");
      trigger.addEventListener("click", () => openCaseStudyModal(trigger));
    });

    caseStudyModal.addEventListener("click", (event) => {
      if (event.target === caseStudyModal || event.target.dataset.caseClose === "true") {
        closeCaseStudyModal();
      }
    });

    caseStudyClose.addEventListener("click", () => closeCaseStudyModal());

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !caseStudyModal.classList.contains("hidden")) {
        closeCaseStudyModal();
      }
    });
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
