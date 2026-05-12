import { create } from 'zustand'
import { BookingFormData, PriceCalculation, Reservation } from '@/types'
import { calculatePrice, estimateDistanceAndDuration } from '@/lib/pricing'

interface ReservationState {
  formData: Partial<BookingFormData>
  priceCalc: PriceCalculation | null
  isCalculating: boolean
  reservations: Reservation[]
  selectedReservation: Reservation | null

  setFormData: (data: Partial<BookingFormData>) => void
  calculateEstimate: () => void
  setReservations: (reservations: Reservation[]) => void
  setSelectedReservation: (reservation: Reservation | null) => void
  resetForm: () => void
}

export const useReservationStore = create<ReservationState>((set, get) => ({
  formData: {},
  priceCalc: null,
  isCalculating: false,
  reservations: [],
  selectedReservation: null,

  setFormData: (data) => {
    set((state) => ({ formData: { ...state.formData, ...data } }))
  },

  calculateEstimate: () => {
    const { formData } = get()
    if (!formData.departure || !formData.arrival || !formData.date || !formData.time) return

    set({ isCalculating: true })
    const { distance, duration } = estimateDistanceAndDuration(formData.departure, formData.arrival)
    const calc = calculatePrice(distance, duration, formData.date, formData.time)
    set({ priceCalc: calc, isCalculating: false })
  },

  setReservations: (reservations) => set({ reservations }),
  setSelectedReservation: (reservation) => set({ selectedReservation: reservation }),
  resetForm: () => set({ formData: {}, priceCalc: null }),
}))
