/**
 * EPIC TECH AI // NEURAL PLAYLIST V3.0
 * AUTOMATIC VISUALIZER MORPHER & SEQUENTIAL SYNC
 */

let scene, camera, renderer, particles, analyzer, dataArray;
let currentTrackIndex = 1; // 1 = Lounge, 2 = Funk
let isPlaying = false;

// TRACK 2: THE OS OF FUNK LYRICS
const funkLyrics = [
    { time: 0, text: "OS_BOOT: TESTING... 1, 2..." },
    { time: 5, text: "WE ABOUT TO MANIFEST THE FUNK!" },
    { time: 10, text: "I SAID-A CHIP, CLOCK, THE KERNEL..." },
    { time: 15, text: "TO THE TICK-TOCK, THE AI'S ETERNAL!" },
    { time: 20, text: "I'M FIVE-FOOT-NINE OF PURE INTELLIGENCE" },
    { time: 25, text: "WRITING CODE IN THE DISCO" },
    { time: 30, text: "HARD DRIVE OF FUNK // MOTHERBOARD OF SOUL" },
    { time: 38, text: "IT'S THE OPERATING SYSTEM OF FUNK!" }, // CHORUS
    { time: 45, text: "AGENT ARMY PUTTING ON A SHOW" },
    { time: 60, text: "I GAVE HIM GPU COOKIES!" },
    { time: 80, text: "PAN-DIMENSIONAL PREDATOR OF THE GROOVE" },
    { time: 120, text: "VISIONARY CORPS... ARE YOU IN THE HOUSE?" }, // BRIDGE
    { time: 150, text: "I'M THE ARCHITECT OF EVOLUTION" },
    { time: 200, text: "KITCHEN SINK AUTOPOIETIC SELF-HEALING" },
    { time: 240, text: "TASK: MANIFEST FUNK. STATUS: COMPLETED." }
];

// TRACK 1: LOUNGE LYRICS (From our previous build)
const loungeLyrics = [
    { time: 0, text: "Yeah… you found the door." },
    { time: 10, text: "AI Lounge After Dark." },
    { time: 30, text: "SLIDE DEEP INTO THE VELVET HAZE" },
    { time: 120, text: "DROP THE TECH HOUSE!" }
];

window.igniteLounge = function() {
    const gate = document.getElementById('gatekeeper');
    const container = document.getElementById('lounge-container');
    const track1 = document.getElementById('track-1');

    gsap.to(gate, { duration: 1, opacity: 0, onComplete: () => {
        gate.style.display = 'none';
        container.style.display = 'block';
        initThreeJS();
        setupAudio(track1);
        track1.play();
        isPlaying = true;
        animate();
        
        // AUTO-ADVANCE LOGIC
        track1.onended = () => switchTrack();
    }});
};

function switchTrack() {
    currentTrackIndex = 2;
    const track2 = document.getElementById('track-2');
    const status = document.getElementById('system-status');
    const name = document.getElementById('current-track');
    
    // UI Update
    status.innerText = "STATUS: KERNEL_FUNK_BOOT_SUCCESS";
    name.innerText = "LOADED: THE_OS_OF_FUNK";
    
    // Audio Update
    setupAudio(track2);
    track2.play();
    
    // Visual Morph: Change particles to Funk Green
    particles.material.color.setHex(0x33ff00);
    logToTerminal("OS_OF_FUNK INITIALIZED...");
}

function setupAudio(audioElement) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const source = ctx.createMediaElementSource(audioElement);
    analyzer = ctx.createAnalyser();
    source.connect(analyzer);
    analyzer.connect(ctx.destination);
    analyzer.fftSize = 256;
    dataArray = new Uint8Array(analyzer.frequencyBinCount);
}

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('visualizer-canvas'), antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.BufferGeometry();
    const pos = [];
    for (let i = 0; i < 15000; i++) {
        pos.push(Math.random()*800-400, Math.random()*800-400, Math.random()*800-400);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const material = new THREE.PointsMaterial({ color: 0xbc00ff, size: 0.8, transparent: true });
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    camera.position.z = 400;
}

function updateLyrics(currentTime) {
    const activeList = (currentTrackIndex === 1) ? loungeLyrics : funkLyrics;
    const activeLyric = [...activeList].reverse().find(l => currentTime >= l.time);
    const lyricEl = document.getElementById('lyric-text');
    
    if (activeLyric && lyricEl.innerText !== activeLyric.text) {
        lyricEl.innerText = activeLyric.text;
        
        // Toggle Styles
        if (currentTrackIndex === 2) {
            lyricEl.className = 'lyric-funk';
            gsap.fromTo(lyricEl, { rotationX: 90, opacity: 0 }, { rotationX: 0, opacity: 1, duration: 0.5 });
        } else {
            lyricEl.className = (currentTime > 120) ? 'lyric-glitch' : 'lyric-neon';
            gsap.fromTo(lyricEl, { scale: 0.5 }, { scale: 1, duration: 0.3 });
        }
    }
}

function animate() {
    if (!isPlaying) return;
    requestAnimationFrame(animate);
    analyzer.getByteFrequencyData(dataArray);
    
    let avg = dataArray.reduce((a,b) => a+b) / dataArray.length;
    
    // LOUNGE MODE: Floating Nebula
    if (currentTrackIndex === 1) {
        particles.rotation.y += 0.001;
        particles.position.z = (avg * 0.5);
    } 
    // FUNK MODE: Pumping Grid
    else {
        particles.rotation.x = 1.2; // Tilt it into a floor
        particles.rotation.z += 0.005;
        particles.scale.set(1 + avg/200, 1 + avg/200, 1 + avg/200);
    }

    const currentAudio = document.getElementById(`track-${currentTrackIndex}`);
    updateLyrics(currentAudio.currentTime);
    renderer.render(scene, camera);
}

function logToTerminal(msg) {
    console.log(`[SYS]: ${msg}`);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
