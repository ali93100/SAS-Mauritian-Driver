'use client'

export async function generateQRCode(text: string): Promise<string> {
  const QRCode = (await import('qrcode')).default
  return QRCode.toDataURL(text, {
    width: 256,
    margin: 2,
    color: {
      dark: '#0A0A0A',
      light: '#FFFFFF',
    },
  })
}

export function generateReferralCode(userId: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const prefix = userId.slice(0, 4).toUpperCase().replace(/-/g, 'X')
  let suffix = ''
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)]
  }
  return `MD-${prefix}${suffix}`
}
