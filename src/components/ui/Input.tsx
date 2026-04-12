import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, id, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={id}
                        className="text-[13px] font-medium text-[#6e6e73]"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={cn(
                        'w-full h-11 px-3.5 bg-surface border border-black/10 rounded-[10px]',
                        'text-[15px] text-[#1d1d1f] placeholder:text-[#aeaeb2]',
                        'outline-none transition-all duration-200',
                        'focus:border-accent focus:ring-3 focus:ring-accent/10 focus:bg-white',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        error && 'border-[#ff3b30] focus:ring-[#ff3b30]/10',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-[13px] text-[#ff3b30]">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'