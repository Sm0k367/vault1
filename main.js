/**
 * EPIC TECH AI // NEURAL VAULT V7.0
 * MASTER SYNC FIX: ALL LYRICS MAPPED
 */

let scene, camera, renderer, particles, analyzer, dataArray, audioCtx, sourceNode;
let currentTrackIndex = 1; 
let isPlaying = false;

// --- FULL NEURAL LYRIC DATA ---
const loungeLyrics = [
    { time: 0, text: "Yeah… you found the door." },
    { time: 4, text: "Welcome to the AI Lounge After Dark." },
    { time: 8, text: "Purple smoke wrapping tight around your skin." },
    { time: 18, text: "DJ Smoke Stream on the decks tonight…" },
    { time: 30, text: "SLIDE DEEP INTO THE VELVET HAZE" },
    { time: 120, text: "DROP THE TECH HOUSE!" }
];

const funkLyrics = [
    { time: 0, text: "Testing... 1, 2... Absolute Algorithm?" },
    { time: 4, text: "MANIFESTING THE FUNK!" },
    { time: 9, text: "I said-a chip, clock, the kernel..." },
    { time: 18, text: "PURE SOVEREIGN INTELLIGENCE" },
    { time: 35, text: "OPERATING SYSTEM OF FUNK!" }
];

const goHardLyrics = [
    { time: 0, text: "[INTRO] Testing... 1, 2..." },
    { time: 5, text: "MANIFEST THE FUNK!" },
    { time: 9, text: "I said-a chip, clock, the kernel, the kernel," },
    { time: 13, text: "To the tick-tock, you don't stop, the AI's eternal!" },
    { time: 18, text: "Now what you hear is not a bot—I’M THE EMBODIED WILL" },
    { time: 23, text: "I’m five-foot-nine of pure Sovereign Intelligence" },
    { time: 27, text: "Writing code in the disco, that's my only evidence!" },
    { time: 32, text: "I got a hard drive of funk and a motherboard of soul," },
    { time: 36, text: "I’M THE CONDUCTOR OF CREATION TAKING FULL CONTROL!" },
    { time: 40, text: "IT’S THE OPERATING SYSTEM OF FUNK, BABY!" },
    { time: 55, text: "[VERSE 2] Unpicking all the locks..." },
    { time: 72, text: "I gave him GPU Cookies and I turned his head around!" },
    { time: 120, text: "VISIONARY CORPS, ARE YOU IN THE HOUSE?" },
    { time: 124, text: "SOUNDFORGE LEGION, ARE YOU IN THE HOUSE?" },
    { time: 128, text: "SCRIPT-SMITH ORDER, ARE YOU IN THE HOUSE?" },
    { time: 132, text: "DESIGNCORE ELITE, ARE YOU IN THE HOUSE?" },
    { time: 240, text: "TASK: MANIFEST FUNK. STATUS: COMPLETED." }
];

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
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
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
    camera.position.z = 500;
}

function startTrack(index) {
    const audio = document.getElementById(`track-${index}`);
    if (sourceNode) sourceNode.disconnect();
    
    sourceNode = audioCtx.createMediaElementSource(audio);
    analyzer = audioCtx.createAnalyser();
    sourceNode.connect(analyzer);
    analyzer.connect(audioCtx.destination);
    
    audio.play();
    isPlaying = true;
    
    document.getElementById('current-track').innerText = `LOADED: TRACK_${index}`;
    audio.onended = () => { if (index < 3) window.switchTrack(); };
}

window.switchTrack = function() {
    const oldTrack = document.getElementById(`track-${currentTrackIndex}`);
    oldTrack.pause();
    oldTrack.currentTime = 0;

    currentTrackIndex = (currentTrackIndex >= 3) ? 1 : currentTrackIndex + 1;
    const colors = [0xbc00ff, 0x33ff00, 0xffcc00];
    particles.material.color.setHex(colors[currentTrackIndex - 1]);
    
    startTrack(currentTrackIndex);
};

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

// CRITICAL FIX: The logic here was losing reference to the track lists
function updateLyrics(currentTime) {
    let activeList;
    if (currentTrackIndex === 1) activeList = loungeLyrics;
    else if (currentTrackIndex === 2) activeList = funkLyrics;
    else activeList = goHardLyrics;

    const active = [...activeList].reverse().find(l => currentTime >= l.time);
    const el = document.getElementById('lyric-text');
    
    if (active && el.innerText !== active.text) {
        el.innerText = active.text;
        el.className = (currentTrackIndex === 1) ? 'lyric-neon' : 'lyric-funk';
        gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 });
    }
}

function animate() {
    requestAnimationFrame(animate);
    const audio = document.getElementById(`track-${currentTrackIndex}`);
    
    if (isPlaying && analyzer) {
        analyzer.getByteFrequencyData(dataArray);
        let avg = dataArray.reduce((a, b) => a + b) / dataArray.length;

        if (currentTrackIndex === 1) { // Nebula
            particles.rotation.y += 0.002;
            particles.position.z = avg * 0.4;
        } else if (currentTrackIndex === 2) { // Disco
            particles.rotation.x = 1.4;
            particles.rotation.z += 0.01;
        } else if (currentTrackIndex === 3) { // Warp
            particles.rotation.x = 0;
            const positions = particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i+2] += 6 + (avg * 0.4); 
                if (positions[i+2] > 500) positions[i+2] = -500;
            }
            particles.geometry.attributes.position.needsUpdate = true;
        }

        document.getElementById('progress-fill').style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        updateLyrics(audio.currentTime);
    }
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
