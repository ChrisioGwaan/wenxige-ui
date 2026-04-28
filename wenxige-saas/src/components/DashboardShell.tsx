'use client'

import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  ConfigProvider,
  theme,
  Typography,
  Drawer,
  Modal,
  Form,
  Input,
  message,
  Tabs,
  Tag,
  Space,
  Popconfirm,
  Spin,
  Slider,
  type MenuProps,
} from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import {
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  MessageOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  SettingOutlined,
  SaveOutlined,
  TranslationOutlined,
  SafetyCertificateOutlined,
  CopyOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { useLanguage } from '@/lib/i18n'

const { Sider, Header, Content } = Layout
const { Text } = Typography

const SIDEBAR_WIDTH = 240
const SIDEBAR_COLLAPSED_WIDTH = 64
const SIDEBAR_BG = '#2a3820'
const HEADER_HEIGHT = 56
const FONT_SCALE_KEY = 'fontScale'
const FONT_SCALE_MIN = 100
const FONT_SCALE_MAX = 150
const FONT_SCALE_DEFAULT = 100

function getOpenKeys(pathname: string): string[] {
  if (pathname.startsWith('/products')) return ['products-group']
  if (pathname.startsWith('/orders') || pathname.startsWith('/shipments')) return ['orders-group']
  return []
}

export function DashboardShell({ children, user }: { children: React.ReactNode; user: User }) {
  const { lang, setLang, t } = useLanguage()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [displayName, setDisplayName] = useState(user.user_metadata?.full_name ?? '')
  const [form] = Form.useForm()
  const [mfaForm] = Form.useForm()
  const [messageApi, msgContextHolder] = message.useMessage()

  // MFA management state
  type TotpFactor = {
    id: string
    status: string
    created_at: string
    friendly_name?: string | null
  }
  const [mfaLoading, setMfaLoading] = useState(false)
  const [mfaFactor, setMfaFactor] = useState<TotpFactor | null>(null)
  const [enrolling, setEnrolling] = useState(false)
  const [enrollData, setEnrollData] = useState<{
    factorId: string
    challengeId: string
    qr: string
    secret: string
  } | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [unenrolling, setUnenrolling] = useState(false)
  const [fontScale, setFontScale] = useState<number>(FONT_SCALE_DEFAULT)
  const pathname = usePathname()
  const router = useRouter()

  // Load persisted font scale.
  useEffect(() => {
    const saved = Number(localStorage.getItem(FONT_SCALE_KEY))
    if (Number.isFinite(saved) && saved >= FONT_SCALE_MIN && saved <= FONT_SCALE_MAX) {
      setFontScale(saved)
    }
  }, [])

  const updateFontScale = (value: number) => {
    const clamped = Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, Math.round(value)))
    setFontScale((prev) => {
      if (prev === clamped) return prev
      localStorage.setItem(FONT_SCALE_KEY, String(clamped))
      return clamped
    })
  }

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = (matches: boolean) => {
      setIsMobile(matches)
      setCollapsed(matches)
    }
    update(mq.matches)
    const handler = (e: MediaQueryListEvent) => update(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const openProfile = () => {
    form.setFieldsValue({ display_name: displayName })
    setProfileOpen(true)
    void refreshFactors()
  }

  const refreshFactors = async () => {
    setMfaLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.mfa.listFactors()
      if (error) throw error
      const verified = data?.totp?.find((f) => f.status === 'verified') ?? null
      setMfaFactor(verified)
    } catch {
      setMfaFactor(null)
    } finally {
      setMfaLoading(false)
    }
  }

  const closeProfile = () => {
    setProfileOpen(false)
    setEnrolling(false)
    setEnrollData(null)
    mfaForm.resetFields()
  }

  const startEnroll = async () => {
    const supabase = createClient()
    setEnrolling(true)
    try {
      // Clean up any leftover unverified factor before enrolling a fresh one
      const { data: existing } = await supabase.auth.mfa.listFactors()
      const stale = existing?.totp?.find((f) => f.status !== 'verified')
      if (stale) {
        await supabase.auth.mfa.unenroll({ factorId: stale.id })
      }
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' })
      if (error || !data) throw error ?? new Error('enroll failed')
      const { data: challenge, error: chErr } = await supabase.auth.mfa.challenge({
        factorId: data.id,
      })
      if (chErr || !challenge) throw chErr ?? new Error('challenge failed')
      setEnrollData({
        factorId: data.id,
        challengeId: challenge.id,
        qr: data.totp.qr_code,
        secret: data.totp.secret,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown error'
      messageApi.error(t.profile.mfaEnrollError + msg)
      setEnrolling(false)
    }
  }

  const cancelEnroll = async () => {
    if (enrollData) {
      const supabase = createClient()
      try {
        await supabase.auth.mfa.unenroll({ factorId: enrollData.factorId })
      } catch {
        /* noop */
      }
    }
    setEnrolling(false)
    setEnrollData(null)
    mfaForm.resetFields()
  }

  const verifyEnroll = async () => {
    if (!enrollData) return
    try {
      const values = await mfaForm.validateFields(['mfa_code'])
      setVerifying(true)
      const supabase = createClient()
      const { error } = await supabase.auth.mfa.verify({
        factorId: enrollData.factorId,
        challengeId: enrollData.challengeId,
        code: String(values.mfa_code).trim(),
      })
      if (error) throw error
      messageApi.success(t.profile.mfaEnrollSuccess)
      setEnrolling(false)
      setEnrollData(null)
      mfaForm.resetFields()
      await refreshFactors()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'invalid code'
      messageApi.error(t.profile.mfaEnrollError + msg)
    } finally {
      setVerifying(false)
    }
  }

  const handleUnenroll = async () => {
    if (!mfaFactor) return
    setUnenrolling(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.mfa.unenroll({ factorId: mfaFactor.id })
      if (error) throw error
      messageApi.success(t.profile.mfaUnenrollSuccess)
      await refreshFactors()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown error'
      messageApi.error(t.profile.mfaUnenrollError + msg)
    } finally {
      setUnenrolling(false)
    }
  }

  const copySecret = async () => {
    if (!enrollData) return
    try {
      await navigator.clipboard.writeText(enrollData.secret)
      messageApi.success(t.profile.mfaCopied)
    } catch {
      /* noop */
    }
  }

  const handleProfileSave = async () => {
    try {
      const values = await form.validateFields()
      setProfileSaving(true)
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        data: { full_name: values.display_name.trim() },
      })
      setProfileSaving(false)
      if (error) {
        messageApi.error(t.profile.updateError + error.message)
      } else {
        setDisplayName(values.display_name.trim())
        setProfileOpen(false)
        messageApi.success(t.profile.updateSuccess)
      }
    } catch {
      // validation failed
    }
  }

  const navItems = useMemo(
    () => [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: <Link href="/dashboard">{t.nav.dashboard}</Link>,
      },
      {
        key: 'products-group',
        icon: <ShoppingOutlined />,
        label: t.nav.products,
        children: [
          { key: '/products', label: <Link href="/products">{t.nav.allProducts}</Link> },
          {
            key: '/products/categories',
            label: <Link href="/products/categories">{t.nav.categories}</Link>,
          },
          { key: '/products/brands', label: <Link href="/products/brands">{t.nav.brands}</Link> },
        ],
      },
      {
        key: 'orders-group',
        icon: <ShoppingCartOutlined />,
        label: t.nav.orders,
        children: [
          { key: '/orders', label: <Link href="/orders">{t.nav.allOrders}</Link> },
          { key: '/shipments', label: <Link href="/shipments">{t.nav.shipments}</Link> },
        ],
      },
      {
        key: '/inquiries',
        icon: <MessageOutlined />,
        label: <Link href="/inquiries">{t.nav.inquiries}</Link>,
      },
    ],
    [t],
  )

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <SettingOutlined />,
      label: t.nav.profileSettings,
      onClick: openProfile,
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t.nav.signOut,
      danger: true,
      onClick: handleLogout,
    },
  ]

  const openKeys = getOpenKeys(pathname)

  const logoContent = (expanded: boolean) => (
    <div
      style={{
        height: HEADER_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        borderBottom: '1px solid rgba(154,177,122,0.14)',
        overflow: 'hidden',
        gap: 10,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          overflow: 'hidden',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(154,177,122,0.45)',
        }}
      >
        <Image
          src="/Lumi_Tea_Logo-removebg.png"
          alt="Lumi Tea"
          width={32}
          height={32}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      </div>
      {expanded && (
        <div style={{ overflow: 'hidden' }}>
          <Text
            strong
            style={{
              color: '#ffffff',
              fontSize: 15,
              display: 'block',
              whiteSpace: 'nowrap',
              lineHeight: 1.3,
            }}
          >
            Lumi Tea
          </Text>
          <Text
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: 11,
              display: 'block',
              whiteSpace: 'nowrap',
            }}
          >
            {t.nav.storeAdmin}
          </Text>
        </div>
      )}
    </div>
  )

  const sidebarMenu = (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[pathname]}
      defaultOpenKeys={openKeys}
      items={navItems}
      onClick={(info) => {
        if (isMobile && info.key.startsWith('/')) setCollapsed(true)
      }}
      style={{ background: 'transparent', border: 'none', marginTop: 8, flex: 1 }}
    />
  )

  return (
    <ConfigProvider
      locale={lang === 'zh' ? zhCN : enUS}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#9AB17A',
          borderRadius: 8,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
        components: {
          Layout: { siderBg: SIDEBAR_BG, headerBg: '#FEFCF8' },
          Menu: {
            darkItemBg: SIDEBAR_BG,
            darkSubMenuItemBg: '#1e2a16',
            darkItemSelectedBg: '#9AB17A',
            darkItemSelectedColor: '#ffffff',
            darkItemHoverBg: 'rgba(154,177,122,0.14)',
            darkItemHoverColor: '#ffffff',
          },
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        {/* ── Desktop Sidebar ── */}
        {!isMobile && (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            width={SIDEBAR_WIDTH}
            collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
            theme="dark"
            style={{
              background: SIDEBAR_BG,
              borderRight: '1px solid rgba(154,177,122,0.14)',
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
              zIndex: 100,
            }}
            trigger={null}
          >
            {logoContent(!collapsed)}
            {sidebarMenu}
          </Sider>
        )}

        {/* ── Mobile Drawer ── */}
        {isMobile && (
          <Drawer
            placement="left"
            open={!collapsed}
            onClose={() => setCollapsed(true)}
            closable={false}
            zIndex={200}
            styles={{
              body: { padding: 0, background: SIDEBAR_BG },
              wrapper: { width: SIDEBAR_WIDTH },
            }}
          >
            {logoContent(true)}
            {sidebarMenu}
          </Drawer>
        )}

        {/* ── Main area ── */}
        <Layout
          style={{
            marginLeft: isMobile ? 0 : collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
            transition: 'margin-left 0.2s',
          }}
        >
          {/* Header */}
          <Header
            style={{
              background: '#FEFCF8',
              height: HEADER_HEIGHT,
              lineHeight: `${HEADER_HEIGHT}px`,
              padding: `0 ${isMobile ? 16 : 24}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #E4DFB5',
              position: 'sticky',
              top: 0,
              zIndex: 99,
              boxShadow: '0 1px 4px rgba(42,56,32,0.06)',
            }}
          >
            {/* Hamburger / collapse toggle */}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ color: '#6b7c5a', fontSize: 16 }}
            />

            {/* Right side: language switcher + user menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {/* Language toggle */}
              <Button
                type="text"
                icon={<TranslationOutlined />}
                onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
                style={{ color: '#6b7c5a', fontWeight: 600, fontSize: 13 }}
              >
                {lang === 'en' ? '中文' : 'EN'}
              </Button>

              {/* User dropdown */}
              <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: 8,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = '#F0EAD6')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = 'transparent')
                  }
                >
                  <Avatar size={32} icon={<UserOutlined />} style={{ background: '#9AB17A' }} />
                  {!isMobile && (
                    <Text style={{ fontSize: 13, color: '#374151', maxWidth: 180 }} ellipsis>
                      {displayName || user.email}
                    </Text>
                  )}
                  <DownOutlined style={{ fontSize: 10, color: '#9AB17A' }} />
                </div>
              </Dropdown>
            </div>
          </Header>

          {/* Page content */}
          <Content style={{ background: '#F7F2E5', minHeight: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
            <div
              className="dash-content"
              style={{
                padding: 24,
                // `zoom` scales rendered size including layout, without re-rendering the
                // antd ConfigProvider tree (which would remount Modals/Forms during drag).
                zoom: fontScale / 100,
              }}
            >
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>

      {/* ── Profile modal ── */}
      {msgContextHolder}
      <Modal
        title={t.profile.title}
        open={profileOpen}
        onCancel={closeProfile}
        footer={null}
        width={520}
        destroyOnHidden
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px 0 16px',
          }}
        >
          <Avatar
            size={64}
            icon={<UserOutlined />}
            style={{ background: '#9AB17A', marginBottom: 10 }}
          />
          <Text type="secondary" style={{ fontSize: 13 }}>
            {user.email}
          </Text>
        </div>
        <Tabs
          defaultActiveKey="profile"
          items={[
            {
              key: 'profile',
              label: t.profile.tabProfile,
              children: (
                <>
                  <Form form={form} layout="vertical" requiredMark={false}>
                    <Form.Item
                      name="display_name"
                      label={t.profile.displayName}
                      rules={[
                        { required: true, message: t.profile.displayNameRequired },
                        { max: 60, message: t.profile.displayNameMax },
                      ]}
                    >
                      <Input
                        placeholder={t.profile.placeholder}
                        maxLength={60}
                        style={{ borderRadius: 8 }}
                      />
                    </Form.Item>
                  </Form>
                  <div
                    style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}
                  >
                    <Button onClick={closeProfile}>{t.common.cancel}</Button>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      loading={profileSaving}
                      onClick={handleProfileSave}
                    >
                      {t.profile.saveChanges}
                    </Button>
                  </div>
                </>
              ),
            },
            {
              key: 'security',
              label: t.profile.tabSecurity,
              children: (
                <div>
                  <Space align="center" style={{ marginBottom: 8 }}>
                    <SafetyCertificateOutlined style={{ color: '#9AB17A', fontSize: 18 }} />
                    <Text strong>{t.profile.mfaTitle}</Text>
                    {mfaFactor ? (
                      <Tag color="green">{t.profile.mfaStatusEnabled}</Tag>
                    ) : (
                      <Tag>{t.profile.mfaStatusDisabled}</Tag>
                    )}
                  </Space>
                  <Text
                    type="secondary"
                    style={{ display: 'block', marginBottom: 16, fontSize: 13 }}
                  >
                    {t.profile.mfaDescription}
                  </Text>

                  {mfaLoading ? (
                    <div style={{ textAlign: 'center', padding: 24 }}>
                      <Spin />
                    </div>
                  ) : mfaFactor && !enrolling ? (
                    <div
                      style={{
                        border: '1px solid #E4DFB5',
                        borderRadius: 8,
                        padding: 16,
                        background: '#FBF8EC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{t.profile.mfaEnrolled}</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {t.profile.mfaAddedOn}: {new Date(mfaFactor.created_at).toLocaleString()}
                        </Text>
                      </div>
                      <Popconfirm
                        title={t.profile.mfaDisableConfirmTitle}
                        description={t.profile.mfaDisableConfirmDesc}
                        okText={t.profile.mfaDisable}
                        cancelText={t.common.cancel}
                        okButtonProps={{ danger: true, loading: unenrolling }}
                        onConfirm={handleUnenroll}
                      >
                        <Button danger>{t.profile.mfaDisable}</Button>
                      </Popconfirm>
                    </div>
                  ) : enrolling && enrollData ? (
                    <div
                      style={{
                        border: '1px solid #E4DFB5',
                        borderRadius: 8,
                        padding: 16,
                        background: '#FBF8EC',
                      }}
                    >
                      <Text strong style={{ display: 'block', marginBottom: 8 }}>
                        {t.profile.mfaEnrollTitle}
                      </Text>
                      <Text style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>
                        {t.profile.mfaScanQr}
                      </Text>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={enrollData.qr}
                          alt="TOTP QR"
                          width={180}
                          height={180}
                          style={{ background: '#fff', padding: 8, borderRadius: 8 }}
                        />
                      </div>
                      <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                        {t.profile.mfaManualSecret}
                      </Text>
                      <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
                        <Input
                          value={enrollData.secret}
                          readOnly
                          style={{ fontFamily: 'monospace' }}
                        />
                        <Button icon={<CopyOutlined />} onClick={copySecret}>
                          {t.profile.mfaCopySecret}
                        </Button>
                      </Space.Compact>
                      <Text style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
                        {t.profile.mfaEnterCode}
                      </Text>
                      <Form form={mfaForm} layout="vertical" requiredMark={false}>
                        <Form.Item
                          name="mfa_code"
                          rules={[
                            {
                              required: true,
                              message: t.profile.mfaEnrollError + t.profile.mfaTitle,
                            },
                            { pattern: /^\d{6}$/, message: t.profile.mfaEnrollError + '000000' },
                          ]}
                          style={{ marginBottom: 12 }}
                        >
                          <Input
                            placeholder="123456"
                            maxLength={6}
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            style={{ letterSpacing: '0.4em', fontSize: 18, textAlign: 'center' }}
                          />
                        </Form.Item>
                      </Form>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <Button onClick={cancelEnroll}>{t.common.cancel}</Button>
                        <Button type="primary" loading={verifying} onClick={verifyEnroll}>
                          {t.profile.mfaEnable}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="primary"
                      icon={<SafetyCertificateOutlined />}
                      onClick={startEnroll}
                    >
                      {t.profile.mfaEnable}
                    </Button>
                  )}
                </div>
              ),
            },
            {
              key: 'preferences',
              label: t.profile.tabPreferences,
              children: (
                <div>
                  <Space align="center" style={{ marginBottom: 8 }}>
                    <Text strong>{t.profile.textSize}</Text>
                    <Tag color="green">{fontScale}%</Tag>
                  </Space>
                  <Text
                    type="secondary"
                    style={{ display: 'block', marginBottom: 16, fontSize: 13 }}
                  >
                    {t.profile.textSizeDescription}
                  </Text>
                  <Slider
                    min={FONT_SCALE_MIN}
                    max={FONT_SCALE_MAX}
                    step={5}
                    value={fontScale}
                    onChange={updateFontScale}
                    onChangeComplete={updateFontScale}
                    marks={{
                      100: '100%',
                      110: '110%',
                      120: '120%',
                      130: '130%',
                      140: '140%',
                      150: '150%',
                    }}
                    tooltip={{ formatter: (v) => `${v}%` }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                    <Button
                      onClick={() => updateFontScale(FONT_SCALE_DEFAULT)}
                      disabled={fontScale === FONT_SCALE_DEFAULT}
                    >
                      {t.profile.textSizeReset}
                    </Button>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </Modal>
    </ConfigProvider>
  )
}
