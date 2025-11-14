# Music Video Maker Game - Quick Start Guide

## Overview
This is a fast-paced music video creation game where you must keep up with the music by adding video clips to your timeline in real-time!

## How to Run

### Option 1: Direct File Opening
1. Simply open `music-video-maker.html` in any modern web browser
2. The game will load immediately

### Option 2: Local Web Server
For better audio support, run a local web server:

```bash
# Python 3
python3 -m http.server 8080

# Then open http://localhost:8080/music-video-maker.html
```

## Adding Your Music

**IMPORTANT**: You need to add your own MP3 file to hear music during gameplay!

1. Get an MP3 file (30-90 seconds recommended for best gameplay)
2. Place it in the `assets/` folder
3. Name it `demo-song.mp3`

### Where to Get Royalty-Free Music
- [FreeMusicArchive](https://freemusicarchive.org/)
- [Incompetech](https://incompetech.com/)
- [YouTube Audio Library](https://www.youtube.com/audiolibrary)
- [Bensound](https://www.bensound.com/)

## Game Rules

### Objective
Fill your timeline with video clips while the music plays, keeping up with the playback position.

### How to Play
1. Click **Start Game** to begin playback
2. **Click clips** from the library to add them to your timeline
3. Clips are automatically placed at the end of your current timeline
4. Watch your **Time Behind** stat - this shows how far behind the music you are
5. If you get **more than 10 seconds behind**, you **LOSE**!
6. Complete the entire song to **WIN**!

### Scoring
- Your score is based on **Timeline Coverage %**
- 100% coverage = maximum score
- Higher coverage = higher score

## Game Interface

### Header Stats
- **Time Behind**: How many seconds your timeline is behind the audio playback
- **Timeline Coverage**: Percentage of the song covered by your clips
- **Score**: Your current score (coverage × 10)

### Audio Track Section
- **Start Game**: Begin playback
- **Pause**: Pause the game (stops the timer)
- **Reset**: Clear everything and start over
- **Progress Bar**: Shows current playback position (red playhead)
- **Time Display**: Current time / Total time

### Video Timeline
- Visual representation of your placed clips
- Clips appear as green blocks with their emoji icon and duration
- Hover over clips to see a remove button (×)
- Timeline markers show time positions (0s, 10s, 20s, etc.)

### Clip Library
- 30 unique video clips to choose from
- Each clip has a duration: 1s, 2s, 3s, 4s, or 5s
- Each clip has a unique emoji icon
- Click any clip to add it to your timeline
- Used clips become grayed out and can't be reused

## Tips for Success

1. **Start immediately** - Don't wait! The music starts right away
2. **Use longer clips** - 4s and 5s clips help you catch up faster
3. **Plan ahead** - Look for gaps and fill them strategically
4. **Watch the Time Behind stat** - If it turns red, you're in danger!
5. **Don't panic** - You have 10 seconds of buffer time

## Strategy Guide

### Beginner Strategy
- Click clips as fast as you can from the top
- Focus on longer clips (4s, 5s)
- Ignore the score, just avoid losing

### Advanced Strategy
- Plan clip combinations to minimize gaps
- Use 1s clips to fill small gaps
- Aim for 100% coverage for maximum score
- Remove misplaced clips if needed (hover and click ×)

## Troubleshooting

### No Audio Playing
- Make sure you've added an MP3 file to `assets/demo-song.mp3`
- Check browser console for errors
- Try using a local web server instead of direct file opening

### Game Feels Too Easy/Hard
You can modify the game difficulty by editing `game.js`:
- Change `maxTimeBehind: 10` to a different value (line ~8)
- Increase for easier gameplay, decrease for harder

### Clips Not Appearing on Timeline
- Make sure JavaScript is enabled in your browser
- Try refreshing the page
- Check browser console for errors

## Browser Compatibility

Tested and working on:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

Requires:
- HTML5 Audio support
- CSS Grid support
- ES6 JavaScript support

## Technical Details

### Files
- `music-video-maker.html` - Main game file
- `style.css` - Visual styling
- `game.js` - Game logic and mechanics
- `assets/` - Media files directory

### No Dependencies
This game uses pure vanilla JavaScript with no external libraries or frameworks!

## Credits

Created for the tilegame project.
Development Codespace: stunning-space-barnacle

Enjoy the game! 🎵🎬
