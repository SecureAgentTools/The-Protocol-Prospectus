// Proof Generation Shader - Advanced cryptographic visualization
// For ZKP proof creation effects with mathematical patterns

// Vertex Shader
const proofGenerationVertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    varying float vDepth;
    
    uniform float uTime;
    uniform float uProgress;
    uniform float uComplexity;
    uniform vec3 uMorphTargets[8];
    uniform float uMorphWeights[8];
    
    // Quaternion rotation
    vec3 rotateVector(vec3 v, vec4 q) {
        vec3 u = q.xyz;
        float s = q.w;
        return 2.0 * dot(u, v) * u + (s * s - dot(u, u)) * v + 2.0 * s * cross(u, v);
    }
    
    // Fractal displacement
    float fractalNoise(vec3 p, int octaves) {
        float f = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for (int i = 0; i < octaves; i++) {
            f += amplitude * sin(p.x * frequency) * sin(p.y * frequency) * sin(p.z * frequency);
            amplitude *= 0.5;
            frequency *= 2.0;
        }
        
        return f;
    }
    
    void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        
        vec3 pos = position;
        
        // Morph between different mathematical shapes
        vec3 morphed = vec3(0.0);
        for (int i = 0; i < 8; i++) {
            morphed += uMorphTargets[i] * uMorphWeights[i];
        }
        pos = mix(pos, morphed, uProgress);
        
        // Complex mathematical transformation
        float complexity = uComplexity;
        
        // Spiral transformation
        float angle = length(pos.xy) * complexity + uTime;
        float radius = length(pos.xy);
        pos.x = cos(angle) * radius;
        pos.y = sin(angle) * radius;
        
        // Fractal displacement
        float fractal = fractalNoise(pos * 2.0 + uTime * 0.1, 4);
        pos += normal * fractal * 0.1 * uProgress;
        
        // Quantum fluctuation
        float quantum = sin(dot(pos, vec3(12.9898, 78.233, 45.164)) * 43758.5453);
        pos += normal * quantum * 0.05 * (1.0 - uProgress);
        
        // Calculate view space position
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vViewPosition = -mvPosition.xyz;
        vDepth = -mvPosition.z;
        
        // World position for effects
        vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
        vWorldPosition = worldPosition.xyz;
        
        gl_Position = projectionMatrix * mvPosition;
    }
`;

// Fragment Shader
const proofGenerationFragmentShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    varying float vDepth;
    
    uniform float uTime;
    uniform float uProgress;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uGlowIntensity;
    uniform sampler2D uNoiseTexture;
    uniform samplerCube uEnvironmentMap;
    
    // Complex number operations for cryptographic visualization
    vec2 complexMul(vec2 a, vec2 b) {
        return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
    }
    
    vec2 complexExp(vec2 z) {
        return exp(z.x) * vec2(cos(z.y), sin(z.y));
    }
    
    // Mandelbrot-inspired pattern for complexity
    float mandelbrotPattern(vec2 c, int iterations) {
        vec2 z = vec2(0.0);
        
        for (int i = 0; i < iterations; i++) {
            z = complexMul(z, z) + c;
            if (dot(z, z) > 4.0) {
                return float(i) / float(iterations);
            }
        }
        
        return 1.0;
    }
    
    // Hash pattern representing cryptographic operations
    float hashPattern(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * vec3(443.8975, 441.423, 437.195));
        p3 += dot(p3, p3.yzx + 19.19);
        return fract((p3.x + p3.y) * p3.z);
    }
    
    // Circuit-like pattern
    float circuitPattern(vec2 p) {
        vec2 grid = fract(p * 10.0);
        vec2 id = floor(p * 10.0);
        
        float h = hashPattern(id);
        
        // Create lines
        float lines = 0.0;
        if (h > 0.5) {
            lines = max(
                smoothstep(0.45, 0.5, grid.x) * smoothstep(0.55, 0.5, grid.x),
                smoothstep(0.45, 0.5, grid.y) * smoothstep(0.55, 0.5, grid.y)
            );
        }
        
        // Create nodes
        float nodes = 0.0;
        if (h > 0.7) {
            float dist = length(grid - 0.5);
            nodes = smoothstep(0.2, 0.15, dist);
        }
        
        return max(lines, nodes);
    }
    
    // Holographic interference pattern
    float interferencePattern(vec3 p, float time) {
        float pattern = 0.0;
        
        // Multiple wave sources
        for (int i = 0; i < 3; i++) {
            vec3 source = vec3(
                sin(time + float(i) * 2.094),
                cos(time + float(i) * 2.094),
                sin(time * 0.7 + float(i))
            ) * 5.0;
            
            float dist = length(p - source);
            pattern += sin(dist * 10.0 - time * 5.0) * 0.5 + 0.5;
        }
        
        return pattern / 3.0;
    }
    
    void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        
        // Base color based on progress
        vec3 baseColor = mix(uColor1, uColor2, uProgress);
        
        // Mathematical patterns
        float mandel = mandelbrotPattern(vUv * 3.0 - 1.5, 32);
        float circuit = circuitPattern(vUv * 5.0 + uTime * 0.1);
        float hash = hashPattern(vUv * 20.0 + uTime);
        float interference = interferencePattern(vWorldPosition, uTime);
        
        // Combine patterns
        vec3 patternColor = vec3(0.0);
        patternColor += uColor1 * mandel * (1.0 - uProgress);
        patternColor += uColor2 * circuit * 0.5;
        patternColor += uColor3 * hash * uProgress;
        
        // Holographic effect
        vec3 hologram = vec3(
            sin(interference * 20.0 + uTime),
            sin(interference * 20.0 + uTime + 2.094),
            sin(interference * 20.0 + uTime + 4.189)
        ) * 0.5 + 0.5;
        
        baseColor = mix(baseColor, hologram, 0.3 * uProgress);
        
        // Fresnel rim lighting
        float fresnel = pow(1.0 - dot(normal, viewDir), 2.0);
        vec3 rimColor = mix(uColor2, uColor3, uProgress) * fresnel * uGlowIntensity;
        
        // Environmental reflection
        vec3 reflectDir = reflect(-viewDir, normal);
        vec3 envColor = texture(uEnvironmentMap, reflectDir).rgb;
        baseColor = mix(baseColor, envColor, 0.2 * fresnel);
        
        // Noise overlay
        float noise = texture2D(uNoiseTexture, vUv * 10.0 + uTime * 0.1).r;
        baseColor += noise * 0.1 * (1.0 - uProgress);
        
        // Energy veins
        float veins = sin(vUv.x * 50.0 + uTime * 2.0) * sin(vUv.y * 50.0 - uTime * 2.0);
        veins = smoothstep(0.8, 1.0, veins);
        baseColor += uColor3 * veins * uProgress;
        
        // Depth-based glow
        float depthGlow = 1.0 - smoothstep(5.0, 20.0, vDepth);
        baseColor += uColor2 * depthGlow * 0.3;
        
        // Final color composition
        vec3 finalColor = baseColor + patternColor + rimColor;
        
        // Progress-based transparency
        float alpha = mix(0.7, 1.0, uProgress);
        alpha *= smoothstep(0.0, 0.1, mandel); // Transparent in deep Mandelbrot areas
        
        gl_FragColor = vec4(finalColor, alpha);
    }
`;

// Geometry shader for proof tessellation (WebGL 2.0)
const proofGenerationGeometryShader = `
    #version 300 es
    
    layout(triangles) in;
    layout(triangle_strip, max_vertices = 27) out;
    
    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat3 normalMatrix;
    uniform float uTime;
    uniform float uProgress;
    uniform float uSubdivision;
    
    out vec3 vNormal;
    out vec2 vUv;
    out vec3 vWorldPosition;
    
    vec3 getNormal(vec3 a, vec3 b, vec3 c) {
        return normalize(cross(b - a, c - a));
    }
    
    void emitSubdividedTriangle(vec3 v0, vec3 v1, vec3 v2, float level) {
        if (level <= 0.0) {
            // Emit the triangle
            vec3 normal = getNormal(v0, v1, v2);
            
            vNormal = normalize(normalMatrix * normal);
            vUv = vec2(0.0, 0.0);
            vWorldPosition = v0;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(v0, 1.0);
            EmitVertex();
            
            vNormal = normalize(normalMatrix * normal);
            vUv = vec2(1.0, 0.0);
            vWorldPosition = v1;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(v1, 1.0);
            EmitVertex();
            
            vNormal = normalize(normalMatrix * normal);
            vUv = vec2(0.5, 1.0);
            vWorldPosition = v2;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(v2, 1.0);
            EmitVertex();
            
            EndPrimitive();
        } else {
            // Subdivide
            vec3 m0 = (v0 + v1) * 0.5;
            vec3 m1 = (v1 + v2) * 0.5;
            vec3 m2 = (v2 + v0) * 0.5;
            
            // Add displacement based on progress
            float disp = sin(length(m0) * 10.0 + uTime) * 0.1 * uProgress;
            m0 += getNormal(v0, v1, v2) * disp;
            m1 += getNormal(v0, v1, v2) * disp;
            m2 += getNormal(v0, v1, v2) * disp;
            
            // Recursive subdivision
            emitSubdividedTriangle(v0, m0, m2, level - 1.0);
            emitSubdividedTriangle(m0, v1, m1, level - 1.0);
            emitSubdividedTriangle(m2, m1, v2, level - 1.0);
            emitSubdividedTriangle(m0, m1, m2, level - 1.0);
        }
    }
    
    void main() {
        vec3 v0 = gl_in[0].gl_Position.xyz;
        vec3 v1 = gl_in[1].gl_Position.xyz;
        vec3 v2 = gl_in[2].gl_Position.xyz;
        
        emitSubdividedTriangle(v0, v1, v2, uSubdivision);
    }
`;

export { proofGenerationVertexShader, proofGenerationFragmentShader, proofGenerationGeometryShader };
