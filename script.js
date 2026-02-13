const questionCard = document.getElementById("question-card");
const messageCard = document.getElementById("message-card");
const husbandBtn = document.getElementById("husband-btn");
const strangerBtn = document.getElementById("stranger-btn");

husbandBtn.addEventListener("click", () => {
  questionCard.classList.add("hidden");
  messageCard.classList.remove("hidden");
});

strangerBtn.addEventListener("mouseenter", () => {
  const x = Math.random() * 180 - 90;
  const y = Math.random() * 80 - 40;
  strangerBtn.style.transform = `translate(${x}px, ${y}px)`;
});

strangerBtn.addEventListener("click", () => {
  strangerBtn.textContent = "Nope 😄";
});
