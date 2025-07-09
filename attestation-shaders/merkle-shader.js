// Merkle Tree Growth Shader - Visualizes merkle trees as organic light structures

const merkleVertexShader = `
    uniform float uTime;
    uniform float uGrowthProgress;
    uniform vec3 uWindForce;
    
    attribute float aBranchLevel;
    attribute float aBranchId;
    attribute vec3 aTargetPosition;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying float vBranchLevel;
    varying float vGrowthFactor;
    varying vec3 vColor;
    
    // Hash function for procedural variation
    float hash(float n) {
        return fract(sin(n) * 43758.5453123);
    }
    
    void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vBranchLevel = aBranchLevel;
        
        // Calculate growth factor based on branch level and time
        float levelDelay = aBranchLevel * 0.2;
        vGrowthFactor = smoothstep(levelDelay, levelDelay + 0.3, uGrowthProgress);
        
        // Interpolate between start and target position based on growth
        vec3 startPos = vec3(position.x * 0.1, 0.0, position.z * 0.1);
        vec3 grownPos = mix(startPos, position, vGrowthFactor);
        
        // Add organic movement
        float windInfluence = 1.0 - (aBranchLevel / 10.0); // Higher branches move more
        vec3 wind = uWindForce * windInfluence * vGrowthFactor;
        
        // Procedural swaying
        float swayFreq = 2.0 + hash(aBranchId) * 2.0;
        float swayAmount = 0.02 * windInfluence;
        grownPos.x += sin(uTime * swayFreq + position.y * 0.5) * swayAmount;
        grownPos.z += cos(uTime * swayFreq * 0.8 + position.y * 0.3) * swayAmount;
        
        // Add wind force
        grownPos += wind * sin(uTime + position.y * 0.1);
        
        vPosition = grownPos;
        
        // Color based on branch level (root to leaf gradient)
        vec3 rootColor = vec3(0.98, 0.75, 0.14); // Attestation gold
        vec3 leafColor = vec3(0.23, 0.51, 0.96); // Protocol blue
        vColor = mix(rootColor, leafColor, aBranchLevel / 10.0);
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(grownPos, 1.0);
    }
`;

const merkleFragmentShader = `
    uniform float uTime;
    uniform float uGlowIntensity;
    uniform vec3 uLightPosition;
    uniform float uHashPattern;
    uniform sampler2D uNoiseTexture;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying float vBranchLevel;
    varying float vGrowthFactor;
    varying vec3 vColor;
    
    // Simple fog function
    float fog(float depth) {
        return exp(-depth * 0.005);
    }
    
    // Hash visualization pattern
    float hashPattern(vec2 p, float time) {
        p *= 10.0;
        float pattern = 0.0;
        
        // Create moving hash-like pattern
        for(float i = 0.0; i < 3.0; i++) {
            vec2 q = p + vec2(sin(time * 0.7 + i * 1.3), cos(time * 0.5 + i * 0.7));
            pattern += sin(q.x * 15.0 + time) * cos(q.y * 15.0 - time) / (i + 1.0);
        }
        
        return pattern * 0.5 + 0.5;
    }
    
    // Energy flow along branches
    float energyFlow(vec2 uv, float time, float level) {
        float flow = sin(uv.y * 20.0 - time * 3.0 - level * 2.0) * 0.5 + 0.5;
        flow = pow(flow, 3.0);
        return flow;
    }
    
    void main() {
        // Base color with growth fade
        vec3 color = vColor * vGrowthFactor;
        
        // Add hash pattern overlay
        float hashPat = hashPattern(vUv, uTime * 0.5 + uHashPattern);
        color += vec3(0.1, 0.05, 0.0) * hashPat * 0.5;
        
        // Energy flow effect
        float energy = energyFlow(vUv, uTime, vBranchLevel);
        color += vColor * energy * 0.5 * uGlowIntensity;
        
        // Pulsing glow based on growth
        float pulse = sin(uTime * 4.0 - vBranchLevel * 0.5) * 0.5 + 0.5;
        color += vColor * pulse * 0.2 * vGrowthFactor;
        
        // Rim lighting
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float rim = 1.0 - max(0.0, dot(viewDir, vNormal));
        rim = pow(rim, 2.0);
        color += vColor * rim * uGlowIntensity;
        
        // Add noise texture for organic feel
        vec4 noise = texture2D(uNoiseTexture, vUv * 5.0 + vec2(uTime * 0.01));
        color = mix(color, color * 1.2, noise.r * 0.3);
        
        // Fake subsurface scattering
        vec3 lightDir = normalize(uLightPosition - vPosition);
        float scatter = max(0.0, dot(lightDir, -vNormal));
        scatter = pow(scatter, 3.0);
        color += vec3(0.8, 0.4, 0.1) * scatter * 0.3;
        
        // Branch tips glow more
        float tipGlow = smoothstep(0.7, 1.0, vUv.y) * (vBranchLevel / 10.0);
        color += vColor * tipGlow * 2.0;
        
        // Depth fog
        float depth = length(cameraPosition - vPosition);
        float fogAmount = fog(depth);
        color = mix(vec3(0.0), color, fogAmount);
        
        // Alpha based on growth and branch level
        float alpha = vGrowthFactor * (0.7 + 0.3 * (1.0 - vBranchLevel / 10.0));
        alpha = min(alpha + rim * 0.3, 1.0);
        
        gl_FragColor = vec4(color, alpha);
    }
`;

// Merkle leaf particle shader for the endpoints
const merkleLeafVertexShader = `
    uniform float uTime;
    uniform float uSize;
    
    attribute float aRandom;
    attribute vec3 aColor;
    
    varying vec3 vColor;
    varying float vRandom;
    
    void main() {
        vColor = aColor;
        vRandom = aRandom;
        
        vec3 pos = position;
        
        // Floating animation
        pos.y += sin(uTime * 2.0 + aRandom * 6.28) * 0.1;
        pos.x += cos(uTime * 1.5 + aRandom * 3.14) * 0.05;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        
        // Size variation
        gl_PointSize = uSize * (600.0 / -mvPosition.z) * (0.5 + 0.5 * aRandom);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const merkleLeafFragmentShader = `
    uniform float uTime;
    uniform sampler2D uSprite;
    
    varying vec3 vColor;
    varying float vRandom;
    
    void main() {
        vec2 uv = gl_PointCoord;
        vec4 sprite = texture2D(uSprite, uv);
        
        // Pulsing effect
        float pulse = sin(uTime * 3.0 + vRandom * 6.28) * 0.5 + 0.5;
        vec3 color = vColor * (0.7 + 0.3 * pulse);
        
        // Soft circle
        float dist = length(uv - 0.5);
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        alpha *= sprite.a;
        
        gl_FragColor = vec4(color, alpha);
    }
`;

export { 
    merkleVertexShader, 
    merkleFragmentShader,
    merkleLeafVertexShader,
    merkleLeafFragmentShader
};
