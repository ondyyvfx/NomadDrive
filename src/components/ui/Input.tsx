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
                        className="text-[13px] font-medium text-[#6b6b6b]"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={cn(
                        'w-full h-11 px-3.5 bg-[#111111] border border-white/[0.10] rounded-[10px]',
                        'text-[15px] text-[#f0ece4] placeholder:text-[#3d3d3d]',
                        'outline-none transition-all duration-300',
                        'focus:border-[#c9a96e] focus:ring-3 focus:ring-[#c9a96e]/[0.12] focus:bg-[#161616]',
                        'disabled:opacity-40 disabled:cursor-not-allowed',
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
