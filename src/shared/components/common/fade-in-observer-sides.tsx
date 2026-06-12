'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInObserverProps {
    children: ReactNode;
    delay?: number;
    className?: string;
    animation?: 'left' | 'right';
}

export default function FadeInObserverSides({ children, delay = 0, className = '', animation = 'left' }: FadeInObserverProps) {
    switch (animation) {
        case 'left':
            return (
                <motion.div
                    className={className}
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 1,
                        delay,
                        ease: [0.25, 0.1, 0.25, 1]
                    }}
                    viewport={{ once: true }}
                >
                    <>{children}</>
                </motion.div>
            )
        case 'right':
            return (
                <motion.div
                    className={className}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 1,
                        delay,
                        ease: [0.25, 0.1, 0.25, 1]
                    }}
                    viewport={{ once: true }}
                >
                    <>{children}</>
                </motion.div>
            )
        default:
            return (
                <motion.div
                    className={className}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 1,
                        delay,
                        ease: [0.25, 0.1, 0.25, 1]
                    }}
                    viewport={{ once: true }}
                >
                    <>{children}</>
                </motion.div>
            )
    }
}
