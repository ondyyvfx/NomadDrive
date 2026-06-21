import { cookies } from 'next/headers'
import { i18n, type Lang, type Dict } from './i18n'

/** Текущий язык на сервере — читается из cookie `lang` (ставит клиент). */
export async function getServerLang(): Promise<Lang> {
    const store = await cookies()
    return store.get('lang')?.value === 'kz' ? 'kz' : 'ru'
}

/** Словарь переводов для текущего языка (для серверных компонентов). */
export async function getServerDict(): Promise<Dict> {
    return i18n[await getServerLang()]
}
