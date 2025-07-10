// Consensus Field Shader - Energy Field Visualization for Governance Consensus
// Creates a dynamic energy field that responds to consensus levels

// Vertex Shader
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float time;
uniform float consensusLevel; // 0.0 to 1.0
uniform vec3 fieldCenter;
uniform float fieldRadius;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vDistanceFromCenter;
varying float vFieldStrength;

// Noise function for organic movement
float noise(vec3 p) {
    return sin(p.x * 1.5) * sin(p.y * 1.7) * sin(p.z * 1.9);
}

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    // Calculate distance from field center
    vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vDistanceFromCenter = distance(worldPos, fieldCenter);
    
    // Field strength based on consensus and distance
    float normalizedDistance = clamp(vDistanceFromCenter / fieldRadius, 0.0, 1.0);
    vFieldStrength = (1.0 - normalizedDistance) * consensusLevel;
    
    // Wave displacement based on consensus
    vec3 pos = position;
    float waveAmplitude = consensusLevel * 0.5;
    float waveFrequency = 2.0 + consensusLevel * 3.0;
    
    // Radial waves emanating from center
    float wave = sin(vDistanceFromCenter * waveFrequency - time * 3.0) * waveAmplitude;
    wave *= vFieldStrength;
    
    // Add organic noise
    vec3 noiseInput = worldPos * 0.1 + vec3(time * 0.5);
    float organicNoise = noise(noiseInput) * 0.2 * consensusLevel;
    
    // Apply displacement
    pos += normal * (wave + organicNoise);
    
    vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}

// Fragment Shader
precision highp float;

uniform vec3 primaryColor;   // Tier 1 color
uniform vec3 secondaryColor; // Tier 2 color
uniform vec3 tertiaryColor;  // Tier 3 color
uniform float time;
uniform float opacity;
uniform float consensusLevel;
uniform vec3 cameraPosition;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vDistanceFromCenter;
varying float vFieldStrength;

// Hexagonal pattern for energy field
float hexagon(vec2 p, float r) {
    const vec3 k = vec3(-0.866025404, 0.5, 0.577350269);
    p = abs(p);
    p -= 2.0 * min(dot(k.xy, p), 0.0) * k.xy;
    p -= vec2(clamp(p.x, -k.z * r, k.z * r), r);
    return length(p) * sign(p.y);
}

// Energy field pattern
vec3 energyField(vec2 uv, float strength) {
    // Scale for hexagonal grid
    vec2 gridUV = uv * 10.0;
    
    // Animated offset
    gridUV += vec2(sin(time * 0.5), cos(time * 0.3)) * 0.5;
    
    // Hexagonal cells
    vec2 id = floor(gridUV);
    vec2 gv = fract(gridUV) - 0.5;
    
    float hex = hexagon(gv, 0.3);
    float hexGrid = smoothstep(0.03, 0.02, abs(hex));
    
    // Pulsing cells based on consensus
    float cellPulse = sin(time * 3.0 + id.x * 1.3 + id.y * 1.7) * 0.5 + 0.5;
    cellPulse = pow(cellPulse, 2.0) * strength;
    
    return vec3(hexGrid * (0.5 + cellPulse * 0.5));
}

void main() {
    // View-dependent effects
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 1.5);
    
    // Layer colors based on field regions
    float layer1 = smoothstep(0.0, 0.3, vFieldStrength);
    float layer2 = smoothstep(0.3, 0.6, vFieldStrength);
    float layer3 = smoothstep(0.6, 1.0, vFieldStrength);
    
    vec3 layerColor = mix(tertiaryColor, secondaryColor, layer1);
    layerColor = mix(layerColor, primaryColor, layer2);
    
    // Energy field pattern
    vec3 fieldPattern = energyField(vUv, vFieldStrength);
    
    // Consensus waves
    float wavePattern = sin(vDistanceFromCenter * 10.0 - time * 5.0) * 0.5 + 0.5;
    wavePattern *= vFieldStrength;
    
    // Combine effects
    vec3 finalColor = layerColor * 0.3;
    finalColor += fieldPattern * layerColor * 0.5;
    finalColor += vec3(wavePattern) * 0.2;
    
    // Fresnel glow
    finalColor += layerColor * fresnel * 0.5;
    
    // Consensus intensity
    finalColor *= (0.5 + consensusLevel * 0.5);
    
    // Add shimmer
    float shimmer = sin(time * 10.0 + vWorldPosition.x * 5.0 + vWorldPosition.z * 5.0) * 0.5 + 0.5;
    finalColor += vec3(shimmer * fresnel * 0.1);
    
    // Alpha calculation
    float alpha = opacity * vFieldStrength;
    alpha *= (0.3 + fresnel * 0.7);
    alpha *= (0.5 + consensusLevel * 0.5);
    
    gl_FragColor = vec4(finalColor, alpha);
}
