document.addEventListener("DOMContentLoaded", () => {
  const questions = [
    {
      type: 'single',
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Venus", "Jupiter"],
      answer: "Mars"
    },
    {
      type: 'multi',
      question: "Select the prime numbers:",
      options: ["2", "3", "4", "6"],
      answer: ["2", "3"]
    },
    {
      type: 'text',
      question: "Fill in the blank: The capital of France is _____.",
      answer: "Paris"
    }
  ];

  let currentIndex = 0;
  let score = 0;
  let timer;
  let timeLeft = 15;

  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const textInputEl = document.getElementById("text-input");
  const nextBtn = document.getElementById("next-btn");
  const resultEl = document.getElementById("result");
  const feedback = document.getElementById("feedback");
  const timerDisplay = document.getElementById("timer");

  function loadQuestion() {
    resetState();

    const current = questions[currentIndex];
    questionEl.textContent = `Q${currentIndex + 1}: ${current.question}`;

    if (current.type === 'single') {
      current.options.forEach(option => {
        const label = document.createElement('label');
        label.className = 'option';
        label.innerHTML = `<input type="radio" name="option" value="${option}"> ${option}`;
        optionsEl.appendChild(label);
      });
    } else if (current.type === 'multi') {
      current.options.forEach(option => {
        const label = document.createElement('label');
        label.className = 'option';
        label.innerHTML = `<input type="checkbox" name="option" value="${option}"> ${option}`;
        optionsEl.appendChild(label);
      });
    } else if (current.type === 'text') {
      textInputEl.style.display = "block";
    }

    startTimer();
  }

  function startTimer() {
    timeLeft = 15;
    timerDisplay.textContent = `⏱ Time left: ${timeLeft}s`;
    timer = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `⏱ Time left: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        feedback.textContent = "⏰ Time's up!";
        nextBtn.disabled = false;
      }
    }, 1000);
  }

  function checkAnswer() {
    clearInterval(timer);
    const current = questions[currentIndex];
    let correct = false;

    if (current.type === 'single') {
      const selected = document.querySelector('input[name="option"]:checked');
      if (selected && selected.value === current.answer) {
        correct = true;
      }
    } else if (current.type === 'multi') {
      const selected = Array.from(document.querySelectorAll('input[name="option"]:checked')).map(el => el.value);
      const correctAnswer = current.answer;
      if (selected.length === correctAnswer.length && selected.every(v => correctAnswer.includes(v))) {
        correct = true;
      }
    } else if (current.type === 'text') {
      const userInput = textInputEl.value.trim().toLowerCase();
      if (userInput === current.answer.toLowerCase()) {
        correct = true;
      }
    }

    if (correct) {
      score++;
      feedback.textContent = "✅ Correct!";
    } else {
      feedback.textContent = `❌ Wrong. Correct answer: ${Array.isArray(current.answer) ? current.answer.join(', ') : current.answer}`;
    }

    nextBtn.disabled = false;
  }

  function resetState() {
    clearInterval(timer);
    optionsEl.innerHTML = "";
    textInputEl.value = "";
    textInputEl.style.display = "none";
    feedback.textContent = "";
    nextBtn.disabled = true;
    timerDisplay.textContent = "";
  }

  nextBtn.addEventListener("click", () => {
    checkAnswer();
    currentIndex++;
    if (currentIndex < questions.length) {
      setTimeout(loadQuestion, 1000);
    } else {
      showResult();
    }
  });

  optionsEl.addEventListener("change", () => {
    nextBtn.disabled = false;
  });

  textInputEl.addEventListener("input", () => {
    nextBtn.disabled = false;
  });

  function showResult() {
    document.getElementById("quiz-box").classList.add("hidden");
    resultEl.classList.remove("hidden");

    const bestScore = parseInt(localStorage.getItem('bestScore') || 0);
    if (score > bestScore) {
      localStorage.setItem('bestScore', score);
    }

    let message = `🎉 Your score: ${score} / ${questions.length}`;
    message += `<br>🏆 Best score: ${Math.max(score, bestScore)} / ${questions.length}`;

    if (score === questions.length) {
      message += "<br>💯 Perfect score! Great job!";
    } else if (score > questions.length / 2) {
      message += "<br>👏 Good effort!";
    } else {
      message += "<br>🙁 Better luck next time!";
    }

    resultEl.innerHTML = message;
  }

  loadQuestion();
});
