// Game State
const gameState = {
    isPlaying: false,
    currentTime: 0,
    duration: 60, // Default duration
    timeBehind: 0,
    maxTimeBehind: 10, // Lose if more than 10 seconds behind
    score: 0,
    placedClips: [],
    isGameOver: false,
    filterDuration: 'all' // New filter state
};

// Clip data - 50 clips with different durations
const clipLibrary = [];
const clipDurations = [1, 2, 3, 4, 5];
const clipThemes = ['🎸', '🎹', '🎤', '🎧', '🎵', '🎶', '🎼', '🎺', '🎻', '🥁', 
                     '🎨', '✨', '⭐', '🌟', '💫', '🔥', '💥', '⚡', '🌈', '🎭'];

// Initialize clip library
function initializeClipLibrary() {
    // Create 10 clips for each duration
    for (let duration of clipDurations) {
        for (let i = 0; i < 10; i++) {
            const theme = clipThemes[Math.floor(Math.random() * clipThemes.length)];
            clipLibrary.push({
                id: `clip-${duration}s-${i}`,
                duration: duration,
                theme: theme,
                used: false
            });
        }
    }
    
    // Sort by duration (ascending)
    clipLibrary.sort((a, b) => a.duration - b.duration);
}

// DOM Elements
let audioPlayer, startBtn, pauseBtn, resetBtn;
let progressFill, playhead, currentTimeDisplay, totalTimeDisplay;
let timeBehindDisplay, coverageDisplay, scoreDisplay;
let timeline, clipLibraryElement;
let gameOverModal, gameOverTitle, gameOverMessage, finalScoreDisplay, restartBtn;

// Initialize DOM elements
function initializeDOMElements() {
    audioPlayer = document.getElementById('audioPlayer');
    startBtn = document.getElementById('startBtn');
    pauseBtn = document.getElementById('pauseBtn');
    resetBtn = document.getElementById('resetBtn');
    
    progressFill = document.getElementById('progressFill');
    playhead = document.getElementById('playhead');
    currentTimeDisplay = document.getElementById('currentTime');
    totalTimeDisplay = document.getElementById('totalTime');
    
    timeBehindDisplay = document.getElementById('timeBehind');
    coverageDisplay = document.getElementById('coverage');
    scoreDisplay = document.getElementById('score');
    
    timeline = document.getElementById('timeline');
    clipLibraryElement = document.getElementById('clipLibrary');
    
    gameOverModal = document.getElementById('gameOverModal');
    gameOverTitle = document.getElementById('gameOverTitle');
    gameOverMessage = document.getElementById('gameOverMessage');
    finalScoreDisplay = document.getElementById('finalScore');
    restartBtn = document.getElementById('restartBtn');
}

// Event Listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', pauseGame);
    resetBtn.addEventListener('click', resetGame);
    restartBtn.addEventListener('click', resetGame);
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Set filter
            gameState.filterDuration = e.target.dataset.duration;
            renderClipLibrary();
        });
    });
    
    // Update duration when audio metadata is loaded
    audioPlayer.addEventListener('loadedmetadata', () => {
        gameState.duration = audioPlayer.duration || 60;
        totalTimeDisplay.textContent = formatTime(gameState.duration);
    });
    
    // Handle audio time updates
    audioPlayer.addEventListener('timeupdate', handleTimeUpdate);
    
    // Handle audio end
    audioPlayer.addEventListener('ended', handleAudioEnd);
}

// Start Game
function startGame() {
    if (gameState.isGameOver) {
        resetGame();
        return;
    }
    
    gameState.isPlaying = true;
    audioPlayer.play();
    
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    // Start game loop
    if (!gameState.gameLoopInterval) {
        gameState.gameLoopInterval = setInterval(updateGame, 100);
    }
}

// Pause Game
function pauseGame() {
    gameState.isPlaying = false;
    audioPlayer.pause();
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    
    if (gameState.gameLoopInterval) {
        clearInterval(gameState.gameLoopInterval);
        gameState.gameLoopInterval = null;
    }
}

// Reset Game
function resetGame() {
    // Reset state
    gameState.isPlaying = false;
    gameState.currentTime = 0;
    gameState.timeBehind = 0;
    gameState.score = 0;
    gameState.placedClips = [];
    gameState.isGameOver = false;
    
    // Reset audio
    audioPlayer.currentTime = 0;
    audioPlayer.pause();
    
    // Reset UI
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    
    // Clear timeline
    timeline.innerHTML = '';
    
    // Reset clip library
    clipLibrary.forEach(clip => clip.used = false);
    renderClipLibrary();
    
    // Hide modal
    gameOverModal.classList.add('hidden');
    
    // Update displays
    updateDisplays();
    
    // Clear interval
    if (gameState.gameLoopInterval) {
        clearInterval(gameState.gameLoopInterval);
        gameState.gameLoopInterval = null;
    }
}

// Handle Time Update
function handleTimeUpdate() {
    gameState.currentTime = audioPlayer.currentTime;
    updateDisplays();
}

// Update Game Loop
function updateGame() {
    if (!gameState.isPlaying || gameState.isGameOver) return;
    
    // Calculate time behind
    const coveredTime = calculateCoveredTime();
    gameState.timeBehind = Math.max(0, gameState.currentTime - coveredTime);
    
    // Check for game over
    if (gameState.timeBehind > gameState.maxTimeBehind) {
        endGame(false);
    }
    
    updateDisplays();
}

// Calculate how much of the timeline is covered by clips
function calculateCoveredTime() {
    if (gameState.placedClips.length === 0) return 0;
    
    // Sort clips by start time
    const sortedClips = [...gameState.placedClips].sort((a, b) => a.startTime - b.startTime);
    
    let covered = 0;
    let currentEnd = 0;
    
    for (const clip of sortedClips) {
        if (clip.startTime <= currentEnd) {
            // Overlapping or adjacent clip
            currentEnd = Math.max(currentEnd, clip.startTime + clip.duration);
        } else {
            // Gap in coverage
            break;
        }
    }
    
    return currentEnd;
}

// Handle Audio End
function handleAudioEnd() {
    endGame(true);
}

// End Game
function endGame(won) {
    gameState.isGameOver = true;
    gameState.isPlaying = false;
    
    if (gameState.gameLoopInterval) {
        clearInterval(gameState.gameLoopInterval);
        gameState.gameLoopInterval = null;
    }
    
    // Calculate final score
    const coveragePercentage = (calculateCoveredTime() / gameState.duration) * 100;
    gameState.score = Math.floor(coveragePercentage * 10);
    
    // Show modal
    if (won) {
        gameOverTitle.textContent = '🎉 You Win! 🎉';
        gameOverMessage.textContent = `Congratulations! You successfully created a music video with ${coveragePercentage.toFixed(1)}% coverage!`;
    } else {
        gameOverTitle.textContent = '💔 Game Over 💔';
        gameOverMessage.textContent = `You fell more than ${gameState.maxTimeBehind} seconds behind! Try to keep up with the music!`;
    }
    
    finalScoreDisplay.textContent = gameState.score;
    gameOverModal.classList.remove('hidden');
}

// Update Displays
function updateDisplays() {
    // Progress bar
    const progress = (gameState.currentTime / gameState.duration) * 100;
    progressFill.style.width = `${progress}%`;
    playhead.style.left = `${progress}%`;
    
    // Time display
    currentTimeDisplay.textContent = formatTime(gameState.currentTime);
    
    // Time behind
    timeBehindDisplay.textContent = `${gameState.timeBehind.toFixed(1)}s`;
    if (gameState.timeBehind > 7) {
        timeBehindDisplay.classList.add('danger');
    } else {
        timeBehindDisplay.classList.remove('danger');
    }
    
    // Coverage
    const coveragePercentage = (calculateCoveredTime() / gameState.duration) * 100;
    coverageDisplay.textContent = `${coveragePercentage.toFixed(1)}%`;
    
    // Score
    scoreDisplay.textContent = Math.floor(coveragePercentage * 10);
}

// Format time in MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Render Clip Library
function renderClipLibrary() {
    clipLibraryElement.innerHTML = '';
    
    // Filter clips based on selected duration
    const filteredClips = gameState.filterDuration === 'all' 
        ? clipLibrary 
        : clipLibrary.filter(clip => clip.duration === parseInt(gameState.filterDuration));
    
    filteredClips.forEach(clip => {
        const clipElement = document.createElement('div');
        clipElement.className = `clip-item ${clip.used ? 'used' : ''}`;
        clipElement.innerHTML = `
            <div class="clip-thumbnail">${clip.theme}</div>
            <div class="clip-length">${clip.duration}s</div>
        `;
        
        if (!clip.used) {
            clipElement.addEventListener('click', () => addClipToTimeline(clip));
        }
        
        clipLibraryElement.appendChild(clipElement);
    });
}

// Add Clip to Timeline
function addClipToTimeline(clip) {
    if (clip.used || gameState.isGameOver) return;
    
    // Calculate where to place the clip
    const coveredTime = calculateCoveredTime();
    const startTime = coveredTime;
    
    // Add to placed clips
    const placedClip = {
        id: clip.id,
        duration: clip.duration,
        theme: clip.theme,
        startTime: startTime
    };
    
    gameState.placedClips.push(placedClip);
    clip.used = true;
    
    // Render clip on timeline
    renderClipOnTimeline(placedClip);
    
    // Update library
    renderClipLibrary();
    
    // Update displays
    updateDisplays();
}

// Render Clip on Timeline
function renderClipOnTimeline(placedClip) {
    const clipElement = document.createElement('div');
    clipElement.className = 'timeline-clip';
    clipElement.id = `timeline-${placedClip.id}`;
    
    // Calculate position and width (assuming 60 second total duration)
    const leftPercent = (placedClip.startTime / gameState.duration) * 100;
    const widthPercent = (placedClip.duration / gameState.duration) * 100;
    
    clipElement.style.left = `${leftPercent}%`;
    clipElement.style.width = `${widthPercent}%`;
    
    clipElement.innerHTML = `
        <span class="clip-theme">${placedClip.theme}</span>
        <span class="clip-duration">${placedClip.duration}s</span>
        <button class="remove-btn" onclick="removeClip('${placedClip.id}')">×</button>
    `;
    
    timeline.appendChild(clipElement);
}

// Remove Clip from Timeline
function removeClip(clipId) {
    if (gameState.isGameOver) return;
    
    // Remove from placed clips
    const index = gameState.placedClips.findIndex(c => c.id === clipId);
    if (index > -1) {
        gameState.placedClips.splice(index, 1);
    }
    
    // Remove from timeline
    const clipElement = document.getElementById(`timeline-${clipId}`);
    if (clipElement) {
        clipElement.remove();
    }
    
    // Mark as unused in library
    const libraryClip = clipLibrary.find(c => c.id === clipId);
    if (libraryClip) {
        libraryClip.used = false;
    }
    
    // Update library
    renderClipLibrary();
    
    // Update displays
    updateDisplays();
}

// Initialize Game
function initializeGame() {
    initializeDOMElements();
    initializeClipLibrary();
    setupEventListeners();
    renderClipLibrary();
    updateDisplays();
    
    // Set initial total time display
    totalTimeDisplay.textContent = formatTime(gameState.duration);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}
