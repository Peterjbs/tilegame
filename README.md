# 🎮 Tile Adventure - Mini Games Collection

A comprehensive collection of engaging browser-based mini-games featuring robust error handling, intelligent API integration with fallback systems, and local storage for score tracking.

## 🎯 Features

- **4 Compelling Mini-Games**
  - 🧠 Memory Match - Test your memory with tile matching
  - 🧩 Tile Puzzle - Solve challenging sliding puzzles
  - ❓ Trivia Challenge - Answer questions with API-powered content
  - ⚡ Quick Reaction - Test your reflexes

- **Robust Architecture**
  - Error handling and failsafes throughout
  - API integration with multiple fallback systems
  - Local storage for persistent score tracking
  - Responsive design for all devices

## 🚀 Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Peterjbs/tilegame.git
   cd tilegame
   ```

2. Open `index.html` in your browser:
   ```bash
   # Using Python's built-in server
   python -m http.server 8000
   
   # Or using Node.js http-server
   npx http-server
   ```

3. Navigate to `http://localhost:8000` in your browser

### Direct Usage

Simply open `index.html` directly in any modern web browser. No build process required!

## 🎮 Game Details

### Memory Match
- Match pairs of emoji tiles
- Score based on number of moves
- Bonus points for efficiency
- 8 pairs to match

### Tile Puzzle
- Classic 15-puzzle variant (4x4 grid)
- Move tiles to solve the puzzle
- Hint system for stuck players
- Solvability guaranteed
- Score based on moves and time

### Trivia Challenge
- 10 questions per game
- Multiple-choice format
- **API Integration with Fallbacks:**
  1. Primary: Open Trivia Database API
  2. Secondary: The Trivia API
  3. Fallback: Offline question bank
- Timeout protection (5 seconds per API)
- Score based on correct answers

### Quick Reaction
- Test your reaction time
- 5 rounds per test
- Avoid clicking too early
- Score based on speed
- Average and best time tracking

## 🔧 Technical Details

### Architecture

```
tilegame/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── game.js            # Main game controller
├── minigames/
│   ├── memory.js      # Memory Match game
│   ├── puzzle.js      # Tile Puzzle game
│   ├── trivia.js      # Trivia Challenge with API integration
│   └── reaction.js    # Quick Reaction game
└── README.md          # This file
```

### Failsafes & Error Handling

1. **API Integration (Trivia Game)**
   - 5-second timeout per API request
   - Automatic failover to backup API
   - Offline fallback question bank
   - Graceful error messages

2. **Local Storage**
   - Try-catch blocks for all localStorage operations
   - Continues without saving if unavailable
   - Automatic score recovery on page reload

3. **Game Logic**
   - Input validation and sanitization
   - State management prevents invalid actions
   - Puzzle solvability verification
   - Timer cleanup on navigation

### Browser Compatibility

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers supported

## 📊 Scoring System

- **Memory Match:** 100 pts per pair + efficiency bonus
- **Tile Puzzle:** 500 base + time/move bonuses
- **Trivia:** 50 pts per correct answer + completion bonus
- **Reaction:** Points based on speed (10-200 per round)

## 🛠️ Development

### Code Structure

Each mini-game is encapsulated in its own class with:
- `init()` - Initialize/reset game state
- `setupEventListeners()` - Attach event handlers
- Game-specific logic methods
- Score calculation and reporting

### Adding New Games

1. Create a new JS file in `minigames/`
2. Implement game class with `init()` method
3. Add game tile to `index.html`
4. Include script in `index.html`
5. Update game controller in `game.js`

## 🎨 Customization

### Styling
Modify `styles.css` to change:
- Color scheme (gradients)
- Fonts and sizes
- Animations and transitions
- Responsive breakpoints

### Game Difficulty
Adjust constants in each game file:
- Memory: Number of pairs
- Puzzle: Grid size
- Trivia: Questions per game
- Reaction: Number of rounds

## 📝 License

MIT License - feel free to use and modify!

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 🐛 Known Issues

None at this time. Please report issues on GitHub.

## 🙏 Credits

- Open Trivia Database API
- The Trivia API
- Emoji icons from Unicode standard

---

Made with ❤️ for tile game enthusiasts