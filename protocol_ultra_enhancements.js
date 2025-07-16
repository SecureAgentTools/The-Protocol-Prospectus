// PROTOCOL ULTRA ENHANCEMENTS - DIMENSION BREACH EDITION
// THIS TAKES IT TO THE NEXT LEVEL!

class ProtocolUltraEnhancements {
    constructor() {
        this.portalActive = false;
        this.realityTearEffects = [];
        this.quantumFoam = null;
        this.singularityCore = null;
        this.dimensionalRift = null;
        
        console.log('⚡ ULTRA ENHANCEMENTS ACTIVATING...');
        this.init();
    }
    
    init() {
        // Wait for base systems
        setTimeout(() => {
            if (window.protocolApp && window.protocolApp.logoGroup) {
                this.activateUltraMode();
            } else {
                console.log('Waiting for base systems...');
                setTimeout(() => this.init(), 1000);
            }
        }, 2000);
    }
    
    activateUltraMode() {
        console.log('🌟 ULTRA MODE ENGAGED!');
        
        this.enhanceLogoToPortal();
        this.createQuantumFoam();
        this.addDimensionalRift();
        this.createEnergyTendrils();
        this.addHolographicInterface();
        this.createSingularityCore();
        this.addRealityDistortion();
        this.setupUltraInteractions();
        this.addCosmicBackground();
        
        // Add ultra badge
        this.addUltraBadge();
    }
    
    enhanceLogoToPortal() {
        // DISABLED - Removing blue vortex effects for better visibility
        return;
        
        // Original portal vortex code commented out
    }
    
    createQuantumFoam() {
        // DISABLED - Too much visual noise, reducing for better visibility
        return;
        
        // Original quantum foam code commented out
    }
    
    addDimensionalRift() {
        if (!window.protocolApp.scene) return;
        
        // Create rift in space-time
        const riftGeometry = new THREE.PlaneGeometry(50, 50, 50, 50);
        const riftMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                distortion: { value: 5 },
                mousePos: { value: new THREE.Vector2(0, 0) }
            },
            vertexShader: `
                uniform float time;
                uniform float distortion;
                varying vec2 vUv;
                varying float vDistortion;
                
                void main() {
                    vUv = uv;
                    vec3 pos = position;
                    
                    // Create ripples in space-time
                    float dist = length(uv - 0.5);
                    float ripple = sin(dist * 20.0 - time * 3.0) * distortion;
                    pos.z += ripple * (1.0 - dist);
                    
                    vDistortion = ripple;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec2 mousePos;
                varying vec2 vUv;
                varying float vDistortion;
                
                void main() {
                    vec2 uv = vUv;
                    
                    // Distort UV based on ripples
                    uv += vec2(sin(vDistortion * 0.1), cos(vDistortion * 0.1)) * 0.02;
                    
                    // Create dimensional tear effect
                    float tear = sin(uv.x * 50.0 + time * 2.0) * sin(uv.y * 50.0 - time * 2.0);
                    tear = smoothstep(0.0, 1.0, tear);
                    
                    vec3 color = vec3(0.0);
                    color.r = sin(uv.x * 10.0 + time) * 0.5 + 0.5;
                    color.g = sin(uv.y * 10.0 - time) * 0.5 + 0.5;
                    color.b = sin((uv.x + uv.y) * 10.0 + time * 2.0) * 0.5 + 0.5;
                    
                    // Add void effect
                    float voidEffect = 1.0 - length(uv - 0.5) * 2.0;
                    voidEffect = smoothstep(0.0, 1.0, voidEffect);
                    
                    color *= tear * voidEffect;
                    
                    gl_FragColor = vec4(color, tear * 0.5);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        
        const rift = new THREE.Mesh(riftGeometry, riftMaterial);
        rift.position.z = -200;
        rift.scale.setScalar(5);
        window.protocolApp.scene.add(rift);
        
        this.dimensionalRift = rift;
        
        // Animate rift
        let riftTime = 0;
        const animateRift = () => {
            riftTime += 0.01;
            if (this.dimensionalRift && this.dimensionalRift.material.uniforms) {
                this.dimensionalRift.material.uniforms.time.value = (window.protocolApp && window.protocolApp.time) || riftTime;
                if (window.protocolApp && window.protocolApp.mouse) {
                    this.dimensionalRift.material.uniforms.mousePos.value.set(
                        window.protocolApp.mouse.x,
                        window.protocolApp.mouse.y
                    );
                }
                this.dimensionalRift.rotation.z += 0.001;
            }
            requestAnimationFrame(animateRift);
        };
        animateRift();
    }
    
    createEnergyTendrils() {
        if (!window.protocolApp.logoGroup) return;
        
        const tendrilCount = 8;
        const tendrils = [];
        
        for (let i = 0; i < tendrilCount; i++) {
            const angle = (i / tendrilCount) * Math.PI * 2;
            
            // Create tendril curve
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(
                    Math.cos(angle) * 2,
                    Math.sin(angle) * 2,
                    Math.random() * 2 - 1
                ),
                new THREE.Vector3(
                    Math.cos(angle) * 4 + (Math.random() - 0.5) * 2,
                    Math.sin(angle) * 4 + (Math.random() - 0.5) * 2,
                    Math.random() * 4 - 2
                ),
                new THREE.Vector3(
                    Math.cos(angle) * 6 + (Math.random() - 0.5) * 4,
                    Math.sin(angle) * 6 + (Math.random() - 0.5) * 4,
                    Math.random() * 6 - 3
                )
            ]);
            
            const geometry = new THREE.TubeGeometry(curve, 50, 0.1, 8, false);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(i / tendrilCount, 1, 0.5),
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending
            });
            
            const tendril = new THREE.Mesh(geometry, material);
            window.protocolApp.logoGroup.add(tendril);
            
            tendrils.push({
                mesh: tendril,
                curve: curve,
                phase: i * (Math.PI * 2 / tendrilCount),
                speed: 0.5 + Math.random() * 0.5
            });
        }
        
        // Animate tendrils
        let tendrilTime = 0;
        const animateTendrils = () => {
            tendrilTime += 0.01;
            tendrils.forEach((tendril, i) => {
                const time = ((window.protocolApp && window.protocolApp.time) || tendrilTime) * tendril.speed;
                
                // Update curve points for organic movement
                const points = tendril.curve.points;
                for (let j = 1; j < points.length; j++) {
                    const offset = Math.sin(time + j * 0.5 + tendril.phase) * 0.2;
                    points[j].x += offset;
                    points[j].y += Math.cos(time + j * 0.5 + tendril.phase) * 0.2;
                }
                
                // Recreate geometry with new curve
                tendril.mesh.geometry.dispose();
                tendril.mesh.geometry = new THREE.TubeGeometry(tendril.curve, 50, 0.1, 8, false);
                
                // Pulse opacity
                tendril.mesh.material.opacity = 0.3 + Math.sin(time + tendril.phase) * 0.3;
            });
            
            requestAnimationFrame(animateTendrils);
        };
        animateTendrils();
    }
    
    addHolographicInterface() {
        // DISABLED - Removing cyan/blue holographic elements for cleaner view
        return;
        
        // Original holographic interface code commented out
    }
    
    createSingularityCore() {
        // DISABLED - Too distracting, removing the rotating disc effect
        return;
        
        // Original code commented out to remove the yellow/orange rotating disc
    }
    
    addRealityDistortion() {
        // Create reality distortion field
        const distortionShader = document.createElement('style');
        distortionShader.textContent = `
            @keyframes realityWarp {
                0% { filter: blur(0px) saturate(1); }
                25% { filter: blur(2px) saturate(2) hue-rotate(90deg); }
                50% { filter: blur(0px) saturate(1) hue-rotate(180deg); }
                75% { filter: blur(1px) saturate(3) hue-rotate(270deg); }
                100% { filter: blur(0px) saturate(1) hue-rotate(360deg); }
            }
            
            .reality-distorted {
                animation: realityWarp 10s ease-in-out infinite;
            }
            
            @keyframes dimensionalShift {
                0%, 100% { transform: perspective(1000px) rotateY(0deg); }
                50% { transform: perspective(1000px) rotateY(5deg); }
            }
            
            .dimensional-shift {
                animation: dimensionalShift 5s ease-in-out infinite;
            }
        `;
        document.head.appendChild(distortionShader);
    }
    
    setupUltraInteractions() {
        // Mouse trail with dimensional tears
        let mouseTrail = [];
        document.addEventListener('mousemove', (e) => {
            mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            mouseTrail = mouseTrail.filter(point => Date.now() - point.time < 1000);
            
            if (mouseTrail.length > 10 && Math.random() > 0.95) {
                this.createRealityTear(e.clientX, e.clientY);
            }
        });
        
        // Triple-click dimensional breach
        let clickCount = 0;
        let clickTimer;
        document.addEventListener('click', (e) => {
            clickCount++;
            clearTimeout(clickTimer);
            
            if (clickCount === 3) {
                this.triggerDimensionalBreach(e.clientX, e.clientY);
                clickCount = 0;
            }
            
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 500);
        });
        
        // Keyboard combinations for ultra features
        const keyBuffer = [];
        document.addEventListener('keydown', (e) => {
            keyBuffer.push(e.key);
            if (keyBuffer.length > 10) keyBuffer.shift();
            
            // Check for "TRANSCEND"
            if (keyBuffer.join('').toUpperCase().includes('TRANSCEND')) {
                this.activateTranscendenceMode();
                keyBuffer.length = 0;
            }
            
            // Check for "INFINITY"
            if (keyBuffer.join('').toUpperCase().includes('INFINITY')) {
                this.unlockInfinityMode();
                keyBuffer.length = 0;
            }
        });
    }
    
    createRealityTear(x, y) {
        const tear = document.createElement('div');
        tear.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 2px;
            height: 50px;
            background: linear-gradient(transparent, white, transparent);
            transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg);
            pointer-events: none;
            z-index: 9999;
            animation: tearExpand 0.5s ease-out forwards;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes tearExpand {
                0% { 
                    height: 0px;
                    opacity: 0;
                    filter: blur(0px);
                }
                50% {
                    height: 100px;
                    opacity: 1;
                    filter: blur(2px) brightness(2);
                }
                100% {
                    height: 0px;
                    opacity: 0;
                    filter: blur(5px);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(tear);
        
        setTimeout(() => tear.remove(), 500);
    }
    
    triggerDimensionalBreach(x, y) {
        console.log('🌌 DIMENSIONAL BREACH DETECTED!');
        
        const breach = document.createElement('div');
        breach.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 300px;
            height: 300px;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9999;
        `;
        
        breach.innerHTML = `
            <svg width="300" height="300">
                <defs>
                    <radialGradient id="breachGrad">
                        <stop offset="0%" style="stop-color:white;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:cyan;stop-opacity:0.5" />
                        <stop offset="100%" style="stop-color:transparent;stop-opacity:0" />
                    </radialGradient>
                    <filter id="breachDistort">
                        <feTurbulence baseFrequency="0.02" numOctaves="3" />
                        <feDisplacementMap in="SourceGraphic" scale="20" />
                    </filter>
                </defs>
                <circle cx="150" cy="150" r="150" fill="url(#breachGrad)" filter="url(#breachDistort)">
                    <animate attributeName="r" from="0" to="150" dur="1s" />
                    <animateTransform attributeName="transform" type="rotate" 
                        from="0 150 150" to="360 150 150" dur="2s" repeatCount="indefinite" />
                </circle>
            </svg>
        `;
        
        document.body.appendChild(breach);
        
        // Distort reality around breach
        document.body.classList.add('reality-distorted');
        
        setTimeout(() => {
            breach.remove();
            document.body.classList.remove('reality-distorted');
        }, 3000);
    }
    
    activateTranscendenceMode() {
        console.log('✨ TRANSCENDENCE MODE ACTIVATED!');
        
        // Create transcendent overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, 
                rgba(255,255,255,0) 0%, 
                rgba(255,255,255,0.2) 50%, 
                rgba(255,255,255,0.8) 100%);
            z-index: 9998;
            pointer-events: none;
            animation: transcend 5s ease-out forwards;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes transcend {
                0% { 
                    opacity: 0;
                    transform: scale(0);
                }
                50% {
                    opacity: 1;
                    transform: scale(1.5);
                }
                100% {
                    opacity: 0;
                    transform: scale(3);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Elevate consciousness
        document.body.style.filter = 'brightness(2) contrast(2)';
        
        setTimeout(() => {
            overlay.remove();
            document.body.style.filter = '';
        }, 5000);
    }
    
    unlockInfinityMode() {
        console.log('∞ INFINITY MODE UNLOCKED!');
        
        // Create infinite recursion effect
        const infinityContainer = document.createElement('div');
        infinityContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 80%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9997;
            pointer-events: none;
        `;
        
        // Create nested frames
        let currentFrame = infinityContainer;
        for (let i = 0; i < 10; i++) {
            const frame = document.createElement('div');
            frame.style.cssText = `
                width: 80%;
                height: 80%;
                border: 2px solid rgba(255, 0, 0, ${1 - i * 0.1});
                display: flex;
                align-items: center;
                justify-content: center;
                animation: infiniteRotate ${2 + i * 0.5}s linear infinite;
            `;
            currentFrame.appendChild(frame);
            currentFrame = frame;
        }
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes infiniteRotate {
                from { transform: rotate(0deg) scale(1); }
                to { transform: rotate(360deg) scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(infinityContainer);
        
        setTimeout(() => infinityContainer.remove(), 10000);
    }
    
    addCosmicBackground() {
        // Add deep space background
        const cosmicCanvas = document.createElement('canvas');
        cosmicCanvas.id = 'cosmic-background';
        cosmicCanvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.5;
        `;
        document.body.insertBefore(cosmicCanvas, document.body.firstChild);
        
        const ctx = cosmicCanvas.getContext('2d');
        cosmicCanvas.width = window.innerWidth;
        cosmicCanvas.height = window.innerHeight;
        
        // Create nebula clouds
        const createNebula = () => {
            const gradient = ctx.createRadialGradient(
                Math.random() * cosmicCanvas.width,
                Math.random() * cosmicCanvas.height,
                0,
                cosmicCanvas.width / 2,
                cosmicCanvas.height / 2,
                cosmicCanvas.width
            );
            
            const hue = Math.random() * 360;
            gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.1)`);
            gradient.addColorStop(0.5, `hsla(${hue + 60}, 100%, 30%, 0.05)`);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, cosmicCanvas.width, cosmicCanvas.height);
        };
        
        // Layer multiple nebulae
        for (let i = 0; i < 5; i++) {
            createNebula();
        }
    }
    
    addUltraBadge() {
        const badge = document.createElement('div');
        badge.innerHTML = '⚡ ULTRA';
        badge.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: linear-gradient(45deg, #ff0000, #00ff00, #0000ff);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            z-index: 10000;
            animation: ultraPulse 2s ease-in-out infinite;
            cursor: pointer;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ultraPulse {
                0%, 100% { 
                    transform: scale(1);
                    box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
                }
                50% { 
                    transform: scale(1.1);
                    box-shadow: 0 0 40px rgba(255, 255, 255, 0.8);
                }
            }
        `;
        document.head.appendChild(style);
        
        badge.title = 'ULTRA MODE ACTIVE - Try: TRANSCEND, INFINITY, Triple-click';
        badge.addEventListener('click', () => {
            console.log('⚡ ULTRA FEATURES:');
            console.log('- Type "TRANSCEND" for Transcendence Mode');
            console.log('- Type "INFINITY" for Infinity Mode');
            console.log('- Triple-click for Dimensional Breach');
            console.log('- Move mouse rapidly for Reality Tears');
        });
        
        document.body.appendChild(badge);
    }
}

// Initialize Ultra Enhancements
const ultraEnhancements = new ProtocolUltraEnhancements();

console.log('🌟 PROTOCOL ULTRA ENHANCEMENTS LOADED!');
console.log('🔥 THE FUTURE IS NOW!');
