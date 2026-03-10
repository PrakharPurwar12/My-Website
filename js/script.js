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
  const footerYear = document.getElementById("footer-year");

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
      syncThemeToggle();
    });
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
      moreMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (event) => {
      if (!moreMenu.contains(event.target) && !moreButton.contains(event.target)) {
        moreButton.setAttribute("aria-expanded", "false");
        moreMenu.classList.add("hidden");
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        moreButton.setAttribute("aria-expanded", "false");
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
});
