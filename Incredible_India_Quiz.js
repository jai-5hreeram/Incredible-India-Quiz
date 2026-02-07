const indiaDatabase = [
    {
        question: "Which Indian scientist won the Nobel Prize for the discovery of the 'scattering of light'?",
        answers: ["Homi J. Bhabha", "C.V. Raman", "S. Ramanujan", "Jagadish Chandra Bose"],
        correct: "C.V. Raman"
    },
    {
        question: "Which is the oldest mountain range in India?",
        answers: ["Himalayas", "Western Ghats", "Aravalli Range", "Satpura Range"],
        correct: "Aravalli Range"
    },
    {
        question: "Who was the first Indian woman to fly into space?",
        answers: ["Sunita Williams", "Kalpana Chawla", "Pratibha Patil", "Santhosh Yadav"],
        correct: "Kalpana Chawla"
    },
    {
        question: "Which Indian city is known as the 'Blue City'?",
        answers: ["Jaipur", "Udaipur", "Jodhpur", "Bikaner"],
        correct: "Jodhpur"
    },
    {
        question: "In the context of Indian IT, what does the 'B' stand for in Bengaluru-based company 'Wipro'?",
        answers: ["Bharat", "Business", "Bombay", "Bangalore"],
        correct: "Western India Palm Refined Oil" // Interesting trivia: Wipro started with oil!
    }
];


let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 5;

async function startQuiz() {
    document.getElementById('setup-screen').innerHTML = "<h1>Loading India Special Quiz...</h1>";
    
    // Simulating a web fetch delay for that "Premium" feel
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
        // In a real production app, you would use: 
        // const response = await fetch('https://your-api-link.com/india-quiz.json');
        // quizData = await response.json();

        // For now, we shuffle and pick 5 from our India Database
        quizData = indiaDatabase.sort(() => Math.random() - 0.5).slice(0, 5);

        document.getElementById('setup-screen').classList.add('hidden');
        document.getElementById('quiz-screen').classList.remove('hidden');
        showQuestion();
    } catch (error) {
        console.error("Error loading quiz:", error);
    }
}

// Helper to fix weird symbols (like &quot;) from the web
function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function showQuestion() {
    clearInterval(timer);
    timeLeft = 5;
    document.getElementById('timer-seconds').innerText = timeLeft;
    document.body.style.backgroundColor = "#28a745"; 

    startTimer();

    const q = quizData[currentQuestionIndex];
    document.getElementById('question-text').innerText = q.question;
    const btnContainer = document.getElementById('answer-buttons');
    btnContainer.innerHTML = '';

    const progress = (currentQuestionIndex / quizData.length) * 100;
    document.getElementById('progress-bar').style.width = progress + "%";

    q.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.onclick = () => selectAnswer(answer);
        btnContainer.appendChild(button);
    });
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-seconds').innerText = timeLeft;
        if (timeLeft === 3) document.body.style.backgroundColor = "#ffc107";
        if (timeLeft === 1) document.body.style.backgroundColor = "#dc3545";
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            selectAnswer(null); 
        }
    }, 1000);
}

function selectAnswer(selected) {
    clearInterval(timer);
    if (selected === quizData[currentQuestionIndex].correct) {
        score++;
        document.getElementById('current-score').innerText = score;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        setTimeout(showQuestion, 300);
    } else {
        showResults();
    }
}

function showResults() {
    clearInterval(timer);
    document.body.style.backgroundColor = "#6f42c1";
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    
    const finalStat = document.getElementById('final-stat');
    finalStat.innerHTML = `<h2>Final Score: ${score}/${quizData.length}</h2>`;

    const review = document.getElementById('answers-review');
    review.innerHTML = "<h3>Review Your Answers:</h3>";

    quizData.forEach((item, index) => {
        // Add a clean card for each answer
        const resultCard = document.createElement('div');
        resultCard.style.textAlign = "left";
        resultCard.style.padding = "10px";
        resultCard.style.borderBottom = "1px solid #ddd";
        
        resultCard.innerHTML = `
            <p><strong>${index + 1}. ${item.question}</strong></p>
            <p style="color: #28a745; font-weight: bold;">Correct Answer: ${item.correct}</p>
        `;
        review.appendChild(resultCard);
    });
}
