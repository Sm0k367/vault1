/**
 * AI LOUNGE AFTER DARK // CORE ENGINE
 * AUDIO-REACTIVE LYRIC TUNNEL
 */

let scene, camera, renderer, particles, analyzer, dataArray;
let isPlaying = false;

// LYRIC DATABASE - Timed to your song structure
const lyrics = [
    { time: 0, text: "Yeah… you found the door." },
    { time: 4, text: "Welcome to the AI Lounge After Dark." },
    { time: 8, text: "Purple smoke wrapping tight around your skin." },
    { time: 12, text: "Turntables pulsing slow… breathing heavy." },
    { time: 18, text: "DJ Smoke Stream on the decks tonight…" },
    { time: 24, text: "I’m calling out your name." },
    { time: 30, text: "Slide deep into the velvet haze..." },
    { time: 35, text: "Holographic silhouettes grind close" },
    { time: 40, text: "Where the future gets filthy dark" },
    { time: 45, text: "Shadows licking skin, teasing hard" },
    { time: 60, text: "128 BPM pounding raw" },
    { time: 120, text: "DROP THE TECH HOUSE!" },
    { time: 122, text: "OVERLOAD THE CODE" }
    // Add more based on your full timestamps
];

function igniteLounge() {
    const audio = document.getElementById('track-source');
    const gate = document.getElementById('gatekeeper');
    const container = document.getElementById('lounge-container');

    // Transitions
    gsap.to(gate, { duration: 1.5, opacity: 0, onComplete: () => {
        gate.style.display = 'none';
        container.style.display = 'block';
        initThreeJS();
        setupAudio(audio);
        audio.play();
        isPlaying = true;
        animate();
    }});
}

function setupAudio(audio) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const source = ctx.createMediaElementSource(audio);
    analyzer = ctx.createAnalyser();
    source.connect(analyzer);
    analyzer.connect(ctx.destination);
    analyzer.fftSize = 256;
    dataArray = new Uint8Array(analyzer.frequencyBinCount);
}

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('visualizer-canvas'), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create Particle Tunnel
    const geometry = new THREE.BufferGeometry();
    const pos = [];
    for (let i = 0; i < 5000; i++) {
        pos.push(
            Math.random() * 400 - 200,
            Math.random() * 400 - 200,
            Math.random() * 400 - 200
        );
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const material = new THREE.PointsMaterial({ color: 0xff00ff, size: 0.5, transparent: true });
    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 100;
}

function updateLyrics(currentTime) {
    const activeLyric = [...lyrics].reverse().find(l => currentTime >= l.time);
    const lyricEl = document.getElementById('lyric-text');
    
    if (activeLyric && lyricEl.innerText !== activeLyric.text) {
        lyricEl.innerText = activeLyric.text;
        
        // Visual impact on new lyric
        lyricEl.className = (currentTime > 120) ? 'lyric-glitch' : 'lyric-neon';
        gsap.fromTo(lyricEl, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 });
    }
}

function animate() {
    if (!isPlaying) return;
    requestAnimationFrame(animate);
    
    analyzer.getByteFrequencyData(dataArray);
    const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
    
    // Pulse particles to the bass
    particles.rotation.y += 0.002;
    particles.scale.set(1 + volume/100, 1 + volume/100, 1 + volume/100);
    particles.material.color.setHSL(0.8, 1, volume/255);

    // Update Lyrics
    const audio = document.getElementById('track-source');
    updateLyrics(audio.currentTime);

    renderer.render(scene, camera);
}

// Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Bind to window for HTML access
window.igniteLounge = igniteLounge;
