'use client';
import { useState, useEffect } from 'react';

export default function useWindowSize() {
    const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        onResize();
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return width;
}