import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

import { useAtlasStore } from "../../store/atlasStore";

export default function InteractionManager() {
    const gl = useThree((state) => state.gl);

    const setHoveredNode = useAtlasStore(
        (state) => state.setHoveredNode
    );

    const setSelectedNode = useAtlasStore(
        (state) => state.setSelectedNode
    );

    const setFocusedNode = useAtlasStore(
        (state) => state.setFocusedNode
    );

    useEffect(() => {
        const canvas = gl.domElement;

        function handleMouseLeave() {
            setHoveredNode(null);
        }

        function handlePointerDown(e: PointerEvent) {
            if (e.button === 2) {
                // Right click
                e.preventDefault();
            }
        }

        function handleDoubleClick() {
            // CameraManager will use focusedNode later
            const selected =
                useAtlasStore.getState().selectedNodeId;

            if (selected) {
                setFocusedNode(selected);
            }
        }

        function handleKeyDown(e: KeyboardEvent) {
            switch (e.key) {
                case "Escape":
                    setHoveredNode(null);
                    setSelectedNode(null);
                    setFocusedNode(null);
                    break;

                case " ":
                    e.preventDefault();
                    console.log("Atlas Command Mode");
                    break;
            }
        }

        canvas.addEventListener(
            "mouseleave",
            handleMouseLeave
        );

        canvas.addEventListener(
            "pointerdown",
            handlePointerDown
        );

        canvas.addEventListener(
            "dblclick",
            handleDoubleClick
        );

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            canvas.removeEventListener(
                "mouseleave",
                handleMouseLeave
            );

            canvas.removeEventListener(
                "pointerdown",
                handlePointerDown
            );

            canvas.removeEventListener(
                "dblclick",
                handleDoubleClick
            );

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [
        gl,
        setHoveredNode,
        setSelectedNode,
        setFocusedNode,
    ]);

    return null;
}