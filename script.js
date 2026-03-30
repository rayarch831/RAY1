const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;

const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const typedText = document.getElementById("typed-text");
const heroFrame = document.querySelector(".hero-frame");
const heroMask = document.querySelector(".hero-mask");
const sketchLines = document.querySelectorAll(".hero-sketch rect, .hero-sketch path, .hero-sketch line");
const revealItems = document.querySelectorAll(".reveal");
const transformationFrames = document.querySelectorAll(".transformation-frame");
const thinkingOptions = document.querySelectorAll(".thinking-option");
const thinkingResults = document.querySelectorAll(".thinking-result");
const contactForm = document.querySelector(".contact-form");
const formResponse = document.querySelector(".form-response");
const siteHeader = document.querySelector(".site-header");

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

function initCursor() {
  if (!cursorDot || !cursorRing || coarsePointer) {
    return;
  }

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }

  animateRing();

  document.querySelectorAll("a, button, .transformation-frame, .thinking-option").forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursorRing.style.width = "56px";
      cursorRing.style.height = "56px";
      cursorRing.style.opacity = "0.88";
    });

    element.addEventListener("mouseleave", () => {
      cursorRing.style.width = "34px";
      cursorRing.style.height = "34px";
      cursorRing.style.opacity = "0.55";
    });
  });
}

function typeHeroTitle() {
  if (!typedText) {
    return;
  }

  const copy = "Do you see space... or just walls?";
  let index = 0;

  function tick() {
    if (index > copy.length) {
      return;
    }

    typedText.textContent = copy.slice(0, index);
    index += 1;
    setTimeout(tick, index < copy.length ? 52 : 120);
  }

  tick();
}

function animateHeroFigure() {
  if (!heroMask || !sketchLines.length) {
    return;
  }

  if (prefersReducedMotion) {
    heroMask.style.transform = "scaleX(0)";
    sketchLines.forEach((line) => {
      line.style.strokeDashoffset = "0";
    });
    return;
  }

  sketchLines.forEach((line, index) => {
    line.style.transition = `stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1) ${index * 0.06}s`;
    requestAnimationFrame(() => {
      line.style.strokeDashoffset = "0";
    });
  });

  setTimeout(() => {
    heroMask.style.transition = "transform 1.8s cubic-bezier(0.77,0,0.175,1)";
    heroMask.style.transformOrigin = "right center";
    heroMask.style.transform = "scaleX(0)";
  }, 1800);
}

function initHeroParallax() {
  if (!heroFrame || prefersReducedMotion || coarsePointer) {
    return;
  }

  const heroRender = heroFrame.querySelector(".hero-render");
  const heroCopy = document.querySelector(".hero-copy");

  heroFrame.addEventListener("mousemove", (event) => {
    const bounds = heroFrame.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

    if (heroRender) {
      heroRender.style.transform = `scale(1.04) translate(${offsetX * 12}px, ${offsetY * 12}px)`;
    }

    if (heroCopy) {
      heroCopy.style.transform = `translate(${offsetX * -8}px, ${offsetY * -8}px)`;
    }
  });

  heroFrame.addEventListener("mouseleave", () => {
    if (heroRender) {
      heroRender.style.transform = "scale(1.02)";
    }

    if (heroCopy) {
      heroCopy.style.transform = "translate(0, 0)";
    }
  });
}

function initRevealObserver() {
  if (!revealItems.length) {
    return;
  }

  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add("in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initTransformations() {
  if (!coarsePointer) {
    return;
  }

  transformationFrames.forEach((frame) => {
    frame.addEventListener("click", () => {
      const isActive = frame.classList.contains("is-active");
      transformationFrames.forEach((item) => item.classList.remove("is-active"));
      if (!isActive) {
        frame.classList.add("is-active");
      }
    });
  });
}

function initThinkingBlock() {
  thinkingOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const target = option.dataset.target;

      thinkingOptions.forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });

      thinkingResults.forEach((result) => {
        result.classList.toggle("is-active", result.id === target);
      });

      option.classList.add("is-active");
      option.setAttribute("aria-pressed", "true");
    });
  });
}

function initForm() {
  if (!contactForm || !formResponse) {
    return;
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      formResponse.textContent = "Please complete each field before booking your first studio session.";
      return;
    }

    formResponse.textContent = "Session request received. RayArch Academy will contact you shortly.";
    contactForm.reset();
  });
}

function initHeaderState() {
  if (!siteHeader) {
    return;
  }

  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      siteHeader.style.background = "rgba(7, 7, 7, 0.86)";
      siteHeader.style.backdropFilter = "blur(12px)";
    } else {
      siteHeader.style.background = "transparent";
      siteHeader.style.backdropFilter = "none";
    }
  });
}

window.addEventListener("load", () => {
  initCursor();
  typeHeroTitle();
  animateHeroFigure();
  initHeroParallax();
  initRevealObserver();
  initTransformations();
  initThinkingBlock();
  initForm();
  initHeaderState();
});
