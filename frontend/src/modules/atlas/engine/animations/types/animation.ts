export type AnimationType =
    | "rotate"
    | "float"
    | "pulse"
    | "orbit"
    | "scale";

export interface AnimationDescriptor {

    type: AnimationType;

    speed?: number;

    axis?: "x" | "y" | "z";

    intensity?: number;

    radius?: number;

    phase?: number;

}