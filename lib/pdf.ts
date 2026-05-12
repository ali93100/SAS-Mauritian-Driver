'use client'

import { Reservation, Client, Invoice } from '@/types'
import { formatPrice } from './pricing'

const DRIVER_INFO = {
  name: 'Ahmad Abdool Wahed',
  company: 'SAS MAURITIAN DRIVER',
  siret: '000 000 000 00000',
  vtc_card: 'VTC-2024-001234',
  phone: '+33 6 20 03 78 10',
  email: 'mauritiandriver@gmail.com',
  address: 'French Riviera — Côte d\'Azur',
}

export async function generateInvoicePDF(
  reservation: Reservation,
  client: Client,
  invoice: Invoice
): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()

  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  // Header background
  doc.setFillColor(10, 10, 10)
  doc.rect(0, 0, pageWidth, 50, 'F')

  // Company name
  doc.setTextColor(201, 168, 76)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('Ahmad Abdool Wahed', 15, y + 5)

  doc.setTextColor(200, 200, 200)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('SAS Mauritian Driver · French Riviera · VTC Premium', 15, y + 15)

  // Invoice label
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('FACTURE', pageWidth - 50, y + 5)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`N° ${invoice.invoice_number}`, pageWidth - 50, y + 13)
  doc.text(new Date(invoice.issued_at).toLocaleDateString('fr-FR'), pageWidth - 50, y + 21)

  y = 65

  // Driver & Client info
  doc.setTextColor(30, 30, 30)
  doc.setFillColor(245, 245, 245)
  doc.rect(10, y, 88, 55, 'F')
  doc.rect(112, y, 88, 55, 'F')

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(100, 100, 100)
  doc.text('PRESTATAIRE', 15, y + 8)

  doc.setTextColor(20, 20, 20)
  doc.setFont('helvetica', 'normal')
  doc.text(DRIVER_INFO.name, 15, y + 16)
  doc.text(DRIVER_INFO.company, 15, y + 23)
  doc.text(`SIRET: ${DRIVER_INFO.siret}`, 15, y + 30)
  doc.text(`Carte VTC: ${DRIVER_INFO.vtc_card}`, 15, y + 37)
  doc.text(`${DRIVER_INFO.phone} · ${DRIVER_INFO.email}`, 15, y + 44)

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(100, 100, 100)
  doc.text('CLIENT', 117, y + 8)

  doc.setTextColor(20, 20, 20)
  doc.setFont('helvetica', 'normal')
  doc.text(client.full_name, 117, y + 16)
  doc.text(client.email, 117, y + 23)
  if (client.phone) doc.text(client.phone, 117, y + 30)

  y = 130

  // Trip details table
  doc.setFillColor(10, 10, 10)
  doc.rect(10, y, pageWidth - 20, 10, 'F')
  doc.setTextColor(201, 168, 76)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('DÉTAILS DE LA COURSE', 15, y + 7)

  y += 15
  const rows = [
    ['Départ', reservation.departure],
    ['Arrivée', reservation.arrival],
    ['Date', new Date(reservation.date).toLocaleDateString('fr-FR')],
    ['Heure', reservation.time],
    ['Passagers', String(reservation.passengers)],
    ['Bagages', String(reservation.luggage)],
    ['Type', reservation.type === 'course_simple' ? 'Course simple' : 'Mise à disposition'],
    ['Distance estimée', `${reservation.estimated_distance_km} km`],
    ['Durée estimée', `${reservation.estimated_duration_min} min`],
  ]

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(40, 40, 40)

  rows.forEach(([label, value], i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 248, 248)
      doc.rect(10, y - 4, pageWidth - 20, 9, 'F')
    }
    doc.setFont('helvetica', 'bold')
    doc.text(label, 15, y + 2)
    doc.setFont('helvetica', 'normal')
    doc.text(value, 100, y + 2)
    y += 9
  })

  y += 5

  // Pricing breakdown
  doc.setFillColor(10, 10, 10)
  doc.rect(10, y, pageWidth - 20, 10, 'F')
  doc.setTextColor(201, 168, 76)
  doc.setFont('helvetica', 'bold')
  doc.text('DÉTAIL TARIFAIRE', 15, y + 7)

  y += 15
  const priceRows = [
    ['Prix de base', formatPrice(3)],
    [`Distance (${reservation.estimated_distance_km} km × 1,40 €)`, formatPrice(reservation.estimated_distance_km * 1.4)],
    [`Temps (${reservation.estimated_duration_min} min × 0,20 €)`, formatPrice(reservation.estimated_duration_min * 0.2)],
    ...(reservation.night_surcharge ? [['Supplément nuit +20%', formatPrice(reservation.base_price * 0.2)]] : []),
    ...(reservation.sunday_surcharge ? [['Supplément dimanche +20%', formatPrice(reservation.base_price * 0.2)]] : []),
  ]

  doc.setTextColor(40, 40, 40)
  priceRows.forEach(([label, value], i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 248, 248)
      doc.rect(10, y - 4, pageWidth - 20, 9, 'F')
    }
    doc.setFont('helvetica', 'normal')
    doc.text(label, 15, y + 2)
    doc.text(value, pageWidth - 30, y + 2, { align: 'right' })
    y += 9
  })

  // Total
  y += 3
  doc.setFillColor(201, 168, 76)
  doc.rect(10, y, pageWidth - 20, 12, 'F')
  doc.setTextColor(10, 10, 10)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('TOTAL TTC', 15, y + 8)
  doc.text(formatPrice(invoice.total_amount), pageWidth - 15, y + 8, { align: 'right' })

  // Footer
  y = doc.internal.pageSize.getHeight() - 20
  doc.setTextColor(150, 150, 150)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('SAS MAURITIAN DRIVER — Service VTC Premium — Merci de votre confiance', pageWidth / 2, y, { align: 'center' })

  doc.save(`facture-${invoice.invoice_number}.pdf`)
}

export async function generateOrderPDF(reservation: Reservation, client: Client): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  doc.setFillColor(10, 10, 10)
  doc.rect(0, 0, pageWidth, 45, 'F')

  doc.setTextColor(201, 168, 76)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('SAS MAURITIAN DRIVER', 15, y + 5)

  doc.setTextColor(200, 200, 200)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('BON DE COMMANDE', pageWidth - 15, y + 5, { align: 'right' })
  doc.text(new Date().toLocaleDateString('fr-FR'), pageWidth - 15, y + 13, { align: 'right' })

  y = 60

  doc.setFontSize(10)
  doc.setTextColor(20, 20, 20)
  doc.setFont('helvetica', 'bold')
  doc.text('CLIENT:', 15, y)
  doc.setFont('helvetica', 'normal')
  doc.text(`${client.full_name} — ${client.email}`, 50, y)

  y += 20

  const fields = [
    ['Départ', reservation.departure],
    ['Arrivée', reservation.arrival],
    ['Date', new Date(reservation.date).toLocaleDateString('fr-FR')],
    ['Heure', reservation.time],
    ['Passagers', String(reservation.passengers)],
    ['Bagages', String(reservation.luggage)],
    ['Type de service', reservation.type === 'course_simple' ? 'Course simple' : 'Mise à disposition'],
  ]

  fields.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold')
    doc.text(`${label}:`, 15, y)
    doc.setFont('helvetica', 'normal')
    doc.text(value, 70, y)
    y += 9
  })

  y += 10
  doc.setFillColor(201, 168, 76)
  doc.rect(10, y, pageWidth - 20, 12, 'F')
  doc.setTextColor(10, 10, 10)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('PRIX ESTIMÉ', 15, y + 8)
  doc.text(formatPrice(reservation.final_price), pageWidth - 15, y + 8, { align: 'right' })

  y = doc.internal.pageSize.getHeight() - 20
  doc.setTextColor(150, 150, 150)
  doc.setFontSize(8)
  doc.text('Document non contractuel — Sujet à confirmation du chauffeur', pageWidth / 2, y, { align: 'center' })

  doc.save(`bon-commande-${reservation.id.slice(0, 8)}.pdf`)
}
