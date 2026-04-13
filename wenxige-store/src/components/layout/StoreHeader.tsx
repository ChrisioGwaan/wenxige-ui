'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Layout, Menu, Button, Drawer, Badge, Input, Select, type InputRef } from 'antd';
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
  const [mobileSearchValue, setMobileSearchValue] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

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
          padding: '0 clamp(16px, 4vw, 48px)',
          background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          height: 72,
          borderBottom: scrolled ? 'none' : '1px solid #f0f0f0',
        }}
      >
        {/* Logo */}
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

        {/* Desktop nav links */}
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

        {/* Desktop actions: language, search, cart, shop now */}
        <div className="store-desktop-actions" style={{ alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <Select
            value={language}
            onChange={setLanguage}
            options={langOptions}
            variant="borderless"
            suffixIcon={<GlobalOutlined style={{ fontSize: 16 }} />}
            style={{ width: 72 }}
            popupMatchSelectWidth={false}
          />

          {/* Search with smooth expand */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={<SearchOutlined style={{ fontSize: 18 }} />}
              onClick={() => {
                if (searchOpen) {
                  handleSearch();
                } else {
                  setSearchOpen(true);
                }
              }}
              aria-label={t.nav.search}
              style={{ zIndex: 1 }}
            />
            <div
              style={{
                overflow: 'hidden',
                width: searchOpen ? 200 : 0,
                opacity: searchOpen ? 1 : 0,
                transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease',
              }}
            >
              <Input
                ref={searchInputRef}
                placeholder={t.nav.searchPlaceholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onPressEnter={handleSearch}
                suffix={
                  <CloseOutlined
                    style={{ cursor: 'pointer', color: '#999', transition: 'color 0.2s' }}
                    onClick={() => { setSearchOpen(false); setSearchValue(''); }}
                  />
                }
                style={{ width: 200, borderRadius: 999 }}
              />
            </div>
          </div>

          <Badge count={totalItems} size="small" offset={[-4, 4]}>
            <Button
              type="text"
              icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />}
              onClick={() => setCartOpen(true)}
              aria-label="Shopping cart"
            />
          </Badge>

          <Link href="/products">
            <Button type="primary" shape="round" icon={<ShoppingOutlined />}>
              {t.nav.shopNow}
            </Button>
          </Link>
        </div>

        {/* Mobile actions: cart + hamburger only */}
        <div style={{ alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <Badge count={totalItems} size="small" offset={[-4, 4]}>
            <Button
              type="text"
              icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />}
              onClick={() => setCartOpen(true)}
              className="store-mobile-cart-btn"
              aria-label="Shopping cart"
            />
          </Badge>
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: 20 }} />}
            onClick={() => setDrawerOpen(true)}
            className="store-mobile-menu-btn"
            aria-label="Open menu"
          />
        </div>

        {/* Mobile nav drawer — contains everything */}
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

          {/* Drawer search */}
          <div style={{ padding: '16px 0 8px' }}>
            <Input
              placeholder={t.nav.searchPlaceholder}
              value={mobileSearchValue}
              onChange={(e) => setMobileSearchValue(e.target.value)}
              onPressEnter={() => {
                if (mobileSearchValue.trim()) {
                  router.push(`/search?q=${encodeURIComponent(mobileSearchValue.trim())}`);
                  setDrawerOpen(false);
                  setMobileSearchValue('');
                }
              }}
              prefix={<SearchOutlined style={{ color: '#999' }} />}
              allowClear
              style={{ borderRadius: 999 }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
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
          </div>
        </Drawer>
      </Header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
