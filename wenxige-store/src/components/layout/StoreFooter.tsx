'use client';

import Link from 'next/link';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Track Order', href: '/track-order' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'About Us', href: '/information' },
];

const policyLinks = [
  { label: 'Terms of Use', href: '/terms-of-use' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
];

const linkStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.65)',
  transition: 'color 0.2s ease',
  fontSize: 14,
};

export default function StoreFooter() {
  return (
    <Footer style={{ background: '#1A1A1A', padding: '64px 48px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Row gutter={[48, 40]}>
          <Col xs={24} sm={24} md={8}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 24 }}>🍃</span>
              <Title level={4} style={{ color: '#fff', margin: 0 }}>
                Wenxige Tea
              </Title>
            </div>
            <Paragraph
              style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 300, lineHeight: 1.8 }}
            >
              Discover the art of premium Chinese tea. Sourced directly from heritage
              gardens, curated by our tea masters for your enjoyment.
            </Paragraph>
          </Col>

          <Col xs={12} sm={12} md={5}>
            <Title level={5} style={{ color: '#C4A35A', marginBottom: 20 }}>
              Quick Links
            </Title>
            <Space orientation="vertical" size={10}>
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href} style={linkStyle}>
                  {link.label}
                </Link>
              ))}
            </Space>
          </Col>

          <Col xs={12} sm={12} md={5}>
            <Title level={5} style={{ color: '#C4A35A', marginBottom: 20 }}>
              Policies
            </Title>
            <Space orientation="vertical" size={10}>
              {policyLinks.map((link) => (
                <Link key={link.href} href={link.href} style={linkStyle}>
                  {link.label}
                </Link>
              ))}
            </Space>
          </Col>

          <Col xs={24} sm={24} md={6}>
            <Title level={5} style={{ color: '#C4A35A', marginBottom: 20 }}>
              Contact Info
            </Title>
            <Space orientation="vertical" size={14}>
              <div style={{ display: 'flex', gap: 10, color: 'rgba(255,255,255,0.65)' }}>
                <EnvironmentOutlined style={{ marginTop: 3 }} />
                <Text style={{ color: 'inherit' }}>123 Tea Garden Road, Shanghai, China</Text>
              </div>
              <div style={{ display: 'flex', gap: 10, color: 'rgba(255,255,255,0.65)' }}>
                <PhoneOutlined />
                <Text style={{ color: 'inherit' }}>+86 21 1234 5678</Text>
              </div>
              <div style={{ display: 'flex', gap: 10, color: 'rgba(255,255,255,0.65)' }}>
                <MailOutlined />
                <Text style={{ color: 'inherit' }}>hello@wenxigetea.com</Text>
              </div>
              <div style={{ display: 'flex', gap: 10, color: 'rgba(255,255,255,0.65)' }}>
                <ClockCircleOutlined />
                <Text style={{ color: 'inherit' }}>Mon–Sat: 9:00 AM – 6:00 PM</Text>
              </div>
            </Space>
          </Col>
        </Row>

        <Divider style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '40px 0 24px' }} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
            © 2026 Wenxige Tea (问溪阁). All rights reserved.
          </Text>
          <Space size={24} style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
            <Link href="/privacy-policy" style={{ color: 'inherit' }}>
              Privacy
            </Link>
            <Link href="/terms-of-use" style={{ color: 'inherit' }}>
              Terms
            </Link>
          </Space>
        </div>
      </div>
    </Footer>
  );
}
