const archetypes = {
  bridge: {
    label: "The Bridge",
    reflection:
      "You move between cultures with awareness and flexibility. Your strength is translation and connection, though this can also come with emotional labor and the pressure to always mediate between worlds.",
    priority: 3,
  },
  adapter: {
    label: "The Adapter",
    reflection:
      "You often align with dominant culture to navigate spaces efficiently and safely. This adaptability can open opportunities, while also creating tension when parts of your background feel muted.",
    priority: 2,
  },
  rootKeeper: {
    label: "The Root Keeper",
    reflection:
      "You maintain a strong relationship to your home culture and identity. This grounding offers clarity and continuity, while sometimes making external environments feel less aligned with how you see yourself.",
    priority: 1,
  },
  splitSelf: {
    label: "The Split Self",
    reflection:
      "You experience different versions of self across different spaces. This awareness reveals complexity and resilience, but it can also feel tiring when your identities rarely settle into one coherent whole.",
    priority: 4,
  },
  drifter: {
    label: "The Drifter",
    reflection:
      "You feel detached from both home and dominant cultures, shaping identity on your own terms. This independence can be freeing, though it may carry loneliness or a persistent sense of distance from belonging.",
    priority: 0,
  },
};

const questions = [
  {
    prompt: "What language do you think in most often?",
    options: [
      { text: "Mostly my home language", scores: { rootKeeper: 2 } },
      { text: "Mostly the dominant/local language", scores: { adapter: 2 } },
      { text: "It switches depending on context", scores: { bridge: 2 } },
      { text: "I don't feel tied to one language", scores: { drifter: 2 } },
    ],
  },
  {
    prompt: "Where do you feel most like yourself?",
    options: [
      { text: "At home", scores: { rootKeeper: 2 } },
      { text: "Outside", scores: { adapter: 2 } },
      { text: "Both, but in different ways", scores: { splitSelf: 2 } },
      { text: "Neither fully", scores: { drifter: 2 } },
    ],
  },
  {
    prompt: "How often do you adjust your behavior depending on who you're with?",
    options: [
      { text: "Rarely", scores: { rootKeeper: 1 } },
      { text: "Sometimes", scores: { bridge: 1 } },
      { text: "Very often", scores: { adapter: 2 } },
      { text: "Constantly, I feel like different people", scores: { splitSelf: 2 } },
    ],
  },
  {
    prompt: "What kind of media do you mostly consume?",
    options: [
      { text: "From my home culture", scores: { rootKeeper: 2 } },
      { text: "From the dominant culture", scores: { adapter: 2 } },
      { text: "A mix of both", scores: { bridge: 2 } },
      { text: 'None of them feel like "mine"', scores: { drifter: 2 } },
    ],
  },
  {
    prompt: 'How do you feel when someone asks "where are you from?"',
    options: [
      { text: "Clear and confident", scores: { rootKeeper: 1 } },
      { text: "I simplify my answer", scores: { adapter: 2 } },
      { text: "I hesitate or give multiple answers", scores: { bridge: 2 } },
      { text: "I feel disconnected from the question", scores: { drifter: 2 } },
    ],
  },
  {
    prompt: "How connected do you feel to your cultural background?",
    options: [
      { text: "Very connected", scores: { rootKeeper: 2 } },
      { text: "Somewhat, but not fully", scores: { bridge: 1 } },
      { text: "Not really", scores: { adapter: 1 } },
      { text: "I feel distant from all of it", scores: { drifter: 2 } },
    ],
  },
  {
    prompt:
      "Do you feel like different versions of yourself exist in different spaces?",
    options: [
      { text: "Not really", scores: { rootKeeper: 1 } },
      { text: "A little", scores: { bridge: 1 } },
      { text: "Yes, quite a bit", scores: { splitSelf: 2 } },
      {
        text: "Completely different identities",
        scores: { splitSelf: 2, drifter: 1 },
      },
    ],
  },
  {
    prompt: "How would you describe your sense of belonging?",
    options: [
      { text: "Strong in one place", scores: { rootKeeper: 2 } },
      { text: "I adapt to where I am", scores: { adapter: 2 } },
      { text: "I exist between places", scores: { bridge: 2 } },
      { text: "I don't feel like I belong anywhere", scores: { drifter: 2 } },
    ],
  },
];

const introCard = document.getElementById("introCard");
const quizCard = document.getElementById("quizCard");
const resultCard = document.getElementById("resultCard");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const questionText = document.getElementById("questionText");
const answersForm = document.getElementById("answersForm");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const resultTitle = document.getElementById("resultTitle");
const resultBody = document.getElementById("resultBody");

let currentIndex = 0;
let selectedOptionIndex = null;
let selectedAnswers = [];

function resetState() {
  currentIndex = 0;
  selectedOptionIndex = null;
  selectedAnswers = new Array(questions.length).fill(null);
}

function showQuizView() {
  introCard.classList.add("hidden");
  resultCard.classList.add("hidden");
  resultCard.removeAttribute("data-archetype");
  quizCard.classList.remove("hidden");
}

function renderQuestion() {
  const q = questions[currentIndex];
  selectedOptionIndex = selectedAnswers[currentIndex];
  nextBtn.disabled = selectedOptionIndex === null;
  backBtn.disabled = currentIndex === 0;

  questionText.textContent = q.prompt;
  progressText.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  progressFill.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;
  answersForm.innerHTML = "";

  q.options.forEach((option, idx) => {
    const optionId = `option-${currentIndex}-${idx}`;
    const label = document.createElement("label");
    label.className = "answer-option";
    label.setAttribute("for", optionId);

    const input = document.createElement("input");
    input.type = "radio";
    input.name = `question-${currentIndex}`;
    input.id = optionId;
    input.value = String(idx);
    input.checked = idx === selectedOptionIndex;

    input.addEventListener("change", () => {
      selectedOptionIndex = idx;
      nextBtn.disabled = false;
      document.querySelectorAll(".answer-option").forEach((node) => {
        node.classList.remove("selected");
      });
      label.classList.add("selected");
    });

    const textNode = document.createTextNode(option.text);
    label.appendChild(input);
    label.appendChild(textNode);
    if (idx === selectedOptionIndex) {
      label.classList.add("selected");
    }
    answersForm.appendChild(label);
  });

  nextBtn.textContent =
    currentIndex === questions.length - 1 ? "See Reflection" : "Next";
}

function selectResultArchetype() {
  const scores = {
    bridge: 0,
    adapter: 0,
    rootKeeper: 0,
    splitSelf: 0,
    drifter: 0,
  };

  selectedAnswers.forEach((answerIndex, questionIndex) => {
    const chosen = questions[questionIndex].options[answerIndex];
    Object.entries(chosen.scores).forEach(([key, value]) => {
      scores[key] += value;
    });
  });

  const maxScore = Math.max(...Object.values(scores));
  const tied = Object.keys(scores).filter((key) => scores[key] === maxScore);

  if (tied.length === 1) {
    return tied[0];
  }

  // Tie-breaker favors transitional/unstable identities by priority.
  return tied.sort((a, b) => archetypes[b].priority - archetypes[a].priority)[0];
}

function showResult() {
  const resultKey = selectResultArchetype();
  const result = archetypes[resultKey];

  quizCard.classList.add("hidden");
  resultCard.classList.remove("hidden");
  resultCard.setAttribute("data-archetype", resultKey);

  resultTitle.textContent = result.label;
  resultBody.textContent = result.reflection;
}

startBtn.addEventListener("click", () => {
  resetState();
  showQuizView();
  renderQuestion();
});

nextBtn.addEventListener("click", () => {
  if (selectedOptionIndex === null) {
    return;
  }

  selectedAnswers[currentIndex] = selectedOptionIndex;

  if (currentIndex < questions.length - 1) {
    currentIndex += 1;
    renderQuestion();
    return;
  }

  showResult();
});

backBtn.addEventListener("click", () => {
  selectedAnswers[currentIndex] = selectedOptionIndex;
  if (currentIndex === 0) {
    return;
  }

  currentIndex -= 1;
  renderQuestion();
});

restartBtn.addEventListener("click", () => {
  resetState();
  showQuizView();
  renderQuestion();
});
