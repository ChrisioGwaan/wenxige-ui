'use client';

import { Row, Col, Typography, Card, Rate, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import AnimatedSection from '@/components/shared/AnimatedSection';
import { useTranslation } from '@/i18n';

const { Title, Paragraph, Text } = Typography;

const testimonialsMeta = [
  { rating: 5, avatar: 'S', color: '#2D5016' },
  { rating: 5, avatar: 'J', color: '#C4A35A' },
  { rating: 5, avatar: 'Y', color: '#6B7280' },
];

export default function TestimonialsSection() {
  const { t } = useTranslation();

  const testimonials = testimonialsMeta.map((meta, i) => ({
    ...meta,
    name: t.testimonials.items[i].name,
    location: t.testimonials.items[i].location,
    text: t.testimonials.items[i].text,
  }));
  return (
    <section style={{ padding: '100px 48px', background: '#FDFBF7' }}>
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
              {t.testimonials.subtitle}
            </div>
            <Title level={2} style={{ marginBottom: 16, color: '#1A1A1A' }}>
              {t.testimonials.title}
            </Title>
            <Paragraph
              style={{ fontSize: 16, color: '#6B7280', maxWidth: 500, margin: '0 auto' }}
            >
              {t.testimonials.description}
            </Paragraph>
          </div>
        </AnimatedSection>

        <Row gutter={[32, 32]}>
          {testimonials.map((item, index) => (
            <Col xs={24} md={8} key={item.name}>
              <AnimatedSection delay={index * 0.12}>
                <Card
                  style={{
                    height: '100%',
                    borderRadius: 16,
                    border: '1px solid #f0f0f0',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  styles={{ body: { padding: 32 } }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: `linear-gradient(90deg, ${item.color}, transparent)`,
                    }}
                  />
                  <Rate disabled defaultValue={item.rating} style={{ fontSize: 14, marginBottom: 20 }} />
                  <Paragraph
                    style={{
                      fontSize: 15,
                      color: '#374151',
                      lineHeight: 1.8,
                      marginBottom: 24,
                      minHeight: 100,
                    }}
                  >
                    &ldquo;{item.text}&rdquo;
                  </Paragraph>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar
                      style={{ background: item.color }}
                      icon={<UserOutlined />}
                      size={40}
                    >
                      {item.avatar}
                    </Avatar>
                    <div>
                      <Text strong style={{ display: 'block' }}>
                        {item.name}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        {item.location}
                      </Text>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
