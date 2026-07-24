uniform float uTime;
uniform vec3 uColor;

varying vec2 vUv;
varying vec3 vNormal;

void main(){

    float scan =
        sin(vUv.y * 80.0 - uTime * 6.0);

    scan = scan * 0.5 + 0.5;

    float fresnel =
        pow(
            1.0 - abs(vNormal.z),
            3.0
        );

    vec3 color =
        uColor;

    color += scan * 0.35;

    color += fresnel * 0.8;

    gl_FragColor =
        vec4(

            color,

            0.55 + fresnel * .35

        );

}