// PROTOCOL COUNTDOWN 3D ENHANCEMENT - MAXIMUM IMPACT EDITION
// This adds insane 3D effects to the countdown without breaking existing functionality

class ProtocolCountdown3D {
    constructor() {
        this.countdownDigits = {};
        this.init();
    }

    init() {
        // Wait for main app to be ready
        setTimeout(() => {
            if (window.protocolApp) {
                this.enhance3DCountdown();
                this.addHolographicProjection();
                this.addEnergyParticles();
                this.addGlitchEffects();
            } else {
                setTimeout(() => this.init(), 500);
            }
        }, 1000);
    }

    enhance3DCountdown() {
        // Add 3D transformation to countdown container
        const countdownContainer = document.getElementById('countdown');
        if (!countdownContainer) return;

        // Create 3D perspective wrapper
        const wrapper3D = document.createElement('div');
        wrapper3D.className = 'countdown-3d-wrapper';
        wrapper3D.style.cssText = `
            position: relative;
            transform-style: preserve-3d;
            perspective: 1000px;
        `;

        // Wrap existing countdown
        countdownContainer.parentNode.insertBefore(wrapper3D, countdownContainer);
        wrapper3D.appendChild(countdownContainer);

        // Enhance each countdown unit
        const units = countdownContainer.querySelectorAll('.countdown-unit');
        units.forEach((unit, index) => {
            const value = unit.querySelector('.countdown-value');
            if (!value) return;

            // Create 3D layers for depth effect
            this.create3DLayers(value, index);
            
            // Add hover effects
            unit.addEventListener('mouseenter', () => {
                unit.style.transform = 'translateZ(50px) scale(1.15)';
                this.createEnergyBurst(unit);
            });
            
            unit.addEventListener('mouseleave', () => {
                unit.style.transform = 'translateZ(0) scale(1)';
            });
        });

        // Add global 3D rotation based on mouse
        document.addEventListener('mousemove', (e) => {
            if (countdownContainer && window.protocolApp) {
                const x = (e.clientX / window.innerWidth - 0.5) * 10;
                const y = (e.clientY / window.innerHeight - 0.5) * -10;
                countdownContainer.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
            }
        });
    }

    create3DLayers(element, index) {
        const text = element.textContent;
        element.style.position = 'relative';
        element.style.transformStyle = 'preserve-3d';

        // Create multiple layers for 3D depth
        const layers = 5;
        for (let i = 1; i <= layers; i++) {
            const layer = document.createElement('div');
            layer.className = `countdown-layer-${i}`;
            layer.textContent = text;
            layer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                color: rgba(255, 0, 0, ${0.3 - i * 0.05});
                transform: translateZ(${-i * 3}px);
                text-shadow: 
                    0 0 ${10 + i * 5}px rgba(255, 0, 0, ${0.4 - i * 0.05}),
                    0 0 ${20 + i * 10}px rgba(255, 0, 0, ${0.2 - i * 0.03});
                pointer-events: none;
                font-size: inherit;
                font-weight: inherit;
                line-height: inherit;
                text-align: center;
            `;
            element.appendChild(layer);
        }

        // Observe changes to update layers
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const newText = element.childNodes[0].textContent;
                    element.querySelectorAll('[class^="countdown-layer-"]').forEach(layer => {
                        layer.textContent = newText;
                    });
                    
                    // Trigger change animation
                    this.animateDigitChange(element, index);
                }
            });
        });

        observer.observe(element, { childList: true, characterData: true, subtree: true });
    }

    animateDigitChange(element, index) {
        // Create explosion effect on digit change
        element.style.animation = `digitFlip3D 0.6s ease-out`;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes digitFlip3D {
                0% { 
                    transform: rotateX(0deg) scale(1);
                    filter: brightness(1);
                }
                25% { 
                    transform: rotateX(-90deg) scale(1.2);
                    filter: brightness(2) blur(2px);
                }
                50% { 
                    transform: rotateX(-180deg) scale(1.3);
                    filter: brightness(3) blur(1px);
                }
                75% { 
                    transform: rotateX(-270deg) scale(1.1);
                    filter: brightness(1.5) blur(0px);
                }
                100% { 
                    transform: rotateX(-360deg) scale(1);
                    filter: brightness(1);
                }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
        
        // Create particle burst
        this.createDigitParticles(element);
    }

    createDigitParticles(element) {
        const rect = element.getBoundingClientRect();
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'digit-particle';
            particle.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, #fff 0%, #ff0000 50%, transparent 100%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
            `;
            
            document.body.appendChild(particle);
            
            // Animate particle
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 5 + Math.random() * 10;
            const lifetime = 1000 + Math.random() * 500;
            
            let x = 0, y = 0;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            let opacity = 1;
            
            const animate = () => {
                x += vx;
                y += vy;
                opacity -= 1 / (lifetime / 16);
                
                particle.style.transform = `translate(${x}px, ${y}px)`;
                particle.style.opacity = Math.max(0, opacity);
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }

    addHolographicProjection() {
        // DISABLED - Too distracting
        return;
        
        // Original code commented out
        /*
        // Create holographic projection above countdown
        const holoProjector = document.createElement('div');
        // ... rest of code
        */
    }

    addEnergyParticles() {
        // DISABLED - Removing the yellow rotating energy particles
        return;
        
        // Original energy particles code commented out
    }

    addGlitchEffects() {
        // Add random glitch effects to countdown
        setInterval(() => {
            if (Math.random() > 0.95) {
                const units = document.querySelectorAll('.countdown-value');
                const randomUnit = units[Math.floor(Math.random() * units.length)];
                
                if (randomUnit) {
                    this.glitchDigit(randomUnit);
                }
            }
        }, 2000);
    }

    glitchDigit(element) {
        const originalText = element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
        
        let glitchCount = 0;
        const glitchInterval = setInterval(() => {
            if (glitchCount < 5) {
                element.textContent = glitchChars[Math.floor(Math.random() * glitchChars.length)] + 
                                     glitchChars[Math.floor(Math.random() * glitchChars.length)];
                element.style.filter = `hue-rotate(${Math.random() * 360}deg) brightness(2)`;
                glitchCount++;
            } else {
                clearInterval(glitchInterval);
                element.textContent = originalText;
                element.style.filter = '';
            }
        }, 50);
    }

    createEnergyBurst(element) {
        const rect = element.getBoundingClientRect();
        const burst = document.createElement('div');
        burst.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            width: 100px;
            height: 100px;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 10000;
        `;
        
        burst.innerHTML = `
            <svg width="100" height="100">
                <circle cx="50" cy="50" r="5" fill="none" stroke="#ff0000" stroke-width="2">
                    <animate attributeName="r" from="5" to="50" dur="0.5s" />
                    <animate attributeName="stroke-opacity" from="1" to="0" dur="0.5s" />
                </circle>
                <circle cx="50" cy="50" r="5" fill="none" stroke="#ff6600" stroke-width="1">
                    <animate attributeName="r" from="5" to="45" dur="0.5s" begin="0.1s" />
                    <animate attributeName="stroke-opacity" from="0.8" to="0" dur="0.5s" begin="0.1s" />
                </circle>
            </svg>
        `;
        
        document.body.appendChild(burst);
        setTimeout(() => burst.remove(), 600);
    }
}

// Initialize 3D countdown enhancement
document.addEventListener('DOMContentLoaded', () => {
    const countdown3D = new ProtocolCountdown3D();
    window.protocolCountdown3D = countdown3D;
});

console.log('🚀 Protocol Countdown 3D Enhancement Loaded!');
