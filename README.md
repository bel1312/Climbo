# 🏔️ Mountain Climber Game

A thrilling web-based climbing game where you scale treacherous mountain peaks, avoid deadly obstacles, collect power-ups, and compete for the highest score!

![Mountain Climber](https://img.shields.io/badge/Game-Mountain%20Climber-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![CSS3](https://img.shields.io/badge/CSS3-Responsive-blue)

## 🎮 How to Play

### **Objective**
Climb as high as possible while avoiding obstacles, collecting power-ups, and building combo streaks to maximize your score!

### **Controls**
- **Movement**: ⬅️ ➡️ Arrow Keys or `A` / `D`
- **Jump**: ⬆️ Arrow Key, `W`, or `Space Bar`
- **Fast Fall**: ⬇️ Arrow Key or `S`
- **Double Jump**: Press jump again while in mid-air
- **Pause**: `ESC` or `P`

## 🎯 Game Features

### **🏔️ Mountain Physics**
- **Realistic gravity** and momentum-based movement
- **Double jump mechanics** for advanced platforming
- **Moving platform interaction** - get carried along with orange platforms
- **Screen wrapping** - move off one side to appear on the other

### **🎨 Platform Types**
- 🟫 **Normal Platforms** (Brown) - Standard solid platforms
- 🟩 **Small Platforms** (Green) - Harder to land on, good for combo building
- 🟠 **Moving Platforms** (Orange) - Slide back and forth, carry you along
- 🟤 **Breakable Platforms** (Dark Brown) - Break after 2 hits, show visual cracks
- 🩷 **Bouncy Platforms** (Pink) - Launch you high into the air for mega jumps

### **⚡ Power-Up System**
- ❤️ **Life** (Green Heart) - Gain extra lives
- ⭐ **Score** (Gold Star) - Instant bonus points  
- ⚡ **Speed** (Blue Lightning) - Temporary speed and jump boost
- 🛡️ **Shield** (Purple) - Extended invulnerability period
- 🧲 **Magnet** (Orange) - Attracts nearby collectibles

### **🔥 Combo System**
- Build combos by landing on different platforms and staying airborne
- Higher combos = higher score multipliers
- Visual feedback shows combo level with color changes
- Perfect for competitive high-score gameplay

### **🌦️ Dynamic Weather**
- **Clear skies** at low altitudes
- **Rain effects** at medium heights (200m+)
- **Snow storms** at high altitudes (500m+)
- Weather affects visibility and adds atmosphere

### **🏆 Achievement System**
- 🏔️ **Mountain Explorer** - Reach 100m height
- ⛰️ **Peak Climber** - Reach 500m height  
- 🔥 **Combo Master** - Achieve 10x combo streak
- ⭐ **Score Champion** - Reach 1000 points
- Progress saved locally with browser storage

### **📊 Statistics & Records**
- Track your best scores and heights
- Persistent high scores using localStorage
- Compare current run with personal bests
- Achievement tracking and notifications

## 🎪 Obstacles & Challenges

### **Deadly Obstacles**
- 🪨 **Falling Rocks** (Gray) - Drop from above, avoid or take damage
- 🐦 **Flying Birds** (Brown) - Move erratically, time your movements

### **Environmental Hazards**
- **Falling off screen** - Lose a life and respawn on nearest platform
- **Breaking platforms** - Can leave you stranded if not careful
- **Weather effects** - Reduced visibility in storms

## 🎵 Game Mechanics

### **Lives System**
- Start with 3 lives
- Lose a life when hit by obstacles or falling too far
- Gain lives through power-ups
- Game over when all lives are lost

### **Scoring System**
- **Height-based scoring** - Points for climbing higher
- **Combo multipliers** - Chain landings for bonus points
- **Power-up bonuses** - Extra points for collecting items
- **Achievement rewards** - Bonus points for milestones

### **Difficulty Scaling**
- Game speed increases gradually with height
- More obstacles appear at higher altitudes
- Platform generation becomes more challenging
- Weather effects add complexity

## 🛠️ Technical Features

### **Performance Optimized**
- Smooth 60 FPS gameplay
- Efficient collision detection
- Optimized particle systems
- Responsive canvas rendering

### **Mobile Friendly**
- Responsive design for all screen sizes
- Touch-friendly interface elements
- Optimized for mobile browsers

### **Browser Compatibility**
- Works in all modern browsers
- HTML5 Canvas for smooth graphics
- No external dependencies required

## 🚀 Installation & Setup

### **Quick Start**
1. **Download** or clone the repository
2. **Open** `index.html` in any modern web browser
3. **Click** "Start Climbing" and begin your adventure!

### **Local Development**
```bash
# Clone the repository
git clone https://github.com/yourusername/mountain-climber.git

# Navigate to directory
cd mountain-climber

# Open in browser (or use a local server)
open index.html
```

### **File Structure**
```
mountain-climber/
├── index.html          # Main game HTML
├── style.css           # Game styling and UI
├── script.js           # Game logic and mechanics
└── README.md           # This file
```

## 🎯 Game Tips & Strategies

### **Beginner Tips**
1. **Practice double jumping** - Essential for reaching higher platforms
2. **Use moving platforms** - Let them carry you to save energy
3. **Collect power-ups** - They provide significant advantages
4. **Build combos carefully** - Don't rush, plan your landings

### **Advanced Strategies**
1. **Master bouncy platforms** - Use them for massive height gains
2. **Screen wrapping** - Use edge wrapping for creative movement
3. **Weather timing** - Plan moves during weather transitions
4. **Breaking platform management** - Don't break all platforms in an area

### **High Score Tips**
1. **Combo chaining** - Keep airborne as long as possible
2. **Power-up timing** - Save speed boosts for difficult sections
3. **Risk vs reward** - Sometimes dangerous routes give better scores
4. **Achievement hunting** - Unlock all achievements for bonus points

## 🏆 Leaderboard Goals

### **Score Milestones**
- 🥉 **Bronze**: 500 points
- 🥈 **Silver**: 1,500 points  
- 🥇 **Gold**: 3,000 points
- 🏆 **Legendary**: 5,000+ points

### **Height Challenges**
- 🎯 **Beginner**: 100m
- 🎯 **Intermediate**: 300m
- 🎯 **Advanced**: 500m
- 🎯 **Expert**: 1,000m+

## 🔄 Updates & Future Features

### **Recent Improvements**
- ✅ Added moving platform physics
- ✅ Implemented weather effects
- ✅ Achievement system with notifications
- ✅ Pause functionality
- ✅ Best score tracking
- ✅ Responsive controls tuning

### **Planned Features**
- 🔜 Sound effects and background music
- 🔜 Multiple character skins
- 🔜 Different mountain themes
- 🔜 Online leaderboards
- 🔜 Multiplayer race mode

## 🐛 Known Issues & Fixes

### **Current Status**
- ✅ Jump mechanics working perfectly
- ✅ Moving platform interaction fixed
- ✅ Breakable platform frequency balanced
- ✅ Controller responsiveness tuned
- ✅ Score rounding implemented

### **Reporting Bugs**
Found a bug? Please create an issue with:
1. Browser and version
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots if applicable

## 📱 Browser Support

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome | ✅ | Fully supported |
| Firefox | ✅ | Fully supported |
| Safari | ✅ | Fully supported |
| Edge | ✅ | Fully supported |
| Mobile | ✅ | Responsive design |

## 🎨 Customization

### **Modifying the Game**
The game is built with clean, modular code that's easy to customize:

- **`script.js`** - Game logic, physics, and mechanics
- **`style.css`** - Visual styling, animations, and UI
- **`index.html`** - Game structure and layout

### **Adding New Features**
1. **Platform types** - Add new platform behaviors in `generatePlatform()`
2. **Power-ups** - Extend the power-up system in `collectPowerUp()`
3. **Obstacles** - Create new obstacles in `generateObstacle()`
4. **Weather** - Add weather types in `generateWeatherParticles()`

## 🤝 Contributing

We welcome contributions! Here's how to help:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your improvements
4. **Test** thoroughly
5. **Submit** a pull request

### **Contribution Ideas**
- 🎵 Sound effects and music
- 🎨 New visual themes
- 🎮 Additional game modes
- 🏆 Enhanced achievements
- 📱 Mobile optimizations

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎉 Credits

**Game Design & Development**
- Original concept and implementation
- Physics engine and game mechanics
- Visual design and user interface
- Achievement and progression systems

**Special Thanks**
- HTML5 Canvas API for rendering
- Modern JavaScript features
- CSS3 for animations and styling
- Local Storage for data persistence

---

## 🏔️ Ready to Climb?

**Start your mountain climbing adventure today!**

Open `index.html` in your browser and see how high you can climb. Will you reach the summit and claim the highest score?

*Good luck, climber! May your jumps be precise and your combos endless!* 🎮⛰️

---

**Version**: 2.0  
**Last Updated**: July 2025  
**Compatibility**: All modern browsers  
**Platform**: Web (HTML5)
