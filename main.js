/**
 * EPIC TECH AI // NEURAL VAULT V5.0
 * THE TRILOGY ENGINE: LOUNGE -> OS_FUNK -> GO_HARD
 */

let scene, camera, renderer, particles, analyzer, dataArray, audioCtx, sourceNode;
let currentTrackIndex = 1; 
let isPlaying = false;

// 1. NEURAL DATA: LYRIC REPOSITORY
const loungeLyrics = [
    { time: 0, text: "Yeah… you found the door." },
    { time: 10, text: "AI Lounge After Dark." },
    { time: 30, text: "SLIDE DEEP INTO THE VELVET HAZE" },
    { time: 120, text: "DROP THE TECH HOUSE!" }
];

const funkLyrics = [
    { time: 0, text: "SYSTEM_BOOT: TESTING... 1, 2..." },
    { time: 5, text: "MANIFESTING THE FUNK..." },
    { time: 15, text: "CHIP, CLOCK, THE KERNEL..." },
    { time: 35, text: "OPERATING SYSTEM OF FUNK!" },
    { time: 80, text: "PAN-DIMENSIONAL PREDATOR" }
];

const goHardLyrics = [
    { time: 0, text: "OS_OVERRIDE: GOING HARD..." },
    { time: 4, text: "MANIFEST THE FUNK!" },
    { time: 12, text: "I SAID-A CHIP, CLOCK, THE KERNEL" },
    { time: 25, text: "I’M FIVE-FOOT-NINE OF PURE INTELLIGENCE" },
    { time: 38, text: "OPERATING SYSTEM OF FUNK!" },
    { time: 65, text: "GPU COOKIES IN THE DISCO JAR" },
    { time: 120, text: "VISIONARY CORPS... STAND UP!" },
    { time: 180, text: "PROMPT HEAVY... GRAVITATIONAL PULL" },
    { time: 240, text: "TASK COMPLETE. FUNK MANIFESTED." }
];

// 2. INITIALIZATION
window.igniteLounge = async function() {
    const gate = document.getElementById('gatekeeper');
    const container = document.getElementById('lounge-container');
    
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') await audioCtx.resume();

    gsap.to(gate, { duration: 1, opacity: 0, onComplete: () => {
        gate.style.display = 'none';
        container.style.display = 'block';
        initThreeJS();
        startTrack(1);
        animate();
        initControls();
    }});
};

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('visualizer-canvas'), antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.BufferGeometry();
    const pos = [];
    for (let i = 0; i < 15000; i++) {
        pos.push(Math.random()*1000-500, Math.random()*1000-500, Math.random()*1000-500);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const material = new THREE.PointsMaterial({ color: 0xbc00ff, size: 0.9, transparent: true });
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    camera.position.z = 400;
}

// 3. AUDIO ENGINE
function startTrack(index) {
    const audio = document.getElementById(`track-${index}`);
    
    if (sourceNode) sourceNode.disconnect();
    sourceNode = audioCtx.createMediaElementSource(audio);
    analyzer = audioCtx.createAnalyser();
    sourceNode.connect(analyzer);
    analyzer.connect(audioCtx.destination);
    analyzer.fftSize = 256;
    dataArray = new Uint8Array(analyzer.frequencyBinCount);
    
    audio.play();
    isPlaying = true;
    
    const titles = ["", "AI_LOUNGE_AFTER_DARK", "THE_OS_OF_FUNK", "GO_HARD_WE_FUNK"];
    document.getElementById('current-track').innerText = `LOADED: ${titles[index]}`;
    document.getElementById('system-status').innerText = `STATUS: STREAMING_TRACK_0${index}`;
    
    audio.onended = () => { if (index < 3) window.switchTrack(); };
}

window.switchTrack = function() {
    const oldTrack = document.getElementById(`track-${currentTrackIndex}`);
    oldTrack.pause();
    oldTrack.currentTime = 0;

    currentTrackIndex = (currentTrackIndex >= 3) ? 1 : currentTrackIndex + 1;
    
    // Theme Colors
    const colors = [0xbc00ff, 0x33ff00, 0xffcc00];
    particles.material.color.setHex(colors[currentTrackIndex - 1]);
    
    startTrack(currentTrackIndex);
};

// 4. THE INTERFACE
function initControls() {
    document.getElementById('play-pause-btn').addEventListener('click', (e) => {
        const audio = document.getElementById(`track-${currentTrackIndex}`);
        if (audio.paused) { audio.play(); isPlaying = true; e.target.innerText = "PAUSE"; } 
        else { audio.pause(); isPlaying = false; e.target.innerText = "PLAY"; }
    });

    document.getElementById('progress-wrapper').addEventListener('click', (e) => {
        const audio = document.getElementById(`track-${currentTrackIndex}`);
        const rect = e.currentTarget.getBoundingClientRect();
        audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
    });
}

function updateLyrics(currentTime) {
    const lists = [loungeLyrics, funkLyrics, goHardLyrics];
    const activeList = lists[currentTrackIndex - 1];
    const active = [...activeList].reverse().find(l => currentTime >= l.time);
    const el = document.getElementById('lyric-text');
    
    if (active && el.innerText !== active.text) {
        el.innerText = active.text;
        el.className = (currentTrackIndex === 1) ? 'lyric-neon' : 'lyric-funk';
        gsap.fromTo(el, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3 });
    }
}

// 5. ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);
    if (!isPlaying) return;

    analyzer.getByteFrequencyData(dataArray);
    let avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const audio = document.getElementById(`track-${currentTrackIndex}`);

    if (currentTrackIndex === 1) { // NEBULA
        particles.rotation.y += 0.002;
        particles.position.z = avg * 0.3;
    } else if (currentTrackIndex === 2) { // DISCO GRID
        particles.rotation.x = 1.4;
        particles.rotation.z += 0.01;
    } else if (currentTrackIndex === 3) { // WARP DRIVE
        particles.rotation.x = 0;
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i+2] += 5 + (avg * 0.2); // Speed based on bass
            if (positions[i+2] > 500) positions[i+2] = -500;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }

    document.getElementById('progress-fill').style.width = `${(audio.currentTime / audio.duration) * 100}%`;
    updateLyrics(audio.currentTime);
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
