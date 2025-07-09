// Circuit Component Shader - Advanced holographic effect with energy pulses
// For ZKP circuit visualization components

// Vertex Shader
const circuitVertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    
    uniform float uTime;
    uniform float uActivation;
    uniform float uPulse;
    
    // Noise function for organic movement
    vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
        return mod289(((x*34.0)+1.0)*x);
    }
    
    vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        
        i = mod289(i);
        vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        
        vec3 pos = position;
        
        // Activation displacement
        float activation = uActivation;
        float noise = snoise(pos * 2.0 + uTime * 0.5) * 0.1;
        pos += normal * noise * activation;
        
        // Pulse effect
        float pulse = sin(uTime * 2.0 + length(pos) * 0.5) * uPulse;
        pos += normal * pulse * 0.05;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vViewPosition = -mvPosition.xyz;
        
        vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
        vWorldPosition = worldPosition.xyz;
        
        gl_Position = projectionMatrix * mvPosition;
    }
`;

// Fragment Shader
const circuitFragmentShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    
    uniform vec3 uColor;
    uniform vec3 uEmissive;
    uniform float uTime;
    uniform float uActivation;
    uniform float uMetalness;
    uniform float uRoughness;
    uniform sampler2D uMatcap;
    
    // Fresnel effect
    float fresnel(vec3 normal, vec3 viewDir, float power) {
        return pow(1.0 - dot(normal, viewDir), power);
    }
    
    // Hash function for randomness
    float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    // Hexagonal pattern
    vec2 hexagon(vec2 p) {
        vec2 q = vec2(p.x * 2.0 * 0.5773503, p.y + p.x * 0.5773503);
        vec2 pi = floor(q);
        vec2 pf = fract(q);
        float v = mod(pi.x + pi.y, 3.0);
        float ca = step(1.0, v);
        float cb = step(2.0, v);
        vec2 a = vec2(pf.x - ca, pf.y - cb);
        return vec2(abs(a.x) + abs(a.y) - 1.0, cb);
    }
    
    void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        
        // Base color with metallic properties
        vec3 baseColor = uColor;
        
        // Holographic effect
        float holo = sin(vUv.y * 40.0 + uTime * 2.0) * 0.5 + 0.5;
        holo *= sin(vUv.x * 30.0 - uTime * 1.5) * 0.5 + 0.5;
        vec3 holoColor = mix(uColor, uEmissive, holo * uActivation);
        
        // Circuit pattern overlay
        vec2 hex = hexagon(vUv * 20.0 + uTime * 0.1);
        float circuit = 1.0 - smoothstep(0.0, 0.05, hex.x);
        circuit *= hash(floor(vUv * 20.0 + 0.5)) > 0.7 ? 1.0 : 0.5;
        
        // Energy flow
        float flow = sin(vUv.y * 10.0 - uTime * 3.0) * 0.5 + 0.5;
        flow *= smoothstep(0.4, 0.6, uActivation);
        vec3 flowColor = mix(baseColor, uEmissive * 2.0, flow * circuit);
        
        // Fresnel rim lighting
        float rim = fresnel(normal, viewDir, 2.0);
        vec3 rimColor = uEmissive * rim * (0.5 + uActivation * 0.5);
        
        // Iridescent effect
        float iridescence = dot(normal, viewDir);
        vec3 iridColor = vec3(
            sin(iridescence * 10.0 + uTime) * 0.5 + 0.5,
            sin(iridescence * 10.0 + uTime + 2.094) * 0.5 + 0.5,
            sin(iridescence * 10.0 + uTime + 4.189) * 0.5 + 0.5
        );
        
        // Combine all effects
        vec3 finalColor = holoColor;
        finalColor = mix(finalColor, flowColor, circuit * 0.3);
        finalColor += rimColor;
        finalColor = mix(finalColor, iridColor * uEmissive, rim * 0.2 * uActivation);
        
        // Matcap for metallic reflection
        vec2 matcapUV = normal.xy * 0.5 + 0.5;
        vec3 matcap = texture2D(uMatcap, matcapUV).rgb;
        finalColor = mix(finalColor, matcap * uColor, uMetalness * 0.5);
        
        // Energy glow
        float glow = smoothstep(0.5, 1.0, uActivation);
        finalColor += uEmissive * glow * 0.5;
        
        // Output with alpha
        float alpha = 1.0;
        alpha *= smoothstep(0.0, 0.1, hex.x) * 0.2 + 0.8; // Circuit pattern alpha
        
        gl_FragColor = vec4(finalColor, alpha);
    }
`;

export { circuitVertexShader, circuitFragmentShader };
