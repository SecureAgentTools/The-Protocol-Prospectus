// Data Flow Connection Shader
// Vertex Shader
uniform float time;
uniform float flowSpeed;

attribute float lineProgress;

varying float vProgress;
varying vec3 vPosition;

void main() {
    vProgress = lineProgress;
    vPosition = position;
    
    // Wave effect along the connection
    vec3 pos = position;
    float wave = sin(time * flowSpeed * 2.0 + lineProgress * 10.0) * 5.0;
    pos.y += wave;
    
    // Pulse along the line
    float pulse = sin(time * flowSpeed * 3.0 - lineProgress * 15.0);
    pulse = smoothstep(0.0, 1.0, pulse);
    pos += normal * pulse * 2.0;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}

// Fragment Shader
uniform vec3 color;
uniform float time;
uniform float opacity;
uniform float active;
uniform float flowSpeed;

varying float vProgress;
varying vec3 vPosition;

// Plasma effect
vec3 plasma(float t) {
    vec3 col;
    col.r = sin(t * 2.0) * 0.5 + 0.5;
    col.g = sin(t * 3.0 + 2.0) * 0.5 + 0.5;
    col.b = sin(t * 5.0 + 4.0) * 0.5 + 0.5;
    return col;
}

void main() {
    // Energy flow gradient
    float flow = fract(time * flowSpeed - vProgress * 2.0);
    flow = smoothstep(0.0, 0.1, flow) * smoothstep(1.0, 0.9, flow);
    
    // Active state color
    vec3 activeColor = active > 0.5 ? vec3(1.0, 0.6, 0.0) : color;
    
    // Plasma energy
    vec3 plasmaColor = plasma(time * 2.0 + vProgress * 10.0);
    vec3 energyColor = mix(activeColor, plasmaColor, 0.3);
    
    // Data packets
    float packets = sin(time * flowSpeed * 10.0 - vProgress * 30.0);
    packets = smoothstep(0.7, 1.0, packets);
    energyColor += vec3(1.0) * packets * 0.5;
    
    // Edge fade
    float edgeFade = smoothstep(0.0, 0.1, vProgress) * smoothstep(1.0, 0.9, vProgress);
    
    // Lightning effect
    float lightning = sin(vProgress * 100.0 + time * 20.0);
    lightning *= sin(vProgress * 237.0 + time * 30.0);
    lightning = smoothstep(0.8, 1.0, lightning);
    energyColor += vec3(0.5, 0.8, 1.0) * lightning;
    
    // Glow
    float glow = active > 0.5 ? 1.5 : 1.0;
    
    gl_FragColor = vec4(energyColor * glow, opacity * flow * edgeFade);
}