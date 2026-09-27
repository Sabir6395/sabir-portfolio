// ==========================================================
// Portfolio scripts — Mohammad Sabir Shareef
// Loaded with `defer`, so the HTML is fully parsed before this runs.
//
//   1. Mobile navigation menu
//   2. Terminal typing animation
//   3. Fade-in sections on scroll
//   4. Highlight the active nav link
// ==========================================================

// True if the visitor turned off animations in their OS settings
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


// ----------------------------------------------------------
// 1. Mobile navigation menu
// ----------------------------------------------------------
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#nav-menu");

function isMenuOpen() {
  return navToggle.getAttribute("aria-expanded") === "true";
}

// aria-expanded tells screen readers whether the menu is open,
// and the CSS uses it to turn the hamburger into an X
function setMenuOpen(isOpen) {
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  navMenu.classList.toggle("is-open", isOpen);
}

navToggle.addEventListener("click", () => {
  setMenuOpen(!isMenuOpen());
});

// Close the menu after a link is tapped
navMenu.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setMenuOpen(false);
  }
});

// Close with the Escape key and return focus to the button
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isMenuOpen()) {
    setMenuOpen(false);
    navToggle.focus();
  }
});

// Close when tapping anywhere outside the navbar
document.addEventListener("click", (event) => {
  if (isMenuOpen() && !event.target.closest(".site-header")) {
    setMenuOpen(false);
  }
});


// ----------------------------------------------------------
// 2. Terminal typing animation (runs once on page load)
// ----------------------------------------------------------
const terminalBody = document.querySelector(".terminal-body");

const START_DELAY = 400;  // ms before typing starts
const CHAR_DELAY = 25;    // ms between characters
const LINE_DELAY = 250;   // ms pause after each line

// Returns a promise that resolves after `ms` milliseconds, so we can `await` a pause
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Collects every text node inside an element, in reading order.
// Typing into these (instead of the whole line) keeps the colored <span>s intact.
function getTextNodes(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }
  return nodes;
}

async function typeTerminal() {
  const lines = [...terminalBody.querySelectorAll(".terminal-line")];

  const caret = document.createElement("span");
  caret.className = "terminal-caret";

  // Reduced motion: show everything at once, just add the cursor
  if (prefersReducedMotion) {
    lines[lines.length - 1].append(caret);
    terminalBody.classList.add("is-ready");
    return;
  }

  // Remember each piece of text, then empty it
  const linePieces = lines.map((line) =>
    getTextNodes(line).map((node) => {
      const text = node.textContent;
      node.textContent = "";
      return { node, text };
    })
  );

  // Text is cleared, so it's safe to show the terminal now
  terminalBody.classList.add("is-ready");
  await wait(START_DELAY);

  for (let i = 0; i < lines.length; i++) {
    lines[i].append(caret);  // move the cursor to the current line

    for (const piece of linePieces[i]) {
      for (const char of piece.text) {
        piece.node.textContent += char;
        await wait(CHAR_DELAY);
      }
    }

    await wait(LINE_DELAY);
  }
}

if (terminalBody) {
  typeTerminal();
}


// ----------------------------------------------------------
// 3. Fade-in sections on scroll
// ----------------------------------------------------------
// IntersectionObserver tells us when an element enters the screen,
// without having to check on every scroll event.
if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);  // animate only once
        }
      });
    },
    // Trigger when the section is 10% of the screen height above the bottom edge
    { rootMargin: "0px 0px -10% 0px" }
  );

  document.querySelectorAll("main section:not(#hero)").forEach((section) => {
    section.classList.add("reveal");
    revealObserver.observe(section);
  });
}


// ----------------------------------------------------------
// 4. Highlight the active nav link while scrolling
// ----------------------------------------------------------
const navLinks = [...document.querySelectorAll(".nav-link")];
const linkedSections = navLinks.map((link) => document.querySelector(link.getAttribute("href")));
const siteHeader = document.querySelector(".site-header");

function updateActiveLink() {
  // A section counts as "current" once its top passes a line
  // a third of the way down the screen (below the navbar)
  const checkLine = window.scrollY + siteHeader.offsetHeight + window.innerHeight / 3;
  const atPageBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

  let activeIndex = -1;  // -1 = no link active (we're on the hero)
  linkedSections.forEach((section, index) => {
    if (section.offsetTop <= checkLine) {
      activeIndex = index;
    }
  });

  // The last section may be too short to reach the line, so force it at the very bottom
  if (atPageBottom) {
    activeIndex = linkedSections.length - 1;
  }

  navLinks.forEach((link, index) => {
    const isActive = index === activeIndex;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

// requestAnimationFrame runs the check at most once per frame, keeping scrolling smooth
let scrollTicking = false;
window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateActiveLink();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  },
  { passive: true }
);

window.addEventListener("resize", updateActiveLink);
updateActiveLink();
