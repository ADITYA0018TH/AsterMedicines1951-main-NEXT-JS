import React from 'react';

interface SuccessNotificationProps {
    title: string;
    description: string;
    onClose: () => void;
}

const SuccessNotification: React.FC<SuccessNotificationProps> = ({ title, description, onClose }) => {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-4 right-4 z-[100] animate-in fade-in slide-in-from-right-8 duration-300">
            <div
                className="glass-panel relative w-full max-w-md flex flex-wrap items-center justify-start py-4 pl-6 pr-14 text-base font-medium transition-all duration-500 ease-in-out text-[#f97316] [&_svg]:text-[#f97316] group border-[#f97316]/20 bg-[#f97316]/5 hover:bg-[#f97316]/10"
            >
                <button
                    onClick={onClose}
                    type="button"
                    aria-label="close-success"
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md transition-opacity text-[#f97316] border border-[#f97316] opacity-40 hover:opacity-100"
                >
                    <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        height="16"
                        width="16"
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                    </svg>
                </button>
                <div className="flex flex-row items-center mr-auto gap-x-3">
                    <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        height="28"
                        width="28"
                        className="h-7 w-7"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="m4.5 12.75 6 6 9-13.5"></path>
                    </svg>
                    <div className="flex flex-col">
                        <span className="font-semibold leading-tight">{title}</span>
                        {description && <span className="text-sm opacity-90 font-normal">{description}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessNotification;
