'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInObserverProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

export default function FadeInObserver({ children, delay = 0, className = '' }: FadeInObserverProps) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.5,
                delay,
                ease: [0.25, 0.1, 0.25, 1]
            }}
        >
            <>{children}</>
        </motion.div>
    );
}
