'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

export function QRCodeWidget({ data, bookingId }: { data: string; bookingId: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, data, {
                width: 200,
                margin: 2,
                color: { dark: '#0a5f4a', light: '#ffffff' },
            })
        }
    }, [data])

    function downloadQR() {
        const canvas = canvasRef.current
        if (!canvas) return
        const url = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = `booking-${bookingId.slice(0, 8)}.png`
        link.href = url
        link.click()
    }

    const isUrl = /^https?:\/\//.test(data)

    return (
        <div className="flex flex-col items-center gap-4">
            <a
                href={isUrl ? data : undefined}
                target={isUrl ? '_blank' : undefined}
                rel={isUrl ? 'noopener noreferrer' : undefined}
                className="p-3 bg-[#f5f5f7] rounded-[12px] block"
                aria-label="Открыть страницу проверки брони"
            >
                <canvas ref={canvasRef} className="rounded-[8px]" />
            </a>
            <button
                onClick={downloadQR}
                className="w-full h-10 bg-accent/[0.08] text-accent text-[13px] font-medium rounded-[10px] hover:bg-accent hover:text-white transition-all duration-200"
            >
                Скачать QR-код
            </button>
            {isUrl && (
                <a
                    href={data}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#3d3d3d] hover:text-accent break-all text-center transition-colors"
                >
                    {data.replace(/^https?:\/\//, '')}
                </a>
            )}
        </div>
    )
}