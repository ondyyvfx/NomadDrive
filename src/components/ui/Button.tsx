import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
        const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-[10px] transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'

        const variants = {
            primary: 'bg-accent text-white hover:bg-accent-hover',
            secondary: 'bg-surface text-[#1d1d1f] border border-black/10 hover:bg-black/5',
            ghost: 'text-[#6e6e73] hover:bg-surface hover:text-[#1d1d1f]',
            danger: 'bg-[#ff3b30] text-white hover:bg-[#e0352b]',
        }

        const sizes = {
            sm: 'h-9 px-4 text-sm',
            md: 'h-11 px-5 text-[15px]',
            lg: 'h-12 px-6 text-base',
        }

        return (
            <button
                ref={ref}
                className={cn(base, variants[variant], sizes[size], className)}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                )}
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'