// Data Flow Shader - Plasma energy streams with particle effects
// For ZKP data connections and proof flow visualization

// Vertex Shader
const dataFlowVertexShader = `
    attribute float aOffset;
    attribute float aSpeed;
    attribute vec3 aColor;
    
    varying vec2 vUv;
    varying float vOffset;
    varying float vSpeed;
    varying vec3 vColor;
    varying vec3 vPosition;
    
    uniform float uTime;
    uniform float uFlowSpeed;
    uniform float uPulseIntensity;
    
    void main() {
        vUv = uv;
        vOffset = aOffset;
        vSpeed = aSpeed;
        vColor = aColor;
        
        vec3 pos = position;
        
        // Create wave motion along the connection
        float wave = sin(uTime * uFlowSpeed + aOffset * 6.28318) * uPulseIntensity;
        pos.y += wave * 0.1;
        
        // Store world position for fragment shader
        vec4 worldPos = modelMatrix * vec4(pos, 1.0);
        vPosition = worldPos.xyz;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

// Fragment Shader
const dataFlowFragmentShader = `
    varying vec2 vUv;
    varying float vOffset;
    varying float vSpeed;
    varying vec3 vColor;
    varying vec3 vPosition;
    
    uniform float uTime;
    uniform float uFlowSpeed;
    uniform float uOpacity;
    uniform vec3 uPrimaryColor;
    uniform vec3 uSecondaryColor;
    uniform float uActivation;
    uniform float uThickness;
    
    // Plasma effect
    float plasma(vec2 p, float time) {
        float s1 = sin(p.x * 10.0 + time * 2.0);
        float s2 = sin(p.y * 10.0 + time * 2.0);
        float s3 = sin((p.x + p.y) * 10.0 + time * 2.0);
        float s4 = sin(length(p) * 10.0 - time * 2.0);
        return (s1 + s2 + s3 + s4) * 0.25;
    }
    
    // Data packet visualization
    float dataPacket(float x, float time, float offset) {
        float pos = mod(time * uFlowSpeed + offset, 1.0);
        float dist = abs(x - pos);
        return smoothstep(0.1, 0.0, dist) * 2.0;
    }
    
    // Hexagonal data stream pattern
    float hexPattern(vec2 p, float scale) {
        p *= scale;
        vec2 h = vec2(1.0, 1.73205);
        vec2 a = mod(p, h) - h * 0.5;
        vec2 b = mod(p - h * 0.5, h) - h * 0.5;
        return min(dot(a, a), dot(b, b));
    }
    
    void main() {
        // Base flow visualization
        float flow = vUv.x;
        
        // Multiple data packets
        float packets = 0.0;
        for(int i = 0; i < 5; i++) {
            float offset = float(i) * 0.2 + vOffset;
            packets += dataPacket(flow, uTime, offset);
        }
        packets = clamp(packets, 0.0, 1.0);
        
        // Plasma energy effect
        vec2 plasmaCoord = vec2(flow * 5.0, vUv.y * 2.0);
        float plasmaEffect = plasma(plasmaCoord, uTime * 0.5) * 0.5 + 0.5;
        
        // Hexagonal data pattern
        float hexData = hexPattern(vec2(flow * 10.0, vUv.y), 20.0);
        hexData = 1.0 - smoothstep(0.0, 0.05, hexData);
        
        // Edge glow
        float edge = 1.0 - abs(vUv.y - 0.5) * 2.0;
        edge = pow(edge, 3.0);
        
        // Color mixing
        vec3 flowColor = mix(uPrimaryColor, uSecondaryColor, plasmaEffect);
        flowColor = mix(flowColor, vColor, packets);
        
        // Add hexagonal pattern
        flowColor += vec3(hexData) * uSecondaryColor * 0.3;
        
        // Energy surge effect
        float surge = sin(uTime * 3.0 + flow * 10.0) * 0.5 + 0.5;
        flowColor += uSecondaryColor * surge * uActivation * 0.5;
        
        // Apply edge glow
        flowColor *= edge;
        
        // Brightness based on activation and packets
        float brightness = mix(0.3, 1.0, uActivation);
        brightness *= (1.0 + packets * 2.0);
        
        // Final color with transparency
        vec3 finalColor = flowColor * brightness;
        float alpha = (edge * 0.5 + packets * 0.5) * uOpacity;
        alpha *= mix(0.3, 1.0, uActivation);
        
        // Distance fade
        float distFade = 1.0 - smoothstep(10.0, 50.0, length(vPosition));
        alpha *= distFade;
        
        gl_FragColor = vec4(finalColor, alpha);
    }
`;

// Geometry Shader for advanced flow (WebGL 2.0)
const dataFlowGeometryShader = `
    #version 300 es
    
    layout(lines) in;
    layout(triangle_strip, max_vertices = 64) out;
    
    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;
    uniform float uTime;
    uniform float uThickness;
    
    out vec2 vUv;
    out vec3 vPosition;
    
    void main() {
        vec4 p0 = gl_in[0].gl_Position;
        vec4 p1 = gl_in[1].gl_Position;
        
        vec3 dir = normalize(p1.xyz - p0.xyz);
        vec3 right = normalize(cross(dir, vec3(0.0, 1.0, 0.0)));
        
        // Create ribbon geometry
        int segments = 32;
        for(int i = 0; i <= segments; i++) {
            float t = float(i) / float(segments);
            vec3 pos = mix(p0.xyz, p1.xyz, t);
            
            // Add wave motion
            float wave = sin(t * 10.0 + uTime * 2.0) * 0.1;
            pos.y += wave;
            
            // Create vertices
            vec3 v1 = pos - right * uThickness;
            vec3 v2 = pos + right * uThickness;
            
            vUv = vec2(t, 0.0);
            vPosition = v1;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(v1, 1.0);
            EmitVertex();
            
            vUv = vec2(t, 1.0);
            vPosition = v2;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(v2, 1.0);
            EmitVertex();
        }
        
        EndPrimitive();
    }
`;

export { dataFlowVertexShader, dataFlowFragmentShader, dataFlowGeometryShader };
