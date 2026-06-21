// Базовый URL сайта. На проде берётся из NEXT_PUBLIC_SITE_URL,
// иначе — задеплоенный адрес (важно для QR: телефон не откроет localhost).
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nomad-drive-gzi8.vercel.app'
).replace(/\/+$/, '')

/** Ссылка-проверка брони, которую кодирует QR-код. */
export function bookingVerifyUrl(id: string): string {
    return `${SITE_URL}/booking/${id}`
}
