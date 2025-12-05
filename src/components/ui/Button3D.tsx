"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface Button3DProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    variant?: "primary" | "secondary" | "dark";
    size?: "sm" | "md";
    className?: string;
}

const Button3D = ({
    children,
    href,
    onClick,
    type = "button",
    disabled = false,
    variant = "primary",
    size = "md",
    className = ""
}: Button3DProps) => {
    const sizeStyles = {
        sm: "px-5 py-2 text-sm",
        md: "px-8 py-3 text-base"
    };
    const variantStyles = {
        primary: {
            top: "bg-orange-500 text-white",
            bottom: "bg-orange-700",
            shadow: "bg-orange-900"
        },
        secondary: {
            top: "bg-slate-100 text-slate-900",
            bottom: "bg-slate-200",
            shadow: "bg-slate-400"
        },
        dark: {
            top: "bg-slate-900 text-white",
            bottom: "bg-slate-700",
            shadow: "bg-slate-500"
        }
    };

    const styles = variantStyles[variant];

    const buttonContent = (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`relative bg-transparent border-none p-0 m-0 outline-none group cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        >
            {/* Top layer - the visible button */}
            <span className={`
                relative z-10 ${sizeStyles[size]} flex items-center justify-center gap-2
                rounded-full font-medium
                ${styles.top}
                border-2 border-slate-900
                transition-transform duration-200 ease-out
                group-hover:translate-y-[6px]
                overflow-hidden
            `}>
                {/* Shine effect */}
                <span className="absolute w-4 h-full bg-white/20 skew-x-[30deg] -left-6 transition-all duration-300 group-hover:left-[calc(100%+24px)]" />
                {children}
            </span>

            {/* Bottom layer - the 3D depth */}
            <span className={`
                absolute top-[6px] left-0 w-full h-full
                rounded-full
                ${styles.bottom}
                border-2 border-slate-900
                -z-10
            `}>
                {/* Side connectors */}
                <span className="absolute w-0.5 h-[6px] bg-slate-900 bottom-0 left-[15%]" />
                <span className="absolute w-0.5 h-[6px] bg-slate-900 bottom-0 left-[85%]" />
            </span>

            {/* Shadow layer */}
            <span className={`
                absolute top-[10px] -left-px w-[calc(100%+2px)] h-full
                rounded-full
                ${styles.shadow}
                border-2 border-slate-900
                -z-20
            `} />
        </button>
    );

    if (href) {
        return <Link href={href}>{buttonContent}</Link>;
    }

    return buttonContent;
};

export default Button3D;
