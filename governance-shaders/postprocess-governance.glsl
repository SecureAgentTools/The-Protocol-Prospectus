// Post-processing Shader for Governance Page
// Bloom and depth of field effects for cinematic quality

// Bloom Vertex Shader
const bloomVertexShader = `
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// Bloom Fragment Shader
const bloomFragmentShader = `
    uniform sampler2D tDiffuse;
    uniform float strength;
    uniform float radius;
    uniform float threshold;
    uniform vec2 resolution;
    
    varying vec2 vUv;
    
    vec3 sampleBox(sampler2D tex, vec2 uv, float delta) {
        vec3 color = vec3(0.0);
        vec2 texelSize = 1.0 / resolution;
        
        for(float x = -1.0; x <= 1.0; x++) {
            for(float y = -1.0; y <= 1.0; y++) {
                vec2 offset = vec2(x, y) * texelSize * delta;
                color += texture2D(tex, uv + offset).rgb;
            }
        }
        
        return color / 9.0;
    }
    
    float luminance(vec3 color) {
        return dot(color, vec3(0.299, 0.587, 0.114));
    }
    
    void main() {
        vec3 color = texture2D(tDiffuse, vUv).rgb;
        
        // Extract bright areas
        float lum = luminance(color);
        vec3 brightColor = color * smoothstep(threshold, threshold + 0.1, lum);
        
        // Multi-pass blur
        vec3 blur = vec3(0.0);
        blur += sampleBox(tDiffuse, vUv, radius * 1.0) * 0.5;
        blur += sampleBox(tDiffuse, vUv, radius * 2.0) * 0.3;
        blur += sampleBox(tDiffuse, vUv, radius * 3.0) * 0.2;
        
        // Combine original with bloom
        vec3 finalColor = color + brightColor * blur * strength;
        
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

// Depth of Field Vertex Shader
const dofVertexShader = `
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// Depth of Field Fragment Shader
const dofFragmentShader = `
    uniform sampler2D tDiffuse;
    uniform sampler2D tDepth;
    uniform float focus;
    uniform float aperture;
    uniform float maxblur;
    uniform vec2 resolution;
    
    varying vec2 vUv;
    
    float getDepth(vec2 coord) {
        return texture2D(tDepth, coord).r;
    }
    
    void main() {
        vec2 aspectCorrect = vec2(1.0, resolution.x / resolution.y);
        
        float depth = getDepth(vUv);
        float factor = depth - focus;
        
        vec2 dofblur = vec2(clamp(factor * aperture, -maxblur, maxblur));
        vec2 dofblur9 = dofblur * 0.9;
        vec2 dofblur7 = dofblur * 0.7;
        vec2 dofblur4 = dofblur * 0.4;
        
        vec4 col = vec4(0.0);
        
        col += texture2D(tDiffuse, vUv);
        col += texture2D(tDiffuse, vUv + (vec2(0.0, 0.4) * aspectCorrect) * dofblur);
        col += texture2D(tDiffuse, vUv + (vec2(0.15, 0.37) * aspectCorrect) * dofblur);
        col += texture2D(tDiffuse, vUv + (vec2(0.29, 0.29) * aspectCorrect) * dofblur);
        col += texture2D(tDiffuse, vUv + (vec2(-0.37, 0.15) * aspectCorrect) * dofblur);
        col += texture2D(tDiffuse, vUv + (vec2(0.40, 0.0) * aspectCorrect) * dofblur);
        col += texture2D(tDiffuse, vUv + (vec2(0.37, -0.15) * aspectCorrect) * dofblur);
        col += texture2D(tDiffuse, vUv + (vec2(0.29, -0.29) * aspectCorrect) * dofblur);
        col += texture2D(tDiffuse, vUv + (vec2(-0.15, -0.37) * aspectCorrect) * dofblur);
        col += texture2D(tDiffuse, vUv + (vec2(0.0, -0.4) * aspectCorrect) * dofblur);
        col += texture2D(tDiffuse, vUv + (vec2(-0.15, 0.37) * aspectCorrect) * dofblur);
        col += texture2D(tDiffuse, vUv + (vec2(-0.29, 0.29) * aspectCorrect) * dofblur);
        col += texture2D(tDiffuse, vUv + (vec2(0.37, 0.15) * aspectCorrect) * dofblur);
        col += texture2D(tDiffuse, vUv + (vec2(-0.4, 0.0) * aspectCorrect) * dofblur);
        col += texture2D(tDiffuse, vUv + (vec2(-0.37, -0.15) * aspectCorrect) * dofblur);
        col += texture2D(tDiffuse, vUv + (vec2(-0.29, -0.29) * aspectCorrect) * dofblur);
        col += texture2D(tDiffuse, vUv + (vec2(0.15, -0.37) * aspectCorrect) * dofblur);
        
        col += texture2D(tDiffuse, vUv + (vec2(0.15, 0.37) * aspectCorrect) * dofblur9);
        col += texture2D(tDiffuse, vUv + (vec2(-0.37, 0.15) * aspectCorrect) * dofblur9);
        col += texture2D(tDiffuse, vUv + (vec2(0.37, -0.15) * aspectCorrect) * dofblur9);
        col += texture2D(tDiffuse, vUv + (vec2(-0.15, -0.37) * aspectCorrect) * dofblur9);
        col += texture2D(tDiffuse, vUv + (vec2(-0.15, 0.37) * aspectCorrect) * dofblur9);
        col += texture2D(tDiffuse, vUv + (vec2(0.37, 0.15) * aspectCorrect) * dofblur9);
        col += texture2D(tDiffuse, vUv + (vec2(-0.37, -0.15) * aspectCorrect) * dofblur9);
        col += texture2D(tDiffuse, vUv + (vec2(0.15, -0.37) * aspectCorrect) * dofblur9);
        
        col += texture2D(tDiffuse, vUv + (vec2(0.29, 0.29) * aspectCorrect) * dofblur7);
        col += texture2D(tDiffuse, vUv + (vec2(0.40, 0.0) * aspectCorrect) * dofblur7);
        col += texture2D(tDiffuse, vUv + (vec2(0.29, -0.29) * aspectCorrect) * dofblur7);
        col += texture2D(tDiffuse, vUv + (vec2(0.0, -0.4) * aspectCorrect) * dofblur7);
        col += texture2D(tDiffuse, vUv + (vec2(-0.29, 0.29) * aspectCorrect) * dofblur7);
        col += texture2D(tDiffuse, vUv + (vec2(-0.4, 0.0) * aspectCorrect) * dofblur7);
        col += texture2D(tDiffuse, vUv + (vec2(-0.29, -0.29) * aspectCorrect) * dofblur7);
        col += texture2D(tDiffuse, vUv + (vec2(0.0, 0.4) * aspectCorrect) * dofblur7);
        
        col += texture2D(tDiffuse, vUv + (vec2(0.29, 0.29) * aspectCorrect) * dofblur4);
        col += texture2D(tDiffuse, vUv + (vec2(0.4, 0.0) * aspectCorrect) * dofblur4);
        col += texture2D(tDiffuse, vUv + (vec2(0.29, -0.29) * aspectCorrect) * dofblur4);
        col += texture2D(tDiffuse, vUv + (vec2(0.0, -0.4) * aspectCorrect) * dofblur4);
        col += texture2D(tDiffuse, vUv + (vec2(-0.29, 0.29) * aspectCorrect) * dofblur4);
        col += texture2D(tDiffuse, vUv + (vec2(-0.4, 0.0) * aspectCorrect) * dofblur4);
        col += texture2D(tDiffuse, vUv + (vec2(-0.29, -0.29) * aspectCorrect) * dofblur4);
        col += texture2D(tDiffuse, vUv + (vec2(0.0, 0.4) * aspectCorrect) * dofblur4);
        
        gl_FragColor = col / 41.0;
    }
`;

// Color Grading Shader
const colorGradingFragmentShader = `
    uniform sampler2D tDiffuse;
    uniform vec3 tint;
    uniform float brightness;
    uniform float contrast;
    uniform float saturation;
    
    varying vec2 vUv;
    
    vec3 adjustSaturation(vec3 color, float saturation) {
        float grey = dot(color, vec3(0.299, 0.587, 0.114));
        return mix(vec3(grey), color, saturation);
    }
    
    void main() {
        vec3 color = texture2D(tDiffuse, vUv).rgb;
        
        // Brightness and contrast
        color = (color - 0.5) * contrast + 0.5 + brightness;
        
        // Saturation
        color = adjustSaturation(color, saturation);
        
        // Tint
        color *= tint;
        
        gl_FragColor = vec4(color, 1.0);
    }
`;

// Export shaders
window.governancePostProcessShaders = {
    bloomVertexShader,
    bloomFragmentShader,
    dofVertexShader,
    dofFragmentShader,
    colorGradingFragmentShader
};
