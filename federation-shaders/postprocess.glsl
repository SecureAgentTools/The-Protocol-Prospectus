// Advanced Post-Processing Shader
// Chromatic Aberration, Film Grain, Vignette, and Bloom

// Vertex Shader
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// Fragment Shader
uniform sampler2D tDiffuse;
uniform float time;
uniform vec2 resolution;
uniform float chromaticAberration;
uniform float filmGrain;
uniform float vignette;
uniform float bloom;
uniform float exposure;

varying vec2 vUv;

// Random function
float random(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

// Film grain
vec3 applyFilmGrain(vec3 color, vec2 uv, float strength) {
    float grain = random(uv + time) * 2.0 - 1.0;
    grain = grain * strength * 0.1;
    return color + vec3(grain);
}

// Chromatic aberration
vec3 applyChromaticAberration(sampler2D tex, vec2 uv, float strength) {
    vec2 offset = (uv - 0.5) * strength * 0.01;
    
    float r = texture2D(tex, uv + offset).r;
    float g = texture2D(tex, uv).g;
    float b = texture2D(tex, uv - offset).b;
    
    return vec3(r, g, b);
}

// Vignette
float applyVignette(vec2 uv, float strength) {
    vec2 center = uv - 0.5;
    float dist = length(center);
    return 1.0 - dist * dist * strength;
}

// Simple bloom approximation
vec3 applyBloom(sampler2D tex, vec2 uv, float threshold, float intensity) {
    vec3 color = texture2D(tex, uv).rgb;
    
    // Extract bright areas
    vec3 bright = max(color - threshold, 0.0);
    
    // Blur bright areas (simple box blur)
    vec3 bloom = vec3(0.0);
    float total = 0.0;
    
    for (float x = -2.0; x <= 2.0; x++) {
        for (float y = -2.0; y <= 2.0; y++) {
            vec2 offset = vec2(x, y) / resolution;
            vec3 sample = texture2D(tex, uv + offset).rgb;
            vec3 brightSample = max(sample - threshold, 0.0);
            
            float weight = 1.0 - length(vec2(x, y)) / 3.0;
            weight = max(weight, 0.0);
            
            bloom += brightSample * weight;
            total += weight;
        }
    }
    
    bloom /= total;
    
    return color + bloom * intensity;
}

// Tone mapping (ACES approximation)
vec3 toneMapACES(vec3 color) {
    const float a = 2.51;
    const float b = 0.03;
    const float c = 2.43;
    const float d = 0.59;
    const float e = 0.14;
    
    color = color * exposure;
    return clamp((color * (a * color + b)) / (color * (c * color + d) + e), 0.0, 1.0);
}

// Lens distortion
vec2 applyLensDistortion(vec2 uv, float strength) {
    vec2 center = uv - 0.5;
    float dist = length(center);
    float distortion = 1.0 + dist * dist * strength;
    return center * distortion + 0.5;
}

// Scanlines effect
float scanlines(vec2 uv, float density, float opacity) {
    float line = sin(uv.y * resolution.y * density) * 0.5 + 0.5;
    return 1.0 - (1.0 - line) * opacity;
}

void main() {
    vec2 uv = vUv;
    
    // Apply lens distortion
    uv = applyLensDistortion(uv, 0.1);
    
    // Get color with chromatic aberration
    vec3 color = applyChromaticAberration(tDiffuse, uv, chromaticAberration);
    
    // Apply bloom
    if (bloom > 0.0) {
        color = applyBloom(tDiffuse, uv, 0.8, bloom);
    }
    
    // Apply film grain
    if (filmGrain > 0.0) {
        color = applyFilmGrain(color, uv, filmGrain);
    }
    
    // Apply vignette
    if (vignette > 0.0) {
        float vignetteValue = applyVignette(uv, vignette);
        color *= vignetteValue;
    }
    
    // Apply scanlines for retro effect
    color *= scanlines(uv, 0.5, 0.05);
    
    // Tone mapping
    color = toneMapACES(color);
    
    // Output
    gl_FragColor = vec4(color, 1.0);
}