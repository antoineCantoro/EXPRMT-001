uniform vec2  uFrequency;
uniform float uTime;
uniform float uProgress;
uniform vec2  uMouse;
uniform vec2  uOffset;

uniform float uDelta;
uniform float uPixel;

varying vec2  vUv;
varying float vElevation;

#define PI 3.1415926535897932384626433832795

vec3 deformation(vec3 position, vec2 uv, vec2 offset) {
    position.x = position.x + (sin(uv.y * PI) * uMouse.x * 0.2);
    position.y = position.y - (sin(uv.x * PI) * uMouse.y * 0.2);
    
    position.x = round( 
        sin(position.x) * uPixel
        ) / 
        uPixel;
    position.y = round( 
        sin(position.y) * uPixel
        ) / 
        uPixel;
    // position.y = round( sin(position.y) * 50.0 ) / 50.0;

    return position;
    
    // to do step 
}

void main() {
    vUv = uv;

    vec3 newPosition = deformation(position, uv, uOffset);

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

    modelPosition.x = round(sin(position.x) * uPixel) / uPixel;
    modelPosition.y = round(sin(position.y) * uPixel) / uPixel;

    modelPosition.x += uMouse.x * 0.5;
    modelPosition.y -= uMouse.y * 0.2;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}