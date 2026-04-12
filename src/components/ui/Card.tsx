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
                'bg-white border border-black/[0.06] rounded-[14px] shadow-sm overflow-hidden',
                hover && 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
                onClick && 'cursor-pointer',
                className
            )}
        >
            {children}
        </div>
    )
}