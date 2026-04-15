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
  Divider,
  message,
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

function getOpenKeys(pathname: string): string[] {
  if (pathname.startsWith('/products')) return ['products-group']
  if (pathname.startsWith('/orders') || pathname.startsWith('/shipments')) return ['orders-group']
  return []
}

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode
  user: User
}) {
  const { lang, setLang, t } = useLanguage()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [displayName, setDisplayName] = useState(user.user_metadata?.full_name ?? '')
  const [form] = Form.useForm()
  const [messageApi, msgContextHolder] = message.useMessage()
  const pathname = usePathname()
  const router = useRouter()

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

  const navItems = useMemo(() => [
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
        { key: '/products/categories', label: <Link href="/products/categories">{t.nav.categories}</Link> },
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
  ], [t])

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
        <Image src="/Lumi_Tea_Logo-removebg.png" alt="Lumi Tea" width={32} height={32} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
      </div>
      {expanded && (
        <div style={{ overflow: 'hidden' }}>
          <Text strong style={{ color: '#ffffff', fontSize: 15, display: 'block', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
            Lumi Tea
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, display: 'block', whiteSpace: 'nowrap' }}>
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
            styles={{ body: { padding: 0, background: SIDEBAR_BG }, wrapper: { width: SIDEBAR_WIDTH } }}
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
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#F0EAD6')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
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
            <div className="dash-content" style={{ padding: 24 }}>
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
        onCancel={() => setProfileOpen(false)}
        onOk={handleProfileSave}
        okText={t.profile.saveChanges}
        cancelText={t.common.cancel}
        okButtonProps={{ icon: <SaveOutlined />, loading: profileSaving }}
        width={400}
        destroyOnHidden
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0 24px' }}>
          <Avatar size={64} icon={<UserOutlined />} style={{ background: '#9AB17A', marginBottom: 10 }} />
          <Text type="secondary" style={{ fontSize: 13 }}>{user.email}</Text>
        </div>
        <Divider style={{ margin: '0 0 20px' }} />
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item
            name="display_name"
            label={t.profile.displayName}
            rules={[
              { required: true, message: t.profile.displayNameRequired },
              { max: 60, message: t.profile.displayNameMax },
            ]}
          >
            <Input placeholder={t.profile.placeholder} maxLength={60} style={{ borderRadius: 8 }} />
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  )
}
