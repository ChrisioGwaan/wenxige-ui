'use client';

import { Row, Col, Typography, Space } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import AnimatedSection from '@/components/shared/AnimatedSection';

const { Title, Paragraph } = Typography;

const highlights = [
  'Direct sourcing from 15+ tea-producing regions',
  'Third-generation tea artisan expertise',
  'Sustainable and ethical farming partnerships',
  'Freshness guaranteed — sealed within 48 hours of harvest',
];

export default function AboutSection() {
  return (
    <section style={{ padding: '100px 48px', background: '#FDFBF7' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Row gutter={[64, 48]} align="middle">
          <Col xs={24} md={12}>
            <AnimatedSection direction="left">
              <div
                style={{
                  position: 'relative',
                  height: 420,
                  borderRadius: 24,
                  overflow: 'hidden',
                  background: 'linear-gradient(145deg, #2D5016 0%, #1a3a0a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Decorative tea motif */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'radial-gradient(circle at 30% 40%, rgba(196,163,90,0.15) 0%, transparent 50%)',
                  }}
                />
                <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 80, marginBottom: 8 }}>🍵</div>
                  <div
                    style={{
                      fontSize: 36,
                      fontWeight: 700,
                      color: '#C4A35A',
                      letterSpacing: 6,
                    }}
                  >
                    问溪阁
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.5)',
                      marginTop: 8,
                      letterSpacing: 2,
                    }}
                  >
                    Since 2020
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </Col>

          <Col xs={24} md={12}>
            <AnimatedSection direction="right">
              <div
                style={{
                  color: '#C4A35A',
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                Our Story
              </div>
              <Title level={2} style={{ marginBottom: 20, color: '#1A1A1A' }}>
                A Legacy of Tea Mastery
              </Title>
              <Paragraph
                style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.8, marginBottom: 24 }}
              >
                Wenxige Tea was born from a passion to share the richness of Chinese tea
                culture with the world. Our name, 问溪阁 — &quot;The Pavilion by the
                Brook&quot; — reflects our philosophy of finding peace and clarity in every cup.
              </Paragraph>
              <Paragraph
                style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.8, marginBottom: 32 }}
              >
                We partner directly with family-owned tea gardens across China, ensuring every
                leaf meets our exacting standards for quality, sustainability, and authenticity.
              </Paragraph>
              <Space orientation="vertical" size={16}>
                {highlights.map((item) => (
                  <div
                    key={item}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
                  >
                    <CheckCircleFilled
                      style={{ color: '#2D5016', fontSize: 18, marginTop: 2 }}
                    />
                    <span style={{ fontSize: 15, color: '#374151' }}>{item}</span>
                  </div>
                ))}
              </Space>
            </AnimatedSection>
          </Col>
        </Row>
      </div>
    </section>
  );
}
