// Post-Processing Shader - Advanced visual effects pipeline
// For ZKP visualization with bloom, chromatic aberration, and cinematic effects

// Vertex Shader (Simple passthrough)
const postProcessVertexShader = `
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// Main Post-Processing Fragment Shader
const postProcessFragmentShader = `
    varying vec2 vUv;
    
    uniform sampler2D tDiffuse;
    uniform sampler2D tDepth;
    uniform sampler2D tNormal;
    uniform sampler2D tNoise;
    uniform vec2 uResolution;
    uniform float uTime;
    
    // Effect parameters
    uniform float uBloomStrength;
    uniform float uBloomRadius;
    uniform float uChromaticAberration;
    uniform float uVignetteIntensity;
    uniform float uFilmGrainIntensity;
    uniform float uGlitchIntensity;
    uniform float uScanlineIntensity;
    uniform float uFocusDistance;
    uniform float uFocusRange;
    uniform float uMotionBlurStrength;
    uniform vec3 uColorBalance;
    uniform float uSaturation;
    uniform float uContrast;
    
    // Depth of field parameters
    uniform float uAperture;
    uniform float uMaxBlur;
    
    // Random function
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    // 2D rotation matrix
    mat2 rotate2D(float angle) {
        return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    }
    
    // Gaussian blur for bloom
    vec3 gaussianBlur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction, float radius) {
        vec3 color = vec3(0.0);
        vec2 step = direction / resolution;
        
        // 9-tap Gaussian kernel
        float weights[9];
        weights[0] = 0.13298;
        weights[1] = 0.125858;
        weights[2] = 0.106595;
        weights[3] = 0.080656;
        weights[4] = 0.054670;
        weights[5] = 0.033062;
        weights[6] = 0.017879;
        weights[7] = 0.008631;
        weights[8] = 0.003722;
        
        color += texture2D(image, uv).rgb * weights[0];
        
        for (int i = 1; i < 9; i++) {
            vec2 offset = step * float(i) * radius;
            color += texture2D(image, uv + offset).rgb * weights[i];
            color += texture2D(image, uv - offset).rgb * weights[i];
        }
        
        return color;
    }
    
    // Chromatic aberration
    vec3 chromaticAberration(sampler2D image, vec2 uv, float amount) {
        vec2 distFromCenter = uv - 0.5;
        
        vec2 rOffset = distFromCenter * (1.0 + amount * 0.01);
        vec2 gOffset = distFromCenter * (1.0 + amount * 0.005);
        vec2 bOffset = distFromCenter * (1.0 - amount * 0.01);
        
        float r = texture2D(image, uv + rOffset).r;
        float g = texture2D(image, uv + gOffset).g;
        float b = texture2D(image, uv + bOffset).b;
        
        return vec3(r, g, b);
    }
    
    // Vignette effect
    float vignette(vec2 uv, float intensity, float roundness) {
        vec2 dist = uv - 0.5;
        dist.x *= roundness;
        return 1.0 - dot(dist, dist) * intensity;
    }
    
    // Film grain
    float filmGrain(vec2 uv, float time, float intensity) {
        return (random(uv + mod(time, 10.0)) - 0.5) * intensity;
    }
    
    // Scanlines
    float scanlines(vec2 uv, float time, float intensity) {
        return sin(uv.y * 800.0 + time * 10.0) * 0.04 * intensity;
    }
    
    // Digital glitch effect
    vec3 digitalGlitch(vec3 color, vec2 uv, float time, float intensity) {
        float glitchTime = floor(time * 10.0) / 10.0;
        
        if (random(vec2(glitchTime)) < intensity) {
            // Horizontal displacement
            float displaceAmount = random(vec2(glitchTime * 7.0)) * 0.1;
            vec2 displaceUV = uv + vec2(displaceAmount, 0.0);
            
            // Color channel shift
            vec3 glitchColor;
            glitchColor.r = texture2D(tDiffuse, displaceUV + vec2(0.01, 0.0)).r;
            glitchColor.g = texture2D(tDiffuse, displaceUV).g;
            glitchColor.b = texture2D(tDiffuse, displaceUV - vec2(0.01, 0.0)).b;
            
            // Block artifacts
            float blockNoise = step(0.9, random(floor(uv * 20.0) + glitchTime));
            return mix(color, glitchColor, blockNoise);
        }
        
        return color;
    }
    
    // Depth of field blur
    vec3 depthOfField(sampler2D image, sampler2D depth, vec2 uv, vec2 resolution) {
        float centerDepth = texture2D(depth, vec2(0.5)).r;
        float fragmentDepth = texture2D(depth, uv).r;
        
        float blur = abs(fragmentDepth - centerDepth) * uAperture;
        blur = clamp(blur, 0.0, uMaxBlur);
        
        return gaussianBlur(image, uv, resolution, vec2(1.0, 0.0), blur);
    }
    
    // Edge detection for stylized outlines
    float edgeDetection(sampler2D normal, vec2 uv, vec2 resolution) {
        vec2 texelSize = 1.0 / resolution;
        
        vec3 n0 = texture2D(normal, uv + vec2(-texelSize.x, -texelSize.y)).rgb;
        vec3 n1 = texture2D(normal, uv + vec2(0.0, -texelSize.y)).rgb;
        vec3 n2 = texture2D(normal, uv + vec2(texelSize.x, -texelSize.y)).rgb;
        vec3 n3 = texture2D(normal, uv + vec2(-texelSize.x, 0.0)).rgb;
        vec3 n4 = texture2D(normal, uv).rgb;
        vec3 n5 = texture2D(normal, uv + vec2(texelSize.x, 0.0)).rgb;
        vec3 n6 = texture2D(normal, uv + vec2(-texelSize.x, texelSize.y)).rgb;
        vec3 n7 = texture2D(normal, uv + vec2(0.0, texelSize.y)).rgb;
        vec3 n8 = texture2D(normal, uv + vec2(texelSize.x, texelSize.y)).rgb;
        
        // Sobel operator
        vec3 sobelX = n2 + 2.0 * n5 + n8 - n0 - 2.0 * n3 - n6;
        vec3 sobelY = n0 + 2.0 * n1 + n2 - n6 - 2.0 * n7 - n8;
        
        return length(sobelX) + length(sobelY);
    }
    
    // Color grading
    vec3 colorGrading(vec3 color) {
        // Apply color balance
        color *= uColorBalance;
        
        // Adjust saturation
        vec3 gray = vec3(dot(color, vec3(0.299, 0.587, 0.114)));
        color = mix(gray, color, uSaturation);
        
        // Apply contrast
        color = (color - 0.5) * uContrast + 0.5;
        
        // Tone mapping
        color = color / (color + vec3(1.0));
        
        // Gamma correction
        color = pow(color, vec3(1.0 / 2.2));
        
        return color;
    }
    
    // Motion blur (simple radial blur from center)
    vec3 motionBlur(sampler2D image, vec2 uv, float strength) {
        vec3 color = vec3(0.0);
        vec2 center = vec2(0.5);
        vec2 dir = normalize(uv - center);
        
        const int samples = 8;
        for (int i = 0; i < samples; i++) {
            float scale = 1.0 - strength * (float(i) / float(samples - 1));
            vec2 sampleUV = center + (uv - center) * scale;
            color += texture2D(image, sampleUV).rgb;
        }
        
        return color / float(samples);
    }
    
    // Lens flare effect
    vec3 lensFlare(vec2 uv, vec2 lightPos) {
        vec3 flare = vec3(0.0);
        vec2 dir = uv - lightPos;
        float dist = length(dir);
        
        // Main flare
        flare += vec3(1.0, 0.8, 0.6) * pow(max(0.0, 1.0 - dist), 10.0) * 0.5;
        
        // Secondary flares
        for (int i = 1; i <= 5; i++) {
            vec2 flarePos = lightPos + dir * float(i) * 0.5;
            float flareDist = length(uv - flarePos);
            flare += vec3(0.5, 0.3, 0.1) * pow(max(0.0, 1.0 - flareDist * 10.0), 2.0) * 0.1;
        }
        
        return flare;
    }
    
    void main() {
        vec2 uv = vUv;
        
        // Base color with chromatic aberration
        vec3 color = chromaticAberration(tDiffuse, uv, uChromaticAberration);
        
        // Apply motion blur
        if (uMotionBlurStrength > 0.0) {
            color = mix(color, motionBlur(tDiffuse, uv, uMotionBlurStrength), 0.5);
        }
        
        // Bloom effect
        vec3 bloomColor = gaussianBlur(tDiffuse, uv, uResolution, vec2(1.0, 0.0), uBloomRadius);
        bloomColor = gaussianBlur(tDiffuse, uv, uResolution, vec2(0.0, 1.0), uBloomRadius);
        
        // Extract bright areas for bloom
        vec3 brightColor = max(vec3(0.0), bloomColor - vec3(0.8));
        color += brightColor * uBloomStrength;
        
        // Depth of field
        if (uAperture > 0.0) {
            color = depthOfField(tDiffuse, tDepth, uv, uResolution);
        }
        
        // Edge detection for stylized look
        if (tNormal != tDiffuse) {
            float edges = edgeDetection(tNormal, uv, uResolution);
            color *= 1.0 - edges * 0.3;
        }
        
        // Digital glitch
        if (uGlitchIntensity > 0.0) {
            color = digitalGlitch(color, uv, uTime, uGlitchIntensity);
        }
        
        // Film grain
        if (uFilmGrainIntensity > 0.0) {
            float grain = filmGrain(uv, uTime, uFilmGrainIntensity);
            color += vec3(grain);
        }
        
        // Scanlines
        if (uScanlineIntensity > 0.0) {
            color += vec3(scanlines(uv, uTime, uScanlineIntensity));
        }
        
        // Vignette
        float vignetteFactor = vignette(uv, uVignetteIntensity, 1.0);
        color *= vignetteFactor;
        
        // Lens flare (if bright objects detected)
        vec3 brightestPoint = texture2D(tDiffuse, vec2(0.5, 0.2)).rgb;
        if (length(brightestPoint) > 2.0) {
            color += lensFlare(uv, vec2(0.5, 0.2)) * 0.3;
        }
        
        // Color grading
        color = colorGrading(color);
        
        // Final output
        gl_FragColor = vec4(color, 1.0);
    }
`;

// FXAA Anti-aliasing shader
const fxaaFragmentShader = `
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    
    varying vec2 vUv;
    
    #define FXAA_EDGE_THRESHOLD (1.0/8.0)
    #define FXAA_EDGE_THRESHOLD_MIN (1.0/24.0)
    #define FXAA_SEARCH_STEPS 32
    #define FXAA_SEARCH_THRESHOLD (1.0/4.0)
    #define FXAA_SUBPIX_CAP (3.0/4.0)
    #define FXAA_SUBPIX_TRIM (1.0/4.0)
    
    float luminance(vec3 color) {
        return dot(color, vec3(0.299, 0.587, 0.114));
    }
    
    void main() {
        vec2 texelSize = 1.0 / uResolution;
        
        // Sample neighboring pixels
        vec3 rgbM = texture2D(tDiffuse, vUv).rgb;
        vec3 rgbNW = texture2D(tDiffuse, vUv + vec2(-texelSize.x, -texelSize.y)).rgb;
        vec3 rgbNE = texture2D(tDiffuse, vUv + vec2(texelSize.x, -texelSize.y)).rgb;
        vec3 rgbSW = texture2D(tDiffuse, vUv + vec2(-texelSize.x, texelSize.y)).rgb;
        vec3 rgbSE = texture2D(tDiffuse, vUv + vec2(texelSize.x, texelSize.y)).rgb;
        
        // Convert to luminance
        float lumM = luminance(rgbM);
        float lumNW = luminance(rgbNW);
        float lumNE = luminance(rgbNE);
        float lumSW = luminance(rgbSW);
        float lumSE = luminance(rgbSE);
        
        // Find min and max luminance
        float lumMin = min(lumM, min(min(lumNW, lumNE), min(lumSW, lumSE)));
        float lumMax = max(lumM, max(max(lumNW, lumNE), max(lumSW, lumSE)));
        
        // Calculate luminance range
        float lumRange = lumMax - lumMin;
        
        // Skip if contrast is too low
        if (lumRange < max(FXAA_EDGE_THRESHOLD_MIN, lumMax * FXAA_EDGE_THRESHOLD)) {
            gl_FragColor = vec4(rgbM, 1.0);
            return;
        }
        
        // Sampling additional neighbors
        vec3 rgbN = texture2D(tDiffuse, vUv + vec2(0.0, -texelSize.y)).rgb;
        vec3 rgbS = texture2D(tDiffuse, vUv + vec2(0.0, texelSize.y)).rgb;
        vec3 rgbW = texture2D(tDiffuse, vUv + vec2(-texelSize.x, 0.0)).rgb;
        vec3 rgbE = texture2D(tDiffuse, vUv + vec2(texelSize.x, 0.0)).rgb;
        
        float lumN = luminance(rgbN);
        float lumS = luminance(rgbS);
        float lumW = luminance(rgbW);
        float lumE = luminance(rgbE);
        
        // Calculate blend factor
        float lumL = (lumN + lumS + lumE + lumW) * 0.25;
        float rangeL = abs(lumL - lumM);
        float blendL = max(0.0, (rangeL / lumRange) - FXAA_SUBPIX_TRIM) * (1.0 / (1.0 - FXAA_SUBPIX_TRIM));
        blendL = min(FXAA_SUBPIX_CAP, blendL);
        
        // Calculate blend direction
        float edgeVert = abs(lumN + lumS - 2.0 * lumM) * 2.0 +
                        abs(lumNE + lumSE - 2.0 * lumE) +
                        abs(lumNW + lumSW - 2.0 * lumW);
                        
        float edgeHorz = abs(lumE + lumW - 2.0 * lumM) * 2.0 +
                        abs(lumNE + lumNW - 2.0 * lumN) +
                        abs(lumSE + lumSW - 2.0 * lumS);
                        
        bool isHorizontal = edgeHorz >= edgeVert;
        
        // Choose edge direction
        vec2 dir = isHorizontal ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        
        // Apply FXAA
        vec3 rgbA = 0.5 * (
            texture2D(tDiffuse, vUv + dir * texelSize * (-0.5)).rgb +
            texture2D(tDiffuse, vUv + dir * texelSize * 0.5).rgb
        );
        
        gl_FragColor = vec4(mix(rgbM, rgbA, blendL), 1.0);
    }
`;

export { postProcessVertexShader, postProcessFragmentShader, fxaaFragmentShader };
