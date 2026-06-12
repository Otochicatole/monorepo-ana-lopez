'use client';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface CountUpAnimationProps {
    value: number;
    duration?: number;
    className?: string;
}

export default function CountUpAnimation({ value, duration = 2, className = '' }: CountUpAnimationProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        duration: duration * 1000,
        bounce: 0
    });
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [motionValue, isInView, value]);

    useEffect(() => {
        const unsubscribe = springValue.on('change', (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest).toString();
            }
        });

        return () => unsubscribe();
    }, [springValue]);

    return <motion.span ref={ref} className={className}>0</motion.span>;
}
