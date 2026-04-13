'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Layout, Menu, Button, Drawer, Badge, Input, Select } from 'antd';
import {
  MenuOutlined,
  ShoppingOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  CloseOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useCart } from '@/components/cart/CartContext';
import { useTranslation, type Language } from '@/i18n';
import CartDrawer from '@/components/cart/CartDrawer';

const { Header } = Layout;

const langOptions: { value: Language; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'zh-TW', label: '繁' },
  { value: 'zh-CN', label: '简' },
];

export default function StoreHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const { t, language, setLanguage } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { key: '/', label: t.nav.home },
    { key: '/products', label: t.nav.products },
    { key: '/track-order', label: t.nav.trackOrder },
    { key: '/contact', label: t.nav.contact },
    { key: '/information', label: t.nav.about },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = useCallback(() => {
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue('');
    }
  }, [searchValue, router]);

  const selectedKey = navItems.find((item) => item.key === pathname)?.key ?? '/';

  return (
    <>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 48px',
          background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          height: 72,
          borderBottom: scrolled ? 'none' : '1px solid #f0f0f0',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 26 }}>🍃</span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#2D5016',
              letterSpacing: -0.5,
            }}
          >
            Wenxige Tea
          </span>
        </Link>

        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={navItems.map((item) => ({
            key: item.key,
            label: <Link href={item.key}>{item.label}</Link>,
          }))}
          style={{
            flex: 1,
            justifyContent: 'center',
            border: 'none',
            background: 'transparent',
            fontSize: 15,
          }}
          className="store-desktop-nav"
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          {/* Language switcher */}
          <Select
            value={language}
            onChange={setLanguage}
            options={langOptions}
            variant="borderless"
            suffixIcon={<GlobalOutlined style={{ fontSize: 16 }} />}
            style={{ width: 72 }}
            popupMatchSelectWidth={false}
          />

          {/* Search toggle */}
          {searchOpen ? (
            <Input
              placeholder={t.nav.searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={handleSearch}
              suffix={
                <CloseOutlined
                  style={{ cursor: 'pointer', color: '#999' }}
                  onClick={() => { setSearchOpen(false); setSearchValue(''); }}
                />
              }
              autoFocus
              style={{ width: 200, borderRadius: 999 }}
            />
          ) : (
            <Button
              type="text"
              icon={<SearchOutlined style={{ fontSize: 18 }} />}
              onClick={() => setSearchOpen(true)}
              aria-label={t.nav.search}
            />
          )}

          {/* Cart */}
          <Badge count={totalItems} size="small" offset={[-4, 4]}>
            <Button
              type="text"
              icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />}
              onClick={() => setCartOpen(true)}
              aria-label="Shopping cart"
            />
          </Badge>

          {/* Shop Now */}
          <Link href="/products">
            <Button
              type="primary"
              shape="round"
              icon={<ShoppingOutlined />}
              className="store-shop-btn"
            >
              {t.nav.shopNow}
            </Button>
          </Link>

          {/* Mobile menu */}
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: 20 }} />}
            onClick={() => setDrawerOpen(true)}
            className="store-mobile-menu-btn"
            aria-label="Open menu"
          />
        </div>

        {/* Mobile nav drawer */}
        <Drawer
          title={
            <span style={{ color: '#2D5016', fontWeight: 700 }}>
              🍃 Wenxige Tea
            </span>
          }
          placement="right"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          size="default"
        >
          <Menu
            mode="vertical"
            selectedKeys={[selectedKey]}
            items={navItems.map((item) => ({
              key: item.key,
              label: (
                <Link href={item.key} onClick={() => setDrawerOpen(false)}>
                  {item.label}
                </Link>
              ),
            }))}
            style={{ border: 'none' }}
          />
          <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Select
              value={language}
              onChange={setLanguage}
              options={langOptions}
              style={{ width: '100%' }}
              suffixIcon={<GlobalOutlined />}
            />
            <Link href="/products" onClick={() => setDrawerOpen(false)}>
              <Button type="primary" block shape="round" icon={<ShoppingOutlined />}>
                {t.nav.shopNow}
              </Button>
            </Link>
            <Button
              block
              shape="round"
              icon={<SearchOutlined />}
              onClick={() => {
                setDrawerOpen(false);
                router.push('/search');
              }}
            >
              {t.nav.search}
            </Button>
          </div>
        </Drawer>
      </Header>

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
