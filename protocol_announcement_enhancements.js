// Protocol Announcement Page - Enhancement Suite v2.0
// This script adds mind-blowing features to the announcement page

class ProtocolEnhancements {
    constructor(mainApp) {
        this.app = mainApp;
        this.secretCode = '';
        this.unlockedFeatures = new Set();
        this.deviceOrientation = { alpha: 0, beta: 0, gamma: 0 };
        this.audioEngine = null;
        this.lightningEffects = [];
        this.constellations = [];
        this.glitchMode = false;
        this.dimensionalShift = 0;
        
        this.init();
    }

    init() {
        console.log('🚀 Protocol Enhancement Suite v2.0 Initializing...');
        
        this.setupSecretCommands();
        this.setupDeviceOrientation();
        this.setupAdvancedAudio();
        this.createLightningSystem();
        this.createConstellationMap();
        this.setupPerformanceMonitor();
        this.addHiddenDimensions();
        this.setupEasterEggs();
        
        // Add enhancement indicator
        this.addEnhancementBadge();
    }

    // Secret Command System
    setupSecretCommands() {
        const commands = {
            'PROTOCOL': () => this.unlockProtocolMode(),
            'MATRIX': () => this.activateMatrixRain(),
            'QUANTUM': () => this.enableQuantumMode(),
            'GLITCH': () => this.toggleGlitchMode(),
            'NEXUS': () => this.revealNexusCore(),
            'AWAKEN': () => this.triggerAwakening(),
            'SOVEREIGN': () => this.unlockSovereignView(),
            'KONAMI': () => this.activateKonamiMode(), // ↑↑↓↓←→←→BA
            'BREACH': () => this.activateBreachMode(),
            'CYBER': () => this.activateCyberMode(),
            'VOID': () => this.activateVoidMode(),
            'PHOENIX': () => this.activatePhoenixMode(),
        };

        let konamiSequence = [];
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                           'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
                           'b', 'a'];

        document.addEventListener('keydown', (e) => {
            // Track typed characters
            if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
                this.secretCode += e.key.toUpperCase();
                this.secretCode = this.secretCode.slice(-10); // Keep last 10 chars
                
                // Check for commands
                Object.keys(commands).forEach(cmd => {
                    if (this.secretCode.includes(cmd) && !this.unlockedFeatures.has(cmd)) {
                        this.unlockedFeatures.add(cmd);
                        commands[cmd]();
                        this.showUnlockNotification(cmd);
                        this.secretCode = ''; // Reset after unlock
                    }
                });
            }

            // Konami code detection
            konamiSequence.push(e.key);
            konamiSequence = konamiSequence.slice(-10);
            
            if (konamiSequence.join(',') === konamiCode.join(',')) {
                this.activateKonamiMode();
                konamiSequence = [];
            }
        });
    }

    // Device Orientation for Mobile
    setupDeviceOrientation() {
        if (window.DeviceOrientationEvent) {
            // Request permission on iOS 13+
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                // Add button for permission
                this.addOrientationButton();
            } else {
                // Auto-enable on Android and older iOS
                this.enableOrientation();
            }
        }
    }

    enableOrientation() {
        window.addEventListener('deviceorientation', (e) => {
            this.deviceOrientation = {
                alpha: e.alpha || 0,
                beta: e.beta || 0,
                gamma: e.gamma || 0
            };
            
            // Apply orientation to logo
            if (this.app.logoGroup) {
                const tiltX = (this.deviceOrientation.gamma / 90) * 0.5;
                const tiltY = (this.deviceOrientation.beta / 180) * 0.5;
                
                this.app.logoGroup.rotation.x = tiltY;
                this.app.logoGroup.rotation.y = tiltX;
            }
        });
    }

    // Advanced Audio Engine
    setupAdvancedAudio() {
        this.audioEngine = {
            context: null,
            nodes: {},
            isInitialized: false
        };

        // Initialize on first interaction
        const initAudio = () => {
            if (!this.audioEngine.isInitialized) {
                this.audioEngine.context = new (window.AudioContext || window.webkitAudioContext)();
                this.createSpatialAudioEnvironment();
                this.audioEngine.isInitialized = true;
                document.removeEventListener('click', initAudio);
            }
        };

        document.addEventListener('click', initAudio);
    }

    createSpatialAudioEnvironment() {
        const ctx = this.audioEngine.context;
        
        // Create convolver for reverb
        const convolver = ctx.createConvolver();
        
        // Create impulse response for space reverb
        const length = ctx.sampleRate * 3;
        const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
            }
        }
        
        convolver.buffer = impulse;
        
        // Create master gain
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.5;
        
        // Connect nodes
        convolver.connect(masterGain);
        masterGain.connect(ctx.destination);
        
        this.audioEngine.nodes = { convolver, masterGain };
        
        // Create ambient drones
        this.createAmbientDrones();
    }

    createAmbientDrones() {
        const ctx = this.audioEngine.context;
        const drones = [];
        
        // Create multiple oscillators for rich texture
        const frequencies = [55, 82.5, 110, 165, 220]; // A1, E2, A2, E3, A3
        
        frequencies.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            
            osc.frequency.value = freq;
            osc.type = index < 2 ? 'sine' : 'triangle';
            
            filter.type = 'lowpass';
            filter.frequency.value = 200 + index * 100;
            filter.Q.value = 5;
            
            gain.gain.value = 0.05 / (index + 1);
            
            // Add subtle vibrato
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.frequency.value = 0.2 + index * 0.1;
            lfoGain.gain.value = 2;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.audioEngine.nodes.convolver);
            
            osc.start();
            drones.push({ osc, gain, filter, lfo });
        });
        
        this.audioEngine.drones = drones;
    }

    // Lightning System Between Logo Elements
    createLightningSystem() {
        if (!this.app.logoGroup) return;
        
        const lightningMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                intensity: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float intensity;
                varying vec2 vUv;
                
                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }
                
                void main() {
                    float bolt = 0.0;
                    
                    // Create lightning bolt
                    float x = vUv.x;
                    float y = vUv.y;
                    
                    // Main bolt
                    float thickness = 0.01;
                    float deviation = sin(time * 20.0 + y * 10.0) * 0.1;
                    float mainBolt = 1.0 - smoothstep(0.0, thickness, abs(x - 0.5 + deviation));
                    
                    // Branches
                    for(int i = 0; i < 3; i++) {
                        float branchPoint = random(vec2(float(i), floor(time))) * 0.8 + 0.1;
                        if(y > branchPoint && y < branchPoint + 0.2) {
                            float branchDev = sin(time * 30.0 + float(i)) * 0.2;
                            float branch = 1.0 - smoothstep(0.0, thickness * 0.5, 
                                          abs(x - 0.5 + deviation + branchDev));
                            bolt = max(bolt, branch * 0.5);
                        }
                    }
                    
                    bolt = max(bolt, mainBolt);
                    bolt *= intensity;
                    
                    // Add glow
                    vec3 color = vec3(0.8, 0.8, 1.0) * bolt;
                    color += vec3(0.4, 0.4, 1.0) * bolt * 0.5;
                    
                    gl_FragColor = vec4(color, bolt);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        // Create lightning bolts between logo prisms
        setInterval(() => {
            if (Math.random() > 0.7 && this.app.logoGroup.children.length >= 2) {
                const children = this.app.logoGroup.children;
                const from = children[Math.floor(Math.random() * children.length)];
                const to = children[Math.floor(Math.random() * children.length)];
                
                if (from !== to) {
                    this.createLightningBolt(from.position, to.position, lightningMaterial);
                }
            }
        }, 2000);
    }

    createLightningBolt(start, end, material) {
        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();
        
        const geometry = new THREE.PlaneGeometry(length, 0.5, 20, 1);
        const bolt = new THREE.Mesh(geometry, material.clone());
        
        // Position and orient the bolt
        bolt.position.copy(start).add(direction.multiplyScalar(0.5));
        bolt.lookAt(end);
        
        this.app.logoScene.add(bolt);
        
        // Animate
        const startTime = this.app.time;
        const animateBolt = () => {
            const elapsed = this.app.time - startTime;
            
            if (elapsed < 0.5) {
                bolt.material.uniforms.time.value = elapsed * 10;
                bolt.material.uniforms.intensity.value = Math.sin(elapsed * Math.PI * 2) * 0.8;
                requestAnimationFrame(animateBolt);
            } else {
                this.app.logoScene.remove(bolt);
                bolt.geometry.dispose();
                bolt.material.dispose();
            }
        };
        animateBolt();
    }

    // Constellation System
    createConstellationMap() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '3';
        canvas.id = 'constellation-canvas';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Create constellation data
        const constellations = [
            { name: 'The Protocol', stars: this.generateConstellation(5, 0.3) },
            { name: 'The Sovereign', stars: this.generateConstellation(7, 0.5) },
            { name: 'The Network', stars: this.generateConstellation(6, 0.7) }
        ];

        // Draw constellations
        const drawConstellations = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            constellations.forEach((constellation, index) => {
                ctx.save();
                ctx.globalAlpha = 0.3 + Math.sin(this.app.time * 0.5 + index) * 0.1;
                
                // Draw connections
                ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                
                constellation.stars.forEach((star, i) => {
                    const x = star.x * canvas.width;
                    const y = star.y * canvas.height;
                    
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });
                
                ctx.stroke();
                
                // Draw stars
                constellation.stars.forEach(star => {
                    const x = star.x * canvas.width;
                    const y = star.y * canvas.height;
                    
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.beginPath();
                    ctx.arc(x, y, star.size * 3, 0, Math.PI * 2);
                    ctx.fill();
                });
                
                ctx.restore();
            });
            
            if (this.unlockedFeatures.has('NEXUS')) {
                requestAnimationFrame(drawConstellations);
            }
        };

        this.constellations = { canvas, ctx, data: constellations, draw: drawConstellations };
    }

    generateConstellation(starCount, region) {
        const stars = [];
        const centerX = 0.2 + region * 0.5;
        const centerY = 0.3 + Math.random() * 0.4;
        
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: centerX + (Math.random() - 0.5) * 0.2,
                y: centerY + (Math.random() - 0.5) * 0.2,
                size: Math.random() * 0.5 + 0.5
            });
        }
        
        return stars;
    }

    // Hidden Dimensions
    addHiddenDimensions() {
        // Create dimensional layers that reveal on interaction
        const dimensions = [
            { name: 'Quantum Layer', color: 0x00ffff, depth: -50 },
            { name: 'Neural Network', color: 0xff00ff, depth: -100 },
            { name: 'Consciousness Field', color: 0xffff00, depth: -150 }
        ];

        this.dimensions = dimensions.map(dim => {
            const geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(dim.color) },
                    opacity: { value: 0 },
                    distortion: { value: 0 }
                },
                vertexShader: `
                    uniform float time;
                    uniform float distortion;
                    varying vec2 vUv;
                    
                    void main() {
                        vUv = uv;
                        vec3 pos = position;
                        
                        float wave = sin(pos.x * 0.1 + time) * cos(pos.y * 0.1 + time);
                        pos.z += wave * distortion * 10.0;
                        
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 color;
                    uniform float opacity;
                    varying vec2 vUv;
                    
                    void main() {
                        vec2 center = vUv - 0.5;
                        float dist = length(center);
                        
                        float pattern = sin(dist * 20.0 - time * 2.0) * 0.5 + 0.5;
                        vec3 finalColor = color * pattern;
                        
                        float alpha = (1.0 - dist * 2.0) * opacity;
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.z = dim.depth;
            mesh.rotation.x = -Math.PI / 2;
            mesh.visible = false;
            
            if (this.app.scene) {
                this.app.scene.add(mesh);
            }
            
            return { mesh, material, data: dim };
        });
    }

    // Performance Monitor
    setupPerformanceMonitor() {
        const monitor = document.createElement('div');
        monitor.id = 'performance-monitor';
        monitor.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #0f0;
            font-family: monospace;
            font-size: 12px;
            padding: 10px;
            border: 1px solid #0f0;
            border-radius: 5px;
            display: none;
            z-index: 10000;
        `;
        document.body.appendChild(monitor);

        let frameCount = 0;
        let lastTime = performance.now();
        
        const updateMonitor = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                const memory = performance.memory ? 
                    `Memory: ${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)}MB` : '';
                
                monitor.innerHTML = `
                    FPS: ${fps}<br>
                    ${memory}<br>
                    Particles: ${this.app.particles.length}<br>
                    Features: ${this.unlockedFeatures.size}<br>
                    Dimension: ${this.dimensionalShift}
                `;
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            if (this.unlockedFeatures.has('MATRIX')) {
                requestAnimationFrame(updateMonitor);
            }
        };

        // Add keyboard shortcut to toggle
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F3') {
                monitor.style.display = monitor.style.display === 'none' ? 'block' : 'none';
                if (monitor.style.display === 'block') {
                    updateMonitor();
                }
            }
        });
    }

    // Enhancement Badge
    addEnhancementBadge() {
        const badge = document.createElement('div');
        badge.innerHTML = '✨ v2.0';
        badge.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: rgba(255, 0, 0, 0.2);
            color: #fff;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            border: 1px solid rgba(255, 0, 0, 0.5);
            cursor: help;
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        
        badge.title = 'Enhanced with Protocol v2.0 - Try typing secret commands!';
        
        badge.addEventListener('mouseenter', () => {
            badge.style.transform = 'scale(1.1)';
            badge.style.background = 'rgba(255, 0, 0, 0.4)';
        });
        
        badge.addEventListener('mouseleave', () => {
            badge.style.transform = 'scale(1)';
            badge.style.background = 'rgba(255, 0, 0, 0.2)';
        });
        
        document.body.appendChild(badge);
    }

    // Unlock Notifications
    showUnlockNotification(feature) {
        const notification = document.createElement('div');
        notification.innerHTML = `🔓 ${feature} MODE UNLOCKED`;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 215, 0, 0.9);
            color: #000;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 24px;
            font-weight: bold;
            z-index: 10000;
            animation: unlockPulse 2s ease-out;
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes unlockPulse {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
        
        // Trigger specific effect based on feature
        this.playUnlockSound();
    }

    // Sound Effects
    playUnlockSound() {
        if (this.audioEngine && this.audioEngine.context) {
            const ctx = this.audioEngine.context;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1); // C6
            
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.5);
        }
    }

    // Feature Implementations
    unlockProtocolMode() {
        console.log('🔓 PROTOCOL MODE ACTIVATED');
        // Enhanced logo effects
        if (this.app.logoGroup) {
            this.app.logoGroup.children.forEach((mesh, i) => {
                if (mesh.isMesh && mesh.material && mesh.material.uniforms && mesh.material.uniforms.baseColor) {
                    mesh.material.uniforms.baseColor.value = new THREE.Color(0xffd700);
                }
            });
        }
        
        // Activate golden theme
        document.body.style.filter = 'hue-rotate(-30deg) contrast(1.2)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 5000);
    }

    activateMatrixRain() {
        console.log('🔓 MATRIX MODE ACTIVATED - RED EDITION');
        // Create matrix rain effect with RED theme
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.7;
            mix-blend-mode: screen;
        `;
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const columns = Math.floor(canvas.width / 20);
        const drops = new Array(columns).fill(1);
        const trails = new Array(columns).fill([]);
        
        const matrix = () => {
            // Darker fade for better trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.font = '15px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = String.fromCharCode(0x30A0 + Math.random() * 96);
                const x = i * 20;
                const y = drops[i] * 20;
                
                // Glowing red with variable intensity
                const intensity = Math.random();
                if (intensity > 0.9) {
                    // Bright white-red for "glitch" effect
                    ctx.fillStyle = '#FFF';
                    ctx.shadowColor = '#FF0000';
                    ctx.shadowBlur = 20;
                } else {
                    // Normal red with glow
                    const brightness = Math.floor(100 + Math.random() * 155);
                    ctx.fillStyle = `rgb(${brightness}, 0, 0)`;
                    ctx.shadowColor = '#FF0000';
                    ctx.shadowBlur = 10;
                }
                
                // Occasionally scramble characters
                if (Math.random() > 0.98) {
                    ctx.save();
                    ctx.translate(x + 10, y);
                    ctx.rotate((Math.random() - 0.5) * 0.5);
                    ctx.fillText(text, -10, 0);
                    ctx.restore();
                } else {
                    ctx.fillText(text, x, y);
                }
                
                // Trail effect
                trails[i] = trails[i] || [];
                trails[i].push({ x, y, char: text, alpha: 0.5 });
                if (trails[i].length > 10) trails[i].shift();
                
                // Draw fading trail
                trails[i].forEach((trail, idx) => {
                    ctx.globalAlpha = trail.alpha * (idx / trails[i].length);
                    ctx.fillStyle = `rgb(${100 + idx * 10}, 0, 0)`;
                    ctx.fillText(trail.char, trail.x, trail.y);
                });
                ctx.globalAlpha = 1;
                
                // Reset shadow
                ctx.shadowBlur = 0;
                
                if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                    trails[i] = [];
                }
                drops[i]++;
            }
        };
        
        this.matrixInterval = setInterval(matrix, 35);
        
        // Auto-disable after 45 seconds (extended for awesomeness)
        setTimeout(() => {
            clearInterval(this.matrixInterval);
            canvas.remove();
        }, 45000);
    }

    enableQuantumMode() {
        console.log('🔓 QUANTUM MODE ACTIVATED');
        this.glitchMode = true;
        
        // Add quantum uncertainty to particles
        if (this.app.particles) {
            this.quantumInterval = setInterval(() => {
                this.app.particles.forEach(particle => {
                    // Quantum tunneling effect
                    if (Math.random() > 0.99) {
                        particle.x = Math.random() * window.innerWidth;
                        particle.y = Math.random() * window.innerHeight;
                    }
                    
                    // Uncertainty principle
                    particle.vx += (Math.random() - 0.5) * 2;
                    particle.vy += (Math.random() - 0.5) * 2;
                });
            }, 100);
        }
    }

    toggleGlitchMode() {
        console.log('🔓 GLITCH MODE TOGGLED');
        this.glitchMode = !this.glitchMode;
        
        if (this.glitchMode) {
            document.body.style.animation = 'realityGlitch 0.5s infinite';
            
            // Add glitch CSS
            const style = document.createElement('style');
            style.id = 'glitch-style';
            style.textContent = `
                @keyframes realityGlitch {
                    0%, 100% { 
                        transform: translate(0);
                        filter: hue-rotate(0deg);
                    }
                    20% { 
                        transform: translate(-2px, 2px);
                        filter: hue-rotate(90deg) saturate(2);
                    }
                    40% { 
                        transform: translate(-2px, -2px);
                        filter: hue-rotate(180deg) contrast(2);
                    }
                    60% { 
                        transform: translate(2px, 2px);
                        filter: hue-rotate(270deg) brightness(1.5);
                    }
                    80% { 
                        transform: translate(2px, -2px);
                        filter: hue-rotate(360deg) invert(0.1);
                    }
                }
            `;
            document.head.appendChild(style);
        } else {
            document.body.style.animation = '';
            const style = document.getElementById('glitch-style');
            if (style) style.remove();
        }
    }

    revealNexusCore() {
        console.log('🔓 NEXUS CORE REVEALED');
        
        // Reveal constellations
        if (this.constellations) {
            this.constellations.draw();
        }
        
        // Create nexus core in center of logo
        if (this.app.logoScene) {
            const geometry = new THREE.IcosahedronGeometry(0.5, 3);
            const material = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 2,
                metalness: 1,
                roughness: 0,
                clearcoat: 1,
                transparent: true,
                opacity: 0.8
            });
            
            const nexus = new THREE.Mesh(geometry, material);
            nexus.name = 'nexusCore';
            this.app.logoScene.add(nexus);
            
            // Animate nexus
            const animateNexus = () => {
                if (nexus.parent) {
                    nexus.rotation.x += 0.01;
                    nexus.rotation.y += 0.02;
                    nexus.scale.setScalar(1 + Math.sin(this.app.time * 2) * 0.2);
                    requestAnimationFrame(animateNexus);
                }
            };
            animateNexus();
        }
    }

    triggerAwakening() {
        console.log('🔓 AWAKENING SEQUENCE INITIATED');
        
        // Epic awakening effect
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
            z-index: 9999;
            pointer-events: none;
            animation: awakening 3s ease-out forwards;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes awakening {
                0% { opacity: 0; transform: scale(0); }
                50% { opacity: 1; transform: scale(2); }
                100% { opacity: 0; transform: scale(3); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Reveal all dimensions
        if (this.dimensions) {
            this.dimensions.forEach((dim, i) => {
                setTimeout(() => {
                    dim.mesh.visible = true;
                    const fade = () => {
                        if (dim.material.uniforms.opacity.value < 0.5) {
                            dim.material.uniforms.opacity.value += 0.01;
                            dim.material.uniforms.distortion.value += 0.01;
                            requestAnimationFrame(fade);
                        }
                    };
                    fade();
                }, i * 500);
            });
        }
        
        setTimeout(() => overlay.remove(), 3000);
    }

    unlockSovereignView() {
        console.log('🔓 SOVEREIGN VIEW ACTIVATED');
        
        // Transform entire page into sovereign perspective
        document.body.style.transform = 'perspective(1000px) rotateX(15deg)';
        document.body.style.transformOrigin = 'center center';
        
        // Add sovereign crown to logo
        if (this.app.logoGroup) {
            const crownGeometry = new THREE.ConeGeometry(1, 1, 3);
            const crownMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xffd700,
                emissive: 0xffd700,
                emissiveIntensity: 0.5,
                metalness: 1,
                roughness: 0.1
            });
            
            const crown = new THREE.Mesh(crownGeometry, crownMaterial);
            crown.position.y = 2;
            crown.rotation.y = Math.PI;
            this.app.logoGroup.add(crown);
        }
    }

    activateKonamiMode() {
        console.log('🔓 KONAMI CODE ACTIVATED - FULL POWER MODE');
        
        // Epic screen shake
        this.epicScreenShake();
        
        // Particle explosion from center - MASSIVE VERSION
        this.createParticleExplosion(window.innerWidth / 2, window.innerHeight / 2, 1000);
        
        // Thunder flash
        this.createThunderFlash();
        
        // FULL POWER MODE overlay
        this.showFullPowerOverlay();
        
        // Activate ALL features
        ['PROTOCOL', 'MATRIX', 'QUANTUM', 'NEXUS', 'SOVEREIGN'].forEach(feature => {
            if (!this.unlockedFeatures.has(feature)) {
                this.unlockedFeatures.add(feature);
                setTimeout(() => this.showUnlockNotification(feature), Math.random() * 2000);
            }
        });
        
        // Rainbow mode with enhanced effects
        document.body.style.animation = 'rainbowModeEnhanced 5s linear infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbowModeEnhanced {
                0% { 
                    filter: hue-rotate(0deg) brightness(1) contrast(1);
                    transform: scale(1);
                }
                25% {
                    filter: hue-rotate(90deg) brightness(1.2) contrast(1.2);
                    transform: scale(1.01);
                }
                50% {
                    filter: hue-rotate(180deg) brightness(1.1) contrast(1.1);
                    transform: scale(1);
                }
                75% {
                    filter: hue-rotate(270deg) brightness(1.2) contrast(1.2);
                    transform: scale(1.01);
                }
                100% { 
                    filter: hue-rotate(360deg) brightness(1) contrast(1);
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Max particles with explosion pattern
        if (this.app.particles) {
            const newParticles = [];
            for (let i = 0; i < 500; i++) {
                const angle = (Math.PI * 2 * i) / 500;
                const speed = 5 + Math.random() * 10;
                newParticles.push({
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: Math.random() * 5 + 1,
                    opacity: Math.random() * 0.8 + 0.2
                });
            }
            this.app.particles.push(...newParticles);
        }
    }

    epicScreenShake() {
        const shakeKeyframes = [];
        for (let i = 0; i < 20; i++) {
            shakeKeyframes.push(`
                ${i * 5}% {
                    transform: translate(
                        ${(Math.random() - 0.5) * 20}px,
                        ${(Math.random() - 0.5) * 20}px
                    ) rotate(${(Math.random() - 0.5) * 5}deg);
                }
            `);
        }
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes epicShake {
                ${shakeKeyframes.join('')}
                100% { transform: translate(0, 0) rotate(0deg); }
            }
            
            .shaking {
                animation: epicShake 0.5s ease-out;
            }
        `;
        document.head.appendChild(style);
        
        document.body.classList.add('shaking');
        setTimeout(() => document.body.classList.remove('shaking'), 500);
    }

    createParticleExplosion(x, y, count) {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10000;
        `;
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 5 + Math.random() * 20;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 5 + 2,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                life: 1
            });
        }
        
        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.5; // gravity
                p.life -= 0.02;
                p.vx *= 0.98; // friction
                
                if (p.life > 0) {
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;
                    ctx.shadowColor = p.color;
                    ctx.shadowBlur = 20;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            
            if (particles.some(p => p.life > 0)) {
                requestAnimationFrame(animate);
            } else {
                canvas.remove();
            }
        };
        animate();
    }

    createThunderFlash() {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            pointer-events: none;
            z-index: 10001;
            animation: thunderFlash 0.5s ease-out;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes thunderFlash {
                0% { opacity: 0; }
                10% { opacity: 1; }
                20% { opacity: 0; }
                30% { opacity: 0.8; }
                40% { opacity: 0; }
                50% { opacity: 0.6; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(flash);
        
        // Thunder sound if audio is enabled
        if (this.audioEngine && this.audioEngine.context) {
            this.playThunderSound();
        }
        
        setTimeout(() => flash.remove(), 500);
    }

    showFullPowerOverlay() {
        const overlay = document.createElement('div');
        overlay.innerHTML = `
            <div style="
                font-size: 120px;
                font-weight: 900;
                background: linear-gradient(45deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-shadow: 0 0 50px rgba(255, 255, 255, 0.8);
                animation: powerPulse 2s ease-out;
            ">FULL POWER MODE</div>
        `;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.8);
            pointer-events: none;
            z-index: 10002;
            animation: overlayFade 3s ease-out forwards;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes overlayFade {
                0% { opacity: 0; }
                20% { opacity: 1; }
                80% { opacity: 1; }
                100% { opacity: 0; }
            }
            
            @keyframes powerPulse {
                0% { transform: scale(0); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        setTimeout(() => overlay.remove(), 3000);
    }

    playThunderSound() {
        const ctx = this.audioEngine.context;
        const duration = 1;
        
        // White noise for thunder
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
        }
        
        const source = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        
        source.buffer = buffer;
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        gain.gain.value = 0.5;
        
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        source.start();
    }

    // Easter Eggs
    setupEasterEggs() {
        // Click pattern easter egg
        let clickPattern = [];
        document.addEventListener('click', (e) => {
            clickPattern.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            clickPattern = clickPattern.filter(click => Date.now() - click.time < 2000);
            
            // Check for triangle pattern
            if (clickPattern.length === 3) {
                const [p1, p2, p3] = clickPattern;
                const area = Math.abs((p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y)) / 2;
                
                if (area > 10000 && area < 50000) {
                    this.showUnlockNotification('TRIANGLE');
                    this.createTrianglePortal(p1, p2, p3);
                    clickPattern = [];
                }
            }
        });
        
        // Time-based easter egg (11:11)
        setInterval(() => {
            const now = new Date();
            if (now.getHours() === 11 && now.getMinutes() === 11) {
                if (!this.unlockedFeatures.has('ELEVEN')) {
                    this.unlockedFeatures.add('ELEVEN');
                    this.showUnlockNotification('11:11');
                    this.activate1111Mode();
                }
            }
        }, 60000);
    }

    createTrianglePortal(p1, p2, p3) {
        const portal = document.createElement('div');
        portal.style.cssText = `
            position: fixed;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(255,0,0,0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: portalPulse 2s ease-out forwards;
        `;
        
        // Center of triangle
        const centerX = (p1.x + p2.x + p3.x) / 3;
        const centerY = (p1.y + p2.y + p3.y) / 3;
        
        portal.style.left = centerX - 100 + 'px';
        portal.style.top = centerY - 100 + 'px';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes portalPulse {
                0% { transform: scale(0) rotate(0deg); opacity: 0; }
                50% { transform: scale(1.5) rotate(180deg); opacity: 1; }
                100% { transform: scale(0.1) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(portal);
        
        setTimeout(() => portal.remove(), 2000);
    }

    activate1111Mode() {
        // Synchronicity mode
        document.body.style.filter = 'contrast(1.11) brightness(1.11)';
        
        // Add 11:11 display
        const display = document.createElement('div');
        display.textContent = '11:11';
        display.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 200px;
            font-weight: bold;
            color: rgba(255, 255, 255, 0.1);
            pointer-events: none;
            z-index: 1;
            animation: fadeInOut 11s ease-out;
        `;
        document.body.appendChild(display);
        
        setTimeout(() => display.remove(), 11000);
    }

    // Add orientation permission button for iOS
    addOrientationButton() {
        const button = document.createElement('button');
        button.textContent = '📱 Enable Motion';
        button.style.cssText = `
            position: fixed;
            top: 100px;
            right: 40px;
            padding: 10px 20px;
            background: rgba(255, 0, 0, 0.2);
            border: 1px solid rgba(255, 0, 0, 0.5);
            color: white;
            border-radius: 20px;
            cursor: pointer;
            z-index: 1000;
            display: none;
        `;
        
        // Only show on iOS
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            button.style.display = 'block';
        }
        
        button.addEventListener('click', () => {
            DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        this.enableOrientation();
                        button.remove();
                        this.showUnlockNotification('MOTION');
                    }
                })
                .catch(console.error);
        });
        
        document.body.appendChild(button);
    }

    // NEW SECRET COMMANDS
    activateBreachMode() {
        console.log('🔓 BREACH MODE ACTIVATED - REALITY TEARS APPEARING');
        
        // Create random reality tears
        this.breachInterval = setInterval(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            this.createMajorRealityTear(x, y);
        }, 2000);
        
        // Add dimensional instability
        document.body.style.animation = 'dimensionalInstability 5s ease-in-out infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes dimensionalInstability {
                0%, 100% { 
                    transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
                    filter: blur(0px);
                }
                25% { 
                    transform: perspective(1000px) rotateX(2deg) rotateY(-3deg);
                    filter: blur(1px) contrast(1.2);
                }
                50% { 
                    transform: perspective(1000px) rotateX(-3deg) rotateY(2deg);
                    filter: blur(0.5px) brightness(1.1);
                }
                75% { 
                    transform: perspective(1000px) rotateX(1deg) rotateY(-2deg);
                    filter: blur(0.8px) saturate(1.3);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Stop after 30 seconds
        setTimeout(() => {
            clearInterval(this.breachInterval);
            document.body.style.animation = '';
        }, 30000);
    }

    createMajorRealityTear(x, y) {
        const tear = document.createElement('div');
        const width = 50 + Math.random() * 150;
        const height = 200 + Math.random() * 300;
        const rotation = Math.random() * 360;
        
        tear.innerHTML = `
            <svg width="${width}" height="${height}">
                <defs>
                    <linearGradient id="tearGrad${Date.now()}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:white;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:cyan;stop-opacity:0.5" />
                        <stop offset="100%" style="stop-color:transparent;stop-opacity:0" />
                    </linearGradient>
                    <filter id="tearDistort${Date.now()}">
                        <feTurbulence baseFrequency="0.05" numOctaves="3" />
                        <feDisplacementMap in="SourceGraphic" scale="30" />
                    </filter>
                </defs>
                <path d="M ${width/2} 0 L ${width*0.6} ${height*0.3} L ${width*0.8} ${height*0.7} L ${width/2} ${height} L ${width*0.2} ${height*0.7} L ${width*0.4} ${height*0.3} Z"
                      fill="url(#tearGrad${Date.now()})" 
                      filter="url(#tearDistort${Date.now()})" />
            </svg>
        `;
        
        tear.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${width}px;
            height: ${height}px;
            transform: translate(-50%, -50%) rotate(${rotation}deg);
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: screen;
            animation: tearLife 3s ease-out forwards;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes tearLife {
                0% { 
                    opacity: 0;
                    transform: translate(-50%, -50%) rotate(${rotation}deg) scale(0.1);
                    filter: brightness(2) blur(0px);
                }
                50% { 
                    opacity: 1;
                    transform: translate(-50%, -50%) rotate(${rotation}deg) scale(1);
                    filter: brightness(1.5) blur(2px);
                }
                100% { 
                    opacity: 0;
                    transform: translate(-50%, -50%) rotate(${rotation + 180}deg) scale(0.5);
                    filter: brightness(0.5) blur(5px);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(tear);
        
        setTimeout(() => tear.remove(), 3000);
    }

    activateCyberMode() {
        console.log('🔓 CYBER MODE ACTIVATED - ENTERING THE GRID');
        
        // Create cyberpunk overlay
        const cyberOverlay = document.createElement('div');
        cyberOverlay.id = 'cyber-overlay';
        cyberOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
            mix-blend-mode: overlay;
        `;
        
        // Add scan lines
        const scanLines = document.createElement('div');
        scanLines.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 255, 255, 0.1) 2px,
                rgba(0, 255, 255, 0.1) 4px
            );
            animation: scanMove 8s linear infinite;
        `;
        cyberOverlay.appendChild(scanLines);
        
        // Add grid
        const grid = document.createElement('div');
        grid.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
            background-size: 50px 50px;
            animation: gridMove 20s linear infinite;
        `;
        cyberOverlay.appendChild(grid);
        
        // Add neon edges
        const style = document.createElement('style');
        style.textContent = `
            @keyframes scanMove {
                0% { transform: translateY(0); }
                100% { transform: translateY(10px); }
            }
            
            @keyframes gridMove {
                0% { transform: translate(0, 0); }
                100% { transform: translate(50px, 50px); }
            }
            
            .cyber-mode * {
                text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff !important;
            }
            
            .cyber-mode .countdown-value {
                color: #00ffff !important;
                text-shadow: 
                    0 0 20px #00ffff,
                    0 0 40px #00ffff,
                    0 0 60px #0088ff !important;
            }
            
            .cyber-mode .protocol-title {
                animation: neonFlicker 2s ease-in-out infinite !important;
            }
            
            @keyframes neonFlicker {
                0%, 100% { opacity: 1; filter: brightness(1); }
                50% { opacity: 0.8; filter: brightness(1.5); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(cyberOverlay);
        document.body.classList.add('cyber-mode');
        
        // Add holographic projections
        this.createHolographicProjections();
        
        // Auto-disable after 60 seconds
        setTimeout(() => {
            cyberOverlay.remove();
            document.body.classList.remove('cyber-mode');
        }, 60000);
    }

    createHolographicProjections() {
        const projections = [
            { text: 'SYSTEM BREACH', x: 20, y: 20 },
            { text: 'ACCESS GRANTED', x: 70, y: 30 },
            { text: 'PROTOCOL ACTIVE', x: 50, y: 70 },
            { text: 'NEURAL LINK', x: 30, y: 80 }
        ];
        
        projections.forEach((proj, i) => {
            const hologram = document.createElement('div');
            hologram.className = 'holographic-text';
            hologram.textContent = proj.text;
            hologram.style.cssText = `
                position: fixed;
                left: ${proj.x}%;
                top: ${proj.y}%;
                color: #00ffff;
                font-family: monospace;
                font-size: 20px;
                font-weight: bold;
                letter-spacing: 3px;
                text-transform: uppercase;
                transform: translate(-50%, -50%) perspective(500px) rotateY(${Math.random() * 30 - 15}deg);
                pointer-events: none;
                z-index: 9999;
                opacity: 0;
                animation: holoAppear ${1 + i * 0.5}s ease-out ${i * 0.2}s forwards,
                         holoGlitch 5s ease-in-out ${i * 0.5}s infinite;
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes holoAppear {
                    0% { 
                        opacity: 0;
                        transform: translate(-50%, -50%) perspective(500px) rotateY(90deg) scale(0);
                    }
                    100% { 
                        opacity: 0.8;
                        transform: translate(-50%, -50%) perspective(500px) rotateY(${Math.random() * 30 - 15}deg) scale(1);
                    }
                }
                
                @keyframes holoGlitch {
                    0%, 100% { filter: hue-rotate(0deg); }
                    25% { filter: hue-rotate(10deg); transform: translate(-50%, -50%) perspective(500px) rotateY(${Math.random() * 30 - 15}deg) scale(1.02); }
                    50% { filter: hue-rotate(-10deg); }
                    75% { filter: hue-rotate(5deg); transform: translate(-50%, -50%) perspective(500px) rotateY(${Math.random() * 30 - 15}deg) scale(0.98); }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(hologram);
            
            setTimeout(() => hologram.remove(), 60000);
        });
    }

    activateVoidMode() {
        console.log('🔓 VOID MODE ACTIVATED - EVERYTHING CONVERGES');
        
        // Create void at center
        const voidCenter = document.createElement('div');
        voidCenter.id = 'void-singularity';
        voidCenter.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            width: 100px;
            height: 100px;
            transform: translate(-50%, -50%);
            background: radial-gradient(circle, black 0%, transparent 70%);
            border-radius: 50%;
            z-index: 9997;
            animation: voidGrow 10s ease-in-out;
        `;
        
        // Add gravitational distortion
        const style = document.createElement('style');
        style.textContent = `
            @keyframes voidGrow {
                0% { 
                    width: 0px;
                    height: 0px;
                    box-shadow: inset 0 0 50px black, 0 0 100px black;
                }
                50% {
                    width: 500px;
                    height: 500px;
                    box-shadow: inset 0 0 200px black, 0 0 500px black;
                }
                100% { 
                    width: 100px;
                    height: 100px;
                    box-shadow: inset 0 0 50px black, 0 0 100px black;
                }
            }
            
            .void-active {
                animation: voidPull 10s ease-in-out;
            }
            
            @keyframes voidPull {
                0%, 100% { transform: scale(1) translate(0, 0); }
                50% { transform: scale(0.8) translate(0, 0); }
            }
            
            .void-distortion {
                filter: url(#voidDistortion);
            }
        `;
        document.head.appendChild(style);
        
        // Create SVG filter for distortion
        const svgFilter = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgFilter.style.position = 'fixed';
        svgFilter.style.width = '0';
        svgFilter.style.height = '0';
        svgFilter.innerHTML = `
            <defs>
                <filter id="voidDistortion">
                    <feTurbulence baseFrequency="0.01" numOctaves="2" />
                    <feDisplacementMap in="SourceGraphic" scale="20" />
                </filter>
            </defs>
        `;
        document.body.appendChild(svgFilter);
        
        document.body.appendChild(voidCenter);
        document.body.classList.add('void-active');
        
        // Pull particles toward center
        if (this.app.particles) {
            this.voidInterval = setInterval(() => {
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                
                this.app.particles.forEach(particle => {
                    const dx = centerX - particle.x;
                    const dy = centerY - particle.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist > 50) {
                        const force = 1000 / (dist * dist);
                        particle.vx += (dx / dist) * force;
                        particle.vy += (dy / dist) * force;
                    }
                });
            }, 50);
        }
        
        // End void after 10 seconds
        setTimeout(() => {
            clearInterval(this.voidInterval);
            voidCenter.remove();
            svgFilter.remove();
            document.body.classList.remove('void-active');
        }, 10000);
    }

    activatePhoenixMode() {
        console.log('🔓 PHOENIX MODE ACTIVATED - RISE FROM THE ASHES');
        
        // Create fire effect overlay
        const fireCanvas = document.createElement('canvas');
        fireCanvas.id = 'phoenix-fire';
        fireCanvas.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9996;
            opacity: 0.7;
            mix-blend-mode: screen;
        `;
        document.body.appendChild(fireCanvas);
        
        const ctx = fireCanvas.getContext('2d');
        fireCanvas.width = window.innerWidth;
        fireCanvas.height = window.innerHeight;
        
        // Fire particles
        const fireParticles = [];
        const createFireParticle = (x) => {
            return {
                x: x,
                y: fireCanvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: -(Math.random() * 5 + 5),
                size: Math.random() * 30 + 10,
                life: 1,
                hue: Math.random() * 60 // 0-60 for red to yellow
            };
        };
        
        // Phoenix wings effect
        const phoenixWings = document.createElement('div');
        phoenixWings.innerHTML = `
            <svg width="400" height="300" style="filter: drop-shadow(0 0 20px #ff6600);">
                <defs>
                    <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#ff0000;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#ff6600;stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#ffcc00;stop-opacity:0.5" />
                    </linearGradient>
                </defs>
                <!-- Left Wing -->
                <path d="M200 150 Q100 100 50 150 Q100 120 150 150 Q100 140 100 180 Q150 160 200 150"
                      fill="url(#wingGrad)" opacity="0.8" />
                <!-- Right Wing -->
                <path d="M200 150 Q300 100 350 150 Q300 120 250 150 Q300 140 300 180 Q250 160 200 150"
                      fill="url(#wingGrad)" opacity="0.8" />
            </svg>
        `;
        phoenixWings.style.cssText = `
            position: fixed;
            left: 50%;
            bottom: 20%;
            transform: translateX(-50%);
            z-index: 9997;
            animation: phoenixRise 5s ease-out, wingFlap 2s ease-in-out 1s infinite;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes phoenixRise {
                0% { 
                    bottom: -100%;
                    transform: translateX(-50%) scale(0.5);
                    filter: brightness(2) blur(5px);
                }
                100% { 
                    bottom: 20%;
                    transform: translateX(-50%) scale(1);
                    filter: brightness(1) blur(0px);
                }
            }
            
            @keyframes wingFlap {
                0%, 100% { transform: translateX(-50%) scaleY(1); }
                50% { transform: translateX(-50%) scaleY(0.8); }
            }
            
            .phoenix-active {
                filter: sepia(0.3) hue-rotate(-20deg) brightness(1.2);
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(phoenixWings);
        document.body.classList.add('phoenix-active');
        
        // Animate fire
        const animateFire = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, fireCanvas.width, fireCanvas.height);
            
            // Create new particles
            for (let i = 0; i < 5; i++) {
                fireParticles.push(createFireParticle(Math.random() * fireCanvas.width));
            }
            
            // Update and draw particles
            fireParticles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.1; // gravity
                p.life -= 0.01;
                p.size *= 0.98;
                
                if (p.life > 0 && p.size > 0) {
                    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                    gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${p.life})`);
                    gradient.addColorStop(0.5, `hsla(${p.hue + 30}, 100%, 50%, ${p.life * 0.5})`);
                    gradient.addColorStop(1, `hsla(${p.hue + 60}, 100%, 30%, 0)`);
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    fireParticles.splice(index, 1);
                }
            });
            
            if (this.phoenixActive) {
                requestAnimationFrame(animateFire);
            }
        };
        
        this.phoenixActive = true;
        animateFire();
        
        // End phoenix mode after 20 seconds
        setTimeout(() => {
            this.phoenixActive = false;
            fireCanvas.remove();
            phoenixWings.remove();
            document.body.classList.remove('phoenix-active');
        }, 20000);
    }
}

// Auto-initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait for main app to initialize
    setTimeout(() => {
        if (window.protocolApp) {
            const enhancements = new ProtocolEnhancements(window.protocolApp);
            window.protocolEnhancements = enhancements;
            console.log('✨ Protocol Enhanced! Try these commands: PROTOCOL, MATRIX, QUANTUM, GLITCH, NEXUS, AWAKEN, SOVEREIGN');
            console.log('🎮 Or press: ↑↑↓↓←→←→BA');
        } else {
            console.warn('Protocol app not found. Retrying...');
            setTimeout(() => {
                if (window.protocolApp) {
                    const enhancements = new ProtocolEnhancements(window.protocolApp);
                    window.protocolEnhancements = enhancements;
                }
            }, 2000);
        }
    }, 1000);
});

console.log('🔮 Protocol Enhancement Suite v2.0 Loaded');
