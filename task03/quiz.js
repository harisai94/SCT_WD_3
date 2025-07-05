const questions = [
  {
    question: "What is the largest planet in our solar system?",
    answers: ["Earth", "Jupiter", "Saturn", "Mars"],
    correct: 1
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: ["Venus", "Mars", "Mercury", "Neptune"],
    correct: 1
  },
  {
    question: "What is the name of our galaxy?",
    answers: ["Andromeda", "Milky Way", "Whirlpool", "Sombrero"],
    correct: 1
  },
  {
    question: "Who was the first person to walk on the Moon?",
    answers: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "Michael Collins"],
    correct: 2
  },
  {
    question: "What is the hottest planet in our solar system?",
    answers: ["Mercury", "Venus", "Mars", "Jupiter"],
    correct: 1
  },
  {
    question: "Which planet has the most moons?",
    answers: ["Saturn", "Jupiter", "Uranus", "Neptune"],
    correct: 0
  },
  {
    question: "What is the closest star to Earth?",
    answers: ["Alpha Centauri", "Betelgeuse", "The Sun", "Sirius"],
    correct: 2
  },
  {
    question: "What is the name of the first artificial satellite?",
    answers: ["Apollo 11", "Sputnik 1", "Voyager 1", "Hubble"],
    correct: 1
  },
  {
    question: "Which planet is famous for its rings?",
    answers: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    correct: 1
  },
  {
    question: "What do we call a system of millions or billions of stars, together with gas and dust, held together by gravity?",
    answers: ["Galaxy", "Nebula", "Asteroid Belt", "Comet"],
    correct: 0
  }
];

let currentQuestion = 0;
let score = 0;
let quizStarted = false;


const quizDiv = document.getElementById('quiz');
const scoreDiv = document.getElementById('score');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const currentScoreElement = document.getElementById('currentScore');


function initQuiz() {
  updateProgress();
  updateScore();
  showQuestion();
  quizStarted = true;
}

function updateProgress() {
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  progressFill.style.width = `${progress}%`;
  progressText.textContent = `${currentQuestion + 1} / ${questions.length}`;
}

function updateScore() {
  currentScoreElement.textContent = score;
  currentScoreElement.style.animation = 'none';
  setTimeout(() => {
    currentScoreElement.style.animation = 'correctPulse 0.6s ease-out';
  }, 10);
}

function showQuestion() {
  const q = questions[currentQuestion];

  quizDiv.style.opacity = '0';
  quizDiv.style.transform = 'translateY(20px)';
  
  quizDiv.innerHTML = `
    <div class="question">${q.question}</div>
    <div class="answers">
      ${q.answers.map((ans, i) => `
        <button class="answer-btn" onclick="selectAnswer(${i})" data-index="${i}">
          <span class="answer-text">${ans}</span>
        </button>
      `).join('')}
    </div>
  `;

  setTimeout(() => {
    quizDiv.style.transition = 'all 0.5s ease-out';
    quizDiv.style.opacity = '1';
    quizDiv.style.transform = 'translateY(0)';
  }, 100);
  
  updateProgress();
}

window.selectAnswer = function(index) {
  const q = questions[currentQuestion];
  const buttons = document.querySelectorAll('.answer-btn');

  buttons.forEach(btn => {
    btn.disabled = true;
    btn.style.pointerEvents = 'none';
  });
  
  const selectedButton = buttons[index];
  const correctButton = buttons[q.correct];
  
  
  if (index === q.correct) {
    score++;
    selectedButton.classList.add('correct');
    playCorrectSound();
  } else {
    selectedButton.classList.add('incorrect');
    correctButton.classList.add('correct-answer');
    playIncorrectSound();
  }
  
  updateScore();
  
 
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      setTimeout(() => {
        showFinalScore();
      }, 500);
    }
  }, 1500);
};

function playCorrectSound() {
  // Create a pleasant success sound
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

function playIncorrectSound() {

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
  
  gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

function showFinalScore() {
  quizDiv.classList.add('hidden');
  scoreDiv.classList.remove('hidden');
  
  const percentage = (score / questions.length) * 100;
  let message = '';
  let emoji = '';
  
  if (percentage === 100) {
    message = 'Perfect! You are a space genius!';
    emoji = '🚀';
  } else if (percentage >= 80) {
    message = 'Excellent! You have impressive space knowledge!';
    emoji = '⭐';
  } else if (percentage >= 60) {
    message = 'Great job! You know a lot about space!';
    emoji = '🌌';
  } else if (percentage >= 40) {
    message = 'Good effort! Keep exploring the cosmos!';
    emoji = '🪐';
  } else {
    message = 'Keep learning about the universe!';
    emoji = '🌑';
  }
  
  scoreDiv.innerHTML = `
    <div class="score-result">${emoji} ${score} / ${questions.length}</div>
    <div class="score-message">${message}</div>
    <button class="restart-btn" onclick="restartQuiz()">
      <i class="fas fa-redo"></i> Try Again
    </button>
  `;
  
 
  const scoreResult = scoreDiv.querySelector('.score-result');
  scoreResult.style.animation = 'fadeInUp 0.8s ease-out';
}

window.restartQuiz = function() {
  currentQuestion = 0;
  score = 0;
  quizStarted = false;
  

  quizDiv.classList.remove('hidden');
  scoreDiv.classList.add('hidden');
  quizDiv.style.opacity = '1';
  quizDiv.style.transform = 'translateY(0)';
  
 
  updateProgress();
  updateScore();
  
  showQuestion();
};


document.addEventListener('keydown', function(e) {
  if (!quizStarted) return;
  
  const buttons = document.querySelectorAll('.answer-btn:not([disabled])');
  if (buttons.length === 0) return;
  
  switch(e.key) {
    case '1':
    case 'a':
    case 'A':
      if (buttons[0]) buttons[0].click();
      break;
    case '2':
    case 'b':
    case 'B':
      if (buttons[1]) buttons[1].click();
      break;
    case '3':
    case 'c':
    case 'C':
      if (buttons[2]) buttons[2].click();
      break;
    case '4':
    case 'd':
    case 'D':
      if (buttons[3]) buttons[3].click();
      break;
  }
});

document.addEventListener('DOMContentLoaded', function() {
  
  initQuiz();
  
 
  document.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('answer-btn')) {
      e.target.style.transform = 'translateY(-2px)';
    }
  });
  
  document.addEventListener('mouseout', function(e) {
    if (e.target.classList.contains('answer-btn')) {
      e.target.style.transform = 'translateY(0)';
    }
  });
}); 