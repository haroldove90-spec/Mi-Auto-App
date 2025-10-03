
import React from 'react';

interface IconProps {
    className?: string;
}

export const CarIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 16.5V18a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1.5" />
        <path d="M2 10h20" />
        <path d="M5 10V5c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v5" />
        <path d="M2 14h20" />
        <path d="M6.5 16.5h11" />
        <circle cx="8" cy="14" r="2" />
        <circle cx="16" cy="14" r="2" />
    </svg>
);
