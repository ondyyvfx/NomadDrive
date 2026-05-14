import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
        const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-[10px] transition-all duration-300 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]'

        const variants = {
            primary: 'bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87a]',
            secondary: 'bg-[#1a1a1a] text-[#f0ece4] border border-white/[0.10] hover:bg-[#222222] hover:border-white/[0.18]',
            ghost: 'text-[#6b6b6b] hover:bg-white/[0.04] hover:text-[#f0ece4]',
            danger: 'bg-[#c0392b] text-white hover:bg-[#a93226]',
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
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-60" />
                )}
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'
