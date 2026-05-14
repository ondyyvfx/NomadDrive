import { cn } from '@/lib/utils'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'default' | 'accent'

interface BadgeProps {
    variant?: BadgeVariant
    children: React.ReactNode
    className?: string
}

const variants: Record<BadgeVariant, string> = {
    success: 'bg-[#34c759]/10 text-[#34c759]',
    warning: 'bg-[#ff9f0a]/10 text-[#ff9f0a]',
    danger: 'bg-[#ff3b30]/10 text-[#ff3b30]',
    accent: 'bg-[#c9a96e]/10 text-[#c9a96e]',
    default: 'bg-[#1a1a1a] text-[#6b6b6b] border border-white/[0.08]',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
    return (
        <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            variants[variant],
            className
        )}>
            {children}
        </span>
    )
}
