// Signature Flow Shader - Visualizes cryptographic signatures as flowing particles

const signatureFlowVertexShader = `
    uniform float uTime;
    uniform float uFlowSpeed;
    uniform vec3 uFlowDirection;
    uniform float uTurbulence;
    
    attribute float aProgress;
    attribute float aOffset;
    attribute vec3 aStartPos;
    attribute vec3 aEndPos;
    attribute vec3 aControlPoint1;
    attribute vec3 aControlPoint2;
    attribute float aSpeed;
    attribute vec3 aColor;
    
    varying vec3 vColor;
    varying float vProgress;
    varying float vOpacity;
    varying vec3 vPosition;
    
    // Bezier curve calculation
    vec3 bezier4(vec3 p0, vec3 p1, vec3 p2, vec3 p3, float t) {
        float t2 = t * t;
        float t3 = t2 * t;
        float mt = 1.0 - t;
        float mt2 = mt * mt;
        float mt3 = mt2 * mt;
        
        return mt3 * p0 + 3.0 * mt2 * t * p1 + 3.0 * mt * t2 * p2 + t3 * p3;
    }
    
    // Turbulence function
    vec3 turbulence(vec3 p, float time) {
        vec3 turb = vec3(
            sin(p.y * 0.1 + time) * cos(p.z * 0.1),
            cos(p.x * 0.1 + time * 1.3) * sin(p.z * 0.1),
            sin(p.x * 0.1 - time * 0.7) * cos(p.y * 0.1)
        );
        return turb * uTurbulence;
    }
    
    void main() {
        // Calculate progress along path with individual speed
        float progress = mod(aProgress + uTime * uFlowSpeed * aSpeed + aOffset, 1.0);
        vProgress = progress;
        
        // Calculate position along bezier curve
        vec3 pathPosition = bezier4(aStartPos, aControlPoint1, aControlPoint2, aEndPos, progress);
        
        // Add turbulence
        vec3 turb = turbulence(pathPosition, uTime);
        pathPosition += turb;
        
        // Add flow direction influence
        pathPosition += uFlowDirection * sin(progress * 3.14159) * 0.5;
        
        vPosition = pathPosition;
        vColor = aColor;
        
        // Fade in/out at ends
        vOpacity = smoothstep(0.0, 0.1, progress) * smoothstep(1.0, 0.9, progress);
        
        vec4 mvPosition = modelViewMatrix * vec4(pathPosition, 1.0);
        
        // Size based on progress (smaller at ends)
        float size = 4.0 + sin(progress * 3.14159) * 2.0;
        gl_PointSize = size * (300.0 / -mvPosition.z);
        
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const signatureFlowFragmentShader = `
    uniform float uTime;
    uniform sampler2D uFlowTexture;
    uniform vec3 uGlowColor;
    uniform float uGlowIntensity;
    
    varying vec3 vColor;
    varying float vProgress;
    varying float vOpacity;
    varying vec3 vPosition;
    
    void main() {
        vec2 uv = gl_PointCoord;
        
        // Create trail effect
        vec2 trailUV = vec2(uv.x, uv.y * 0.3 + 0.35);
        float trail = 1.0 - length(trailUV - vec2(0.5));
        trail = smoothstep(0.0, 0.5, trail);
        
        // Energy core
        float core = 1.0 - length(uv - 0.5) * 2.0;
        core = pow(max(0.0, core), 3.0);
        
        // Combine trail and core
        float shape = max(trail * 0.7, core);
        
        // Animated texture lookup
        vec2 texUV = uv + vec2(uTime * 0.1, 0.0);
        vec4 flowTex = texture2D(uFlowTexture, texUV);
        
        // Color with glow
        vec3 color = vColor;
        color += uGlowColor * core * uGlowIntensity;
        
        // Add energy wave
        float wave = sin(vProgress * 20.0 - uTime * 5.0) * 0.5 + 0.5;
        color += vColor * wave * 0.3;
        
        // Signature pattern overlay
        float pattern = sin(uv.x * 50.0 + uTime * 2.0) * cos(uv.y * 50.0 - uTime * 3.0);
        pattern = pattern * 0.5 + 0.5;
        color = mix(color, color * 1.5, pattern * 0.2);
        
        // Final alpha
        float alpha = shape * vOpacity * flowTex.a;
        alpha = min(alpha * 1.5, 1.0);
        
        gl_FragColor = vec4(color, alpha);
    }
`;

// Signature verification burst shader
const signatureBurstVertexShader = `
    uniform float uTime;
    uniform float uExplosionProgress;
    uniform vec3 uCenter;
    
    attribute vec3 aDirection;
    attribute float aSpeed;
    attribute float aRandom;
    attribute float aSize;
    
    varying vec3 vColor;
    varying float vOpacity;
    varying float vRandom;
    
    void main() {
        vRandom = aRandom;
        
        // Explosion motion
        float progress = uExplosionProgress;
        vec3 explodePos = uCenter + aDirection * aSpeed * progress * 10.0;
        
        // Add some curl
        float curl = sin(progress * 3.14159 + aRandom * 6.28);
        explodePos.x += curl * aDirection.z * 2.0;
        explodePos.z -= curl * aDirection.x * 2.0;
        
        // Gravity effect
        explodePos.y -= progress * progress * 5.0;
        
        // Color based on verification state
        vec3 successColor = vec3(0.13, 0.72, 0.51); // Green for success
        vec3 pendingColor = vec3(0.98, 0.75, 0.14); // Gold for pending
        vColor = mix(pendingColor, successColor, smoothstep(0.3, 0.7, progress));
        
        // Fade out
        vOpacity = 1.0 - smoothstep(0.5, 1.0, progress);
        
        vec4 mvPosition = modelViewMatrix * vec4(explodePos, 1.0);
        
        // Size decreases over time
        float size = aSize * (1.0 - progress * 0.5);
        gl_PointSize = size * (500.0 / -mvPosition.z);
        
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const signatureBurstFragmentShader = `
    uniform float uTime;
    
    varying vec3 vColor;
    varying float vOpacity;
    varying float vRandom;
    
    void main() {
        vec2 uv = gl_PointCoord;
        
        // Star shape
        float star = 0.0;
        float angle = atan(uv.y - 0.5, uv.x - 0.5);
        float radius = length(uv - 0.5);
        
        for(float i = 0.0; i < 5.0; i++) {
            float a = i * 1.2566; // 2PI/5
            float beam = 1.0 - abs(mod(angle - a + 3.14159, 6.28318) - 3.14159) * 2.0;
            beam = pow(max(0.0, beam), 3.0);
            star = max(star, beam * (1.0 - radius * 2.0));
        }
        
        // Add circular core
        float core = 1.0 - radius * 3.0;
        core = max(0.0, core);
        star = max(star, core);
        
        // Sparkle effect
        float sparkle = sin(uTime * 10.0 + vRandom * 6.28) * 0.5 + 0.5;
        vec3 color = vColor * (0.8 + 0.2 * sparkle);
        
        // Energy ring
        float ring = abs(radius - 0.3) < 0.05 ? 1.0 : 0.0;
        color += vec3(1.0) * ring * 0.5;
        
        float alpha = star * vOpacity;
        gl_FragColor = vec4(color, alpha);
    }
`;

export {
    signatureFlowVertexShader,
    signatureFlowFragmentShader,
    signatureBurstVertexShader,
    signatureBurstFragmentShader
};
