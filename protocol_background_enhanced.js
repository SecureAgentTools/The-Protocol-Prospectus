// PROTOCOL BACKGROUND ENHANCEMENT - REACTIVE DEPTH EDITION
// This supercharges the background with reactive elements and parallax depth

class ProtocolBackgroundEnhanced {
    constructor() {
        this.layers = [];
        this.realityTears = [];
        this.scanLines = null;
        this.init();
    }

    init() {
        // Wait for main app
        setTimeout(() => {
            if (window.protocolApp && window.protocolApp.scene) {
                this.enhanceBackground();
                this.addDepthLayers();
                this.addReactiveMouse();
                this.addRandomTears();
                this.addCyberScanLines();
                this.addFloatingSymbols();
            } else {
                setTimeout(() => this.init(), 500);
            }
        }, 1000);
    }

    enhanceBackground() {
        // Create enhanced background container
        const bgContainer = document.createElement('div');
        bgContainer.id = 'enhanced-background';
        bgContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
            overflow: hidden;
            background: #000;
        `;
        document.body.insertBefore(bgContainer, document.body.firstChild);
    }

    addDepthLayers() {
        // Create multiple parallax layers
        const layerConfigs = [
            { depth: 0.1, opacity: 0.1, color: '#ff0000', count: 20, size: 2 },
            { depth: 0.3, opacity: 0.08, color: '#990000', count: 15, size: 3 },
            { depth: 0.5, opacity: 0.06, color: '#660000', count: 10, size: 4 },
            { depth: 0.8, opacity: 0.04, color: '#330000', count: 5, size: 6 },
            { depth: 1.0, opacity: 0.02, color: '#110000', count: 3, size: 8 }
        ];

        layerConfigs.forEach((config, index) => {
            const layer = this.createParallaxLayer(config, index);
            this.layers.push(layer);
        });

        // Animate layers based on mouse
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            this.layers.forEach(layer => {
                const offsetX = x * layer.config.depth * 50;
                const offsetY = y * layer.config.depth * 50;
                layer.element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
        });
    }

    createParallaxLayer(config, index) {
        const layer = document.createElement('div');
        layer.className = `parallax-layer-${index}`;
        layer.style.cssText = `
            position: absolute;
            top: -10%;
            left: -10%;
            width: 120%;
            height: 120%;
            transition: transform 0.3s ease-out;
            will-change: transform;
        `;

        // Create particles for this layer
        for (let i = 0; i < config.count; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                width: ${config.size}px;
                height: ${config.size}px;
                background: ${config.color};
                opacity: ${config.opacity};
                border-radius: 50%;
                box-shadow: 0 0 ${config.size * 2}px ${config.color};
                animation: float${index} ${10 + Math.random() * 20}s ease-in-out infinite;
                animation-delay: ${Math.random() * 10}s;
            `;
            layer.appendChild(particle);
        }

        // Add floating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float${index} {
                0%, 100% { 
                    transform: translate(0, 0) scale(1);
                    opacity: ${config.opacity};
                }
                33% { 
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.2);
                    opacity: ${config.opacity * 1.5};
                }
                66% { 
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0.8);
                    opacity: ${config.opacity * 0.5};
                }
            }
        `;
        document.head.appendChild(style);

        document.getElementById('enhanced-background').appendChild(layer);

        return { element: layer, config };
    }

    addReactiveMouse() {
        // Create reactive wave effect following mouse
        const waveCanvas = document.createElement('canvas');
        waveCanvas.id = 'reactive-waves';
        waveCanvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.2;
        `;
        document.getElementById('enhanced-background').appendChild(waveCanvas);

        const ctx = waveCanvas.getContext('2d');
        waveCanvas.width = window.innerWidth;
        waveCanvas.height = window.innerHeight;

        const waves = [];
        let mouseX = 0, mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Create new wave
            if (waves.length < 10) {
                waves.push({
                    x: mouseX,
                    y: mouseY,
                    radius: 0,
                    maxRadius: 200,
                    speed: 5,
                    opacity: 1
                });
            }
        });

        // Animate waves
        const animateWaves = () => {
            // Clear canvas completely without dark overlay
            ctx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);

            waves.forEach((wave, index) => {
                wave.radius += wave.speed;
                wave.opacity = 1 - (wave.radius / wave.maxRadius);

                if (wave.opacity > 0) {
                    ctx.strokeStyle = `rgba(255, 0, 0, ${wave.opacity * 0.3})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
                    ctx.stroke();

                    // Inner glow
                    const gradient = ctx.createRadialGradient(
                        wave.x, wave.y, wave.radius * 0.8,
                        wave.x, wave.y, wave.radius
                    );
                    gradient.addColorStop(0, `rgba(255, 0, 0, 0)`);
                    gradient.addColorStop(1, `rgba(255, 0, 0, ${wave.opacity * 0.2})`);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                } else {
                    waves.splice(index, 1);
                }
            });

            requestAnimationFrame(animateWaves);
        };
        animateWaves();
    }

    addRandomTears() {
        // Create random reality tears in background
        setInterval(() => {
            if (Math.random() > 0.9 && this.realityTears.length < 5) {
                this.createBackgroundTear();
            }
        }, 3000);
    }

    createBackgroundTear() {
        const tear = document.createElement('div');
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const width = 2 + Math.random() * 4;
        const height = 50 + Math.random() * 150;
        const rotation = Math.random() * 360;

        tear.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${width}px;
            height: ${height}px;
            background: linear-gradient(
                0deg,
                transparent 0%,
                rgba(255, 255, 255, 0.1) 10%,
                rgba(255, 255, 255, 0.5) 50%,
                rgba(255, 255, 255, 0.1) 90%,
                transparent 100%
            );
            transform: translate(-50%, -50%) rotate(${rotation}deg);
            pointer-events: none;
            z-index: -1;
            filter: blur(1px);
            animation: tearLife 3s ease-out forwards;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes tearLife {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) rotate(${rotation}deg) scaleY(0.1);
                    filter: blur(3px) brightness(2);
                }
                50% {
                    opacity: 1;
                    transform: translate(-50%, -50%) rotate(${rotation}deg) scaleY(1);
                    filter: blur(1px) brightness(1.5);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -50%) rotate(${rotation}deg) scaleY(0.5);
                    filter: blur(5px) brightness(0.5);
                }
            }
        `;
        document.head.appendChild(style);

        document.getElementById('enhanced-background').appendChild(tear);
        this.realityTears.push(tear);

        setTimeout(() => {
            tear.remove();
            this.realityTears = this.realityTears.filter(t => t !== tear);
        }, 3000);
    }

    addCyberScanLines() {
        // Create cyberpunk-style scan lines
        const scanContainer = document.createElement('div');
        scanContainer.id = 'cyber-scan-lines';
        scanContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.02;
            mix-blend-mode: overlay;
        `;

        // Horizontal scan lines
        const horizontalScans = document.createElement('div');
        horizontalScans.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255, 0, 0, 0.1) 2px,
                rgba(255, 0, 0, 0.1) 3px
            );
            animation: scanMove 10s linear infinite;
        `;

        // Vertical interference
        const verticalInterference = document.createElement('div');
        verticalInterference.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                90deg,
                transparent,
                transparent 100px,
                rgba(255, 0, 0, 0.05) 100px,
                rgba(255, 0, 0, 0.05) 101px
            );
            animation: interferenceMove 5s linear infinite;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes scanMove {
                0% { transform: translateY(0); }
                100% { transform: translateY(10px); }
            }
            
            @keyframes interferenceMove {
                0% { transform: translateX(0); }
                100% { transform: translateX(100px); }
            }
        `;
        document.head.appendChild(style);

        scanContainer.appendChild(horizontalScans);
        scanContainer.appendChild(verticalInterference);
        document.getElementById('enhanced-background').appendChild(scanContainer);
        this.scanLines = scanContainer;
    }

    addFloatingSymbols() {
        // Create floating Protocol symbols
        const symbols = ['⟨', '⟩', '◊', '▽', '△', '◈', '⬡', '⬢'];
        const symbolContainer = document.createElement('div');
        symbolContainer.id = 'floating-symbols';
        symbolContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;

        // Create floating symbols
        for (let i = 0; i < 20; i++) {
            const symbol = document.createElement('div');
            symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            symbol.className = `floating-symbol-${i}`;
            symbol.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                font-size: ${20 + Math.random() * 40}px;
                color: rgba(255, 0, 0, ${0.1 + Math.random() * 0.2});
                text-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
                animation: 
                    floatSymbol ${20 + Math.random() * 30}s ease-in-out infinite,
                    rotateSymbol ${15 + Math.random() * 20}s linear infinite;
                animation-delay: ${Math.random() * 20}s;
                font-family: monospace;
            `;
            symbolContainer.appendChild(symbol);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatSymbol {
                0%, 100% {
                    transform: translate(0, 0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                50% {
                    transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px);
                    opacity: 0.5;
                }
                90% {
                    opacity: 1;
                }
            }
            
            @keyframes rotateSymbol {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        document.getElementById('enhanced-background').appendChild(symbolContainer);
    }
}

// Initialize enhanced background
document.addEventListener('DOMContentLoaded', () => {
    const bgEnhanced = new ProtocolBackgroundEnhanced();
    window.protocolBgEnhanced = bgEnhanced;
});

console.log('🌌 Protocol Background Enhancement Loaded!');
