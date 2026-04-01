'use client'
import { ReactNode } from 'react'

interface ScrollNextSectionProps {
    children: ReactNode
    targetId: string
    className?: string
}

export default function ScrollNextSection({ children, targetId, className }: ScrollNextSectionProps) {
    const handleScroll = () => {
        document.getElementById(targetId)?.scrollIntoView({
            behavior: 'smooth'
        })
    }

    return (
        <div onClick={handleScroll} className={className}>
            {children}
        </div>
    )
}