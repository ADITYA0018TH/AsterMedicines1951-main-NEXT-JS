"use client"
import { useEffect, useRef } from "react"
interface LiquidEffectAnimationProps {
    className?: string
    style?: React.CSSProperties
}

export function LiquidEffectAnimation({ className, style }: LiquidEffectAnimationProps = {}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const appRef = useRef<any>(null)
    useEffect(() => {
        if (!canvasRef.current) return
        // Load the script dynamically
        const script = document.createElement("script")
        script.type = "module"
        script.textContent = `
import LiquidBackground from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.22/build/backgrounds/liquid1.min.js';
const canvas = document.getElementById('liquid-canvas');
if (canvas) {
const app = LiquidBackground(canvas);
app.loadImage('https://i.pinimg.com/1200x/38/71/c9/3871c9c7a6066df6763c97dc3285c907.jpg');
app.liquidPlane.material.metalness = 0.75;
app.liquidPlane.material.roughness = 0.25;
app.liquidPlane.uniforms.displacementScale.value = 5;
app.setRain(false);
window.__liquidApp = app;
}
`
        document.body.appendChild(script)
        return () => {
            if (window.__liquidApp && window.__liquidApp.dispose) {
                window.__liquidApp.dispose()
            }
            document.body.removeChild(script)
        }
    }, [])
    return (
        <div
            className={`fixed inset-0 m-0 w-full h-full touch-none overflow-hidden ${className || ""}`}
            style={{ fontFamily: '"Montserrat", serif', ...style }}
        >
            <canvas ref={canvasRef} id="liquid-canvas" className="fixed inset-0 w-full h-full" />
        </div>
    )
}
declare global {
    interface Window {
        __liquidApp?: any
    }
}
