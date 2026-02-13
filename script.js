const beginJourneyBtn = document.getElementById("begin-journey");
const timelineSection = document.getElementById("timeline");
const heartsContainer = document.querySelector(".hearts");
const finalNoteContent = document.querySelector(".final-note-content");
const musicToggleBtn = document.getElementById("music-toggle");
const romanticMusic = document.getElementById("romantic-music");

beginJourneyBtn.addEventListener("click", () => {
  timelineSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

function createHeartParticle() {
  const heart = document.createElement("span");
  heart.className = "heart-particle";
  heart.textContent = Math.random() > 0.5 ? "♥" : "✦";
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${Math.random() * 12 + 10}px`;
  heart.style.animationDuration = `${Math.random() * 6 + 9}s`;
  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 15000);
}

setInterval(createHeartParticle, 1200);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        finalNoteContent.classList.add("visible");
      }
    });
  },
  { threshold: 0.3 }
);

observer.observe(finalNoteContent);

musicToggleBtn.addEventListener("click", async () => {
  if (!romanticMusic.getAttribute("src") && romanticMusic.querySelector("source")?.src === "") {
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
