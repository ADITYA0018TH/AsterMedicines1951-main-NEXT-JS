import React from 'react';

interface NeonCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    id?: string;
    className?: string;
}

const NeonCheckbox: React.FC<NeonCheckboxProps> = ({ checked, onChange, id, className }) => {
    return (
        <label
            className={`relative w-6 h-6 cursor-pointer inline-block tap-transparent group ${className || ''}`}
            htmlFor={id}
        >
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="peer sr-only"
            />

            {/* Frame */}
            <div className="relative w-full h-full">
                {/* Box */}
                <div className={`absolute inset-0 bg-black/80 rounded border-2 transition-all duration-400 ease-out group-hover:scale-105
          ${checked
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-orange-700 group-hover:border-orange-500'
                    }`}>

                    {/* Check Container */}
                    <div className="absolute inset-0.5 flex items-center justify-center">
                        <svg
                            viewBox="0 0 24 24"
                            className={`w-[80%] h-[80%] fill-none stroke-orange-500 stroke-[3] stroke-linecap-round stroke-linejoin-round [stroke-dasharray:40] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center
                ${checked ? '[stroke-dashoffset:0] scale-110' : '[stroke-dashoffset:40]'}`}
                        >
                            <path d="M3,12.5l7,7L21,5"></path>
                        </svg>
                    </div>

                    {/* Glow */}
                    <div className={`absolute inset-[-2px] rounded-md bg-orange-500 blur-md scale-120 transition-all duration-400 ease-out
            ${checked ? 'opacity-20' : 'opacity-0'}`}></div>

                    {/* Borders */}
                    <div className="absolute inset-0 rounded overflow-hidden">
                        <span className={`absolute w-10 h-px bg-orange-500 transition-opacity duration-400 ease-out top-0 -left-full animate-border-flow-1 ${checked ? 'opacity-100' : 'opacity-0'}`}></span>
                        <span className={`absolute w-px h-10 bg-orange-500 transition-opacity duration-400 ease-out -top-full right-0 animate-border-flow-2 ${checked ? 'opacity-100' : 'opacity-0'}`}></span>
                        <span className={`absolute w-10 h-px bg-orange-500 transition-opacity duration-400 ease-out bottom-0 -right-full animate-border-flow-3 ${checked ? 'opacity-100' : 'opacity-0'}`}></span>
                        <span className={`absolute w-px h-10 bg-orange-500 transition-opacity duration-400 ease-out -bottom-full left-0 animate-border-flow-4 ${checked ? 'opacity-100' : 'opacity-0'}`}></span>
                    </div>
                </div>

                {/* Effects */}
                <div className="absolute inset-x-[-20px] inset-y-[-20px] pointer-events-none">
                    {/* Particles */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[
                            { x: '25px', y: '-25px' }, { x: '-25px', y: '-25px' },
                            { x: '25px', y: '25px' }, { x: '-25px', y: '25px' },
                            { x: '35px', y: '0px' }, { x: '-35px', y: '0px' },
                            { x: '0px', y: '35px' }, { x: '0px', y: '-35px' },
                            { x: '20px', y: '-30px' }, { x: '-20px', y: '30px' },
                            { x: '30px', y: '20px' }, { x: '-30px', y: '-20px' }
                        ].map((pos, i) => (
                            <span
                                key={i}
                                style={{ '--x': pos.x, '--y': pos.y } as React.CSSProperties}
                                className={`absolute w-1 h-1 bg-orange-500 rounded-full top-1/2 left-1/2 shadow-[0_0_6px_#f97316] ${checked ? 'animate-particle-explosion opacity-0' : 'opacity-0'}`}
                            ></span>
                        ))}
                    </div>

                    {/* Rings */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[0, 0.1, 0.2].map((delay, i) => (
                            <div
                                key={i}
                                style={{ animationDelay: `${delay}s` }}
                                className={`absolute inset-0 rounded-full border border-orange-500 scale-0 ${checked ? 'animate-ring-pulse opacity-0' : 'opacity-0'}`}
                            ></div>
                        ))}
                    </div>

                    {/* Sparks */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[0, 90, 180, 270].map((deg, i) => (
                            <span
                                key={i}
                                style={{ '--r': `${deg}deg` } as React.CSSProperties}
                                className={`absolute w-5 h-px bg-gradient-to-r from-orange-500 to-transparent top-1/2 left-1/2 ${checked ? 'animate-spark-flash opacity-0' : 'opacity-0'}`}
                            ></span>
                        ))}
                    </div>
                </div>
            </div>
        </label>
    );
};

export default NeonCheckbox;
