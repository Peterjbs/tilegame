// Quick Reaction Game
class ReactionGame {
    constructor() {
        this.state = 'idle'; // idle, waiting, ready, testing
        this.startTime = 0;
        this.reactionTimes = [];
        this.currentRound = 0;
        this.maxRounds = 5;
        this.waitTimeout = null;
    }

    init() {
        this.state = 'idle';
        this.reactionTimes = [];
        this.currentRound = 0;
        this.clearWaitTimeout();
        this.updateDisplay();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const startBtn = document.getElementById('reaction-start');
        const restartBtn = document.getElementById('reaction-restart');
        const area = document.getElementById('reaction-area');

        if (startBtn) {
            startBtn.onclick = () => this.startTest();
        }

        if (restartBtn) {
            restartBtn.onclick = () => this.init();
        }

        if (area) {
            area.onclick = (e) => this.handleClick(e);
        }
    }

    async startTest() {
        const startBtn = document.getElementById('reaction-start');
        if (startBtn) startBtn.style.display = 'none';

        this.state = 'waiting';
        this.updateDisplay('Wait for green...');
        
        const area = document.getElementById('reaction-area');
        if (area) area.classList.add('waiting');

        // Random delay between 2-5 seconds
        const delay = utils.randomInt(2000, 5000);
        
        this.waitTimeout = setTimeout(() => {
            this.showTarget();
        }, delay);
    }

    showTarget() {
        this.clearWaitTimeout();
        
        const area = document.getElementById('reaction-area');
        if (!area) return;

        // Failsafe: check if still in waiting state
        if (this.state !== 'waiting') return;

        this.state = 'ready';
        area.classList.remove('waiting');
        area.classList.add('ready');
        
        this.startTime = Date.now();
        this.updateDisplay('CLICK NOW!');
    }

    handleClick(e) {
        const area = document.getElementById('reaction-area');
        if (!area) return;

        if (this.state === 'waiting') {
            // Too soon!
            this.clearWaitTimeout();
            this.state = 'idle';
            area.classList.remove('waiting');
            area.classList.add('too-soon');
            
            this.updateDisplay('Too soon! Wait for green.');
            
            setTimeout(() => {
                area.classList.remove('too-soon');
                this.resetRound();
            }, 2000);
            
        } else if (this.state === 'ready') {
            // Correct reaction!
            const reactionTime = Date.now() - this.startTime;
            this.reactionTimes.push(reactionTime);
            this.currentRound++;

            area.classList.remove('ready');
            
            // Add points based on reaction speed
            const points = Math.max(10, 200 - Math.floor(reactionTime / 5));
            if (window.game) {
                window.game.addScore(points);
            }

            this.updateDisplay(`${reactionTime}ms (+${points} pts)`);
            
            setTimeout(() => {
                if (this.currentRound < this.maxRounds) {
                    this.startTest();
                } else {
                    this.showResults();
                }
            }, 1500);
        }
    }

    updateDisplay(message) {
        const messageEl = document.getElementById('reaction-message');
        
        if (message && messageEl) {
            messageEl.textContent = message;
        }

        // Update stats
        if (this.reactionTimes.length > 0) {
            const bestTime = Math.min(...this.reactionTimes);
            const avgTime = Math.round(
                this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length
            );

            const bestEl = document.getElementById('reaction-best');
            const avgEl = document.getElementById('reaction-avg');

            if (bestEl) bestEl.textContent = `${bestTime}ms`;
            if (avgEl) avgEl.textContent = `${avgTime}ms`;
        }
    }

    resetRound() {
        const area = document.getElementById('reaction-area');
        const startBtn = document.getElementById('reaction-start');
        
        if (area) {
            area.className = 'reaction-area';
        }
        
        if (startBtn) {
            startBtn.style.display = 'inline-block';
        }

        this.updateDisplay('Click "Start Test" to try again!');
    }

    showResults() {
        const area = document.getElementById('reaction-area');
        const restartBtn = document.getElementById('reaction-restart');
        
        if (area) area.className = 'reaction-area';
        
        const bestTime = Math.min(...this.reactionTimes);
        const avgTime = Math.round(
            this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length
        );

        let rating = '';
        if (avgTime < 250) rating = '🏆 Lightning Fast!';
        else if (avgTime < 300) rating = '⚡ Excellent!';
        else if (avgTime < 350) rating = '👍 Good!';
        else if (avgTime < 400) rating = '👌 Not bad!';
        else rating = '🐌 Keep practicing!';

        this.updateDisplay(
            `Test Complete!\n${rating}\nBest: ${bestTime}ms | Average: ${avgTime}ms`
        );

        if (restartBtn) {
            restartBtn.style.display = 'inline-block';
        }

        // Bonus points for good performance
        const bonus = Math.max(0, 500 - avgTime);
        if (window.game) {
            window.game.addScore(bonus);
        }
    }

    clearWaitTimeout() {
        if (this.waitTimeout) {
            clearTimeout(this.waitTimeout);
            this.waitTimeout = null;
        }
    }
}

// Initialize the game
window.reactionGame = new ReactionGame();
