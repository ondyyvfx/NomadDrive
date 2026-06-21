'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { i18n, type Dict } from '@/lib/i18n'

export type Lang = 'ru' | 'kz'

interface LangCtx {
    lang: Lang
    setLang: (l: Lang) => void
    toggle: () => void
}

const LanguageContext = createContext<LangCtx>({ lang: 'ru', setLang: () => {}, toggle: () => {} })

export function LanguageProvider({ children, initial = 'ru' }: { children: ReactNode; initial?: Lang }) {
    const [lang, setLangState] = useState<Lang>(initial)
    const router = useRouter()

    const setLang = useCallback((l: Lang) => {
        setLangState(l)
        if (typeof document !== 'undefined') {
            // cookie — источник правды и для серверных компонентов
            document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`
            document.documentElement.lang = l === 'kz' ? 'kk' : 'ru'
            try { localStorage.setItem('lang', l) } catch { /* приватный режим */ }
        }
        // обновляем серверные компоненты (их текст читается из cookie)
        router.refresh()
    }, [router])

    const toggle = useCallback(() => setLang(lang === 'ru' ? 'kz' : 'ru'), [lang, setLang])

    return (
        <LanguageContext.Provider value={{ lang, setLang, toggle }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => useContext(LanguageContext)

/** Словарь переводов для текущего языка (клиентские компоненты). */
export function useDict(): Dict {
    const { lang } = useLanguage()
    return i18n[lang]
}
