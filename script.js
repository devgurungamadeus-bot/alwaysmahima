const beginJourneyBtn = document.getElementById("begin-journey");
const timelineSection = document.getElementById("timeline");
const ambient = document.querySelector(".ambient");
const revealElements = document.querySelectorAll(".reveal");
const musicToggleBtn = document.getElementById("music-toggle");
const romanticMusic = document.getElementById("romantic-music");
const musicSource = romanticMusic.querySelector("source");

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

  setTimeout(() => particle.remove(), 16000);
}

setInterval(addParticle, 1400);

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
