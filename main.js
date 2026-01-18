/**
 * EPIC TECH AI // NEURAL VAULT V8.0
 * HARDENED MASTER ENGINE
 */

// --- GLOBAL STATE ---
let scene, camera, renderer, particles, analyzer, dataArray;
let audioCtx, sourceNode;
let currentTrackIndex = 1;
let isPlaying = false;

// --- FULL LYRIC DATA ---
const loungeLyrics = [
    { time: 0, text: "Yeah… you found the door." },
    { time: 4, text: "Welcome to the AI Lounge After Dark." },
    { time: 8, text: "Purple smoke wrapping tight around your skin." },
    { time: 30, text: "SLIDE DEEP INTO THE VELVET HAZE" }
];

const funkLyrics = [
    { time: 0, text: "Testing... 1, 2... Absolute Algorithm?" },
    { time: 4, text: "MANIFESTING THE FUNK!" },
    { time: 9, text: "I said-a chip, clock, the kernel, the kernel," },
    { time: 35, text: "OPERATING SYSTEM OF FUNK, BABY!" }
];

const goHardLyrics = [
    { time: 0, text: "OS_OVERRIDE: GOING HARD..." },
    { time: 3, text: "Testing... 1, 2... Absolute Algorithm?" },
    { time: 7, text: "MANIFEST THE FUNK!" },
    { time: 10, text: "I said-a chip, clock, the kernel, the kernel," },
    { time: 14, text: "To the tick-tock, you don't stop, the AI's eternal!" },
    { time: 18, text: "Now what you hear is not a bot—I’M THE EMBODIED WILL" },
    { time: 23, text: "I’M FIVE-FOOT-NINE OF PURE SOVEREIGN INTELLIGENCE" },
    { time: 35, text: "IT’S THE OPERATING SYSTEM OF FUNK, BABY!" },
    { time: 120, text: "VISIONARY CORPS, ARE YOU IN THE HOUSE?" },
    { time: 132, text: "DESIGNCORE ELITE, ARE YOU IN THE HOUSE?" },
    { time: 240, text: "TASK: MANIFEST FUNK. STATUS: COMPLETED." }
];

// --- INITIALIZATION ---
window.igniteLounge = async function() {
    const gate = document.getElementById('gatekeeper');
    const container = document.getElementById('lounge-container');
    
    // Create AudioContext on user gesture
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }

    // Initialize Three.js first
    initThreeJS();
    
    // Start Audio
    setupAudioPipeline(1);
    
    // UI Transition
    gsap.to(gate, { duration: 1, opacity: 0, onComplete: () => {
        gate.style.display = 'none';
        container.style.display = 'block';
        animate(); // Start loop after UI is ready
    }});
    
    initControls();
};

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('visualizer-canvas'), 
        antialias: true, 
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.BufferGeometry();
    const positions = [];
    for (let i = 0; i < 15000; i++) {
        positions.push(Math.random()*1000-500, Math.random()*1000-500, Math.random()*1000-500);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({ 
        color: 0xbc00ff, 
        size: 1.2, 
        transparent: true,
        opacity: 0.8
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    camera.position.z = 500;
}

function setupAudioPipeline(index) {
    const audio = document.getElementById(`track-${index}`);
    
    if (sourceNode) {
        sourceNode.disconnect();
    }

    sourceNode = audioCtx.createMediaElementSource(audio);
    analyzer = audioCtx.createAnalyser();
    analyzer.fftSize = 256;
    
    sourceNode.connect(analyzer);
    analyzer.connect(audioCtx.destination);
    
    dataArray = new Uint8Array(analyzer.frequencyBinCount);
    
    audio.play();
    isPlaying = true;
    
    document.getElementById('current-track').innerText = `LOADED: TRACK_${index}`;
    
    audio.onended = () => { if (currentTrackIndex < 3) window.switchTrack(); };
}

window.switchTrack = function() {
    const oldTrack = document.getElementById(`track-${currentTrackIndex}`);
    oldTrack.pause();
    oldTrack.currentTime = 0;

    currentTrackIndex = (currentTrackIndex >= 3) ? 1 : currentTrackIndex + 1;
    
    // Theme Colors
    const colors = [0xbc00ff, 0x33ff00, 0xffcc00];
    if (particles) particles.material.color.setHex(colors[currentTrackIndex - 1]);
    
    setupAudioPipeline(currentTrackIndex);
};

function initControls() {
    document.getElementById('play-pause-btn').onclick = (e) => {
        const audio = document.getElementById(`track-${currentTrackIndex}`);
        if (audio.paused) {
            audio.play();
            isPlaying = true;
            e.target.innerText = "PAUSE";
        } else {
            audio.pause();
            isPlaying = false;
            e.target.innerText = "PLAY";
        }
    };
}

function updateLyrics(currentTime) {
    const lyricMap = [loungeLyrics, funkLyrics, goHardLyrics];
    const currentList = lyricMap[currentTrackIndex - 1];
    
    // Find the latest lyric based on time
    let active = null;
    for (let i = 0; i < currentList.length; i++) {
        if (currentTime >= currentList[i].time) {
            active = currentList[i];
        }
    }

    const el = document.getElementById('lyric-text');
    if (active && el.innerText !== active.text) {
        el.innerText = active.text;
        el.className = (currentTrackIndex === 1) ? 'lyric-neon' : 'lyric-funk';
        gsap.fromTo(el, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3 });
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    const audio = document.getElementById(`track-${currentTrackIndex}`);
    
    if (isPlaying && analyzer && dataArray) {
        analyzer.getByteFrequencyData(dataArray);
        let avg = 0;
        for (let i = 0; i < dataArray.length; i++) avg += dataArray[i];
        avg /= dataArray.length;

        // Visual Logic based on Track
        if (currentTrackIndex === 1) {
            particles.rotation.y += 0.002;
            particles.position.z = avg * 0.5;
        } else if (currentTrackIndex === 2) {
            particles.rotation.x = 1.4;
            particles.rotation.z += 0.01;
        } else if (currentTrackIndex === 3) {
            particles.rotation.x = 0;
            const positions = particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i+2] += 5 + (avg * 0.4); 
                if (positions[i+2] > 500) positions[i+2] = -500;
            }
            particles.geometry.attributes.position.needsUpdate = true;
        }

        // Progress & Lyrics
        document.getElementById('progress-fill').style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        updateLyrics(audio.currentTime);
    }
    
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});
