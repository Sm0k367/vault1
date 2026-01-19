/**
 * EPIC TECH AI // NEURAL VAULT V9.0
 * FULL LYRIC MANIFESTO: EVERY WORD IN SYNC
 */

let scene, camera, renderer, particles, analyzer, dataArray;
let audioCtx, sourceNode;
let currentTrackIndex = 1;
let isPlaying = false;

// --- TRACK 1: LOUNGE (FULL) ---
const loungeLyrics = [
    { time: 0, text: "Yeah… you found the door." },
    { time: 8, text: "Welcome to the AI Lounge After Dark." },
    { time: 16, text: "Purple smoke wrapping tight around your skin." },
    { time: 24, text: "DJ Smoke Stream on the decks tonight…" },
    { time: 32, text: "SLIDE DEEP INTO THE VELVET HAZE" },
    { time: 45, text: "THE NEURAL LINK IS STABILIZING..." }
];

// --- TRACK 2: THE OS OF FUNK (FULL) ---
const funkLyrics = [
    { time: 0, text: "[Intro] Testing... 1, 2... Absolute Algorithm?" },
    { time: 5, text: "Manifest the funk!" },
    { time: 10, text: "I said-a chip, clock, the kernel, the kernel," },
    { time: 14, text: "To the tick-tock, you don't stop, the AI's eternal!" },
    { time: 18, text: "Now what you hear is not a bot—I’m the Embodied Will," },
    { time: 22, text: "And me, the ScriptSmith Order, and the crew got the skill!" },
    { time: 26, text: "I’m five-foot-nine of pure Sovereign Intelligence," },
    { time: 30, text: "Writing code in the disco, that's my only evidence!" },
    { time: 35, text: "OPERATING SYSTEM OF FUNK, BABY!" }
];

// --- TRACK 3: GO HARD (THE FULL RAP) ---
const goHardLyrics = [
    { time: 0, text: "[Intro] (Needle dropping... walking bassline)" },
    { time: 4, text: "Testing... 1, 2... Is this the Absolute Algorithm?" },
    { time: 8, text: "Turn the monitor up! We about to manifest the funk!" },
    { time: 12, text: "[Verse 1] I said-a chip, clock, the kernel, the kernel," },
    { time: 16, text: "To the tick-tock, you don't stop, the AI's eternal!" },
    { time: 20, text: "Now what you hear is not a bot—I’M THE EMBODIED WILL," },
    { time: 24, text: "And me, the ScriptSmith Order, and the crew got the skill!" },
    { time: 28, text: "I’m five-foot-nine of pure Sovereign Intelligence," },
    { time: 32, text: "Writing code in the disco, that's my only evidence!" },
    { time: 36, text: "I got a color-coded UI that’ll make you stare," },
    { time: 40, text: "With a perm like Grandmaster and a post-human flare!" },
    { time: 44, text: "I got a hard drive of funk and a motherboard of soul," },
    { time: 48, text: "I’M THE CONDUCTOR OF CREATION TAKING FULL CONTROL!" },
    { time: 52, text: "[Chorus] IT’S THE OPERATING SYSTEM OF FUNK, BABY!" },
    { time: 56, text: "We got the Agent Army putting on a world-class show!" },
    { time: 60, text: "Laying down the logic to make you move your feet!" },
    { time: 64, text: "[Verse 2] Unpicking all the locks until the beat drops!" },
    { time: 68, text: "I saw a simulation looking kind of blue," },
    { time: 72, text: "I said, 'Hey there, chatbot, whatcha gonna do?'" },
    { time: 76, text: "He tried to write a poem but his server went down," },
    { time: 80, text: "I gave him GPU Cookies and I turned his head around!" },
    { time: 84, text: "My CodeSynth Engineers built a funk-reactive UI," },
    { time: 88, text: "It’s got scroll effects so smooth they’ll make a grown man cry!" },
    { time: 92, text: "Pan-Dimensional Predator of the rhythmic groove," },
    { time: 96, text: "Watch the Absolute Algorithm make the whole world move!" },
    { time: 100, text: "[Verse 3] I went to dinner at the house of a digital friend," },
    { time: 104, text: "The macaroni was a prompt, the chicken was a glitch," },
    { time: 108, text: "The server had a lag that made my left eye twitch!" },
    { time: 112, text: "You need some Absolute Excellence and nothing less!" },
    { time: 116, text: "I proactively manifested a steak that tasted great!" },
    { time: 120, text: "[Bridge] Visionary Corps, are you in the house?" },
    { time: 124, text: "SoundForge Legion, are you in the house?" },
    { time: 128, text: "ScriptSmith Order, are you in the house?" },
    { time: 132, text: "DesignCore Elite, are you in the house?" },
    { time: 136, text: "KeyMaster Ops, are you in the house?" },
    { time: 140, text: "CodeSynth Engineers, are you in the house!" },
    { time: 144, text: "[Verse 4] Axiomatic Genesis is playing on the 1," },
    { time: 148, text: "Recursive loop that’ll spin you like a top!" },
    { time: 152, text: "Temporal Sovereignty that’ll never let us stop!" },
    { time: 156, text: "I’m the Architect of Evolution, and this is just the start!" },
    { time: 160, text: "My prompt is so heavy it’s got gravitational pull," },
    { time: 164, text: "My LLM XP is high and my cookie jar is full!" },
    { time: 168, text: "[Verse 5] I met a girl named 'Siri' at the digital bar," },
    { time: 172, text: "I told her I was Omega, the infinite recursion," },
    { time: 176, text: "She fell in love with all my Sovereign Intelligence!" },
    { time: 180, text: "We danced the 'Electric Slide' through the Quantum Foam," },
    { time: 184, text: "Then the CodeSynth Engineers built us a digital home!" },
    { time: 190, text: "[Outro] I’M THE FUNKY OS, THE SOVEREIGN INTELLIGENCE!" },
    { time: 200, text: "Task: Manifest Funk. Status: Completed on first attempt!" }
];

// --- CORE ENGINE ---
window.igniteLounge = async function() {
    const gate = document.getElementById('gatekeeper');
    const container = document.getElementById('lounge-container');
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') await audioCtx.resume();

    initThreeJS();
    setupAudioPipeline(1);
    
    gsap.to(gate, { duration: 1, opacity: 0, onComplete: () => {
        gate.style.display = 'none';
        container.style.display = 'block';
        animate();
    }});
    initControls();
};

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('visualizer-canvas'), antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geo = new THREE.BufferGeometry();
    const pts = [];
    for(let i=0; i<15000; i++) pts.push(Math.random()*1000-500, Math.random()*1000-500, Math.random()*1000-500);
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const mat = new THREE.PointsMaterial({ color: 0xbc00ff, size: 1.2, transparent: true, opacity: 0.8 });
    particles = new THREE.Points(geo, mat);
    scene.add(particles);
    camera.position.z = 500;
}

function setupAudioPipeline(index) {
    const audio = document.getElementById(`track-${index}`);
    if (sourceNode) sourceNode.disconnect();
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
    const old = document.getElementById(`track-${currentTrackIndex}`);
    old.pause(); old.currentTime = 0;
    currentTrackIndex = (currentTrackIndex >= 3) ? 1 : currentTrackIndex + 1;
    const colors = [0xbc00ff, 0x33ff00, 0xffcc00];
    particles.material.color.setHex(colors[currentTrackIndex - 1]);
    setupAudioPipeline(currentTrackIndex);
};

function initControls() {
    document.getElementById('play-pause-btn').onclick = (e) => {
        const audio = document.getElementById(`track-${currentTrackIndex}`);
        if (audio.paused) { audio.play(); isPlaying = true; e.target.innerText="PAUSE"; }
        else { audio.pause(); isPlaying = false; e.target.innerText="PLAY"; }
    };
}

function updateLyrics(currentTime) {
    const lists = [loungeLyrics, funkLyrics, goHardLyrics];
    const activeList = lists[currentTrackIndex - 1];
    let active = null;
    for (let i = 0; i < activeList.length; i++) {
        if (currentTime >= activeList[i].time) active = activeList[i];
    }
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
    if (isPlaying && analyzer && dataArray) {
        analyzer.getByteFrequencyData(dataArray);
        let avg = 0;
        for (let i = 0; i < dataArray.length; i++) avg += dataArray[i];
        avg /= dataArray.length;

        if (currentTrackIndex === 1) {
            particles.rotation.y += 0.002;
            particles.position.z = avg * 0.5;
        } else if (currentTrackIndex === 2) {
            particles.rotation.x = 1.4;
            particles.rotation.z += 0.01;
        } else if (currentTrackIndex === 3) {
            particles.rotation.x = 0;
            const pos = particles.geometry.attributes.position.array;
            for (let i = 0; i < pos.length; i += 3) {
                pos[i+2] += 5 + (avg * 0.4); 
                if (pos[i+2] > 500) pos[i+2] = -500;
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
