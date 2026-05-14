import { cn } from '@/lib/utils'

interface CardProps {
    children: React.ReactNode
    className?: string
    hover?: boolean
    onClick?: () => void
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                'bg-[#111111] border border-white/[0.07] rounded-[14px] shadow-sm overflow-hidden',
                hover && 'transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-white/[0.12] cursor-pointer',
                onClick && 'cursor-pointer',
                className
            )}
        >
            {children}
        </div>
    )
}
