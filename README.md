# tilegame

## Music Video Maker Game

A real-time music video creation game where you race against the clock to fill a timeline with video clips!

**Development Codespace**: stunning-space-barnacle

### How to Play

1. Open `music-video-maker.html` in your web browser
2. Click "Start Game" to begin
3. As the music plays, click on clips from the library to add them to your timeline
4. Clips are placed automatically at the end of your current timeline
5. Keep your timeline coverage within 10 seconds of the current playback position
6. If you fall more than 10 seconds behind, you lose!
7. Complete the entire song to win!

### Game Mechanics

- **Real-time Gameplay**: The music plays in real-time with a progress bar
- **Click to Add**: Simply click clips from the library to add them to your timeline
- **Time Pressure**: You must keep up! Can't get more than 10 seconds behind or you lose
- **Clip Variety**: Choose from 1, 2, 3, 4, and 5 second video clips
- **Score System**: Your score is based on timeline coverage percentage

### File Structure

```
tilegame/
├── music-video-maker.html  # Main game HTML
├── style.css               # Game styling
├── game.js                 # Game logic
├── assets/
│   └── demo-song.mp3      # Demo music file (add your own)
└── README.md
```

### Adding Your Own Music

**Important**: You need to add your own MP3 file to play the game with audio!

To use your own music:
1. Find or create an MP3 file (30-90 seconds recommended)
2. Place it in the `assets/` folder
3. Name it `demo-song.mp3`, or update the `<audio>` tag in `music-video-maker.html` to point to your file

You can get royalty-free music from:
- [FreeMusicArchive](https://freemusicarchive.org/)
- [Incompetech](https://incompetech.com/)
- [YouTube Audio Library](https://www.youtube.com/audiolibrary)

**Note**: The game will load without audio, but you won't hear music during gameplay until you add an MP3 file.

### Features

- ✨ Modern, responsive UI
- 🎵 Real-time audio playback
- 📊 Live progress tracking
- 🎬 30 unique video clips to choose from
- 🎮 Challenging time-pressure gameplay
- 📱 Mobile-friendly design

### Browser Compatibility

Works in all modern browsers that support:
- HTML5 Audio
- CSS Grid
- ES6 JavaScript