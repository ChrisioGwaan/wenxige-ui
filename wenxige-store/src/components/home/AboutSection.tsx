'use client';

import { Row, Col, Typography, Space } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import AnimatedSection from '@/components/shared/AnimatedSection';
import { useTranslation } from '@/i18n';

const { Title, Paragraph } = Typography;

export default function AboutSection() {
  const { t } = useTranslation();
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
                    {t.about.since}
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
                {t.about.subtitle}
              </div>
              <Title level={2} style={{ marginBottom: 20, color: '#1A1A1A' }}>
                {t.about.title}
              </Title>
              <Paragraph
                style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.8, marginBottom: 24 }}
              >
                {t.about.description1}
              </Paragraph>
              <Paragraph
                style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.8, marginBottom: 32 }}
              >
                {t.about.description2}
              </Paragraph>
              <Space orientation="vertical" size={16}>
                {t.about.highlights.map((item, index) => (
                  <div
                    key={index}
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
