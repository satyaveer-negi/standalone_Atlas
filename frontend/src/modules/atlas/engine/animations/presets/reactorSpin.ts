import type { AnimationDescriptor } from "../types/animation";

const reactorSpin: AnimationDescriptor[] = [

    {
        type: "rotate",
        axis: "y",
        speed: 0.35,
    },

    {
        type: "pulse",
        speed: 2,
    }

];

export default reactorSpin;