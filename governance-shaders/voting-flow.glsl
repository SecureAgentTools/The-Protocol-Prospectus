// Voting Flow Shader - Plasma Stream Effects for Vote Visualization
// Creates dynamic energy streams between governance tiers

// Vertex Shader
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform float flowSpeed;
uniform float flowIntensity;
uniform vec3 sourcePosition;
uniform vec3 targetPosition;

varying vec2 vUv;
varying float vProgress;
varying float vIntensity;
varying vec3 vWorldPosition;

// Bezier curve for smooth flow path
vec3 bezierCurve(vec3 p0, vec3 p1, vec3 p2, vec3 p3, float t) {
    float u = 1.0 - t;
    float tt = t * t;
    float uu = u * u;
    float uuu = uu * u;
    float ttt = tt * t;
    
    vec3 p = uuu * p0; // (1-t)^3 * P0
    p += 3.0 * uu * t * p1; // 3(1-t)^2 * t * P1
    p += 3.0 * u * tt * p2; // 3(1-t) * t^2 * P2
    p += ttt * p3; // t^3 * P3
    
    return p;
}

void main() {
    vUv = uv;
    
    // Calculate control points for curved path
    vec3 midPoint = (sourcePosition + targetPosition) * 0.5;
    midPoint.y += distance(sourcePosition, targetPosition) * 0.3; // Arc height
    
    vec3 control1 = mix(sourcePosition, midPoint, 0.5);
    vec3 control2 = mix(midPoint, targetPosition, 0.5);
    
    // Progress along the flow (0 to 1)
    float progress = mod(uv.x + time * flowSpeed, 1.0);
    vProgress = progress;
    
    // Calculate position along bezier curve
    vec3 flowPosition = bezierCurve(sourcePosition, control1, control2, targetPosition, progress);
    
    // Add turbulence
    float turbulence = sin(progress * 10.0 + time * 5.0) * 0.1;
    flowPosition.x += sin(time * 2.0 + progress * 8.0) * turbulence;
    flowPosition.z += cos(time * 2.0 + progress * 8.0) * turbulence;
    
    // Tube radius varies along flow
    float radius = sin(progress * 3.14159) * flowIntensity;
    radius *= (1.0 + sin(time * 3.0 + progress * 20.0) * 0.2);
    
    // Create tube geometry around flow path
    vec3 tubePosition = flowPosition + normal * radius;
    
    vIntensity = radius / flowIntensity;
    vWorldPosition = tubePosition;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(tubePosition, 1.0);
}

// Fragment Shader
precision highp float;

uniform vec3 flowColor;
uniform float time;
uniform float opacity;
uniform float pulseRate;

varying vec2 vUv;
varying float vProgress;
varying float vIntensity;
varying vec3 vWorldPosition;

// Plasma effect
vec3 plasma(vec2 uv, float time) {
    float x = uv.x;
    float y = uv.y;
    float mov0 = x + y + sin(time * 2.0);
    float mov1 = sin(time * 2.0) * 0.5 + 0.5;
    float mov2 = sin(mov0 + time) * 0.5 + 0.5;
    
    float r = abs(sin(mov1 + time));
    float g = abs(sin(mov2 + time * 1.5));
    float b = abs(sin(mov1 + mov2 + time * 2.0));
    
    return vec3(r, g, b);
}

void main() {
    // Base flow color with plasma effect
    vec3 plasmaColor = plasma(vUv * 5.0, time * 0.5);
    vec3 baseColor = mix(flowColor, plasmaColor, 0.3);
    
    // Pulse effect along flow
    float pulse = sin(vProgress * 20.0 - time * pulseRate) * 0.5 + 0.5;
    pulse = pow(pulse, 2.0);
    
    // Edge glow
    float edgeGlow = 1.0 - abs(vUv.y - 0.5) * 2.0;
    edgeGlow = pow(edgeGlow, 2.0);
    
    // Combine effects
    vec3 finalColor = baseColor * (0.5 + pulse * 0.5) * (0.5 + edgeGlow * 0.5);
    
    // Energy decay from source to target
    float energyDecay = 1.0 - pow(vProgress, 2.0) * 0.3;
    finalColor *= energyDecay;
    
    // Add bright core
    float core = pow(edgeGlow, 4.0) * pulse;
    finalColor += vec3(1.0, 0.9, 0.7) * core * 0.5;
    
    // Alpha with fade at ends
    float alpha = opacity * vIntensity * edgeGlow;
    alpha *= smoothstep(0.0, 0.1, vProgress) * smoothstep(1.0, 0.9, vProgress);
    
    gl_FragColor = vec4(finalColor, alpha);
}
