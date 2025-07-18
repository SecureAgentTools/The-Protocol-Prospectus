// Advanced Particle System Shader
// Vertex Shader
uniform float time;
uniform float pixelRatio;
uniform vec3 cameraPosition;

attribute float size;
attribute vec3 customColor;
attribute float particleType;
attribute vec3 velocity;

varying vec3 vColor;
varying float vOpacity;
varying float vType;

// 3D Noise
vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
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
    
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
    vColor = customColor;
    vType = particleType;
    
    vec3 pos = position;
    
    // Apply velocity
    pos += velocity * time * 10.0;
    
    // Different behaviors based on particle type
    if (particleType < 0.33) {
        // Data particles - flow along paths
        float noise = snoise(pos * 0.01 + time * 0.5);
        pos.x += sin(time * 2.0 + noise * 10.0) * 20.0;
        pos.y += cos(time * 1.5 + noise * 10.0) * 20.0;
    } else if (particleType < 0.66) {
        // Energy particles - orbital motion
        float angle = time * 0.5 + length(pos) * 0.01;
        float radius = length(pos.xz);
        pos.x = cos(angle) * radius;
        pos.z = sin(angle) * radius;
        pos.y += sin(time * 3.0 + radius * 0.01) * 10.0;
    } else {
        // Ambient particles - brownian motion
        vec3 noisePos = pos * 0.005 + time * 0.2;
        pos += vec3(
            snoise(noisePos),
            snoise(noisePos + 100.0),
            snoise(noisePos + 200.0)
        ) * 20.0;
    }
    
    // Wrap around boundaries
    pos = mod(pos + 1000.0, 2000.0) - 1000.0;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Size based on distance
    float dist = length(mvPosition.xyz);
    gl_PointSize = size * pixelRatio * (500.0 / dist);
    gl_PointSize = clamp(gl_PointSize, 1.0, 20.0);
    
    // Fade based on distance
    vOpacity = 1.0 - smoothstep(1000.0, 2000.0, dist);
    
    gl_Position = projectionMatrix * mvPosition;
}

// Fragment Shader
varying vec3 vColor;
varying float vOpacity;
varying float vType;

uniform float time;

void main() {
    // Circular particle shape
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    
    if (dist > 0.5) discard;
    
    // Soft edges
    float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
    
    // Color variations based on type
    vec3 finalColor = vColor;
    
    if (vType < 0.33) {
        // Data particles - bright core
        float core = 1.0 - smoothstep(0.0, 0.2, dist);
        finalColor += vec3(1.0) * core;
    } else if (vType < 0.66) {
        // Energy particles - pulsing
        float pulse = sin(time * 5.0) * 0.5 + 0.5;
        finalColor *= 1.0 + pulse;
    } else {
        // Ambient particles - soft glow
        finalColor *= 0.7;
    }
    
    // Ring effect for some particles
    float ring = 1.0 - abs(dist - 0.3) * 10.0;
    ring = clamp(ring, 0.0, 1.0);
    finalColor += vColor * ring * 0.5;
    
    gl_FragColor = vec4(finalColor, opacity * vOpacity);
}