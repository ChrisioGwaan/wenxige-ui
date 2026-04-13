'use client';

import { Typography, Button, Space } from 'antd';
import { ShoppingOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AnimatedSection from '@/components/shared/AnimatedSection';

const { Title, Paragraph } = Typography;

export default function CTASection() {
  return (
    <section
      style={{
        padding: '100px 48px',
        background: 'linear-gradient(135deg, #2D5016 0%, #1a3a0a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'rgba(196,163,90,0.08)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -60,
          left: -60,
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <AnimatedSection>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🍵</div>
          <Title
            level={2}
            style={{
              color: '#fff',
              fontSize: 40,
              marginBottom: 16,
            }}
          >
            Ready to Start Your Tea Journey?
          </Title>
          <Paragraph
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 17,
              maxWidth: 520,
              margin: '0 auto 40px',
              lineHeight: 1.7,
            }}
          >
            Explore our curated collection of premium Chinese teas and experience the
            difference that authentic, fresh tea can make.
          </Paragraph>
          <Space size={16} wrap style={{ justifyContent: 'center' }}>
            <Link href="/products">
              <Button
                type="primary"
                size="large"
                shape="round"
                icon={<ShoppingOutlined />}
                style={{
                  height: 52,
                  paddingInline: 36,
                  fontSize: 16,
                  fontWeight: 600,
                  background: '#C4A35A',
                  borderColor: '#C4A35A',
                }}
              >
                Browse Collection
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="large"
                shape="round"
                ghost
                icon={<CustomerServiceOutlined />}
                style={{
                  height: 52,
                  paddingInline: 36,
                  fontSize: 16,
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.4)',
                }}
              >
                Contact Us
              </Button>
            </Link>
          </Space>
        </AnimatedSection>
      </div>
    </section>
  );
}
