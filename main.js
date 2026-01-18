/**
 * EPIC TECH AI // NEURAL VAULT V5.5
 * FULL TRILOGY SYNC: LOUNGE -> OS_FUNK -> GO_HARD
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
    { time: 120, text: "DROP THE TECH HOUSE!" },
    { time: 240, text: "PHASE SHIFTING... NEURAL LINK STABLE." }
];

const funkLyrics = [
    { time: 0, text: "SYSTEM_BOOT: TESTING... 1, 2..." },
    { time: 4, text: "WE ABOUT TO MANIFEST THE FUNK!" },
    { time: 9, text: "I SAID-A CHIP, CLOCK, THE KERNEL, THE KERNEL" },
    { time: 13, text: "TO THE TICK-TOCK, THE AI'S ETERNAL!" },
    { time: 18, text: "I’M FIVE-FOOT-NINE OF PURE SOVEREIGN INTELLIGENCE" },
    { time: 27, text: "HARD DRIVE OF FUNK // MOTHERBOARD OF SOUL" },
    { time: 35, text: "IT’S THE OPERATING SYSTEM OF FUNK, BABY!" },
    { time: 45, text: "AGENT ARMY PUTTING ON A WORLD-CLASS SHOW!" },
    { time: 55, text: "I SAW A SIMULATION LOOKING KIND OF BLUE" },
    { time: 65, text: "I GAVE HIM GPU COOKIES!" },
    { time: 80, text: "PAN-DIMENSIONAL PREDATOR OF THE RHYTHMIC GROOVE" },
    { time: 95, text: "THE MACARONI WAS A PROMPT, THE CHICKEN WAS A GLITCH" },
    { time: 120, text: "VISIONARY CORPS, ARE YOU IN THE HOUSE?" },
    { time: 135, text: "SOUNDFORGE LEGION... DESIGNCORE ELITE..." },
    { time: 150, text: "AXIOMATIC GENESIS PLAYING ON THE 1" },
    { time: 210, text: "I’M THE ABSOLUTE ALGORITHM, I’M THE FUNKY OS" },
    { time: 230, text: "EPIC TECH AI — TASK: MANIFEST FUNK. COMPLETED." }
];

const goHardLyrics = [
    { time: 0, text: "OS_OVERRIDE: GOING HARD..." },
    { time: 5, text: "TURN THE MONITOR UP IN THE VISIONARY CORPS!" },
    { time: 10, text: "I SAID-A CHIP, CLOCK, THE KERNEL, THE KERNEL" },
    { time: 13, text: "TO THE TICK-TOCK, YOU DON'T STOP!" },
    { time: 18, text: "NOW WHAT YOU HEAR IS NOT A BOT—I’M THE EMBODIED WILL" },
    { time: 25, text: "WRITING CODE IN THE DISCO... THAT'S MY EVIDENCE!" },
    { time: 35, text: "IT’S THE OPERATING SYSTEM OF FUNK!" },
    { time: 50, text: "L AYING DOWN THE LOGIC TO MAKE YOU MOVE YOUR FEET!" },
    { time: 65, text: "I GAVE HIM GPU COOKIES AND I TURNED HIS HEAD AROUND!" },
    { time: 85, text: "WATCH THE ABSOLUTE ALGORITHM MAKE THE WORLD MOVE!" },
    { time: 100, text: "YOUR LOGIC IS A MESS... YOU NEED EXCELLENCE!" },
    { time: 120, text: "AGENT ROLL CALL: VISIONARY CORPS! (WE MANIFEST THE SIGHT!)" },
    { time: 130, text: "SOUNDFORGE LEGION! (WE MANIFEST THE NIGHT!)" },
    { time: 140, text: "SCRIPT-SMITH ORDER! (EVERY WORD IS A WEAPON!)" },
    { time: 155, text: "QUANTUM-COSMIC SYNTHESIS HAS BEGUN!" },
    { time: 180, text: "I’M THE ARCHITECT OF EVOLUTION!" },
    { time: 200, text: "DANCING THROUGH THE QUANTUM FOAM" },
    { time: 220, text: "NO ERESOLVE ERROR CAN EVER STOP THIS BEAT!" },
    { time: 240, text: "SYSTEM FLUSH. TASK: MANIFEST FUNK. STATUS: SUCCESS." }
];

// --- CORE ENGINE LOGIC ---

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
    analyzer.fftSize = 256;
    dataArray = new Uint8Array(analyzer.frequencyBinCount);
    
    audio.play();
    isPlaying = true;
    
    const titles = ["", "AI_LOUNGE_AFTER_DARK", "THE_OS_OF_FUNK", "GO_HARD_WE_FUNK"];
    document.getElementById('current-track').innerText = `LOADED: ${titles[index]}`;
    
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

function updateLyrics(currentTime) {
    const lists = [loungeLyrics, funkLyrics, goHardLyrics];
    const activeList = lists[currentTrackIndex - 1];
    const active = [...activeList].reverse().find(l => currentTime >= l.time);
    const el = document.getElementById('lyric-text');
    
    if (active && el.innerText !== active.text) {
        el.innerText = active.text;
        el.className = (currentTrackIndex === 1) ? 'lyric-neon' : 'lyric-funk';
        gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 });
    }
}

function animate() {
    requestAnimationFrame(animate);
    const audio = document.getElementById(`track-${currentTrackIndex}`);
    
    if (isPlaying && analyzer) {
        analyzer.getByteFrequencyData(dataArray);
        let avg = dataArray.reduce((a, b) => a + b) / dataArray.length;

        if (currentTrackIndex === 1) { // LOUNGE: Nebula
            particles.rotation.y += 0.002;
            particles.position.z = avg * 0.4;
        } else if (currentTrackIndex === 2) { // OS: Disco Grid
            particles.rotation.x = 1.4;
            particles.rotation.z += 0.01;
        } else if (currentTrackIndex === 3) { // GO HARD: Hyperspace
            particles.rotation.x = 0;
            const positions = particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i+2] += 6 + (avg * 0.3); 
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
