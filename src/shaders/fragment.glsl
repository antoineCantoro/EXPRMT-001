uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uProgress;
uniform float uTime;
varying vec2 vUv;

void main() {    
    vec4 texture1 = texture2D(uTexture1, vUv);
    vec4 texture2 = texture2D(uTexture2, vUv);

    vec4 test = mix(texture1, texture2, uProgress);

    gl_FragColor = vec4(test);
}