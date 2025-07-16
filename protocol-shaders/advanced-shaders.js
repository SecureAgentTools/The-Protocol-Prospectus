// Advanced Shader Collection for The Protocol Logo
// These shaders create mind-bending visual effects

const ProtocolShaders = {
    // Quantum Entanglement Shader
    quantumEntanglement: {
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;
            varying vec3 vWorldPosition;
            
            uniform float time;
            uniform float index;
            uniform float entanglementStrength;
            
            // Quantum fluctuation
            vec3 quantumDisplacement(vec3 pos, float t) {
                float quantum = sin(pos.x * 10.0 + t * 3.0) * 
                               cos(pos.y * 10.0 - t * 2.0) * 
                               sin(pos.z * 10.0 + t * 4.0);
                return normalize(pos) * quantum * 0.1;
            }
            
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                
                vec3 pos = position;
                
                // Quantum entanglement effect
                vec3 entanglement = quantumDisplacement(pos, time + index);
                pos += entanglement * entanglementStrength;
                
                // Wave function collapse
                float collapse = sin(time * 2.0 + length(pos) * 5.0) * 0.05;
                pos *= 1.0 + collapse;
                
                vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                vWorldPosition = worldPos.xyz;
                
                gl_Position = projectionMatrix * viewMatrix * worldPos;
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform float index;
            uniform vec2 mousePos;
            uniform vec3 baseColor;
            uniform vec2 resolution;
            uniform float entanglementStrength;
            
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;
            varying vec3 vWorldPosition;
            
            // Quantum field visualization
            vec3 quantumField(vec3 pos, float t) {
                float field = 0.0;
                
                // Multiple quantum states
                for(int i = 0; i < 5; i++) {
                    float phase = float(i) * 1.256;
                    field += sin(pos.x * (10.0 + float(i)) + t + phase) *
                            cos(pos.y * (10.0 - float(i)) - t + phase) *
                            sin(pos.z * (10.0 + float(i)) + t + phase);
                }
                
                field = abs(field) / 5.0;
                
                // Quantum colors
                vec3 color1 = vec3(0.0, 1.0, 1.0); // Cyan
                vec3 color2 = vec3(1.0, 0.0, 1.0); // Magenta
                vec3 color3 = vec3(1.0, 1.0, 0.0); // Yellow
                
                vec3 quantumColor = mix(color1, color2, sin(field * 3.14159));
                quantumColor = mix(quantumColor, color3, cos(field * 3.14159 * 0.5));
                
                return quantumColor * field;
            }
            
            void main() {
                vec3 normal = normalize(vNormal);
                vec3 viewDir = normalize(cameraPosition - vWorldPosition);
                
                // Base color with quantum interference
                vec3 color = baseColor;
                
                // Quantum field overlay
                vec3 quantum = quantumField(vWorldPosition * 0.5, time);
                color = mix(color, quantum, entanglementStrength * 0.5);
                
                // Fresnel with quantum uncertainty
                float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.0);
                fresnel *= 1.0 + sin(time * 10.0 + vWorldPosition.y * 20.0) * 0.2;
                
                // Entanglement visualization
                float entangle = sin(vWorldPosition.x * 20.0 + time * 5.0) *
                                cos(vWorldPosition.y * 20.0 - time * 3.0) *
                                sin(vWorldPosition.z * 20.0 + time * 4.0);
                entangle = abs(entangle);
                
                color += vec3(0.5, 0.8, 1.0) * entangle * entanglementStrength;
                
                // Holographic interference patterns
                float interference = sin(dot(vWorldPosition, vec3(1.0)) * 50.0 + time * 5.0);
                color += baseColor * interference * 0.1 * fresnel;
                
                // Glow
                color += baseColor * fresnel * 1.5;
                
                // Output with alpha
                gl_FragColor = vec4(color, 0.9 + fresnel * 0.1);
            }
        `
    },

    // Neural Network Visualization Shader
    neuralNetwork: {
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;
            varying vec3 vWorldPosition;
            varying float vNeuronActivity;
            
            uniform float time;
            uniform float index;
            uniform float networkActivity;
            
            // Simulate neuron firing
            float neuronPulse(vec3 pos, float t) {
                float pulse = 0.0;
                
                // Create neuron clusters
                vec3 gridPos = floor(pos * 10.0);
                float neuronId = dot(gridPos, vec3(1.0, 7.0, 13.0));
                
                // Firing pattern
                float fireTime = mod(t * 2.0 + neuronId * 0.1, 10.0);
                if(fireTime < 1.0) {
                    pulse = exp(-fireTime * 5.0);
                }
                
                return pulse;
            }
            
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                
                vec3 pos = position;
                
                // Neural activity displacement
                float activity = neuronPulse(pos, time);
                vNeuronActivity = activity;
                
                // Synaptic connections
                pos += normal * activity * 0.1 * networkActivity;
                
                // Neural oscillations
                float oscillation = sin(time * 3.0 + index * 2.094) * 0.02;
                pos *= 1.0 + oscillation;
                
                vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                vWorldPosition = worldPos.xyz;
                
                gl_Position = projectionMatrix * viewMatrix * worldPos;
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform float index;
            uniform vec3 baseColor;
            uniform float networkActivity;
            
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;
            varying vec3 vWorldPosition;
            varying float vNeuronActivity;
            
            // Synaptic connection visualization
            vec3 synapticGlow(vec3 pos, float t) {
                vec3 color = vec3(0.0);
                
                // Create connection lines
                float connections = 0.0;
                for(int i = 0; i < 6; i++) {
                    vec3 offset = vec3(
                        sin(float(i) * 1.047),
                        cos(float(i) * 1.047),
                        sin(float(i) * 2.094)
                    ) * 2.0;
                    
                    vec3 toNeuron = pos - offset;
                    float dist = length(toNeuron);
                    float connection = exp(-dist * 0.5) * sin(t * 10.0 - dist * 5.0);
                    connections += max(0.0, connection);
                }
                
                // Neural pathway colors
                color = vec3(0.2, 0.5, 1.0) * connections;
                color += vec3(1.0, 0.5, 0.2) * vNeuronActivity;
                
                return color;
            }
            
            void main() {
                vec3 normal = normalize(vNormal);
                vec3 viewDir = normalize(cameraPosition - vWorldPosition);
                
                // Neural base color
                vec3 color = mix(baseColor, vec3(0.2, 0.4, 0.8), 0.5);
                
                // Synaptic connections
                vec3 synaptic = synapticGlow(vWorldPosition, time);
                color += synaptic * networkActivity;
                
                // Neural firing visualization
                if(vNeuronActivity > 0.1) {
                    color += vec3(1.0, 0.8, 0.4) * vNeuronActivity;
                }
                
                // Information flow
                float flow = sin(vWorldPosition.y * 10.0 - time * 5.0);
                flow = smoothstep(0.0, 1.0, flow);
                color += vec3(0.0, 0.5, 1.0) * flow * 0.3;
                
                // Fresnel for depth
                float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 1.5);
                color += vec3(0.4, 0.6, 1.0) * fresnel;
                
                // Neural glow
                color += baseColor * fresnel * networkActivity;
                
                gl_FragColor = vec4(color, 0.95);
            }
        `
    },

    // Dimensional Portal Shader
    dimensionalPortal: {
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;
            varying vec3 vWorldPosition;
            varying float vPortalDepth;
            
            uniform float time;
            uniform float index;
            uniform float portalOpen;
            
            // Dimensional warping
            vec3 dimensionalWarp(vec3 pos, float t) {
                // Create spiral distortion
                float angle = atan(pos.z, pos.x);
                float radius = length(pos.xz);
                
                angle += sin(radius * 5.0 - t * 2.0) * 0.5 * portalOpen;
                
                vec3 warped = vec3(
                    cos(angle) * radius,
                    pos.y,
                    sin(angle) * radius
                );
                
                // Depth distortion
                float depth = sin(length(pos) * 10.0 - t * 3.0) * 0.1;
                warped += normalize(pos) * depth * portalOpen;
                
                return warped;
            }
            
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                
                vec3 pos = position;
                
                // Apply dimensional warping
                pos = dimensionalWarp(pos, time);
                
                // Portal breathing
                float breathe = sin(time * 2.0 + index * 2.094) * 0.05;
                pos *= 1.0 + breathe * portalOpen;
                
                // Calculate portal depth
                vPortalDepth = length(pos) / 2.0;
                
                vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                vWorldPosition = worldPos.xyz;
                
                gl_Position = projectionMatrix * viewMatrix * worldPos;
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform float index;
            uniform vec3 baseColor;
            uniform float portalOpen;
            
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;
            varying vec3 vWorldPosition;
            varying float vPortalDepth;
            
            // Portal energy field
            vec3 portalEnergy(vec3 pos, float t) {
                // Swirling energy
                float swirl = sin(pos.x * 10.0 + t * 3.0) *
                             cos(pos.y * 10.0 - t * 2.0) *
                             sin(pos.z * 10.0 + t * 4.0);
                swirl = abs(swirl);
                
                // Energy colors (dimensional spectrum)
                vec3 color1 = vec3(0.5, 0.0, 1.0); // Purple
                vec3 color2 = vec3(0.0, 1.0, 1.0); // Cyan
                vec3 color3 = vec3(1.0, 0.0, 0.5); // Pink
                
                // Mix based on depth and swirl
                vec3 energy = mix(color1, color2, swirl);
                energy = mix(energy, color3, sin(vPortalDepth * 10.0 + t));
                
                return energy * swirl;
            }
            
            // Dimensional rifts
            float dimensionalRift(vec3 pos, float t) {
                float rift = 0.0;
                
                // Multiple dimensional layers
                for(int i = 0; i < 4; i++) {
                    float layer = float(i);
                    float phase = layer * 1.571;
                    
                    rift += sin(pos.x * (5.0 + layer) + t * (2.0 + layer * 0.5) + phase) *
                           cos(pos.y * (5.0 - layer) - t * (1.5 + layer * 0.3) + phase) *
                           sin(pos.z * (5.0 + layer) + t * (2.5 - layer * 0.4) + phase);
                }
                
                return abs(rift) / 4.0;
            }
            
            void main() {
                vec3 normal = normalize(vNormal);
                vec3 viewDir = normalize(cameraPosition - vWorldPosition);
                
                // Base portal color
                vec3 color = mix(baseColor, vec3(0.5, 0.0, 0.8), portalOpen * 0.5);
                
                // Portal energy
                vec3 energy = portalEnergy(vWorldPosition, time);
                color += energy * portalOpen;
                
                // Dimensional rifts
                float rift = dimensionalRift(vWorldPosition * 0.5, time);
                color += vec3(1.0, 0.5, 0.8) * rift * portalOpen;
                
                // Event horizon effect
                float horizon = 1.0 - smoothstep(0.0, 1.0, vPortalDepth);
                color = mix(color, vec3(0.0), horizon * portalOpen * 0.5);
                
                // Fresnel with dimensional distortion
                float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 1.5);
                fresnel *= 1.0 + sin(time * 20.0) * 0.5 * portalOpen;
                
                // Portal rim glow
                color += vec3(0.8, 0.4, 1.0) * fresnel * 2.0 * portalOpen;
                
                // Reality distortion at edges
                float distortion = sin(vWorldPosition.x * 50.0) * 
                                  cos(vWorldPosition.y * 50.0) * 
                                  sin(vWorldPosition.z * 50.0);
                color += abs(distortion) * vec3(1.0, 0.0, 0.5) * 0.2 * portalOpen;
                
                gl_FragColor = vec4(color, 0.8 + fresnel * 0.2);
            }
        `
    },

    // Consciousness Field Shader
    consciousnessField: {
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;
            varying vec3 vWorldPosition;
            varying float vConsciousnessLevel;
            
            uniform float time;
            uniform float index;
            uniform float awarenessLevel;
            
            // Thought wave propagation
            float thoughtWave(vec3 pos, float t) {
                float wave = sin(length(pos) * 5.0 - t * 3.0) * 0.5 + 0.5;
                wave *= exp(-length(pos) * 0.1);
                return wave;
            }
            
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                
                vec3 pos = position;
                
                // Consciousness expansion
                float expansion = thoughtWave(pos, time) * awarenessLevel;
                pos += normal * expansion * 0.1;
                
                // Awareness ripples
                float ripple = sin(time * 4.0 - length(pos) * 10.0) * 0.02;
                pos *= 1.0 + ripple * awarenessLevel;
                
                // Calculate consciousness level
                vConsciousnessLevel = expansion;
                
                vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                vWorldPosition = worldPos.xyz;
                
                gl_Position = projectionMatrix * viewMatrix * worldPos;
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform float index;
            uniform vec3 baseColor;
            uniform float awarenessLevel;
            
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;
            varying vec3 vWorldPosition;
            varying float vConsciousnessLevel;
            
            // Thought patterns
            vec3 thoughtPattern(vec3 pos, float t) {
                vec3 pattern = vec3(0.0);
                
                // Consciousness waves
                for(int i = 0; i < 5; i++) {
                    float freq = 3.0 + float(i) * 2.0;
                    float phase = float(i) * 0.628;
                    
                    float wave = sin(pos.x * freq + t * 2.0 + phase) *
                                cos(pos.y * freq - t * 1.5 + phase) *
                                sin(pos.z * freq + t * 2.5 + phase);
                    
                    pattern += vec3(
                        abs(wave),
                        abs(wave * 0.8),
                        abs(wave * 0.6)
                    ) / float(i + 1);
                }
                
                return pattern;
            }
            
            // Awareness aura
            vec3 awarenessAura(vec3 pos, float awareness) {
                // Golden ratio spiral
                float phi = 1.618033988749895;
                float spiral = sin(length(pos.xy) * phi - time * 2.0);
                spiral = smoothstep(0.0, 1.0, spiral);
                
                // Aura colors
                vec3 auraInner = vec3(1.0, 0.8, 0.4); // Gold
                vec3 auraOuter = vec3(0.4, 0.6, 1.0); // Blue
                
                vec3 aura = mix(auraInner, auraOuter, spiral);
                return aura * awareness;
            }
            
            void main() {
                vec3 normal = normalize(vNormal);
                vec3 viewDir = normalize(cameraPosition - vWorldPosition);
                
                // Base consciousness color
                vec3 color = mix(baseColor, vec3(0.8, 0.6, 1.0), awarenessLevel * 0.3);
                
                // Thought patterns
                vec3 thoughts = thoughtPattern(vWorldPosition * 0.5, time);
                color += thoughts * awarenessLevel * 0.5;
                
                // Awareness aura
                vec3 aura = awarenessAura(vWorldPosition, awarenessLevel);
                color += aura * vConsciousnessLevel;
                
                // Enlightenment glow
                float enlightenment = pow(vConsciousnessLevel, 2.0);
                color += vec3(1.0, 0.9, 0.7) * enlightenment * awarenessLevel;
                
                // Fresnel consciousness field
                float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 1.2);
                color += vec3(0.6, 0.8, 1.0) * fresnel * (1.0 + awarenessLevel);
                
                // Transcendence effect
                float transcend = sin(time * 3.0 + vWorldPosition.y * 10.0) * 0.5 + 0.5;
                color = mix(color, vec3(1.0, 0.95, 0.8), transcend * awarenessLevel * 0.2);
                
                gl_FragColor = vec4(color, 0.85 + fresnel * 0.15);
            }
        `
    }
};

// Shader Manager for dynamic shader switching
class ShaderManager {
    constructor(app) {
        this.app = app;
        this.currentShader = 'default';
        this.shaderUniforms = {};
        this.transitionProgress = 0;
        
        this.initializeShaders();
    }
    
    initializeShaders() {
        // Store references to shader uniforms for each prism
        if (this.app.logoGroup) {
            this.app.logoGroup.children.forEach((mesh, index) => {
                if (mesh.material && mesh.material.uniforms) {
                    this.shaderUniforms[index] = mesh.material.uniforms;
                }
            });
        }
    }
    
    switchToShader(shaderName, options = {}) {
        const shader = ProtocolShaders[shaderName];
        if (!shader) return;
        
        // Smooth transition
        this.transitionToShader(shader, options);
    }
    
    transitionToShader(newShader, options) {
        if (!this.app.logoGroup) return;
        
        const duration = options.duration || 1000;
        const startTime = Date.now();
        
        // Create new materials
        this.app.logoGroup.children.forEach((mesh, index) => {
            const oldMaterial = mesh.material;
            
            // Create new shader material
            const newMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    ...this.shaderUniforms[index],
                    // Add shader-specific uniforms
                    entanglementStrength: { value: 0 },
                    networkActivity: { value: 0 },
                    portalOpen: { value: 0 },
                    awarenessLevel: { value: 0 }
                },
                vertexShader: newShader.vertexShader,
                fragmentShader: newShader.fragmentShader,
                transparent: true,
                side: THREE.DoubleSide
            });
            
            // Animate transition
            const animateTransition = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Smooth easing
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                // Update shader-specific uniforms based on type
                if (options.shaderType === 'quantumEntanglement') {
                    newMaterial.uniforms.entanglementStrength.value = easeProgress;
                } else if (options.shaderType === 'neuralNetwork') {
                    newMaterial.uniforms.networkActivity.value = easeProgress;
                } else if (options.shaderType === 'dimensionalPortal') {
                    newMaterial.uniforms.portalOpen.value = easeProgress;
                } else if (options.shaderType === 'consciousnessField') {
                    newMaterial.uniforms.awarenessLevel.value = easeProgress;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animateTransition);
                } else {
                    // Cleanup old material
                    oldMaterial.dispose();
                }
            };
            
            mesh.material = newMaterial;
            animateTransition();
        });
        
        this.currentShader = options.shaderType || 'custom';
    }
    
    // Activate specific shader effects
    activateQuantumMode() {
        this.switchToShader('quantumEntanglement', {
            shaderType: 'quantumEntanglement',
            duration: 2000
        });
    }
    
    activateNeuralMode() {
        this.switchToShader('neuralNetwork', {
            shaderType: 'neuralNetwork',
            duration: 1500
        });
    }
    
    activatePortalMode() {
        this.switchToShader('dimensionalPortal', {
            shaderType: 'dimensionalPortal',
            duration: 3000
        });
    }
    
    activateConsciousnessMode() {
        this.switchToShader('consciousnessField', {
            shaderType: 'consciousnessField',
            duration: 2500
        });
    }
}

// Auto-initialize shader manager when enhancements load
if (window.protocolEnhancements) {
    window.protocolShaderManager = new ShaderManager(window.protocolApp);
    
    // Add shader switching to enhancement commands
    const originalUnlockProtocol = window.protocolEnhancements.unlockProtocolMode;
    window.protocolEnhancements.unlockProtocolMode = function() {
        originalUnlockProtocol.call(this);
        window.protocolShaderManager.activateConsciousnessMode();
    };
    
    const originalQuantumMode = window.protocolEnhancements.enableQuantumMode;
    window.protocolEnhancements.enableQuantumMode = function() {
        originalQuantumMode.call(this);
        window.protocolShaderManager.activateQuantumMode();
    };
}

console.log('🌟 Advanced Shaders Loaded - Quantum, Neural, Portal, and Consciousness modes available!');
