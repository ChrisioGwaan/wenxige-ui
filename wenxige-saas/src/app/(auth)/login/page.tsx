'use client'

import { useState } from 'react'
import { App, Button, Form, Input, Typography, ConfigProvider } from 'antd'
import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const { Title, Text } = Typography

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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0f9ff 100%)',
          padding: '24px',
        }}
      >
        {/* Decorative background shapes */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(22, 163, 74, 0.06)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '8%',
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'rgba(14, 165, 233, 0.05)',
            filter: 'blur(60px)',
          }}
        />

        <div
          style={{
            width: '100%',
            maxWidth: 420,
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: 20,
            boxShadow: '0 25px 50px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
            padding: '48px 40px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Brand */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                fontSize: 28,
                boxShadow: '0 8px 24px rgba(22, 163, 74, 0.3)',
              }}
            >
              🍵
            </div>
            <Title
              level={3}
              style={{ marginBottom: 6, color: '#0f172a', fontWeight: 700 }}
            >
              Wenxige Admin
            </Title>
            <Text style={{ color: '#64748b', fontSize: 14 }}>
              Sign in to manage your store
            </Text>
          </div>

          <Form
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="email"
              label={<span style={{ color: '#374151', fontWeight: 500 }}>Email</span>}
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
                placeholder="admin@wenxige.com"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ color: '#374151', fontWeight: 500 }}>Password</span>}
              rules={[{ required: true, message: 'Please enter your password' }]}
              style={{ marginBottom: 32 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: 48,
                  fontSize: 15,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #16a34a, #15803d)',
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(22, 163, 74, 0.35)',
                }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Text style={{ fontSize: 12, color: '#94a3b8' }}>
              Admin access only · No public registration
            </Text>
          </div>
        </div>
      </div>
    )
}

export default function LoginPage() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#16a34a',
          borderRadius: 8,
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
      }}
    >
      <App>
        <LoginForm />
      </App>
    </ConfigProvider>
  )
}
