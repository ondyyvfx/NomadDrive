'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'ru' | 'kz'

interface LangCtx {
    lang: Lang
    setLang: (l: Lang) => void
}

const LanguageContext = createContext<LangCtx>({ lang: 'ru', setLang: () => {} })

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Lang>('ru')
    return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
