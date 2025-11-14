// Trivia Challenge Game with API integration and fallbacks
class TriviaGame {
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.totalQuestions = 10;
        this.apiAttempts = 0;
        this.maxApiAttempts = 3;
        
        // Backup trivia questions in case all APIs fail
        this.fallbackQuestions = [
            {
                question: "What is the largest planet in our solar system?",
                correct_answer: "Jupiter",
                incorrect_answers: ["Saturn", "Neptune", "Earth"]
            },
            {
                question: "What is the capital of France?",
                correct_answer: "Paris",
                incorrect_answers: ["London", "Berlin", "Madrid"]
            },
            {
                question: "How many continents are there?",
                correct_answer: "7",
                incorrect_answers: ["5", "6", "8"]
            },
            {
                question: "What is the smallest prime number?",
                correct_answer: "2",
                incorrect_answers: ["1", "3", "0"]
            },
            {
                question: "What year did World War II end?",
                correct_answer: "1945",
                incorrect_answers: ["1944", "1946", "1943"]
            },
            {
                question: "What is the chemical symbol for gold?",
                correct_answer: "Au",
                incorrect_answers: ["Go", "Gd", "Ag"]
            },
            {
                question: "How many sides does a hexagon have?",
                correct_answer: "6",
                incorrect_answers: ["5", "7", "8"]
            },
            {
                question: "What is the boiling point of water in Celsius?",
                correct_answer: "100",
                incorrect_answers: ["90", "110", "212"]
            },
            {
                question: "Who painted the Mona Lisa?",
                correct_answer: "Leonardo da Vinci",
                incorrect_answers: ["Pablo Picasso", "Vincent van Gogh", "Michelangelo"]
            },
            {
                question: "What is the speed of light in km/s (rounded)?",
                correct_answer: "300,000",
                incorrect_answers: ["150,000", "450,000", "600,000"]
            }
        ];
    }

    async init() {
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.questions = [];
        this.apiAttempts = 0;

        this.showLoading();
        await this.loadQuestions();
        this.updateStats();
        this.setupEventListeners();
    }

    showLoading() {
        const loading = document.getElementById('trivia-loading');
        const content = document.getElementById('trivia-content');
        const error = document.getElementById('trivia-error');
        const result = document.getElementById('trivia-result');

        if (loading) loading.style.display = 'block';
        if (content) content.style.display = 'none';
        if (error) error.style.display = 'none';
        if (result) result.style.display = 'none';
    }

    showError(message) {
        const loading = document.getElementById('trivia-loading');
        const error = document.getElementById('trivia-error');

        if (loading) loading.style.display = 'none';
        if (error) {
            error.textContent = message;
            error.style.display = 'block';
        }
    }

    async loadQuestions() {
        try {
            // Try primary API: Open Trivia Database
            await this.fetchFromOpenTriviaDB();
        } catch (error) {
            console.error('Primary API failed:', error);
            
            try {
                // Try secondary API: The Trivia API
                await this.fetchFromTriviaAPI();
            } catch (error2) {
                console.error('Secondary API failed:', error2);
                
                // Fallback to offline questions
                console.warn('All APIs failed, using fallback questions');
                this.useFallbackQuestions();
            }
        }

        if (this.questions.length > 0) {
            this.displayQuestion();
        } else {
            this.showError('Failed to load questions. Please try again.');
        }
    }

    async fetchFromOpenTriviaDB() {
        this.apiAttempts++;
        
        const response = await this.fetchWithTimeout(
            'https://opentdb.com/api.php?amount=10&type=multiple',
            5000 // 5 second timeout
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.response_code !== 0) {
            throw new Error('API returned error code');
        }

        this.questions = data.results.map(q => ({
            question: this.decodeHTML(q.question),
            correct_answer: this.decodeHTML(q.correct_answer),
            incorrect_answers: q.incorrect_answers.map(a => this.decodeHTML(a))
        }));
    }

    async fetchFromTriviaAPI() {
        this.apiAttempts++;
        
        const response = await this.fetchWithTimeout(
            'https://the-trivia-api.com/api/questions?limit=10',
            5000 // 5 second timeout
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        this.questions = data.map(q => ({
            question: q.question,
            correct_answer: q.correctAnswer,
            incorrect_answers: q.incorrectAnswers
        }));
    }

    async fetchWithTimeout(url, timeout) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json'
                }
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    useFallbackQuestions() {
        // Use shuffled fallback questions
        this.questions = utils.shuffle(this.fallbackQuestions).slice(0, this.totalQuestions);
    }

    decodeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    setupEventListeners() {
        const restartBtn = document.getElementById('trivia-restart');
        if (restartBtn) {
            restartBtn.onclick = () => this.init();
        }
    }

    displayQuestion() {
        const loading = document.getElementById('trivia-loading');
        const content = document.getElementById('trivia-content');
        const questionEl = document.getElementById('trivia-question');
        const answersEl = document.getElementById('trivia-answers');

        if (loading) loading.style.display = 'none';
        if (content) content.style.display = 'block';

        if (this.currentQuestion >= this.questions.length) {
            this.showResults();
            return;
        }

        const q = this.questions[this.currentQuestion];
        
        // Display question
        if (questionEl) {
            questionEl.textContent = q.question;
        }

        // Shuffle and display answers
        const allAnswers = [...q.incorrect_answers, q.correct_answer];
        const shuffledAnswers = utils.shuffle(allAnswers);

        if (answersEl) {
            answersEl.innerHTML = '';
            
            shuffledAnswers.forEach(answer => {
                const answerDiv = document.createElement('div');
                answerDiv.className = 'trivia-answer';
                answerDiv.textContent = answer;
                answerDiv.onclick = () => this.selectAnswer(answer, q.correct_answer);
                answersEl.appendChild(answerDiv);
            });
        }

        this.updateStats();
    }

    async selectAnswer(selected, correct) {
        const answersEl = document.getElementById('trivia-answers');
        if (!answersEl) return;

        const answerDivs = answersEl.querySelectorAll('.trivia-answer');
        
        // Disable all answers
        answerDivs.forEach(div => {
            div.classList.add('disabled');
            
            if (div.textContent === correct) {
                div.classList.add('correct');
            } else if (div.textContent === selected && selected !== correct) {
                div.classList.add('incorrect');
            }
        });

        // Update score
        if (selected === correct) {
            this.correctAnswers++;
            
            if (window.game) {
                window.game.addScore(50);
            }
        }

        // Wait before next question
        await utils.sleep(1500);
        
        this.currentQuestion++;
        this.displayQuestion();
    }

    updateStats() {
        const questionNumEl = document.getElementById('trivia-question-num');
        const correctEl = document.getElementById('trivia-correct');

        if (questionNumEl) {
            questionNumEl.textContent = `${this.currentQuestion + 1}/${this.questions.length}`;
        }
        if (correctEl) {
            correctEl.textContent = this.correctAnswers;
        }
    }

    showResults() {
        const content = document.getElementById('trivia-content');
        const result = document.getElementById('trivia-result');

        if (content) content.style.display = 'none';
        if (result) {
            const percentage = Math.round((this.correctAnswers / this.questions.length) * 100);
            const bonus = this.correctAnswers * 100;

            if (window.game) {
                window.game.addScore(bonus);
            }

            let grade = '';
            if (percentage >= 90) grade = '🏆 Outstanding!';
            else if (percentage >= 70) grade = '🌟 Great Job!';
            else if (percentage >= 50) grade = '👍 Good Effort!';
            else grade = '📚 Keep Learning!';

            result.innerHTML = `
                <h3>${grade}</h3>
                <p>You got ${this.correctAnswers} out of ${this.questions.length} questions correct!</p>
                <p>Accuracy: ${percentage}%</p>
                <p>Bonus Points: ${bonus}</p>
            `;
            result.style.display = 'block';
        }
    }
}

// Initialize the game
window.triviaGame = new TriviaGame();
