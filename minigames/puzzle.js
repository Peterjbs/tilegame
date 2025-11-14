// Tile Puzzle Game (15-puzzle variant)
class PuzzleGame {
    constructor() {
        this.size = 4;
        this.tiles = [];
        this.emptyPos = { row: 3, col: 3 };
        this.moves = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.solution = [];
    }

    init() {
        this.moves = 0;
        this.timer = 0;
        this.stopTimer();
        this.createPuzzle();
        this.updateStats();
        this.setupEventListeners();
        this.startTimer();
    }

    createPuzzle() {
        const board = document.getElementById('puzzle-board');
        if (!board) return;

        board.innerHTML = '';
        this.tiles = [];

        // Create tiles array (1-15 and empty)
        const numbers = [];
        for (let i = 1; i < this.size * this.size; i++) {
            numbers.push(i);
        }
        numbers.push(0); // 0 represents empty tile

        // Generate solvable puzzle
        do {
            numbers.splice(-1); // Remove last element
            const shuffled = utils.shuffle(numbers);
            shuffled.push(0); // Add empty at the end
            numbers.length = 0;
            numbers.push(...shuffled);
        } while (!this.isSolvable(numbers));

        // Store solution
        this.solution = Array.from({ length: this.size * this.size }, (_, i) => i + 1);
        this.solution[this.solution.length - 1] = 0;

        // Create tile elements
        let index = 0;
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const value = numbers[index];
                const tile = document.createElement('div');
                tile.className = value === 0 ? 'puzzle-tile empty' : 'puzzle-tile';
                tile.textContent = value || '';
                tile.dataset.value = value;
                tile.dataset.row = row;
                tile.dataset.col = col;
                
                board.appendChild(tile);
                this.tiles.push(tile);

                if (value === 0) {
                    this.emptyPos = { row, col };
                }

                index++;
            }
        }
    }

    // Check if puzzle is solvable
    isSolvable(arr) {
        let inversions = 0;
        const filtered = arr.filter(x => x !== 0);
        
        for (let i = 0; i < filtered.length; i++) {
            for (let j = i + 1; j < filtered.length; j++) {
                if (filtered[i] > filtered[j]) {
                    inversions++;
                }
            }
        }

        // For 4x4 puzzle, it's solvable if inversions + empty row (from bottom) is even
        const emptyRow = Math.floor(arr.indexOf(0) / this.size);
        return (inversions + (this.size - emptyRow)) % 2 === 0;
    }

    setupEventListeners() {
        const board = document.getElementById('puzzle-board');
        if (!board) return;

        board.addEventListener('click', (e) => {
            const tile = e.target.closest('.puzzle-tile');
            if (tile && !tile.classList.contains('empty')) {
                this.moveTile(tile);
            }
        });

        const restartBtn = document.getElementById('puzzle-restart');
        if (restartBtn) {
            restartBtn.onclick = () => this.init();
        }

        const hintBtn = document.getElementById('puzzle-hint');
        if (hintBtn) {
            hintBtn.onclick = () => this.showHint();
        }
    }

    moveTile(tile) {
        const row = parseInt(tile.dataset.row);
        const col = parseInt(tile.dataset.col);

        // Check if tile is adjacent to empty space
        const rowDiff = Math.abs(row - this.emptyPos.row);
        const colDiff = Math.abs(col - this.emptyPos.col);

        if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
            // Swap tile with empty space
            const emptyTile = this.tiles.find(t => 
                parseInt(t.dataset.row) === this.emptyPos.row && 
                parseInt(t.dataset.col) === this.emptyPos.col
            );

            // Swap positions
            [tile.dataset.row, emptyTile.dataset.row] = [emptyTile.dataset.row, tile.dataset.row];
            [tile.dataset.col, emptyTile.dataset.col] = [emptyTile.dataset.col, tile.dataset.col];
            
            this.emptyPos = { row, col };
            this.moves++;
            this.updateStats();

            // Check win condition
            if (this.checkWin()) {
                this.gameWon();
            }
        }
    }

    checkWin() {
        for (let i = 0; i < this.tiles.length; i++) {
            const tile = this.tiles[i];
            const row = parseInt(tile.dataset.row);
            const col = parseInt(tile.dataset.col);
            const expectedValue = this.solution[row * this.size + col];
            const actualValue = parseInt(tile.dataset.value);

            if (expectedValue !== actualValue) {
                return false;
            }
        }
        return true;
    }

    showHint() {
        // Highlight a movable tile that's out of place
        const movable = [];
        
        for (const tile of this.tiles) {
            if (tile.classList.contains('empty')) continue;
            
            const row = parseInt(tile.dataset.row);
            const col = parseInt(tile.dataset.col);
            const value = parseInt(tile.dataset.value);
            
            // Check if adjacent to empty
            const rowDiff = Math.abs(row - this.emptyPos.row);
            const colDiff = Math.abs(col - this.emptyPos.col);
            
            if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
                // Check if out of place
                const correctIndex = value - 1;
                const correctRow = Math.floor(correctIndex / this.size);
                const correctCol = correctIndex % this.size;
                
                if (row !== correctRow || col !== correctCol) {
                    movable.push(tile);
                }
            }
        }

        if (movable.length > 0) {
            const hintTile = movable[0];
            hintTile.style.animation = 'success 0.5s ease 3';
            setTimeout(() => {
                hintTile.style.animation = '';
            }, 1500);
        } else {
            alert('All adjacent tiles are in the correct position! Try moving other tiles.');
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateStats();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateStats() {
        const movesEl = document.getElementById('puzzle-moves');
        const timeEl = document.getElementById('puzzle-time');

        if (movesEl) movesEl.textContent = this.moves;
        if (timeEl) timeEl.textContent = utils.formatTime(this.timer);
    }

    gameWon() {
        this.stopTimer();
        
        const timeBonus = Math.max(0, 300 - this.timer);
        const moveBonus = Math.max(0, 200 - this.moves * 2);
        const totalBonus = timeBonus + moveBonus + 500;

        if (window.game) {
            window.game.addScore(totalBonus);
        }

        setTimeout(() => {
            alert(`🎉 Puzzle Solved!\nMoves: ${this.moves}\nTime: ${utils.formatTime(this.timer)}\nBonus: ${totalBonus} points`);
        }, 300);
    }
}

// Initialize the game
window.puzzleGame = new PuzzleGame();
