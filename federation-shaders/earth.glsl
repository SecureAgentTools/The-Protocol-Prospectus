// Earth Atmosphere Shader
// Vertex Shader
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vViewPosition;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    
    gl_Position = projectionMatrix * mvPosition;
}

// Fragment Shader
uniform float time;
uniform vec3 color;
uniform float opacity;
uniform vec3 lightPosition;
uniform sampler2D earthTexture;
uniform sampler2D cloudsTexture;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vViewPosition;

void main() {
    // Atmospheric scattering
    vec3 viewDirection = normalize(vViewPosition);
    float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
    vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity;
    
    // Earth texture with animated clouds
    vec3 earthColor = texture2D(earthTexture, vUv).rgb;
    vec2 cloudUv = vUv + vec2(time * 0.01, 0.0);
    vec3 cloudColor = texture2D(cloudsTexture, cloudUv).rgb;
    
    // Blend earth and clouds
    vec3 surfaceColor = mix(earthColor, cloudColor, cloudColor.r * 0.5);
    
    // Add city lights on dark side
    vec3 lightDir = normalize(lightPosition - vPosition);
    float dayNight = dot(vNormal, lightDir);
    float nightMask = smoothstep(-0.1, 0.1, -dayNight);
    
    // City lights glow
    float cityLights = sin(vUv.x * 200.0) * sin(vUv.y * 200.0);
    cityLights = smoothstep(0.7, 0.9, cityLights);
    vec3 lightsColor = vec3(1.0, 0.8, 0.4) * cityLights * nightMask;
    
    // Fresnel effect for atmosphere
    float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.0);
    
    // Final color composition
    vec3 finalColor = surfaceColor + lightsColor + atmosphere * fresnel;
    
    // Subtle grid overlay
    float grid = sin(vUv.x * 100.0) * sin(vUv.y * 100.0);
    grid = smoothstep(0.95, 1.0, grid);
    finalColor += vec3(0.2, 0.5, 1.0) * grid * 0.1;
    
    gl_FragColor = vec4(finalColor, opacity);
}