import { PriceCalculation } from '@/types'

const BASE_PRICE = 3.0
const PRICE_PER_KM = 1.4
const PRICE_PER_MIN = 0.2
const NIGHT_SURCHARGE_RATE = 0.2
const SUNDAY_SURCHARGE_RATE = 0.2

export function isNightTime(time: string): boolean {
  const [hours] = time.split(':').map(Number)
  return hours >= 22 || hours < 6
}

export function isSunday(dateStr: string): boolean {
  const date = new Date(dateStr)
  return date.getDay() === 0
}

export function calculatePrice(
  distanceKm: number,
  durationMin: number,
  dateStr: string,
  timeStr: string
): PriceCalculation {
  const base = BASE_PRICE
  const distance_fee = distanceKm * PRICE_PER_KM
  const time_fee = durationMin * PRICE_PER_MIN
  const subtotal = base + distance_fee + time_fee

  const is_night = isNightTime(timeStr)
  const is_sunday = isSunday(dateStr)

  const night_surcharge = is_night ? subtotal * NIGHT_SURCHARGE_RATE : 0
  const sunday_surcharge = is_sunday ? subtotal * SUNDAY_SURCHARGE_RATE : 0

  const total = subtotal + night_surcharge + sunday_surcharge

  return {
    base,
    distance_fee,
    time_fee,
    subtotal,
    night_surcharge,
    sunday_surcharge,
    total,
    distance_km: distanceKm,
    duration_min: durationMin,
    is_night,
    is_sunday,
  }
}

export function applyLoyaltyDiscount(price: number, discountPercent: number): number {
  return price * (1 - discountPercent / 100)
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function estimateDistanceAndDuration(
  _departure: string,
  _arrival: string
): { distance: number; duration: number } {
  // Simulation — in production, use Google Maps / OpenRoute API
  const distance = Math.round(Math.random() * 25 + 5)
  const duration = Math.round(distance * 2.5 + Math.random() * 10)
  return { distance, duration }
}
