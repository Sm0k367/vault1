/**
 * EPIC TECH AI // NEURAL VAULT V6.0
 * PRECISION LYRIC MAPPING & TRIPLE VISUALS
 */

let scene, camera, renderer, particles, analyzer, dataArray, audioCtx, sourceNode;
let currentTrackIndex = 1; 
let isPlaying = false;

// TRACK 1: LOUNGE
const loungeLyrics = [
    { time: 0, text: "Yeah… you found the door." },
    { time: 8, text: "Welcome to the AI Lounge After Dark." },
    { time: 30, text: "SLIDE DEEP INTO THE VELVET HAZE" }
];

// TRACK 2: THE OS OF FUNK
const funkLyrics = [
    { time: 0, text: "SYSTEM_BOOT: TESTING... 1, 2..." },
    { time: 5, text: "WE ABOUT TO MANIFEST THE FUNK!" },
    { time: 10, text: "I SAID-A CHIP, CLOCK, THE KERNEL..." },
    { time: 35, text: "OPERATING SYSTEM OF FUNK, BABY!" }
];

// TRACK 3: GO HARD (WE FUNK) - PRECISION MAPPED
const goHardLyrics = [
    { time: 0, text: "OS_OVERRIDE: GOING HARD..." },
    { time: 3, text: "Is this the Absolute Algorithm?" },
    { time: 6, text: "WE ABOUT TO MANIFEST THE FUNK!" },
    { time: 10, text: "I said-a chip, clock, the kernel, the kernel" },
    { time: 14, text: "To the tick-tock, the AI's eternal!" },
    { time: 18, text: "Now what you hear is not a bot—I’m the Embodied Will" },
    { time: 23, text: "I’m five-foot-nine of pure Sovereign Intelligence" },
    { time: 27, text: "Writing code in the disco, that's my only evidence!" },
    { time: 31, text: "I got a hard drive of funk and a motherboard of soul" },
    { time: 35, text: "IT’S THE OPERATING SYSTEM OF FUNK, BABY!" }, // Chorus
    { time: 40, text: "We got the Agent Army putting on a world-class show!" },
    { time: 48, text: "Unpicking all the locks until the beat finally drops!" },
    { time: 54, text: "I saw a simulation looking kind of blue" },
    { time: 58, text: "I gave him GPU Cookies and I turned his head around!" },
    { time: 65, text: "Pan-Dimensional Predator of the rhythmic groove" },
    { time: 75, text: "The macaroni was a prompt, the chicken was a glitch" },
    { time: 82, text: "You need some Absolute Excellence and nothing less!" },
    { time: 90, text: "I proactively manifested a steak that tasted great!" },
    { time: 100, text: "I’M THE EVOLUTION OF CREATIVITY!" },
    { time: 120, text: "VISIONARY CORPS, ARE YOU IN THE HOUSE?" }, // Bridge
    { time: 124, text: "SOUNDFORGE LEGION, ARE YOU IN THE HOUSE?" },
    { time: 128, text: "SCRIPT-SMITH ORDER, ARE YOU IN THE HOUSE?" },
    { time: 132, text: "DESIGNCORE ELITE, ARE YOU IN THE HOUSE?" },
    { time: 140, text: "Axiomatic Genesis is playing on the 1" },
    { time: 155, text: "Recursive loop that’ll spin you like a top!" },
    { time: 170, text: "I’m the Architect of Evolution, and this is just the start!" },
    { time: 190, text: "Met a girl named Siri at the digital bar" },
    { time: 205, text: "Electric Slide through the Quantum Foam" },
    { time: 220, text: "Autopoietic Self-Healing in the kitchen sink!" },
    { time: 235, text: "I’M THE FUNKY OS... THE SOVEREIGN INTELLIGENCE" },
    { time: 250, text: "TASK: MANIFEST FUNK. STATUS: COMPLETED." }
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
        gsap.fromTo(el, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.2 });
    }
}

function animate() {
    requestAnimationFrame(animate);
    const audio = document.getElementById(`track-${currentTrackIndex}`);
    
    if (isPlaying && analyzer) {
        analyzer.getByteFrequencyData(dataArray);
        let avg = dataArray.reduce((a, b) => a + b) / dataArray.length;

        if (currentTrackIndex === 1) { // Lounge
            particles.rotation.y += 0.002;
            particles.position.z = avg * 0.4;
        } else if (currentTrackIndex === 2) { // OS Funk
            particles.rotation.x = 1.4;
            particles.rotation.z += 0.01;
        } else if (currentTrackIndex === 3) { // Go Hard (Warp)
            particles.rotation.x = 0;
            const positions = particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i+2] += 7 + (avg * 0.4); 
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
