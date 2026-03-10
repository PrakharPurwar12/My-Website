(() => {
  if (window.matchMedia("(pointer: coarse)").matches) {
    return;
  }

  const cursorRing = document.createElement("span");
  cursorRing.className = "cursor-ring";
  document.body.appendChild(cursorRing);

  let currentX = window.innerWidth / 2;
  let currentY = window.innerHeight / 2;
  let targetX = currentX;
  let targetY = currentY;
  let rafId = 0;

  function startRenderLoop() {
    if (rafId) {
      return;
    }

    rafId = window.requestAnimationFrame(render);
  }

  function render() {
    currentX += (targetX - currentX) * 0.42;
    currentY += (targetY - currentY) * 0.42;
    cursorRing.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

    if (Math.abs(targetX - currentX) < 0.1 && Math.abs(targetY - currentY) < 0.1) {
      rafId = 0;
      return;
    }

    rafId = window.requestAnimationFrame(render);
  }

  window.addEventListener(
    "pointermove",
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursorRing.classList.add("is-visible");
      startRenderLoop();
    },
    { passive: true }
  );

  window.addEventListener("mousedown", () => {
    cursorRing.classList.add("is-active");
  });

  window.addEventListener("mouseup", () => {
    cursorRing.classList.remove("is-active");
  });

  document.addEventListener("mouseleave", () => {
    cursorRing.classList.remove("is-visible");
  });

  window.addEventListener("blur", () => {
    cursorRing.classList.remove("is-visible");
  });
})();
