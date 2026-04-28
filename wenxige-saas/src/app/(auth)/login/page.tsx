'use client'

import Image from 'next/image'
import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { App, Button, Form, Input, Typography, ConfigProvider, theme } from 'antd'
import { LockOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

import { useLanguage } from '@/lib/i18n'

const { Text } = Typography

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

type TurnstileApi = {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string
      callback: (token: string) => void
      'error-callback'?: () => void
      'expired-callback'?: () => void
      theme?: 'light' | 'dark' | 'auto'
      size?: 'normal' | 'flexible' | 'compact'
    },
  ) => string
  reset: (widgetId?: string) => void
  remove: (widgetId: string) => void
}
declare global {
  interface Window {
    turnstile?: TurnstileApi
    __turnstileReady?: boolean
    __onTurnstileLoad?: () => void
  }
}

function TurnstileWidget({
  onToken,
  onError,
}: {
  onToken: (token: string) => void
  onError: () => void
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const onTokenRef = useRef(onToken)
  const onErrorRef = useRef(onError)

  // Keep latest callbacks without re-running the render effect
  useEffect(() => {
    onTokenRef.current = onToken
    onErrorRef.current = onError
  }, [onToken, onError])

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return
    let cancelled = false

    const tryRender = () => {
      if (cancelled) return
      const ts = window.turnstile
      if (!ts || !containerRef.current || widgetIdRef.current) return
      widgetIdRef.current = ts.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'dark',
        size: 'flexible',
        callback: (token) => onTokenRef.current(token),
        'error-callback': () => onErrorRef.current(),
        'expired-callback': () => onErrorRef.current(),
      })
    }

    if (window.turnstile) {
      tryRender()
    } else {
      const prev = window.__onTurnstileLoad
      window.__onTurnstileLoad = () => {
        prev?.()
        tryRender()
      }
    }

    return () => {
      cancelled = true
      const ts = window.turnstile
      const id = widgetIdRef.current
      if (ts && id) {
        try {
          ts.remove(id)
        } catch {
          /* noop */
        }
      }
      widgetIdRef.current = null
    }
  }, [])

  if (!TURNSTILE_SITE_KEY) return null
  return (
    <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
      <div ref={containerRef} />
    </div>
  )
}

const SAGE = '#9AB17A'
const OLIVE = '#C3CC9B'
const CREAM = '#E4DFB5'
const DEEP = '#0c1a09'
const MID = '#152211'

// Deterministic particle configs — no Math.random() to avoid hydration mismatch
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${((i * 4.33 + 3) % 92) + 2}%`,
  bottom: `-${6 + ((i * 2.7) % 20)}px`,
  size: 3 + Math.round((i * 1.4) % 7),
  delay: `${(i * 0.38) % 9}s`,
  duration: `${9 + ((i * 0.6) % 9)}s`,
  // organic leaf shapes
  radius: i % 3 === 0 ? '50% 0 50% 0' : i % 3 === 1 ? '50%' : '30% 70% 70% 30% / 30% 30% 70% 70%',
  color: i % 2 === 0 ? SAGE : OLIVE,
  opacity: 0.25 + (i % 4) * 0.12,
}))

function LoginForm() {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials')
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null)
  const [mfaChallengeId, setMfaChallengeId] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const router = useRouter()
  const { message } = App.useApp()

  const resetCaptcha = () => {
    setCaptchaToken(null)
    if (typeof window !== 'undefined') {
      try {
        window.turnstile?.reset()
      } catch {
        /* noop */
      }
    }
  }

  const proceedAfterAuth = async () => {
    const supabase = createClient()
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (aal && aal.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
      const { data: factors, error: factorErr } = await supabase.auth.mfa.listFactors()
      if (factorErr) throw factorErr
      const totp = factors?.totp?.find((f) => f.status === 'verified')
      if (!totp) {
        message.error(t.login.mfaNoFactor)
        await supabase.auth.signOut()
        return
      }
      const { data: challenge, error: challengeErr } = await supabase.auth.mfa.challenge({
        factorId: totp.id,
      })
      if (challengeErr) throw challengeErr
      setMfaFactorId(totp.id)
      setMfaChallengeId(challenge.id)
      setStep('mfa')
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  const onFinishCredentials = async (values: { email: string; password: string }) => {
    if (TURNSTILE_SITE_KEY && !captchaToken) {
      message.error(t.login.captchaRequired)
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
        options: captchaToken ? { captchaToken } : undefined,
      })
      if (error) throw error
      await proceedAfterAuth()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.login.loginError
      message.error(msg)
      resetCaptcha()
    } finally {
      setLoading(false)
    }
  }

  const onFinishMfa = async (values: { code: string }) => {
    if (!mfaFactorId || !mfaChallengeId) return
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.mfa.verify({
        factorId: mfaFactorId,
        challengeId: mfaChallengeId,
        code: values.code.trim(),
      })
      if (error) throw error
      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.login.mfaVerifyError
      message.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const onBackToCredentials = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setStep('credentials')
    setMfaFactorId(null)
    setMfaChallengeId(null)
    resetCaptcha()
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(145deg, ${DEEP} 0%, ${MID} 50%, #0e1e0b 100%)`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── Ghost watermark ── */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(60px, 18vw, 220px)',
          fontWeight: 900,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(154,177,122,0.055)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          animation: 'watermark-drift 14s ease-in-out infinite',
        }}
      >
        LUMI TEA
      </div>

      {/* ── Central orb glow ── */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 680,
          height: 680,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(154,177,122,0.11) 0%, rgba(154,177,122,0.05) 45%, transparent 72%)`,
          transform: 'translate(-50%, -50%)',
          animation: 'orb-pulse 7s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* ── Decorative ring — inner ── */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 520,
          height: 520,
          borderRadius: '50%',
          border: '1px solid transparent',
          borderTopColor: 'rgba(154,177,122,0.25)',
          borderRightColor: 'rgba(195,204,155,0.1)',
          borderBottomColor: 'rgba(154,177,122,0.06)',
          borderLeftColor: 'rgba(195,204,155,0.08)',
          transform: 'translate(-50%, -50%)',
          animation: 'ring-rotate 24s linear infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Tick dots on inner ring */}
      {[0, 90, 180, 270].map((deg) => (
        <div
          key={deg}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'rgba(154,177,122,0.4)',
            transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-260px)`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* ── Decorative ring — outer ── */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 800,
          height: 800,
          borderRadius: '50%',
          border: '1px solid transparent',
          borderTopColor: 'rgba(195,204,155,0.08)',
          borderLeftColor: 'rgba(154,177,122,0.05)',
          borderBottomColor: 'rgba(228,223,181,0.04)',
          transform: 'translate(-50%, -50%)',
          animation: 'ring-rotate-rev 38s linear infinite',
          pointerEvents: 'none',
        }}
      />

      {/* ── Floating particles ── */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            borderRadius: p.radius,
            background: p.color,
            opacity: p.opacity,
            animation: `particle-ascend ${p.duration} ${p.delay} ease-in-out infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* ── Corner bracket — top left ── */}
      <div style={{ position: 'absolute', top: 36, left: 36, pointerEvents: 'none' }}>
        <div style={{ width: 48, height: 1, background: 'rgba(154,177,122,0.35)' }} />
        <div
          style={{ width: 1, height: 48, background: 'rgba(154,177,122,0.35)', marginTop: -1 }}
        />
      </div>

      {/* ── Corner bracket — bottom right ── */}
      <div style={{ position: 'absolute', bottom: 36, right: 36, pointerEvents: 'none' }}>
        <div
          style={{ width: 1, height: 48, background: 'rgba(154,177,122,0.35)', marginLeft: 'auto' }}
        />
        <div
          style={{ width: 48, height: 1, background: 'rgba(154,177,122,0.35)', marginTop: -1 }}
        />
      </div>

      {/* ── Bottom-left label ── */}
      <div
        style={{
          position: 'absolute',
          left: 44,
          bottom: 44,
          pointerEvents: 'none',
        }}
      >
        <Text
          style={{
            color: 'rgba(154,177,122,0.22)',
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          SAAS Management
        </Text>
      </div>

      {/* ── Bottom-right label ── */}
      <div
        style={{
          position: 'absolute',
          right: 44,
          bottom: 44,
          pointerEvents: 'none',
        }}
      >
        <Text
          style={{
            color: 'rgba(154,177,122,0.22)',
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          v2026
        </Text>
      </div>

      {/* ══════════════ FORM CARD ══════════════ */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 368,
          margin: '0 20px',
          background: 'rgba(10, 22, 8, 0.76)',
          backdropFilter: 'blur(48px)',
          WebkitBackdropFilter: 'blur(48px)',
          borderRadius: 28,
          border: '1px solid rgba(154,177,122,0.16)',
          boxShadow: [
            '0 0 0 1px rgba(154,177,122,0.05)',
            '0 40px 100px rgba(0,0,0,0.65)',
            '0 0 80px rgba(154,177,122,0.06) inset',
          ].join(', '),
          padding: '52px 40px 44px',
          animation: 'card-enter 0.75s cubic-bezier(0.22,1,0.36,1) both',
        }}
      >
        {/* ── Brand block ── */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          {/* Steam */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              gap: 7,
              height: 30,
              marginBottom: 0,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 2,
                  height: i === 1 ? 18 : 13,
                  borderRadius: 2,
                  background: `linear-gradient(to top, rgba(228,223,181,0.55), transparent)`,
                  animation: `steam-up 2.4s ${i * 0.5}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>

          {/* Tea cup */}
          <div style={{ fontSize: 54, lineHeight: 1, marginBottom: 22 }}>🍵</div>

          {/* Rule + label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div
              style={{ flex: 1, height: 1, background: 'rgba(154,177,122,0.2)', maxWidth: 40 }}
            />
            <Text
              style={{
                color: SAGE,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              {t.login.adminPortal}
            </Text>
            <div
              style={{ flex: 1, height: 1, background: 'rgba(154,177,122,0.2)', maxWidth: 40 }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <Image
              src="/Lumi_Tea_Logo-removebg.png"
              alt="Lumi Tea"
              width={72}
              height={72}
              style={{
                borderRadius: 16,
                objectFit: 'cover',
                boxShadow: '0 8px 24px rgba(154,177,122,0.3)',
              }}
            />
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: CREAM,
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
              marginBottom: 8,
            }}
          >
            Lumi Tea
          </div>
          <Text style={{ color: 'rgba(228,223,181,0.4)', fontSize: 13 }}>
            {step === 'mfa' ? t.login.mfaSubtitle : t.login.signInTo}
          </Text>
        </div>

        {/* ── Form ── */}
        {step === 'credentials' ? (
          <Form layout="vertical" onFinish={onFinishCredentials} requiredMark={false} size="large">
            <Form.Item
              name="email"
              label={
                <span
                  style={{
                    color: 'rgba(228,223,181,0.6)',
                    fontWeight: 500,
                    fontSize: 12,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {t.login.email}
                </span>
              }
              rules={[
                { required: true, message: t.login.emailRequired },
                { type: 'email', message: t.login.emailInvalid },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: 'rgba(154,177,122,0.55)' }} />}
                placeholder={t.login.emailPlaceholder}
                autoComplete="email"
                style={{ borderRadius: 12 }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <span
                  style={{
                    color: 'rgba(228,223,181,0.6)',
                    fontWeight: 500,
                    fontSize: 12,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {t.login.password}
                </span>
              }
              rules={[{ required: true, message: t.login.passwordRequired }]}
              style={{ marginBottom: TURNSTILE_SITE_KEY ? 16 : 36 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: 'rgba(154,177,122,0.55)' }} />}
                placeholder={t.login.passwordPlaceholder}
                autoComplete="current-password"
                style={{ borderRadius: 12 }}
              />
            </Form.Item>

            <TurnstileWidget
              onToken={(tk) => setCaptchaToken(tk)}
              onError={() => {
                setCaptchaToken(null)
                message.error(t.login.captchaFailed)
              }}
            />

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: 52,
                  fontSize: 14,
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${SAGE} 0%, #6e8854 100%)`,
                  border: 'none',
                  borderRadius: 14,
                  boxShadow: `0 8px 32px rgba(154,177,122,0.32), 0 0 0 1px rgba(154,177,122,0.18)`,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#0c1a09',
                }}
              >
                {t.login.signIn}
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form layout="vertical" onFinish={onFinishMfa} requiredMark={false} size="large">
            <Form.Item
              name="code"
              label={
                <span
                  style={{
                    color: 'rgba(228,223,181,0.6)',
                    fontWeight: 500,
                    fontSize: 12,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {t.login.mfaCode}
                </span>
              }
              rules={[
                { required: true, message: t.login.mfaCodeRequired },
                { pattern: /^\d{6}$/, message: t.login.mfaCodeInvalid },
              ]}
              style={{ marginBottom: 24 }}
            >
              <Input
                prefix={<SafetyCertificateOutlined style={{ color: 'rgba(154,177,122,0.55)' }} />}
                placeholder={t.login.mfaCodePlaceholder}
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
                style={{
                  borderRadius: 12,
                  letterSpacing: '0.4em',
                  fontSize: 18,
                  textAlign: 'center',
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 12 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: 52,
                  fontSize: 14,
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${SAGE} 0%, #6e8854 100%)`,
                  border: 'none',
                  borderRadius: 14,
                  boxShadow: `0 8px 32px rgba(154,177,122,0.32), 0 0 0 1px rgba(154,177,122,0.18)`,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#0c1a09',
                }}
              >
                {t.login.mfaVerify}
              </Button>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
              <Button
                type="link"
                onClick={onBackToCredentials}
                style={{ color: 'rgba(228,223,181,0.55)', fontSize: 12 }}
              >
                {t.login.mfaBackToLogin}
              </Button>
            </Form.Item>
          </Form>
        )}

        {/* ── Footer note ── */}
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div style={{ width: 16, height: 1, background: 'rgba(154,177,122,0.18)' }} />
            <Text style={{ fontSize: 10, color: 'rgba(154,177,122,0.3)', letterSpacing: '0.14em' }}>
              AUTHORIZED ACCESS ONLY — {t.login.adminPortal}
            </Text>
            <div style={{ width: 16, height: 1, background: 'rgba(154,177,122,0.18)' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: SAGE,
          colorBgBase: DEEP,
          borderRadius: 12,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
      }}
    >
      <App>
        <LoginForm />
        {TURNSTILE_SITE_KEY && (
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__onTurnstileLoad"
            strategy="afterInteractive"
            onLoad={() => {
              if (typeof window !== 'undefined') {
                window.__turnstileReady = true
                window.__onTurnstileLoad?.()
              }
            }}
          />
        )}
      </App>
    </ConfigProvider>
  )
}
