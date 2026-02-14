const beginJourneyBtn = document.getElementById("begin-journey");
const timelineSection = document.getElementById("timeline");
const ambient = document.querySelector(".ambient");
const revealElements = document.querySelectorAll(".reveal");
const loveLetterTrigger = document.getElementById("love-letter-trigger");
const loveLetterOverlay = document.getElementById("love-letter-overlay");
const loveLetterModal = document.querySelector(".love-letter-modal");
const heartBurst = document.getElementById("heart-burst");
const fallingHearts = document.getElementById("falling-hearts");
const letterMusic = document.getElementById("letter-music");

const questionScreen = document.getElementById("question-screen");
const questionBgHearts = document.getElementById("question-bg-hearts");
const wrongAnswerBtn = document.getElementById("wrong-answer");
const correctAnswerBtn = document.getElementById("correct-answer");
const teaseText = document.getElementById("tease-text");
const successMessage = document.getElementById("success-message");
const enterStoryBtn = document.getElementById("enter-story");
const questionHeartBurst = document.getElementById("question-heart-burst");
const mainContent = document.getElementById("main-content");

let ambientTimer = null;
let bgHeartsTimer = null;
let fallingHeartsTimer = null;
let dodgeAttempts = 0;

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

function spawnQuestionHeart() {
  const heart = document.createElement("span");
  heart.className = "bg-heart";
  heart.textContent = Math.random() > 0.45 ? "❤" : "✦";
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${12 + Math.random() * 15}px`;
  heart.style.animationDuration = `${8 + Math.random() * 4}s`;
  questionBgHearts.appendChild(heart);

  window.setTimeout(() => heart.remove(), 13000);
}

ambientTimer = window.setInterval(addParticle, 1400);
bgHeartsTimer = window.setInterval(spawnQuestionHeart, 700);

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

function spawnHeartBurst(container) {
  container.innerHTML = "";
  const total = 24;

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

    container.appendChild(heart);

    window.setTimeout(() => {
      heart.remove();
    }, 1500);
  }
}

function dodgeWrongButton() {
  wrongAnswerBtn.classList.add("dodge");
  const area = document.getElementById("answer-row").getBoundingClientRect();
  const btnRect = wrongAnswerBtn.getBoundingClientRect();

  const maxX = Math.max(area.width - btnRect.width, 8);
  const maxY = Math.max(area.height - btnRect.height, 8);

  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  wrongAnswerBtn.style.left = `${randomX}px`;
  wrongAnswerBtn.style.top = `${randomY}px`;
  wrongAnswerBtn.style.transform = "scale(0.94)";

  window.setTimeout(() => {
    wrongAnswerBtn.style.transform = "scale(1)";
  }, 150);

  dodgeAttempts += 1;
  wrongAnswerBtn.textContent = dodgeAttempts > 1 ? "Are you sure? 😏" : "You 😌";
  teaseText.textContent = "Nope nope… try the sweeter truth 💘";
}

function unlockStory() {
  successMessage.classList.add("show");
  correctAnswerBtn.disabled = true;
  wrongAnswerBtn.disabled = true;
  teaseText.textContent = "";
  spawnHeartBurst(questionHeartBurst);
}

wrongAnswerBtn.addEventListener("mouseenter", dodgeWrongButton);
wrongAnswerBtn.addEventListener("click", dodgeWrongButton);

correctAnswerBtn.addEventListener("click", unlockStory);

enterStoryBtn.addEventListener("click", () => {
  questionScreen.classList.add("hidden");
  mainContent.classList.remove("locked");
  mainContent.setAttribute("aria-hidden", "false");
  window.setTimeout(() => {
    questionScreen.style.display = "none";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 700);
});

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
  spawnHeartBurst(heartBurst);

  window.setTimeout(() => {
    fallingHeartsTimer = window.setInterval(spawnFallingHeart, 620);
  }, 700);

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
  if (bgHeartsTimer) {
    window.clearInterval(bgHeartsTimer);
  }
  if (fallingHeartsTimer) {
    window.clearInterval(fallingHeartsTimer);
  }
});
