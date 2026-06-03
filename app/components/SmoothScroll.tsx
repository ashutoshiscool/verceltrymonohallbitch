"use client";

import { ReactLenis } from "@studio-freight/react-lenis";

function SmoothScroll({ children }: { children: any }) {
    return (
        <ReactLenis root>
            {children}
        </ReactLenis>
    );
}

export default SmoothScroll;
