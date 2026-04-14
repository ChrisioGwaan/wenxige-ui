'use client'

import { useState } from 'react'
import { App, Button, Form, Input, Typography, ConfigProvider, theme } from 'antd'
import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const { Text } = Typography

const SAGE  = '#9AB17A'
const OLIVE = '#C3CC9B'
const CREAM = '#E4DFB5'
const DEEP  = '#0c1a09'
const MID   = '#152211'

// Deterministic particle configs — no Math.random() to avoid hydration mismatch
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left:     `${((i * 4.33 + 3) % 92) + 2}%`,
  bottom:   `-${6 + (i * 2.7) % 20}px`,
  size:     3 + Math.round((i * 1.4) % 7),
  delay:    `${(i * 0.38) % 9}s`,
  duration: `${9 + (i * 0.6) % 9}s`,
  // organic leaf shapes
  radius:   i % 3 === 0 ? '50% 0 50% 0'
          : i % 3 === 1 ? '50%'
          : '30% 70% 70% 30% / 30% 30% 70% 70%',
  color: i % 2 === 0 ? SAGE : OLIVE,
  opacity: 0.25 + (i % 4) * 0.12,
}))

function LoginForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { message } = App.useApp()

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })
      if (error) throw error
      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials'
      message.error(msg)
    } finally {
      setLoading(false)
    }
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
        WENXIGE
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
        <div style={{ width: 1, height: 48, background: 'rgba(154,177,122,0.35)', marginTop: -1 }} />
      </div>

      {/* ── Corner bracket — bottom right ── */}
      <div style={{ position: 'absolute', bottom: 36, right: 36, pointerEvents: 'none' }}>
        <div style={{ width: 1, height: 48, background: 'rgba(154,177,122,0.35)', marginLeft: 'auto' }} />
        <div style={{ width: 48, height: 1, background: 'rgba(154,177,122,0.35)', marginTop: -1 }} />
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
            <div style={{ flex: 1, height: 1, background: 'rgba(154,177,122,0.2)', maxWidth: 40 }} />
            <Text
              style={{
                color: SAGE,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              Admin Portal
            </Text>
            <div style={{ flex: 1, height: 1, background: 'rgba(154,177,122,0.2)', maxWidth: 40 }} />
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
            Wenxige
          </div>
          <Text style={{ color: 'rgba(228,223,181,0.4)', fontSize: 13 }}>
            Sign in to manage your store
          </Text>
        </div>

        {/* ── Form ── */}
        <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
          <Form.Item
            name="email"
            label={
              <span style={{ color: 'rgba(228,223,181,0.6)', fontWeight: 500, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Email
              </span>
            }
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: 'rgba(154,177,122,0.55)' }} />}
              placeholder="admin@wenxige.com"
              autoComplete="email"
              style={{ borderRadius: 12 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <span style={{ color: 'rgba(228,223,181,0.6)', fontWeight: 500, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Password
              </span>
            }
            rules={[{ required: true, message: 'Please enter your password' }]}
            style={{ marginBottom: 36 }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(154,177,122,0.55)' }} />}
              placeholder="••••••••"
              autoComplete="current-password"
              style={{ borderRadius: 12 }}
            />
          </Form.Item>

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
              Sign In
            </Button>
          </Form.Item>
        </Form>

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
              AUTHORIZED ACCESS ONLY
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
      </App>
    </ConfigProvider>
  )
}

