const fs = require('fs');
const { createCanvas } = require('canvas');
const path = require('path');

const TOTAL_FRAMES = 242;
const WIDTH = 1920;
const HEIGHT = 1080;
const OUTPUT_DIR = path.join(__dirname, 'assets', 'frames');

// Ensure directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log(`Generating ${TOTAL_FRAMES} placeholder frames...`);

for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    // Create a dynamic background color based on frame progress
    // Simulating a run moving from dark to light
    const progress = i / TOTAL_FRAMES;
    const r = Math.floor(20 + progress * 200);
    const g = Math.floor(20 + progress * 100);
    const b = Math.floor(40 + progress * 50);
    
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Draw grid lines to show movement
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 2;
    const offset = (i * 10) % 100;
    
    for(let x = offset; x < WIDTH; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
        ctx.stroke();
    }
    
    for(let y = offset; y < HEIGHT; y += 100) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
    }

    // Draw the "Cheetah" Shape (a simple moving block)
    const cheetahX = (WIDTH * 0.2) + (progress * WIDTH * 0.6);
    const cheetahY = HEIGHT / 2 + Math.sin(i * 0.5) * 50; // Bouncing motion
    
    ctx.fillStyle = '#ff8c00'; // Orange
    ctx.fillRect(cheetahX, cheetahY - 100, 300, 200);
    
    // Add text overlay
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`FRAME ${String(i).padStart(3, '0')}`, cheetahX + 150, cheetahY);

    // Save frame
    const filename = `ezgif-frame-${String(i).padStart(3, '0')}.jpg`;
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.8 });
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), buffer);
    
    if (i % 50 === 0) console.log(`Generated ${i}/${TOTAL_FRAMES}`);
}

console.log('Done! Frames generation complete.');
