/**
 * EPIC TECH AI // NEURAL VAULT V3.5
 * INTERACTIVE PLAYBACK & PROGRESS TRACKING
 */

let scene, camera, renderer, particles, analyzer, dataArray;
let currentTrackIndex = 1; 
let isPlaying = false;

// LYRIC TIMING (Same as previous, omitted here for brevity but keep yours in the file)
const loungeLyrics = [ /* ... keep your lounge lyrics here ... */ ];
const funkLyrics = [ /* ... keep your funk lyrics here ... */ ];

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
        initControls(); // Initialize the new UI logic
        
        track1.onended = () => switchTrack();
    }});
};

function initControls() {
    const playBtn = document.getElementById('play-pause-btn');
    const progressWrapper = document.getElementById('progress-wrapper');
    
    // Play/Pause Toggle
    playBtn.addEventListener('click', () => {
        const audio = document.getElementById(`track-${currentTrackIndex}`);
        if (audio.paused) {
            audio.play();
            playBtn.innerText = "PAUSE";
            isPlaying = true;
        } else {
            audio.pause();
            playBtn.innerText = "PLAY";
            isPlaying = false;
        }
    });

    // Seek/Scrub Logic
    progressWrapper.addEventListener('click', (e) => {
        const audio = document.getElementById(`track-${currentTrackIndex}`);
        const rect = progressWrapper.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        audio.currentTime = pos * audio.duration;
    });
}

function switchTrack() {
    // Stop current track
    const oldTrack = document.getElementById(`track-${currentTrackIndex}`);
    oldTrack.pause();
    oldTrack.currentTime = 0;

    currentTrackIndex = 2;
    const track2 = document.getElementById('track-2');
    
    // UI Update
    document.getElementById('system-status').innerText = "STATUS: OS_FUNK_ACTIVE";
    document.getElementById('current-track').innerText = "LOADED: THE_OS_OF_FUNK";
    document.getElementById('play-pause-btn').innerText = "PAUSE";
    
    setupAudio(track2);
    track2.play();
    isPlaying = true;

    // Visual Morph
    particles.material.color.setHex(0x33ff00);
    track2.onended = () => { isPlaying = false; };
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

function updateProgress(audio) {
    const fill = document.getElementById('progress-fill');
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        fill.style.width = `${percent}%`;
    }
}

function animate() {
    if (!isPlaying) {
        // Still render the scene so it's not a black screen when paused
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
        return;
    }
    
    requestAnimationFrame(animate);
    analyzer.getByteFrequencyData(dataArray);
    
    let avg = dataArray.reduce((a,b) => a+b) / dataArray.length;
    const currentAudio = document.getElementById(`track-${currentTrackIndex}`);
    
    if (currentTrackIndex === 1) {
        particles.rotation.y += 0.001;
        particles.position.z = (avg * 0.4);
    } else {
        particles.rotation.x = 1.5; 
        particles.rotation.z += 0.008;
        particles.position.y = Math.sin(Date.now() * 0.002) * (avg * 0.5);
    }

    updateProgress(currentAudio);
    updateLyrics(currentAudio.currentTime);
    renderer.render(scene, camera);
}

// lyricUpdate function and resize listeners remain the same...
