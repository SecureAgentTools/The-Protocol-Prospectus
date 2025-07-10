// Governance Chamber Shader - Holographic Council Effects
// Used for Protocol Council, Technical Committee, and Community Forum nodes

// Vertex Shader
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float time;
uniform float pulseIntensity;
uniform float tier; // 0 = Council, 1 = Committee, 2 = Forum

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;
varying float vDisplacement;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    vec3 pos = position;
    
    // Tier-specific displacement patterns
    float displacement = 0.0;
    if (tier == 0.0) {
        // Protocol Council - majestic slow pulse
        displacement = sin(time * 1.5 + position.y * 0.5) * pulseIntensity * 0.15;
    } else if (tier == 1.0) {
        // Technical Committee - technical oscillation
        displacement = sin(time * 2.5 + position.x * 0.8) * cos(time * 1.8 + position.z * 0.6) * pulseIntensity * 0.1;
    } else {
        // Community Forum - energetic vibration
        displacement = sin(time * 3.0 + length(position.xy) * 2.0) * pulseIntensity * 0.08;
    }
    
    vDisplacement = displacement;
    pos += normal * displacement;
    
    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    vec4 mvPosition = viewMatrix * worldPosition;
    gl_Position = projectionMatrix * mvPosition;
}

// Fragment Shader
precision highp float;

uniform vec3 color;
uniform float time;
uniform float opacity;
uniform float emissiveIntensity;
uniform float tier;
uniform vec3 cameraPosition;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;
varying float vDisplacement;

void main() {
    // Base color with tier-specific modifications
    vec3 baseColor = color;
    
    // Fresnel effect for holographic appearance
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 2.0);
    
    // Tier-specific effects
    vec3 emissive = vec3(0.0);
    
    if (tier == 0.0) {
        // Protocol Council - Royal purple with golden edges
        emissive = mix(baseColor, vec3(1.0, 0.8, 0.3), fresnel * 0.5) * emissiveIntensity;
        emissive += vec3(0.5, 0.0, 1.0) * pow(fresnel, 3.0) * 0.5;
    } else if (tier == 1.0) {
        // Technical Committee - Electric blue with data streams
        float dataStream = sin(vUv.y * 20.0 - time * 3.0) * 0.5 + 0.5;
        emissive = baseColor * emissiveIntensity * (1.0 + dataStream * 0.3);
        emissive += vec3(0.0, 0.5, 1.0) * fresnel * 0.6;
    } else {
        // Community Forum - Vibrant green with energy pulses
        float pulse = sin(time * 4.0 + vDisplacement * 10.0) * 0.5 + 0.5;
        emissive = baseColor * emissiveIntensity * (1.0 + pulse * 0.4);
        emissive += vec3(0.0, 1.0, 0.5) * fresnel * 0.7;
    }
    
    // Holographic scan lines
    float scanline = sin(vWorldPosition.y * 10.0 + time * 2.0) * 0.5 + 0.5;
    emissive *= 0.9 + scanline * 0.1;
    
    // Interior glow
    float interiorGlow = smoothstep(0.0, 1.0, 1.0 - abs(vNormal.z));
    emissive += baseColor * interiorGlow * 0.2;
    
    // Final color composition
    vec3 finalColor = baseColor * 0.3 + emissive;
    
    // Edge highlight
    float edgeHighlight = pow(fresnel, 0.5);
    finalColor += vec3(1.0) * edgeHighlight * 0.2;
    
    // Alpha calculation with edge emphasis
    float alpha = opacity * (0.7 + fresnel * 0.3);
    
    gl_FragColor = vec4(finalColor, alpha);
}
