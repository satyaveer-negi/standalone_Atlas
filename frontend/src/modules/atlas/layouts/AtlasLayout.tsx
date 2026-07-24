import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface AtlasLayoutProps {
    children: ReactNode;
    hud?: ReactNode;
    leftPanel?: ReactNode;
    rightPanel?: ReactNode;
    bottomPanel?: ReactNode;
}

export default function AtlasLayout({
    children,
    hud,
    leftPanel,
    rightPanel,
    bottomPanel,
}: AtlasLayoutProps) {
    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#020617]">

            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-blue-950" />

            {/* Animated grid */}
            <div
                className="
          absolute inset-0
          opacity-[0.08]
          bg-[linear-gradient(rgba(0,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,.15)_1px,transparent_1px)]
          bg-[size:40px_40px]
        "
            />

            {/* Main Scene */}
            <div className="absolute inset-0">
                {children}
            </div>

            {/* Top HUD */}
            <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute top-0 left-0 right-0 z-50"
            >
                {hud}
            </motion.div>

            {/* Left Panel */}
            <motion.div
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="absolute left-0 top-16 bottom-20 w-72 z-40"
            >
                {leftPanel}
            </motion.div>

            {/* Right Inspector */}
            <motion.div
                initial={{ x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="absolute right-0 top-16 bottom-20 w-96 z-40"
            >
                {rightPanel}
            </motion.div>

            {/* Bottom Console */}
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute bottom-0 left-0 right-0 z-50"
            >
                {bottomPanel}
            </motion.div>

        </div>
    );
}