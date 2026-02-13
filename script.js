const beginJourneyBtn = document.getElementById("begin-journey");
const timelineSection = document.getElementById("timeline");
const ambient = document.querySelector(".ambient");
const revealElements = document.querySelectorAll(".reveal");
const musicToggleBtn = document.getElementById("music-toggle");
const romanticMusic = document.getElementById("romantic-music");
const musicSource = romanticMusic.querySelector("source");

const loveLetterTrigger = document.getElementById("love-letter-trigger");
const loveLetterOverlay = document.getElementById("love-letter-overlay");
const loveLetterModal = document.querySelector(".love-letter-modal");
const heartBurst = document.getElementById("heart-burst");
const fallingHearts = document.getElementById("falling-hearts");
const letterMusic = document.getElementById("letter-music");

let ambientTimer = null;
let fallingHeartsTimer = null;

beginJourneyBtn.addEventListener("click", () => {
  timelineSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

function addParticle() {
  const particle = document.createElement("span");
  particle.className = "particle";
  particle.textContent = Math.random() > 0.55 ? "♥" : "✦";
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.fontSize = `${Math.random() * 12 + 10}px`;
  particle.style.animationDuration = `${Math.random() * 7 + 9}s`;
  ambient.appendChild(particle);

  window.setTimeout(() => particle.remove(), 16000);
}

ambientTimer = window.setInterval(addParticle, 1400);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealElements.forEach((item) => revealObserver.observe(item));

musicToggleBtn.addEventListener("click", async () => {
  const hasSource = Boolean(musicSource?.getAttribute("src"));
  if (!hasSource) {
    return;
  }

  if (romanticMusic.paused) {
    try {
      await romanticMusic.play();
      musicToggleBtn.classList.add("playing");
      musicToggleBtn.textContent = "❚❚";
    } catch {
      musicToggleBtn.textContent = "♫";
    }
  } else {
    romanticMusic.pause();
    musicToggleBtn.classList.remove("playing");
    musicToggleBtn.textContent = "♫";
  }
});

function spawnHeartBurst() {
  heartBurst.innerHTML = "";
  const total = 22;

  for (let i = 0; i < total; i += 1) {
    const heart = document.createElement("span");
    heart.className = "burst-heart";
    heart.textContent = Math.random() > 0.35 ? "❤" : "✦";

    const angle = (Math.PI * 2 * i) / total;
    const distance = 90 + Math.random() * 170;
    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance;

    heart.style.setProperty("--tx", `${offsetX}px`);
    heart.style.setProperty("--ty", `${offsetY}px`);
    heart.style.animationDelay = `${Math.random() * 0.08}s`;
    heart.style.fontSize = `${14 + Math.random() * 18}px`;

    heartBurst.appendChild(heart);

    window.setTimeout(() => {
      heart.remove();
    }, 1500);
  }
}

function spawnFallingHeart() {
  const heart = document.createElement("span");
  heart.className = "fall-heart";
  heart.textContent = Math.random() > 0.4 ? "❤" : "✦";
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${12 + Math.random() * 10}px`;
  heart.style.animationDuration = `${5.5 + Math.random() * 3.5}s`;
  heart.style.opacity = `${0.45 + Math.random() * 0.35}`;
  fallingHearts.appendChild(heart);

  window.setTimeout(() => {
    heart.remove();
  }, 9000);
}

async function openLoveLetter() {
  document.body.classList.add("modal-open");
  loveLetterOverlay.classList.add("open");
  loveLetterOverlay.setAttribute("aria-hidden", "false");
  spawnHeartBurst();

  window.setTimeout(() => {
    fallingHeartsTimer = window.setInterval(spawnFallingHeart, 620);
  }, 700);

  if (!romanticMusic.paused) {
    romanticMusic.pause();
    musicToggleBtn.classList.remove("playing");
    musicToggleBtn.textContent = "♫";
  }

  try {
    await letterMusic.play();
  } catch {
    // ignore autoplay restrictions from some browsers
  }
}

function closeLoveLetter() {
  document.body.classList.remove("modal-open");
  loveLetterOverlay.classList.remove("open");
  loveLetterOverlay.setAttribute("aria-hidden", "true");
  letterMusic.pause();
  letterMusic.currentTime = 0;

  if (fallingHeartsTimer) {
    window.clearInterval(fallingHeartsTimer);
    fallingHeartsTimer = null;
  }

  window.setTimeout(() => {
    fallingHearts.innerHTML = "";
    heartBurst.innerHTML = "";
  }, 350);
}

loveLetterTrigger.addEventListener("click", openLoveLetter);

loveLetterOverlay.addEventListener("click", (event) => {
  if (!loveLetterModal.contains(event.target)) {
    closeLoveLetter();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && loveLetterOverlay.classList.contains("open")) {
    closeLoveLetter();
  }
});

window.addEventListener("beforeunload", () => {
  if (ambientTimer) {
    window.clearInterval(ambientTimer);
  }
  if (fallingHeartsTimer) {
    window.clearInterval(fallingHeartsTimer);
  }
});
