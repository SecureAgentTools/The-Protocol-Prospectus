// Time Crystal Shader - Temporal Effects for Timeline View
// Creates crystalline structures that represent time flow in governance

// Vertex Shader
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float time;
uniform float timelinePosition; // 0.0 to 1.0 representing past to future

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;
varying float vTimeDistortion;

// Simplex noise for organic distortion
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
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3));
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
    vPosition = position;
    
    // Time-based distortion
    float timeOffset = timelinePosition * 10.0 - 5.0;
    float distortionAmount = 1.0 - abs(timeOffset) / 5.0;
    
    // Crystal growth pattern
    float growth = sin(time * 0.5 + timelinePosition * 3.14159) * 0.5 + 0.5;
    
    // Noise-based displacement
    vec3 noiseInput = position * 2.0 + vec3(time * 0.1, 0.0, timelinePosition * 5.0);
    float noiseValue = snoise(noiseInput);
    
    // Apply displacement
    vec3 pos = position;
    pos += normal * noiseValue * 0.1 * distortionAmount;
    pos *= 1.0 + growth * 0.1;
    
    // Faceted crystal effect
    float facetSize = 0.5;
    pos = floor(pos / facetSize) * facetSize;
    
    vTimeDistortion = distortionAmount;
    
    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}

// Fragment Shader
precision highp float;

uniform vec3 pastColor;    // Color for past events
uniform vec3 presentColor; // Color for present
uniform vec3 futureColor;  // Color for future events
uniform float time;
uniform float opacity;
uniform float timelinePosition;
uniform vec3 cameraPosition;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;
varying float vTimeDistortion;

// Diamond-like refraction
vec3 refract(vec3 incident, vec3 normal, float eta) {
    float cosI = -dot(normal, incident);
    float sinT2 = eta * eta * (1.0 - cosI * cosI);
    if (sinT2 > 1.0) return vec3(0.0);
    float cosT = sqrt(1.0 - sinT2);
    return eta * incident + (eta * cosI - cosT) * normal;
}

void main() {
    // View direction for fresnel
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 2.0);
    
    // Time-based color gradient
    vec3 baseColor;
    if (timelinePosition < 0.33) {
        baseColor = mix(pastColor, presentColor, timelinePosition * 3.0);
    } else if (timelinePosition < 0.66) {
        baseColor = presentColor;
    } else {
        baseColor = mix(presentColor, futureColor, (timelinePosition - 0.66) * 3.0);
    }
    
    // Crystal facet effect
    vec3 facetNormal = normalize(cross(dFdx(vWorldPosition), dFdy(vWorldPosition)));
    float facetDot = abs(dot(viewDirection, facetNormal));
    
    // Refraction colors (simplified dispersion)
    vec3 refractedR = refract(viewDirection, facetNormal, 1.0 / 1.5);
    vec3 refractedG = refract(viewDirection, facetNormal, 1.0 / 1.51);
    vec3 refractedB = refract(viewDirection, facetNormal, 1.0 / 1.52);
    
    // Chromatic aberration
    vec3 chromaticColor = vec3(
        dot(refractedR, vec3(1.0, 0.0, 0.0)),
        dot(refractedG, vec3(0.0, 1.0, 0.0)),
        dot(refractedB, vec3(0.0, 0.0, 1.0))
    );
    
    // Time distortion effect
    float timePulse = sin(time * 2.0 + timelinePosition * 10.0) * 0.5 + 0.5;
    vec3 distortionColor = mix(baseColor, chromaticColor, vTimeDistortion * 0.5);
    
    // Holographic interference
    float interference = sin(vWorldPosition.y * 50.0 + time) * 0.5 + 0.5;
    distortionColor += vec3(interference * 0.1) * vTimeDistortion;
    
    // Inner glow
    float innerGlow = 1.0 - facetDot;
    vec3 glowColor = baseColor * innerGlow * 2.0;
    
    // Combine all effects
    vec3 finalColor = mix(distortionColor, glowColor, 0.3);
    finalColor += baseColor * fresnel * 0.5;
    
    // Temporal energy field
    float energyField = sin(length(vWorldPosition.xz) * 2.0 - time * 3.0) * 0.5 + 0.5;
    finalColor += vec3(energyField * 0.2) * vTimeDistortion;
    
    // Alpha with time distortion
    float alpha = opacity * (0.6 + fresnel * 0.4) * (0.5 + vTimeDistortion * 0.5);
    
    gl_FragColor = vec4(finalColor, alpha);
}
