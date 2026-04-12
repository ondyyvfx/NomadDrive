export type UserRole = 'client' | 'admin'

export interface Profile {
    id: string
    full_name: string | null
    phone: string | null
    avatar_url: string | null
    role: UserRole
    created_at: string
    updated_at: string
}

export type Transmission = 'auto' | 'manual'
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid'

export interface CarForRent {
    id: string
    brand: string
    model: string
    year: number
    color: string | null
    transmission: Transmission | null
    fuel_type: FuelType | null
    seats: number
    price_per_day: number
    status: 'available' | 'rented' | 'maintenance'
    image_urls: string[]
    description: string | null
    location: string | null
    lat: number | null
    lng: number | null
    features: string[]
    created_at: string
}

export interface CarForSale {
    id: string
    brand: string
    model: string
    year: number
    color: string | null
    transmission: Transmission | null
    fuel_type: FuelType | null
    mileage: number
    engine_volume: number | null
    price: number
    status: 'available' | 'sold' | 'reserved'
    image_urls: string[]
    description: string | null
    location: string | null
    lat: number | null
    lng: number | null
    vin: string | null
    created_at: string
}

export interface Part {
    id: string
    name: string
    brand: string
    car_brand: string | null
    car_model: string | null
    year_from: number | null
    year_to: number | null
    category: string | null
    oem_number: string | null
    price: number
    stock: number
    image_urls: string[]
    description: string | null
    created_at: string
}

export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'

export interface Booking {
    id: string
    user_id: string
    car_id: string
    start_date: string
    end_date: string
    total_price: number
    status: BookingStatus
    payment_status: PaymentStatus
    qr_code: string | null
    promo_code_id: string | null
    notes: string | null
    created_at: string
    // joined
    car?: CarForRent
    profile?: Profile
}

export type OrderType = 'car_sale' | 'parts'
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
    id: string
    user_id: string
    total: number
    status: OrderStatus
    type: OrderType
    payment_status: PaymentStatus
    promo_code_id: string | null
    notes: string | null
    created_at: string
    // joined
    items?: OrderItem[]
    profile?: Profile
}

export type ProductType = 'car' | 'part'

export interface OrderItem {
    id: string
    order_id: string
    product_type: ProductType
    product_id: string
    quantity: number
    price: number
    created_at: string
}

export interface Review {
    id: string
    user_id: string
    product_type: 'car_rent' | 'car_sale' | 'part'
    product_id: string
    rating: number
    comment: string | null
    created_at: string
    profile?: Profile
}

export interface PromoCode {
    id: string
    code: string
    type: 'percent' | 'fixed'
    value: number
    max_uses: number | null
    used_count: number
    expires_at: string | null
    is_active: boolean
    created_at: string
}

// Cart (локальный стейт, не в БД)
export interface CartItem {
    id: string
    product_type: ProductType
    product_id: string
    name: string
    price: number
    quantity: number
    image_url: string | null
}