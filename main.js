/**
 * AI LOUNGE AFTER DARK // CORE ENGINE
 * AUDIO-REACTIVE 3D LYRIC TUNNEL
 */

let scene, camera, renderer, particles, analyzer, dataArray;
let isPlaying = false;

// THE FULL NEURAL TIMELINE (Mapped to your Suno track)
const lyrics = [
    { time: 0, text: "Yeah… you found the door." },
    { time: 4, text: "Welcome to the AI Lounge After Dark." },
    { time: 8, text: "Purple smoke wrapping tight around your skin." },
    { time: 12, text: "Turntables pulsing slow… breathing heavy." },
    { time: 18, text: "DJ Smoke Stream on the decks tonight…" },
    { time: 24, text: "Come closer, baby… let the shadows fuck with your mind." },
    { time: 30, text: "Slide deep into the velvet haze..." },
    { time: 35, text: "Holographic silhouettes grind close" },
    { time: 45, text: "Shadows licking skin, teasing hard" },
    { time: 60, text: "128 BPM POUNDING RAW" },
    { time: 90, text: "DJ Smoke Stream calling your name" },
    { time: 120, text: "DROP THE TECH HOUSE!" }, // THE FIRST DROP
    { time: 125, text: "FUCK ME TILL I BREAK" },
    { time: 180, text: "AI LOUNGE AFTER DARK — RIDE THE GROOVE" },
    { time: 210, text: "BASS DROPS HEAVIER THAN CHAINS" },
    { time: 300, text: "HARDER… DEEPER… MAKE YOU MINE" },
    { time: 360, text: "FEEL THE FOUR-ON-THE-FLOOR KICK" },
    { time: 450, text: "STRIP IT ALL DOWN... JUST THE KICK" },
    { time: 480, text: "SAY MY NAME... DJ SMOKE STREAM" },
    { time: 510, text: "COME BACK SOON... THE SHADOWS ARE WAITING" }
];

window.igniteLounge = function() {
    const audio = document.getElementById('track-source');
    const gate = document.getElementById('gatekeeper');
    const container = document.getElementById('lounge-container');

    // Visual handoff
    gsap.to(gate, { duration: 1, opacity: 0, onComplete: () => {
        gate.style.display = 'none';
        container.style.display = 'block';
        initThreeJS();
        setupAudio(audio);
        audio.play().catch(e => console.log("User gesture required for audio."));
        isPlaying = true;
        animate();
    }});
};

function setupAudio(audio) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const source = ctx.createMediaElementSource(audio);
    analyzer = ctx.createAnalyser();
    source.connect(analyzer);
    analyzer.connect(ctx.destination);
    analyzer.fftSize = 512;
    dataArray = new Uint8Array(analyzer.frequencyBinCount);
}

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('visualizer-canvas'), 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create a massive particle field
    const geometry = new THREE.BufferGeometry();
    const pos = [];
    for (let i = 0; i < 15000; i++) {
        pos.push(
            THREE.MathUtils.randFloatSpread(1000),
            THREE.MathUtils.randFloatSpread(1000),
            THREE.MathUtils.randFloatSpread(2000)
        );
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const material = new THREE.PointsMaterial({ 
        color: 0xbc00ff, 
        size: 0.8, 
        transparent: true,
        blending: THREE.AdditiveBlending 
    });
    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 500;
}

function updateLyrics(currentTime) {
    const activeLyric = [...lyrics].reverse().find(l => currentTime >= l.time);
    const lyricEl = document.getElementById('lyric-text');
    
    if (activeLyric && lyricEl.innerText !== activeLyric.text) {
        lyricEl.innerText = activeLyric.text;
        
        // Intensity Logic: After 2 minutes, turn on Glitch/Shake
        if (currentTime > 120) {
            lyricEl.className = 'lyric-glitch';
            gsap.fromTo("body", { x: -5 }, { x: 5, duration: 0.05, repeat: 3, yoyo: true });
        } else {
            lyricEl.className = 'lyric-neon';
        }
        
        // Entrance animation for each lyric line
        gsap.fromTo(lyricEl, 
            { scale: 0.5, opacity: 0, filter: "blur(10px)" }, 
            { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.4, ease: "power4.out" }
        );
    }
}

function animate() {
    if (!isPlaying) return;
    requestAnimationFrame(animate);
    
    analyzer.getByteFrequencyData(dataArray);
    
    // Get average volume for overall pulse
    let sum = 0;
    for(let i=0; i < dataArray.length; i++) sum += dataArray[i];
    let avg = sum / dataArray.length;

    // Pulse particles toward the camera
    particles.rotation.z += 0.001;
    particles.position.z += (avg * 0.05) + 2;
    if (particles.position.z > 1000) particles.position.z = 0;
    
    // Reactively shift color between Purple and Cyan
    particles.material.color.setHSL(0.8 + (avg/500), 1, 0.5);

    const audio = document.getElementById('track-source');
    updateLyrics(audio.currentTime);

    renderer.render(scene, camera);
}

// Ensure responsive design
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
