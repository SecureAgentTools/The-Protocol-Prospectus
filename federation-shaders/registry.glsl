// Registry Node Shader with Energy Field
// Vertex Shader
uniform float time;
uniform float pulseIntensity;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;

// Noise function
float noise(vec3 p) {
    return sin(p.x * 10.0) * sin(p.y * 10.0) * sin(p.z * 10.0);
}

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    // Energy field displacement
    vec3 pos = position;
    float displacement = sin(time * 2.0 + position.y * 0.1) * pulseIntensity;
    displacement += noise(position + time) * 0.05;
    pos += normal * displacement;
    
    // Add rotation effect
    float angle = time * 0.5;
    mat3 rotation = mat3(
        cos(angle), 0.0, sin(angle),
        0.0, 1.0, 0.0,
        -sin(angle), 0.0, cos(angle)
    );
    pos = rotation * pos;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPosition.xyz;
    
    gl_Position = projectionMatrix * mvPosition;
}

// Fragment Shader
uniform vec3 color;
uniform float time;
uniform float opacity;
uniform float active;
uniform vec3 cameraPosition;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;

// Hexagon pattern
float hexagon(vec2 p) {
    const vec2 s = vec2(1.0, 1.73205);
    p = abs(p);
    return max(dot(p, s * 0.5), p.x);
}

void main() {
    vec3 viewDirection = normalize(vViewPosition);
    
    // Energy core
    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    vec3 atmosphere = color * intensity * 2.0;
    
    // Animated hexagon pattern
    vec2 hexUv = vUv * 10.0;
    float hex = 1.0 - hexagon(fract(hexUv + time * 0.1) - 0.5);
    hex = smoothstep(0.4, 0.5, hex);
    
    // Pulse effect
    float pulse = sin(time * 3.0) * 0.5 + 0.5;
    vec3 pulseColor = mix(color, vec3(1.0), pulse * 0.3);
    
    // Holographic effect
    float hologram = sin(vPosition.y * 50.0 + time * 5.0);
    hologram = smoothstep(0.0, 1.0, hologram);
    
    // Energy lines
    float lines = sin(vUv.y * 100.0 + time * 2.0);
    lines = smoothstep(0.8, 1.0, lines);
    
    // Combine effects
    vec3 finalColor = pulseColor;
    finalColor += atmosphere;
    finalColor += hex * color * 0.5;
    finalColor += hologram * vec3(0.0, 1.0, 1.0) * 0.1;
    finalColor += lines * vec3(1.0, 0.5, 0.0) * 0.2;
    
    // Active state glow
    if (active > 0.5) {
        finalColor += vec3(1.0, 0.8, 0.0) * active;
    }
    
    // Fresnel rim lighting
    float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);
    finalColor += fresnel * color * 2.0;
    
    // Distance fade
    float distance = length(cameraPosition - vPosition);
    float fade = 1.0 - smoothstep(1000.0, 2000.0, distance);
    
    gl_FragColor = vec4(finalColor, opacity * fade);
}