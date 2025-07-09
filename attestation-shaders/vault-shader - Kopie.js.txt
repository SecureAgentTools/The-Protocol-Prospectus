// Vault Core Shader - Creates the main crystalline vault structure
// with refraction and holographic effects

const vaultVertexShader = `
    uniform float uTime;
    uniform float uPulseIntensity;
    uniform vec3 uMerklePattern;
    
    attribute float aRandom;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    varying float vDepth;
    varying float vRandom;
    varying vec3 vReflection;
    
    void main() {
        vUv = uv;
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);
        vRandom = aRandom;
        
        // Add subtle vertex displacement for organic feel
        vec3 pos = position;
        float displacement = sin(uTime * 0.5 + position.y * 2.0) * 0.02;
        displacement += cos(uTime * 0.3 + position.x * 1.5) * 0.01;
        pos += normal * displacement * uPulseIntensity;
        
        // Calculate world position for effects
        vec4 worldPos = modelMatrix * vec4(pos, 1.0);
        vWorldPosition = worldPos.xyz;
        
        // Calculate reflection vector
        vec3 cameraToVertex = normalize(worldPos.xyz - cameraPosition);
        vReflection = reflect(cameraToVertex, normalize(mat3(modelMatrix) * normal));
        
        // Depth for fog effect
        vec4 mvPosition = viewMatrix * worldPos;
        vDepth = -mvPosition.z;
        
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const vaultFragmentShader = `
    uniform float uTime;
    uniform vec3 uCameraPosition;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uRefractiveIndex;
    uniform float uChromaticAberration;
    uniform samplerCube uEnvMap;
    uniform float uGlowIntensity;
    uniform vec3 uMerklePattern;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    varying float vDepth;
    varying float vRandom;
    varying vec3 vReflection;
    
    // Simplex noise for organic patterns
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
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
        
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    // Fresnel effect
    float fresnel(vec3 eyeVector, vec3 worldNormal, float power) {
        float fresnelFactor = abs(dot(eyeVector, worldNormal));
        float inverseFresnelFactor = 1.0 - fresnelFactor;
        return pow(inverseFresnelFactor, power);
    }
    
    void main() {
        vec3 eyeVector = normalize(uCameraPosition - vWorldPosition);
        
        // Base color with gradient
        vec3 baseColor = mix(uColor1, uColor2, vUv.y);
        baseColor = mix(baseColor, uColor3, pow(vUv.x, 2.0));
        
        // Add merkle pattern overlay
        float merkleInfluence = dot(uMerklePattern, vec3(vUv.x, vUv.y, 1.0));
        baseColor += vec3(0.1, 0.05, 0.0) * sin(merkleInfluence * 10.0 + uTime);
        
        // Holographic interference pattern
        float interference = sin(vWorldPosition.y * 50.0 + uTime * 2.0) * 0.5 + 0.5;
        interference *= sin(vWorldPosition.x * 30.0 - uTime * 1.5) * 0.5 + 0.5;
        baseColor += vec3(0.2, 0.1, 0.3) * interference * 0.3;
        
        // Refraction with chromatic aberration
        vec3 refractVecR = refract(eyeVector, vNormal, uRefractiveIndex - uChromaticAberration);
        vec3 refractVecG = refract(eyeVector, vNormal, uRefractiveIndex);
        vec3 refractVecB = refract(eyeVector, vNormal, uRefractiveIndex + uChromaticAberration);
        
        vec4 refractedColorR = textureCube(uEnvMap, refractVecR);
        vec4 refractedColorG = textureCube(uEnvMap, refractVecG);
        vec4 refractedColorB = textureCube(uEnvMap, refractVecB);
        
        vec3 refractedColor = vec3(refractedColorR.r, refractedColorG.g, refractedColorB.b);
        
        // Reflection
        vec4 reflectedColor = textureCube(uEnvMap, vReflection);
        
        // Combine refraction and reflection based on fresnel
        float fresnelFactor = fresnel(eyeVector, vNormal, 2.0);
        vec3 envColor = mix(refractedColor, reflectedColor.rgb, fresnelFactor);
        
        // Mix with base color
        vec3 finalColor = mix(baseColor, envColor, 0.7);
        
        // Add noise-based internal glow
        float noise = snoise(vPosition * 2.0 + vec3(uTime * 0.1));
        finalColor += uColor1 * noise * 0.2 * uGlowIntensity;
        
        // Edge glow
        float edgeGlow = pow(fresnelFactor, 1.5);
        finalColor += mix(uColor1, uColor2, edgeGlow) * edgeGlow * uGlowIntensity;
        
        // Depth fog
        float fogFactor = exp(-vDepth * 0.002);
        finalColor = mix(vec3(0.0), finalColor, fogFactor);
        
        // Energy pulse
        float pulse = sin(uTime * 3.0 + vPosition.y * 2.0) * 0.5 + 0.5;
        finalColor += uColor1 * pulse * 0.1;
        
        gl_FragColor = vec4(finalColor, 0.85 + edgeGlow * 0.15);
    }
`;

export { vaultVertexShader, vaultFragmentShader };
