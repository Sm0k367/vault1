/**
 * EPIC TECH AI // NEURAL VAULT V13.0
 * THE "FORCED-SYNC" ENGINE - NO MORE MISMATCHES
 */

let scene, camera, renderer, particles, analyzer, dataArray;
let audioCtx, sourceNode;
let currentTrackIndex = 1;
let isPlaying = false;
let lastLine = ""; 

// --- THE MANIFESTO ---
const LYRIC_DATABASE = {
    "track-1": [
        { time: 0, text: "Yeah… you found the door." },
        { time: 4, text: "Welcome to the AI Lounge After Dark." },
        { time: 8, text: "Purple smoke wrapping tight around your skin." },
        { time: 30, text: "SLIDE DEEP INTO THE VELVET HAZE" }
    ],
    "track-2": [
        { time: 0, text: "Testing... 1, 2... Absolute Algorithm?" },
        { time: 5, text: "MANIFEST THE FUNK!" },
        { time: 10, text: "I said-a chip, clock, the kernel, the kernel," },
        { time: 18, text: "I’M FIVE-FOOT-NINE OF PURE SOVEREIGN INTELLIGENCE" },
        { time: 35, text: "IT’S THE OPERATING SYSTEM OF FUNK, BABY!" }
    ],
    "track-3": [
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
        { time: 44, text: "I got a hard drive of funk and a motherboard of soul," },
        { time: 52, text: "[Chorus] IT’S THE OPERATING SYSTEM OF FUNK, BABY!" },
        { time: 124, text: "[Bridge] Visionary Corps, are you in the house?" },
        { time: 130, text: "ScriptSmith Order, are you in the house!" },
        { time: 200, text: "[Outro] I’M THE ABSOLUTE ALGORITHM, THE FUNKY OS!" }
    ]
};

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
    
    // Reset state for new song
    lastLine = ""; 
    document.getElementById('lyric-text').innerText = "";
    currentTrackIndex = index;
    
    audio.play();
    isPlaying = true;
    
    // Change particle color
    const colors = [0xbc00ff, 0x33ff00, 0xffcc00];
    particles.material.color.setHex(colors[index - 1]);
}

window.switchTrack = function() {
    document.getElementById(`track-${currentTrackIndex}`).pause();
    document.getElementById(`track-${currentTrackIndex}`).currentTime = 0;
    
    currentTrackIndex = (currentTrackIndex >= 3) ? 1 : currentTrackIndex + 1;
    loadTrack(currentTrackIndex);
};

function updateLyrics(time) {
    // FORCE reference to the specific track ID
    const activeList = LYRIC_DATABASE[`track-${currentTrackIndex}`];
    
    let currentLine = "";
    for (let i = 0; i < activeList.length; i++) {
        if (time >= activeList[i].time) {
            currentLine = activeList[i].text;
        }
    }
    
    const el = document.getElementById('lyric-text');
    if (lastLine !== currentLine) {
        lastLine = currentLine;
        el.innerText = currentLine;
        el.className = (currentTrackIndex === 1) ? 'lyric-neon' : 'lyric-funk';
        gsap.fromTo(el, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4 });
    }
}

function animate() {
    requestAnimationFrame(animate);
    const audio = document.getElementById(`track-${currentTrackIndex}`);
    if (isPlaying && analyzer) {
        analyzer.getByteFrequencyData(dataArray);
        let avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
        
        // Visuals
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
    audio.paused ? audio.play() : audio.pause();
    isPlaying = !audio.paused;
};
