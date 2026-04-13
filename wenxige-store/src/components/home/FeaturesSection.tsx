'use client';

import { Row, Col, Typography, Card } from 'antd';
import {
  SafetyCertificateOutlined,
  CoffeeOutlined,
  ThunderboltOutlined,
  StarOutlined,
  GlobalOutlined,
  BookOutlined,
} from '@ant-design/icons';
import AnimatedSection from '@/components/shared/AnimatedSection';
import { useTranslation } from '@/i18n';

const { Title, Paragraph } = Typography;

const featuresMeta = [
  { icon: <SafetyCertificateOutlined /> },
  { icon: <CoffeeOutlined /> },
  { icon: <ThunderboltOutlined /> },
  { icon: <StarOutlined /> },
  { icon: <GlobalOutlined /> },
  { icon: <BookOutlined /> },
];

export default function FeaturesSection() {
  const { t } = useTranslation();

  const features = featuresMeta.map((meta, i) => ({
    ...meta,
    title: t.features.items[i].title,
    description: t.features.items[i].description,
  }));
  return (
    <section style={{ padding: '100px 48px', background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
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
              {t.features.subtitle}
            </div>
            <Title level={2} style={{ marginBottom: 16, color: '#1A1A1A' }}>
              {t.features.title}
            </Title>
            <Paragraph
              style={{
                fontSize: 16,
                color: '#6B7280',
                maxWidth: 560,
                margin: '0 auto',
              }}
            >
              {t.features.description}
            </Paragraph>
          </div>
        </AnimatedSection>

        <Row gutter={[32, 32]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={8} key={feature.title}>
              <AnimatedSection delay={index * 0.08}>
                <Card
                  hoverable
                  style={{
                    height: '100%',
                    borderRadius: 16,
                    border: '1px solid #f0f0f0',
                    textAlign: 'center',
                    padding: '16px 8px',
                    transition: 'all 0.3s ease',
                  }}
                  styles={{ body: { padding: '32px 24px' } }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 16,
                      background: 'linear-gradient(135deg, #2D5016 0%, #4a7c2e 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      fontSize: 24,
                      color: '#fff',
                    }}
                  >
                    {feature.icon}
                  </div>
                  <Title level={5} style={{ marginBottom: 8 }}>
                    {feature.title}
                  </Title>
                  <Paragraph
                    style={{ color: '#6B7280', margin: 0, fontSize: 14, lineHeight: 1.7 }}
                  >
                    {feature.description}
                  </Paragraph>
                </Card>
              </AnimatedSection>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
