'use client'

import { useState } from 'react'
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  ConfigProvider,
  theme,
  Typography,
  type MenuProps,
} from 'antd'
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
  CarOutlined,
  MessageOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const { Sider, Header, Content } = Layout
const { Text } = Typography

const SIDEBAR_WIDTH = 240
const SIDEBAR_COLLAPSED_WIDTH = 64
const SIDEBAR_BG = '#0e1117'
const HEADER_HEIGHT = 56

interface NavItem {
  key: string
  icon: React.ReactNode
  label: string
  children?: { key: string; label: string }[]
}

const navItems: NavItem[] = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: 'products-group',
    icon: <ShoppingOutlined />,
    label: 'Products',
    children: [
      { key: '/products', label: 'All Products' },
      { key: '/products/categories', label: 'Categories' },
      { key: '/products/brands', label: 'Brands' },
    ],
  },
  {
    key: 'orders-group',
    icon: <ShoppingCartOutlined />,
    label: 'Orders',
    children: [
      { key: '/orders', label: 'All Orders' },
      { key: '/shipments', label: 'Shipments' },
    ],
  },
  {
    key: '/inquiries',
    icon: <MessageOutlined />,
    label: 'Inquiries',
  },
]

function buildMenuItems(items: NavItem[]): MenuProps['items'] {
  return items.map((item) => {
    if (item.children) {
      return {
        key: item.key,
        icon: item.icon,
        label: item.label,
        children: item.children.map((child) => ({
          key: child.key,
          label: <Link href={child.key}>{child.label}</Link>,
        })),
      }
    }
    return {
      key: item.key,
      icon: item.icon,
      label: <Link href={item.key}>{item.label}</Link>,
    }
  })
}

function getOpenKeys(pathname: string): string[] {
  if (pathname.startsWith('/products')) return ['products-group']
  if (pathname.startsWith('/orders') || pathname.startsWith('/shipments'))
    return ['orders-group']
  return []
}

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode
  user: User
}) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      danger: true,
      onClick: handleLogout,
    },
  ]

  const menuItems = buildMenuItems(navItems)
  const openKeys = getOpenKeys(pathname)

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#16a34a',
          borderRadius: 8,
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
        components: {
          Layout: {
            siderBg: SIDEBAR_BG,
            headerBg: '#ffffff',
          },
          Menu: {
            darkItemBg: SIDEBAR_BG,
            darkSubMenuItemBg: '#161b22',
            darkItemSelectedBg: '#16a34a',
            darkItemSelectedColor: '#ffffff',
            darkItemHoverBg: 'rgba(255,255,255,0.06)',
            darkItemHoverColor: '#ffffff',
          },
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        {/* ── Sidebar ── */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={SIDEBAR_WIDTH}
          collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
          theme="dark"
          style={{
            background: SIDEBAR_BG,
            borderRight: '1px solid rgba(255,255,255,0.06)',
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
          {/* Logo */}
          <div
            style={{
              height: HEADER_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              padding: collapsed ? '0 20px' : '0 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
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
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.4)',
              }}
            >
              🍵
            </div>
            {!collapsed && (
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
                  Wenxige
                </Text>
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: 11,
                    display: 'block',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Store Admin
                </Text>
              </div>
            )}
          </div>

          {/* Navigation */}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[pathname]}
            defaultOpenKeys={openKeys}
            items={menuItems}
            style={{
              background: 'transparent',
              border: 'none',
              marginTop: 8,
              flex: 1,
            }}
          />
        </Sider>

        {/* ── Main area ── */}
        <Layout
          style={{
            marginLeft: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
            transition: 'margin-left 0.2s',
          }}
        >
          {/* Header */}
          <Header
            style={{
              background: '#ffffff',
              height: HEADER_HEIGHT,
              lineHeight: `${HEADER_HEIGHT}px`,
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #f0f0f0',
              position: 'sticky',
              top: 0,
              zIndex: 99,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            {/* Collapse button */}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ color: '#64748b', fontSize: 16 }}
            />

            {/* User menu */}
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
                  ((e.currentTarget as HTMLElement).style.background =
                    '#f8fafc')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    'transparent')
                }
              >
                <Avatar
                  size={32}
                  icon={<UserOutlined />}
                  style={{ background: '#16a34a' }}
                />
                <Text style={{ fontSize: 13, color: '#374151', maxWidth: 180 }} ellipsis>
                  {user.email}
                </Text>
                <DownOutlined style={{ fontSize: 10, color: '#94a3b8' }} />
              </div>
            </Dropdown>
          </Header>

          {/* Page content */}
          <Content
            style={{
              background: '#f8fafc',
              minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
            }}
          >
            <div style={{ padding: 24 }}>{children}</div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
