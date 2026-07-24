export interface VisualDescriptor {

    material: keyof typeof MaterialRegistry;

    color: string;

    scale: number;

    glow: boolean;

    pulse: boolean;

    particle?: string;

    effect?: string;

    billboard?: boolean;

    selectable?: boolean;

}