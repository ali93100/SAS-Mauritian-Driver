export type UserRole = 'admin' | 'client'

export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  role: UserRole
  created_at: string
}

export interface DriverProfile {
  id: string
  full_name: string
  photo_url?: string
  phone: string
  email: string
  zone: string
  siret: string
  vtc_card_number: string
  vtc_card_expiry: string
  bio?: string
}

export interface Availability {
  id: string
  date: string
  start_time: string
  end_time: string
  is_available: boolean
  notes?: string
}

export type ReservationType = 'course_simple' | 'mise_a_disposition'
export type ReservationStatus = 'pending' | 'confirmed' | 'refused' | 'completed' | 'cancelled'

export interface Reservation {
  id: string
  client_id: string
  departure: string
  arrival: string
  date: string
  time: string
  passengers: number
  luggage: number
  type: ReservationType
  status: ReservationStatus
  estimated_distance_km: number
  estimated_duration_min: number
  base_price: number
  final_price: number
  night_surcharge: boolean
  sunday_surcharge: boolean
  notes?: string
  created_at: string
  updated_at: string
  client?: Client
}

export interface Client {
  id: string
  user_id: string
  full_name: string
  email: string
  phone?: string
  qr_code: string
  referral_code: string
  referred_by?: string
  total_rides: number
  total_spent: number
  discount_percent: number
  created_at: string
  loyalty?: Loyalty
}

export interface Loyalty {
  id: string
  client_id: string
  total_rides: number
  rides_since_last_discount: number
  current_discount: number
  bonus_rides: number
  created_at: string
  updated_at: string
}

export interface Referral {
  id: string
  referrer_id: string
  referred_id: string
  discount_applied: boolean
  bonus_applied: boolean
  created_at: string
}

export interface Invoice {
  id: string
  reservation_id: string
  client_id: string
  invoice_number: string
  amount: number
  tax_amount: number
  total_amount: number
  issued_at: string
  paid_at?: string
  pdf_url?: string
}

export interface PriceCalculation {
  base: number
  distance_fee: number
  time_fee: number
  subtotal: number
  night_surcharge: number
  sunday_surcharge: number
  total: number
  distance_km: number
  duration_min: number
  is_night: boolean
  is_sunday: boolean
}

export interface BookingFormData {
  departure: string
  arrival: string
  date: string
  time: string
  passengers: number
  luggage: number
  type: ReservationType
  notes?: string
}

export interface DashboardStats {
  today_revenue: number
  week_revenue: number
  month_revenue: number
  today_rides: number
  week_rides: number
  month_rides: number
  pending_reservations: number
  total_clients: number
}
