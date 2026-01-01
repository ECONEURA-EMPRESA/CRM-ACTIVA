import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    noPadding?: boolean;
    hoverable?: boolean;
}

export const Card = ({ children, className = "", noPadding = false, hoverable = false }: CardProps) => (
    <div className={`card-clinical ${hoverable ? 'card-hoverable' : ''} ${className}`}>
        <div className={noPadding ? "" : "p-8"}>{children}</div>
    </div>
);
