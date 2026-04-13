'use client';

import Link from 'next/link';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from '@/i18n';

const { Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const linkStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.65)',
  transition: 'color 0.2s ease',
  fontSize: 14,
};

export default function StoreFooter() {
  const { t } = useTranslation();

  const quickLinks = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.products, href: '/products' },
    { label: t.nav.trackOrder, href: '/track-order' },
    { label: t.common.contactUs, href: '/contact' },
    { label: t.common.aboutUs, href: '/information' },
  ];

  const policyLinks = [
    { label: t.policy.termsOfUse, href: '/terms-of-use' },
    { label: t.policy.privacyPolicy, href: '/privacy-policy' },
    { label: t.policy.refundPolicy, href: '/refund-policy' },
    { label: t.policy.shippingPolicy, href: '/shipping-policy' },
    { label: t.policy.termsAndConditions, href: '/terms-and-conditions' },
  ];

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
              {t.footer.description}
            </Paragraph>
          </Col>

          <Col xs={12} sm={12} md={5}>
            <Title level={5} style={{ color: '#C4A35A', marginBottom: 20 }}>
              {t.footer.quickLinks}
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
              {t.footer.policies}
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
              {t.footer.contactInfo}
            </Title>
            <Space orientation="vertical" size={14}>
              <div style={{ display: 'flex', gap: 10, color: 'rgba(255,255,255,0.65)' }}>
                <EnvironmentOutlined style={{ marginTop: 3 }} />
                <Text style={{ color: 'inherit' }}>{t.footer.address}</Text>
              </div>
              <div style={{ display: 'flex', gap: 10, color: 'rgba(255,255,255,0.65)' }}>
                <PhoneOutlined />
                <Text style={{ color: 'inherit' }}>{t.footer.phone}</Text>
              </div>
              <div style={{ display: 'flex', gap: 10, color: 'rgba(255,255,255,0.65)' }}>
                <MailOutlined />
                <Text style={{ color: 'inherit' }}>{t.footer.email}</Text>
              </div>
              <div style={{ display: 'flex', gap: 10, color: 'rgba(255,255,255,0.65)' }}>
                <ClockCircleOutlined />
                <Text style={{ color: 'inherit' }}>{t.footer.hours}</Text>
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
            {t.footer.copyright}
          </Text>
          <Space size={24} style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
            <Link href="/privacy-policy" style={{ color: 'inherit' }}>
              {t.footer.privacy}
            </Link>
            <Link href="/terms-of-use" style={{ color: 'inherit' }}>
              {t.footer.terms}
            </Link>
          </Space>
        </div>
      </div>
    </Footer>
  );
}
