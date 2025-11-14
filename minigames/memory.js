// Memory Match Game
class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.pairs = 0;
        this.isProcessing = false;
        this.emojis = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻'];
    }

    init() {
        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.pairs = 0;
        this.isProcessing = false;
        this.createBoard();
        this.updateStats();
        this.setupEventListeners();
    }

    createBoard() {
        const board = document.getElementById('memory-board');
        if (!board) return;

        board.innerHTML = '';

        // Create pairs of cards
        const cardPairs = [...this.emojis, ...this.emojis];
        const shuffled = utils.shuffle(cardPairs);

        shuffled.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = index;
            card.dataset.emoji = emoji;
            card.innerHTML = `
                <div class="card-back">🎴</div>
                <div class="card-front">${emoji}</div>
            `;
            board.appendChild(card);
            this.cards.push(card);
        });
    }

    setupEventListeners() {
        const board = document.getElementById('memory-board');
        if (!board) return;

        board.addEventListener('click', (e) => {
            const card = e.target.closest('.memory-card');
            if (card) this.flipCard(card);
        });

        const restartBtn = document.getElementById('memory-restart');
        if (restartBtn) {
            restartBtn.onclick = () => this.init();
        }
    }

    async flipCard(card) {
        // Failsafe: prevent flipping if processing or card already flipped
        if (this.isProcessing || 
            card.classList.contains('flipped') || 
            card.classList.contains('matched')) {
            return;
        }

        card.classList.add('flipped');
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateStats();
            this.isProcessing = true;

            const [card1, card2] = this.flippedCards;
            const match = card1.dataset.emoji === card2.dataset.emoji;

            await utils.sleep(800);

            if (match) {
                card1.classList.add('matched');
                card2.classList.add('matched');
                this.pairs++;
                this.updateStats();

                // Add score
                if (window.game) {
                    window.game.addScore(100);
                }

                // Check win condition
                if (this.pairs === this.emojis.length) {
                    await utils.sleep(500);
                    this.gameWon();
                }
            } else {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }

            this.flippedCards = [];
            this.isProcessing = false;
        }
    }

    updateStats() {
        const movesEl = document.getElementById('memory-moves');
        const pairsEl = document.getElementById('memory-pairs');

        if (movesEl) movesEl.textContent = this.moves;
        if (pairsEl) pairsEl.textContent = `${this.pairs}/${this.emojis.length}`;
    }

    gameWon() {
        const bonus = Math.max(0, 500 - (this.moves * 10));
        if (window.game) {
            window.game.addScore(bonus);
        }

        alert(`🎉 Congratulations! You won!\nMoves: ${this.moves}\nBonus: ${bonus} points`);
    }
}

// Initialize the game
window.memoryGame = new MemoryGame();
