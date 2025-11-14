// Main Game Controller
class TileGame {
    constructor() {
        this.totalScore = 0;
        this.bestScore = 0;
        this.currentScreen = 'main-menu';
        this.init();
    }

    init() {
        this.loadScores();
        this.setupEventListeners();
        this.updateScoreDisplay();
    }

    loadScores() {
        try {
            const saved = localStorage.getItem('tileGameScores');
            if (saved) {
                const scores = JSON.parse(saved);
                this.totalScore = scores.total || 0;
                this.bestScore = scores.best || 0;
            }
        } catch (error) {
            console.error('Error loading scores:', error);
            // Failsafe: start with zero scores if localStorage fails
            this.totalScore = 0;
            this.bestScore = 0;
        }
    }

    saveScores() {
        try {
            localStorage.setItem('tileGameScores', JSON.stringify({
                total: this.totalScore,
                best: this.bestScore
            }));
        } catch (error) {
            console.error('Error saving scores:', error);
            // Failsafe: continue without saving if localStorage is unavailable
        }
    }

    updateScoreDisplay() {
        const totalScoreEl = document.getElementById('total-score');
        const bestScoreEl = document.getElementById('best-score');
        
        if (totalScoreEl) totalScoreEl.textContent = this.totalScore;
        if (bestScoreEl) bestScoreEl.textContent = this.bestScore;
    }

    addScore(points) {
        this.totalScore += points;
        if (this.totalScore > this.bestScore) {
            this.bestScore = this.totalScore;
        }
        this.updateScoreDisplay();
        this.saveScores();
    }

    setupEventListeners() {
        // Game tile click handlers
        document.querySelectorAll('.game-tile').forEach(tile => {
            const playBtn = tile.querySelector('.play-btn');
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const gameType = tile.dataset.game;
                    this.startGame(gameType);
                });
            }
        });

        // Back button handlers
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showScreen('main-menu');
            });
        });
    }

    startGame(gameType) {
        const gameMap = {
            'memory': 'memory-game',
            'puzzle': 'puzzle-game',
            'trivia': 'trivia-game',
            'reaction': 'reaction-game'
        };

        const screenId = gameMap[gameType];
        if (screenId) {
            this.showScreen(screenId);
            
            // Initialize the specific game
            switch(gameType) {
                case 'memory':
                    if (window.memoryGame) window.memoryGame.init();
                    break;
                case 'puzzle':
                    if (window.puzzleGame) window.puzzleGame.init();
                    break;
                case 'trivia':
                    if (window.triviaGame) window.triviaGame.init();
                    break;
                case 'reaction':
                    if (window.reactionGame) window.reactionGame.init();
                    break;
            }
        }
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show the requested screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
        }
    }
}

// Utility functions
const utils = {
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new TileGame();
});
