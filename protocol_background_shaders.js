// PROTOCOL BACKGROUND SHADERS - OMINOUS VOID
// Dark, scary background with minimal red-accented starfield

class BackgroundShaderEnhancement {
    constructor() {
        this.shaderMaterial = null;
        this.time = 0;
        this.mouse = { x: 0, y: 0 };
        this.redFrames = [];
        this.voidParticles = [];
        
        this.init();
    }

    init() {
        // Wait for main app
        setTimeout(() => {
            this.enhanceBackground();
            this.createRedFrames();
            this.createVoidParticles();
        }, 500);
    }

    enhanceBackground() {
        // Get the main app scene
        if (!window.protocolApp || !window.protocolApp.scene) {
            console.warn('Waiting for main scene...');
            setTimeout(() => this.enhanceBackground(), 500);
            return;
        }

        // Create ominous background shader
        this.createOminousShader();
        
        // Setup mouse tracking
        this.setupMouseTracking();
    }

    createOminousShader() {
        const scene = window.protocolApp.scene;
        
        // Dark, ominous shader material
        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                mouse: { value: new THREE.Vector2(0, 0) },
                parallaxOffset: { value: new THREE.Vector2(0, 0) },
                danger: { value: 1.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec2 resolution;
                uniform vec2 mouse;
                uniform vec2 parallaxOffset;
                uniform float danger;
                varying vec2 vUv;
                
                // Hash function
                float hash(vec2 p) {
                    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
                }
                
                // 3D noise
                float noise(vec3 p) {
                    vec3 i = floor(p);
                    vec3 f = fract(p);
                    f = f * f * (3.0 - 2.0 * f);
                    
                    float n = i.x + i.y * 57.0 + 113.0 * i.z;
                    return mix(
                        mix(
                            mix(hash(vec2(n, n + 1.0)), hash(vec2(n + 1.0, n + 1.0)), f.x),
                            mix(hash(vec2(n + 57.0, n + 58.0)), hash(vec2(n + 58.0, n + 58.0)), f.x),
                            f.y
                        ),
                        mix(
                            mix(hash(vec2(n + 113.0, n + 114.0)), hash(vec2(n + 114.0, n + 114.0)), f.x),
                            mix(hash(vec2(n + 170.0, n + 171.0)), hash(vec2(n + 171.0, n + 171.0)), f.x),
                            f.y
                        ),
                        f.z
                    );
                }
                
                // Minimal starfield - mostly darkness
                vec3 darkStarfield(vec2 uv) {
                    vec3 stars = vec3(0.0);
                    
                    // Apply parallax
                    uv += parallaxOffset * 0.05;
                    
                    // Very sparse stars
                    vec2 cellSize = vec2(0.2);
                    vec2 cell = floor(uv / cellSize);
                    vec2 cellUv = fract(uv / cellSize);
                    
                    // Rare stars
                    if (hash(cell) > 0.98) {
                        vec2 starPos = vec2(hash(cell + 1.0), hash(cell + 2.0));
                        float dist = length(cellUv - starPos);
                        
                        float brightness = hash(cell + 3.0) * 0.3;
                        float size = 0.001;
                        
                        float star = 1.0 - smoothstep(0.0, size, dist);
                        star = pow(star, 4.0) * brightness;
                        
                        // Red tinted stars
                        stars = vec3(star, star * 0.3, star * 0.3);
                    }
                    
                    return stars;
                }
                
                // Blood fog
                vec3 bloodFog(vec2 uv) {
                    float fog = noise(vec3(uv * 1.5, time * 0.02));
                    fog = smoothstep(0.5, 0.7, fog);
                    
                    // Blood red color
                    vec3 bloodColor = vec3(0.2, 0.0, 0.0);
                    
                    // Pulsing intensity
                    float pulse = sin(time * 0.5) * 0.5 + 0.5;
                    
                    return bloodColor * fog * (0.05 + pulse * 0.02);
                }
                
                // Lightning strikes
                vec3 redLightning(vec2 uv) {
                    vec3 lightning = vec3(0.0);
                    
                    // Random lightning bolts
                    float bolt = 0.0;
                    for (int i = 0; i < 3; i++) {
                        float id = float(i);
                        float offset = id * 3.14159;
                        
                        // Lightning path
                        float x = sin(uv.y * 30.0 + time * 15.0 + offset) * 0.1;
                        float dist = abs(uv.x - x - sin(time + offset) * 0.5);
                        
                        // Random strikes
                        float strike = sin(time * 10.0 + offset * 7.0);
                        if (strike > 0.98) {
                            bolt += 1.0 / (1.0 + dist * 100.0);
                        }
                    }
                    
                    lightning = vec3(1.0, 0.0, 0.0) * bolt;
                    
                    return lightning;
                }
                
                void main() {
                    vec2 uv = vUv * 2.0 - 1.0;
                    uv.x *= resolution.x / resolution.y;
                    
                    // Pure black void base
                    vec3 color = vec3(0.0);
                    
                    // Subtle blood pools in the void
                    float voidDepth = length(uv) * 0.5;
                    vec3 voidGradient = vec3(0.05, 0.0, 0.0) * (1.0 - voidDepth);
                    color += voidGradient * 0.1;
                    
                    // Minimal stars
                    color += darkStarfield(uv * 3.0) * 0.5;
                    
                    // Blood fog
                    color += bloodFog(uv);
                    
                    // Occasional red lightning
                    color += redLightning(uv) * 0.7;
                    
                    // Mouse interaction - red void opens
                    float mouseDist = length(uv - mouse);
                    float voidHole = 1.0 / (1.0 + mouseDist * mouseDist * 20.0);
                    color -= vec3(0.0, 0.1, 0.1) * voidHole * 0.3; // Darker around mouse
                    color += vec3(0.3, 0.0, 0.0) * voidHole * 0.1; // Red glow edge
                    
                    // Heavy vignette - closes in on viewer
                    float vignette = 1.0 - length(uv) * 0.5;
                    vignette = smoothstep(0.0, 1.0, vignette);
                    color *= vignette;
                    
                    // Crush the blacks - reduced for better visibility
                    color = pow(color, vec3(1.2));
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            depthWrite: false
        });

        // Replace existing background
        scene.traverse((child) => {
            if (child.isMesh && child.material && child.material.uniforms && child.material.uniforms.time) {
                child.material = this.shaderMaterial;
            }
        });

        // Start animation
        this.animate();
    }

    createRedFrames() {
        // Create the red frames that move with mouse (as user liked)
        const frameGeometry = new THREE.PlaneGeometry(2, 2);
        const frameMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                mouse: { value: new THREE.Vector2(0, 0) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec2 mouse;
                varying vec2 vUv;
                
                void main() {
                    vec2 uv = vUv * 2.0 - 1.0;
                    
                    // Frame boundaries with mouse offset
                    vec2 offset = mouse * 0.1;
                    float frame = 0.0;
                    
                    // Create frame edges
                    float thickness = 0.01;
                    float inner = 0.8;
                    
                    // Horizontal edges
                    if (abs(uv.y + offset.y) > inner && abs(uv.y + offset.y) < inner + thickness) {
                        frame = 1.0;
                    }
                    // Vertical edges
                    if (abs(uv.x + offset.x) > inner && abs(uv.x + offset.x) < inner + thickness) {
                        frame = 1.0;
                    }
                    
                    // Pulsing red glow
                    vec3 color = vec3(1.0, 0.0, 0.0) * frame;
                    color *= 0.5 + sin(time * 2.0) * 0.5;
                    
                    gl_FragColor = vec4(color, frame * 0.5);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
        frameMesh.position.z = -50;
        
        if (window.protocolApp && window.protocolApp.scene) {
            window.protocolApp.scene.add(frameMesh);
            this.redFrames.push(frameMesh);
        }
    }

    createVoidParticles() {
        // Dark void particles that drift ominously
        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random position
            positions[i3] = (Math.random() - 0.5) * 500;
            positions[i3 + 1] = (Math.random() - 0.5) * 500;
            positions[i3 + 2] = -Math.random() * 200 - 50;
            
            // Dark red color
            colors[i3] = 0.3;
            colors[i3 + 1] = 0;
            colors[i3 + 2] = 0;
            
            // Random size
            sizes[i] = Math.random() * 5 + 1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (200.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec3 vColor;
                
                void main() {
                    vec2 center = gl_PointCoord - 0.5;
                    float dist = length(center);
                    
                    if (dist > 0.5) discard;
                    
                    // Dark smoky particles
                    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                    alpha *= 0.3;
                    
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.NormalBlending
        });

        const particles = new THREE.Points(geometry, material);
        particles.userData.isVoidParticle = true;
        
        if (window.protocolApp && window.protocolApp.scene) {
            window.protocolApp.scene.add(particles);
            this.voidParticles.push(particles);
        }
    }

    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.01;
        
        // Update shader uniforms
        if (this.shaderMaterial) {
            this.shaderMaterial.uniforms.time.value = this.time;
            this.shaderMaterial.uniforms.mouse.value.set(this.mouse.x, this.mouse.y);
            this.shaderMaterial.uniforms.parallaxOffset.value.set(
                this.mouse.x * 0.02,
                this.mouse.y * 0.02
            );
        }
        
        // Update red frames
        this.redFrames.forEach(frame => {
            if (frame.material && frame.material.uniforms) {
                frame.material.uniforms.time.value = this.time;
                frame.material.uniforms.mouse.value.set(this.mouse.x, this.mouse.y);
            }
        });
        
        // Update void particles - slow ominous drift
        this.voidParticles.forEach(particleSystem => {
            if (particleSystem.material && particleSystem.material.uniforms) {
                particleSystem.material.uniforms.time.value = this.time;
            }
            
            // Slow rotation
            particleSystem.rotation.y += 0.0002;
            
            // Float particles upward slowly
            const positions = particleSystem.geometry.attributes.position.array;
            for (let i = 1; i < positions.length; i += 3) {
                positions[i] += 0.1;
                if (positions[i] > 250) {
                    positions[i] = -250;
                }
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BackgroundShaderEnhancement();
    });
} else {
    new BackgroundShaderEnhancement();
}
