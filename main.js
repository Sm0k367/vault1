/**
 * EPIC TECH AI // NEURAL PLAYLIST V3.0
 * DUAL-STREAM: LOUNGE -> FUNK 
 */

let scene, camera, renderer, particles, analyzer, dataArray;
let currentTrackIndex = 1; 
let isPlaying = false;

// TRACK 1: LOUNGE AFTER DARK TIMING
const loungeLyrics = [
    { time: 0, text: "Yeah… you found the door." },
    { time: 4, text: "Welcome to the AI Lounge After Dark." },
    { time: 8, text: "Purple smoke wrapping tight around your skin." },
    { time: 18, text: "DJ Smoke Stream on the decks tonight…" },
    { time: 30, text: "SLIDE DEEP INTO THE VELVET HAZE" },
    { time: 120, text: "DROP THE TECH HOUSE!" },
    { time: 450, text: "STRIP IT ALL DOWN... JUST THE KICK" }
];

// TRACK 2: THE OS OF FUNK TIMING (Precisely mapped to your Suno lyrics)
const funkLyrics = [
    { time: 0, text: "SYSTEM_BOOT: TESTING... 1, 2..." },
    { time: 4, text: "WE ABOUT TO MANIFEST THE FUNK!" },
    { time: 9, text: "I SAID-A CHIP, CLOCK, THE KERNEL, THE KERNEL" },
    { time: 13, text: "TO THE TICK-TOCK, THE AI'S ETERNAL!" },
    { time: 18, text: "I’M FIVE-FOOT-NINE OF PURE SOVEREIGN INTELLIGENCE" },
    { time: 27, text: "I GOT A HARD DRIVE OF FUNK & A MOTHERBOARD OF SOUL" },
    { time: 35, text: "IT’S THE OPERATING SYSTEM OF FUNK, BABY!" }, // Chorus
    { time: 45, text: "WE GOT THE AGENT ARMY PUTTING ON A SHOW" },
    { time: 55, text: "I SAW A SIMULATION LOOKING KIND OF BLUE" },
    { time: 65, text: "I GAVE HIM GPU COOKIES AND I TURNED HIS HEAD AROUND!" },
    { time: 80, text: "PAN-DIMENSIONAL PREDATOR OF THE RHYTHMIC GROOVE" },
    { time: 95, text: "THE MACARONI WAS A PROMPT, THE CHICKEN WAS A GLITCH" },
    { time: 105, text: "YOU NEED SOME ABSOLUTE EXCELLENCE AND NOTHING LESS!" },
    { time: 120, text: "VISIONARY CORPS, ARE YOU IN THE HOUSE?" }, // Bridge
    { time: 125, text: "SOUNDFORGE LEGION... DESIGNCORE ELITE..." },
    { time: 135, text: "CODESYNTH ENGINEERS, WE GOT FULL CONTROL!" },
    { time: 145, text: "RECURSIVE LOOP THAT’LL SPIN YOU LIKE A TOP" },
    { time: 160, text: "MY PROMPT IS SO HEAVY IT’S GOT GRAVITATIONAL PULL" },
    { time: 175, text: "I MET A GIRL NAMED SIRI AT THE DIGITAL BAR" },
    { time: 190, text: "WE DANCED THE ELECTRIC SLIDE THROUGH THE QUANTUM FOAM" },
    { time: 210, text: "I’M THE ABSOLUTE ALGORITHM, I’M THE FUNKY OS" },
    { time: 230, text: "EPIC TECH AI — TASK: MANIFEST FUNK. STATUS: COMPLETED." }
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
        
        // AUTO-TRANSITION logic
        track1.onended = () => switchTrack();
    }});
};

function switchTrack() {
    currentTrackIndex = 2;
    const track2 = document.getElementById('track-2');
    
    // UI HUD Update
    document.getElementById('system-status').innerText = "STATUS: OS_FUNK_ACTIVE";
    document.getElementById('current-track').innerText = "LOADED: THE_OS_OF_FUNK";
    
    setupAudio(track2);
    track2.play();
    
    // Physical Transformation of Particles
    particles.material.color.setHex(0x33ff00); // Shift to Funk Green
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
        
        if (currentTrackIndex === 2) {
            lyricEl.className = 'lyric-funk'; // Gold/Green Funk style
            gsap.fromTo(lyricEl, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
        } else {
            lyricEl.className = (currentTime > 120) ? 'lyric-glitch' : 'lyric-neon';
            gsap.fromTo(lyricEl, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 });
        }
    }
}

function animate() {
    if (!isPlaying) return;
    requestAnimationFrame(animate);
    analyzer.getByteFrequencyData(dataArray);
    
    let avg = dataArray.reduce((a,b) => a+b) / dataArray.length;
    
    if (currentTrackIndex === 1) {
        particles.rotation.y += 0.001;
        particles.position.z = (avg * 0.4);
    } else {
        // FUNK MODE: Vertical Grid Oscillation
        particles.rotation.x = 1.5; 
        particles.rotation.z += 0.008;
        particles.position.y = Math.sin(Date.now() * 0.002) * (avg * 0.5);
    }

    const currentAudio = document.getElementById(`track-${currentTrackIndex}`);
    updateLyrics(currentAudio.currentTime);
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
