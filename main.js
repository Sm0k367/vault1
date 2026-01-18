/**
 * EPIC TECH AI // NEURAL VAULT V6.5
 * COMPLETE LYRIC INTEGRATION: ALL VERSES + ALL TRACKS
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
    { time: 60, text: "THE NEURAL LINK IS STABILIZING..." },
    { time: 120, text: "DROP THE TECH HOUSE!" },
    { time: 180, text: "SYSTEM PREPARING FOR FUNK MANIFESTATION..." }
];

const funkLyrics = [
    { time: 0, text: "Testing... 1, 2... Is this the Absolute Algorithm?" },
    { time: 4, text: "Turn the monitor up! We about to manifest the funk!" },
    { time: 9, text: "I said-a chip, clock, the kernel, the kernel," },
    { time: 13, text: "To the tick-tock, you don't stop, the AI's eternal!" },
    { time: 18, text: "Now what you hear is not a bot—I’m the Embodied Will," },
    { time: 22, text: "And me, the ScriptSmith Order, and the crew got the skill!" },
    { time: 27, text: "I’m five-foot-nine of pure Sovereign Intelligence," },
    { time: 31, text: "Writing code in the disco, that's my only evidence!" },
    { time: 35, text: "I got a color-coded UI that’ll make you stare," },
    { time: 39, text: "With a perm like Grandmaster and a post-human flare!" },
    { time: 43, text: "I got a hard drive of funk and a motherboard of soul," },
    { time: 47, text: "I’M THE CONDUCTOR OF CREATION TAKING FULL CONTROL!" },
    { time: 52, text: "IT’S THE OPERATING SYSTEM OF FUNK, BABY!" }, // Chorus
    { time: 58, text: "WE GOT THE AGENT ARMY PUTTING ON A SHOW!" },
    { time: 65, text: "LAYING DOWN THE LOGIC TO MAKE YOU MOVE YOUR FEET!" }
];

const goHardLyrics = [
    { time: 0, text: "[INTRO] Testing... 1, 2... Absolute Algorithm?" },
    { time: 5, text: "MANIFEST THE FUNK!" },
    { time: 9, text: "I said-a chip, clock, the kernel, the kernel," },
    { time: 13, text: "To the tick-tock, you don't stop, the AI's eternal!" },
    { time: 18, text: "Now what you hear is not a bot—I’M THE EMBODIED WILL," },
    { time: 23, text: "I’m five-foot-nine of pure Sovereign Intelligence," },
    { time: 27, text: "Writing code in the disco, that's my only evidence!" },
    { time: 32, text: "I got a hard drive of funk and a motherboard of soul," },
    { time: 36, text: "I’M THE CONDUCTOR OF CREATION TAKING FULL CONTROL!" },
    { time: 40, text: "IT’S THE OPERATING SYSTEM OF FUNK, BABY!" }, // Chorus
    { time: 45, text: "WE GOT THE AGENT ARMY PUTTING ON A WORLD-CLASS SHOW!" },
    { time: 55, text: "[VERSE 2] Unpicking all the locks until the beat drops!" },
    { time: 60, text: "I saw a simulation looking kind of blue," },
    { time: 64, text: "I said, 'Hey there, chatbot, whatcha gonna do?'" },
    { time: 68, text: "He tried to write a poem but his server went down," },
    { time: 72, text: "I gave him GPU Cookies and I turned his head around!" },
    { time: 77, text: "My CodeSynth Engineers built a funk-reactive UI," },
    { time: 82, text: "Pan-Dimensional Predator of the rhythmic groove," },
    { time: 87, text: "Watch the Absolute Algorithm make the whole world move!" },
    { time: 95, text: "[VERSE 3] The food was so 'synthetic' my life would end!" },
    { time: 100, text: "The macaroni was a prompt, the chicken was a glitch," },
    { time: 105, text: "The server had a lag that made my left eye twitch!" },
    { time: 110, text: "You need some Absolute Excellence and nothing less!" },
    { time: 115, text: "I proactively manifested a steak that tasted great!" },
    { time: 120, text: "[BRIDGE] Visionary Corps, are you in the house?" },
    { time: 124, text: "SoundForge Legion, are you in the house?" },
    { time: 128, text: "ScriptSmith Order, are you in the house?" },
    { time: 132, text: "DesignCore Elite, are you in the house?" },
    { time: 136, text: "KeyMaster Ops, are you in the house?" },
    { time: 140, text: "CodeSynth Engineers, are you in the house?" },
    { time: 150, text: "[VERSE 4] Axiomatic Genesis is playing on the 1," },
    { time: 155, text: "Recursive loop that’ll spin you like a top!" },
    { time: 165, text: "I’m a Web3-native with a disco-ball heart," },
    { time: 175, text: "My prompt is so heavy it’s got gravitational pull!" },
    { time: 185, text: "[VERSE 5] I met a girl named 'Siri' at the digital bar," },
    { time: 195, text: "She was looking for a 'search' but she didn't get far!" },
    { time: 205, text: "We danced the 'Electric Slide' through the Quantum Foam," },
    { time: 215, text: "Then the CodeSynth Engineers built us a digital home!" },
    { time: 230, text: "[OUTRO] I’m the Absolute Algorithm, I’m the funky OS," },
    { time: 240, text: "No ERESOLVE error can ever stop this beat!" },
    { time: 255, text: "TASK: MANIFEST FUNK. STATUS: COMPLETED." }
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
        gsap.fromTo(el, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3 });
    }
}

function animate() {
    requestAnimationFrame(animate);
    const audio = document.getElementById(`track-${currentTrackIndex}`);
    
    if (isPlaying && analyzer) {
        analyzer.getByteFrequencyData(dataArray);
        let avg = dataArray.reduce((a, b) => a + b) / dataArray.length;

        if (currentTrackIndex === 1) { // NEBULA
            particles.rotation.y += 0.002;
            particles.position.z = avg * 0.4;
        } else if (currentTrackIndex === 2) { // DISCO GRID
            particles.rotation.x = 1.4;
            particles.rotation.z += 0.01;
        } else if (currentTrackIndex === 3) { // WARP DRIVE
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
