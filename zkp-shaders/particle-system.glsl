// Particle System Shader - Advanced GPU particles with multiple behaviors
// For ZKP ambient particles, proof generation effects, and data visualization

// Vertex Shader
const particleVertexShader = `
    attribute float aSize;
    attribute vec3 aVelocity;
    attribute float aLife;
    attribute float aType; // 0: ambient, 1: proof, 2: data, 3: explosion
    attribute vec3 aColor;
    
    varying vec3 vColor;
    varying float vLife;
    varying float vType;
    
    uniform float uTime;
    uniform float uDeltaTime;
    uniform vec3 uGravity;
    uniform float uTurbulence;
    uniform vec3 uWindForce;
    uniform mat4 uRotationMatrix;
    
    // Simplex noise for turbulence
    vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec2 mod289(vec2 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec3 permute(vec3 x) {
        return mod289(((x*34.0)+1.0)*x);
    }
    
    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187,
                            0.366025403784439,
                            -0.577350269189626,
                            0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                         + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }
    
    // Curl noise for organic movement
    vec3 curlNoise(vec3 p) {
        float e = 0.1;
        vec3 dx = vec3(e, 0.0, 0.0);
        vec3 dy = vec3(0.0, e, 0.0);
        vec3 dz = vec3(0.0, 0.0, e);
        
        float x0 = snoise(p.yz);
        float x1 = snoise((p + dx).yz);
        float y0 = snoise(p.xz);
        float y1 = snoise((p + dy).xz);
        float z0 = snoise(p.xy);
        float z1 = snoise((p + dz).xy);
        
        float x = (y1 - y0) - (z1 - z0);
        float y = (z1 - z0) - (x1 - x0);
        float z = (x1 - x0) - (y1 - y0);
        
        return vec3(x, y, z) / e;
    }
    
    void main() {
        vColor = aColor;
        vLife = aLife;
        vType = aType;
        
        vec3 pos = position;
        vec3 velocity = aVelocity;
        
        // Apply different behaviors based on particle type
        if (aType == 0.0) {
            // Ambient particles - gentle floating
            vec3 curl = curlNoise(pos * 0.1 + uTime * 0.1) * uTurbulence;
            pos += curl * 0.5;
            pos += velocity * uDeltaTime;
            pos += uWindForce * uDeltaTime * 0.5;
            
        } else if (aType == 1.0) {
            // Proof particles - spiral motion
            float angle = uTime * 2.0 + aLife * 6.28318;
            float radius = aLife * 2.0;
            pos.x += cos(angle) * radius * 0.1;
            pos.z += sin(angle) * radius * 0.1;
            pos.y += velocity.y * uDeltaTime + aLife * 0.5;
            
        } else if (aType == 2.0) {
            // Data particles - follow path
            pos += velocity * uDeltaTime * 2.0;
            float wave = sin(uTime * 3.0 + pos.x * 0.5) * 0.2;
            pos.y += wave;
            
        } else if (aType == 3.0) {
            // Explosion particles - radial burst
            vec3 explosionVel = velocity * (1.0 + aLife * 2.0);
            pos += explosionVel * uDeltaTime;
            pos += uGravity * uDeltaTime * (1.0 - aLife);
        }
        
        // Apply rotation matrix for view alignment
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        
        // Size based on life and type
        float size = aSize;
        if (aType == 0.0) {
            size *= (1.0 - aLife * 0.3); // Ambient particles fade
        } else if (aType == 1.0) {
            size *= (1.0 + sin(aLife * 3.14159) * 0.5); // Proof particles pulse
        } else if (aType == 2.0) {
            size *= (1.0 + aLife * 0.5); // Data particles grow
        } else if (aType == 3.0) {
            size *= aLife; // Explosion particles shrink
        }
        
        // Perspective size scaling
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

// Fragment Shader
const particleFragmentShader = `
    varying vec3 vColor;
    varying float vLife;
    varying float vType;
    
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform vec3 uGlowColor;
    uniform float uGlowIntensity;
    
    // Creates different particle shapes
    float particleShape(vec2 coord, float type) {
        if (type == 0.0) {
            // Soft circle for ambient
            float dist = length(coord - vec2(0.5));
            return 1.0 - smoothstep(0.0, 0.5, dist);
            
        } else if (type == 1.0) {
            // Star shape for proof
            vec2 pos = coord - vec2(0.5);
            float angle = atan(pos.y, pos.x);
            float radius = length(pos);
            float star = sin(angle * 5.0) * 0.2 + 0.8;
            return 1.0 - smoothstep(0.0, star * 0.5, radius);
            
        } else if (type == 2.0) {
            // Diamond for data
            vec2 pos = abs(coord - vec2(0.5));
            float diamond = pos.x + pos.y;
            return 1.0 - smoothstep(0.0, 0.5, diamond);
            
        } else {
            // Explosion - textured
            return texture2D(uTexture, coord).a;
        }
    }
    
    // Animated glow effect
    float animatedGlow(vec2 coord, float time, float life) {
        float dist = length(coord - vec2(0.5));
        float glow = 1.0 - smoothstep(0.0, 0.5, dist);
        glow *= sin(time * 10.0 + life * 6.28318) * 0.5 + 0.5;
        return glow;
    }
    
    void main() {
        vec2 coord = gl_PointCoord;
        
        // Get particle shape
        float shape = particleShape(coord, vType);
        
        // Add glow for certain types
        float glow = 0.0;
        if (vType == 1.0 || vType == 3.0) {
            glow = animatedGlow(coord, uTime, vLife);
        }
        
        // Color calculation
        vec3 color = vColor;
        
        // Type-specific color effects
        if (vType == 0.0) {
            // Ambient - subtle color variation
            color *= 0.8 + sin(uTime + vLife * 10.0) * 0.2;
            
        } else if (vType == 1.0) {
            // Proof - iridescent effect
            float irid = sin(uTime * 2.0 + vLife * 5.0);
            color = mix(color, uGlowColor, irid * 0.5 + 0.5);
            
        } else if (vType == 2.0) {
            // Data - energy pulse
            float pulse = sin(uTime * 5.0 - vLife * 10.0) * 0.5 + 0.5;
            color = mix(color, vec3(1.0), pulse * 0.3);
            
        } else if (vType == 3.0) {
            // Explosion - hot to cold gradient
            color = mix(vec3(1.0, 0.5, 0.0), color, vLife);
        }
        
        // Apply glow
        color += uGlowColor * glow * uGlowIntensity;
        
        // Alpha based on shape and life
        float alpha = shape * vLife;
        
        // Additive blending boost for certain types
        if (vType == 1.0 || vType == 2.0) {
            alpha *= 1.5;
        }
        
        // Soft edges
        alpha *= smoothstep(0.0, 0.1, shape);
        
        // Output
        gl_FragColor = vec4(color, alpha);
    }
`;

// Compute shader for GPU particle physics (WebGL 2.0)
const particleComputeShader = `
    #version 310 es
    
    layout(local_size_x = 64) in;
    
    struct Particle {
        vec3 position;
        vec3 velocity;
        vec3 color;
        float life;
        float size;
        float type;
    };
    
    layout(std430, binding = 0) buffer ParticleBuffer {
        Particle particles[];
    };
    
    uniform float uDeltaTime;
    uniform float uTime;
    uniform vec3 uGravity;
    uniform vec3 uWindForce;
    uniform vec3 uAttractorPos;
    uniform float uAttractorStrength;
    
    void main() {
        uint id = gl_GlobalInvocationID.x;
        
        Particle p = particles[id];
        
        // Update life
        p.life -= uDeltaTime * 0.5;
        
        // Reset dead particles
        if (p.life <= 0.0) {
            p.life = 1.0;
            p.position = vec3(
                (fract(sin(float(id) * 12.9898) * 43758.5453) - 0.5) * 50.0,
                (fract(sin(float(id) * 78.233) * 43758.5453) - 0.5) * 50.0,
                (fract(sin(float(id) * 45.164) * 43758.5453) - 0.5) * 50.0
            );
            p.velocity = vec3(0.0);
        }
        
        // Apply forces based on type
        if (p.type == 0.0) {
            // Ambient - affected by wind
            p.velocity += uWindForce * uDeltaTime;
            
        } else if (p.type == 1.0) {
            // Proof - attracted to center
            vec3 toCenter = uAttractorPos - p.position;
            p.velocity += normalize(toCenter) * uAttractorStrength * uDeltaTime;
            
        } else if (p.type == 2.0) {
            // Data - maintain speed
            p.velocity = normalize(p.velocity) * 5.0;
            
        } else if (p.type == 3.0) {
            // Explosion - gravity
            p.velocity += uGravity * uDeltaTime;
        }
        
        // Update position
        p.position += p.velocity * uDeltaTime;
        
        // Write back
        particles[id] = p;
    }
`;

export { particleVertexShader, particleFragmentShader, particleComputeShader };
