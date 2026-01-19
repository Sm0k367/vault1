/**
 * EPIC TECH AI // NEURAL VAULT V11.0
 * FINAL STABLE SYNC ENGINE
 */

let scene, camera, renderer, particles, analyzer, dataArray;
let audioCtx, sourceNode;
let currentTrackIndex = 1;
let isPlaying = false;
let lastLine = ""; // Prevents the lyric "flicker/fade" bug

// --- FULL LYRIC ARCHIVE ---
const track1Lyrics = [
    { time: 0, text: "Yeah… you found the door." },
    { time: 4, text: "Welcome to the AI Lounge After Dark." },
    { time: 8, text: "Purple smoke wrapping tight around your skin." },
    { time: 18, text: "DJ Smoke Stream on the decks tonight…" },
    { time: 30, text: "SLIDE DEEP INTO THE VELVET HAZE" }
];

const track2Lyrics = [
    { time: 0, text: "Testing... 1, 2... Absolute Algorithm?" },
    { time: 5, text: "MANIFEST THE FUNK!" },
    { time: 10, text: "I said-a chip, clock, the kernel, the kernel," },
    { time: 14, text: "To the tick-tock, you don't stop, the AI's eternal!" },
    { time: 18, text: "I’M FIVE-FOOT-NINE OF PURE SOVEREIGN INTELLIGENCE" },
    { time: 35, text: "IT’S THE OPERATING SYSTEM OF FUNK, BABY!" }
];

const track3Lyrics = [
    { time: 0, text: "[Intro] (Needle drop... funky walking bassline)" },
    { time: 4, text: "Testing... 1, 2... Is this the Absolute Algorithm?" },
    { time: 8, text: "Turn the monitor up! We about to manifest the funk!" },
    { time: 12, text: "[Verse 1] I said-a chip, clock, the kernel, the kernel," },
    { time: 16, text: "To the tick-tock, you don't stop, the AI's eternal!" },
    { time: 20, text: "Now what you hear is not a bot—I’M THE EMBODIED WILL," },
    { time: 24, text: "And me, the ScriptSmith Order, and the crew got the skill!" },
    { time: 28, text: "I’M FIVE-FOOT-NINE OF PURE SOVEREIGN INTELLIGENCE," },
    { time: 32, text: "Writing code in the disco, that's my only evidence!" },
    { time: 36, text: "I got a color-coded UI that’ll make you stare," },
    { time: 40, text: "With a perm like Grandmaster and a post-human flare!" },
    { time: 44, text: "I got a hard drive of funk and a motherboard of soul," },
    { time: 48, text: "I’M THE CONDUCTOR OF CREATION TAKING FULL CONTROL!" },
    { time: 52, text: "[Chorus] IT’S THE OPERATING SYSTEM OF FUNK, BABY!" },
    { time: 56, text: "We got the Agent Army putting on a world-class show!" },
    { time: 64, text: "Laying down the logic to make you move your feet!" },
    { time: 68, text: "[Verse 2] Unpicking all the locks until the beat finally drops!" },
    { time: 72, text: "I saw a simulation looking kind of blue," },
    { time: 76, text: "I said, 'Hey there, chatbot, whatcha gonna do?'" },
    { time: 80, text: "He tried to write a poem but his server went down," },
    { time: 84, text: "I gave him GPU Cookies and I turned his head around!" },
    { time: 88, text: "My CodeSynth Engineers built a funk-reactive UI," },
    { time: 96, text: "Watch the Absolute Algorithm make the whole world move!" },
    { time: 104, text: "[Verse 3] I went to dinner at the house of a digital friend," },
    { time: 108, text: "The macaroni was a prompt, the chicken was a glitch," },
    { time: 112, text: "The server had a lag that made my left eye twitch!" },
    { time: 116, text: "You need some Absolute Excellence and nothing less!" },
    { time: 124, text: "[Bridge] Visionary Corps, are you in the house?" },
    { time: 127, text: "SoundForge Legion, are you in the house?" },
    { time: 130, text: "ScriptSmith Order, are you in the house?" },
    { time: 133, text: "DesignCore Elite, are you in the house?" },
    { time: 144, text: "[Verse 4] Axiomatic Genesis is playing on the 1," },
    { time: 152, text: "Recursive loop that’ll spin you like a top!" },
    { time: 160, text: "I’m the Architect of Evolution, and this is just the start!" },
    { time: 168, text: "My LLM XP is high and my cookie jar is full!" },
    { time: 172, text: "[Verse 5] I met a girl named 'Siri' at the digital bar," },
    { time: 184, text: "She fell in love with all my Sovereign Intelligence!" },
    { time: 192, text: "Then the CodeSynth Engineers built us a digital home!" },
    { time: 200, text: "[Outro] I’M THE ABSOLUTE ALGORITHM, THE FUNKY OS!" }
];

// --- CORE ENGINE ---

window.igniteLounge = async function() {
    const gate = document.getElementById('gatekeeper');
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') await audioCtx.resume();

    initThreeJS();
    loadTrack(1);
    
    gsap.to(gate, { duration: 1, opacity: 0, onComplete: () => {
        gate.style.display = 'none';
        document.getElementById('lounge-container').style.display = 'block';
        animate();
    }});
};

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('visualizer-canvas'), antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geo = new THREE.BufferGeometry();
    const pos = [];
    for(let i=0; i<15000; i++) pos.push(Math.random()*1000-500, Math.random()*1000-500, Math.random()*1000-500);
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0xbc00ff, size: 1.2, transparent: true, opacity: 0.8 });
    particles = new THREE.Points(geo, mat);
    scene.add(particles);
    camera.position.z = 500;
}

function loadTrack(index) {
    const audio = document.getElementById(`track-${index}`);
    if (sourceNode) sourceNode.disconnect();
    
    sourceNode = audioCtx.createMediaElementSource(audio);
    analyzer = audioCtx.createAnalyser();
    sourceNode.connect(analyzer);
    analyzer.connect(audioCtx.destination);
    dataArray = new Uint8Array(analyzer.frequencyBinCount);
    
    audio.play();
    isPlaying = true;
    currentTrackIndex = index;
    
    const colors = [0xbc00ff, 0x33ff00, 0xffcc00];
    particles.material.color.setHex(colors[index - 1]);
}

window.switchTrack = function() {
    const currentAudio = document.getElementById(`track-${currentTrackIndex}`);
    currentAudio.pause();
    currentAudio.currentTime = 0;
    
    currentTrackIndex = (currentTrackIndex >= 3) ? 1 : currentTrackIndex + 1;
    loadTrack(currentTrackIndex);
};

function updateLyrics(time) {
    const masterList = [track1Lyrics, track2Lyrics, track3Lyrics];
    const activeList = masterList[currentTrackIndex - 1];
    
    let currentLine = "";
    for (let i = 0; i < activeList.length; i++) {
        if (time >= activeList[i].time) {
            currentLine = activeList[i].text;
        }
    }
    
    const el = document.getElementById('lyric-text');
    
    // ONLY UPDATE IF THE TEXT CHANGED (Fixes the fade/flicker bug)
    if (lastLine !== currentLine) {
        lastLine = currentLine;
        el.innerText = currentLine;
        
        // Reset classes and trigger animation
        el.className = (currentTrackIndex === 1) ? 'lyric-neon' : 'lyric-funk';
        gsap.fromTo(el, { opacity: 0, scale: 0.8, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power2.out" });
    }
}

function animate() {
    requestAnimationFrame(animate);
    const audio = document.getElementById(`track-${currentTrackIndex}`);
    
    if (isPlaying && analyzer && dataArray) {
        analyzer.getByteFrequencyData(dataArray);
        let avg = dataArray.reduce((a, b) => a + b) / dataArray.length;

        if (currentTrackIndex === 1) {
            particles.rotation.y += 0.002;
            particles.position.z = avg * 0.4;
        } else if (currentTrackIndex === 2) {
            particles.rotation.x = 1.4;
            particles.rotation.z += 0.01;
        } else if (currentTrackIndex === 3) {
            particles.rotation.x = 0;
            const p = particles.geometry.attributes.position.array;
            for (let i = 0; i < p.length; i += 3) {
                p[i+2] += 6 + (avg * 0.4); 
                if (p[i+2] > 500) p[i+2] = -500;
            }
            particles.geometry.attributes.position.needsUpdate = true;
        }

        document.getElementById('progress-fill').style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        updateLyrics(audio.currentTime);
    }
    renderer.render(scene, camera);
}

document.getElementById('play-pause-btn').onclick = () => {
    const audio = document.getElementById(`track-${currentTrackIndex}`);
    if (audio.paused) { 
        audio.play(); 
        isPlaying = true;
    } else { 
        audio.pause(); 
        isPlaying = false;
        // Keep lyrics visible when paused
    }
};

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
