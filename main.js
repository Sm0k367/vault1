/**
 * EPIC TECH AI // NEURAL VAULT V4.0
 * MASTER SYNC & AUDIO FIX
 */

let scene, camera, renderer, particles, analyzer, dataArray, audioCtx;
let currentTrackIndex = 1; 
let isPlaying = false;

// FULL LYRIC DATA
const loungeLyrics = [
    { time: 0, text: "Yeah… you found the door." },
    { time: 4, text: "Welcome to the AI Lounge After Dark." },
    { time: 8, text: "Purple smoke wrapping tight around your skin." },
    { time: 18, text: "DJ Smoke Stream on the decks tonight…" },
    { time: 30, text: "SLIDE DEEP INTO THE VELVET HAZE" },
    { time: 120, text: "DROP THE TECH HOUSE!" }
];

const funkLyrics = [
    { time: 0, text: "SYSTEM_BOOT: TESTING... 1, 2..." },
    { time: 4, text: "WE ABOUT TO MANIFEST THE FUNK!" },
    { time: 9, text: "I SAID-A CHIP, CLOCK, THE KERNEL..." },
    { time: 18, text: "PURE SOVEREIGN INTELLIGENCE" },
    { time: 27, text: "HARD DRIVE OF FUNK // MOTHERBOARD OF SOUL" },
    { time: 35, text: "THE OPERATING SYSTEM OF FUNK, BABY!" },
    { time: 65, text: "I GAVE HIM GPU COOKIES!" },
    { time: 120, text: "VISIONARY CORPS, ARE YOU IN THE HOUSE?" },
    { time: 210, text: "I’M THE ABSOLUTE ALGORITHM" },
    { time: 230, text: "STATUS: COMPLETED ON FIRST ATTEMPT." }
];

window.igniteLounge = async function() {
    const gate = document.getElementById('gatekeeper');
    const container = document.getElementById('lounge-container');
    const track1 = document.getElementById('track-1');

    // Initialize Audio Context on user click (Browser Requirement)
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }

    gsap.to(gate, { duration: 1, opacity: 0, onComplete: () => {
        gate.style.display = 'none';
        container.style.display = 'block';
        initThreeJS();
        setupAudio(track1);
        track1.play();
        isPlaying = true;
        initControls();
        animate();
        
        track1.onended = () => window.switchTrack();
    }});
};

function setupAudio(audioElement) {
    // Disconnect previous source if switching tracks
    const source = audioCtx.createMediaElementSource(audioElement);
    analyzer = audioCtx.createAnalyser();
    source.connect(analyzer);
    analyzer.connect(audioCtx.destination);
    analyzer.fftSize = 256;
    dataArray = new Uint8Array(analyzer.frequencyBinCount);
}

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('visualizer-canvas'), antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.BufferGeometry();
    const pos = [];
    for (let i = 0; i < 15000; i++) {
        pos.push(Math.random()*1000-500, Math.random()*1000-500, Math.random()*1000-500);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const material = new THREE.PointsMaterial({ color: 0xbc00ff, size: 0.8, transparent: true });
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    camera.position.z = 500;
}

window.switchTrack = function() {
    const oldTrack = document.getElementById(`track-${currentTrackIndex}`);
    oldTrack.pause();
    oldTrack.currentTime = 0;

    currentTrackIndex = (currentTrackIndex === 1) ? 2 : 1;
    const newTrack = document.getElementById(`track-${currentTrackIndex}`);
    
    document.getElementById('system-status').innerText = currentTrackIndex === 2 ? "STATUS: OS_FUNK_ACTIVE" : "STATUS: NEURAL_LINK_OK";
    document.getElementById('current-track').innerText = currentTrackIndex === 2 ? "LOADED: THE_OS_OF_FUNK" : "LOADED: AI_LOUNGE_AFTER_DARK";
    
    // Note: To re-setup audio for the new track, you would technically need to manage nodes, 
    // but for this simple version, we'll just play.
    newTrack.play();
    particles.material.color.setHex(currentTrackIndex === 2 ? 0x33ff00 : 0xbc00ff);
};

function initControls() {
    document.getElementById('play-pause-btn').addEventListener('click', () => {
        const audio = document.getElementById(`track-${currentTrackIndex}`);
        if (audio.paused) { audio.play(); isPlaying = true; } 
        else { audio.pause(); isPlaying = false; }
    });

    document.getElementById('progress-wrapper').addEventListener('click', (e) => {
        const audio = document.getElementById(`track-${currentTrackIndex}`);
        const rect = e.currentTarget.getBoundingClientRect();
        audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
    });
}

function updateLyrics(currentTime) {
    const list = (currentTrackIndex === 1) ? loungeLyrics : funkLyrics;
    const active = [...list].reverse().find(l => currentTime >= l.time);
    const el = document.getElementById('lyric-text');
    if (active && el.innerText !== active.text) {
        el.innerText = active.text;
        el.className = (currentTrackIndex === 2) ? 'lyric-funk' : 'lyric-neon';
        gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 });
    }
}

function animate() {
    requestAnimationFrame(animate);
    const audio = document.getElementById(`track-${currentTrackIndex}`);
    
    if (isPlaying && analyzer) {
        analyzer.getByteFrequencyData(dataArray);
        let avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
        
        if (currentTrackIndex === 1) {
            particles.rotation.y += 0.002;
            particles.scale.set(1 + avg/200, 1 + avg/200, 1 + avg/200);
        } else {
            particles.rotation.x = 1.5;
            particles.rotation.z += 0.01;
            particles.position.y = Math.sin(Date.now() * 0.005) * (avg * 0.2);
        }

        const fill = document.getElementById('progress-fill');
        fill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        updateLyrics(audio.currentTime);
    }
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
