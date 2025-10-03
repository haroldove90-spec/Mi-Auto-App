
import React from 'react';

interface IconProps {
    className?: string;
}

export const TransmissionIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0" />
        <path d="m12 14 1-5" />
        <path d="M12 2v2" />
        <path d="m16.2 3.8-.7.7" />
        <path d="M22 12h-2" />
        <path d="m17 17-.7-.7" />
        <path d="M12 22v-2" />
        <path d="m7.8 20.2.7-.7" />
        <path d="M2 12h2" />
        <path d="m7 7 .7.7" />
    </svg>
);
