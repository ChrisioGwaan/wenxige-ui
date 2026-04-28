import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseHost = (() => {
  try {
    return supabaseUrl ? new URL(supabaseUrl).origin : 'https://*.supabase.co'
  } catch {
    return 'https://*.supabase.co'
  }
})()
const supabaseWs = `wss://${supabaseHost.replace(/^https?:\/\//, '')}`

const csp = [
  `default-src 'self'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `object-src 'none'`,
  `img-src 'self' data: blob: ${supabaseHost} https://challenges.cloudflare.com`,
  `font-src 'self' data:`,
  `style-src 'self' 'unsafe-inline'`,
  `script-src 'self' 'unsafe-inline'${isProd ? '' : " 'unsafe-eval'"} https://challenges.cloudflare.com https://va.vercel-scripts.com`,
  `frame-src https://challenges.cloudflare.com`,
  `connect-src 'self' ${supabaseHost} ${supabaseWs} https://challenges.cloudflare.com https://vitals.vercel-insights.com https://va.vercel-scripts.com`,
  `worker-src 'self' blob:`,
  `manifest-src 'self'`,
  `upgrade-insecure-requests`,
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  ...(isProd
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
    : []),
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
